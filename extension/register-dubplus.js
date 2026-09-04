// this is just a simple way to let us know that the dubplus.js script was
// loaded via an extension rather than via a bookmarklet. This file must be
// registered as a content_script in the manifest.json file. It must come before
// dubplus.js and run at document_start
window.dubplusExtensionLoaded = true;

/* ==========================================================================
 * QueUp realtime tap
 *
 * QueUp's app is bundled with Turbopack. Every chunk registers itself with:
 *
 *   (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
 *     currentScript, moduleId, moduleFactory, moduleId, moduleFactory, ...
 *   ]);
 *
 * ...and the Turbopack runtime later replaces globalThis.TURBOPACK with its
 * own { push } object. Neither the module registry nor any module instance is
 * exposed on window, so the only way in is to grab a module factory's context
 * argument - it carries `i(id)`, Turbopack's "import module by id" - before
 * the runtime calls the factory.
 *
 * So we take over globalThis.TURBOPACK with a getter/setter, wrap every
 * factory that gets pushed (keeping a reference to the first module context we
 * see), and note the id of the module whose source contains RealtimeManager.
 * With both in hand, `ctx.i(realtimeModuleId).realtime` is QueUp's live
 * RealtimeManager singleton.
 *
 * That singleton is a mitt emitter, which means:
 *
 *   realtime.on('realtime:chat-message', fn)
 *   realtime.on('*', (type, data) => ...)   // every event, no scraping
 *
 * Event names are `realtime:` + the payload's `type` (chat-message,
 * room_playlist-update, user-join, new-message, ...), plus connection
 * lifecycle events (connected, disconnected, reconnecting, suspended,
 * rateLimited, spectatorLimitReached, error).
 *
 * This is all best-effort. If QueUp changes bundlers, or the runtime beats us
 * to the global, everything here quietly no-ops and getQueupRealtime() keeps
 * returning null - so callers must always have a fallback.
 * ========================================================================== */
(function () {
  /* A `web-ext run` reload re-injects this script into the tab that's already
   * open, long after Turbopack's runtime has booted and swapped itself into
   * globalThis.TURBOPACK. Running the setup below a second time would redefine
   * that accessor (it's configurable) and hand the page a fresh empty array in
   * place of the live runtime, so chunks loaded from then on - every lazy route
   * - would register with nothing. The tap installed by the first run is still
   * attached to that runtime and has already resolved the singleton, so the
   * only safe thing to do on a re-run is leave it alone. */
  if (window.dubplus && window.dubplus.getQueupRealtime) {
    return;
  }

  // A string from the RealtimeManager module that survives minification. Used
  // to find which module id holds the realtime singleton, since ids change on
  // every QueUp build.
  var REALTIME_MARKER = 'RealtimeManager: real time response';

  var moduleCtx = null; // any module factory context - gives us .i(id)
  var realtimeModuleId = null;
  var realtime = null; // the resolved singleton
  var waiting = []; // callbacks queued until we have the singleton
  var pollTimer = null;
  var pollsLeft = 0;

  function isModuleContext(value) {
    return (
      !!value && typeof value === 'object' && typeof value.i === 'function'
    );
  }

  function wrapFactory(factory) {
    return function (ctx) {
      if (!moduleCtx && isModuleContext(ctx)) {
        moduleCtx = ctx;
      }
      return factory.apply(this, arguments);
    };
  }

  /**
   * A chunk is a flat [script, id, factory, id, factory, ...] array. Rather
   * than trusting those positions we just wrap every function we find and
   * treat the element before it as its module id.
   */
  function scanChunk(chunk) {
    if (!Array.isArray(chunk)) return chunk;
    try {
      for (var i = 0; i < chunk.length; i++) {
        var factory = chunk[i];
        if (typeof factory !== 'function') continue;
        if (
          realtimeModuleId === null &&
          String(factory).indexOf(REALTIME_MARKER) !== -1
        ) {
          realtimeModuleId = chunk[i - 1];
        }
        chunk[i] = wrapFactory(factory);
      }
    } catch {
      // never break the page over this
    }
    return chunk;
  }

  function patchPush(target) {
    if (!target || target.__dubplusPatched || typeof target.push !== 'function')
      return target;
    var originalPush = target.push;
    try {
      Object.defineProperty(target, 'push', {
        configurable: true,
        writable: true,
        value: function () {
          for (var i = 0; i < arguments.length; i++) scanChunk(arguments[i]);
          var result = originalPush.apply(this, arguments);
          scheduleResolve();
          return result;
        },
      });
      Object.defineProperty(target, '__dubplusPatched', { value: true });
    } catch {
      // ignore - we just lose the tap
    }
    return target;
  }

  function resolve() {
    if (realtime) return realtime;
    if (!moduleCtx || realtimeModuleId === null) return null;
    try {
      // Instantiates the module if it hasn't been already. Turbopack caches
      // module instances, so this is the same singleton the app uses. It can
      // throw if the module's own dependencies aren't registered yet, which is
      // why callers retry.
      var exports = moduleCtx.i(realtimeModuleId);
      if (exports && exports.realtime) {
        realtime = exports.realtime;
        if (pollTimer) {
          clearInterval(pollTimer);
          pollTimer = null;
        }
        var pending = waiting;
        waiting = [];
        for (var i = 0; i < pending.length; i++) {
          try {
            pending[i](realtime);
          } catch (err) {
            console.error('Dub+: realtime subscriber threw', err);
          }
        }
      }
    } catch {
      // not ready yet
    }
    return realtime;
  }

  // Chunks arrive over time and the realtime module's dependencies may land
  // after it does, so poll for a while instead of giving up on first failure.
  function scheduleResolve() {
    if (realtime) return;
    pollsLeft = 240; // 240 * 250ms = 60s
    setTimeout(resolve, 0);
    if (pollTimer) return;
    pollTimer = setInterval(function () {
      if (resolve() || --pollsLeft <= 0) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
    }, 250);
  }

  // Seed the global with our own queue so the app's chunks push into an array
  // we already control, then re-patch when the runtime swaps in its own object.
  var store = patchPush([]);
  try {
    Object.defineProperty(globalThis, 'TURBOPACK', {
      configurable: true,
      get: function () {
        return store;
      },
      set: function (value) {
        if (Array.isArray(value)) value.forEach(scanChunk);
        store = patchPush(value);
        scheduleResolve();
      },
    });
  } catch (err) {
    console.error('Dub+: could not install the QueUp realtime tap', err);
  }

  window.dubplus = window.dubplus || {};

  /**
   * @returns {any} QueUp's RealtimeManager singleton, or null if it isn't
   * reachable (yet, or at all).
   */
  window.dubplus.getQueupRealtime = function () {
    return resolve();
  };

  /**
   * @param {(realtime: any) => void} callback called once, as soon as QueUp's
   * RealtimeManager singleton is reachable. Never called if it isn't.
   */
  window.dubplus.onQueupRealtime = function (callback) {
    var found = resolve();
    if (found) {
      callback(found);
      return;
    }
    waiting.push(callback);
    scheduleResolve();
  };

  /**
   * Console helper: logs every realtime event QueUp receives.
   * @returns {(() => void) | null} call it to stop logging.
   */
  window.dubplus.debugQueupRealtime = function () {
    var rt = resolve();
    if (!rt) {
      console.warn(
        'Dub+: RealtimeManager not reachable.',
        'moduleCtx:',
        !!moduleCtx,
        'moduleId:',
        realtimeModuleId,
      );
      return null;
    }
    var listener = function (type, data) {
      console.info('Dub+ realtime:', type, data);
    };
    rt.on('*', listener);
    console.info(
      'Dub+: logging all realtime events. Call the returned fn to stop.',
    );
    return function () {
      rt.off('*', listener);
    };
  };
})();
