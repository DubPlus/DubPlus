var dubplus = (function () {
  'use strict'; /*!
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
  const noop = () => {};
  function run(fn) {
    return fn();
  }
  function run_all(arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i]();
    }
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
  const HEAD_EFFECT = 1 << 19;
  const EFFECT_HAS_DERIVED = 1 << 20;
  const STATE_SYMBOL = Symbol('$state');
  const LOADING_ATTR_SYMBOL = Symbol('');
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
  function state_unsafe_local_read() {
    {
      throw new Error(`https://svelte.dev/e/state_unsafe_local_read`);
    }
  }
  function state_unsafe_mutation() {
    {
      throw new Error(`https://svelte.dev/e/state_unsafe_mutation`);
    }
  }
  let legacy_mode_flag = false;
  let tracing_mode_flag = false;
  function enable_legacy_mode_flag() {
    legacy_mode_flag = true;
  }
  const EACH_ITEM_REACTIVE = 1;
  const EACH_INDEX_REACTIVE = 1 << 1;
  const EACH_IS_CONTROLLED = 1 << 2;
  const EACH_IS_ANIMATED = 1 << 3;
  const EACH_ITEM_IMMUTABLE = 1 << 4;
  const TEMPLATE_FRAGMENT = 1;
  const TEMPLATE_USE_IMPORT_NODE = 1 << 1;
  const UNINITIALIZED = Symbol();
  function lifecycle_outside_component(name) {
    {
      throw new Error(`https://svelte.dev/e/lifecycle_outside_component`);
    }
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
      m: false,
      s: props,
      x: null,
      l: null,
    };
    if (legacy_mode_flag && !runes) {
      component_context.l = {
        s: null,
        u: null,
        r1: [],
        r2: source(false),
      };
    }
  }
  function pop(component2) {
    const context_stack_item = component_context;
    if (context_stack_item !== null) {
      const component_effects = context_stack_item.e;
      if (component_effects !== null) {
        var previous_effect = active_effect;
        var previous_reaction = active_reaction;
        context_stack_item.e = null;
        try {
          for (var i = 0; i < component_effects.length; i++) {
            var component_effect = component_effects[i];
            set_active_effect(component_effect.effect);
            set_active_reaction(component_effect.reaction);
            effect(component_effect.fn);
          }
        } finally {
          set_active_effect(previous_effect);
          set_active_reaction(previous_reaction);
        }
      }
      component_context = context_stack_item.p;
      context_stack_item.m = true;
    }
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
  function state(v) {
    return /* @__PURE__ */ push_derived_source(source(v));
  }
  // @__NO_SIDE_EFFECTS__
  function mutable_source(initial_value, immutable = false) {
    var _a;
    const s = source(initial_value);
    if (!immutable) {
      s.equals = safe_equals;
    }
    if (
      legacy_mode_flag &&
      component_context !== null &&
      component_context.l !== null
    ) {
      ((_a = component_context.l).s ?? (_a.s = [])).push(s);
    }
    return s;
  }
  // @__NO_SIDE_EFFECTS__
  function push_derived_source(source2) {
    if (
      active_reaction !== null &&
      !untracking &&
      (active_reaction.f & DERIVED) !== 0
    ) {
      if (derived_sources === null) {
        set_derived_sources([source2]);
      } else {
        derived_sources.push(source2);
      }
    }
    return source2;
  }
  function set(source2, value) {
    if (
      active_reaction !== null &&
      !untracking &&
      is_runes() &&
      (active_reaction.f & (DERIVED | BLOCK_EFFECT)) !== 0 && // If the source was created locally within the current derived, then
      // we allow the mutation.
      (derived_sources === null || !derived_sources.includes(source2))
    ) {
      state_unsafe_mutation();
    }
    return internal_set(source2, value);
  }
  function internal_set(source2, value) {
    if (!source2.equals(value)) {
      source2.v;
      source2.v = value;
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
  function mark_reactions(signal, status) {
    var reactions = signal.reactions;
    if (reactions === null) return;
    var runes = is_runes();
    var length = reactions.length;
    for (var i = 0; i < length; i++) {
      var reaction = reactions[i];
      var flags = reaction.f;
      if ((flags & DIRTY) !== 0) continue;
      if (!runes && reaction === active_effect) continue;
      set_signal_status(reaction, status);
      if ((flags & (CLEAN | UNOWNED)) !== 0) {
        if ((flags & DERIVED) !== 0) {
          mark_reactions(
            /** @type {Derived} */
            reaction,
            MAYBE_DIRTY,
          );
        } else {
          schedule_effect(
            /** @type {Effect} */
            reaction,
          );
        }
      }
    }
  }
  let hydrating = false;
  function proxy(value, parent = null, prev) {
    if (typeof value !== 'object' || value === null || STATE_SYMBOL in value) {
      return value;
    }
    const prototype = get_prototype_of(value);
    if (prototype !== object_prototype && prototype !== array_prototype) {
      return value;
    }
    var sources = /* @__PURE__ */ new Map();
    var is_proxied_array = is_array(value);
    var version = source(0);
    if (is_proxied_array) {
      sources.set(
        'length',
        source(
          /** @type {any[]} */
          value.length,
        ),
      );
    }
    var metadata;
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
            s = source(descriptor.value);
            sources.set(prop, s);
          } else {
            set(s, proxy(descriptor.value, metadata));
          }
          return true;
        },
        deleteProperty(target, prop) {
          var s = sources.get(prop);
          if (s === void 0) {
            if (prop in target) {
              sources.set(prop, source(UNINITIALIZED));
            }
          } else {
            if (is_proxied_array && typeof prop === 'string') {
              var ls =
                /** @type {Source<number>} */
                sources.get('length');
              var n = Number(prop);
              if (Number.isInteger(n) && n < ls.v) {
                set(ls, n);
              }
            }
            set(s, UNINITIALIZED);
            update_version(version);
          }
          return true;
        },
        get(target, prop, receiver) {
          var _a;
          if (prop === STATE_SYMBOL) {
            return value;
          }
          var s = sources.get(prop);
          var exists = prop in target;
          if (
            s === void 0 &&
            (!exists ||
              ((_a = get_descriptor(target, prop)) == null
                ? void 0
                : _a.writable))
          ) {
            s = source(proxy(exists ? target[prop] : UNINITIALIZED, metadata));
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
          var _a;
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
                ((_a = get_descriptor(target, prop)) == null
                  ? void 0
                  : _a.writable)))
          ) {
            if (s === void 0) {
              s = source(has ? proxy(target[prop], metadata) : UNINITIALIZED);
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
          var _a;
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
                other_s = source(UNINITIALIZED);
                sources.set(i + '', other_s);
              }
            }
          }
          if (s === void 0) {
            if (
              !has ||
              ((_a = get_descriptor(target, prop)) == null
                ? void 0
                : _a.writable)
            ) {
              s = source(void 0);
              set(s, proxy(value2, metadata));
              sources.set(prop, s);
            }
          } else {
            has = s.v !== UNINITIALIZED;
            set(s, proxy(value2, metadata));
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
            update_version(version);
          }
          return true;
        },
        ownKeys(target) {
          get(version);
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
  function update_version(signal, d = 1) {
    set(signal, signal.v + d);
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
    first_child_getter = get_descriptor(node_prototype, 'firstChild').get;
    next_sibling_getter = get_descriptor(node_prototype, 'nextSibling').get;
    element_prototype.__click = void 0;
    element_prototype.__className = '';
    element_prototype.__attributes = null;
    element_prototype.__styles = null;
    element_prototype.__e = void 0;
    Text.prototype.__t = void 0;
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
      active_effect.f |= EFFECT_HAS_DERIVED;
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
        null,
      wv: 0,
      parent: parent_derived ?? active_effect,
    };
    return signal;
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
    var status =
      (skip_reaction || (derived2.f & UNOWNED) !== 0) && derived2.deps !== null
        ? MAYBE_DIRTY
        : CLEAN;
    set_signal_status(derived2, status);
    if (!derived2.equals(value)) {
      derived2.v = value;
      derived2.wv = increment_write_version();
    }
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
    var is_root = (type & ROOT_EFFECT) !== 0;
    var parent_effect = active_effect;
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
      parent: is_root ? null : parent_effect,
      prev: null,
      teardown: null,
      transitions: null,
      wv: 0,
    };
    if (sync) {
      var previously_flushing_effect = is_flushing_effect;
      try {
        set_is_flushing_effect(true);
        update_effect(effect2);
        effect2.f |= EFFECT_RAN;
      } catch (e) {
        destroy_effect(effect2);
        throw e;
      } finally {
        set_is_flushing_effect(previously_flushing_effect);
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
      (effect2.f & (EFFECT_HAS_DERIVED | BOUNDARY_EFFECT)) === 0;
    if (!inert && !is_root && push2) {
      if (parent_effect !== null) {
        push_effect(effect2, parent_effect);
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
    var defer =
      active_effect !== null &&
      (active_effect.f & BRANCH_EFFECT) !== 0 &&
      component_context !== null &&
      !component_context.m;
    if (defer) {
      var context =
        /** @type {ComponentContext} */
        component_context;
      (context.e ?? (context.e = [])).push({
        fn,
        effect: active_effect,
        reaction: active_reaction,
      });
    } else {
      var signal = effect(fn);
      return signal;
    }
  }
  function user_pre_effect(fn) {
    validate_effect();
    return render_effect(fn);
  }
  function component_root(fn) {
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
  function render_effect(fn) {
    return create_effect(RENDER_EFFECT, fn, true);
  }
  function template_effect(fn, thunks = [], d = derived) {
    const deriveds = thunks.map(d);
    const effect2 = () => fn(...deriveds.map(get));
    return block(effect2);
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
      var next = effect2.next;
      destroy_effect(effect2, remove_dom);
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
      effect2.nodes_start !== null
    ) {
      var node = effect2.nodes_start;
      var end = effect2.nodes_end;
      while (node !== null) {
        var next =
          node === end
            ? null
            : /** @type {TemplateNode} */
              /* @__PURE__ */ get_next_sibling(node);
        node.remove();
        node = next;
      }
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
        null;
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
      effect2.f ^= CLEAN;
    }
    if (check_dirtiness(effect2)) {
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
  let is_throwing_error = false;
  let is_micro_task_queued = false;
  let last_scheduled_effect = null;
  let is_flushing_effect = false;
  let is_destroying_effect = false;
  function set_is_flushing_effect(value) {
    is_flushing_effect = value;
  }
  function set_is_destroying_effect(value) {
    is_destroying_effect = value;
  }
  let queued_root_effects = [];
  let flush_count = 0;
  let dev_effect_stack = [];
  let active_reaction = null;
  let untracking = false;
  function set_active_reaction(reaction) {
    active_reaction = reaction;
  }
  let active_effect = null;
  function set_active_effect(effect2) {
    active_effect = effect2;
  }
  let derived_sources = null;
  function set_derived_sources(sources) {
    derived_sources = sources;
  }
  let new_deps = null;
  let skipped_deps = 0;
  let untracked_writes = null;
  function set_untracked_writes(value) {
    untracked_writes = value;
  }
  let write_version = 1;
  let read_version = 0;
  let skip_reaction = false;
  function increment_write_version() {
    return ++write_version;
  }
  function check_dirtiness(reaction) {
    var _a;
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
        if (is_disconnected || is_unowned_connected) {
          var derived2 =
            /** @type {Derived} */
            reaction;
          var parent = derived2.parent;
          for (i = 0; i < length; i++) {
            dependency = dependencies[i];
            if (
              is_disconnected ||
              !((_a = dependency == null ? void 0 : dependency.reactions) ==
              null
                ? void 0
                : _a.includes(derived2))
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
            check_dirtiness(
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
  function propagate_error(error, effect2) {
    var current = effect2;
    while (current !== null) {
      if ((current.f & BOUNDARY_EFFECT) !== 0) {
        try {
          current.fn(error);
          return;
        } catch {
          current.f ^= BOUNDARY_EFFECT;
        }
      }
      current = current.parent;
    }
    is_throwing_error = false;
    throw error;
  }
  function should_rethrow_error(effect2) {
    return (
      (effect2.f & DESTROYED) === 0 &&
      (effect2.parent === null || (effect2.parent.f & BOUNDARY_EFFECT) === 0)
    );
  }
  function handle_error(error, effect2, previous_effect, component_context2) {
    if (is_throwing_error) {
      if (previous_effect === null) {
        is_throwing_error = false;
      }
      if (should_rethrow_error(effect2)) {
        throw error;
      }
      return;
    }
    if (previous_effect !== null) {
      is_throwing_error = true;
    }
    {
      propagate_error(error, effect2);
      return;
    }
  }
  function schedule_possible_effect_self_invalidation(
    signal,
    effect2,
    root2 = true,
  ) {
    var reactions = signal.reactions;
    if (reactions === null) return;
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
    var _a;
    var previous_deps = new_deps;
    var previous_skipped_deps = skipped_deps;
    var previous_untracked_writes = untracked_writes;
    var previous_reaction = active_reaction;
    var previous_skip_reaction = skip_reaction;
    var prev_derived_sources = derived_sources;
    var previous_component_context = component_context;
    var previous_untracking = untracking;
    var flags = reaction.f;
    new_deps = /** @type {null | Value[]} */ null;
    skipped_deps = 0;
    untracked_writes = null;
    active_reaction =
      (flags & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
    skip_reaction =
      (flags & UNOWNED) !== 0 &&
      (!is_flushing_effect ||
        previous_reaction === null ||
        previous_untracking);
    derived_sources = null;
    set_component_context(reaction.ctx);
    untracking = false;
    read_version++;
    try {
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
        if (!skip_reaction) {
          for (i = skipped_deps; i < deps.length; i++) {
            ((_a = deps[i]).reactions ?? (_a.reactions = [])).push(reaction);
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
      if (previous_reaction !== null) {
        read_version++;
      }
      return result;
    } finally {
      new_deps = previous_deps;
      skipped_deps = previous_skipped_deps;
      untracked_writes = previous_untracked_writes;
      active_reaction = previous_reaction;
      skip_reaction = previous_skip_reaction;
      derived_sources = prev_derived_sources;
      set_component_context(previous_component_context);
      untracking = previous_untracking;
    }
  }
  function remove_reaction(signal, dependency) {
    let reactions = dependency.reactions;
    if (reactions !== null) {
      var index2 = index_of.call(reactions, signal);
      if (index2 !== -1) {
        var new_length = reactions.length - 1;
        if (new_length === 0) {
          reactions = dependency.reactions = null;
        } else {
          reactions[index2] = reactions[new_length];
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
    var previous_component_context = component_context;
    active_effect = effect2;
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
      var deps = effect2.deps;
      var dep;
      if (
        DEV &&
        tracing_mode_flag &&
        (effect2.f & DIRTY) !== 0 &&
        deps !== null
      );
      if (DEV);
    } catch (error) {
      handle_error(
        error,
        effect2,
        previous_effect,
        previous_component_context || effect2.ctx,
      );
    } finally {
      active_effect = previous_effect;
    }
  }
  function infinite_loop_guard() {
    if (flush_count > 1e3) {
      flush_count = 0;
      try {
        effect_update_depth_exceeded();
      } catch (error) {
        if (last_scheduled_effect !== null) {
          {
            handle_error(error, last_scheduled_effect, null);
          }
        } else {
          throw error;
        }
      }
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
        if ((effect2.f & CLEAN) === 0) {
          effect2.f ^= CLEAN;
        }
        var collected_effects = process_effects(effect2);
        flush_queued_effects(collected_effects);
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
      if ((effect2.f & (DESTROYED | INERT)) === 0) {
        try {
          if (check_dirtiness(effect2)) {
            update_effect(effect2);
            if (
              effect2.deps === null &&
              effect2.first === null &&
              effect2.nodes_start === null
            ) {
              if (effect2.teardown === null) {
                unlink_effect(effect2);
              } else {
                effect2.fn = null;
              }
            }
          }
        } catch (error) {
          handle_error(error, effect2, null, effect2.ctx);
        }
      }
    }
  }
  function process_deferred() {
    is_micro_task_queued = false;
    if (flush_count > 1001) {
      return;
    }
    const previous_queued_root_effects = queued_root_effects;
    queued_root_effects = [];
    flush_queued_root_effects(previous_queued_root_effects);
    if (!is_micro_task_queued) {
      flush_count = 0;
      last_scheduled_effect = null;
    }
  }
  function schedule_effect(signal) {
    {
      if (!is_micro_task_queued) {
        is_micro_task_queued = true;
        queueMicrotask(process_deferred);
      }
    }
    last_scheduled_effect = signal;
    var effect2 = signal;
    while (effect2.parent !== null) {
      effect2 = effect2.parent;
      var flags = effect2.f;
      if ((flags & (ROOT_EFFECT | BRANCH_EFFECT)) !== 0) {
        if ((flags & CLEAN) === 0) return;
        effect2.f ^= CLEAN;
      }
    }
    queued_root_effects.push(effect2);
  }
  function process_effects(effect2) {
    var effects = [];
    var current_effect = effect2.first;
    main_loop: while (current_effect !== null) {
      var flags = current_effect.f;
      var is_branch = (flags & BRANCH_EFFECT) !== 0;
      var is_skippable_branch = is_branch && (flags & CLEAN) !== 0;
      var sibling2 = current_effect.next;
      if (!is_skippable_branch && (flags & INERT) === 0) {
        if ((flags & EFFECT) !== 0) {
          effects.push(current_effect);
        } else if (is_branch) {
          current_effect.f ^= CLEAN;
        } else {
          var previous_active_reaction = active_reaction;
          try {
            active_reaction = current_effect;
            if (check_dirtiness(current_effect)) {
              update_effect(current_effect);
            }
          } catch (error) {
            handle_error(error, current_effect, null, current_effect.ctx);
          } finally {
            active_reaction = previous_active_reaction;
          }
        }
        var child2 = current_effect.first;
        if (child2 !== null) {
          current_effect = child2;
          continue;
        }
      }
      if (sibling2 === null) {
        let parent = current_effect.parent;
        while (parent !== null) {
          if (effect2 === parent) {
            break main_loop;
          }
          var parent_sibling = parent.next;
          if (parent_sibling !== null) {
            current_effect = parent_sibling;
            continue main_loop;
          }
          parent = parent.parent;
        }
      }
      current_effect = sibling2;
    }
    return effects;
  }
  function get(signal) {
    var flags = signal.f;
    var is_derived = (flags & DERIVED) !== 0;
    if (active_reaction !== null && !untracking) {
      if (derived_sources !== null && derived_sources.includes(signal)) {
        state_unsafe_local_read();
      }
      var deps = active_reaction.deps;
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
    if (is_derived) {
      derived2 = /** @type {Derived} */ signal;
      if (check_dirtiness(derived2)) {
        update_derived(derived2);
      }
    }
    return signal.v;
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
  function is_passive_event(name) {
    return PASSIVE_EVENTS.includes(name);
  }
  let listening_to_form_reset = false;
  function add_form_reset_listener() {
    if (!listening_to_form_reset) {
      listening_to_form_reset = true;
      document.addEventListener(
        'reset',
        (evt) => {
          Promise.resolve().then(() => {
            var _a;
            if (!evt.defaultPrevented) {
              /**@type {HTMLFormElement} */
              for (const e of evt.target.elements) {
                (_a = e.__on_r) == null ? void 0 : _a.call(e);
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
    var owner_document =
      /** @type {Node} */
      handler_element.ownerDocument;
    var event_name = event2.type;
    var path =
      ((_a = event2.composedPath) == null ? void 0 : _a.call(event2)) || [];
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
            delegated !== void 0 &&
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
    elem.innerHTML = html;
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
  function template(content, flags) {
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
  function ns_template(content, flags, ns = 'svg') {
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
        var _a;
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
          (_a = anchor_node.parentNode) == null
            ? void 0
            : _a.removeChild(anchor_node);
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
    const update_branch = (new_condition, fn2) => {
      if (condition === (condition = new_condition)) return;
      if (condition) {
        if (consequent_effect) {
          resume_effect(consequent_effect);
        } else if (fn2) {
          consequent_effect = branch(() => fn2(anchor));
        }
        if (alternate_effect) {
          pause_effect(alternate_effect, () => {
            alternate_effect = null;
          });
        }
      } else {
        if (alternate_effect) {
          resume_effect(alternate_effect);
        } else if (fn2) {
          alternate_effect = branch(() => fn2(anchor));
        }
        if (consequent_effect) {
          pause_effect(consequent_effect, () => {
            consequent_effect = null;
          });
        }
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
  function index(_, i) {
    return i;
  }
  function pause_effects(state2, items, controlled_anchor, items_map) {
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
      link(state2, items[0].prev, items[length - 1].next);
    }
    run_out_transitions(transitions, () => {
      for (var i2 = 0; i2 < length; i2++) {
        var item = items[i2];
        if (!is_controlled) {
          items_map.delete(item.k);
          link(state2, item.prev, item.next);
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
    var state2 = { items: /* @__PURE__ */ new Map(), first: null };
    var is_controlled = (flags & EACH_IS_CONTROLLED) !== 0;
    if (is_controlled) {
      var parent_node =
        /** @type {Element} */
        node;
      anchor = parent_node.appendChild(create_text());
    }
    var fallback = null;
    var was_empty = false;
    var each_array = /* @__PURE__ */ derived_safe_equal(() => {
      var collection = get_collection();
      return is_array(collection)
        ? collection
        : collection == null
          ? []
          : array_from(collection);
    });
    block(() => {
      var array = get(each_array);
      var length = array.length;
      if (was_empty && length === 0) {
        return;
      }
      was_empty = length === 0;
      {
        reconcile(
          array,
          state2,
          anchor,
          render_fn,
          flags,
          get_key,
          get_collection,
        );
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
      get(each_array);
    });
  }
  function reconcile(
    array,
    state2,
    anchor,
    render_fn,
    flags,
    get_key,
    get_collection,
  ) {
    var _a, _b, _c, _d;
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
          (_a = item.a) == null ? void 0 : _a.measure();
          (to_animate ?? (to_animate = /* @__PURE__ */ new Set())).add(item);
        }
      }
    }
    for (i = 0; i < length; i += 1) {
      value = array[i];
      key = get_key(value, i);
      item = items.get(key);
      if (item === void 0) {
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
            link(state2, a.prev, b.next);
            link(state2, prev, a);
            link(state2, b, start);
            current = start;
            prev = b;
            i -= 1;
            matched = [];
            stashed = [];
          } else {
            seen.delete(item);
            move(item, current, anchor);
            link(state2, item.prev, item.next);
            link(state2, item, prev === null ? state2.first : prev.next);
            link(state2, prev, item);
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
        pause_effects(state2, to_destroy, controlled_anchor, items);
      }
    }
    if (is_animated) {
      queue_micro_task(() => {
        var _a2;
        if (to_animate === void 0) return;
        for (item of to_animate) {
          (_a2 = item.a) == null ? void 0 : _a2.apply();
        }
      });
    }
    active_effect.first = state2.first && state2.first.e;
    active_effect.last = prev && prev.e;
  }
  function update_item(item, value, index2, type) {
    if ((type & EACH_ITEM_REACTIVE) !== 0) {
      internal_set(item.v, value);
    }
    if ((type & EACH_INDEX_REACTIVE) !== 0) {
      internal_set(
        /** @type {Value<number>} */
        item.i,
        index2,
      );
    } else {
      item.i = index2;
    }
  }
  function create_item(
    anchor,
    state2,
    prev,
    next,
    value,
    key,
    index2,
    render_fn,
    flags,
    get_collection,
  ) {
    var reactive = (flags & EACH_ITEM_REACTIVE) !== 0;
    var mutable = (flags & EACH_ITEM_IMMUTABLE) === 0;
    var v = reactive
      ? mutable
        ? /* @__PURE__ */ mutable_source(value)
        : source(value)
      : value;
    var i = (flags & EACH_INDEX_REACTIVE) === 0 ? index2 : source(index2);
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
      item.e = branch(() => render_fn(anchor, v, i, get_collection), hydrating);
      item.e.prev = prev && prev.e;
      item.e.next = next && next.e;
      if (prev === null) {
        state2.first = item;
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
    while (node !== end) {
      var next_node =
        /** @type {TemplateNode} */
        /* @__PURE__ */ get_next_sibling(node);
      dest.before(node);
      node = next_node;
    }
  }
  function link(state2, prev, next) {
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
    block(() => {
      if (component2 === (component2 = get_component())) return;
      if (effect2) {
        pause_effect(effect2);
        effect2 = null;
      }
      if (component2) {
        effect2 = branch(() => render_fn(anchor, component2));
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
  function set_attribute(element, attribute, value, skip_warning) {
    var attributes = element.__attributes ?? (element.__attributes = {});
    if (attributes[attribute] === (attributes[attribute] = value)) return;
    if (attribute === 'style' && '__styles' in element) {
      element.__styles = {};
    }
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
  function set_class(dom, value, hash) {
    var prev_class_name = dom.__className;
    var next_class_name = to_class(value);
    if (prev_class_name !== next_class_name || hydrating) {
      if (value == null && true) {
        dom.removeAttribute('class');
      } else {
        dom.className = next_class_name;
      }
      dom.__className = next_class_name;
    }
  }
  function to_class(value, hash) {
    return (value == null ? '' : value) + '';
  }
  function toggle_class(dom, class_name, value) {
    if (value) {
      if (dom.classList.contains(class_name)) return;
      dom.classList.add(class_name);
    } else {
      if (!dom.classList.contains(class_name)) return;
      dom.classList.remove(class_name);
    }
  }
  function bind_value(input, get2, set2 = get2) {
    var runes = is_runes();
    listen_to_event_and_reset_event(input, 'input', (is_reset) => {
      var value = is_reset ? input.defaultValue : input.value;
      value = is_numberlike_input(input) ? to_number(value) : value;
      set2(value);
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
    }
    render_effect(() => {
      var value = get2();
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
      let version = 0;
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
        if (changed) version++;
        return version;
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
  if (typeof window !== 'undefined')
    (
      window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })
    ).v.add(PUBLIC_VERSION);
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
  function deepCheck(dottedString, startingScope = window) {
    const props = dottedString.split('.');
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
  var root$r = /* @__PURE__ */ ns_template(
    `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 0 2078.496 2083.914" enable-background="new 0 0 2078.496 2083.914" xml:space="preserve"><rect x="769.659" y="772.445" fill-rule="evenodd" clip-rule="evenodd" fill="#660078" width="539.178" height="539.178"></rect><g><rect x="1308.837" y="772.445" fill-rule="evenodd" clip-rule="evenodd" fill="#EB008B" width="537.488" height="539.178"></rect><polygon fill="#EB008B" points="2045.015,1042.035 1845.324,1311.625 1845.324,772.446 	"></polygon></g><g><rect x="232.172" y="772.445" fill-rule="evenodd" clip-rule="evenodd" fill="#EB008B" width="537.487" height="539.178"></rect><polygon fill="#EB008B" points="33.481,1042.034 233.172,772.445 233.172,1311.623 	"></polygon></g><g><rect x="769.659" y="1311.624" fill-rule="evenodd" clip-rule="evenodd" fill="#6FCBDC" width="539.178" height="537.487"></rect><polygon fill="#6FCBDC" points="1039.248,2047.802 769.659,1848.111 1308.837,1848.111 	"></polygon></g><g><rect x="769.659" y="234.958" fill-rule="evenodd" clip-rule="evenodd" fill="#6FCBDC" width="539.178" height="537.487"></rect><polygon fill="#6FCBDC" points="1039.249,35.268 1308.837,235.958 769.659,235.958 	"></polygon></g></svg>`,
  );
  function Logo($$anchor) {
    var svg = root$r();
    append($$anchor, svg);
  }
  const translations = {
    en: {
      'Modal.confirm': 'OK',
      'Modal.cancel': 'Cancel',
      'Modal.close': 'Close',
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
        'You have dismissed or chosen to deny the request to allow desktop notifications. Reset this choice by clearing your cache for the site.',
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
      'afk.modal.content':
        "Enter a custom Away From Keyboard [AFK] message here. Message will be prefixed with '[AFK]'",
      'afk.modal.placeholder': 'Be right back!',
      'auto-afk.label': 'Auto AFK',
      'auto-afk.description':
        'Automatically set yourself to AFK after a certain amount of time of inactivity',
      'auto-afk.modal.title': 'Auto AFK Timer',
      'auto-afk.modal.content':
        'Enter the amount of time, in minutes, before you are set to AFK. Default is 30 minutes',
      'auto-afk.modal.validation': 'Value must be a number greater than 0',
      'emotes.label': 'Emotes',
      'emotes.description':
        'Adds Twitch, Bttv, and FrankerFacez emotes in chat.',
      'autocomplete.label': 'Autocomplete Emoji',
      'autocomplete.description':
        'Toggle autocompleting emojis and emotes. Shows a preview box in the chat',
      'autocomplete.preview.select': 'press enter or tab to select',
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
      'chat-cleaner.modal.validation': 'Please enter a valid number',
      'chat-cleaner.modal.placeholder': '500',
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
        'Please specify the position in queue you want to be notified at',
      'dj-notification.notification.title': 'DJ Alert!',
      'dj-notification.notification.content':
        'You will be DJing shortly! Make sure your song is set!',
      'dj-notification.modal.validation': 'Please enter a valid number',
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
  function normalizeLocale(loc) {
    if (loc.startsWith('en')) {
      return 'en';
    }
    return loc;
  }
  var root$q = /* @__PURE__ */ template(
    `<div class="dubplus-waiting svelte-16mmbc"><div style="width: 26px; margin-right:5px"><!></div> <span style="flex: 1;"> </span></div>`,
  );
  function Loading($$anchor, $$props) {
    push($$props, false);
    init();
    var div = root$q();
    var div_1 = child(div);
    var node = child(div_1);
    Logo(node);
    var span = sibling(div_1, 2);
    var text2 = child(span);
    template_effect(
      ($0) => set_text(text2, $0),
      [() => t('Loading.text')],
      derived_safe_equal,
    );
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
    modalState.maxlength = nextState.maxlength || 999;
    modalState.onConfirm =
      nextState.onConfirm ||
      (() => {
        return true;
      });
    modalState.onCancel = nextState.onCancel || (() => {});
    modalState.validation = nextState.validation || (() => true);
  }
  var root_1$3 = /* @__PURE__ */ template(`<textarea class="svelte-1mnr24t">
      </textarea>`);
  var root_2$3 = /* @__PURE__ */ template(
    `<p class="dp-modal--error svelte-1mnr24t"> </p>`,
  );
  var root_3$1 = /* @__PURE__ */ template(
    `<button class="dp-modal--cancel cancel svelte-1mnr24t"> </button> <button class="dp-modal--confirm confirm svelte-1mnr24t"> </button>`,
    1,
  );
  var root_4 = /* @__PURE__ */ template(
    `<button class="dp-modal--cancel cancel svelte-1mnr24t"> </button>`,
  );
  var root$p = /* @__PURE__ */ template(
    `<dialog id="dubplus-dialog" class="dp-modal svelte-1mnr24t"><h1 class="svelte-1mnr24t"> </h1> <div class="dp-modal--content content svelte-1mnr24t"><p class="svelte-1mnr24t"> </p> <!> <!></div> <div class="dp-modal--buttons buttons svelte-1mnr24t"><!></div></dialog>`,
  );
  function Modal($$anchor, $$props) {
    push($$props, true);
    let errorMessage = state('');
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
    var dialog_1 = root$p();
    var h1 = child(dialog_1);
    var text2 = child(h1);
    var div = sibling(h1, 2);
    var p = child(div);
    var text_1 = child(p);
    var node = sibling(p, 2);
    {
      var consequent = ($$anchor2) => {
        var textarea = root_1$3();
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
      if_block(node, ($$render) => {
        if (modalState.placeholder || modalState.value) $$render(consequent);
      });
    }
    var node_1 = sibling(node, 2);
    {
      var consequent_1 = ($$anchor2) => {
        var p_1 = root_2$3();
        var text_2 = child(p_1);
        template_effect(() => set_text(text_2, get(errorMessage)));
        append($$anchor2, p_1);
      };
      if_block(node_1, ($$render) => {
        if (get(errorMessage)) $$render(consequent_1);
      });
    }
    var div_1 = sibling(div, 2);
    var node_2 = child(div_1);
    {
      var consequent_2 = ($$anchor2) => {
        var fragment = root_3$1();
        var button = first_child(fragment);
        button.__click = () => {
          dialog.close();
          modalState.open = false;
          set(errorMessage, '');
        };
        var text_3 = child(button);
        var button_1 = sibling(button, 2);
        button_1.__click = () => {
          const isValidOrErrorMessage = modalState.validation(modalState.value);
          if (isValidOrErrorMessage === true) {
            dialog.close();
            modalState.open = false;
            modalState.onConfirm(modalState.value);
            set(errorMessage, '');
          } else {
            set(errorMessage, proxy(isValidOrErrorMessage));
          }
        };
        var text_4 = child(button_1);
        template_effect(
          ($0, $1) => {
            set_text(text_3, $0);
            set_text(text_4, $1);
          },
          [() => t('Modal.cancel'), () => t('Modal.confirm')],
        );
        append($$anchor2, fragment);
      };
      var alternate = ($$anchor2) => {
        var button_2 = root_4();
        button_2.__click = () => {
          dialog.close();
          modalState.open = false;
          set(errorMessage, '');
        };
        var text_5 = child(button_2);
        template_effect(($0) => set_text(text_5, $0), [() => t('Modal.close')]);
        append($$anchor2, button_2);
      };
      if_block(node_2, ($$render) => {
        if (typeof modalState.onConfirm === 'function') $$render(consequent_2);
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
      var _a;
      if (node.id) {
        (_a = document.getElementById(node.id)) == null ? void 0 : _a.remove();
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
  var on_click$1 = () => {
    document
      .querySelector('.dubplus-menu')
      .classList.toggle('dubplus-menu-open');
  };
  var root$o = /* @__PURE__ */ template(
    `<button id="dubplus-menu-icon" type="button" aria-label="Dub+ menu" class="dubplus-icon svelte-9z7rrn"><!></button>`,
  );
  function MenuIcon($$anchor, $$props) {
    push($$props, false);
    init();
    var button = root$o();
    button.__click = [on_click$1];
    var node = child(button);
    Logo(node);
    action(
      button,
      ($$node, $$action_arg) =>
        teleport == null ? void 0 : teleport($$node, $$action_arg),
      () => ({ to: '.header-right-navigation' }),
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
    // this will store all the on/off states
    options: {},
    // this will store the open/close state of the menu sections
    menu: {
      general: 'open',
      'user-interface': 'open',
      settings: 'open',
      customize: 'open',
      contact: 'open',
    },
    // this will store the user inputs from the modals for features that support it
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
  var root$n = /* @__PURE__ */ template(
    `<button type="button" class="dubplus-menu-section-header svelte-31yg9a"><span></span> <p class="svelte-31yg9a"> </p></button>`,
  );
  function MenuHeader($$anchor, $$props) {
    push($$props, true);
    let arrow = state('down');
    let expanded = state(true);
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
    var button = root$n();
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
      set_class(span, `fa fa-angle-${get(arrow) ?? ''} svelte-31yg9a`);
      set_text(text2, $$props.name);
    });
    append($$anchor, button);
    pop();
  }
  delegate(['click']);
  var root$m = /* @__PURE__ */ template(
    `<ul class="dubplus-menu-section svelte-m5z2p2" role="region"><!></ul>`,
  );
  function MenuSection($$anchor, $$props) {
    var ul = root$m();
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
  var root$l = /* @__PURE__ */ template(
    `<li class="dubplus-menu-icon svelte-1oilhp7"><!> <a class="dubplus-menu-label svelte-1oilhp7" target="_blank"> </a></li>`,
  );
  function MenuLink($$anchor, $$props) {
    var li = root$l();
    var node = child(li);
    component(
      node,
      () => $$props.icon,
      ($$anchor2, $$component) => {
        $$component($$anchor2, {});
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
  var root$k = /* @__PURE__ */ ns_template(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0c53 0 96 43 96 96l0 3.6c0 15.7-12.7 28.4-28.4 28.4l-135.1 0c-15.7 0-28.4-12.7-28.4-28.4l0-3.6c0-53 43-96 96-96zM41.4 105.4c12.5-12.5 32.8-12.5 45.3 0l64 64c.7 .7 1.3 1.4 1.9 2.1c14.2-7.3 30.4-11.4 47.5-11.4l112 0c17.1 0 33.2 4.1 47.5 11.4c.6-.7 1.2-1.4 1.9-2.1l64-64c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-64 64c-.7 .7-1.4 1.3-2.1 1.9c6.2 12 10.1 25.3 11.1 39.5l64.3 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c0 24.6-5.5 47.8-15.4 68.6c2.2 1.3 4.2 2.9 6 4.8l64 64c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0l-63.1-63.1c-24.5 21.8-55.8 36.2-90.3 39.6L272 240c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 239.2c-34.5-3.4-65.8-17.8-90.3-39.6L86.6 502.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l64-64c1.9-1.9 3.9-3.4 6-4.8C101.5 367.8 96 344.6 96 320l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64.3 0c1.1-14.1 5-27.5 11.1-39.5c-.7-.6-1.4-1.2-2.1-1.9l-64-64c-12.5-12.5-12.5-32.8 0-45.3z"></path></svg>`,
  );
  function IconBug($$anchor) {
    var svg = root$k();
    append($$anchor, svg);
  }
  var root$j = /* @__PURE__ */ ns_template(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32zM305.9 166.4c20.6 0 37.3-16.7 37.3-37.3s-16.7-37.3-37.3-37.3c-18 0-33.1 12.8-36.6 29.8c-30.2 3.2-53.8 28.8-53.8 59.9l0 .2c-32.8 1.4-62.8 10.7-86.6 25.5c-8.8-6.8-19.9-10.9-32-10.9c-28.9 0-52.3 23.4-52.3 52.3c0 21 12.3 39 30.1 47.4c1.7 60.7 67.9 109.6 149.3 109.6s147.6-48.9 149.3-109.7c17.7-8.4 29.9-26.4 29.9-47.3c0-28.9-23.4-52.3-52.3-52.3c-12 0-23 4-31.9 10.8c-24-14.9-54.3-24.2-87.5-25.4l0-.1c0-22.2 16.5-40.7 37.9-43.7l0 0c3.9 16.5 18.7 28.7 36.3 28.7zM155 248.1c14.6 0 25.8 15.4 25 34.4s-11.8 25.9-26.5 25.9s-27.5-7.7-26.6-26.7s13.5-33.5 28.1-33.5zm166.4 33.5c.9 19-12 26.7-26.6 26.7s-25.6-6.9-26.5-25.9c-.9-19 10.3-34.4 25-34.4s27.3 14.6 28.1 33.5zm-42.1 49.6c-9 21.5-30.3 36.7-55.1 36.7s-46.1-15.1-55.1-36.7c-1.1-2.6 .7-5.4 3.4-5.7c16.1-1.6 33.5-2.5 51.7-2.5s35.6 .9 51.7 2.5c2.7 .3 4.5 3.1 3.4 5.7z"></path></svg>`,
  );
  function IconReddit($$anchor) {
    var svg = root$j();
    append($$anchor, svg);
  }
  var root$i = /* @__PURE__ */ ns_template(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64h98.2V334.2H109.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H255V480H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"></path></svg>`,
  );
  function IconFacebook($$anchor) {
    var svg = root$i();
    append($$anchor, svg);
  }
  var root$h = /* @__PURE__ */ ns_template(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM351.3 199.3v0c0 86.7-66 186.6-186.6 186.6c-37.2 0-71.7-10.8-100.7-29.4c5.3 .6 10.4 .8 15.8 .8c30.7 0 58.9-10.4 81.4-28c-28.8-.6-53-19.5-61.3-45.5c10.1 1.5 19.2 1.5 29.6-1.2c-30-6.1-52.5-32.5-52.5-64.4v-.8c8.7 4.9 18.9 7.9 29.6 8.3c-9-6-16.4-14.1-21.5-23.6s-7.8-20.2-7.7-31c0-12.2 3.2-23.4 8.9-33.1c32.3 39.8 80.8 65.8 135.2 68.6c-9.3-44.5 24-80.6 64-80.6c18.9 0 35.9 7.9 47.9 20.7c14.8-2.8 29-8.3 41.6-15.8c-4.9 15.2-15.2 28-28.8 36.1c13.2-1.4 26-5.1 37.8-10.2c-8.9 13.1-20.1 24.7-32.9 34c.2 2.8 .2 5.7 .2 8.5z"></path></svg>`,
  );
  function IconTwitter($$anchor) {
    var svg = root$h();
    append($$anchor, svg);
  }
  var root_1$2 = /* @__PURE__ */ template(`<!> <!> <!> <!>`, 1);
  var root$g = /* @__PURE__ */ template(`<!> <!>`, 1);
  function Contact($$anchor, $$props) {
    push($$props, false);
    init();
    var fragment = root$g();
    var node = first_child(fragment);
    const expression = /* @__PURE__ */ derived_safe_equal(() =>
      t('contact.title'),
    );
    MenuHeader(node, {
      settingsId: 'contact',
      get name() {
        return get(expression);
      },
    });
    var node_1 = sibling(node, 2);
    MenuSection(node_1, {
      settingsId: 'contact',
      children: ($$anchor2, $$slotProps) => {
        var fragment_1 = root_1$2();
        var node_2 = first_child(fragment_1);
        const expression_1 = /* @__PURE__ */ derived_safe_equal(() =>
          t('contact.bugs'),
        );
        MenuLink(node_2, {
          icon: IconBug,
          href: 'https://discord.gg/XUkG3Qy',
          get text() {
            return get(expression_1);
          },
        });
        var node_3 = sibling(node_2, 2);
        MenuLink(node_3, {
          icon: IconReddit,
          href: 'https://www.reddit.com/r/DubPlus/',
          text: 'Reddit',
        });
        var node_4 = sibling(node_3, 2);
        MenuLink(node_4, {
          icon: IconFacebook,
          href: 'https://facebook.com/DubPlusScript',
          text: 'Facebook',
        });
        var node_5 = sibling(node_4, 2);
        MenuLink(node_5, {
          icon: IconTwitter,
          href: 'https://twitter.com/DubPlusScript',
          text: 'Twitter',
        });
        append($$anchor2, fragment_1);
      },
    });
    append($$anchor, fragment);
    pop();
  }
  function handleKeydown(event2, $$props, checked) {
    if ($$props.disabled) return;
    if (event2.key === 'Enter' || event2.key === ' ') {
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
  var root$f = /* @__PURE__ */ template(
    `<div role="switch" tabindex="0" class="svelte-1mny4ma"><span class="dubplus-switch svelte-1mny4ma"><span class="svelte-1mny4ma"></span></span> <span class="dubplus-switch-label svelte-1mny4ma"> </span></div>`,
  );
  function Switch($$anchor, $$props) {
    push($$props, true);
    let checked = state(proxy(!$$props.disabled ? $$props.isOn : false));
    var div = root$f();
    div.__click = [handleClick, $$props, checked];
    div.__keydown = [handleKeydown, $$props, checked];
    var span = sibling(child(div), 2);
    var text2 = child(span);
    template_effect(() => {
      set_attribute(div, 'aria-disabled', $$props.disabled ? 'true' : 'false');
      set_attribute(div, 'aria-checked', get(checked) ? 'true' : 'false');
      set_text(text2, $$props.label);
    });
    append($$anchor, div);
    pop();
  }
  delegate(['click', 'keydown']);
  var root$e = /* @__PURE__ */ ns_template(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg>`,
  );
  function IconPencil($$anchor) {
    var svg = root$e();
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
  var root_1$1 = /* @__PURE__ */ template(
    `<button type="button" class="svelte-1dzj03i"><!> <span class="sr-only"> </span></button>`,
  );
  var root$d = /* @__PURE__ */ template(
    `<li class="svelte-1dzj03i"><!> <!></li>`,
  );
  function MenuSwitch($$anchor, $$props) {
    push($$props, true);
    onMount(() => {
      if ($$props.init) $$props.init();
      if (settings.options[$$props.id]) {
        const status = $$props.modOnly ? isMod(window.QueUp.session.id) : true;
        $$props.onToggle(status, true);
      }
    });
    function openEditModal() {
      updateModalState({
        title: t($$props.customize.title),
        content: t($$props.customize.content),
        placeholder: t($$props.customize.placeholder),
        maxlength: $$props.customize.maxlength,
        value: settings.custom[$$props.id] || '',
        validation: $$props.customize.validation,
        onConfirm: (value) => {
          saveSetting('custom', $$props.id, value);
          if (typeof $$props.customize.onConfirm === 'function') {
            $$props.customize.onConfirm(value);
          }
        },
        onCancel: () => {
          if (typeof $$props.customize.onCancel === 'function')
            $$props.customize.onCancel();
        },
      });
      modalState.open = true;
    }
    var li = root$d();
    var node = child(li);
    const expression = /* @__PURE__ */ derived(() =>
      $$props.modOnly ? !isMod(window.QueUp.session.id) : false,
    );
    const expression_1 = /* @__PURE__ */ derived(() => t($$props.label));
    Switch(node, {
      get disabled() {
        return get(expression);
      },
      get label() {
        return get(expression_1);
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
        $$props.onToggle(state2);
      },
      get isOn() {
        return settings.options[$$props.id];
      },
    });
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
    template_effect(
      ($0, $1) => {
        set_attribute(li, 'id', `dubplus-${$$props.id}`);
        set_attribute(li, 'title', $0);
        toggle_class(li, 'disabled', $1);
      },
      [
        () => t($$props.description),
        () => ($$props.modOnly ? !isMod(window.QueUp.session.id) : false),
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
    var _a, _b, _c;
    (_c =
      (_b = (_a = window.QueUp) == null ? void 0 : _a.playerController) == null
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
    document.querySelector('ul.chat-main').appendChild(li);
  }
  function sendChatMessage(message) {
    const chatInput = document.querySelector('#chat-txt-message');
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
      maxlength: 255,
    },
  };
  !(function () {
    function e(t3, o2) {
      return n
        ? void (n.transaction('s').objectStore('s').get(t3).onsuccess =
            function (e2) {
              var t4 = (e2.target.result && e2.target.result.v) || null;
              o2(t4);
            })
        : void setTimeout(function () {
            e(t3, o2);
          }, 100);
    }
    var t2 =
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB;
    if (!t2) return void console.error('indexDB not supported');
    var n,
      o = { k: '', v: '' },
      r = t2.open('d2', 1);
    (r.onsuccess = function (e2) {
      n = this.result;
    }),
      (r.onerror = function (e2) {
        console.error('indexedDB request error'), console.log(e2);
      }),
      (r.onupgradeneeded = function (e2) {
        n = null;
        var t3 = e2.target.result.createObjectStore('s', { keyPath: 'k' });
        t3.transaction.oncomplete = function (e3) {
          n = e3.target.db;
        };
      }),
      (window.ldb = {
        get: e,
        set: function (e2, t3) {
          (o.k = e2),
            (o.v = t3),
            n.transaction('s', 'readwrite').objectStore('s').put(o);
        },
      });
  })();
  function ldbGet(key) {
    return new Promise((resolve) => {
      window.ldb.get(key, function (data) {
        resolve(data);
      });
    });
  }
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
      chatRegex: new RegExp(':([-_a-z0-9]+):', 'ig'),
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
      chatRegex: new RegExp(':([&!()\\-_a-z0-9]+):', 'ig'),
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
      chatRegex: new RegExp(':([-_a-z0-9]+):', 'ig'),
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
            if (typeof parsed.error !== 'undefined') {
              return true;
            }
          } catch (e) {
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
              window.ldb.set('twitch_api', JSON.stringify(twitchEmotes));
              dubplus_emoji.processTwitchEmotes(twitchEmotes);
            })
            .catch((err) => logError(err));
        } else {
          return ldbGet('twitch_api').then((data) => {
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
              window.ldb.set('bttv_api', JSON.stringify(bttvEmotes));
              dubplus_emoji.processBTTVEmotes(bttvEmotes);
            })
            .catch((err) => logError(err));
        } else {
          return ldbGet('bttv_api').then((data) => {
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
    loadTastyEmotes() {
      if (this.tastyJSONLoaded) {
        return Promise.resolve();
      }
      logInfo('tasty', 'loading from api');
      return fetch(
        `${'https://cdn.jsdelivr.net/gh/DubPlus/DubPlus@refactor-svelte'}/emotes/tastyemotes.json`,
      )
        .then((res) => res.json())
        .then((json) => {
          window.ldb.set('tasty_api', JSON.stringify(json));
          dubplus_emoji.processTastyEmotes(json);
        })
        .catch((err) => logError(err));
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
              window.ldb.set('frankerfacez_api', JSON.stringify(frankerFacez));
              dubplus_emoji.processFrankerFacez(frankerFacez);
            })
            .catch((err) => logError(err));
        } else {
          return ldbGet('frankerfacez_api').then((data) => {
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
          if (code.indexOf(':') >= 0) {
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
        if (code.indexOf(':') >= 0) {
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
  function makeImage(type, src, name, w, h) {
    const width = '';
    const height = '';
    return `<img class="emoji ${type}-emote" ${width} ${height} title="${name}" alt="${name}" src="${src}" />`;
  }
  function replaceTwitch(html) {
    if (!dubplus_emoji.twitchJSONSLoaded) {
      return html;
    }
    const _regex = dubplus_emoji.twitch.chatRegex;
    const emoted = html.replace(_regex, function (matched, p1) {
      const key = p1.toLowerCase();
      if (dubplus_emoji.twitch.emotesMap.has(key)) {
        const id = dubplus_emoji.twitch.emotesMap.get(key);
        const src = dubplus_emoji.twitch.template(id);
        return makeImage('twitch', src, key);
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
    const emoted = html.replace(_regex, function (matched, p1) {
      const key = p1.toLowerCase();
      if (dubplus_emoji.bttv.emotesMap.has(key)) {
        const id = dubplus_emoji.bttv.emotesMap.get(key);
        const src = dubplus_emoji.bttv.template(id);
        return makeImage('bttv', src, key);
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
    const emoted = html.replace(_regex, function (matched, p1) {
      const key = p1.toLowerCase();
      if (dubplus_emoji.frankerFacez.emotesMap.has(key)) {
        const id = dubplus_emoji.frankerFacez.emotesMap.get(key);
        const src = dubplus_emoji.frankerFacez.template(id);
        return makeImage('frankerFacez', src, key);
      } else {
        return matched;
      }
    });
    return emoted;
  }
  function replaceTextWithEmote() {
    const chats = document.querySelectorAll(
      '.chat-main li:not([data-emote-processed])',
    );
    if (!(chats == null ? void 0 : chats.length)) {
      return;
    }
    chats.forEach((li) => {
      li.setAttribute('data-emote-processed', 'true');
      const text2 = li.querySelector('.text');
      if (text2 == null ? void 0 : text2.innerHTML) {
        let processedHTML = replaceTwitch(text2.innerHTML);
        processedHTML = replaceBttv(processedHTML);
        processedHTML = replaceFranker(processedHTML);
        text2.innerHTML = processedHTML;
      }
    });
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
  function reset() {
    emojiState.selectedIndex = 0;
    emojiState.emojiList = [];
  }
  function setEmojiList(listArray) {
    emojiState.emojiList = listArray.filter(
      (emoji, index2, self) =>
        index2 ===
        self.findIndex(
          (e) => e.src === emoji.src && e.platform === emoji.platform,
        ),
    );
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
  const MIN_CHAR = 3;
  let acPreview = document.querySelector('#autocomplete-preview');
  let originalKeyDownEventHandler;
  function insertEmote(inputEl, index2) {
    const selected = emojiState.emojiList[index2];
    const [start, end] = getSelection(inputEl.value, inputEl.selectionStart);
    const target = inputEl.value.substring(start, end);
    inputEl.value = inputEl.value.replace(target, `:${selected.text}:`);
    reset();
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
      const list = dubplus_emoji.findMatchingEmotes(
        str.substring(1).trim(),
        settings.options.emotes,
      );
      setEmojiList(list);
    } else {
      reset();
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
    if (e.key === KEYS.esc && hasItems) {
      reset();
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
      reset();
      originalKeyDownEventHandler =
        window.QueUp.room.chat.events['keydown #chat-txt-message'];
      const newEventsObject = { ...window.QueUp.room.chat.events };
      delete newEventsObject['keydown #chat-txt-message'];
      window.QueUp.room.chat.delegateEvents(newEventsObject);
      const chatInput = document.getElementById('chat-txt-message');
      chatInput.addEventListener('keydown', chatInputKeydownFunc);
      chatInput.addEventListener('keyup', chatInputKeyupFunc);
      chatInput.addEventListener('click', checkInput);
    },
    turnOff() {
      reset();
      window.QueUp.room.chat.events['keydown #chat-txt-message'] =
        originalKeyDownEventHandler;
      window.QueUp.room.chat.delegateEvents(window.QueUp.room.chat.events);
      const chatInput = document.getElementById('chat-txt-message');
      chatInput.removeEventListener('keydown', chatInputKeydownFunc);
      chatInput.removeEventListener('keyup', chatInputKeyupFunc);
      chatInput.removeEventListener('click', checkInput);
    },
  };
  const MODULE_ID$1 = 'custom-mentions';
  function customMentionCheck(e) {
    const enabled = settings.options[MODULE_ID$1];
    const custom = settings.custom[MODULE_ID$1];
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
    id: MODULE_ID$1,
    label: `${MODULE_ID$1}.label`,
    description: `${MODULE_ID$1}.description`,
    category: 'general',
    custom: {
      title: `${MODULE_ID$1}.modal.title`,
      content: `${MODULE_ID$1}.modal.content`,
      placeholder: `${MODULE_ID$1}.modal.placeholder`,
      maxlength: 255,
    },
    turnOn() {
      window.QueUp.Events.bind(CHAT_MESSAGE, customMentionCheck);
    },
    turnOff() {
      window.QueUp.Events.unbind(CHAT_MESSAGE, customMentionCheck);
    },
  };
  const MODULE_ID = 'chat-cleaner';
  function chatCleanerCheck(n) {
    const chatMessages = document.querySelectorAll('ul.chat-main > li');
    const limit = parseInt(n ?? settings.custom[MODULE_ID], 10);
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
  const chatCleaner = {
    id: MODULE_ID,
    label: `${MODULE_ID}.label`,
    description: `${MODULE_ID}.description`,
    category: 'general',
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
        if (settings.options[MODULE_ID]) {
          chatCleanerCheck(value);
        }
      },
    },
    turnOn() {
      chatCleanerCheck(void 0);
      window.QueUp.Events.bind(CHAT_MESSAGE, chatCleanerCheck);
    },
    turnOff() {
      window.QueUp.Events.unbind(CHAT_MESSAGE, chatCleanerCheck);
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
        const openPmButton = document.querySelector('.user-messages');
        openPmButton == null ? void 0 : openPmButton.click();
        setTimeout(function () {
          const messageItem = document.querySelector(
            `.message-item[data-messageid="${e.messageid}"]`,
          );
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
        .catch((err) => {
          settings.options[this.id] = false;
        });
    },
    turnOff() {
      window.QueUp.Events.unbind(NEW_PM_MESSAGE, pmNotify);
    },
  };
  function djNotificationCheck(e) {
    var _a, _b;
    const isInQueue = !!((_a = document.querySelector('.queue-position')) ==
    null
      ? void 0
      : _a.textContent);
    if (!isInQueue) {
      return;
    }
    const currentPosition = parseInt(
      (_b = document.querySelector('.queue-position')) == null
        ? void 0
        : _b.textContent,
      10,
    );
    if (isNaN(currentPosition)) {
      logError(
        'dj-notification',
        'Could not parse current position:',
        currentPosition,
      );
      return;
    }
    let parseSetting = parseInt(settings.custom['dj-notification'], 10);
    if (isNaN(parseSetting)) {
      parseSetting = 2;
      logInfo('djNotification', 'Could not parse setting, defaulting to 2');
    }
    if (currentPosition <= parseSetting) {
      showNotification({
        title: t('dj-notification.notification.title'),
        content: t('dj-notification.notification.content'),
        ignoreActiveTab: true,
        wait: 1e4,
      });
      window.QueUp.room.chat.mentionChatSound.play();
    }
  }
  const djNotification = {
    id: 'dj-notification',
    label: 'dj-notification.label',
    description: 'dj-notification.description',
    category: 'general',
    custom: {
      title: 'dj-notification.modal.title',
      content: 'dj-notification.modal.content',
      placeholder: '2',
      maxlength: 2,
      onConfirm: (value) => {
        if (/[^0-9]+/.test(value.trim())) {
          window.alert(t('dj-notification.modal.validation'));
          return false;
        }
        return true;
      },
    },
    turnOn() {
      window.QueUp.Events.bind(PLAYLIST_UPDATE, djNotificationCheck);
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
      var _a, _b, _c;
      const username =
        (_c =
          (_b =
            (_a = window.QueUp.room.users.collection.findWhere({
              userid,
            })) == null
              ? void 0
              : _a.attributes) == null
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
          var _a2;
          if (
            (_a2 = response == null ? void 0 : response.userinfo) == null
              ? void 0
              : _a2.username
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
    updubs.forEach((dub) => {
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
    downdubs.forEach((dub) => {
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
        window.QueUp.Events.bind('realtime:room_playlist-dub', downdubWatcher);
      }
    },
    turnOff() {
      window.QueUp.Events.unbind('realtime:room_playlist-dub', downdubWatcher);
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
      window.QueUp.Events.bind('realtime:room_playlist-dub', updubWatcher);
    },
    turnOff() {
      window.QueUp.Events.unbind('realtime:room_playlist-dub', updubWatcher);
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
      this.requestAnimFrame = windowAnimFram
        ? windowAnimFram.bind(window)
        : null;
      if (!this.canvas) return;
      const ctx = this.canvas.getContext('2d');
      this.width, (this.height = 0);
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
  var root$c = /* @__PURE__ */ ns_template(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M448 344v112a23.9 23.9 0 0 1 -24 24H312c-21.4 0-32.1-25.9-17-41l36.2-36.2L224 295.6 116.8 402.9 153 439c15.1 15.1 4.4 41-17 41H24a23.9 23.9 0 0 1 -24-24V344c0-21.4 25.9-32.1 41-17l36.2 36.2L184.5 256 77.2 148.7 41 185c-15.1 15.1-41 4.4-41-17V56a23.9 23.9 0 0 1 24-24h112c21.4 0 32.1 25.9 17 41l-36.2 36.2L224 216.4l107.2-107.3L295 73c-15.1-15.1-4.4-41 17-41h112a23.9 23.9 0 0 1 24 24v112c0 21.4-25.9 32.1-41 17l-36.2-36.2L263.5 256l107.3 107.3L407 327.1c15.1-15.2 41-4.5 41 16.9z"></path></svg>`,
  );
  function IconFullscreen($$anchor) {
    var svg = root$c();
    append($$anchor, svg);
  }
  const fullscreen = {
    id: 'fullscreen',
    label: 'fullscreen.label',
    description: 'fullscreen.description',
    category: 'user-interface',
    altIcon: IconFullscreen,
    onClick() {
      const elem =
        /**@type{HTMLIFrameElement}*/
        document.querySelector('.player_container iframe');
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
  const makeLink = function (className, fileName) {
    const link2 = document.createElement('link');
    link2.rel = 'stylesheet';
    link2.type = 'text/css';
    link2.className = className;
    link2.href = fileName;
    return link2;
  };
  function loadCSS(cssFile, className) {
    return new Promise((resolve, reject) => {
      var _a;
      (_a = document.querySelector(`link.${className}`)) == null
        ? void 0
        : _a.remove();
      const link2 = makeLink(
        className,
        // @ts-ignore __SRC_ROOT__ & __TIME_STAMP__ are replaced by vite
        `${'https://cdn.jsdelivr.net/gh/DubPlus/DubPlus@refactor-svelte'}${cssFile}?${'1740199685576'}`,
      );
      link2.onload = () => resolve();
      link2.onerror = reject;
      document.head.appendChild(link2);
    });
  }
  function loadExternalCss(cssFile, id) {
    var _a;
    (_a = document.querySelector(`style#${id}`)) == null ? void 0 : _a.remove();
    return fetch(cssFile)
      .then((res) => res.text())
      .then((css) => {
        const style = document.createElement('style');
        style.id = id;
        style.textContent = css;
        document.head.appendChild(style);
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
          let communityCSSUrl = null;
          content.replace(themeCheck, function (match, p1, p2, p3) {
            communityCSSUrl = p3;
          });
          if (!communityCSSUrl) {
            logInfo('No community CSS theme found');
            return;
          }
          logInfo('loading community css theme from:', communityCSSUrl);
          return loadExternalCss(communityCSSUrl, LINK_ELEM_ID$1);
        })
        .catch((error) => {
          logError('Community CSS: Failed to load room info', error);
        });
    },
    turnOff() {
      var _a;
      (_a = document.getElementById(LINK_ELEM_ID$1)) == null
        ? void 0
        : _a.remove();
    },
  };
  const LINK_ELEM_ID = 'dubplus-custom-css';
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
        if (!value) {
          return true;
        }
        if (!/^http.+\.css$/.test(value)) {
          return t('custom-css.modal.validation');
        }
        return true;
      },
      onConfirm(value) {
        var _a;
        if (!value) {
          (_a = document.getElementById(LINK_ELEM_ID)) == null
            ? void 0
            : _a.remove();
          settings.options[customCss.id] = false;
          return;
        } else {
          loadExternalCss(value, LINK_ELEM_ID).catch((e) => {
            logError('Error loading custom css file:', e);
          });
        }
      },
    },
    turnOn() {
      if (settings.custom[this.id]) {
        loadExternalCss(settings.custom[this.id], LINK_ELEM_ID).catch((e) => {
          logError('Error loading custom css file:', e);
        });
      }
    },
    turnOff() {
      var _a;
      (_a = document.getElementById(LINK_ELEM_ID)) == null
        ? void 0
        : _a.remove();
    },
  };
  function addCustomBG(url) {
    const img = document.querySelector('.backstretch img');
    if (img) {
      img.setAttribute('data-original', img.src);
      img.src = url;
    }
  }
  function removeCustomBG() {
    const img = document.querySelector('.backstretch img');
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
        if (!value) {
          return true;
        }
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
        if (!value) {
          return true;
        }
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
      maxlength: 10,
      validation(value) {
        const num = parseInt(value, 10);
        if (isNaN(num) || num < 1) {
          return t('auto-afk.modal.validation');
        } else {
          return true;
        }
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
  const general = [
    autovote,
    afk,
    autoAfk,
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
  ];
  const settingsModules = [spacebarMute, warnOnNavigation];
  const customize = [
    communityTheme,
    customCss,
    customBackground,
    customNotificationSound,
  ];
  var root$b = /* @__PURE__ */ template(`<!> <!>`, 1);
  function General($$anchor, $$props) {
    push($$props, false);
    init();
    var fragment = root$b();
    var node = first_child(fragment);
    const expression = /* @__PURE__ */ derived_safe_equal(() =>
      t('general.title'),
    );
    MenuHeader(node, {
      settingsId: 'general',
      get name() {
        return get(expression);
      },
    });
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
          index,
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
              onToggle: (on, onMount2) => {
                if (on) get(module).turnOn();
                else get(module).turnOff();
                if (!onMount2) {
                  saveSetting('option', get(module).id, on);
                }
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
  var root$a = /* @__PURE__ */ template(
    `<button id="dubplus-eta" type="button" class="icon-history eta_tooltip_t dubplus-btn-player"></button>`,
  );
  function Eta($$anchor, $$props) {
    push($$props, true);
    let eta = state('ETA');
    function getEta() {
      var _a, _b;
      const booth_position =
        (_a = document.querySelector('.queue-position')) == null
          ? void 0
          : _a.textContent;
      if (!booth_position) {
        return t('Eta.tooltip.notInQueue');
      }
      const average_song_minutes = 4;
      const current_time = parseInt(
        (_b = document.querySelector(
          '#player-controller div.left ul li.infoContainer.display-block div.currentTime span.min',
        )) == null
          ? void 0
          : _b.textContent,
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
      () => ({ to: '.player_sharing' }),
    );
    template_effect(() => {
      set_attribute(button, 'aria-label', get(eta));
      set_attribute(button, 'data-dp-tooltip', get(eta));
    });
    event('mouseenter', button, () => {
      set(eta, proxy(getEta()));
    });
    append($$anchor, button);
    pop();
  }
  var root$9 = /* @__PURE__ */ template(
    `<button id="dubplus-snooze" type="button" class="icon-mute snooze_btn dubplus-btn-player svelte-1va87zs"><span class="svelte-1va87zs">1</span></button>`,
  );
  function Snooze($$anchor, $$props) {
    push($$props, true);
    let tooltip = state(proxy(t('Snooze.tooltip')));
    const eventUtils = { currentVol: 50, snoozed: false };
    function eventSongAdvance(e) {
      if (e.startTime < 2) {
        if (eventUtils.snoozed) {
          window.QueUp.room.player.setVolume(eventUtils.currentVol);
          eventUtils.snoozed = false;
          set(tooltip, proxy(t('Snooze.tooltip')));
        }
        return true;
      }
    }
    function snooze2() {
      if (
        !eventUtils.snoozed &&
        !window.QueUp.room.player.muted_player &&
        window.QueUp.playerController.volume > 2
      ) {
        set(tooltip, proxy(t('Snooze.tooltip.undo')));
        eventUtils.currentVol = window.QueUp.playerController.volume;
        window.QueUp.room.player.mutePlayer();
        eventUtils.snoozed = true;
        window.QueUp.Events.once(
          'realtime:room_playlist-update',
          eventSongAdvance,
        );
      } else if (eventUtils.snoozed) {
        set(tooltip, proxy(t('Snooze.tooltip')));
        window.QueUp.room.player.setVolume(eventUtils.currentVol);
        window.QueUp.room.player.updateVolumeBar();
        eventUtils.snoozed = false;
      }
    }
    var button = root$9();
    button.__click = snooze2;
    action(
      button,
      ($$node, $$action_arg) =>
        teleport == null ? void 0 : teleport($$node, $$action_arg),
      () => ({ to: '.player_sharing' }),
    );
    template_effect(() => {
      set_attribute(button, 'aria-label', get(tooltip));
      set_attribute(button, 'data-dp-tooltip', get(tooltip));
    });
    append($$anchor, button);
    pop();
  }
  delegate(['click']);
  var root_2$2 = /* @__PURE__ */ template(
    `<span class="ac-list-press-enter svelte-2x4f0c"> </span>`,
  );
  var root_1 = /* @__PURE__ */ template(
    `<li><div class="ac-image svelte-2x4f0c"><img class="svelte-2x4f0c"></div> <span class="ac-text svelte-2x4f0c"> </span> <!></li>`,
  );
  var root$8 = /* @__PURE__ */ template(
    `<ul id="autocomplete-preview" class="svelte-2x4f0c"></ul>`,
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
    function handleClick2(index2) {
      const inputEl =
        /**@type {HTMLTextAreaElement}*/
        document.getElementById('chat-txt-message');
      insertEmote(inputEl, index2);
      inputEl.focus();
    }
    var ul = root$8();
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
        li.__click = () => handleClick2(get(i));
        var div = child(li);
        var img = child(div);
        var span = sibling(div, 2);
        var text_1 = child(span);
        var node = sibling(span, 2);
        {
          var consequent = ($$anchor3) => {
            var span_1 = root_2$2();
            var text_2 = child(span_1);
            template_effect(
              ($0) => set_text(text_2, $0),
              [() => t('autocomplete.preview.select')],
            );
            append($$anchor3, span_1);
          };
          if_block(node, ($$render) => {
            if (get(i) === emojiState.selectedIndex) $$render(consequent);
          });
        }
        template_effect(() => {
          set_class(
            li,
            `${`preview-item ${platform()}-previews` ?? ''} svelte-2x4f0c`,
          );
          toggle_class(li, 'selected', get(i) === emojiState.selectedIndex);
          set_attribute(img, 'src', src());
          set_attribute(img, 'alt', alt());
          set_attribute(img, 'title', alt());
          set_text(text_1, text2());
        });
        append($$anchor2, li);
      },
    );
    action(
      ul,
      ($$node, $$action_arg) =>
        teleport == null ? void 0 : teleport($$node, $$action_arg),
      () => ({
        to: '.pusher-chat-widget-input',
        position: 'prepend',
      }),
    );
    template_effect(() =>
      toggle_class(ul, 'ac-show', emojiState.emojiList.length > 0),
    );
    append($$anchor, ul);
    pop();
  }
  delegate(['click']);
  var on_click = (_, handleClick2, dub) => handleClick2(get(dub).username);
  var root_2$1 = /* @__PURE__ */ template(
    `<li class="preview-dubinfo-item users-previews svelte-ujv5bp"><div class="dubinfo-image svelte-ujv5bp"><img alt="User Avatar" class="svelte-ujv5bp"></div> <button type="button" class="dubinfo-text svelte-ujv5bp"> </button></li>`,
  );
  var root_3 = /* @__PURE__ */ template(`<li><!></li>`);
  var root$7 = /* @__PURE__ */ template(
    `<div role="none"><ul id="dubinfo-preview" class="dubinfo-show svelte-ujv5bp"><!></ul></div>`,
  );
  function DubsInfo($$anchor, $$props) {
    push($$props, true);
    let dubData = /* @__PURE__ */ derived(() => getDubCount($$props.dubType));
    let positionRight = state(0);
    let positionBottom = state(0);
    let display = state('none');
    function getTarget() {
      var _a, _b;
      if ($$props.dubType === 'updub') {
        return (_a = document.querySelector('.dubup')) == null
          ? void 0
          : _a.parentElement;
      } else if ($$props.dubType === 'downdub') {
        return (_b = document.querySelector('.dubdown')) == null
          ? void 0
          : _b.parentElement;
      } else if ($$props.dubType === 'grab') {
        return document.querySelector('.add-to-playlist');
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
      const chatInput =
        /**@type {HTMLInputElement}*/
        document.querySelector('#chat-txt-message');
      chatInput.value = `${chatInput.value}@${username} `.trimStart();
      chatInput.focus();
    }
    var div = root$7();
    var ul = child(div);
    var node = child(ul);
    {
      var consequent = ($$anchor2) => {
        var fragment = comment();
        var node_1 = first_child(fragment);
        each(
          node_1,
          17,
          () => get(dubData),
          index,
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
    template_effect(() => {
      set_attribute(div, 'id', `dubplus-${$$props.dubType}s-container`);
      set_class(
        div,
        `${`dubplus-dubs-container dubplus-${$$props.dubType}s-container` ?? ''} svelte-ujv5bp`,
      );
      set_attribute(
        div,
        'style',
        `bottom: ${get(positionBottom)}px; right: ${get(positionRight)}px; display: ${get(display)};`,
      );
      toggle_class(ul, 'dubplus-no-dubs', get(dubData).length === 0);
    });
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
    var _a;
    const snowWrapper = getSnowConatiner();
    snowflakesCount = Number(
      ((_a = snowWrapper == null ? void 0 : snowWrapper.dataset) == null
        ? void 0
        : _a.count) || snowflakesCount,
    );
  }
  function generateSnow(snowDensity = 200) {
    snowDensity -= 1;
    const snowWrapper = getSnowConatiner();
    snowWrapper.innerHTML = '';
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
  var root$6 = /* @__PURE__ */ template(
    `<div id="snow-container" class="svelte-t6y8au"></div>`,
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
  var root$5 = /* @__PURE__ */ template(
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
      var _a;
      (_a = $$props.onClick) == null ? void 0 : _a.apply(this, $$args);
    };
    var node = child(button);
    component(
      node,
      () => $$props.icon,
      ($$anchor2, $$component) => {
        $$component($$anchor2, {});
      },
    );
    var span = sibling(node, 2);
    var text2 = child(span);
    template_effect(
      ($0, $1) => {
        set_attribute(li, 'id', $$props.id);
        set_attribute(li, 'title', $0);
        set_attribute(button, 'aria-label', $0);
        set_text(text2, $1);
      },
      [() => t($$props.description), () => t($$props.label)],
    );
    append($$anchor, li);
    pop();
  }
  delegate(['click']);
  var root$4 = /* @__PURE__ */ template(`<!> <!>`, 1);
  function UserInterface($$anchor, $$props) {
    push($$props, false);
    init();
    var fragment = root$4();
    var node = first_child(fragment);
    const expression = /* @__PURE__ */ derived_safe_equal(() =>
      t('user-interface.title'),
    );
    MenuHeader(node, {
      settingsId: 'user-interface',
      get name() {
        return get(expression);
      },
    });
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
          index,
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
                  onToggle: (on, onMount2) => {
                    if (on) get(module).turnOn();
                    else get(module).turnOff();
                    if (!onMount2) {
                      saveSetting('option', get(module).id, on);
                    }
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
  var root$3 = /* @__PURE__ */ template(`<!> <!>`, 1);
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
    const expression = /* @__PURE__ */ derived_safe_equal(() =>
      t('settings.title'),
    );
    MenuHeader(node, {
      settingsId: 'settings',
      get name() {
        return get(expression);
      },
    });
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
          index,
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
              onToggle: (on, onMount2) => {
                if (on) get(module).turnOn();
                else get(module).turnOff();
                if (!onMount2) {
                  saveSetting('option', get(module).id, on);
                }
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
  var root$2 = /* @__PURE__ */ template(`<!> <!>`, 1);
  function Customize($$anchor, $$props) {
    push($$props, false);
    init();
    var fragment = root$2();
    var node = first_child(fragment);
    const expression = /* @__PURE__ */ derived_safe_equal(() =>
      t('customize.title'),
    );
    MenuHeader(node, {
      settingsId: 'customize',
      get name() {
        return get(expression);
      },
    });
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
          index,
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
              onToggle: (on, onMount2) => {
                if (on) get(module).turnOn();
                else get(module).turnOff();
                if (!onMount2) {
                  saveSetting('option', get(module).id, on);
                }
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
  function snooze(_, SNOOZE_CLASS, tooltip, icon, eventSongAdvance) {
    if (!document.body.classList.contains(SNOOZE_CLASS)) {
      set(tooltip, proxy(t('SnoozeVideo.tooltip.undo')));
      set(icon, 'icon-eye-unblocked');
      document.body.classList.add(SNOOZE_CLASS);
      window.QueUp.Events.once(
        'realtime:room_playlist-update',
        eventSongAdvance,
      );
    } else {
      set(tooltip, proxy(t('SnoozeVideo.tooltip')));
      set(icon, 'icon-eye-blocked');
      document.body.classList.remove(SNOOZE_CLASS);
      window.QueUp.Events.unbind(
        'realtime:room_playlist-update',
        eventSongAdvance,
      );
    }
  }
  var root$1 = /* @__PURE__ */ template(
    `<button id="dubplus-snooze-video" type="button"><span class="svelte-1va87zs">1</span></button>`,
  );
  function SnoozeVideo($$anchor, $$props) {
    push($$props, true);
    let icon = state('icon-eye-blocked');
    let tooltip = state(proxy(t('SnoozeVideo.tooltip')));
    const SNOOZE_CLASS = 'dubplus-snooze-video';
    function eventSongAdvance(e) {
      if (e.startTime < 2) {
        document.body.classList.remove(SNOOZE_CLASS);
        set(tooltip, proxy(t('SnoozeVideo.tooltip')));
        set(icon, 'icon-eye-blocked');
        return true;
      }
    }
    var button = root$1();
    button.__click = [snooze, SNOOZE_CLASS, tooltip, icon, eventSongAdvance];
    action(
      button,
      ($$node, $$action_arg) =>
        teleport == null ? void 0 : teleport($$node, $$action_arg),
      () => ({ to: '.player_sharing' }),
    );
    template_effect(() => {
      set_class(
        button,
        `${`${get(icon)} snooze-video-btn dubplus-btn-player` ?? ''} svelte-1va87zs`,
      );
      set_attribute(button, 'aria-label', get(tooltip));
      set_attribute(button, 'data-dp-tooltip', get(tooltip));
    });
    append($$anchor, button);
    pop();
  }
  delegate(['click']);
  var root_2 = /* @__PURE__ */ template(`<!> <!> <!>`, 1);
  var root = /* @__PURE__ */ template(
    `<!> <!> <!> <!> <!> <!> <!> <section class="dubplus-menu svelte-1u8kv6a"><p class="dubplus-menu-header svelte-1u8kv6a"> </p> <!> <!> <!> <!> <!></section> <!>`,
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
    var section = sibling(node_9, 2);
    var p = child(section);
    var text2 = child(p);
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
    var node_15 = sibling(section, 2);
    Modal(node_15, {});
    template_effect(
      ($0) => set_text(text2, $0),
      [() => t('Menu.title')],
      derived_safe_equal,
    );
    append($$anchor, fragment);
    pop();
  }
  var define_PKGINFO_default = {
    name: 'dubplus',
    version: '1.0.0',
    description: 'Dub+ - A simple script/extension for QueUp.net',
    author: 'DubPlus',
    license: 'MIT',
    homepage: 'https://dub.plus',
    'lint-staged': { '*.{js,css,md,svelte,ts}': 'prettier --write' },
  };
  function DubPlus($$anchor, $$props) {
    push($$props, true);
    window.dubplus = window.dubplus || {};
    window.dubplus = Object.assign(window.dubplus, define_PKGINFO_default);
    let status = state('loading');
    function setLocale() {
      locale.current = normalizeLocale(navigator.language || 'en');
    }
    onMount(() => {
      setLocale();
      window.addEventListener('languagechange', setLocale);
    });
    onDestroy(() => {
      window.removeEventListener('languagechange', setLocale);
    });
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
        var _a, _b;
        if (
          !((_b = (_a = window.QueUp) == null ? void 0 : _a.session) == null
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
      modalState.onCancel = () => {
        modalState.open = false;
      };
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
    loadCSS('/dubplus.css', 'dubplus-css').catch((e) => {
      logError('Failed to load dubplus.css', e);
    });
  }
  let container = document.getElementById('dubplus-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'dubplus-container';
    document.body.appendChild(container);
  }
  if (container.children.length > 0) {
    unmount(container);
    container.innerHTML = '';
  }
  const app = mount(DubPlus, {
    target: container,
  });
  return app;
})();
