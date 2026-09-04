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

    v4.1.3

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
	//#region node_modules/svelte/src/internal/shared/utils.js
	var is_array = Array.isArray;
	var index_of = Array.prototype.indexOf;
	var includes = Array.prototype.includes;
	var array_from = Array.from;
	var define_property = Object.defineProperty;
	var get_descriptor = Object.getOwnPropertyDescriptor;
	var get_descriptors = Object.getOwnPropertyDescriptors;
	var object_prototype = Object.prototype;
	var array_prototype = Array.prototype;
	var get_prototype_of = Object.getPrototypeOf;
	var is_extensible = Object.isExtensible;
	var noop = () => {};
	/** @param {Function} fn */
	function run(fn) {
		return fn();
	}
	/** @param {Array<() => void>} arr */
	function run_all(arr) {
		for (var i = 0; i < arr.length; i++) arr[i]();
	}
	/**
	* TODO replace with Promise.withResolvers once supported widely enough
	* @template [T=void]
	*/
	function deferred() {
		/** @type {(value: T) => void} */
		var resolve;
		/** @type {(reason: any) => void} */
		var reject;
		return {
			promise: new Promise((res, rej) => {
				resolve = res;
				reject = rej;
			}),
			resolve,
			reject
		};
	}
	var CLEAN = 1024;
	var DIRTY = 2048;
	var MAYBE_DIRTY = 4096;
	var INERT = 8192;
	var DESTROYED = 16384;
	/** Set once a reaction has run for the first time */
	var REACTION_RAN = 32768;
	/** Effect is in the process of getting destroyed. Can be observed in child teardown functions */
	var DESTROYING = 1 << 25;
	/**
	* 'Transparent' effects do not create a transition boundary.
	* This is on a block effect 99% of the time but may also be on a branch effect if its parent block effect was pruned
	*/
	var EFFECT_TRANSPARENT = 65536;
	var EFFECT_PRESERVED = 1 << 19;
	var USER_EFFECT = 1 << 20;
	var EFFECT_OFFSCREEN = 1 << 25;
	/**
	* Tells that we marked this derived and its reactions as visited during the "mark as (maybe) dirty"-phase.
	* Will be lifted during execution of the derived and during checking its dirty state (both are necessary
	* because a derived might be checked but not executed). This is a pure performance optimization flag and
	* should not be used for any other purpose!
	*/
	var WAS_MARKED = 65536;
	var REACTION_IS_UPDATING = 1 << 21;
	var ASYNC = 1 << 22;
	var ERROR_VALUE = 1 << 23;
	var STATE_SYMBOL = Symbol("$state");
	var LEGACY_PROPS = Symbol("legacy props");
	var LOADING_ATTR_SYMBOL = Symbol("");
	var ATTRIBUTES_CACHE = Symbol("attributes");
	var CLASS_CACHE = Symbol("class");
	var STYLE_CACHE = Symbol("style");
	var TEXT_CACHE = Symbol("text");
	var FORM_RESET_HANDLER = Symbol("form reset");
	/** allow users to ignore aborted signal errors if `reason.name === 'StaleReactionError` */
	var STALE_REACTION = new class StaleReactionError extends Error {
		name = "StaleReactionError";
		message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
	}();
	var IS_XHTML = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
	/**
	* `%name%(...)` can only be used during component initialisation
	* @param {string} name
	* @returns {never}
	*/
	function lifecycle_outside_component(name) {
		throw new Error(`https://svelte.dev/e/lifecycle_outside_component`);
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/errors.js
	/**
	* Cannot create a `$derived(...)` with an `await` expression outside of an effect tree
	* @returns {never}
	*/
	function async_derived_orphan() {
		throw new Error(`https://svelte.dev/e/async_derived_orphan`);
	}
	/**
	* Keyed each block has duplicate key `%value%` at indexes %a% and %b%
	* @param {string} a
	* @param {string} b
	* @param {string | undefined | null} [value]
	* @returns {never}
	*/
	function each_key_duplicate(a, b, value) {
		throw new Error(`https://svelte.dev/e/each_key_duplicate`);
	}
	/**
	* `%rune%` cannot be used inside an effect cleanup function
	* @param {string} rune
	* @returns {never}
	*/
	function effect_in_teardown(rune) {
		throw new Error(`https://svelte.dev/e/effect_in_teardown`);
	}
	/**
	* Effect cannot be created inside a `$derived` value that was not itself created inside an effect
	* @returns {never}
	*/
	function effect_in_unowned_derived() {
		throw new Error(`https://svelte.dev/e/effect_in_unowned_derived`);
	}
	/**
	* `%rune%` can only be used inside an effect (e.g. during component initialisation)
	* @param {string} rune
	* @returns {never}
	*/
	function effect_orphan(rune) {
		throw new Error(`https://svelte.dev/e/effect_orphan`);
	}
	/**
	* Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
	* @returns {never}
	*/
	function effect_update_depth_exceeded() {
		throw new Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
	}
	/**
	* Cannot do `bind:%key%={undefined}` when `%key%` has a fallback value
	* @param {string} key
	* @returns {never}
	*/
	function props_invalid_value(key) {
		throw new Error(`https://svelte.dev/e/props_invalid_value`);
	}
	/**
	* Property descriptors defined on `$state` objects must contain `value` and always be `enumerable`, `configurable` and `writable`.
	* @returns {never}
	*/
	function state_descriptors_fixed() {
		throw new Error(`https://svelte.dev/e/state_descriptors_fixed`);
	}
	/**
	* Cannot set prototype of `$state` object
	* @returns {never}
	*/
	function state_prototype_fixed() {
		throw new Error(`https://svelte.dev/e/state_prototype_fixed`);
	}
	/**
	* Updating state inside `$derived(...)`, `$inspect(...)` or a template expression is forbidden. If the value should not be reactive, declare it without `$state`
	* @returns {never}
	*/
	function state_unsafe_mutation() {
		throw new Error(`https://svelte.dev/e/state_unsafe_mutation`);
	}
	/**
	* A `<svelte:boundary>` `reset` function cannot be called while an error is still being handled
	* @returns {never}
	*/
	function svelte_boundary_reset_onerror() {
		throw new Error(`https://svelte.dev/e/svelte_boundary_reset_onerror`);
	}
	//#endregion
	//#region node_modules/svelte/src/constants.js
	var HYDRATION_ERROR = {};
	var UNINITIALIZED = Symbol("uninitialized");
	var NAMESPACE_HTML = "http://www.w3.org/1999/xhtml";
	/**
	* Reading a derived belonging to a now-destroyed effect may result in stale values
	*/
	function derived_inert() {
		console.warn(`https://svelte.dev/e/derived_inert`);
	}
	/**
	* Hydration failed because the initial UI does not match what was rendered on the server. The error occurred near %location%
	* @param {string | undefined | null} [location]
	*/
	function hydration_mismatch(location) {
		console.warn(`https://svelte.dev/e/hydration_mismatch`);
	}
	/**
	* A `<svelte:boundary>` `reset` function only resets the boundary the first time it is called
	*/
	function svelte_boundary_reset_noop() {
		console.warn(`https://svelte.dev/e/svelte_boundary_reset_noop`);
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/hydration.js
	/** @import { TemplateNode } from '#client' */
	/**
	* Use this variable to guard everything related to hydration code so it can be treeshaken out
	* if the user doesn't use the `hydrate` method and these code paths are therefore not needed.
	*/
	var hydrating = false;
	/** @param {boolean} value */
	function set_hydrating(value) {
		hydrating = value;
	}
	/**
	* The node that is currently being hydrated. This starts out as the first node inside the opening
	* <!--[--> comment, and updates each time a component calls `$.child(...)` or `$.sibling(...)`.
	* When entering a block (e.g. `{#if ...}`), `hydrate_node` is the block opening comment; by the
	* time we leave the block it is the closing comment, which serves as the block's anchor.
	* @type {TemplateNode}
	*/
	var hydrate_node;
	/** @param {TemplateNode | null} node */
	function set_hydrate_node(node) {
		if (node === null) {
			hydration_mismatch();
			throw HYDRATION_ERROR;
		}
		return hydrate_node = node;
	}
	function hydrate_next() {
		return set_hydrate_node(/* @__PURE__ */ get_next_sibling(hydrate_node));
	}
	/** @param {TemplateNode} node */
	function reset$2(node) {
		if (!hydrating) return;
		if (/* @__PURE__ */ get_next_sibling(hydrate_node) !== null) {
			hydration_mismatch();
			throw HYDRATION_ERROR;
		}
		hydrate_node = node;
	}
	function next(count = 1) {
		if (hydrating) {
			var i = count;
			var node = hydrate_node;
			while (i--) node = /* @__PURE__ */ get_next_sibling(node);
			hydrate_node = node;
		}
	}
	/**
	* Skips or removes (depending on {@link remove}) all nodes starting at `hydrate_node` up until the next hydration end comment
	* @param {boolean} remove
	*/
	function skip_nodes(remove = true) {
		var depth = 0;
		var node = hydrate_node;
		while (true) {
			if (node.nodeType === 8) {
				var data = node.data;
				if (data === "]") {
					if (depth === 0) return node;
					depth -= 1;
				} else if (data === "[" || data === "[!" || data[0] === "[" && !isNaN(Number(data.slice(1)))) depth += 1;
			}
			var next = /* @__PURE__ */ get_next_sibling(node);
			if (remove) node.remove();
			node = next;
		}
	}
	/**
	*
	* @param {TemplateNode} node
	*/
	function read_hydration_instruction(node) {
		if (!node || node.nodeType !== 8) {
			hydration_mismatch();
			throw HYDRATION_ERROR;
		}
		return node.data;
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/reactivity/equality.js
	/** @import { Equals } from '#client' */
	/** @type {Equals} */
	function equals(value) {
		return value === this.v;
	}
	/**
	* @param {unknown} a
	* @param {unknown} b
	* @returns {boolean}
	*/
	function safe_not_equal(a, b) {
		return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
	}
	/** @type {Equals} */
	function safe_equals(value) {
		return !safe_not_equal(value, this.v);
	}
	//#endregion
	//#region node_modules/svelte/src/internal/flags/index.js
	/** True if experimental.async=true */
	var async_mode_flag = false;
	/** True if we're not certain that we only have Svelte 5 code in the compilation */
	var legacy_mode_flag = false;
	function enable_legacy_mode_flag() {
		legacy_mode_flag = true;
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/context.js
	/** @import { ComponentContext, DevStackEntry, Effect } from '#client' */
	/** @type {ComponentContext | null} */
	var component_context = null;
	/** @param {ComponentContext | null} context */
	function set_component_context(context) {
		component_context = context;
	}
	/**
	* @param {Record<string, unknown>} props
	* @param {any} runes
	* @param {Function} [fn]
	* @returns {void}
	*/
	function push(props, runes = false, fn) {
		component_context = {
			p: component_context,
			i: false,
			c: null,
			e: null,
			s: props,
			x: null,
			r: active_effect,
			l: legacy_mode_flag && !runes ? {
				s: null,
				u: null,
				$: []
			} : null
		};
	}
	/**
	* @template {Record<string, any>} T
	* @param {T} [component]
	* @returns {T}
	*/
	function pop(component) {
		var context = component_context;
		var effects = context.e;
		if (effects !== null) {
			context.e = null;
			for (var fn of effects) create_user_effect(fn);
		}
		if (component !== void 0) context.x = component;
		context.i = true;
		component_context = context.p;
		return component ?? {};
	}
	/** @returns {boolean} */
	function is_runes() {
		return !legacy_mode_flag || component_context !== null && component_context.l === null;
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/task.js
	/** @type {Array<() => void>} */
	var micro_tasks = [];
	function run_micro_tasks() {
		var tasks = micro_tasks;
		micro_tasks = [];
		run_all(tasks);
	}
	/**
	* @param {() => void} fn
	*/
	function queue_micro_task(fn) {
		if (micro_tasks.length === 0 && !is_flushing_sync) {
			var tasks = micro_tasks;
			queueMicrotask(() => {
				if (tasks === micro_tasks) run_micro_tasks();
			});
		}
		micro_tasks.push(fn);
	}
	/**
	* Synchronously run any queued tasks.
	*/
	function flush_tasks() {
		while (micro_tasks.length > 0) run_micro_tasks();
	}
	/**
	* @param {unknown} error
	*/
	function handle_error(error) {
		var effect = active_effect;
		if (effect === null) {
			/** @type {Derived} */ active_reaction.f |= ERROR_VALUE;
			return error;
		}
		if ((effect.f & 32768) === 0 && (effect.f & 4) === 0) throw error;
		invoke_error_boundary(error, effect);
	}
	/**
	* @param {unknown} error
	* @param {Effect | null} effect
	*/
	function invoke_error_boundary(error, effect) {
		if (effect !== null && (effect.f & 16384) !== 0) return;
		while (effect !== null) {
			if ((effect.f & 128) !== 0) {
				if ((effect.f & 32768) === 0) throw error;
				try {
					/** @type {Boundary} */ effect.b.error(error);
					return;
				} catch (e) {
					error = e;
				}
			}
			effect = effect.parent;
		}
		throw error;
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/reactivity/status.js
	/** @import { Derived, Signal } from '#client' */
	var STATUS_MASK = ~(DIRTY | MAYBE_DIRTY | CLEAN);
	/**
	* @param {Signal} signal
	* @param {number} status
	*/
	function set_signal_status(signal, status) {
		signal.f = signal.f & STATUS_MASK | status;
	}
	/**
	* Set a derived's status to CLEAN or MAYBE_DIRTY based on its connection state.
	* @param {Derived} derived
	*/
	function update_derived_status(derived) {
		if ((derived.f & 512) !== 0 || derived.deps === null) set_signal_status(derived, CLEAN);
		else set_signal_status(derived, MAYBE_DIRTY);
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/reactivity/utils.js
	/** @import { Derived, Effect, Value } from '#client' */
	/**
	* @param {Value[] | null} deps
	*/
	function clear_marked(deps) {
		if (deps === null) return;
		for (const dep of deps) {
			if ((dep.f & 2) === 0 || (dep.f & 65536) === 0) continue;
			dep.f ^= WAS_MARKED;
			clear_marked(
				/** @type {Derived} */
				dep.deps
			);
		}
	}
	/**
	* @param {Effect} effect
	* @param {Set<Effect>} dirty_effects
	* @param {Set<Effect>} maybe_dirty_effects
	*/
	function defer_effect(effect, dirty_effects, maybe_dirty_effects) {
		if ((effect.f & 2048) !== 0) dirty_effects.add(effect);
		else if ((effect.f & 4096) !== 0) maybe_dirty_effects.add(effect);
		clear_marked(effect.deps);
		set_signal_status(effect, CLEAN);
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/reactivity/store.js
	/**
	* We set this to `true` when updating a store so that we correctly
	* schedule effects if the update takes place inside a `$:` effect
	*/
	var legacy_is_updating_store = false;
	/**
	* Whether or not the prop currently being read is a store binding, as in
	* `<Child bind:x={$y} />`. If it is, we treat the prop as mutable even in
	* runes mode, and skip `binding_property_non_reactive` validation
	*/
	var is_store_binding = false;
	/**
	* Returns a tuple that indicates whether `fn()` reads a prop that is a store binding.
	* Used to prevent `binding_property_non_reactive` validation false positives and
	* ensure that these props are treated as mutable even in runes mode
	* @template T
	* @param {() => T} fn
	* @returns {[T, boolean]}
	*/
	function capture_store_binding(fn) {
		var previous_is_store_binding = is_store_binding;
		try {
			is_store_binding = false;
			return [fn(), is_store_binding];
		} finally {
			is_store_binding = previous_is_store_binding;
		}
	}
	//#endregion
	//#region node_modules/svelte/src/reactivity/create-subscriber.js
	/**
	* Returns a `subscribe` function that integrates external event-based systems with Svelte's reactivity.
	* It's particularly useful for integrating with web APIs like `MediaQuery`, `IntersectionObserver`, or `WebSocket`.
	*
	* If `subscribe` is called inside an effect (including indirectly, for example inside a getter),
	* the `start` callback will be called with an `update` function. Whenever `update` is called, the effect re-runs.
	*
	* If `start` returns a cleanup function, it will be called when the effect is destroyed.
	*
	* If `subscribe` is called in multiple effects, `start` will only be called once as long as the effects
	* are active, and the returned teardown function will only be called when all effects are destroyed.
	*
	* It's best understood with an example. Here's an implementation of [`MediaQuery`](https://svelte.dev/docs/svelte/svelte-reactivity#MediaQuery):
	*
	* ```js
	* import { createSubscriber } from 'svelte/reactivity';
	* import { on } from 'svelte/events';
	*
	* export class MediaQuery {
	* 	#query;
	* 	#subscribe;
	*
	* 	constructor(query) {
	* 		this.#query = window.matchMedia(`(${query})`);
	*
	* 		this.#subscribe = createSubscriber((update) => {
	* 			// when the `change` event occurs, re-run any effects that read `this.current`
	* 			const off = on(this.#query, 'change', update);
	*
	* 			// stop listening when all the effects are destroyed
	* 			return () => off();
	* 		});
	* 	}
	*
	* 	get current() {
	* 		// This makes the getter reactive, if read in an effect
	* 		this.#subscribe();
	*
	* 		// Return the current state of the query, whether or not we're in an effect
	* 		return this.#query.matches;
	* 	}
	* }
	* ```
	* @param {(update: () => void) => (() => void) | void} start
	* @since 5.7.0
	*/
	function createSubscriber(start) {
		let subscribers = 0;
		let version = source(0);
		/** @type {(() => void) | void} */
		let stop;
		return () => {
			if (effect_tracking()) {
				get(version);
				render_effect(() => {
					if (subscribers === 0) stop = untrack(() => start(() => increment$1(version)));
					subscribers += 1;
					return () => {
						queue_micro_task(() => {
							subscribers -= 1;
							if (subscribers === 0) {
								stop?.();
								stop = void 0;
								increment$1(version);
							}
						});
					};
				});
			}
		};
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
	/** @import { Effect, Source, TemplateNode, } from '#client' */
	/**
	* @typedef {{
	* 	 onerror?: ((error: unknown, reset: () => void) => void) | null;
	*   failed?: ((anchor: Node, error: () => unknown, reset: () => () => void) => void) | null;
	*   pending?: ((anchor: Node) => void) | null;
	* }} BoundaryProps
	*/
	var flags = EFFECT_TRANSPARENT | EFFECT_PRESERVED;
	/**
	* @param {TemplateNode} node
	* @param {BoundaryProps} props
	* @param {((anchor: Node) => void)} children
	* @param {((error: unknown) => unknown) | undefined} [transform_error]
	* @returns {void}
	*/
	function boundary(node, props, children, transform_error) {
		new Boundary(node, props, children, transform_error);
	}
	var Boundary = class {
		/** @type {Boundary | null} */
		parent;
		is_pending = false;
		/**
		* API-level transformError transform function. Transforms errors before they reach the `failed` snippet.
		* Inherited from parent boundary, or defaults to identity.
		* @type {(error: unknown) => unknown}
		*/
		transform_error;
		/** @type {TemplateNode} */
		#anchor;
		/** @type {TemplateNode | null} */
		#hydrate_open = hydrating ? hydrate_node : null;
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
		#local_pending_count = 0;
		#pending_count = 0;
		#pending_count_update_queued = false;
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
		* @param {((error: unknown) => unknown) | undefined} [transform_error]
		*/
		constructor(node, props, children, transform_error) {
			this.#anchor = node;
			this.#props = props;
			this.#children = (anchor) => {
				var effect = active_effect;
				effect.b = this;
				effect.f |= 128;
				children(anchor);
			};
			this.parent = active_effect.b;
			this.transform_error = transform_error ?? this.parent?.transform_error ?? ((e) => e);
			this.#effect = block(() => {
				if (hydrating) {
					const comment = this.#hydrate_open;
					hydrate_next();
					const server_rendered_pending = comment.data === "[!";
					if (comment.data.startsWith("[?")) {
						const serialized_error = JSON.parse(comment.data.slice(2));
						this.#hydrate_failed_content(serialized_error);
					} else if (server_rendered_pending) this.#hydrate_pending_content();
					else this.#hydrate_resolved_content();
				} else this.#render();
			}, flags);
			if (hydrating) this.#anchor = hydrate_node;
		}
		#hydrate_resolved_content() {
			try {
				this.#main_effect = branch(() => this.#children(this.#anchor));
			} catch (error) {
				this.error(error);
			}
		}
		/**
		* @param {unknown} error The deserialized error from the server's hydration comment
		*/
		#hydrate_failed_content(error) {
			const failed = this.#props.failed;
			if (!failed) return;
			this.#failed_effect = branch(() => {
				failed(this.#anchor, () => error, () => () => {});
			});
		}
		#hydrate_pending_content() {
			const pending = this.#props.pending;
			if (!pending) return;
			this.is_pending = true;
			this.#pending_effect = branch(() => pending(this.#anchor));
			queue_micro_task(() => {
				var fragment = this.#offscreen_fragment = document.createDocumentFragment();
				var anchor = create_text();
				fragment.append(anchor);
				this.#main_effect = this.#run(() => {
					return branch(() => this.#children(anchor));
				});
				if (this.#pending_count === 0) {
					this.#anchor.before(fragment);
					this.#offscreen_fragment = null;
					pause_effect(this.#pending_effect, () => {
						this.#pending_effect = null;
					});
					this.#resolve(current_batch);
				}
			});
		}
		#render() {
			try {
				this.is_pending = this.has_pending_snippet();
				this.#pending_count = 0;
				this.#local_pending_count = 0;
				this.#main_effect = branch(() => {
					this.#children(this.#anchor);
				});
				if (this.#pending_count > 0) {
					var fragment = this.#offscreen_fragment = document.createDocumentFragment();
					move_effect(this.#main_effect, fragment);
					const pending = this.#props.pending;
					this.#pending_effect = branch(() => pending(this.#anchor));
				} else this.#resolve(current_batch);
			} catch (error) {
				this.error(error);
			}
		}
		/**
		* @param {Batch} batch
		*/
		#resolve(batch) {
			this.is_pending = false;
			batch.transfer_effects(this.#dirty_effects, this.#maybe_dirty_effects);
		}
		/**
		* Defer an effect inside a pending boundary until the boundary resolves
		* @param {Effect} effect
		*/
		defer_effect(effect) {
			defer_effect(effect, this.#dirty_effects, this.#maybe_dirty_effects);
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
		* @template T
		* @param {() => T} fn
		*/
		#run(fn) {
			var previous_effect = active_effect;
			var previous_reaction = active_reaction;
			var previous_ctx = component_context;
			set_active_effect(this.#effect);
			set_active_reaction(this.#effect);
			set_component_context(this.#effect.ctx);
			try {
				Batch.ensure();
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
		/**
		* Updates the pending count associated with the currently visible pending snippet,
		* if any, such that we can replace the snippet with content once work is done
		* @param {1 | -1} d
		* @param {Batch} batch
		*/
		#update_pending_count(d, batch) {
			if (!this.has_pending_snippet()) {
				if (this.parent) this.parent.#update_pending_count(d, batch);
				return;
			}
			this.#pending_count += d;
			if (this.#pending_count === 0) {
				this.#resolve(batch);
				if (this.#pending_effect) pause_effect(this.#pending_effect, () => {
					this.#pending_effect = null;
				});
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
		* @param {Batch} batch
		*/
		update_pending_count(d, batch) {
			this.#update_pending_count(d, batch);
			this.#local_pending_count += d;
			if (!this.#effect_pending || this.#pending_count_update_queued) return;
			this.#pending_count_update_queued = true;
			queue_micro_task(() => {
				this.#pending_count_update_queued = false;
				if (this.#effect_pending) internal_set(this.#effect_pending, this.#local_pending_count);
			});
		}
		get_effect_pending() {
			this.#effect_pending_subscriber();
			return get(this.#effect_pending);
		}
		/** @param {unknown} error */
		error(error) {
			if (!this.#props.onerror && !this.#props.failed) throw error;
			if (current_batch?.is_fork) {
				if (this.#main_effect) current_batch.skip_effect(this.#main_effect);
				if (this.#pending_effect) current_batch.skip_effect(this.#pending_effect);
				if (this.#failed_effect) current_batch.skip_effect(this.#failed_effect);
				current_batch.oncommit(() => {
					this.#handle_error(error);
				});
			} else this.#handle_error(error);
		}
		/**
		* @param {unknown} error
		*/
		#handle_error(error) {
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
			if (hydrating) {
				set_hydrate_node(this.#hydrate_open);
				next();
				set_hydrate_node(skip_nodes());
			}
			var onerror = this.#props.onerror;
			let failed = this.#props.failed;
			var did_reset = false;
			var calling_on_error = false;
			const reset = () => {
				if (did_reset) {
					svelte_boundary_reset_noop();
					return;
				}
				did_reset = true;
				if (calling_on_error) svelte_boundary_reset_onerror();
				if (this.#failed_effect !== null) pause_effect(this.#failed_effect, () => {
					this.#failed_effect = null;
				});
				this.#run(() => {
					this.#render();
				});
			};
			/** @param {unknown} transformed_error */
			const handle_error_result = (transformed_error) => {
				try {
					calling_on_error = true;
					onerror?.(transformed_error, reset);
					calling_on_error = false;
				} catch (error) {
					invoke_error_boundary(error, this.#effect && this.#effect.parent);
				}
				if (failed) this.#failed_effect = this.#run(() => {
					try {
						return branch(() => {
							var effect = active_effect;
							effect.b = this;
							effect.f |= 128;
							failed(this.#anchor, () => transformed_error, () => reset);
						});
					} catch (error) {
						invoke_error_boundary(error, this.#effect.parent);
						return null;
					}
				});
			};
			queue_micro_task(() => {
				/** @type {unknown} */
				var result;
				try {
					result = this.transform_error(error);
				} catch (e) {
					invoke_error_boundary(e, this.#effect && this.#effect.parent);
					return;
				}
				if (result !== null && typeof result === "object" && typeof result.then === "function")
 /** @type {any} */ result.then(
					handle_error_result,
					/** @param {unknown} e */
					(e) => invoke_error_boundary(e, this.#effect && this.#effect.parent)
				);
				else handle_error_result(result);
			});
		}
	};
	//#endregion
	//#region node_modules/svelte/src/internal/client/reactivity/async.js
	/** @import { Blocker, Effect, Source, Value } from '#client' */
	/**
	* @param {Blocker[]} blockers
	* @param {Array<() => any>} sync
	* @param {Array<() => Promise<any>>} async
	* @param {(values: Value[]) => any} fn
	*/
	function flatten(blockers, sync, async, fn) {
		const d = is_runes() ? derived : derived_safe_equal;
		var pending = blockers.filter((b) => !b.settled);
		var deriveds = sync.map(d);
		if (async.length === 0 && pending.length === 0) {
			fn(deriveds);
			return;
		}
		var parent = active_effect;
		var restore = capture();
		var blocker_promise = pending.length === 1 ? pending[0].promise : pending.length > 1 ? Promise.all(pending.map((b) => b.promise)) : null;
		/**
		* @param {Source[]} async
		*/
		function finish(async) {
			if ((parent.f & 16384) !== 0) return;
			restore();
			try {
				fn([...deriveds, ...async]);
			} catch (error) {
				invoke_error_boundary(error, parent);
			}
			unset_context();
		}
		var decrement_pending = increment_pending();
		if (async.length === 0) {
			/** @type {Promise<any>} */ blocker_promise.then(() => finish([])).finally(decrement_pending);
			return;
		}
		function run() {
			Promise.all(async.map((expression) => /* @__PURE__ */ async_derived(expression))).then(finish).catch((error) => invoke_error_boundary(error, parent)).finally(decrement_pending);
		}
		if (blocker_promise) blocker_promise.then(() => {
			restore();
			run();
			unset_context();
		});
		else run();
	}
	/**
	* Captures the current effect context so that we can restore it after
	* some asynchronous work has happened (so that e.g. `await a + b`
	* causes `b` to be registered as a dependency).
	*/
	function capture() {
		var previous_effect = active_effect;
		var previous_reaction = active_reaction;
		var previous_component_context = component_context;
		var previous_batch = current_batch;
		return function restore(activate_batch = true) {
			set_active_effect(previous_effect);
			set_active_reaction(previous_reaction);
			set_component_context(previous_component_context);
			if (activate_batch && (previous_effect.f & 16384) === 0) {
				previous_batch?.activate();
				previous_batch?.apply();
			}
		};
	}
	function unset_context(deactivate_batch = true) {
		set_active_effect(null);
		set_active_reaction(null);
		set_component_context(null);
		if (deactivate_batch) current_batch?.deactivate();
	}
	/**
	* @returns {(skip?: boolean) => void}
	*/
	function increment_pending() {
		var effect = active_effect;
		var boundary = effect.b;
		var batch = current_batch;
		var blocking = !!boundary?.is_rendered();
		boundary?.update_pending_count(1, batch);
		batch.increment(blocking, effect);
		return () => {
			boundary?.update_pending_count(-1, batch);
			batch.decrement(blocking, effect);
		};
	}
	/**
	* @template V
	* @param {() => V} fn
	* @returns {Derived<V>}
	*/
	/*#__NO_SIDE_EFFECTS__*/
	function derived(fn) {
		var flags = 2 | DIRTY;
		if (active_effect !== null) active_effect.f |= EFFECT_PRESERVED;
		return {
			ctx: component_context,
			deps: null,
			effects: null,
			equals,
			f: flags,
			fn,
			reactions: null,
			rv: 0,
			v: UNINITIALIZED,
			wv: 0,
			parent: active_effect,
			ac: null
		};
	}
	var OBSOLETE = Symbol("obsolete");
	/**
	* @template V
	* @param {() => V | Promise<V>} fn
	* @param {string} [label]
	* @param {string} [location] If provided, print a warning if the value is not read immediately after update
	* @returns {Promise<Source<V>>}
	*/
	/*#__NO_SIDE_EFFECTS__*/
	function async_derived(fn, label, location) {
		let parent = active_effect;
		if (parent === null) async_derived_orphan();
		var promise = void 0;
		var signal = source(UNINITIALIZED);
		var should_suspend = !active_reaction;
		/** @type {Set<ReturnType<typeof deferred<V>>>} */
		var deferreds = /* @__PURE__ */ new Set();
		async_effect(() => {
			var effect = active_effect;
			/** @type {ReturnType<typeof deferred<V>>} */
			var d = deferred();
			promise = d.promise;
			try {
				Promise.resolve(fn()).then(d.resolve, (e) => {
					if (e !== STALE_REACTION) d.reject(e);
				}).finally(unset_context);
			} catch (error) {
				d.reject(error);
				unset_context();
			}
			var batch = current_batch;
			if (should_suspend) {
				if ((effect.f & 32768) !== 0) var decrement_pending = increment_pending();
				if (parent.b?.is_rendered()) batch.async_deriveds.get(effect)?.reject(OBSOLETE);
				else for (const d of deferreds.values()) d.reject(OBSOLETE);
				deferreds.add(d);
				batch.async_deriveds.set(effect, d);
			}
			/**
			* @param {any} value
			* @param {unknown} error
			*/
			const handler = (value, error = void 0) => {
				decrement_pending?.();
				deferreds.delete(d);
				if (error === OBSOLETE) return;
				batch.activate();
				if (error) {
					signal.f |= ERROR_VALUE;
					internal_set(signal, error);
				} else {
					if ((signal.f & 8388608) !== 0) signal.f ^= ERROR_VALUE;
					internal_set(signal, value);
				}
				batch.deactivate();
			};
			d.promise.then(handler, (e) => handler(null, e || "unknown"));
		});
		teardown(() => {
			for (const d of deferreds) d.reject(OBSOLETE);
		});
		return new Promise((fulfil) => {
			/** @param {Promise<V>} p */
			function next(p) {
				function go() {
					if (p === promise) fulfil(signal);
					else next(promise);
				}
				p.then(go, go);
			}
			next(promise);
		});
	}
	/**
	* @template V
	* @param {() => V} fn
	* @returns {Derived<V>}
	*/
	/*#__NO_SIDE_EFFECTS__*/
	function user_derived(fn) {
		const d = /* @__PURE__ */ derived(fn);
		if (!async_mode_flag) push_reaction_value(d);
		return d;
	}
	/**
	* @template V
	* @param {() => V} fn
	* @returns {Derived<V>}
	*/
	/*#__NO_SIDE_EFFECTS__*/
	function derived_safe_equal(fn) {
		const signal = /* @__PURE__ */ derived(fn);
		signal.equals = safe_equals;
		return signal;
	}
	/**
	* @param {Derived} derived
	* @returns {void}
	*/
	function destroy_derived_effects(derived) {
		var effects = derived.effects;
		if (effects !== null) {
			derived.effects = null;
			for (var i = 0; i < effects.length; i += 1) destroy_effect(effects[i]);
		}
	}
	/**
	* @template T
	* @param {Derived} derived
	* @returns {T}
	*/
	function execute_derived(derived) {
		var value;
		var prev_active_effect = active_effect;
		var parent = derived.parent;
		if (!is_destroying_effect && parent !== null && derived.v !== UNINITIALIZED && (parent.f & 24576) !== 0) {
			derived_inert();
			return derived.v;
		}
		set_active_effect(parent);
		try {
			derived.f &= ~WAS_MARKED;
			destroy_derived_effects(derived);
			value = update_reaction(derived);
		} finally {
			set_active_effect(prev_active_effect);
		}
		return value;
	}
	/**
	* @param {Derived} derived
	* @returns {void}
	*/
	function update_derived(derived) {
		var value = execute_derived(derived);
		if (!derived.equals(value)) {
			derived.wv = increment_write_version();
			if (!current_batch?.is_fork || derived.deps === null) {
				if (current_batch !== null) {
					current_batch.capture(derived, value, true);
					previous_batch?.capture(derived, value, true);
				} else derived.v = value;
				if (derived.deps === null) {
					set_signal_status(derived, CLEAN);
					return;
				}
			}
		}
		if (is_destroying_effect) return;
		if (batch_values !== null) {
			if (effect_tracking() || current_batch?.is_fork) batch_values.set(derived, value);
		} else update_derived_status(derived);
	}
	/**
	* @param {Derived} derived
	*/
	function freeze_derived_effects(derived) {
		if (derived.effects === null) return;
		for (const e of derived.effects) if (e.teardown || e.ac) {
			e.teardown?.();
			e.ac?.abort(STALE_REACTION);
			if (e.fn !== null) e.teardown = noop;
			e.ac = null;
			remove_reactions(e, 0);
			destroy_effect_children(e);
		}
	}
	/**
	* @param {Derived} derived
	*/
	function unfreeze_derived_effects(derived) {
		if (derived.effects === null) return;
		for (const e of derived.effects) if (e.teardown && e.fn !== null) update_effect(e);
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/reactivity/batch.js
	/** @import { Fork } from 'svelte' */
	/** @import { Derived, Effect, Reaction, Source, Value } from '#client' */
	/** @type {Batch | null} */
	var first_batch = null;
	/** @type {Batch | null} */
	var last_batch = null;
	/** @type {Batch | null} */
	var current_batch = null;
	/**
	* This is needed to avoid overwriting inputs
	* @type {Batch | null}
	*/
	var previous_batch = null;
	/**
	* When time travelling (i.e. working in one batch, while other batches
	* still have ongoing work), we ignore the real values of affected
	* signals in favour of their values within the batch
	* @type {Map<Value, any> | null}
	*/
	var batch_values = null;
	/** @type {Effect | null} */
	var last_scheduled_effect = null;
	var is_flushing_sync = false;
	var is_processing = false;
	/**
	* During traversal, this is an array. Newly created effects are (if not immediately
	* executed) pushed to this array, rather than going through the scheduling
	* rigamarole that would cause another turn of the flush loop.
	* @type {Effect[] | null}
	*/
	var collected_effects = null;
	/**
	* An array of effects that are marked during traversal as a result of a `set`
	* (not `internal_set`) call. These will be added to the next batch and
	* trigger another `batch.process()`
	* @type {Effect[] | null}
	* @deprecated when we get rid of legacy mode and stores, we can get rid of this
	*/
	var legacy_updates = null;
	var flush_count = 0;
	var uid = 1;
	var Batch = class Batch {
		id = uid++;
		/** True as soon as `#process` was called */
		#started = false;
		linked = true;
		/** @type {Batch | null} */
		#prev = null;
		/** @type {Batch | null} */
		#next = null;
		/** @type {Map<Effect, ReturnType<typeof deferred<any>>>} */
		async_deriveds = /* @__PURE__ */ new Map();
		/**
		* The current values of any signals that are updated in this batch.
		* Tuple format: [value, is_derived] (note: is_derived is false for deriveds, too, if they were overridden via assignment)
		* They keys of this map are identical to `this.#previous`
		* @type {Map<Value, [any, boolean]>}
		*/
		current = /* @__PURE__ */ new Map();
		/**
		* The values of any signals (sources and deriveds) that are updated in this batch _before_ those updates took place.
		* They keys of this map are identical to `this.#current`
		* @type {Map<Value, any>}
		*/
		previous = /* @__PURE__ */ new Map();
		/**
		* When the batch is committed (and the DOM is updated), we need to remove old branches
		* and append new ones by calling the functions added inside (if/each/key/etc) blocks
		* @type {Set<(batch: Batch) => void>}
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
		* Async effects that are currently in flight, _not_ inside a pending boundary
		* @type {Map<Effect, number>}
		*/
		#blocking_pending = /* @__PURE__ */ new Map();
		/**
		* A deferred that resolves when the batch is committed, used with `settled()`
		* TODO replace with Promise.withResolvers once supported widely enough
		* @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
		*/
		#deferred = null;
		/**
		* The root effects that need to be flushed
		* @type {Effect[]}
		*/
		#roots = [];
		/**
		* Effects created while this batch was active.
		* @type {Effect[]}
		*/
		#new_effects = [];
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
		* A map of branches that still exist, but will be destroyed when this batch
		* is committed — we skip over these during `process`.
		* The value contains child effects that were dirty/maybe_dirty before being reset,
		* so they can be rescheduled if the branch survives.
		* @type {Map<Effect, { d: Effect[], m: Effect[] }>}
		*/
		#skipped_branches = /* @__PURE__ */ new Map();
		/**
		* Inverse of #skipped_branches which we need to tell prior batches to unskip them when committing
		* @type {Set<Effect>}
		*/
		#unskipped_branches = /* @__PURE__ */ new Set();
		is_fork = false;
		#decrement_queued = false;
		constructor() {
			if (last_batch === null) first_batch = last_batch = this;
			else {
				last_batch.#next = this;
				this.#prev = last_batch;
			}
			last_batch = this;
		}
		#is_deferred() {
			if (this.is_fork) return true;
			for (const effect of this.#blocking_pending.keys()) {
				var e = effect;
				var skipped = false;
				while (e.parent !== null) {
					if (this.#skipped_branches.has(e)) {
						skipped = true;
						break;
					}
					e = e.parent;
				}
				if (!skipped) return true;
			}
			return false;
		}
		/**
		* Add an effect to the #skipped_branches map and reset its children
		* @param {Effect} effect
		*/
		skip_effect(effect) {
			if (!this.#skipped_branches.has(effect)) this.#skipped_branches.set(effect, {
				d: [],
				m: []
			});
			this.#unskipped_branches.delete(effect);
		}
		/**
		* Remove an effect from the #skipped_branches map and reschedule
		* any tracked dirty/maybe_dirty child effects
		* @param {Effect} effect
		* @param {(e: Effect) => void} callback
		*/
		unskip_effect(effect, callback = (e) => this.schedule(e)) {
			var tracked = this.#skipped_branches.get(effect);
			if (tracked) {
				this.#skipped_branches.delete(effect);
				for (var e of tracked.d) {
					set_signal_status(e, DIRTY);
					callback(e);
				}
				for (e of tracked.m) {
					set_signal_status(e, MAYBE_DIRTY);
					callback(e);
				}
			}
			this.#unskipped_branches.add(effect);
		}
		#process() {
			this.#started = true;
			if (flush_count++ > 1e3) {
				this.#unlink();
				infinite_loop_guard();
			}
			for (const e of this.#dirty_effects) {
				this.#maybe_dirty_effects.delete(e);
				set_signal_status(e, DIRTY);
				this.schedule(e);
			}
			for (const e of this.#maybe_dirty_effects) {
				set_signal_status(e, MAYBE_DIRTY);
				this.schedule(e);
			}
			const roots = this.#roots;
			this.#roots = [];
			this.apply();
			/** @type {Effect[]} */
			var effects = collected_effects = [];
			/** @type {Effect[]} */
			var render_effects = [];
			/**
			* @type {Effect[]}
			* @deprecated when we get rid of legacy mode and stores, we can get rid of this
			*/
			var updates = legacy_updates = [];
			for (const root of roots) try {
				this.#traverse(root, effects, render_effects);
			} catch (e) {
				reset_all(root);
				if (!this.#is_deferred()) this.discard();
				throw e;
			}
			current_batch = null;
			if (updates.length > 0) {
				var batch = Batch.ensure();
				for (const e of updates) batch.schedule(e);
			}
			collected_effects = null;
			legacy_updates = null;
			if (this.#is_deferred()) {
				this.#defer_effects(render_effects);
				this.#defer_effects(effects);
				for (const [e, t] of this.#skipped_branches) reset_branch(e, t);
				if (updates.length > 0)
 /** @type {Batch} */ current_batch.#process();
				return;
			}
			const earlier_batch = this.#find_earlier_batch();
			if (earlier_batch) {
				this.#defer_effects(render_effects);
				this.#defer_effects(effects);
				earlier_batch.#merge(this);
				return;
			}
			this.#dirty_effects.clear();
			this.#maybe_dirty_effects.clear();
			for (const fn of this.#commit_callbacks) fn(this);
			this.#commit_callbacks.clear();
			previous_batch = this;
			flush_queued_effects(render_effects);
			flush_queued_effects(effects);
			previous_batch = null;
			this.#deferred?.resolve();
			var next_batch = current_batch;
			if (this.#pending === 0 && (this.#roots.length === 0 || next_batch !== null)) {
				this.#unlink();
				if (async_mode_flag) {
					this.#commit();
					current_batch = next_batch;
				}
			}
			if (this.#roots.length > 0) if (next_batch !== null) {
				const batch = next_batch;
				batch.#roots.push(...this.#roots.filter((r) => !batch.#roots.includes(r)));
			} else next_batch = this;
			if (next_batch !== null) next_batch.#process();
		}
		/**
		* Traverse the effect tree, executing effects or stashing
		* them for later execution as appropriate
		* @param {Effect} root
		* @param {Effect[]} effects
		* @param {Effect[]} render_effects
		*/
		#traverse(root, effects, render_effects) {
			root.f ^= CLEAN;
			var effect = root.first;
			while (effect !== null) {
				var flags = effect.f;
				var is_branch = (flags & 96) !== 0;
				if (!(is_branch && (flags & 1024) !== 0 || (flags & 8192) !== 0 || this.#skipped_branches.has(effect)) && effect.fn !== null) {
					if (is_branch) effect.f ^= CLEAN;
					else if ((flags & 4) !== 0) effects.push(effect);
					else if (async_mode_flag && (flags & 16777224) !== 0) render_effects.push(effect);
					else if (is_dirty(effect)) {
						if ((flags & 16) !== 0) this.#maybe_dirty_effects.add(effect);
						update_effect(effect);
					}
					var child = effect.first;
					if (child !== null) {
						effect = child;
						continue;
					}
				}
				while (effect !== null) {
					var next = effect.next;
					if (next !== null) {
						effect = next;
						break;
					}
					effect = effect.parent;
				}
			}
		}
		#find_earlier_batch() {
			var batch = this.#prev;
			while (batch !== null) {
				if (!batch.is_fork) {
					for (const [value, [, is_derived]] of this.current) if (batch.current.has(value) && !is_derived) return batch;
				}
				batch = batch.#prev;
			}
			return null;
		}
		/**
		* @param {Batch} batch
		*/
		#merge(batch) {
			for (const [source, value] of batch.current) {
				if (!this.previous.has(source) && batch.previous.has(source)) this.previous.set(source, batch.previous.get(source));
				this.current.set(source, value);
			}
			for (const [effect, deferred] of batch.async_deriveds) {
				const d = this.async_deriveds.get(effect);
				if (d) deferred.promise.then(d.resolve).catch(d.reject);
			}
			batch.async_deriveds.clear();
			this.transfer_effects(batch.#dirty_effects, batch.#maybe_dirty_effects);
			/**
			* mark all effects that depend on `batch.current`, except the
			* async effects that we just resolved (TODO unless they depend
			* on values in this batch that are NOT in the later batch?).
			* Through this we also will populate the correct #skipped_branches,
			* oncommit callbacks etc, so we don't need to merge them separately.
			* @param {Value} value
			*/
			const mark = (value) => {
				var reactions = value.reactions;
				if (reactions === null) return;
				for (const reaction of reactions) {
					var flags = reaction.f;
					if ((flags & 2) !== 0) mark(reaction);
					else {
						var effect = reaction;
						if (flags & 4194320 && !this.async_deriveds.has(effect)) {
							this.#maybe_dirty_effects.delete(effect);
							set_signal_status(effect, DIRTY);
							this.schedule(effect);
						}
					}
				}
			};
			for (const source of this.current.keys()) mark(source);
			this.oncommit(() => batch.discard());
			batch.#unlink();
			current_batch = this;
			this.#process();
		}
		/**
		* @param {Effect[]} effects
		*/
		#defer_effects(effects) {
			for (var i = 0; i < effects.length; i += 1) defer_effect(effects[i], this.#dirty_effects, this.#maybe_dirty_effects);
		}
		/**
		* Associate a change to a given source with the current
		* batch, noting its previous and current values
		* @param {Value} source
		* @param {any} value
		* @param {boolean} [is_derived]
		*/
		capture(source, value, is_derived = false) {
			if (source.v !== UNINITIALIZED && !this.previous.has(source)) this.previous.set(source, source.v);
			if ((source.f & 8388608) === 0) {
				this.current.set(source, [value, is_derived]);
				batch_values?.set(source, value);
			}
			if (!this.is_fork) source.v = value;
		}
		activate() {
			current_batch = this;
		}
		deactivate() {
			current_batch = null;
			batch_values = null;
		}
		flush() {
			try {
				is_processing = true;
				current_batch = this;
				this.#process();
			} finally {
				flush_count = 0;
				last_scheduled_effect = null;
				collected_effects = null;
				legacy_updates = null;
				is_processing = false;
				current_batch = null;
				batch_values = null;
				old_values.clear();
			}
		}
		discard() {
			for (const fn of this.#discard_callbacks) fn(this);
			this.#discard_callbacks.clear();
			for (const deferred of this.async_deriveds.values()) deferred.reject(OBSOLETE);
			this.#unlink();
			this.#deferred?.resolve();
		}
		/**
		* @param {Effect} effect
		*/
		register_created_effect(effect) {
			this.#new_effects.push(effect);
		}
		#commit() {
			for (let batch = first_batch; batch !== null; batch = batch.#next) {
				var is_earlier = batch.id < this.id;
				/** @type {Source[]} */
				var sources = [];
				for (const [source, [value, is_derived]] of this.current) {
					if (batch.current.has(source)) {
						var batch_value = batch.current.get(source)[0];
						if (is_earlier && value !== batch_value) batch.current.set(source, [value, is_derived]);
						else continue;
					}
					sources.push(source);
				}
				if (is_earlier) for (const [effect, deferred] of this.async_deriveds) {
					const d = batch.async_deriveds.get(effect);
					if (d) deferred.promise.then(d.resolve).catch(d.reject);
				}
				var current = [...batch.current.keys()].filter((source) => !batch.current.get(source)[1]);
				if (!batch.#started || current.length === 0) continue;
				var others = current.filter((source) => !this.current.has(source));
				if (others.length === 0) {
					if (is_earlier) batch.discard();
				} else if (sources.length > 0) {
					if (is_earlier) for (const unskipped of this.#unskipped_branches) batch.unskip_effect(unskipped, (e) => {
						if ((e.f & 4194320) !== 0) batch.schedule(e);
						else batch.#defer_effects([e]);
					});
					batch.activate();
					/** @type {Set<Value>} */
					var marked = /* @__PURE__ */ new Set();
					/** @type {Map<Reaction, boolean>} */
					var checked = /* @__PURE__ */ new Map();
					for (var source of sources) mark_effects(source, others, marked, checked);
					checked = /* @__PURE__ */ new Map();
					var current_unequal = [...batch.current].filter(([c, v1]) => {
						const v2 = this.current.get(c);
						if (!v2) return true;
						return v2[0] !== v1[0] || v2[1] !== v1[1];
					}).map(([c]) => c);
					if (current_unequal.length > 0) {
						for (const effect of this.#new_effects) if ((effect.f & 155648) === 0 && depends_on(effect, current_unequal, checked)) if ((effect.f & 4194320) !== 0) {
							set_signal_status(effect, DIRTY);
							batch.schedule(effect);
						} else batch.#dirty_effects.add(effect);
					}
					if (batch.#roots.length > 0 && !batch.#decrement_queued) {
						batch.apply();
						for (var root of batch.#roots) batch.#traverse(root, [], []);
						batch.#roots = [];
					}
					batch.deactivate();
				}
			}
		}
		/**
		* @param {boolean} blocking
		* @param {Effect} effect
		*/
		increment(blocking, effect) {
			this.#pending += 1;
			if (blocking) {
				let blocking_pending_count = this.#blocking_pending.get(effect) ?? 0;
				this.#blocking_pending.set(effect, blocking_pending_count + 1);
			}
		}
		/**
		* @param {boolean} blocking
		* @param {Effect} effect
		*/
		decrement(blocking, effect) {
			this.#pending -= 1;
			if (blocking) {
				let blocking_pending_count = this.#blocking_pending.get(effect) ?? 0;
				if (blocking_pending_count === 1) this.#blocking_pending.delete(effect);
				else this.#blocking_pending.set(effect, blocking_pending_count - 1);
			}
			if (this.#decrement_queued) return;
			this.#decrement_queued = true;
			queue_micro_task(() => {
				this.#decrement_queued = false;
				if (this.linked) this.flush();
			});
		}
		/**
		* @param {Set<Effect>} dirty_effects
		* @param {Set<Effect>} maybe_dirty_effects
		*/
		transfer_effects(dirty_effects, maybe_dirty_effects) {
			for (const e of dirty_effects) this.#dirty_effects.add(e);
			for (const e of maybe_dirty_effects) this.#maybe_dirty_effects.add(e);
			dirty_effects.clear();
			maybe_dirty_effects.clear();
		}
		/** @param {(batch: Batch) => void} fn */
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
				if (!is_processing && !is_flushing_sync) queue_micro_task(() => {
					if (!batch.#started) batch.flush();
				});
			}
			return current_batch;
		}
		apply() {
			if (!async_mode_flag || !this.is_fork && this.#prev === null && this.#next === null) {
				batch_values = null;
				return;
			}
			batch_values = /* @__PURE__ */ new Map();
			for (const [source, [value]] of this.current) batch_values.set(source, value);
			for (let batch = first_batch; batch !== null; batch = batch.#next) {
				if (batch === this || batch.is_fork) continue;
				var intersects = false;
				if (batch.id < this.id) for (const [source, [, is_derived]] of batch.current) {
					if (is_derived) continue;
					if (this.current.has(source)) {
						intersects = true;
						break;
					}
				}
				if (!intersects) {
					for (const [source, previous] of batch.previous) if (!batch_values.has(source)) batch_values.set(source, previous);
				}
			}
		}
		/**
		*
		* @param {Effect} effect
		*/
		schedule(effect) {
			last_scheduled_effect = effect;
			if (effect.b?.is_pending && (effect.f & 16777228) !== 0 && (effect.f & 32768) === 0) {
				effect.b.defer_effect(effect);
				return;
			}
			var e = effect;
			while (e.parent !== null) {
				e = e.parent;
				var flags = e.f;
				if (collected_effects !== null && e === active_effect) {
					if (async_mode_flag) return;
					if ((active_reaction === null || (active_reaction.f & 2) === 0) && !legacy_is_updating_store) return;
				}
				if ((flags & 96) !== 0) {
					if ((flags & 1024) === 0) return;
					e.f ^= CLEAN;
				}
			}
			this.#roots.push(e);
		}
		#unlink() {
			if (!this.linked) return;
			var prev = this.#prev;
			var next = this.#next;
			if (prev === null) first_batch = next;
			else prev.#next = next;
			if (next === null) last_batch = prev;
			else next.#prev = prev;
			this.linked = false;
		}
	};
	/**
	* Synchronously flush any pending updates.
	* Returns void if no callback is provided, otherwise returns the result of calling the callback.
	* @template [T=void]
	* @param {(() => T) | undefined} [fn]
	* @returns {T}
	*/
	function flushSync(fn) {
		var was_flushing_sync = is_flushing_sync;
		is_flushing_sync = true;
		try {
			var result;
			if (fn) {
				if (current_batch !== null && !current_batch.is_fork) current_batch.flush();
				result = fn();
			}
			while (true) {
				flush_tasks();
				if (current_batch === null) return result;
				current_batch.flush();
			}
		} finally {
			is_flushing_sync = was_flushing_sync;
		}
	}
	function infinite_loop_guard() {
		try {
			effect_update_depth_exceeded();
		} catch (error) {
			invoke_error_boundary(error, last_scheduled_effect);
		}
	}
	/** @type {Set<Effect> | null} */
	var eager_block_effects = null;
	/**
	* @param {Array<Effect>} effects
	* @returns {void}
	*/
	function flush_queued_effects(effects) {
		var length = effects.length;
		if (length === 0) return;
		var i = 0;
		while (i < length) {
			var effect = effects[i++];
			if ((effect.f & 24576) === 0 && is_dirty(effect)) {
				eager_block_effects = /* @__PURE__ */ new Set();
				update_effect(effect);
				if (effect.deps === null && effect.first === null && effect.nodes === null && effect.teardown === null && effect.ac === null) unlink_effect(effect);
				if (eager_block_effects?.size > 0) {
					old_values.clear();
					for (const e of eager_block_effects) {
						if ((e.f & 24576) !== 0) continue;
						/** @type {Effect[]} */
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
							const e = ordered_effects[j];
							if ((e.f & 24576) !== 0) continue;
							update_effect(e);
						}
					}
					eager_block_effects.clear();
				}
			}
		}
		eager_block_effects = null;
	}
	/**
	* This is similar to `mark_reactions`, but it only marks async/block effects
	* depending on `value` and at least one of the other `sources`, so that
	* these effects can re-run after another batch has been committed
	* @param {Value} value
	* @param {Source[]} sources
	* @param {Set<Value>} marked
	* @param {Map<Reaction, boolean>} checked
	*/
	function mark_effects(value, sources, marked, checked) {
		if (marked.has(value)) return;
		marked.add(value);
		if (value.reactions !== null) for (const reaction of value.reactions) {
			const flags = reaction.f;
			if ((flags & 2) !== 0) mark_effects(reaction, sources, marked, checked);
			else if ((flags & 4194320) !== 0 && (flags & 2048) === 0 && depends_on(reaction, sources, checked)) {
				set_signal_status(reaction, DIRTY);
				schedule_effect(reaction);
			}
		}
	}
	/**
	* @param {Reaction} reaction
	* @param {Source[]} sources
	* @param {Map<Reaction, boolean>} checked
	*/
	function depends_on(reaction, sources, checked) {
		const depends = checked.get(reaction);
		if (depends !== void 0) return depends;
		if (reaction.deps !== null) for (const dep of reaction.deps) {
			if (includes.call(sources, dep)) return true;
			if ((dep.f & 2) !== 0 && depends_on(dep, sources, checked)) {
				checked.set(dep, true);
				return true;
			}
		}
		checked.set(reaction, false);
		return false;
	}
	/**
	* @param {Effect} effect
	* @returns {void}
	*/
	function schedule_effect(effect) {
		/** @type {Batch} */ current_batch.schedule(effect);
	}
	/**
	* Mark all the effects inside a skipped branch CLEAN, so that
	* they can be correctly rescheduled later. Tracks dirty and maybe_dirty
	* effects so they can be rescheduled if the branch survives.
	* @param {Effect} effect
	* @param {{ d: Effect[], m: Effect[] }} tracked
	*/
	function reset_branch(effect, tracked) {
		if ((effect.f & 32) !== 0 && (effect.f & 1024) !== 0) return;
		if ((effect.f & 2048) !== 0) tracked.d.push(effect);
		else if ((effect.f & 4096) !== 0) tracked.m.push(effect);
		set_signal_status(effect, CLEAN);
		var e = effect.first;
		while (e !== null) {
			reset_branch(e, tracked);
			e = e.next;
		}
	}
	/**
	* Mark an entire effect tree clean following an error
	* @param {Effect} effect
	*/
	function reset_all(effect) {
		set_signal_status(effect, CLEAN);
		var e = effect.first;
		while (e !== null) {
			reset_all(e);
			e = e.next;
		}
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/reactivity/sources.js
	/** @import { Derived, Effect, Source, Value } from '#client' */
	/** @type {Set<Effect>} */
	var eager_effects = /* @__PURE__ */ new Set();
	/** @type {Map<Source, any>} */
	var old_values = /* @__PURE__ */ new Map();
	var eager_effects_deferred = false;
	/**
	* @template V
	* @param {V} v
	* @param {Error | null} [stack]
	* @returns {Source<V>}
	*/
	function source(v, stack) {
		return {
			f: 0,
			v,
			reactions: null,
			equals,
			rv: 0,
			wv: 0
		};
	}
	/**
	* @template V
	* @param {V} v
	* @param {Error | null} [stack]
	*/
	/*#__NO_SIDE_EFFECTS__*/
	function state(v, stack) {
		const s = source(v, stack);
		push_reaction_value(s);
		return s;
	}
	/**
	* @template V
	* @param {V} initial_value
	* @param {boolean} [immutable]
	* @returns {Source<V>}
	*/
	/*#__NO_SIDE_EFFECTS__*/
	function mutable_source(initial_value, immutable = false, trackable = true) {
		const s = source(initial_value);
		if (!immutable) s.equals = safe_equals;
		if (legacy_mode_flag && trackable && component_context !== null && component_context.l !== null) (component_context.l.s ??= []).push(s);
		return s;
	}
	/**
	* @template V
	* @param {Source<V>} source
	* @param {V} value
	* @param {boolean} [should_proxy]
	* @returns {V}
	*/
	function set(source, value, should_proxy = false) {
		if (active_reaction !== null && (!untracking || (active_reaction.f & 131072) !== 0) && is_runes() && (active_reaction.f & 4325394) !== 0 && (current_sources === null || !current_sources.has(source))) state_unsafe_mutation();
		return internal_set(source, should_proxy ? proxy(value) : value, legacy_updates);
	}
	/**
	* @template V
	* @param {Source<V>} source
	* @param {V} value
	* @param {Effect[] | null} [updated_during_traversal]
	* @returns {V}
	*/
	function internal_set(source, value, updated_during_traversal = null) {
		if (!source.equals(value)) {
			old_values.set(source, is_destroying_effect ? value : source.v);
			var batch = Batch.ensure();
			batch.capture(source, value);
			if ((source.f & 2) !== 0) {
				const derived = source;
				if ((source.f & 2048) !== 0) execute_derived(derived);
				if (batch_values === null) update_derived_status(derived);
			}
			source.wv = increment_write_version();
			mark_reactions(source, DIRTY, updated_during_traversal);
			if (is_runes() && active_effect !== null && (active_effect.f & 1024) !== 0 && (active_effect.f & 96) === 0) if (untracked_writes === null) set_untracked_writes([source]);
			else untracked_writes.push(source);
			if (!batch.is_fork && eager_effects.size > 0 && !eager_effects_deferred) flush_eager_effects();
		}
		return value;
	}
	function flush_eager_effects() {
		eager_effects_deferred = false;
		for (const effect of eager_effects) {
			if ((effect.f & 1024) !== 0) set_signal_status(effect, MAYBE_DIRTY);
			let dirty;
			try {
				dirty = is_dirty(effect);
			} catch {
				dirty = true;
			}
			if (dirty) update_effect(effect);
		}
		eager_effects.clear();
	}
	/**
	* Silently (without using `get`) increment a source
	* @param {Source<number>} source
	*/
	function increment$1(source) {
		set(source, source.v + 1);
	}
	/**
	* @param {Value} signal
	* @param {number} status should be DIRTY or MAYBE_DIRTY
	* @param {Effect[] | null} updated_during_traversal
	* @returns {void}
	*/
	function mark_reactions(signal, status, updated_during_traversal) {
		var reactions = signal.reactions;
		if (reactions === null) return;
		var runes = is_runes();
		var length = reactions.length;
		for (var i = 0; i < length; i++) {
			var reaction = reactions[i];
			var flags = reaction.f;
			if (!runes && reaction === active_effect) continue;
			var not_dirty = (flags & DIRTY) === 0;
			if (not_dirty) set_signal_status(reaction, status);
			if ((flags & 131072) !== 0) eager_effects.add(reaction);
			else if ((flags & 2) !== 0) {
				var derived = reaction;
				batch_values?.delete(derived);
				if ((flags & 65536) === 0) {
					if (flags & 512 && (active_effect === null || (active_effect.f & 2097152) === 0)) reaction.f |= WAS_MARKED;
					mark_reactions(derived, MAYBE_DIRTY, updated_during_traversal);
				}
			} else if (not_dirty) {
				var effect = reaction;
				if ((flags & 16) !== 0 && eager_block_effects !== null) eager_block_effects.add(effect);
				if (updated_during_traversal !== null) updated_during_traversal.push(effect);
				else schedule_effect(effect);
			}
		}
	}
	/**
	* @template T
	* @param {T} value
	* @returns {T}
	*/
	function proxy(value) {
		if (typeof value !== "object" || value === null || STATE_SYMBOL in value) return value;
		const prototype = get_prototype_of(value);
		if (prototype !== object_prototype && prototype !== array_prototype) return value;
		/** @type {Map<any, Source<any>>} */
		var sources = /* @__PURE__ */ new Map();
		var is_proxied_array = is_array(value);
		var version = /* @__PURE__ */ state(0);
		var stack = null;
		var parent_version = update_version;
		/**
		* Executes the proxy in the context of the reaction it was originally created in, if any
		* @template T
		* @param {() => T} fn
		*/
		var with_parent = (fn) => {
			if (update_version === parent_version) return fn();
			var reaction = active_reaction;
			var version = update_version;
			set_active_reaction(null);
			set_update_version(parent_version);
			var result = fn();
			set_active_reaction(reaction);
			set_update_version(version);
			return result;
		};
		if (is_proxied_array) sources.set("length", /* @__PURE__ */ state(
			/** @type {any[]} */
			value.length,
			stack
		));
		return new Proxy(value, {
			defineProperty(_, prop, descriptor) {
				if (!("value" in descriptor) || descriptor.configurable === false || descriptor.enumerable === false || descriptor.writable === false) state_descriptors_fixed();
				var s = sources.get(prop);
				if (s === void 0) with_parent(() => {
					var s = /* @__PURE__ */ state(descriptor.value, stack);
					sources.set(prop, s);
					return s;
				});
				else set(s, descriptor.value, true);
				return true;
			},
			deleteProperty(target, prop) {
				var s = sources.get(prop);
				if (s === void 0) {
					if (prop in target) {
						const s = with_parent(() => /* @__PURE__ */ state(UNINITIALIZED, stack));
						sources.set(prop, s);
						increment$1(version);
					}
				} else {
					set(s, UNINITIALIZED);
					increment$1(version);
				}
				return true;
			},
			get(target, prop, receiver) {
				if (prop === STATE_SYMBOL) return value;
				var s = sources.get(prop);
				var exists = prop in target;
				if (s === void 0 && (!exists || get_descriptor(target, prop)?.writable)) {
					s = with_parent(() => {
						return /* @__PURE__ */ state(proxy(exists ? target[prop] : UNINITIALIZED), stack);
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
					var source = sources.get(prop);
					var value = source?.v;
					if (source !== void 0 && value !== UNINITIALIZED) return {
						enumerable: true,
						configurable: true,
						value,
						writable: true
					};
				}
				return descriptor;
			},
			has(target, prop) {
				if (prop === STATE_SYMBOL) return true;
				var s = sources.get(prop);
				var has = s !== void 0 && s.v !== UNINITIALIZED || Reflect.has(target, prop);
				if (s !== void 0 || active_effect !== null && (!has || get_descriptor(target, prop)?.writable)) {
					if (s === void 0) {
						s = with_parent(() => {
							return /* @__PURE__ */ state(has ? proxy(target[prop]) : UNINITIALIZED, stack);
						});
						sources.set(prop, s);
					}
					if (get(s) === UNINITIALIZED) return false;
				}
				return has;
			},
			set(target, prop, value, receiver) {
				var s = sources.get(prop);
				var has = prop in target;
				if (is_proxied_array && prop === "length") for (var i = value; i < s.v; i += 1) {
					var other_s = sources.get(i + "");
					if (other_s !== void 0) set(other_s, UNINITIALIZED);
					else if (i in target) {
						other_s = with_parent(() => /* @__PURE__ */ state(UNINITIALIZED, stack));
						sources.set(i + "", other_s);
					}
				}
				if (s === void 0) {
					if (!has || get_descriptor(target, prop)?.writable) {
						s = with_parent(() => /* @__PURE__ */ state(void 0, stack));
						set(s, proxy(value));
						sources.set(prop, s);
					}
				} else {
					has = s.v !== UNINITIALIZED;
					var p = with_parent(() => proxy(value));
					set(s, p);
				}
				var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
				if (descriptor?.set) descriptor.set.call(receiver, value);
				if (!has) {
					if (is_proxied_array && typeof prop === "string") {
						var ls = sources.get("length");
						var n = Number(prop);
						if (Number.isInteger(n) && n >= ls.v) set(ls, n + 1);
					}
					increment$1(version);
				}
				return true;
			},
			ownKeys(target) {
				get(version);
				var own_keys = Reflect.ownKeys(target).filter((key) => {
					var source = sources.get(key);
					return source === void 0 || source.v !== UNINITIALIZED;
				});
				for (var [key, source] of sources) if (source.v !== UNINITIALIZED && !(key in target)) own_keys.push(key);
				return own_keys;
			},
			setPrototypeOf() {
				state_prototype_fixed();
			}
		});
	}
	new Set([
		"copyWithin",
		"fill",
		"pop",
		"push",
		"reverse",
		"shift",
		"sort",
		"splice",
		"unshift"
	]);
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/operations.js
	/** @import { Effect, TemplateNode } from '#client' */
	/** @type {Window} */
	var $window;
	/** @type {boolean} */
	var is_firefox;
	/** @type {() => Node | null} */
	var first_child_getter;
	/** @type {() => Node | null} */
	var next_sibling_getter;
	/**
	* Initialize these lazily to avoid issues when using the runtime in a server context
	* where these globals are not available while avoiding a separate server entry point
	*/
	function init_operations() {
		if ($window !== void 0) return;
		$window = window;
		is_firefox = /Firefox/.test(navigator.userAgent);
		var element_prototype = Element.prototype;
		var node_prototype = Node.prototype;
		var text_prototype = Text.prototype;
		first_child_getter = get_descriptor(node_prototype, "firstChild").get;
		next_sibling_getter = get_descriptor(node_prototype, "nextSibling").get;
		if (is_extensible(element_prototype)) {
			/** @type {any} */ element_prototype[CLASS_CACHE] = void 0;
			/** @type {any} */ element_prototype[ATTRIBUTES_CACHE] = null;
			/** @type {any} */ element_prototype[STYLE_CACHE] = void 0;
			element_prototype.__e = void 0;
		}
		if (is_extensible(text_prototype))
 /** @type {any} */ text_prototype[TEXT_CACHE] = void 0;
	}
	/**
	* @param {string} value
	* @returns {Text}
	*/
	function create_text(value = "") {
		return document.createTextNode(value);
	}
	/**
	* @template {Node} N
	* @param {N} node
	*/
	/*@__NO_SIDE_EFFECTS__*/
	function get_first_child(node) {
		return first_child_getter.call(node);
	}
	/**
	* @template {Node} N
	* @param {N} node
	*/
	/*@__NO_SIDE_EFFECTS__*/
	function get_next_sibling(node) {
		return next_sibling_getter.call(node);
	}
	/**
	* Don't mark this as side-effect-free, hydration needs to walk all nodes
	* @template {Node} N
	* @param {N} node
	* @param {boolean} is_text
	* @returns {TemplateNode | null}
	*/
	function child(node, is_text) {
		if (!hydrating) return /* @__PURE__ */ get_first_child(node);
		var child = /* @__PURE__ */ get_first_child(hydrate_node);
		if (child === null) child = hydrate_node.appendChild(create_text());
		else if (is_text && child.nodeType !== 3) {
			var text = create_text();
			child?.before(text);
			set_hydrate_node(text);
			return text;
		}
		if (is_text) merge_text_nodes(child);
		set_hydrate_node(child);
		return child;
	}
	/**
	* Don't mark this as side-effect-free, hydration needs to walk all nodes
	* @param {TemplateNode} node
	* @param {boolean} [is_text]
	* @returns {TemplateNode | null}
	*/
	function first_child(node, is_text = false) {
		if (!hydrating) {
			var first = /* @__PURE__ */ get_first_child(node);
			if (first instanceof Comment && first.data === "") return /* @__PURE__ */ get_next_sibling(first);
			return first;
		}
		if (is_text) {
			if (hydrate_node?.nodeType !== 3) {
				var text = create_text();
				hydrate_node?.before(text);
				set_hydrate_node(text);
				return text;
			}
			merge_text_nodes(hydrate_node);
		}
		return hydrate_node;
	}
	/**
	* Don't mark this as side-effect-free, hydration needs to walk all nodes
	* @param {TemplateNode} node
	* @param {number} count
	* @param {boolean} is_text
	* @returns {TemplateNode | null}
	*/
	function sibling(node, count = 1, is_text = false) {
		let next_sibling = hydrating ? hydrate_node : node;
		var last_sibling;
		while (count--) {
			last_sibling = next_sibling;
			next_sibling = /* @__PURE__ */ get_next_sibling(next_sibling);
		}
		if (!hydrating) return next_sibling;
		if (is_text) {
			if (next_sibling?.nodeType !== 3) {
				var text = create_text();
				if (next_sibling === null) last_sibling?.after(text);
				else next_sibling.before(text);
				set_hydrate_node(text);
				return text;
			}
			merge_text_nodes(next_sibling);
		}
		set_hydrate_node(next_sibling);
		return next_sibling;
	}
	/**
	* @template {Node} N
	* @param {N} node
	* @returns {void}
	*/
	function clear_text_content(node) {
		node.textContent = "";
	}
	/**
	* Returns `true` if we're updating the current block, for example `condition` in
	* an `{#if condition}` block just changed. In this case, the branch should be
	* appended (or removed) at the same time as other updates within the
	* current `<svelte:boundary>`
	*/
	function should_defer_append() {
		if (!async_mode_flag) return false;
		if (eager_block_effects !== null) return false;
		return (active_effect.f & REACTION_RAN) !== 0;
	}
	/**
	* Branching here is intentional and load-bearing for perf. `createElement(tag)`
	* hits a fast path in Blink that `createElementNS(NAMESPACE_HTML, tag)` doesn't,
	* and passing an explicit `undefined` as the trailing options arg measurably
	* slows both APIs. Funnelling every case through a single `createElementNS(ns,
	* tag, options)` call would be smaller but slower on the HTML path.
	*
	* @template {keyof HTMLElementTagNameMap | string} T
	* @param {T} tag
	* @param {string} [namespace]
	* @param {string} [is]
	* @returns {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element}
	*/
	function create_element(tag, namespace, is) {
		if (namespace == null || namespace === "http://www.w3.org/1999/xhtml") return is ? document.createElement(tag, { is }) : document.createElement(tag);
		return is ? document.createElementNS(namespace, tag, { is }) : document.createElementNS(namespace, tag);
	}
	/**
	* Browsers split text nodes larger than 65536 bytes when parsing.
	* For hydration to succeed, we need to stitch them back together
	* @param {Text} text
	*/
	function merge_text_nodes(text) {
		if (text.nodeValue.length < 65536) return;
		let next = text.nextSibling;
		while (next !== null && next.nodeType === 3) {
			next.remove();
			/** @type {string} */ text.nodeValue += next.nodeValue;
			next = text.nextSibling;
		}
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
	/**
	* The child of a textarea actually corresponds to the defaultValue property, so we need
	* to remove it upon hydration to avoid a bug when someone resets the form value.
	* @param {HTMLTextAreaElement} dom
	* @returns {void}
	*/
	function remove_textarea_child(dom) {
		if (hydrating && /* @__PURE__ */ get_first_child(dom) !== null) clear_text_content(dom);
	}
	var listening_to_form_reset = false;
	function add_form_reset_listener() {
		if (!listening_to_form_reset) {
			listening_to_form_reset = true;
			document.addEventListener("reset", (evt) => {
				Promise.resolve().then(() => {
					if (!evt.defaultPrevented) for (const e of evt.target.elements)
 /** @type {any} */ e[FORM_RESET_HANDLER]?.();
				});
			}, { capture: true });
		}
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
	/**
	* @template T
	* @param {() => T} fn
	*/
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
	/**
	* Listen to the given event, and then instantiate a global form reset listener if not already done,
	* to notify all bindings when the form is reset
	* @param {HTMLElement} element
	* @param {string} event
	* @param {(is_reset?: true) => void} handler
	* @param {(is_reset?: true) => void} [on_reset]
	*/
	function listen_to_event_and_reset_event(element, event, handler, on_reset = handler) {
		element.addEventListener(event, () => without_reactive_context(handler));
		const prev = element[FORM_RESET_HANDLER];
		if (prev)
 /** @type {any} */ element[FORM_RESET_HANDLER] = () => {
			prev();
			on_reset(true);
		};
		else
 /** @type {any} */ element[FORM_RESET_HANDLER] = () => on_reset(true);
		add_form_reset_listener();
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/reactivity/effects.js
	/** @import { Blocker, ComponentContext, ComponentContextLegacy, Derived, Effect, TemplateNode, TransitionManager } from '#client' */
	/**
	* @param {'$effect' | '$effect.pre' | '$inspect'} rune
	*/
	function validate_effect(rune) {
		if (active_effect === null) {
			if (active_reaction === null) effect_orphan(rune);
			effect_in_unowned_derived();
		}
		if (is_destroying_effect) effect_in_teardown(rune);
	}
	/**
	* @param {Effect} effect
	* @param {Effect} parent_effect
	*/
	function push_effect(effect, parent_effect) {
		var parent_last = parent_effect.last;
		if (parent_last === null) parent_effect.last = parent_effect.first = effect;
		else {
			parent_last.next = effect;
			effect.prev = parent_last;
			parent_effect.last = effect;
		}
	}
	/**
	* @param {number} type
	* @param {null | (() => void | (() => void))} fn
	* @returns {Effect}
	*/
	function create_effect(type, fn) {
		var parent = active_effect;
		if (parent !== null && (parent.f & 8192) !== 0) type |= INERT;
		/** @type {Effect} */
		var effect = {
			ctx: component_context,
			deps: null,
			nodes: null,
			f: type | DIRTY | 512,
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
		current_batch?.register_created_effect(effect);
		/** @type {Effect | null} */
		var e = effect;
		if ((type & 4) !== 0) if (collected_effects !== null) collected_effects.push(effect);
		else Batch.ensure().schedule(effect);
		else if (fn !== null) {
			try {
				update_effect(effect);
			} catch (e) {
				destroy_effect(effect);
				throw e;
			}
			if (e.deps === null && e.teardown === null && e.nodes === null && e.first === e.last && (e.f & 524288) === 0) {
				e = e.first;
				if ((type & 16) !== 0 && (type & 65536) !== 0 && e !== null) e.f |= EFFECT_TRANSPARENT;
			}
		}
		if (e !== null) {
			e.parent = parent;
			if (parent !== null) push_effect(e, parent);
			if (active_reaction !== null && (active_reaction.f & 2) !== 0 && (type & 64) === 0) {
				var derived = active_reaction;
				(derived.effects ??= []).push(e);
			}
		}
		return effect;
	}
	/**
	* Internal representation of `$effect.tracking()`
	* @returns {boolean}
	*/
	function effect_tracking() {
		return active_reaction !== null && !untracking;
	}
	/**
	* @param {() => void} fn
	*/
	function teardown(fn) {
		const effect = create_effect(8, null);
		set_signal_status(effect, CLEAN);
		effect.teardown = fn;
		return effect;
	}
	/**
	* Internal representation of `$effect(...)`
	* @param {() => void | (() => void)} fn
	*/
	function user_effect(fn) {
		validate_effect("$effect");
		var flags = active_effect.f;
		if (!active_reaction && (flags & 32) !== 0 && component_context !== null && !component_context.i) {
			var context = component_context;
			(context.e ??= []).push(fn);
		} else return create_user_effect(fn);
	}
	/**
	* @param {() => void | (() => void)} fn
	*/
	function create_user_effect(fn) {
		return create_effect(4 | USER_EFFECT, fn);
	}
	/**
	* Internal representation of `$effect.pre(...)`
	* @param {() => void | (() => void)} fn
	* @returns {Effect}
	*/
	function user_pre_effect(fn) {
		validate_effect("$effect.pre");
		return create_effect(8 | USER_EFFECT, fn);
	}
	/**
	* An effect root whose children can transition out
	* @param {() => void} fn
	* @returns {(options?: { outro?: boolean }) => Promise<void>}
	*/
	function component_root(fn) {
		Batch.ensure();
		const effect = create_effect(64 | EFFECT_PRESERVED, fn);
		return (options = {}) => {
			return new Promise((fulfil) => {
				if (options.outro) pause_effect(effect, () => {
					destroy_effect(effect);
					fulfil(void 0);
				});
				else {
					destroy_effect(effect);
					fulfil(void 0);
				}
			});
		};
	}
	/**
	* @param {() => void | (() => void)} fn
	* @returns {Effect}
	*/
	function effect(fn) {
		return create_effect(4, fn);
	}
	/**
	* @param {() => void | (() => void)} fn
	* @returns {Effect}
	*/
	function async_effect(fn) {
		return create_effect(ASYNC | EFFECT_PRESERVED, fn);
	}
	/**
	* @param {() => void | (() => void)} fn
	* @returns {Effect}
	*/
	function render_effect(fn, flags = 0) {
		return create_effect(8 | flags, fn);
	}
	/**
	* @param {(...expressions: any) => void | (() => void)} fn
	* @param {Array<() => any>} sync
	* @param {Array<() => Promise<any>>} async
	* @param {Blocker[]} blockers
	*/
	function template_effect(fn, sync = [], async = [], blockers = []) {
		flatten(blockers, sync, async, (values) => {
			create_effect(8, () => {
				fn(...values.map(get));
			});
		});
	}
	/**
	* @param {(() => void)} fn
	* @param {number} flags
	*/
	function block(fn, flags = 0) {
		return create_effect(16 | flags, fn);
	}
	/**
	* @param {(() => void)} fn
	*/
	function branch(fn) {
		return create_effect(32 | EFFECT_PRESERVED, fn);
	}
	/**
	* @param {Effect} effect
	*/
	function execute_effect_teardown(effect) {
		var teardown = effect.teardown;
		if (teardown !== null) {
			const previously_destroying_effect = is_destroying_effect;
			const previous_reaction = active_reaction;
			set_is_destroying_effect(true);
			set_active_reaction(null);
			try {
				teardown.call(null);
			} finally {
				set_is_destroying_effect(previously_destroying_effect);
				set_active_reaction(previous_reaction);
			}
		}
	}
	/**
	* @param {Effect} signal
	* @param {boolean} remove_dom
	* @returns {void}
	*/
	function destroy_effect_children(signal, remove_dom = false) {
		var effect = signal.first;
		signal.first = signal.last = null;
		while (effect !== null) {
			const controller = effect.ac;
			if (controller !== null) without_reactive_context(() => {
				controller.abort(STALE_REACTION);
			});
			var next = effect.next;
			if ((effect.f & 64) !== 0) effect.parent = null;
			else destroy_effect(effect, remove_dom);
			effect = next;
		}
	}
	/**
	* @param {Effect} signal
	* @returns {void}
	*/
	function destroy_block_effect_children(signal) {
		var effect = signal.first;
		while (effect !== null) {
			var next = effect.next;
			if ((effect.f & 32) === 0) destroy_effect(effect);
			effect = next;
		}
	}
	/**
	* @param {Effect} effect
	* @param {boolean} [remove_dom]
	* @returns {void}
	*/
	function destroy_effect(effect, remove_dom = true) {
		var removed = false;
		if ((remove_dom || (effect.f & 262144) !== 0) && effect.nodes !== null && effect.nodes.end !== null) {
			remove_effect_dom(effect.nodes.start, effect.nodes.end);
			removed = true;
		}
		effect.f |= DESTROYING;
		destroy_effect_children(effect, remove_dom && !removed);
		remove_reactions(effect, 0);
		var transitions = effect.nodes && effect.nodes.t;
		if (transitions !== null) for (const transition of transitions) transition.stop();
		execute_effect_teardown(effect);
		effect.f ^= DESTROYING;
		effect.f |= DESTROYED;
		var parent = effect.parent;
		if (parent !== null && parent.first !== null) unlink_effect(effect);
		effect.next = effect.prev = effect.teardown = effect.ctx = effect.deps = effect.fn = effect.nodes = effect.ac = effect.b = null;
	}
	/**
	*
	* @param {TemplateNode | null} node
	* @param {TemplateNode} end
	*/
	function remove_effect_dom(node, end) {
		while (node !== null) {
			/** @type {TemplateNode | null} */
			var next = node === end ? null : /* @__PURE__ */ get_next_sibling(node);
			node.remove();
			node = next;
		}
	}
	/**
	* Detach an effect from the effect tree, freeing up memory and
	* reducing the amount of work that happens on subsequent traversals
	* @param {Effect} effect
	*/
	function unlink_effect(effect) {
		var parent = effect.parent;
		var prev = effect.prev;
		var next = effect.next;
		if (prev !== null) prev.next = next;
		if (next !== null) next.prev = prev;
		if (parent !== null) {
			if (parent.first === effect) parent.first = next;
			if (parent.last === effect) parent.last = prev;
		}
	}
	/**
	* When a block effect is removed, we don't immediately destroy it or yank it
	* out of the DOM, because it might have transitions. Instead, we 'pause' it.
	* It stays around (in memory, and in the DOM) until outro transitions have
	* completed, and if the state change is reversed then we _resume_ it.
	* A paused effect does not update, and the DOM subtree becomes inert.
	* @param {Effect} effect
	* @param {() => void} [callback]
	* @param {boolean} [destroy]
	*/
	function pause_effect(effect, callback, destroy = true) {
		/** @type {TransitionManager[]} */
		var transitions = [];
		pause_children(effect, transitions, true);
		var fn = () => {
			if (destroy) destroy_effect(effect);
			if (callback) callback();
		};
		var remaining = transitions.length;
		if (remaining > 0) {
			var check = () => --remaining || fn();
			for (var transition of transitions) transition.out(check);
		} else fn();
	}
	/**
	* @param {Effect} effect
	* @param {TransitionManager[]} transitions
	* @param {boolean} local
	*/
	function pause_children(effect, transitions, local) {
		if ((effect.f & 8192) !== 0) return;
		effect.f ^= INERT;
		var t = effect.nodes && effect.nodes.t;
		if (t !== null) {
			for (const transition of t) if (transition.is_global || local) transitions.push(transition);
		}
		var child = effect.first;
		while (child !== null) {
			var sibling = child.next;
			if ((child.f & 64) === 0) {
				var transparent = (child.f & 65536) !== 0 || (child.f & 32) !== 0 && (effect.f & 16) !== 0;
				pause_children(child, transitions, transparent ? local : false);
			}
			child = sibling;
		}
	}
	/**
	* The opposite of `pause_effect`. We call this if (for example)
	* `x` becomes falsy then truthy: `{#if x}...{/if}`
	* @param {Effect} effect
	*/
	function resume_effect(effect) {
		resume_children(effect, true);
	}
	/**
	* @param {Effect} effect
	* @param {boolean} local
	*/
	function resume_children(effect, local) {
		if ((effect.f & 8192) === 0) return;
		effect.f ^= INERT;
		if ((effect.f & 1024) === 0) {
			set_signal_status(effect, DIRTY);
			Batch.ensure().schedule(effect);
		}
		var child = effect.first;
		while (child !== null) {
			var sibling = child.next;
			var transparent = (child.f & 65536) !== 0 || (child.f & 32) !== 0;
			resume_children(child, transparent ? local : false);
			child = sibling;
		}
		var t = effect.nodes && effect.nodes.t;
		if (t !== null) {
			for (const transition of t) if (transition.is_global || local) transition.in();
		}
	}
	/**
	* @param {Effect} effect
	* @param {DocumentFragment} fragment
	*/
	function move_effect(effect, fragment) {
		if (!effect.nodes) return;
		/** @type {TemplateNode | null} */
		var node = effect.nodes.start;
		var end = effect.nodes.end;
		while (node !== null) {
			/** @type {TemplateNode | null} */
			var next = node === end ? null : /* @__PURE__ */ get_next_sibling(node);
			fragment.append(node);
			node = next;
		}
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/legacy.js
	/**
	* @type {Set<Value> | null}
	* @deprecated
	*/
	var captured_signals = null;
	//#endregion
	//#region node_modules/svelte/src/internal/client/runtime.js
	/** @import { Derived, Effect, Reaction, Source, Value } from '#client' */
	var is_updating_effect = false;
	var is_destroying_effect = false;
	/** @param {boolean} value */
	function set_is_destroying_effect(value) {
		is_destroying_effect = value;
	}
	/** @type {null | Reaction} */
	var active_reaction = null;
	var untracking = false;
	/** @param {null | Reaction} reaction */
	function set_active_reaction(reaction) {
		active_reaction = reaction;
	}
	/** @type {null | Effect} */
	var active_effect = null;
	/** @param {null | Effect} effect */
	function set_active_effect(effect) {
		active_effect = effect;
	}
	/**
	* When sources are created within a reaction, reading and writing
	* them within that reaction should not cause a re-run
	* @type {null | Set<Source>}
	*/
	var current_sources = null;
	/** @param {Value} value */
	function push_reaction_value(value) {
		if (active_reaction !== null && (!async_mode_flag || (active_reaction.f & 2) !== 0)) (current_sources ??= /* @__PURE__ */ new Set()).add(value);
	}
	/**
	* The dependencies of the reaction that is currently being executed. In many cases,
	* the dependencies are unchanged between runs, and so this will be `null` unless
	* and until a new dependency is accessed — we track this via `skipped_deps`
	* @type {null | Value[]}
	*/
	var new_deps = null;
	var skipped_deps = 0;
	/**
	* Tracks writes that the effect it's executed in doesn't listen to yet,
	* so that the dependency can be added to the effect later on if it then reads it
	* @type {null | Source[]}
	*/
	var untracked_writes = null;
	/** @param {null | Source[]} value */
	function set_untracked_writes(value) {
		untracked_writes = value;
	}
	/**
	* @type {number} Used by sources and deriveds for handling updates.
	* Version starts from 1 so that unowned deriveds differentiate between a created effect and a run one for tracing
	**/
	var write_version = 1;
	/** @type {number} Used to version each read of a source of derived to avoid duplicating depedencies inside a reaction */
	var read_version = 0;
	var update_version = read_version;
	/** @param {number} value */
	function set_update_version(value) {
		update_version = value;
	}
	function increment_write_version() {
		return ++write_version;
	}
	/**
	* Determines whether a derived or effect is dirty.
	* If it is MAYBE_DIRTY, will set the status to CLEAN
	* @param {Reaction} reaction
	* @returns {boolean}
	*/
	function is_dirty(reaction) {
		var flags = reaction.f;
		if ((flags & 2048) !== 0) return true;
		if (flags & 2) reaction.f &= ~WAS_MARKED;
		if ((flags & 4096) !== 0) {
			var dependencies = reaction.deps;
			var length = dependencies.length;
			for (var i = 0; i < length; i++) {
				var dependency = dependencies[i];
				if (is_dirty(dependency)) update_derived(dependency);
				if (dependency.wv > reaction.wv) return true;
			}
			if ((flags & 512) !== 0 && batch_values === null) set_signal_status(reaction, CLEAN);
		}
		return false;
	}
	/**
	* @param {Value} signal
	* @param {Effect} effect
	* @param {boolean} [root]
	*/
	function schedule_possible_effect_self_invalidation(signal, effect, root = true) {
		var reactions = signal.reactions;
		if (reactions === null) return;
		if (!async_mode_flag && current_sources !== null && current_sources.has(signal)) return;
		for (var i = 0; i < reactions.length; i++) {
			var reaction = reactions[i];
			if ((reaction.f & 2) !== 0) schedule_possible_effect_self_invalidation(reaction, effect, false);
			else if (effect === reaction) {
				if (root) set_signal_status(reaction, DIRTY);
				else if ((reaction.f & 1024) !== 0) set_signal_status(reaction, MAYBE_DIRTY);
				schedule_effect(reaction);
			}
		}
	}
	/** @param {Reaction} reaction */
	function update_reaction(reaction) {
		var previous_deps = new_deps;
		var previous_skipped_deps = skipped_deps;
		var previous_untracked_writes = untracked_writes;
		var previous_reaction = active_reaction;
		var previous_sources = current_sources;
		var previous_component_context = component_context;
		var previous_untracking = untracking;
		var previous_update_version = update_version;
		var flags = reaction.f;
		new_deps = null;
		skipped_deps = 0;
		untracked_writes = null;
		active_reaction = (flags & 96) === 0 ? reaction : null;
		current_sources = null;
		set_component_context(reaction.ctx);
		untracking = false;
		update_version = ++read_version;
		if (reaction.ac !== null) {
			without_reactive_context(() => {
				/** @type {AbortController} */ reaction.ac.abort(STALE_REACTION);
			});
			reaction.ac = null;
		}
		try {
			reaction.f |= REACTION_IS_UPDATING;
			var fn = reaction.fn;
			var result = fn();
			reaction.f |= REACTION_RAN;
			var deps = reaction.deps;
			var is_fork = current_batch?.is_fork;
			if (new_deps !== null) {
				var i;
				if (!is_fork) remove_reactions(reaction, skipped_deps);
				if (deps !== null && skipped_deps > 0) {
					deps.length = skipped_deps + new_deps.length;
					for (i = 0; i < new_deps.length; i++) deps[skipped_deps + i] = new_deps[i];
				} else reaction.deps = deps = new_deps;
				if (effect_tracking() && (reaction.f & 512) !== 0) for (i = skipped_deps; i < deps.length; i++) (deps[i].reactions ??= []).push(reaction);
			} else if (!is_fork && deps !== null && skipped_deps < deps.length) {
				remove_reactions(reaction, skipped_deps);
				deps.length = skipped_deps;
			}
			if (is_runes() && untracked_writes !== null && !untracking && deps !== null && (reaction.f & 6146) === 0) for (i = 0; i < untracked_writes.length; i++) schedule_possible_effect_self_invalidation(untracked_writes[i], reaction);
			if (previous_reaction !== null && previous_reaction !== reaction) {
				read_version++;
				if (previous_reaction.deps !== null) for (let i = 0; i < previous_skipped_deps; i += 1) previous_reaction.deps[i].rv = read_version;
				if (previous_deps !== null) for (const dep of previous_deps) dep.rv = read_version;
				if (untracked_writes !== null) if (previous_untracked_writes === null) previous_untracked_writes = untracked_writes;
				else previous_untracked_writes.push(...untracked_writes);
			}
			if ((reaction.f & 8388608) !== 0) reaction.f ^= ERROR_VALUE;
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
	/**
	* @template V
	* @param {Reaction} signal
	* @param {Value<V>} dependency
	* @returns {void}
	*/
	function remove_reaction(signal, dependency) {
		let reactions = dependency.reactions;
		if (reactions !== null) {
			var index = index_of.call(reactions, signal);
			if (index !== -1) {
				var new_length = reactions.length - 1;
				if (new_length === 0) reactions = dependency.reactions = null;
				else {
					reactions[index] = reactions[new_length];
					reactions.pop();
				}
			}
		}
		if (reactions === null && (dependency.f & 2) !== 0 && (new_deps === null || !includes.call(new_deps, dependency))) {
			var derived = dependency;
			if ((derived.f & 512) !== 0) {
				derived.f ^= 512;
				derived.f &= ~WAS_MARKED;
			}
			if (derived.v !== UNINITIALIZED) update_derived_status(derived);
			freeze_derived_effects(derived);
			remove_reactions(derived, 0);
		}
	}
	/**
	* @param {Reaction} signal
	* @param {number} start_index
	* @returns {void}
	*/
	function remove_reactions(signal, start_index) {
		var dependencies = signal.deps;
		if (dependencies === null) return;
		for (var i = start_index; i < dependencies.length; i++) remove_reaction(signal, dependencies[i]);
	}
	/**
	* @param {Effect} effect
	* @returns {void}
	*/
	function update_effect(effect) {
		var flags = effect.f;
		if ((flags & 16384) !== 0) return;
		set_signal_status(effect, CLEAN);
		var previous_effect = active_effect;
		var was_updating_effect = is_updating_effect;
		active_effect = effect;
		is_updating_effect = true;
		try {
			if ((flags & 16777232) !== 0) destroy_block_effect_children(effect);
			else destroy_effect_children(effect);
			execute_effect_teardown(effect);
			var teardown = update_reaction(effect);
			effect.teardown = typeof teardown === "function" ? teardown : null;
			effect.wv = write_version;
		} finally {
			is_updating_effect = was_updating_effect;
			active_effect = previous_effect;
		}
	}
	/**
	* Returns a promise that resolves once any pending state changes have been applied.
	* @returns {Promise<void>}
	*/
	async function tick() {
		if (async_mode_flag) return new Promise((f) => {
			requestAnimationFrame(() => f());
			setTimeout(() => f());
		});
		await Promise.resolve();
		flushSync();
	}
	/**
	* @template V
	* @param {Value<V>} signal
	* @returns {V}
	*/
	function get(signal) {
		var is_derived = (signal.f & 2) !== 0;
		captured_signals?.add(signal);
		if (active_reaction !== null && !untracking) {
			if (!(active_effect !== null && (active_effect.f & 16384) !== 0) && (current_sources === null || !current_sources.has(signal))) {
				var deps = active_reaction.deps;
				if ((active_reaction.f & 2097152) !== 0) {
					if (signal.rv < read_version) {
						signal.rv = read_version;
						if (new_deps === null && deps !== null && deps[skipped_deps] === signal) skipped_deps++;
						else if (new_deps === null) new_deps = [signal];
						else new_deps.push(signal);
					}
				} else {
					active_reaction.deps ??= [];
					if (!includes.call(active_reaction.deps, signal)) active_reaction.deps.push(signal);
					var reactions = signal.reactions;
					if (reactions === null) signal.reactions = [active_reaction];
					else if (!includes.call(reactions, active_reaction)) reactions.push(active_reaction);
				}
			}
		}
		if (is_destroying_effect && old_values.has(signal)) return old_values.get(signal);
		if (is_derived) {
			var derived = signal;
			if (is_destroying_effect) {
				var value = derived.v;
				if ((derived.f & 1024) === 0 && derived.reactions !== null || depends_on_old_values(derived)) value = execute_derived(derived);
				old_values.set(derived, value);
				return value;
			}
			var should_connect = (derived.f & 512) === 0 && !untracking && active_reaction !== null && (is_updating_effect || (active_reaction.f & 512) !== 0);
			var is_new = (derived.f & REACTION_RAN) === 0;
			if (is_dirty(derived)) {
				if (should_connect) derived.f |= 512;
				update_derived(derived);
			}
			if (should_connect && !is_new) {
				unfreeze_derived_effects(derived);
				reconnect(derived);
			}
		}
		if (batch_values?.has(signal)) return batch_values.get(signal);
		if ((signal.f & 8388608) !== 0) throw signal.v;
		return signal.v;
	}
	/**
	* (Re)connect a disconnected derived, so that it is notified
	* of changes in `mark_reactions`
	* @param {Derived} derived
	*/
	function reconnect(derived) {
		derived.f |= 512;
		if (derived.deps === null) return;
		for (const dep of derived.deps) {
			(dep.reactions ??= []).push(derived);
			if ((dep.f & 2) !== 0 && (dep.f & 512) === 0) {
				unfreeze_derived_effects(dep);
				reconnect(dep);
			}
		}
	}
	/** @param {Derived} derived */
	function depends_on_old_values(derived) {
		if (derived.v === UNINITIALIZED) return true;
		if (derived.deps === null) return false;
		for (const dep of derived.deps) {
			if (old_values.has(dep)) return true;
			if ((dep.f & 2) !== 0 && depends_on_old_values(dep)) return true;
		}
		return false;
	}
	/**
	* When used inside a [`$derived`](https://svelte.dev/docs/svelte/$derived) or [`$effect`](https://svelte.dev/docs/svelte/$effect),
	* any state read inside `fn` will not be treated as a dependency.
	*
	* ```ts
	* $effect(() => {
	*   // this will run when `data` changes, but not when `time` changes
	*   save(data, {
	*     timestamp: untrack(() => time)
	*   });
	* });
	* ```
	* @template T
	* @param {() => T} fn
	* @returns {T}
	*/
	function untrack(fn) {
		var previous_untracking = untracking;
		try {
			untracking = true;
			return fn();
		} finally {
			untracking = previous_untracking;
		}
	}
	/**
	* Possibly traverse an object and read all its properties so that they're all reactive in case this is `$state`.
	* Does only check first level of an object for performance reasons (heuristic should be good for 99% of all cases).
	* @param {any} value
	* @returns {void}
	*/
	function deep_read_state(value) {
		if (typeof value !== "object" || !value || value instanceof EventTarget) return;
		if (STATE_SYMBOL in value) deep_read(value);
		else if (!Array.isArray(value)) for (let key in value) {
			const prop = value[key];
			if (typeof prop === "object" && prop && STATE_SYMBOL in prop) deep_read(prop);
		}
	}
	/**
	* Deeply traverse an object and read all its properties
	* so that they're all reactive in case this is `$state`
	* @param {any} value
	* @param {Set<any>} visited
	* @returns {void}
	*/
	function deep_read(value, visited = /* @__PURE__ */ new Set()) {
		if (typeof value === "object" && value !== null && !(value instanceof EventTarget) && !visited.has(value)) {
			visited.add(value);
			if (value instanceof Date) value.getTime();
			for (let key in value) try {
				deep_read(value[key], visited);
			} catch (e) {}
			const proto = get_prototype_of(value);
			if (proto !== Object.prototype && proto !== Array.prototype && proto !== Map.prototype && proto !== Set.prototype && proto !== Date.prototype) {
				const descriptors = get_descriptors(proto);
				for (let key in descriptors) {
					const get = descriptors[key].get;
					if (get) try {
						get.call(value);
					} catch (e) {}
				}
			}
		}
	}
	/**
	* Subset of delegated events which should be passive by default.
	* These two are already passive via browser defaults on window, document and body.
	* But since
	* - we're delegating them
	* - they happen often
	* - they apply to mobile which is generally less performant
	* we're marking them as passive by default for other elements, too.
	*/
	var PASSIVE_EVENTS = ["touchstart", "touchmove"];
	/**
	* Returns `true` if `name` is a passive event
	* @param {string} name
	*/
	function is_passive_event(name) {
		return PASSIVE_EVENTS.includes(name);
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/elements/events.js
	/**
	* Used on elements, as a map of event type -> event handler,
	* and on events themselves to track which element handled an event
	*/
	var event_symbol = Symbol("events");
	/** @type {Set<string>} */
	var all_registered_events = /* @__PURE__ */ new Set();
	/** @type {Set<(events: Array<string>) => void>} */
	var root_event_handles = /* @__PURE__ */ new Set();
	/**
	* @param {string} event_name
	* @param {EventTarget} dom
	* @param {EventListener} [handler]
	* @param {AddEventListenerOptions} [options]
	*/
	function create_event(event_name, dom, handler, options = {}) {
		/**
		* @this {EventTarget}
		*/
		function target_handler(event) {
			if (!options.capture) handle_event_propagation.call(dom, event);
			if (!event.cancelBubble) return without_reactive_context(() => {
				return handler?.call(this, event);
			});
		}
		if (event_name.startsWith("pointer") || event_name.startsWith("touch") || event_name === "wheel") queue_micro_task(() => {
			dom.addEventListener(event_name, target_handler, options);
		});
		else dom.addEventListener(event_name, target_handler, options);
		return target_handler;
	}
	/**
	* @param {string} event_name
	* @param {Element} dom
	* @param {EventListener} [handler]
	* @param {boolean} [capture]
	* @param {boolean} [passive]
	* @returns {void}
	*/
	function event(event_name, dom, handler, capture, passive) {
		var options = {
			capture,
			passive
		};
		var target_handler = create_event(event_name, dom, handler, options);
		if (dom === document.body || dom === window || dom === document || dom instanceof HTMLMediaElement) teardown(() => {
			dom.removeEventListener(event_name, target_handler, options);
		});
	}
	/**
	* @param {string} event_name
	* @param {Element} element
	* @param {EventListener} [handler]
	* @returns {void}
	*/
	function delegated(event_name, element, handler) {
		(element[event_symbol] ??= {})[event_name] = handler;
	}
	/**
	* @param {Array<string>} events
	* @returns {void}
	*/
	function delegate(events) {
		for (var i = 0; i < events.length; i++) all_registered_events.add(events[i]);
		for (var fn of root_event_handles) fn(events);
	}
	var last_propagated_event = null;
	/**
	* @this {EventTarget}
	* @param {Event} event
	* @returns {void}
	*/
	function handle_event_propagation(event) {
		var handler_element = this;
		var owner_document = handler_element.ownerDocument;
		var event_name = event.type;
		var path = event.composedPath?.() || [];
		var current_target = path[0] || event.target;
		last_propagated_event = event;
		var path_idx = 0;
		var handled_at = last_propagated_event === event && event[event_symbol];
		if (handled_at) {
			var at_idx = path.indexOf(handled_at);
			if (at_idx !== -1 && (handler_element === document || handler_element === window)) {
				event[event_symbol] = handler_element;
				return;
			}
			var handler_idx = path.indexOf(handler_element);
			if (handler_idx === -1) return;
			if (at_idx <= handler_idx) path_idx = at_idx;
		}
		current_target = path[path_idx] || event.target;
		if (current_target === handler_element) return;
		define_property(event, "currentTarget", {
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
			/**
			* @type {unknown}
			*/
			var throw_error;
			/**
			* @type {unknown[]}
			*/
			var other_errors = [];
			while (current_target !== null) {
				if (current_target === handler_element) break;
				try {
					var delegated = current_target[event_symbol]?.[event_name];
					if (delegated != null && (!current_target.disabled || event.target === current_target)) delegated.call(current_target, event);
				} catch (error) {
					if (throw_error) other_errors.push(error);
					else throw_error = error;
				}
				if (event.cancelBubble) break;
				path_idx++;
				current_target = path_idx < path.length ? path[path_idx] : null;
			}
			if (throw_error) {
				for (let error of other_errors) queueMicrotask(() => {
					throw error;
				});
				throw throw_error;
			}
		} finally {
			event[event_symbol] = handler_element;
			delete event.currentTarget;
			set_active_reaction(previous_reaction);
			set_active_effect(previous_effect);
		}
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/reconciler.js
	var policy = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { 
	/** @param {string} html */
createHTML: (html) => {
		return html;
	} });
	/** @param {string} html */
	function create_trusted_html(html) {
		return policy?.createHTML(html) ?? html;
	}
	/**
	* @param {string} html
	*/
	function create_fragment_from_html(html) {
		var elem = create_element("template");
		elem.innerHTML = create_trusted_html(html.replaceAll("<!>", "<!---->"));
		return elem.content;
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/template.js
	/** @import { Effect, EffectNodes, TemplateNode } from '#client' */
	/** @import { TemplateStructure } from './types' */
	/**
	* @param {TemplateNode} start
	* @param {TemplateNode | null} end
	*/
	function assign_nodes(start, end) {
		var effect = active_effect;
		if (effect.nodes === null) effect.nodes = {
			start,
			end,
			a: null,
			t: null
		};
	}
	/**
	* @param {string} content
	* @param {number} flags
	* @returns {() => Node | Node[]}
	*/
	/*#__NO_SIDE_EFFECTS__*/
	function from_html(content, flags) {
		var is_fragment = (flags & 1) !== 0;
		var use_import_node = (flags & 2) !== 0;
		/** @type {Node} */
		var node;
		/**
		* Whether or not the first item is a text/element node. If not, we need to
		* create an additional comment node to act as `effect.nodes.start`
		*/
		var has_start = !content.startsWith("<!>");
		return () => {
			if (hydrating) {
				assign_nodes(hydrate_node, null);
				return hydrate_node;
			}
			if (node === void 0) {
				node = create_fragment_from_html(has_start ? content : "<!>" + content);
				if (!is_fragment) node = /* @__PURE__ */ get_first_child(node);
			}
			var clone = use_import_node || is_firefox ? document.importNode(node, true) : node.cloneNode(true);
			if (is_fragment) {
				var start = /* @__PURE__ */ get_first_child(clone);
				var end = clone.lastChild;
				assign_nodes(start, end);
			} else assign_nodes(clone, clone);
			return clone;
		};
	}
	/**
	* @param {string} content
	* @param {number} flags
	* @param {'svg' | 'math'} ns
	* @returns {() => Node | Node[]}
	*/
	/*#__NO_SIDE_EFFECTS__*/
	function from_namespace(content, flags, ns = "svg") {
		/**
		* Whether or not the first item is a text/element node. If not, we need to
		* create an additional comment node to act as `effect.nodes.start`
		*/
		var has_start = !content.startsWith("<!>");
		var is_fragment = (flags & 1) !== 0;
		var wrapped = `<${ns}>${has_start ? content : "<!>" + content}</${ns}>`;
		/** @type {Element | DocumentFragment} */
		var node;
		return () => {
			if (hydrating) {
				assign_nodes(hydrate_node, null);
				return hydrate_node;
			}
			if (!node) {
				var root = /* @__PURE__ */ get_first_child(create_fragment_from_html(wrapped));
				if (is_fragment) {
					node = document.createDocumentFragment();
					while (/* @__PURE__ */ get_first_child(root)) node.appendChild(/* @__PURE__ */ get_first_child(root));
				} else node = /* @__PURE__ */ get_first_child(root);
			}
			var clone = node.cloneNode(true);
			if (is_fragment) {
				var start = /* @__PURE__ */ get_first_child(clone);
				var end = clone.lastChild;
				assign_nodes(start, end);
			} else assign_nodes(clone, clone);
			return clone;
		};
	}
	/**
	* @param {string} content
	* @param {number} flags
	*/
	/*#__NO_SIDE_EFFECTS__*/
	function from_svg(content, flags) {
		return /* @__PURE__ */ from_namespace(content, flags, "svg");
	}
	/**
	* Don't mark this as side-effect-free, hydration needs to walk all nodes
	* @param {any} value
	*/
	function text(value = "") {
		if (!hydrating) {
			var t = create_text(value + "");
			assign_nodes(t, t);
			return t;
		}
		var node = hydrate_node;
		if (node.nodeType !== 3) {
			node.before(node = create_text());
			set_hydrate_node(node);
		} else merge_text_nodes(node);
		assign_nodes(node, node);
		return node;
	}
	/**
	* @returns {TemplateNode | DocumentFragment}
	*/
	function comment() {
		if (hydrating) {
			assign_nodes(hydrate_node, null);
			return hydrate_node;
		}
		var frag = document.createDocumentFragment();
		var start = document.createComment("");
		var anchor = create_text();
		frag.append(start, anchor);
		assign_nodes(start, anchor);
		return frag;
	}
	/**
	* Assign the created (or in hydration mode, traversed) dom elements to the current block
	* and insert the elements into the dom (in client mode).
	* @param {Text | Comment | Element} anchor
	* @param {DocumentFragment | Element} dom
	*/
	function append(anchor, dom) {
		if (hydrating) {
			var effect = active_effect;
			if ((effect.f & 32768) === 0 || effect.nodes.end === null) effect.nodes.end = hydrate_node;
			hydrate_next();
			return;
		}
		if (anchor === null) return;
		anchor.before(dom);
	}
	/**
	* @param {Element} text
	* @param {string} value
	* @returns {void}
	*/
	function set_text(text, value) {
		var str = value == null ? "" : typeof value === "object" ? `${value}` : value;
		if (str !== (text[TEXT_CACHE] ??= text.nodeValue)) {
			/** @type {any} */ text[TEXT_CACHE] = str;
			text.nodeValue = `${str}`;
		}
	}
	/**
	* Mounts a component to the given target and returns the exports and potentially the props (if compiled with `accessors: true`) of the component.
	* Transitions will play during the initial render unless the `intro` option is set to `false`.
	*
	* @template {Record<string, any>} Props
	* @template {Record<string, any>} Exports
	* @param {ComponentType<SvelteComponent<Props>> | Component<Props, Exports, any>} component
	* @param {MountOptions<Props>} options
	* @returns {Exports}
	*/
	function mount(component, options) {
		return _mount(component, options);
	}
	/** @type {Map<EventTarget, Map<string, number>>} */
	var listeners = /* @__PURE__ */ new Map();
	/**
	* @template {Record<string, any>} Exports
	* @param {ComponentType<SvelteComponent<any>> | Component<any>} Component
	* @param {MountOptions} options
	* @returns {Exports}
	*/
	function _mount(Component, { target, anchor, props = {}, events, context, intro = true, transformError }) {
		init_operations();
		/** @type {Exports} */
		var component = void 0;
		var unmount = component_root(() => {
			var anchor_node = anchor ?? target.appendChild(create_text());
			boundary(anchor_node, { pending: () => {} }, (anchor_node) => {
				push({});
				var ctx = component_context;
				if (context) ctx.c = context;
				if (events)
 /** @type {any} */ props.$$events = events;
				if (hydrating) assign_nodes(anchor_node, null);
				component = Component(anchor_node, props) || {};
				if (hydrating) {
					/** @type {Effect & { nodes: EffectNodes }} */ active_effect.nodes.end = hydrate_node;
					if (hydrate_node === null || hydrate_node.nodeType !== 8 || hydrate_node.data !== "]") {
						hydration_mismatch();
						throw HYDRATION_ERROR;
					}
				}
				pop();
			}, transformError);
			/** @type {Set<string>} */
			var registered_events = /* @__PURE__ */ new Set();
			/** @param {Array<string>} events */
			var event_handle = (events) => {
				for (var i = 0; i < events.length; i++) {
					var event_name = events[i];
					if (registered_events.has(event_name)) continue;
					registered_events.add(event_name);
					var passive = is_passive_event(event_name);
					for (const node of [target, document]) {
						var counts = listeners.get(node);
						if (counts === void 0) {
							counts = /* @__PURE__ */ new Map();
							listeners.set(node, counts);
						}
						var count = counts.get(event_name);
						if (count === void 0) {
							node.addEventListener(event_name, handle_event_propagation, { passive });
							counts.set(event_name, 1);
						} else counts.set(event_name, count + 1);
					}
				}
			};
			event_handle(array_from(all_registered_events));
			root_event_handles.add(event_handle);
			return () => {
				for (var event_name of registered_events) for (const node of [target, document]) {
					var counts = listeners.get(node);
					var count = counts.get(event_name);
					if (--count == 0) {
						node.removeEventListener(event_name, handle_event_propagation);
						counts.delete(event_name);
						if (counts.size === 0) listeners.delete(node);
					} else counts.set(event_name, count);
				}
				root_event_handles.delete(event_handle);
				if (anchor_node !== anchor) anchor_node.parentNode?.removeChild(anchor_node);
			};
		});
		mounted_components.set(component, unmount);
		return component;
	}
	/**
	* References of the components that were mounted or hydrated.
	* Uses a `WeakMap` to avoid memory leaks.
	*/
	var mounted_components = /* @__PURE__ */ new WeakMap();
	/**
	* Unmounts a component that was previously mounted using `mount` or `hydrate`.
	*
	* Since 5.13.0, if `options.outro` is `true`, [transitions](https://svelte.dev/docs/svelte/transition) will play before the component is removed from the DOM.
	*
	* Returns a `Promise` that resolves after transitions have completed if `options.outro` is true, or immediately otherwise (prior to 5.13.0, returns `void`).
	*
	* ```js
	* import { mount, unmount } from 'svelte';
	* import App from './App.svelte';
	*
	* const app = mount(App, { target: document.body });
	*
	* // later...
	* unmount(app, { outro: true });
	* ```
	* @param {Record<string, any>} component
	* @param {{ outro?: boolean }} [options]
	* @returns {Promise<void>}
	*/
	function unmount(component, options) {
		const fn = mounted_components.get(component);
		if (fn) {
			mounted_components.delete(component);
			return fn(options);
		}
		return Promise.resolve();
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
	/** @import { Effect, TemplateNode } from '#client' */
	/**
	* @typedef {{ effect: Effect, fragment: DocumentFragment }} Branch
	*/
	/**
	* @template Key
	*/
	var BranchManager = class {
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
		/**
		* @param {Batch} batch
		*/
		#commit = (batch) => {
			if (!this.#batches.has(batch)) return;
			var key = this.#batches.get(batch);
			var onscreen = this.#onscreen.get(key);
			if (onscreen) {
				resume_effect(onscreen);
				this.#outroing.delete(key);
			} else {
				var offscreen = this.#offscreen.get(key);
				if (offscreen) {
					resume_effect(offscreen.effect);
					this.#onscreen.set(key, offscreen.effect);
					this.#offscreen.delete(key);
					/** @type {TemplateNode} */ offscreen.fragment.lastChild.remove();
					this.anchor.before(offscreen.fragment);
					onscreen = offscreen.effect;
				}
			}
			for (const [b, k] of this.#batches) {
				this.#batches.delete(b);
				if (b === batch) break;
				const offscreen = this.#offscreen.get(k);
				if (offscreen) {
					destroy_effect(offscreen.effect);
					this.#offscreen.delete(k);
				}
			}
			for (const [k, effect] of this.#onscreen) {
				if (k === key || this.#outroing.has(k)) continue;
				const on_destroy = () => {
					if (Array.from(this.#batches.values()).includes(k)) {
						var fragment = document.createDocumentFragment();
						move_effect(effect, fragment);
						fragment.append(create_text());
						this.#offscreen.set(k, {
							effect,
							fragment
						});
					} else destroy_effect(effect);
					this.#outroing.delete(k);
					this.#onscreen.delete(k);
				};
				if (this.#transition || !onscreen) {
					this.#outroing.add(k);
					pause_effect(effect, on_destroy, false);
				} else on_destroy();
			}
		};
		/**
		* @param {Batch} batch
		*/
		#discard = (batch) => {
			this.#batches.delete(batch);
			const keys = Array.from(this.#batches.values());
			for (const [k, branch] of this.#offscreen) if (!keys.includes(k)) {
				destroy_effect(branch.effect);
				this.#offscreen.delete(k);
			}
		};
		/**
		*
		* @param {any} key
		* @param {null | ((target: TemplateNode) => void)} fn
		*/
		ensure(key, fn) {
			var batch = current_batch;
			var defer = should_defer_append();
			if (fn && !this.#onscreen.has(key) && !this.#offscreen.has(key)) if (defer) {
				var fragment = document.createDocumentFragment();
				var target = create_text();
				fragment.append(target);
				this.#offscreen.set(key, {
					effect: branch(() => fn(target)),
					fragment
				});
			} else this.#onscreen.set(key, branch(() => fn(this.anchor)));
			this.#batches.set(batch, key);
			if (defer) {
				for (const [k, effect] of this.#onscreen) if (k === key) batch.unskip_effect(effect);
				else batch.skip_effect(effect);
				for (const [k, branch] of this.#offscreen) if (k === key) batch.unskip_effect(branch.effect);
				else batch.skip_effect(branch.effect);
				batch.oncommit(this.#commit);
				batch.ondiscard(this.#discard);
			} else {
				if (hydrating) this.anchor = hydrate_node;
				this.#commit(batch);
			}
		}
	};
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
	/** @import { TemplateNode } from '#client' */
	/**
	* @param {TemplateNode} node
	* @param {(branch: (fn: (anchor: Node) => void, key?: number | false) => void) => void} fn
	* @param {boolean} [elseif] True if this is an `{:else if ...}` block rather than an `{#if ...}`, as that affects which transitions are considered 'local'
	* @returns {void}
	*/
	function if_block(node, fn, elseif = false) {
		/** @type {TemplateNode | undefined} */
		var marker;
		if (hydrating) {
			marker = hydrate_node;
			hydrate_next();
		}
		var branches = new BranchManager(node);
		var flags = elseif ? EFFECT_TRANSPARENT : 0;
		/**
		* @param {number | false} key
		* @param {null | ((anchor: Node) => void)} fn
		*/
		function update_branch(key, fn) {
			if (hydrating) {
				var data = read_hydration_instruction(marker);
				if (key !== parseInt(data.substring(1))) {
					var anchor = skip_nodes();
					set_hydrate_node(anchor);
					branches.anchor = anchor;
					set_hydrating(false);
					branches.ensure(key, fn);
					set_hydrating(true);
					return;
				}
			}
			branches.ensure(key, fn);
		}
		block(() => {
			var has_branch = false;
			fn((fn, key = 0) => {
				has_branch = true;
				update_branch(key, fn);
			});
			if (!has_branch) update_branch(-1, null);
		}, flags);
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
	/** @import { EachItem, EachOutroGroup, EachState, Effect, EffectNodes, MaybeSource, Source, TemplateNode, TransitionManager, Value } from '#client' */
	/** @import { Batch } from '../../reactivity/batch.js'; */
	/**
	* Pause multiple effects simultaneously, and coordinate their
	* subsequent destruction. Used in each blocks
	* @param {EachState} state
	* @param {Effect[]} to_destroy
	* @param {null | Node} controlled_anchor
	*/
	function pause_effects(state, to_destroy, controlled_anchor) {
		/** @type {TransitionManager[]} */
		var transitions = [];
		var length = to_destroy.length;
		/** @type {EachOutroGroup} */
		var group;
		var remaining = to_destroy.length;
		for (var i = 0; i < length; i++) {
			let effect = to_destroy[i];
			pause_effect(effect, () => {
				if (group) {
					group.pending.delete(effect);
					group.done.add(effect);
					if (group.pending.size === 0) {
						var groups = state.outrogroups;
						destroy_effects(state, array_from(group.done));
						groups.delete(group);
						if (groups.size === 0) state.outrogroups = null;
					}
				} else remaining -= 1;
			}, false);
		}
		if (remaining === 0) {
			var fast_path = transitions.length === 0 && controlled_anchor !== null;
			if (fast_path) {
				var anchor = controlled_anchor;
				var parent_node = anchor.parentNode;
				clear_text_content(parent_node);
				parent_node.append(anchor);
				state.items.clear();
			}
			destroy_effects(state, to_destroy, !fast_path);
		} else {
			group = {
				pending: new Set(to_destroy),
				done: /* @__PURE__ */ new Set()
			};
			(state.outrogroups ??= /* @__PURE__ */ new Set()).add(group);
		}
	}
	/**
	* @param {EachState} state
	* @param {Effect[]} to_destroy
	* @param {boolean} remove_dom
	*/
	function destroy_effects(state, to_destroy, remove_dom = true) {
		/** @type {Set<Effect> | undefined} */
		var preserved_effects;
		if (state.pending.size > 0) {
			preserved_effects = /* @__PURE__ */ new Set();
			for (const keys of state.pending.values()) for (const key of keys) preserved_effects.add(
				/** @type {EachItem} */
				state.items.get(key).e
			);
		}
		for (var i = 0; i < to_destroy.length; i++) {
			var e = to_destroy[i];
			if (preserved_effects?.has(e)) {
				e.f |= EFFECT_OFFSCREEN;
				move_effect(e, document.createDocumentFragment());
			} else destroy_effect(to_destroy[i], remove_dom);
		}
	}
	/** @type {TemplateNode} */
	var offscreen_anchor;
	/**
	* @template V
	* @param {Element | Comment} node The next sibling node, or the parent node if this is a 'controlled' block
	* @param {number} flags
	* @param {() => V[]} get_collection
	* @param {(value: V, index: number) => any} get_key
	* @param {(anchor: Node, item: MaybeSource<V>, index: MaybeSource<number>) => void} render_fn
	* @param {null | ((anchor: Node) => void)} fallback_fn
	* @returns {void}
	*/
	function each(node, flags, get_collection, get_key, render_fn, fallback_fn = null) {
		var anchor = node;
		/** @type {Map<any, EachItem>} */
		var items = /* @__PURE__ */ new Map();
		if ((flags & 4) !== 0) {
			var parent_node = node;
			anchor = hydrating ? set_hydrate_node(/* @__PURE__ */ get_first_child(parent_node)) : parent_node.appendChild(create_text());
		}
		if (hydrating) hydrate_next();
		/** @type {Effect | null} */
		var fallback = null;
		var each_array = /* @__PURE__ */ derived_safe_equal(() => {
			var collection = get_collection();
			return is_array(collection) ? collection : collection == null ? [] : array_from(collection);
		});
		/** @type {V[]} */
		var array;
		/** @type {Map<Batch, Set<any>>} */
		var pending = /* @__PURE__ */ new Map();
		var first_run = true;
		/**
		* @param {Batch} batch
		*/
		function commit(batch) {
			if ((state.effect.f & 16384) !== 0) return;
			state.pending.delete(batch);
			state.fallback = fallback;
			reconcile(state, array, anchor, flags, get_key);
			if (fallback !== null) if (array.length === 0) if ((fallback.f & 33554432) === 0) resume_effect(fallback);
			else {
				fallback.f ^= EFFECT_OFFSCREEN;
				move(fallback, null, anchor);
			}
			else pause_effect(fallback, () => {
				fallback = null;
			});
		}
		/**
		* @param {Batch} batch
		*/
		function discard(batch) {
			state.pending.delete(batch);
		}
		/** @type {EachState} */
		var state = {
			effect: block(() => {
				array = get(each_array);
				var length = array.length;
				/** `true` if there was a hydration mismatch. Needs to be a `let` or else it isn't treeshaken out */
				let mismatch = false;
				if (hydrating) {
					if (read_hydration_instruction(anchor) === "[!" !== (length === 0)) {
						anchor = skip_nodes();
						set_hydrate_node(anchor);
						set_hydrating(false);
						mismatch = true;
					}
				}
				var keys = /* @__PURE__ */ new Set();
				var batch = current_batch;
				var defer = should_defer_append();
				for (var index = 0; index < length; index += 1) {
					if (hydrating && hydrate_node.nodeType === 8 && hydrate_node.data === "]") {
						anchor = hydrate_node;
						mismatch = true;
						set_hydrating(false);
					}
					var value = array[index];
					var key = get_key(value, index);
					var item = first_run ? null : items.get(key);
					if (item) {
						if (item.v) internal_set(item.v, value);
						if (item.i) internal_set(item.i, index);
						if (defer) batch.unskip_effect(item.e);
					} else {
						item = create_item(items, first_run ? anchor : offscreen_anchor ??= create_text(), value, key, index, render_fn, flags, get_collection);
						if (!first_run) item.e.f |= EFFECT_OFFSCREEN;
						items.set(key, item);
					}
					keys.add(key);
				}
				if (length === 0 && fallback_fn && !fallback) if (first_run) fallback = branch(() => fallback_fn(anchor));
				else {
					fallback = branch(() => fallback_fn(offscreen_anchor ??= create_text()));
					fallback.f |= EFFECT_OFFSCREEN;
				}
				if (length > keys.size) each_key_duplicate("", "", "");
				if (hydrating && length > 0) set_hydrate_node(skip_nodes());
				if (!first_run) {
					pending.set(batch, keys);
					if (defer) {
						for (const [key, item] of items) if (!keys.has(key)) batch.skip_effect(item.e);
						batch.oncommit(commit);
						batch.ondiscard(discard);
					} else commit(batch);
				}
				if (mismatch) set_hydrating(true);
				get(each_array);
			}),
			flags,
			items,
			pending,
			outrogroups: null,
			fallback
		};
		first_run = false;
		if (hydrating) anchor = hydrate_node;
	}
	/**
	* Skip past any non-branch effects (which could be created with `createSubscriber`, for example) to find the next branch effect
	* @param {Effect | null} effect
	* @returns {Effect | null}
	*/
	function skip_to_branch(effect) {
		while (effect !== null && (effect.f & 32) === 0) effect = effect.next;
		return effect;
	}
	/**
	* Add, remove, or reorder items output by an each block as its input changes
	* @template V
	* @param {EachState} state
	* @param {Array<V>} array
	* @param {Element | Comment | Text} anchor
	* @param {number} flags
	* @param {(value: V, index: number) => any} get_key
	* @returns {void}
	*/
	function reconcile(state, array, anchor, flags, get_key) {
		var is_animated = (flags & 8) !== 0;
		var length = array.length;
		var items = state.items;
		var current = skip_to_branch(state.effect.first);
		/** @type {undefined | Set<Effect>} */
		var seen;
		/** @type {Effect | null} */
		var prev = null;
		/** @type {undefined | Set<Effect>} */
		var to_animate;
		/** @type {Effect[]} */
		var matched = [];
		/** @type {Effect[]} */
		var stashed = [];
		/** @type {V} */
		var value;
		/** @type {any} */
		var key;
		/** @type {Effect | undefined} */
		var effect;
		/** @type {number} */
		var i;
		if (is_animated) for (i = 0; i < length; i += 1) {
			value = array[i];
			key = get_key(value, i);
			effect = items.get(key).e;
			if ((effect.f & 33554432) === 0) {
				effect.nodes?.a?.measure();
				(to_animate ??= /* @__PURE__ */ new Set()).add(effect);
			}
		}
		for (i = 0; i < length; i += 1) {
			value = array[i];
			key = get_key(value, i);
			effect = items.get(key).e;
			if (state.outrogroups !== null) for (const group of state.outrogroups) {
				group.pending.delete(effect);
				group.done.delete(effect);
			}
			if ((effect.f & 8192) !== 0) {
				resume_effect(effect);
				if (is_animated) {
					effect.nodes?.a?.unfix();
					(to_animate ??= /* @__PURE__ */ new Set()).delete(effect);
				}
			}
			if ((effect.f & 33554432) !== 0) {
				effect.f ^= EFFECT_OFFSCREEN;
				if (effect === current) move(effect, null, anchor);
				else {
					var next = prev ? prev.next : current;
					if (effect === state.effect.last) state.effect.last = effect.prev;
					if (effect.prev) effect.prev.next = effect.next;
					if (effect.next) effect.next.prev = effect.prev;
					link$1(state, prev, effect);
					link$1(state, effect, next);
					move(effect, next, anchor);
					prev = effect;
					matched = [];
					stashed = [];
					current = skip_to_branch(prev.next);
					continue;
				}
			}
			if (effect !== current) {
				if (seen !== void 0 && seen.has(effect)) {
					if (matched.length < stashed.length) {
						var start = stashed[0];
						var j;
						prev = start.prev;
						var a = matched[0];
						var b = matched[matched.length - 1];
						for (j = 0; j < matched.length; j += 1) move(matched[j], start, anchor);
						for (j = 0; j < stashed.length; j += 1) seen.delete(stashed[j]);
						link$1(state, a.prev, b.next);
						link$1(state, prev, a);
						link$1(state, b, start);
						current = start;
						prev = b;
						i -= 1;
						matched = [];
						stashed = [];
					} else {
						seen.delete(effect);
						move(effect, current, anchor);
						link$1(state, effect.prev, effect.next);
						link$1(state, effect, prev === null ? state.effect.first : prev.next);
						link$1(state, prev, effect);
						prev = effect;
					}
					continue;
				}
				matched = [];
				stashed = [];
				while (current !== null && current !== effect) {
					(seen ??= /* @__PURE__ */ new Set()).add(current);
					stashed.push(current);
					current = skip_to_branch(current.next);
				}
				if (current === null) continue;
			}
			if ((effect.f & 33554432) === 0) matched.push(effect);
			prev = effect;
			current = skip_to_branch(effect.next);
		}
		if (state.outrogroups !== null) {
			for (const group of state.outrogroups) if (group.pending.size === 0) {
				destroy_effects(state, array_from(group.done));
				state.outrogroups?.delete(group);
			}
			if (state.outrogroups.size === 0) state.outrogroups = null;
		}
		if (current !== null || seen !== void 0) {
			/** @type {Effect[]} */
			var to_destroy = [];
			if (seen !== void 0) {
				for (effect of seen) if ((effect.f & 8192) === 0) to_destroy.push(effect);
			}
			while (current !== null) {
				if ((current.f & 8192) === 0 && current !== state.fallback) to_destroy.push(current);
				current = skip_to_branch(current.next);
			}
			var destroy_length = to_destroy.length;
			if (destroy_length > 0) {
				var controlled_anchor = (flags & 4) !== 0 && length === 0 ? anchor : null;
				if (is_animated) {
					for (i = 0; i < destroy_length; i += 1) to_destroy[i].nodes?.a?.measure();
					for (i = 0; i < destroy_length; i += 1) to_destroy[i].nodes?.a?.fix();
				}
				pause_effects(state, to_destroy, controlled_anchor);
			}
		}
		if (is_animated) queue_micro_task(() => {
			if (to_animate === void 0) return;
			for (effect of to_animate) effect.nodes?.a?.apply();
		});
	}
	/**
	* @template V
	* @param {Map<any, EachItem>} items
	* @param {Node} anchor
	* @param {V} value
	* @param {unknown} key
	* @param {number} index
	* @param {(anchor: Node, item: V | Source<V>, index: number | Value<number>, collection: () => V[]) => void} render_fn
	* @param {number} flags
	* @param {() => V[]} get_collection
	* @returns {EachItem}
	*/
	function create_item(items, anchor, value, key, index, render_fn, flags, get_collection) {
		var v = (flags & 1) !== 0 ? (flags & 16) === 0 ? /* @__PURE__ */ mutable_source(value, false, false) : source(value) : null;
		var i = (flags & 2) !== 0 ? source(index) : null;
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
	/**
	* @param {Effect} effect
	* @param {Effect | null} next
	* @param {Text | Element | Comment} anchor
	*/
	function move(effect, next, anchor) {
		if (!effect.nodes) return;
		var node = effect.nodes.start;
		var end = effect.nodes.end;
		var dest = next && (next.f & 33554432) === 0 ? next.nodes.start : anchor;
		while (node !== null) {
			var next_node = /* @__PURE__ */ get_next_sibling(node);
			dest.before(node);
			if (node === end) return;
			node = next_node;
		}
	}
	/**
	* @param {EachState} state
	* @param {Effect | null} prev
	* @param {Effect | null} next
	*/
	function link$1(state, prev, next) {
		if (prev === null) state.effect.first = next;
		else prev.next = next;
		if (next === null) state.effect.last = prev;
		else next.prev = prev;
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/blocks/snippet.js
	/** @import { Snippet } from 'svelte' */
	/** @import { TemplateNode } from '#client' */
	/** @import { Getters } from '#shared' */
	/**
	* @template {(node: TemplateNode, ...args: any[]) => void} SnippetFn
	* @param {TemplateNode} node
	* @param {() => SnippetFn | null | undefined} get_snippet
	* @param {(() => any)[]} args
	* @returns {void}
	*/
	function snippet(node, get_snippet, ...args) {
		var branches = new BranchManager(node);
		block(() => {
			const snippet = get_snippet() ?? null;
			branches.ensure(snippet, snippet && ((anchor) => snippet(anchor, ...args)));
		}, EFFECT_TRANSPARENT);
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/blocks/svelte-component.js
	/** @import { TemplateNode, Dom } from '#client' */
	/**
	* @template P
	* @template {(props: P) => void} C
	* @param {TemplateNode} node
	* @param {() => C} get_component
	* @param {(anchor: TemplateNode, component: C) => Dom | void} render_fn
	* @returns {void}
	*/
	function component(node, get_component, render_fn) {
		/** @type {TemplateNode | undefined} */
		var hydration_start_node;
		if (hydrating) {
			hydration_start_node = hydrate_node;
			hydrate_next();
		}
		var branches = new BranchManager(node);
		block(() => {
			var component = get_component() ?? null;
			if (hydrating) {
				if (read_hydration_instruction(hydration_start_node) === "[" !== (component !== null)) {
					var anchor = skip_nodes();
					set_hydrate_node(anchor);
					branches.anchor = anchor;
					set_hydrating(false);
					branches.ensure(component, component && ((target) => render_fn(target, component)));
					set_hydrating(true);
					return;
				}
			}
			branches.ensure(component, component && ((target) => render_fn(target, component)));
		}, EFFECT_TRANSPARENT);
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/elements/actions.js
	/** @import { ActionPayload } from '#client' */
	/**
	* @template P
	* @param {Element} dom
	* @param {(dom: Element, value?: P) => ActionPayload<P>} action
	* @param {() => P} [get_value]
	* @returns {void}
	*/
	function action(dom, action, get_value) {
		effect(() => {
			var payload = untrack(() => action(dom, get_value?.()) || {});
			if (get_value && payload?.update) {
				var inited = false;
				/** @type {P} */
				var prev = {};
				render_effect(() => {
					var value = get_value();
					deep_read_state(value);
					if (inited && safe_not_equal(prev, value)) {
						prev = value;
						/** @type {Function} */ payload.update(value);
					}
				});
				inited = true;
			}
			if (payload?.destroy) return () => payload.destroy();
		});
	}
	//#endregion
	//#region node_modules/svelte/src/internal/shared/attributes.js
	var whitespace = [..." 	\n\r\f\xA0\v﻿"];
	/**
	* @param {any} value
	* @param {string | null} [hash]
	* @param {Record<string, boolean>} [directives]
	* @returns {string | null}
	*/
	function to_class(value, hash, directives) {
		var classname = value == null ? "" : "" + value;
		if (hash) classname = classname ? classname + " " + hash : hash;
		if (directives) {
			for (var key of Object.keys(directives)) if (directives[key]) classname = classname ? classname + " " + key : key;
			else if (classname.length) {
				var len = key.length;
				var a = 0;
				while ((a = classname.indexOf(key, a)) >= 0) {
					var b = a + len;
					if ((a === 0 || whitespace.includes(classname[a - 1])) && (b === classname.length || whitespace.includes(classname[b]))) classname = (a === 0 ? "" : classname.substring(0, a)) + classname.substring(b + 1);
					else a = b;
				}
			}
		}
		return classname === "" ? null : classname;
	}
	/**
	*
	* @param {Record<string,any>} styles
	* @param {boolean} important
	*/
	function append_styles(styles, important = false) {
		var separator = important ? " !important;" : ";";
		var css = "";
		for (var key of Object.keys(styles)) {
			var value = styles[key];
			if (value != null && value !== "") css += " " + key + ": " + value + separator;
		}
		return css;
	}
	/**
	* @param {string} name
	* @returns {string}
	*/
	function to_css_name(name) {
		if (name[0] !== "-" || name[1] !== "-") return name.toLowerCase();
		return name;
	}
	/**
	* @param {any} value
	* @param {Record<string, any> | [Record<string, any>, Record<string, any>]} [styles]
	* @returns {string | null}
	*/
	function to_style(value, styles) {
		if (styles) {
			var new_style = "";
			/** @type {Record<string,any> | undefined} */
			var normal_styles;
			/** @type {Record<string,any> | undefined} */
			var important_styles;
			if (Array.isArray(styles)) {
				normal_styles = styles[0];
				important_styles = styles[1];
			} else normal_styles = styles;
			if (value) {
				value = String(value).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
				/** @type {boolean | '"' | "'"} */
				var in_str = false;
				var in_apo = 0;
				var in_comment = false;
				var reserved_names = [];
				if (normal_styles) reserved_names.push(...Object.keys(normal_styles).map(to_css_name));
				if (important_styles) reserved_names.push(...Object.keys(important_styles).map(to_css_name));
				var start_index = 0;
				var name_index = -1;
				const len = value.length;
				for (var i = 0; i < len; i++) {
					var c = value[i];
					if (in_comment) {
						if (c === "/" && value[i - 1] === "*") in_comment = false;
					} else if (in_str) {
						if (in_str === c) in_str = false;
					} else if (c === "/" && value[i + 1] === "*") in_comment = true;
					else if (c === "\"" || c === "'") in_str = c;
					else if (c === "(") in_apo++;
					else if (c === ")") in_apo--;
					if (!in_comment && in_str === false && in_apo === 0) {
						if (c === ":" && name_index === -1) name_index = i;
						else if (c === ";" || i === len - 1) {
							if (name_index !== -1) {
								var name = to_css_name(value.substring(start_index, name_index).trim());
								if (!reserved_names.includes(name)) {
									if (c !== ";") i++;
									var property = value.substring(start_index, i).trim();
									new_style += " " + property + ";";
								}
							}
							start_index = i + 1;
							name_index = -1;
						}
					}
				}
			}
			if (normal_styles) new_style += append_styles(normal_styles);
			if (important_styles) new_style += append_styles(important_styles, true);
			new_style = new_style.trim();
			return new_style === "" ? null : new_style;
		}
		return value == null ? null : String(value);
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/elements/class.js
	/**
	* @param {Element} dom
	* @param {boolean | number} is_html
	* @param {string | null} value
	* @param {string} [hash]
	* @param {Record<string, any>} [prev_classes]
	* @param {Record<string, any>} [next_classes]
	* @returns {Record<string, boolean> | undefined}
	*/
	function set_class(dom, is_html, value, hash, prev_classes, next_classes) {
		var prev = dom[CLASS_CACHE];
		if (hydrating || prev !== value || prev === void 0) {
			var next_class_name = to_class(value, hash, next_classes);
			if (!hydrating || next_class_name !== dom.getAttribute("class")) if (next_class_name == null) dom.removeAttribute("class");
			else if (is_html) dom.className = next_class_name;
			else dom.setAttribute("class", next_class_name);
			/** @type {any} */ dom[CLASS_CACHE] = value;
		} else if (next_classes && prev_classes !== next_classes) for (var key in next_classes) {
			var is_present = !!next_classes[key];
			if (prev_classes == null || is_present !== !!prev_classes[key]) dom.classList.toggle(key, is_present);
		}
		return next_classes;
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/elements/style.js
	/**
	* @param {Element & ElementCSSInlineStyle} dom
	* @param {Record<string, any>} prev
	* @param {Record<string, any>} next
	* @param {string} [priority]
	*/
	function update_styles(dom, prev = {}, next, priority) {
		for (var key in next) {
			var value = next[key];
			if (prev[key] !== value) if (next[key] == null) dom.style.removeProperty(key);
			else dom.style.setProperty(key, value, priority);
		}
	}
	/**
	* @param {Element & ElementCSSInlineStyle} dom
	* @param {string | null} value
	* @param {Record<string, any> | [Record<string, any>, Record<string, any>]} [prev_styles]
	* @param {Record<string, any> | [Record<string, any>, Record<string, any>]} [next_styles]
	*/
	function set_style(dom, value, prev_styles, next_styles) {
		var prev = dom[STYLE_CACHE];
		if (hydrating || prev !== value) {
			var next_style_attr = to_style(value, next_styles);
			if (!hydrating || next_style_attr !== dom.getAttribute("style")) if (next_style_attr == null) dom.removeAttribute("style");
			else dom.style.cssText = next_style_attr;
			/** @type {any} */ dom[STYLE_CACHE] = value;
		} else if (next_styles) if (Array.isArray(next_styles)) {
			update_styles(dom, prev_styles?.[0], next_styles[0]);
			update_styles(dom, prev_styles?.[1], next_styles[1], "important");
		} else update_styles(dom, prev_styles, next_styles);
		return next_styles;
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
	/** @import { Blocker, Effect } from '#client' */
	var IS_CUSTOM_ELEMENT = Symbol("is custom element");
	var IS_HTML = Symbol("is html");
	var LINK_TAG = IS_XHTML ? "link" : "LINK";
	/**
	* @param {Element} element
	* @param {string} attribute
	* @param {string | null} value
	* @param {boolean} [skip_warning]
	*/
	function set_attribute(element, attribute, value, skip_warning) {
		var attributes = get_attributes(element);
		if (hydrating) {
			attributes[attribute] = element.getAttribute(attribute);
			if (attribute === "src" || attribute === "srcset" || attribute === "href" && element.nodeName === LINK_TAG) {
				if (!skip_warning);
				return;
			}
		}
		if (attributes[attribute] === (attributes[attribute] = value)) return;
		if (attribute === "loading") element[LOADING_ATTR_SYMBOL] = value;
		if (value == null) element.removeAttribute(attribute);
		else if (typeof value !== "string" && get_setters(element).includes(attribute)) element[attribute] = value;
		else element.setAttribute(attribute, value);
	}
	/**
	*
	* @param {Element} element
	*/
	function get_attributes(element) {
		return element[ATTRIBUTES_CACHE] ??= {
			[IS_CUSTOM_ELEMENT]: element.nodeName.includes("-"),
			[IS_HTML]: element.namespaceURI === NAMESPACE_HTML
		};
	}
	/** @type {Map<string, string[]>} */
	var setters_cache = /* @__PURE__ */ new Map();
	/** @param {Element} element */
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
			for (var key in descriptors) if (descriptors[key].set && key !== "innerHTML" && key !== "textContent" && key !== "innerText") setters.push(key);
			proto = get_prototype_of(proto);
		}
		return setters;
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
	/** @import { Batch } from '../../../reactivity/batch.js' */
	/**
	* @param {HTMLInputElement} input
	* @param {() => unknown} get
	* @param {(value: unknown) => void} set
	* @returns {void}
	*/
	function bind_value(input, get, set = get) {
		var batches = /* @__PURE__ */ new WeakSet();
		listen_to_event_and_reset_event(input, "input", async (is_reset) => {
			/** @type {any} */
			var value = is_reset ? input.defaultValue : input.value;
			value = is_numberlike_input(input) ? to_number(value) : value;
			set(value);
			if (current_batch !== null) batches.add(current_batch);
			await tick();
			if (value !== (value = get())) {
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
		if (hydrating && input.defaultValue !== input.value || untrack(get) == null && input.value) {
			set(is_numberlike_input(input) ? to_number(input.value) : input.value);
			if (current_batch !== null) batches.add(current_batch);
		}
		render_effect(() => {
			var value = get();
			if (input === document.activeElement) {
				var batch = async_mode_flag ? previous_batch : current_batch;
				if (batches.has(batch)) return;
			}
			if (is_numberlike_input(input) && value === to_number(input.value)) return;
			if (input.type === "date" && !value && !input.value) return;
			if (value !== input.value) input.value = value ?? "";
		});
	}
	/**
	* @param {HTMLInputElement} input
	*/
	function is_numberlike_input(input) {
		var type = input.type;
		return type === "number" || type === "range";
	}
	/**
	* @param {string} value
	*/
	function to_number(value) {
		return value === "" ? null : +value;
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
	/** @import { ComponentContextLegacy } from '#client' */
	/**
	* Legacy-mode only: Call `onMount` callbacks and set up `beforeUpdate`/`afterUpdate` effects
	* @param {boolean} [immutable]
	*/
	function init(immutable = false) {
		const context = component_context;
		const callbacks = context.l.u;
		if (!callbacks) return;
		let props = () => deep_read_state(context.s);
		if (immutable) {
			let version = 0;
			let prev = {};
			const d = /* @__PURE__ */ derived(() => {
				let changed = false;
				const props = context.s;
				for (const key in props) if (props[key] !== prev[key]) {
					prev[key] = props[key];
					changed = true;
				}
				if (changed) version++;
				return version;
			});
			props = () => get(d);
		}
		if (callbacks.b.length) user_pre_effect(() => {
			observe_all(context, props);
			run_all(callbacks.b);
		});
		user_effect(() => {
			const fns = untrack(() => callbacks.m.map(run));
			return () => {
				for (const fn of fns) if (typeof fn === "function") fn();
			};
		});
		if (callbacks.a.length) user_effect(() => {
			observe_all(context, props);
			run_all(callbacks.a);
		});
	}
	/**
	* Invoke the getter of all signals associated with a component
	* so they can be registered to the effect this function is called in.
	* @param {ComponentContextLegacy} context
	* @param {(() => void)} props
	*/
	function observe_all(context, props) {
		if (context.l.s) for (const signal of context.l.s) get(signal);
		props();
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/legacy/misc.js
	/**
	* Under some circumstances, imports may be reactive in legacy mode. In that case,
	* they should be using `reactive_import` as part of the transformation
	* @param {() => any} fn
	*/
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
	//#endregion
	//#region node_modules/svelte/src/internal/client/reactivity/props.js
	/** @import { Derived, Effect, Source } from './types.js' */
	/**
	* This function is responsible for synchronizing a possibly bound prop with the inner component state.
	* It is used whenever the compiler sees that the component writes to the prop, or when it has a default prop_value.
	* @template V
	* @param {Record<string, unknown>} props
	* @param {string} key
	* @param {number} flags
	* @param {V | (() => V)} [fallback]
	* @returns {(() => V | ((arg: V) => V) | ((arg: V, mutation: boolean) => V))}
	*/
	function prop(props, key, flags, fallback) {
		var runes = !legacy_mode_flag || (flags & 2) !== 0;
		var bindable = (flags & 8) !== 0;
		var lazy = (flags & 16) !== 0;
		var fallback_value = fallback;
		var fallback_dirty = true;
		var fallback_signal = void 0;
		var get_fallback = () => {
			if (lazy && runes) {
				fallback_signal ??= /* @__PURE__ */ derived(fallback);
				return get(fallback_signal);
			}
			if (fallback_dirty) {
				fallback_dirty = false;
				fallback_value = lazy ? untrack(fallback) : fallback;
			}
			return fallback_value;
		};
		/** @type {((v: V) => void) | undefined} */
		let setter;
		if (bindable) {
			var is_entry_props = STATE_SYMBOL in props || LEGACY_PROPS in props;
			setter = get_descriptor(props, key)?.set ?? (is_entry_props && key in props ? (v) => props[key] = v : void 0);
		}
		/** @type {V} */
		var initial_value;
		var is_store_sub = false;
		if (bindable) [initial_value, is_store_sub] = capture_store_binding(() => props[key]);
		else initial_value = props[key];
		if (initial_value === void 0 && fallback !== void 0) {
			initial_value = get_fallback();
			if (setter) {
				if (runes) props_invalid_value(key);
				setter(initial_value);
			}
		}
		/** @type {() => V} */
		var getter;
		if (runes) getter = () => {
			var value = props[key];
			if (value === void 0) return get_fallback();
			fallback_dirty = true;
			return value;
		};
		else getter = () => {
			var value = props[key];
			if (value !== void 0) fallback_value = void 0;
			return value === void 0 ? fallback_value : value;
		};
		if (runes && (flags & 4) === 0) return getter;
		if (setter) {
			var legacy_parent = props.$$legacy;
			return (function(value, mutation) {
				if (arguments.length > 0) {
					if (!runes || !mutation || legacy_parent || is_store_sub)
 /** @type {Function} */ setter(mutation ? getter() : value);
					return value;
				}
				return getter();
			});
		}
		var overridden = false;
		var d = ((flags & 1) !== 0 ? derived : derived_safe_equal)(() => {
			overridden = false;
			return getter();
		});
		if (bindable) get(d);
		var parent_effect = active_effect;
		return (function(value, mutation) {
			if (arguments.length > 0) {
				const new_value = mutation ? get(d) : runes && bindable ? proxy(value) : value;
				set(d, new_value);
				overridden = true;
				if (fallback_value !== void 0) fallback_value = new_value;
				return value;
			}
			if (is_destroying_effect && overridden || (parent_effect.f & 16384) !== 0) return d.v;
			return get(d);
		});
	}
	if (typeof HTMLElement === "function");
	/**
	* `onMount`, like [`$effect`](https://svelte.dev/docs/svelte/$effect), schedules a function to run as soon as the component has been mounted to the DOM.
	* Unlike `$effect`, the provided function only runs once.
	*
	* It must be called during the component's initialisation (but doesn't need to live _inside_ the component;
	* it can be called from an external module). If a function is returned _synchronously_ from `onMount`,
	* it will be called when the component is unmounted.
	*
	* `onMount` functions do not run during [server-side rendering](https://svelte.dev/docs/svelte/svelte-server#render).
	*
	* @template T
	* @param {() => NotFunction<T> | Promise<NotFunction<T>> | (() => any)} fn
	* @returns {void}
	*/
	function onMount(fn) {
		if (component_context === null) lifecycle_outside_component("onMount");
		if (legacy_mode_flag && component_context.l !== null) init_update_callbacks(component_context).m.push(fn);
		else user_effect(() => {
			const cleanup = untrack(fn);
			if (typeof cleanup === "function") return cleanup;
		});
	}
	/**
	* Schedules a callback to run immediately before the component is unmounted.
	*
	* Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
	* only one that runs inside a server-side component.
	*
	* @param {() => any} fn
	* @returns {void}
	*/
	function onDestroy(fn) {
		if (component_context === null) lifecycle_outside_component("onDestroy");
		onMount(() => () => untrack(fn));
	}
	/**
	* Legacy-mode: Init callbacks object for onMount/beforeUpdate/afterUpdate
	* @param {ComponentContext} context
	*/
	function init_update_callbacks(context) {
		var l = context.l;
		return l.u ??= {
			a: [],
			b: [],
			m: []
		};
	}
	//#endregion
	//#region node_modules/svelte/src/internal/disclose-version.js
	if (typeof window !== "undefined") ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
	//#endregion
	//#region src/utils/logger.js
	var PREFIX = "Dub+";
	function getTimeStamp() {
		return (/* @__PURE__ */ new Date()).toLocaleTimeString();
	}
	/**
	* @param {unknown[]} args
	*/
	function logInfo(...args) {
		console.log(`[${getTimeStamp()}] ${PREFIX}:`, ...args);
	}
	/**
	* @param {unknown[]} args
	*/
	function logError(...args) {
		console.error(`[${getTimeStamp()}] ${PREFIX}:`, ...args);
	}
	//#endregion
	//#region src/utils/waitFor.js
	/**
	* Looks for a property to exist in the provided starting scope. Handles
	* nested property lookups. Similar to lodash `_.get()` but only checks for
	* existence, not the value.
	*
	* For example:
	* if `objectPath` is `"QueUp.room.chat"` and the `startingScope` is the window
	* object, it would check in the following order:
	* 1. `window.Queup`
	* 2. `window.Queup.room`
	* 3. `window.Queup.room.chat`
	*
	* All have to be defined for it to return true.
	*
	* @param  {string} objectPath  the item you are looking for
	* @param  {object} [startingScope=window] where to start looking. default: `window`
	* @return {boolean} if it is defined or not
	*/
	function deepCheck(objectPath, startingScope = window) {
		const props = objectPath.split(".");
		let depth = startingScope;
		for (let i = 0; i < props.length; i++) {
			if (typeof depth[props[i]] === "undefined") return false;
			depth = depth[props[i]];
		}
		return true;
	}
	/**
	* Iterates over an array and checks for the existence of each item in the
	* provided starting scope.
	* @param {string[]} arr
	* @param {object} [startingScope=window] default: `window`
	* @returns
	*/
	function arrayDeepCheck(arr, startingScope = window) {
		const scope = startingScope;
		for (let i = 0; i < arr.length; i++) if (!deepCheck(arr[i], scope)) {
			logInfo(arr[i], "is not found yet");
			return false;
		}
		return true;
	}
	/**
	* Checks for the existence of the provides properties
	* @param {() => boolean} callback a function that returns true when ready
	* @param {object} [options] options to pass
	* @param {number} [options.interval] how often to ping
	* @param {number} [options.seconds] how long to keep trying before failing, default 10
	* @return {Promise<void>}
	*/
	function waitFor(callback, options = {}) {
		const opts = Object.assign({}, {
			interval: 500,
			seconds: 10
		}, options);
		return new Promise((resolve, reject) => {
			let tryCount = 0;
			const tryLimit = opts.seconds * 1e3 / opts.interval;
			const check = () => {
				tryCount++;
				if (callback()) resolve();
				else if (tryCount < tryLimit) window.setTimeout(check, opts.interval);
				else reject();
			};
			check();
		});
	}
	//#endregion
	//#region node_modules/svelte/src/internal/flags/legacy.js
	enable_legacy_mode_flag();
	//#endregion
	//#region src/lib/svg/Logo.svelte
	var root$28 = /* @__PURE__ */ from_svg(`<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 0 2078.496 2083.914" enable-background="new 0 0 2078.496 2083.914" xml:space="preserve"><rect x="769.659" y="772.445" fill-rule="evenodd" clip-rule="evenodd" fill="#660078" width="539.178" height="539.178"></rect><g><rect x="1308.837" y="772.445" fill-rule="evenodd" clip-rule="evenodd" fill="#EB008B" width="537.488" height="539.178"></rect><polygon fill="#EB008B" points="2045.015,1042.035 1845.324,1311.625 1845.324,772.446 	"></polygon></g><g><rect x="232.172" y="772.445" fill-rule="evenodd" clip-rule="evenodd" fill="#EB008B" width="537.487" height="539.178"></rect><polygon fill="#EB008B" points="33.481,1042.034 233.172,772.445 233.172,1311.623 	"></polygon></g><g><rect x="769.659" y="1311.624" fill-rule="evenodd" clip-rule="evenodd" fill="#6FCBDC" width="539.178" height="537.487"></rect><polygon fill="#6FCBDC" points="1039.248,2047.802 769.659,1848.111 1308.837,1848.111 	"></polygon></g><g><rect x="769.659" y="234.958" fill-rule="evenodd" clip-rule="evenodd" fill="#6FCBDC" width="539.178" height="537.487"></rect><polygon fill="#6FCBDC" points="1039.249,35.268 1308.837,235.958 769.659,235.958 	"></polygon></g></svg>`);
	function Logo($$anchor) {
		append($$anchor, root$28());
	}
	//#endregion
	//#region src/translation.js
	/**
	* @type {Record<string, Record<string, string>>}
	*/
	var translations = { en: {
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
		"MenuItem.edit": "Edit",
		"autovote.label": "Autovote",
		"autovote.description": "Toggles auto upvoting for every song",
		"afk.label": "AFK Auto-respond",
		"afk.description": "Toggle Away from Keyboard and customize AFK message.",
		"afk.modal.title": "Custom AFK Message",
		"afk.modal.content": "Enter a custom \"Away From Keyboard\" [AFK] message here. Message will be prefixed with '[AFK]'",
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
		"dj-notification.modal.content": "Please specify the position in queue you want to be notified at. Use \"0\" to be notified when you start playing.",
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
	} };
	//#endregion
	//#region src/lib/stores/i18n.svelte.js
	var locale = proxy({ current: "en" });
	function translate(loc, key, vars = {}) {
		if (!key) {
			logError("No translation key provided", {
				locale: loc,
				key,
				vars
			});
			return "";
		}
		const normalizedLocale = normalizeLocale(loc);
		let text = translations[normalizedLocale]?.[key];
		if (!text && normalizedLocale !== "en") text = translations["en"][key];
		if (!text) {
			logError(`No translation found for ${normalizedLocale}.${key}`);
			return key;
		}
		Object.keys(vars).forEach((item) => {
			const regex = new RegExp(`{{${item}}}`, "g");
			text = text.replace(regex, () => String(vars[item]));
		});
		return text;
	}
	/**
	*
	* @param {string} [key]
	* @param {Record<string, string|number|boolean>} [vars]
	* @returns
	*/
	function t(key, vars = {}) {
		return translate(locale.current, key, vars);
	}
	/**
	* @param {string} loc
	* @returns {string}
	*/
	function normalizeLocale(loc) {
		if (loc.toLowerCase().startsWith("en")) return "en";
		return loc;
	}
	//#endregion
	//#region src/lib/Loading.svelte
	var root$27 = /* @__PURE__ */ from_html(`<div class="dubplus-waiting svelte-gftfsn"><div style="width: 26px; margin-right:5px"><!></div> <span style="flex: 1;"> </span></div>`);
	function Loading($$anchor, $$props) {
		push($$props, false);
		init();
		var div = root$27();
		var div_1 = child(div);
		Logo(child(div_1), {});
		reset$2(div_1);
		var span = sibling(div_1, 2);
		var text = child(span, true);
		reset$2(span);
		reset$2(div);
		template_effect(($0) => set_text(text, $0), [() => t("Loading.text")]);
		append($$anchor, div);
		pop();
	}
	//#endregion
	//#region src/lib/stores/modalState.svelte.js
	var modalState = proxy({
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
		onCancel: () => {}
	});
	/**
	*
	* @param {import('../../global').ModalProps} nextState
	*/
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
	//#endregion
	//#region src/lib/Modal.svelte
	var root$26 = /* @__PURE__ */ from_html(`<div class="default svelte-5awcn0"><span class="default-label svelte-5awcn0"> </span> <span class="default-value svelte-5awcn0"> </span></div>`);
	var root_1$5 = /* @__PURE__ */ from_html(`<textarea class="svelte-5awcn0"></textarea>`);
	var root_2$1 = /* @__PURE__ */ from_html(`<p class="dp-modal--error svelte-5awcn0"> </p>`);
	var root_3 = /* @__PURE__ */ from_html(`<button class="dp-modal--cancel cancel svelte-5awcn0"> </button> <button class="dp-modal--confirm confirm svelte-5awcn0"> </button>`, 1);
	var root_4 = /* @__PURE__ */ from_html(`<button class="dp-modal--cancel cancel svelte-5awcn0"> </button>`);
	var root_5 = /* @__PURE__ */ from_html(`<dialog id="dubplus-dialog" class="dp-modal svelte-5awcn0"><h1 class="svelte-5awcn0"> </h1> <div class="dp-modal--content content svelte-5awcn0"><p class="svelte-5awcn0"> </p> <!> <!> <!></div> <div class="dp-modal--buttons buttons svelte-5awcn0"><!></div></dialog>`);
	function Modal($$anchor, $$props) {
		push($$props, true);
		let errorMessage = /* @__PURE__ */ state("");
		/** @type {HTMLDialogElement} */
		let dialog;
		onMount(() => {
			dialog = document.getElementById("dubplus-dialog");
			dialog.addEventListener("close", () => {
				modalState.open = false;
			});
		});
		user_effect(() => {
			if (modalState.open && dialog && !dialog.open) dialog.showModal();
		});
		var dialog_1 = root_5();
		var h1 = child(dialog_1);
		var text = child(h1, true);
		reset$2(h1);
		var div = sibling(h1, 2);
		var p = child(div);
		var text_1 = child(p, true);
		reset$2(p);
		var node = sibling(p, 2);
		var consequent = ($$anchor) => {
			var div_1 = root$26();
			var span = child(div_1);
			var text_2 = child(span);
			reset$2(span);
			var span_1 = sibling(span, 2);
			var text_3 = child(span_1, true);
			reset$2(span_1);
			reset$2(div_1);
			template_effect(($0) => {
				set_text(text_2, `${$0 ?? ""}:`);
				set_text(text_3, modalState.defaultValue);
			}, [() => t("Modal.defaultValue")]);
			append($$anchor, div_1);
		};
		if_block(node, ($$render) => {
			if (modalState.defaultValue) $$render(consequent);
		});
		var node_1 = sibling(node, 2);
		var consequent_1 = ($$anchor) => {
			var textarea = root_1$5();
			remove_textarea_child(textarea);
			template_effect(() => {
				set_attribute(textarea, "placeholder", modalState.placeholder);
				set_attribute(textarea, "maxlength", modalState.maxlength && modalState.maxlength < 999 ? modalState.maxlength : 999);
			});
			bind_value(textarea, () => modalState.value, ($$value) => modalState.value = $$value);
			append($$anchor, textarea);
		};
		if_block(node_1, ($$render) => {
			if (modalState.placeholder || modalState.value) $$render(consequent_1);
		});
		var node_2 = sibling(node_1, 2);
		var consequent_2 = ($$anchor) => {
			var p_1 = root_2$1();
			var text_4 = child(p_1, true);
			reset$2(p_1);
			template_effect(() => set_text(text_4, get(errorMessage)));
			append($$anchor, p_1);
		};
		if_block(node_2, ($$render) => {
			if (get(errorMessage)) $$render(consequent_2);
		});
		reset$2(div);
		var div_2 = sibling(div, 2);
		var node_3 = child(div_2);
		var consequent_3 = ($$anchor) => {
			var fragment = root_3();
			var button = first_child(fragment);
			var text_5 = child(button, true);
			reset$2(button);
			var button_1 = sibling(button, 2);
			var text_6 = child(button_1, true);
			reset$2(button_1);
			template_effect(($0, $1) => {
				set_text(text_5, $0);
				set_text(text_6, $1);
			}, [() => t("Modal.cancel"), () => t("Modal.confirm")]);
			delegated("click", button, () => {
				dialog.close();
				modalState.open = false;
				set(errorMessage, "");
				if (typeof modalState.onCancel === "function") modalState.onCancel();
			});
			delegated("click", button_1, () => {
				const isValidOrErrorMessage = modalState.validation?.(modalState.value ?? "") ?? true;
				if (isValidOrErrorMessage === true) {
					dialog.close();
					modalState.open = false;
					modalState.onConfirm?.(modalState.value ?? "");
					set(errorMessage, "");
				} else set(errorMessage, isValidOrErrorMessage, true);
			});
			append($$anchor, fragment);
		};
		var alternate = ($$anchor) => {
			var button_2 = root_4();
			var text_7 = child(button_2, true);
			reset$2(button_2);
			template_effect(($0) => set_text(text_7, $0), [() => t("Modal.close")]);
			delegated("click", button_2, () => {
				dialog.close();
				modalState.open = false;
				set(errorMessage, "");
			});
			append($$anchor, button_2);
		};
		if_block(node_3, ($$render) => {
			if (typeof modalState.onConfirm === "function") $$render(consequent_3);
			else $$render(alternate, -1);
		});
		reset$2(div_2);
		reset$2(dialog_1);
		template_effect(() => {
			set_text(text, modalState.title);
			set_text(text_1, modalState.content);
		});
		append($$anchor, dialog_1);
		pop();
	}
	delegate(["click"]);
	//#endregion
	//#region src/lib/actions/teleport.svelte.js
	var teleport = (node, { to, position = "append" }) => {
		user_effect(() => {
			if (node.id) document.getElementById(node.id)?.remove();
			const teleportContainer = document.querySelector(to);
			if (!teleportContainer) throw new Error(`teleport container not found: ${to}`);
			if (position === "append") teleportContainer.appendChild(node);
			else teleportContainer.prepend(node);
			return () => {
				node.remove();
			};
		});
	};
	//#endregion
	//#region src/lib/queup.ui.js
	/**
	* Anything that access the UI for QueUp should go here so that when there's any
	* future changes to the UI, we'll just need to update this file.
	*/
	/**
	* @returns {HTMLTextAreaElement | null}
	*/
	function getChatInput() {
		return document.querySelector("#chat-txt-message");
	}
	function getChatContainer() {
		return document.querySelector("ul.chat-main");
	}
	/**
	* @param {string} [extra] example: ":not([data-emote-processed])"
	* @returns {NodeListOf<HTMLLIElement>}
	*/
	function getChatMessages(extra = "") {
		return document.querySelectorAll(`ul.chat-main > li${extra}`);
	}
	/**
	* @returns {NodeListOf<HTMLAnchorElement>}
	*/
	function getImagesInChat() {
		return document.querySelectorAll(".chat-main > li .autolink-image");
	}
	/**
	* @returns {HTMLImageElement | null}
	*/
	function getBackgroundImage() {
		return document.querySelector(".backstretch img");
	}
	/**
	* @returns {HTMLSpanElement | null}
	*/
	function getQueuePosition() {
		return document.querySelector(".queue-position");
	}
	/**
	* @returns {HTMLSpanElement | null}
	*/
	function getQueueTotal() {
		return document.querySelector(".queue-total");
	}
	/**
	* @returns {HTMLIFrameElement | null}
	*/
	function getPlayerIframe() {
		return document.querySelector(".player_container iframe");
	}
	/**
	*
	* @returns {HTMLDivElement | null}
	*/
	function getPrivateMessageButton() {
		return document.querySelector(".user-messages");
	}
	/**
	* @param {string} messageId
	* @returns {HTMLLIElement | null}
	*/
	function getPrivateMessage(messageId) {
		return document.querySelector(`.message-item[data-messageid="${messageId}"]`);
	}
	/**
	* @returns {HTMLAnchorElement | null}
	*/
	function getDubUp() {
		return document.querySelector(".dubup");
	}
	/**
	* @returns {HTMLAnchorElement | null}
	*/
	function getDubDown() {
		return document.querySelector(".dubdown");
	}
	/**
	* @returns {HTMLLIElement | null}
	*/
	function getAddToPlaylist() {
		return document.querySelector(".add-to-playlist");
	}
	/**
	* @returns {HTMLSpanElement | null}
	*/
	function getCurrentSongMinutes() {
		return document.querySelector("div.currentTime span.min");
	}
	/**
	* Selectors for some elements
	*/
	var CHAT_INPUT_CONTAINER = ".pusher-chat-widget-input";
	/**
	* This is the location where the DubPlus menu will be placed.
	*/
	var DUBPLUS_MENU_CONTAINER = ".header-right-navigation";
	/**
	* This is where the ETA, Snooze, and Snooze Video buttons are placed.
	*/
	var PLAYER_SHARING_CONTAINER = ".player_sharing";
	//#endregion
	//#region src/lib/menu/MenuIcon.svelte
	var root$25 = /* @__PURE__ */ from_html(`<button id="dubplus-menu-icon" type="button" aria-label="Dub+ menu" class="dubplus-icon svelte-4l9n7d"><!></button>`);
	function MenuIcon($$anchor, $$props) {
		push($$props, false);
		init();
		var button = root$25();
		Logo(child(button), {});
		reset$2(button);
		action(button, ($$node, $$action_arg) => teleport?.($$node, $$action_arg), () => ({ to: DUBPLUS_MENU_CONTAINER }));
		delegated("click", button, () => {
			document.querySelector(".dubplus-menu")?.classList.toggle("dubplus-menu-open");
		});
		append($$anchor, button);
		pop();
	}
	delegate(["click"]);
	//#endregion
	//#region src/utils/settings-migrate-v2.js
	/**
	* Migration function to convert old settings to new settings
	*
	* The big difference is the renaming of the keys for each option to remove
	* the unnecessary "dubplus-" prefix, and also normalize to all use hyphens
	* v1: "dubplus-autovote"
	* v2: "autovote"
	*
	* v1: "mention_notifications"
	* v2: "mention-notifications"
	*/
	var optionsKeyMap = {
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
	var customKeyMap = {
		customAfkMessage: optionsKeyMap["dubplus-afk"],
		custom_mentions: optionsKeyMap["custom_mentions"],
		chat_cleaner: optionsKeyMap["chat-cleaner"],
		dj_notification: optionsKeyMap["dj_notification"],
		css: optionsKeyMap["dubplus-custom-css"],
		bg: optionsKeyMap["dubplus-custom-bg"],
		notificationSound: optionsKeyMap["dubplus-custom-notification-sound"],
		"dubplus-custom-notification-sound": optionsKeyMap["dubplus-custom-notification-sound"]
	};
	/**
	*
	* @param {import("../global").Settings} oldSettings
	* @returns {import("../global").Settings}
	*/
	function migrate(oldSettings) {
		logInfo("Old Settings", oldSettings);
		/**
		* @type {import("../global").Settings}
		*/
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
					/** @type {Error} */
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
					/** @type {Error} */
					e.message,
					oldKey,
					newKey,
					stringValue
				);
			}
		}
		return newOptions;
	}
	//#endregion
	//#region src/lib/stores/settings.svelte.js
	var STORAGE_KEY_OLD = "dubplusUserSettings";
	var STORAGE_KEY_NEW = "dubplusUserSettingsV2";
	var defaults = {
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
			const v2Settings = JSON.parse(localStorage.getItem(STORAGE_KEY_NEW) ?? "");
			if (v2Settings) return v2Settings;
		} catch (e) {
			logInfo("Error loading v2 settings, trying old settings. Error:", e);
		}
		try {
			const oldSettings = JSON.parse(localStorage.getItem(STORAGE_KEY_OLD) ?? "");
			if (oldSettings) return migrate(
				/**@type {import("../../global").Settings}*/
				oldSettings
			);
		} catch (e) {
			logInfo("Error loading old settings:", e);
		}
		return {};
	}
	/**
	* @type {import("../../global").Settings}
	*/
	var settings = proxy(Object.assign({}, defaults, loadSettings()));
	function persist() {
		try {
			localStorage.setItem(STORAGE_KEY_NEW, JSON.stringify(settings));
		} catch (e) {
			logError("Error saving user settings:", e);
		}
	}
	/**
	*
	* @param {import("../../global").SettingsSections} section
	* @param {string} property
	* @param {any} value
	*/
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
	//#endregion
	//#region src/lib/menu/MenuHeader.svelte
	var root$24 = /* @__PURE__ */ from_html(`<button type="button" class="dubplus-menu-section-header svelte-ou161d"><span></span> <p class="svelte-ou161d"> </p></button>`);
	function MenuHeader($$anchor, $$props) {
		push($$props, true);
		/**
		* @typedef {object} MenuHeaderProps
		* @property {string} props.settingsId
		* @property {string} props.name
		*/
		/** @type {MenuHeaderProps} */
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
		var button = root$24();
		var span = child(button);
		var p = sibling(span, 2);
		var text = child(p, true);
		reset$2(p);
		reset$2(button);
		template_effect(() => {
			set_attribute(button, "id", `dubplus-menu-section-header-${$$props.settingsId}`);
			set_attribute(button, "aria-expanded", get(expanded));
			set_attribute(button, "aria-controls", `dubplus-menu-section-${$$props.settingsId}`);
			set_class(span, 1, `fa fa-angle-${get(arrow) ?? ""}`, "svelte-ou161d");
			set_text(text, $$props.name);
		});
		delegated("click", button, toggle);
		append($$anchor, button);
		pop();
	}
	delegate(["click"]);
	//#endregion
	//#region src/lib/menu/MenuSection.svelte
	var root$23 = /* @__PURE__ */ from_html(`<ul class="dubplus-menu-section svelte-1njz3ux" role="region"><!></ul>`);
	function MenuSection($$anchor, $$props) {
		var ul = root$23();
		snippet(child(ul), () => $$props.children);
		reset$2(ul);
		template_effect(() => {
			set_attribute(ul, "id", `dubplus-menu-section-${$$props.settingsId}`);
			set_attribute(ul, "aria-labelledby", `dubplus-menu-section-header-${$$props.settingsId}`);
		});
		append($$anchor, ul);
	}
	//#endregion
	//#region src/lib/menu/MenuLink.svelte
	var root$22 = /* @__PURE__ */ from_html(`<li class="dubplus-menu-icon svelte-705sau"><!> <a class="dubplus-menu-label svelte-705sau" target="_blank"> </a></li>`);
	function MenuLink($$anchor, $$props) {
		var li = root$22();
		var node = child(li);
		component(node, () => $$props.icon, ($$anchor, Icon_1) => {
			Icon_1($$anchor, {});
		});
		var a = sibling(node, 2);
		var text_1 = child(a, true);
		reset$2(a);
		reset$2(li);
		template_effect(() => {
			set_attribute(a, "href", $$props.href);
			set_text(text_1, $$props.text);
		});
		append($$anchor, li);
	}
	//#endregion
	//#region src/lib/svg/IconBug.svelte
	var root$21 = /* @__PURE__ */ from_svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0c53 0 96 43 96 96l0 3.6c0 15.7-12.7 28.4-28.4 28.4l-135.1 0c-15.7 0-28.4-12.7-28.4-28.4l0-3.6c0-53 43-96 96-96zM41.4 105.4c12.5-12.5 32.8-12.5 45.3 0l64 64c.7 .7 1.3 1.4 1.9 2.1c14.2-7.3 30.4-11.4 47.5-11.4l112 0c17.1 0 33.2 4.1 47.5 11.4c.6-.7 1.2-1.4 1.9-2.1l64-64c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-64 64c-.7 .7-1.4 1.3-2.1 1.9c6.2 12 10.1 25.3 11.1 39.5l64.3 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c0 24.6-5.5 47.8-15.4 68.6c2.2 1.3 4.2 2.9 6 4.8l64 64c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0l-63.1-63.1c-24.5 21.8-55.8 36.2-90.3 39.6L272 240c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 239.2c-34.5-3.4-65.8-17.8-90.3-39.6L86.6 502.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l64-64c1.9-1.9 3.9-3.4 6-4.8C101.5 367.8 96 344.6 96 320l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64.3 0c1.1-14.1 5-27.5 11.1-39.5c-.7-.6-1.4-1.2-2.1-1.9l-64-64c-12.5-12.5-12.5-32.8 0-45.3z"></path></svg>`);
	function IconBug($$anchor) {
		append($$anchor, root$21());
	}
	//#endregion
	//#region src/lib/svg/IconReddit.svelte
	var root$20 = /* @__PURE__ */ from_svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32zM305.9 166.4c20.6 0 37.3-16.7 37.3-37.3s-16.7-37.3-37.3-37.3c-18 0-33.1 12.8-36.6 29.8c-30.2 3.2-53.8 28.8-53.8 59.9l0 .2c-32.8 1.4-62.8 10.7-86.6 25.5c-8.8-6.8-19.9-10.9-32-10.9c-28.9 0-52.3 23.4-52.3 52.3c0 21 12.3 39 30.1 47.4c1.7 60.7 67.9 109.6 149.3 109.6s147.6-48.9 149.3-109.7c17.7-8.4 29.9-26.4 29.9-47.3c0-28.9-23.4-52.3-52.3-52.3c-12 0-23 4-31.9 10.8c-24-14.9-54.3-24.2-87.5-25.4l0-.1c0-22.2 16.5-40.7 37.9-43.7l0 0c3.9 16.5 18.7 28.7 36.3 28.7zM155 248.1c14.6 0 25.8 15.4 25 34.4s-11.8 25.9-26.5 25.9s-27.5-7.7-26.6-26.7s13.5-33.5 28.1-33.5zm166.4 33.5c.9 19-12 26.7-26.6 26.7s-25.6-6.9-26.5-25.9c-.9-19 10.3-34.4 25-34.4s27.3 14.6 28.1 33.5zm-42.1 49.6c-9 21.5-30.3 36.7-55.1 36.7s-46.1-15.1-55.1-36.7c-1.1-2.6 .7-5.4 3.4-5.7c16.1-1.6 33.5-2.5 51.7-2.5s35.6 .9 51.7 2.5c2.7 .3 4.5 3.1 3.4 5.7z"></path></svg>`);
	function IconReddit($$anchor) {
		append($$anchor, root$20());
	}
	//#endregion
	//#region src/lib/svg/IconFacebook.svelte
	var root$19 = /* @__PURE__ */ from_svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64h98.2V334.2H109.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H255V480H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"></path></svg>`);
	function IconFacebook($$anchor) {
		append($$anchor, root$19());
	}
	//#endregion
	//#region src/lib/svg/IconTwitter.svelte
	var root$18 = /* @__PURE__ */ from_svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM351.3 199.3v0c0 86.7-66 186.6-186.6 186.6c-37.2 0-71.7-10.8-100.7-29.4c5.3 .6 10.4 .8 15.8 .8c30.7 0 58.9-10.4 81.4-28c-28.8-.6-53-19.5-61.3-45.5c10.1 1.5 19.2 1.5 29.6-1.2c-30-6.1-52.5-32.5-52.5-64.4v-.8c8.7 4.9 18.9 7.9 29.6 8.3c-9-6-16.4-14.1-21.5-23.6s-7.8-20.2-7.7-31c0-12.2 3.2-23.4 8.9-33.1c32.3 39.8 80.8 65.8 135.2 68.6c-9.3-44.5 24-80.6 64-80.6c18.9 0 35.9 7.9 47.9 20.7c14.8-2.8 29-8.3 41.6-15.8c-4.9 15.2-15.2 28-28.8 36.1c13.2-1.4 26-5.1 37.8-10.2c-8.9 13.1-20.1 24.7-32.9 34c.2 2.8 .2 5.7 .2 8.5z"></path></svg>`);
	function IconTwitter($$anchor) {
		append($$anchor, root$18());
	}
	//#endregion
	//#region src/lib/sections/Contact.svelte
	var root$17 = /* @__PURE__ */ from_html(`<!> <!> <!> <!>`, 1);
	var root_1$4 = /* @__PURE__ */ from_html(`<!> <!>`, 1);
	function Contact($$anchor, $$props) {
		push($$props, false);
		init();
		var fragment = root_1$4();
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
		MenuSection(sibling(node, 2), {
			settingsId: "contact",
			children: ($$anchor, $$slotProps) => {
				var fragment_1 = root$17();
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
				MenuLink(sibling(node_4, 2), {
					get icon() {
						return IconTwitter;
					},
					href: "https://twitter.com/DubPlusScript",
					text: "Twitter"
				});
				append($$anchor, fragment_1);
			},
			$$slots: { default: true }
		});
		append($$anchor, fragment);
		pop();
	}
	//#endregion
	//#region src/lib/menu/Switch.svelte
	var root$16 = /* @__PURE__ */ from_html(`<div role="switch" tabindex="0" class="svelte-1g2jwmf"><span class="dubplus-switch svelte-1g2jwmf"><span class="svelte-1g2jwmf"></span></span> <span class="dubplus-switch-label svelte-1g2jwmf"> </span></div>`);
	function Switch($$anchor, $$props) {
		push($$props, true);
		/**
		* @typedef {object} SwitchProps
		* @property {string} label
		* @property {string} optionId
		* @property {boolean} [disabled]
		* @property {(state: boolean) => void} onToggle
		*/
		/**
		* @type {SwitchProps} props
		*/
		function toggleOption() {
			settings.options[$$props.optionId] = !settings.options[$$props.optionId];
			$$props.onToggle(settings.options[$$props.optionId]);
		}
		/**
		* @param {KeyboardEvent} event
		*/
		function handleKeydown(event) {
			if ($$props.disabled) return;
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				toggleOption();
			}
		}
		function handleClick() {
			if ($$props.disabled) return;
			toggleOption();
		}
		var div = root$16();
		var span = sibling(child(div), 2);
		var text = child(span, true);
		reset$2(span);
		reset$2(div);
		template_effect(() => {
			set_attribute(div, "aria-disabled", $$props.disabled ? "true" : "false");
			set_attribute(div, "aria-checked", settings.options[$$props.optionId] ? "true" : "false");
			set_text(text, $$props.label);
		});
		delegated("click", div, handleClick);
		delegated("keydown", div, handleKeydown);
		append($$anchor, div);
		pop();
	}
	delegate(["click", "keydown"]);
	//#endregion
	//#region src/lib/svg/IconPencil.svelte
	var root$15 = /* @__PURE__ */ from_svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg>`);
	function IconPencil($$anchor) {
		append($$anchor, root$15());
	}
	//#endregion
	//#region src/utils/modcheck.js
	/**
	* Check if a user is at least a mod or above
	* @param {string} userid
	*/
	function isMod(userid) {
		return window.QueUp.helpers.isSiteAdmin(userid) || window.QueUp.room.users.getIfOwner(userid) || window.QueUp.room.users.getIfManager(userid) || window.QueUp.room.users.getIfMod(userid);
	}
	//#endregion
	//#region src/lib/menu/MenuSwitch.svelte
	var root$14 = /* @__PURE__ */ from_html(`<button type="button" class="svelte-1aj88xa"><!> <span class="sr-only"> </span></button>`);
	var root_1$3 = /* @__PURE__ */ from_html(`<li><!> <!> <!></li>`);
	function MenuSwitch($$anchor, $$props) {
		push($$props, true);
		/**
		* @typedef {object} MenuSwitchProps
		* @property {string} id
		* @property {string} label
		* @property {string} description
		* @property {boolean} [modOnly]
		* @property {(onLoad?: boolean) => void} [turnOn] runs when the switch is turned on
		* @property {() => void} [turnOff] runs when the switch is turned off
		* @property {() => void} [init] always runs when the component mounts, whether
		* the switch is on or off
		* @property {import('../../global').ModalProps} [customize]
		* @property {import('../modules/module').DubPlusModule['secondaryAction']} [secondaryAction]
		*
		*/
		/**
		* @type {MenuSwitchProps}
		*/
		const SecondaryIcon = $$props.secondaryAction?.icon || IconPencil;
		onMount(() => {
			if ($$props.init) $$props.init();
			if (settings.options[$$props.id]) {
				if ($$props.modOnly ? isMod(window.QueUp.session.id) : true) $$props.turnOn?.(true);
			}
		});
		onDestroy(() => {
			if (settings.options[$$props.id]) $$props.turnOff?.();
		});
		function openEditModal() {
			updateModalState({
				title: t($$props.customize?.title),
				content: t($$props.customize?.content),
				placeholder: t($$props.customize?.placeholder),
				defaultValue: $$props.customize?.defaultValue ? t($$props.customize.defaultValue) : "",
				maxlength: $$props.customize?.maxlength,
				value: settings.custom[$$props.id] || "",
				validation: $$props.customize?.validation,
				onConfirm: (value) => {
					saveSetting("custom", $$props.id, value);
					if (value.trim() === "" && !$$props.customize?.defaultValue) {
						saveSetting("option", $$props.id, false);
						$$props.turnOff?.();
					}
					if (typeof $$props.customize?.onConfirm === "function") $$props.customize.onConfirm(value);
				},
				onCancel: () => {
					if (!$$props.customize?.defaultValue && (typeof settings.custom[$$props.id] === "undefined" || settings.custom[$$props.id] === "")) {
						saveSetting("option", $$props.id, false);
						$$props.turnOff?.();
					}
					if (typeof $$props.customize?.onCancel === "function") $$props.customize?.onCancel();
				}
			});
			modalState.open = true;
		}
		var li = root_1$3();
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
				onToggle: (state) => {
					if ($$props.customize && state === true && !settings.custom[$$props.id]) {
						openEditModal();
						return;
					}
					saveSetting("option", $$props.id, state);
					if (state) $$props.turnOn?.();
					else $$props.turnOff?.();
				},
				get optionId() {
					return $$props.id;
				}
			});
		}
		var node_1 = sibling(node, 2);
		var consequent = ($$anchor) => {
			var button = root$14();
			var node_2 = child(button);
			IconPencil(node_2, {});
			var span = sibling(node_2, 2);
			var text = child(span, true);
			reset$2(span);
			reset$2(button);
			template_effect(($0) => set_text(text, $0), [() => t("MenuItem.edit")]);
			delegated("click", button, openEditModal);
			append($$anchor, button);
		};
		if_block(node_1, ($$render) => {
			if ($$props.customize) $$render(consequent);
		});
		var node_3 = sibling(node_1, 2);
		var consequent_1 = ($$anchor) => {
			var button_1 = root$14();
			var node_4 = child(button_1);
			SecondaryIcon(node_4, {});
			var span_1 = sibling(node_4, 2);
			var text_1 = child(span_1, true);
			reset$2(span_1);
			reset$2(button_1);
			template_effect(($0, $1) => {
				button_1.disabled = !settings.options[$$props.id];
				set_attribute(button_1, "title", $0);
				set_text(text_1, $1);
			}, [() => t($$props.secondaryAction.description), () => t($$props.secondaryAction.description)]);
			delegated("click", button_1, function(...$$args) {
				$$props.secondaryAction.onClick?.apply(this, $$args);
			});
			append($$anchor, button_1);
		};
		if_block(node_3, ($$render) => {
			if ($$props.secondaryAction) $$render(consequent_1);
		});
		reset$2(li);
		template_effect(($0, $1) => {
			set_attribute(li, "id", `dubplus-${$$props.id}`);
			set_attribute(li, "title", $0);
			classes = set_class(li, 1, "svelte-1aj88xa", null, classes, $1);
		}, [() => t($$props.description), () => ({ disabled: $$props.modOnly ? !isMod(window.QueUp.session.id) : false })]);
		append($$anchor, li);
		pop();
	}
	delegate(["click"]);
	//#endregion
	//#region src/events-constants.js
	/**
	* When a user in the room up/down dubs a song
	*/
	var DUB = "realtime:room_playlist-dub";
	/**
	* When user in the room grabs a song
	*/
	var GRAB = "realtime:room_playlist-queue-update-grabs";
	/**
	* When a user leaves the room
	*/
	var USER_LEAVE = "realtime:user-leave";
	/**
	* When the room playlist updates. Many things can trigger this.
	* - the next track plays
	* - someone joins the queue
	* - someone leaves the queue
	* - someone changes the order of the queue
	* - someone changes their song in the queue
	*
	* Each time it still only gives you information about currently playing song
	*/
	var PLAYLIST_UPDATE = "realtime:room_playlist-update";
	/**
	* When any chat message arrives in the chat
	*/
	var CHAT_MESSAGE = "realtime:chat-message";
	/**
	* When user receives a private message
	*/
	var NEW_PM_MESSAGE = "realtime:new-message";
	//#endregion
	//#region src/lib/modules/autovote.js
	function voteCheck() {
		window.QueUp?.playerController?.voteUp?.click();
	}
	/**
	* @type {import("./module").DubPlusModule}
	*/
	var autovote = {
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
	//#endregion
	//#region src/utils/chat-message.js
	/**
	* This inserts a chat message row into the chat.
	* @param {string} className
	* @param {string} textContent
	*/
	function insertQueupChat(className, textContent) {
		const chatContainer = getChatContainer();
		if (!chatContainer) {
			logError("insertQueupChat: Chat container not found, can not insert message", {
				className,
				textContent
			});
			return;
		}
		const li = document.createElement("li");
		li.className = `dubplus-chat-system ${className}`;
		const chatDelete = document.createElement("div");
		chatDelete.className = "chatDelete";
		chatDelete.onclick = function(e) {
			/**@type {HTMLDivElement}*/ e.target.parentElement?.remove();
		};
		const span = document.createElement("span");
		span.className = "icon-close";
		chatDelete.appendChild(span);
		li.appendChild(chatDelete);
		const text = document.createElement("div");
		text.className = "text";
		text.textContent = textContent;
		li.appendChild(text);
		chatContainer.appendChild(li);
	}
	/**
	* This inserts text into the chat input and programmatically
	* submits the chat message.
	* @param {string} message
	*/
	function sendChatMessage(message) {
		const chatInput = getChatInput();
		if (chatInput) {
			const messageOriginal = chatInput.value;
			chatInput.value = message;
			window.QueUp.room.chat.sendMessage();
			if (messageOriginal) chatInput.value = messageOriginal;
		} else logError("sendChatMessage: Chat input not found, can not send message", { message });
	}
	//#endregion
	//#region src/lib/modules/afk.js
	/**
	* AFK -  Away from Keyboard
	* Toggles the afk auto response on/off
	* including adding a custom message
	*/
	var canSend = true;
	/**
	*
	* @param {import("../../events").ChatMessageEvent} e
	* @returns {void}
	*/
	function afk_chat_respond(e) {
		if (!canSend) return;
		const content = e.message;
		const user = window.QueUp.session.get("username");
		if (content.includes(`@${user}`) && window.QueUp.session.id !== e.user.userInfo.userid) {
			let chatMessage = "";
			if (settings.custom.afk) chatMessage = `[AFK] ${settings.custom.afk}`;
			else chatMessage = `[AFK] ${t("afk.modal.placeholder")}`;
			sendChatMessage(chatMessage);
			canSend = false;
			setTimeout(() => {
				canSend = true;
			}, 3e4);
		}
	}
	/**
	* @type {import("./module").DubPlusModule}
	*/
	var afk = {
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
	//#endregion
	//#region src/utils/ldb.js
	/**
	* A wrapper around IndexedDB.
	* IndexedDB has a higher storage limit (50mb) compared to localstorage (5mb).
	*/
	var OBJECT_STORE_NAME = "s";
	var MAX_GET_ATTEMPTS = 50;
	var LDB = class {
		constructor() {
			/**
			* @type {IDBDatabase|null}
			*/
			this.db = null;
			/**
			* Set to true when the DB connection fails to open, so reads don't
			* poll forever waiting for a `db` that will never arrive.
			* @type {boolean}
			*/
			this.failed = false;
			const dbReq = window.indexedDB.open("d2", 1);
			const outerThis = this;
			dbReq.onsuccess = function() {
				outerThis.db = this.result;
			};
			dbReq.onerror = function(e) {
				outerThis.failed = true;
				logError("indexedDB request error:", e);
			};
			dbReq.onupgradeneeded = function() {
				outerThis.db = null;
				var t = this.result.createObjectStore(OBJECT_STORE_NAME, { keyPath: "k" });
				t.transaction.oncomplete = function() {
					outerThis.db = this.db;
				};
			};
		}
		/**
		*
		* @param {string} key
		* @param {number} [attempt] internal retry counter
		* @returns {Promise<string|null>}
		*/
		get(key, attempt = 0) {
			return new Promise((resolve) => {
				if (this.db) this.db.transaction(OBJECT_STORE_NAME).objectStore(OBJECT_STORE_NAME).get(key).onsuccess = function() {
					resolve(this.result?.v || null);
				};
				else if (this.failed || attempt >= MAX_GET_ATTEMPTS) {
					logError("indexedDB not ready. Could not get:", key);
					resolve(null);
				} else setTimeout(() => {
					this.get(key, attempt + 1).then(resolve);
				}, 100);
			});
		}
		/**
		*
		* @param {string} key
		* @param {string} value
		*/
		set(key, value) {
			if (!this.db) {
				logError("indexedDB not ready yet. Could not set:", key);
				return;
			}
			this.db.transaction(OBJECT_STORE_NAME, "readwrite").objectStore(OBJECT_STORE_NAME).put({
				k: key,
				v: value
			});
		}
	};
	//#endregion
	//#region src/lib/emoji/emoji.js
	var ldb = new LDB();
	/**
	* @typedef {object} TwitchEmote
	* @property {string} description
	* @property {string} image_id
	* @property {string|null} first_seen
	*/
	/**
	* @typedef {object} TwitchJsonResponse
	* @property {object} meta
	* @property {string} meta.generated_at
	* @property {object} template
	* @property {string} template.small
	* @property {string} template.medium
	* @property {string} template.large
	* @property {{[emote: string]: TwitchEmote}} emotes
	*/
	/**
	*
	* @returns {Promise<TwitchJsonResponse>}
	*/
	function fetchTwitchEmotes() {
		return fetch("//cdn.jsdelivr.net/gh/Jiiks/BetterDiscordApp/data/emotedata_twitch_global.json").then((res) => res.json());
	}
	/**
	* @typedef {object} BttvEmote
	* @property {string} id
	* @property {string} code
	* @property {string} imageType
	* @property {boolean} animated
	* @property {string} userId
	* @property {boolean} modifier
	*/
	/**
	* @typedef {BttvEmote[]} BttvJsonResponse
	*/
	/**
	* @returns {Promise<BttvJsonResponse>}
	*/
	function fetchBTTVEmotes() {
		return fetch("//api.betterttv.net/3/cached/emotes/global").then((res) => res.json());
	}
	/**
	* @typedef {object} FrankerFacezEmote
	* @property {number} id
	* @property {string} name
	* @property {number} height
	* @property {number} width
	* @property {boolean} public
	* @property {boolean} hidden
	* @property {boolean} modifier
	* @property {number} modifier_flags
	* @property {null} offset
	* @property {null} margins
	* @property {null} css
	* @property {{_id: number, name: string, display_name: string}} owner
	* @property {null} artist
	* @property {{1: string, 2: string, 4: string}} urls
	* @property {number} status
	* @property {number} usage_count
	* @property {string} created_at
	* @property {string} last_updated
	*/
	/**
	* @typedef {object} FrankerFacezJsonResponse
	* @property {number} _pages
	* @property {number} _total
	* @property {FrankerFacezEmote[]} emoticons
	*/
	/**
	* @returns {Promise<FrankerFacezJsonResponse>}
	*/
	function fetchFrankerFacezEmotes() {
		return fetch("//api.frankerfacez.com/v1/emoticons?per_page=200&private=off&sort=count-desc").then((res) => res.json());
	}
	var dubplus_emoji = {
		emoji: { 
		/**
		* @param {string} id
		* @returns {string}
		*/
template(id) {
			id = id.replace(/:/g, "");
			return `${window.emojify.defaultConfig.img_dir}/${encodeURI(id)}.png`;
		} },
		twitchJSONSLoaded: false,
		bttvJSONSLoaded: false,
		frankerfacezJSONLoaded: false,
		twitch: {
			/**
			* @param {string} [id]
			* @returns {string}
			*/
			template(id) {
				if (!id) return "";
				return `//static-cdn.jtvnw.net/emoticons/v1/${id}/3.0`;
			},
			/**
			* @type {Map<string, string>}
			*/
			emotesMap: /* @__PURE__ */ new Map()
		},
		bttv: {
			/**
			* @param {string} [id]
			* @returns {string}
			*/
			template(id) {
				if (!id) return "";
				return `//cdn.betterttv.net/emote/${id}/3x`;
			},
			/**
			* @type {Map<string, string>}
			*/
			emotesMap: /* @__PURE__ */ new Map()
		},
		frankerFacez: {
			/**
			* @param {number} [id]
			* @returns {string}
			*/
			template(id) {
				if (typeof id !== "number") return "";
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
				if (savedItem) try {
					if (typeof JSON.parse(savedItem).error !== "undefined") return true;
				} catch {
					return true;
				}
				const today = Date.now();
				const lastSaved = parseInt(localStorage.getItem(`${apiName}_api_timestamp`) || "");
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
			if (this.twitchJSONSLoaded) return Promise.resolve();
			return this.shouldUpdateAPIs("twitch").then((shouldUpdate) => {
				if (shouldUpdate) {
					logInfo("twitch", "loading from api");
					return fetchTwitchEmotes().then((json) => {
						/**
						* @type {{[emote: string]: string}}
						*/
						const twitchEmotes = {};
						for (const emote in json.emotes) if (!twitchEmotes[emote]) twitchEmotes[emote] = json.emotes[emote].image_id;
						localStorage.setItem("twitch_api_timestamp", Date.now().toString());
						ldb.set("twitch_api", JSON.stringify(twitchEmotes));
						dubplus_emoji.processTwitchEmotes(twitchEmotes);
					}).catch((err) => logError(err));
				} else return ldb.get("twitch_api").then((data) => {
					logInfo("twitch", "loading from IndexedDB");
					/**
					* @type {{[emote: string]: string}}
					*/
					const savedData = JSON.parse(data || "{}");
					dubplus_emoji.processTwitchEmotes(savedData);
				});
			});
		},
		/**
		* @return {Promise<void>}
		*/
		loadBTTVEmotes() {
			if (this.bttvJSONSLoaded) return Promise.resolve();
			return this.shouldUpdateAPIs("bttv").then((shouldUpdate) => {
				if (shouldUpdate) {
					logInfo("bttv", "loading from api");
					return fetchBTTVEmotes().then((json) => {
						/**
						* @type {{[emote: string]: string}}
						*/
						const bttvEmotes = {};
						json.forEach((e) => {
							if (!bttvEmotes[e.code]) bttvEmotes[e.code] = e.id;
						});
						localStorage.setItem("bttv_api_timestamp", Date.now().toString());
						ldb.set("bttv_api", JSON.stringify(bttvEmotes));
						dubplus_emoji.processBTTVEmotes(bttvEmotes);
					}).catch((err) => logError(err));
				} else return ldb.get("bttv_api").then((data) => {
					logInfo("bttv", "loading from IndexedDB");
					/**
					* @type {{[emote: string]: string}}
					*/
					const savedData = JSON.parse(data || "{}");
					dubplus_emoji.processBTTVEmotes(savedData);
				});
			});
		},
		/**
		* @return {Promise<void>}
		*/
		loadFrankerFacez() {
			if (this.frankerfacezJSONLoaded) return Promise.resolve();
			return this.shouldUpdateAPIs("frankerfacez").then((shouldUpdate) => {
				if (shouldUpdate) {
					logInfo("frankerfacez", "loading from api");
					return fetchFrankerFacezEmotes().then((json) => {
						const frankerFacez = json;
						localStorage.setItem("frankerfacez_api_timestamp", Date.now().toString());
						ldb.set("frankerfacez_api", JSON.stringify(frankerFacez));
						dubplus_emoji.processFrankerFacez(frankerFacez);
					}).catch((err) => logError(err));
				} else return ldb.get("frankerfacez_api").then((data) => {
					logInfo("frankerfacez", "loading from IndexedDB");
					const savedData = JSON.parse(data || "{}");
					dubplus_emoji.processFrankerFacez(savedData);
				});
			});
		},
		/**
		*
		* @param {{[emote: string]: string}} data
		*/
		processTwitchEmotes(data) {
			for (const code in data) if (Object.hasOwn(data, code)) {
				const key = code.toLowerCase();
				if (window.emojify.emojiNames.includes(key)) this.twitch.emotesMap.set(`${key}_twitch`, data[code]);
				else this.twitch.emotesMap.set(key, data[code]);
			}
			this.twitchJSONSLoaded = true;
		},
		/**
		* @param {{[emote: string]: string}} data
		*/
		processBTTVEmotes(data) {
			for (const code in data) if (Object.hasOwn(data, code)) {
				const key = code.toLowerCase();
				if (code.includes(":")) continue;
				if (window.emojify.emojiNames.includes(key) || this.twitch.emotesMap.has(key)) this.bttv.emotesMap.set(`${key}_bttv`, data[code]);
				else this.bttv.emotesMap.set(key, data[code]);
			}
			this.bttvJSONSLoaded = true;
		},
		/**
		* @param {FrankerFacezJsonResponse} data
		*/
		processFrankerFacez(data) {
			if (!Array.isArray(data.emoticons)) {
				logInfo("frankerfacez", "cached data invalid, will refetch next load");
				localStorage.removeItem("frankerfacez_api_timestamp");
				return;
			}
			for (const emoticon of data.emoticons) {
				const code = emoticon.name;
				const key = code.toLowerCase();
				if (code.includes(":")) continue;
				if (window.emojify.emojiNames.includes(key) || this.twitch.emotesMap.has(key) || this.bttv.emotesMap.has(key)) this.frankerFacez.emotesMap.set(`${key}_ffz`, emoticon.id);
				else this.frankerFacez.emotesMap.set(key, emoticon.id);
			}
			this.frankerfacezJSONLoaded = true;
		},
		/**
		* @param {string} str
		* @param {boolean} [emotesEnabled=false]
		*/
		findMatchingEmotes(str, emotesEnabled = false) {
			/**
			* @type {import("./emojiTypes").Emoji[]}
			*/
			const matches = [];
			window.emojify.emojiNames.forEach((emoji) => {
				if (emoji.includes(str)) matches.push({
					src: this.emoji.template(emoji),
					text: emoji,
					alt: emoji,
					platform: "emojify"
				});
			});
			if (!emotesEnabled) return matches;
			Array.from(this.twitch.emotesMap.keys()).forEach((emoji) => {
				if (emoji.includes(str)) matches.push({
					src: this.twitch.template(this.twitch.emotesMap.get(emoji)),
					text: emoji,
					alt: emoji,
					platform: "twitch"
				});
			});
			Array.from(this.bttv.emotesMap.keys()).forEach((emoji) => {
				if (emoji.includes(str)) matches.push({
					src: this.bttv.template(this.bttv.emotesMap.get(emoji)),
					text: emoji,
					alt: emoji,
					platform: "bttv"
				});
			});
			Array.from(this.frankerFacez.emotesMap.keys()).forEach((emoji) => {
				if (emoji.includes(str)) matches.push({
					src: this.frankerFacez.template(this.frankerFacez.emotesMap.get(emoji)),
					text: emoji,
					alt: emoji,
					platform: "ffz"
				});
			});
			return matches;
		}
	};
	//#endregion
	//#region src/lib/modules/emotes.js
	/**
	*
	* @param {string} type
	* @param {string} src
	* @param {string} name
	* @param {number} [w]
	* @param {number} [h]
	* @returns {HTMLImageElement}
	*/
	function makeImage(type, src, name, w, h) {
		const img = document.createElement("img");
		img.className = `emoji ${type}-emote`;
		img.title = name;
		img.alt = name;
		img.src = src;
		if (w) img.width = w;
		if (h) img.height = h;
		return img;
	}
	/**
	* @param {string} text
	* @returns {Array<HTMLImageElement | Text>}
	*/
	function processChatText(text) {
		const regex = /(:[^: ]+:)/g;
		const chunks = text.split(regex);
		/**
		* @type {Array<HTMLImageElement | Text>}
		*/
		const nodes = [];
		chunks.forEach((chunk) => {
			if (chunk.match(regex)) {
				const key = chunk.toLowerCase().replace(/^:/, "").replace(/:$/, "");
				if (dubplus_emoji.twitchJSONSLoaded && dubplus_emoji.twitch.emotesMap.has(key)) {
					const id = dubplus_emoji.twitch.emotesMap.get(key);
					const img = makeImage("twitch", dubplus_emoji.twitch.template(id), key);
					nodes.push(img);
				} else if (dubplus_emoji.bttvJSONSLoaded && dubplus_emoji.bttv.emotesMap.has(key)) {
					const id = dubplus_emoji.bttv.emotesMap.get(key);
					const img = makeImage("bttv", dubplus_emoji.bttv.template(id), key);
					nodes.push(img);
				} else if (dubplus_emoji.frankerfacezJSONLoaded && dubplus_emoji.frankerFacez.emotesMap.has(key)) {
					const id = dubplus_emoji.frankerFacez.emotesMap.get(key);
					const img = makeImage("frankerFacez", dubplus_emoji.frankerFacez.template(id), key);
					nodes.push(img);
				} else nodes.push(document.createTextNode(chunk));
			} else nodes.push(document.createTextNode(chunk));
		});
		return nodes;
	}
	/**
	* @param {HTMLLIElement} li
	* @return {void}
	*/
	function processChatLI(li) {
		li.querySelectorAll(".text p").forEach((textElem) => {
			if (!textElem.hasAttribute("dubplus-emotes-processed") && textElem?.textContent.trim() !== "") {
				[...textElem.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE).forEach((textNode) => {
					textNode.replaceWith(...processChatText(textNode.textContent ?? ""));
				});
				textElem.setAttribute("dubplus-emotes-processed", "true");
			}
		});
	}
	/**
	* run this when a new chat message is received
	* and only replaces emotes in the last message
	* @param {import('../../events').ChatMessageEvent} [e]
	* @returns {void}
	*/
	function replaceTextWithEmote(e) {
		if (e?.chatid) {
			/**
			* @type {HTMLLIElement | null}
			*/
			const chatMessage = document.querySelector(`.chat-id-${e.chatid}`);
			if (chatMessage) {
				processChatLI(chatMessage);
				return;
			}
		}
		const chats = getChatMessages();
		if (!chats?.length) return;
		chats.forEach(processChatLI);
	}
	/**
	* Emotes
	* This module adds support for converting :emote: text into images.
	* Currently it only supports: Twitch, BTTV, and FrankerFaceZ emotes.
	* @type {import("./module").DubPlusModule}
	*/
	var emotes = {
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
	//#endregion
	//#region src/lib/emoji/emojiState.svelte.js
	var emojiState = proxy({
		selectedIndex: 0,
		emojiList: []
	});
	function reset$1() {
		emojiState.selectedIndex = 0;
		emojiState.emojiList = [];
	}
	/**
	* @param {Emoji[]} listArray
	* @param {string} searchStr
	*/
	function setEmojiList(listArray, searchStr) {
		const platforms = [
			"emojify",
			"twitch",
			"bttv",
			"ffz"
		];
		emojiState.emojiList = listArray.filter((emoji, index, self) => index === self.findIndex((e) => e.src === emoji.src && e.platform === emoji.platform)).sort((a, b) => {
			const platformA = platforms.indexOf(a.platform);
			const platformB = platforms.indexOf(b.platform);
			if (platformA === platformB) if (a.text.startsWith(searchStr) && !b.text.startsWith(searchStr)) return -1;
			else if (!a.text.startsWith(searchStr) && b.text.startsWith(searchStr)) return 1;
			else return a.text.localeCompare(b.text);
			return platformA - platformB;
		});
		emojiState.selectedIndex = 0;
	}
	function decrement() {
		if (emojiState.selectedIndex > 0) emojiState.selectedIndex--;
		else emojiState.selectedIndex = emojiState.emojiList.length - 1;
	}
	function increment() {
		if (emojiState.selectedIndex < emojiState.emojiList.length - 1) emojiState.selectedIndex++;
		else emojiState.selectedIndex = 0;
	}
	//#endregion
	//#region src/lib/emoji/helpers.js
	/**
	*
	* @param {string} char
	* @returns {boolean}
	*/
	function isEdge(char) {
		return char === " " || char === "\n";
	}
	/**
	* Assuming that the selectionStart is adjacent to, or within, a partial emoji,
	* get the selection range of the partial emoji
	*
	* "This is a :cat example" -> [10, 14]
	*            ^^^^^ cursor can be anywhere in this range
	* @param {string} currentText
	* @param {number} cursorPos
	* @returns {[number, number]}
	*/
	function getSelection(currentText, cursorPos) {
		let left = cursorPos > 0 ? cursorPos : 0;
		while (left > 0 && currentText[left] !== ":") left -= 1;
		let right = cursorPos;
		while (!isEdge(currentText[right]) && right < currentText.length) right += 1;
		return [left, right];
	}
	//#endregion
	//#region src/lib/modules/autocomplete.js
	/**
	* Autocomplete Emojis/Emotes
	*/
	var KEYS = {
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
	/**
	* Minimum number of characters to start filtering emojis.
	* Includes the ":" character so ":sm" is 3 characters.
	*/
	var MIN_CHAR = 2;
	/**
	*
	* @returns {HTMLUListElement | null}
	*/
	function getAutocompletePreview() {
		return document.querySelector("#autocomplete-preview");
	}
	/**
	* @type {string}
	*/
	var originalKeyDownEventHandler;
	/**
	*
	* @param {HTMLTextAreaElement} inputEl
	* @param {number} index
	*/
	function insertEmote(inputEl, index) {
		const selected = emojiState.emojiList[index];
		if (!selected) return;
		const [start, end] = getSelection(inputEl.value, inputEl.selectionStart);
		inputEl.value = inputEl.value.slice(0, start) + `:${selected.text}:` + inputEl.value.slice(end);
		reset$1();
	}
	/**
	* @param {KeyboardEvent | MouseEvent} e
	*/
	function checkInput(e) {
		const inputEl = e.target;
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
			setEmojiList(dubplus_emoji.findMatchingEmotes(searchStr, settings.options.emotes), searchStr);
		} else reset$1();
	}
	/**
	*
	* @param {KeyboardEvent} e
	* @returns
	*/
	function chatInputKeyupFunc(e) {
		const acPreview = getAutocompletePreview();
		if (!acPreview) return;
		const hasItems = acPreview.children.length > 0;
		if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) return;
		if (e.key === KEYS.up && hasItems) {
			decrement();
			return;
		}
		if (e.key === KEYS.down && hasItems) {
			increment();
			return;
		}
		if ((e.key === KEYS.enter || e.key === KEYS.tab) && hasItems) {
			e.preventDefault();
			e.stopImmediatePropagation();
			const inputEl = e.target;
			insertEmote(inputEl, emojiState.selectedIndex);
			return;
		}
		if (e.key === KEYS.enter && !hasItems) {
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
	/**
	*
	* @param {KeyboardEvent} e
	* @returns
	*/
	function chatInputKeydownFunc(e) {
		const acPreview = getAutocompletePreview();
		if (!acPreview) return;
		const emptyPreview = acPreview.children.length === 0;
		const isValidKey = [
			KEYS.tab,
			KEYS.enter,
			KEYS.up,
			KEYS.down
		].includes(e.key);
		const isModifierKey = e.shiftKey || e.ctrlKey || e.altKey || e.metaKey;
		if (!isModifierKey && !emptyPreview && isValidKey) {
			e.preventDefault();
			return;
		}
		if (!isModifierKey && e.key === KEYS.enter) {
			window.QueUp.room.chat.sendMessage();
			window.QueUp.room.chat.resizeTextarea();
		} else if (!isModifierKey) window.QueUp.room.chat.ncKeyDown(e);
	}
	/**
	* Autocomplete
	* This module will allow users to autocomplete emojis/emotes in chat by presenting
	* a popup window above the chat that users can navigate with the arrow keys and select
	* @type {import("./module").DubPlusModule}
	*/
	var autocomplete = {
		id: "autocomplete",
		label: "autocomplete.label",
		category: "general",
		description: "autocomplete.description",
		turnOn() {
			reset$1();
			waitFor(() => Boolean(getChatInput()) && Boolean(window.QueUp?.room?.chat)).then(() => {
				const chatInput = getChatInput();
				if (!chatInput) return;
				originalKeyDownEventHandler = window.QueUp.room.chat.events["keydown #chat-txt-message"];
				const newEventsObject = { ...window.QueUp.room.chat.events };
				delete newEventsObject["keydown #chat-txt-message"];
				window.QueUp.room.chat.delegateEvents(newEventsObject);
				chatInput.addEventListener("keydown", chatInputKeydownFunc);
				chatInput.addEventListener("keyup", chatInputKeyupFunc);
				chatInput.addEventListener("click", checkInput);
			}).catch(() => {
				logError("Autocomplete: chat input never appeared; module not enabled.");
			});
		},
		turnOff() {
			reset$1();
			if (originalKeyDownEventHandler) {
				window.QueUp.room.chat.events["keydown #chat-txt-message"] = originalKeyDownEventHandler;
				window.QueUp.room.chat.delegateEvents(window.QueUp.room.chat.events);
			}
			const chatInput = getChatInput();
			if (!chatInput) return;
			chatInput.removeEventListener("keydown", chatInputKeydownFunc);
			chatInput.removeEventListener("keyup", chatInputKeyupFunc);
			chatInput.removeEventListener("click", checkInput);
		}
	};
	//#endregion
	//#region src/lib/modules/customMentions.js
	/**
	* Custom Mentions
	*
	* When enabled, you can set custom text that triggers the mention chat sound
	* when it is mentioned in chat.
	*
	* This works with or without the "@". So if you set your custom mention to
	* be dubplus, it will trigger the sound when someone says "dubplus" or "@dubplus".
	*/
	var MODULE_ID$2 = "custom-mentions";
	/**
	* @param {import("../../events").ChatMessageEvent} e
	*/
	function customMentionCheck(e) {
		const enabled = settings.options[MODULE_ID$2];
		const custom = settings.custom[MODULE_ID$2];
		if (enabled && window.QueUp.session.id !== e.user.userInfo.userid) {
			if (custom.split(",").some(function(v) {
				return new RegExp(`\\b@?${v.trim()}\\b`, "ig").test(e.message);
			})) window.QueUp.room.chat.mentionChatSound.play();
		}
	}
	/**
	* @type {import('./module').DubPlusModule}
	*/
	var customMentions = {
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
	//#endregion
	//#region src/lib/modules/chatCleaner.js
	var MODULE_ID$1 = "chat-cleaner";
	/**
	* @param {number} [limit]
	*/
	function cleanChat(limit) {
		const chatMessages = getChatMessages();
		if (!chatMessages?.length || limit === void 0 || isNaN(limit) || chatMessages.length < limit) return;
		for (let i = 0; i < chatMessages.length - limit; i++) chatMessages[i].remove();
	}
	function onChatMessage() {
		const limit = settings.custom[MODULE_ID$1];
		if (typeof limit === "number") cleanChat(limit);
		else if (typeof limit === "string" && limit.trim() !== "") cleanChat(parseInt(limit, 10));
	}
	/**
	* @type {import('./module').DubPlusModule}
	*/
	var chatCleaner = {
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
				if (val.includes(".") || isNaN(num) || num < 1) return t(`${MODULE_ID$1}.modal.validation`);
				return true;
			},
			onConfirm: (value) => {
				if (settings.options[MODULE_ID$1]) cleanChat(parseInt(value, 10));
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
	//#endregion
	//#region src/lib/stores/activeTabState.svelte.js
	var activeTabState = proxy({ isActive: true });
	var onOut = [];
	var onIn = [];
	document.addEventListener("visibilitychange", handleChange);
	window.onpageshow = handleChange;
	window.onpagehide = handleChange;
	window.onfocus = handleChange;
	window.onblur = handleChange;
	if (document.hidden !== void 0) handleChange({ type: document.hidden ? "blur" : "focus" });
	/**
	*
	* @param {Partial<PageTransitionEvent | FocusEvent>} evt
	*/
	function handleChange(evt) {
		if (activeTabState.isActive && (["blur", "pagehide"].includes(evt.type ?? "") || document.hidden)) {
			activeTabState.isActive = false;
			onOut.forEach((fn) => fn());
		} else if (!activeTabState.isActive && (["focus", "pageshow"].includes(evt.type ?? "") || !document.hidden)) {
			activeTabState.isActive = true;
			onIn.forEach((fn) => fn());
		}
	}
	/**
	*
	* @param {() => void} inHandler
	* @param {() => void} outHandler
	*/
	function registerVisibilityChangeListeners(inHandler, outHandler) {
		if (inHandler) onIn.push(inHandler);
		if (outHandler) onOut.push(outHandler);
	}
	/**
	*
	* @param {() => void} inHandler
	* @param {() => void} outHandler
	*/
	function unRegisterVisibilityChangeListeners(inHandler, outHandler) {
		if (inHandler) onIn.splice(onIn.indexOf(inHandler), 1);
		if (outHandler) onOut.splice(onOut.indexOf(outHandler), 1);
	}
	//#endregion
	//#region src/utils/notify.js
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
	/**
	*
	* @param {object} opts
	* @param {string} opts.title
	* @param {string} [opts.content]
	* @param {boolean} [opts.ignoreActiveTab]
	* @param {function|null} [opts.callback]
	* @param {number} [opts.wait]
	* @returns
	*/
	function showNotification(opts) {
		const options = {
			content: "",
			ignoreActiveTab: false,
			callback: null,
			wait: 1e4,
			...opts
		};
		if (activeTabState.isActive && !options.ignoreActiveTab) return;
		const notificationOptions = {
			body: options.content,
			icon: "https://cdn.jsdelivr.net/gh/DubPlus/DubPlus/images/dubplus.svg"
		};
		const n = new Notification(options.title, notificationOptions);
		n.onclick = function() {
			window.focus();
			if (typeof options.callback === "function") options.callback();
			n.close();
		};
		setTimeout(n.close.bind(n), options.wait);
	}
	//#endregion
	//#region src/lib/modules/mentionNotifications.js
	/**
	*
	* @param {import("../../events").ChatMessageEvent} e
	*/
	function notifyOnMention(e) {
		const content = e.message;
		let mentionTriggers = ["@" + window.QueUp.session.get("username").toLowerCase()];
		if (settings.options["custom-mentions"] && settings.custom["custom-mentions"]) {
			mentionTriggers = mentionTriggers.concat(settings.custom["custom-mentions"].split(",")).map((v) => v.trim());
			mentionTriggers = mentionTriggers.concat(mentionTriggers.map((v) => "@" + v));
		}
		if (new RegExp(`\\b(${mentionTriggers.join("|")})\\b`, "ig").test(content) && !activeTabState.isActive && window.QueUp.session.id !== e.user.userInfo.userid) showNotification({
			title: `Message from ${e.user.username}`,
			content
		});
	}
	/**
	* Mention Notifications
	* When a chat message comes in that contains a @mention to the user's username,
	* a browser notification will be triggered.
	* @type {import("./module").DubPlusModule}
	*/
	var mentionNotifications = {
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
	//#endregion
	//#region src/lib/modules/pmNotifications.js
	/**
	*
	* @param {import("../../events").NewMessageEvent} e
	* @returns
	*/
	function pmNotify(e) {
		if (window.QueUp.session.id === e.userid) return;
		showNotification({
			title: t("pm-notifications.notification.title"),
			ignoreActiveTab: true,
			callback: function() {
				getPrivateMessageButton()?.click();
				setTimeout(function() {
					getPrivateMessage(e.messageid)?.click();
				}, 500);
			},
			wait: 1e4
		});
	}
	/**
	* @type {import("./module").DubPlusModule}
	*/
	var pmNotifications = {
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
	//#endregion
	//#region src/lib/modules/djNotification.js
	var MODULE_ID = "dj-notification";
	/**
	* Sends a notification when the your position in the queue
	*
	* examples:
	* if you want to be notified when you're next you would use position 1.
	* if you want to be notified when you started playing you would use position 0.
	* @param {{ startTime: number }} [e]
	* @returns {void}
	*/
	function djNotificationCheck(e) {
		if (e && e.startTime > 2) return;
		setTimeout(() => {
			const quePositionText = getQueuePosition()?.textContent?.trim();
			if (!quePositionText) return;
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
			if (getQueueTotal()?.textContent?.trim() === quePositionText && parseSetting === 0 || position === parseSetting) {
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
	/**
	* @type {import("./module").DubPlusModule}
	*/
	var djNotification = {
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
				if (val.includes(".") || isNaN(num) || num < 0) return t(`${MODULE_ID}.modal.validation`);
				return true;
			},
			onConfirm: () => {
				if (settings.options[MODULE_ID]) djNotificationCheck();
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
	//#endregion
	//#region src/lib/stores/dubsState.svelte.js
	var dubsState = proxy({
		upDubs: [],
		downDubs: [],
		grabs: []
	});
	function getDubCount(dubType) {
		if (dubType === "updub") return dubsState.upDubs;
		if (dubType === "downdub") return dubsState.downDubs;
		if (dubType === "grab") return dubsState.grabs;
		return [];
	}
	//#endregion
	//#region src/lib/api.js
	/**
	* QueUp API wrappers
	*/
	var apiBase = window.location.hostname.includes("staging") ? "https://staging-api.queup.dev" : "https://api.queup.net";
	/**
	* @param {string} userid
	*/
	function userData(userid) {
		return `${apiBase}/user/${userid}`;
	}
	/**
	*
	* @param {string} roomId
	*/
	function activeDubs(roomId) {
		return `${apiBase}/room/${roomId}/playlist/active/dubs`;
	}
	/**
	* @param {string} userid
	*/
	function userImage(userid) {
		return `${apiBase}/user/${userid}/image`;
	}
	//#endregion
	//#region src/lib/modules/showDubsOnHover.js
	/**
	* @param {string} userid
	* @returns {Promise<string>}
	*/
	function getUserName(userid) {
		return new Promise((resolve, reject) => {
			const username = window.QueUp.room.users.collection.findWhere({ userid })?.attributes?._user?.username;
			if (username) {
				resolve(username);
				return;
			}
			fetch(userData(userid)).then((response) => response.json()).then((response) => {
				if (response?.userinfo?.username) {
					const { username } = response.userinfo;
					resolve(username);
				} else reject("Failed to get username from API for userid: " + userid);
			}).catch(reject);
		});
	}
	/**
	* @param {Array<{ userid: string}>} updubs
	*/
	function updateUpdubs(updubs) {
		updubs?.forEach((dub) => {
			if (dubsState.upDubs.find((el) => el.userid === dub.userid)) return;
			getUserName(dub.userid).then((username) => {
				dubsState.upDubs.push({
					userid: dub.userid,
					username
				});
			}).catch((error) => logError("Failed to get username for upDubs:", error));
		});
	}
	/**
	* @param {Array<{ userid: string}>} downdubs
	*/
	function updateDowndubs(downdubs) {
		downdubs?.forEach((dub) => {
			if (dubsState.downDubs.find((el) => el.userid === dub.userid)) return;
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
			if (isMod(window.QueUp.session.id)) updateDowndubs(response.data.downDubs);
		}).catch((error) => logError("Failed to fetch dubs data from API.", error));
	}
	/**
	* @param {import("../../events.js").DubEvent} e
	* @returns
	*/
	function dubWatcher(e) {
		if (e.dubtype === "updub") {
			if (!dubsState.upDubs.find((el) => el.userid === e.user._id)) dubsState.upDubs.push({
				userid: e.user._id,
				username: e.user.username
			});
			dubsState.downDubs = dubsState.downDubs.filter((el) => el.userid !== e.user._id);
		} else if (e.dubtype === "downdub" && isMod(window.QueUp.session.id)) {
			if (!dubsState.downDubs.find((el) => el.userid === e.user._id)) dubsState.downDubs.push({
				userid: e.user._id,
				username: e.user.username
			});
			dubsState.upDubs = dubsState.upDubs.filter((el) => el.userid !== e.user._id);
		}
		if (Date.now() - window.QueUp.room.player.activeSong.attributes.song.played < 1e3) return;
		if (dubsState.upDubs.length !== window.QueUp.room.player.activeSong.attributes.song.updubs) resetDubs();
		else if (isMod(window.QueUp.session.id) && dubsState.downDubs.length !== window.QueUp.room.player.activeSong.attributes.song.downdubs) resetDubs();
	}
	/**
	* @param {import("../../events.js").GrabEvent} e
	*/
	function grabWatcher(e) {
		if (!dubsState.grabs.find((el) => el.userid === e.user._id)) dubsState.grabs.push({
			userid: e.user._id,
			username: e.user.username
		});
	}
	/**
	* @param {import("../../events.js").UserLeaveEvent} e
	*/
	function dubUserLeaveWatcher(e) {
		dubsState.upDubs = dubsState.upDubs.filter((el) => el.userid !== e.user._id);
		dubsState.downDubs = dubsState.downDubs.filter((el) => el.userid !== e.user._id);
		dubsState.grabs = dubsState.grabs.filter((el) => el.userid !== e.user._id);
	}
	/**
	* @type {import("./module.js").DubPlusModule}
	*/
	var showDubsOnHover = {
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
	//#endregion
	//#region src/lib/modules/downDubInChat.js
	/**
	* Show downvotes in chat
	* only mods can use this
	*/
	/**
	* @param {{ dubtype: string, user: { username: string } }} e
	*/
	function downdubWatcher(e) {
		if (window.QueUp.session.id === window.QueUp.room.player.activeSong.attributes.song.userid && e.dubtype === "downdub") insertQueupChat("dubplus-chat-system-downdub", t("downdubs-in-chat.chat-message", {
			username: e.user.username,
			song_name: window.QueUp.room.player.activeSong.attributes.songInfo.name
		}));
	}
	var downdubsInChat = {
		id: "downdubs-in-chat",
		label: "downdubs-in-chat.label",
		description: "downdubs-in-chat.description",
		category: "general",
		modOnly: true,
		turnOn() {
			if (isMod(window.QueUp.session.id)) window.QueUp.Events.bind(DUB, downdubWatcher);
		},
		turnOff() {
			window.QueUp.Events.unbind(DUB, downdubWatcher);
		}
	};
	//#endregion
	//#region src/lib/modules/upDubInChat.js
	/**
	* Show downvotes in chat
	* only mods can use this
	*/
	/**
	*
	* @param {import('../../events').DubEvent} e
	*/
	function updubWatcher(e) {
		if (window.QueUp.session.id === window.QueUp.room.player.activeSong.attributes.song.userid && e.dubtype === "updub") insertQueupChat("dubplus-chat-system-updub", t("updubs-in-chat.chat-message", {
			username: e.user.username,
			song_name: window.QueUp.room.player.activeSong.attributes.songInfo.name
		}));
	}
	var upDubInChat = {
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
	//#endregion
	//#region src/lib/modules/grabsInChat.js
	/**
	* Show downvotes in chat
	* only mods can use this
	*/
	/**
	* @param {{ user: { username: string } }} e
	*/
	function grabChatWatcher(e) {
		if (window.QueUp.session.id === window.QueUp.room.player.activeSong.attributes.song.userid) insertQueupChat("dubplus-chat-system-grab", t("grabs-in-chat.chat-message", {
			username: e.user.username,
			song_name: window.QueUp.room.player.activeSong.attributes.songInfo.name
		}));
	}
	var grabsInChat = {
		id: "grabs-in-chat",
		label: "grabs-in-chat.label",
		description: "grabs-in-chat.description",
		category: "general",
		turnOn() {
			if (!window.QueUp.room.model.get("displayUserGrab")) window.QueUp.Events.bind("realtime:room_playlist-queue-update-grabs", grabChatWatcher);
		},
		turnOff() {
			if (!window.QueUp.room.model.get("displayUserGrab")) window.QueUp.Events.unbind("realtime:room_playlist-queue-update-grabs", grabChatWatcher);
		}
	};
	//#endregion
	//#region src/lib/modules/snow.js
	var snow = {
		id: "snow",
		label: "snow.label",
		description: "snow.description",
		category: "general",
		turnOn() {},
		turnOff() {}
	};
	//#endregion
	//#region src/lib/modules/rain.js
	/**
	* @typedef {Object} RainParticle
	* @property {number} speedX
	* @property {number} speedY
	* @property {number} X
	* @property {number} Y
	* @property {number} alpha
	* @property {string} color
	*/
	/**
	* @typedef {Object} RainDrop
	* @property {number} speedX
	* @property {number} speedY
	* @property {number} X
	* @property {number} Y
	* @property {number} radius
	* @property {number} alpha
	* @property {string} color
	*/
	var RainEffect = class {
		constructor() {
			/** @type {RainParticle[]} */
			this.particles = [];
			/** @type {RainDrop[]} */
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
			/** @type {((callback: FrameRequestCallback) => void) | null} */
			this.requestAnimFrame = null;
			/**
			* @type {HTMLCanvasElement | null}
			*/
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
			if (!this.canvas) return;
			this.width = this.canvas.width = window.innerWidth;
			this.height = this.canvas.height = window.innerHeight;
		}
		startAnimation() {
			const windowAnimFram = window.requestAnimationFrame;
			this.requestAnimFrame = windowAnimFram ? windowAnimFram.bind(window) : null;
			if (!this.canvas) return;
			const ctx = this.canvas.getContext("2d");
			if (!ctx) return;
			this.width, this.height = 0;
			this.onWindowResize();
			window.onresize = this.onWindowResize.bind(this);
			this.particles = [];
			this.drops = [];
			this.numbase = 5;
			this.numb = 2;
			let that = this;
			(function boucle() {
				that.requestAnimFrame?.(boucle);
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
			if (!num) num = this.numb;
			while (num--) this.particles.push({
				speedX: Math.random() * .25,
				speedY: Math.random() * 9 + 1,
				X,
				Y,
				alpha: 1,
				color: "hsla(" + this.controls.color + "," + this.controls.saturation + "%, " + this.controls.lightness + "%," + this.controls.opacity + ")"
			});
		}
		/**
		*
		* @param {number} X
		* @param {number} Y
		* @param {string} color
		* @param {number} [num]
		*/
		explosion(X, Y, color, num) {
			if (!num) num = this.numbase;
			while (num--) this.drops.push({
				speedX: Math.random() * 4 - 2,
				speedY: Math.random() * -4,
				X,
				Y,
				radius: .65 + Math.floor(Math.random() * 1.6),
				alpha: 1,
				color
			});
		}
		/**
		* @param {CanvasRenderingContext2D} ctx
		*/
		rendu(ctx) {
			if (this.controls.multi) this.controls.color = Math.random() * 360;
			ctx.save();
			ctx.clearRect(0, 0, this.width, this.height);
			const particleslocales = this.particles;
			const dropslocales = this.drops;
			const tau = Math.PI * 2;
			for (let i = 0, particlesactives; particlesactives = particleslocales[i]; i++) {
				ctx.globalAlpha = particlesactives.alpha;
				ctx.fillStyle = particlesactives.color;
				ctx.fillRect(particlesactives.X, particlesactives.Y, particlesactives.speedY / 4, particlesactives.speedY);
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
			for (let i = 0, particlesactives; particlesactives = particleslocales[i]; i++) {
				particlesactives.X += particlesactives.speedX;
				particlesactives.Y += particlesactives.speedY + 5;
				if (particlesactives.Y > this.height - 15) {
					particleslocales.splice(i--, 1);
					this.explosion(particlesactives.X, particlesactives.Y, particlesactives.color);
				}
			}
			for (let i = 0, dropsactives; dropsactives = dropslocales[i]; i++) {
				dropsactives.X += dropsactives.speedX;
				dropsactives.Y += dropsactives.speedY;
				dropsactives.radius -= .075;
				if (dropsactives.alpha > 0) dropsactives.alpha -= .005;
				else dropsactives.alpha = 0;
				if (dropsactives.radius < 0) dropslocales.splice(i--, 1);
			}
			let i = this.controls.rain;
			while (i--) this.buildRainParticle(Math.floor(Math.random() * this.width), -15);
		}
		stopAnimation() {
			this.requestAnimFrame = function() {};
		}
	};
	/**
	* @type {{
	*   id: string,
	*   label: string,
	*   description: string,
	*   category: string,
	*   rainEffect?: RainEffect,
	*   turnOn(): void,
	*   turnOff(): void,
	* }}
	*/
	var rain = {
		id: "rain",
		label: "rain.label",
		description: "rain.description",
		category: "general",
		turnOn() {
			this.rainEffect = new RainEffect();
			this.rainEffect.start();
		},
		turnOff() {
			this.rainEffect?.stop();
			delete this.rainEffect;
		}
	};
	//#endregion
	//#region src/lib/svg/IconFullscreen.svelte
	var root$13 = /* @__PURE__ */ from_svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M448 344v112a23.9 23.9 0 0 1 -24 24H312c-21.4 0-32.1-25.9-17-41l36.2-36.2L224 295.6 116.8 402.9 153 439c15.1 15.1 4.4 41-17 41H24a23.9 23.9 0 0 1 -24-24V344c0-21.4 25.9-32.1 41-17l36.2 36.2L184.5 256 77.2 148.7 41 185c-15.1 15.1-41 4.4-41-17V56a23.9 23.9 0 0 1 24-24h112c21.4 0 32.1 25.9 17 41l-36.2 36.2L224 216.4l107.2-107.3L295 73c-15.1-15.1-4.4-41 17-41h112a23.9 23.9 0 0 1 24 24v112c0 21.4-25.9 32.1-41 17l-36.2-36.2L263.5 256l107.3 107.3L407 327.1c15.1-15.2 41-4.5 41 16.9z"></path></svg>`);
	function IconFullscreen($$anchor) {
		append($$anchor, root$13());
	}
	//#endregion
	//#region src/lib/modules/fullscreen.js
	/**
	* Fullscreen video
	* Toggle fullscreen video mode
	*/
	/**
	* @type {import("./module").DubPlusModule}
	*/
	var fullscreen = {
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
			if (elem.requestFullscreen) elem.requestFullscreen();
			else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
			else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
			else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
		}
	};
	//#endregion
	//#region src/lib/modules/splitchat.js
	/**
	* Split Chat
	* Toggle Split chat mode
	*/
	/**
	* @type {import("./module").DubPlusModule}
	*/
	var splitChat = {
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
	//#endregion
	//#region src/lib/modules/hideChat.js
	/**
	* Hide the Chat box and only show the video
	*/
	/**
	* @type {import("./module").DubPlusModule}
	*/
	var hideChat = {
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
	//#endregion
	//#region src/lib/modules/hideVideo.js
	/**
	* @type {import("./module").DubPlusModule}
	*/
	var hideVideo = {
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
	//#endregion
	//#region src/lib/modules/hideAvatars.js
	/**
	* Hide Avatars
	* Toggle hiding user avatars in the chat box.
	* @type {import("./module").DubPlusModule}
	*/
	var hideAvatars = {
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
	//#endregion
	//#region src/lib/modules/hideBackground.js
	/**
	* Hide Background
	* toggle hiding background image
	*
	* @type {import("./module").DubPlusModule}
	*/
	var hideBackground = {
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
	//#endregion
	//#region src/lib/modules/showTimestamps.js
	/**
	* Show Timestamps
	* Toggle always showing chat message timestamps.
	* @type {import("./module").DubPlusModule}
	*/
	var showTimestamps = {
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
	//#endregion
	//#region src/lib/modules/spacebarMute.js
	/**
	* @param {KeyboardEvent} e
	*/
	function handleMute(e) {
		const tag = e.target.tagName.toLowerCase();
		if (e.key === " " && tag !== "input" && tag !== "textarea") window.QueUp.room.player.mutePlayer();
	}
	/**
	* Spacebar Mute
	* Turn on/off the ability to mute current song with the spacebar
	*
	* @type {import("./module").DubPlusModule}
	*/
	var spacebarMute = {
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
	//#endregion
	//#region src/lib/modules/warnOnNavigation.js
	/**
	* Warn on Navigation
	* Warns you when accidentally clicking on a link that takes you out of dubtrack
	*/
	/**
	* @param {BeforeUnloadEvent} e
	*/
	function unloader(e) {
		let confirmationMessage = "You are leaving";
		e.returnValue = confirmationMessage;
		return confirmationMessage;
	}
	/**
	* @type {import("./module").DubPlusModule}
	*/
	var warnOnNavigation = {
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
	var package_default = {
		name: "dubplus",
		version: "4.1.3",
		type: "module",
		description: "Dub+ - A simple script/extension for QueUp.net",
		main: "dubplus.js",
		engines: {
			"node": ">=24.0.0",
			"npm": ">=11.0.0"
		},
		scripts: {
			"clean": "rm -rf extension/dist",
			"build": "npm run clean && vite build && cd extension && web-ext build --filename dubplus-extension.zip --overwrite-dest --artifacts-dir ../dist",
			"ci:build": "eslint src && vite build",
			"watch": "vite build --watch",
			"firefox": "cd extension && web-ext run --start-url www.queup.net --watch-files dist/dubplus.js dist/dubplus.css",
			"prepare": "husky install",
			"prettier": "prettier --write .",
			"purge-cache": "node ./tasks/purge-cache.js",
			"zip-source": "npm run clean && rm -f dist/dubplus-source.zip && node ./tasks/zip.js",
			"addon-submit": "npm run zip-source && npm run ci:build && node --env-file .env ./tasks/ff-add-on-submit.js",
			"check": "svelte-check --tsconfig ./jsconfig.json"
		},
		repository: {
			"type": "git",
			"url": "git+https://github.com/DubPlus/DubPlus.git"
		},
		author: "DubPlus",
		license: "MIT",
		bugs: { "url": "https://github.com/DubPlus/DubPlus/issues" },
		homepage: "https://dub.plus",
		devDependencies: {
			"@babel/preset-env": "8.0.0",
			"@sveltejs/vite-plugin-svelte": "7.1.2",
			"@types/chrome": "0.1.43",
			"@types/node": "24.1.0",
			"eslint-plugin-svelte": "3.19.0",
			"globals": "17.6.0",
			"husky": "9.1.7",
			"lint-staged": "17.0.7",
			"prettier": "3.8.4",
			"prettier-plugin-svelte": "4.1.1",
			"svelte": "5.56.3",
			"svelte-check": "4.6.0",
			"vite": "8.0.16",
			"web-ext": "10.4.0"
		},
		browserslist: ["> 1%", "last 2 versions"],
		"lint-staged": {
			"{dubplus.js,dubplus.min.js,dubplus.css}": "node ./tasks/no-commit-build-files.js",
			"*.{js,svelte}": "eslint",
			"*.{js,svelte,css,ts,yml,yaml,md}": "prettier --list-different --write"
		}
	};
	//#endregion
	//#region src/utils/css.js
	var CDN_ROOT = "//cdn.jsdelivr.net/gh/DubPlus";
	/**
	* @param {string} className
	* @param {string} fileName
	* @returns
	*/
	var makeLink = function(className, fileName) {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.type = "text/css";
		link.className = className;
		link.href = fileName;
		return link;
	};
	/**
	* @param {string} cssFile    the css file location
	* @param {string} className  class name for element
	* @param {string} specificVersion indicates a specific version to load
	* @returns {Promise<void>}
	*/
	function link(cssFile, className, specificVersion = "") {
		cssFile = cssFile.replace(/^\//, "");
		return new Promise((resolve, reject) => {
			document.querySelector(`link.${className}`)?.remove();
			const cacheBuster = package_default.version;
			let cdnPath = "DubPlus";
			if (specificVersion) cdnPath += `@${specificVersion}`;
			const link = makeLink(className, `${CDN_ROOT}/${cdnPath}/${cssFile}?${cacheBuster}`);
			link.onload = () => resolve();
			link.onerror = reject;
			document.head.appendChild(link);
		});
	}
	/**
	* @param  {string} cssFile
	* @param  {string} id
	* @return {Promise<void>}
	*/
	function style(cssFile, id) {
		document.querySelector(`style#${id}`)?.remove();
		return fetch(cssFile).then((res) => res.text()).then((css) => {
			const style = document.createElement("style");
			style.id = id;
			style.textContent = css;
			document.head.appendChild(style);
		});
	}
	async function loadDubPlusCSSforBookmarklet() {
		let version = "";
		"master".trim();
		version = package_default.version;
		try {
			await link("/dubplus.css", "dubplus-css", version);
			return;
		} catch (e) {
			logError(`Failed to load dubplus.css at version @${version}`, e);
		}
		try {
			await link("/dubplus.css", "dubplus-css", "latest");
		} catch (e) {
			logError("Failed to load dubplus.css", e);
		}
	}
	//#endregion
	//#region src/lib/modules/communityTheme.js
	/**
	* Community Theme
	* Toggle Community CSS theme
	*
	* In order to use this feature the mods of the room need to add a link to the
	* css in the room description. The link should be formatted as follows:
	*
	* @dub+=https://example.com/style.css
	* or
	* @dubplus=https://example.com/style.css
	*
	* for backwards compatibility with dubx we're also checking
	* @dubx=https://example.com/style.css
	*/
	var LINK_ELEM_ID$1 = "dubplus-community-css";
	/**
	* @type {import("./module").DubPlusModule}
	*/
	var communityTheme = {
		id: "community-theme",
		label: "community-theme.label",
		description: "community-theme.description",
		category: "customize",
		turnOn() {
			const location = window.QueUp.room.model.get("roomUrl");
			fetch(`https://api.queup.net/room/${location}`).then((response) => response.json()).then((e) => {
				const content = e.data.description;
				const themeCheck = /* @__PURE__ */ new RegExp(/(@dub(x|plus|\+)=)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/, "i");
				let community = null;
				content.replace(
					themeCheck,
					/**
					* @param {string} match
					* @param {string} p1
					* @param {string} p2
					* @param {string} p3
					* @returns {string}
					*/
					function(match, p1, p2, p3) {
						community = p3;
						return match;
					}
				);
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
	//#endregion
	//#region src/lib/modules/customCSS.js
	/**
	* Custom CSS
	* Add custom CSS
	*/
	var LINK_ELEM_ID = "dubplus-user-custom-css";
	/**
	* Custom CSS
	* loads an external CSS file
	* @type {import("./module").DubPlusModule}
	*/
	var customCss = {
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
				if (!/^http.+\.css$/.test(value)) return t("custom-css.modal.validation");
				return true;
			},
			onConfirm(value) {
				if (!value) {
					document.getElementById(LINK_ELEM_ID)?.remove();
					settings.options[customCss.id] = false;
					return;
				} else style(value, LINK_ELEM_ID).catch((e) => {
					logError("Error loading custom css file:", e);
				});
			}
		},
		turnOn() {
			if (settings.custom[this.id]) style(settings.custom[this.id], LINK_ELEM_ID).catch((e) => {
				logError("Error loading custom css file:", e);
			});
		},
		turnOff() {
			document.getElementById(LINK_ELEM_ID)?.remove();
		}
	};
	//#endregion
	//#region src/lib/modules/customBackground.js
	/**
	* Custom Background
	* Add your own custom background
	*/
	/**
	*
	* @param {string} url
	*/
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
			const originalSrc = img.getAttribute("data-original") ?? "";
			if (originalSrc) img.src = originalSrc;
			else logError("customBackground", "removeCustomBG", "No original background image found");
			img.removeAttribute("data-original");
		}
	}
	/**
	* @type {import("./module").DubPlusModule}
	*/
	var customBackground = {
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
				if (!value.startsWith("http")) return t("custom-bg.modal.validation");
				return true;
			},
			onConfirm(value) {
				removeCustomBG();
				if (!value) return;
				addCustomBG(value);
			}
		},
		turnOn() {
			removeCustomBG();
			const savedCustomBG = settings.custom[this.id];
			if (savedCustomBG) addCustomBG(savedCustomBG);
		},
		turnOff() {
			removeCustomBG();
		}
	};
	//#endregion
	//#region src/lib/modules/customNotificationSound.js
	var DubtrackDefaultSound = "";
	/**
	* @type {import("./module").DubPlusModule}
	*/
	var customNotificationSound = {
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
				if (!window.soundManager.canPlayURL(value)) return t("custom-notification-sound.modal.validation");
				return true;
			},
			onConfirm(value) {
				if (!value) {
					window.QueUp.room.chat.mentionChatSound.url = DubtrackDefaultSound;
					settings.options[customNotificationSound.id] = false;
				} else window.QueUp.room.chat.mentionChatSound.url = value;
			}
		},
		turnOn() {
			DubtrackDefaultSound = window.QueUp.room.chat.mentionChatSound.url;
			if (settings.custom[this.id]) window.QueUp.room.chat.mentionChatSound.url = settings.custom[this.id];
		},
		turnOff() {
			window.QueUp.room.chat.mentionChatSound.url = DubtrackDefaultSound;
		}
	};
	//#endregion
	//#region src/lib/modules/flipInterface.js
	/**
	* Flip Interface
	*
	* This module allows you to swap the position of the chat and video elements.
	*/
	/**
	* @type {import("./module").DubPlusModule}
	*/
	var flipInterface = {
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
	//#endregion
	//#region src/lib/modules/auto-afk.js
	/** @type {ReturnType<typeof setTimeout> | null} */
	var timer = null;
	function onTimerExpired() {
		if (!settings.options.afk) {
			logInfo("auto-afk timer expired, enabling afk");
			document.querySelector("#dubplus-afk [role=switch]")?.click();
		} else logInfo("auto-afk timer expired, but afk is already enabled");
	}
	function onBlur() {
		let userTime = parseInt(settings.custom["auto-afk"], 10);
		if (isNaN(userTime)) userTime = 30;
		logInfo("auto-afk onBlur: starting timer for ", userTime, "minutes");
		timer = setTimeout(onTimerExpired, userTime * 60 * 1e3);
	}
	function onFocus() {
		if (timer) {
			logInfo("auto-afk onFocus: clearing timer");
			clearTimeout(timer);
			timer = null;
		} else logInfo("auto-afk onFocus: no timer to clear");
	}
	/**
	* Setup a timer that will automatically put you in AFK mode when you are
	* inactive for a certain amount of time (set by user). Inactivity is
	* determined by the window focus event.
	* @type {import("./module").DubPlusModule}
	*/
	var autoAfk = {
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
				if (value.includes(".") || isNaN(num) || num < 1) return t(`auto-afk.modal.validation`);
				return true;
			}
		}
	};
	//#endregion
	//#region src/lib/modules/grabResponse.js
	/**
	*
	* @param {import("../../events").GrabEvent} e
	*/
	function onGrab(e) {
		if (e.user._id === window.QueUp.session.id) {
			const message = settings.custom["grab-response"];
			if (message) sendChatMessage(message);
		}
	}
	/**
	* Grab Response
	*
	* Sends a chat message when you grab a song
	* @type {import("./module").DubPlusModule}
	*/
	var grabResponse = {
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
	//#endregion
	//#region src/lib/modules/collapsible-images.js
	var COLLAPSED = "dubplus-collapsed";
	var COLLAPSIBLE = "dubplus-collapsible-image";
	var COLLAPSER = "dubplus-collapser";
	var IMAGE_CONTAINER = "autolink-image";
	/**
	*
	* @param {HTMLButtonElement} button the button element we inserted into each
	* chat message near each image which will collapse/expand the image
	*/
	function handleCollapseButtonClick(button) {
		const imageContainer = button.parentElement;
		const image = imageContainer?.querySelector("img");
		if (!imageContainer || !image) return;
		if (!imageContainer.classList.contains(COLLAPSED)) {
			imageContainer.classList.add(COLLAPSED);
			button.title = "expand image";
			button.setAttribute("aria-label", "Expand image");
			image.setAttribute("aria-hidden", "true");
			button.setAttribute("aria-expanded", "false");
		} else {
			imageContainer.classList.remove(COLLAPSED);
			button.title = "collapse image";
			button.setAttribute("aria-label", "Collapse image");
			image.setAttribute("aria-hidden", "false");
			button.setAttribute("aria-expanded", "true");
		}
	}
	/**
	* This is the handler that should be attached to the chat container.
	* @param {Event} event
	*/
	function eventDelegatorHandler(event) {
		if (event.target instanceof HTMLButtonElement && event.target.classList.contains(COLLAPSER)) {
			event.stopPropagation();
			event.preventDefault();
			handleCollapseButtonClick(event.target);
		}
	}
	/**
	* @param {HTMLAnchorElement} [autolinkImage]
	*/
	function addCollapserToImage(autolinkImage) {
		if (!autolinkImage) return;
		if (!autolinkImage.classList.contains(COLLAPSIBLE)) {
			autolinkImage.classList.add(COLLAPSIBLE);
			const button = document.createElement("button");
			button.type = "button";
			button.title = "collapse image";
			button.setAttribute("aria-label", "Collapse image");
			button.setAttribute("aria-expanded", "true");
			button.classList.add(COLLAPSER);
			autolinkImage.appendChild(button);
		}
	}
	function processAllChatMessages() {
		getImagesInChat().forEach(addCollapserToImage);
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
	/**
	*
	* @param {Element} container
	* @returns {HTMLAnchorElement[]}
	*/
	function findUnProcessedImages(container) {
		const images = container.querySelectorAll(`.${IMAGE_CONTAINER}`);
		return Array.from(images).filter((el) => !el.classList.contains(COLLAPSIBLE));
	}
	/**
	*
	* @param {MutationRecord[]} mutations
	*/
	function observerCallback(mutations) {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) {
				if (node.nodeType !== Node.ELEMENT_NODE) continue;
				const el = node;
				if (el.classList.contains(IMAGE_CONTAINER) && !el.classList.contains(COLLAPSIBLE)) addCollapserToImage(el);
				findUnProcessedImages(el).forEach(addCollapserToImage);
			}
		}
	}
	/** @type {MutationObserver | null} */
	var observer = null;
	/**
	* Tracks whether the feature is currently enabled so that async setup scheduled
	* by waitFor() in turnOn() doesn't re-attach the observer/listener after
	* turnOff() has already torn everything down.
	* @type {boolean}
	*/
	var enabled = false;
	/**
	* @type {import("./module").DubPlusModule}
	*/
	var collapsibleImages = {
		id: "collapsible-images",
		label: "collapsible-images.label",
		description: "collapsible-images.description",
		category: "general",
		turnOn() {
			/**
			* When this feature is turned on we:
			*
			* 1. Add a MutationObserver to the chat container to detect new chat
			* messages. This works better than QueUp's chat-message event, which could
			* fire before the message was in the DOM (race condition), leaving new
			* messages without a collapse button.
			*
			* 2. Attach a single delegated click listener to the chat container so the
			* collapse buttons are easy to clean up when the feature is turned off.
			*
			* 3. Process any images already in chat.
			*
			* All of this waits for the chat container to exist, and the async callback
			* is guarded with `enabled` so toggling the feature off while we're still
			* waiting doesn't re-attach everything after turnOff() has already run.
			*/
			enabled = true;
			waitFor(() => Boolean(getChatContainer())).then(() => {
				if (!enabled) return;
				const chatContainer = getChatContainer();
				if (!chatContainer) {
					logError("Collapsible Images: No chat container found");
					return;
				}
				observer = new MutationObserver(observerCallback);
				chatContainer.addEventListener("click", eventDelegatorHandler);
				observer.observe(chatContainer, {
					childList: true,
					subtree: true,
					attributes: false
				});
				processAllChatMessages();
			}).catch(() => {
				logError("Collapsible Images: chat container never appeared.");
			});
		},
		turnOff() {
			enabled = false;
			if (observer) observer.disconnect();
			getChatContainer()?.removeEventListener("click", eventDelegatorHandler);
			reset();
		}
	};
	//#endregion
	//#region src/lib/svg/IconLeftRight.svelte
	var root$12 = /* @__PURE__ */ from_svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M504.3 273.6c4.9-4.5 7.7-10.9 7.7-17.6s-2.8-13-7.7-17.6l-112-104c-7-6.5-17.2-8.2-25.9-4.4s-14.4 12.5-14.4 22l0 56-192 0 0-56c0-9.5-5.7-18.2-14.4-22s-18.9-2.1-25.9 4.4l-112 104C2.8 243 0 249.3 0 256s2.8 13 7.7 17.6l112 104c7 6.5 17.2 8.2 25.9 4.4s14.4-12.5 14.4-22l0-56 192 0 0 56c0 9.5 5.7 18.2 14.4 22s18.9 2.1 25.9-4.4l112-104z"></path></svg>`);
	function IconLeftRight($$anchor) {
		append($$anchor, root$12());
	}
	//#endregion
	//#region src/lib/modules/pin-menu.js
	/**
	* Pin Menu
	*
	* This module allows you to pin the dubplus menu into
	* the UI so it is always visible. It will push over
	* the player and chat UI.
	*
	* The action button will toggle which side the menu is pinned to.
	* default is to the right side.
	*/
	/**
	* @type {import("./module").DubPlusModule}
	*/
	var pinMenu = {
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
				const side = (settings.custom[pinMenu.id] || "right") === "left" ? "right" : "left";
				document.body.classList.toggle("dubplus-pin-menu-left", side === "left");
				document.body.classList.toggle("dubplus-pin-menu-right", side === "right");
				saveSetting("custom", pinMenu.id, side);
			}
		}
	};
	//#endregion
	//#region src/lib/modules/index.js
	/**
	* @type {import("./module").DubPlusModule[]}
	*/
	var general = [
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
	/**
	* @type {import("./module").DubPlusModule[]}
	*/
	var userInterface = [
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
	/**
	* @type {import("./module").DubPlusModule[]}
	*/
	var settingsModules = [spacebarMute, warnOnNavigation];
	/**
	* @type {import("./module").DubPlusModule[]}
	*/
	var customize = [
		communityTheme,
		customCss,
		customBackground,
		customNotificationSound
	];
	//#endregion
	//#region src/lib/sections/General.svelte
	var root$11 = /* @__PURE__ */ from_html(`<!> <!>`, 1);
	function General($$anchor, $$props) {
		push($$props, false);
		init();
		var fragment = root$11();
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
		MenuSection(sibling(node, 2), {
			settingsId: "general",
			children: ($$anchor, $$slotProps) => {
				var fragment_1 = comment();
				each(first_child(fragment_1), 1, () => general, (module) => module.id, ($$anchor, module) => {
					MenuSwitch($$anchor, {
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
				append($$anchor, fragment_1);
			},
			$$slots: { default: true }
		});
		append($$anchor, fragment);
		pop();
	}
	//#endregion
	//#region src/lib/satellites/Eta.svelte
	var root$10 = /* @__PURE__ */ from_html(`<button id="dubplus-eta" type="button" class="icon-history eta_tooltip_t dubplus-btn-player"></button>`);
	function Eta($$anchor, $$props) {
		push($$props, true);
		let eta = /* @__PURE__ */ state("ETA");
		/**
		* @returns {string}
		*/
		function getEta() {
			const booth_position = getQueuePosition()?.textContent;
			if (!booth_position) return t("Eta.tooltip.notInQueue");
			const average_song_minutes = 4;
			const current_time = parseInt(getCurrentSongMinutes()?.textContent ?? "");
			const booth_time = parseInt(booth_position) * average_song_minutes - average_song_minutes + current_time;
			if (booth_time >= 0) return t("Eta.tootltip", { minutes: booth_time });
			else return t("Eta.tooltip.notInQueue");
		}
		var button = root$10();
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
	//#endregion
	//#region src/lib/satellites/Snooze.svelte
	var root$9 = /* @__PURE__ */ from_html(`<button id="dubplus-snooze" type="button" class="icon-mute snooze_btn dubplus-btn-player svelte-6crmqc"><span class="svelte-6crmqc">1</span></button>`);
	function Snooze($$anchor, $$props) {
		push($$props, true);
		let tooltip = /* @__PURE__ */ state(proxy(t("Snooze.tooltip")));
		/**
		* Snooze
		* Mutes audio for one song.
		*
		* This module is not a menu item. It is self-contained feature
		* that will always be automatically run on load.
		*/
		const eventUtils = {
			currentVol: 50,
			snoozed: false
		};
		function revert() {
			window.QueUp.room.player.setVolume(eventUtils.currentVol);
			window.QueUp.room.player.updateVolumeBar();
			eventUtils.snoozed = false;
			set(tooltip, t("Snooze.tooltip"), true);
			window.QueUp.Events.unbind(PLAYLIST_UPDATE, eventSongAdvance);
		}
		/**
		* Unmute when the song changes
		* @param {{startTime: number}} e
		* @returns
		*/
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
			} else if (eventUtils.snoozed) revert();
		}
		var button = root$9();
		action(button, ($$node, $$action_arg) => teleport?.($$node, $$action_arg), () => ({ to: PLAYER_SHARING_CONTAINER }));
		template_effect(() => {
			set_attribute(button, "aria-label", get(tooltip));
			set_attribute(button, "data-dp-tooltip", get(tooltip));
		});
		delegated("click", button, snooze);
		append($$anchor, button);
		pop();
	}
	delegate(["click"]);
	//#endregion
	//#region src/lib/emoji/EmojiPreview.svelte
	var root$8 = /* @__PURE__ */ from_html(`<li><div class="ac-image svelte-pc9dza"><img class="svelte-pc9dza"/></div></li>`);
	var root_1$2 = /* @__PURE__ */ from_html(`<div><div class="ac-header svelte-pc9dza"><span class="sr-only"> </span> <div class="tip-container" aria-hidden="true"><span class="tip-navigate"><key class="icon-upvote"></key> &amp; <key class="icon-downvote"></key> </span> <span class="tip-complete"><key>TAB</key> or <key>ENTER</key> </span> <span class="tip-close"><key>ESC</key> </span></div></div> <ul id="autocomplete-preview" class="svelte-pc9dza"></ul> <span class="ac-text-preview svelte-pc9dza"> </span></div>`);
	function EmojiPreview($$anchor, $$props) {
		push($$props, true);
		user_effect(() => {
			if (emojiState.emojiList.length > 0 && typeof emojiState.selectedIndex === "number") {
				const selected = document.querySelector(".preview-item.selected");
				if (selected) selected.scrollIntoView({
					block: "nearest",
					inline: "nearest",
					behavior: "smooth"
				});
			}
		});
		/**
		* @param {number} index
		*/
		function handleClick(index) {
			const inputEl = getChatInput();
			if (!inputEl) return;
			insertEmote(inputEl, index);
			inputEl.focus();
		}
		var div = root_1$2();
		let classes;
		var div_1 = child(div);
		var span = child(div_1);
		var text_1 = child(span, true);
		reset$2(span);
		var div_2 = sibling(span, 2);
		var span_1 = child(div_2);
		var text_2 = sibling(child(span_1), 3);
		reset$2(span_1);
		var span_2 = sibling(span_1, 2);
		var text_3 = sibling(child(span_2), 3);
		reset$2(span_2);
		var span_3 = sibling(span_2, 2);
		var text_4 = sibling(child(span_3));
		reset$2(span_3);
		reset$2(div_2);
		reset$2(div_1);
		var ul = sibling(div_1, 2);
		each(ul, 23, () => emojiState.emojiList, ({ src, text, platform, alt }) => src + platform, ($$anchor, $$item, i) => {
			let src = () => get($$item).src;
			let text = () => get($$item).text;
			let platform = () => get($$item).platform;
			let alt = () => get($$item).alt;
			var li = root$8();
			let classes_1;
			var div_3 = child(li);
			var img = child(div_3);
			reset$2(div_3);
			reset$2(li);
			template_effect(() => {
				classes_1 = set_class(li, 1, `preview-item ${platform()}-previews`, "svelte-pc9dza", classes_1, { selected: get(i) === emojiState.selectedIndex });
				set_attribute(li, "title", text());
				set_attribute(img, "src", src());
				set_attribute(img, "alt", alt());
				set_attribute(img, "title", alt());
			});
			delegated("click", li, () => handleClick(get(i)));
			append($$anchor, li);
		});
		reset$2(ul);
		var span_4 = sibling(ul, 2);
		var text_5 = child(span_4, true);
		reset$2(span_4);
		reset$2(div);
		action(div, ($$node, $$action_arg) => teleport?.($$node, $$action_arg), () => ({
			to: CHAT_INPUT_CONTAINER,
			position: "prepend"
		}));
		template_effect(($0, $1, $2, $3) => {
			classes = set_class(div, 1, "ac-preview-container svelte-pc9dza", null, classes, { "ac-show": emojiState.emojiList.length > 0 });
			set_text(text_1, $0);
			set_text(text_2, ` (${$1 ?? ""})`);
			set_text(text_3, ` (${$2 ?? ""})`);
			set_text(text_4, ` (${$3 ?? ""})`);
			set_text(text_5, emojiState.emojiList[emojiState.selectedIndex]?.text);
		}, [
			() => t("autocomplete.preview.a11y"),
			() => t("autocomplete.preview.navigate"),
			() => t("autocomplete.preview.select"),
			() => t("autocomplete.preview.close")
		]);
		append($$anchor, div);
		pop();
	}
	delegate(["click"]);
	//#endregion
	//#region src/lib/satellites/DubsInfo.svelte
	var root$7 = /* @__PURE__ */ from_html(`<li class="preview-dubinfo-item users-previews svelte-p3efhm"><div class="dubinfo-image svelte-p3efhm"><img alt="User Avatar" class="svelte-p3efhm"/></div> <button type="button" class="dubinfo-text svelte-p3efhm"> </button></li>`);
	var root_1$1 = /* @__PURE__ */ from_html(`<li><!></li>`);
	var root_2 = /* @__PURE__ */ from_html(`<div role="none"><ul id="dubinfo-preview"><!></ul></div>`);
	function DubsInfo($$anchor, $$props) {
		push($$props, true);
		/**
		* @typedef {object} DubsInfoProps
		* @property {"updub" | "downdub" | "grab"} dubType
		*/
		/**
		* @type {DubsInfoProps}
		*/
		let dubData = /* @__PURE__ */ user_derived(() => getDubCount($$props.dubType));
		let positionRight = /* @__PURE__ */ state(0);
		let positionBottom = /* @__PURE__ */ state(0);
		let display = /* @__PURE__ */ state("none");
		function getTarget() {
			if ($$props.dubType === "updub") return getDubUp()?.parentElement;
			else if ($$props.dubType === "downdub") return getDubDown()?.parentElement;
			else if ($$props.dubType === "grab") return getAddToPlaylist();
			return null;
		}
		function onHover() {
			const hoverTarget = getTarget();
			if (hoverTarget) {
				const rect = hoverTarget.getBoundingClientRect();
				set(positionRight, window.innerWidth - rect.right);
				set(positionBottom, rect.height - 2);
				set(display, "block");
			} else logError(`Could not find hover target for ${$$props.dubType} in onHover`);
		}
		/**
		* @param {MouseEvent} e
		*/
		function onLeave(e) {
			if (e.relatedTarget && e.relatedTarget.closest(".dubplus-dubs-container")) return;
			set(display, "none");
		}
		onMount(() => {
			const hoverTarget = getTarget();
			if (hoverTarget) {
				hoverTarget.addEventListener("mouseenter", onHover);
				hoverTarget.addEventListener("mouseleave", onLeave);
			} else logError(`Could not find hover target for ${$$props.dubType} in onMount`);
		});
		onDestroy(() => {
			const hoverTarget = getTarget();
			if (hoverTarget) {
				hoverTarget.removeEventListener("mouseenter", onHover);
				hoverTarget.removeEventListener("mouseleave", onLeave);
			} else logError(`Could not find hover target for ${$$props.dubType} in onDestroy`);
		});
		/**
		* @param {string} username
		*/
		function handleClick(username) {
			const chatInput = getChatInput();
			if (!chatInput) {
				logError("Chat input not found, can not insert username", { username });
				return;
			}
			chatInput.value = `${chatInput.value}@${username} `.trimStart();
			chatInput.focus();
		}
		var div = root_2();
		var ul = child(div);
		let classes;
		var node = child(ul);
		var consequent = ($$anchor) => {
			var fragment = comment();
			each(first_child(fragment), 17, () => get(dubData), (dub) => dub.userid, ($$anchor, dub) => {
				var li = root$7();
				var div_1 = child(li);
				var img = child(div_1);
				reset$2(div_1);
				var button = sibling(div_1, 2);
				var text = child(button);
				reset$2(button);
				reset$2(li);
				template_effect(($0) => {
					set_attribute(img, "src", $0);
					set_text(text, `@${get(dub).username ?? ""}`);
				}, [() => userImage(get(dub).userid)]);
				delegated("click", button, () => handleClick(get(dub).username));
				append($$anchor, li);
			});
			append($$anchor, fragment);
		};
		var alternate_1 = ($$anchor) => {
			var li_1 = root_1$1();
			var node_2 = child(li_1);
			var consequent_1 = ($$anchor) => {
				var text_1 = text();
				template_effect(($0) => set_text(text_1, $0), [() => t("dubs-hover.no-votes", { dubType: $$props.dubType })]);
				append($$anchor, text_1);
			};
			var alternate = ($$anchor) => {
				var text_2 = text();
				template_effect(($0) => set_text(text_2, $0), [() => t("dubs-hover.no-grabs", { dubType: $$props.dubType })]);
				append($$anchor, text_2);
			};
			if_block(node_2, ($$render) => {
				if ($$props.dubType === "updub" || $$props.dubType === "downdub") $$render(consequent_1);
				else $$render(alternate, -1);
			});
			reset$2(li_1);
			append($$anchor, li_1);
		};
		if_block(node, ($$render) => {
			if (get(dubData).length > 0) $$render(consequent);
			else $$render(alternate_1, -1);
		});
		reset$2(ul);
		reset$2(div);
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
	//#endregion
	//#region src/scripts/pure-snow.js
	var snowflakesCount = 200;
	var baseCSS = "";
	/**
	* We always want the snow to be full screen so this will always be 100vh
	*/
	var pageHeightVh = 100;
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
		if (!snowWrapper) return;
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
	/**
	*
	* @param {number} min
	* @param {number} max
	* @returns
	*/
	function randomIntRange(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	/**
	*
	* @param {number} min
	* @param {number} max
	* @returns
	*/
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
			let randomYoyoTime = getRandomArbitrary(.3, .8);
			let randomYoyoY = randomYoyoTime * pageHeightVh;
			let randomScale = Math.random();
			let fallDuration = randomIntRange(10, pageHeightVh / 10 * 3);
			let fallDelay = randomInt(pageHeightVh / 10 * 3) * -1;
			rule += `
      .${snowflakeName}:nth-child(${i}) {
        opacity: ${Math.random()};
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
	//#endregion
	//#region src/lib/satellites/Snow.svelte
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
	//#endregion
	//#region src/lib/menu/MenuAction.svelte
	var root$5 = /* @__PURE__ */ from_html(`<li class="svelte-1oc77ts"><button type="button" class="svelte-1oc77ts"><!> <span class="dubplus-menu-label svelte-1oc77ts"> </span></button></li>`);
	function MenuAction($$anchor, $$props) {
		push($$props, true);
		/**
		* @typedef {object} MenuActionProps
		* @property {string} id
		* @property {string} label
		* @property {string} description
		* @property {import('svelte').Component} icon An SVG as a .svelte component
		* @property {() => void} [onClick]
		* @property {() => void} [init]
		*/
		/**
		* @type {MenuActionProps}
		*/
		let onClick = prop($$props, "onClick", 3, () => {});
		onMount(() => {
			if ($$props.init) $$props.init();
		});
		var li = root$5();
		var button = child(li);
		var node = child(button);
		component(node, () => $$props.icon, ($$anchor, Icon_1) => {
			Icon_1($$anchor, {});
		});
		var span = sibling(node, 2);
		var text = child(span, true);
		reset$2(span);
		reset$2(button);
		reset$2(li);
		template_effect(($0, $1, $2) => {
			set_attribute(li, "id", $$props.id);
			set_attribute(li, "title", $0);
			set_attribute(button, "aria-label", $1);
			set_text(text, $2);
		}, [
			() => t($$props.description),
			() => t($$props.description),
			() => t($$props.label)
		]);
		delegated("click", button, function(...$$args) {
			onClick()?.apply(this, $$args);
		});
		append($$anchor, li);
		pop();
	}
	delegate(["click"]);
	//#endregion
	//#region src/lib/sections/UserInterface.svelte
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
		MenuSection(sibling(node, 2), {
			settingsId: "user-interface",
			children: ($$anchor, $$slotProps) => {
				var fragment_1 = comment();
				each(first_child(fragment_1), 1, () => userInterface, (module) => module.id, ($$anchor, module) => {
					var fragment_2 = comment();
					var node_3 = first_child(fragment_2);
					var consequent = ($$anchor) => {
						MenuAction($$anchor, {
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
					var alternate = ($$anchor) => {
						MenuSwitch($$anchor, {
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
						else $$render(alternate, -1);
					});
					append($$anchor, fragment_2);
				});
				append($$anchor, fragment_1);
			},
			$$slots: { default: true }
		});
		append($$anchor, fragment);
		pop();
	}
	//#endregion
	//#region src/lib/sections/Settings.svelte
	var $$_import_settings = reactive_import(() => settings);
	var root$3 = /* @__PURE__ */ from_html(`<!> <!>`, 1);
	function Settings($$anchor, $$props) {
		push($$props, false);
		settingsModules.forEach((module) => {
			if (!$$_import_settings().options[module.id]) $$_import_settings($$_import_settings().options[module.id] = false);
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
		MenuSection(sibling(node, 2), {
			settingsId: "settings",
			children: ($$anchor, $$slotProps) => {
				var fragment_1 = comment();
				each(first_child(fragment_1), 1, () => settingsModules, (module) => module.id, ($$anchor, module) => {
					MenuSwitch($$anchor, {
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
				append($$anchor, fragment_1);
			},
			$$slots: { default: true }
		});
		append($$anchor, fragment);
		pop();
	}
	//#endregion
	//#region src/lib/sections/Customize.svelte
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
		MenuSection(sibling(node, 2), {
			settingsId: "customize",
			children: ($$anchor, $$slotProps) => {
				var fragment_1 = comment();
				each(first_child(fragment_1), 1, () => customize, (module) => module.id, ($$anchor, module) => {
					MenuSwitch($$anchor, {
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
				append($$anchor, fragment_1);
			},
			$$slots: { default: true }
		});
		append($$anchor, fragment);
		pop();
	}
	//#endregion
	//#region src/lib/satellites/SnoozeVideo.svelte
	var root$1 = /* @__PURE__ */ from_html(`<button id="dubplus-snooze-video" type="button"><span class="svelte-1i1rq1b">1</span></button>`);
	function SnoozeVideo($$anchor, $$props) {
		push($$props, true);
		let icon = /* @__PURE__ */ state("icon-eye-blocked");
		let tooltip = /* @__PURE__ */ state(proxy(t("SnoozeVideo.tooltip")));
		/**
		* Snooze Video
		* Hides the video for the duration of the current song.
		*
		* This module is not a menu item. It is self-contained feature
		* that will always be automatically run on load.
		*/
		const SNOOZE_CLASS = "dubplus-snooze-video";
		function revert() {
			set(tooltip, t("SnoozeVideo.tooltip"), true);
			set(icon, "icon-eye-blocked");
			document.body.classList.remove(SNOOZE_CLASS);
			window.QueUp.Events.unbind(PLAYLIST_UPDATE, eventSongAdvance);
		}
		/**
		* Show the video again when the song changes
		* @param {{startTime: number}} e
		*/
		function eventSongAdvance(e) {
			if (e.startTime < 2) {
				revert();
				return true;
			}
		}
		/**
		* Hide the video
		*/
		function snooze() {
			if (!document.body.classList.contains(SNOOZE_CLASS)) {
				set(tooltip, t("SnoozeVideo.tooltip.undo"), true);
				set(icon, "icon-eye-unblocked");
				document.body.classList.add(SNOOZE_CLASS);
				window.QueUp.Events.bind(PLAYLIST_UPDATE, eventSongAdvance);
			} else revert();
		}
		var button = root$1();
		action(button, ($$node, $$action_arg) => teleport?.($$node, $$action_arg), () => ({ to: PLAYER_SHARING_CONTAINER }));
		template_effect(() => {
			set_class(button, 1, `${get(icon)} snooze-video-btn dubplus-btn-player`, "svelte-1i1rq1b");
			set_attribute(button, "aria-label", get(tooltip));
			set_attribute(button, "data-dp-tooltip", get(tooltip));
		});
		delegated("click", button, snooze);
		append($$anchor, button);
		pop();
	}
	delegate(["click"]);
	//#endregion
	//#region src/lib/menu/Menu.svelte
	var root = /* @__PURE__ */ from_html(`<!> <!> <!>`, 1);
	var root_1 = /* @__PURE__ */ from_html(`<!> <!> <!> <!> <!> <!> <!> <aside class="dubplus-menu svelte-mumrn2"><p class="dubplus-menu-header svelte-mumrn2"> <span class="version svelte-mumrn2"> </span></p> <!> <!> <!> <!> <!></aside> <!>`, 1);
	function Menu($$anchor, $$props) {
		push($$props, false);
		onMount(() => {
			document.querySelector("html")?.classList.add("dubplus");
		});
		init();
		var fragment = root_1();
		var node = first_child(fragment);
		Snooze(node, {});
		var node_1 = sibling(node, 2);
		MenuIcon(node_1, {});
		var node_2 = sibling(node_1, 2);
		Eta(node_2, {});
		var node_3 = sibling(node_2, 2);
		SnoozeVideo(node_3, {});
		var node_4 = sibling(node_3, 2);
		var consequent = ($$anchor) => {
			EmojiPreview($$anchor, {});
		};
		if_block(node_4, ($$render) => {
			if (settings.options.autocomplete) $$render(consequent);
		});
		var node_5 = sibling(node_4, 2);
		var consequent_1 = ($$anchor) => {
			var fragment_2 = root();
			var node_6 = first_child(fragment_2);
			DubsInfo(node_6, { dubType: "updub" });
			var node_7 = sibling(node_6, 2);
			DubsInfo(node_7, { dubType: "downdub" });
			DubsInfo(sibling(node_7, 2), { dubType: "grab" });
			append($$anchor, fragment_2);
		};
		if_block(node_5, ($$render) => {
			if (settings.options["dubs-hover"]) $$render(consequent_1);
		});
		var node_9 = sibling(node_5, 2);
		var consequent_2 = ($$anchor) => {
			Snow($$anchor, {});
		};
		if_block(node_9, ($$render) => {
			if (settings.options.snow) $$render(consequent_2);
		});
		var aside = sibling(node_9, 2);
		var p = child(aside);
		var text = child(p);
		var span = sibling(text);
		var text_1 = child(span);
		reset$2(span);
		reset$2(p);
		var node_10 = sibling(p, 2);
		General(node_10, {});
		var node_11 = sibling(node_10, 2);
		UserInterface(node_11, {});
		var node_12 = sibling(node_11, 2);
		Settings(node_12, {});
		var node_13 = sibling(node_12, 2);
		Customize(node_13, {});
		Contact(sibling(node_13, 2), {});
		reset$2(aside);
		Modal(sibling(aside, 2), {});
		template_effect(($0) => {
			set_text(text, `${$0 ?? ""} `);
			set_text(text_1, `v${package_default.version ?? ""}`);
		}, [() => t("Menu.title")]);
		append($$anchor, fragment);
		pop();
	}
	//#endregion
	//#region src/DubPlus.svelte
	function DubPlus($$anchor, $$props) {
		push($$props, true);
		window.dubplus = Object.assign(window.dubplus || {}, {
			name: package_default.name,
			version: package_default.version,
			description: package_default.description,
			license: package_default.license,
			homepage: package_default.homepage
		});
		/** @type {"loading" | "ready" | "loggedout" | "error"} */
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
			if (!window.QueUp?.session?.id) set(status, "loggedout");
			else set(status, "error");
		});
		/**
		* @param {string} content
		*/
		function showErrorModal(content) {
			modalState.title = t("Error.modal.title");
			modalState.content = content;
			modalState.open = true;
		}
		user_effect(() => {
			if (get(status) === "loggedout") showErrorModal(t("Error.modal.loggedout"));
			else if (get(status) === "error") showErrorModal(t("Error.unknown"));
		});
		var fragment = comment();
		var node = first_child(fragment);
		var consequent = ($$anchor) => {
			Loading($$anchor, {});
		};
		var consequent_1 = ($$anchor) => {
			Menu($$anchor, {});
		};
		var alternate = ($$anchor) => {
			Modal($$anchor, {});
		};
		if_block(node, ($$render) => {
			if (get(status) === "loading") $$render(consequent);
			else if (get(status) === "ready") $$render(consequent_1, 1);
			else $$render(alternate, -1);
		});
		append($$anchor, fragment);
		pop();
	}
	//#endregion
	//#region src/main.js
	var loadedAsExtension = "dubplusExtensionLoaded" in window;
	logInfo("loaded as extension:", loadedAsExtension);
	if (!loadedAsExtension) loadDubPlusCSSforBookmarklet();
	var container = document.getElementById("dubplus-container");
	if (!container) {
		container = document.createElement("div");
		container.id = "dubplus-container";
		document.body.appendChild(container);
	} else if (container.children.length > 0) {
		unmount(container);
		container.replaceChildren();
	}
	//#endregion
	return mount(DubPlus, { target: container });
})();
