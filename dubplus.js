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

    v4.1.2

    MIT License 

    Copyright (c) 2026 DubPlus

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
var dubplus = (function() {
  "use strict";
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
  const MANAGED_EFFECT = 1 << 24;
  const BLOCK_EFFECT = 1 << 4;
  const BRANCH_EFFECT = 1 << 5;
  const ROOT_EFFECT = 1 << 6;
  const BOUNDARY_EFFECT = 1 << 7;
  const CONNECTED = 1 << 9;
  const CLEAN = 1 << 10;
  const DIRTY = 1 << 11;
  const MAYBE_DIRTY = 1 << 12;
  const INERT = 1 << 13;
  const DESTROYED = 1 << 14;
  const EFFECT_RAN = 1 << 15;
  const EFFECT_TRANSPARENT = 1 << 16;
  const EAGER_EFFECT = 1 << 17;
  const HEAD_EFFECT = 1 << 18;
  const EFFECT_PRESERVED = 1 << 19;
  const USER_EFFECT = 1 << 20;
  const EFFECT_OFFSCREEN = 1 << 25;
  const WAS_MARKED = 1 << 15;
  const REACTION_IS_UPDATING = 1 << 21;
  const ASYNC = 1 << 22;
  const ERROR_VALUE = 1 << 23;
  const STATE_SYMBOL = /* @__PURE__ */ Symbol("$state");
  const LOADING_ATTR_SYMBOL = /* @__PURE__ */ Symbol("");
  const STALE_REACTION = new class StaleReactionError extends Error {
    name = "StaleReactionError";
    message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
  }();
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
  function svelte_boundary_reset_onerror() {
    {
      throw new Error(`https://svelte.dev/e/svelte_boundary_reset_onerror`);
    }
  }
  const EACH_ITEM_REACTIVE = 1;
  const EACH_INDEX_REACTIVE = 1 << 1;
  const EACH_IS_CONTROLLED = 1 << 2;
  const EACH_IS_ANIMATED = 1 << 3;
  const EACH_ITEM_IMMUTABLE = 1 << 4;
  const TEMPLATE_FRAGMENT = 1;
  const TEMPLATE_USE_IMPORT_NODE = 1 << 1;
  const UNINITIALIZED = /* @__PURE__ */ Symbol();
  const NAMESPACE_HTML = "http://www.w3.org/1999/xhtml";
  function svelte_boundary_reset_noop() {
    {
      console.warn(`https://svelte.dev/e/svelte_boundary_reset_noop`);
    }
  }
  function equals(value) {
    return value === this.v;
  }
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
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
      i: false,
      c: null,
      e: null,
      s: props,
      x: null,
      l: legacy_mode_flag && !runes ? { s: null, u: null, $: [] } : null
    };
  }
  function pop(component2) {
    var context = (
      /** @type {ComponentContext} */
      component_context
    );
    var effects = context.e;
    if (effects !== null) {
      context.e = null;
      for (var fn of effects) {
        create_user_effect(fn);
      }
    }
    context.i = true;
    component_context = context.p;
    return (
      /** @type {T} */
      {}
    );
  }
  function is_runes() {
    return !legacy_mode_flag || component_context !== null && component_context.l === null;
  }
  let micro_tasks = [];
  function run_micro_tasks() {
    var tasks = micro_tasks;
    micro_tasks = [];
    run_all(tasks);
  }
  function queue_micro_task(fn) {
    if (micro_tasks.length === 0 && !is_flushing_sync) {
      var tasks = micro_tasks;
      queueMicrotask(() => {
        if (tasks === micro_tasks) run_micro_tasks();
      });
    }
    micro_tasks.push(fn);
  }
  function flush_tasks() {
    while (micro_tasks.length > 0) {
      run_micro_tasks();
    }
  }
  function handle_error(error) {
    var effect2 = active_effect;
    if (effect2 === null) {
      active_reaction.f |= ERROR_VALUE;
      return error;
    }
    if ((effect2.f & EFFECT_RAN) === 0) {
      if ((effect2.f & BOUNDARY_EFFECT) === 0) {
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
    throw error;
  }
  const STATUS_MASK = -7169;
  function set_signal_status(signal, status) {
    signal.f = signal.f & STATUS_MASK | status;
  }
  function update_derived_status(derived2) {
    if ((derived2.f & CONNECTED) !== 0 || derived2.deps === null) {
      set_signal_status(derived2, CLEAN);
    } else {
      set_signal_status(derived2, MAYBE_DIRTY);
    }
  }
  function clear_marked(deps) {
    if (deps === null) return;
    for (const dep of deps) {
      if ((dep.f & DERIVED) === 0 || (dep.f & WAS_MARKED) === 0) {
        continue;
      }
      dep.f ^= WAS_MARKED;
      clear_marked(
        /** @type {Derived} */
        dep.deps
      );
    }
  }
  function defer_effect(effect2, dirty_effects, maybe_dirty_effects) {
    if ((effect2.f & DIRTY) !== 0) {
      dirty_effects.add(effect2);
    } else if ((effect2.f & MAYBE_DIRTY) !== 0) {
      maybe_dirty_effects.add(effect2);
    }
    clear_marked(effect2.deps);
    set_signal_status(effect2, CLEAN);
  }
  const batches = /* @__PURE__ */ new Set();
  let current_batch = null;
  let previous_batch = null;
  let batch_values = null;
  let queued_root_effects = [];
  let last_scheduled_effect = null;
  let is_flushing = false;
  let is_flushing_sync = false;
  class Batch {
    committed = false;
    /**
     * The current values of any sources that are updated in this batch
     * They keys of this map are identical to `this.#previous`
     * @type {Map<Source, any>}
     */
    current = /* @__PURE__ */ new Map();
    /**
     * The values of any sources that are updated in this batch _before_ those updates took place.
     * They keys of this map are identical to `this.#current`
     * @type {Map<Source, any>}
     */
    previous = /* @__PURE__ */ new Map();
    /**
     * When the batch is committed (and the DOM is updated), we need to remove old branches
     * and append new ones by calling the functions added inside (if/each/key/etc) blocks
     * @type {Set<() => void>}
     */
    #commit_callbacks = /* @__PURE__ */ new Set();
    /**
     * If a fork is discarded, we need to destroy any effects that are no longer needed
     * @type {Set<(batch: Batch) => void>}
     */
    #discard_callbacks = /* @__PURE__ */ new Set();
    /**
     * The number of async effects that are currently in flight
     */
    #pending = 0;
    /**
     * The number of async effects that are currently in flight, _not_ inside a pending boundary
     */
    #blocking_pending = 0;
    /**
     * A deferred that resolves when the batch is committed, used with `settled()`
     * TODO replace with Promise.withResolvers once supported widely enough
     * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
     */
    #deferred = null;
    /**
     * Deferred effects (which run after async work has completed) that are DIRTY
     * @type {Set<Effect>}
     */
    #dirty_effects = /* @__PURE__ */ new Set();
    /**
     * Deferred effects that are MAYBE_DIRTY
     * @type {Set<Effect>}
     */
    #maybe_dirty_effects = /* @__PURE__ */ new Set();
    /**
     * A set of branches that still exist, but will be destroyed when this batch
     * is committed — we skip over these during `process`
     * @type {Set<Effect>}
     */
    skipped_effects = /* @__PURE__ */ new Set();
    is_fork = false;
    is_deferred() {
      return this.is_fork || this.#blocking_pending > 0;
    }
    /**
     *
     * @param {Effect[]} root_effects
     */
    process(root_effects) {
      queued_root_effects = [];
      previous_batch = null;
      this.apply();
      var effects = [];
      var render_effects = [];
      for (const root2 of root_effects) {
        this.#traverse_effect_tree(root2, effects, render_effects);
      }
      if (!this.is_fork) {
        this.#resolve();
      }
      if (this.is_deferred()) {
        this.#defer_effects(render_effects);
        this.#defer_effects(effects);
      } else {
        previous_batch = this;
        current_batch = null;
        flush_queued_effects(render_effects);
        flush_queued_effects(effects);
        previous_batch = null;
        this.#deferred?.resolve();
      }
      batch_values = null;
    }
    /**
     * Traverse the effect tree, executing effects or stashing
     * them for later execution as appropriate
     * @param {Effect} root
     * @param {Effect[]} effects
     * @param {Effect[]} render_effects
     */
    #traverse_effect_tree(root2, effects, render_effects) {
      root2.f ^= CLEAN;
      var effect2 = root2.first;
      var pending_boundary = null;
      while (effect2 !== null) {
        var flags2 = effect2.f;
        var is_branch = (flags2 & (BRANCH_EFFECT | ROOT_EFFECT)) !== 0;
        var is_skippable_branch = is_branch && (flags2 & CLEAN) !== 0;
        var skip = is_skippable_branch || (flags2 & INERT) !== 0 || this.skipped_effects.has(effect2);
        if (!skip && effect2.fn !== null) {
          if (is_branch) {
            effect2.f ^= CLEAN;
          } else if (pending_boundary !== null && (flags2 & (EFFECT | RENDER_EFFECT | MANAGED_EFFECT)) !== 0) {
            pending_boundary.b.defer_effect(effect2);
          } else if ((flags2 & EFFECT) !== 0) {
            effects.push(effect2);
          } else if (is_dirty(effect2)) {
            if ((flags2 & BLOCK_EFFECT) !== 0) this.#dirty_effects.add(effect2);
            update_effect(effect2);
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
          if (parent === pending_boundary) {
            pending_boundary = null;
          }
          effect2 = parent.next;
          parent = parent.parent;
        }
      }
    }
    /**
     * @param {Effect[]} effects
     */
    #defer_effects(effects) {
      for (var i = 0; i < effects.length; i += 1) {
        defer_effect(effects[i], this.#dirty_effects, this.#maybe_dirty_effects);
      }
    }
    /**
     * Associate a change to a given source with the current
     * batch, noting its previous and current values
     * @param {Source} source
     * @param {any} value
     */
    capture(source2, value) {
      if (value !== UNINITIALIZED && !this.previous.has(source2)) {
        this.previous.set(source2, value);
      }
      if ((source2.f & ERROR_VALUE) === 0) {
        this.current.set(source2, source2.v);
        batch_values?.set(source2, source2.v);
      }
    }
    activate() {
      current_batch = this;
      this.apply();
    }
    deactivate() {
      if (current_batch !== this) return;
      current_batch = null;
      batch_values = null;
    }
    flush() {
      this.activate();
      if (queued_root_effects.length > 0) {
        flush_effects();
        if (current_batch !== null && current_batch !== this) {
          return;
        }
      } else if (this.#pending === 0) {
        this.process([]);
      }
      this.deactivate();
    }
    discard() {
      for (const fn of this.#discard_callbacks) fn(this);
      this.#discard_callbacks.clear();
    }
    #resolve() {
      if (this.#blocking_pending === 0) {
        for (const fn of this.#commit_callbacks) fn();
        this.#commit_callbacks.clear();
      }
      if (this.#pending === 0) {
        this.#commit();
      }
    }
    #commit() {
      if (batches.size > 1) {
        this.previous.clear();
        var previous_batch_values = batch_values;
        var is_earlier = true;
        for (const batch of batches) {
          if (batch === this) {
            is_earlier = false;
            continue;
          }
          const sources = [];
          for (const [source2, value] of this.current) {
            if (batch.current.has(source2)) {
              if (is_earlier && value !== batch.current.get(source2)) {
                batch.current.set(source2, value);
              } else {
                continue;
              }
            }
            sources.push(source2);
          }
          if (sources.length === 0) {
            continue;
          }
          const others = [...batch.current.keys()].filter((s) => !this.current.has(s));
          if (others.length > 0) {
            var prev_queued_root_effects = queued_root_effects;
            queued_root_effects = [];
            const marked = /* @__PURE__ */ new Set();
            const checked = /* @__PURE__ */ new Map();
            for (const source2 of sources) {
              mark_effects(source2, others, marked, checked);
            }
            if (queued_root_effects.length > 0) {
              current_batch = batch;
              batch.apply();
              for (const root2 of queued_root_effects) {
                batch.#traverse_effect_tree(root2, [], []);
              }
              batch.deactivate();
            }
            queued_root_effects = prev_queued_root_effects;
          }
        }
        current_batch = null;
        batch_values = previous_batch_values;
      }
      this.committed = true;
      batches.delete(this);
    }
    /**
     *
     * @param {boolean} blocking
     */
    increment(blocking) {
      this.#pending += 1;
      if (blocking) this.#blocking_pending += 1;
    }
    /**
     *
     * @param {boolean} blocking
     */
    decrement(blocking) {
      this.#pending -= 1;
      if (blocking) this.#blocking_pending -= 1;
      this.revive();
    }
    revive() {
      for (const e of this.#dirty_effects) {
        this.#maybe_dirty_effects.delete(e);
        set_signal_status(e, DIRTY);
        schedule_effect(e);
      }
      for (const e of this.#maybe_dirty_effects) {
        set_signal_status(e, MAYBE_DIRTY);
        schedule_effect(e);
      }
      this.flush();
    }
    /** @param {() => void} fn */
    oncommit(fn) {
      this.#commit_callbacks.add(fn);
    }
    /** @param {(batch: Batch) => void} fn */
    ondiscard(fn) {
      this.#discard_callbacks.add(fn);
    }
    settled() {
      return (this.#deferred ??= deferred()).promise;
    }
    static ensure() {
      if (current_batch === null) {
        const batch = current_batch = new Batch();
        batches.add(current_batch);
        if (!is_flushing_sync) {
          Batch.enqueue(() => {
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
      queue_micro_task(task);
    }
    apply() {
      return;
    }
  }
  function flushSync(fn) {
    var was_flushing_sync = is_flushing_sync;
    is_flushing_sync = true;
    try {
      var result;
      if (fn) ;
      while (true) {
        flush_tasks();
        if (queued_root_effects.length === 0) {
          current_batch?.flush();
          if (queued_root_effects.length === 0) {
            last_scheduled_effect = null;
            return (
              /** @type {T} */
              result
            );
          }
        }
        flush_effects();
      }
    } finally {
      is_flushing_sync = was_flushing_sync;
    }
  }
  function flush_effects() {
    var was_updating_effect = is_updating_effect;
    is_flushing = true;
    var source_stacks = null;
    try {
      var flush_count = 0;
      set_is_updating_effect(true);
      while (queued_root_effects.length > 0) {
        var batch = Batch.ensure();
        if (flush_count++ > 1e3) {
          var updates, entry;
          if (DEV) ;
          infinite_loop_guard();
        }
        batch.process(queued_root_effects);
        old_values.clear();
        if (DEV) ;
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
  let eager_block_effects = null;
  function flush_queued_effects(effects) {
    var length = effects.length;
    if (length === 0) return;
    var i = 0;
    while (i < length) {
      var effect2 = effects[i++];
      if ((effect2.f & (DESTROYED | INERT)) === 0 && is_dirty(effect2)) {
        eager_block_effects = /* @__PURE__ */ new Set();
        update_effect(effect2);
        if (effect2.deps === null && effect2.first === null && effect2.nodes === null) {
          if (effect2.teardown === null && effect2.ac === null) {
            unlink_effect(effect2);
          } else {
            effect2.fn = null;
          }
        }
        if (eager_block_effects?.size > 0) {
          old_values.clear();
          for (const e of eager_block_effects) {
            if ((e.f & (DESTROYED | INERT)) !== 0) continue;
            const ordered_effects = [e];
            let ancestor = e.parent;
            while (ancestor !== null) {
              if (eager_block_effects.has(ancestor)) {
                eager_block_effects.delete(ancestor);
                ordered_effects.push(ancestor);
              }
              ancestor = ancestor.parent;
            }
            for (let j = ordered_effects.length - 1; j >= 0; j--) {
              const e2 = ordered_effects[j];
              if ((e2.f & (DESTROYED | INERT)) !== 0) continue;
              update_effect(e2);
            }
          }
          eager_block_effects.clear();
        }
      }
    }
    eager_block_effects = null;
  }
  function mark_effects(value, sources, marked, checked) {
    if (marked.has(value)) return;
    marked.add(value);
    if (value.reactions !== null) {
      for (const reaction of value.reactions) {
        const flags2 = reaction.f;
        if ((flags2 & DERIVED) !== 0) {
          mark_effects(
            /** @type {Derived} */
            reaction,
            sources,
            marked,
            checked
          );
        } else if ((flags2 & (ASYNC | BLOCK_EFFECT)) !== 0 && (flags2 & DIRTY) === 0 && depends_on(reaction, sources, checked)) {
          set_signal_status(reaction, DIRTY);
          schedule_effect(
            /** @type {Effect} */
            reaction
          );
        }
      }
    }
  }
  function depends_on(reaction, sources, checked) {
    const depends = checked.get(reaction);
    if (depends !== void 0) return depends;
    if (reaction.deps !== null) {
      for (const dep of reaction.deps) {
        if (sources.includes(dep)) {
          return true;
        }
        if ((dep.f & DERIVED) !== 0 && depends_on(
          /** @type {Derived} */
          dep,
          sources,
          checked
        )) {
          checked.set(
            /** @type {Derived} */
            dep,
            true
          );
          return true;
        }
      }
    }
    checked.set(reaction, false);
    return false;
  }
  function schedule_effect(signal) {
    var effect2 = last_scheduled_effect = signal;
    while (effect2.parent !== null) {
      effect2 = effect2.parent;
      var flags2 = effect2.f;
      if (is_flushing && effect2 === active_effect && (flags2 & BLOCK_EFFECT) !== 0 && (flags2 & HEAD_EFFECT) === 0) {
        return;
      }
      if ((flags2 & (ROOT_EFFECT | BRANCH_EFFECT)) !== 0) {
        if ((flags2 & CLEAN) === 0) return;
        effect2.f ^= CLEAN;
      }
    }
    queued_root_effects.push(effect2);
  }
  function createSubscriber(start) {
    let subscribers = 0;
    let version2 = source(0);
    let stop;
    return () => {
      if (effect_tracking()) {
        get(version2);
        render_effect(() => {
          if (subscribers === 0) {
            stop = untrack(() => start(() => increment$1(version2)));
          }
          subscribers += 1;
          return () => {
            queue_micro_task(() => {
              subscribers -= 1;
              if (subscribers === 0) {
                stop?.();
                stop = void 0;
                increment$1(version2);
              }
            });
          };
        });
      }
    };
  }
  var flags = EFFECT_TRANSPARENT | EFFECT_PRESERVED | BOUNDARY_EFFECT;
  function boundary(node, props, children) {
    new Boundary(node, props, children);
  }
  class Boundary {
    /** @type {Boundary | null} */
    parent;
    is_pending = false;
    /** @type {TemplateNode} */
    #anchor;
    /** @type {TemplateNode | null} */
    #hydrate_open = null;
    /** @type {BoundaryProps} */
    #props;
    /** @type {((anchor: Node) => void)} */
    #children;
    /** @type {Effect} */
    #effect;
    /** @type {Effect | null} */
    #main_effect = null;
    /** @type {Effect | null} */
    #pending_effect = null;
    /** @type {Effect | null} */
    #failed_effect = null;
    /** @type {DocumentFragment | null} */
    #offscreen_fragment = null;
    /** @type {TemplateNode | null} */
    #pending_anchor = null;
    #local_pending_count = 0;
    #pending_count = 0;
    #is_creating_fallback = false;
    /** @type {Set<Effect>} */
    #dirty_effects = /* @__PURE__ */ new Set();
    /** @type {Set<Effect>} */
    #maybe_dirty_effects = /* @__PURE__ */ new Set();
    /**
     * A source containing the number of pending async deriveds/expressions.
     * Only created if `$effect.pending()` is used inside the boundary,
     * otherwise updating the source results in needless `Batch.ensure()`
     * calls followed by no-op flushes
     * @type {Source<number> | null}
     */
    #effect_pending = null;
    #effect_pending_subscriber = createSubscriber(() => {
      this.#effect_pending = source(this.#local_pending_count);
      return () => {
        this.#effect_pending = null;
      };
    });
    /**
     * @param {TemplateNode} node
     * @param {BoundaryProps} props
     * @param {((anchor: Node) => void)} children
     */
    constructor(node, props, children) {
      this.#anchor = node;
      this.#props = props;
      this.#children = children;
      this.parent = /** @type {Effect} */
      active_effect.b;
      this.is_pending = !!this.#props.pending;
      this.#effect = block(() => {
        active_effect.b = this;
        {
          var anchor = this.#get_anchor();
          try {
            this.#main_effect = branch(() => children(anchor));
          } catch (error) {
            this.error(error);
          }
          if (this.#pending_count > 0) {
            this.#show_pending_snippet();
          } else {
            this.is_pending = false;
          }
        }
        return () => {
          this.#pending_anchor?.remove();
        };
      }, flags);
    }
    #hydrate_resolved_content() {
      try {
        this.#main_effect = branch(() => this.#children(this.#anchor));
      } catch (error) {
        this.error(error);
      }
    }
    #hydrate_pending_content() {
      const pending = this.#props.pending;
      if (!pending) {
        return;
      }
      this.#pending_effect = branch(() => pending(this.#anchor));
      Batch.enqueue(() => {
        var anchor = this.#get_anchor();
        this.#main_effect = this.#run(() => {
          Batch.ensure();
          return branch(() => this.#children(anchor));
        });
        if (this.#pending_count > 0) {
          this.#show_pending_snippet();
        } else {
          pause_effect(
            /** @type {Effect} */
            this.#pending_effect,
            () => {
              this.#pending_effect = null;
            }
          );
          this.is_pending = false;
        }
      });
    }
    #get_anchor() {
      var anchor = this.#anchor;
      if (this.is_pending) {
        this.#pending_anchor = create_text();
        this.#anchor.before(this.#pending_anchor);
        anchor = this.#pending_anchor;
      }
      return anchor;
    }
    /**
     * Defer an effect inside a pending boundary until the boundary resolves
     * @param {Effect} effect
     */
    defer_effect(effect2) {
      defer_effect(effect2, this.#dirty_effects, this.#maybe_dirty_effects);
    }
    /**
     * Returns `false` if the effect exists inside a boundary whose pending snippet is shown
     * @returns {boolean}
     */
    is_rendered() {
      return !this.is_pending && (!this.parent || this.parent.is_rendered());
    }
    has_pending_snippet() {
      return !!this.#props.pending;
    }
    /**
     * @param {() => Effect | null} fn
     */
    #run(fn) {
      var previous_effect = active_effect;
      var previous_reaction = active_reaction;
      var previous_ctx = component_context;
      set_active_effect(this.#effect);
      set_active_reaction(this.#effect);
      set_component_context(this.#effect.ctx);
      try {
        return fn();
      } catch (e) {
        handle_error(e);
        return null;
      } finally {
        set_active_effect(previous_effect);
        set_active_reaction(previous_reaction);
        set_component_context(previous_ctx);
      }
    }
    #show_pending_snippet() {
      const pending = (
        /** @type {(anchor: Node) => void} */
        this.#props.pending
      );
      if (this.#main_effect !== null) {
        this.#offscreen_fragment = document.createDocumentFragment();
        this.#offscreen_fragment.append(
          /** @type {TemplateNode} */
          this.#pending_anchor
        );
        move_effect(this.#main_effect, this.#offscreen_fragment);
      }
      if (this.#pending_effect === null) {
        this.#pending_effect = branch(() => pending(this.#anchor));
      }
    }
    /**
     * Updates the pending count associated with the currently visible pending snippet,
     * if any, such that we can replace the snippet with content once work is done
     * @param {1 | -1} d
     */
    #update_pending_count(d) {
      if (!this.has_pending_snippet()) {
        if (this.parent) {
          this.parent.#update_pending_count(d);
        }
        return;
      }
      this.#pending_count += d;
      if (this.#pending_count === 0) {
        this.is_pending = false;
        for (const e of this.#dirty_effects) {
          set_signal_status(e, DIRTY);
          schedule_effect(e);
        }
        for (const e of this.#maybe_dirty_effects) {
          set_signal_status(e, MAYBE_DIRTY);
          schedule_effect(e);
        }
        this.#dirty_effects.clear();
        this.#maybe_dirty_effects.clear();
        if (this.#pending_effect) {
          pause_effect(this.#pending_effect, () => {
            this.#pending_effect = null;
          });
        }
        if (this.#offscreen_fragment) {
          this.#anchor.before(this.#offscreen_fragment);
          this.#offscreen_fragment = null;
        }
      }
    }
    /**
     * Update the source that powers `$effect.pending()` inside this boundary,
     * and controls when the current `pending` snippet (if any) is removed.
     * Do not call from inside the class
     * @param {1 | -1} d
     */
    update_pending_count(d) {
      this.#update_pending_count(d);
      this.#local_pending_count += d;
      if (this.#effect_pending) {
        internal_set(this.#effect_pending, this.#local_pending_count);
      }
    }
    get_effect_pending() {
      this.#effect_pending_subscriber();
      return get(
        /** @type {Source<number>} */
        this.#effect_pending
      );
    }
    /** @param {unknown} error */
    error(error) {
      var onerror = this.#props.onerror;
      let failed = this.#props.failed;
      if (this.#is_creating_fallback || !onerror && !failed) {
        throw error;
      }
      if (this.#main_effect) {
        destroy_effect(this.#main_effect);
        this.#main_effect = null;
      }
      if (this.#pending_effect) {
        destroy_effect(this.#pending_effect);
        this.#pending_effect = null;
      }
      if (this.#failed_effect) {
        destroy_effect(this.#failed_effect);
        this.#failed_effect = null;
      }
      var did_reset = false;
      var calling_on_error = false;
      const reset2 = () => {
        if (did_reset) {
          svelte_boundary_reset_noop();
          return;
        }
        did_reset = true;
        if (calling_on_error) {
          svelte_boundary_reset_onerror();
        }
        Batch.ensure();
        this.#local_pending_count = 0;
        if (this.#failed_effect !== null) {
          pause_effect(this.#failed_effect, () => {
            this.#failed_effect = null;
          });
        }
        this.is_pending = this.has_pending_snippet();
        this.#main_effect = this.#run(() => {
          this.#is_creating_fallback = false;
          return branch(() => this.#children(this.#anchor));
        });
        if (this.#pending_count > 0) {
          this.#show_pending_snippet();
        } else {
          this.is_pending = false;
        }
      };
      var previous_reaction = active_reaction;
      try {
        set_active_reaction(null);
        calling_on_error = true;
        onerror?.(error, reset2);
        calling_on_error = false;
      } catch (error2) {
        invoke_error_boundary(error2, this.#effect && this.#effect.parent);
      } finally {
        set_active_reaction(previous_reaction);
      }
      if (failed) {
        queue_micro_task(() => {
          this.#failed_effect = this.#run(() => {
            Batch.ensure();
            this.#is_creating_fallback = true;
            try {
              return branch(() => {
                failed(
                  this.#anchor,
                  () => error,
                  () => reset2
                );
              });
            } catch (error2) {
              invoke_error_boundary(
                error2,
                /** @type {Effect} */
                this.#effect.parent
              );
              return null;
            } finally {
              this.#is_creating_fallback = false;
            }
          });
        });
      }
    }
  }
  function flatten(blockers, sync, async, fn) {
    const d = is_runes() ? derived : derived_safe_equal;
    if (async.length === 0 && blockers.length === 0) {
      fn(sync.map(d));
      return;
    }
    var batch = current_batch;
    var parent = (
      /** @type {Effect} */
      active_effect
    );
    var restore = capture();
    function run2() {
      Promise.all(async.map((expression) => /* @__PURE__ */ async_derived(expression))).then((result) => {
        restore();
        try {
          fn([...sync.map(d), ...result]);
        } catch (error) {
          if ((parent.f & DESTROYED) === 0) {
            invoke_error_boundary(error, parent);
          }
        }
        batch?.deactivate();
        unset_context();
      }).catch((error) => {
        invoke_error_boundary(error, parent);
      });
    }
    if (blockers.length > 0) {
      Promise.all(blockers).then(() => {
        restore();
        try {
          return run2();
        } finally {
          batch?.deactivate();
          unset_context();
        }
      });
    } else {
      run2();
    }
  }
  function capture() {
    var previous_effect = active_effect;
    var previous_reaction = active_reaction;
    var previous_component_context = component_context;
    var previous_batch2 = current_batch;
    return function restore(activate_batch = true) {
      set_active_effect(previous_effect);
      set_active_reaction(previous_reaction);
      set_component_context(previous_component_context);
      if (activate_batch) previous_batch2?.activate();
    };
  }
  function unset_context() {
    set_active_effect(null);
    set_active_reaction(null);
    set_component_context(null);
  }
  // @__NO_SIDE_EFFECTS__
  function derived(fn) {
    var flags2 = DERIVED | DIRTY;
    var parent_derived = active_reaction !== null && (active_reaction.f & DERIVED) !== 0 ? (
      /** @type {Derived} */
      active_reaction
    ) : null;
    if (active_effect !== null) {
      active_effect.f |= EFFECT_PRESERVED;
    }
    const signal = {
      ctx: component_context,
      deps: null,
      effects: null,
      equals,
      f: flags2,
      fn,
      reactions: null,
      rv: 0,
      v: (
        /** @type {V} */
        UNINITIALIZED
      ),
      wv: 0,
      parent: parent_derived ?? active_effect,
      ac: null
    };
    return signal;
  }
  // @__NO_SIDE_EFFECTS__
  function async_derived(fn, label, location) {
    let parent = (
      /** @type {Effect | null} */
      active_effect
    );
    if (parent === null) {
      async_derived_orphan();
    }
    var boundary2 = (
      /** @type {Boundary} */
      parent.b
    );
    var promise = (
      /** @type {Promise<V>} */
      /** @type {unknown} */
      void 0
    );
    var signal = source(
      /** @type {V} */
      UNINITIALIZED
    );
    var should_suspend = !active_reaction;
    var deferreds = /* @__PURE__ */ new Map();
    async_effect(() => {
      var d = deferred();
      promise = d.promise;
      try {
        Promise.resolve(fn()).then(d.resolve, d.reject).then(() => {
          if (batch === current_batch && batch.committed) {
            batch.deactivate();
          }
          unset_context();
        });
      } catch (error) {
        d.reject(error);
        unset_context();
      }
      var batch = (
        /** @type {Batch} */
        current_batch
      );
      if (should_suspend) {
        var blocking = boundary2.is_rendered();
        boundary2.update_pending_count(1);
        batch.increment(blocking);
        deferreds.get(batch)?.reject(STALE_REACTION);
        deferreds.delete(batch);
        deferreds.set(batch, d);
      }
      const handler = (value, error = void 0) => {
        batch.activate();
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
          for (const [b, d2] of deferreds) {
            deferreds.delete(b);
            if (b === batch) break;
            d2.reject(STALE_REACTION);
          }
        }
        if (should_suspend) {
          boundary2.update_pending_count(-1);
          batch.decrement(blocking);
        }
      };
      d.promise.then(handler, (e) => handler(null, e || "unknown"));
    });
    teardown(() => {
      for (const d of deferreds.values()) {
        d.reject(STALE_REACTION);
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
          effects[i]
        );
      }
    }
  }
  function get_derived_parent_effect(derived2) {
    var parent = derived2.parent;
    while (parent !== null) {
      if ((parent.f & DERIVED) === 0) {
        return (parent.f & DESTROYED) === 0 ? (
          /** @type {Effect} */
          parent
        ) : null;
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
        derived2.f &= ~WAS_MARKED;
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
      derived2.wv = increment_write_version();
      if (!current_batch?.is_fork || derived2.deps === null) {
        derived2.v = value;
        if (derived2.deps === null) {
          set_signal_status(derived2, CLEAN);
          return;
        }
      }
    }
    if (is_destroying_effect) {
      return;
    }
    if (batch_values !== null) {
      if (effect_tracking() || current_batch?.is_fork) {
        batch_values.set(derived2, value);
      }
    } else {
      update_derived_status(derived2);
    }
  }
  let eager_effects = /* @__PURE__ */ new Set();
  const old_values = /* @__PURE__ */ new Map();
  let eager_effects_deferred = false;
  function source(v, stack) {
    var signal = {
      f: 0,
      // TODO ideally we could skip this altogether, but it causes type errors
      v,
      reactions: null,
      equals,
      rv: 0,
      wv: 0
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
    const s = source(initial_value);
    if (!immutable) {
      s.equals = safe_equals;
    }
    if (legacy_mode_flag && trackable && component_context !== null && component_context.l !== null) {
      (component_context.l.s ??= []).push(s);
    }
    return s;
  }
  function set(source2, value, should_proxy = false) {
    if (active_reaction !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
    // to ensure we error if state is set inside an inspect effect
    (!untracking || (active_reaction.f & EAGER_EFFECT) !== 0) && is_runes() && (active_reaction.f & (DERIVED | BLOCK_EFFECT | ASYNC | EAGER_EFFECT)) !== 0 && !current_sources?.includes(source2)) {
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
        const derived2 = (
          /** @type {Derived} */
          source2
        );
        if ((source2.f & DIRTY) !== 0) {
          execute_derived(derived2);
        }
        update_derived_status(derived2);
      }
      source2.wv = increment_write_version();
      mark_reactions(source2, DIRTY);
      if (is_runes() && active_effect !== null && (active_effect.f & CLEAN) !== 0 && (active_effect.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0) {
        if (untracked_writes === null) {
          set_untracked_writes([source2]);
        } else {
          untracked_writes.push(source2);
        }
      }
      if (!batch.is_fork && eager_effects.size > 0 && !eager_effects_deferred) {
        flush_eager_effects();
      }
    }
    return value;
  }
  function flush_eager_effects() {
    eager_effects_deferred = false;
    var prev_is_updating_effect = is_updating_effect;
    set_is_updating_effect(true);
    const inspects = Array.from(eager_effects);
    try {
      for (const effect2 of inspects) {
        if ((effect2.f & CLEAN) !== 0) {
          set_signal_status(effect2, MAYBE_DIRTY);
        }
        if (is_dirty(effect2)) {
          update_effect(effect2);
        }
      }
    } finally {
      set_is_updating_effect(prev_is_updating_effect);
    }
    eager_effects.clear();
  }
  function increment$1(source2) {
    set(source2, source2.v + 1);
  }
  function mark_reactions(signal, status) {
    var reactions = signal.reactions;
    if (reactions === null) return;
    var runes = is_runes();
    var length = reactions.length;
    for (var i = 0; i < length; i++) {
      var reaction = reactions[i];
      var flags2 = reaction.f;
      if (!runes && reaction === active_effect) continue;
      var not_dirty = (flags2 & DIRTY) === 0;
      if (not_dirty) {
        set_signal_status(reaction, status);
      }
      if ((flags2 & DERIVED) !== 0) {
        var derived2 = (
          /** @type {Derived} */
          reaction
        );
        batch_values?.delete(derived2);
        if ((flags2 & WAS_MARKED) === 0) {
          if (flags2 & CONNECTED) {
            reaction.f |= WAS_MARKED;
          }
          mark_reactions(derived2, MAYBE_DIRTY);
        }
      } else if (not_dirty) {
        if ((flags2 & BLOCK_EFFECT) !== 0 && eager_block_effects !== null) {
          eager_block_effects.add(
            /** @type {Effect} */
            reaction
          );
        }
        schedule_effect(
          /** @type {Effect} */
          reaction
        );
      }
    }
  }
  function proxy(value) {
    if (typeof value !== "object" || value === null || STATE_SYMBOL in value) {
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
      sources.set("length", /* @__PURE__ */ state(
        /** @type {any[]} */
        value.length
      ));
    }
    return new Proxy(
      /** @type {any} */
      value,
      {
        defineProperty(_, prop, descriptor) {
          if (!("value" in descriptor) || descriptor.configurable === false || descriptor.enumerable === false || descriptor.writable === false) {
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
              const s2 = with_parent(() => /* @__PURE__ */ state(UNINITIALIZED));
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
          if (prop === STATE_SYMBOL) {
            return value;
          }
          var s = sources.get(prop);
          var exists = prop in target;
          if (s === void 0 && (!exists || get_descriptor(target, prop)?.writable)) {
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
          if (descriptor && "value" in descriptor) {
            var s = sources.get(prop);
            if (s) descriptor.value = get(s);
          } else if (descriptor === void 0) {
            var source2 = sources.get(prop);
            var value2 = source2?.v;
            if (source2 !== void 0 && value2 !== UNINITIALIZED) {
              return {
                enumerable: true,
                configurable: true,
                value: value2,
                writable: true
              };
            }
          }
          return descriptor;
        },
        has(target, prop) {
          if (prop === STATE_SYMBOL) {
            return true;
          }
          var s = sources.get(prop);
          var has = s !== void 0 && s.v !== UNINITIALIZED || Reflect.has(target, prop);
          if (s !== void 0 || active_effect !== null && (!has || get_descriptor(target, prop)?.writable)) {
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
          var s = sources.get(prop);
          var has = prop in target;
          if (is_proxied_array && prop === "length") {
            for (var i = value2; i < /** @type {Source<number>} */
            s.v; i += 1) {
              var other_s = sources.get(i + "");
              if (other_s !== void 0) {
                set(other_s, UNINITIALIZED);
              } else if (i in target) {
                other_s = with_parent(() => /* @__PURE__ */ state(UNINITIALIZED));
                sources.set(i + "", other_s);
              }
            }
          }
          if (s === void 0) {
            if (!has || get_descriptor(target, prop)?.writable) {
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
          if (descriptor?.set) {
            descriptor.set.call(receiver, value2);
          }
          if (!has) {
            if (is_proxied_array && typeof prop === "string") {
              var ls = (
                /** @type {Source<number>} */
                sources.get("length")
              );
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
        }
      }
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
    first_child_getter = get_descriptor(node_prototype, "firstChild").get;
    next_sibling_getter = get_descriptor(node_prototype, "nextSibling").get;
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
  function create_text(value = "") {
    return document.createTextNode(value);
  }
  // @__NO_SIDE_EFFECTS__
  function get_first_child(node) {
    return (
      /** @type {TemplateNode | null} */
      first_child_getter.call(node)
    );
  }
  // @__NO_SIDE_EFFECTS__
  function get_next_sibling(node) {
    return (
      /** @type {TemplateNode | null} */
      next_sibling_getter.call(node)
    );
  }
  function child(node, is_text) {
    {
      return /* @__PURE__ */ get_first_child(node);
    }
  }
  function first_child(node, is_text = false) {
    {
      var first = /* @__PURE__ */ get_first_child(node);
      if (first instanceof Comment && first.data === "") return /* @__PURE__ */ get_next_sibling(first);
      return first;
    }
  }
  function sibling(node, count = 1, is_text = false) {
    let next_sibling = node;
    while (count--) {
      next_sibling = /** @type {TemplateNode} */
      /* @__PURE__ */ get_next_sibling(next_sibling);
    }
    {
      return next_sibling;
    }
  }
  function clear_text_content(node) {
    node.textContent = "";
  }
  function should_defer_append() {
    return false;
  }
  let listening_to_form_reset = false;
  function add_form_reset_listener() {
    if (!listening_to_form_reset) {
      listening_to_form_reset = true;
      document.addEventListener(
        "reset",
        (evt) => {
          Promise.resolve().then(() => {
            if (!evt.defaultPrevented) {
              for (
                const e of
                /**@type {HTMLFormElement} */
                evt.target.elements
              ) {
                e.__on_r?.();
              }
            }
          });
        },
        // In the capture phase to guarantee we get noticed of it (no possibility of stopPropagation)
        { capture: true }
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
  function listen_to_event_and_reset_event(element, event2, handler, on_reset = handler) {
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
  function validate_effect(rune) {
    if (active_effect === null) {
      if (active_reaction === null) {
        effect_orphan();
      }
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
  function create_effect(type, fn, sync) {
    var parent = active_effect;
    if (parent !== null && (parent.f & INERT) !== 0) {
      type |= INERT;
    }
    var effect2 = {
      ctx: component_context,
      deps: null,
      nodes: null,
      f: type | DIRTY | CONNECTED,
      first: null,
      fn,
      last: null,
      next: null,
      parent,
      b: parent && parent.b,
      prev: null,
      teardown: null,
      wv: 0,
      ac: null
    };
    if (sync) {
      try {
        update_effect(effect2);
        effect2.f |= EFFECT_RAN;
      } catch (e2) {
        destroy_effect(effect2);
        throw e2;
      }
    } else if (fn !== null) {
      schedule_effect(effect2);
    }
    var e = effect2;
    if (sync && e.deps === null && e.teardown === null && e.nodes === null && e.first === e.last && // either `null`, or a singular child
    (e.f & EFFECT_PRESERVED) === 0) {
      e = e.first;
      if ((type & BLOCK_EFFECT) !== 0 && (type & EFFECT_TRANSPARENT) !== 0 && e !== null) {
        e.f |= EFFECT_TRANSPARENT;
      }
    }
    if (e !== null) {
      e.parent = parent;
      if (parent !== null) {
        push_effect(e, parent);
      }
      if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0 && (type & ROOT_EFFECT) === 0) {
        var derived2 = (
          /** @type {Derived} */
          active_reaction
        );
        (derived2.effects ??= []).push(e);
      }
    }
    return effect2;
  }
  function effect_tracking() {
    return active_reaction !== null && !untracking;
  }
  function teardown(fn) {
    const effect2 = create_effect(RENDER_EFFECT, null, false);
    set_signal_status(effect2, CLEAN);
    effect2.teardown = fn;
    return effect2;
  }
  function user_effect(fn) {
    validate_effect();
    var flags2 = (
      /** @type {Effect} */
      active_effect.f
    );
    var defer = !active_reaction && (flags2 & BRANCH_EFFECT) !== 0 && (flags2 & EFFECT_RAN) === 0;
    if (defer) {
      var context = (
        /** @type {ComponentContext} */
        component_context
      );
      (context.e ??= []).push(fn);
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
    const effect2 = create_effect(ROOT_EFFECT | EFFECT_PRESERVED, fn, true);
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
  function render_effect(fn, flags2 = 0) {
    return create_effect(RENDER_EFFECT | flags2, fn, true);
  }
  function template_effect(fn, sync = [], async = [], blockers = []) {
    flatten(blockers, sync, async, (values) => {
      create_effect(RENDER_EFFECT, () => fn(...values.map(get)), true);
    });
  }
  function block(fn, flags2 = 0) {
    var effect2 = create_effect(BLOCK_EFFECT | flags2, fn, true);
    return effect2;
  }
  function branch(fn) {
    return create_effect(BRANCH_EFFECT | EFFECT_PRESERVED, fn, true);
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
    var effect2 = signal.first;
    signal.first = signal.last = null;
    while (effect2 !== null) {
      const controller = effect2.ac;
      if (controller !== null) {
        without_reactive_context(() => {
          controller.abort(STALE_REACTION);
        });
      }
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
    if ((remove_dom || (effect2.f & HEAD_EFFECT) !== 0) && effect2.nodes !== null && effect2.nodes.end !== null) {
      remove_effect_dom(
        effect2.nodes.start,
        /** @type {TemplateNode} */
        effect2.nodes.end
      );
      removed = true;
    }
    destroy_effect_children(effect2, remove_dom && !removed);
    remove_reactions(effect2, 0);
    set_signal_status(effect2, DESTROYED);
    var transitions = effect2.nodes && effect2.nodes.t;
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
    effect2.next = effect2.prev = effect2.teardown = effect2.ctx = effect2.deps = effect2.fn = effect2.nodes = effect2.ac = null;
  }
  function remove_effect_dom(node, end) {
    while (node !== null) {
      var next = node === end ? null : /* @__PURE__ */ get_next_sibling(node);
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
  function pause_effect(effect2, callback, destroy = true) {
    var transitions = [];
    pause_children(effect2, transitions, true);
    var fn = () => {
      if (destroy) destroy_effect(effect2);
      if (callback) callback();
    };
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
    var t2 = effect2.nodes && effect2.nodes.t;
    if (t2 !== null) {
      for (const transition of t2) {
        if (transition.is_global || local) {
          transitions.push(transition);
        }
      }
    }
    var child2 = effect2.first;
    while (child2 !== null) {
      var sibling2 = child2.next;
      var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || // If this is a branch effect without a block effect parent,
      // it means the parent block effect was pruned. In that case,
      // transparency information was transferred to the branch effect.
      (child2.f & BRANCH_EFFECT) !== 0 && (effect2.f & BLOCK_EFFECT) !== 0;
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
      var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
      resume_children(child2, transparent ? local : false);
      child2 = sibling2;
    }
    var t2 = effect2.nodes && effect2.nodes.t;
    if (t2 !== null) {
      for (const transition of t2) {
        if (transition.is_global || local) {
          transition.in();
        }
      }
    }
  }
  function move_effect(effect2, fragment) {
    if (!effect2.nodes) return;
    var node = effect2.nodes.start;
    var end = effect2.nodes.end;
    while (node !== null) {
      var next = node === end ? null : /* @__PURE__ */ get_next_sibling(node);
      fragment.append(node);
      node = next;
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
  function increment_write_version() {
    return ++write_version;
  }
  function is_dirty(reaction) {
    var flags2 = reaction.f;
    if ((flags2 & DIRTY) !== 0) {
      return true;
    }
    if (flags2 & DERIVED) {
      reaction.f &= ~WAS_MARKED;
    }
    if ((flags2 & MAYBE_DIRTY) !== 0) {
      var dependencies = (
        /** @type {Value[]} */
        reaction.deps
      );
      var length = dependencies.length;
      for (var i = 0; i < length; i++) {
        var dependency = dependencies[i];
        if (is_dirty(
          /** @type {Derived} */
          dependency
        )) {
          update_derived(
            /** @type {Derived} */
            dependency
          );
        }
        if (dependency.wv > reaction.wv) {
          return true;
        }
      }
      if ((flags2 & CONNECTED) !== 0 && // During time traveling we don't want to reset the status so that
      // traversal of the graph in the other batches still happens
      batch_values === null) {
        set_signal_status(reaction, CLEAN);
      }
    }
    return false;
  }
  function schedule_possible_effect_self_invalidation(signal, effect2, root2 = true) {
    var reactions = signal.reactions;
    if (reactions === null) return;
    if (current_sources?.includes(signal)) {
      return;
    }
    for (var i = 0; i < reactions.length; i++) {
      var reaction = reactions[i];
      if ((reaction.f & DERIVED) !== 0) {
        schedule_possible_effect_self_invalidation(
          /** @type {Derived} */
          reaction,
          effect2,
          false
        );
      } else if (effect2 === reaction) {
        if (root2) {
          set_signal_status(reaction, DIRTY);
        } else if ((reaction.f & CLEAN) !== 0) {
          set_signal_status(reaction, MAYBE_DIRTY);
        }
        schedule_effect(
          /** @type {Effect} */
          reaction
        );
      }
    }
  }
  function update_reaction(reaction) {
    var previous_deps = new_deps;
    var previous_skipped_deps = skipped_deps;
    var previous_untracked_writes = untracked_writes;
    var previous_reaction = active_reaction;
    var previous_sources = current_sources;
    var previous_component_context = component_context;
    var previous_untracking = untracking;
    var previous_update_version = update_version;
    var flags2 = reaction.f;
    new_deps = /** @type {null | Value[]} */
    null;
    skipped_deps = 0;
    untracked_writes = null;
    active_reaction = (flags2 & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
    current_sources = null;
    set_component_context(reaction.ctx);
    untracking = false;
    update_version = ++read_version;
    if (reaction.ac !== null) {
      without_reactive_context(() => {
        reaction.ac.abort(STALE_REACTION);
      });
      reaction.ac = null;
    }
    try {
      reaction.f |= REACTION_IS_UPDATING;
      var fn = (
        /** @type {Function} */
        reaction.fn
      );
      var result = fn();
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
        if (effect_tracking() && (reaction.f & CONNECTED) !== 0) {
          for (i = skipped_deps; i < deps.length; i++) {
            (deps[i].reactions ??= []).push(reaction);
          }
        }
      } else if (deps !== null && skipped_deps < deps.length) {
        remove_reactions(reaction, skipped_deps);
        deps.length = skipped_deps;
      }
      if (is_runes() && untracked_writes !== null && !untracking && deps !== null && (reaction.f & (DERIVED | MAYBE_DIRTY | DIRTY)) === 0) {
        for (i = 0; i < /** @type {Source[]} */
        untracked_writes.length; i++) {
          schedule_possible_effect_self_invalidation(
            untracked_writes[i],
            /** @type {Effect} */
            reaction
          );
        }
      }
      if (previous_reaction !== null && previous_reaction !== reaction) {
        read_version++;
        if (untracked_writes !== null) {
          if (previous_untracked_writes === null) {
            previous_untracked_writes = untracked_writes;
          } else {
            previous_untracked_writes.push(.../** @type {Source[]} */
            untracked_writes);
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
    if (reactions === null && (dependency.f & DERIVED) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
    // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
    // allows us to skip the expensive work of disconnecting and immediately reconnecting it
    (new_deps === null || !new_deps.includes(dependency))) {
      var derived2 = (
        /** @type {Derived} */
        dependency
      );
      if ((derived2.f & CONNECTED) !== 0) {
        derived2.f ^= CONNECTED;
        derived2.f &= ~WAS_MARKED;
      }
      update_derived_status(derived2);
      destroy_derived_effects(derived2);
      remove_reactions(derived2, 0);
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
    var flags2 = effect2.f;
    if ((flags2 & DESTROYED) !== 0) {
      return;
    }
    set_signal_status(effect2, CLEAN);
    var previous_effect = active_effect;
    var was_updating_effect = is_updating_effect;
    active_effect = effect2;
    is_updating_effect = true;
    try {
      if ((flags2 & (BLOCK_EFFECT | MANAGED_EFFECT)) !== 0) {
        destroy_block_effect_children(effect2);
      } else {
        destroy_effect_children(effect2);
      }
      execute_effect_teardown(effect2);
      var teardown2 = update_reaction(effect2);
      effect2.teardown = typeof teardown2 === "function" ? teardown2 : null;
      effect2.wv = write_version;
      var dep;
      if (DEV && tracing_mode_flag && (effect2.f & DIRTY) !== 0 && effect2.deps !== null) ;
    } finally {
      is_updating_effect = was_updating_effect;
      active_effect = previous_effect;
    }
  }
  async function tick() {
    await Promise.resolve();
    flushSync();
  }
  function get(signal) {
    var flags2 = signal.f;
    var is_derived = (flags2 & DERIVED) !== 0;
    if (active_reaction !== null && !untracking) {
      var destroyed = active_effect !== null && (active_effect.f & DESTROYED) !== 0;
      if (!destroyed && !current_sources?.includes(signal)) {
        var deps = active_reaction.deps;
        if ((active_reaction.f & REACTION_IS_UPDATING) !== 0) {
          if (signal.rv < read_version) {
            signal.rv = read_version;
            if (new_deps === null && deps !== null && deps[skipped_deps] === signal) {
              skipped_deps++;
            } else if (new_deps === null) {
              new_deps = [signal];
            } else if (!new_deps.includes(signal)) {
              new_deps.push(signal);
            }
          }
        } else {
          (active_reaction.deps ??= []).push(signal);
          var reactions = signal.reactions;
          if (reactions === null) {
            signal.reactions = [active_reaction];
          } else if (!reactions.includes(active_reaction)) {
            reactions.push(active_reaction);
          }
        }
      }
    }
    if (is_destroying_effect && old_values.has(signal)) {
      return old_values.get(signal);
    }
    if (is_derived) {
      var derived2 = (
        /** @type {Derived} */
        signal
      );
      if (is_destroying_effect) {
        var value = derived2.v;
        if ((derived2.f & CLEAN) === 0 && derived2.reactions !== null || depends_on_old_values(derived2)) {
          value = execute_derived(derived2);
        }
        old_values.set(derived2, value);
        return value;
      }
      var should_connect = (derived2.f & CONNECTED) === 0 && !untracking && active_reaction !== null && (is_updating_effect || (active_reaction.f & CONNECTED) !== 0);
      var is_new = derived2.deps === null;
      if (is_dirty(derived2)) {
        if (should_connect) {
          derived2.f |= CONNECTED;
        }
        update_derived(derived2);
      }
      if (should_connect && !is_new) {
        reconnect(derived2);
      }
    }
    if (batch_values?.has(signal)) {
      return batch_values.get(signal);
    }
    if ((signal.f & ERROR_VALUE) !== 0) {
      throw signal.v;
    }
    return signal.v;
  }
  function reconnect(derived2) {
    if (derived2.deps === null) return;
    derived2.f |= CONNECTED;
    for (const dep of derived2.deps) {
      (dep.reactions ??= []).push(derived2);
      if ((dep.f & DERIVED) !== 0 && (dep.f & CONNECTED) === 0) {
        reconnect(
          /** @type {Derived} */
          dep
        );
      }
    }
  }
  function depends_on_old_values(derived2) {
    if (derived2.v === UNINITIALIZED) return true;
    if (derived2.deps === null) return false;
    for (const dep of derived2.deps) {
      if (old_values.has(dep)) {
        return true;
      }
      if ((dep.f & DERIVED) !== 0 && depends_on_old_values(
        /** @type {Derived} */
        dep
      )) {
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
  function deep_read_state(value) {
    if (typeof value !== "object" || !value || value instanceof EventTarget) {
      return;
    }
    if (STATE_SYMBOL in value) {
      deep_read(value);
    } else if (!Array.isArray(value)) {
      for (let key in value) {
        const prop = value[key];
        if (typeof prop === "object" && prop && STATE_SYMBOL in prop) {
          deep_read(prop);
        }
      }
    }
  }
  function deep_read(value, visited = /* @__PURE__ */ new Set()) {
    if (typeof value === "object" && value !== null && // We don't want to traverse DOM elements
    !(value instanceof EventTarget) && !visited.has(value)) {
      visited.add(value);
      if (value instanceof Date) {
        value.getTime();
      }
      for (let key in value) {
        try {
          deep_read(value[key], visited);
        } catch (e) {
        }
      }
      const proto = get_prototype_of(value);
      if (proto !== Object.prototype && proto !== Array.prototype && proto !== Map.prototype && proto !== Set.prototype && proto !== Date.prototype) {
        const descriptors = get_descriptors(proto);
        for (let key in descriptors) {
          const get2 = descriptors[key].get;
          if (get2) {
            try {
              get2.call(value);
            } catch (e) {
            }
          }
        }
      }
    }
  }
  const PASSIVE_EVENTS = ["touchstart", "touchmove"];
  function is_passive_event(name2) {
    return PASSIVE_EVENTS.includes(name2);
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
          return handler?.call(this, event2);
        });
      }
    }
    if (event_name.startsWith("pointer") || event_name.startsWith("touch") || event_name === "wheel") {
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
    if (dom === document.body || // @ts-ignore
    dom === window || // @ts-ignore
    dom === document || // Firefox has quirky behavior, it can happen that we still get "canplay" events when the element is already removed
    dom instanceof HTMLMediaElement) {
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
  let last_propagated_event = null;
  function handle_event_propagation(event2) {
    var handler_element = this;
    var owner_document = (
      /** @type {Node} */
      handler_element.ownerDocument
    );
    var event_name = event2.type;
    var path = event2.composedPath?.() || [];
    var current_target = (
      /** @type {null | Element} */
      path[0] || event2.target
    );
    last_propagated_event = event2;
    var path_idx = 0;
    var handled_at = last_propagated_event === event2 && event2.__root;
    if (handled_at) {
      var at_idx = path.indexOf(handled_at);
      if (at_idx !== -1 && (handler_element === document || handler_element === /** @type {any} */
      window)) {
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
    current_target = /** @type {Element} */
    path[path_idx] || event2.target;
    if (current_target === handler_element) return;
    define_property(event2, "currentTarget", {
      configurable: true,
      get() {
        return current_target || owner_document;
      }
    });
    var previous_reaction = active_reaction;
    var previous_effect = active_effect;
    set_active_reaction(null);
    set_active_effect(null);
    try {
      var throw_error;
      var other_errors = [];
      while (current_target !== null) {
        var parent_element = current_target.assignedSlot || current_target.parentNode || /** @type {any} */
        current_target.host || null;
        try {
          var delegated = current_target["__" + event_name];
          if (delegated != null && (!/** @type {any} */
          current_target.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          event2.target === current_target)) {
            delegated.call(current_target, event2);
          }
        } catch (error) {
          if (throw_error) {
            other_errors.push(error);
          } else {
            throw_error = error;
          }
        }
        if (event2.cancelBubble || parent_element === handler_element || parent_element === null) {
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
    var elem = document.createElement("template");
    elem.innerHTML = html.replaceAll("<!>", "<!---->");
    return elem.content;
  }
  function assign_nodes(start, end) {
    var effect2 = (
      /** @type {Effect} */
      active_effect
    );
    if (effect2.nodes === null) {
      effect2.nodes = { start, end, a: null, t: null };
    }
  }
  // @__NO_SIDE_EFFECTS__
  function from_html(content, flags2) {
    var is_fragment = (flags2 & TEMPLATE_FRAGMENT) !== 0;
    var use_import_node = (flags2 & TEMPLATE_USE_IMPORT_NODE) !== 0;
    var node;
    var has_start = !content.startsWith("<!>");
    return () => {
      if (node === void 0) {
        node = create_fragment_from_html(has_start ? content : "<!>" + content);
        if (!is_fragment) node = /** @type {TemplateNode} */
        /* @__PURE__ */ get_first_child(node);
      }
      var clone = (
        /** @type {TemplateNode} */
        use_import_node || is_firefox ? document.importNode(node, true) : node.cloneNode(true)
      );
      if (is_fragment) {
        var start = (
          /** @type {TemplateNode} */
          /* @__PURE__ */ get_first_child(clone)
        );
        var end = (
          /** @type {TemplateNode} */
          clone.lastChild
        );
        assign_nodes(start, end);
      } else {
        assign_nodes(clone, clone);
      }
      return clone;
    };
  }
  // @__NO_SIDE_EFFECTS__
  function from_namespace(content, flags2, ns = "svg") {
    var has_start = !content.startsWith("<!>");
    var wrapped = `<${ns}>${has_start ? content : "<!>" + content}</${ns}>`;
    var node;
    return () => {
      if (!node) {
        var fragment = (
          /** @type {DocumentFragment} */
          create_fragment_from_html(wrapped)
        );
        var root2 = (
          /** @type {Element} */
          /* @__PURE__ */ get_first_child(fragment)
        );
        {
          node = /** @type {Element} */
          /* @__PURE__ */ get_first_child(root2);
        }
      }
      var clone = (
        /** @type {TemplateNode} */
        node.cloneNode(true)
      );
      {
        assign_nodes(clone, clone);
      }
      return clone;
    };
  }
  // @__NO_SIDE_EFFECTS__
  function from_svg(content, flags2) {
    return /* @__PURE__ */ from_namespace(content, flags2, "svg");
  }
  function text(value = "") {
    {
      var t2 = create_text(value + "");
      assign_nodes(t2, t2);
      return t2;
    }
  }
  function comment() {
    var frag = document.createDocumentFragment();
    var start = document.createComment("");
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
      dom
    );
  }
  function set_text(text2, value) {
    var str = value == null ? "" : typeof value === "object" ? value + "" : value;
    if (str !== (text2.__t ??= text2.nodeValue)) {
      text2.__t = str;
      text2.nodeValue = str + "";
    }
  }
  function mount(component2, options) {
    return _mount(component2, options);
  }
  const document_listeners = /* @__PURE__ */ new Map();
  function _mount(Component, { target, anchor, props = {}, events, context, intro = true }) {
    init_operations();
    var registered_events = /* @__PURE__ */ new Set();
    var event_handle = (events2) => {
      for (var i = 0; i < events2.length; i++) {
        var event_name = events2[i];
        if (registered_events.has(event_name)) continue;
        registered_events.add(event_name);
        var passive = is_passive_event(event_name);
        target.addEventListener(event_name, handle_event_propagation, { passive });
        var n = document_listeners.get(event_name);
        if (n === void 0) {
          document.addEventListener(event_name, handle_event_propagation, { passive });
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
      boundary(
        /** @type {TemplateNode} */
        anchor_node,
        {
          pending: () => {
          }
        },
        (anchor_node2) => {
          if (context) {
            push({});
            var ctx = (
              /** @type {ComponentContext} */
              component_context
            );
            ctx.c = context;
          }
          if (events) {
            props.$$events = events;
          }
          component2 = Component(anchor_node2, props) || {};
          if (context) {
            pop();
          }
        }
      );
      return () => {
        for (var event_name of registered_events) {
          target.removeEventListener(event_name, handle_event_propagation);
          var n = (
            /** @type {number} */
            document_listeners.get(event_name)
          );
          if (--n === 0) {
            document.removeEventListener(event_name, handle_event_propagation);
            document_listeners.delete(event_name);
          } else {
            document_listeners.set(event_name, n);
          }
        }
        root_event_handles.delete(event_handle);
        if (anchor_node !== anchor) {
          anchor_node.parentNode?.removeChild(anchor_node);
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
  class BranchManager {
    /** @type {TemplateNode} */
    anchor;
    /** @type {Map<Batch, Key>} */
    #batches = /* @__PURE__ */ new Map();
    /**
     * Map of keys to effects that are currently rendered in the DOM.
     * These effects are visible and actively part of the document tree.
     * Example:
     * ```
     * {#if condition}
     * 	foo
     * {:else}
     * 	bar
     * {/if}
     * ```
     * Can result in the entries `true->Effect` and `false->Effect`
     * @type {Map<Key, Effect>}
     */
    #onscreen = /* @__PURE__ */ new Map();
    /**
     * Similar to #onscreen with respect to the keys, but contains branches that are not yet
     * in the DOM, because their insertion is deferred.
     * @type {Map<Key, Branch>}
     */
    #offscreen = /* @__PURE__ */ new Map();
    /**
     * Keys of effects that are currently outroing
     * @type {Set<Key>}
     */
    #outroing = /* @__PURE__ */ new Set();
    /**
     * Whether to pause (i.e. outro) on change, or destroy immediately.
     * This is necessary for `<svelte:element>`
     */
    #transition = true;
    /**
     * @param {TemplateNode} anchor
     * @param {boolean} transition
     */
    constructor(anchor, transition = true) {
      this.anchor = anchor;
      this.#transition = transition;
    }
    #commit = () => {
      var batch = (
        /** @type {Batch} */
        current_batch
      );
      if (!this.#batches.has(batch)) return;
      var key = (
        /** @type {Key} */
        this.#batches.get(batch)
      );
      var onscreen = this.#onscreen.get(key);
      if (onscreen) {
        resume_effect(onscreen);
        this.#outroing.delete(key);
      } else {
        var offscreen = this.#offscreen.get(key);
        if (offscreen) {
          this.#onscreen.set(key, offscreen.effect);
          this.#offscreen.delete(key);
          offscreen.fragment.lastChild.remove();
          this.anchor.before(offscreen.fragment);
          onscreen = offscreen.effect;
        }
      }
      for (const [b, k] of this.#batches) {
        this.#batches.delete(b);
        if (b === batch) {
          break;
        }
        const offscreen2 = this.#offscreen.get(k);
        if (offscreen2) {
          destroy_effect(offscreen2.effect);
          this.#offscreen.delete(k);
        }
      }
      for (const [k, effect2] of this.#onscreen) {
        if (k === key || this.#outroing.has(k)) continue;
        const on_destroy = () => {
          const keys = Array.from(this.#batches.values());
          if (keys.includes(k)) {
            var fragment = document.createDocumentFragment();
            move_effect(effect2, fragment);
            fragment.append(create_text());
            this.#offscreen.set(k, { effect: effect2, fragment });
          } else {
            destroy_effect(effect2);
          }
          this.#outroing.delete(k);
          this.#onscreen.delete(k);
        };
        if (this.#transition || !onscreen) {
          this.#outroing.add(k);
          pause_effect(effect2, on_destroy, false);
        } else {
          on_destroy();
        }
      }
    };
    /**
     * @param {Batch} batch
     */
    #discard = (batch) => {
      this.#batches.delete(batch);
      const keys = Array.from(this.#batches.values());
      for (const [k, branch2] of this.#offscreen) {
        if (!keys.includes(k)) {
          destroy_effect(branch2.effect);
          this.#offscreen.delete(k);
        }
      }
    };
    /**
     *
     * @param {any} key
     * @param {null | ((target: TemplateNode) => void)} fn
     */
    ensure(key, fn) {
      var batch = (
        /** @type {Batch} */
        current_batch
      );
      var defer = should_defer_append();
      if (fn && !this.#onscreen.has(key) && !this.#offscreen.has(key)) {
        if (defer) {
          var fragment = document.createDocumentFragment();
          var target = create_text();
          fragment.append(target);
          this.#offscreen.set(key, {
            effect: branch(() => fn(target)),
            fragment
          });
        } else {
          this.#onscreen.set(
            key,
            branch(() => fn(this.anchor))
          );
        }
      }
      this.#batches.set(batch, key);
      if (defer) {
        for (const [k, effect2] of this.#onscreen) {
          if (k === key) {
            batch.skipped_effects.delete(effect2);
          } else {
            batch.skipped_effects.add(effect2);
          }
        }
        for (const [k, branch2] of this.#offscreen) {
          if (k === key) {
            batch.skipped_effects.delete(branch2.effect);
          } else {
            batch.skipped_effects.add(branch2.effect);
          }
        }
        batch.oncommit(this.#commit);
        batch.ondiscard(this.#discard);
      } else {
        this.#commit();
      }
    }
  }
  function if_block(node, fn, elseif = false) {
    var branches = new BranchManager(node);
    var flags2 = elseif ? EFFECT_TRANSPARENT : 0;
    function update_branch(condition, fn2) {
      branches.ensure(condition, fn2);
    }
    block(() => {
      var has_branch = false;
      fn((fn2, flag = true) => {
        has_branch = true;
        update_branch(flag, fn2);
      });
      if (!has_branch) {
        update_branch(false, null);
      }
    }, flags2);
  }
  function pause_effects(state2, to_destroy, controlled_anchor) {
    var transitions = [];
    var length = to_destroy.length;
    var group;
    var remaining = to_destroy.length;
    for (var i = 0; i < length; i++) {
      let effect2 = to_destroy[i];
      pause_effect(
        effect2,
        () => {
          if (group) {
            group.pending.delete(effect2);
            group.done.add(effect2);
            if (group.pending.size === 0) {
              var groups = (
                /** @type {Set<EachOutroGroup>} */
                state2.outrogroups
              );
              destroy_effects(array_from(group.done));
              groups.delete(group);
              if (groups.size === 0) {
                state2.outrogroups = null;
              }
            }
          } else {
            remaining -= 1;
          }
        },
        false
      );
    }
    if (remaining === 0) {
      var fast_path = transitions.length === 0 && controlled_anchor !== null;
      if (fast_path) {
        var anchor = (
          /** @type {Element} */
          controlled_anchor
        );
        var parent_node = (
          /** @type {Element} */
          anchor.parentNode
        );
        clear_text_content(parent_node);
        parent_node.append(anchor);
        state2.items.clear();
      }
      destroy_effects(to_destroy, !fast_path);
    } else {
      group = {
        pending: new Set(to_destroy),
        done: /* @__PURE__ */ new Set()
      };
      (state2.outrogroups ??= /* @__PURE__ */ new Set()).add(group);
    }
  }
  function destroy_effects(to_destroy, remove_dom = true) {
    for (var i = 0; i < to_destroy.length; i++) {
      destroy_effect(to_destroy[i], remove_dom);
    }
  }
  var offscreen_anchor;
  function each(node, flags2, get_collection, get_key, render_fn, fallback_fn = null) {
    var anchor = node;
    var items = /* @__PURE__ */ new Map();
    var is_controlled = (flags2 & EACH_IS_CONTROLLED) !== 0;
    if (is_controlled) {
      var parent_node = (
        /** @type {Element} */
        node
      );
      anchor = parent_node.appendChild(create_text());
    }
    var fallback = null;
    var each_array = /* @__PURE__ */ derived_safe_equal(() => {
      var collection = get_collection();
      return is_array(collection) ? collection : collection == null ? [] : array_from(collection);
    });
    var array;
    var first_run = true;
    function commit() {
      state2.fallback = fallback;
      reconcile(state2, array, anchor, flags2, get_key);
      if (fallback !== null) {
        if (array.length === 0) {
          if ((fallback.f & EFFECT_OFFSCREEN) === 0) {
            resume_effect(fallback);
          } else {
            fallback.f ^= EFFECT_OFFSCREEN;
            move(fallback, null, anchor);
          }
        } else {
          pause_effect(fallback, () => {
            fallback = null;
          });
        }
      }
    }
    var effect2 = block(() => {
      array = /** @type {V[]} */
      get(each_array);
      var length = array.length;
      var keys = /* @__PURE__ */ new Set();
      var batch = (
        /** @type {Batch} */
        current_batch
      );
      var defer = should_defer_append();
      for (var index = 0; index < length; index += 1) {
        var value = array[index];
        var key = get_key(value, index);
        var item = first_run ? null : items.get(key);
        if (item) {
          if (item.v) internal_set(item.v, value);
          if (item.i) internal_set(item.i, index);
          if (defer) {
            batch.skipped_effects.delete(item.e);
          }
        } else {
          item = create_item(
            items,
            first_run ? anchor : offscreen_anchor ??= create_text(),
            value,
            key,
            index,
            render_fn,
            flags2,
            get_collection
          );
          if (!first_run) {
            item.e.f |= EFFECT_OFFSCREEN;
          }
          items.set(key, item);
        }
        keys.add(key);
      }
      if (length === 0 && fallback_fn && !fallback) {
        if (first_run) {
          fallback = branch(() => fallback_fn(anchor));
        } else {
          fallback = branch(() => fallback_fn(offscreen_anchor ??= create_text()));
          fallback.f |= EFFECT_OFFSCREEN;
        }
      }
      if (!first_run) {
        if (defer) {
          for (const [key2, item2] of items) {
            if (!keys.has(key2)) {
              batch.skipped_effects.add(item2.e);
            }
          }
          batch.oncommit(commit);
          batch.ondiscard(() => {
          });
        } else {
          commit();
        }
      }
      get(each_array);
    });
    var state2 = { effect: effect2, items, outrogroups: null, fallback };
    first_run = false;
  }
  function reconcile(state2, array, anchor, flags2, get_key) {
    var is_animated = (flags2 & EACH_IS_ANIMATED) !== 0;
    var length = array.length;
    var items = state2.items;
    var current = state2.effect.first;
    var seen;
    var prev = null;
    var to_animate;
    var matched = [];
    var stashed = [];
    var value;
    var key;
    var effect2;
    var i;
    if (is_animated) {
      for (i = 0; i < length; i += 1) {
        value = array[i];
        key = get_key(value, i);
        effect2 = /** @type {EachItem} */
        items.get(key).e;
        if ((effect2.f & EFFECT_OFFSCREEN) === 0) {
          effect2.nodes?.a?.measure();
          (to_animate ??= /* @__PURE__ */ new Set()).add(effect2);
        }
      }
    }
    for (i = 0; i < length; i += 1) {
      value = array[i];
      key = get_key(value, i);
      effect2 = /** @type {EachItem} */
      items.get(key).e;
      if (state2.outrogroups !== null) {
        for (const group of state2.outrogroups) {
          group.pending.delete(effect2);
          group.done.delete(effect2);
        }
      }
      if ((effect2.f & EFFECT_OFFSCREEN) !== 0) {
        effect2.f ^= EFFECT_OFFSCREEN;
        if (effect2 === current) {
          move(effect2, null, anchor);
        } else {
          var next = prev ? prev.next : current;
          if (effect2 === state2.effect.last) {
            state2.effect.last = effect2.prev;
          }
          if (effect2.prev) effect2.prev.next = effect2.next;
          if (effect2.next) effect2.next.prev = effect2.prev;
          link$1(state2, prev, effect2);
          link$1(state2, effect2, next);
          move(effect2, next, anchor);
          prev = effect2;
          matched = [];
          stashed = [];
          current = prev.next;
          continue;
        }
      }
      if ((effect2.f & INERT) !== 0) {
        resume_effect(effect2);
        if (is_animated) {
          effect2.nodes?.a?.unfix();
          (to_animate ??= /* @__PURE__ */ new Set()).delete(effect2);
        }
      }
      if (effect2 !== current) {
        if (seen !== void 0 && seen.has(effect2)) {
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
            seen.delete(effect2);
            move(effect2, current, anchor);
            link$1(state2, effect2.prev, effect2.next);
            link$1(state2, effect2, prev === null ? state2.effect.first : prev.next);
            link$1(state2, prev, effect2);
            prev = effect2;
          }
          continue;
        }
        matched = [];
        stashed = [];
        while (current !== null && current !== effect2) {
          (seen ??= /* @__PURE__ */ new Set()).add(current);
          stashed.push(current);
          current = current.next;
        }
        if (current === null) {
          continue;
        }
      }
      if ((effect2.f & EFFECT_OFFSCREEN) === 0) {
        matched.push(effect2);
      }
      prev = effect2;
      current = effect2.next;
    }
    if (state2.outrogroups !== null) {
      for (const group of state2.outrogroups) {
        if (group.pending.size === 0) {
          destroy_effects(array_from(group.done));
          state2.outrogroups?.delete(group);
        }
      }
      if (state2.outrogroups.size === 0) {
        state2.outrogroups = null;
      }
    }
    if (current !== null || seen !== void 0) {
      var to_destroy = [];
      if (seen !== void 0) {
        for (effect2 of seen) {
          if ((effect2.f & INERT) === 0) {
            to_destroy.push(effect2);
          }
        }
      }
      while (current !== null) {
        if ((current.f & INERT) === 0 && current !== state2.fallback) {
          to_destroy.push(current);
        }
        current = current.next;
      }
      var destroy_length = to_destroy.length;
      if (destroy_length > 0) {
        var controlled_anchor = (flags2 & EACH_IS_CONTROLLED) !== 0 && length === 0 ? anchor : null;
        if (is_animated) {
          for (i = 0; i < destroy_length; i += 1) {
            to_destroy[i].nodes?.a?.measure();
          }
          for (i = 0; i < destroy_length; i += 1) {
            to_destroy[i].nodes?.a?.fix();
          }
        }
        pause_effects(state2, to_destroy, controlled_anchor);
      }
    }
    if (is_animated) {
      queue_micro_task(() => {
        if (to_animate === void 0) return;
        for (effect2 of to_animate) {
          effect2.nodes?.a?.apply();
        }
      });
    }
  }
  function create_item(items, anchor, value, key, index, render_fn, flags2, get_collection) {
    var v = (flags2 & EACH_ITEM_REACTIVE) !== 0 ? (flags2 & EACH_ITEM_IMMUTABLE) === 0 ? /* @__PURE__ */ mutable_source(value, false, false) : source(value) : null;
    var i = (flags2 & EACH_INDEX_REACTIVE) !== 0 ? source(index) : null;
    return {
      v,
      i,
      e: branch(() => {
        render_fn(anchor, v ?? value, i ?? index, get_collection);
        return () => {
          items.delete(key);
        };
      })
    };
  }
  function move(effect2, next, anchor) {
    if (!effect2.nodes) return;
    var node = effect2.nodes.start;
    var end = effect2.nodes.end;
    var dest = next && (next.f & EFFECT_OFFSCREEN) === 0 ? (
      /** @type {EffectNodes} */
      next.nodes.start
    ) : anchor;
    while (node !== null) {
      var next_node = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ get_next_sibling(node)
      );
      dest.before(node);
      if (node === end) {
        return;
      }
      node = next_node;
    }
  }
  function link$1(state2, prev, next) {
    if (prev === null) {
      state2.effect.first = next;
    } else {
      prev.next = next;
    }
    if (next === null) {
      state2.effect.last = prev;
    } else {
      next.prev = prev;
    }
  }
  function snippet(node, get_snippet, ...args) {
    var branches = new BranchManager(node);
    block(() => {
      const snippet2 = get_snippet() ?? null;
      branches.ensure(snippet2, snippet2 && ((anchor) => snippet2(anchor, ...args)));
    }, EFFECT_TRANSPARENT);
  }
  function component(node, get_component, render_fn) {
    var branches = new BranchManager(node);
    block(() => {
      var component2 = get_component() ?? null;
      branches.ensure(component2, component2 && ((target) => render_fn(target, component2)));
    }, EFFECT_TRANSPARENT);
  }
  function action(dom, action2, get_value) {
    effect(() => {
      var payload = untrack(() => action2(dom, get_value?.()) || {});
      if (get_value && payload?.update) {
        var inited = false;
        var prev = (
          /** @type {any} */
          {}
        );
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
      if (payload?.destroy) {
        return () => (
          /** @type {Function} */
          payload.destroy()
        );
      }
    });
  }
  const whitespace = [..." 	\n\r\f \v\uFEFF"];
  function to_class(value, hash, directives) {
    var classname = value == null ? "" : "" + value;
    if (hash) {
      classname = classname ? classname + " " + hash : hash;
    }
    if (directives) {
      for (var key in directives) {
        if (directives[key]) {
          classname = classname ? classname + " " + key : key;
        } else if (classname.length) {
          var len = key.length;
          var a = 0;
          while ((a = classname.indexOf(key, a)) >= 0) {
            var b = a + len;
            if ((a === 0 || whitespace.includes(classname[a - 1])) && (b === classname.length || whitespace.includes(classname[b]))) {
              classname = (a === 0 ? "" : classname.substring(0, a)) + classname.substring(b + 1);
            } else {
              a = b;
            }
          }
        }
      }
    }
    return classname === "" ? null : classname;
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
          dom.removeAttribute("class");
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
          dom.removeAttribute("style");
        } else {
          dom.style.cssText = next_style_attr;
        }
      }
      dom.__style = value;
    }
    return next_styles;
  }
  const IS_CUSTOM_ELEMENT = /* @__PURE__ */ Symbol("is custom element");
  const IS_HTML = /* @__PURE__ */ Symbol("is html");
  function set_attribute(element, attribute, value, skip_warning) {
    var attributes = get_attributes(element);
    if (attributes[attribute] === (attributes[attribute] = value)) return;
    if (attribute === "loading") {
      element[LOADING_ATTR_SYMBOL] = value;
    }
    if (value == null) {
      element.removeAttribute(attribute);
    } else if (typeof value !== "string" && get_setters(element).includes(attribute)) {
      element[attribute] = value;
    } else {
      element.setAttribute(attribute, value);
    }
  }
  function get_attributes(element) {
    return (
      /** @type {Record<string | symbol, unknown>} **/
      // @ts-expect-error
      element.__attributes ??= {
        [IS_CUSTOM_ELEMENT]: element.nodeName.includes("-"),
        [IS_HTML]: element.namespaceURI === NAMESPACE_HTML
      }
    );
  }
  var setters_cache = /* @__PURE__ */ new Map();
  function get_setters(element) {
    var cache_key = element.getAttribute("is") || element.nodeName;
    var setters = setters_cache.get(cache_key);
    if (setters) return setters;
    setters_cache.set(cache_key, setters = []);
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
    var batches2 = /* @__PURE__ */ new WeakSet();
    listen_to_event_and_reset_event(input, "input", async (is_reset) => {
      var value = is_reset ? input.defaultValue : input.value;
      value = is_numberlike_input(input) ? to_number(value) : value;
      set2(value);
      if (current_batch !== null) {
        batches2.add(current_batch);
      }
      await tick();
      if (value !== (value = get2())) {
        var start = input.selectionStart;
        var end = input.selectionEnd;
        var length = input.value.length;
        input.value = value ?? "";
        if (end !== null) {
          var new_length = input.value.length;
          if (start === end && end === length && new_length > length) {
            input.selectionStart = new_length;
            input.selectionEnd = new_length;
          } else {
            input.selectionStart = start;
            input.selectionEnd = Math.min(end, new_length);
          }
        }
      }
    });
    if (
      // If we are hydrating and the value has since changed,
      // then use the updated value from the input instead.
      // If defaultValue is set, then value == defaultValue
      // TODO Svelte 6: remove input.value check and set to empty string?
      untrack(get2) == null && input.value
    ) {
      set2(is_numberlike_input(input) ? to_number(input.value) : input.value);
      if (current_batch !== null) {
        batches2.add(current_batch);
      }
    }
    render_effect(() => {
      var value = get2();
      if (input === document.activeElement) {
        var batch = (
          /** @type {Batch} */
          previous_batch ?? current_batch
        );
        if (batches2.has(batch)) {
          return;
        }
      }
      if (is_numberlike_input(input) && value === to_number(input.value)) {
        return;
      }
      if (input.type === "date" && !value && !input.value) {
        return;
      }
      if (value !== input.value) {
        input.value = value ?? "";
      }
    });
  }
  function is_numberlike_input(input) {
    var type = input.type;
    return type === "number" || type === "range";
  }
  function to_number(value) {
    return value === "" ? null : +value;
  }
  function init(immutable = false) {
    const context = (
      /** @type {ComponentContextLegacy} */
      component_context
    );
    const callbacks = context.l.u;
    if (!callbacks) return;
    let props = () => deep_read_state(context.s);
    if (immutable) {
      let version2 = 0;
      let prev = (
        /** @type {Record<string, any>} */
        {}
      );
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
          if (typeof fn === "function") {
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
    return function() {
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
        if (typeof cleanup === "function") return (
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
    var l = (
      /** @type {ComponentContextLegacy} */
      context.l
    );
    return l.u ??= { a: [], b: [], m: [] };
  }
  const PUBLIC_VERSION = "5";
  if (typeof window !== "undefined") {
    ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add(PUBLIC_VERSION);
  }
  const PREFIX = "Dub+";
  function getTimeStamp() {
    return (/* @__PURE__ */ new Date()).toLocaleTimeString();
  }
  function logInfo(...args) {
    console.log(`[${getTimeStamp()}] ${PREFIX}:`, ...args);
  }
  function logError(...args) {
    console.error(`[${getTimeStamp()}] ${PREFIX}:`, ...args);
  }
  function deepCheck(objectPath, startingScope = window) {
    const props = objectPath.split(".");
    let depth = startingScope;
    for (let i = 0; i < props.length; i++) {
      if (typeof depth[props[i]] === "undefined") {
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
        logInfo(arr[i], "is not found yet");
        return false;
      }
    }
    return true;
  }
  function waitFor(callback, options = {}) {
    const defaults2 = {
      interval: 500,
      // every XX ms we check to see if all variables are defined
      seconds: 10
    };
    const opts = Object.assign({}, defaults2, options);
    return new Promise((resolve, reject) => {
      let tryCount = 0;
      const tryLimit = opts.seconds * 1e3 / opts.interval;
      const check = () => {
        tryCount++;
        if (callback()) {
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
  var root$s = /* @__PURE__ */ from_svg(`<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 0 2078.496 2083.914" enable-background="new 0 0 2078.496 2083.914" xml:space="preserve"><rect x="769.659" y="772.445" fill-rule="evenodd" clip-rule="evenodd" fill="#660078" width="539.178" height="539.178"></rect><g><rect x="1308.837" y="772.445" fill-rule="evenodd" clip-rule="evenodd" fill="#EB008B" width="537.488" height="539.178"></rect><polygon fill="#EB008B" points="2045.015,1042.035 1845.324,1311.625 1845.324,772.446 	"></polygon></g><g><rect x="232.172" y="772.445" fill-rule="evenodd" clip-rule="evenodd" fill="#EB008B" width="537.487" height="539.178"></rect><polygon fill="#EB008B" points="33.481,1042.034 233.172,772.445 233.172,1311.623 	"></polygon></g><g><rect x="769.659" y="1311.624" fill-rule="evenodd" clip-rule="evenodd" fill="#6FCBDC" width="539.178" height="537.487"></rect><polygon fill="#6FCBDC" points="1039.248,2047.802 769.659,1848.111 1308.837,1848.111 	"></polygon></g><g><rect x="769.659" y="234.958" fill-rule="evenodd" clip-rule="evenodd" fill="#6FCBDC" width="539.178" height="537.487"></rect><polygon fill="#6FCBDC" points="1039.249,35.268 1308.837,235.958 769.659,235.958 	"></polygon></g></svg>`);
  function Logo($$anchor) {
    var svg = root$s();
    append($$anchor, svg);
  }
  const translations = {
    en: {
      "Modal.confirm": "OK",
      "Modal.cancel": "Cancel",
      "Modal.close": "Close",
      "Modal.defaultValue": "Default Value",
      "Error.modal.title": "Dub+ Error",
      "Error.modal.loggedout": "You're not logged in. Please login to use Dub+.",
      "Error.unknown": "Something went wrong starting Dub+. Please refresh and try again.",
      "Loading.text": "Waiting for QueUp...",
      "Eta.tooltip.notInQueue": "You're not in the queue",
      "Eta.tootltip": "ETA: {{minutes}} minutes",
      "Snooze.tooltip": "Mute for current song",
      "Snooze.tooltip.undo": "Cancel mute for current song",
      "SnoozeVideo.tooltip": "Hide video for current song",
      "SnoozeVideo.tooltip.undo": "Cancel hiding video for current song",
      "Notifcation.permission.title": "Desktop Notification",
      "Notification.permission.denied": "You have dismissed, or chosen to deny, the request to allow desktop notifications. If you change your mind, you will need to reset this in your browser's site settings.",
      "Notification.permission.notSupported": "Sorry this browser does not support desktop notifications.  Please update your browser to the lastest version",
      "Menu.title": "Dub+ Options",
      "general.title": "General",
      "user-interface.title": "User Interface",
      "settings.title": "Settings",
      "customize.title": "Customize",
      "contact.title": "Contact",
      "contact.bugs": "Report bugs on Discord",
      "Switch.on": "On",
      "Switch.off": "Off",
      // this text is only read by screen readers but we should still translate it
      // it is the label of the little pencil icon
      "MenuItem.edit": "Edit",
      "autovote.label": "Autovote",
      "autovote.description": "Toggles auto upvoting for every song",
      "afk.label": "AFK Auto-respond",
      "afk.description": "Toggle Away from Keyboard and customize AFK message.",
      "afk.modal.title": "Custom AFK Message",
      "afk.modal.content": `Enter a custom "Away From Keyboard" [AFK] message here. Message will be prefixed with '[AFK]'`,
      "afk.modal.placeholder": "Be right back!",
      "auto-afk.label": "Auto AFK",
      "auto-afk.description": "Automatically set yourself to AFK after a certain amount of time of inactivity",
      "auto-afk.modal.title": "Auto AFK Timer",
      "auto-afk.modal.content": "Enter the amount of time, in minutes, before you are set to AFK.",
      "auto-afk.modal.validation": "Please enter a whole number greater than 0",
      "emotes.label": "Emotes",
      "emotes.description": "Adds Twitch, Bttv, and FrankerFacez emotes in chat.",
      "autocomplete.label": "Autocomplete Emoji",
      "autocomplete.description": "Toggle autocompleting emojis and emotes. Shows a preview box in the chat",
      "autocomplete.preview.a11y": "press up and down to navigate, press enter or tab to select, press esc to close",
      "autocomplete.preview.navigate": "navigate",
      "autocomplete.preview.select": "select",
      "autocomplete.preview.close": "close",
      "custom-mentions.label": "Custom Mentions",
      "custom-mentions.description": "Toggle using custom mentions to trigger sounds in chat",
      "custom-mentions.modal.title": "Custom Mentions",
      "custom-mentions.modal.content": "Add your custom mention triggers here (separate by comma)",
      "custom-mentions.modal.placeholder": "separate, custom mentions, by, comma, :heart:",
      "chat-cleaner.label": "Chat Cleaner",
      "chat-cleaner.description": "Help keep CPU stress down by setting a limit of how many chat messages to keep in the chat box, deleting older messages.",
      "chat-cleaner.modal.title": "Chat Cleaner",
      "chat-cleaner.modal.content": "Please specify the number of most recent chat items that will remain in your chat history",
      "chat-cleaner.modal.validation": "Please enter a whole number greater than, or equal to, 1",
      "chat-cleaner.modal.placeholder": "500",
      "collapsible-images.label": "Collapsible Images",
      "collapsible-images.description": "Make images in the chat collapsible",
      "mention-notifications.label": "Notification on Mentions",
      "mention-notifications.description": "Enable desktop notifications when a user mentions you in chat",
      "pm-notifications.label": "Notification on PM",
      "pm-notifications.description": "Enable desktop notifications when a user receives a private message",
      "pm-notifications.notification.title": "You have a new PM",
      "dj-notification.label": "DJ Notification",
      "dj-notification.description": "Get a notification when you are coming up to be the DJ",
      "dj-notification.modal.title": "DJ Notification",
      "dj-notification.modal.content": 'Please specify the position in queue you want to be notified at. Use "0" to be notified when you start playing.',
      "dj-notification.notification.title": "DJ Alert!",
      "dj-notification.notification.content": "You will be DJing shortly! Make sure your song is set!",
      "dj-notification.modal.validation": "Please enter a whole number greater than, or equal to, 0",
      "dubs-hover.label": "Show Dubs on Hover",
      "dubs-hover.description": "Show who dubs a song when hovering over the dubs count",
      "dubs-hover.no-votes": "No {{dubType}}s have been casted yet!",
      "dubs-hover.no-grabs": "No one has grabbed this song yet!",
      "downdubs-in-chat.label": "Downdubs in Chat (mods only)",
      "downdubs-in-chat.description": "Toggle showing downdubs in the chat box (mods only)",
      "downdubs-in-chat.chat-message": "@{{username}} has downdubbed your song {{song_name}}",
      "updubs-in-chat.label": "Updubs in Chat",
      "updubs-in-chat.description": "Toggle showing updubs in the chat box",
      "updubs-in-chat.chat-message": "@{{username}} has updubbed your song {{song_name}}",
      "grabs-in-chat.label": "Grabs in Chat",
      "grabs-in-chat.description": "Toggle showing grabs in the chat box",
      "grabs-in-chat.chat-message": "@{{username}} has grabbed your song {{song_name}}",
      "snow.label": "Snow",
      "snow.description": "Make it snow!",
      "rain.label": "Rain",
      "rain.description": "Make it rain!",
      "fullscreen.label": "Fullscreen",
      "fullscreen.description": "Toggle fullscreen video mode",
      "split-chat.label": "Split Chat",
      "split-chat.description": "Toggle Split Chat UI enhancement",
      "hide-chat.label": "Hide Chat",
      "hide-chat.description": "Toggles hiding the chat box",
      "hide-video.label": "Hide Video",
      "hide-video.description": "Toggles hiding the video box",
      "hide-avatars.label": "Hide Avatars",
      "hide-avatars.description": "Toggle hiding user avatars in the chat box",
      "hide-bg.label": "Hide Background",
      "hide-bg.description": "Toggle hiding background image",
      "show-timestamps.label": "Show Timestamps",
      "show-timestamps.description": "Toggle always showing chat message timestamps",
      "flip-interface.label": "Flip Interface",
      "flip-interface.description": "Swap the video and chat positions",
      "pin-menu.label": "Pin Menu",
      "pin-menu.description": "Pin the Dub+ menu to the left or right side. Use the action button to toggle which side it is pinned to. Only works in the non-mobile view",
      "pin-menu.secondaryAction.description": "Click to toggle between pinning to the left or right side",
      "spacebar-mute.label": "Spacebar Mute",
      "spacebar-mute.description": "Turn on/off the ability to mute current song with the spacebar",
      "warn-redirect.label": "Warn on Navigation",
      "warn-redirect.description": "Warns you when accidentally clicking on a link that takes you out of QueUp",
      "community-theme.label": "Community Theme",
      "community-theme.description": "Toggle Community CSS theme",
      "custom-css.label": "Custom CSS",
      "custom-css.description": "Add your own custom CSS.",
      "custom-css.modal.title": "Custom CSS",
      "custom-css.modal.content": "Enter a url location for your custom css",
      "custom-css.modal.placeholder": "https://example.com/example.css",
      "custom-css.modal.validation": "Invalid URL",
      "custom-bg.label": "Custom Background",
      "custom-bg.description": "Add your own custom background.",
      "custom-bg.modal.title": "Custom Background Image",
      "custom-bg.modal.content": "Enter the full URL of an image. We recommend using a .jpg file. Leave blank to remove the current background image",
      "custom-bg.modal.placeholder": "https://example.com/big-image.jpg",
      "custom-notification-sound.label": "Custom Notification Sound",
      "custom-notification-sound.description": "Change the notification sound to a custom one.",
      "custom-notification-sound.modal.title": "Custom Notification Sound",
      "custom-notification-sound.modal.content": "Enter the full URL of a sound file. We recommend using an .mp3 file. Leave blank to go back to QueUp's default sound",
      "custom-notification-sound.modal.placeholder": "https://example.com/sweet-sound.mp3",
      "custom-notification-sound.modal.validation": "Can't play sound from this URL. Please enter a valid URL to an MP3 file.",
      "grab-response.label": "Grab Response",
      "grab-response.description": "Sends a chat message when you grab a song",
      "grab-response.modal.title": "Grab Response",
      "grab-response.modal.content": "Enter a message to send when you grab a song",
      "grab-response.modal.placeholder": "Thanks for the song!"
    }
  };
  const locale = proxy({ current: "en" });
  function translate(loc, key, vars) {
    let text2 = translations[loc][key];
    if (!text2 && loc !== "en") {
      text2 = translations["en"][key];
    }
    if (!text2) {
      logError(`No translation found for ${loc}.${key}`);
      return key;
    }
    Object.keys(vars).forEach((item) => {
      const regex = new RegExp(`{{${item}}}`, "g");
      text2 = text2.replace(regex, vars[item]);
    });
    return text2;
  }
  function t(key, vars = {}) {
    return translate(locale.current, key, vars);
  }
  var root$r = /* @__PURE__ */ from_html(`<div class="dubplus-waiting svelte-gftfsn"><div style="width: 26px; margin-right:5px"><!></div> <span style="flex: 1;"> </span></div>`);
  function Loading($$anchor, $$props) {
    push($$props, false);
    init();
    var div = root$r();
    var div_1 = child(div);
    var node = child(div_1);
    Logo(node);
    var span = sibling(div_1, 2);
    var text2 = child(span);
    template_effect(($0) => set_text(text2, $0), [() => t("Loading.text")]);
    append($$anchor, div);
    pop();
  }
  const modalState = proxy({
    id: "",
    open: false,
    title: "Dub+",
    content: "",
    value: "",
    placeholder: "",
    defaultValue: "",
    maxlength: 999,
    validation: () => {
      return true;
    },
    onConfirm: () => {
      return true;
    },
    onCancel: () => {
    }
  });
  function updateModalState(nextState) {
    modalState.open = nextState.open ?? false;
    modalState.title = nextState.title || "Dub+";
    modalState.content = nextState.content || "";
    modalState.value = nextState.value || "";
    modalState.placeholder = nextState.placeholder || "";
    modalState.defaultValue = nextState.defaultValue;
    modalState.maxlength = nextState.maxlength || 999;
    modalState.onConfirm = nextState.onConfirm;
    modalState.onCancel = nextState.onCancel;
    modalState.validation = nextState.validation || (() => true);
  }
  var root_1$3 = /* @__PURE__ */ from_html(`<div class="default svelte-5awcn0"><span class="default-label svelte-5awcn0"> </span> <span class="default-value svelte-5awcn0"> </span></div>`);
  var root_2$3 = /* @__PURE__ */ from_html(`<textarea class="svelte-5awcn0">
      </textarea>`);
  var root_3$1 = /* @__PURE__ */ from_html(`<p class="dp-modal--error svelte-5awcn0"> </p>`);
  var root_4 = /* @__PURE__ */ from_html(`<button class="dp-modal--cancel cancel svelte-5awcn0"> </button> <button class="dp-modal--confirm confirm svelte-5awcn0"> </button>`, 1);
  var root_5 = /* @__PURE__ */ from_html(`<button class="dp-modal--cancel cancel svelte-5awcn0"> </button>`);
  var root$q = /* @__PURE__ */ from_html(`<dialog id="dubplus-dialog" class="dp-modal svelte-5awcn0"><h1 class="svelte-5awcn0"> </h1> <div class="dp-modal--content content svelte-5awcn0"><p class="svelte-5awcn0"> </p> <!> <!> <!></div> <div class="dp-modal--buttons buttons svelte-5awcn0"><!></div></dialog>`);
  function Modal($$anchor, $$props) {
    push($$props, true);
    let errorMessage = /* @__PURE__ */ state("");
    let dialog;
    onMount(() => {
      dialog = /**@type {HTMLDialogElement}*/
      document.getElementById("dubplus-dialog");
      dialog.addEventListener("close", () => {
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
            set_text(text_2, `${$0 ?? ""}:`);
            set_text(text_3, modalState.defaultValue);
          },
          [() => t("Modal.defaultValue")]
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
          set_attribute(textarea, "placeholder", modalState.placeholder);
          set_attribute(textarea, "maxlength", modalState.maxlength < 999 ? modalState.maxlength : 999);
        });
        bind_value(textarea, () => modalState.value, ($$value) => modalState.value = $$value);
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
          set(errorMessage, "");
          if (typeof modalState.onCancel === "function") {
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
            set(errorMessage, "");
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
          [() => t("Modal.cancel"), () => t("Modal.confirm")]
        );
        append($$anchor2, fragment);
      };
      var alternate = ($$anchor2) => {
        var button_2 = root_5();
        button_2.__click = () => {
          dialog.close();
          modalState.open = false;
          set(errorMessage, "");
        };
        var text_7 = child(button_2);
        template_effect(($0) => set_text(text_7, $0), [() => t("Modal.close")]);
        append($$anchor2, button_2);
      };
      if_block(node_3, ($$render) => {
        if (typeof modalState.onConfirm === "function") $$render(consequent_3);
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
  delegate(["click"]);
  const teleport = (node, { to, position = "append" }) => {
    user_effect(() => {
      if (node.id) {
        document.getElementById(node.id)?.remove();
      }
      const teleportContainer = document.querySelector(to);
      if (!teleportContainer) {
        throw new Error(`teleport container not found: ${to}`);
      }
      if (position === "append") {
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
    return document.querySelector("#chat-txt-message");
  }
  function getChatContainer() {
    return document.querySelector("ul.chat-main");
  }
  function getChatMessages(extra = "") {
    return document.querySelectorAll(`ul.chat-main > li${extra}`);
  }
  function getImagesInChat() {
    return document.querySelectorAll(".chat-main > li .autolink-image");
  }
  function getBackgroundImage() {
    return document.querySelector(".backstretch img");
  }
  function getQueuePosition() {
    return document.querySelector(".queue-position");
  }
  function getQueueTotal() {
    return document.querySelector(".queue-total");
  }
  function getPlayerIframe() {
    return document.querySelector(".player_container iframe");
  }
  function getPrivateMessageButton() {
    return document.querySelector(".user-messages");
  }
  function getPrivateMessage(messageId) {
    return document.querySelector(`.message-item[data-messageid="${messageId}"]`);
  }
  function getDubUp() {
    return document.querySelector(".dubup");
  }
  function getDubDown() {
    return document.querySelector(".dubdown");
  }
  function getAddToPlaylist() {
    return document.querySelector(".add-to-playlist");
  }
  function getCurrentSongMinutes() {
    return document.querySelector("div.currentTime span.min");
  }
  const CHAT_INPUT_CONTAINER = ".pusher-chat-widget-input";
  const DUBPLUS_MENU_CONTAINER = ".header-right-navigation";
  const PLAYER_SHARING_CONTAINER = ".player_sharing";
  var root$p = /* @__PURE__ */ from_html(`<button id="dubplus-menu-icon" type="button" aria-label="Dub+ menu" class="dubplus-icon svelte-4l9n7d"><!></button>`);
  function MenuIcon($$anchor, $$props) {
    push($$props, false);
    init();
    var button = root$p();
    button.__click = () => {
      document.querySelector(".dubplus-menu").classList.toggle("dubplus-menu-open");
    };
    var node = child(button);
    Logo(node);
    action(button, ($$node, $$action_arg) => teleport?.($$node, $$action_arg), () => ({ to: DUBPLUS_MENU_CONTAINER }));
    append($$anchor, button);
    pop();
  }
  delegate(["click"]);
  const optionsKeyMap = {
    "dubplus-autovote": "autovote",
    "dubplus-afk": "afk",
    "dubplus-emotes": "emotes",
    "dubplus-autocomplete": "autocomplete",
    custom_mentions: "custom-mentions",
    "chat-cleaner": "chat-cleaner",
    mention_notifications: "mention-notifications",
    dubplus_pm_notifications: "pm-notifications",
    dj_notification: "dj-notification",
    "dubplus-dubs-hover": "dubs-hover",
    "dubplus-downdubs": "downdubs-in-chat",
    "dubplus-updubs": "updubs-in-chat",
    "dubplus-grabschat": "grabs-in-chat",
    "dubplus-snow": "snow",
    "dubplus-rain": "rain",
    "dubplus-fullscreen": "fullscreen",
    "dubplus-split-chat": "split-chat",
    "dubplus-video-only": "hide-chat",
    "dubplus-chat-only": "hide-video",
    "dubplus-hide-avatars": "hide-avatars",
    "dubplus-hide-bg": "hide-bg",
    "dubplus-show-timestamp": "show-timestamps",
    "dubplus-spacebar-mute": "spacebar-mute",
    warn_redirect: "warn-redirect",
    "dubplus-comm-theme": "community-theme",
    "dubplus-custom-css": "custom-css",
    "dubplus-custom-bg": "custom-bg",
    "dubplus-custom-notification-sound": "custom-notification-sound"
  };
  const customKeyMap = {
    customAfkMessage: optionsKeyMap["dubplus-afk"],
    custom_mentions: optionsKeyMap["custom_mentions"],
    chat_cleaner: optionsKeyMap["chat-cleaner"],
    dj_notification: optionsKeyMap["dj_notification"],
    css: optionsKeyMap["dubplus-custom-css"],
    bg: optionsKeyMap["dubplus-custom-bg"],
    notificationSound: optionsKeyMap["dubplus-custom-notification-sound"],
    "dubplus-custom-notification-sound": optionsKeyMap["dubplus-custom-notification-sound"]
  };
  function migrate(oldSettings) {
    logInfo("Old Settings", oldSettings);
    const newOptions = {
      options: {},
      menu: { ...oldSettings.menu },
      custom: {}
    };
    for (const [oldKey, boolValue] of Object.entries(oldSettings.options)) {
      const newKey = optionsKeyMap[oldKey];
      try {
        newOptions.options[newKey] = boolValue;
      } catch (e) {
        logError(
          "Error converting options",
          e.message,
          oldKey,
          newKey,
          boolValue
        );
      }
    }
    for (const [oldKey, stringValue] of Object.entries(oldSettings.custom)) {
      const newKey = customKeyMap[oldKey];
      try {
        newOptions.custom[newKey] = stringValue;
      } catch (e) {
        logError(
          "Error converting custom",
          e.message,
          oldKey,
          newKey,
          stringValue
        );
      }
    }
    return newOptions;
  }
  const STORAGE_KEY_OLD = "dubplusUserSettings";
  const STORAGE_KEY_NEW = "dubplusUserSettingsV2";
  const defaults = {
    options: {},
    menu: {
      general: "open",
      "user-interface": "open",
      settings: "open",
      customize: "open",
      contact: "open"
    },
    custom: {}
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
      logInfo("Error loading v2 settings, trying old settings. Error:", e);
    }
    try {
      const oldSettings = JSON.parse(localStorage.getItem(STORAGE_KEY_OLD));
      if (oldSettings) {
        return migrate(
          /**@type {import("../../global").Settings}*/
          oldSettings
        );
      }
    } catch (e) {
      logInfo("Error loading old settings:", e);
    }
    return {};
  }
  const intialSettings = Object.assign({}, defaults, loadSettings());
  let settings = proxy(intialSettings);
  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY_NEW, JSON.stringify(settings));
    } catch (e) {
      logError("Error saving user settings:", e);
    }
  }
  function saveSetting(section, property, value) {
    if (section === "option") {
      settings.options[property] = value;
      persist();
      return;
    }
    if (section === "custom") {
      settings.custom[property] = value;
      persist();
      return;
    }
    if (section === "menu") {
      settings.menu[property] = value;
      persist();
      return;
    }
    throw new Error(`Invalid section: "${section}"`);
  }
  var root$o = /* @__PURE__ */ from_html(`<button type="button" class="dubplus-menu-section-header svelte-ou161d"><span></span> <p class="svelte-ou161d"> </p></button>`);
  function MenuHeader($$anchor, $$props) {
    push($$props, true);
    let arrow = /* @__PURE__ */ state("down");
    let expanded = /* @__PURE__ */ state(true);
    user_effect(() => {
      if (settings.menu[$$props.settingsId] === "closed") {
        set(arrow, "right");
        set(expanded, false);
      } else {
        set(arrow, "down");
        set(expanded, true);
      }
    });
    function toggle() {
      settings.menu[$$props.settingsId] = settings.menu[$$props.settingsId] === "closed" ? "open" : "closed";
      saveSetting("menu", $$props.settingsId, settings.menu[$$props.settingsId]);
    }
    var button = root$o();
    button.__click = toggle;
    var span = child(button);
    var p = sibling(span, 2);
    var text2 = child(p);
    template_effect(() => {
      set_attribute(button, "id", `dubplus-menu-section-header-${$$props.settingsId}`);
      set_attribute(button, "aria-expanded", get(expanded));
      set_attribute(button, "aria-controls", `dubplus-menu-section-${$$props.settingsId}`);
      set_class(span, 1, `fa fa-angle-${get(arrow) ?? ""}`, "svelte-ou161d");
      set_text(text2, $$props.name);
    });
    append($$anchor, button);
    pop();
  }
  delegate(["click"]);
  var root$n = /* @__PURE__ */ from_html(`<ul class="dubplus-menu-section svelte-1njz3ux" role="region"><!></ul>`);
  function MenuSection($$anchor, $$props) {
    var ul = root$n();
    var node = child(ul);
    snippet(node, () => $$props.children);
    template_effect(() => {
      set_attribute(ul, "id", `dubplus-menu-section-${$$props.settingsId}`);
      set_attribute(ul, "aria-labelledby", `dubplus-menu-section-header-${$$props.settingsId}`);
    });
    append($$anchor, ul);
  }
  var root$m = /* @__PURE__ */ from_html(`<li class="dubplus-menu-icon svelte-705sau"><!> <a class="dubplus-menu-label svelte-705sau" target="_blank"> </a></li>`);
  function MenuLink($$anchor, $$props) {
    var li = root$m();
    var node = child(li);
    component(node, () => $$props.icon, ($$anchor2, Icon_1) => {
      Icon_1($$anchor2, {});
    });
    var a = sibling(node, 2);
    var text_1 = child(a);
    template_effect(() => {
      set_attribute(a, "href", $$props.href);
      set_text(text_1, $$props.text);
    });
    append($$anchor, li);
  }
  var root$l = /* @__PURE__ */ from_svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0c53 0 96 43 96 96l0 3.6c0 15.7-12.7 28.4-28.4 28.4l-135.1 0c-15.7 0-28.4-12.7-28.4-28.4l0-3.6c0-53 43-96 96-96zM41.4 105.4c12.5-12.5 32.8-12.5 45.3 0l64 64c.7 .7 1.3 1.4 1.9 2.1c14.2-7.3 30.4-11.4 47.5-11.4l112 0c17.1 0 33.2 4.1 47.5 11.4c.6-.7 1.2-1.4 1.9-2.1l64-64c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-64 64c-.7 .7-1.4 1.3-2.1 1.9c6.2 12 10.1 25.3 11.1 39.5l64.3 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c0 24.6-5.5 47.8-15.4 68.6c2.2 1.3 4.2 2.9 6 4.8l64 64c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0l-63.1-63.1c-24.5 21.8-55.8 36.2-90.3 39.6L272 240c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 239.2c-34.5-3.4-65.8-17.8-90.3-39.6L86.6 502.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l64-64c1.9-1.9 3.9-3.4 6-4.8C101.5 367.8 96 344.6 96 320l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64.3 0c1.1-14.1 5-27.5 11.1-39.5c-.7-.6-1.4-1.2-2.1-1.9l-64-64c-12.5-12.5-12.5-32.8 0-45.3z"></path></svg>`);
  function IconBug($$anchor) {
    var svg = root$l();
    append($$anchor, svg);
  }
  var root$k = /* @__PURE__ */ from_svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32zM305.9 166.4c20.6 0 37.3-16.7 37.3-37.3s-16.7-37.3-37.3-37.3c-18 0-33.1 12.8-36.6 29.8c-30.2 3.2-53.8 28.8-53.8 59.9l0 .2c-32.8 1.4-62.8 10.7-86.6 25.5c-8.8-6.8-19.9-10.9-32-10.9c-28.9 0-52.3 23.4-52.3 52.3c0 21 12.3 39 30.1 47.4c1.7 60.7 67.9 109.6 149.3 109.6s147.6-48.9 149.3-109.7c17.7-8.4 29.9-26.4 29.9-47.3c0-28.9-23.4-52.3-52.3-52.3c-12 0-23 4-31.9 10.8c-24-14.9-54.3-24.2-87.5-25.4l0-.1c0-22.2 16.5-40.7 37.9-43.7l0 0c3.9 16.5 18.7 28.7 36.3 28.7zM155 248.1c14.6 0 25.8 15.4 25 34.4s-11.8 25.9-26.5 25.9s-27.5-7.7-26.6-26.7s13.5-33.5 28.1-33.5zm166.4 33.5c.9 19-12 26.7-26.6 26.7s-25.6-6.9-26.5-25.9c-.9-19 10.3-34.4 25-34.4s27.3 14.6 28.1 33.5zm-42.1 49.6c-9 21.5-30.3 36.7-55.1 36.7s-46.1-15.1-55.1-36.7c-1.1-2.6 .7-5.4 3.4-5.7c16.1-1.6 33.5-2.5 51.7-2.5s35.6 .9 51.7 2.5c2.7 .3 4.5 3.1 3.4 5.7z"></path></svg>`);
  function IconReddit($$anchor) {
    var svg = root$k();
    append($$anchor, svg);
  }
  var root$j = /* @__PURE__ */ from_svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64h98.2V334.2H109.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H255V480H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"></path></svg>`);
  function IconFacebook($$anchor) {
    var svg = root$j();
    append($$anchor, svg);
  }
  var root$i = /* @__PURE__ */ from_svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM351.3 199.3v0c0 86.7-66 186.6-186.6 186.6c-37.2 0-71.7-10.8-100.7-29.4c5.3 .6 10.4 .8 15.8 .8c30.7 0 58.9-10.4 81.4-28c-28.8-.6-53-19.5-61.3-45.5c10.1 1.5 19.2 1.5 29.6-1.2c-30-6.1-52.5-32.5-52.5-64.4v-.8c8.7 4.9 18.9 7.9 29.6 8.3c-9-6-16.4-14.1-21.5-23.6s-7.8-20.2-7.7-31c0-12.2 3.2-23.4 8.9-33.1c32.3 39.8 80.8 65.8 135.2 68.6c-9.3-44.5 24-80.6 64-80.6c18.9 0 35.9 7.9 47.9 20.7c14.8-2.8 29-8.3 41.6-15.8c-4.9 15.2-15.2 28-28.8 36.1c13.2-1.4 26-5.1 37.8-10.2c-8.9 13.1-20.1 24.7-32.9 34c.2 2.8 .2 5.7 .2 8.5z"></path></svg>`);
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
      let $0 = /* @__PURE__ */ derived_safe_equal(() => t("contact.title"));
      MenuHeader(node, {
        settingsId: "contact",
        get name() {
          return get($0);
        }
      });
    }
    var node_1 = sibling(node, 2);
    MenuSection(node_1, {
      settingsId: "contact",
      children: ($$anchor2, $$slotProps) => {
        var fragment_1 = root_1$2();
        var node_2 = first_child(fragment_1);
        {
          let $0 = /* @__PURE__ */ derived_safe_equal(() => t("contact.bugs"));
          MenuLink(node_2, {
            get icon() {
              return IconBug;
            },
            href: "https://discord.gg/XUkG3Qy",
            get text() {
              return get($0);
            }
          });
        }
        var node_3 = sibling(node_2, 2);
        MenuLink(node_3, {
          get icon() {
            return IconReddit;
          },
          href: "https://www.reddit.com/r/DubPlus/",
          text: "Reddit"
        });
        var node_4 = sibling(node_3, 2);
        MenuLink(node_4, {
          get icon() {
            return IconFacebook;
          },
          href: "https://facebook.com/DubPlusScript",
          text: "Facebook"
        });
        var node_5 = sibling(node_4, 2);
        MenuLink(node_5, {
          get icon() {
            return IconTwitter;
          },
          href: "https://twitter.com/DubPlusScript",
          text: "Twitter"
        });
        append($$anchor2, fragment_1);
      }
    });
    append($$anchor, fragment);
    pop();
  }
  var root$g = /* @__PURE__ */ from_html(`<div role="switch" tabindex="0" class="svelte-1g2jwmf"><span class="dubplus-switch svelte-1g2jwmf"><span class="svelte-1g2jwmf"></span></span> <span class="dubplus-switch-label svelte-1g2jwmf"> </span></div>`);
  function Switch($$anchor, $$props) {
    push($$props, true);
    function toggleOption() {
      settings.options[$$props.optionId] = !settings.options[$$props.optionId];
      $$props.onToggle(settings.options[$$props.optionId]);
    }
    function handleKeydown(event2) {
      if ($$props.disabled) return;
      if (event2.key === "Enter" || event2.key === " ") {
        event2.preventDefault();
        toggleOption();
      }
    }
    function handleClick() {
      if ($$props.disabled) return;
      toggleOption();
    }
    var div = root$g();
    div.__click = handleClick;
    div.__keydown = handleKeydown;
    var span = sibling(child(div), 2);
    var text2 = child(span);
    template_effect(() => {
      set_attribute(div, "aria-disabled", $$props.disabled ? "true" : "false");
      set_attribute(div, "aria-checked", settings.options[$$props.optionId] ? "true" : "false");
      set_text(text2, $$props.label);
    });
    append($$anchor, div);
    pop();
  }
  delegate(["click", "keydown"]);
  var root$f = /* @__PURE__ */ from_svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg>`);
  function IconPencil($$anchor) {
    var svg = root$f();
    append($$anchor, svg);
  }
  function isMod(userid) {
    return window.QueUp.helpers.isSiteAdmin(userid) || window.QueUp.room.users.getIfOwner(userid) || window.QueUp.room.users.getIfManager(userid) || window.QueUp.room.users.getIfMod(userid);
  }
  var root_1$1 = /* @__PURE__ */ from_html(`<button type="button" class="svelte-1aj88xa"><!> <span class="sr-only"> </span></button>`);
  var root_2$2 = /* @__PURE__ */ from_html(`<button type="button" class="svelte-1aj88xa"><!> <span class="sr-only"> </span></button>`);
  var root$e = /* @__PURE__ */ from_html(`<li><!> <!> <!></li>`);
  function MenuSwitch($$anchor, $$props) {
    push($$props, true);
    const SecondaryIcon = $$props.secondaryAction?.icon || IconPencil;
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
        defaultValue: $$props.customize.defaultValue ? t($$props.customize.defaultValue) : "",
        maxlength: $$props.customize.maxlength,
        value: settings.custom[$$props.id] || "",
        validation: $$props.customize.validation,
        onConfirm: (value) => {
          saveSetting("custom", $$props.id, value);
          if (value.trim() === "" && !$$props.customize.defaultValue) {
            saveSetting("option", $$props.id, false);
            $$props.turnOff();
          }
          if (typeof $$props.customize.onConfirm === "function") {
            $$props.customize.onConfirm(value);
          }
        },
        onCancel: () => {
          if (!$$props.customize.defaultValue && (typeof settings.custom[$$props.id] === "undefined" || settings.custom[$$props.id] === "")) {
            saveSetting("option", $$props.id, false);
            $$props.turnOff();
          }
          if (typeof $$props.customize.onCancel === "function") $$props.customize.onCancel();
        }
      });
      modalState.open = true;
    }
    var li = root$e();
    let classes;
    var node = child(li);
    {
      let $0 = /* @__PURE__ */ user_derived(() => $$props.modOnly ? !isMod(window.QueUp.session.id) : false);
      let $1 = /* @__PURE__ */ user_derived(() => t($$props.label));
      Switch(node, {
        get disabled() {
          return get($0);
        },
        get label() {
          return get($1);
        },
        onToggle: (state2) => {
          if ($$props.customize && state2 === true && !settings.custom[$$props.id]) {
            openEditModal();
            return;
          }
          saveSetting("option", $$props.id, state2);
          if (state2) {
            $$props.turnOn();
          } else {
            $$props.turnOff();
          }
        },
        get optionId() {
          return $$props.id;
        }
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
        template_effect(($0) => set_text(text2, $0), [() => t("MenuItem.edit")]);
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
        button_1.__click = function(...$$args) {
          $$props.secondaryAction.onClick?.apply(this, $$args);
        };
        var node_4 = child(button_1);
        SecondaryIcon(node_4, {});
        var span_1 = sibling(node_4, 2);
        var text_1 = child(span_1);
        template_effect(
          ($0, $1) => {
            set_attribute(button_1, "title", $0);
            set_text(text_1, $1);
          },
          [
            () => t($$props.secondaryAction.description),
            () => t($$props.secondaryAction.description)
          ]
        );
        append($$anchor2, button_1);
      };
      if_block(node_3, ($$render) => {
        if ($$props.secondaryAction) $$render(consequent_1);
      });
    }
    template_effect(
      ($0, $1) => {
        set_attribute(li, "id", `dubplus-${$$props.id}`);
        set_attribute(li, "title", $0);
        classes = set_class(li, 1, "svelte-1aj88xa", null, classes, $1);
      },
      [
        () => t($$props.description),
        () => ({
          disabled: $$props.modOnly ? !isMod(window.QueUp.session.id) : false
        })
      ]
    );
    append($$anchor, li);
    pop();
  }
  delegate(["click"]);
  const DUB = "realtime:room_playlist-dub";
  const GRAB = "realtime:room_playlist-queue-update-grabs";
  const USER_LEAVE = "realtime:user-leave";
  const PLAYLIST_UPDATE = "realtime:room_playlist-update";
  const CHAT_MESSAGE = "realtime:chat-message";
  const NEW_PM_MESSAGE = "realtime:new-message";
  function voteCheck() {
    window.QueUp?.playerController?.voteUp?.click();
  }
  const autovote = {
    id: "autovote",
    label: "autovote.label",
    description: "autovote.description",
    category: "general",
    turnOff() {
      window.QueUp.Events.unbind(PLAYLIST_UPDATE, voteCheck);
    },
    turnOn() {
      voteCheck();
      window.QueUp.Events.bind(PLAYLIST_UPDATE, voteCheck);
    }
  };
  function insertQueupChat(className, textContent) {
    const li = document.createElement("li");
    li.className = `dubplus-chat-system ${className}`;
    const chatDelete = document.createElement("div");
    chatDelete.className = "chatDelete";
    chatDelete.onclick = function(e) {
      e.target.parentElement.remove();
    };
    const span = document.createElement("span");
    span.className = "icon-close";
    chatDelete.appendChild(span);
    li.appendChild(chatDelete);
    const text2 = document.createElement("div");
    text2.className = "text";
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
    const user = window.QueUp.session.get("username");
    if (content.includes(`@${user}`) && window.QueUp.session.id !== e.user.userInfo.userid) {
      let chatMessage = "";
      if (settings.custom.afk) {
        chatMessage = `[AFK] ${settings.custom.afk}`;
      } else {
        chatMessage = `[AFK] ${t("afk.modal.placeholder")}`;
      }
      sendChatMessage(chatMessage);
      canSend = false;
      setTimeout(() => {
        canSend = true;
      }, 3e4);
    }
  }
  const afk = {
    id: "afk",
    label: "afk.label",
    description: "afk.description",
    category: "general",
    turnOn() {
      window.QueUp.Events.bind(CHAT_MESSAGE, afk_chat_respond);
    },
    turnOff() {
      window.QueUp.Events.unbind(CHAT_MESSAGE, afk_chat_respond);
    },
    custom: {
      title: "afk.modal.title",
      content: "afk.modal.content",
      placeholder: "afk.modal.placeholder",
      defaultValue: "afk.modal.placeholder",
      maxlength: 255
    }
  };
  const OBJECT_STORE_NAME = "s";
  class LDB {
    constructor() {
      this.db = null;
      const dbReq = window.indexedDB.open("d2", 1);
      const outerThis = this;
      dbReq.onsuccess = function() {
        outerThis.db = this.result;
      };
      dbReq.onerror = function(e) {
        console.error("Dub+", "indexedDB request error:", e);
      };
      dbReq.onupgradeneeded = function() {
        outerThis.db = null;
        var t2 = this.result.createObjectStore(OBJECT_STORE_NAME, {
          keyPath: "k"
        });
        t2.transaction.oncomplete = function() {
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
          this.db.transaction(OBJECT_STORE_NAME).objectStore(OBJECT_STORE_NAME).get(key).onsuccess = function() {
            resolve(this.result?.v || null);
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
      this.db.transaction(OBJECT_STORE_NAME, "readwrite").objectStore(OBJECT_STORE_NAME).put({ k: key, v: value });
    }
  }
  const ldb = new LDB();
  function fetchTwitchEmotes() {
    return fetch(
      "//cdn.jsdelivr.net/gh/Jiiks/BetterDiscordApp/data/emotedata_twitch_global.json"
    ).then((res) => res.json());
  }
  function fetchBTTVEmotes() {
    return fetch("//api.betterttv.net/3/cached/emotes/global").then(
      (res) => res.json()
    );
  }
  function fetchFrankerFacezEmotes() {
    return fetch(
      "//api.frankerfacez.com/v1/emoticons?per_page=200&private=off&sort=count-desc"
    ).then((res) => res.json());
  }
  const dubplus_emoji = {
    emoji: {
      /**
       * @param {string} id
       * @returns {string}
       */
      template(id) {
        id = id.replace(/:/g, "");
        return `${window.emojify.defaultConfig.img_dir}/${encodeURI(id)}.png`;
      }
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
      emotesMap: /* @__PURE__ */ new Map()
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
      emotesMap: /* @__PURE__ */ new Map()
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
      emotesMap: /* @__PURE__ */ new Map()
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
            if (typeof parsed.error !== "undefined") {
              return true;
            }
          } catch {
            return true;
          }
        }
        const today = Date.now();
        const lastSaved = parseInt(
          localStorage.getItem(`${apiName}_api_timestamp`)
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
      return this.shouldUpdateAPIs("twitch").then((shouldUpdate) => {
        if (shouldUpdate) {
          logInfo("twitch", "loading from api");
          return fetchTwitchEmotes().then((json) => {
            const twitchEmotes = {};
            for (const emote in json.emotes) {
              if (!twitchEmotes[emote]) {
                twitchEmotes[emote] = json.emotes[emote].image_id;
              }
            }
            localStorage.setItem("twitch_api_timestamp", Date.now().toString());
            ldb.set("twitch_api", JSON.stringify(twitchEmotes));
            dubplus_emoji.processTwitchEmotes(twitchEmotes);
          }).catch((err) => logError(err));
        } else {
          return ldb.get("twitch_api").then((data) => {
            logInfo("twitch", "loading from IndexedDB");
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
      return this.shouldUpdateAPIs("bttv").then((shouldUpdate) => {
        if (shouldUpdate) {
          logInfo("bttv", "loading from api");
          return fetchBTTVEmotes().then((json) => {
            const bttvEmotes = {};
            json.forEach((e) => {
              if (!bttvEmotes[e.code]) {
                bttvEmotes[e.code] = e.id;
              }
            });
            localStorage.setItem("bttv_api_timestamp", Date.now().toString());
            ldb.set("bttv_api", JSON.stringify(bttvEmotes));
            dubplus_emoji.processBTTVEmotes(bttvEmotes);
          }).catch((err) => logError(err));
        } else {
          return ldb.get("bttv_api").then((data) => {
            logInfo("bttv", "loading from IndexedDB");
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
      return this.shouldUpdateAPIs("frankerfacez").then((shouldUpdate) => {
        if (shouldUpdate) {
          logInfo("frankerfacez", "loading from api");
          return fetchFrankerFacezEmotes().then((json) => {
            const frankerFacez = json;
            localStorage.setItem(
              "frankerfacez_api_timestamp",
              Date.now().toString()
            );
            ldb.set("frankerfacez_api", JSON.stringify(frankerFacez));
            dubplus_emoji.processFrankerFacez(frankerFacez);
          }).catch((err) => logError(err));
        } else {
          return ldb.get("frankerfacez_api").then((data) => {
            logInfo("frankerfacez", "loading from IndexedDB");
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
          if (code.includes(":")) {
            continue;
          }
          if (window.emojify.emojiNames.includes(key) || this.twitch.emotesMap.has(key)) {
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
        if (code.includes(":")) {
          continue;
        }
        if (window.emojify.emojiNames.includes(key) || this.twitch.emotesMap.has(key) || this.bttv.emotesMap.has(key)) {
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
            platform: "emojify"
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
            platform: "twitch"
          });
        }
      });
      Array.from(this.bttv.emotesMap.keys()).forEach((emoji) => {
        if (emoji.includes(str)) {
          matches.push({
            src: this.bttv.template(this.bttv.emotesMap.get(emoji)),
            text: emoji,
            alt: emoji,
            platform: "bttv"
          });
        }
      });
      Array.from(this.frankerFacez.emotesMap.keys()).forEach((emoji) => {
        if (emoji.includes(str)) {
          matches.push({
            src: this.frankerFacez.template(
              this.frankerFacez.emotesMap.get(emoji)
            ),
            text: emoji,
            alt: emoji,
            platform: "ffz"
          });
        }
      });
      return matches;
    }
  };
  function makeImage(type, src, name2, w, h) {
    const img = document.createElement("img");
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
        const key = chunk.toLowerCase().replace(/^:/, "").replace(/:$/, "");
        if (dubplus_emoji.twitchJSONSLoaded && dubplus_emoji.twitch.emotesMap.has(key)) {
          const id = dubplus_emoji.twitch.emotesMap.get(key);
          const src = dubplus_emoji.twitch.template(id);
          const img = makeImage("twitch", src, key);
          nodes.push(img);
        } else if (dubplus_emoji.bttvJSONSLoaded && dubplus_emoji.bttv.emotesMap.has(key)) {
          const id = dubplus_emoji.bttv.emotesMap.get(key);
          const src = dubplus_emoji.bttv.template(id);
          const img = makeImage("bttv", src, key);
          nodes.push(img);
        } else if (dubplus_emoji.frankerfacezJSONLoaded && dubplus_emoji.frankerFacez.emotesMap.has(key)) {
          const id = dubplus_emoji.frankerFacez.emotesMap.get(key);
          const src = dubplus_emoji.frankerFacez.template(id);
          const img = makeImage("frankerFacez", src, key);
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
    const textElems = li.querySelectorAll(".text p");
    textElems.forEach((textElem) => {
      if (!textElem.hasAttribute("dubplus-emotes-processed") && textElem?.textContent.trim() !== "") {
        const processedHTML = processChatText(textElem.textContent);
        textElem.replaceChildren(...processedHTML);
        textElem.setAttribute("dubplus-emotes-processed", "true");
      }
    });
  }
  function replaceTextWithEmote(e) {
    if (e?.chatid) {
      const chatMessage = document.querySelector(`.chat-id-${e.chatid}`);
      if (chatMessage) {
        processChatLI(chatMessage);
        return;
      }
    }
    const chats = getChatMessages();
    if (!chats?.length) {
      return;
    }
    chats.forEach(processChatLI);
  }
  const emotes = {
    id: "emotes",
    label: "emotes.label",
    description: "emotes.description",
    category: "general",
    turnOn() {
      dubplus_emoji.loadTwitchEmotes().then(() => dubplus_emoji.loadBTTVEmotes()).then(() => dubplus_emoji.loadFrankerFacez()).then(() => {
        replaceTextWithEmote();
        window.QueUp.Events.bind(CHAT_MESSAGE, replaceTextWithEmote);
      });
    },
    turnOff() {
      window.QueUp.Events.unbind(CHAT_MESSAGE, replaceTextWithEmote);
    }
  };
  const emojiState = proxy({ selectedIndex: 0, emojiList: [] });
  function reset$1() {
    emojiState.selectedIndex = 0;
    emojiState.emojiList = [];
  }
  function setEmojiList(listArray, searchStr) {
    const platforms = ["emojify", "twitch", "bttv", "ffz"];
    emojiState.emojiList = listArray.filter((emoji, index, self) => index === self.findIndex((e) => e.src === emoji.src && e.platform === emoji.platform)).sort((a, b) => {
      const platformA = platforms.indexOf(a.platform);
      const platformB = platforms.indexOf(b.platform);
      if (platformA === platformB) {
        if (a.text.startsWith(searchStr) && !b.text.startsWith(searchStr)) {
          return -1;
        } else if (!a.text.startsWith(searchStr) && b.text.startsWith(searchStr)) {
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
    return char === " " || char === "\n";
  }
  function getSelection(currentText, cursorPos) {
    let left = cursorPos > 0 ? cursorPos : 0;
    while (left > 0 && currentText[left] !== ":") {
      left -= 1;
    }
    let right = cursorPos;
    while (!isEdge(currentText[right]) && right < currentText.length) {
      right += 1;
    }
    return [left, right];
  }
  const KEYS = {
    up: "ArrowUp",
    down: "ArrowDown",
    enter: "Enter",
    esc: "Escape",
    tab: "Tab"
  };
  const MIN_CHAR = 2;
  let acPreview = document.querySelector("#autocomplete-preview");
  let originalKeyDownEventHandler;
  function insertEmote(inputEl, index) {
    const selected = emojiState.emojiList[index];
    const [start, end] = getSelection(inputEl.value, inputEl.selectionStart);
    const target = inputEl.value.substring(start, end);
    inputEl.value = inputEl.value.replace(target, `:${selected.text}:`);
    reset$1();
  }
  function checkInput(e) {
    const inputEl = (
      /**@type {HTMLTextAreaElement}*/
      e.target
    );
    const currentText = inputEl.value;
    const cursorPos = inputEl.selectionStart;
    let str = "";
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
    if (str.startsWith(":") && str.length >= MIN_CHAR && !str.endsWith(":")) {
      const searchStr = str.substring(1).trim();
      const list = dubplus_emoji.findMatchingEmotes(
        searchStr,
        settings.options.emotes
      );
      setEmojiList(list, searchStr);
    } else {
      reset$1();
    }
  }
  function chatInputKeyupFunc(e) {
    acPreview = acPreview || document.querySelector("#autocomplete-preview");
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
      const inputEl = (
        /**@type {HTMLTextAreaElement}*/
        e.target
      );
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
    acPreview = acPreview || document.querySelector("#autocomplete-preview");
    const emptyPreview = acPreview.children.length === 0;
    const isValidKey = [KEYS.tab, KEYS.enter, KEYS.up, KEYS.down].includes(e.key);
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
    id: "autocomplete",
    label: "autocomplete.label",
    category: "general",
    description: "autocomplete.description",
    turnOn() {
      acPreview = document.querySelector("#autocomplete-preview");
      reset$1();
      originalKeyDownEventHandler = window.QueUp.room.chat.events["keydown #chat-txt-message"];
      const newEventsObject = { ...window.QueUp.room.chat.events };
      delete newEventsObject["keydown #chat-txt-message"];
      window.QueUp.room.chat.delegateEvents(newEventsObject);
      const chatInput = getChatInput();
      chatInput.addEventListener("keydown", chatInputKeydownFunc);
      chatInput.addEventListener("keyup", chatInputKeyupFunc);
      chatInput.addEventListener("click", checkInput);
    },
    turnOff() {
      reset$1();
      window.QueUp.room.chat.events["keydown #chat-txt-message"] = originalKeyDownEventHandler;
      window.QueUp.room.chat.delegateEvents(window.QueUp.room.chat.events);
      const chatInput = getChatInput();
      chatInput.removeEventListener("keydown", chatInputKeydownFunc);
      chatInput.removeEventListener("keyup", chatInputKeyupFunc);
      chatInput.removeEventListener("click", checkInput);
    }
  };
  const MODULE_ID$2 = "custom-mentions";
  function customMentionCheck(e) {
    const enabled = settings.options[MODULE_ID$2];
    const custom = settings.custom[MODULE_ID$2];
    if (enabled && // we only want to play the sound if the message is not from the current user
    window.QueUp.session.id !== e.user.userInfo.userid) {
      const shouldPlaySound = custom.split(",").some(function(v) {
        const reg = new RegExp(`\\b@?${v.trim()}\\b`, "ig");
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
    category: "general",
    custom: {
      title: `${MODULE_ID$2}.modal.title`,
      content: `${MODULE_ID$2}.modal.content`,
      placeholder: `${MODULE_ID$2}.modal.placeholder`,
      maxlength: 255
    },
    turnOn() {
      window.QueUp.Events.bind(CHAT_MESSAGE, customMentionCheck);
    },
    turnOff() {
      window.QueUp.Events.unbind(CHAT_MESSAGE, customMentionCheck);
    }
  };
  const MODULE_ID$1 = "chat-cleaner";
  function cleanChat(limit) {
    const chatMessages = getChatMessages();
    if (!chatMessages?.length || isNaN(limit) || chatMessages.length < limit) {
      return;
    }
    for (let i = 0; i < chatMessages.length - limit; i++) {
      chatMessages[i].remove();
    }
  }
  function onChatMessage() {
    const limit = settings.custom[MODULE_ID$1];
    if (typeof limit === "number") {
      cleanChat(limit);
    } else if (typeof limit === "string" && limit.trim() !== "") {
      const num = parseInt(limit, 10);
      cleanChat(num);
    }
  }
  const chatCleaner = {
    id: MODULE_ID$1,
    label: `${MODULE_ID$1}.label`,
    description: `${MODULE_ID$1}.description`,
    category: "general",
    custom: {
      title: `${MODULE_ID$1}.modal.title`,
      content: `${MODULE_ID$1}.modal.content`,
      placeholder: `${MODULE_ID$1}.modal.placeholder`,
      maxlength: 5,
      validation(val) {
        if (val.trim() === "") return true;
        const num = parseInt(val, 10);
        if (val.includes(".") || isNaN(num) || num < 1) {
          return t(`${MODULE_ID$1}.modal.validation`);
        }
        return true;
      },
      onConfirm: (value) => {
        if (settings.options[MODULE_ID$1]) {
          cleanChat(parseInt(value, 10));
        }
      }
    },
    turnOn() {
      cleanChat(void 0);
      window.QueUp.Events.bind(CHAT_MESSAGE, onChatMessage);
    },
    turnOff() {
      window.QueUp.Events.unbind(CHAT_MESSAGE, onChatMessage);
    }
  };
  const activeTabState = proxy({ isActive: true });
  const onOut = [];
  const onIn = [];
  document.addEventListener("visibilitychange", handleChange);
  window.onpageshow = handleChange;
  window.onpagehide = handleChange;
  window.onfocus = handleChange;
  window.onblur = handleChange;
  if (document.hidden !== void 0) {
    handleChange({ type: document.hidden ? "blur" : "focus" });
  }
  function handleChange(evt) {
    if (activeTabState.isActive && (["blur", "pagehide"].includes(evt.type) || document.hidden)) {
      activeTabState.isActive = false;
      onOut.forEach((fn) => fn());
    } else if (!activeTabState.isActive && (["focus", "pageshow"].includes(evt.type) || !document.hidden)) {
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
      title: t("Notifcation.permission.title"),
      content: t("Notification.permission.denied"),
      open: true
    });
  }
  function notifyCheckPermission() {
    return new Promise((resolve, reject) => {
      if (!("Notification" in window)) {
        updateModalState({
          open: true,
          title: t("Notifcation.permission.title"),
          content: t("Notification.permission.notSupported")
        });
        reject(false);
        return;
      }
      if (Notification.permission === "granted") {
        resolve();
        return;
      }
      if (Notification.permission === "denied") {
        onDenyDismiss();
        reject();
        return;
      }
      Notification.requestPermission().then(function(result) {
        if (result === "denied" || result === "default") {
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
      content: "",
      ignoreActiveTab: false,
      callback: null,
      wait: 1e4
    };
    const options = Object.assign({}, defaults2, opts);
    if (activeTabState.isActive && !options.ignoreActiveTab) {
      return;
    }
    const notificationOptions = {
      body: options.content,
      icon: "https://cdn.jsdelivr.net/gh/DubPlus/DubPlus/images/dubplus.svg"
    };
    const n = new Notification(options.title, notificationOptions);
    n.onclick = function() {
      window.focus();
      if (typeof options.callback === "function") {
        options.callback();
      }
      n.close();
    };
    setTimeout(n.close.bind(n), options.wait);
  }
  function notifyOnMention(e) {
    const content = e.message;
    const user = window.QueUp.session.get("username").toLowerCase();
    let mentionTriggers = ["@" + user];
    if (settings.options["custom-mentions"] && settings.custom["custom-mentions"]) {
      mentionTriggers = mentionTriggers.concat(settings.custom["custom-mentions"].split(",")).map((v) => v.trim());
      mentionTriggers = mentionTriggers.concat(
        mentionTriggers.map((v) => "@" + v)
      );
    }
    const bigRegex = new RegExp(`\\b(${mentionTriggers.join("|")})\\b`, "ig");
    if (bigRegex.test(content) && !activeTabState.isActive && // notifications only if you're not focused on the tab
    window.QueUp.session.id !== e.user.userInfo.userid) {
      showNotification({
        title: `Message from ${e.user.username}`,
        content
      });
    }
  }
  const mentionNotifications = {
    id: "mention-notifications",
    label: "mention-notifications.label",
    description: "mention-notifications.description",
    category: "general",
    turnOn() {
      notifyCheckPermission().then(() => {
        window.QueUp.Events.bind(CHAT_MESSAGE, notifyOnMention);
      }).catch(() => {
        settings.options[this.id] = false;
      });
    },
    turnOff() {
      window.QueUp.Events.unbind(CHAT_MESSAGE, notifyOnMention);
    }
  };
  function pmNotify(e) {
    if (window.QueUp.session.id === e.userid) {
      return;
    }
    showNotification({
      title: t("pm-notifications.notification.title"),
      ignoreActiveTab: true,
      callback: function() {
        const openPmButton = getPrivateMessageButton();
        openPmButton?.click();
        setTimeout(function() {
          const messageItem = getPrivateMessage(e.messageid);
          messageItem?.click();
        }, 500);
      },
      wait: 1e4
    });
  }
  const pmNotifications = {
    id: "pm-notifications",
    label: "pm-notifications.label",
    description: "pm-notifications.description",
    category: "general",
    turnOn() {
      notifyCheckPermission().then(() => {
        window.QueUp.Events.bind(NEW_PM_MESSAGE, pmNotify);
      }).catch(() => {
        settings.options[this.id] = false;
      });
    },
    turnOff() {
      window.QueUp.Events.unbind(NEW_PM_MESSAGE, pmNotify);
    }
  };
  const MODULE_ID = "dj-notification";
  function djNotificationCheck(e) {
    if (e && e.startTime > 2) return;
    setTimeout(() => {
      const quePositionText = getQueuePosition()?.textContent?.trim();
      if (!quePositionText) {
        return;
      }
      const position = parseInt(quePositionText, 10);
      if (isNaN(position)) {
        logError(MODULE_ID, "Could not parse current position:", quePositionText);
        return;
      }
      let parseSetting = parseInt(settings.custom[MODULE_ID], 10);
      if (isNaN(parseSetting)) {
        parseSetting = 2;
        logInfo(MODULE_ID, "Could not parse setting, defaulting to 2");
      }
      const queueTotalText = getQueueTotal()?.textContent?.trim();
      if (queueTotalText === quePositionText && parseSetting === 0 || position === parseSetting) {
        showNotification({
          title: t(`${MODULE_ID}.notification.title`),
          content: t(`${MODULE_ID}.notification.content`),
          ignoreActiveTab: true,
          wait: 1e4
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
    category: "general",
    custom: {
      title: `${MODULE_ID}.modal.title`,
      content: `${MODULE_ID}.modal.content`,
      placeholder: "2",
      defaultValue: "2",
      maxlength: 3,
      validation(val) {
        if (val.trim() === "") return true;
        const num = parseInt(val, 10);
        if (val.includes(".") || isNaN(num) || num < 0) {
          return t(`${MODULE_ID}.modal.validation`);
        }
        return true;
      },
      onConfirm: () => {
        if (settings.options[MODULE_ID]) {
          djNotificationCheck();
        }
      }
    },
    turnOn() {
      notifyCheckPermission().then(() => {
        djNotificationCheck();
        window.QueUp.Events.bind(PLAYLIST_UPDATE, djNotificationCheck);
      });
    },
    turnOff() {
      window.QueUp.Events.unbind(PLAYLIST_UPDATE, djNotificationCheck);
    }
  };
  const dubsState = proxy({ upDubs: [], downDubs: [], grabs: [] });
  function getDubCount(dubType) {
    if (dubType === "updub") return dubsState.upDubs;
    if (dubType === "downdub") return dubsState.downDubs;
    if (dubType === "grab") return dubsState.grabs;
    return [];
  }
  const apiBase = window.location.hostname.includes("staging") ? "https://staging-api.queup.dev" : "https://api.queup.net";
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
      const username = window.QueUp.room.users.collection.findWhere({
        userid
      })?.attributes?._user?.username;
      if (username) {
        resolve(username);
        return;
      }
      fetch(userData(userid)).then((response) => response.json()).then((response) => {
        if (response?.userinfo?.username) {
          const { username: username2 } = response.userinfo;
          resolve(username2);
        } else {
          reject("Failed to get username from API for userid: " + userid);
        }
      }).catch(reject);
    });
  }
  function updateUpdubs(updubs) {
    updubs?.forEach((dub) => {
      if (dubsState.upDubs.find((el) => el.userid === dub.userid)) {
        return;
      }
      getUserName(dub.userid).then((username) => {
        dubsState.upDubs.push({
          userid: dub.userid,
          username
        });
      }).catch((error) => logError("Failed to get username for upDubs:", error));
    });
  }
  function updateDowndubs(downdubs) {
    downdubs?.forEach((dub) => {
      if (dubsState.downDubs.find((el) => el.userid === dub.userid)) {
        return;
      }
      getUserName(dub.userid).then((username) => {
        dubsState.downDubs.push({
          userid: dub.userid,
          username
        });
      }).catch((error) => logError("Failed to get username for downDubs", error));
    });
  }
  function resetDubs() {
    dubsState.downDubs = [];
    dubsState.upDubs = [];
    dubsState.grabs = [];
    const dubsURL = activeDubs(window.QueUp.room.model.id);
    fetch(dubsURL).then((response) => response.json()).then((response) => {
      updateUpdubs(response.data.upDubs);
      if (isMod(window.QueUp.session.id)) {
        updateDowndubs(response.data.downDubs);
      }
    }).catch((error) => logError("Failed to fetch dubs data from API.", error));
  }
  function dubWatcher(e) {
    if (e.dubtype === "updub") {
      if (!dubsState.upDubs.find((el) => el.userid === e.user._id)) {
        dubsState.upDubs.push({
          userid: e.user._id,
          username: e.user.username
        });
      }
      dubsState.downDubs = dubsState.downDubs.filter(
        (el) => el.userid !== e.user._id
      );
    } else if (e.dubtype === "downdub" && isMod(window.QueUp.session.id)) {
      if (!dubsState.downDubs.find((el) => el.userid === e.user._id)) {
        dubsState.downDubs.push({
          userid: e.user._id,
          username: e.user.username
        });
      }
      dubsState.upDubs = dubsState.upDubs.filter(
        (el) => el.userid !== e.user._id
      );
    }
    const msSinceSongStart = Date.now() - window.QueUp.room.player.activeSong.attributes.song.played;
    if (msSinceSongStart < 1e3) {
      return;
    }
    if (dubsState.upDubs.length !== window.QueUp.room.player.activeSong.attributes.song.updubs) {
      resetDubs();
    } else if (isMod(window.QueUp.session.id) && dubsState.downDubs.length !== window.QueUp.room.player.activeSong.attributes.song.downdubs) {
      resetDubs();
    }
  }
  function grabWatcher(e) {
    if (!dubsState.grabs.find((el) => el.userid === e.user._id)) {
      dubsState.grabs.push({
        userid: e.user._id,
        username: e.user.username
      });
    }
  }
  function dubUserLeaveWatcher(e) {
    dubsState.upDubs = dubsState.upDubs.filter((el) => el.userid !== e.user._id);
    dubsState.downDubs = dubsState.downDubs.filter(
      (el) => el.userid !== e.user._id
    );
    dubsState.grabs = dubsState.grabs.filter((el) => el.userid !== e.user._id);
  }
  const showDubsOnHover = {
    id: "dubs-hover",
    label: "dubs-hover.label",
    description: "dubs-hover.description",
    category: "general",
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
    }
  };
  function downdubWatcher(e) {
    const isUserTheDJ = window.QueUp.session.id === window.QueUp.room.player.activeSong.attributes.song.userid;
    if (isUserTheDJ && e.dubtype === "downdub") {
      insertQueupChat(
        "dubplus-chat-system-downdub",
        t("downdubs-in-chat.chat-message", {
          username: e.user.username,
          song_name: window.QueUp.room.player.activeSong.attributes.songInfo.name
        })
      );
    }
  }
  const downdubsInChat = {
    id: "downdubs-in-chat",
    label: "downdubs-in-chat.label",
    description: "downdubs-in-chat.description",
    category: "general",
    modOnly: true,
    turnOn() {
      if (isMod(window.QueUp.session.id)) {
        window.QueUp.Events.bind(DUB, downdubWatcher);
      }
    },
    turnOff() {
      window.QueUp.Events.unbind(DUB, downdubWatcher);
    }
  };
  function updubWatcher(e) {
    const isUserTheDJ = window.QueUp.session.id === window.QueUp.room.player.activeSong.attributes.song.userid;
    if (isUserTheDJ && e.dubtype === "updub") {
      insertQueupChat(
        "dubplus-chat-system-updub",
        t("updubs-in-chat.chat-message", {
          username: e.user.username,
          song_name: window.QueUp.room.player.activeSong.attributes.songInfo.name
        })
      );
    }
  }
  const upDubInChat = {
    id: "updubs-in-chat",
    label: "updubs-in-chat.label",
    description: "updubs-in-chat.description",
    category: "general",
    turnOn() {
      window.QueUp.Events.bind(DUB, updubWatcher);
    },
    turnOff() {
      window.QueUp.Events.unbind(DUB, updubWatcher);
    }
  };
  function grabChatWatcher(e) {
    const isUserTheDJ = window.QueUp.session.id === window.QueUp.room.player.activeSong.attributes.song.userid;
    if (isUserTheDJ) {
      insertQueupChat(
        "dubplus-chat-system-grab",
        t("grabs-in-chat.chat-message", {
          username: e.user.username,
          song_name: window.QueUp.room.player.activeSong.attributes.songInfo.name
        })
      );
    }
  }
  const grabsInChat = {
    id: "grabs-in-chat",
    label: "grabs-in-chat.label",
    description: "grabs-in-chat.description",
    category: "general",
    turnOn() {
      if (!window.QueUp.room.model.get("displayUserGrab")) {
        window.QueUp.Events.bind(
          "realtime:room_playlist-queue-update-grabs",
          grabChatWatcher
        );
      }
    },
    turnOff() {
      if (!window.QueUp.room.model.get("displayUserGrab")) {
        window.QueUp.Events.unbind(
          "realtime:room_playlist-queue-update-grabs",
          grabChatWatcher
        );
      }
    }
  };
  const snow = {
    id: "snow",
    label: "snow.label",
    description: "snow.description",
    category: "general",
    turnOn() {
    },
    turnOff() {
    }
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
        speed: 1
      };
      this.requestAnimFrame = null;
      this.canvas = null;
    }
    makeCanvas() {
      this.canvas = document.createElement("canvas");
      this.canvas.id = "dubPlusRainCanvas";
      this.canvas.style.position = "fixed";
      this.canvas.style.top = "0px";
      this.canvas.style.left = "0px";
      this.canvas.style.zIndex = "100";
      this.canvas.style.pointerEvents = "none";
      document.body.prepend(this.canvas);
    }
    start() {
      this.makeCanvas();
      this.startAnimation();
    }
    stop() {
      this.stopAnimation();
      this.canvas?.remove();
    }
    onWindowResize() {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    }
    startAnimation() {
      const windowAnimFram = window.requestAnimationFrame;
      this.requestAnimFrame = windowAnimFram ? windowAnimFram.bind(window) : null;
      if (!this.canvas) return;
      const ctx = this.canvas.getContext("2d");
      this.width, this.height = 0;
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
          color: "hsla(" + this.controls.color + "," + this.controls.saturation + "%, " + this.controls.lightness + "%," + this.controls.opacity + ")"
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
          color
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
      for (let i = 0, particlesactives; particlesactives = particleslocales[i]; i++) {
        ctx.globalAlpha = particlesactives.alpha;
        ctx.fillStyle = particlesactives.color;
        ctx.fillRect(
          particlesactives.X,
          particlesactives.Y,
          particlesactives.speedY / 4,
          particlesactives.speedY
        );
      }
      for (let i = 0, dropsactives; dropsactives = dropslocales[i]; i++) {
        ctx.globalAlpha = dropsactives.alpha;
        ctx.fillStyle = dropsactives.color;
        ctx.beginPath();
        ctx.arc(dropsactives.X, dropsactives.Y, dropsactives.radius, 0, tau);
        ctx.fill();
      }
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.restore();
    }
    update() {
      const particleslocales = this.particles;
      const dropslocales = this.drops;
      for (let i2 = 0, particlesactives; particlesactives = particleslocales[i2]; i2++) {
        particlesactives.X += particlesactives.speedX;
        particlesactives.Y += particlesactives.speedY + 5;
        if (particlesactives.Y > this.height - 15) {
          particleslocales.splice(i2--, 1);
          this.explosion(
            particlesactives.X,
            particlesactives.Y,
            particlesactives.color
          );
        }
      }
      for (let i2 = 0, dropsactives; dropsactives = dropslocales[i2]; i2++) {
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
      this.requestAnimFrame = function() {
      };
    }
  }
  const rain = {
    id: "rain",
    label: "rain.label",
    description: "rain.description",
    category: "general",
    turnOn() {
      this.rainEffect = new RainEffect();
      this.rainEffect.start();
    },
    turnOff() {
      this.rainEffect.stop();
      delete this.rainEffect;
    }
  };
  var root$d = /* @__PURE__ */ from_svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M448 344v112a23.9 23.9 0 0 1 -24 24H312c-21.4 0-32.1-25.9-17-41l36.2-36.2L224 295.6 116.8 402.9 153 439c15.1 15.1 4.4 41-17 41H24a23.9 23.9 0 0 1 -24-24V344c0-21.4 25.9-32.1 41-17l36.2 36.2L184.5 256 77.2 148.7 41 185c-15.1 15.1-41 4.4-41-17V56a23.9 23.9 0 0 1 24-24h112c21.4 0 32.1 25.9 17 41l-36.2 36.2L224 216.4l107.2-107.3L295 73c-15.1-15.1-4.4-41 17-41h112a23.9 23.9 0 0 1 24 24v112c0 21.4-25.9 32.1-41 17l-36.2-36.2L263.5 256l107.3 107.3L407 327.1c15.1-15.2 41-4.5 41 16.9z"></path></svg>`);
  function IconFullscreen($$anchor) {
    var svg = root$d();
    append($$anchor, svg);
  }
  const fullscreen = {
    id: "fullscreen",
    label: "fullscreen.label",
    description: "fullscreen.description",
    category: "user-interface",
    altIcon: IconFullscreen,
    onClick() {
      const elem = getPlayerIframe();
      if (!elem) {
        logInfo("Fullscreen: No video element found");
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
    }
  };
  const splitChat = {
    id: "split-chat",
    label: "split-chat.label",
    description: "split-chat.description",
    category: "user-interface",
    turnOn() {
      document.body.classList.add("dubplus-split-chat");
    },
    turnOff() {
      document.body.classList.remove("dubplus-split-chat");
    }
  };
  const hideChat = {
    id: "hide-chat",
    label: "hide-chat.label",
    description: "hide-chat.description",
    category: "user-interface",
    turnOn() {
      document.body.classList.add("dubplus-video-only");
    },
    turnOff() {
      document.body.classList.remove("dubplus-video-only");
    }
  };
  const hideVideo = {
    id: "hide-video",
    label: "hide-video.label",
    description: "hide-video.description",
    category: "user-interface",
    turnOn() {
      document.body.classList.add("dubplus-chat-only");
    },
    turnOff() {
      document.body.classList.remove("dubplus-chat-only");
    }
  };
  const hideAvatars = {
    id: "hide-avatars",
    label: "hide-avatars.label",
    description: "hide-avatars.description",
    category: "user-interface",
    turnOn() {
      document.body.classList.add("dubplus-hide-avatars");
    },
    turnOff() {
      document.body.classList.remove("dubplus-hide-avatars");
    }
  };
  const hideBackground = {
    id: "hide-bg",
    label: "hide-bg.label",
    description: "hide-bg.description",
    category: "user-interface",
    turnOn() {
      document.body.classList.add("dubplus-hide-bg");
    },
    turnOff() {
      document.body.classList.remove("dubplus-hide-bg");
    }
  };
  const showTimestamps = {
    id: "show-timestamps",
    label: "show-timestamps.label",
    description: "show-timestamps.description",
    category: "user-interface",
    turnOn() {
      document.body.classList.add("dubplus-show-timestamp");
    },
    turnOff() {
      document.body.classList.remove("dubplus-show-timestamp");
    }
  };
  function handleMute(e) {
    const tag = (
      /**@type {HTMLElement}*/
      e.target.tagName.toLowerCase()
    );
    if (e.key === " " && tag !== "input" && tag !== "textarea") {
      window.QueUp.room.player.mutePlayer();
    }
  }
  const spacebarMute = {
    id: "spacebar-mute",
    label: "spacebar-mute.label",
    description: "spacebar-mute.description",
    category: "settings",
    turnOn() {
      document.addEventListener("keypress", handleMute);
    },
    turnOff() {
      document.removeEventListener("keypress", handleMute);
    }
  };
  function unloader(e) {
    let confirmationMessage = "You are leaving";
    e.returnValue = confirmationMessage;
    return confirmationMessage;
  }
  const warnOnNavigation = {
    id: "warn-redirect",
    label: "warn-redirect.label",
    description: "warn-redirect.description",
    category: "settings",
    turnOn() {
      window.addEventListener("beforeunload", unloader);
    },
    turnOff() {
      window.removeEventListener("beforeunload", unloader);
    }
  };
  const name = "dubplus";
  const version = "4.1.2";
  const description = "Dub+ - A simple script/extension for QueUp.net";
  const license = "MIT";
  const homepage = "https://dub.plus";
  const pkg = {
    name,
    version,
    description,
    license,
    homepage
  };
  const CDN_ROOT = "//cdn.jsdelivr.net/gh/DubPlus";
  const makeLink = function(className, fileName) {
    const link2 = document.createElement("link");
    link2.rel = "stylesheet";
    link2.type = "text/css";
    link2.className = className;
    link2.href = fileName;
    return link2;
  };
  function link(cssFile, className, specificVersion = "") {
    cssFile = cssFile.replace(/^\//, "");
    return new Promise((resolve, reject) => {
      document.querySelector(`link.${className}`)?.remove();
      const cacheBuster = pkg.version;
      let cdnPath = "DubPlus";
      if (specificVersion) {
        cdnPath += `@${specificVersion}`;
      }
      const link2 = makeLink(
        className,
        `${CDN_ROOT}/${cdnPath}/${cssFile}?${cacheBuster}`
      );
      link2.onload = () => resolve();
      link2.onerror = reject;
      document.head.appendChild(link2);
    });
  }
  function style(cssFile, id) {
    document.querySelector(`style#${id}`)?.remove();
    return fetch(cssFile).then((res) => res.text()).then((css) => {
      const style2 = document.createElement("style");
      style2.id = id;
      style2.textContent = css;
      document.head.appendChild(style2);
    });
  }
  async function loadDubPlusCSSforBookmarklet() {
    let version2 = "";
    const branch2 = "master"?.trim();
    if (branch2 && branch2 !== "main" && branch2 !== "master") {
      version2 = branch2;
    } else if (!branch2 || branch2 === "main" || branch2 === "master") {
      version2 = pkg.version;
    }
    try {
      await link("/dubplus.css", "dubplus-css", version2);
      return;
    } catch (e) {
      logError(`Failed to load dubplus.css at version @${version2}`, e);
    }
    try {
      await link("/dubplus.css", "dubplus-css", "latest");
    } catch (e) {
      logError("Failed to load dubplus.css", e);
    }
  }
  const LINK_ELEM_ID$1 = "dubplus-community-css";
  const communityTheme = {
    id: "community-theme",
    label: "community-theme.label",
    description: "community-theme.description",
    category: "customize",
    turnOn() {
      const location = window.QueUp.room.model.get("roomUrl");
      fetch(`https://api.queup.net/room/${location}`).then((response) => response.json()).then((e) => {
        const content = e.data.description;
        const themeCheck = new RegExp(
          /(@dub(x|plus|\+)=)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/,
          "i"
        );
        let community = null;
        content.replace(themeCheck, function(match, p1, p2, p3) {
          community = p3;
        });
        if (!community) {
          logInfo("No community CSS theme found");
          return;
        }
        logInfo("loading community css theme from:", community);
        return style(community, LINK_ELEM_ID$1);
      }).catch((error) => {
        logError("Community CSS: Failed to load room info", error);
      });
    },
    turnOff() {
      document.getElementById(LINK_ELEM_ID$1)?.remove();
    }
  };
  const LINK_ELEM_ID = "dubplus-user-custom-css";
  const customCss = {
    id: "custom-css",
    label: "custom-css.label",
    description: "custom-css.description",
    category: "customize",
    custom: {
      title: "custom-css.modal.title",
      content: "custom-css.modal.content",
      placeholder: "custom-css.modal.placeholder",
      maxlength: 500,
      validation(value) {
        if (value.trim() === "") return true;
        if (!/^http.+\.css$/.test(value)) {
          return t("custom-css.modal.validation");
        }
        return true;
      },
      onConfirm(value) {
        if (!value) {
          document.getElementById(LINK_ELEM_ID)?.remove();
          settings.options[customCss.id] = false;
          return;
        } else {
          style(value, LINK_ELEM_ID).catch((e) => {
            logError("Error loading custom css file:", e);
          });
        }
      }
    },
    turnOn() {
      if (settings.custom[this.id]) {
        style(settings.custom[this.id], LINK_ELEM_ID).catch((e) => {
          logError("Error loading custom css file:", e);
        });
      }
    },
    turnOff() {
      document.getElementById(LINK_ELEM_ID)?.remove();
    }
  };
  function addCustomBG(url) {
    const img = getBackgroundImage();
    if (img) {
      img.setAttribute("data-original", img.src);
      img.src = url;
    }
  }
  function removeCustomBG() {
    const img = getBackgroundImage();
    if (img && img.hasAttribute("data-original")) {
      img.src = img.getAttribute("data-original");
      img.removeAttribute;
    }
  }
  const customBackground = {
    id: "custom-bg",
    label: "custom-bg.label",
    description: "custom-bg.description",
    category: "customize",
    custom: {
      title: "custom-bg.modal.title",
      content: "custom-bg.modal.content",
      placeholder: "custom-bg.modal.placeholder",
      maxlength: 500,
      validation(value) {
        if (value.trim() === "") return true;
        if (!value.startsWith("http")) {
          return t("custom-bg.modal.validation");
        }
        return true;
      },
      onConfirm(value) {
        removeCustomBG();
        if (!value) {
          return;
        }
        addCustomBG(value);
      }
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
    }
  };
  let DubtrackDefaultSound;
  const customNotificationSound = {
    id: "custom-notification-sound",
    label: "custom-notification-sound.label",
    description: "custom-notification-sound.description",
    category: "customize",
    custom: {
      title: "custom-notification-sound.modal.title",
      content: "custom-notification-sound.modal.content",
      placeholder: "custom-notification-sound.modal.placeholder",
      maxlength: 500,
      validation(value) {
        if (value.trim() === "") return true;
        if (!window.soundManager.canPlayURL(value)) {
          return t("custom-notification-sound.modal.validation");
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
      }
    },
    turnOn() {
      DubtrackDefaultSound = window.QueUp.room.chat.mentionChatSound.url;
      if (settings.custom[this.id]) {
        window.QueUp.room.chat.mentionChatSound.url = settings.custom[this.id];
      }
    },
    turnOff() {
      window.QueUp.room.chat.mentionChatSound.url = DubtrackDefaultSound;
    }
  };
  const flipInterface = {
    id: "flip-interface",
    label: "flip-interface.label",
    description: "flip-interface.description",
    category: "user-interface",
    turnOn() {
      document.body.classList.add("dubplus-flip-interface");
    },
    turnOff() {
      document.body.classList.remove("dubplus-flip-interface");
    }
  };
  let timer = null;
  function onTimerExpired() {
    if (!settings.options.afk) {
      logInfo("auto-afk timer expired, enabling afk");
      const afkSwitch = document.querySelector("#dubplus-afk [role=switch]");
      afkSwitch?.click();
    } else {
      logInfo("auto-afk timer expired, but afk is already enabled");
    }
  }
  function onBlur() {
    let userTime = parseInt(settings.custom["auto-afk"], 10);
    if (isNaN(userTime)) {
      userTime = 30;
    }
    logInfo("auto-afk onBlur: starting timer for ", userTime, "minutes");
    timer = setTimeout(onTimerExpired, userTime * 60 * 1e3);
  }
  function onFocus() {
    if (timer) {
      logInfo("auto-afk onFocus: clearing timer");
      clearTimeout(timer);
      timer = null;
    } else {
      logInfo("auto-afk onFocus: no timer to clear");
    }
  }
  const autoAfk = {
    id: "auto-afk",
    label: "auto-afk.label",
    description: "auto-afk.description",
    category: "general",
    turnOn() {
      registerVisibilityChangeListeners(onFocus, onBlur);
    },
    turnOff() {
      unRegisterVisibilityChangeListeners(onFocus, onBlur);
      onFocus();
    },
    custom: {
      title: "auto-afk.modal.title",
      content: "auto-afk.modal.content",
      placeholder: "30",
      defaultValue: "30",
      maxlength: 10,
      validation(value) {
        if (value.trim() === "") return true;
        const num = parseInt(value, 10);
        if (value.includes(".") || isNaN(num) || num < 1) {
          return t(`auto-afk.modal.validation`);
        }
        return true;
      }
    }
  };
  function onGrab(e) {
    if (e.user._id === window.QueUp.session.id) {
      const message = settings.custom["grab-response"];
      if (message) {
        sendChatMessage(message);
      }
    }
  }
  const grabResponse = {
    id: "grab-response",
    label: "grab-response.label",
    description: "grab-response.description",
    category: "general",
    turnOn() {
      window.QueUp.Events.bind(GRAB, onGrab);
    },
    turnOff() {
      window.QueUp.Events.unbind(GRAB, onGrab);
    },
    custom: {
      title: "grab-response.modal.title",
      content: "grab-response.modal.content",
      placeholder: "grab-response.modal.placeholder",
      maxlength: 255
    }
  };
  const COLLAPSED = "dubplus-collapsed";
  const COLLAPSIBLE = "dubplus-collapsible-image";
  const COLLAPSER = "dubplus-collapser";
  const IMAGE_CONTAINER = "autolink-image";
  function handleCollapseButtonClick(button) {
    const imageContainer = (
      /**@type {HTMLAnchorElement}*/
      button.parentElement
    );
    const image = imageContainer.querySelector("img");
    if (!imageContainer.classList.contains(COLLAPSED)) {
      imageContainer.classList.add(COLLAPSED);
      button.title = "expand image";
      image.setAttribute("aria-hidden", "true");
      button.setAttribute("aria-expanded", "false");
    } else {
      imageContainer.classList.remove(COLLAPSED);
      button.title = "collapse image";
      image.setAttribute("aria-hidden", "false");
      button.setAttribute("aria-expanded", "true");
    }
  }
  function eventDelegatorHandler(event2) {
    if (event2.target instanceof HTMLButtonElement && event2.target.classList.contains(COLLAPSER)) {
      event2.stopPropagation();
      event2.preventDefault();
      handleCollapseButtonClick(event2.target);
    }
  }
  function addCollapserToImage(autolinkImage) {
    if (!autolinkImage) return;
    if (!autolinkImage.classList.contains(COLLAPSIBLE)) {
      autolinkImage.classList.add(COLLAPSIBLE);
      const button = document.createElement("button");
      button.type = "button";
      button.title = "collapse image";
      button.setAttribute("aria-expanded", "true");
      button.classList.add(COLLAPSER);
      autolinkImage.appendChild(button);
    }
  }
  function processAllChatMessages() {
    const chatImages = getImagesInChat();
    chatImages.forEach(addCollapserToImage);
  }
  function reset() {
    document.querySelectorAll(`.${COLLAPSIBLE}`).forEach((el) => {
      el.classList.remove(COLLAPSIBLE, COLLAPSED);
    });
    document.querySelectorAll(`.${COLLAPSER}`).forEach((el) => {
      el.remove();
    });
    getImagesInChat().forEach((el) => el.removeAttribute("aria-hidden"));
  }
  function findUnProcessedImages(container2) {
    const images = container2.querySelectorAll(`.${IMAGE_CONTAINER}`);
    return Array.from(images).filter((el) => !el.classList.contains(COLLAPSIBLE));
  }
  function observerCallback(mutations) {
    for (const mutation of mutations) {
      if (mutation.type === "childList" && mutation.target.nodeType === Node.ELEMENT_NODE) {
        const el = (
          /** @type {HTMLElement} */
          mutation.target
        );
        if (el.classList.contains("text")) {
          const autoLinks = findUnProcessedImages(el);
          autoLinks.forEach(addCollapserToImage);
        }
      }
    }
  }
  let observer = null;
  const collapsibleImages = {
    id: "collapsible-images",
    label: "collapsible-images.label",
    description: "collapsible-images.description",
    category: "general",
    turnOn() {
      observer = new MutationObserver(observerCallback);
      waitFor(() => {
        return Boolean(getChatContainer());
      }).then(() => {
        const chatContainer = getChatContainer();
        if (chatContainer) {
          chatContainer.addEventListener("click", eventDelegatorHandler);
          observer.observe(chatContainer, {
            childList: true,
            subtree: true,
            attributes: false
          });
        } else {
          logError("Collapsible Images: No chat container found");
        }
      });
      waitFor(() => {
        return Boolean(getImagesInChat().length);
      }).then(() => {
        processAllChatMessages();
      });
    },
    turnOff() {
      if (observer) {
        observer.disconnect();
      }
      getChatContainer()?.removeEventListener("click", eventDelegatorHandler);
      reset();
    }
  };
  var root$c = /* @__PURE__ */ from_svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M504.3 273.6c4.9-4.5 7.7-10.9 7.7-17.6s-2.8-13-7.7-17.6l-112-104c-7-6.5-17.2-8.2-25.9-4.4s-14.4 12.5-14.4 22l0 56-192 0 0-56c0-9.5-5.7-18.2-14.4-22s-18.9-2.1-25.9 4.4l-112 104C2.8 243 0 249.3 0 256s2.8 13 7.7 17.6l112 104c7 6.5 17.2 8.2 25.9 4.4s14.4-12.5 14.4-22l0-56 192 0 0 56c0 9.5 5.7 18.2 14.4 22s18.9 2.1 25.9-4.4l112-104z"></path></svg>`);
  function IconLeftRight($$anchor) {
    var svg = root$c();
    append($$anchor, svg);
  }
  const pinMenu = {
    id: "pin-menu",
    label: "pin-menu.label",
    description: "pin-menu.description",
    category: "user-interface",
    turnOn() {
      const side = settings.custom[this.id] || "right";
      document.body.classList.add(`dubplus-pin-menu-${side}`);
    },
    turnOff() {
      document.body.classList.remove("dubplus-pin-menu-left");
      document.body.classList.remove("dubplus-pin-menu-right");
    },
    secondaryAction: {
      description: "pin-menu.secondaryAction.description",
      icon: IconLeftRight,
      onClick: () => {
        const currentSide = settings.custom[pinMenu.id] || "right";
        const side = currentSide === "left" ? "right" : "left";
        document.body.classList.toggle("dubplus-pin-menu-left", side === "left");
        document.body.classList.toggle(
          "dubplus-pin-menu-right",
          side === "right"
        );
        saveSetting("custom", pinMenu.id, side);
      }
    }
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
    rain
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
    pinMenu
  ];
  const settingsModules = [spacebarMute, warnOnNavigation];
  const customize = [
    communityTheme,
    customCss,
    customBackground,
    customNotificationSound
  ];
  var root$b = /* @__PURE__ */ from_html(`<!> <!>`, 1);
  function General($$anchor, $$props) {
    push($$props, false);
    init();
    var fragment = root$b();
    var node = first_child(fragment);
    {
      let $0 = /* @__PURE__ */ derived_safe_equal(() => t("general.title"));
      MenuHeader(node, {
        settingsId: "general",
        get name() {
          return get($0);
        }
      });
    }
    var node_1 = sibling(node, 2);
    MenuSection(node_1, {
      settingsId: "general",
      children: ($$anchor2, $$slotProps) => {
        var fragment_1 = comment();
        var node_2 = first_child(fragment_1);
        each(node_2, 1, () => general, (module) => module.id, ($$anchor3, module) => {
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
            }
          });
        });
        append($$anchor2, fragment_1);
      }
    });
    append($$anchor, fragment);
    pop();
  }
  var root$a = /* @__PURE__ */ from_html(`<button id="dubplus-eta" type="button" class="icon-history eta_tooltip_t dubplus-btn-player"></button>`);
  function Eta($$anchor, $$props) {
    push($$props, true);
    let eta = /* @__PURE__ */ state("ETA");
    function getEta() {
      const booth_position = getQueuePosition()?.textContent;
      if (!booth_position) {
        return t("Eta.tooltip.notInQueue");
      }
      const average_song_minutes = 4;
      const current_time = parseInt(getCurrentSongMinutes()?.textContent);
      const position_in_queue = parseInt(booth_position);
      const booth_time = position_in_queue * average_song_minutes - average_song_minutes + current_time;
      if (booth_time >= 0) {
        return t("Eta.tootltip", { minutes: booth_time });
      } else {
        return t("Eta.tooltip.notInQueue");
      }
    }
    var button = root$a();
    action(button, ($$node, $$action_arg) => teleport?.($$node, $$action_arg), () => ({ to: PLAYER_SHARING_CONTAINER }));
    template_effect(() => {
      set_attribute(button, "aria-label", get(eta));
      set_attribute(button, "data-dp-tooltip", get(eta));
    });
    event("mouseenter", button, () => {
      set(eta, getEta(), true);
    });
    append($$anchor, button);
    pop();
  }
  var root$9 = /* @__PURE__ */ from_html(`<button id="dubplus-snooze" type="button" class="icon-mute snooze_btn dubplus-btn-player svelte-6crmqc"><span class="svelte-6crmqc">1</span></button>`);
  function Snooze($$anchor, $$props) {
    push($$props, true);
    let tooltip = /* @__PURE__ */ state(proxy(t("Snooze.tooltip")));
    const eventUtils = { currentVol: 50, snoozed: false };
    function revert() {
      window.QueUp.room.player.setVolume(eventUtils.currentVol);
      window.QueUp.room.player.updateVolumeBar();
      eventUtils.snoozed = false;
      set(tooltip, t("Snooze.tooltip"), true);
      window.QueUp.Events.unbind(PLAYLIST_UPDATE, eventSongAdvance);
    }
    function eventSongAdvance(e) {
      if (e.startTime < 2 && eventUtils.snoozed) {
        revert();
        return true;
      }
    }
    function snooze() {
      if (!eventUtils.snoozed && !window.QueUp.room.player.muted_player && window.QueUp.playerController.volume > 2) {
        set(tooltip, t("Snooze.tooltip.undo"), true);
        eventUtils.currentVol = window.QueUp.playerController.volume;
        window.QueUp.room.player.mutePlayer();
        eventUtils.snoozed = true;
        window.QueUp.Events.bind(PLAYLIST_UPDATE, eventSongAdvance);
      } else if (eventUtils.snoozed) {
        revert();
      }
    }
    var button = root$9();
    button.__click = snooze;
    action(button, ($$node, $$action_arg) => teleport?.($$node, $$action_arg), () => ({ to: PLAYER_SHARING_CONTAINER }));
    template_effect(() => {
      set_attribute(button, "aria-label", get(tooltip));
      set_attribute(button, "data-dp-tooltip", get(tooltip));
    });
    append($$anchor, button);
    pop();
  }
  delegate(["click"]);
  var root_1 = /* @__PURE__ */ from_html(`<li><div class="ac-image svelte-pc9dza"><img class="svelte-pc9dza"/></div></li>`);
  var root$8 = /* @__PURE__ */ from_html(`<div><div class="ac-header svelte-pc9dza"><span class="sr-only"> </span> <div class="tip-container" aria-hidden="true"><span class="tip-navigate"><key class="icon-upvote"></key> &amp; <key class="icon-downvote"></key> </span> <span class="tip-complete"><key>TAB</key> or <key>ENTER</key> </span> <span class="tip-close"><key>ESC</key> </span></div></div> <ul id="autocomplete-preview" class="svelte-pc9dza"></ul> <span class="ac-text-preview svelte-pc9dza"> </span></div>`);
  function EmojiPreview($$anchor, $$props) {
    push($$props, true);
    user_effect(() => {
      if (emojiState.emojiList.length > 0 && typeof emojiState.selectedIndex === "number") {
        const selected = document.querySelector(".preview-item.selected");
        if (selected) {
          selected.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
        }
      }
    });
    function handleClick(index) {
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
    each(ul, 23, () => emojiState.emojiList, ({ src, text: text2, platform, alt }) => src + platform, ($$anchor2, $$item, i) => {
      let src = () => get($$item).src;
      let text2 = () => get($$item).text;
      let platform = () => get($$item).platform;
      let alt = () => get($$item).alt;
      var li = root_1();
      let classes_1;
      li.__click = () => handleClick(get(i));
      var div_3 = child(li);
      var img = child(div_3);
      template_effect(() => {
        classes_1 = set_class(li, 1, `preview-item ${platform()}-previews`, "svelte-pc9dza", classes_1, { selected: get(i) === emojiState.selectedIndex });
        set_attribute(li, "title", text2());
        set_attribute(img, "src", src());
        set_attribute(img, "alt", alt());
        set_attribute(img, "title", alt());
      });
      append($$anchor2, li);
    });
    var span_4 = sibling(ul, 2);
    var text_5 = child(span_4);
    action(div, ($$node, $$action_arg) => teleport?.($$node, $$action_arg), () => ({ to: CHAT_INPUT_CONTAINER, position: "prepend" }));
    template_effect(
      ($0, $1, $2, $3) => {
        classes = set_class(div, 1, "ac-preview-container svelte-pc9dza", null, classes, { "ac-show": emojiState.emojiList.length > 0 });
        set_text(text_1, $0);
        set_text(text_2, ` (${$1 ?? ""})`);
        set_text(text_3, ` (${$2 ?? ""})`);
        set_text(text_4, ` (${$3 ?? ""})`);
        set_text(text_5, emojiState.emojiList[emojiState.selectedIndex]?.text);
      },
      [
        () => t("autocomplete.preview.a11y"),
        () => t("autocomplete.preview.navigate"),
        () => t("autocomplete.preview.select"),
        () => t("autocomplete.preview.close")
      ]
    );
    append($$anchor, div);
    pop();
  }
  delegate(["click"]);
  var root_2$1 = /* @__PURE__ */ from_html(`<li class="preview-dubinfo-item users-previews svelte-p3efhm"><div class="dubinfo-image svelte-p3efhm"><img alt="User Avatar" class="svelte-p3efhm"/></div> <button type="button" class="dubinfo-text svelte-p3efhm"> </button></li>`);
  var root_3 = /* @__PURE__ */ from_html(`<li><!></li>`);
  var root$7 = /* @__PURE__ */ from_html(`<div role="none"><ul id="dubinfo-preview"><!></ul></div>`);
  function DubsInfo($$anchor, $$props) {
    push($$props, true);
    let dubData = /* @__PURE__ */ user_derived(() => getDubCount($$props.dubType));
    let positionRight = /* @__PURE__ */ state(0);
    let positionBottom = /* @__PURE__ */ state(0);
    let display = /* @__PURE__ */ state("none");
    function getTarget() {
      if ($$props.dubType === "updub") {
        return getDubUp()?.parentElement;
      } else if ($$props.dubType === "downdub") {
        return getDubDown()?.parentElement;
      } else if ($$props.dubType === "grab") {
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
        set(display, "block");
      } else {
        logError(`Could not find hover target for ${$$props.dubType} in onHover`);
      }
    }
    function onLeave(e) {
      if (e.relatedTarget && /**@type {HTMLDivElement}*/
      e.relatedTarget.closest(".dubplus-dubs-container")) {
        return;
      }
      set(display, "none");
    }
    onMount(() => {
      const hoverTarget = getTarget();
      if (hoverTarget) {
        hoverTarget.addEventListener("mouseenter", onHover);
        hoverTarget.addEventListener("mouseleave", onLeave);
      } else {
        logError(`Could not find hover target for ${$$props.dubType} in onMount`);
      }
    });
    onDestroy(() => {
      const hoverTarget = getTarget();
      if (hoverTarget) {
        hoverTarget.removeEventListener("mouseenter", onHover);
        hoverTarget.removeEventListener("mouseleave", onLeave);
      } else {
        logError(`Could not find hover target for ${$$props.dubType} in onDestroy`);
      }
    });
    function handleClick(username) {
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
        each(node_1, 17, () => get(dubData), (dub) => dub.userid, ($$anchor3, dub) => {
          var li = root_2$1();
          var div_1 = child(li);
          var img = child(div_1);
          var button = sibling(div_1, 2);
          button.__click = () => handleClick(get(dub).username);
          var text2 = child(button);
          template_effect(
            ($0) => {
              set_attribute(img, "src", $0);
              set_text(text2, `@${get(dub).username ?? ""}`);
            },
            [() => userImage(get(dub).userid)]
          );
          append($$anchor3, li);
        });
        append($$anchor2, fragment);
      };
      var alternate_1 = ($$anchor2) => {
        var li_1 = root_3();
        var node_2 = child(li_1);
        {
          var consequent_1 = ($$anchor3) => {
            var text_1 = text();
            template_effect(($0) => set_text(text_1, $0), [() => t("dubs-hover.no-votes", { dubType: $$props.dubType })]);
            append($$anchor3, text_1);
          };
          var alternate = ($$anchor3) => {
            var text_2 = text();
            template_effect(($0) => set_text(text_2, $0), [() => t("dubs-hover.no-grabs", { dubType: $$props.dubType })]);
            append($$anchor3, text_2);
          };
          if_block(node_2, ($$render) => {
            if ($$props.dubType === "updub" || $$props.dubType === "downdub") $$render(consequent_1);
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
    action(div, ($$node, $$action_arg) => teleport?.($$node, $$action_arg), () => ({ to: "body" }));
    template_effect(() => {
      set_attribute(div, "id", `dubplus-${$$props.dubType}s-container`);
      set_class(div, 1, `dubplus-dubs-container dubplus-${$$props.dubType}s-container`, "svelte-p3efhm");
      set_style(div, `bottom: ${get(positionBottom)}px; right: ${get(positionRight)}px; display: ${get(display)};`);
      classes = set_class(ul, 1, "dubinfo-show svelte-p3efhm", null, classes, { "dubplus-no-dubs": get(dubData).length === 0 });
    });
    event("mouseleave", div, () => set(display, "none"));
    append($$anchor, div);
    pop();
  }
  delegate(["click"]);
  const SNOWFLAKES_COUNT = 200;
  let snowflakesCount = SNOWFLAKES_COUNT;
  let baseCSS = "";
  const pageHeightVh = 100;
  function getSnowConatiner() {
    return document.getElementById("snow-container");
  }
  function getSnowAttributes() {
    const snowWrapper = getSnowConatiner();
    snowflakesCount = Number(snowWrapper?.dataset?.count || snowflakesCount);
  }
  function generateSnow(snowDensity = 200) {
    snowDensity -= 1;
    const snowWrapper = getSnowConatiner();
    snowWrapper.replaceChildren();
    for (let i = 0; i < snowDensity; i++) {
      let board = document.createElement("div");
      board.className = "snowflake";
      snowWrapper.appendChild(board);
    }
  }
  function getOrCreateCSSElement() {
    let cssElement = document.getElementById("psjs-css");
    if (cssElement) return cssElement;
    cssElement = document.createElement("style");
    cssElement.id = "psjs-css";
    document.head.appendChild(cssElement);
    return cssElement;
  }
  function addCSS(rule = "") {
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
    let snowflakeName = "snowflake";
    let rule = baseCSS;
    for (let i = 1; i < snowDensity; i++) {
      let randomX = Math.random() * 100;
      let randomOffset = Math.random() * 10;
      let randomXEnd = randomX + randomOffset;
      let randomXEndYoyo = randomX + randomOffset / 2;
      let randomYoyoTime = getRandomArbitrary(0.3, 0.8);
      let randomYoyoY = randomYoyoTime * pageHeightVh;
      let randomScale = Math.random();
      let fallDuration = randomIntRange(10, pageHeightVh / 10 * 3);
      let fallDelay = randomInt(pageHeightVh / 10 * 3) * -1;
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
  var root$6 = /* @__PURE__ */ from_html(`<div id="snow-container" class="svelte-11q6bur"></div>`);
  function Snow($$anchor, $$props) {
    push($$props, false);
    onMount(() => {
      createSnow();
      window.addEventListener("resize", createSnow);
    });
    onDestroy(() => {
      window.removeEventListener("resize", createSnow);
    });
    init();
    var div = root$6();
    action(div, ($$node, $$action_arg) => teleport?.($$node, $$action_arg), () => ({ to: "body" }));
    append($$anchor, div);
    pop();
  }
  var root$5 = /* @__PURE__ */ from_html(`<li class="svelte-1oc77ts"><button type="button" class="svelte-1oc77ts"><!> <span class="dubplus-menu-label svelte-1oc77ts"> </span></button></li>`);
  function MenuAction($$anchor, $$props) {
    push($$props, true);
    onMount(() => {
      if ($$props.init) $$props.init();
    });
    var li = root$5();
    var button = child(li);
    button.__click = function(...$$args) {
      $$props.onClick?.apply(this, $$args);
    };
    var node = child(button);
    component(node, () => $$props.icon, ($$anchor2, Icon_1) => {
      Icon_1($$anchor2, {});
    });
    var span = sibling(node, 2);
    var text2 = child(span);
    template_effect(
      ($0, $1, $2) => {
        set_attribute(li, "id", $$props.id);
        set_attribute(li, "title", $0);
        set_attribute(button, "aria-label", $1);
        set_text(text2, $2);
      },
      [
        () => t($$props.description),
        () => t($$props.description),
        () => t($$props.label)
      ]
    );
    append($$anchor, li);
    pop();
  }
  delegate(["click"]);
  var root$4 = /* @__PURE__ */ from_html(`<!> <!>`, 1);
  function UserInterface($$anchor, $$props) {
    push($$props, false);
    init();
    var fragment = root$4();
    var node = first_child(fragment);
    {
      let $0 = /* @__PURE__ */ derived_safe_equal(() => t("user-interface.title"));
      MenuHeader(node, {
        settingsId: "user-interface",
        get name() {
          return get($0);
        }
      });
    }
    var node_1 = sibling(node, 2);
    MenuSection(node_1, {
      settingsId: "user-interface",
      children: ($$anchor2, $$slotProps) => {
        var fragment_1 = comment();
        var node_2 = first_child(fragment_1);
        each(node_2, 1, () => userInterface, (module) => module.id, ($$anchor3, module) => {
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
                }
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
                }
              });
            };
            if_block(node_3, ($$render) => {
              if (get(module).altIcon) $$render(consequent);
              else $$render(alternate, false);
            });
          }
          append($$anchor3, fragment_2);
        });
        append($$anchor2, fragment_1);
      }
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
        $$_import_settings($$_import_settings().options[module.id] = false);
      }
    });
    init();
    var fragment = root$3();
    var node = first_child(fragment);
    {
      let $0 = /* @__PURE__ */ derived_safe_equal(() => t("settings.title"));
      MenuHeader(node, {
        settingsId: "settings",
        get name() {
          return get($0);
        }
      });
    }
    var node_1 = sibling(node, 2);
    MenuSection(node_1, {
      settingsId: "settings",
      children: ($$anchor2, $$slotProps) => {
        var fragment_1 = comment();
        var node_2 = first_child(fragment_1);
        each(node_2, 1, () => settingsModules, (module) => module.id, ($$anchor3, module) => {
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
            }
          });
        });
        append($$anchor2, fragment_1);
      }
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
      let $0 = /* @__PURE__ */ derived_safe_equal(() => t("customize.title"));
      MenuHeader(node, {
        settingsId: "customize",
        get name() {
          return get($0);
        }
      });
    }
    var node_1 = sibling(node, 2);
    MenuSection(node_1, {
      settingsId: "customize",
      children: ($$anchor2, $$slotProps) => {
        var fragment_1 = comment();
        var node_2 = first_child(fragment_1);
        each(node_2, 1, () => customize, (module) => module.id, ($$anchor3, module) => {
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
            }
          });
        });
        append($$anchor2, fragment_1);
      }
    });
    append($$anchor, fragment);
    pop();
  }
  var root$1 = /* @__PURE__ */ from_html(`<button id="dubplus-snooze-video" type="button"><span class="svelte-1i1rq1b">1</span></button>`);
  function SnoozeVideo($$anchor, $$props) {
    push($$props, true);
    let icon = /* @__PURE__ */ state("icon-eye-blocked");
    let tooltip = /* @__PURE__ */ state(proxy(t("SnoozeVideo.tooltip")));
    const SNOOZE_CLASS = "dubplus-snooze-video";
    function revert() {
      set(tooltip, t("SnoozeVideo.tooltip"), true);
      set(icon, "icon-eye-blocked");
      document.body.classList.remove(SNOOZE_CLASS);
      window.QueUp.Events.unbind(PLAYLIST_UPDATE, eventSongAdvance);
    }
    function eventSongAdvance(e) {
      if (e.startTime < 2) {
        revert();
        return true;
      }
    }
    function snooze() {
      if (!document.body.classList.contains(SNOOZE_CLASS)) {
        set(tooltip, t("SnoozeVideo.tooltip.undo"), true);
        set(icon, "icon-eye-unblocked");
        document.body.classList.add(SNOOZE_CLASS);
        window.QueUp.Events.bind(PLAYLIST_UPDATE, eventSongAdvance);
      } else {
        revert();
      }
    }
    var button = root$1();
    button.__click = snooze;
    action(button, ($$node, $$action_arg) => teleport?.($$node, $$action_arg), () => ({ to: PLAYER_SHARING_CONTAINER }));
    template_effect(() => {
      set_class(button, 1, `${get(icon)} snooze-video-btn dubplus-btn-player`, "svelte-1i1rq1b");
      set_attribute(button, "aria-label", get(tooltip));
      set_attribute(button, "data-dp-tooltip", get(tooltip));
    });
    append($$anchor, button);
    pop();
  }
  delegate(["click"]);
  var root_2 = /* @__PURE__ */ from_html(`<!> <!> <!>`, 1);
  var root = /* @__PURE__ */ from_html(`<!> <!> <!> <!> <!> <!> <!> <aside class="dubplus-menu svelte-mumrn2"><p class="dubplus-menu-header svelte-mumrn2"> <span class="version svelte-mumrn2"> </span></p> <!> <!> <!> <!> <!></aside> <!>`, 1);
  function Menu($$anchor, $$props) {
    push($$props, false);
    onMount(() => {
      document.querySelector("html").classList.add("dubplus");
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
        DubsInfo(node_6, { dubType: "updub" });
        var node_7 = sibling(node_6, 2);
        DubsInfo(node_7, { dubType: "downdub" });
        var node_8 = sibling(node_7, 2);
        DubsInfo(node_8, { dubType: "grab" });
        append($$anchor2, fragment_2);
      };
      if_block(node_5, ($$render) => {
        if (settings.options["dubs-hover"]) $$render(consequent_1);
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
        set_text(text2, `${$0 ?? ""} `);
        set_text(text_1, `v${pkg.version}`);
      },
      [() => t("Menu.title")]
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
      homepage: pkg.homepage
    });
    let status = /* @__PURE__ */ state("loading");
    const checkList = [
      "QueUp.session.id",
      "QueUp.room.chat",
      "QueUp.Events",
      "QueUp.room.player",
      "QueUp.helpers.cookie",
      "QueUp.room.model",
      "QueUp.room.users"
    ];
    waitFor(function() {
      return arrayDeepCheck(checkList);
    }).then(() => {
      set(status, "ready");
    }).catch(() => {
      if (!window.QueUp?.session?.id) {
        set(status, "loggedout");
      } else {
        set(status, "error");
      }
    });
    function showErrorModal(content) {
      modalState.title = t("Error.modal.title");
      modalState.content = content;
      modalState.open = true;
    }
    user_effect(() => {
      if (get(status) === "loggedout") {
        showErrorModal(t("Error.modal.loggedout"));
      } else if (get(status) === "error") {
        showErrorModal(t("Error.unknown"));
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
              if (get(status) === "ready") $$render(consequent_1);
              else $$render(alternate, false);
            },
            true
          );
        }
        append($$anchor2, fragment_2);
      };
      if_block(node, ($$render) => {
        if (get(status) === "loading") $$render(consequent);
        else $$render(alternate_1, false);
      });
    }
    append($$anchor, fragment);
    pop();
  }
  const loadedAsExtension = "dubplusExtensionLoaded" in window;
  logInfo("loaded as extension:", loadedAsExtension);
  if (!loadedAsExtension) {
    loadDubPlusCSSforBookmarklet();
  }
  let container = document.getElementById("dubplus-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "dubplus-container";
    document.body.appendChild(container);
  } else if (container.children.length > 0) {
    unmount(container);
    container.replaceChildren();
  }
  const app = mount(DubPlus, {
    target: container
  });
  return app;
})();
