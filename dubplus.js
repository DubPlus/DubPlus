var dubplus = (function () {
  'use strict';
  var __defProp = Object.defineProperty;
  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __defNormalProp = (obj, key, value) =>
    key in obj
      ? __defProp(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value,
        })
      : (obj[key] = value);
  var __publicField = (obj, key, value) =>
    __defNormalProp(obj, typeof key !== 'symbol' ? key + '' : key, value);
  var __accessCheck = (obj, member, msg) =>
    member.has(obj) || __typeError('Cannot ' + msg);
  var __privateGet = (obj, member, getter) => (
    __accessCheck(obj, member, 'read from private field'),
    getter ? getter.call(obj) : member.get(obj)
  );
  var __privateAdd = (obj, member, value) =>
    member.has(obj)
      ? __typeError('Cannot add the same private member more than once')
      : member instanceof WeakSet
        ? member.add(obj)
        : member.set(obj, value);
  var __privateSet = (obj, member, value, setter) => (
    __accessCheck(obj, member, 'write to private field'),
    setter ? setter.call(obj, value) : member.set(obj, value),
    value
  );
  var __privateMethod = (obj, member, method) => (
    __accessCheck(obj, member, 'access private method'),
    method
  );
  /*!
     /#######            /##                
    | ##__  ##          | ##          /##   
    | ##  \ ## /##   /##| #######    | ##   
    | ##  | ##| ##  | ##| ##__  ## /########
    | ##  | ##| ##  | ##| ##  \ ##|__  ##__/
    | ##  | ##| ##  | ##| ##  | ##   | ##   
    | #######/|  ######/| #######/   |__/   
    |_______/  \______/ |_______/           
                                            
                                            
    https://github.com/DubPlus/DubPlus

    MIT License 

    Copyright (c) 2024 DubPlus

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

  var _previous,
    _callbacks,
    _pending,
    _deferred,
    _neutered,
    _async_effects,
    _boundary_async_effects,
    _render_effects,
    _effects,
    _block_effects,
    _Batch_instances,
    traverse_effect_tree_fn,
    commit_fn,
    _a;
  const DEV = false;
  var is_array = Array.isArray;
  var index_of = Array.prototype.indexOf;
  var array_from = Array.from;
  var define_property = Object.defineProperty;
  var get_descriptor = Object.getOwnPropertyDescriptor;
  var get_descriptors = Object.getOwnPropertyDescriptors;
  var object_prototype = Object.prototype;
  var array_prototype = Array.prototype;
  var get_prototype_of = Object.getPrototypeOf;
  var is_extensible = Object.isExtensible;
  const noop = () => {};
  function run(fn) {
    return fn();
  }
  function run_all(arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i]();
    }
  }
  function deferred() {
    var resolve;
    var reject;
    var promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  }
  const DERIVED = 1 << 1;
  const EFFECT = 1 << 2;
  const RENDER_EFFECT = 1 << 3;
  const BLOCK_EFFECT = 1 << 4;
  const BRANCH_EFFECT = 1 << 5;
  const ROOT_EFFECT = 1 << 6;
  const BOUNDARY_EFFECT = 1 << 7;
  const UNOWNED = 1 << 8;
  const DISCONNECTED = 1 << 9;
  const CLEAN = 1 << 10;
  const DIRTY = 1 << 11;
  const MAYBE_DIRTY = 1 << 12;
  const INERT = 1 << 13;
  const DESTROYED = 1 << 14;
  const EFFECT_RAN = 1 << 15;
  const EFFECT_TRANSPARENT = 1 << 16;
  const INSPECT_EFFECT = 1 << 17;
  const HEAD_EFFECT = 1 << 18;
  const EFFECT_PRESERVED = 1 << 19;
  const USER_EFFECT = 1 << 20;
  const REACTION_IS_UPDATING = 1 << 21;
  const ASYNC = 1 << 22;
  const ERROR_VALUE = 1 << 23;
  const STATE_SYMBOL = Symbol('$state');
  const LOADING_ATTR_SYMBOL = Symbol('');
  const STALE_REACTION = new (class StaleReactionError extends Error {
    constructor() {
      super(...arguments);
      __publicField(this, 'name', 'StaleReactionError');
      __publicField(
        this,
        'message',
        'The reaction that called `getAbortSignal()` was re-run or destroyed',
      );
    }
  })();
  function await_outside_boundary() {
    {
      throw new Error(`https://svelte.dev/e/await_outside_boundary`);
    }
  }
  function lifecycle_outside_component(name2) {
    {
      throw new Error(`https://svelte.dev/e/lifecycle_outside_component`);
    }
  }
  function async_derived_orphan() {
    {
      throw new Error(`https://svelte.dev/e/async_derived_orphan`);
    }
  }
  function effect_in_teardown(rune) {
    {
      throw new Error(`https://svelte.dev/e/effect_in_teardown`);
    }
  }
  function effect_in_unowned_derived() {
    {
      throw new Error(`https://svelte.dev/e/effect_in_unowned_derived`);
    }
  }
  function effect_orphan(rune) {
    {
      throw new Error(`https://svelte.dev/e/effect_orphan`);
    }
  }
  function effect_update_depth_exceeded() {
    {
      throw new Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
    }
  }
  function state_descriptors_fixed() {
    {
      throw new Error(`https://svelte.dev/e/state_descriptors_fixed`);
    }
  }
  function state_prototype_fixed() {
    {
      throw new Error(`https://svelte.dev/e/state_prototype_fixed`);
    }
  }
  function state_unsafe_mutation() {
    {
      throw new Error(`https://svelte.dev/e/state_unsafe_mutation`);
    }
  }
  const EACH_ITEM_REACTIVE = 1;
  const EACH_INDEX_REACTIVE = 1 << 1;
  const EACH_IS_CONTROLLED = 1 << 2;
  const EACH_IS_ANIMATED = 1 << 3;
  const EACH_ITEM_IMMUTABLE = 1 << 4;
  const TEMPLATE_FRAGMENT = 1;
  const TEMPLATE_USE_IMPORT_NODE = 1 << 1;
  const UNINITIALIZED = Symbol();
  const NAMESPACE_HTML = 'http://www.w3.org/1999/xhtml';
  let hydrating = false;
  function equals(value) {
    return value === this.v;
  }
  function safe_not_equal(a, b) {
    return a != a
      ? b == b
      : a !== b ||
          (a !== null && typeof a === 'object') ||
          typeof a === 'function';
  }
  function safe_equals(value) {
    return !safe_not_equal(value, this.v);
  }
  let legacy_mode_flag = false;
  let tracing_mode_flag = false;
  function enable_legacy_mode_flag() {
    legacy_mode_flag = true;
  }
  let component_context = null;
  function set_component_context(context) {
    component_context = context;
  }
  function push(props, runes = false, fn) {
    component_context = {
      p: component_context,
      c: null,
      e: null,
      s: props,
      x: null,
      l: legacy_mode_flag && !runes ? { s: null, u: null, $: [] } : null,
    };
  }
  function pop(component2) {
    var context =
      /** @type {ComponentContext} */
      component_context;
    var effects = context.e;
    if (effects !== null) {
      context.e = null;
      for (var fn of effects) {
        create_user_effect(fn);
      }
    }
    component_context = context.p;
    return (
      /** @type {T} */
      {}
    );
  }
  function is_runes() {
    return (
      !legacy_mode_flag ||
      (component_context !== null && component_context.l === null)
    );
  }
  const adjustments = /* @__PURE__ */ new WeakMap();
  function handle_error(error) {
    var effect2 = active_effect;
    if (effect2 === null) {
      active_reaction.f |= ERROR_VALUE;
      return error;
    }
    if ((effect2.f & EFFECT_RAN) === 0) {
      if ((effect2.f & BOUNDARY_EFFECT) === 0) {
        if (!effect2.parent && error instanceof Error) {
          apply_adjustments(error);
        }
        throw error;
      }
      effect2.b.error(error);
    } else {
      invoke_error_boundary(error, effect2);
    }
  }
  function invoke_error_boundary(error, effect2) {
    while (effect2 !== null) {
      if ((effect2.f & BOUNDARY_EFFECT) !== 0) {
        try {
          effect2.b.error(error);
          return;
        } catch (e) {
          error = e;
        }
      }
      effect2 = effect2.parent;
    }
    if (error instanceof Error) {
      apply_adjustments(error);
    }
    throw error;
  }
  function apply_adjustments(error) {
    const adjusted = adjustments.get(error);
    if (adjusted) {
      define_property(error, 'message', {
        value: adjusted.message,
      });
      define_property(error, 'stack', {
        value: adjusted.stack,
      });
    }
  }
  let micro_tasks = [];
  function run_micro_tasks() {
    var tasks2 = micro_tasks;
    micro_tasks = [];
    run_all(tasks2);
  }
  function queue_micro_task(fn) {
    if (micro_tasks.length === 0) {
      queueMicrotask(run_micro_tasks);
    }
    micro_tasks.push(fn);
  }
  function get_pending_boundary() {
    var boundary =
      /** @type {Effect} */
      active_effect.b;
    while (boundary !== null && !boundary.has_pending_snippet()) {
      boundary = boundary.parent;
    }
    if (boundary === null) {
      await_outside_boundary();
    }
    return boundary;
  }
  // @__NO_SIDE_EFFECTS__
  function derived(fn) {
    var flags = DERIVED | DIRTY;
    var parent_derived =
      active_reaction !== null && (active_reaction.f & DERIVED) !== 0
        ? /** @type {Derived} */
          active_reaction
        : null;
    if (
      active_effect === null ||
      (parent_derived !== null && (parent_derived.f & UNOWNED) !== 0)
    ) {
      flags |= UNOWNED;
    } else {
      active_effect.f |= EFFECT_PRESERVED;
    }
    const signal = {
      ctx: component_context,
      deps: null,
      effects: null,
      equals,
      f: flags,
      fn,
      reactions: null,
      rv: 0,
      v:
        /** @type {V} */
        UNINITIALIZED,
      wv: 0,
      parent: parent_derived ?? active_effect,
      ac: null,
    };
    return signal;
  }
  // @__NO_SIDE_EFFECTS__
  function async_derived(fn, location) {
    let parent =
      /** @type {Effect | null} */
      active_effect;
    if (parent === null) {
      async_derived_orphan();
    }
    var boundary =
      /** @type {Boundary} */
      parent.b;
    var promise =
      /** @type {Promise<V>} */
      /** @type {unknown} */
      void 0;
    var signal = source(
      /** @type {V} */
      UNINITIALIZED,
    );
    var prev = null;
    var should_suspend = !active_reaction;
    async_effect(() => {
      try {
        var p = fn();
      } catch (error) {
        p = Promise.reject(error);
      }
      var r = () => p;
      promise = (prev == null ? void 0 : prev.then(r, r)) ?? Promise.resolve(p);
      prev = promise;
      var batch =
        /** @type {Batch} */
        current_batch;
      var pending = boundary.pending;
      if (should_suspend) {
        boundary.update_pending_count(1);
        if (!pending) batch.increment();
      }
      const handler = (value, error = void 0) => {
        prev = null;
        if (!pending) batch.activate();
        if (error) {
          if (error !== STALE_REACTION) {
            signal.f |= ERROR_VALUE;
            internal_set(signal, error);
          }
        } else {
          if ((signal.f & ERROR_VALUE) !== 0) {
            signal.f ^= ERROR_VALUE;
          }
          internal_set(signal, value);
        }
        if (should_suspend) {
          boundary.update_pending_count(-1);
          if (!pending) batch.decrement();
        }
        unset_context();
      };
      promise.then(handler, (e) => handler(null, e || 'unknown'));
      if (batch) {
        return () => {
          queueMicrotask(() => batch.neuter());
        };
      }
    });
    return new Promise((fulfil) => {
      function next(p) {
        function go() {
          if (p === promise) {
            fulfil(signal);
          } else {
            next(promise);
          }
        }
        p.then(go, go);
      }
      next(promise);
    });
  }
  // @__NO_SIDE_EFFECTS__
  function user_derived(fn) {
    const d = /* @__PURE__ */ derived(fn);
    push_reaction_value(d);
    return d;
  }
  // @__NO_SIDE_EFFECTS__
  function derived_safe_equal(fn) {
    const signal = /* @__PURE__ */ derived(fn);
    signal.equals = safe_equals;
    return signal;
  }
  function destroy_derived_effects(derived2) {
    var effects = derived2.effects;
    if (effects !== null) {
      derived2.effects = null;
      for (var i = 0; i < effects.length; i += 1) {
        destroy_effect(
          /** @type {Effect} */
          effects[i],
        );
      }
    }
  }
  function get_derived_parent_effect(derived2) {
    var parent = derived2.parent;
    while (parent !== null) {
      if ((parent.f & DERIVED) === 0) {
        return (
          /** @type {Effect} */
          parent
        );
      }
      parent = parent.parent;
    }
    return null;
  }
  function execute_derived(derived2) {
    var value;
    var prev_active_effect = active_effect;
    set_active_effect(get_derived_parent_effect(derived2));
    {
      try {
        destroy_derived_effects(derived2);
        value = update_reaction(derived2);
      } finally {
        set_active_effect(prev_active_effect);
      }
    }
    return value;
  }
  function update_derived(derived2) {
    var value = execute_derived(derived2);
    if (!derived2.equals(value)) {
      derived2.v = value;
      derived2.wv = increment_write_version();
    }
    if (is_destroying_effect) {
      return;
    }
    if (batch_deriveds !== null) {
      batch_deriveds.set(derived2, derived2.v);
    } else {
      var status =
        (skip_reaction || (derived2.f & UNOWNED) !== 0) &&
        derived2.deps !== null
          ? MAYBE_DIRTY
          : CLEAN;
      set_signal_status(derived2, status);
    }
  }
  function flatten(sync, async, fn) {
    const d = is_runes() ? derived : derived_safe_equal;
    if (async.length === 0) {
      fn(sync.map(d));
      return;
    }
    var batch = current_batch;
    var parent =
      /** @type {Effect} */
      active_effect;
    var restore = capture();
    var boundary = get_pending_boundary();
    Promise.all(
      async.map((expression) => /* @__PURE__ */ async_derived(expression)),
    )
      .then((result) => {
        batch == null ? void 0 : batch.activate();
        restore();
        try {
          fn([...sync.map(d), ...result]);
        } catch (error) {
          if ((parent.f & DESTROYED) === 0) {
            invoke_error_boundary(error, parent);
          }
        }
        batch == null ? void 0 : batch.deactivate();
        unset_context();
      })
      .catch((error) => {
        boundary.error(error);
      });
  }
  function capture() {
    var previous_effect = active_effect;
    var previous_reaction = active_reaction;
    var previous_component_context = component_context;
    return function restore() {
      set_active_effect(previous_effect);
      set_active_reaction(previous_reaction);
      set_component_context(previous_component_context);
    };
  }
  function unset_context() {
    set_active_effect(null);
    set_active_reaction(null);
    set_component_context(null);
  }
  const batches = /* @__PURE__ */ new Set();
  let current_batch = null;
  let batch_deriveds = null;
  let effect_pending_updates = /* @__PURE__ */ new Set();
  let tasks = [];
  function dequeue() {
    const task =
      /** @type {() => void} */
      tasks.shift();
    if (tasks.length > 0) {
      queueMicrotask(dequeue);
    }
    task();
  }
  let queued_root_effects = [];
  let last_scheduled_effect = null;
  let is_flushing = false;
  const _Batch = class _Batch {
    constructor() {
      __privateAdd(this, _Batch_instances);
      /**
       * The current values of any sources that are updated in this batch
       * They keys of this map are identical to `this.#previous`
       * @type {Map<Source, any>}
       */
      __publicField(this, 'current', /* @__PURE__ */ new Map());
      /**
       * The values of any sources that are updated in this batch _before_ those updates took place.
       * They keys of this map are identical to `this.#current`
       * @type {Map<Source, any>}
       */
      __privateAdd(this, _previous, /* @__PURE__ */ new Map());
      /**
       * When the batch is committed (and the DOM is updated), we need to remove old branches
       * and append new ones by calling the functions added inside (if/each/key/etc) blocks
       * @type {Set<() => void>}
       */
      __privateAdd(this, _callbacks, /* @__PURE__ */ new Set());
      /**
       * The number of async effects that are currently in flight
       */
      __privateAdd(this, _pending, 0);
      /**
       * A deferred that resolves when the batch is committed, used with `settled()`
       * TODO replace with Promise.withResolvers once supported widely enough
       * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
       */
      __privateAdd(this, _deferred, null);
      /**
       * True if an async effect inside this batch resolved and
       * its parent branch was already deleted
       */
      __privateAdd(this, _neutered, false);
      /**
       * Async effects (created inside `async_derived`) encountered during processing.
       * These run after the rest of the batch has updated, since they should
       * always have the latest values
       * @type {Effect[]}
       */
      __privateAdd(this, _async_effects, []);
      /**
       * The same as `#async_effects`, but for effects inside a newly-created
       * `<svelte:boundary>` — these do not prevent the batch from committing
       * @type {Effect[]}
       */
      __privateAdd(this, _boundary_async_effects, []);
      /**
       * Template effects and `$effect.pre` effects, which run when
       * a batch is committed
       * @type {Effect[]}
       */
      __privateAdd(this, _render_effects, []);
      /**
       * The same as `#render_effects`, but for `$effect` (which runs after)
       * @type {Effect[]}
       */
      __privateAdd(this, _effects, []);
      /**
       * Block effects, which may need to re-run on subsequent flushes
       * in order to update internal sources (e.g. each block items)
       * @type {Effect[]}
       */
      __privateAdd(this, _block_effects, []);
      /**
       * A set of branches that still exist, but will be destroyed when this batch
       * is committed — we skip over these during `process`
       * @type {Set<Effect>}
       */
      __publicField(this, 'skipped_effects', /* @__PURE__ */ new Set());
    }
    /**
     *
     * @param {Effect[]} root_effects
     */
    process(root_effects) {
      var _a2;
      queued_root_effects = [];
      var current_values = null;
      if (batches.size > 1) {
        current_values = /* @__PURE__ */ new Map();
        batch_deriveds = /* @__PURE__ */ new Map();
        for (const [source2, current] of this.current) {
          current_values.set(source2, { v: source2.v, wv: source2.wv });
          source2.v = current;
        }
        for (const batch of batches) {
          if (batch === this) continue;
          for (const [source2, previous] of __privateGet(batch, _previous)) {
            if (!current_values.has(source2)) {
              current_values.set(source2, { v: source2.v, wv: source2.wv });
              source2.v = previous;
            }
          }
        }
      }
      for (const root2 of root_effects) {
        __privateMethod(this, _Batch_instances, traverse_effect_tree_fn).call(
          this,
          root2,
        );
      }
      if (
        __privateGet(this, _async_effects).length === 0 &&
        __privateGet(this, _pending) === 0
      ) {
        __privateMethod(this, _Batch_instances, commit_fn).call(this);
        var render_effects = __privateGet(this, _render_effects);
        var effects = __privateGet(this, _effects);
        __privateSet(this, _render_effects, []);
        __privateSet(this, _effects, []);
        __privateSet(this, _block_effects, []);
        current_batch = null;
        flush_queued_effects(render_effects);
        flush_queued_effects(effects);
        if (current_batch === null) {
          current_batch = this;
        } else {
          batches.delete(this);
        }
        (_a2 = __privateGet(this, _deferred)) == null ? void 0 : _a2.resolve();
      } else {
        for (const e of __privateGet(this, _render_effects))
          set_signal_status(e, CLEAN);
        for (const e of __privateGet(this, _effects))
          set_signal_status(e, CLEAN);
        for (const e of __privateGet(this, _block_effects))
          set_signal_status(e, CLEAN);
      }
      if (current_values) {
        for (const [source2, { v, wv }] of current_values) {
          if (source2.wv <= wv) {
            source2.v = v;
          }
        }
        batch_deriveds = null;
      }
      for (const effect2 of __privateGet(this, _async_effects)) {
        update_effect(effect2);
      }
      for (const effect2 of __privateGet(this, _boundary_async_effects)) {
        update_effect(effect2);
      }
      __privateSet(this, _async_effects, []);
      __privateSet(this, _boundary_async_effects, []);
    }
    /**
     * Associate a change to a given source with the current
     * batch, noting its previous and current values
     * @param {Source} source
     * @param {any} value
     */
    capture(source2, value) {
      if (!__privateGet(this, _previous).has(source2)) {
        __privateGet(this, _previous).set(source2, value);
      }
      this.current.set(source2, source2.v);
    }
    activate() {
      current_batch = this;
    }
    deactivate() {
      current_batch = null;
      for (const update of effect_pending_updates) {
        effect_pending_updates.delete(update);
        update();
        if (current_batch !== null) {
          break;
        }
      }
    }
    neuter() {
      __privateSet(this, _neutered, true);
    }
    flush() {
      if (queued_root_effects.length > 0) {
        flush_effects();
      } else {
        __privateMethod(this, _Batch_instances, commit_fn).call(this);
      }
      if (current_batch !== this) {
        return;
      }
      if (__privateGet(this, _pending) === 0) {
        batches.delete(this);
      }
      this.deactivate();
    }
    increment() {
      __privateSet(this, _pending, __privateGet(this, _pending) + 1);
    }
    decrement() {
      __privateSet(this, _pending, __privateGet(this, _pending) - 1);
      if (__privateGet(this, _pending) === 0) {
        for (const source2 of this.current.keys()) {
          mark_reactions(source2, DIRTY, false);
        }
        __privateSet(this, _render_effects, []);
        __privateSet(this, _effects, []);
        this.flush();
      } else {
        this.deactivate();
      }
    }
    /** @param {() => void} fn */
    add_callback(fn) {
      __privateGet(this, _callbacks).add(fn);
    }
    settled() {
      return (
        __privateGet(this, _deferred) ??
        __privateSet(this, _deferred, deferred())
      ).promise;
    }
    static ensure() {
      if (current_batch === null) {
        const batch = (current_batch = new _Batch());
        batches.add(current_batch);
        {
          _Batch.enqueue(() => {
            if (current_batch !== batch) {
              return;
            }
            batch.flush();
          });
        }
      }
      return current_batch;
    }
    /** @param {() => void} task */
    static enqueue(task) {
      if (tasks.length === 0) {
        queueMicrotask(dequeue);
      }
      tasks.unshift(task);
    }
  };
  _previous = new WeakMap();
  _callbacks = new WeakMap();
  _pending = new WeakMap();
  _deferred = new WeakMap();
  _neutered = new WeakMap();
  _async_effects = new WeakMap();
  _boundary_async_effects = new WeakMap();
  _render_effects = new WeakMap();
  _effects = new WeakMap();
  _block_effects = new WeakMap();
  _Batch_instances = new WeakSet();
  /**
   * Traverse the effect tree, executing effects or stashing
   * them for later execution as appropriate
   * @param {Effect} root
   */
  traverse_effect_tree_fn = function (root2) {
    var _a2;
    root2.f ^= CLEAN;
    var effect2 = root2.first;
    while (effect2 !== null) {
      var flags = effect2.f;
      var is_branch = (flags & (BRANCH_EFFECT | ROOT_EFFECT)) !== 0;
      var is_skippable_branch = is_branch && (flags & CLEAN) !== 0;
      var skip =
        is_skippable_branch ||
        (flags & INERT) !== 0 ||
        this.skipped_effects.has(effect2);
      if (!skip && effect2.fn !== null) {
        if (is_branch) {
          effect2.f ^= CLEAN;
        } else if ((flags & EFFECT) !== 0) {
          __privateGet(this, _effects).push(effect2);
        } else if (is_dirty(effect2)) {
          if ((flags & ASYNC) !== 0) {
            var effects = ((_a2 = effect2.b) == null ? void 0 : _a2.pending)
              ? __privateGet(this, _boundary_async_effects)
              : __privateGet(this, _async_effects);
            effects.push(effect2);
          } else {
            if ((effect2.f & BLOCK_EFFECT) !== 0)
              __privateGet(this, _block_effects).push(effect2);
            update_effect(effect2);
          }
        }
        var child2 = effect2.first;
        if (child2 !== null) {
          effect2 = child2;
          continue;
        }
      }
      var parent = effect2.parent;
      effect2 = effect2.next;
      while (effect2 === null && parent !== null) {
        effect2 = parent.next;
        parent = parent.parent;
      }
    }
  };
  /**
   * Append and remove branches to/from the DOM
   */
  commit_fn = function () {
    if (!__privateGet(this, _neutered)) {
      for (const fn of __privateGet(this, _callbacks)) {
        fn();
      }
    }
    __privateGet(this, _callbacks).clear();
  };
  let Batch = _Batch;
  function flush_effects() {
    var was_updating_effect = is_updating_effect;
    is_flushing = true;
    try {
      var flush_count = 0;
      set_is_updating_effect(true);
      while (queued_root_effects.length > 0) {
        var batch = Batch.ensure();
        if (flush_count++ > 1e3) {
          var updates, entry;
          if (DEV);
          infinite_loop_guard();
        }
        batch.process(queued_root_effects);
        old_values.clear();
      }
    } finally {
      is_flushing = false;
      set_is_updating_effect(was_updating_effect);
      last_scheduled_effect = null;
    }
  }
  function infinite_loop_guard() {
    try {
      effect_update_depth_exceeded();
    } catch (error) {
      invoke_error_boundary(error, last_scheduled_effect);
    }
  }
  function flush_queued_effects(effects) {
    var length = effects.length;
    if (length === 0) return;
    var i = 0;
    while (i < length) {
      var effect2 = effects[i++];
      if ((effect2.f & (DESTROYED | INERT)) === 0 && is_dirty(effect2)) {
        var n = current_batch ? current_batch.current.size : 0;
        update_effect(effect2);
        if (
          effect2.deps === null &&
          effect2.first === null &&
          effect2.nodes_start === null
        ) {
          if (effect2.teardown === null && effect2.ac === null) {
            unlink_effect(effect2);
          } else {
            effect2.fn = null;
          }
        }
        if (
          current_batch !== null &&
          current_batch.current.size > n &&
          (effect2.f & USER_EFFECT) !== 0
        ) {
          break;
        }
      }
    }
    while (i < length) {
      schedule_effect(effects[i++]);
    }
  }
  function schedule_effect(signal) {
    var effect2 = (last_scheduled_effect = signal);
    while (effect2.parent !== null) {
      effect2 = effect2.parent;
      var flags = effect2.f;
      if (
        is_flushing &&
        effect2 === active_effect &&
        (flags & BLOCK_EFFECT) !== 0
      ) {
        return;
      }
      if ((flags & (ROOT_EFFECT | BRANCH_EFFECT)) !== 0) {
        if ((flags & CLEAN) === 0) return;
        effect2.f ^= CLEAN;
      }
    }
    queued_root_effects.push(effect2);
  }
  const old_values = /* @__PURE__ */ new Map();
  function source(v, stack) {
    var signal = {
      f: 0,
      // TODO ideally we could skip this altogether, but it causes type errors
      v,
      reactions: null,
      equals,
      rv: 0,
      wv: 0,
    };
    return signal;
  }
  // @__NO_SIDE_EFFECTS__
  function state(v, stack) {
    const s = source(v);
    push_reaction_value(s);
    return s;
  }
  // @__NO_SIDE_EFFECTS__
  function mutable_source(initial_value, immutable = false, trackable = true) {
    var _a2;
    const s = source(initial_value);
    if (!immutable) {
      s.equals = safe_equals;
    }
    if (
      legacy_mode_flag &&
      trackable &&
      component_context !== null &&
      component_context.l !== null
    ) {
      ((_a2 = component_context.l).s ?? (_a2.s = [])).push(s);
    }
    return s;
  }
  function set(source2, value, should_proxy = false) {
    if (
      active_reaction !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
      // to ensure we error if state is set inside an inspect effect
      (!untracking || (active_reaction.f & INSPECT_EFFECT) !== 0) &&
      is_runes() &&
      (active_reaction.f &
        (DERIVED | BLOCK_EFFECT | ASYNC | INSPECT_EFFECT)) !==
        0 &&
      !(current_sources == null ? void 0 : current_sources.includes(source2))
    ) {
      state_unsafe_mutation();
    }
    let new_value = should_proxy ? proxy(value) : value;
    return internal_set(source2, new_value);
  }
  function internal_set(source2, value) {
    if (!source2.equals(value)) {
      var old_value = source2.v;
      if (is_destroying_effect) {
        old_values.set(source2, value);
      } else {
        old_values.set(source2, old_value);
      }
      source2.v = value;
      var batch = Batch.ensure();
      batch.capture(source2, old_value);
      if ((source2.f & DERIVED) !== 0) {
        if ((source2.f & DIRTY) !== 0) {
          execute_derived(
            /** @type {Derived} */
            source2,
          );
        }
        set_signal_status(
          source2,
          (source2.f & UNOWNED) === 0 ? CLEAN : MAYBE_DIRTY,
        );
      }
      source2.wv = increment_write_version();
      mark_reactions(source2, DIRTY);
      if (
        is_runes() &&
        active_effect !== null &&
        (active_effect.f & CLEAN) !== 0 &&
        (active_effect.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0
      ) {
        if (untracked_writes === null) {
          set_untracked_writes([source2]);
        } else {
          untracked_writes.push(source2);
        }
      }
    }
    return value;
  }
  function increment$1(source2) {
    set(source2, source2.v + 1);
  }
  function mark_reactions(signal, status, schedule_async = true) {
    var reactions = signal.reactions;
    if (reactions === null) return;
    var runes = is_runes();
    var length = reactions.length;
    for (var i = 0; i < length; i++) {
      var reaction = reactions[i];
      var flags = reaction.f;
      if (!runes && reaction === active_effect) continue;
      var should_schedule =
        (flags & DIRTY) === 0 && (schedule_async || (flags & ASYNC) === 0);
      if (should_schedule) {
        set_signal_status(reaction, status);
      }
      if ((flags & DERIVED) !== 0) {
        mark_reactions(
          /** @type {Derived} */
          reaction,
          MAYBE_DIRTY,
        );
      } else if (should_schedule) {
        schedule_effect(
          /** @type {Effect} */
          reaction,
        );
      }
    }
  }
  function proxy(value) {
    if (typeof value !== 'object' || value === null || STATE_SYMBOL in value) {
      return value;
    }
    const prototype = get_prototype_of(value);
    if (prototype !== object_prototype && prototype !== array_prototype) {
      return value;
    }
    var sources = /* @__PURE__ */ new Map();
    var is_proxied_array = is_array(value);
    var version2 = /* @__PURE__ */ state(0);
    var parent_version = update_version;
    var with_parent = (fn) => {
      if (update_version === parent_version) {
        return fn();
      }
      var reaction = active_reaction;
      var version3 = update_version;
      set_active_reaction(null);
      set_update_version(parent_version);
      var result = fn();
      set_active_reaction(reaction);
      set_update_version(version3);
      return result;
    };
    if (is_proxied_array) {
      sources.set(
        'length',
        /* @__PURE__ */ state(
          /** @type {any[]} */
          value.length,
        ),
      );
    }
    return new Proxy(
      /** @type {any} */
      value,
      {
        defineProperty(_, prop, descriptor) {
          if (
            !('value' in descriptor) ||
            descriptor.configurable === false ||
            descriptor.enumerable === false ||
            descriptor.writable === false
          ) {
            state_descriptors_fixed();
          }
          var s = sources.get(prop);
          if (s === void 0) {
            s = with_parent(() => {
              var s2 = /* @__PURE__ */ state(descriptor.value);
              sources.set(prop, s2);
              return s2;
            });
          } else {
            set(s, descriptor.value, true);
          }
          return true;
        },
        deleteProperty(target, prop) {
          var s = sources.get(prop);
          if (s === void 0) {
            if (prop in target) {
              const s2 = with_parent(() =>
                /* @__PURE__ */ state(UNINITIALIZED),
              );
              sources.set(prop, s2);
              increment$1(version2);
            }
          } else {
            set(s, UNINITIALIZED);
            increment$1(version2);
          }
          return true;
        },
        get(target, prop, receiver) {
          var _a2;
          if (prop === STATE_SYMBOL) {
            return value;
          }
          var s = sources.get(prop);
          var exists = prop in target;
          if (
            s === void 0 &&
            (!exists ||
              ((_a2 = get_descriptor(target, prop)) == null
                ? void 0
                : _a2.writable))
          ) {
            s = with_parent(() => {
              var p = proxy(exists ? target[prop] : UNINITIALIZED);
              var s2 = /* @__PURE__ */ state(p);
              return s2;
            });
            sources.set(prop, s);
          }
          if (s !== void 0) {
            var v = get(s);
            return v === UNINITIALIZED ? void 0 : v;
          }
          return Reflect.get(target, prop, receiver);
        },
        getOwnPropertyDescriptor(target, prop) {
          var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
          if (descriptor && 'value' in descriptor) {
            var s = sources.get(prop);
            if (s) descriptor.value = get(s);
          } else if (descriptor === void 0) {
            var source2 = sources.get(prop);
            var value2 = source2 == null ? void 0 : source2.v;
            if (source2 !== void 0 && value2 !== UNINITIALIZED) {
              return {
                enumerable: true,
                configurable: true,
                value: value2,
                writable: true,
              };
            }
          }
          return descriptor;
        },
        has(target, prop) {
          var _a2;
          if (prop === STATE_SYMBOL) {
            return true;
          }
          var s = sources.get(prop);
          var has =
            (s !== void 0 && s.v !== UNINITIALIZED) ||
            Reflect.has(target, prop);
          if (
            s !== void 0 ||
            (active_effect !== null &&
              (!has ||
                ((_a2 = get_descriptor(target, prop)) == null
                  ? void 0
                  : _a2.writable)))
          ) {
            if (s === void 0) {
              s = with_parent(() => {
                var p = has ? proxy(target[prop]) : UNINITIALIZED;
                var s2 = /* @__PURE__ */ state(p);
                return s2;
              });
              sources.set(prop, s);
            }
            var value2 = get(s);
            if (value2 === UNINITIALIZED) {
              return false;
            }
          }
          return has;
        },
        set(target, prop, value2, receiver) {
          var _a2;
          var s = sources.get(prop);
          var has = prop in target;
          if (is_proxied_array && prop === 'length') {
            for (
              var i = value2;
              i < /** @type {Source<number>} */ s.v;
              i += 1
            ) {
              var other_s = sources.get(i + '');
              if (other_s !== void 0) {
                set(other_s, UNINITIALIZED);
              } else if (i in target) {
                other_s = with_parent(() =>
                  /* @__PURE__ */ state(UNINITIALIZED),
                );
                sources.set(i + '', other_s);
              }
            }
          }
          if (s === void 0) {
            if (
              !has ||
              ((_a2 = get_descriptor(target, prop)) == null
                ? void 0
                : _a2.writable)
            ) {
              s = with_parent(() => /* @__PURE__ */ state(void 0));
              set(s, proxy(value2));
              sources.set(prop, s);
            }
          } else {
            has = s.v !== UNINITIALIZED;
            var p = with_parent(() => proxy(value2));
            set(s, p);
          }
          var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
          if (descriptor == null ? void 0 : descriptor.set) {
            descriptor.set.call(receiver, value2);
          }
          if (!has) {
            if (is_proxied_array && typeof prop === 'string') {
              var ls =
                /** @type {Source<number>} */
                sources.get('length');
              var n = Number(prop);
              if (Number.isInteger(n) && n >= ls.v) {
                set(ls, n + 1);
              }
            }
            increment$1(version2);
          }
          return true;
        },
        ownKeys(target) {
          get(version2);
          var own_keys = Reflect.ownKeys(target).filter((key2) => {
            var source3 = sources.get(key2);
            return source3 === void 0 || source3.v !== UNINITIALIZED;
          });
          for (var [key, source2] of sources) {
            if (source2.v !== UNINITIALIZED && !(key in target)) {
              own_keys.push(key);
            }
          }
          return own_keys;
        },
        setPrototypeOf() {
          state_prototype_fixed();
        },
      },
    );
  }
  var $window;
  var is_firefox;
  var first_child_getter;
  var next_sibling_getter;
  function init_operations() {
    if ($window !== void 0) {
      return;
    }
    $window = window;
    is_firefox = /Firefox/.test(navigator.userAgent);
    var element_prototype = Element.prototype;
    var node_prototype = Node.prototype;
    var text_prototype = Text.prototype;
    first_child_getter = get_descriptor(node_prototype, 'firstChild').get;
    next_sibling_getter = get_descriptor(node_prototype, 'nextSibling').get;
    if (is_extensible(element_prototype)) {
      element_prototype.__click = void 0;
      element_prototype.__className = void 0;
      element_prototype.__attributes = null;
      element_prototype.__style = void 0;
      element_prototype.__e = void 0;
    }
    if (is_extensible(text_prototype)) {
      text_prototype.__t = void 0;
    }
  }
  function create_text(value = '') {
    return document.createTextNode(value);
  }
  // @__NO_SIDE_EFFECTS__
  function get_first_child(node) {
    return first_child_getter.call(node);
  }
  // @__NO_SIDE_EFFECTS__
  function get_next_sibling(node) {
    return next_sibling_getter.call(node);
  }
  function child(node, is_text) {
    {
      return /* @__PURE__ */ get_first_child(node);
    }
  }
  function first_child(fragment, is_text) {
    {
      var first =
        /** @type {DocumentFragment} */
        /* @__PURE__ */ get_first_child(
          /** @type {Node} */
          fragment,
        );
      if (first instanceof Comment && first.data === '')
        return /* @__PURE__ */ get_next_sibling(first);
      return first;
    }
  }
  function sibling(node, count = 1, is_text = false) {
    let next_sibling = node;
    while (count--) {
      next_sibling =
        /** @type {TemplateNode} */
        /* @__PURE__ */ get_next_sibling(next_sibling);
    }
    {
      return next_sibling;
    }
  }
  function clear_text_content(node) {
    node.textContent = '';
  }
  function should_defer_append() {
    return false;
  }
  function validate_effect(rune) {
    if (active_effect === null && active_reaction === null) {
      effect_orphan();
    }
    if (
      active_reaction !== null &&
      (active_reaction.f & UNOWNED) !== 0 &&
      active_effect === null
    ) {
      effect_in_unowned_derived();
    }
    if (is_destroying_effect) {
      effect_in_teardown();
    }
  }
  function push_effect(effect2, parent_effect) {
    var parent_last = parent_effect.last;
    if (parent_last === null) {
      parent_effect.last = parent_effect.first = effect2;
    } else {
      parent_last.next = effect2;
      effect2.prev = parent_last;
      parent_effect.last = effect2;
    }
  }
  function create_effect(type, fn, sync, push2 = true) {
    var parent = active_effect;
    if (parent !== null && (parent.f & INERT) !== 0) {
      type |= INERT;
    }
    var effect2 = {
      ctx: component_context,
      deps: null,
      nodes_start: null,
      nodes_end: null,
      f: type | DIRTY,
      first: null,
      fn,
      last: null,
      next: null,
      parent,
      b: parent && parent.b,
      prev: null,
      teardown: null,
      transitions: null,
      wv: 0,
      ac: null,
    };
    if (sync) {
      try {
        update_effect(effect2);
        effect2.f |= EFFECT_RAN;
      } catch (e) {
        destroy_effect(effect2);
        throw e;
      }
    } else if (fn !== null) {
      schedule_effect(effect2);
    }
    var inert =
      sync &&
      effect2.deps === null &&
      effect2.first === null &&
      effect2.nodes_start === null &&
      effect2.teardown === null &&
      (effect2.f & EFFECT_PRESERVED) === 0;
    if (!inert && push2) {
      if (parent !== null) {
        push_effect(effect2, parent);
      }
      if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0) {
        var derived2 =
          /** @type {Derived} */
          active_reaction;
        (derived2.effects ?? (derived2.effects = [])).push(effect2);
      }
    }
    return effect2;
  }
  function teardown(fn) {
    const effect2 = create_effect(RENDER_EFFECT, null, false);
    set_signal_status(effect2, CLEAN);
    effect2.teardown = fn;
    return effect2;
  }
  function user_effect(fn) {
    validate_effect();
    var flags =
      /** @type {Effect} */
      active_effect.f;
    var defer =
      !active_reaction &&
      (flags & BRANCH_EFFECT) !== 0 &&
      (flags & EFFECT_RAN) === 0;
    if (defer) {
      var context =
        /** @type {ComponentContext} */
        component_context;
      (context.e ?? (context.e = [])).push(fn);
    } else {
      return create_user_effect(fn);
    }
  }
  function create_user_effect(fn) {
    return create_effect(EFFECT | USER_EFFECT, fn, false);
  }
  function user_pre_effect(fn) {
    validate_effect();
    return create_effect(RENDER_EFFECT | USER_EFFECT, fn, true);
  }
  function component_root(fn) {
    Batch.ensure();
    const effect2 = create_effect(ROOT_EFFECT, fn, true);
    return (options = {}) => {
      return new Promise((fulfil) => {
        if (options.outro) {
          pause_effect(effect2, () => {
            destroy_effect(effect2);
            fulfil(void 0);
          });
        } else {
          destroy_effect(effect2);
          fulfil(void 0);
        }
      });
    };
  }
  function effect(fn) {
    return create_effect(EFFECT, fn, false);
  }
  function async_effect(fn) {
    return create_effect(ASYNC | EFFECT_PRESERVED, fn, true);
  }
  function render_effect(fn, flags = 0) {
    return create_effect(RENDER_EFFECT | flags, fn, true);
  }
  function template_effect(fn, sync = [], async = []) {
    flatten(sync, async, (values) => {
      create_effect(RENDER_EFFECT, () => fn(...values.map(get)), true);
    });
  }
  function block(fn, flags = 0) {
    var effect2 = create_effect(BLOCK_EFFECT | flags, fn, true);
    return effect2;
  }
  function branch(fn, push2 = true) {
    return create_effect(BRANCH_EFFECT, fn, true, push2);
  }
  function execute_effect_teardown(effect2) {
    var teardown2 = effect2.teardown;
    if (teardown2 !== null) {
      const previously_destroying_effect = is_destroying_effect;
      const previous_reaction = active_reaction;
      set_is_destroying_effect(true);
      set_active_reaction(null);
      try {
        teardown2.call(null);
      } finally {
        set_is_destroying_effect(previously_destroying_effect);
        set_active_reaction(previous_reaction);
      }
    }
  }
  function destroy_effect_children(signal, remove_dom = false) {
    var _a2;
    var effect2 = signal.first;
    signal.first = signal.last = null;
    while (effect2 !== null) {
      (_a2 = effect2.ac) == null ? void 0 : _a2.abort(STALE_REACTION);
      var next = effect2.next;
      if ((effect2.f & ROOT_EFFECT) !== 0) {
        effect2.parent = null;
      } else {
        destroy_effect(effect2, remove_dom);
      }
      effect2 = next;
    }
  }
  function destroy_block_effect_children(signal) {
    var effect2 = signal.first;
    while (effect2 !== null) {
      var next = effect2.next;
      if ((effect2.f & BRANCH_EFFECT) === 0) {
        destroy_effect(effect2);
      }
      effect2 = next;
    }
  }
  function destroy_effect(effect2, remove_dom = true) {
    var removed = false;
    if (
      (remove_dom || (effect2.f & HEAD_EFFECT) !== 0) &&
      effect2.nodes_start !== null &&
      effect2.nodes_end !== null
    ) {
      remove_effect_dom(
        effect2.nodes_start,
        /** @type {TemplateNode} */
        effect2.nodes_end,
      );
      removed = true;
    }
    destroy_effect_children(effect2, remove_dom && !removed);
    remove_reactions(effect2, 0);
    set_signal_status(effect2, DESTROYED);
    var transitions = effect2.transitions;
    if (transitions !== null) {
      for (const transition of transitions) {
        transition.stop();
      }
    }
    execute_effect_teardown(effect2);
    var parent = effect2.parent;
    if (parent !== null && parent.first !== null) {
      unlink_effect(effect2);
    }
    effect2.next =
      effect2.prev =
      effect2.teardown =
      effect2.ctx =
      effect2.deps =
      effect2.fn =
      effect2.nodes_start =
      effect2.nodes_end =
      effect2.ac =
        null;
  }
  function remove_effect_dom(node, end) {
    while (node !== null) {
      var next =
        node === end
          ? null
          : /** @type {TemplateNode} */
            /* @__PURE__ */ get_next_sibling(node);
      node.remove();
      node = next;
    }
  }
  function unlink_effect(effect2) {
    var parent = effect2.parent;
    var prev = effect2.prev;
    var next = effect2.next;
    if (prev !== null) prev.next = next;
    if (next !== null) next.prev = prev;
    if (parent !== null) {
      if (parent.first === effect2) parent.first = next;
      if (parent.last === effect2) parent.last = prev;
    }
  }
  function pause_effect(effect2, callback) {
    var transitions = [];
    pause_children(effect2, transitions, true);
    run_out_transitions(transitions, () => {
      destroy_effect(effect2);
      if (callback) callback();
    });
  }
  function run_out_transitions(transitions, fn) {
    var remaining = transitions.length;
    if (remaining > 0) {
      var check = () => --remaining || fn();
      for (var transition of transitions) {
        transition.out(check);
      }
    } else {
      fn();
    }
  }
  function pause_children(effect2, transitions, local) {
    if ((effect2.f & INERT) !== 0) return;
    effect2.f ^= INERT;
    if (effect2.transitions !== null) {
      for (const transition of effect2.transitions) {
        if (transition.is_global || local) {
          transitions.push(transition);
        }
      }
    }
    var child2 = effect2.first;
    while (child2 !== null) {
      var sibling2 = child2.next;
      var transparent =
        (child2.f & EFFECT_TRANSPARENT) !== 0 ||
        (child2.f & BRANCH_EFFECT) !== 0;
      pause_children(child2, transitions, transparent ? local : false);
      child2 = sibling2;
    }
  }
  function resume_effect(effect2) {
    resume_children(effect2, true);
  }
  function resume_children(effect2, local) {
    if ((effect2.f & INERT) === 0) return;
    effect2.f ^= INERT;
    if ((effect2.f & CLEAN) === 0) {
      set_signal_status(effect2, DIRTY);
      schedule_effect(effect2);
    }
    var child2 = effect2.first;
    while (child2 !== null) {
      var sibling2 = child2.next;
      var transparent =
        (child2.f & EFFECT_TRANSPARENT) !== 0 ||
        (child2.f & BRANCH_EFFECT) !== 0;
      resume_children(child2, transparent ? local : false);
      child2 = sibling2;
    }
    if (effect2.transitions !== null) {
      for (const transition of effect2.transitions) {
        if (transition.is_global || local) {
          transition.in();
        }
      }
    }
  }
  let is_updating_effect = false;
  function set_is_updating_effect(value) {
    is_updating_effect = value;
  }
  let is_destroying_effect = false;
  function set_is_destroying_effect(value) {
    is_destroying_effect = value;
  }
  let active_reaction = null;
  let untracking = false;
  function set_active_reaction(reaction) {
    active_reaction = reaction;
  }
  let active_effect = null;
  function set_active_effect(effect2) {
    active_effect = effect2;
  }
  let current_sources = null;
  function push_reaction_value(value) {
    if (active_reaction !== null && true) {
      if (current_sources === null) {
        current_sources = [value];
      } else {
        current_sources.push(value);
      }
    }
  }
  let new_deps = null;
  let skipped_deps = 0;
  let untracked_writes = null;
  function set_untracked_writes(value) {
    untracked_writes = value;
  }
  let write_version = 1;
  let read_version = 0;
  let update_version = read_version;
  function set_update_version(value) {
    update_version = value;
  }
  let skip_reaction = false;
  function increment_write_version() {
    return ++write_version;
  }
  function is_dirty(reaction) {
    var _a2;
    var flags = reaction.f;
    if ((flags & DIRTY) !== 0) {
      return true;
    }
    if ((flags & MAYBE_DIRTY) !== 0) {
      var dependencies = reaction.deps;
      var is_unowned = (flags & UNOWNED) !== 0;
      if (dependencies !== null) {
        var i;
        var dependency;
        var is_disconnected = (flags & DISCONNECTED) !== 0;
        var is_unowned_connected =
          is_unowned && active_effect !== null && !skip_reaction;
        var length = dependencies.length;
        if (
          (is_disconnected || is_unowned_connected) &&
          (active_effect === null || (active_effect.f & DESTROYED) === 0)
        ) {
          var derived2 =
            /** @type {Derived} */
            reaction;
          var parent = derived2.parent;
          for (i = 0; i < length; i++) {
            dependency = dependencies[i];
            if (
              is_disconnected ||
              !((_a2 = dependency == null ? void 0 : dependency.reactions) ==
              null
                ? void 0
                : _a2.includes(derived2))
            ) {
              (dependency.reactions ?? (dependency.reactions = [])).push(
                derived2,
              );
            }
          }
          if (is_disconnected) {
            derived2.f ^= DISCONNECTED;
          }
          if (
            is_unowned_connected &&
            parent !== null &&
            (parent.f & UNOWNED) === 0
          ) {
            derived2.f ^= UNOWNED;
          }
        }
        for (i = 0; i < length; i++) {
          dependency = dependencies[i];
          if (
            is_dirty(
              /** @type {Derived} */
              dependency,
            )
          ) {
            update_derived(
              /** @type {Derived} */
              dependency,
            );
          }
          if (dependency.wv > reaction.wv) {
            return true;
          }
        }
      }
      if (!is_unowned || (active_effect !== null && !skip_reaction)) {
        set_signal_status(reaction, CLEAN);
      }
    }
    return false;
  }
  function schedule_possible_effect_self_invalidation(
    signal,
    effect2,
    root2 = true,
  ) {
    var reactions = signal.reactions;
    if (reactions === null) return;
    if (current_sources == null ? void 0 : current_sources.includes(signal)) {
      return;
    }
    for (var i = 0; i < reactions.length; i++) {
      var reaction = reactions[i];
      if ((reaction.f & DERIVED) !== 0) {
        schedule_possible_effect_self_invalidation(
          /** @type {Derived} */
          reaction,
          effect2,
          false,
        );
      } else if (effect2 === reaction) {
        if (root2) {
          set_signal_status(reaction, DIRTY);
        } else if ((reaction.f & CLEAN) !== 0) {
          set_signal_status(reaction, MAYBE_DIRTY);
        }
        schedule_effect(
          /** @type {Effect} */
          reaction,
        );
      }
    }
  }
  function update_reaction(reaction) {
    var _a2;
    var previous_deps = new_deps;
    var previous_skipped_deps = skipped_deps;
    var previous_untracked_writes = untracked_writes;
    var previous_reaction = active_reaction;
    var previous_skip_reaction = skip_reaction;
    var previous_sources = current_sources;
    var previous_component_context = component_context;
    var previous_untracking = untracking;
    var previous_update_version = update_version;
    var flags = reaction.f;
    new_deps = /** @type {null | Value[]} */ null;
    skipped_deps = 0;
    untracked_writes = null;
    skip_reaction =
      (flags & UNOWNED) !== 0 &&
      (untracking || !is_updating_effect || active_reaction === null);
    active_reaction =
      (flags & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
    current_sources = null;
    set_component_context(reaction.ctx);
    untracking = false;
    update_version = ++read_version;
    if (reaction.ac !== null) {
      reaction.ac.abort(STALE_REACTION);
      reaction.ac = null;
    }
    try {
      reaction.f |= REACTION_IS_UPDATING;
      var result =
        /** @type {Function} */
        (0, reaction.fn)();
      var deps = reaction.deps;
      if (new_deps !== null) {
        var i;
        remove_reactions(reaction, skipped_deps);
        if (deps !== null && skipped_deps > 0) {
          deps.length = skipped_deps + new_deps.length;
          for (i = 0; i < new_deps.length; i++) {
            deps[skipped_deps + i] = new_deps[i];
          }
        } else {
          reaction.deps = deps = new_deps;
        }
        if (
          !skip_reaction || // Deriveds that already have reactions can cleanup, so we still add them as reactions
          ((flags & DERIVED) !== 0 &&
            /** @type {import('#client').Derived} */
            reaction.reactions !== null)
        ) {
          for (i = skipped_deps; i < deps.length; i++) {
            ((_a2 = deps[i]).reactions ?? (_a2.reactions = [])).push(reaction);
          }
        }
      } else if (deps !== null && skipped_deps < deps.length) {
        remove_reactions(reaction, skipped_deps);
        deps.length = skipped_deps;
      }
      if (
        is_runes() &&
        untracked_writes !== null &&
        !untracking &&
        deps !== null &&
        (reaction.f & (DERIVED | MAYBE_DIRTY | DIRTY)) === 0
      ) {
        for (i = 0; i < /** @type {Source[]} */ untracked_writes.length; i++) {
          schedule_possible_effect_self_invalidation(
            untracked_writes[i],
            /** @type {Effect} */
            reaction,
          );
        }
      }
      if (previous_reaction !== null && previous_reaction !== reaction) {
        read_version++;
        if (untracked_writes !== null) {
          if (previous_untracked_writes === null) {
            previous_untracked_writes = untracked_writes;
          } else {
            previous_untracked_writes.push(
              .../** @type {Source[]} */
              untracked_writes,
            );
          }
        }
      }
      if ((reaction.f & ERROR_VALUE) !== 0) {
        reaction.f ^= ERROR_VALUE;
      }
      return result;
    } catch (error) {
      return handle_error(error);
    } finally {
      reaction.f ^= REACTION_IS_UPDATING;
      new_deps = previous_deps;
      skipped_deps = previous_skipped_deps;
      untracked_writes = previous_untracked_writes;
      active_reaction = previous_reaction;
      skip_reaction = previous_skip_reaction;
      current_sources = previous_sources;
      set_component_context(previous_component_context);
      untracking = previous_untracking;
      update_version = previous_update_version;
    }
  }
  function remove_reaction(signal, dependency) {
    let reactions = dependency.reactions;
    if (reactions !== null) {
      var index = index_of.call(reactions, signal);
      if (index !== -1) {
        var new_length = reactions.length - 1;
        if (new_length === 0) {
          reactions = dependency.reactions = null;
        } else {
          reactions[index] = reactions[new_length];
          reactions.pop();
        }
      }
    }
    if (
      reactions === null &&
      (dependency.f & DERIVED) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
      // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
      // allows us to skip the expensive work of disconnecting and immediately reconnecting it
      (new_deps === null || !new_deps.includes(dependency))
    ) {
      set_signal_status(dependency, MAYBE_DIRTY);
      if ((dependency.f & (UNOWNED | DISCONNECTED)) === 0) {
        dependency.f ^= DISCONNECTED;
      }
      destroy_derived_effects(
        /** @type {Derived} **/
        dependency,
      );
      remove_reactions(
        /** @type {Derived} **/
        dependency,
        0,
      );
    }
  }
  function remove_reactions(signal, start_index) {
    var dependencies = signal.deps;
    if (dependencies === null) return;
    for (var i = start_index; i < dependencies.length; i++) {
      remove_reaction(signal, dependencies[i]);
    }
  }
  function update_effect(effect2) {
    var flags = effect2.f;
    if ((flags & DESTROYED) !== 0) {
      return;
    }
    set_signal_status(effect2, CLEAN);
    var previous_effect = active_effect;
    var was_updating_effect = is_updating_effect;
    active_effect = effect2;
    is_updating_effect = true;
    try {
      if ((flags & BLOCK_EFFECT) !== 0) {
        destroy_block_effect_children(effect2);
      } else {
        destroy_effect_children(effect2);
      }
      execute_effect_teardown(effect2);
      var teardown2 = update_reaction(effect2);
      effect2.teardown = typeof teardown2 === 'function' ? teardown2 : null;
      effect2.wv = write_version;
      var dep;
      if (
        DEV &&
        tracing_mode_flag &&
        (effect2.f & DIRTY) !== 0 &&
        effect2.deps !== null
      );
    } finally {
      is_updating_effect = was_updating_effect;
      active_effect = previous_effect;
    }
  }
  function get(signal) {
    var flags = signal.f;
    var is_derived = (flags & DERIVED) !== 0;
    if (active_reaction !== null && !untracking) {
      var destroyed =
        active_effect !== null && (active_effect.f & DESTROYED) !== 0;
      if (
        !destroyed &&
        !(current_sources == null ? void 0 : current_sources.includes(signal))
      ) {
        var deps = active_reaction.deps;
        if ((active_reaction.f & REACTION_IS_UPDATING) !== 0) {
          if (signal.rv < read_version) {
            signal.rv = read_version;
            if (
              new_deps === null &&
              deps !== null &&
              deps[skipped_deps] === signal
            ) {
              skipped_deps++;
            } else if (new_deps === null) {
              new_deps = [signal];
            } else if (!skip_reaction || !new_deps.includes(signal)) {
              new_deps.push(signal);
            }
          }
        } else {
          (active_reaction.deps ?? (active_reaction.deps = [])).push(signal);
          var reactions = signal.reactions;
          if (reactions === null) {
            signal.reactions = [active_reaction];
          } else if (!reactions.includes(active_reaction)) {
            reactions.push(active_reaction);
          }
        }
      }
    } else if (
      is_derived &&
      /** @type {Derived} */
      signal.deps === null &&
      /** @type {Derived} */
      signal.effects === null
    ) {
      var derived2 =
        /** @type {Derived} */
        signal;
      var parent = derived2.parent;
      if (parent !== null && (parent.f & UNOWNED) === 0) {
        derived2.f ^= UNOWNED;
      }
    }
    if (is_destroying_effect) {
      if (old_values.has(signal)) {
        return old_values.get(signal);
      }
      if (is_derived) {
        derived2 = /** @type {Derived} */ signal;
        var value = derived2.v;
        if (
          ((derived2.f & CLEAN) === 0 && derived2.reactions !== null) ||
          depends_on_old_values(derived2)
        ) {
          value = execute_derived(derived2);
        }
        old_values.set(derived2, value);
        return value;
      }
    } else if (is_derived) {
      derived2 = /** @type {Derived} */ signal;
      if (batch_deriveds == null ? void 0 : batch_deriveds.has(derived2)) {
        return batch_deriveds.get(derived2);
      }
      if (is_dirty(derived2)) {
        update_derived(derived2);
      }
    }
    if ((signal.f & ERROR_VALUE) !== 0) {
      throw signal.v;
    }
    return signal.v;
  }
  function depends_on_old_values(derived2) {
    if (derived2.v === UNINITIALIZED) return true;
    if (derived2.deps === null) return false;
    for (const dep of derived2.deps) {
      if (old_values.has(dep)) {
        return true;
      }
      if (
        (dep.f & DERIVED) !== 0 &&
        depends_on_old_values(
          /** @type {Derived} */
          dep,
        )
      ) {
        return true;
      }
    }
    return false;
  }
  function untrack(fn) {
    var previous_untracking = untracking;
    try {
      untracking = true;
      return fn();
    } finally {
      untracking = previous_untracking;
    }
  }
  const STATUS_MASK = -7169;
  function set_signal_status(signal, status) {
    signal.f = (signal.f & STATUS_MASK) | status;
  }
  function deep_read_state(value) {
    if (typeof value !== 'object' || !value || value instanceof EventTarget) {
      return;
    }
    if (STATE_SYMBOL in value) {
      deep_read(value);
    } else if (!Array.isArray(value)) {
      for (let key in value) {
        const prop = value[key];
        if (typeof prop === 'object' && prop && STATE_SYMBOL in prop) {
          deep_read(prop);
        }
      }
    }
  }
  function deep_read(value, visited = /* @__PURE__ */ new Set()) {
    if (
      typeof value === 'object' &&
      value !== null && // We don't want to traverse DOM elements
      !(value instanceof EventTarget) &&
      !visited.has(value)
    ) {
      visited.add(value);
      if (value instanceof Date) {
        value.getTime();
      }
      for (let key in value) {
        try {
          deep_read(value[key], visited);
        } catch (e) {}
      }
      const proto = get_prototype_of(value);
      if (
        proto !== Object.prototype &&
        proto !== Array.prototype &&
        proto !== Map.prototype &&
        proto !== Set.prototype &&
        proto !== Date.prototype
      ) {
        const descriptors = get_descriptors(proto);
        for (let key in descriptors) {
          const get2 = descriptors[key].get;
          if (get2) {
            try {
              get2.call(value);
            } catch (e) {}
          }
        }
      }
    }
  }
  const PASSIVE_EVENTS = ['touchstart', 'touchmove'];
  function is_passive_event(name2) {
    return PASSIVE_EVENTS.includes(name2);
  }
  let listening_to_form_reset = false;
  function add_form_reset_listener() {
    if (!listening_to_form_reset) {
      listening_to_form_reset = true;
      document.addEventListener(
        'reset',
        (evt) => {
          Promise.resolve().then(() => {
            var _a2;
            if (!evt.defaultPrevented) {
              /**@type {HTMLFormElement} */
              for (const e of evt.target.elements) {
                (_a2 = e.__on_r) == null ? void 0 : _a2.call(e);
              }
            }
          });
        },
        // In the capture phase to guarantee we get noticed of it (no possiblity of stopPropagation)
        { capture: true },
      );
    }
  }
  function without_reactive_context(fn) {
    var previous_reaction = active_reaction;
    var previous_effect = active_effect;
    set_active_reaction(null);
    set_active_effect(null);
    try {
      return fn();
    } finally {
      set_active_reaction(previous_reaction);
      set_active_effect(previous_effect);
    }
  }
  function listen_to_event_and_reset_event(
    element,
    event2,
    handler,
    on_reset = handler,
  ) {
    element.addEventListener(event2, () => without_reactive_context(handler));
    const prev = element.__on_r;
    if (prev) {
      element.__on_r = () => {
        prev();
        on_reset(true);
      };
    } else {
      element.__on_r = () => on_reset(true);
    }
    add_form_reset_listener();
  }
  const all_registered_events = /* @__PURE__ */ new Set();
  const root_event_handles = /* @__PURE__ */ new Set();
  function create_event(event_name, dom, handler, options = {}) {
    function target_handler(event2) {
      if (!options.capture) {
        handle_event_propagation.call(dom, event2);
      }
      if (!event2.cancelBubble) {
        return without_reactive_context(() => {
          return handler == null ? void 0 : handler.call(this, event2);
        });
      }
    }
    if (
      event_name.startsWith('pointer') ||
      event_name.startsWith('touch') ||
      event_name === 'wheel'
    ) {
      queue_micro_task(() => {
        dom.addEventListener(event_name, target_handler, options);
      });
    } else {
      dom.addEventListener(event_name, target_handler, options);
    }
    return target_handler;
  }
  function event(event_name, dom, handler, capture2, passive) {
    var options = { capture: capture2, passive };
    var target_handler = create_event(event_name, dom, handler, options);
    if (
      dom === document.body || // @ts-ignore
      dom === window || // @ts-ignore
      dom === document || // Firefox has quirky behavior, it can happen that we still get "canplay" events when the element is already removed
      dom instanceof HTMLMediaElement
    ) {
      teardown(() => {
        dom.removeEventListener(event_name, target_handler, options);
      });
    }
  }
  function delegate(events) {
    for (var i = 0; i < events.length; i++) {
      all_registered_events.add(events[i]);
    }
    for (var fn of root_event_handles) {
      fn(events);
    }
  }
  function handle_event_propagation(event2) {
    var _a2;
    var handler_element = this;
    var owner_document =
      /** @type {Node} */
      handler_element.ownerDocument;
    var event_name = event2.type;
    var path =
      ((_a2 = event2.composedPath) == null ? void 0 : _a2.call(event2)) || [];
    var current_target =
      /** @type {null | Element} */
      path[0] || event2.target;
    var path_idx = 0;
    var handled_at = event2.__root;
    if (handled_at) {
      var at_idx = path.indexOf(handled_at);
      if (
        at_idx !== -1 &&
        (handler_element === document ||
          handler_element === /** @type {any} */ window)
      ) {
        event2.__root = handler_element;
        return;
      }
      var handler_idx = path.indexOf(handler_element);
      if (handler_idx === -1) {
        return;
      }
      if (at_idx <= handler_idx) {
        path_idx = at_idx;
      }
    }
    current_target = /** @type {Element} */ path[path_idx] || event2.target;
    if (current_target === handler_element) return;
    define_property(event2, 'currentTarget', {
      configurable: true,
      get() {
        return current_target || owner_document;
      },
    });
    var previous_reaction = active_reaction;
    var previous_effect = active_effect;
    set_active_reaction(null);
    set_active_effect(null);
    try {
      var throw_error;
      var other_errors = [];
      while (current_target !== null) {
        var parent_element =
          current_target.assignedSlot ||
          current_target.parentNode ||
          /** @type {any} */
          current_target.host ||
          null;
        try {
          var delegated = current_target['__' + event_name];
          if (
            delegated != null &&
            (!(/** @type {any} */ current_target.disabled) || // DOM could've been updated already by the time this is reached, so we check this as well
              // -> the target could not have been disabled because it emits the event in the first place
              event2.target === current_target)
          ) {
            if (is_array(delegated)) {
              var [fn, ...data] = delegated;
              fn.apply(current_target, [event2, ...data]);
            } else {
              delegated.call(current_target, event2);
            }
          }
        } catch (error) {
          if (throw_error) {
            other_errors.push(error);
          } else {
            throw_error = error;
          }
        }
        if (
          event2.cancelBubble ||
          parent_element === handler_element ||
          parent_element === null
        ) {
          break;
        }
        current_target = parent_element;
      }
      if (throw_error) {
        for (let error of other_errors) {
          queueMicrotask(() => {
            throw error;
          });
        }
        throw throw_error;
      }
    } finally {
      event2.__root = handler_element;
      delete event2.currentTarget;
      set_active_reaction(previous_reaction);
      set_active_effect(previous_effect);
    }
  }
  function create_fragment_from_html(html) {
    var elem = document.createElement('template');
    elem.innerHTML = html.replaceAll('<!>', '<!---->');
    return elem.content;
  }
  function assign_nodes(start, end) {
    var effect2 =
      /** @type {Effect} */
      active_effect;
    if (effect2.nodes_start === null) {
      effect2.nodes_start = start;
      effect2.nodes_end = end;
    }
  }
  // @__NO_SIDE_EFFECTS__
  function from_html(content, flags) {
    var is_fragment = (flags & TEMPLATE_FRAGMENT) !== 0;
    var use_import_node = (flags & TEMPLATE_USE_IMPORT_NODE) !== 0;
    var node;
    var has_start = !content.startsWith('<!>');
    return () => {
      if (node === void 0) {
        node = create_fragment_from_html(has_start ? content : '<!>' + content);
        if (!is_fragment)
          node = /** @type {Node} */ /* @__PURE__ */ get_first_child(node);
      }
      var clone =
        /** @type {TemplateNode} */
        use_import_node || is_firefox
          ? document.importNode(node, true)
          : node.cloneNode(true);
      if (is_fragment) {
        var start =
          /** @type {TemplateNode} */
          /* @__PURE__ */ get_first_child(clone);
        var end =
          /** @type {TemplateNode} */
          clone.lastChild;
        assign_nodes(start, end);
      } else {
        assign_nodes(clone, clone);
      }
      return clone;
    };
  }
  // @__NO_SIDE_EFFECTS__
  function from_namespace(content, flags, ns = 'svg') {
    var has_start = !content.startsWith('<!>');
    var wrapped = `<${ns}>${has_start ? content : '<!>' + content}</${ns}>`;
    var node;
    return () => {
      if (!node) {
        var fragment =
          /** @type {DocumentFragment} */
          create_fragment_from_html(wrapped);
        var root2 =
          /** @type {Element} */
          /* @__PURE__ */ get_first_child(fragment);
        {
          node = /** @type {Element} */ /* @__PURE__ */ get_first_child(root2);
        }
      }
      var clone =
        /** @type {TemplateNode} */
        node.cloneNode(true);
      {
        assign_nodes(clone, clone);
      }
      return clone;
    };
  }
  // @__NO_SIDE_EFFECTS__
  function from_svg(content, flags) {
    return /* @__PURE__ */ from_namespace(content, flags, 'svg');
  }
  function text(value = '') {
    {
      var t2 = create_text(value + '');
      assign_nodes(t2, t2);
      return t2;
    }
  }
  function comment() {
    var frag = document.createDocumentFragment();
    var start = document.createComment('');
    var anchor = create_text();
    frag.append(start, anchor);
    assign_nodes(start, anchor);
    return frag;
  }
  function append(anchor, dom) {
    if (anchor === null) {
      return;
    }
    anchor.before(
      /** @type {Node} */
      dom,
    );
  }
  function set_text(text2, value) {
    var str =
      value == null ? '' : typeof value === 'object' ? value + '' : value;
    if (str !== (text2.__t ?? (text2.__t = text2.nodeValue))) {
      text2.__t = str;
      text2.nodeValue = str + '';
    }
  }
  function mount(component2, options) {
    return _mount(component2, options);
  }
  const document_listeners = /* @__PURE__ */ new Map();
  function _mount(
    Component,
    { target, anchor, props = {}, events, context, intro = true },
  ) {
    init_operations();
    var registered_events = /* @__PURE__ */ new Set();
    var event_handle = (events2) => {
      for (var i = 0; i < events2.length; i++) {
        var event_name = events2[i];
        if (registered_events.has(event_name)) continue;
        registered_events.add(event_name);
        var passive = is_passive_event(event_name);
        target.addEventListener(event_name, handle_event_propagation, {
          passive,
        });
        var n = document_listeners.get(event_name);
        if (n === void 0) {
          document.addEventListener(event_name, handle_event_propagation, {
            passive,
          });
          document_listeners.set(event_name, 1);
        } else {
          document_listeners.set(event_name, n + 1);
        }
      }
    };
    event_handle(array_from(all_registered_events));
    root_event_handles.add(event_handle);
    var component2 = void 0;
    var unmount2 = component_root(() => {
      var anchor_node = anchor ?? target.appendChild(create_text());
      branch(() => {
        if (context) {
          push({});
          var ctx =
            /** @type {ComponentContext} */
            component_context;
          ctx.c = context;
        }
        if (events) {
          props.$$events = events;
        }
        component2 = Component(anchor_node, props) || {};
        if (context) {
          pop();
        }
      });
      return () => {
        var _a2;
        for (var event_name of registered_events) {
          target.removeEventListener(event_name, handle_event_propagation);
          var n =
            /** @type {number} */
            document_listeners.get(event_name);
          if (--n === 0) {
            document.removeEventListener(event_name, handle_event_propagation);
            document_listeners.delete(event_name);
          } else {
            document_listeners.set(event_name, n);
          }
        }
        root_event_handles.delete(event_handle);
        if (anchor_node !== anchor) {
          (_a2 = anchor_node.parentNode) == null
            ? void 0
            : _a2.removeChild(anchor_node);
        }
      };
    });
    mounted_components.set(component2, unmount2);
    return component2;
  }
  let mounted_components = /* @__PURE__ */ new WeakMap();
  function unmount(component2, options) {
    const fn = mounted_components.get(component2);
    if (fn) {
      mounted_components.delete(component2);
      return fn(options);
    }
    return Promise.resolve();
  }
  function if_block(node, fn, elseif = false) {
    var anchor = node;
    var consequent_effect = null;
    var alternate_effect = null;
    var condition = UNINITIALIZED;
    var flags = elseif ? EFFECT_TRANSPARENT : 0;
    var has_branch = false;
    const set_branch = (fn2, flag = true) => {
      has_branch = true;
      update_branch(flag, fn2);
    };
    var offscreen_fragment = null;
    function commit() {
      if (offscreen_fragment !== null) {
        offscreen_fragment.lastChild.remove();
        anchor.before(offscreen_fragment);
        offscreen_fragment = null;
      }
      var active = condition ? consequent_effect : alternate_effect;
      var inactive = condition ? alternate_effect : consequent_effect;
      if (active) {
        resume_effect(active);
      }
      if (inactive) {
        pause_effect(inactive, () => {
          if (condition) {
            alternate_effect = null;
          } else {
            consequent_effect = null;
          }
        });
      }
    }
    const update_branch = (new_condition, fn2) => {
      if (condition === (condition = new_condition)) return;
      var defer = should_defer_append();
      var target = anchor;
      if (defer) {
        offscreen_fragment = document.createDocumentFragment();
        offscreen_fragment.append((target = create_text()));
      }
      if (condition) {
        consequent_effect ??
          (consequent_effect = fn2 && branch(() => fn2(target)));
      } else {
        alternate_effect ??
          (alternate_effect = fn2 && branch(() => fn2(target)));
      }
      if (defer) {
        var batch =
          /** @type {Batch} */
          current_batch;
        var active = condition ? consequent_effect : alternate_effect;
        var inactive = condition ? alternate_effect : consequent_effect;
        if (active) batch.skipped_effects.delete(active);
        if (inactive) batch.skipped_effects.add(inactive);
        batch.add_callback(commit);
      } else {
        commit();
      }
    };
    block(() => {
      has_branch = false;
      fn(set_branch);
      if (!has_branch) {
        update_branch(null, null);
      }
    }, flags);
  }
  function pause_effects(state2, items, controlled_anchor) {
    var items_map = state2.items;
    var transitions = [];
    var length = items.length;
    for (var i = 0; i < length; i++) {
      pause_children(items[i].e, transitions, true);
    }
    var is_controlled =
      length > 0 && transitions.length === 0 && controlled_anchor !== null;
    if (is_controlled) {
      var parent_node =
        /** @type {Element} */
        /** @type {Element} */
        controlled_anchor.parentNode;
      clear_text_content(parent_node);
      parent_node.append(
        /** @type {Element} */
        controlled_anchor,
      );
      items_map.clear();
      link$1(state2, items[0].prev, items[length - 1].next);
    }
    run_out_transitions(transitions, () => {
      for (var i2 = 0; i2 < length; i2++) {
        var item = items[i2];
        if (!is_controlled) {
          items_map.delete(item.k);
          link$1(state2, item.prev, item.next);
        }
        destroy_effect(item.e, !is_controlled);
      }
    });
  }
  function each(
    node,
    flags,
    get_collection,
    get_key,
    render_fn,
    fallback_fn = null,
  ) {
    var anchor = node;
    var state2 = { flags, items: /* @__PURE__ */ new Map(), first: null };
    var is_controlled = (flags & EACH_IS_CONTROLLED) !== 0;
    if (is_controlled) {
      var parent_node =
        /** @type {Element} */
        node;
      anchor = parent_node.appendChild(create_text());
    }
    var fallback = null;
    var was_empty = false;
    var offscreen_items = /* @__PURE__ */ new Map();
    var each_array = /* @__PURE__ */ derived_safe_equal(() => {
      var collection = get_collection();
      return is_array(collection)
        ? collection
        : collection == null
          ? []
          : array_from(collection);
    });
    var array;
    var each_effect;
    function commit() {
      reconcile(
        each_effect,
        array,
        state2,
        offscreen_items,
        anchor,
        render_fn,
        flags,
        get_key,
        get_collection,
      );
      if (fallback_fn !== null) {
        if (array.length === 0) {
          if (fallback) {
            resume_effect(fallback);
          } else {
            fallback = branch(() => fallback_fn(anchor));
          }
        } else if (fallback !== null) {
          pause_effect(fallback, () => {
            fallback = null;
          });
        }
      }
    }
    block(() => {
      each_effect ?? (each_effect = /** @type {Effect} */ active_effect);
      array = get(each_array);
      var length = array.length;
      if (was_empty && length === 0) {
        return;
      }
      was_empty = length === 0;
      var item, i, value, key;
      {
        if (should_defer_append()) {
          var keys = /* @__PURE__ */ new Set();
          var batch =
            /** @type {Batch} */
            current_batch;
          for (i = 0; i < length; i += 1) {
            value = array[i];
            key = get_key(value, i);
            var existing = state2.items.get(key) ?? offscreen_items.get(key);
            if (existing) {
              if ((flags & (EACH_ITEM_REACTIVE | EACH_INDEX_REACTIVE)) !== 0) {
                update_item(existing, value, i, flags);
              }
            } else {
              item = create_item(
                null,
                state2,
                null,
                null,
                value,
                key,
                i,
                render_fn,
                flags,
                get_collection,
                true,
              );
              offscreen_items.set(key, item);
            }
            keys.add(key);
          }
          for (const [key2, item2] of state2.items) {
            if (!keys.has(key2)) {
              batch.skipped_effects.add(item2.e);
            }
          }
          batch.add_callback(commit);
        } else {
          commit();
        }
      }
      get(each_array);
    });
  }
  function reconcile(
    each_effect,
    array,
    state2,
    offscreen_items,
    anchor,
    render_fn,
    flags,
    get_key,
    get_collection,
  ) {
    var _a2, _b, _c, _d;
    var is_animated = (flags & EACH_IS_ANIMATED) !== 0;
    var should_update =
      (flags & (EACH_ITEM_REACTIVE | EACH_INDEX_REACTIVE)) !== 0;
    var length = array.length;
    var items = state2.items;
    var first = state2.first;
    var current = first;
    var seen;
    var prev = null;
    var to_animate;
    var matched = [];
    var stashed = [];
    var value;
    var key;
    var item;
    var i;
    if (is_animated) {
      for (i = 0; i < length; i += 1) {
        value = array[i];
        key = get_key(value, i);
        item = items.get(key);
        if (item !== void 0) {
          (_a2 = item.a) == null ? void 0 : _a2.measure();
          (to_animate ?? (to_animate = /* @__PURE__ */ new Set())).add(item);
        }
      }
    }
    for (i = 0; i < length; i += 1) {
      value = array[i];
      key = get_key(value, i);
      item = items.get(key);
      if (item === void 0) {
        var pending = offscreen_items.get(key);
        if (pending !== void 0) {
          offscreen_items.delete(key);
          items.set(key, pending);
          var next = prev ? prev.next : current;
          link$1(state2, prev, pending);
          link$1(state2, pending, next);
          move(pending, next, anchor);
          prev = pending;
        } else {
          var child_anchor = current
            ? /** @type {TemplateNode} */
              current.e.nodes_start
            : anchor;
          prev = create_item(
            child_anchor,
            state2,
            prev,
            prev === null ? state2.first : prev.next,
            value,
            key,
            i,
            render_fn,
            flags,
            get_collection,
          );
        }
        items.set(key, prev);
        matched = [];
        stashed = [];
        current = prev.next;
        continue;
      }
      if (should_update) {
        update_item(item, value, i, flags);
      }
      if ((item.e.f & INERT) !== 0) {
        resume_effect(item.e);
        if (is_animated) {
          (_b = item.a) == null ? void 0 : _b.unfix();
          (to_animate ?? (to_animate = /* @__PURE__ */ new Set())).delete(item);
        }
      }
      if (item !== current) {
        if (seen !== void 0 && seen.has(item)) {
          if (matched.length < stashed.length) {
            var start = stashed[0];
            var j;
            prev = start.prev;
            var a = matched[0];
            var b = matched[matched.length - 1];
            for (j = 0; j < matched.length; j += 1) {
              move(matched[j], start, anchor);
            }
            for (j = 0; j < stashed.length; j += 1) {
              seen.delete(stashed[j]);
            }
            link$1(state2, a.prev, b.next);
            link$1(state2, prev, a);
            link$1(state2, b, start);
            current = start;
            prev = b;
            i -= 1;
            matched = [];
            stashed = [];
          } else {
            seen.delete(item);
            move(item, current, anchor);
            link$1(state2, item.prev, item.next);
            link$1(state2, item, prev === null ? state2.first : prev.next);
            link$1(state2, prev, item);
            prev = item;
          }
          continue;
        }
        matched = [];
        stashed = [];
        while (current !== null && current.k !== key) {
          if ((current.e.f & INERT) === 0) {
            (seen ?? (seen = /* @__PURE__ */ new Set())).add(current);
          }
          stashed.push(current);
          current = current.next;
        }
        if (current === null) {
          continue;
        }
        item = current;
      }
      matched.push(item);
      prev = item;
      current = item.next;
    }
    if (current !== null || seen !== void 0) {
      var to_destroy = seen === void 0 ? [] : array_from(seen);
      while (current !== null) {
        if ((current.e.f & INERT) === 0) {
          to_destroy.push(current);
        }
        current = current.next;
      }
      var destroy_length = to_destroy.length;
      if (destroy_length > 0) {
        var controlled_anchor =
          (flags & EACH_IS_CONTROLLED) !== 0 && length === 0 ? anchor : null;
        if (is_animated) {
          for (i = 0; i < destroy_length; i += 1) {
            (_c = to_destroy[i].a) == null ? void 0 : _c.measure();
          }
          for (i = 0; i < destroy_length; i += 1) {
            (_d = to_destroy[i].a) == null ? void 0 : _d.fix();
          }
        }
        pause_effects(state2, to_destroy, controlled_anchor);
      }
    }
    if (is_animated) {
      queue_micro_task(() => {
        var _a3;
        if (to_animate === void 0) return;
        for (item of to_animate) {
          (_a3 = item.a) == null ? void 0 : _a3.apply();
        }
      });
    }
    each_effect.first = state2.first && state2.first.e;
    each_effect.last = prev && prev.e;
    for (var unused of offscreen_items.values()) {
      destroy_effect(unused.e);
    }
    offscreen_items.clear();
  }
  function update_item(item, value, index, type) {
    if ((type & EACH_ITEM_REACTIVE) !== 0) {
      internal_set(item.v, value);
    }
    if ((type & EACH_INDEX_REACTIVE) !== 0) {
      internal_set(
        /** @type {Value<number>} */
        item.i,
        index,
      );
    } else {
      item.i = index;
    }
  }
  function create_item(
    anchor,
    state2,
    prev,
    next,
    value,
    key,
    index,
    render_fn,
    flags,
    get_collection,
    deferred2,
  ) {
    var reactive = (flags & EACH_ITEM_REACTIVE) !== 0;
    var mutable = (flags & EACH_ITEM_IMMUTABLE) === 0;
    var v = reactive
      ? mutable
        ? /* @__PURE__ */ mutable_source(value, false, false)
        : source(value)
      : value;
    var i = (flags & EACH_INDEX_REACTIVE) === 0 ? index : source(index);
    var item = {
      i,
      v,
      k: key,
      a: null,
      // @ts-expect-error
      e: null,
      prev,
      next,
    };
    try {
      if (anchor === null) {
        var fragment = document.createDocumentFragment();
        fragment.append((anchor = create_text()));
      }
      item.e = branch(
        () =>
          render_fn(
            /** @type {Node} */
            anchor,
            v,
            i,
            get_collection,
          ),
        hydrating,
      );
      item.e.prev = prev && prev.e;
      item.e.next = next && next.e;
      if (prev === null) {
        if (!deferred2) {
          state2.first = item;
        }
      } else {
        prev.next = item;
        prev.e.next = item.e;
      }
      if (next !== null) {
        next.prev = item;
        next.e.prev = item.e;
      }
      return item;
    } finally {
    }
  }
  function move(item, next, anchor) {
    var end = item.next
      ? /** @type {TemplateNode} */
        item.next.e.nodes_start
      : anchor;
    var dest = next
      ? /** @type {TemplateNode} */
        next.e.nodes_start
      : anchor;
    var node =
      /** @type {TemplateNode} */
      item.e.nodes_start;
    while (node !== null && node !== end) {
      var next_node =
        /** @type {TemplateNode} */
        /* @__PURE__ */ get_next_sibling(node);
      dest.before(node);
      node = next_node;
    }
  }
  function link$1(state2, prev, next) {
    if (prev === null) {
      state2.first = next;
    } else {
      prev.next = next;
      prev.e.next = next && next.e;
    }
    if (next !== null) {
      next.prev = prev;
      next.e.prev = prev && prev.e;
    }
  }
  function snippet(node, get_snippet, ...args) {
    var anchor = node;
    var snippet2 = noop;
    var snippet_effect;
    block(() => {
      if (snippet2 === (snippet2 = get_snippet())) return;
      if (snippet_effect) {
        destroy_effect(snippet_effect);
        snippet_effect = null;
      }
      snippet_effect = branch(() =>
        /** @type {SnippetFn} */
        snippet2(anchor, ...args),
      );
    }, EFFECT_TRANSPARENT);
  }
  function component(node, get_component, render_fn) {
    var anchor = node;
    var component2;
    var effect2;
    var offscreen_fragment = null;
    var pending_effect = null;
    function commit() {
      if (effect2) {
        pause_effect(effect2);
        effect2 = null;
      }
      if (offscreen_fragment) {
        offscreen_fragment.lastChild.remove();
        anchor.before(offscreen_fragment);
        offscreen_fragment = null;
      }
      effect2 = pending_effect;
      pending_effect = null;
    }
    block(() => {
      if (component2 === (component2 = get_component())) return;
      var defer = should_defer_append();
      if (component2) {
        var target = anchor;
        if (defer) {
          offscreen_fragment = document.createDocumentFragment();
          offscreen_fragment.append((target = create_text()));
        }
        pending_effect = branch(() => render_fn(target, component2));
      }
      if (defer) {
        current_batch.add_callback(commit);
      } else {
        commit();
      }
    }, EFFECT_TRANSPARENT);
  }
  function action(dom, action2, get_value) {
    effect(() => {
      var payload = untrack(
        () => action2(dom, get_value == null ? void 0 : get_value()) || {},
      );
      if (get_value && (payload == null ? void 0 : payload.update)) {
        var inited = false;
        var prev =
          /** @type {any} */
          {};
        render_effect(() => {
          var value = get_value();
          deep_read_state(value);
          if (inited && safe_not_equal(prev, value)) {
            prev = value;
            payload.update(value);
          }
        });
        inited = true;
      }
      if (payload == null ? void 0 : payload.destroy) {
        return () =>
          /** @type {Function} */
          payload.destroy();
      }
    });
  }
  const whitespace = [...' 	\n\r\f \v\uFEFF'];
  function to_class(value, hash, directives) {
    var classname = value == null ? '' : '' + value;
    if (hash) {
      classname = classname ? classname + ' ' + hash : hash;
    }
    if (directives) {
      for (var key in directives) {
        if (directives[key]) {
          classname = classname ? classname + ' ' + key : key;
        } else if (classname.length) {
          var len = key.length;
          var a = 0;
          while ((a = classname.indexOf(key, a)) >= 0) {
            var b = a + len;
            if (
              (a === 0 || whitespace.includes(classname[a - 1])) &&
              (b === classname.length || whitespace.includes(classname[b]))
            ) {
              classname =
                (a === 0 ? '' : classname.substring(0, a)) +
                classname.substring(b + 1);
            } else {
              a = b;
            }
          }
        }
      }
    }
    return classname === '' ? null : classname;
  }
  function to_style(value, styles) {
    return value == null ? null : String(value);
  }
  function set_class(dom, is_html, value, hash, prev_classes, next_classes) {
    var prev = dom.__className;
    if (prev !== value || prev === void 0) {
      var next_class_name = to_class(value, hash, next_classes);
      {
        if (next_class_name == null) {
          dom.removeAttribute('class');
        } else {
          dom.className = next_class_name;
        }
      }
      dom.__className = value;
    } else if (next_classes && prev_classes !== next_classes) {
      for (var key in next_classes) {
        var is_present = !!next_classes[key];
        if (prev_classes == null || is_present !== !!prev_classes[key]) {
          dom.classList.toggle(key, is_present);
        }
      }
    }
    return next_classes;
  }
  function set_style(dom, value, prev_styles, next_styles) {
    var prev = dom.__style;
    if (prev !== value) {
      var next_style_attr = to_style(value);
      {
        if (next_style_attr == null) {
          dom.removeAttribute('style');
        } else {
          dom.style.cssText = next_style_attr;
        }
      }
      dom.__style = value;
    }
    return next_styles;
  }
  const IS_CUSTOM_ELEMENT = Symbol('is custom element');
  const IS_HTML = Symbol('is html');
  function set_attribute(element, attribute, value, skip_warning) {
    var attributes = get_attributes(element);
    if (attributes[attribute] === (attributes[attribute] = value)) return;
    if (attribute === 'loading') {
      element[LOADING_ATTR_SYMBOL] = value;
    }
    if (value == null) {
      element.removeAttribute(attribute);
    } else if (
      typeof value !== 'string' &&
      get_setters(element).includes(attribute)
    ) {
      element[attribute] = value;
    } else {
      element.setAttribute(attribute, value);
    }
  }
  function get_attributes(element) {
    return (
      /** @type {Record<string | symbol, unknown>} **/
      // @ts-expect-error
      element.__attributes ??
      (element.__attributes = {
        [IS_CUSTOM_ELEMENT]: element.nodeName.includes('-'),
        [IS_HTML]: element.namespaceURI === NAMESPACE_HTML,
      })
    );
  }
  var setters_cache = /* @__PURE__ */ new Map();
  function get_setters(element) {
    var setters = setters_cache.get(element.nodeName);
    if (setters) return setters;
    setters_cache.set(element.nodeName, (setters = []));
    var descriptors;
    var proto = element;
    var element_proto = Element.prototype;
    while (element_proto !== proto) {
      descriptors = get_descriptors(proto);
      for (var key in descriptors) {
        if (descriptors[key].set) {
          setters.push(key);
        }
      }
      proto = get_prototype_of(proto);
    }
    return setters;
  }
  function bind_value(input, get2, set2 = get2) {
    var runes = is_runes();
    var batches2 = /* @__PURE__ */ new WeakSet();
    listen_to_event_and_reset_event(input, 'input', (is_reset) => {
      var value = is_reset ? input.defaultValue : input.value;
      value = is_numberlike_input(input) ? to_number(value) : value;
      set2(value);
      if (current_batch !== null) {
        batches2.add(current_batch);
      }
      if (runes && value !== (value = get2())) {
        var start = input.selectionStart;
        var end = input.selectionEnd;
        input.value = value ?? '';
        if (end !== null) {
          input.selectionStart = start;
          input.selectionEnd = Math.min(end, input.value.length);
        }
      }
    });
    if (
      // If we are hydrating and the value has since changed,
      // then use the updated value from the input instead.
      // If defaultValue is set, then value == defaultValue
      // TODO Svelte 6: remove input.value check and set to empty string?
      untrack(get2) == null &&
      input.value
    ) {
      set2(is_numberlike_input(input) ? to_number(input.value) : input.value);
      if (current_batch !== null) {
        batches2.add(current_batch);
      }
    }
    render_effect(() => {
      var value = get2();
      if (
        input === document.activeElement &&
        batches2.has(
          /** @type {Batch} */
          current_batch,
        )
      ) {
        return;
      }
      if (is_numberlike_input(input) && value === to_number(input.value)) {
        return;
      }
      if (input.type === 'date' && !value && !input.value) {
        return;
      }
      if (value !== input.value) {
        input.value = value ?? '';
      }
    });
  }
  function is_numberlike_input(input) {
    var type = input.type;
    return type === 'number' || type === 'range';
  }
  function to_number(value) {
    return value === '' ? null : +value;
  }
  function init(immutable = false) {
    const context =
      /** @type {ComponentContextLegacy} */
      component_context;
    const callbacks = context.l.u;
    if (!callbacks) return;
    let props = () => deep_read_state(context.s);
    if (immutable) {
      let version2 = 0;
      let prev =
        /** @type {Record<string, any>} */
        {};
      const d = /* @__PURE__ */ derived(() => {
        let changed = false;
        const props2 = context.s;
        for (const key in props2) {
          if (props2[key] !== prev[key]) {
            prev[key] = props2[key];
            changed = true;
          }
        }
        if (changed) version2++;
        return version2;
      });
      props = () => get(d);
    }
    if (callbacks.b.length) {
      user_pre_effect(() => {
        observe_all(context, props);
        run_all(callbacks.b);
      });
    }
    user_effect(() => {
      const fns = untrack(() => callbacks.m.map(run));
      return () => {
        for (const fn of fns) {
          if (typeof fn === 'function') {
            fn();
          }
        }
      };
    });
    if (callbacks.a.length) {
      user_effect(() => {
        observe_all(context, props);
        run_all(callbacks.a);
      });
    }
  }
  function observe_all(context, props) {
    if (context.l.s) {
      for (const signal of context.l.s) get(signal);
    }
    props();
  }
  function reactive_import(fn) {
    var s = source(0);
    return function () {
      if (arguments.length === 1) {
        set(s, get(s) + 1);
        return arguments[0];
      } else {
        get(s);
        return fn();
      }
    };
  }
  function onMount(fn) {
    if (component_context === null) {
      lifecycle_outside_component();
    }
    if (legacy_mode_flag && component_context.l !== null) {
      init_update_callbacks(component_context).m.push(fn);
    } else {
      user_effect(() => {
        const cleanup = untrack(fn);
        if (typeof cleanup === 'function')
          return (
            /** @type {() => void} */
            cleanup
          );
      });
    }
  }
  function onDestroy(fn) {
    if (component_context === null) {
      lifecycle_outside_component();
    }
    onMount(() => () => untrack(fn));
  }
  function init_update_callbacks(context) {
    var l =
      /** @type {ComponentContextLegacy} */
      context.l;
    return l.u ?? (l.u = { a: [], b: [], m: [] });
  }
  const PUBLIC_VERSION = '5';
  if (typeof window !== 'undefined') {
    (
      (_a = window.__svelte ?? (window.__svelte = {})).v ??
      (_a.v = /* @__PURE__ */ new Set())
    ).add(PUBLIC_VERSION);
  }
  const PREFIX = 'Dub+';
  function getTimeStamp() {
    return /* @__PURE__ */ new Date().toLocaleTimeString();
  }
  function logInfo(...args) {
    console.log(`[${getTimeStamp()}] ${PREFIX}:`, ...args);
  }
  function logError(...args) {
    console.error(`[${getTimeStamp()}] ${PREFIX}:`, ...args);
  }
  function deepCheck(objectPath, startingScope = window) {
    const props = objectPath.split('.');
    let depth = startingScope;
    for (let i = 0; i < props.length; i++) {
      if (typeof depth[props[i]] === 'undefined') {
        return false;
      }
      depth = depth[props[i]];
    }
    return true;
  }
  function arrayDeepCheck(arr, startingScope = window) {
    const scope = startingScope;
    for (let i = 0; i < arr.length; i++) {
      if (!deepCheck(arr[i], scope)) {
        logInfo(arr[i], 'is not found yet');
        return false;
      }
    }
    return true;
  }
  function waitFor(waitingFor, options = {}) {
    const defaults2 = {
      interval: 500,
      // every XX ms we check to see if all variables are defined
      seconds: 5,
      // how many total seconds we wish to continue pinging
    };
    const opts = Object.assign({}, defaults2, options);
    return new Promise((resolve, reject) => {
      let tryCount = 0;
      const tryLimit = (opts.seconds * 1e3) / opts.interval;
      const check = () => {
        tryCount++;
        if (arrayDeepCheck(waitingFor)) {
          resolve();
        } else if (tryCount < tryLimit) {
          window.setTimeout(check, opts.interval);
        } else {
          reject();
        }
      };
      check();
    });
  }
  enable_legacy_mode_flag();
  var root$s = /* @__PURE__ */ from_svg(
    `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 0 2078.496 2083.914" enable-background="new 0 0 2078.496 2083.914" xml:space="preserve"><rect x="769.659" y="772.445" fill-rule="evenodd" clip-rule="evenodd" fill="#660078" width="539.178" height="539.178"></rect><g><rect x="1308.837" y="772.445" fill-rule="evenodd" clip-rule="evenodd" fill="#EB008B" width="537.488" height="539.178"></rect><polygon fill="#EB008B" points="2045.015,1042.035 1845.324,1311.625 1845.324,772.446 	"></polygon></g><g><rect x="232.172" y="772.445" fill-rule="evenodd" clip-rule="evenodd" fill="#EB008B" width="537.487" height="539.178"></rect><polygon fill="#EB008B" points="33.481,1042.034 233.172,772.445 233.172,1311.623 	"></polygon></g><g><rect x="769.659" y="1311.624" fill-rule="evenodd" clip-rule="evenodd" fill="#6FCBDC" width="539.178" height="537.487"></rect><polygon fill="#6FCBDC" points="1039.248,2047.802 769.659,1848.111 1308.837,1848.111 	"></polygon></g><g><rect x="769.659" y="234.958" fill-rule="evenodd" clip-rule="evenodd" fill="#6FCBDC" width="539.178" height="537.487"></rect><polygon fill="#6FCBDC" points="1039.249,35.268 1308.837,235.958 769.659,235.958 	"></polygon></g></svg>`,
  );
  function Logo($$anchor) {
    var svg = root$s();
    append($$anchor, svg);
  }
  const translations = {
    en: {
      'Modal.confirm': 'OK',
      'Modal.cancel': 'Cancel',
      'Modal.close': 'Close',
      'Modal.defaultValue': 'Default Value',
      'Error.modal.title': 'Dub+ Error',
      'Error.modal.loggedout':
        "You're not logged in. Please login to use Dub+.",
      'Error.unknown':
        'Something went wrong starting Dub+. Please refresh and try again.',
      'Loading.text': 'Waiting for QueUp...',
      'Eta.tooltip.notInQueue': "You're not in the queue",
      'Eta.tootltip': 'ETA: {{minutes}} minutes',
      'Snooze.tooltip': 'Mute for current song',
      'Snooze.tooltip.undo': 'Cancel mute for current song',
      'SnoozeVideo.tooltip': 'Hide video for current song',
      'SnoozeVideo.tooltip.undo': 'Cancel hiding video for current song',
      'Notifcation.permission.title': 'Desktop Notification',
      'Notification.permission.denied':
        "You have dismissed, or chosen to deny, the request to allow desktop notifications. If you change your mind, you will need to reset this in your browser's site settings.",
      'Notification.permission.notSupported':
        'Sorry this browser does not support desktop notifications.  Please update your browser to the lastest version',
      'Menu.title': 'Dub+ Options',
      'general.title': 'General',
      'user-interface.title': 'User Interface',
      'settings.title': 'Settings',
      'customize.title': 'Customize',
      'contact.title': 'Contact',
      'contact.bugs': 'Report bugs on Discord',
      'Switch.on': 'On',
      'Switch.off': 'Off',
      // this text is only read by screen readers but we should still translate it
      // it is the label of the little pencil icon
      'MenuItem.edit': 'Edit',
      'autovote.label': 'Autovote',
      'autovote.description': 'Toggles auto upvoting for every song',
      'afk.label': 'AFK Auto-respond',
      'afk.description': 'Toggle Away from Keyboard and customize AFK message.',
      'afk.modal.title': 'Custom AFK Message',
      'afk.modal.content': `Enter a custom "Away From Keyboard" [AFK] message here. Message will be prefixed with '[AFK]'`,
      'afk.modal.placeholder': 'Be right back!',
      'auto-afk.label': 'Auto AFK',
      'auto-afk.description':
        'Automatically set yourself to AFK after a certain amount of time of inactivity',
      'auto-afk.modal.title': 'Auto AFK Timer',
      'auto-afk.modal.content':
        'Enter the amount of time, in minutes, before you are set to AFK.',
      'auto-afk.modal.validation': 'Please enter a whole number greater than 0',
      'emotes.label': 'Emotes',
      'emotes.description':
        'Adds Twitch, Bttv, and FrankerFacez emotes in chat.',
      'autocomplete.label': 'Autocomplete Emoji',
      'autocomplete.description':
        'Toggle autocompleting emojis and emotes. Shows a preview box in the chat',
      'autocomplete.preview.a11y':
        'press up and down to navigate, press enter or tab to select, press esc to close',
      'autocomplete.preview.navigate': 'navigate',
      'autocomplete.preview.select': 'select',
      'autocomplete.preview.close': 'close',
      'custom-mentions.label': 'Custom Mentions',
      'custom-mentions.description':
        'Toggle using custom mentions to trigger sounds in chat',
      'custom-mentions.modal.title': 'Custom Mentions',
      'custom-mentions.modal.content':
        'Add your custom mention triggers here (separate by comma)',
      'custom-mentions.modal.placeholder':
        'separate, custom mentions, by, comma, :heart:',
      'chat-cleaner.label': 'Chat Cleaner',
      'chat-cleaner.description':
        'Help keep CPU stress down by setting a limit of how many chat messages to keep in the chat box, deleting older messages.',
      'chat-cleaner.modal.title': 'Chat Cleaner',
      'chat-cleaner.modal.content':
        'Please specify the number of most recent chat items that will remain in your chat history',
      'chat-cleaner.modal.validation':
        'Please enter a whole number greater than, or equal to, 1',
      'chat-cleaner.modal.placeholder': '500',
      'collapsible-images.label': 'Collapsible Images',
      'collapsible-images.description': 'Make images in the chat collapsible',
      'mention-notifications.label': 'Notification on Mentions',
      'mention-notifications.description':
        'Enable desktop notifications when a user mentions you in chat',
      'pm-notifications.label': 'Notification on PM',
      'pm-notifications.description':
        'Enable desktop notifications when a user receives a private message',
      'pm-notifications.notification.title': 'You have a new PM',
      'dj-notification.label': 'DJ Notification',
      'dj-notification.description':
        'Get a notification when you are coming up to be the DJ',
      'dj-notification.modal.title': 'DJ Notification',
      'dj-notification.modal.content':
        'Please specify the position in queue you want to be notified at. Use "0" to be notified when you start playing.',
      'dj-notification.notification.title': 'DJ Alert!',
      'dj-notification.notification.content':
        'You will be DJing shortly! Make sure your song is set!',
      'dj-notification.modal.validation':
        'Please enter a whole number greater than, or equal to, 0',
      'dubs-hover.label': 'Show Dubs on Hover',
      'dubs-hover.description':
        'Show who dubs a song when hovering over the dubs count',
      'dubs-hover.no-votes': 'No {{dubType}}s have been casted yet!',
      'dubs-hover.no-grabs': 'No one has grabbed this song yet!',
      'downdubs-in-chat.label': 'Downdubs in Chat (mods only)',
      'downdubs-in-chat.description':
        'Toggle showing downdubs in the chat box (mods only)',
      'downdubs-in-chat.chat-message':
        '@{{username}} has downdubbed your song {{song_name}}',
      'updubs-in-chat.label': 'Updubs in Chat',
      'updubs-in-chat.description': 'Toggle showing updubs in the chat box',
      'updubs-in-chat.chat-message':
        '@{{username}} has updubbed your song {{song_name}}',
      'grabs-in-chat.label': 'Grabs in Chat',
      'grabs-in-chat.description': 'Toggle showing grabs in the chat box',
      'grabs-in-chat.chat-message':
        '@{{username}} has grabbed your song {{song_name}}',
      'snow.label': 'Snow',
      'snow.description': 'Make it snow!',
      'rain.label': 'Rain',
      'rain.description': 'Make it rain!',
      'fullscreen.label': 'Fullscreen',
      'fullscreen.description': 'Toggle fullscreen video mode',
      'split-chat.label': 'Split Chat',
      'split-chat.description': 'Toggle Split Chat UI enhancement',
      'hide-chat.label': 'Hide Chat',
      'hide-chat.description': 'Toggles hiding the chat box',
      'hide-video.label': 'Hide Video',
      'hide-video.description': 'Toggles hiding the video box',
      'hide-avatars.label': 'Hide Avatars',
      'hide-avatars.description': 'Toggle hiding user avatars in the chat box',
      'hide-bg.label': 'Hide Background',
      'hide-bg.description': 'Toggle hiding background image',
      'show-timestamps.label': 'Show Timestamps',
      'show-timestamps.description':
        'Toggle always showing chat message timestamps',
      'flip-interface.label': 'Flip Interface',
      'flip-interface.description': 'Swap the video and chat positions',
      'pin-menu.label': 'Pin Menu',
      'pin-menu.description':
        'Pin the Dub+ menu to the left or right side. Use the action button to toggle which side it is pinned to. Only works in the non-mobile view',
      'pin-menu.secondaryAction.description':
        'Click to toggle between pinning to the left or right side',
      'spacebar-mute.label': 'Spacebar Mute',
      'spacebar-mute.description':
        'Turn on/off the ability to mute current song with the spacebar',
      'warn-redirect.label': 'Warn on Navigation',
      'warn-redirect.description':
        'Warns you when accidentally clicking on a link that takes you out of QueUp',
      'community-theme.label': 'Community Theme',
      'community-theme.description': 'Toggle Community CSS theme',
      'custom-css.label': 'Custom CSS',
      'custom-css.description': 'Add your own custom CSS.',
      'custom-css.modal.title': 'Custom CSS',
      'custom-css.modal.content': 'Enter a url location for your custom css',
      'custom-css.modal.placeholder': 'https://example.com/example.css',
      'custom-css.modal.validation': 'Invalid URL',
      'custom-bg.label': 'Custom Background',
      'custom-bg.description': 'Add your own custom background.',
      'custom-bg.modal.title': 'Custom Background Image',
      'custom-bg.modal.content':
        'Enter the full URL of an image. We recommend using a .jpg file. Leave blank to remove the current background image',
      'custom-bg.modal.placeholder': 'https://example.com/big-image.jpg',
      'custom-notification-sound.label': 'Custom Notification Sound',
      'custom-notification-sound.description':
        'Change the notification sound to a custom one.',
      'custom-notification-sound.modal.title': 'Custom Notification Sound',
      'custom-notification-sound.modal.content':
        "Enter the full URL of a sound file. We recommend using an .mp3 file. Leave blank to go back to QueUp's default sound",
      'custom-notification-sound.modal.placeholder':
        'https://example.com/sweet-sound.mp3',
      'custom-notification-sound.modal.validation':
        "Can't play sound from this URL. Please enter a valid URL to an MP3 file.",
      'grab-response.label': 'Grab Response',
      'grab-response.description': 'Sends a chat message when you grab a song',
      'grab-response.modal.title': 'Grab Response',
      'grab-response.modal.content':
        'Enter a message to send when you grab a song',
      'grab-response.modal.placeholder': 'Thanks for the song!',
    },
  };
  const locale = proxy({ current: 'en' });
  function translate(loc, key, vars) {
    let text2 = translations[loc][key];
    if (!text2 && loc !== 'en') {
      text2 = translations['en'][key];
    }
    if (!text2) {
      logError(`No translation found for ${loc}.${key}`);
      return key;
    }
    Object.keys(vars).forEach((item) => {
      const regex = new RegExp(`{{${item}}}`, 'g');
      text2 = text2.replace(regex, vars[item]);
    });
    return text2;
  }
  function t(key, vars = {}) {
    return translate(locale.current, key, vars);
  }
  var root$r = /* @__PURE__ */ from_html(
    `<div class="dubplus-waiting svelte-16mmbc"><div style="width: 26px; margin-right:5px"><!></div> <span style="flex: 1;"> </span></div>`,
  );
  function Loading($$anchor, $$props) {
    push($$props, false);
    init();
    var div = root$r();
    var div_1 = child(div);
    var node = child(div_1);
    Logo(node);
    var span = sibling(div_1, 2);
    var text2 = child(span);
    template_effect(($0) => set_text(text2, $0), [() => t('Loading.text')]);
    append($$anchor, div);
    pop();
  }
  const modalState = proxy({
    id: '',
    open: false,
    title: 'Dub+',
    content: '',
    value: '',
    placeholder: '',
    defaultValue: '',
    maxlength: 999,
    validation: () => {
      return true;
    },
    onConfirm: () => {
      return true;
    },
    onCancel: () => {},
  });
  function updateModalState(nextState) {
    modalState.open = nextState.open ?? false;
    modalState.title = nextState.title || 'Dub+';
    modalState.content = nextState.content || '';
    modalState.value = nextState.value || '';
    modalState.placeholder = nextState.placeholder || '';
    modalState.defaultValue = nextState.defaultValue;
    modalState.maxlength = nextState.maxlength || 999;
    modalState.onConfirm = nextState.onConfirm;
    modalState.onCancel = nextState.onCancel;
    modalState.validation = nextState.validation || (() => true);
  }
  var root_1$3 = /* @__PURE__ */ from_html(
    `<div class="default svelte-ascx4b"><span class="default-label svelte-ascx4b"> </span> <span class="default-value svelte-ascx4b"> </span></div>`,
  );
  var root_2$3 = /* @__PURE__ */ from_html(`<textarea class="svelte-ascx4b">
      </textarea>`);
  var root_3$1 = /* @__PURE__ */ from_html(
    `<p class="dp-modal--error svelte-ascx4b"> </p>`,
  );
  var root_4 = /* @__PURE__ */ from_html(
    `<button class="dp-modal--cancel cancel svelte-ascx4b"> </button> <button class="dp-modal--confirm confirm svelte-ascx4b"> </button>`,
    1,
  );
  var root_5 = /* @__PURE__ */ from_html(
    `<button class="dp-modal--cancel cancel svelte-ascx4b"> </button>`,
  );
  var root$q = /* @__PURE__ */ from_html(
    `<dialog id="dubplus-dialog" class="dp-modal svelte-ascx4b"><h1 class="svelte-ascx4b"> </h1> <div class="dp-modal--content content svelte-ascx4b"><p class="svelte-ascx4b"> </p> <!> <!> <!></div> <div class="dp-modal--buttons buttons svelte-ascx4b"><!></div></dialog>`,
  );
  function Modal($$anchor, $$props) {
    push($$props, true);
    let errorMessage = /* @__PURE__ */ state('');
    let dialog;
    onMount(() => {
      dialog =
        /**@type {HTMLDialogElement}*/
        document.getElementById('dubplus-dialog');
      dialog.addEventListener('close', () => {
        modalState.open = false;
      });
    });
    user_effect(() => {
      if (modalState.open && dialog && !dialog.open) {
        dialog.showModal();
      }
    });
    var dialog_1 = root$q();
    var h1 = child(dialog_1);
    var text2 = child(h1);
    var div = sibling(h1, 2);
    var p = child(div);
    var text_1 = child(p);
    var node = sibling(p, 2);
    {
      var consequent = ($$anchor2) => {
        var div_1 = root_1$3();
        var span = child(div_1);
        var text_2 = child(span);
        var span_1 = sibling(span, 2);
        var text_3 = child(span_1);
        template_effect(
          ($0) => {
            set_text(text_2, `${$0 ?? ''}:`);
            set_text(text_3, modalState.defaultValue);
          },
          [() => t('Modal.defaultValue')],
        );
        append($$anchor2, div_1);
      };
      if_block(node, ($$render) => {
        if (modalState.defaultValue) $$render(consequent);
      });
    }
    var node_1 = sibling(node, 2);
    {
      var consequent_1 = ($$anchor2) => {
        var textarea = root_2$3();
        template_effect(() => {
          set_attribute(textarea, 'placeholder', modalState.placeholder);
          set_attribute(
            textarea,
            'maxlength',
            modalState.maxlength < 999 ? modalState.maxlength : 999,
          );
        });
        bind_value(
          textarea,
          () => modalState.value,
          ($$value) => (modalState.value = $$value),
        );
        append($$anchor2, textarea);
      };
      if_block(node_1, ($$render) => {
        if (modalState.placeholder || modalState.value) $$render(consequent_1);
      });
    }
    var node_2 = sibling(node_1, 2);
    {
      var consequent_2 = ($$anchor2) => {
        var p_1 = root_3$1();
        var text_4 = child(p_1);
        template_effect(() => set_text(text_4, get(errorMessage)));
        append($$anchor2, p_1);
      };
      if_block(node_2, ($$render) => {
        if (get(errorMessage)) $$render(consequent_2);
      });
    }
    var div_2 = sibling(div, 2);
    var node_3 = child(div_2);
    {
      var consequent_3 = ($$anchor2) => {
        var fragment = root_4();
        var button = first_child(fragment);
        button.__click = () => {
          dialog.close();
          modalState.open = false;
          set(errorMessage, '');
          if (typeof modalState.onCancel === 'function') {
            modalState.onCancel();
          }
        };
        var text_5 = child(button);
        var button_1 = sibling(button, 2);
        button_1.__click = () => {
          const isValidOrErrorMessage = modalState.validation(modalState.value);
          if (isValidOrErrorMessage === true) {
            dialog.close();
            modalState.open = false;
            modalState.onConfirm(modalState.value);
            set(errorMessage, '');
          } else {
            set(errorMessage, isValidOrErrorMessage, true);
          }
        };
        var text_6 = child(button_1);
        template_effect(
          ($0, $1) => {
            set_text(text_5, $0);
            set_text(text_6, $1);
          },
          [() => t('Modal.cancel'), () => t('Modal.confirm')],
        );
        append($$anchor2, fragment);
      };
      var alternate = ($$anchor2) => {
        var button_2 = root_5();
        button_2.__click = () => {
          dialog.close();
          modalState.open = false;
          set(errorMessage, '');
        };
        var text_7 = child(button_2);
        template_effect(($0) => set_text(text_7, $0), [() => t('Modal.close')]);
        append($$anchor2, button_2);
      };
      if_block(node_3, ($$render) => {
        if (typeof modalState.onConfirm === 'function') $$render(consequent_3);
        else $$render(alternate, false);
      });
    }
    template_effect(() => {
      set_text(text2, modalState.title);
      set_text(text_1, modalState.content);
    });
    append($$anchor, dialog_1);
    pop();
  }
  delegate(['click']);
  const teleport = (node, { to, position = 'append' }) => {
    user_effect(() => {
      var _a2;
      if (node.id) {
        (_a2 = document.getElementById(node.id)) == null
          ? void 0
          : _a2.remove();
      }
      const teleportContainer = document.querySelector(to);
      if (!teleportContainer) {
        throw new Error(`teleport container not found: ${to}`);
      }
      if (position === 'append') {
        teleportContainer.appendChild(node);
      } else {
        teleportContainer.prepend(node);
      }
      return () => {
        node.remove();
      };
    });
  };
  function getChatInput() {
    return document.querySelector('#chat-txt-message');
  }
  function getChatContainer() {
    return document.querySelector('ul.chat-main');
  }
  function getChatMessages(extra = '') {
    return document.querySelectorAll(`ul.chat-main > li${extra}`);
  }
  function getImagesInChat() {
    return document.querySelectorAll('.chat-main > li .autolink-image');
  }
  function getBackgroundImage() {
    return document.querySelector('.backstretch img');
  }
  function getQueuePosition() {
    return document.querySelector('.queue-position');
  }
  function getQueueTotal() {
    return document.querySelector('.queue-total');
  }
  function getPlayerIframe() {
    return document.querySelector('.player_container iframe');
  }
  function getPrivateMessageButton() {
    return document.querySelector('.user-messages');
  }
  function getPrivateMessage(messageId) {
    return document.querySelector(
      `.message-item[data-messageid="${messageId}"]`,
    );
  }
  function getDubUp() {
    return document.querySelector('.dubup');
  }
  function getDubDown() {
    return document.querySelector('.dubdown');
  }
  function getAddToPlaylist() {
    return document.querySelector('.add-to-playlist');
  }
  function getCurrentSongMinutes() {
    return document.querySelector('div.currentTime span.min');
  }
  const CHAT_INPUT_CONTAINER = '.pusher-chat-widget-input';
  const DUBPLUS_MENU_CONTAINER = '.header-right-navigation';
  const PLAYER_SHARING_CONTAINER = '.player_sharing';
  var on_click$1 = () => {
    document
      .querySelector('.dubplus-menu')
      .classList.toggle('dubplus-menu-open');
  };
  var root$p = /* @__PURE__ */ from_html(
    `<button id="dubplus-menu-icon" type="button" aria-label="Dub+ menu" class="dubplus-icon svelte-9z7rrn"><!></button>`,
  );
  function MenuIcon($$anchor, $$props) {
    push($$props, false);
    init();
    var button = root$p();
    button.__click = [on_click$1];
    var node = child(button);
    Logo(node);
    action(
      button,
      ($$node, $$action_arg) =>
        teleport == null ? void 0 : teleport($$node, $$action_arg),
      () => ({ to: DUBPLUS_MENU_CONTAINER }),
    );
    append($$anchor, button);
    pop();
  }
  delegate(['click']);
  const optionsKeyMap = {
    'dubplus-autovote': 'autovote',
    'dubplus-afk': 'afk',
    'dubplus-emotes': 'emotes',
    'dubplus-autocomplete': 'autocomplete',
    custom_mentions: 'custom-mentions',
    'chat-cleaner': 'chat-cleaner',
    mention_notifications: 'mention-notifications',
    dubplus_pm_notifications: 'pm-notifications',
    dj_notification: 'dj-notification',
    'dubplus-dubs-hover': 'dubs-hover',
    'dubplus-downdubs': 'downdubs-in-chat',
    'dubplus-updubs': 'updubs-in-chat',
    'dubplus-grabschat': 'grabs-in-chat',
    'dubplus-snow': 'snow',
    'dubplus-rain': 'rain',
    'dubplus-fullscreen': 'fullscreen',
    'dubplus-split-chat': 'split-chat',
    'dubplus-video-only': 'hide-chat',
    'dubplus-chat-only': 'hide-video',
    'dubplus-hide-avatars': 'hide-avatars',
    'dubplus-hide-bg': 'hide-bg',
    'dubplus-show-timestamp': 'show-timestamps',
    'dubplus-spacebar-mute': 'spacebar-mute',
    warn_redirect: 'warn-redirect',
    'dubplus-comm-theme': 'community-theme',
    'dubplus-custom-css': 'custom-css',
    'dubplus-custom-bg': 'custom-bg',
    'dubplus-custom-notification-sound': 'custom-notification-sound',
  };
  const customKeyMap = {
    customAfkMessage: optionsKeyMap['dubplus-afk'],
    custom_mentions: optionsKeyMap['custom_mentions'],
    chat_cleaner: optionsKeyMap['chat-cleaner'],
    dj_notification: optionsKeyMap['dj_notification'],
    css: optionsKeyMap['dubplus-custom-css'],
    bg: optionsKeyMap['dubplus-custom-bg'],
    notificationSound: optionsKeyMap['dubplus-custom-notification-sound'],
    'dubplus-custom-notification-sound':
      optionsKeyMap['dubplus-custom-notification-sound'],
  };
  function migrate(oldSettings) {
    logInfo('Old Settings', oldSettings);
    const newOptions = {
      options: {},
      menu: { ...oldSettings.menu },
      custom: {},
    };
    for (const [oldKey, boolValue] of Object.entries(oldSettings.options)) {
      const newKey = optionsKeyMap[oldKey];
      try {
        newOptions.options[newKey] = boolValue;
      } catch (e) {
        logError(
          'Error converting options',
          e.message,
          oldKey,
          newKey,
          boolValue,
        );
      }
    }
    for (const [oldKey, stringValue] of Object.entries(oldSettings.custom)) {
      const newKey = customKeyMap[oldKey];
      try {
        newOptions.custom[newKey] = stringValue;
      } catch (e) {
        logError(
          'Error converting custom',
          e.message,
          oldKey,
          newKey,
          stringValue,
        );
      }
    }
    return newOptions;
  }
  const STORAGE_KEY_OLD = 'dubplusUserSettings';
  const STORAGE_KEY_NEW = 'dubplusUserSettingsV2';
  const defaults = {
    options: {},
    menu: {
      general: 'open',
      'user-interface': 'open',
      settings: 'open',
      customize: 'open',
      contact: 'open',
    },
    custom: {},
  };
  function loadSettings() {
    try {
      const v2Settings = JSON.parse(localStorage.getItem(STORAGE_KEY_NEW));
      if (v2Settings) {
        return (
          /**@type {import("../../global").Settings}*/
          v2Settings
        );
      }
    } catch (e) {
      logInfo('Error loading v2 settings, trying old settings. Error:', e);
    }
    try {
      const oldSettings = JSON.parse(localStorage.getItem(STORAGE_KEY_OLD));
      if (oldSettings) {
        return migrate(
          /**@type {import("../../global").Settings}*/
          oldSettings,
        );
      }
    } catch (e) {
      logInfo('Error loading old settings:', e);
    }
    return {};
  }
  const intialSettings = Object.assign({}, defaults, loadSettings());
  let settings = proxy(intialSettings);
  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY_NEW, JSON.stringify(settings));
    } catch (e) {
      logError('Error saving user settings:', e);
    }
  }
  function saveSetting(section, property, value) {
    if (section === 'option') {
      settings.options[property] = value;
      persist();
      return;
    }
    if (section === 'custom') {
      settings.custom[property] = value;
      persist();
      return;
    }
    if (section === 'menu') {
      settings.menu[property] = value;
      persist();
      return;
    }
    throw new Error(`Invalid section: "${section}"`);
  }
  var root$o = /* @__PURE__ */ from_html(
    `<button type="button" class="dubplus-menu-section-header svelte-31yg9a"><span></span> <p class="svelte-31yg9a"> </p></button>`,
  );
  function MenuHeader($$anchor, $$props) {
    push($$props, true);
    let arrow = /* @__PURE__ */ state('down');
    let expanded = /* @__PURE__ */ state(true);
    user_effect(() => {
      if (settings.menu[$$props.settingsId] === 'closed') {
        set(arrow, 'right');
        set(expanded, false);
      } else {
        set(arrow, 'down');
        set(expanded, true);
      }
    });
    function toggle() {
      settings.menu[$$props.settingsId] =
        settings.menu[$$props.settingsId] === 'closed' ? 'open' : 'closed';
      saveSetting(
        'menu',
        $$props.settingsId,
        settings.menu[$$props.settingsId],
      );
    }
    var button = root$o();
    button.__click = toggle;
    var span = child(button);
    var p = sibling(span, 2);
    var text2 = child(p);
    template_effect(() => {
      set_attribute(
        button,
        'id',
        `dubplus-menu-section-header-${$$props.settingsId}`,
      );
      set_attribute(button, 'aria-expanded', get(expanded));
      set_attribute(
        button,
        'aria-controls',
        `dubplus-menu-section-${$$props.settingsId}`,
      );
      set_class(span, 1, `fa fa-angle-${get(arrow) ?? ''}`, 'svelte-31yg9a');
      set_text(text2, $$props.name);
    });
    append($$anchor, button);
    pop();
  }
  delegate(['click']);
  var root$n = /* @__PURE__ */ from_html(
    `<ul class="dubplus-menu-section svelte-1pjvan3" role="region"><!></ul>`,
  );
  function MenuSection($$anchor, $$props) {
    var ul = root$n();
    var node = child(ul);
    snippet(node, () => $$props.children);
    template_effect(() => {
      set_attribute(ul, 'id', `dubplus-menu-section-${$$props.settingsId}`);
      set_attribute(
        ul,
        'aria-labelledby',
        `dubplus-menu-section-header-${$$props.settingsId}`,
      );
    });
    append($$anchor, ul);
  }
  var root$m = /* @__PURE__ */ from_html(
    `<li class="dubplus-menu-icon svelte-1oilhp7"><!> <a class="dubplus-menu-label svelte-1oilhp7" target="_blank"> </a></li>`,
  );
  function MenuLink($$anchor, $$props) {
    var li = root$m();
    var node = child(li);
    component(
      node,
      () => $$props.icon,
      ($$anchor2, Icon_1) => {
        Icon_1($$anchor2, {});
      },
    );
    var a = sibling(node, 2);
    var text_1 = child(a);
    template_effect(() => {
      set_attribute(a, 'href', $$props.href);
      set_text(text_1, $$props.text);
    });
    append($$anchor, li);
  }
  var root$l = /* @__PURE__ */ from_svg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0c53 0 96 43 96 96l0 3.6c0 15.7-12.7 28.4-28.4 28.4l-135.1 0c-15.7 0-28.4-12.7-28.4-28.4l0-3.6c0-53 43-96 96-96zM41.4 105.4c12.5-12.5 32.8-12.5 45.3 0l64 64c.7 .7 1.3 1.4 1.9 2.1c14.2-7.3 30.4-11.4 47.5-11.4l112 0c17.1 0 33.2 4.1 47.5 11.4c.6-.7 1.2-1.4 1.9-2.1l64-64c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-64 64c-.7 .7-1.4 1.3-2.1 1.9c6.2 12 10.1 25.3 11.1 39.5l64.3 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c0 24.6-5.5 47.8-15.4 68.6c2.2 1.3 4.2 2.9 6 4.8l64 64c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0l-63.1-63.1c-24.5 21.8-55.8 36.2-90.3 39.6L272 240c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 239.2c-34.5-3.4-65.8-17.8-90.3-39.6L86.6 502.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l64-64c1.9-1.9 3.9-3.4 6-4.8C101.5 367.8 96 344.6 96 320l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64.3 0c1.1-14.1 5-27.5 11.1-39.5c-.7-.6-1.4-1.2-2.1-1.9l-64-64c-12.5-12.5-12.5-32.8 0-45.3z"></path></svg>`,
  );
  function IconBug($$anchor) {
    var svg = root$l();
    append($$anchor, svg);
  }
  var root$k = /* @__PURE__ */ from_svg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32zM305.9 166.4c20.6 0 37.3-16.7 37.3-37.3s-16.7-37.3-37.3-37.3c-18 0-33.1 12.8-36.6 29.8c-30.2 3.2-53.8 28.8-53.8 59.9l0 .2c-32.8 1.4-62.8 10.7-86.6 25.5c-8.8-6.8-19.9-10.9-32-10.9c-28.9 0-52.3 23.4-52.3 52.3c0 21 12.3 39 30.1 47.4c1.7 60.7 67.9 109.6 149.3 109.6s147.6-48.9 149.3-109.7c17.7-8.4 29.9-26.4 29.9-47.3c0-28.9-23.4-52.3-52.3-52.3c-12 0-23 4-31.9 10.8c-24-14.9-54.3-24.2-87.5-25.4l0-.1c0-22.2 16.5-40.7 37.9-43.7l0 0c3.9 16.5 18.7 28.7 36.3 28.7zM155 248.1c14.6 0 25.8 15.4 25 34.4s-11.8 25.9-26.5 25.9s-27.5-7.7-26.6-26.7s13.5-33.5 28.1-33.5zm166.4 33.5c.9 19-12 26.7-26.6 26.7s-25.6-6.9-26.5-25.9c-.9-19 10.3-34.4 25-34.4s27.3 14.6 28.1 33.5zm-42.1 49.6c-9 21.5-30.3 36.7-55.1 36.7s-46.1-15.1-55.1-36.7c-1.1-2.6 .7-5.4 3.4-5.7c16.1-1.6 33.5-2.5 51.7-2.5s35.6 .9 51.7 2.5c2.7 .3 4.5 3.1 3.4 5.7z"></path></svg>`,
  );
  function IconReddit($$anchor) {
    var svg = root$k();
    append($$anchor, svg);
  }
  var root$j = /* @__PURE__ */ from_svg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64h98.2V334.2H109.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H255V480H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"></path></svg>`,
  );
  function IconFacebook($$anchor) {
    var svg = root$j();
    append($$anchor, svg);
  }
  var root$i = /* @__PURE__ */ from_svg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM351.3 199.3v0c0 86.7-66 186.6-186.6 186.6c-37.2 0-71.7-10.8-100.7-29.4c5.3 .6 10.4 .8 15.8 .8c30.7 0 58.9-10.4 81.4-28c-28.8-.6-53-19.5-61.3-45.5c10.1 1.5 19.2 1.5 29.6-1.2c-30-6.1-52.5-32.5-52.5-64.4v-.8c8.7 4.9 18.9 7.9 29.6 8.3c-9-6-16.4-14.1-21.5-23.6s-7.8-20.2-7.7-31c0-12.2 3.2-23.4 8.9-33.1c32.3 39.8 80.8 65.8 135.2 68.6c-9.3-44.5 24-80.6 64-80.6c18.9 0 35.9 7.9 47.9 20.7c14.8-2.8 29-8.3 41.6-15.8c-4.9 15.2-15.2 28-28.8 36.1c13.2-1.4 26-5.1 37.8-10.2c-8.9 13.1-20.1 24.7-32.9 34c.2 2.8 .2 5.7 .2 8.5z"></path></svg>`,
  );
  function IconTwitter($$anchor) {
    var svg = root$i();
    append($$anchor, svg);
  }
  var root_1$2 = /* @__PURE__ */ from_html(`<!> <!> <!> <!>`, 1);
  var root$h = /* @__PURE__ */ from_html(`<!> <!>`, 1);
  function Contact($$anchor, $$props) {
    push($$props, false);
    init();
    var fragment = root$h();
    var node = first_child(fragment);
    {
      let $0 = /* @__PURE__ */ derived_safe_equal(() => t('contact.title'));
      MenuHeader(node, {
        settingsId: 'contact',
        get name() {
          return get($0);
        },
      });
    }
    var node_1 = sibling(node, 2);
    MenuSection(node_1, {
      settingsId: 'contact',
      children: ($$anchor2, $$slotProps) => {
        var fragment_1 = root_1$2();
        var node_2 = first_child(fragment_1);
        {
          let $0 = /* @__PURE__ */ derived_safe_equal(() => t('contact.bugs'));
          MenuLink(node_2, {
            get icon() {
              return IconBug;
            },
            href: 'https://discord.gg/XUkG3Qy',
            get text() {
              return get($0);
            },
          });
        }
        var node_3 = sibling(node_2, 2);
        MenuLink(node_3, {
          get icon() {
            return IconReddit;
          },
          href: 'https://www.reddit.com/r/DubPlus/',
          text: 'Reddit',
        });
        var node_4 = sibling(node_3, 2);
        MenuLink(node_4, {
          get icon() {
            return IconFacebook;
          },
          href: 'https://facebook.com/DubPlusScript',
          text: 'Facebook',
        });
        var node_5 = sibling(node_4, 2);
        MenuLink(node_5, {
          get icon() {
            return IconTwitter;
          },
          href: 'https://twitter.com/DubPlusScript',
          text: 'Twitter',
        });
        append($$anchor2, fragment_1);
      },
    });
    append($$anchor, fragment);
    pop();
  }
  function handleKeydown(event2, $$props, toggleOption) {
    if ($$props.disabled) return;
    if (event2.key === 'Enter' || event2.key === ' ') {
      event2.preventDefault();
      toggleOption();
    }
  }
  function handleClick(_, $$props, toggleOption) {
    if ($$props.disabled) return;
    toggleOption();
  }
  var root$g = /* @__PURE__ */ from_html(
    `<div role="switch" tabindex="0" class="svelte-1mny4ma"><span class="dubplus-switch svelte-1mny4ma"><span class="svelte-1mny4ma"></span></span> <span class="dubplus-switch-label svelte-1mny4ma"> </span></div>`,
  );
  function Switch($$anchor, $$props) {
    push($$props, true);
    function toggleOption() {
      settings.options[$$props.optionId] = !settings.options[$$props.optionId];
      $$props.onToggle(settings.options[$$props.optionId]);
    }
    var div = root$g();
    div.__click = [
      /**
       * @param {KeyboardEvent} event
       */
      handleClick,
      $$props,
      toggleOption,
    ];
    div.__keydown = [handleKeydown, $$props, toggleOption];
    var span = sibling(child(div), 2);
    var text2 = child(span);
    template_effect(() => {
      set_attribute(div, 'aria-disabled', $$props.disabled ? 'true' : 'false');
      set_attribute(
        div,
        'aria-checked',
        settings.options[$$props.optionId] ? 'true' : 'false',
      );
      set_text(text2, $$props.label);
    });
    append($$anchor, div);
    pop();
  }
  delegate(['click', 'keydown']);
  var root$f = /* @__PURE__ */ from_svg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg>`,
  );
  function IconPencil($$anchor) {
    var svg = root$f();
    append($$anchor, svg);
  }
  function isMod(userid) {
    return (
      window.QueUp.helpers.isSiteAdmin(userid) ||
      window.QueUp.room.users.getIfOwner(userid) ||
      window.QueUp.room.users.getIfManager(userid) ||
      window.QueUp.room.users.getIfMod(userid)
    );
  }
  var root_1$1 = /* @__PURE__ */ from_html(
    `<button type="button" class="svelte-1dzj03i"><!> <span class="sr-only"> </span></button>`,
  );
  var root_2$2 = /* @__PURE__ */ from_html(
    `<button type="button" class="svelte-1dzj03i"><!> <span class="sr-only"> </span></button>`,
  );
  var root$e = /* @__PURE__ */ from_html(`<li><!> <!> <!></li>`);
  function MenuSwitch($$anchor, $$props) {
    var _a2;
    push($$props, true);
    const SecondaryIcon =
      ((_a2 = $$props.secondaryAction) == null ? void 0 : _a2.icon) ||
      IconPencil;
    onMount(() => {
      if ($$props.init) $$props.init();
      if (settings.options[$$props.id]) {
        const allowed = $$props.modOnly ? isMod(window.QueUp.session.id) : true;
        if (allowed) $$props.turnOn(true);
      }
    });
    onDestroy(() => {
      if (settings.options[$$props.id]) {
        $$props.turnOff();
      }
    });
    function openEditModal() {
      updateModalState({
        title: t($$props.customize.title),
        content: t($$props.customize.content),
        placeholder: t($$props.customize.placeholder),
        defaultValue: $$props.customize.defaultValue
          ? t($$props.customize.defaultValue)
          : '',
        maxlength: $$props.customize.maxlength,
        value: settings.custom[$$props.id] || '',
        validation: $$props.customize.validation,
        onConfirm: (value) => {
          saveSetting('custom', $$props.id, value);
          if (value.trim() === '' && !$$props.customize.defaultValue) {
            saveSetting('option', $$props.id, false);
            $$props.turnOff();
          }
          if (typeof $$props.customize.onConfirm === 'function') {
            $$props.customize.onConfirm(value);
          }
        },
        onCancel: () => {
          if (
            !$$props.customize.defaultValue &&
            (typeof settings.custom[$$props.id] === 'undefined' ||
              settings.custom[$$props.id] === '')
          ) {
            saveSetting('option', $$props.id, false);
            $$props.turnOff();
          }
          if (typeof $$props.customize.onCancel === 'function')
            $$props.customize.onCancel();
        },
      });
      modalState.open = true;
    }
    var li = root$e();
    let classes;
    var node = child(li);
    {
      let $0 = /* @__PURE__ */ user_derived(() =>
        $$props.modOnly ? !isMod(window.QueUp.session.id) : false,
      );
      let $1 = /* @__PURE__ */ user_derived(() => t($$props.label));
      Switch(node, {
        get disabled() {
          return get($0);
        },
        get label() {
          return get($1);
        },
        onToggle: (state2) => {
          if (
            $$props.customize &&
            state2 === true &&
            !settings.custom[$$props.id]
          ) {
            openEditModal();
            return;
          }
          saveSetting('option', $$props.id, state2);
          if (state2) {
            $$props.turnOn();
          } else {
            $$props.turnOff();
          }
        },
        get optionId() {
          return $$props.id;
        },
      });
    }
    var node_1 = sibling(node, 2);
    {
      var consequent = ($$anchor2) => {
        var button = root_1$1();
        button.__click = openEditModal;
        var node_2 = child(button);
        IconPencil(node_2);
        var span = sibling(node_2, 2);
        var text2 = child(span);
        template_effect(
          ($0) => set_text(text2, $0),
          [() => t('MenuItem.edit')],
        );
        append($$anchor2, button);
      };
      if_block(node_1, ($$render) => {
        if ($$props.customize) $$render(consequent);
      });
    }
    var node_3 = sibling(node_1, 2);
    {
      var consequent_1 = ($$anchor2) => {
        var button_1 = root_2$2();
        button_1.__click = function (...$$args) {
          var _a3;
          (_a3 = $$props.secondaryAction.onClick) == null
            ? void 0
            : _a3.apply(this, $$args);
        };
        var node_4 = child(button_1);
        SecondaryIcon(node_4, {});
        var span_1 = sibling(node_4, 2);
        var text_1 = child(span_1);
        template_effect(
          ($0, $1) => {
            set_attribute(button_1, 'title', $0);
            set_text(text_1, $1);
          },
          [
            () => t($$props.secondaryAction.description),
            () => t($$props.secondaryAction.description),
          ],
        );
        append($$anchor2, button_1);
      };
      if_block(node_3, ($$render) => {
        if ($$props.secondaryAction) $$render(consequent_1);
      });
    }
    template_effect(
      ($0, $1) => {
        set_attribute(li, 'id', `dubplus-${$$props.id}`);
        set_attribute(li, 'title', $0);
        classes = set_class(li, 1, 'svelte-1dzj03i', null, classes, $1);
      },
      [
        () => t($$props.description),
        () => ({
          disabled: $$props.modOnly ? !isMod(window.QueUp.session.id) : false,
        }),
      ],
    );
    append($$anchor, li);
    pop();
  }
  delegate(['click']);
  const DUB = 'realtime:room_playlist-dub';
  const GRAB = 'realtime:room_playlist-queue-update-grabs';
  const USER_LEAVE = 'realtime:user-leave';
  const PLAYLIST_UPDATE = 'realtime:room_playlist-update';
  const CHAT_MESSAGE = 'realtime:chat-message';
  const NEW_PM_MESSAGE = 'realtime:new-message';
  function voteCheck() {
    var _a2, _b, _c;
    (_c =
      (_b = (_a2 = window.QueUp) == null ? void 0 : _a2.playerController) ==
      null
        ? void 0
        : _b.voteUp) == null
      ? void 0
      : _c.click();
  }
  const autovote = {
    id: 'autovote',
    label: 'autovote.label',
    description: 'autovote.description',
    category: 'general',
    turnOff() {
      window.QueUp.Events.unbind(PLAYLIST_UPDATE, voteCheck);
    },
    turnOn() {
      voteCheck();
      window.QueUp.Events.bind(PLAYLIST_UPDATE, voteCheck);
    },
  };
  function insertQueupChat(className, textContent) {
    const li = document.createElement('li');
    li.className = `dubplus-chat-system ${className}`;
    const chatDelete = document.createElement('div');
    chatDelete.className = 'chatDelete';
    chatDelete.onclick = function (e) {
      e.target.parentElement.remove();
    };
    const span = document.createElement('span');
    span.className = 'icon-close';
    chatDelete.appendChild(span);
    li.appendChild(chatDelete);
    const text2 = document.createElement('div');
    text2.className = 'text';
    text2.textContent = textContent;
    li.appendChild(text2);
    getChatContainer().appendChild(li);
  }
  function sendChatMessage(message) {
    const chatInput = getChatInput();
    const messageOriginal = chatInput.value;
    chatInput.value = message;
    window.QueUp.room.chat.sendMessage();
    if (messageOriginal) chatInput.value = messageOriginal;
  }
  let canSend = true;
  function afk_chat_respond(e) {
    if (!canSend) {
      return;
    }
    const content = e.message;
    const user = window.QueUp.session.get('username');
    if (
      content.includes(`@${user}`) &&
      window.QueUp.session.id !== e.user.userInfo.userid
    ) {
      let chatMessage = '';
      if (settings.custom.afk) {
        chatMessage = `[AFK] ${settings.custom.afk}`;
      } else {
        chatMessage = `[AFK] ${t('afk.modal.placeholder')}`;
      }
      sendChatMessage(chatMessage);
      canSend = false;
      setTimeout(() => {
        canSend = true;
      }, 3e4);
    }
  }
  const afk = {
    id: 'afk',
    label: 'afk.label',
    description: 'afk.description',
    category: 'general',
    turnOn() {
      window.QueUp.Events.bind(CHAT_MESSAGE, afk_chat_respond);
    },
    turnOff() {
      window.QueUp.Events.unbind(CHAT_MESSAGE, afk_chat_respond);
    },
    custom: {
      title: 'afk.modal.title',
      content: 'afk.modal.content',
      placeholder: 'afk.modal.placeholder',
      defaultValue: 'afk.modal.placeholder',
      maxlength: 255,
    },
  };
  class LDB {
    constructor() {
      this.db = null;
      const dbReq = window.indexedDB.open('d2', 1);
      const outerThis = this;
      dbReq.onsuccess = function () {
        outerThis.db = this.result;
      };
      dbReq.onerror = function (e) {
        console.error('Dub+', 'indexedDB request error:', e);
      };
      dbReq.onupgradeneeded = function () {
        outerThis.db = null;
        var t2 = this.result.createObjectStore('s', { keyPath: 'k' });
        t2.transaction.oncomplete = function () {
          outerThis.db = this.db;
        };
      };
    }
    /**
     *
     * @param {string} key
     * @returns {Promise<string|null>}
     */
    get(key) {
      return new Promise((resolve) => {
        if (this.db) {
          this.db.transaction('s').objectStore('s').get(key).onsuccess =
            function () {
              var _a2;
              resolve(((_a2 = this.result) == null ? void 0 : _a2.v) || null);
            };
        } else {
          setTimeout(() => {
            this.get(key).then(resolve);
          }, 100);
        }
      });
    }
    /**
     *
     * @param {string} key
     * @param {string} value
     */
    set(key, value) {
      this.db
        .transaction('s', 'readwrite')
        .objectStore('s')
        .put({ k: key, v: value });
    }
  }
  const ldb = new LDB();
  function fetchTwitchEmotes() {
    return fetch(
      '//cdn.jsdelivr.net/gh/Jiiks/BetterDiscordApp/data/emotedata_twitch_global.json',
    ).then((res) => res.json());
  }
  function fetchBTTVEmotes() {
    return fetch('//api.betterttv.net/3/cached/emotes/global').then((res) =>
      res.json(),
    );
  }
  function fetchFrankerFacezEmotes() {
    return fetch(
      '//api.frankerfacez.com/v1/emoticons?per_page=200&private=off&sort=count-desc',
    ).then((res) => res.json());
  }
  const dubplus_emoji = {
    emoji: {
      /**
       * @param {string} id
       * @returns {string}
       */
      template(id) {
        id = id.replace(/:/g, '');
        return `${window.emojify.defaultConfig.img_dir}/${encodeURI(id)}.png`;
      },
    },
    twitchJSONSLoaded: false,
    bttvJSONSLoaded: false,
    frankerfacezJSONLoaded: false,
    twitch: {
      /**
       * @param {string} id
       * @returns {string}
       */
      template(id) {
        return `//static-cdn.jtvnw.net/emoticons/v1/${id}/3.0`;
      },
      /**
       * @type {Map<string, string>}
       */
      emotesMap: /* @__PURE__ */ new Map(),
    },
    bttv: {
      /**
       * @param {string} id
       * @returns {string}
       */
      template(id) {
        return `//cdn.betterttv.net/emote/${id}/3x`;
      },
      /**
       * @type {Map<string, string>}
       */
      emotesMap: /* @__PURE__ */ new Map(),
    },
    frankerFacez: {
      /**
       * @param {number} id
       * @returns {string}
       */
      template(id) {
        return `//cdn.frankerfacez.com/emoticon/${id}/1`;
      },
      /**
       * @type {Map<string, number>}
       */
      emotesMap: /* @__PURE__ */ new Map(),
    },
    /**
     *
     * @param {string} apiName
     * @returns {Promise<boolean>}
     */
    shouldUpdateAPIs(apiName) {
      const day = 864e5;
      return ldb.get(`${apiName}_api`).then((savedItem) => {
        if (savedItem) {
          try {
            const parsed = JSON.parse(savedItem);
            if (typeof parsed.error !== 'undefined') {
              return true;
            }
          } catch {
            return true;
          }
        }
        const today = Date.now();
        const lastSaved = parseInt(
          localStorage.getItem(`${apiName}_api_timestamp`),
        );
        return isNaN(lastSaved) || today - lastSaved > day * 5 || !savedItem;
      });
    },
    /**************************************************************************
     * Loads the twitch emotes from the api.
     * http://api.twitch.tv/kraken/chat/emoticon_images
     */
    /**
     * @return {Promise<void>}
     */
    loadTwitchEmotes() {
      if (this.twitchJSONSLoaded) {
        return Promise.resolve();
      }
      return this.shouldUpdateAPIs('twitch').then((shouldUpdate) => {
        if (shouldUpdate) {
          logInfo('twitch', 'loading from api');
          return fetchTwitchEmotes()
            .then((json) => {
              const twitchEmotes = {};
              for (const emote in json.emotes) {
                if (!twitchEmotes[emote]) {
                  twitchEmotes[emote] = json.emotes[emote].image_id;
                }
              }
              localStorage.setItem(
                'twitch_api_timestamp',
                Date.now().toString(),
              );
              ldb.set('twitch_api', JSON.stringify(twitchEmotes));
              dubplus_emoji.processTwitchEmotes(twitchEmotes);
            })
            .catch((err) => logError(err));
        } else {
          return ldb.get('twitch_api').then((data) => {
            logInfo('twitch', 'loading from IndexedDB');
            const savedData = JSON.parse(data);
            dubplus_emoji.processTwitchEmotes(savedData);
          });
        }
      });
    },
    /**
     * @return {Promise<void>}
     */
    loadBTTVEmotes() {
      if (this.bttvJSONSLoaded) {
        return Promise.resolve();
      }
      return this.shouldUpdateAPIs('bttv').then((shouldUpdate) => {
        if (shouldUpdate) {
          logInfo('bttv', 'loading from api');
          return fetchBTTVEmotes()
            .then((json) => {
              const bttvEmotes = {};
              json.forEach((e) => {
                if (!bttvEmotes[e.code]) {
                  bttvEmotes[e.code] = e.id;
                }
              });
              localStorage.setItem('bttv_api_timestamp', Date.now().toString());
              ldb.set('bttv_api', JSON.stringify(bttvEmotes));
              dubplus_emoji.processBTTVEmotes(bttvEmotes);
            })
            .catch((err) => logError(err));
        } else {
          return ldb.get('bttv_api').then((data) => {
            logInfo('bttv', 'loading from IndexedDB');
            const savedData = JSON.parse(data);
            dubplus_emoji.processBTTVEmotes(savedData);
          });
        }
      });
    },
    /**
     * @return {Promise<void>}
     */
    loadFrankerFacez() {
      if (this.frankerfacezJSONLoaded) {
        return Promise.resolve();
      }
      return this.shouldUpdateAPIs('frankerfacez').then((shouldUpdate) => {
        if (shouldUpdate) {
          logInfo('frankerfacez', 'loading from api');
          return fetchFrankerFacezEmotes()
            .then((json) => {
              const frankerFacez = json;
              localStorage.setItem(
                'frankerfacez_api_timestamp',
                Date.now().toString(),
              );
              ldb.set('frankerfacez_api', JSON.stringify(frankerFacez));
              dubplus_emoji.processFrankerFacez(frankerFacez);
            })
            .catch((err) => logError(err));
        } else {
          return ldb.get('frankerfacez_api').then((data) => {
            logInfo('frankerfacez', 'loading from IndexedDB');
            const savedData = JSON.parse(data);
            dubplus_emoji.processFrankerFacez(savedData);
          });
        }
      });
    },
    /**
     *
     * @param {{[emote: string]: string}} data
     */
    processTwitchEmotes(data) {
      for (const code in data) {
        if (Object.hasOwn(data, code)) {
          const key = code.toLowerCase();
          if (window.emojify.emojiNames.includes(key)) {
            this.twitch.emotesMap.set(`${key}_twitch`, data[code]);
          } else {
            this.twitch.emotesMap.set(key, data[code]);
          }
        }
      }
      this.twitchJSONSLoaded = true;
    },
    /**
     * @param {{[emote: string]: string}} data
     */
    processBTTVEmotes(data) {
      for (const code in data) {
        if (Object.hasOwn(data, code)) {
          const key = code.toLowerCase();
          if (code.includes(':')) {
            continue;
          }
          if (
            window.emojify.emojiNames.includes(key) ||
            this.twitch.emotesMap.has(key)
          ) {
            this.bttv.emotesMap.set(`${key}_bttv`, data[code]);
          } else {
            this.bttv.emotesMap.set(key, data[code]);
          }
        }
      }
      this.bttvJSONSLoaded = true;
    },
    /**
     * @param {FrankerFacezJsonResponse} data
     */
    processFrankerFacez(data) {
      for (const emoticon of data.emoticons) {
        const code = emoticon.name;
        const key = code.toLowerCase();
        if (code.includes(':')) {
          continue;
        }
        if (
          window.emojify.emojiNames.includes(key) ||
          this.twitch.emotesMap.has(key) ||
          this.bttv.emotesMap.has(key)
        ) {
          this.frankerFacez.emotesMap.set(`${key}_ffz`, emoticon.id);
        } else {
          this.frankerFacez.emotesMap.set(key, emoticon.id);
        }
      }
      this.frankerfacezJSONLoaded = true;
    },
    /**
     * @param {string} str
     * @param {boolean} [emotesEnabled=false]
     */
    findMatchingEmotes(str, emotesEnabled = false) {
      const matches = [];
      window.emojify.emojiNames.forEach((emoji) => {
        if (emoji.includes(str)) {
          matches.push({
            src: this.emoji.template(emoji),
            text: emoji,
            alt: emoji,
            platform: 'emojify',
          });
        }
      });
      if (!emotesEnabled) {
        return matches;
      }
      Array.from(this.twitch.emotesMap.keys()).forEach((emoji) => {
        if (emoji.includes(str)) {
          matches.push({
            src: this.twitch.template(this.twitch.emotesMap.get(emoji)),
            text: emoji,
            alt: emoji,
            platform: 'twitch',
          });
        }
      });
      Array.from(this.bttv.emotesMap.keys()).forEach((emoji) => {
        if (emoji.includes(str)) {
          matches.push({
            src: this.bttv.template(this.bttv.emotesMap.get(emoji)),
            text: emoji,
            alt: emoji,
            platform: 'bttv',
          });
        }
      });
      Array.from(this.frankerFacez.emotesMap.keys()).forEach((emoji) => {
        if (emoji.includes(str)) {
          matches.push({
            src: this.frankerFacez.template(
              this.frankerFacez.emotesMap.get(emoji),
            ),
            text: emoji,
            alt: emoji,
            platform: 'ffz',
          });
        }
      });
      return matches;
    },
  };
  function makeImage(type, src, name2, w, h) {
    const img = document.createElement('img');
    img.className = `emoji ${type}-emote`;
    img.title = name2;
    img.alt = name2;
    img.src = src;
    return img;
  }
  function processChatText(text2) {
    const regex = /(:[^: ]+:)/g;
    const chunks = text2.split(regex);
    const nodes = [];
    chunks.forEach((chunk) => {
      if (chunk.match(regex)) {
        const key = chunk.toLowerCase().replace(/^:/, '').replace(/:$/, '');
        if (
          dubplus_emoji.twitchJSONSLoaded &&
          dubplus_emoji.twitch.emotesMap.has(key)
        ) {
          const id = dubplus_emoji.twitch.emotesMap.get(key);
          const src = dubplus_emoji.twitch.template(id);
          const img = makeImage('twitch', src, key);
          nodes.push(img);
        } else if (
          dubplus_emoji.bttvJSONSLoaded &&
          dubplus_emoji.bttv.emotesMap.has(key)
        ) {
          const id = dubplus_emoji.bttv.emotesMap.get(key);
          const src = dubplus_emoji.bttv.template(id);
          const img = makeImage('bttv', src, key);
          nodes.push(img);
        } else if (
          dubplus_emoji.frankerfacezJSONLoaded &&
          dubplus_emoji.frankerFacez.emotesMap.has(key)
        ) {
          const id = dubplus_emoji.frankerFacez.emotesMap.get(key);
          const src = dubplus_emoji.frankerFacez.template(id);
          const img = makeImage('frankerFacez', src, key);
          nodes.push(img);
        } else {
          nodes.push(document.createTextNode(chunk));
        }
      } else {
        nodes.push(document.createTextNode(chunk));
      }
    });
    return nodes;
  }
  function processChatLI(li) {
    const textElems = li.querySelectorAll('.text p');
    textElems.forEach((textElem) => {
      if (
        !textElem.hasAttribute('dubplus-emotes-processed') &&
        (textElem == null ? void 0 : textElem.textContent.trim()) !== ''
      ) {
        const processedHTML = processChatText(textElem.textContent);
        textElem.replaceChildren(...processedHTML);
        textElem.setAttribute('dubplus-emotes-processed', 'true');
      }
    });
  }
  function replaceTextWithEmote(e) {
    if (e == null ? void 0 : e.chatid) {
      const chatMessage = document.querySelector(`.chat-id-${e.chatid}`);
      if (chatMessage) {
        processChatLI(chatMessage);
        return;
      }
    }
    const chats = getChatMessages();
    if (!(chats == null ? void 0 : chats.length)) {
      return;
    }
    chats.forEach(processChatLI);
  }
  const emotes = {
    id: 'emotes',
    label: 'emotes.label',
    description: 'emotes.description',
    category: 'general',
    turnOn() {
      dubplus_emoji
        .loadTwitchEmotes()
        .then(() => dubplus_emoji.loadBTTVEmotes())
        .then(() => dubplus_emoji.loadFrankerFacez())
        .then(() => {
          replaceTextWithEmote();
          window.QueUp.Events.bind(CHAT_MESSAGE, replaceTextWithEmote);
        });
    },
    turnOff() {
      window.QueUp.Events.unbind(CHAT_MESSAGE, replaceTextWithEmote);
    },
  };
  const emojiState = proxy({ selectedIndex: 0, emojiList: [] });
  function reset$1() {
    emojiState.selectedIndex = 0;
    emojiState.emojiList = [];
  }
  function setEmojiList(listArray, searchStr) {
    const platforms = ['emojify', 'twitch', 'bttv', 'ffz'];
    emojiState.emojiList = listArray
      .filter(
        (emoji, index, self) =>
          index ===
          self.findIndex(
            (e) => e.src === emoji.src && e.platform === emoji.platform,
          ),
      )
      .sort((a, b) => {
        const platformA = platforms.indexOf(a.platform);
        const platformB = platforms.indexOf(b.platform);
        if (platformA === platformB) {
          if (a.text.startsWith(searchStr) && !b.text.startsWith(searchStr)) {
            return -1;
          } else if (
            !a.text.startsWith(searchStr) &&
            b.text.startsWith(searchStr)
          ) {
            return 1;
          } else {
            return a.text.localeCompare(b.text);
          }
        }
        return platformA - platformB;
      });
  }
  function decrement() {
    if (emojiState.selectedIndex > 0) {
      emojiState.selectedIndex--;
    } else {
      emojiState.selectedIndex = emojiState.emojiList.length - 1;
    }
  }
  function increment() {
    if (emojiState.selectedIndex < emojiState.emojiList.length - 1) {
      emojiState.selectedIndex++;
    } else {
      emojiState.selectedIndex = 0;
    }
  }
  function isEdge(char) {
    return char === ' ' || char === '\n';
  }
  function getSelection(currentText, cursorPos) {
    let left = cursorPos > 0 ? cursorPos : 0;
    while (left > 0 && currentText[left] !== ':') {
      left -= 1;
    }
    let right = cursorPos;
    while (!isEdge(currentText[right]) && right < currentText.length) {
      right += 1;
    }
    return [left, right];
  }
  const KEYS = {
    up: 'ArrowUp',
    down: 'ArrowDown',
    enter: 'Enter',
    esc: 'Escape',
    tab: 'Tab',
  };
  const MIN_CHAR = 2;
  let acPreview = document.querySelector('#autocomplete-preview');
  let originalKeyDownEventHandler;
  function insertEmote(inputEl, index) {
    const selected = emojiState.emojiList[index];
    const [start, end] = getSelection(inputEl.value, inputEl.selectionStart);
    const target = inputEl.value.substring(start, end);
    inputEl.value = inputEl.value.replace(target, `:${selected.text}:`);
    reset$1();
  }
  function checkInput(e) {
    const inputEl =
      /**@type {HTMLTextAreaElement}*/
      e.target;
    const currentText = inputEl.value;
    const cursorPos = inputEl.selectionStart;
    let str = '';
    let goLeft = cursorPos - 1;
    while (!isEdge(currentText[goLeft]) && goLeft >= 0) {
      str = currentText[goLeft] + str;
      goLeft--;
    }
    let goRight = cursorPos;
    while (!isEdge(currentText[goRight]) && goRight < currentText.length) {
      str = str + currentText[goRight];
      goRight++;
    }
    if (str.startsWith(':') && str.length >= MIN_CHAR && !str.endsWith(':')) {
      const searchStr = str.substring(1).trim();
      const list = dubplus_emoji.findMatchingEmotes(
        searchStr,
        settings.options.emotes,
      );
      setEmojiList(list, searchStr);
    } else {
      reset$1();
    }
  }
  function chatInputKeyupFunc(e) {
    acPreview = acPreview || document.querySelector('#autocomplete-preview');
    const hasItems = acPreview.children.length > 0;
    const isModifierKey = e.shiftKey || e.ctrlKey || e.altKey || e.metaKey;
    if (isModifierKey) {
      return;
    }
    if (e.key === KEYS.up && hasItems) {
      e.preventDefault();
      decrement();
      return;
    }
    if (e.key === KEYS.down && hasItems) {
      e.preventDefault();
      increment();
      return;
    }
    if ((e.key === KEYS.enter || e.key === KEYS.tab) && hasItems) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const inputEl =
        /**@type {HTMLTextAreaElement}*/
        e.target;
      insertEmote(inputEl, emojiState.selectedIndex);
      return;
    }
    if (e.key === KEYS.enter && !hasItems && !e.shiftKey) {
      setTimeout(() => {
        window.QueUp.room.chat.resizeTextarea();
      }, 10);
      return;
    }
    if (e.key === KEYS.esc && hasItems) {
      reset$1();
      return;
    }
    checkInput(e);
  }
  function chatInputKeydownFunc(e) {
    acPreview = acPreview || document.querySelector('#autocomplete-preview');
    const emptyPreview = acPreview.children.length === 0;
    const isValidKey = [KEYS.tab, KEYS.enter, KEYS.up, KEYS.down].includes(
      e.key,
    );
    const isModifierKey = e.shiftKey || e.ctrlKey || e.altKey || e.metaKey;
    if (!isModifierKey && !emptyPreview && isValidKey) {
      e.preventDefault();
      return;
    }
    if (!isModifierKey && e.key === KEYS.enter) {
      window.QueUp.room.chat.sendMessage();
      window.QueUp.room.chat.resizeTextarea();
    } else if (!isModifierKey) {
      window.QueUp.room.chat.ncKeyDown(e);
    }
  }
  const autocomplete = {
    id: 'autocomplete',
    label: 'autocomplete.label',
    category: 'general',
    description: 'autocomplete.description',
    turnOn() {
      acPreview = document.querySelector('#autocomplete-preview');
      reset$1();
      originalKeyDownEventHandler =
        window.QueUp.room.chat.events['keydown #chat-txt-message'];
      const newEventsObject = { ...window.QueUp.room.chat.events };
      delete newEventsObject['keydown #chat-txt-message'];
      window.QueUp.room.chat.delegateEvents(newEventsObject);
      const chatInput = getChatInput();
      chatInput.addEventListener('keydown', chatInputKeydownFunc);
      chatInput.addEventListener('keyup', chatInputKeyupFunc);
      chatInput.addEventListener('click', checkInput);
    },
    turnOff() {
      reset$1();
      window.QueUp.room.chat.events['keydown #chat-txt-message'] =
        originalKeyDownEventHandler;
      window.QueUp.room.chat.delegateEvents(window.QueUp.room.chat.events);
      const chatInput = getChatInput();
      chatInput.removeEventListener('keydown', chatInputKeydownFunc);
      chatInput.removeEventListener('keyup', chatInputKeyupFunc);
      chatInput.removeEventListener('click', checkInput);
    },
  };
  const MODULE_ID$2 = 'custom-mentions';
  function customMentionCheck(e) {
    const enabled = settings.options[MODULE_ID$2];
    const custom = settings.custom[MODULE_ID$2];
    if (
      enabled && // we only want to play the sound if the message is not from the current user
      window.QueUp.session.id !== e.user.userInfo.userid
    ) {
      const shouldPlaySound = custom.split(',').some(function (v) {
        const reg = new RegExp(`\\b@?${v.trim()}\\b`, 'ig');
        return reg.test(e.message);
      });
      if (shouldPlaySound) {
        window.QueUp.room.chat.mentionChatSound.play();
      }
    }
  }
  const customMentions = {
    id: MODULE_ID$2,
    label: `${MODULE_ID$2}.label`,
    description: `${MODULE_ID$2}.description`,
    category: 'general',
    custom: {
      title: `${MODULE_ID$2}.modal.title`,
      content: `${MODULE_ID$2}.modal.content`,
      placeholder: `${MODULE_ID$2}.modal.placeholder`,
      maxlength: 255,
    },
    turnOn() {
      window.QueUp.Events.bind(CHAT_MESSAGE, customMentionCheck);
    },
    turnOff() {
      window.QueUp.Events.unbind(CHAT_MESSAGE, customMentionCheck);
    },
  };
  const MODULE_ID$1 = 'chat-cleaner';
  function cleanChat(limit) {
    const chatMessages = getChatMessages();
    if (
      !(chatMessages == null ? void 0 : chatMessages.length) ||
      isNaN(limit) ||
      chatMessages.length < limit
    ) {
      return;
    }
    for (let i = 0; i < chatMessages.length - limit; i++) {
      chatMessages[i].remove();
    }
  }
  function onChatMessage() {
    const limit = settings.custom[MODULE_ID$1];
    if (typeof limit === 'number') {
      cleanChat(limit);
    } else if (typeof limit === 'string' && limit.trim() !== '') {
      const num = parseInt(limit, 10);
      cleanChat(num);
    }
  }
  const chatCleaner = {
    id: MODULE_ID$1,
    label: `${MODULE_ID$1}.label`,
    description: `${MODULE_ID$1}.description`,
    category: 'general',
    custom: {
      title: `${MODULE_ID$1}.modal.title`,
      content: `${MODULE_ID$1}.modal.content`,
      placeholder: `${MODULE_ID$1}.modal.placeholder`,
      maxlength: 5,
      validation(val) {
        if (val.trim() === '') return true;
        const num = parseInt(val, 10);
        if (val.includes('.') || isNaN(num) || num < 1) {
          return t(`${MODULE_ID$1}.modal.validation`);
        }
        return true;
      },
      onConfirm: (value) => {
        if (settings.options[MODULE_ID$1]) {
          cleanChat(parseInt(value, 10));
        }
      },
    },
    turnOn() {
      cleanChat(void 0);
      window.QueUp.Events.bind(CHAT_MESSAGE, onChatMessage);
    },
    turnOff() {
      window.QueUp.Events.unbind(CHAT_MESSAGE, onChatMessage);
    },
  };
  const activeTabState = proxy({ isActive: true });
  const onOut = [];
  const onIn = [];
  document.addEventListener('visibilitychange', handleChange);
  window.onpageshow = handleChange;
  window.onpagehide = handleChange;
  window.onfocus = handleChange;
  window.onblur = handleChange;
  if (document.hidden !== void 0) {
    handleChange({ type: document.hidden ? 'blur' : 'focus' });
  }
  function handleChange(evt) {
    if (
      activeTabState.isActive &&
      (['blur', 'pagehide'].includes(evt.type) || document.hidden)
    ) {
      activeTabState.isActive = false;
      onOut.forEach((fn) => fn());
    } else if (
      !activeTabState.isActive &&
      (['focus', 'pageshow'].includes(evt.type) || !document.hidden)
    ) {
      activeTabState.isActive = true;
      onIn.forEach((fn) => fn());
    }
  }
  function registerVisibilityChangeListeners(inHandler, outHandler) {
    if (inHandler) onIn.push(inHandler);
    if (outHandler) onOut.push(outHandler);
  }
  function unRegisterVisibilityChangeListeners(inHandler, outHandler) {
    if (inHandler) onIn.splice(onIn.indexOf(inHandler), 1);
    if (outHandler) onOut.splice(onOut.indexOf(outHandler), 1);
  }
  function onDenyDismiss() {
    updateModalState({
      title: t('Notifcation.permission.title'),
      content: t('Notification.permission.denied'),
      open: true,
    });
  }
  function notifyCheckPermission() {
    return new Promise((resolve, reject) => {
      if (!('Notification' in window)) {
        updateModalState({
          open: true,
          title: t('Notifcation.permission.title'),
          content: t('Notification.permission.notSupported'),
        });
        reject(false);
        return;
      }
      if (Notification.permission === 'granted') {
        resolve();
        return;
      }
      if (Notification.permission === 'denied') {
        onDenyDismiss();
        reject();
        return;
      }
      Notification.requestPermission().then(function (result) {
        if (result === 'denied' || result === 'default') {
          onDenyDismiss();
          reject();
          return;
        }
        resolve();
      });
    });
  }
  function showNotification(opts) {
    const defaults2 = {
      content: '',
      ignoreActiveTab: false,
      callback: null,
      wait: 1e4,
    };
    const options = Object.assign({}, defaults2, opts);
    if (activeTabState.isActive && !options.ignoreActiveTab) {
      return;
    }
    const notificationOptions = {
      body: options.content,
      icon: 'https://cdn.jsdelivr.net/gh/DubPlus/DubPlus/images/dubplus.svg',
    };
    const n = new Notification(options.title, notificationOptions);
    n.onclick = function () {
      window.focus();
      if (typeof options.callback === 'function') {
        options.callback();
      }
      n.close();
    };
    setTimeout(n.close.bind(n), options.wait);
  }
  function notifyOnMention(e) {
    const content = e.message;
    const user = window.QueUp.session.get('username').toLowerCase();
    let mentionTriggers = ['@' + user];
    if (
      settings.options['custom-mentions'] &&
      settings.custom['custom-mentions']
    ) {
      mentionTriggers = mentionTriggers
        .concat(settings.custom['custom-mentions'].split(','))
        .map((v) => v.trim());
      mentionTriggers = mentionTriggers.concat(
        mentionTriggers.map((v) => '@' + v),
      );
    }
    const bigRegex = new RegExp(`\\b(${mentionTriggers.join('|')})\\b`, 'ig');
    if (
      bigRegex.test(content) &&
      !activeTabState.isActive && // notifications only if you're not focused on the tab
      window.QueUp.session.id !== e.user.userInfo.userid
    ) {
      showNotification({
        title: `Message from ${e.user.username}`,
        content,
      });
    }
  }
  const mentionNotifications = {
    id: 'mention-notifications',
    label: 'mention-notifications.label',
    description: 'mention-notifications.description',
    category: 'general',
    turnOn() {
      notifyCheckPermission()
        .then(() => {
          window.QueUp.Events.bind(CHAT_MESSAGE, notifyOnMention);
        })
        .catch(() => {
          settings.options[this.id] = false;
        });
    },
    turnOff() {
      window.QueUp.Events.unbind(CHAT_MESSAGE, notifyOnMention);
    },
  };
  function pmNotify(e) {
    if (window.QueUp.session.id === e.userid) {
      return;
    }
    showNotification({
      title: t('pm-notifications.notification.title'),
      ignoreActiveTab: true,
      callback: function () {
        const openPmButton = getPrivateMessageButton();
        openPmButton == null ? void 0 : openPmButton.click();
        setTimeout(function () {
          const messageItem = getPrivateMessage(e.messageid);
          messageItem == null ? void 0 : messageItem.click();
        }, 500);
      },
      wait: 1e4,
    });
  }
  const pmNotifications = {
    id: 'pm-notifications',
    label: 'pm-notifications.label',
    description: 'pm-notifications.description',
    category: 'general',
    turnOn() {
      notifyCheckPermission()
        .then(() => {
          window.QueUp.Events.bind(NEW_PM_MESSAGE, pmNotify);
        })
        .catch(() => {
          settings.options[this.id] = false;
        });
    },
    turnOff() {
      window.QueUp.Events.unbind(NEW_PM_MESSAGE, pmNotify);
    },
  };
  const MODULE_ID = 'dj-notification';
  function djNotificationCheck(e) {
    if (e && e.startTime > 2) return;
    setTimeout(() => {
      var _a2, _b, _c, _d;
      const quePositionText =
        (_b = (_a2 = getQueuePosition()) == null ? void 0 : _a2.textContent) ==
        null
          ? void 0
          : _b.trim();
      if (!quePositionText) {
        return;
      }
      const position = parseInt(quePositionText, 10);
      if (isNaN(position)) {
        logError(
          MODULE_ID,
          'Could not parse current position:',
          quePositionText,
        );
        return;
      }
      let parseSetting = parseInt(settings.custom[MODULE_ID], 10);
      if (isNaN(parseSetting)) {
        parseSetting = 2;
        logInfo(MODULE_ID, 'Could not parse setting, defaulting to 2');
      }
      const queueTotalText =
        (_d = (_c = getQueueTotal()) == null ? void 0 : _c.textContent) == null
          ? void 0
          : _d.trim();
      if (
        (queueTotalText === quePositionText && parseSetting === 0) ||
        position === parseSetting
      ) {
        showNotification({
          title: t(`${MODULE_ID}.notification.title`),
          content: t(`${MODULE_ID}.notification.content`),
          ignoreActiveTab: true,
          wait: 1e4,
        });
        window.QueUp.room.chat.mentionChatSound.play();
        return;
      }
    }, 1e3);
  }
  const djNotification = {
    id: MODULE_ID,
    label: `${MODULE_ID}.label`,
    description: `${MODULE_ID}.description`,
    category: 'general',
    custom: {
      title: `${MODULE_ID}.modal.title`,
      content: `${MODULE_ID}.modal.content`,
      placeholder: '2',
      defaultValue: '2',
      maxlength: 3,
      validation(val) {
        if (val.trim() === '') return true;
        const num = parseInt(val, 10);
        if (val.includes('.') || isNaN(num) || num < 0) {
          return t(`${MODULE_ID}.modal.validation`);
        }
        return true;
      },
      onConfirm: () => {
        if (settings.options[MODULE_ID]) {
          djNotificationCheck();
        }
      },
    },
    turnOn() {
      notifyCheckPermission().then(() => {
        djNotificationCheck();
        window.QueUp.Events.bind(PLAYLIST_UPDATE, djNotificationCheck);
      });
    },
    turnOff() {
      window.QueUp.Events.unbind(PLAYLIST_UPDATE, djNotificationCheck);
    },
  };
  const dubsState = proxy({ upDubs: [], downDubs: [], grabs: [] });
  function getDubCount(dubType) {
    if (dubType === 'updub') return dubsState.upDubs;
    if (dubType === 'downdub') return dubsState.downDubs;
    if (dubType === 'grab') return dubsState.grabs;
    return [];
  }
  const apiBase = window.location.hostname.includes('staging')
    ? 'https://staging-api.queup.dev'
    : 'https://api.queup.net';
  function userData(userid) {
    return `${apiBase}/user/${userid}`;
  }
  function activeDubs(roomId) {
    return `${apiBase}/room/${roomId}/playlist/active/dubs`;
  }
  function userImage(userid) {
    return `${apiBase}/user/${userid}/image`;
  }
  function getUserName(userid) {
    return new Promise((resolve, reject) => {
      var _a2, _b, _c;
      const username =
        (_c =
          (_b =
            (_a2 = window.QueUp.room.users.collection.findWhere({
              userid,
            })) == null
              ? void 0
              : _a2.attributes) == null
            ? void 0
            : _b._user) == null
          ? void 0
          : _c.username;
      if (username) {
        resolve(username);
        return;
      }
      fetch(userData(userid))
        .then((response) => response.json())
        .then((response) => {
          var _a3;
          if (
            (_a3 = response == null ? void 0 : response.userinfo) == null
              ? void 0
              : _a3.username
          ) {
            const { username: username2 } = response.userinfo;
            resolve(username2);
          } else {
            reject('Failed to get username from API for userid: ' + userid);
          }
        })
        .catch(reject);
    });
  }
  function updateUpdubs(updubs) {
    updubs == null
      ? void 0
      : updubs.forEach((dub) => {
          if (dubsState.upDubs.find((el) => el.userid === dub.userid)) {
            return;
          }
          getUserName(dub.userid)
            .then((username) => {
              dubsState.upDubs.push({
                userid: dub.userid,
                username,
              });
            })
            .catch((error) =>
              logError('Failed to get username for upDubs:', error),
            );
        });
  }
  function updateDowndubs(downdubs) {
    downdubs == null
      ? void 0
      : downdubs.forEach((dub) => {
          if (dubsState.downDubs.find((el) => el.userid === dub.userid)) {
            return;
          }
          getUserName(dub.userid)
            .then((username) => {
              dubsState.downDubs.push({
                userid: dub.userid,
                username,
              });
            })
            .catch((error) =>
              logError('Failed to get username for downDubs', error),
            );
        });
  }
  function resetDubs() {
    dubsState.downDubs = [];
    dubsState.upDubs = [];
    dubsState.grabs = [];
    const dubsURL = activeDubs(window.QueUp.room.model.id);
    fetch(dubsURL)
      .then((response) => response.json())
      .then((response) => {
        updateUpdubs(response.data.upDubs);
        if (isMod(window.QueUp.session.id)) {
          updateDowndubs(response.data.downDubs);
        }
      })
      .catch((error) => logError('Failed to fetch dubs data from API.', error));
  }
  function dubWatcher(e) {
    if (e.dubtype === 'updub') {
      if (!dubsState.upDubs.find((el) => el.userid === e.user._id)) {
        dubsState.upDubs.push({
          userid: e.user._id,
          username: e.user.username,
        });
      }
      dubsState.downDubs = dubsState.downDubs.filter(
        (el) => el.userid !== e.user._id,
      );
    } else if (e.dubtype === 'downdub' && isMod(window.QueUp.session.id)) {
      if (!dubsState.downDubs.find((el) => el.userid === e.user._id)) {
        dubsState.downDubs.push({
          userid: e.user._id,
          username: e.user.username,
        });
      }
      dubsState.upDubs = dubsState.upDubs.filter(
        (el) => el.userid !== e.user._id,
      );
    }
    const msSinceSongStart =
      Date.now() - window.QueUp.room.player.activeSong.attributes.song.played;
    if (msSinceSongStart < 1e3) {
      return;
    }
    if (
      dubsState.upDubs.length !==
      window.QueUp.room.player.activeSong.attributes.song.updubs
    ) {
      resetDubs();
    } else if (
      isMod(window.QueUp.session.id) &&
      dubsState.downDubs.length !==
        window.QueUp.room.player.activeSong.attributes.song.downdubs
    ) {
      resetDubs();
    }
  }
  function grabWatcher(e) {
    if (!dubsState.grabs.find((el) => el.userid === e.user._id)) {
      dubsState.grabs.push({
        userid: e.user._id,
        username: e.user.username,
      });
    }
  }
  function dubUserLeaveWatcher(e) {
    dubsState.upDubs = dubsState.upDubs.filter(
      (el) => el.userid !== e.user._id,
    );
    dubsState.downDubs = dubsState.downDubs.filter(
      (el) => el.userid !== e.user._id,
    );
    dubsState.grabs = dubsState.grabs.filter((el) => el.userid !== e.user._id);
  }
  const showDubsOnHover = {
    id: 'dubs-hover',
    label: 'dubs-hover.label',
    description: 'dubs-hover.description',
    category: 'general',
    turnOn() {
      resetDubs();
      window.QueUp.Events.bind(DUB, dubWatcher);
      window.QueUp.Events.bind(GRAB, grabWatcher);
      window.QueUp.Events.bind(USER_LEAVE, dubUserLeaveWatcher);
      window.QueUp.Events.bind(PLAYLIST_UPDATE, resetDubs);
    },
    turnOff() {
      window.QueUp.Events.unbind(DUB, dubWatcher);
      window.QueUp.Events.unbind(GRAB, grabWatcher);
      window.QueUp.Events.unbind(USER_LEAVE, dubUserLeaveWatcher);
      window.QueUp.Events.unbind(PLAYLIST_UPDATE, resetDubs);
    },
  };
  function downdubWatcher(e) {
    const isUserTheDJ =
      window.QueUp.session.id ===
      window.QueUp.room.player.activeSong.attributes.song.userid;
    if (isUserTheDJ && e.dubtype === 'downdub') {
      insertQueupChat(
        'dubplus-chat-system-downdub',
        t('downdubs-in-chat.chat-message', {
          username: e.user.username,
          song_name:
            window.QueUp.room.player.activeSong.attributes.songInfo.name,
        }),
      );
    }
  }
  const downdubsInChat = {
    id: 'downdubs-in-chat',
    label: 'downdubs-in-chat.label',
    description: 'downdubs-in-chat.description',
    category: 'general',
    modOnly: true,
    turnOn() {
      if (isMod(window.QueUp.session.id)) {
        window.QueUp.Events.bind(DUB, downdubWatcher);
      }
    },
    turnOff() {
      window.QueUp.Events.unbind(DUB, downdubWatcher);
    },
  };
  function updubWatcher(e) {
    const isUserTheDJ =
      window.QueUp.session.id ===
      window.QueUp.room.player.activeSong.attributes.song.userid;
    if (isUserTheDJ && e.dubtype === 'updub') {
      insertQueupChat(
        'dubplus-chat-system-updub',
        t('updubs-in-chat.chat-message', {
          username: e.user.username,
          song_name:
            window.QueUp.room.player.activeSong.attributes.songInfo.name,
        }),
      );
    }
  }
  const upDubInChat = {
    id: 'updubs-in-chat',
    label: 'updubs-in-chat.label',
    description: 'updubs-in-chat.description',
    category: 'general',
    turnOn() {
      window.QueUp.Events.bind(DUB, updubWatcher);
    },
    turnOff() {
      window.QueUp.Events.unbind(DUB, updubWatcher);
    },
  };
  function grabChatWatcher(e) {
    const isUserTheDJ =
      window.QueUp.session.id ===
      window.QueUp.room.player.activeSong.attributes.song.userid;
    if (isUserTheDJ) {
      insertQueupChat(
        'dubplus-chat-system-grab',
        t('grabs-in-chat.chat-message', {
          username: e.user.username,
          song_name:
            window.QueUp.room.player.activeSong.attributes.songInfo.name,
        }),
      );
    }
  }
  const grabsInChat = {
    id: 'grabs-in-chat',
    label: 'grabs-in-chat.label',
    description: 'grabs-in-chat.description',
    category: 'general',
    turnOn() {
      if (!window.QueUp.room.model.get('displayUserGrab')) {
        window.QueUp.Events.bind(
          'realtime:room_playlist-queue-update-grabs',
          grabChatWatcher,
        );
      }
    },
    turnOff() {
      if (!window.QueUp.room.model.get('displayUserGrab')) {
        window.QueUp.Events.unbind(
          'realtime:room_playlist-queue-update-grabs',
          grabChatWatcher,
        );
      }
    },
  };
  const snow = {
    id: 'snow',
    label: 'snow.label',
    description: 'snow.description',
    category: 'general',
    turnOn() {},
    turnOff() {},
  };
  class RainEffect {
    constructor() {
      this.particles = [];
      this.drops = [];
      this.numbase = 5;
      this.numb = 2;
      this.width = 0;
      this.height = 0;
      this.controls = {
        rain: 2,
        alpha: 1,
        color: 200,
        opacity: 1,
        saturation: 100,
        lightness: 50,
        back: 0,
        multi: false,
        speed: 1,
      };
      this.requestAnimFrame = null;
      this.canvas = null;
    }
    makeCanvas() {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'dubPlusRainCanvas';
      this.canvas.style.position = 'fixed';
      this.canvas.style.top = '0px';
      this.canvas.style.left = '0px';
      this.canvas.style.zIndex = '100';
      this.canvas.style.pointerEvents = 'none';
      document.body.prepend(this.canvas);
    }
    start() {
      this.makeCanvas();
      this.startAnimation();
    }
    stop() {
      var _a2;
      this.stopAnimation();
      (_a2 = this.canvas) == null ? void 0 : _a2.remove();
    }
    onWindowResize() {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    }
    startAnimation() {
      const windowAnimFram = window.requestAnimationFrame;
      this.requestAnimFrame = windowAnimFram
        ? windowAnimFram.bind(window)
        : null;
      if (!this.canvas) return;
      const ctx = this.canvas.getContext('2d');
      (this.width, (this.height = 0));
      this.onWindowResize();
      window.onresize = this.onWindowResize.bind(this);
      this.particles = [];
      this.drops = [];
      this.numbase = 5;
      this.numb = 2;
      let that = this;
      (function boucle() {
        that.requestAnimFrame(boucle);
        that.update();
        that.rendu(ctx);
      })();
    }
    /**
     *
     * @param {number} X
     * @param {number} Y
     * @param {number} [num]
     */
    buildRainParticle(X, Y, num) {
      if (!num) {
        num = this.numb;
      }
      while (num--) {
        this.particles.push({
          speedX: Math.random() * 0.25,
          speedY: Math.random() * 9 + 1,
          X,
          Y,
          alpha: 1,
          color:
            'hsla(' +
            this.controls.color +
            ',' +
            this.controls.saturation +
            '%, ' +
            this.controls.lightness +
            '%,' +
            this.controls.opacity +
            ')',
        });
      }
    }
    /**
     *
     * @param {number} X
     * @param {number} Y
     * @param {any} color
     * @param {number} [num]
     */
    explosion(X, Y, color, num) {
      if (!num) {
        num = this.numbase;
      }
      while (num--) {
        this.drops.push({
          speedX: Math.random() * 4 - 2,
          speedY: Math.random() * -4,
          X,
          Y,
          radius: 0.65 + Math.floor(Math.random() * 1.6),
          alpha: 1,
          color,
        });
      }
    }
    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    rendu(ctx) {
      if (this.controls.multi) {
        this.controls.color = Math.random() * 360;
      }
      ctx.save();
      ctx.clearRect(0, 0, this.width, this.height);
      const particleslocales = this.particles;
      const dropslocales = this.drops;
      const tau = Math.PI * 2;
      for (
        let i = 0, particlesactives;
        (particlesactives = particleslocales[i]);
        i++
      ) {
        ctx.globalAlpha = particlesactives.alpha;
        ctx.fillStyle = particlesactives.color;
        ctx.fillRect(
          particlesactives.X,
          particlesactives.Y,
          particlesactives.speedY / 4,
          particlesactives.speedY,
        );
      }
      for (let i = 0, dropsactives; (dropsactives = dropslocales[i]); i++) {
        ctx.globalAlpha = dropsactives.alpha;
        ctx.fillStyle = dropsactives.color;
        ctx.beginPath();
        ctx.arc(dropsactives.X, dropsactives.Y, dropsactives.radius, 0, tau);
        ctx.fill();
      }
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.restore();
    }
    update() {
      const particleslocales = this.particles;
      const dropslocales = this.drops;
      for (
        let i2 = 0, particlesactives;
        (particlesactives = particleslocales[i2]);
        i2++
      ) {
        particlesactives.X += particlesactives.speedX;
        particlesactives.Y += particlesactives.speedY + 5;
        if (particlesactives.Y > this.height - 15) {
          particleslocales.splice(i2--, 1);
          this.explosion(
            particlesactives.X,
            particlesactives.Y,
            particlesactives.color,
          );
        }
      }
      for (let i2 = 0, dropsactives; (dropsactives = dropslocales[i2]); i2++) {
        dropsactives.X += dropsactives.speedX;
        dropsactives.Y += dropsactives.speedY;
        dropsactives.radius -= 0.075;
        if (dropsactives.alpha > 0) {
          dropsactives.alpha -= 5e-3;
        } else {
          dropsactives.alpha = 0;
        }
        if (dropsactives.radius < 0) {
          dropslocales.splice(i2--, 1);
        }
      }
      let i = this.controls.rain;
      while (i--) {
        this.buildRainParticle(Math.floor(Math.random() * this.width), -15);
      }
    }
    stopAnimation() {
      this.requestAnimFrame = function () {};
    }
  }
  const rain = {
    id: 'rain',
    label: 'rain.label',
    description: 'rain.description',
    category: 'general',
    turnOn() {
      this.rainEffect = new RainEffect();
      this.rainEffect.start();
    },
    turnOff() {
      this.rainEffect.stop();
      delete this.rainEffect;
    },
  };
  var root$d = /* @__PURE__ */ from_svg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M448 344v112a23.9 23.9 0 0 1 -24 24H312c-21.4 0-32.1-25.9-17-41l36.2-36.2L224 295.6 116.8 402.9 153 439c15.1 15.1 4.4 41-17 41H24a23.9 23.9 0 0 1 -24-24V344c0-21.4 25.9-32.1 41-17l36.2 36.2L184.5 256 77.2 148.7 41 185c-15.1 15.1-41 4.4-41-17V56a23.9 23.9 0 0 1 24-24h112c21.4 0 32.1 25.9 17 41l-36.2 36.2L224 216.4l107.2-107.3L295 73c-15.1-15.1-4.4-41 17-41h112a23.9 23.9 0 0 1 24 24v112c0 21.4-25.9 32.1-41 17l-36.2-36.2L263.5 256l107.3 107.3L407 327.1c15.1-15.2 41-4.5 41 16.9z"></path></svg>`,
  );
  function IconFullscreen($$anchor) {
    var svg = root$d();
    append($$anchor, svg);
  }
  const fullscreen = {
    id: 'fullscreen',
    label: 'fullscreen.label',
    description: 'fullscreen.description',
    category: 'user-interface',
    altIcon: IconFullscreen,
    onClick() {
      const elem = getPlayerIframe();
      if (!elem) {
        logInfo('Fullscreen: No video element found');
        return;
      }
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      }
    },
  };
  const splitChat = {
    id: 'split-chat',
    label: 'split-chat.label',
    description: 'split-chat.description',
    category: 'user-interface',
    turnOn() {
      document.body.classList.add('dubplus-split-chat');
    },
    turnOff() {
      document.body.classList.remove('dubplus-split-chat');
    },
  };
  const hideChat = {
    id: 'hide-chat',
    label: 'hide-chat.label',
    description: 'hide-chat.description',
    category: 'user-interface',
    turnOn() {
      document.body.classList.add('dubplus-video-only');
    },
    turnOff() {
      document.body.classList.remove('dubplus-video-only');
    },
  };
  const hideVideo = {
    id: 'hide-video',
    label: 'hide-video.label',
    description: 'hide-video.description',
    category: 'user-interface',
    turnOn() {
      document.body.classList.add('dubplus-chat-only');
    },
    turnOff() {
      document.body.classList.remove('dubplus-chat-only');
    },
  };
  const hideAvatars = {
    id: 'hide-avatars',
    label: 'hide-avatars.label',
    description: 'hide-avatars.description',
    category: 'user-interface',
    turnOn() {
      document.body.classList.add('dubplus-hide-avatars');
    },
    turnOff() {
      document.body.classList.remove('dubplus-hide-avatars');
    },
  };
  const hideBackground = {
    id: 'hide-bg',
    label: 'hide-bg.label',
    description: 'hide-bg.description',
    category: 'user-interface',
    turnOn() {
      document.body.classList.add('dubplus-hide-bg');
    },
    turnOff() {
      document.body.classList.remove('dubplus-hide-bg');
    },
  };
  const showTimestamps = {
    id: 'show-timestamps',
    label: 'show-timestamps.label',
    description: 'show-timestamps.description',
    category: 'user-interface',
    turnOn() {
      document.body.classList.add('dubplus-show-timestamp');
    },
    turnOff() {
      document.body.classList.remove('dubplus-show-timestamp');
    },
  };
  function handleMute(e) {
    const tag =
      /**@type {HTMLElement}*/
      e.target.tagName.toLowerCase();
    if (e.key === ' ' && tag !== 'input' && tag !== 'textarea') {
      window.QueUp.room.player.mutePlayer();
    }
  }
  const spacebarMute = {
    id: 'spacebar-mute',
    label: 'spacebar-mute.label',
    description: 'spacebar-mute.description',
    category: 'settings',
    turnOn() {
      document.addEventListener('keypress', handleMute);
    },
    turnOff() {
      document.removeEventListener('keypress', handleMute);
    },
  };
  function unloader(e) {
    let confirmationMessage = 'You are leaving';
    e.returnValue = confirmationMessage;
    return confirmationMessage;
  }
  const warnOnNavigation = {
    id: 'warn-redirect',
    label: 'warn-redirect.label',
    description: 'warn-redirect.description',
    category: 'settings',
    turnOn() {
      window.addEventListener('beforeunload', unloader);
    },
    turnOff() {
      window.removeEventListener('beforeunload', unloader);
    },
  };
  const name = 'dubplus';
  const version = '4.1.0';
  const description = 'Dub+ - A simple script/extension for QueUp.net';
  const license = 'MIT';
  const homepage = 'https://dub.plus';
  const pkg = {
    name,
    version,
    description,
    license,
    homepage,
  };
  const CDN_ROOT = '//cdn.jsdelivr.net/gh/DubPlus';
  const makeLink = function (className, fileName) {
    const link2 = document.createElement('link');
    link2.rel = 'stylesheet';
    link2.type = 'text/css';
    link2.className = className;
    link2.href = fileName;
    return link2;
  };
  function link(cssFile, className) {
    cssFile = cssFile.replace(/^\//, '');
    return new Promise((resolve, reject) => {
      var _a2;
      (_a2 = document.querySelector(`link.${className}`)) == null
        ? void 0
        : _a2.remove();
      const cacheBuster = pkg.version;
      let cdnPath = 'DubPlus';
      if ('master'.trim() !== 'main' && 'master'.trim() !== 'master') {
        cdnPath += '@' + 'master'.trim();
      }
      const link2 = makeLink(
        className,
        `${CDN_ROOT}/${cdnPath}/${cssFile}?${cacheBuster}`,
      );
      link2.onload = () => resolve();
      link2.onerror = reject;
      document.head.appendChild(link2);
    });
  }
  function style(cssFile, id) {
    var _a2;
    (_a2 = document.querySelector(`style#${id}`)) == null
      ? void 0
      : _a2.remove();
    return fetch(cssFile)
      .then((res) => res.text())
      .then((css) => {
        const style2 = document.createElement('style');
        style2.id = id;
        style2.textContent = css;
        document.head.appendChild(style2);
      });
  }
  const LINK_ELEM_ID$1 = 'dubplus-community-css';
  const communityTheme = {
    id: 'community-theme',
    label: 'community-theme.label',
    description: 'community-theme.description',
    category: 'customize',
    turnOn() {
      const location = window.QueUp.room.model.get('roomUrl');
      fetch(`https://api.queup.net/room/${location}`)
        .then((response) => response.json())
        .then((e) => {
          const content = e.data.description;
          const themeCheck = new RegExp(
            /(@dub(x|plus|\+)=)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/,
            'i',
          );
          let community = null;
          content.replace(themeCheck, function (match, p1, p2, p3) {
            community = p3;
          });
          if (!community) {
            logInfo('No community CSS theme found');
            return;
          }
          logInfo('loading community css theme from:', community);
          return style(community, LINK_ELEM_ID$1);
        })
        .catch((error) => {
          logError('Community CSS: Failed to load room info', error);
        });
    },
    turnOff() {
      var _a2;
      (_a2 = document.getElementById(LINK_ELEM_ID$1)) == null
        ? void 0
        : _a2.remove();
    },
  };
  const LINK_ELEM_ID = 'dubplus-user-custom-css';
  const customCss = {
    id: 'custom-css',
    label: 'custom-css.label',
    description: 'custom-css.description',
    category: 'customize',
    custom: {
      title: 'custom-css.modal.title',
      content: 'custom-css.modal.content',
      placeholder: 'custom-css.modal.placeholder',
      maxlength: 500,
      validation(value) {
        if (value.trim() === '') return true;
        if (!/^http.+\.css$/.test(value)) {
          return t('custom-css.modal.validation');
        }
        return true;
      },
      onConfirm(value) {
        var _a2;
        if (!value) {
          (_a2 = document.getElementById(LINK_ELEM_ID)) == null
            ? void 0
            : _a2.remove();
          settings.options[customCss.id] = false;
          return;
        } else {
          style(value, LINK_ELEM_ID).catch((e) => {
            logError('Error loading custom css file:', e);
          });
        }
      },
    },
    turnOn() {
      if (settings.custom[this.id]) {
        style(settings.custom[this.id], LINK_ELEM_ID).catch((e) => {
          logError('Error loading custom css file:', e);
        });
      }
    },
    turnOff() {
      var _a2;
      (_a2 = document.getElementById(LINK_ELEM_ID)) == null
        ? void 0
        : _a2.remove();
    },
  };
  function addCustomBG(url) {
    const img = getBackgroundImage();
    if (img) {
      img.setAttribute('data-original', img.src);
      img.src = url;
    }
  }
  function removeCustomBG() {
    const img = getBackgroundImage();
    if (img && img.hasAttribute('data-original')) {
      img.src = img.getAttribute('data-original');
      img.removeAttribute;
    }
  }
  const customBackground = {
    id: 'custom-bg',
    label: 'custom-bg.label',
    description: 'custom-bg.description',
    category: 'customize',
    custom: {
      title: 'custom-bg.modal.title',
      content: 'custom-bg.modal.content',
      placeholder: 'custom-bg.modal.placeholder',
      maxlength: 500,
      validation(value) {
        if (value.trim() === '') return true;
        if (!value.startsWith('http')) {
          return t('custom-bg.modal.validation');
        }
        return true;
      },
      onConfirm(value) {
        removeCustomBG();
        if (!value) {
          return;
        }
        addCustomBG(value);
      },
    },
    turnOn() {
      removeCustomBG();
      const savedCustomBG = settings.custom[this.id];
      if (savedCustomBG) {
        addCustomBG(savedCustomBG);
      }
    },
    turnOff() {
      removeCustomBG();
    },
  };
  let DubtrackDefaultSound;
  const customNotificationSound = {
    id: 'custom-notification-sound',
    label: 'custom-notification-sound.label',
    description: 'custom-notification-sound.description',
    category: 'customize',
    custom: {
      title: 'custom-notification-sound.modal.title',
      content: 'custom-notification-sound.modal.content',
      placeholder: 'custom-notification-sound.modal.placeholder',
      maxlength: 500,
      validation(value) {
        if (value.trim() === '') return true;
        if (!window.soundManager.canPlayURL(value)) {
          return t('custom-notification-sound.modal.validation');
        }
        return true;
      },
      onConfirm(value) {
        if (!value) {
          window.QueUp.room.chat.mentionChatSound.url = DubtrackDefaultSound;
          settings.options[customNotificationSound.id] = false;
        } else {
          window.QueUp.room.chat.mentionChatSound.url = value;
        }
      },
    },
    turnOn() {
      DubtrackDefaultSound = window.QueUp.room.chat.mentionChatSound.url;
      if (settings.custom[this.id]) {
        window.QueUp.room.chat.mentionChatSound.url = settings.custom[this.id];
      }
    },
    turnOff() {
      window.QueUp.room.chat.mentionChatSound.url = DubtrackDefaultSound;
    },
  };
  const flipInterface = {
    id: 'flip-interface',
    label: 'flip-interface.label',
    description: 'flip-interface.description',
    category: 'user-interface',
    turnOn() {
      document.body.classList.add('dubplus-flip-interface');
    },
    turnOff() {
      document.body.classList.remove('dubplus-flip-interface');
    },
  };
  let timer = null;
  function onTimerExpired() {
    if (!settings.options.afk) {
      logInfo('auto-afk timer expired, enabling afk');
      const afkSwitch = document.querySelector('#dubplus-afk [role=switch]');
      afkSwitch == null ? void 0 : afkSwitch.click();
    } else {
      logInfo('auto-afk timer expired, but afk is already enabled');
    }
  }
  function onBlur() {
    let userTime = parseInt(settings.custom['auto-afk'], 10);
    if (isNaN(userTime)) {
      userTime = 30;
    }
    logInfo('auto-afk onBlur: starting timer for ', userTime, 'minutes');
    timer = setTimeout(onTimerExpired, userTime * 60 * 1e3);
  }
  function onFocus() {
    if (timer) {
      logInfo('auto-afk onFocus: clearing timer');
      clearTimeout(timer);
      timer = null;
    } else {
      logInfo('auto-afk onFocus: no timer to clear');
    }
  }
  const autoAfk = {
    id: 'auto-afk',
    label: 'auto-afk.label',
    description: 'auto-afk.description',
    category: 'general',
    turnOn() {
      registerVisibilityChangeListeners(onFocus, onBlur);
    },
    turnOff() {
      unRegisterVisibilityChangeListeners(onFocus, onBlur);
      onFocus();
    },
    custom: {
      title: 'auto-afk.modal.title',
      content: 'auto-afk.modal.content',
      placeholder: '30',
      defaultValue: '30',
      maxlength: 10,
      validation(value) {
        if (value.trim() === '') return true;
        const num = parseInt(value, 10);
        if (value.includes('.') || isNaN(num) || num < 1) {
          return t(`auto-afk.modal.validation`);
        }
        return true;
      },
    },
  };
  function onGrab(e) {
    if (e.user._id === window.QueUp.session.id) {
      const message = settings.custom['grab-response'];
      if (message) {
        sendChatMessage(message);
      }
    }
  }
  const grabResponse = {
    id: 'grab-response',
    label: 'grab-response.label',
    description: 'grab-response.description',
    category: 'general',
    turnOn() {
      window.QueUp.Events.bind(GRAB, onGrab);
    },
    turnOff() {
      window.QueUp.Events.unbind(GRAB, onGrab);
    },
    custom: {
      title: 'grab-response.modal.title',
      content: 'grab-response.modal.content',
      placeholder: 'grab-response.modal.placeholder',
      maxlength: 255,
    },
  };
  function handleCollapseButtonClick(event2) {
    const parentElement = event2.target.parentElement;
    const imageContaner =
      /**@type {HTMLAnchorElement}*/
      event2.target.previousElementSibling;
    if (!parentElement.classList.contains('dubplus-collapsed')) {
      parentElement.classList.add('dubplus-collapsed');
      event2.target.title = 'expand image';
      imageContaner.setAttribute('aria-hidden', 'true');
      event2.target.setAttribute('aria-expanded', 'false');
    } else {
      parentElement.classList.remove('dubplus-collapsed');
      event2.target.title = 'collapse image';
      imageContaner.setAttribute('aria-hidden', 'false');
      event2.target.setAttribute('aria-expanded', 'true');
    }
  }
  function addCollapserToImage(autolinkImage) {
    if (!autolinkImage) return;
    if (
      !autolinkImage.parentElement.classList.contains(
        'dubplus-collapsible-image',
      )
    ) {
      autolinkImage.parentElement.classList.add('dubplus-collapsible-image');
      const button = document.createElement('button');
      button.type = 'button';
      button.title = 'collapse image';
      button.classList.add('dubplus-collapser');
      button.addEventListener('click', handleCollapseButtonClick);
      autolinkImage.parentElement.appendChild(button);
    }
  }
  function processChat(e) {
    if (e == null ? void 0 : e.chatid) {
      const chatMessage = document.querySelector(`.chat-id-${e.chatid}`);
      if (chatMessage) {
        addCollapserToImage(chatMessage.querySelector('.autolink-image'));
        return;
      }
    }
    const chatImages = getImagesInChat();
    chatImages.forEach(addCollapserToImage);
  }
  function reset() {
    document.querySelectorAll('.dubplus-collapsible-image').forEach((el) => {
      el.classList.remove('dubplus-collapsible-image');
      el.classList.remove('dubplus-collapsed');
    });
    document.querySelectorAll('.dubplus-collapser').forEach((el) => {
      el.removeEventListener('click', handleCollapseButtonClick);
      el.remove();
    });
    getImagesInChat().forEach((el) => el.removeAttribute('aria-hidden'));
  }
  const collapsibleImages = {
    id: 'collapsible-images',
    label: 'collapsible-images.label',
    description: 'collapsible-images.description',
    category: 'general',
    turnOn(onLoad) {
      window.QueUp.Events.bind(CHAT_MESSAGE, processChat);
      if (onLoad) {
        setTimeout(() => {
          processChat();
        }, 1e3);
      } else {
        processChat();
      }
    },
    turnOff() {
      window.QueUp.Events.unbind(CHAT_MESSAGE, processChat);
      reset();
    },
  };
  var root$c = /* @__PURE__ */ from_svg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M504.3 273.6c4.9-4.5 7.7-10.9 7.7-17.6s-2.8-13-7.7-17.6l-112-104c-7-6.5-17.2-8.2-25.9-4.4s-14.4 12.5-14.4 22l0 56-192 0 0-56c0-9.5-5.7-18.2-14.4-22s-18.9-2.1-25.9 4.4l-112 104C2.8 243 0 249.3 0 256s2.8 13 7.7 17.6l112 104c7 6.5 17.2 8.2 25.9 4.4s14.4-12.5 14.4-22l0-56 192 0 0 56c0 9.5 5.7 18.2 14.4 22s18.9 2.1 25.9-4.4l112-104z"></path></svg>`,
  );
  function IconLeftRight($$anchor) {
    var svg = root$c();
    append($$anchor, svg);
  }
  const pinMenu = {
    id: 'pin-menu',
    label: 'pin-menu.label',
    description: 'pin-menu.description',
    category: 'user-interface',
    turnOn() {
      const side = settings.custom[this.id] || 'right';
      document.body.classList.add(`dubplus-pin-menu-${side}`);
    },
    turnOff() {
      document.body.classList.remove('dubplus-pin-menu-left');
      document.body.classList.remove('dubplus-pin-menu-right');
    },
    secondaryAction: {
      description: 'pin-menu.secondaryAction.description',
      icon: IconLeftRight,
      onClick: () => {
        const currentSide = settings.custom[pinMenu.id] || 'right';
        const side = currentSide === 'left' ? 'right' : 'left';
        document.body.classList.toggle(
          'dubplus-pin-menu-left',
          side === 'left',
        );
        document.body.classList.toggle(
          'dubplus-pin-menu-right',
          side === 'right',
        );
        saveSetting('custom', pinMenu.id, side);
      },
    },
  };
  const general = [
    autovote,
    afk,
    autoAfk,
    emotes,
    autocomplete,
    customMentions,
    chatCleaner,
    collapsibleImages,
    mentionNotifications,
    pmNotifications,
    djNotification,
    showDubsOnHover,
    downdubsInChat,
    upDubInChat,
    grabsInChat,
    grabResponse,
    snow,
    rain,
  ];
  const userInterface = [
    fullscreen,
    splitChat,
    hideChat,
    hideVideo,
    hideAvatars,
    hideBackground,
    showTimestamps,
    flipInterface,
    pinMenu,
  ];
  const settingsModules = [spacebarMute, warnOnNavigation];
  const customize = [
    communityTheme,
    customCss,
    customBackground,
    customNotificationSound,
  ];
  var root$b = /* @__PURE__ */ from_html(`<!> <!>`, 1);
  function General($$anchor, $$props) {
    push($$props, false);
    init();
    var fragment = root$b();
    var node = first_child(fragment);
    {
      let $0 = /* @__PURE__ */ derived_safe_equal(() => t('general.title'));
      MenuHeader(node, {
        settingsId: 'general',
        get name() {
          return get($0);
        },
      });
    }
    var node_1 = sibling(node, 2);
    MenuSection(node_1, {
      settingsId: 'general',
      children: ($$anchor2, $$slotProps) => {
        var fragment_1 = comment();
        var node_2 = first_child(fragment_1);
        each(
          node_2,
          1,
          () => general,
          (module) => module.id,
          ($$anchor3, module) => {
            MenuSwitch($$anchor3, {
              get id() {
                return get(module).id;
              },
              get label() {
                return get(module).label;
              },
              get description() {
                return get(module).description;
              },
              get init() {
                return get(module).init;
              },
              get customize() {
                return get(module).custom;
              },
              get modOnly() {
                return get(module).modOnly;
              },
              get turnOn() {
                return get(module).turnOn;
              },
              get turnOff() {
                return get(module).turnOff;
              },
            });
          },
        );
        append($$anchor2, fragment_1);
      },
    });
    append($$anchor, fragment);
    pop();
  }
  var root$a = /* @__PURE__ */ from_html(
    `<button id="dubplus-eta" type="button" class="icon-history eta_tooltip_t dubplus-btn-player"></button>`,
  );
  function Eta($$anchor, $$props) {
    push($$props, true);
    let eta = /* @__PURE__ */ state('ETA');
    function getEta() {
      var _a2, _b;
      const booth_position =
        (_a2 = getQueuePosition()) == null ? void 0 : _a2.textContent;
      if (!booth_position) {
        return t('Eta.tooltip.notInQueue');
      }
      const average_song_minutes = 4;
      const current_time = parseInt(
        (_b = getCurrentSongMinutes()) == null ? void 0 : _b.textContent,
      );
      const position_in_queue = parseInt(booth_position);
      const booth_time =
        position_in_queue * average_song_minutes -
        average_song_minutes +
        current_time;
      if (booth_time >= 0) {
        return t('Eta.tootltip', { minutes: booth_time });
      } else {
        return t('Eta.tooltip.notInQueue');
      }
    }
    var button = root$a();
    action(
      button,
      ($$node, $$action_arg) =>
        teleport == null ? void 0 : teleport($$node, $$action_arg),
      () => ({ to: PLAYER_SHARING_CONTAINER }),
    );
    template_effect(() => {
      set_attribute(button, 'aria-label', get(eta));
      set_attribute(button, 'data-dp-tooltip', get(eta));
    });
    event('mouseenter', button, () => {
      set(eta, getEta(), true);
    });
    append($$anchor, button);
    pop();
  }
  var root$9 = /* @__PURE__ */ from_html(
    `<button id="dubplus-snooze" type="button" class="icon-mute snooze_btn dubplus-btn-player svelte-1va87zs"><span class="svelte-1va87zs">1</span></button>`,
  );
  function Snooze($$anchor, $$props) {
    push($$props, true);
    let tooltip = /* @__PURE__ */ state(proxy(t('Snooze.tooltip')));
    const eventUtils = { currentVol: 50, snoozed: false };
    function revert() {
      window.QueUp.room.player.setVolume(eventUtils.currentVol);
      window.QueUp.room.player.updateVolumeBar();
      eventUtils.snoozed = false;
      set(tooltip, t('Snooze.tooltip'), true);
      window.QueUp.Events.unbind(PLAYLIST_UPDATE, eventSongAdvance);
    }
    function eventSongAdvance(e) {
      if (e.startTime < 2 && eventUtils.snoozed) {
        revert();
        return true;
      }
    }
    function snooze2() {
      if (
        !eventUtils.snoozed &&
        !window.QueUp.room.player.muted_player &&
        window.QueUp.playerController.volume > 2
      ) {
        set(tooltip, t('Snooze.tooltip.undo'), true);
        eventUtils.currentVol = window.QueUp.playerController.volume;
        window.QueUp.room.player.mutePlayer();
        eventUtils.snoozed = true;
        window.QueUp.Events.bind(PLAYLIST_UPDATE, eventSongAdvance);
      } else if (eventUtils.snoozed) {
        revert();
      }
    }
    var button = root$9();
    button.__click = snooze2;
    action(
      button,
      ($$node, $$action_arg) =>
        teleport == null ? void 0 : teleport($$node, $$action_arg),
      () => ({ to: PLAYER_SHARING_CONTAINER }),
    );
    template_effect(() => {
      set_attribute(button, 'aria-label', get(tooltip));
      set_attribute(button, 'data-dp-tooltip', get(tooltip));
    });
    append($$anchor, button);
    pop();
  }
  delegate(['click']);
  var root_1 = /* @__PURE__ */ from_html(
    `<li><div class="ac-image svelte-198qtio"><img class="svelte-198qtio"/></div></li>`,
  );
  var root$8 = /* @__PURE__ */ from_html(
    `<div><div class="ac-header svelte-198qtio"><span class="sr-only"> </span> <div class="tip-container" aria-hidden="true"><span class="tip-navigate"><key class="icon-upvote"></key> &amp; <key class="icon-downvote"></key> </span> <span class="tip-complete"><key>TAB</key> or <key>ENTER</key> </span> <span class="tip-close"><key>ESC</key> </span></div></div> <ul id="autocomplete-preview" class="svelte-198qtio"></ul> <span class="ac-text-preview svelte-198qtio"> </span></div>`,
  );
  function EmojiPreview($$anchor, $$props) {
    push($$props, true);
    user_effect(() => {
      if (
        emojiState.emojiList.length > 0 &&
        typeof emojiState.selectedIndex === 'number'
      ) {
        const selected = document.querySelector('.preview-item.selected');
        if (selected) {
          selected.scrollIntoView({
            block: 'nearest',
            inline: 'nearest',
            behavior: 'smooth',
          });
        }
      }
    });
    function handleClick2(index) {
      const inputEl = getChatInput();
      insertEmote(inputEl, index);
      inputEl.focus();
    }
    var div = root$8();
    let classes;
    var div_1 = child(div);
    var span = child(div_1);
    var text_1 = child(span);
    var div_2 = sibling(span, 2);
    var span_1 = child(div_2);
    var text_2 = sibling(child(span_1), 3);
    var span_2 = sibling(span_1, 2);
    var text_3 = sibling(child(span_2), 3);
    var span_3 = sibling(span_2, 2);
    var text_4 = sibling(child(span_3));
    var ul = sibling(div_1, 2);
    each(
      ul,
      23,
      () => emojiState.emojiList,
      ({ src, text: text2, platform, alt }) => src + platform,
      ($$anchor2, $$item, i) => {
        let src = () => get($$item).src;
        let text2 = () => get($$item).text;
        let platform = () => get($$item).platform;
        let alt = () => get($$item).alt;
        var li = root_1();
        let classes_1;
        li.__click = () => handleClick2(get(i));
        var div_3 = child(li);
        var img = child(div_3);
        template_effect(
          ($0) => {
            classes_1 = set_class(
              li,
              1,
              `preview-item ${platform()}-previews`,
              'svelte-198qtio',
              classes_1,
              $0,
            );
            set_attribute(li, 'title', text2());
            set_attribute(img, 'src', src());
            set_attribute(img, 'alt', alt());
            set_attribute(img, 'title', alt());
          },
          [() => ({ selected: get(i) === emojiState.selectedIndex })],
        );
        append($$anchor2, li);
      },
    );
    var span_4 = sibling(ul, 2);
    var text_5 = child(span_4);
    action(
      div,
      ($$node, $$action_arg) =>
        teleport == null ? void 0 : teleport($$node, $$action_arg),
      () => ({ to: CHAT_INPUT_CONTAINER, position: 'prepend' }),
    );
    template_effect(
      ($0, $1, $2, $3, $4) => {
        var _a2;
        classes = set_class(
          div,
          1,
          'ac-preview-container svelte-198qtio',
          null,
          classes,
          $0,
        );
        set_text(text_1, $1);
        set_text(text_2, ` (${$2 ?? ''})`);
        set_text(text_3, ` (${$3 ?? ''})`);
        set_text(text_4, ` (${$4 ?? ''})`);
        set_text(
          text_5,
          (_a2 = emojiState.emojiList[emojiState.selectedIndex]) == null
            ? void 0
            : _a2.text,
        );
      },
      [
        () => ({ 'ac-show': emojiState.emojiList.length > 0 }),
        () => t('autocomplete.preview.a11y'),
        () => t('autocomplete.preview.navigate'),
        () => t('autocomplete.preview.select'),
        () => t('autocomplete.preview.close'),
      ],
    );
    append($$anchor, div);
    pop();
  }
  delegate(['click']);
  var on_click = (_, handleClick2, dub) => handleClick2(get(dub).username);
  var root_2$1 = /* @__PURE__ */ from_html(
    `<li class="preview-dubinfo-item users-previews svelte-ujv5bp"><div class="dubinfo-image svelte-ujv5bp"><img alt="User Avatar" class="svelte-ujv5bp"/></div> <button type="button" class="dubinfo-text svelte-ujv5bp"> </button></li>`,
  );
  var root_3 = /* @__PURE__ */ from_html(`<li><!></li>`);
  var root$7 = /* @__PURE__ */ from_html(
    `<div role="none"><ul id="dubinfo-preview"><!></ul></div>`,
  );
  function DubsInfo($$anchor, $$props) {
    push($$props, true);
    let dubData = /* @__PURE__ */ user_derived(() =>
      getDubCount($$props.dubType),
    );
    let positionRight = /* @__PURE__ */ state(0);
    let positionBottom = /* @__PURE__ */ state(0);
    let display = /* @__PURE__ */ state('none');
    function getTarget() {
      var _a2, _b;
      if ($$props.dubType === 'updub') {
        return (_a2 = getDubUp()) == null ? void 0 : _a2.parentElement;
      } else if ($$props.dubType === 'downdub') {
        return (_b = getDubDown()) == null ? void 0 : _b.parentElement;
      } else if ($$props.dubType === 'grab') {
        return getAddToPlaylist();
      }
      return null;
    }
    function onHover() {
      const hoverTarget = getTarget();
      if (hoverTarget) {
        const rect = hoverTarget.getBoundingClientRect();
        set(positionRight, window.innerWidth - rect.right);
        set(positionBottom, rect.height - 2);
        set(display, 'block');
      } else {
        logError(
          `Could not find hover target for ${$$props.dubType} in onHover`,
        );
      }
    }
    function onLeave(e) {
      if (
        e.relatedTarget &&
        /**@type {HTMLDivElement}*/
        e.relatedTarget.closest('.dubplus-dubs-container')
      ) {
        return;
      }
      set(display, 'none');
    }
    onMount(() => {
      const hoverTarget = getTarget();
      if (hoverTarget) {
        hoverTarget.addEventListener('mouseenter', onHover);
        hoverTarget.addEventListener('mouseleave', onLeave);
      } else {
        logError(
          `Could not find hover target for ${$$props.dubType} in onMount`,
        );
      }
    });
    onDestroy(() => {
      const hoverTarget = getTarget();
      if (hoverTarget) {
        hoverTarget.removeEventListener('mouseenter', onHover);
        hoverTarget.removeEventListener('mouseleave', onLeave);
      } else {
        logError(
          `Could not find hover target for ${$$props.dubType} in onDestroy`,
        );
      }
    });
    function handleClick2(username) {
      const chatInput = getChatInput();
      chatInput.value = `${chatInput.value}@${username} `.trimStart();
      chatInput.focus();
    }
    var div = root$7();
    var ul = child(div);
    let classes;
    var node = child(ul);
    {
      var consequent = ($$anchor2) => {
        var fragment = comment();
        var node_1 = first_child(fragment);
        each(
          node_1,
          17,
          () => get(dubData),
          (dub) => dub.userid,
          ($$anchor3, dub) => {
            var li = root_2$1();
            var div_1 = child(li);
            var img = child(div_1);
            var button = sibling(div_1, 2);
            button.__click = [on_click, handleClick2, dub];
            var text2 = child(button);
            template_effect(
              ($0) => {
                set_attribute(img, 'src', $0);
                set_text(text2, `@${get(dub).username ?? ''}`);
              },
              [() => userImage(get(dub).userid)],
            );
            append($$anchor3, li);
          },
        );
        append($$anchor2, fragment);
      };
      var alternate_1 = ($$anchor2) => {
        var li_1 = root_3();
        var node_2 = child(li_1);
        {
          var consequent_1 = ($$anchor3) => {
            var text_1 = text();
            template_effect(
              ($0) => set_text(text_1, $0),
              [() => t('dubs-hover.no-votes', { dubType: $$props.dubType })],
            );
            append($$anchor3, text_1);
          };
          var alternate = ($$anchor3) => {
            var text_2 = text();
            template_effect(
              ($0) => set_text(text_2, $0),
              [() => t('dubs-hover.no-grabs', { dubType: $$props.dubType })],
            );
            append($$anchor3, text_2);
          };
          if_block(node_2, ($$render) => {
            if ($$props.dubType === 'updub' || $$props.dubType === 'downdub')
              $$render(consequent_1);
            else $$render(alternate, false);
          });
        }
        append($$anchor2, li_1);
      };
      if_block(node, ($$render) => {
        if (get(dubData).length > 0) $$render(consequent);
        else $$render(alternate_1, false);
      });
    }
    action(
      div,
      ($$node, $$action_arg) =>
        teleport == null ? void 0 : teleport($$node, $$action_arg),
      () => ({ to: 'body' }),
    );
    template_effect(
      ($0) => {
        set_attribute(div, 'id', `dubplus-${$$props.dubType}s-container`);
        set_class(
          div,
          1,
          `dubplus-dubs-container dubplus-${$$props.dubType}s-container`,
          'svelte-ujv5bp',
        );
        set_style(
          div,
          `bottom: ${get(positionBottom)}px; right: ${get(positionRight)}px; display: ${get(display)};`,
        );
        classes = set_class(
          ul,
          1,
          'dubinfo-show svelte-ujv5bp',
          null,
          classes,
          $0,
        );
      },
      [() => ({ 'dubplus-no-dubs': get(dubData).length === 0 })],
    );
    event('mouseleave', div, () => set(display, 'none'));
    append($$anchor, div);
    pop();
  }
  delegate(['click']);
  const SNOWFLAKES_COUNT = 200;
  let snowflakesCount = SNOWFLAKES_COUNT;
  let baseCSS = '';
  const pageHeightVh = 100;
  function getSnowConatiner() {
    return document.getElementById('snow-container');
  }
  function getSnowAttributes() {
    var _a2;
    const snowWrapper = getSnowConatiner();
    snowflakesCount = Number(
      ((_a2 = snowWrapper == null ? void 0 : snowWrapper.dataset) == null
        ? void 0
        : _a2.count) || snowflakesCount,
    );
  }
  function generateSnow(snowDensity = 200) {
    snowDensity -= 1;
    const snowWrapper = getSnowConatiner();
    snowWrapper.replaceChildren();
    for (let i = 0; i < snowDensity; i++) {
      let board = document.createElement('div');
      board.className = 'snowflake';
      snowWrapper.appendChild(board);
    }
  }
  function getOrCreateCSSElement() {
    let cssElement = document.getElementById('psjs-css');
    if (cssElement) return cssElement;
    cssElement = document.createElement('style');
    cssElement.id = 'psjs-css';
    document.head.appendChild(cssElement);
    return cssElement;
  }
  function addCSS(rule = '') {
    const cssElement = getOrCreateCSSElement();
    cssElement.textContent = rule;
    document.head.appendChild(cssElement);
  }
  function randomInt(value = 100) {
    return Math.floor(Math.random() * value) + 1;
  }
  function randomIntRange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }
  function generateSnowCSS(snowDensity = 200) {
    let snowflakeName = 'snowflake';
    let rule = baseCSS;
    for (let i = 1; i < snowDensity; i++) {
      let randomX = Math.random() * 100;
      let randomOffset = Math.random() * 10;
      let randomXEnd = randomX + randomOffset;
      let randomXEndYoyo = randomX + randomOffset / 2;
      let randomYoyoTime = getRandomArbitrary(0.3, 0.8);
      let randomYoyoY = randomYoyoTime * pageHeightVh;
      let randomScale = Math.random();
      let fallDuration = randomIntRange(10, (pageHeightVh / 10) * 3);
      let fallDelay = randomInt((pageHeightVh / 10) * 3) * -1;
      let opacity = Math.random();
      rule += `
      .${snowflakeName}:nth-child(${i}) {
        opacity: ${opacity};
        transform: translate(${randomX}vw, -10px) scale(${randomScale});
        animation: fall-${i} ${fallDuration}s ${fallDelay}s linear infinite;
      }
      @keyframes fall-${i} {
        ${randomYoyoTime * 100}% {
          transform: translate(${randomXEnd}vw, ${randomYoyoY}vh) scale(${randomScale});
        }
        to {
          transform: translate(${randomXEndYoyo}vw, ${pageHeightVh}vh) scale(${randomScale});
        }
      }
    `;
    }
    addCSS(rule);
  }
  function createSnow() {
    getSnowAttributes();
    generateSnowCSS(snowflakesCount);
    generateSnow(snowflakesCount);
  }
  var root$6 = /* @__PURE__ */ from_html(
    `<div id="snow-container" class="svelte-qgqre1"></div>`,
  );
  function Snow($$anchor, $$props) {
    push($$props, false);
    onMount(() => {
      createSnow();
      window.addEventListener('resize', createSnow);
    });
    onDestroy(() => {
      window.removeEventListener('resize', createSnow);
    });
    init();
    var div = root$6();
    action(
      div,
      ($$node, $$action_arg) =>
        teleport == null ? void 0 : teleport($$node, $$action_arg),
      () => ({ to: 'body' }),
    );
    append($$anchor, div);
    pop();
  }
  var root$5 = /* @__PURE__ */ from_html(
    `<li class="svelte-psnl7x"><button type="button" class="svelte-psnl7x"><!> <span class="dubplus-menu-label svelte-psnl7x"> </span></button></li>`,
  );
  function MenuAction($$anchor, $$props) {
    push($$props, true);
    onMount(() => {
      if ($$props.init) $$props.init();
    });
    var li = root$5();
    var button = child(li);
    button.__click = function (...$$args) {
      var _a2;
      (_a2 = $$props.onClick) == null ? void 0 : _a2.apply(this, $$args);
    };
    var node = child(button);
    component(
      node,
      () => $$props.icon,
      ($$anchor2, Icon_1) => {
        Icon_1($$anchor2, {});
      },
    );
    var span = sibling(node, 2);
    var text2 = child(span);
    template_effect(
      ($0, $1, $2) => {
        set_attribute(li, 'id', $$props.id);
        set_attribute(li, 'title', $0);
        set_attribute(button, 'aria-label', $1);
        set_text(text2, $2);
      },
      [
        () => t($$props.description),
        () => t($$props.description),
        () => t($$props.label),
      ],
    );
    append($$anchor, li);
    pop();
  }
  delegate(['click']);
  var root$4 = /* @__PURE__ */ from_html(`<!> <!>`, 1);
  function UserInterface($$anchor, $$props) {
    push($$props, false);
    init();
    var fragment = root$4();
    var node = first_child(fragment);
    {
      let $0 = /* @__PURE__ */ derived_safe_equal(() =>
        t('user-interface.title'),
      );
      MenuHeader(node, {
        settingsId: 'user-interface',
        get name() {
          return get($0);
        },
      });
    }
    var node_1 = sibling(node, 2);
    MenuSection(node_1, {
      settingsId: 'user-interface',
      children: ($$anchor2, $$slotProps) => {
        var fragment_1 = comment();
        var node_2 = first_child(fragment_1);
        each(
          node_2,
          1,
          () => userInterface,
          (module) => module.id,
          ($$anchor3, module) => {
            var fragment_2 = comment();
            var node_3 = first_child(fragment_2);
            {
              var consequent = ($$anchor4) => {
                MenuAction($$anchor4, {
                  get id() {
                    return get(module).id;
                  },
                  get label() {
                    return get(module).label;
                  },
                  get description() {
                    return get(module).description;
                  },
                  get icon() {
                    return get(module).altIcon;
                  },
                  get onClick() {
                    return get(module).onClick;
                  },
                  get init() {
                    return get(module).init;
                  },
                });
              };
              var alternate = ($$anchor4) => {
                MenuSwitch($$anchor4, {
                  get id() {
                    return get(module).id;
                  },
                  get label() {
                    return get(module).label;
                  },
                  get description() {
                    return get(module).description;
                  },
                  get init() {
                    return get(module).init;
                  },
                  get customize() {
                    return get(module).custom;
                  },
                  get secondaryAction() {
                    return get(module).secondaryAction;
                  },
                  get turnOn() {
                    return get(module).turnOn;
                  },
                  get turnOff() {
                    return get(module).turnOff;
                  },
                });
              };
              if_block(node_3, ($$render) => {
                if (get(module).altIcon) $$render(consequent);
                else $$render(alternate, false);
              });
            }
            append($$anchor3, fragment_2);
          },
        );
        append($$anchor2, fragment_1);
      },
    });
    append($$anchor, fragment);
    pop();
  }
  var $$_import_settings = reactive_import(() => settings);
  var root$3 = /* @__PURE__ */ from_html(`<!> <!>`, 1);
  function Settings($$anchor, $$props) {
    push($$props, false);
    settingsModules.forEach((module) => {
      if (!$$_import_settings().options[module.id]) {
        $$_import_settings(($$_import_settings().options[module.id] = false));
      }
    });
    init();
    var fragment = root$3();
    var node = first_child(fragment);
    {
      let $0 = /* @__PURE__ */ derived_safe_equal(() => t('settings.title'));
      MenuHeader(node, {
        settingsId: 'settings',
        get name() {
          return get($0);
        },
      });
    }
    var node_1 = sibling(node, 2);
    MenuSection(node_1, {
      settingsId: 'settings',
      children: ($$anchor2, $$slotProps) => {
        var fragment_1 = comment();
        var node_2 = first_child(fragment_1);
        each(
          node_2,
          1,
          () => settingsModules,
          (module) => module.id,
          ($$anchor3, module) => {
            MenuSwitch($$anchor3, {
              get id() {
                return get(module).id;
              },
              get label() {
                return get(module).label;
              },
              get description() {
                return get(module).description;
              },
              get init() {
                return get(module).init;
              },
              get customize() {
                return get(module).custom;
              },
              get turnOn() {
                return get(module).turnOn;
              },
              get turnOff() {
                return get(module).turnOff;
              },
            });
          },
        );
        append($$anchor2, fragment_1);
      },
    });
    append($$anchor, fragment);
    pop();
  }
  var root$2 = /* @__PURE__ */ from_html(`<!> <!>`, 1);
  function Customize($$anchor, $$props) {
    push($$props, false);
    init();
    var fragment = root$2();
    var node = first_child(fragment);
    {
      let $0 = /* @__PURE__ */ derived_safe_equal(() => t('customize.title'));
      MenuHeader(node, {
        settingsId: 'customize',
        get name() {
          return get($0);
        },
      });
    }
    var node_1 = sibling(node, 2);
    MenuSection(node_1, {
      settingsId: 'customize',
      children: ($$anchor2, $$slotProps) => {
        var fragment_1 = comment();
        var node_2 = first_child(fragment_1);
        each(
          node_2,
          1,
          () => customize,
          (module) => module.id,
          ($$anchor3, module) => {
            MenuSwitch($$anchor3, {
              get id() {
                return get(module).id;
              },
              get label() {
                return get(module).label;
              },
              get description() {
                return get(module).description;
              },
              get init() {
                return get(module).init;
              },
              get customize() {
                return get(module).custom;
              },
              get turnOn() {
                return get(module).turnOn;
              },
              get turnOff() {
                return get(module).turnOff;
              },
            });
          },
        );
        append($$anchor2, fragment_1);
      },
    });
    append($$anchor, fragment);
    pop();
  }
  function snooze(_, SNOOZE_CLASS, tooltip, icon, eventSongAdvance, revert) {
    if (!document.body.classList.contains(SNOOZE_CLASS)) {
      set(tooltip, t('SnoozeVideo.tooltip.undo'), true);
      set(icon, 'icon-eye-unblocked');
      document.body.classList.add(SNOOZE_CLASS);
      window.QueUp.Events.bind(PLAYLIST_UPDATE, eventSongAdvance);
    } else {
      revert();
    }
  }
  var root$1 = /* @__PURE__ */ from_html(
    `<button id="dubplus-snooze-video" type="button"><span class="svelte-1va87zs">1</span></button>`,
  );
  function SnoozeVideo($$anchor, $$props) {
    push($$props, true);
    let icon = /* @__PURE__ */ state('icon-eye-blocked');
    let tooltip = /* @__PURE__ */ state(proxy(t('SnoozeVideo.tooltip')));
    const SNOOZE_CLASS = 'dubplus-snooze-video';
    function revert() {
      set(tooltip, t('SnoozeVideo.tooltip'), true);
      set(icon, 'icon-eye-blocked');
      document.body.classList.remove(SNOOZE_CLASS);
      window.QueUp.Events.unbind(PLAYLIST_UPDATE, eventSongAdvance);
    }
    function eventSongAdvance(e) {
      if (e.startTime < 2) {
        revert();
        return true;
      }
    }
    var button = root$1();
    button.__click = [
      /**
       * Hide the video
       */
      snooze,
      SNOOZE_CLASS,
      tooltip,
      icon,
      eventSongAdvance,
      revert,
    ];
    action(
      button,
      ($$node, $$action_arg) =>
        teleport == null ? void 0 : teleport($$node, $$action_arg),
      () => ({ to: PLAYER_SHARING_CONTAINER }),
    );
    template_effect(() => {
      set_class(
        button,
        1,
        `${get(icon)} snooze-video-btn dubplus-btn-player`,
        'svelte-1va87zs',
      );
      set_attribute(button, 'aria-label', get(tooltip));
      set_attribute(button, 'data-dp-tooltip', get(tooltip));
    });
    append($$anchor, button);
    pop();
  }
  delegate(['click']);
  var root_2 = /* @__PURE__ */ from_html(`<!> <!> <!>`, 1);
  var root = /* @__PURE__ */ from_html(
    `<!> <!> <!> <!> <!> <!> <!> <aside class="dubplus-menu svelte-yl0u1x"><p class="dubplus-menu-header svelte-yl0u1x"> <span class="version svelte-yl0u1x"> </span></p> <!> <!> <!> <!> <!></aside> <!>`,
    1,
  );
  function Menu($$anchor, $$props) {
    push($$props, false);
    onMount(() => {
      document.querySelector('html').classList.add('dubplus');
    });
    init();
    var fragment = root();
    var node = first_child(fragment);
    Snooze(node, {});
    var node_1 = sibling(node, 2);
    MenuIcon(node_1, {});
    var node_2 = sibling(node_1, 2);
    Eta(node_2, {});
    var node_3 = sibling(node_2, 2);
    SnoozeVideo(node_3, {});
    var node_4 = sibling(node_3, 2);
    {
      var consequent = ($$anchor2) => {
        EmojiPreview($$anchor2, {});
      };
      if_block(node_4, ($$render) => {
        if (settings.options.autocomplete) $$render(consequent);
      });
    }
    var node_5 = sibling(node_4, 2);
    {
      var consequent_1 = ($$anchor2) => {
        var fragment_2 = root_2();
        var node_6 = first_child(fragment_2);
        DubsInfo(node_6, { dubType: 'updub' });
        var node_7 = sibling(node_6, 2);
        DubsInfo(node_7, { dubType: 'downdub' });
        var node_8 = sibling(node_7, 2);
        DubsInfo(node_8, { dubType: 'grab' });
        append($$anchor2, fragment_2);
      };
      if_block(node_5, ($$render) => {
        if (settings.options['dubs-hover']) $$render(consequent_1);
      });
    }
    var node_9 = sibling(node_5, 2);
    {
      var consequent_2 = ($$anchor2) => {
        Snow($$anchor2, {});
      };
      if_block(node_9, ($$render) => {
        if (settings.options.snow) $$render(consequent_2);
      });
    }
    var aside = sibling(node_9, 2);
    var p = child(aside);
    var text2 = child(p);
    var span = sibling(text2);
    var text_1 = child(span);
    var node_10 = sibling(p, 2);
    General(node_10, {});
    var node_11 = sibling(node_10, 2);
    UserInterface(node_11, {});
    var node_12 = sibling(node_11, 2);
    Settings(node_12, {});
    var node_13 = sibling(node_12, 2);
    Customize(node_13, {});
    var node_14 = sibling(node_13, 2);
    Contact(node_14, {});
    var node_15 = sibling(aside, 2);
    Modal(node_15, {});
    template_effect(
      ($0) => {
        set_text(text2, `${$0 ?? ''} `);
        set_text(text_1, `v${pkg.version}`);
      },
      [() => t('Menu.title')],
    );
    append($$anchor, fragment);
    pop();
  }
  function DubPlus($$anchor, $$props) {
    push($$props, true);
    window.dubplus = Object.assign(window.dubplus || {}, {
      name: pkg.name,
      version: pkg.version,
      description: pkg.description,
      license: pkg.license,
      homepage: pkg.homepage,
    });
    let status = /* @__PURE__ */ state('loading');
    const checkList = [
      'QueUp.session.id',
      'QueUp.room.chat',
      'QueUp.Events',
      'QueUp.room.player',
      'QueUp.helpers.cookie',
      'QueUp.room.model',
      'QueUp.room.users',
    ];
    waitFor(checkList)
      .then(() => {
        set(status, 'ready');
      })
      .catch(() => {
        var _a2, _b;
        if (
          !((_b = (_a2 = window.QueUp) == null ? void 0 : _a2.session) == null
            ? void 0
            : _b.id)
        ) {
          set(status, 'loggedout');
        } else {
          set(status, 'error');
        }
      });
    function showErrorModal(content) {
      modalState.title = t('Error.modal.title');
      modalState.content = content;
      modalState.open = true;
    }
    user_effect(() => {
      if (get(status) === 'loggedout') {
        showErrorModal(t('Error.modal.loggedout'));
      } else if (get(status) === 'error') {
        showErrorModal(t('Error.unknown'));
      }
    });
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent = ($$anchor2) => {
        Loading($$anchor2, {});
      };
      var alternate_1 = ($$anchor2) => {
        var fragment_2 = comment();
        var node_1 = first_child(fragment_2);
        {
          var consequent_1 = ($$anchor3) => {
            Menu($$anchor3, {});
          };
          var alternate = ($$anchor3) => {
            Modal($$anchor3, {});
          };
          if_block(
            node_1,
            ($$render) => {
              if (get(status) === 'ready') $$render(consequent_1);
              else $$render(alternate, false);
            },
            true,
          );
        }
        append($$anchor2, fragment_2);
      };
      if_block(node, ($$render) => {
        if (get(status) === 'loading') $$render(consequent);
        else $$render(alternate_1, false);
      });
    }
    append($$anchor, fragment);
    pop();
  }
  const loadedAsExtension = 'dubplusExtensionLoaded' in window;
  logInfo('Dub+: loaded as extension:', loadedAsExtension);
  if (!loadedAsExtension) {
    link('/dubplus.css', 'dubplus-css').catch((e) => {
      logError('Failed to load dubplus.css', e);
    });
  }
  let container = document.getElementById('dubplus-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'dubplus-container';
    document.body.appendChild(container);
  } else if (container.children.length > 0) {
    unmount(container);
    container.replaceChildren();
  }
  const app = mount(DubPlus, {
    target: container,
  });
  return app;
})();
