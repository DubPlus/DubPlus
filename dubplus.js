var dubplus = function() {
  "use strict";/*!
     /#######            /##                
    | ##__  ##          | ##          /##   
    | ##  \ ## /##   /##| #######    | ##   
    | ##  | ##| ##  | ##| ##__  ## /########
    | ##  | ##| ##  | ##| ##  \ ##|__  ##__/
    | ##  | ##| ##  | ##| ##  | ##   | ##   
    | #######/|  ######/| #######/   |__/   
    |_______/  ______/ |_______/           
                                            
                                            
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

  var is_array = Array.isArray;
  var array_from = Array.from;
  var is_frozen = Object.isFrozen;
  var define_property = Object.defineProperty;
  var get_descriptor = Object.getOwnPropertyDescriptor;
  var get_descriptors = Object.getOwnPropertyDescriptors;
  var object_prototype = Object.prototype;
  var array_prototype = Array.prototype;
  var get_prototype_of = Object.getPrototypeOf;
  const DERIVED = 1 << 1;
  const EFFECT = 1 << 2;
  const RENDER_EFFECT = 1 << 3;
  const BLOCK_EFFECT = 1 << 4;
  const BRANCH_EFFECT = 1 << 5;
  const ROOT_EFFECT = 1 << 6;
  const UNOWNED = 1 << 7;
  const DISCONNECTED = 1 << 8;
  const CLEAN = 1 << 9;
  const DIRTY = 1 << 10;
  const MAYBE_DIRTY = 1 << 11;
  const INERT = 1 << 12;
  const DESTROYED = 1 << 13;
  const EFFECT_RAN = 1 << 14;
  const EFFECT_TRANSPARENT = 1 << 15;
  const HEAD_EFFECT = 1 << 18;
  const STATE_SYMBOL = Symbol("$state");
  const STATE_FROZEN_SYMBOL = Symbol("$state.frozen");
  const LOADING_ATTR_SYMBOL = Symbol("");
  function equals(value) {
    return value === this.v;
  }
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
  }
  function safe_equals(value) {
    return !safe_not_equal(value, this.v);
  }
  function effect_in_teardown(rune) {
    {
      throw new Error("effect_in_teardown");
    }
  }
  function effect_in_unowned_derived() {
    {
      throw new Error("effect_in_unowned_derived");
    }
  }
  function effect_orphan(rune) {
    {
      throw new Error("effect_orphan");
    }
  }
  function effect_update_depth_exceeded() {
    {
      throw new Error("effect_update_depth_exceeded");
    }
  }
  function state_unsafe_mutation() {
    {
      throw new Error("state_unsafe_mutation");
    }
  }
  // @__NO_SIDE_EFFECTS__
  function source(v) {
    return {
      f: 0,
      // TODO ideally we could skip this altogether, but it causes type errors
      v,
      reactions: null,
      equals,
      version: 0
    };
  }
  // @__NO_SIDE_EFFECTS__
  function mutable_source(initial_value) {
    var _a;
    const s = /* @__PURE__ */ source(initial_value);
    s.equals = safe_equals;
    if (current_component_context !== null && current_component_context.l !== null) {
      ((_a = current_component_context.l).s ?? (_a.s = [])).push(s);
    }
    return s;
  }
  function set(source2, value) {
    if (current_reaction !== null && is_runes() && (current_reaction.f & DERIVED) !== 0) {
      state_unsafe_mutation();
    }
    if (!source2.equals(value)) {
      source2.v = value;
      source2.version = increment_version();
      mark_reactions(source2, DIRTY);
      if (is_runes() && current_effect !== null && (current_effect.f & CLEAN) !== 0 && (current_effect.f & BRANCH_EFFECT) === 0) {
        if (new_deps !== null && new_deps.includes(source2)) {
          set_signal_status(current_effect, DIRTY);
          schedule_effect(current_effect);
        } else {
          if (current_untracked_writes === null) {
            set_current_untracked_writes([source2]);
          } else {
            current_untracked_writes.push(source2);
          }
        }
      }
    }
    return value;
  }
  function mark_reactions(signal, status) {
    var reactions = signal.reactions;
    if (reactions === null) return;
    var runes = is_runes();
    var length = reactions.length;
    for (var i = 0; i < length; i++) {
      var reaction = reactions[i];
      var flags = reaction.f;
      if ((flags & DIRTY) !== 0) continue;
      if (!runes && reaction === current_effect) continue;
      set_signal_status(reaction, status);
      if ((flags & (CLEAN | UNOWNED)) !== 0) {
        if ((flags & DERIVED) !== 0) {
          mark_reactions(
            /** @type {import('#client').Derived} */
            reaction,
            MAYBE_DIRTY
          );
        } else {
          schedule_effect(
            /** @type {import('#client').Effect} */
            reaction
          );
        }
      }
    }
  }
  function validate_effect(rune) {
    if (current_effect === null && current_reaction === null) {
      effect_orphan();
    }
    if (current_reaction !== null && (current_reaction.f & UNOWNED) !== 0) {
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
    var is_root = (type & ROOT_EFFECT) !== 0;
    var effect2 = {
      ctx: current_component_context,
      deps: null,
      nodes: null,
      f: type | DIRTY,
      first: null,
      fn,
      last: null,
      next: null,
      parent: is_root ? null : current_effect,
      prev: null,
      teardown: null,
      transitions: null,
      version: 0
    };
    if (sync) {
      var previously_flushing_effect = is_flushing_effect;
      try {
        set_is_flushing_effect(true);
        update_effect(effect2);
        effect2.f |= EFFECT_RAN;
      } finally {
        set_is_flushing_effect(previously_flushing_effect);
      }
    } else if (fn !== null) {
      schedule_effect(effect2);
    }
    var inert = sync && effect2.deps === null && effect2.first === null && effect2.nodes === null && effect2.teardown === null;
    if (!inert && !is_root && push2) {
      if (current_effect !== null) {
        push_effect(effect2, current_effect);
      }
      if (current_reaction !== null && (current_reaction.f & DERIVED) !== 0) {
        push_effect(effect2, current_reaction);
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
    var defer = current_effect !== null && (current_effect.f & RENDER_EFFECT) !== 0 && // TODO do we actually need this? removing them changes nothing
    current_component_context !== null && !current_component_context.m;
    if (defer) {
      var context = (
        /** @type {import('#client').ComponentContext} */
        current_component_context
      );
      (context.e ?? (context.e = [])).push(fn);
    } else {
      var signal = effect(fn);
      return signal;
    }
  }
  function user_pre_effect(fn) {
    validate_effect();
    return render_effect(fn);
  }
  function effect_root(fn) {
    const effect2 = create_effect(ROOT_EFFECT, fn, true);
    return () => {
      destroy_effect(effect2);
    };
  }
  function effect(fn) {
    return create_effect(EFFECT, fn, false);
  }
  function render_effect(fn) {
    return create_effect(RENDER_EFFECT, fn, true);
  }
  function template_effect(fn) {
    return render_effect(fn);
  }
  function block(fn, flags = 0) {
    return create_effect(RENDER_EFFECT | BLOCK_EFFECT | flags, fn, true);
  }
  function branch(fn, push2 = true) {
    return create_effect(RENDER_EFFECT | BRANCH_EFFECT, fn, true, push2);
  }
  function execute_effect_teardown(effect2) {
    var teardown2 = effect2.teardown;
    if (teardown2 !== null) {
      const previously_destroying_effect = is_destroying_effect;
      const previous_reaction = current_reaction;
      set_is_destroying_effect(true);
      set_current_reaction(null);
      try {
        teardown2.call(null);
      } finally {
        set_is_destroying_effect(previously_destroying_effect);
        set_current_reaction(previous_reaction);
      }
    }
  }
  function destroy_effect(effect2, remove_dom = true) {
    var removed = false;
    if ((remove_dom || (effect2.f & HEAD_EFFECT) !== 0) && effect2.nodes !== null) {
      var node = effect2.nodes.start;
      var end = effect2.nodes.end;
      while (node !== null) {
        var next = node === end ? null : (
          /** @type {import('#client').TemplateNode} */
          node.nextSibling
        );
        node.remove();
        node = next;
      }
      removed = true;
    }
    destroy_effect_children(effect2, remove_dom && !removed);
    remove_reactions(effect2, 0);
    set_signal_status(effect2, DESTROYED);
    if (effect2.transitions) {
      for (const transition of effect2.transitions) {
        transition.stop();
      }
    }
    execute_effect_teardown(effect2);
    var parent = effect2.parent;
    if (parent !== null && (effect2.f & BRANCH_EFFECT) !== 0 && parent.first !== null) {
      unlink_effect(effect2);
    }
    effect2.next = effect2.prev = effect2.teardown = effect2.ctx = effect2.deps = effect2.parent = effect2.fn = effect2.nodes = null;
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
      var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
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
    if (check_dirtiness(effect2)) {
      update_effect(effect2);
    }
    var child2 = effect2.first;
    while (child2 !== null) {
      var sibling2 = child2.next;
      var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
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
  const EACH_ITEM_REACTIVE = 1;
  const EACH_INDEX_REACTIVE = 1 << 1;
  const EACH_KEYED = 1 << 2;
  const EACH_IS_CONTROLLED = 1 << 3;
  const EACH_IS_ANIMATED = 1 << 4;
  const EACH_IS_STRICT_EQUALS = 1 << 6;
  const TEMPLATE_FRAGMENT = 1;
  const TEMPLATE_USE_IMPORT_NODE = 1 << 1;
  const UNINITIALIZED = Symbol();
  const PassiveDelegatedEvents = ["touchstart", "touchmove", "touchend"];
  function proxy(value, immutable = true, parent = null, prev) {
    if (typeof value === "object" && value != null && !is_frozen(value) && !(STATE_FROZEN_SYMBOL in value)) {
      if (STATE_SYMBOL in value) {
        const metadata = (
          /** @type {import('#client').ProxyMetadata<T>} */
          value[STATE_SYMBOL]
        );
        if (metadata.t === value || metadata.p === value) {
          return metadata.p;
        }
      }
      const prototype = get_prototype_of(value);
      if (prototype === object_prototype || prototype === array_prototype) {
        const proxy2 = new Proxy(value, state_proxy_handler);
        define_property(value, STATE_SYMBOL, {
          value: (
            /** @type {import('#client').ProxyMetadata} */
            {
              s: /* @__PURE__ */ new Map(),
              v: /* @__PURE__ */ source(0),
              a: is_array(value),
              i: immutable,
              p: proxy2,
              t: value
            }
          ),
          writable: true,
          enumerable: false
        });
        return proxy2;
      }
    }
    return value;
  }
  function update_version(signal, d = 1) {
    set(signal, signal.v + d);
  }
  const state_proxy_handler = {
    defineProperty(target, prop, descriptor) {
      if (descriptor.value) {
        const metadata = target[STATE_SYMBOL];
        const s = metadata.s.get(prop);
        if (s !== void 0) set(s, proxy(descriptor.value, metadata.i, metadata));
      }
      return Reflect.defineProperty(target, prop, descriptor);
    },
    deleteProperty(target, prop) {
      const metadata = target[STATE_SYMBOL];
      const s = metadata.s.get(prop);
      const is_array2 = metadata.a;
      const boolean = delete target[prop];
      if (is_array2 && boolean) {
        const ls = metadata.s.get("length");
        const length = target.length - 1;
        if (ls !== void 0 && ls.v !== length) {
          set(ls, length);
        }
      }
      if (s !== void 0) set(s, UNINITIALIZED);
      if (boolean) {
        update_version(metadata.v);
      }
      return boolean;
    },
    get(target, prop, receiver) {
      var _a;
      if (prop === STATE_SYMBOL) {
        return Reflect.get(target, STATE_SYMBOL);
      }
      const metadata = target[STATE_SYMBOL];
      let s = metadata.s.get(prop);
      if (s === void 0 && (!(prop in target) || ((_a = get_descriptor(target, prop)) == null ? void 0 : _a.writable))) {
        s = (metadata.i ? source : mutable_source)(proxy(target[prop], metadata.i, metadata));
        metadata.s.set(prop, s);
      }
      if (s !== void 0) {
        const value = get(s);
        return value === UNINITIALIZED ? void 0 : value;
      }
      return Reflect.get(target, prop, receiver);
    },
    getOwnPropertyDescriptor(target, prop) {
      const descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
      if (descriptor && "value" in descriptor) {
        const metadata = target[STATE_SYMBOL];
        const s = metadata.s.get(prop);
        if (s) {
          descriptor.value = get(s);
        }
      }
      return descriptor;
    },
    has(target, prop) {
      var _a;
      if (prop === STATE_SYMBOL) {
        return true;
      }
      const metadata = target[STATE_SYMBOL];
      const has = Reflect.has(target, prop);
      let s = metadata.s.get(prop);
      if (s !== void 0 || current_effect !== null && (!has || ((_a = get_descriptor(target, prop)) == null ? void 0 : _a.writable))) {
        if (s === void 0) {
          s = (metadata.i ? source : mutable_source)(
            has ? proxy(target[prop], metadata.i, metadata) : UNINITIALIZED
          );
          metadata.s.set(prop, s);
        }
        const value = get(s);
        if (value === UNINITIALIZED) {
          return false;
        }
      }
      return has;
    },
    set(target, prop, value, receiver) {
      const metadata = target[STATE_SYMBOL];
      let s = metadata.s.get(prop);
      if (s === void 0) {
        untrack(() => receiver[prop]);
        s = metadata.s.get(prop);
      }
      if (s !== void 0) {
        set(s, proxy(value, metadata.i, metadata));
      }
      const is_array2 = metadata.a;
      const not_has = !(prop in target);
      if (is_array2 && prop === "length") {
        for (let i = value; i < target.length; i += 1) {
          const s2 = metadata.s.get(i + "");
          if (s2 !== void 0) set(s2, UNINITIALIZED);
        }
      }
      target[prop] = value;
      if (not_has) {
        if (is_array2) {
          const ls = metadata.s.get("length");
          const length = target.length;
          if (ls !== void 0 && ls.v !== length) {
            set(ls, length);
          }
        }
        update_version(metadata.v);
      }
      return true;
    },
    ownKeys(target) {
      const metadata = target[STATE_SYMBOL];
      get(metadata.v);
      return Reflect.ownKeys(target);
    }
  };
  function run(fn) {
    return fn();
  }
  function run_all(arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i]();
    }
  }
  let is_micro_task_queued$1 = false;
  let current_queued_micro_tasks = [];
  function process_micro_tasks() {
    is_micro_task_queued$1 = false;
    const tasks = current_queued_micro_tasks.slice();
    current_queued_micro_tasks = [];
    run_all(tasks);
  }
  function queue_micro_task(fn) {
    if (!is_micro_task_queued$1) {
      is_micro_task_queued$1 = true;
      queueMicrotask(process_micro_tasks);
    }
    current_queued_micro_tasks.push(fn);
  }
  function flush_tasks() {
    if (is_micro_task_queued$1) {
      process_micro_tasks();
    }
  }
  // @__NO_SIDE_EFFECTS__
  function derived(fn) {
    let flags = DERIVED | DIRTY;
    if (current_effect === null) flags |= UNOWNED;
    const signal = {
      deps: null,
      deriveds: null,
      equals,
      f: flags,
      first: null,
      fn,
      last: null,
      reactions: null,
      v: (
        /** @type {V} */
        null
      ),
      version: 0
    };
    if (current_reaction !== null && (current_reaction.f & DERIVED) !== 0) {
      var current_derived = (
        /** @type {import('#client').Derived} */
        current_reaction
      );
      if (current_derived.deriveds === null) {
        current_derived.deriveds = [signal];
      } else {
        current_derived.deriveds.push(signal);
      }
    }
    return signal;
  }
  // @__NO_SIDE_EFFECTS__
  function derived_safe_equal(fn) {
    const signal = /* @__PURE__ */ derived(fn);
    signal.equals = safe_equals;
    return signal;
  }
  function destroy_derived_children(derived2) {
    destroy_effect_children(derived2);
    var deriveds = derived2.deriveds;
    if (deriveds !== null) {
      derived2.deriveds = null;
      for (var i = 0; i < deriveds.length; i += 1) {
        destroy_derived(deriveds[i]);
      }
    }
  }
  function update_derived(derived2) {
    destroy_derived_children(derived2);
    var value = update_reaction(derived2);
    var status = (current_skip_reaction || (derived2.f & UNOWNED) !== 0) && derived2.deps !== null ? MAYBE_DIRTY : CLEAN;
    set_signal_status(derived2, status);
    if (!derived2.equals(value)) {
      derived2.v = value;
      derived2.version = increment_version();
    }
  }
  function destroy_derived(signal) {
    destroy_derived_children(signal);
    remove_reactions(signal, 0);
    set_signal_status(signal, DESTROYED);
    signal.first = signal.last = signal.deps = signal.reactions = // @ts-expect-error `signal.fn` cannot be `null` while the signal is alive
    signal.fn = null;
  }
  function lifecycle_outside_component(name) {
    {
      throw new Error("lifecycle_outside_component");
    }
  }
  const FLUSH_MICROTASK = 0;
  const FLUSH_SYNC = 1;
  let current_scheduler_mode = FLUSH_MICROTASK;
  let is_micro_task_queued = false;
  let is_flushing_effect = false;
  let is_destroying_effect = false;
  function set_is_flushing_effect(value) {
    is_flushing_effect = value;
  }
  function set_is_destroying_effect(value) {
    is_destroying_effect = value;
  }
  let current_queued_root_effects = [];
  let flush_count = 0;
  let current_reaction = null;
  function set_current_reaction(reaction) {
    current_reaction = reaction;
  }
  let current_effect = null;
  let new_deps = null;
  let skipped_deps = 0;
  let current_untracked_writes = null;
  function set_current_untracked_writes(value) {
    current_untracked_writes = value;
  }
  let current_version = 0;
  let current_skip_reaction = false;
  let current_component_context = null;
  function increment_version() {
    return current_version++;
  }
  function is_runes() {
    return current_component_context !== null && current_component_context.l === null;
  }
  function check_dirtiness(reaction) {
    var _a;
    var flags = reaction.f;
    if ((flags & DIRTY) !== 0) {
      return true;
    }
    if ((flags & MAYBE_DIRTY) !== 0) {
      var dependencies = reaction.deps;
      if (dependencies !== null) {
        var is_unowned = (flags & UNOWNED) !== 0;
        for (var i = 0; i < dependencies.length; i++) {
          var dependency = dependencies[i];
          if (check_dirtiness(
            /** @type {import('#client').Derived} */
            dependency
          )) {
            update_derived(
              /** @type {import('#client').Derived} */
              dependency
            );
          }
          if (dependency.version > reaction.version) {
            return true;
          }
          if (is_unowned) {
            if (!current_skip_reaction && !((_a = dependency == null ? void 0 : dependency.reactions) == null ? void 0 : _a.includes(reaction))) {
              (dependency.reactions ?? (dependency.reactions = [])).push(reaction);
            }
          }
        }
      }
      set_signal_status(reaction, CLEAN);
    }
    return false;
  }
  function handle_error(error, effect2, component_context) {
    {
      throw error;
    }
  }
  function update_reaction(reaction) {
    var previous_deps = new_deps;
    var previous_skipped_deps = skipped_deps;
    var previous_untracked_writes = current_untracked_writes;
    var previous_reaction = current_reaction;
    var previous_skip_reaction = current_skip_reaction;
    new_deps = /** @type {null | import('#client').Value[]} */
    null;
    skipped_deps = 0;
    current_untracked_writes = null;
    current_reaction = (reaction.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
    current_skip_reaction = !is_flushing_effect && (reaction.f & UNOWNED) !== 0;
    try {
      var result = (
        /** @type {Function} */
        (0, reaction.fn)()
      );
      var deps = reaction.deps;
      if (new_deps !== null) {
        var dependency;
        var i;
        if (deps !== null) {
          var array = skipped_deps === 0 ? new_deps : deps.slice(0, skipped_deps).concat(new_deps);
          var set2 = array.length > 16 ? new Set(array) : null;
          for (i = skipped_deps; i < deps.length; i++) {
            dependency = deps[i];
            if (set2 !== null ? !set2.has(dependency) : !array.includes(dependency)) {
              remove_reaction(reaction, dependency);
            }
          }
        }
        if (deps !== null && skipped_deps > 0) {
          deps.length = skipped_deps + new_deps.length;
          for (i = 0; i < new_deps.length; i++) {
            deps[skipped_deps + i] = new_deps[i];
          }
        } else {
          reaction.deps = deps = new_deps;
        }
        if (!current_skip_reaction) {
          for (i = skipped_deps; i < deps.length; i++) {
            dependency = deps[i];
            var reactions = dependency.reactions;
            if (reactions === null) {
              dependency.reactions = [reaction];
            } else if (reactions[reactions.length - 1] !== reaction && !reactions.includes(reaction)) {
              reactions.push(reaction);
            }
          }
        }
      } else if (deps !== null && skipped_deps < deps.length) {
        remove_reactions(reaction, skipped_deps);
        deps.length = skipped_deps;
      }
      return result;
    } finally {
      new_deps = previous_deps;
      skipped_deps = previous_skipped_deps;
      current_untracked_writes = previous_untracked_writes;
      current_reaction = previous_reaction;
      current_skip_reaction = previous_skip_reaction;
    }
  }
  function remove_reaction(signal, dependency) {
    const reactions = dependency.reactions;
    let reactions_length = 0;
    if (reactions !== null) {
      reactions_length = reactions.length - 1;
      const index2 = reactions.indexOf(signal);
      if (index2 !== -1) {
        if (reactions_length === 0) {
          dependency.reactions = null;
        } else {
          reactions[index2] = reactions[reactions_length];
          reactions.pop();
        }
      }
    }
    if (reactions_length === 0 && (dependency.f & DERIVED) !== 0) {
      set_signal_status(dependency, MAYBE_DIRTY);
      if ((dependency.f & (UNOWNED | DISCONNECTED)) === 0) {
        dependency.f ^= DISCONNECTED;
      }
      remove_reactions(
        /** @type {import('#client').Derived} **/
        dependency,
        0
      );
    }
  }
  function remove_reactions(signal, start_index) {
    var dependencies = signal.deps;
    if (dependencies === null) return;
    var active_dependencies = start_index === 0 ? null : dependencies.slice(0, start_index);
    var seen = /* @__PURE__ */ new Set();
    for (var i = start_index; i < dependencies.length; i++) {
      var dependency = dependencies[i];
      if (seen.has(dependency)) continue;
      seen.add(dependency);
      if (active_dependencies === null || !active_dependencies.includes(dependency)) {
        remove_reaction(signal, dependency);
      }
    }
  }
  function destroy_effect_children(signal, remove_dom = false) {
    var effect2 = signal.first;
    signal.first = signal.last = null;
    while (effect2 !== null) {
      var next = effect2.next;
      destroy_effect(effect2, remove_dom);
      effect2 = next;
    }
  }
  function update_effect(effect2) {
    var flags = effect2.f;
    if ((flags & DESTROYED) !== 0) {
      return;
    }
    set_signal_status(effect2, CLEAN);
    var component_context = effect2.ctx;
    var previous_effect = current_effect;
    var previous_component_context = current_component_context;
    current_effect = effect2;
    current_component_context = component_context;
    try {
      if ((flags & BLOCK_EFFECT) === 0) {
        destroy_effect_children(effect2);
      }
      execute_effect_teardown(effect2);
      var teardown2 = update_reaction(effect2);
      effect2.teardown = typeof teardown2 === "function" ? teardown2 : null;
      effect2.version = current_version;
    } catch (error) {
      handle_error(
        /** @type {Error} */
        error
      );
    } finally {
      current_effect = previous_effect;
      current_component_context = previous_component_context;
    }
  }
  function infinite_loop_guard() {
    if (flush_count > 1e3) {
      flush_count = 0;
      effect_update_depth_exceeded();
    }
    flush_count++;
  }
  function flush_queued_root_effects(root_effects) {
    var length = root_effects.length;
    if (length === 0) {
      return;
    }
    infinite_loop_guard();
    var previously_flushing_effect = is_flushing_effect;
    is_flushing_effect = true;
    try {
      for (var i = 0; i < length; i++) {
        var effect2 = root_effects[i];
        if (effect2.first === null && (effect2.f & BRANCH_EFFECT) === 0) {
          flush_queued_effects([effect2]);
        } else {
          var collected_effects = [];
          process_effects(effect2, collected_effects);
          flush_queued_effects(collected_effects);
        }
      }
    } finally {
      is_flushing_effect = previously_flushing_effect;
    }
  }
  function flush_queued_effects(effects) {
    var length = effects.length;
    if (length === 0) return;
    for (var i = 0; i < length; i++) {
      var effect2 = effects[i];
      if ((effect2.f & (DESTROYED | INERT)) === 0 && check_dirtiness(effect2)) {
        update_effect(effect2);
        if (effect2.deps === null && effect2.first === null && effect2.nodes === null) {
          if (effect2.teardown === null) {
            unlink_effect(effect2);
          } else {
            effect2.fn = null;
          }
        }
      }
    }
  }
  function process_deferred() {
    is_micro_task_queued = false;
    if (flush_count > 1001) {
      return;
    }
    const previous_queued_root_effects = current_queued_root_effects;
    current_queued_root_effects = [];
    flush_queued_root_effects(previous_queued_root_effects);
    if (!is_micro_task_queued) {
      flush_count = 0;
    }
  }
  function schedule_effect(signal) {
    if (current_scheduler_mode === FLUSH_MICROTASK) {
      if (!is_micro_task_queued) {
        is_micro_task_queued = true;
        queueMicrotask(process_deferred);
      }
    }
    var effect2 = signal;
    while (effect2.parent !== null) {
      effect2 = effect2.parent;
      var flags = effect2.f;
      if ((flags & BRANCH_EFFECT) !== 0) {
        if ((flags & CLEAN) === 0) return;
        set_signal_status(effect2, MAYBE_DIRTY);
      }
    }
    current_queued_root_effects.push(effect2);
  }
  function process_effects(effect2, collected_effects) {
    var current_effect2 = effect2.first;
    var effects = [];
    main_loop: while (current_effect2 !== null) {
      var flags = current_effect2.f;
      var is_active = (flags & (DESTROYED | INERT)) === 0;
      var is_branch = flags & BRANCH_EFFECT;
      var is_clean = (flags & CLEAN) !== 0;
      var child2 = current_effect2.first;
      if (is_active && (!is_branch || !is_clean)) {
        if (is_branch) {
          set_signal_status(current_effect2, CLEAN);
        }
        if ((flags & RENDER_EFFECT) !== 0) {
          if (!is_branch && check_dirtiness(current_effect2)) {
            update_effect(current_effect2);
            child2 = current_effect2.first;
          }
          if (child2 !== null) {
            current_effect2 = child2;
            continue;
          }
        } else if ((flags & EFFECT) !== 0) {
          if (is_branch || is_clean) {
            if (child2 !== null) {
              current_effect2 = child2;
              continue;
            }
          } else {
            effects.push(current_effect2);
          }
        }
      }
      var sibling2 = current_effect2.next;
      if (sibling2 === null) {
        let parent = current_effect2.parent;
        while (parent !== null) {
          if (effect2 === parent) {
            break main_loop;
          }
          var parent_sibling = parent.next;
          if (parent_sibling !== null) {
            current_effect2 = parent_sibling;
            continue main_loop;
          }
          parent = parent.parent;
        }
      }
      current_effect2 = sibling2;
    }
    for (var i = 0; i < effects.length; i++) {
      child2 = effects[i];
      collected_effects.push(child2);
      process_effects(child2, collected_effects);
    }
  }
  function flush_sync(fn, flush_previous = true) {
    var previous_scheduler_mode = current_scheduler_mode;
    var previous_queued_root_effects = current_queued_root_effects;
    try {
      infinite_loop_guard();
      const root_effects = [];
      current_scheduler_mode = FLUSH_SYNC;
      current_queued_root_effects = root_effects;
      is_micro_task_queued = false;
      if (flush_previous) {
        flush_queued_root_effects(previous_queued_root_effects);
      }
      var result = fn == null ? void 0 : fn();
      flush_tasks();
      if (current_queued_root_effects.length > 0 || root_effects.length > 0) {
        flush_sync();
      }
      flush_count = 0;
      return result;
    } finally {
      current_scheduler_mode = previous_scheduler_mode;
      current_queued_root_effects = previous_queued_root_effects;
    }
  }
  function get(signal) {
    var flags = signal.f;
    if ((flags & DESTROYED) !== 0) {
      return signal.v;
    }
    if (current_reaction !== null) {
      var deps = current_reaction.deps;
      if (new_deps === null && deps !== null && deps[skipped_deps] === signal) {
        skipped_deps++;
      } else if (deps === null || skipped_deps === 0 || deps[skipped_deps - 1] !== signal) {
        if (new_deps === null) {
          new_deps = [signal];
        } else if (new_deps[new_deps.length - 1] !== signal) {
          new_deps.push(signal);
        }
      }
      if (current_untracked_writes !== null && current_effect !== null && (current_effect.f & CLEAN) !== 0 && (current_effect.f & BRANCH_EFFECT) === 0 && current_untracked_writes.includes(signal)) {
        set_signal_status(current_effect, DIRTY);
        schedule_effect(current_effect);
      }
    }
    if ((flags & DERIVED) !== 0) {
      var derived2 = (
        /** @type {import('#client').Derived} */
        signal
      );
      if (check_dirtiness(derived2)) {
        update_derived(derived2);
      }
      if ((flags & DISCONNECTED) !== 0) {
        deps = derived2.deps;
        if (deps !== null) {
          for (var i = 0; i < deps.length; i++) {
            var dep = deps[i];
            var reactions = dep.reactions;
            if (reactions === null) {
              dep.reactions = [derived2];
            } else if (!reactions.includes(derived2)) {
              reactions.push(derived2);
            }
          }
        }
        derived2.f ^= DISCONNECTED;
      }
    }
    return signal.v;
  }
  function untrack(fn) {
    const previous_reaction = current_reaction;
    try {
      current_reaction = null;
      return fn();
    } finally {
      current_reaction = previous_reaction;
    }
  }
  const STATUS_MASK = ~(DIRTY | MAYBE_DIRTY | CLEAN);
  function set_signal_status(signal, status) {
    signal.f = signal.f & STATUS_MASK | status;
  }
  function is_signal(val) {
    return typeof val === "object" && val !== null && typeof /** @type {import('#client').Value<V>} */
    val.f === "number";
  }
  function push(props, runes = false, fn) {
    current_component_context = {
      p: current_component_context,
      c: null,
      e: null,
      m: false,
      s: props,
      x: null,
      l: null
    };
    if (!runes) {
      current_component_context.l = {
        s: null,
        u: null,
        r1: [],
        r2: /* @__PURE__ */ source(false)
      };
    }
  }
  function pop(component) {
    const context_stack_item = current_component_context;
    if (context_stack_item !== null) {
      const effects = context_stack_item.e;
      if (effects !== null) {
        context_stack_item.e = null;
        for (var i = 0; i < effects.length; i++) {
          effect(effects[i]);
        }
      }
      current_component_context = context_stack_item.p;
      context_stack_item.m = true;
    }
    return (
      /** @type {T} */
      {}
    );
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
  function unwrap(value) {
    if (is_signal(value)) {
      return get(value);
    }
    return value;
  }
  let hydrating = false;
  var $window;
  function init_operations() {
    if ($window !== void 0) {
      return;
    }
    $window = window;
    var element_prototype = Element.prototype;
    element_prototype.__click = void 0;
    element_prototype.__className = "";
    element_prototype.__attributes = null;
    element_prototype.__e = void 0;
    Text.prototype.__t = void 0;
  }
  function empty() {
    return document.createTextNode("");
  }
  // @__NO_SIDE_EFFECTS__
  function child(node) {
    const child2 = node.firstChild;
    return child2;
  }
  // @__NO_SIDE_EFFECTS__
  function first_child(fragment, is_text) {
    {
      var first = (
        /** @type {DocumentFragment} */
        fragment.firstChild
      );
      if (first instanceof Comment && first.data === "") return first.nextSibling;
      return first;
    }
  }
  // @__NO_SIDE_EFFECTS__
  function sibling(node, is_text = false) {
    var next_sibling = (
      /** @type {import('#client').TemplateNode} */
      node.nextSibling
    );
    {
      return next_sibling;
    }
  }
  function clear_text_content(node) {
    node.textContent = "";
  }
  function create_event(event_name, dom, handler, options) {
    function target_handler(event2) {
      if (!options.capture) {
        handle_event_propagation.call(dom, event2);
      }
      if (!event2.cancelBubble) {
        return handler.call(this, event2);
      }
    }
    if (event_name.startsWith("pointer") || event_name === "wheel") {
      queue_micro_task(() => {
        dom.addEventListener(event_name, target_handler, options);
      });
    } else {
      dom.addEventListener(event_name, target_handler, options);
    }
    return target_handler;
  }
  function event(event_name, dom, handler, capture, passive) {
    var options = { capture, passive };
    var target_handler = create_event(event_name, dom, handler, options);
    if (dom === document.body || dom === window || dom === document) {
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
    var _a;
    var handler_element = this;
    var owner_document = (
      /** @type {Node} */
      handler_element.ownerDocument
    );
    var event_name = event2.type;
    var path = ((_a = event2.composedPath) == null ? void 0 : _a.call(event2)) || [];
    var current_target = (
      /** @type {null | Element} */
      path[0] || event2.target
    );
    var path_idx = 0;
    var handled_at = event2.__root;
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
    try {
      var throw_error;
      var other_errors = [];
      while (current_target !== null) {
        var parent_element = current_target.parentNode || /** @type {any} */
        current_target.host || null;
        try {
          var delegated = current_target["__" + event_name];
          if (delegated !== void 0 && !/** @type {any} */
          current_target.disabled) {
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
      current_target = handler_element;
    }
  }
  const all_registered_events = /* @__PURE__ */ new Set();
  const root_event_handles = /* @__PURE__ */ new Set();
  function set_text(text2, value) {
    const prev = text2.__t ?? (text2.__t = text2.nodeValue);
    if (prev !== value) {
      text2.nodeValue = text2.__t = value;
    }
  }
  function mount(component, options) {
    const anchor = options.anchor ?? options.target.appendChild(empty());
    return flush_sync(() => _mount(component, { ...options, anchor }), false);
  }
  function _mount(Component, { target, anchor, props = {}, events, context, intro = false }) {
    init_operations();
    const registered_events = /* @__PURE__ */ new Set();
    const event_handle = (events2) => {
      for (let i = 0; i < events2.length; i++) {
        const event_name = events2[i];
        const passive = PassiveDelegatedEvents.includes(event_name);
        if (!registered_events.has(event_name)) {
          registered_events.add(event_name);
          target.addEventListener(event_name, handle_event_propagation, { passive });
          document.addEventListener(event_name, handle_event_propagation, { passive });
        }
      }
    };
    event_handle(array_from(all_registered_events));
    root_event_handles.add(event_handle);
    let component = void 0;
    const unmount = effect_root(() => {
      branch(() => {
        if (context) {
          push({});
          var ctx = (
            /** @type {import('#client').ComponentContext} */
            current_component_context
          );
          ctx.c = context;
        }
        if (events) {
          props.$$events = events;
        }
        component = Component(anchor, props) || {};
        if (context) {
          pop();
        }
      });
      return () => {
        for (const event_name of registered_events) {
          target.removeEventListener(event_name, handle_event_propagation);
          document.removeEventListener(event_name, handle_event_propagation);
        }
        root_event_handles.delete(event_handle);
        mounted_components.delete(component);
      };
    });
    mounted_components.set(component, unmount);
    return component;
  }
  let mounted_components = /* @__PURE__ */ new WeakMap();
  function create_fragment_from_html(html) {
    var elem = document.createElement("template");
    elem.innerHTML = html;
    return elem.content;
  }
  function if_block(anchor, get_condition, consequent_fn, alternate_fn = null, elseif = false) {
    var consequent_effect = null;
    var alternate_effect = null;
    var condition = null;
    var flags = elseif ? EFFECT_TRANSPARENT : 0;
    block(() => {
      if (condition === (condition = !!get_condition())) return;
      if (condition) {
        if (consequent_effect) {
          resume_effect(consequent_effect);
        } else {
          consequent_effect = branch(() => consequent_fn(anchor));
        }
        if (alternate_effect) {
          pause_effect(alternate_effect, () => {
            alternate_effect = null;
          });
        }
      } else {
        if (alternate_effect) {
          resume_effect(alternate_effect);
        } else if (alternate_fn) {
          alternate_effect = branch(() => alternate_fn(anchor));
        }
        if (consequent_effect) {
          pause_effect(consequent_effect, () => {
            consequent_effect = null;
          });
        }
      }
    }, flags);
  }
  let current_each_item = null;
  function index(_, i) {
    return i;
  }
  function pause_effects(state, items, controlled_anchor, items_map) {
    var transitions = [];
    var length = items.length;
    for (var i = 0; i < length; i++) {
      pause_children(items[i].e, transitions, true);
    }
    var is_controlled = length > 0 && transitions.length === 0 && controlled_anchor !== null;
    if (is_controlled) {
      var parent_node = (
        /** @type {Element} */
        /** @type {Element} */
        controlled_anchor.parentNode
      );
      clear_text_content(parent_node);
      parent_node.append(
        /** @type {Element} */
        controlled_anchor
      );
      items_map.clear();
      link(state, items[0].prev, items[length - 1].next);
    }
    run_out_transitions(transitions, () => {
      for (var i2 = 0; i2 < length; i2++) {
        var item = items[i2];
        if (!is_controlled) {
          items_map.delete(item.k);
          link(state, item.prev, item.next);
        }
        destroy_effect(item.e, !is_controlled);
      }
    });
  }
  function each(anchor, flags, get_collection, get_key, render_fn, fallback_fn = null) {
    var state = { flags, items: /* @__PURE__ */ new Map(), first: null };
    var is_controlled = (flags & EACH_IS_CONTROLLED) !== 0;
    if (is_controlled) {
      var parent_node = (
        /** @type {Element} */
        anchor
      );
      anchor = parent_node.appendChild(empty());
    }
    var fallback = null;
    block(() => {
      var collection = get_collection();
      var array = is_array(collection) ? collection : collection == null ? [] : Array.from(collection);
      var length = array.length;
      var flags2 = state.flags;
      if ((flags2 & EACH_IS_STRICT_EQUALS) !== 0 && !is_frozen(array) && !(STATE_FROZEN_SYMBOL in array) && !(STATE_SYMBOL in array)) {
        flags2 ^= EACH_IS_STRICT_EQUALS;
        if ((flags2 & EACH_KEYED) !== 0 && (flags2 & EACH_ITEM_REACTIVE) === 0) {
          flags2 ^= EACH_ITEM_REACTIVE;
        }
      }
      {
        reconcile(array, state, anchor, render_fn, flags2, get_key);
      }
      if (fallback_fn !== null) {
        if (length === 0) {
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
    });
  }
  function reconcile(array, state, anchor, render_fn, flags, get_key) {
    var _a, _b, _c, _d;
    var is_animated = (flags & EACH_IS_ANIMATED) !== 0;
    var should_update = (flags & (EACH_ITEM_REACTIVE | EACH_INDEX_REACTIVE)) !== 0;
    var length = array.length;
    var items = state.items;
    var first = state.first;
    var current = first;
    var seen = /* @__PURE__ */ new Set();
    var prev = null;
    var to_animate = /* @__PURE__ */ new Set();
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
          (_a = item.a) == null ? void 0 : _a.measure();
          to_animate.add(item);
        }
      }
    }
    for (i = 0; i < length; i += 1) {
      value = array[i];
      key = get_key(value, i);
      item = items.get(key);
      if (item === void 0) {
        var child_anchor = current ? (
          /** @type {import('#client').EffectNodes} */
          current.e.nodes.start
        ) : anchor;
        prev = create_item(
          child_anchor,
          state,
          prev,
          prev === null ? state.first : prev.next,
          value,
          key,
          i,
          render_fn,
          flags
        );
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
          to_animate.delete(item);
        }
      }
      if (item !== current) {
        if (seen.has(item)) {
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
            link(state, a.prev, b.next);
            link(state, prev, a);
            link(state, b, start);
            current = start;
            prev = b;
            i -= 1;
            matched = [];
            stashed = [];
          } else {
            seen.delete(item);
            move(item, current, anchor);
            link(state, item.prev, item.next);
            link(state, item, prev === null ? state.first : prev.next);
            link(state, prev, item);
            prev = item;
          }
          continue;
        }
        matched = [];
        stashed = [];
        while (current !== null && current.k !== key) {
          seen.add(current);
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
    const to_destroy = Array.from(seen);
    while (current !== null) {
      to_destroy.push(current);
      current = current.next;
    }
    var destroy_length = to_destroy.length;
    if (destroy_length > 0) {
      var controlled_anchor = (flags & EACH_IS_CONTROLLED) !== 0 && length === 0 ? anchor : null;
      if (is_animated) {
        for (i = 0; i < destroy_length; i += 1) {
          (_c = to_destroy[i].a) == null ? void 0 : _c.measure();
        }
        for (i = 0; i < destroy_length; i += 1) {
          (_d = to_destroy[i].a) == null ? void 0 : _d.fix();
        }
      }
      pause_effects(state, to_destroy, controlled_anchor, items);
    }
    if (is_animated) {
      queue_micro_task(() => {
        var _a2;
        for (item of to_animate) {
          (_a2 = item.a) == null ? void 0 : _a2.apply();
        }
      });
    }
    current_effect.first = state.first && state.first.e;
    current_effect.last = prev && prev.e;
  }
  function update_item(item, value, index2, type) {
    if ((type & EACH_ITEM_REACTIVE) !== 0) {
      set(item.v, value);
    }
    if ((type & EACH_INDEX_REACTIVE) !== 0) {
      set(
        /** @type {import('#client').Value<number>} */
        item.i,
        index2
      );
    } else {
      item.i = index2;
    }
  }
  function create_item(anchor, state, prev, next, value, key, index2, render_fn, flags) {
    var previous_each_item = current_each_item;
    try {
      var reactive = (flags & EACH_ITEM_REACTIVE) !== 0;
      var mutable = (flags & EACH_IS_STRICT_EQUALS) === 0;
      var v = reactive ? mutable ? /* @__PURE__ */ mutable_source(value) : /* @__PURE__ */ source(value) : value;
      var i = (flags & EACH_INDEX_REACTIVE) === 0 ? index2 : /* @__PURE__ */ source(index2);
      var item = {
        i,
        v,
        k: key,
        a: null,
        // @ts-expect-error
        e: null,
        prev,
        next
      };
      current_each_item = item;
      item.e = branch(() => render_fn(anchor, v, i), hydrating);
      item.e.prev = prev && prev.e;
      item.e.next = next && next.e;
      if (prev === null) {
        state.first = item;
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
      current_each_item = previous_each_item;
    }
  }
  function move(item, next, anchor) {
    var end = item.next ? (
      /** @type {import('#client').EffectNodes} */
      item.next.e.nodes.start
    ) : anchor;
    var dest = next ? (
      /** @type {import('#client').EffectNodes} */
      next.e.nodes.start
    ) : anchor;
    var node = (
      /** @type {import('#client').EffectNodes} */
      item.e.nodes.start
    );
    while (node !== end) {
      var next_node = (
        /** @type {import('#client').TemplateNode} */
        node.nextSibling
      );
      dest.before(node);
      node = next_node;
    }
  }
  function link(state, prev, next) {
    if (prev === null) {
      state.first = next;
    } else {
      prev.next = next;
      prev.e.next = next && next.e;
    }
    if (next !== null) {
      next.prev = prev;
      next.e.prev = prev && prev.e;
    }
  }
  function assign_nodes(start, end) {
    current_effect.nodes ?? (current_effect.nodes = { start, end });
  }
  // @__NO_SIDE_EFFECTS__
  function template(content, flags) {
    var is_fragment = (flags & TEMPLATE_FRAGMENT) !== 0;
    var use_import_node = (flags & TEMPLATE_USE_IMPORT_NODE) !== 0;
    var node;
    var has_start = !content.startsWith("<!>");
    return () => {
      if (!node) {
        node = create_fragment_from_html(has_start ? content : "<!>" + content);
        if (!is_fragment) node = /** @type {Node} */
        node.firstChild;
      }
      var clone = (
        /** @type {import('#client').TemplateNode} */
        use_import_node ? document.importNode(node, true) : node.cloneNode(true)
      );
      if (is_fragment) {
        var start = (
          /** @type {import('#client').TemplateNode} */
          clone.firstChild
        );
        var end = (
          /** @type {import('#client').TemplateNode} */
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
  function ns_template(content, flags, ns = "svg") {
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
          fragment.firstChild
        );
        {
          node = /** @type {Element} */
          root2.firstChild;
        }
      }
      var clone = (
        /** @type {import('#client').TemplateNode} */
        node.cloneNode(true)
      );
      {
        assign_nodes(clone, clone);
      }
      return clone;
    };
  }
  // @__NO_SIDE_EFFECTS__
  function text(anchor) {
    {
      var t2 = empty();
      assign_nodes(t2, t2);
      return t2;
    }
  }
  function comment() {
    var frag = document.createDocumentFragment();
    var start = document.createComment("");
    var anchor = empty();
    frag.append(start, anchor);
    assign_nodes(start, anchor);
    return frag;
  }
  function append(anchor, dom) {
    anchor.before(
      /** @type {Node} */
      dom
    );
  }
  function snippet(anchor, get_snippet, ...args) {
    var snippet2;
    var snippet_effect;
    block(() => {
      if (snippet2 === (snippet2 = get_snippet())) return;
      if (snippet_effect) {
        destroy_effect(snippet_effect);
        snippet_effect = null;
      }
      if (snippet2) {
        snippet_effect = branch(() => (
          /** @type {SnippetFn} */
          snippet2(anchor, ...args)
        ));
      }
    }, EFFECT_TRANSPARENT);
  }
  function action(dom, action2, get_value) {
    effect(() => {
      var payload = untrack(() => action2(dom, get_value == null ? void 0 : get_value()) || {});
      if (get_value && (payload == null ? void 0 : payload.update)) {
        var inited = false;
        render_effect(() => {
          var value = get_value();
          deep_read_state(value);
          if (inited) {
            payload.update(value);
          }
        });
        inited = true;
      }
      if (payload == null ? void 0 : payload.destroy) {
        return () => (
          /** @type {Function} */
          payload.destroy()
        );
      }
    });
  }
  let listening_to_form_reset = false;
  function add_form_reset_listener() {
    if (!listening_to_form_reset) {
      listening_to_form_reset = true;
      document.addEventListener(
        "reset",
        (evt) => {
          Promise.resolve().then(() => {
            var _a;
            if (!evt.defaultPrevented) {
              for (
                const e of
                /**@type {HTMLFormElement} */
                evt.target.elements
              ) {
                (_a = e.__on_r) == null ? void 0 : _a.call(e);
              }
            }
          });
        },
        // In the capture phase to guarantee we get noticed of it (no possiblity of stopPropagation)
        { capture: true }
      );
    }
  }
  function set_attribute(element, attribute, value) {
    value = value == null ? null : value + "";
    var attributes = element.__attributes ?? (element.__attributes = {});
    if (attributes[attribute] === (attributes[attribute] = value)) return;
    if (attribute === "loading") {
      element[LOADING_ATTR_SYMBOL] = value;
    }
    if (value === null) {
      element.removeAttribute(attribute);
    } else {
      element.setAttribute(attribute, value);
    }
  }
  function set_class(dom, value) {
    var prev_class_name = dom.__className;
    var next_class_name = to_class(value);
    if (prev_class_name !== next_class_name || hydrating) {
      if (value == null) {
        dom.removeAttribute("class");
      } else {
        dom.className = next_class_name;
      }
      dom.__className = next_class_name;
    }
  }
  function to_class(value) {
    return value == null ? "" : value;
  }
  function toggle_class(dom, class_name, value) {
    if (value) {
      dom.classList.add(class_name);
    } else {
      dom.classList.remove(class_name);
    }
  }
  function listen_to_event_and_reset_event(element, event2, handler, on_reset = handler) {
    element.addEventListener(event2, handler);
    const prev = element.__on_r;
    if (prev) {
      element.__on_r = () => {
        prev();
        on_reset();
      };
    } else {
      element.__on_r = on_reset;
    }
    add_form_reset_listener();
  }
  function bind_value(input, get_value, update) {
    listen_to_event_and_reset_event(input, "input", () => {
      update(is_numberlike_input(input) ? to_number(input.value) : input.value);
    });
    render_effect(() => {
      var value = get_value();
      if (is_numberlike_input(input) && value === to_number(input.value)) {
        return;
      }
      if (input.type === "date" && !value && !input.value) {
        return;
      }
      input.value = value ?? "";
    });
  }
  function is_numberlike_input(input) {
    var type = input.type;
    return type === "number" || type === "range";
  }
  function to_number(value) {
    return value === "" ? null : +value;
  }
  function init() {
    const context = (
      /** @type {ComponentContextLegacy} */
      current_component_context
    );
    const callbacks = context.l.u;
    if (!callbacks) return;
    if (callbacks.b.length) {
      user_pre_effect(() => {
        observe_all(context);
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
        observe_all(context);
        run_all(callbacks.a);
      });
    }
  }
  function observe_all(context) {
    if (context.l.s) {
      for (const signal of context.l.s) get(signal);
    }
    deep_read_state(context.s);
  }
  function onMount(fn) {
    if (current_component_context === null) {
      lifecycle_outside_component();
    }
    if (current_component_context.l !== null) {
      init_update_callbacks(current_component_context).m.push(fn);
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
    if (current_component_context === null) {
      lifecycle_outside_component();
    }
    onMount(() => () => untrack(fn));
  }
  function init_update_callbacks(context) {
    var l = (
      /** @type {import('#client').ComponentContextLegacy} */
      context.l
    );
    return l.u ?? (l.u = { a: [], b: [], m: [] });
  }
  const PUBLIC_VERSION = "5";
  if (typeof window !== "undefined")
    (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(PUBLIC_VERSION);
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
  function deepCheck(dottedString, startingScope = window) {
    const props = dottedString.split(".");
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
  function waitFor(waitingFor, options = {}) {
    const defaults2 = {
      interval: 500,
      // every XX ms we check to see if all variables are defined
      seconds: 5
      // how many total seconds we wish to continue pinging
    };
    const opts = Object.assign({}, defaults2, options);
    return new Promise((resolve, reject) => {
      let tryCount = 0;
      const tryLimit = opts.seconds * 1e3 / opts.interval;
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
  var root$k = /* @__PURE__ */ ns_template(`<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 0 2078.496 2083.914" enable-background="new 0 0 2078.496 2083.914" xml:space="preserve"><rect x="769.659" y="772.445" fill-rule="evenodd" clip-rule="evenodd" fill="#660078" width="539.178" height="539.178"></rect><g><rect x="1308.837" y="772.445" fill-rule="evenodd" clip-rule="evenodd" fill="#EB008B" width="537.488" height="539.178"></rect><polygon fill="#EB008B" points="2045.015,1042.035 1845.324,1311.625 1845.324,772.446 	"></polygon></g><g><rect x="232.172" y="772.445" fill-rule="evenodd" clip-rule="evenodd" fill="#EB008B" width="537.487" height="539.178"></rect><polygon fill="#EB008B" points="33.481,1042.034 233.172,772.445 233.172,1311.623 	"></polygon></g><g><rect x="769.659" y="1311.624" fill-rule="evenodd" clip-rule="evenodd" fill="#6FCBDC" width="539.178" height="537.487"></rect><polygon fill="#6FCBDC" points="1039.248,2047.802 769.659,1848.111 1308.837,1848.111 	"></polygon></g><g><rect x="769.659" y="234.958" fill-rule="evenodd" clip-rule="evenodd" fill="#6FCBDC" width="539.178" height="537.487"></rect><polygon fill="#6FCBDC" points="1039.249,35.268 1308.837,235.958 769.659,235.958 	"></polygon></g></svg>`);
  function Logo($$anchor) {
    var svg = root$k();
    append($$anchor, svg);
  }
  const translations = {
    en: {
      "Modal.confirm": "okay",
      "Modal.cancel": "cancel",
      "Modal.close": "close",
      "Error.modal.title": "Dub+ Error",
      "Error.modal.loggedout": "You're not logged in. Please login to use Dub+.",
      "Error.unknown": "Something went wrong starting Dub+. Please refresh and try again.",
      "Loading.text": "Waiting for QueUp...",
      "Eta.tooltip.notInQueue": "You're not in the queue",
      "Eta.tootltip": "ETA: {{minutes}} minutes",
      "Snooze.tooltip": "Mute current song",
      "Notifcation.permission.title": "Desktop Notification",
      "Notification.permission.denied": "You have dismissed or chosen to deny the request to allow desktop notifications. Reset this choice by clearing your cache for the site.",
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
      "afk.modal.content": "Enter a custom Away From Keyboard [AFK] message here. Message will be prefixed with '[AFK]'",
      "afk.modal.placeholder": "Be right back!",
      "emotes.label": "Emotes",
      "emotes.description": "Adds Twitch, Bttv, and FrankerFacez emotes in chat.",
      "autocomplete.label": "Autocomplete Emoji",
      "autocomplete.description": "Toggle autocompleting emojis and emotes. Shows a preview box in the chat",
      "autocomplete.preview.select": "press enter or tab to select",
      "custom-mentions.label": "Custom Mentions",
      "custom-mentions.description": "Toggle using custom mentions to trigger sounds in chat",
      "custom-mentions.modal.title": "Custom Mentions",
      "custom-mentions.modal.content": "Add your custom mention triggers here (separate by comma)",
      "custom-mentions.modal.placeholder": "separate, custom mentions, by, comma, :heart:",
      "chat-cleaner.label": "Chat Cleaner",
      "chat-cleaner.description": "Help keep CPU stress down by setting a limit of how many chat messages to keep in the chat box, deleting older messages.",
      "chat-cleaner.modal.title": "Chat Cleaner",
      "chat-cleaner.modal.content": "Please specify the number of most recent chat items that will remain in your chat history",
      "chat-cleaner.modal.validation": "Please enter a valid number",
      "chat-cleaner.modal.placeholder": "500",
      "mention-notifications.label": "Notification on Mentions",
      "mention-notifications.description": "Enable desktop notifications when a user mentions you in chat",
      "pm-notifications.label": "Notification on PM",
      "pm-notifications.description": "Enable desktop notifications when a user receives a private message",
      "pm-notifications.notification.title": "You have a new PM",
      "dj-notification.label": "DJ Notification",
      "dj-notification.description": "Get a notification when you are coming up to be the DJ",
      "dj-notification.modal.title": "DJ Notification",
      "dj-notification.modal.content": "Please specify the position in queue you want to be notified at",
      "dj-notification.notification.title": "DJ Alert!",
      "dj-notification.notification.content": "You will be DJing shortly! Make sure your song is set!",
      "dj-notification.modal.validation": "Please enter a valid number",
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
      "custom-notification-sound.modal.validation": "Can't play sound from this URL. Please enter a valid URL to an MP3 file."
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
  function normalizeLocale(loc) {
    if (loc.startsWith("en")) {
      return "en";
    }
    if (loc.startsWith("es")) {
      return "es";
    }
    return loc;
  }
  var root$j = /* @__PURE__ */ template(`<div class="dubplus-waiting svelte-1m63uxu"><div style="width: 26px; margin-right:5px"><!></div> <span style="flex: 1;"> </span></div>`);
  function Loading($$anchor, $$props) {
    push($$props, false);
    init();
    var div = root$j();
    var div_1 = /* @__PURE__ */ child(div);
    var node = /* @__PURE__ */ child(div_1);
    Logo(node);
    var span = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(div_1, true));
    var text2 = /* @__PURE__ */ child(span);
    template_effect(() => set_text(text2, t("Loading.text")));
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
    modalState.maxlength = nextState.maxlength || 999;
    modalState.onConfirm = nextState.onConfirm || (() => {
      return true;
    });
    modalState.onCancel = nextState.onCancel || (() => {
    });
    modalState.validation = nextState.validation || (() => true);
  }
  var root_1$3 = /* @__PURE__ */ template(`<textarea class="svelte-1r2cx79">
      </textarea>`);
  var root_2$3 = /* @__PURE__ */ template(`<p class="dp-modal--error svelte-1r2cx79"> </p>`);
  var root_3$1 = /* @__PURE__ */ template(`<button class="dp-modal--cancel cancel svelte-1r2cx79"> </button> <button class="dp-modal--confirm confirm svelte-1r2cx79"> </button>`, 1);
  var root_4 = /* @__PURE__ */ template(`<button class="dp-modal--cancel cancel svelte-1r2cx79"> </button>`);
  var root$i = /* @__PURE__ */ template(`<dialog id="dubplus-dialog" class="dp-modal svelte-1r2cx79"><h1 class="svelte-1r2cx79"> </h1> <div class="dp-modal--content content svelte-1r2cx79"><p class="svelte-1r2cx79"> </p> <!> <!></div> <div class="dp-modal--buttons buttons svelte-1r2cx79"><!></div></dialog>`);
  function Modal($$anchor, $$props) {
    push($$props, true);
    let errorMessage = /* @__PURE__ */ source("");
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
    var dialog_1 = root$i();
    var h1 = /* @__PURE__ */ child(dialog_1);
    var text2 = /* @__PURE__ */ child(h1);
    var div = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(h1, true));
    var p = /* @__PURE__ */ child(div);
    var text_1 = /* @__PURE__ */ child(p);
    var node = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(p, true));
    if_block(node, () => modalState.placeholder || modalState.value, ($$anchor2) => {
      var textarea = root_1$3();
      template_effect(() => {
        set_attribute(textarea, "placeholder", modalState.placeholder);
        set_attribute(textarea, "maxlength", modalState.maxlength < 999 ? modalState.maxlength : 999);
      });
      bind_value(textarea, () => modalState.value, ($$value) => modalState.value = $$value);
      append($$anchor2, textarea);
    });
    var node_1 = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(node, true));
    if_block(node_1, () => get(errorMessage), ($$anchor2) => {
      var p_1 = root_2$3();
      var text_2 = /* @__PURE__ */ child(p_1);
      template_effect(() => set_text(text_2, get(errorMessage)));
      append($$anchor2, p_1);
    });
    var div_1 = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(div, true));
    var node_2 = /* @__PURE__ */ child(div_1);
    if_block(
      node_2,
      () => typeof modalState.onConfirm === "function",
      ($$anchor2) => {
        var fragment = root_3$1();
        var button = /* @__PURE__ */ first_child(fragment);
        button.__click = () => {
          dialog.close();
          modalState.open = false;
          set(errorMessage, "");
        };
        var text_3 = /* @__PURE__ */ child(button);
        template_effect(() => set_text(text_3, t("Modal.cancel")));
        var button_1 = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(button, true));
        button_1.__click = () => {
          const isValidOrErrorMessage = modalState.validation(modalState.value);
          if (isValidOrErrorMessage === true) {
            dialog.close();
            modalState.open = false;
            modalState.onConfirm(modalState.value);
            set(errorMessage, "");
          } else {
            set(errorMessage, proxy(isValidOrErrorMessage));
          }
        };
        var text_4 = /* @__PURE__ */ child(button_1);
        template_effect(() => set_text(text_4, t("Modal.confirm")));
        append($$anchor2, fragment);
      },
      ($$anchor2) => {
        var button_2 = root_4();
        button_2.__click = () => {
          dialog.close();
          modalState.open = false;
          set(errorMessage, "");
        };
        var text_5 = /* @__PURE__ */ child(button_2);
        template_effect(() => set_text(text_5, t("Modal.close")));
        append($$anchor2, button_2);
      }
    );
    template_effect(() => {
      set_text(text2, modalState.title);
      set_text(text_1, modalState.content);
    });
    append($$anchor, dialog_1);
    pop();
  }
  delegate(["click"]);
  function teleport(node, { to, position = "append" }) {
    const teleportContainer = document.querySelector(to);
    if (!teleportContainer) {
      throw new Error(`teleport container not found: ${to}`);
    }
    if (position === "append") {
      teleportContainer.appendChild(node);
    } else {
      teleportContainer.prepend(node);
    }
    return {
      destroy() {
        node.remove();
      }
    };
  }
  var on_click$1 = () => {
    document.querySelector(".dubplus-menu").classList.toggle("dubplus-menu-open");
  };
  var root$h = /* @__PURE__ */ template(`<button type="button" class="dubplus-icon svelte-edw2as"><!></button>`);
  function MenuIcon($$anchor, $$props) {
    push($$props, false);
    init();
    var button = root$h();
    button.__click = [on_click$1];
    var node = /* @__PURE__ */ child(button);
    Logo(node);
    action(button, ($$node, $$action_arg) => teleport($$node, $$action_arg), () => ({ to: ".header-right-navigation" }));
    append($$anchor, button);
    pop();
  }
  delegate(["click"]);
  const makeLink = function(className, fileName) {
    const link2 = document.createElement("link");
    link2.rel = "stylesheet";
    link2.type = "text/css";
    link2.className = className;
    link2.href = fileName;
    return link2;
  };
  function loadCSS(cssFile, className) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`link.${className}`)) {
        resolve();
        return;
      }
      const link2 = makeLink(
        className,
        // @ts-ignore __TIME_STAMP__ is replace by vite
        `${"https://cdn.jsdelivr.net/gh/DubPlus/DubPlus"}${cssFile}?${"1720207854589"}`
      );
      link2.onload = (e) => resolve();
      link2.onerror = reject;
      document.head.appendChild(link2);
    });
  }
  function loadExternalCss(cssFile, className) {
    if (document.querySelector(`link.${className}`)) {
      return;
    }
    const link2 = makeLink(className, cssFile);
    document.head.appendChild(link2);
  }
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
    // this will store all the on/off states
    options: {},
    // this will store the open/close state of the menu sections
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
  console.log("intialSettings", structuredClone(intialSettings));
  let settings$1 = proxy(intialSettings);
  console.log("settings", settings$1);
  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY_NEW, JSON.stringify(settings$1));
    } catch (e) {
      logError("Error saving user settings:", e);
    }
  }
  function saveSetting(section, property, value) {
    if (section === "option") {
      settings$1.options[property] = value;
      persist();
      return;
    }
    if (section === "custom") {
      settings$1.custom[property] = value;
      persist();
      return;
    }
    if (section === "menu") {
      settings$1.menu[property] = value;
      persist();
      return;
    }
    throw new Error(`Invalid section: "${section}"`);
  }
  var root$g = /* @__PURE__ */ template(`<button type="button" class="dubplus-menu-section-header svelte-31yg9a"><span></span> <p class="svelte-31yg9a"> </p></button>`);
  function MenuHeader($$anchor, $$props) {
    push($$props, true);
    let arrow = /* @__PURE__ */ source("down");
    let expanded = /* @__PURE__ */ source(true);
    user_effect(() => {
      if (settings$1.menu[$$props.settingsId] === "closed") {
        set(arrow, "right");
        set(expanded, false);
      } else {
        set(arrow, "down");
        set(expanded, true);
      }
    });
    function toggle() {
      settings$1.menu[$$props.settingsId] = settings$1.menu[$$props.settingsId] === "closed" ? "open" : "closed";
      saveSetting("menu", $$props.settingsId, settings$1.menu[$$props.settingsId]);
    }
    var button = root$g();
    button.__click = toggle;
    var span = /* @__PURE__ */ child(button);
    var p = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(span, true));
    var text2 = /* @__PURE__ */ child(p);
    template_effect(() => {
      set_attribute(button, "id", `dubplus-menu-section-header-${$$props.settingsId}`);
      set_attribute(button, "aria-expanded", get(expanded));
      set_attribute(button, "aria-controls", `dubplus-menu-section-${$$props.settingsId}`);
      set_class(span, `fa fa-angle-${get(arrow) ?? ""} svelte-31yg9a`);
      set_text(text2, $$props.name);
    });
    append($$anchor, button);
    pop();
  }
  delegate(["click"]);
  var root$f = /* @__PURE__ */ template(`<ul class="dubplus-menu-section svelte-nowxlp" role="region"><!></ul>`);
  function MenuSection($$anchor, $$props) {
    push($$props, true);
    var ul = root$f();
    var node = /* @__PURE__ */ child(ul);
    snippet(node, () => $$props.children);
    template_effect(() => {
      set_attribute(ul, "id", `dubplus-menu-section-${$$props.settingsId}`);
      set_attribute(ul, "aria-labelledby", `dubplus-menu-section-header-${$$props.settingsId}`);
    });
    append($$anchor, ul);
    pop();
  }
  var root$e = /* @__PURE__ */ template(`<li class="dubplus-menu-icon svelte-uwa6b6"><span></span> <a class="dubplus-menu-label svelte-uwa6b6" target="_blank"> </a></li>`);
  function MenuLink($$anchor, $$props) {
    var li = root$e();
    var span = /* @__PURE__ */ child(li);
    var a = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(span, true));
    var text_1 = /* @__PURE__ */ child(a);
    template_effect(() => {
      set_class(span, `fa fa-${$$props.icon ?? ""} svelte-uwa6b6`);
      set_attribute(a, "href", $$props.href);
      set_text(text_1, $$props.text);
    });
    append($$anchor, li);
  }
  var root_1$2 = /* @__PURE__ */ template(`<!> <!> <!> <!>`, 1);
  var root$d = /* @__PURE__ */ template(`<!> <!>`, 1);
  function Contact($$anchor, $$props) {
    push($$props, false);
    init();
    var fragment = root$d();
    var node = /* @__PURE__ */ first_child(fragment);
    var name = /* @__PURE__ */ derived_safe_equal(() => t("contact.title"));
    MenuHeader(node, {
      settingsId: "contact",
      get name() {
        return get(name);
      },
      $$legacy: true
    });
    var node_1 = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(node, true));
    MenuSection(node_1, {
      settingsId: "contact",
      children: ($$anchor2, $$slotProps) => {
        var fragment_1 = root_1$2();
        var node_2 = /* @__PURE__ */ first_child(fragment_1);
        var text2 = /* @__PURE__ */ derived_safe_equal(() => t("contact.bugs"));
        MenuLink(node_2, {
          icon: "bug",
          href: "https://discord.gg/XUkG3Qy",
          get text() {
            return get(text2);
          },
          $$legacy: true
        });
        var node_3 = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(node_2, true));
        MenuLink(node_3, {
          icon: "reddit-alien",
          href: "https://www.reddit.com/r/DubPlus/",
          text: "Reddit",
          $$legacy: true
        });
        var node_4 = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(node_3, true));
        MenuLink(node_4, {
          icon: "facebook",
          href: "https://facebook.com/DubPlusScript",
          text: "Facebook",
          $$legacy: true
        });
        var node_5 = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(node_4, true));
        MenuLink(node_5, {
          icon: "twitter",
          href: "https://twitter.com/DubPlusScript",
          text: "Twitter",
          $$legacy: true
        });
        append($$anchor2, fragment_1);
      },
      $$slots: { default: true },
      $$legacy: true
    });
    append($$anchor, fragment);
    pop();
  }
  function handleKeydown(event2, $$props, checked) {
    if ($$props.disabled) return;
    if (event2.key === "Enter" || event2.key === " ") {
      event2.preventDefault();
      set(checked, !get(checked));
      $$props.onToggle(get(checked));
    }
  }
  function handleClick(_, $$props, checked) {
    if ($$props.disabled) return;
    set(checked, !get(checked));
    $$props.onToggle(get(checked));
  }
  var root$c = /* @__PURE__ */ template(`<div role="switch" tabindex="0" class="svelte-dbnfh0"><span class="dubplus-switch svelte-dbnfh0"><span class="svelte-dbnfh0"></span></span> <span class="dubplus-switch-label svelte-dbnfh0"> </span></div>`);
  function Switch($$anchor, $$props) {
    push($$props, true);
    let checked = /* @__PURE__ */ source(proxy(!$$props.disabled ? $$props.isOn : false));
    var div = root$c();
    div.__click = [handleClick, $$props, checked];
    div.__keydown = [handleKeydown, $$props, checked];
    var span = /* @__PURE__ */ child(div);
    var span_2 = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(span, true));
    var text2 = /* @__PURE__ */ child(span_2);
    template_effect(() => {
      set_attribute(div, "aria-checked", get(checked));
      set_text(text2, $$props.label);
    });
    append($$anchor, div);
    pop();
  }
  delegate(["click", "keydown"]);
  function isMod(userid) {
    return window.QueUp.helpers.isSiteAdmin(userid) || window.QueUp.room.users.getIfOwner(userid) || window.QueUp.room.users.getIfManager(userid) || window.QueUp.room.users.getIfMod(userid);
  }
  var root_1$1 = /* @__PURE__ */ template(`<button type="button" class="fa fa-pencil svelte-izs1xx"><span class="sr-only"> </span></button>`);
  var root$b = /* @__PURE__ */ template(`<li class="svelte-izs1xx"><!> <!></li>`);
  function MenuSwitch($$anchor, $$props) {
    push($$props, true);
    onMount(() => {
      if ($$props.init) $$props.init();
      if (settings$1.options[$$props.id]) {
        const status = $$props.modOnly ? isMod(window.QueUp.session.id) : true;
        $$props.onToggle(status, true);
      }
    });
    function openEditModal() {
      console.log("openEditModal", settings$1.options[$$props.id]);
      updateModalState({
        title: t($$props.customize.title),
        content: t($$props.customize.content),
        placeholder: t($$props.customize.placeholder),
        maxlength: $$props.customize.maxlength,
        value: settings$1.custom[$$props.id] || "",
        validation: $$props.customize.validation,
        onConfirm: (value) => {
          saveSetting("custom", $$props.id, value);
          if (typeof $$props.customize.onConfirm === "function") {
            $$props.customize.onConfirm(value);
          }
        },
        onCancel: () => {
          if (typeof $$props.customize.onCancel === "function") $$props.customize.onCancel();
        }
      });
      modalState.open = true;
    }
    var li = root$b();
    template_effect(() => set_attribute(li, "title", t($$props.description)));
    var node = /* @__PURE__ */ child(li);
    var disabled = /* @__PURE__ */ derived(() => $$props.modOnly && !isMod(window.QueUp.session.id));
    var label_1 = /* @__PURE__ */ derived(() => t($$props.label));
    Switch(node, {
      get disabled() {
        return get(disabled);
      },
      get label() {
        return get(label_1);
      },
      onToggle: (state) => {
        if ($$props.customize && state === true && !settings$1.custom[$$props.id]) {
          openEditModal();
          return;
        }
        $$props.onToggle(state);
      },
      get isOn() {
        return settings$1.options[$$props.id];
      }
    });
    var node_1 = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(node, true));
    if_block(node_1, () => $$props.customize, ($$anchor2) => {
      var button = root_1$1();
      button.__click = openEditModal;
      var span = /* @__PURE__ */ child(button);
      var text2 = /* @__PURE__ */ child(span);
      template_effect(() => set_text(text2, t("MenuItem.edit")));
      append($$anchor2, button);
    });
    template_effect(() => {
      set_attribute(li, "id", $$props.id);
      toggle_class(li, "disabled", $$props.modOnly && !isMod(window.QueUp.session.id));
    });
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
    var _a, _b, _c;
    (_c = (_b = (_a = window.QueUp) == null ? void 0 : _a.playerController) == null ? void 0 : _b.voteUp) == null ? void 0 : _c.click();
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
  let canSend = true;
  function afk_chat_respond(e) {
    if (!canSend) {
      return;
    }
    const content = e.message;
    const user = window.QueUp.session.get("username");
    if (content.includes(`@${user}`) && window.QueUp.session.id !== e.user.userInfo.userid) {
      const chatInput = document.querySelector("#chat-txt-message");
      if (settings$1.custom.afk) {
        chatInput.value = `[AFK] ${settings$1.custom.afk}`;
      } else {
        chatInput.value = `[AFK] ${t("afk.modal.placeholder")}`;
      }
      window.QueUp.room.chat.sendMessage();
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
      maxlength: 255
    }
  };
  !function() {
    function e(t3, o2) {
      return n ? void (n.transaction("s").objectStore("s").get(t3).onsuccess = function(e2) {
        var t4 = e2.target.result && e2.target.result.v || null;
        o2(t4);
      }) : void setTimeout(function() {
        e(t3, o2);
      }, 100);
    }
    var t2 = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    if (!t2) return void console.error("indexDB not supported");
    var n, o = { k: "", v: "" }, r = t2.open("d2", 1);
    r.onsuccess = function(e2) {
      n = this.result;
    }, r.onerror = function(e2) {
      console.error("indexedDB request error"), console.log(e2);
    }, r.onupgradeneeded = function(e2) {
      n = null;
      var t3 = e2.target.result.createObjectStore("s", { keyPath: "k" });
      t3.transaction.oncomplete = function(e3) {
        n = e3.target.db;
      };
    }, window.ldb = {
      get: e,
      set: function(e2, t3) {
        o.k = e2, o.v = t3, n.transaction("s", "readwrite").objectStore("s").put(o);
      }
    };
  }();
  function ldbGet(key) {
    return new Promise((resolve) => {
      window.ldb.get(key, function(data) {
        resolve(data);
      });
    });
  }
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
    tastyJSONLoaded: false,
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
      chatRegex: new RegExp(":([-_a-z0-9]+):", "ig")
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
      chatRegex: new RegExp(":([&!()\\-_a-z0-9]+):", "ig")
    },
    tasty: {
      /**
       * @param {string} id
       * @returns {string}
       */
      template(id) {
        return this.emotesMap.get(id).url;
      },
      /**
       * @type {Map<string, {url: string, width: number, height: number}>}
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
      emotesMap: /* @__PURE__ */ new Map(),
      chatRegex: new RegExp(":([-_a-z0-9]+):", "ig")
    },
    /**
     *
     * @param {string} apiName
     * @returns {Promise<boolean>}
     */
    shouldUpdateAPIs(apiName) {
      const day = 864e5;
      return ldbGet(`${apiName}_api`).then((savedItem) => {
        if (savedItem) {
          try {
            const parsed = JSON.parse(savedItem);
            if (typeof parsed.error !== "undefined") {
              return true;
            }
          } catch (e) {
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
            window.ldb.set("twitch_api", JSON.stringify(twitchEmotes));
            dubplus_emoji.processTwitchEmotes(twitchEmotes);
          }).catch((err) => logError(err));
        } else {
          return ldbGet("twitch_api").then((data) => {
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
            window.ldb.set("bttv_api", JSON.stringify(bttvEmotes));
            dubplus_emoji.processBTTVEmotes(bttvEmotes);
          }).catch((err) => logError(err));
        } else {
          return ldbGet("bttv_api").then((data) => {
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
    loadTastyEmotes() {
      if (this.tastyJSONLoaded) {
        return Promise.resolve();
      }
      logInfo("tasty", "loading from api");
      return fetch(`${"https://cdn.jsdelivr.net/gh/DubPlus/DubPlus"}/emotes/tastyemotes.json`).then((res) => res.json()).then((json) => {
        window.ldb.set("tasty_api", JSON.stringify(json));
        dubplus_emoji.processTastyEmotes(json);
      }).catch((err) => logError(err));
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
            window.ldb.set("frankerfacez_api", JSON.stringify(frankerFacez));
            dubplus_emoji.processFrankerFacez(frankerFacez);
          }).catch((err) => logError(err));
        } else {
          return ldbGet("frankerfacez_api").then((data) => {
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
            continue;
          }
          this.twitch.emotesMap.set(key, data[code]);
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
          if (code.indexOf(":") >= 0) {
            continue;
          }
          if (window.emojify.emojiNames.indexOf(key) >= 0) {
            continue;
          }
          if (!this.twitch.emotesMap.has(key)) {
            this.bttv.emotesMap.set(key, data[code]);
          }
        }
      }
      this.bttvJSONSLoaded = true;
    },
    /**
     * @param {{[emote: string]: { url: string; width: number; height: number; }}} data
     */
    processTastyEmotes(data) {
      this.tasty.emotes = data.emotes;
      this.tastyJSONLoaded = true;
      Object.keys(this.tasty.emotes).forEach((key) => {
        this.tasty.emotesMap.set(key, data[key]);
      });
    },
    /**
     * @param {FrankerFacezJsonResponse} data
     */
    processFrankerFacez(data) {
      for (const emoticon of data.emoticons) {
        const code = emoticon.name;
        const key = code.toLowerCase();
        if (code.indexOf(":") >= 0) {
          continue;
        }
        if (window.emojify.emojiNames.includes(key)) {
          continue;
        }
        if (!this.twitch.emotesMap.has(key) && !this.bttv.emotesMap.has(key)) {
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
  function makeImage(type, src, name, w, h) {
    const width = "";
    const height = "";
    return `<img class="emoji ${type}-emote" ${width} ${height} title="${name}" alt="${name}" src="${src}" />`;
  }
  function replaceTwitch(html) {
    if (!dubplus_emoji.twitchJSONSLoaded) {
      return html;
    }
    const _regex = dubplus_emoji.twitch.chatRegex;
    const emoted = html.replace(_regex, function(matched, p1) {
      const key = p1.toLowerCase();
      if (dubplus_emoji.twitch.emotesMap.has(key)) {
        const id = dubplus_emoji.twitch.emotesMap.get(key);
        const src = dubplus_emoji.twitch.template(id);
        return makeImage("twitch", src, key);
      } else {
        return matched;
      }
    });
    return emoted;
  }
  function replaceBttv(html) {
    if (!dubplus_emoji.bttvJSONSLoaded) {
      return html;
    }
    const _regex = dubplus_emoji.bttv.chatRegex;
    const emoted = html.replace(_regex, function(matched, p1) {
      const key = p1.toLowerCase();
      if (dubplus_emoji.bttv.emotesMap.has(key)) {
        const id = dubplus_emoji.bttv.emotesMap.get(key);
        const src = dubplus_emoji.bttv.template(id);
        return makeImage("bttv", src, key);
      } else {
        return matched;
      }
    });
    return emoted;
  }
  function replaceFranker(html) {
    if (!dubplus_emoji.frankerfacezJSONLoaded) {
      return html;
    }
    const _regex = dubplus_emoji.frankerFacez.chatRegex;
    const emoted = html.replace(_regex, function(matched, p1) {
      const key = p1.toLowerCase();
      if (dubplus_emoji.frankerFacez.emotesMap.has(key)) {
        const id = dubplus_emoji.frankerFacez.emotesMap.get(key);
        const src = dubplus_emoji.frankerFacez.template(id);
        return makeImage("frankerFacez", src, key);
      } else {
        return matched;
      }
    });
    return emoted;
  }
  function replaceTextWithEmote() {
    const chats = document.querySelectorAll(
      ".chat-main li:not([data-emote-processed])"
    );
    if (!(chats == null ? void 0 : chats.length)) {
      return;
    }
    chats.forEach((li) => {
      li.setAttribute("data-emote-processed", "true");
      const text2 = li.querySelector(".text");
      if (text2 == null ? void 0 : text2.innerHTML) {
        let processedHTML = replaceTwitch(text2.innerHTML);
        processedHTML = replaceBttv(processedHTML);
        processedHTML = replaceFranker(processedHTML);
        text2.innerHTML = processedHTML;
      }
    });
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
  function reset() {
    emojiState.selectedIndex = 0;
    emojiState.emojiList = [];
  }
  function setEmojiList(listArray) {
    emojiState.emojiList = listArray;
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
  const KEYS = {
    up: "ArrowUp",
    down: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight",
    enter: "Enter",
    esc: "Escape",
    tab: "Tab",
    backspace: "Backspace",
    del: "Delete",
    space: " "
  };
  const keyCharMin = 3;
  let acPreview = document.querySelector("#autocomplete-preview");
  let originalKeyDownEventHandler;
  function getSelection(inputEl) {
    const currentText = inputEl.value;
    const cursorPos = inputEl.selectionStart;
    let goLeft = cursorPos - 1;
    while (currentText[goLeft] !== " " && goLeft > 0) {
      goLeft--;
    }
    if (goLeft > 0 && currentText[goLeft] === " ") {
      goLeft += 1;
    }
    let goRight = cursorPos;
    while (currentText[goRight] !== " " && goRight < currentText.length) {
      goRight++;
    }
    if (goRight !== currentText.length && currentText[goRight] === " ") {
      goRight -= 1;
    }
    return [goLeft, goRight];
  }
  function insertEmote(inputEl, index2) {
    const selected = emojiState.emojiList[index2];
    const [start, end] = getSelection(inputEl);
    const target = inputEl.value.substring(start, end);
    inputEl.value = inputEl.value.replace(target, `:${selected.text}:`);
    reset();
  }
  function checkInput(e) {
    const inputEl = (
      /**@type {HTMLInputElement}*/
      e.target
    );
    const currentText = inputEl.value;
    const cursorPos = inputEl.selectionStart;
    let str = "";
    let goLeft = cursorPos - 1;
    while (currentText[goLeft] !== " " && goLeft >= 0) {
      str = currentText[goLeft] + str;
      goLeft--;
    }
    let goRight = cursorPos;
    while (currentText[goRight] !== " " && goRight < currentText.length) {
      str = str + currentText[goRight];
      goRight++;
    }
    if (str.startsWith(":") && str.length >= keyCharMin && !str.endsWith(":")) {
      const list = dubplus_emoji.findMatchingEmotes(
        str.substring(1).trim(),
        settings$1.options.autocomplete
      );
      setEmojiList(list);
    } else {
      reset();
    }
  }
  function chatInputKeyupFunc(e) {
    const hasItems = acPreview.children.length > 0;
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
        /**@type {HTMLInputElement}*/
        e.target
      );
      insertEmote(inputEl, emojiState.selectedIndex);
      return;
    }
    if (e.key === KEYS.esc && hasItems) {
      reset();
      return;
    }
    checkInput(e);
  }
  function chatInputKeydownFunc(e) {
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
      reset();
      originalKeyDownEventHandler = window.QueUp.room.chat.events["keydown #chat-txt-message"];
      const newEventsObject = { ...window.QueUp.room.chat.events };
      delete newEventsObject["keydown #chat-txt-message"];
      window.QueUp.room.chat.delegateEvents(newEventsObject);
      const chatInput = document.getElementById("chat-txt-message");
      chatInput.addEventListener("keydown", chatInputKeydownFunc);
      chatInput.addEventListener("keyup", chatInputKeyupFunc);
      chatInput.addEventListener("click", checkInput);
    },
    turnOff() {
      reset();
      window.QueUp.room.chat.events["keydown #chat-txt-message"] = originalKeyDownEventHandler;
      window.QueUp.room.chat.delegateEvents(window.QueUp.room.chat.events);
      const chatInput = document.getElementById("chat-txt-message");
      chatInput.removeEventListener("keydown", chatInputKeydownFunc);
      chatInput.removeEventListener("keyup", chatInputKeyupFunc);
      chatInput.removeEventListener("click", checkInput);
    }
  };
  const MODULE_ID$1 = "custom-mentions";
  function customMentionCheck(e) {
    const enabled = settings$1.options[MODULE_ID$1];
    const custom = settings$1.custom[MODULE_ID$1];
    if (enabled && // we only want to play the sound if the message is not from the current user
    window.QueUp.session.id !== e.user.userInfo.userid) {
      const customMentions2 = custom.split(",");
      const shouldPlaySound = customMentions2.some(function(v) {
        const reg = new RegExp("\\b" + v.trim() + "\\b", "i");
        return reg.test(e.message);
      });
      if (shouldPlaySound) {
        window.QueUp.room.chat.mentionChatSound.play();
      }
    }
  }
  const customMentions = {
    id: MODULE_ID$1,
    label: `${MODULE_ID$1}.label`,
    description: `${MODULE_ID$1}.description`,
    category: "general",
    custom: {
      title: `${MODULE_ID$1}.modal.title`,
      content: `${MODULE_ID$1}.modal.content`,
      placeholder: `${MODULE_ID$1}.modal.placeholder`,
      maxlength: 255
    },
    turnOn() {
      window.QueUp.Events.bind(CHAT_MESSAGE, customMentionCheck);
    },
    turnOff() {
      window.QueUp.Events.unbind(CHAT_MESSAGE, customMentionCheck);
    }
  };
  const MODULE_ID = "chat-cleaner";
  function chatCleanerCheck(n) {
    const chatMessages = document.querySelectorAll("ul.chat-main > li");
    const limit = parseInt(n ?? settings$1.custom[MODULE_ID], 10);
    if (!(chatMessages == null ? void 0 : chatMessages.length) || isNaN(limit) || chatMessages.length < limit) {
      return;
    }
    for (let i = 0; i < chatMessages.length - limit; i++) {
      chatMessages[i].remove();
    }
  }
  const chatCleaner = {
    id: MODULE_ID,
    label: `${MODULE_ID}.label`,
    description: `${MODULE_ID}.description`,
    category: "general",
    custom: {
      title: `${MODULE_ID}.modal.title`,
      content: `${MODULE_ID}.modal.content`,
      placeholder: `${MODULE_ID}.modal.placeholder`,
      maxlength: 5,
      validation(val) {
        if (/[^0-9]+/g.test(val)) {
          return t(`${MODULE_ID}.modal.validation`);
        }
        return true;
      },
      onConfirm: (value) => {
        if (settings$1.options[MODULE_ID]) {
          chatCleanerCheck(value);
        }
      }
    },
    turnOn() {
      chatCleanerCheck(void 0);
      window.QueUp.Events.bind(CHAT_MESSAGE, chatCleanerCheck);
    },
    turnOff() {
      window.QueUp.Events.unbind(CHAT_MESSAGE, chatCleanerCheck);
    }
  };
  const activeTabState = proxy({ isActive: true });
  window.onfocus = function() {
    activeTabState.isActive = true;
  };
  window.onblur = function() {
    activeTabState.isActive = false;
  };
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
    if (settings$1.options["custom-mentions"] && settings$1.custom["custom-mentions"]) {
      mentionTriggers = mentionTriggers.concat(settings$1.custom["custom-mentions"].split(",")).map((v) => v.trim());
    }
    const mentionTriggersTest = mentionTriggers.some(function(v) {
      const reg = new RegExp("\\b" + v + "\\b", "i");
      return reg.test(content);
    });
    if (mentionTriggersTest && !activeTabState.isActive && window.QueUp.session.id !== e.user.userInfo.userid) {
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
        settings$1.options[this.id] = false;
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
        const openPmButton = document.querySelector(".user-messages");
        openPmButton == null ? void 0 : openPmButton.click();
        setTimeout(function() {
          const messageItem = document.querySelector(
            `.message-item[data-messageid="${e.messageid}"]`
          );
          messageItem == null ? void 0 : messageItem.click();
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
      }).catch((err) => {
        settings$1.options[this.id] = false;
      });
    },
    turnOff() {
      window.QueUp.Events.unbind(NEW_PM_MESSAGE, pmNotify);
    }
  };
  function djNotificationCheck(e) {
    var _a;
    const currentPosition = parseInt(
      (_a = document.querySelector(".queue-position")) == null ? void 0 : _a.textContent,
      10
    );
    if (isNaN(currentPosition)) {
      logError(
        "dj-notification",
        "Could not parse current position:",
        currentPosition
      );
      return;
    }
    let parseSetting = parseInt(settings$1.custom["dj-notification"], 10);
    if (isNaN(parseSetting)) {
      parseSetting = 2;
      logInfo("djNotification", "Could not parse setting, defaulting to 2");
    }
    if (currentPosition <= parseSetting) {
      showNotification({
        title: t("dj-notification.notification.title"),
        content: t("dj-notification.notification.content"),
        ignoreActiveTab: true,
        wait: 1e4
      });
      window.QueUp.room.chat.mentionChatSound.play();
    }
  }
  const djNotification = {
    id: "dj-notification",
    label: "dj-notification.label",
    description: "dj-notification.description",
    category: "general",
    custom: {
      title: "dj-notification.modal.title",
      content: "dj-notification.modal.content",
      placeholder: "2",
      maxlength: 2,
      onConfirm: (value) => {
        if (/[^0-9]+/.test(value.trim())) {
          window.alert(t("dj-notification.modal.validation"));
          return false;
        }
        return true;
      }
    },
    turnOn() {
      window.QueUp.Events.bind(PLAYLIST_UPDATE, djNotificationCheck);
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
  function userData(userid) {
    return `https://api.queup.net/user/${userid}`;
  }
  function activeDubs(roomId) {
    return `https://api.queup.net/room/${roomId}/playlist/active/dubs`;
  }
  function userImage(userid) {
    return `https://api.queup.net/user/${userid}/image`;
  }
  function getUserName(userid) {
    return new Promise((resolve, reject) => {
      var _a, _b, _c;
      const username = (_c = (_b = (_a = window.QueUp.room.users.collection.findWhere({
        userid
      })) == null ? void 0 : _a.attributes) == null ? void 0 : _b._user) == null ? void 0 : _c.username;
      if (username) {
        resolve(username);
        return;
      }
      fetch(userData(userid)).then((response) => response.json()).then((response) => {
        var _a2;
        if ((_a2 = response == null ? void 0 : response.userinfo) == null ? void 0 : _a2.username) {
          const { username: username2 } = response.userinfo;
          resolve(username2);
        } else {
          reject("Failed to get username from API");
        }
      }).catch(reject);
    });
  }
  function updateUpdubs(updubs) {
    updubs.forEach((dub) => {
      if (dubsState.upDubs.find((el) => el.userid === dub.userid)) {
        return;
      }
      getUserName(dub.userid).then((username) => {
        dubsState.upDubs.push({
          userid: dub.userid,
          username
        });
      }).catch((error) => logError("Failed to get username for upDubs", error));
    });
  }
  function updateDowndubs(downdubs) {
    downdubs.forEach((dub) => {
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
    document.querySelector("ul.chat-main").appendChild(li);
  }
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
        window.QueUp.Events.bind("realtime:room_playlist-dub", downdubWatcher);
      }
    },
    turnOff() {
      window.QueUp.Events.unbind("realtime:room_playlist-dub", downdubWatcher);
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
      window.QueUp.Events.bind("realtime:room_playlist-dub", updubWatcher);
    },
    turnOff() {
      window.QueUp.Events.unbind("realtime:room_playlist-dub", updubWatcher);
    }
  };
  function grabChatWatcher(e) {
    const isUserTheDJ = window.QueUp.session.id === window.QueUp.room.player.activeSong.attributes.song.userid;
    if (isUserTheDJ && !window.QueUp.room.model.get("displayUserGrab")) {
      insertQueupChat(
        "dubplus-chat-system-updub",
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
      window.QueUp.Events.bind(
        "realtime:room_playlist-queue-update-grabs",
        grabChatWatcher
      );
    },
    turnOff() {
      window.QueUp.Events.unbind(
        "realtime:room_playlist-queue-update-grabs",
        grabChatWatcher
      );
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
      var _a;
      this.stopAnimation();
      (_a = this.canvas) == null ? void 0 : _a.remove();
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
  const fullscreen = {
    id: "fullscreen",
    label: "fullscreen.label",
    description: "fullscreen.description",
    category: "user-interface",
    altIcon: "arrows-alt",
    onClick() {
      const elem = (
        /**@type{HTMLIFrameElement}*/
        document.querySelector(".player_container iframe")
      );
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
        let communityCSSUrl = null;
        content.replace(themeCheck, function(match, p1, p2, p3) {
          communityCSSUrl = p3;
        });
        if (!communityCSSUrl) {
          logInfo("No community CSS theme found");
          return;
        }
        logInfo("loading community css theme:", communityCSSUrl);
        loadExternalCss(communityCSSUrl, this.id);
      }).catch((error) => {
        logError("Community CSS: Failed to load room info", error);
      });
    },
    turnOff() {
      var _a;
      (_a = document.querySelector(`.${this.id}`)) == null ? void 0 : _a.remove();
    }
  };
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
        if (!value) {
          return true;
        }
        if (!/^http.+\.css$/.test(value)) {
          return t("custom-css.modal.validation");
        }
        return true;
      },
      onConfirm(value) {
        var _a;
        (_a = document.querySelector(`.${customCss.id}`)) == null ? void 0 : _a.remove();
        if (!value) {
          settings$1.options[customCss.id] = false;
          return;
        }
        loadExternalCss(value, customCss.id);
      }
    },
    turnOn() {
      if (settings$1.custom[this.id]) {
        loadExternalCss(settings$1.custom[this.id], this.id);
      }
    },
    turnOff() {
      var _a;
      (_a = document.querySelector(`.${this.id}`)) == null ? void 0 : _a.remove();
    }
  };
  function makeBGdiv(url, className) {
    const div = document.createElement("div");
    div.className = className;
    div.style.backgroundImage = `url(${url})`;
    return div;
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
        if (!value) {
          return true;
        }
        if (!value.startsWith("http")) {
          return t("custom-bg.modal.validation");
        }
        return true;
      },
      onConfirm(value) {
        var _a;
        (_a = document.querySelector(`.${customBackground.id}`)) == null ? void 0 : _a.remove();
        if (!value) {
          return;
        }
        document.body.appendChild(makeBGdiv(value, customBackground.id));
      }
    },
    turnOn() {
      var _a;
      (_a = document.querySelector(`.${this.id}`)) == null ? void 0 : _a.remove();
      const savedCustomBG = settings$1.custom[this.id];
      if (savedCustomBG) {
        document.body.appendChild(makeBGdiv(savedCustomBG, this.id));
      }
    },
    turnOff() {
      var _a;
      (_a = document.querySelector(`.${this.id}`)) == null ? void 0 : _a.remove();
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
        if (!value) {
          return true;
        }
        if (!window.soundManager.canPlayURL(value)) {
          return t("custom-notification-sound.modal.validation");
        }
        return true;
      },
      onConfirm(value) {
        if (!value) {
          window.QueUp.room.chat.mentionChatSound.url = DubtrackDefaultSound;
          settings$1.options[customNotificationSound.id] = false;
        } else {
          window.QueUp.room.chat.mentionChatSound.url = value;
        }
      }
    },
    turnOn() {
      DubtrackDefaultSound = window.QueUp.room.chat.mentionChatSound.url;
      if (settings$1.custom[this.id]) {
        window.QueUp.room.chat.mentionChatSound.url = settings$1.custom[this.id];
      }
    },
    turnOff() {
      window.QueUp.room.chat.mentionChatSound.url = DubtrackDefaultSound;
    }
  };
  const general = [
    autovote,
    afk,
    emotes,
    autocomplete,
    customMentions,
    chatCleaner,
    mentionNotifications,
    pmNotifications,
    djNotification,
    showDubsOnHover,
    downdubsInChat,
    upDubInChat,
    grabsInChat,
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
    showTimestamps
  ];
  const settings = [spacebarMute, warnOnNavigation];
  const customize = [
    communityTheme,
    customCss,
    customBackground,
    customNotificationSound
  ];
  var root$a = /* @__PURE__ */ template(`<!> <!>`, 1);
  function General($$anchor, $$props) {
    push($$props, false);
    init();
    var fragment = root$a();
    var node = /* @__PURE__ */ first_child(fragment);
    var name = /* @__PURE__ */ derived_safe_equal(() => t("general.title"));
    MenuHeader(node, {
      settingsId: "general",
      get name() {
        return get(name);
      },
      $$legacy: true
    });
    var node_1 = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(node, true));
    MenuSection(node_1, {
      settingsId: "general",
      children: ($$anchor2, $$slotProps) => {
        var fragment_1 = comment();
        var node_2 = /* @__PURE__ */ first_child(fragment_1);
        each(node_2, 1, () => general, index, ($$anchor3, module, $$index) => {
          MenuSwitch($$anchor3, {
            get id() {
              return unwrap(module).id;
            },
            get label() {
              return unwrap(module).label;
            },
            get description() {
              return unwrap(module).description;
            },
            get init() {
              return unwrap(module).init;
            },
            get customize() {
              return unwrap(module).custom;
            },
            get modOnly() {
              return unwrap(module).modOnly;
            },
            onToggle: (on, onMount2) => {
              if (on) unwrap(module).turnOn();
              else unwrap(module).turnOff();
              if (!onMount2) {
                saveSetting("option", unwrap(module).id, on);
              }
            },
            $$legacy: true
          });
        });
        append($$anchor2, fragment_1);
      },
      $$slots: { default: true },
      $$legacy: true
    });
    append($$anchor, fragment);
    pop();
  }
  var root$9 = /* @__PURE__ */ template(`<button type="button" class="icon-history eta_tooltip_t dubplus-btn-player"></button>`);
  function Eta($$anchor, $$props) {
    push($$props, true);
    let eta = /* @__PURE__ */ source("ETA");
    function getEta() {
      var _a, _b;
      const booth_position = (_a = document.querySelector(".queue-position")) == null ? void 0 : _a.textContent;
      if (!booth_position) {
        return t("Eta.tooltip.notInQueue");
      }
      const time = 4;
      const current_time = parseInt((_b = document.querySelector("#player-controller div.left ul li.infoContainer.display-block div.currentTime span.min")) == null ? void 0 : _b.textContent);
      const booth_duration = parseInt(booth_position);
      const booth_time = booth_duration * time - time + current_time;
      if (booth_time >= 0) {
        return t("Eta.tootltip", { minutes: booth_time });
      } else {
        return t("Eta.tooltip.notInQueue");
      }
    }
    var button = root$9();
    template_effect(() => set_attribute(button, "data-dp-tooltip", get(eta)));
    action(button, ($$node, $$action_arg) => teleport($$node, $$action_arg), () => ({ to: ".player_sharing" }));
    event(
      "mouseenter",
      button,
      () => {
        set(eta, proxy(getEta()));
      },
      false
    );
    append($$anchor, button);
    pop();
  }
  var root$8 = /* @__PURE__ */ template(`<button type="button" class="icon-mute snooze_btn dubplus-btn-player"><span class="svelte-1a6zdj2">1</span></button>`);
  function Snooze($$anchor, $$props) {
    push($$props, false);
    const eventUtils = { currentVol: 50, snoozed: false };
    function eventSongAdvance(e) {
      if (e.startTime < 2) {
        if (eventUtils.snoozed) {
          window.QueUp.room.player.setVolume(eventUtils.currentVol);
          eventUtils.snoozed = false;
        }
        return true;
      }
    }
    function snooze() {
      if (!eventUtils.snoozed && !window.QueUp.room.player.muted_player && window.QueUp.playerController.volume > 2) {
        eventUtils.currentVol = window.QueUp.playerController.volume;
        window.QueUp.room.player.mutePlayer();
        eventUtils.snoozed = true;
        window.QueUp.Events.once("realtime:room_playlist-update", eventSongAdvance);
      } else if (eventUtils.snoozed) {
        window.QueUp.room.player.setVolume(eventUtils.currentVol);
        window.QueUp.room.player.updateVolumeBar();
        eventUtils.snoozed = false;
      }
    }
    init();
    var button = root$8();
    template_effect(() => set_attribute(button, "data-dp-tooltip", t("Snooze.tooltip")));
    button.__click = snooze;
    action(button, ($$node, $$action_arg) => teleport($$node, $$action_arg), () => ({ to: ".player_sharing" }));
    append($$anchor, button);
    pop();
  }
  delegate(["click"]);
  var root_2$2 = /* @__PURE__ */ template(`<span class="ac-list-press-enter svelte-2x4f0c"> </span>`);
  var root_1 = /* @__PURE__ */ template(`<li><div class="ac-image svelte-2x4f0c"><img class="svelte-2x4f0c"></div> <span class="ac-text svelte-2x4f0c"> </span> <!></li>`);
  var root$7 = /* @__PURE__ */ template(`<ul id="autocomplete-preview" class="svelte-2x4f0c"></ul>`);
  function EmojiPreview($$anchor, $$props) {
    push($$props, true);
    user_effect(() => {
      if (emojiState.emojiList.length > 0 && typeof emojiState.selectedIndex === "number") {
        const selected = document.querySelector(".preview-item.selected");
        if (selected) {
          selected.scrollIntoView({
            block: "nearest",
            inline: "nearest",
            behavior: "smooth"
          });
        }
      }
    });
    function handleClick2(index2) {
      const inputEl = (
        /**@type {HTMLInputElement}*/
        document.getElementById("chat-txt-message")
      );
      insertEmote(inputEl, index2);
      inputEl.focus();
    }
    var ul = root$7();
    each(
      ul,
      79,
      () => emojiState.emojiList,
      ($$item, i) => {
        let src = () => unwrap(unwrap($$item)).src;
        return src();
      },
      ($$anchor2, $$item, i) => {
        let src = () => unwrap(unwrap($$item)).src;
        let text2 = () => unwrap(unwrap($$item)).text;
        let platform = () => unwrap(unwrap($$item)).platform;
        let alt = () => unwrap(unwrap($$item)).alt;
        var li = root_1();
        li.__click = () => handleClick2(unwrap(i));
        var div = /* @__PURE__ */ child(li);
        var img = /* @__PURE__ */ child(div);
        var span = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(div, true));
        var text_1 = /* @__PURE__ */ child(span);
        var node = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(span, true));
        if_block(node, () => unwrap(i) === emojiState.selectedIndex, ($$anchor3) => {
          var span_1 = root_2$2();
          var text_2 = /* @__PURE__ */ child(span_1);
          template_effect(() => set_text(text_2, t("autocomplete.preview.select")));
          append($$anchor3, span_1);
        });
        template_effect(() => {
          set_class(li, `${`preview-item ${platform()}-previews` ?? ""} svelte-2x4f0c`);
          toggle_class(li, "selected", unwrap(i) === emojiState.selectedIndex);
          set_attribute(img, "src", src());
          set_attribute(img, "alt", alt());
          set_attribute(img, "title", alt());
          set_text(text_1, text2());
        });
        append($$anchor2, li);
      }
    );
    template_effect(() => toggle_class(ul, "ac-show", emojiState.emojiList.length > 0));
    action(ul, ($$node, $$action_arg) => teleport($$node, $$action_arg), () => ({
      to: ".pusher-chat-widget-input",
      position: "prepend"
    }));
    append($$anchor, ul);
    pop();
  }
  delegate(["click"]);
  var on_click = (_, handleClick2, dub) => handleClick2(unwrap(dub).username);
  var root_2$1 = /* @__PURE__ */ template(`<li><div class="dubinfo-image svelte-ujv5bp"><img alt="User Avatar" class="svelte-ujv5bp"></div> <button type="button" class="dubinfo-text svelte-ujv5bp"> </button></li>`);
  var root_3 = /* @__PURE__ */ template(`<li><!></li>`);
  var root$6 = /* @__PURE__ */ template(`<div role="none"><ul id="dubinfo-preview"><!></ul></div>`);
  function DubsInfo($$anchor, $$props) {
    push($$props, true);
    let dubData = /* @__PURE__ */ derived(() => getDubCount($$props.dubType));
    let positionRight = /* @__PURE__ */ source(0);
    let positionBottom = /* @__PURE__ */ source(0);
    let display = /* @__PURE__ */ source("none");
    let hoverTarget;
    function onHover() {
      const rect = hoverTarget.getBoundingClientRect();
      set(positionRight, window.innerWidth - rect.right);
      set(positionBottom, rect.height - 2);
      set(display, "block");
    }
    function onLeave(e) {
      if (e.relatedTarget && /**@type {HTMLDivElement}*/
      e.relatedTarget.closest(".dubplus-dubs-container")) {
        return;
      }
      set(display, "none");
    }
    onMount(() => {
      hoverTarget = document.querySelector(`.dubplus-${$$props.dubType}s-hover`);
      if (hoverTarget) {
        hoverTarget.addEventListener("mouseenter", onHover);
        hoverTarget.addEventListener("mouseleave", onLeave);
      } else {
        logError(`Could not find hover target for ${$$props.dubType} in onMount`);
      }
    });
    onDestroy(() => {
      if (hoverTarget) {
        hoverTarget.removeEventListener("mouseenter", onHover);
        hoverTarget.removeEventListener("mouseleave", onLeave);
      } else {
        logError(`Could not find hover target for ${$$props.dubType} in onDestroy`);
      }
    });
    function handleClick2(username) {
      const chatInput = (
        /**@type {HTMLInputElement}*/
        document.querySelector("#chat-txt-message")
      );
      chatInput.value = `${chatInput.value}@${username} `.trimStart();
      chatInput.focus();
    }
    var div = root$6();
    var ul = /* @__PURE__ */ child(div);
    var node = /* @__PURE__ */ child(ul);
    if_block(
      node,
      () => get(dubData).length > 0,
      ($$anchor2) => {
        var fragment = comment();
        var node_1 = /* @__PURE__ */ first_child(fragment);
        each(node_1, 65, () => get(dubData), index, ($$anchor3, dub, $$index) => {
          var li = root_2$1();
          var div_1 = /* @__PURE__ */ child(li);
          var img = /* @__PURE__ */ child(div_1);
          template_effect(() => set_attribute(img, "src", userImage(unwrap(dub).userid)));
          var button = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(div_1, true));
          button.__click = [on_click, handleClick2, dub];
          var text2 = /* @__PURE__ */ child(button);
          template_effect(() => {
            set_class(li, `${`preview-dubinfo-item users-previews dubplus-${$$props.dubType}-hover` ?? ""} svelte-ujv5bp`);
            set_text(text2, `@${unwrap(dub).username ?? ""}`);
          });
          append($$anchor3, li);
        });
        append($$anchor2, fragment);
      },
      ($$anchor2) => {
        var li_1 = root_3();
        var node_2 = /* @__PURE__ */ child(li_1);
        if_block(
          node_2,
          () => $$props.dubType === "updub" || $$props.dubType === "downdub",
          ($$anchor3) => {
            var text_1 = /* @__PURE__ */ text();
            template_effect(() => set_text(text_1, t("dubs-hover.no-votes", { dubType: $$props.dubType })));
            append($$anchor3, text_1);
          },
          ($$anchor3) => {
            var text_2 = /* @__PURE__ */ text();
            template_effect(() => set_text(text_2, t("dubs-hover.no-grabs", { dubType: $$props.dubType })));
            append($$anchor3, text_2);
          }
        );
        append($$anchor2, li_1);
      }
    );
    template_effect(() => {
      set_attribute(div, "id", `dubplus-${$$props.dubType}s-container`);
      set_class(div, `${`dubplus-dubs-container dubplus-${$$props.dubType}s-container` ?? ""} svelte-ujv5bp`);
      set_attribute(div, "style", `bottom: ${get(positionBottom)}px; right: ${get(positionRight)}px; display: ${get(display)};`);
      set_class(ul, `${`dubinfo-show dubplus-${$$props.dubType}-hover` ?? ""} svelte-ujv5bp`);
      toggle_class(ul, "dubplus-no-dubs", get(dubData).length === 0);
    });
    action(div, ($$node, $$action_arg) => teleport($$node, $$action_arg), () => ({ to: "body" }));
    event("mouseleave", div, () => set(display, "none"), false);
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
    var _a;
    const snowWrapper = getSnowConatiner();
    snowflakesCount = Number(((_a = snowWrapper == null ? void 0 : snowWrapper.dataset) == null ? void 0 : _a.count) || snowflakesCount);
  }
  function generateSnow(snowDensity = 200) {
    snowDensity -= 1;
    const snowWrapper = getSnowConatiner();
    snowWrapper.innerHTML = "";
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
    cssElement.innerHTML = rule;
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
  var root$5 = /* @__PURE__ */ template(`<div id="snow-container" class="svelte-t6y8au"></div>`);
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
    var div = root$5();
    action(div, ($$node, $$action_arg) => teleport($$node, $$action_arg), () => ({ to: "body" }));
    append($$anchor, div);
    pop();
  }
  var root$4 = /* @__PURE__ */ template(`<li class="svelte-1j4s6el"><button type="button" class="svelte-1j4s6el"><span></span> <span class="dubplus-menu-label svelte-1j4s6el"> </span></button></li>`);
  function MenuAction($$anchor, $$props) {
    push($$props, true);
    onMount(() => {
      if ($$props.init) $$props.init();
    });
    var li = root$4();
    template_effect(() => set_attribute(li, "title", t($$props.description)));
    var button = /* @__PURE__ */ child(li);
    button.__click = function(...$$args) {
      const $$callback = $$props.onClick;
      return $$callback == null ? void 0 : $$callback.apply(this, $$args);
    };
    var span = /* @__PURE__ */ child(button);
    var span_1 = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(span, true));
    var text2 = /* @__PURE__ */ child(span_1);
    template_effect(() => set_text(text2, t($$props.label)));
    template_effect(() => {
      set_attribute(li, "id", $$props.id);
      set_class(span, `${`fa fa-${$$props.icon}` ?? ""} svelte-1j4s6el`);
    });
    append($$anchor, li);
    pop();
  }
  delegate(["click"]);
  var root$3 = /* @__PURE__ */ template(`<!> <!>`, 1);
  function UserInterface($$anchor, $$props) {
    push($$props, false);
    init();
    var fragment = root$3();
    var node = /* @__PURE__ */ first_child(fragment);
    var name = /* @__PURE__ */ derived_safe_equal(() => t("user-interface.title"));
    MenuHeader(node, {
      settingsId: "user-interface",
      get name() {
        return get(name);
      },
      $$legacy: true
    });
    var node_1 = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(node, true));
    MenuSection(node_1, {
      settingsId: "user-interface",
      children: ($$anchor2, $$slotProps) => {
        var fragment_1 = comment();
        var node_2 = /* @__PURE__ */ first_child(fragment_1);
        each(node_2, 1, () => userInterface, index, ($$anchor3, module, $$index) => {
          var fragment_2 = comment();
          var node_3 = /* @__PURE__ */ first_child(fragment_2);
          if_block(
            node_3,
            () => unwrap(module).altIcon,
            ($$anchor4) => {
              MenuAction($$anchor4, {
                get id() {
                  return unwrap(module).id;
                },
                get label() {
                  return unwrap(module).label;
                },
                get description() {
                  return unwrap(module).description;
                },
                get icon() {
                  return unwrap(module).altIcon;
                },
                get onClick() {
                  return unwrap(module).onClick;
                },
                get init() {
                  return unwrap(module).init;
                },
                $$legacy: true
              });
            },
            ($$anchor4) => {
              MenuSwitch($$anchor4, {
                get id() {
                  return unwrap(module).id;
                },
                get label() {
                  return unwrap(module).label;
                },
                get description() {
                  return unwrap(module).description;
                },
                get init() {
                  return unwrap(module).init;
                },
                get customize() {
                  return unwrap(module).custom;
                },
                onToggle: (on, onMount2) => {
                  if (on) unwrap(module).turnOn();
                  else unwrap(module).turnOff();
                  if (!onMount2) {
                    saveSetting("option", unwrap(module).id, on);
                  }
                },
                $$legacy: true
              });
            }
          );
          append($$anchor3, fragment_2);
        });
        append($$anchor2, fragment_1);
      },
      $$slots: { default: true },
      $$legacy: true
    });
    append($$anchor, fragment);
    pop();
  }
  var root$2 = /* @__PURE__ */ template(`<!> <!>`, 1);
  function Settings($$anchor, $$props) {
    push($$props, false);
    settings.forEach((module) => {
      if (!settings$1.options[module.id]) {
        settings$1.options[module.id] = false;
      }
    });
    init();
    var fragment = root$2();
    var node = /* @__PURE__ */ first_child(fragment);
    var name = /* @__PURE__ */ derived_safe_equal(() => t("settings.title"));
    MenuHeader(node, {
      settingsId: "settings",
      get name() {
        return get(name);
      },
      $$legacy: true
    });
    var node_1 = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(node, true));
    MenuSection(node_1, {
      settingsId: "settings",
      children: ($$anchor2, $$slotProps) => {
        var fragment_1 = comment();
        var node_2 = /* @__PURE__ */ first_child(fragment_1);
        each(node_2, 1, () => settings, index, ($$anchor3, module, $$index) => {
          MenuSwitch($$anchor3, {
            get id() {
              return unwrap(module).id;
            },
            get label() {
              return unwrap(module).label;
            },
            get description() {
              return unwrap(module).description;
            },
            get init() {
              return unwrap(module).init;
            },
            get customize() {
              return unwrap(module).custom;
            },
            onToggle: (on, onMount2) => {
              if (on) unwrap(module).turnOn();
              else unwrap(module).turnOff();
              if (!onMount2) {
                saveSetting("option", unwrap(module).id, on);
              }
            },
            $$legacy: true
          });
        });
        append($$anchor2, fragment_1);
      },
      $$slots: { default: true },
      $$legacy: true
    });
    append($$anchor, fragment);
    pop();
  }
  var root$1 = /* @__PURE__ */ template(`<!> <!>`, 1);
  function Customize($$anchor, $$props) {
    push($$props, false);
    init();
    var fragment = root$1();
    var node = /* @__PURE__ */ first_child(fragment);
    var name = /* @__PURE__ */ derived_safe_equal(() => t("customize.title"));
    MenuHeader(node, {
      settingsId: "customize",
      get name() {
        return get(name);
      },
      $$legacy: true
    });
    var node_1 = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(node, true));
    MenuSection(node_1, {
      settingsId: "customize",
      children: ($$anchor2, $$slotProps) => {
        var fragment_1 = comment();
        var node_2 = /* @__PURE__ */ first_child(fragment_1);
        each(node_2, 1, () => customize, index, ($$anchor3, module, $$index) => {
          MenuSwitch($$anchor3, {
            get id() {
              return unwrap(module).id;
            },
            get label() {
              return unwrap(module).label;
            },
            get description() {
              return unwrap(module).description;
            },
            get init() {
              return unwrap(module).init;
            },
            get customize() {
              return unwrap(module).custom;
            },
            onToggle: (on, onMount2) => {
              if (on) unwrap(module).turnOn();
              else unwrap(module).turnOff();
              if (!onMount2) {
                saveSetting("option", unwrap(module).id, on);
              }
            },
            $$legacy: true
          });
        });
        append($$anchor2, fragment_1);
      },
      $$slots: { default: true },
      $$legacy: true
    });
    append($$anchor, fragment);
    pop();
  }
  var root_2 = /* @__PURE__ */ template(`<!> <!> <!>`, 1);
  var root = /* @__PURE__ */ template(`<!> <!> <!> <!> <!> <!> <section class="dubplus-menu svelte-1rqspoo"><p class="dubplus-menu-header svelte-1rqspoo"> </p> <!> <!> <!> <!> <!></section> <!>`, 1);
  function Menu($$anchor, $$props) {
    push($$props, false);
    onMount(() => {
      loadExternalCss("https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css", "dp-font-awesome");
      document.querySelector("html").classList.add("dubplus");
    });
    init();
    var fragment = root();
    var node = /* @__PURE__ */ first_child(fragment);
    MenuIcon(node, { $$legacy: true });
    var node_1 = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(node, true));
    Snooze(node_1, { $$legacy: true });
    var node_2 = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(node_1, true));
    Eta(node_2, { $$legacy: true });
    var node_3 = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(node_2, true));
    if_block(node_3, () => settings$1.options.autocomplete, ($$anchor2) => {
      EmojiPreview($$anchor2, { $$legacy: true });
    });
    var node_4 = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(node_3, true));
    if_block(node_4, () => settings$1.options["dubs-hover"], ($$anchor2) => {
      var fragment_2 = root_2();
      var node_5 = /* @__PURE__ */ first_child(fragment_2);
      DubsInfo(node_5, { dubType: "updub", $$legacy: true });
      var node_6 = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(node_5, true));
      DubsInfo(node_6, { dubType: "downdub", $$legacy: true });
      var node_7 = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(node_6, true));
      DubsInfo(node_7, { dubType: "grab", $$legacy: true });
      append($$anchor2, fragment_2);
    });
    var node_8 = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(node_4, true));
    if_block(node_8, () => settings$1.options.snow, ($$anchor2) => {
      Snow($$anchor2, { $$legacy: true });
    });
    var section = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(node_8, true));
    var p = /* @__PURE__ */ child(section);
    var text2 = /* @__PURE__ */ child(p);
    template_effect(() => set_text(text2, t("Menu.title")));
    var node_9 = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(p, true));
    General(node_9, { $$legacy: true });
    var node_10 = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(node_9, true));
    UserInterface(node_10, { $$legacy: true });
    var node_11 = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(node_10, true));
    Settings(node_11, { $$legacy: true });
    var node_12 = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(node_11, true));
    Customize(node_12, { $$legacy: true });
    var node_13 = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(node_12, true));
    Contact(node_13, { $$legacy: true });
    var node_14 = /* @__PURE__ */ sibling(/* @__PURE__ */ sibling(section, true));
    Modal(node_14, { $$legacy: true });
    append($$anchor, fragment);
    pop();
  }
  function DubPlus($$anchor, $$props) {
    push($$props, true);
    let status = /* @__PURE__ */ source("loading");
    function setLocale() {
      locale.current = normalizeLocale(navigator.language || "en");
    }
    {
      loadCSS("/dist/dubplus.min.css", "dubplus-css");
    }
    onMount(() => {
      setLocale();
      window.addEventListener("languagechange", setLocale);
    });
    onDestroy(() => {
      window.removeEventListener("languagechange", setLocale);
    });
    const checkList = [
      "QueUp.session.id",
      "QueUp.room.chat",
      "QueUp.Events",
      "QueUp.room.player",
      "QueUp.helpers.cookie",
      "QueUp.room.model",
      "QueUp.room.users"
    ];
    waitFor(checkList).then(() => {
      set(status, "ready");
    }).catch(() => {
      var _a, _b;
      if (!((_b = (_a = window.QueUp) == null ? void 0 : _a.session) == null ? void 0 : _b.id)) {
        set(status, "loggedout");
      } else {
        set(status, "error");
      }
    });
    function showErrorModal(content) {
      modalState.title = t("Error.modal.title");
      modalState.content = content;
      modalState.onCancel = () => {
        modalState.open = false;
      };
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
    var node = /* @__PURE__ */ first_child(fragment);
    if_block(
      node,
      () => get(status) === "loading",
      ($$anchor2) => {
        Loading($$anchor2, {});
      },
      ($$anchor2) => {
        var fragment_2 = comment();
        var node_1 = /* @__PURE__ */ first_child(fragment_2);
        if_block(
          node_1,
          () => get(status) === "ready",
          ($$anchor3) => {
            Menu($$anchor3, {});
          },
          ($$anchor3) => {
            Modal($$anchor3, {});
          },
          true
        );
        append($$anchor2, fragment_2);
      }
    );
    append($$anchor, fragment);
    pop();
  }
  let container = document.getElementById("dubplus-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "dubplus-container";
    document.body.appendChild(container);
  }
  const app = mount(DubPlus, {
    target: container
  });
  return app;
}();
