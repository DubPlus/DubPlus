
/*
     /$$$$$$$            /$$                
    | $$__  $$          | $$          /$$   
    | $$  | $$ /$$   /$$| $$$$$$$    | $$   
    | $$  | $$| $$  | $$| $$__  $$ /$$$$$$$$
    | $$  | $$| $$  | $$| $$  | $$|__  $$__/
    | $$  | $$| $$  | $$| $$  | $$   | $$   
    | $$$$$$$/|  $$$$$$/| $$$$$$$/   |__/   
    |_______/  ______/ |_______/           
                                            
                                            
    https://github.com/DubPlus/DubPlus

    This source code is licensed under the MIT license 
    found here: https://github.com/DubPlus/DubPlus/blob/master/LICENSE

    Copyright (c) 2017-present DubPlus

    more info at https://dub.plus
*/
var DubPlus = (function () {
	'use strict';

	var VNode = function VNode() {};

	var options = {};

	var stack = [];

	var EMPTY_CHILDREN = [];

	function h(nodeName, attributes) {
		var children = EMPTY_CHILDREN,
		    lastSimple,
		    child,
		    simple,
		    i;
		for (i = arguments.length; i-- > 2;) {
			stack.push(arguments[i]);
		}
		if (attributes && attributes.children != null) {
			if (!stack.length) stack.push(attributes.children);
			delete attributes.children;
		}
		while (stack.length) {
			if ((child = stack.pop()) && child.pop !== undefined) {
				for (i = child.length; i--;) {
					stack.push(child[i]);
				}
			} else {
				if (typeof child === 'boolean') child = null;

				if (simple = typeof nodeName !== 'function') {
					if (child == null) child = '';else if (typeof child === 'number') child = String(child);else if (typeof child !== 'string') simple = false;
				}

				if (simple && lastSimple) {
					children[children.length - 1] += child;
				} else if (children === EMPTY_CHILDREN) {
					children = [child];
				} else {
					children.push(child);
				}

				lastSimple = simple;
			}
		}

		var p = new VNode();
		p.nodeName = nodeName;
		p.children = children;
		p.attributes = attributes == null ? undefined : attributes;
		p.key = attributes == null ? undefined : attributes.key;

		return p;
	}

	function extend(obj, props) {
	  for (var i in props) {
	    obj[i] = props[i];
	  }return obj;
	}

	var defer = typeof Promise == 'function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;

	var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

	var items = [];

	function enqueueRender(component) {
		if (!component._dirty && (component._dirty = true) && items.push(component) == 1) {
			(defer)(rerender);
		}
	}

	function rerender() {
		var p,
		    list = items;
		items = [];
		while (p = list.pop()) {
			if (p._dirty) renderComponent(p);
		}
	}

	function isSameNodeType(node, vnode, hydrating) {
		if (typeof vnode === 'string' || typeof vnode === 'number') {
			return node.splitText !== undefined;
		}
		if (typeof vnode.nodeName === 'string') {
			return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
		}
		return hydrating || node._componentConstructor === vnode.nodeName;
	}

	function isNamedNode(node, nodeName) {
		return node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
	}

	function getNodeProps(vnode) {
		var props = extend({}, vnode.attributes);
		props.children = vnode.children;

		var defaultProps = vnode.nodeName.defaultProps;
		if (defaultProps !== undefined) {
			for (var i in defaultProps) {
				if (props[i] === undefined) {
					props[i] = defaultProps[i];
				}
			}
		}

		return props;
	}

	function createNode(nodeName, isSvg) {
		var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
		node.normalizedNodeName = nodeName;
		return node;
	}

	function removeNode(node) {
		var parentNode = node.parentNode;
		if (parentNode) parentNode.removeChild(node);
	}

	function setAccessor(node, name, old, value, isSvg) {
		if (name === 'className') name = 'class';

		if (name === 'key') ; else if (name === 'ref') {
			if (old) old(null);
			if (value) value(node);
		} else if (name === 'class' && !isSvg) {
			node.className = value || '';
		} else if (name === 'style') {
			if (!value || typeof value === 'string' || typeof old === 'string') {
				node.style.cssText = value || '';
			}
			if (value && typeof value === 'object') {
				if (typeof old !== 'string') {
					for (var i in old) {
						if (!(i in value)) node.style[i] = '';
					}
				}
				for (var i in value) {
					node.style[i] = typeof value[i] === 'number' && IS_NON_DIMENSIONAL.test(i) === false ? value[i] + 'px' : value[i];
				}
			}
		} else if (name === 'dangerouslySetInnerHTML') {
			if (value) node.innerHTML = value.__html || '';
		} else if (name[0] == 'o' && name[1] == 'n') {
			var useCapture = name !== (name = name.replace(/Capture$/, ''));
			name = name.toLowerCase().substring(2);
			if (value) {
				if (!old) node.addEventListener(name, eventProxy, useCapture);
			} else {
				node.removeEventListener(name, eventProxy, useCapture);
			}
			(node._listeners || (node._listeners = {}))[name] = value;
		} else if (name !== 'list' && name !== 'type' && !isSvg && name in node) {
			try {
				node[name] = value == null ? '' : value;
			} catch (e) {}
			if ((value == null || value === false) && name != 'spellcheck') node.removeAttribute(name);
		} else {
			var ns = isSvg && name !== (name = name.replace(/^xlink:?/, ''));

			if (value == null || value === false) {
				if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());else node.removeAttribute(name);
			} else if (typeof value !== 'function') {
				if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value);else node.setAttribute(name, value);
			}
		}
	}

	function eventProxy(e) {
		return this._listeners[e.type](e);
	}

	var mounts = [];

	var diffLevel = 0;

	var isSvgMode = false;

	var hydrating = false;

	function flushMounts() {
		var c;
		while (c = mounts.pop()) {
			if (c.componentDidMount) c.componentDidMount();
		}
	}

	function diff(dom, vnode, context, mountAll, parent, componentRoot) {
		if (!diffLevel++) {
			isSvgMode = parent != null && parent.ownerSVGElement !== undefined;

			hydrating = dom != null && !('__preactattr_' in dom);
		}

		var ret = idiff(dom, vnode, context, mountAll, componentRoot);

		if (parent && ret.parentNode !== parent) parent.appendChild(ret);

		if (! --diffLevel) {
			hydrating = false;

			if (!componentRoot) flushMounts();
		}

		return ret;
	}

	function idiff(dom, vnode, context, mountAll, componentRoot) {
		var out = dom,
		    prevSvgMode = isSvgMode;

		if (vnode == null || typeof vnode === 'boolean') vnode = '';

		if (typeof vnode === 'string' || typeof vnode === 'number') {
			if (dom && dom.splitText !== undefined && dom.parentNode && (!dom._component || componentRoot)) {
				if (dom.nodeValue != vnode) {
					dom.nodeValue = vnode;
				}
			} else {
				out = document.createTextNode(vnode);
				if (dom) {
					if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
					recollectNodeTree(dom, true);
				}
			}

			out['__preactattr_'] = true;

			return out;
		}

		var vnodeName = vnode.nodeName;
		if (typeof vnodeName === 'function') {
			return buildComponentFromVNode(dom, vnode, context, mountAll);
		}

		isSvgMode = vnodeName === 'svg' ? true : vnodeName === 'foreignObject' ? false : isSvgMode;

		vnodeName = String(vnodeName);
		if (!dom || !isNamedNode(dom, vnodeName)) {
			out = createNode(vnodeName, isSvgMode);

			if (dom) {
				while (dom.firstChild) {
					out.appendChild(dom.firstChild);
				}
				if (dom.parentNode) dom.parentNode.replaceChild(out, dom);

				recollectNodeTree(dom, true);
			}
		}

		var fc = out.firstChild,
		    props = out['__preactattr_'],
		    vchildren = vnode.children;

		if (props == null) {
			props = out['__preactattr_'] = {};
			for (var a = out.attributes, i = a.length; i--;) {
				props[a[i].name] = a[i].value;
			}
		}

		if (!hydrating && vchildren && vchildren.length === 1 && typeof vchildren[0] === 'string' && fc != null && fc.splitText !== undefined && fc.nextSibling == null) {
			if (fc.nodeValue != vchildren[0]) {
				fc.nodeValue = vchildren[0];
			}
		} else if (vchildren && vchildren.length || fc != null) {
				innerDiffNode(out, vchildren, context, mountAll, hydrating || props.dangerouslySetInnerHTML != null);
			}

		diffAttributes(out, vnode.attributes, props);

		isSvgMode = prevSvgMode;

		return out;
	}

	function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
		var originalChildren = dom.childNodes,
		    children = [],
		    keyed = {},
		    keyedLen = 0,
		    min = 0,
		    len = originalChildren.length,
		    childrenLen = 0,
		    vlen = vchildren ? vchildren.length : 0,
		    j,
		    c,
		    f,
		    vchild,
		    child;

		if (len !== 0) {
			for (var i = 0; i < len; i++) {
				var _child = originalChildren[i],
				    props = _child['__preactattr_'],
				    key = vlen && props ? _child._component ? _child._component.__key : props.key : null;
				if (key != null) {
					keyedLen++;
					keyed[key] = _child;
				} else if (props || (_child.splitText !== undefined ? isHydrating ? _child.nodeValue.trim() : true : isHydrating)) {
					children[childrenLen++] = _child;
				}
			}
		}

		if (vlen !== 0) {
			for (var i = 0; i < vlen; i++) {
				vchild = vchildren[i];
				child = null;

				var key = vchild.key;
				if (key != null) {
					if (keyedLen && keyed[key] !== undefined) {
						child = keyed[key];
						keyed[key] = undefined;
						keyedLen--;
					}
				} else if (min < childrenLen) {
						for (j = min; j < childrenLen; j++) {
							if (children[j] !== undefined && isSameNodeType(c = children[j], vchild, isHydrating)) {
								child = c;
								children[j] = undefined;
								if (j === childrenLen - 1) childrenLen--;
								if (j === min) min++;
								break;
							}
						}
					}

				child = idiff(child, vchild, context, mountAll);

				f = originalChildren[i];
				if (child && child !== dom && child !== f) {
					if (f == null) {
						dom.appendChild(child);
					} else if (child === f.nextSibling) {
						removeNode(f);
					} else {
						dom.insertBefore(child, f);
					}
				}
			}
		}

		if (keyedLen) {
			for (var i in keyed) {
				if (keyed[i] !== undefined) recollectNodeTree(keyed[i], false);
			}
		}

		while (min <= childrenLen) {
			if ((child = children[childrenLen--]) !== undefined) recollectNodeTree(child, false);
		}
	}

	function recollectNodeTree(node, unmountOnly) {
		var component = node._component;
		if (component) {
			unmountComponent(component);
		} else {
			if (node['__preactattr_'] != null && node['__preactattr_'].ref) node['__preactattr_'].ref(null);

			if (unmountOnly === false || node['__preactattr_'] == null) {
				removeNode(node);
			}

			removeChildren(node);
		}
	}

	function removeChildren(node) {
		node = node.lastChild;
		while (node) {
			var next = node.previousSibling;
			recollectNodeTree(node, true);
			node = next;
		}
	}

	function diffAttributes(dom, attrs, old) {
		var name;

		for (name in old) {
			if (!(attrs && attrs[name] != null) && old[name] != null) {
				setAccessor(dom, name, old[name], old[name] = undefined, isSvgMode);
			}
		}

		for (name in attrs) {
			if (name !== 'children' && name !== 'innerHTML' && (!(name in old) || attrs[name] !== (name === 'value' || name === 'checked' ? dom[name] : old[name]))) {
				setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
			}
		}
	}

	var recyclerComponents = [];

	function createComponent(Ctor, props, context) {
		var inst,
		    i = recyclerComponents.length;

		if (Ctor.prototype && Ctor.prototype.render) {
			inst = new Ctor(props, context);
			Component.call(inst, props, context);
		} else {
			inst = new Component(props, context);
			inst.constructor = Ctor;
			inst.render = doRender;
		}

		while (i--) {
			if (recyclerComponents[i].constructor === Ctor) {
				inst.nextBase = recyclerComponents[i].nextBase;
				recyclerComponents.splice(i, 1);
				return inst;
			}
		}

		return inst;
	}

	function doRender(props, state, context) {
		return this.constructor(props, context);
	}

	function setComponentProps(component, props, renderMode, context, mountAll) {
		if (component._disable) return;
		component._disable = true;

		component.__ref = props.ref;
		component.__key = props.key;
		delete props.ref;
		delete props.key;

		if (typeof component.constructor.getDerivedStateFromProps === 'undefined') {
			if (!component.base || mountAll) {
				if (component.componentWillMount) component.componentWillMount();
			} else if (component.componentWillReceiveProps) {
				component.componentWillReceiveProps(props, context);
			}
		}

		if (context && context !== component.context) {
			if (!component.prevContext) component.prevContext = component.context;
			component.context = context;
		}

		if (!component.prevProps) component.prevProps = component.props;
		component.props = props;

		component._disable = false;

		if (renderMode !== 0) {
			if (renderMode === 1 || options.syncComponentUpdates !== false || !component.base) {
				renderComponent(component, 1, mountAll);
			} else {
				enqueueRender(component);
			}
		}

		if (component.__ref) component.__ref(component);
	}

	function renderComponent(component, renderMode, mountAll, isChild) {
		if (component._disable) return;

		var props = component.props,
		    state = component.state,
		    context = component.context,
		    previousProps = component.prevProps || props,
		    previousState = component.prevState || state,
		    previousContext = component.prevContext || context,
		    isUpdate = component.base,
		    nextBase = component.nextBase,
		    initialBase = isUpdate || nextBase,
		    initialChildComponent = component._component,
		    skip = false,
		    snapshot = previousContext,
		    rendered,
		    inst,
		    cbase;

		if (component.constructor.getDerivedStateFromProps) {
			state = extend(extend({}, state), component.constructor.getDerivedStateFromProps(props, state));
			component.state = state;
		}

		if (isUpdate) {
			component.props = previousProps;
			component.state = previousState;
			component.context = previousContext;
			if (renderMode !== 2 && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === false) {
				skip = true;
			} else if (component.componentWillUpdate) {
				component.componentWillUpdate(props, state, context);
			}
			component.props = props;
			component.state = state;
			component.context = context;
		}

		component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
		component._dirty = false;

		if (!skip) {
			rendered = component.render(props, state, context);

			if (component.getChildContext) {
				context = extend(extend({}, context), component.getChildContext());
			}

			if (isUpdate && component.getSnapshotBeforeUpdate) {
				snapshot = component.getSnapshotBeforeUpdate(previousProps, previousState);
			}

			var childComponent = rendered && rendered.nodeName,
			    toUnmount,
			    base;

			if (typeof childComponent === 'function') {

				var childProps = getNodeProps(rendered);
				inst = initialChildComponent;

				if (inst && inst.constructor === childComponent && childProps.key == inst.__key) {
					setComponentProps(inst, childProps, 1, context, false);
				} else {
					toUnmount = inst;

					component._component = inst = createComponent(childComponent, childProps, context);
					inst.nextBase = inst.nextBase || nextBase;
					inst._parentComponent = component;
					setComponentProps(inst, childProps, 0, context, false);
					renderComponent(inst, 1, mountAll, true);
				}

				base = inst.base;
			} else {
				cbase = initialBase;

				toUnmount = initialChildComponent;
				if (toUnmount) {
					cbase = component._component = null;
				}

				if (initialBase || renderMode === 1) {
					if (cbase) cbase._component = null;
					base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, true);
				}
			}

			if (initialBase && base !== initialBase && inst !== initialChildComponent) {
				var baseParent = initialBase.parentNode;
				if (baseParent && base !== baseParent) {
					baseParent.replaceChild(base, initialBase);

					if (!toUnmount) {
						initialBase._component = null;
						recollectNodeTree(initialBase, false);
					}
				}
			}

			if (toUnmount) {
				unmountComponent(toUnmount);
			}

			component.base = base;
			if (base && !isChild) {
				var componentRef = component,
				    t = component;
				while (t = t._parentComponent) {
					(componentRef = t).base = base;
				}
				base._component = componentRef;
				base._componentConstructor = componentRef.constructor;
			}
		}

		if (!isUpdate || mountAll) {
			mounts.unshift(component);
		} else if (!skip) {

			if (component.componentDidUpdate) {
				component.componentDidUpdate(previousProps, previousState, snapshot);
			}
		}

		while (component._renderCallbacks.length) {
			component._renderCallbacks.pop().call(component);
		}if (!diffLevel && !isChild) flushMounts();
	}

	function buildComponentFromVNode(dom, vnode, context, mountAll) {
		var c = dom && dom._component,
		    originalComponent = c,
		    oldDom = dom,
		    isDirectOwner = c && dom._componentConstructor === vnode.nodeName,
		    isOwner = isDirectOwner,
		    props = getNodeProps(vnode);
		while (c && !isOwner && (c = c._parentComponent)) {
			isOwner = c.constructor === vnode.nodeName;
		}

		if (c && isOwner && (!mountAll || c._component)) {
			setComponentProps(c, props, 3, context, mountAll);
			dom = c.base;
		} else {
			if (originalComponent && !isDirectOwner) {
				unmountComponent(originalComponent);
				dom = oldDom = null;
			}

			c = createComponent(vnode.nodeName, props, context);
			if (dom && !c.nextBase) {
				c.nextBase = dom;

				oldDom = null;
			}
			setComponentProps(c, props, 1, context, mountAll);
			dom = c.base;

			if (oldDom && dom !== oldDom) {
				oldDom._component = null;
				recollectNodeTree(oldDom, false);
			}
		}

		return dom;
	}

	function unmountComponent(component) {

		var base = component.base;

		component._disable = true;

		if (component.componentWillUnmount) component.componentWillUnmount();

		component.base = null;

		var inner = component._component;
		if (inner) {
			unmountComponent(inner);
		} else if (base) {
			if (base['__preactattr_'] && base['__preactattr_'].ref) base['__preactattr_'].ref(null);

			component.nextBase = base;

			removeNode(base);
			recyclerComponents.push(component);

			removeChildren(base);
		}

		if (component.__ref) component.__ref(null);
	}

	function Component(props, context) {
		this._dirty = true;

		this.context = context;

		this.props = props;

		this.state = this.state || {};

		this._renderCallbacks = [];
	}

	extend(Component.prototype, {
		setState: function setState(state, callback) {
			if (!this.prevState) this.prevState = this.state;
			this.state = extend(extend({}, this.state), typeof state === 'function' ? state(this.state, this.props) : state);
			if (callback) this._renderCallbacks.push(callback);
			enqueueRender(this);
		},
		forceUpdate: function forceUpdate(callback) {
			if (callback) this._renderCallbacks.push(callback);
			renderComponent(this, 2);
		},
		render: function render() {}
	});

	function render(vnode, parent, merge) {
	  return diff(merge, vnode, {}, false, parent, false);
	}

	var classCallCheck = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	var createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

	var inherits = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	};

	var possibleConstructorReturn = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && (typeof call === "object" || typeof call === "function") ? call : self;
	};

	/**
	 * Snooze
	 * Mutes audio for one song.
	 *
	 * This module is not a menu item, it is always automatically run on load
	 */

	/*global Dubtrack*/
	var eventUtils = {
	  currentVol: 50,
	  snoozed: false
	};

	var eventSongAdvance = function eventSongAdvance(e) {
	  if (e.startTime < 2) {
	    if (eventUtils.snoozed) {
	      Dubtrack.room.player.setVolume(eventUtils.currentVol);
	      eventUtils.snoozed = false;
	    }
	    return true;
	  }
	};

	var snooze = function snooze() {
	  if (!eventUtils.snoozed && !Dubtrack.room.player.muted_player && Dubtrack.playerController.volume > 2) {
	    eventUtils.currentVol = Dubtrack.playerController.volume;
	    Dubtrack.room.player.mutePlayer();
	    eventUtils.snoozed = true;
	    Dubtrack.Events.bind("realtime:room_playlist-update", eventSongAdvance);
	  } else if (eventUtils.snoozed) {
	    Dubtrack.room.player.setVolume(eventUtils.currentVol);
	    Dubtrack.room.player.updateVolumeBar();
	    eventUtils.snoozed = false;
	  }
	};

	var css = {
	  position: 'absolute',
	  font: '1rem/1.5 proxima-nova,sans-serif',
	  display: 'block',
	  left: '-33px',
	  cursor: 'pointer',
	  borderRadius: '1.5rem',
	  padding: '8px 16px',
	  background: '#fff',
	  fontWeight: '700',
	  fontSize: '13.6px',
	  textTransform: 'uppercase',
	  color: '#000',
	  opacity: '0.8',
	  textAlign: 'center',
	  zIndex: '9'
	};

	var Snooze = function (_Component) {
	  inherits(Snooze, _Component);

	  function Snooze() {
	    var _ref;

	    var _temp, _this, _ret;

	    classCallCheck(this, Snooze);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = Snooze.__proto__ || Object.getPrototypeOf(Snooze)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
	      show: false
	    }, _this.showTooltip = function () {
	      _this.setState({ show: true });
	    }, _this.hideTooltip = function () {
	      _this.setState({ show: false });
	    }, _temp), possibleConstructorReturn(_this, _ret);
	  }

	  createClass(Snooze, [{
	    key: 'render',
	    value: function render$$1(props, state) {
	      return h(
	        'span',
	        { className: 'icon-mute snooze_btn',
	          onClick: snooze,
	          onMouseOver: this.showTooltip,
	          onMouseOut: this.hideTooltip },
	        state.show && h(
	          'div',
	          { className: 'snooze_tooltip', style: css },
	          'Mute current song'
	        )
	      );
	    }
	  }]);
	  return Snooze;
	}(Component);

	function snooze$1 () {
	  render(h(Snooze, null), document.querySelector('.player_sharing'));
	}

	/**
	 * ETA
	 *
	 * This module is not a menu item, it is run once on load
	 */

	var css$1 = {
	  position: 'absolute',
	  font: '1rem/1.5 proxima-nova,sans-serif',
	  display: 'block',
	  left: '-33px',
	  cursor: 'pointer',
	  borderRadius: '1.5rem',
	  padding: '8px 16px',
	  background: '#fff',
	  fontWeight: '700',
	  fontSize: '13.6px',
	  textTransform: 'uppercase',
	  color: '#000',
	  opacity: '0.8',
	  textAlign: 'center',
	  zIndex: '9'
	};

	var ETA = function (_Component) {
	  inherits(ETA, _Component);

	  function ETA() {
	    var _ref;

	    var _temp, _this, _ret;

	    classCallCheck(this, ETA);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = ETA.__proto__ || Object.getPrototypeOf(ETA)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
	      show: false,
	      booth_time: ''
	    }, _this.showTooltip = function () {
	      var tooltipText = _this.getEta();
	      _this.setState({
	        show: true,
	        booth_time: tooltipText
	      });
	    }, _this.hideTooltip = function () {
	      _this.setState({ show: false });
	    }, _temp), possibleConstructorReturn(_this, _ret);
	  }

	  createClass(ETA, [{
	    key: 'getEta',
	    value: function getEta() {
	      var time = 4;
	      var current_time = parseInt(document.querySelector('#player-controller div.left ul li.infoContainer.display-block div.currentTime span.min').textContent);
	      var booth_duration = parseInt(document.querySelector('.queue-position').textContent);
	      var booth_time = booth_duration * time - time + current_time;
	      return booth_time >= 0 ? booth_time : 'You\'re not in the queue';
	    }
	  }, {
	    key: 'render',
	    value: function render$$1(props, state) {
	      return h(
	        'span',
	        { className: 'icon-history eta_tooltip_t',
	          onMouseOver: this.showTooltip,
	          onMouseOut: this.hideTooltip },
	        this.state.show && h(
	          'span',
	          { className: 'eta_tooltip', style: css$1 },
	          this.state.booth_time
	        )
	      );
	    }
	  }]);
	  return ETA;
	}(Component);

	function eta () {
	  render(h(ETA, null), document.querySelector('.player_sharing'));
	}

	function SectionHeader(props) {
	  return h(
	    "div",
	    { id: props.id, className: "dubplus-menu-section-header" },
	    h("span", { className: "fa fa-angle-" + props.arrow }),
	    h(
	      "p",
	      null,
	      props.category
	    )
	  );
	}

	/**
	 * global State handler
	 */

	var defaults$1 = {
	  "menu": {
	    "general": "open",
	    "user-interface": "open",
	    "settings": "open",
	    "customize": "open",
	    "contact": "open"
	  },

	  "options": {
	    "dubplus-autovote": false,
	    "dubplus-emotes": false,
	    "dubplus-autocomplete": false,
	    "mention_notifications": false,
	    "dubplus_pm_notifications": false,
	    "dj-notification": false,
	    "dubplus-dubs-hover": false,
	    "dubplus-downdubs": false,
	    "dubplus-grabschat": false,
	    "dubplus-split-chat": false,
	    "dubplus-show-timestamp": false,
	    "dubplus-hide-bg": false,
	    "dubplus-hide-avatars": false,
	    "dubplus-chat-only": false,
	    "dubplus-video-only": false,
	    "warn_redirect": false,
	    "dubplus-comm-theme": false,
	    "dubplus-afk": false,
	    "dubplus-snow": false,
	    "dubplus-custom-css": false
	  },

	  "custom": {
	    "customAfkMessage": "",
	    "dj_notification": 1,
	    "css": ""
	  }
	};

	var UserSettings = function () {
	  function UserSettings() {
	    classCallCheck(this, UserSettings);
	    this.srcRoot = "https://rawgit.com/FranciscoG/DubPlus/preact-version";

	    var _savedSettings = localStorage.getItem('dubplusUserSettings');
	    if (_savedSettings) {
	      try {
	        var storedOpts = JSON.parse(_savedSettings);
	        this.stored = Object.assign({}, defaults$1, storedOpts);
	      } catch (err) {
	        this.stored = defaults$1;
	      }
	    } else {
	      this.stored = defaults$1;
	    }
	  }

	  /**
	   * Save your settings value to memory and localStorage
	   * @param {String} type The section of the stored values. i.e. "menu", "options", "custom"
	   * @param {String} optionName the key name of the option to store
	   * @param {String|Boolean} value the new setting value to store
	   */


	  createClass(UserSettings, [{
	    key: "save",
	    value: function save(type, optionName, value) {
	      this.stored[type][optionName] = value;
	      try {
	        localStorage.setItem('dubplusUserSettings', JSON.stringify(this.stored));
	      } catch (err) {
	        console.error("an error occured saving dubplus to localStorage", err);
	      }
	    }
	  }]);
	  return UserSettings;
	}();

	var userSettings = new UserSettings();

	/**
	 * Modal used to display messages and also capture data
	 * 
	 * @prop  {string} title       title that shows at the top of the modal
	 * @prop  {string} content     A descriptive message on what the modal is for
	 * @prop  {string} placeholder placeholder for the textarea
	 * @prop  {function} onConfirm  runs when user clicks confirm button.
	 * @prop  {function} onClose  runs when user clicks close button
	 * @prop  {number} maxlength   for the textarea maxlength attribute
	 */

	var Modal = function (_Component) {
	  inherits(Modal, _Component);

	  function Modal() {
	    var _ref;

	    var _temp, _this, _ret;

	    classCallCheck(this, Modal);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = Modal.__proto__ || Object.getPrototypeOf(Modal)).call.apply(_ref, [this].concat(args))), _this), _this.keyUpHandler = function (e) {
	      // save and close when user presses enter
	      // considering removing this though
	      if (e.keyCode === 13) {
	        _this.props.onConfirm(_this.textarea.value);
	        _this.props.onClose();
	      }
	      // close modal when user hits the esc key
	      if (e.keyCode === 27) {
	        _this.props.onClose();
	      }
	    }, _this.confirmClick = function () {
	      _this.props.onConfirm(_this.textarea.value);
	      _this.props.onClose();
	    }, _temp), possibleConstructorReturn(_this, _ret);
	  }

	  createClass(Modal, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      document.addEventListener('keyup', this.keyUpHandler);
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      document.removeEventListener('keyup', this.keyUpHandler);
	    }
	  }, {
	    key: 'render',
	    value: function render$$1(props, state) {
	      var _this2 = this;

	      var closeButtonText = !props.onConfirm ? 'close' : 'cancel';

	      return h(
	        'div',
	        { className: 'dp-modal' },
	        h(
	          'aside',
	          { className: 'container' },
	          h(
	            'div',
	            { className: 'title' },
	            h(
	              'h1',
	              null,
	              ' ',
	              props.title || 'Dub+'
	            )
	          ),
	          h(
	            'div',
	            { className: 'content' },
	            h(
	              'p',
	              null,
	              props.content || ''
	            ),
	            props.placeholder && h(
	              'textarea',
	              {
	                ref: function ref(c) {
	                  return _this2.textarea = c;
	                },
	                placeholder: props.placeholder, maxlength: props.maxlength || 999 },
	              props.value || ''
	            )
	          ),
	          h(
	            'div',
	            { className: 'dp-modal-buttons' },
	            h(
	              'button',
	              { id: 'dp-modal-cancel', onClick: props.onClose },
	              closeButtonText
	            ),
	            props.onConfirm && h(
	              'button',
	              { id: 'dp-modal-confirm', onClick: this.confirmClick },
	              'okay'
	            )
	          )
	        )
	      );
	    }
	  }]);
	  return Modal;
	}(Component);

	/**
	 * Class wrapper for Google Analytics
	 */

	// shim just in case blocked by an adblocker or something
	var ga = window.ga || function () {};

	var GA = function () {
	  function GA(uid) {
	    classCallCheck(this, GA);

	    ga('create', uid, 'auto', 'dubplusTracker');
	  }

	  // https://developers.google.com/analytics/devguides/collection/analyticsjs/events


	  createClass(GA, [{
	    key: 'event',
	    value: function event(eventCategory, eventAction, eventLabel, eventValue) {
	      ga('dubplusTracker.send', 'event', eventCategory, eventAction, eventLabel, eventValue);
	    }

	    /**
	     * Use this method to track clicking on a menu item
	     * @param {String} menuSection The menu section's title will be used for the event Category
	     * @param {String} menuItem The ID of the menu item will be used for the event label
	     * @param {Number} [onOff] optional - should be 1 or 0 representing on or off state of the menu item
	     */

	  }, {
	    key: 'menuClick',
	    value: function menuClick(menuSection, menuItem, onOff) {
	      this.event(menuSection, 'click', menuItem, onOff);
	    }
	  }]);
	  return GA;
	}();

	var track = new GA('UA-116652541-1');

	var Portal = require('preact-portal');

	/**
	 * Component which brings up a modal box to allow user to
	 * input and store a text value which will be used by the
	 * parent menu item.
	 *
	 * MenuPencil must always by a child of MenuSwitch.
	 */
	var MenuPencil = function (_Component) {
	  inherits(MenuPencil, _Component);

	  function MenuPencil() {
	    var _ref;

	    var _temp, _this, _ret;

	    classCallCheck(this, MenuPencil);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = MenuPencil.__proto__ || Object.getPrototypeOf(MenuPencil)).call.apply(_ref, [this].concat(args))), _this), _this.loadModal = function () {
	      _this.setState({ open: true });
	      track.menuClick(_this.props.section + ' section', _this.props.id + ' edit');
	    }, _this.closeModal = function () {
	      _this.setState({ open: false });
	    }, _temp), possibleConstructorReturn(_this, _ret);
	  }

	  createClass(MenuPencil, [{
	    key: 'render',
	    value: function render$$1(props, _ref2) {
	      var open = _ref2.open;

	      return h(
	        'span',
	        { onClick: this.loadModal, className: 'fa fa-pencil extra-icon' },
	        open ? h(
	          Portal,
	          { into: 'body' },
	          h(Modal, { title: props.title || 'Dub+ option',
	            content: props.content || 'Please enter a value',
	            placeholder: props.placeholder || 'in here',
	            value: props.value,
	            onConfirm: props.onConfirm,
	            onClose: this.closeModal })
	        ) : null
	      );
	    }
	  }]);
	  return MenuPencil;
	}(Component);

	var MenuSwitch = function (_Component2) {
	  inherits(MenuSwitch, _Component2);

	  function MenuSwitch() {
	    var _ref3;

	    var _temp2, _this2, _ret2;

	    classCallCheck(this, MenuSwitch);

	    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	      args[_key2] = arguments[_key2];
	    }

	    return _ret2 = (_temp2 = (_this2 = possibleConstructorReturn(this, (_ref3 = MenuSwitch.__proto__ || Object.getPrototypeOf(MenuSwitch)).call.apply(_ref3, [this].concat(args))), _this2), _this2.state = {
	      on: userSettings.stored.options[_this2.props.id] || false
	    }, _this2.switchOn = function () {
	      _this2.props.turnOn();
	      userSettings.save('options', _this2.props.id, true);
	      _this2.setState({ on: true });
	      track.menuClick(_this2.props.section + ' section', _this2.props.id + ' on');
	    }, _this2.switchOff = function () {
	      _this2.props.turnOff();
	      userSettings.save('options', _this2.props.id, false);
	      _this2.setState({ on: false });
	      track.menuClick(_this2.props.section + ' section', _this2.props.id + ' off');
	    }, _this2.toggleSwitch = function () {
	      if (_this2.state.on) {
	        _this2.switchOff();
	      } else {
	        _this2.switchOn();
	      }
	    }, _temp2), possibleConstructorReturn(_this2, _ret2);
	  }

	  createClass(MenuSwitch, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      if (this.state.on) {
	        this.props.turnOn();
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render$$1(props, state) {
	      var _cn = ["dubplus-switch"];
	      if (state.on) {
	        _cn.push('dubplus-switch-on');
	      }
	      // combine with ones that were passed through
	      if (props.className) {
	        _cn.push(props.className);
	      }

	      return h(
	        'li',
	        { id: props.id,
	          title: props.desc,
	          className: _cn.join(' ') },
	        props.children || [],
	        h(
	          'div',
	          { onClick: this.toggleSwitch, className: 'dubplus-form-control' },
	          h(
	            'div',
	            { 'class': 'dubplus-switch-bg' },
	            h('div', { 'class': 'dubplus-switcher' })
	          ),
	          h(
	            'span',
	            { className: 'dubplus-menu-label' },
	            props.menuTitle
	          )
	        )
	      );
	    }
	  }]);
	  return MenuSwitch;
	}(Component);

	/**
	 * 
	 * Away From Keyboard autoresponder
	 * 
	 * TODO: setup global state manager
	 */

	var AFK = function (_Component) {
	  inherits(AFK, _Component);

	  function AFK() {
	    var _ref;

	    var _temp, _this, _ret;

	    classCallCheck(this, AFK);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = AFK.__proto__ || Object.getPrototypeOf(AFK)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
	      canSend: true
	    }, _this.afk_chat_respond = function (e) {
	      if (!_this.state.canSend) {
	        return; // do nothing until it's back to true
	      }
	      var content = e.message;
	      var user = Dubtrack.session.get('username');

	      if (content.indexOf('@' + user) > -1 && Dubtrack.session.id !== e.user.userInfo.userid) {
	        var chatInput = document.getElementById('chat-txt-message');
	        if (userSettings.stored.custom.customAfkMessage) {
	          chatInput.value = '[AFK] ' + userSettings.stored.custom.customAfkMessage;
	        } else {
	          chatInput.value = "[AFK] I'm not here right now.";
	        }

	        Dubtrack.room.chat.sendMessage();

	        // so we don't spam chat, we pause the auto respond for 30sec
	        _this.setState({ canSend: false });

	        // allow AFK responses after 30sec
	        setTimeout(function () {
	          _this.setState({ canSend: true });
	        }, 30000);
	      }
	    }, _temp), possibleConstructorReturn(_this, _ret);
	  }

	  createClass(AFK, [{
	    key: 'turnOn',
	    value: function turnOn() {
	      Dubtrack.Events.bind("realtime:chat-message", this.afk_chat_respond);
	    }
	  }, {
	    key: 'turnOff',
	    value: function turnOff() {
	      Dubtrack.Events.unbind("realtime:chat-message", this.afk_chat_respond);
	    }
	  }, {
	    key: 'saveAFKmessage',
	    value: function saveAFKmessage(val) {
	      if (val !== '') {
	        // TODO: save to global state
	        userSettings.save('custom', 'customAfkMessage', val);
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render$$1(props, state) {
	      return h(
	        MenuSwitch,
	        {
	          id: 'dubplus-afk',
	          section: 'General',
	          menuTitle: 'AFK Auto-respond',
	          desc: 'Toggle Away from Keyboard and customize AFK message.',
	          turnOn: this.turnOn,
	          turnOff: this.turnOff },
	        h(MenuPencil, {
	          title: 'Custom AFK Message',
	          section: 'General',
	          content: 'Enter a custom Away From Keyboard [AFK] message here',
	          value: userSettings.stored.custom.customAfkMessage || '',
	          placeholder: 'Be right back!',
	          maxlength: '255',
	          onConfirm: this.saveAFKmessage })
	      );
	    }
	  }]);
	  return AFK;
	}(Component);

	/**
	 * Menu item for Autovote
	 */

	var Autovote = function (_Component) {
	  inherits(Autovote, _Component);

	  function Autovote() {
	    classCallCheck(this, Autovote);

	    var _this = possibleConstructorReturn(this, (Autovote.__proto__ || Object.getPrototypeOf(Autovote)).call(this));

	    _this.advance_vote = function () {
	      var event = document.createEvent('HTMLEvents');
	      event.initEvent('click', true, false);
	      _this.dubup.dispatchEvent(event);
	    };

	    _this.voteCheck = function (obj) {
	      if (obj.startTime < 2) {
	        _this.advance_vote();
	      }
	    };

	    _this.turnOn = function (e) {
	      var song = Dubtrack.room.player.activeSong.get('song');
	      var dubCookie = Dubtrack.helpers.cookie.get('dub-' + Dubtrack.room.model.get("_id"));
	      var dubsong = Dubtrack.helpers.cookie.get('dub-song');

	      if (!Dubtrack.room || !song || song.songid !== dubsong) {
	        dubCookie = false;
	      }

	      // Only cast the vote if user hasn't already voted
	      if (!_this.dubup.classList.contains('voted') && !_this.dubdown.classList.contains('voted') && !dubCookie) {
	        _this.advance_vote();
	      }

	      Dubtrack.Events.bind("realtime:room_playlist-update", _this.voteCheck);
	    };

	    _this.turnOff = function (e) {
	      Dubtrack.Events.unbind("realtime:room_playlist-update", _this.voteCheck);
	    };

	    _this.dubup = document.querySelector('.dubup');
	    _this.dubdown = document.querySelector('.dubdown');
	    return _this;
	  }

	  createClass(Autovote, [{
	    key: 'render',
	    value: function render$$1(props, state) {
	      return h(MenuSwitch, {
	        id: 'dubplus-autovote',
	        section: 'General',
	        menuTitle: 'Autovote',
	        desc: 'Toggles auto upvoting for every song',
	        turnOn: this.turnOn,
	        turnOff: this.turnOff });
	    }
	  }]);
	  return Autovote;
	}(Component);

	/** Redirect rendering of descendants into the given CSS selector.
	 *  @example
	 *    <Portal into="body">
	 *      <div>I am rendered into document.body</div>
	 *    </Portal>
	 */

	var Portal$1 = function (_Component) {
	  inherits(Portal, _Component);

	  function Portal() {
	    classCallCheck(this, Portal);
	    return possibleConstructorReturn(this, (Portal.__proto__ || Object.getPrototypeOf(Portal)).apply(this, arguments));
	  }

	  createClass(Portal, [{
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate(props) {
	      for (var i in props) {
	        if (props[i] !== this.props[i]) {
	          return setTimeout(this.renderLayer);
	        }
	      }
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.isMounted = true;
	      this.renderLayer = this.renderLayer.bind(this);
	      this.renderLayer();
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      this.renderLayer(false);
	      this.isMounted = false;
	      if (this.remote) this.remote.parentNode.removeChild(this.remote);
	    }
	  }, {
	    key: 'findNode',
	    value: function findNode(node) {
	      return typeof node === 'string' ? document.querySelector(node) : node;
	    }
	  }, {
	    key: 'renderLayer',
	    value: function renderLayer() {
	      var show = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

	      if (!this.isMounted) return;

	      // clean up old node if moving bases:
	      if (this.props.into !== this.intoPointer) {
	        this.intoPointer = this.props.into;
	        if (this.into && this.remote) {
	          this.remote = render(h(PortalProxy, null), this.into, this.remote);
	        }
	        this.into = this.findNode(this.props.into);
	      }

	      this.remote = render(h(
	        PortalProxy,
	        { context: this.context },
	        show && this.props.children || null
	      ), this.into, this.remote);
	    }
	  }, {
	    key: 'render',
	    value: function render$$1() {
	      return null;
	    }
	  }]);
	  return Portal;
	}(Component);

	var PortalProxy = function (_Component2) {
	  inherits(PortalProxy, _Component2);

	  function PortalProxy() {
	    classCallCheck(this, PortalProxy);
	    return possibleConstructorReturn(this, (PortalProxy.__proto__ || Object.getPrototypeOf(PortalProxy)).apply(this, arguments));
	  }

	  createClass(PortalProxy, [{
	    key: 'getChildContext',
	    value: function getChildContext() {
	      return this.props.context;
	    }
	  }, {
	    key: 'render',
	    value: function render$$1(_ref) {
	      var children = _ref.children;

	      return children && children[0] || null;
	    }
	  }]);
	  return PortalProxy;
	}(Component);

	/**********************************************************************
	 * Autocomplete Emoji / Emotes
	 * Brings up a small window above the chat input to help the user
	 * pick emoji/emotes
	 */

	/*
	TODO: 
	 - Create the hidden preview component
	 - listen to the chat input for the beginning of possible emotes
	 - if found:
	   - open preview/picker window
	   - hijack arrow keys to make it move around the preview window
	   - moving around auto completes the text
	   - typing continues to filter
	*/

	var AutocompleteEmoji = function (_Component) {
	  inherits(AutocompleteEmoji, _Component);

	  function AutocompleteEmoji() {
	    var _ref;

	    var _temp, _this, _ret;

	    classCallCheck(this, AutocompleteEmoji);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = AutocompleteEmoji.__proto__ || Object.getPrototypeOf(AutocompleteEmoji)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
	      open: false
	    }, _this.turnOn = function (e) {}, _this.turnOff = function (e) {}, _temp), possibleConstructorReturn(_this, _ret);
	  }

	  createClass(AutocompleteEmoji, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      this.renderTo = document.querySelector('.pusher-chat-widget-input');
	    }
	  }, {
	    key: 'render',
	    value: function render$$1(props, _ref2) {
	      var open = _ref2.open;

	      return h(
	        MenuSwitch,
	        {
	          id: 'dubplus-emotes',
	          section: 'General',
	          menuTitle: 'Autocomplete Emoji',
	          desc: 'Quick find and insert emojis and emotes while typing in the chat input',
	          turnOn: this.turnOn,
	          turnOff: this.turnOff },
	        open ? h(Portal$1, { into: this.renderTo }) : null
	      );
	    }
	  }]);
	  return AutocompleteEmoji;
	}(Component);

	/**
	 * Custom mentions
	 */

	var CustomMentions = function (_Component) {
	  inherits(CustomMentions, _Component);

	  function CustomMentions() {
	    var _ref;

	    var _temp, _this, _ret;

	    classCallCheck(this, CustomMentions);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = CustomMentions.__proto__ || Object.getPrototypeOf(CustomMentions)).call.apply(_ref, [this].concat(args))), _this), _this.customMentionCheck = function (e) {
	      var content = e.message;
	      if (userSettings.custom.custom_mentions) {
	        var customMentions = userSettings.custom.custom_mentions.split(',');
	        var inUsers = customMentions.some(function (v) {
	          var reg = new RegExp('\\b' + v.trim() + '\\b', 'i');
	          return reg.test(content);
	        });
	        if (Dubtrack.session.id !== e.user.userInfo.userid && inUsers) {
	          Dubtrack.room.chat.mentionChatSound.play();
	        }
	      }
	    }, _this.saveCustomMentions = function (val) {
	      if (val !== '') {
	        // TODO: save to global state
	        userSettings.save('custom', 'custom_mentions', val);
	      }
	    }, _temp), possibleConstructorReturn(_this, _ret);
	  }

	  createClass(CustomMentions, [{
	    key: 'turnOn',
	    value: function turnOn() {
	      Dubtrack.Events.bind("realtime:chat-message", this.customMentionCheck);
	    }
	  }, {
	    key: 'turnOff',
	    value: function turnOff() {
	      Dubtrack.Events.unbind("realtime:chat-message", this.customMentionCheck);
	    }
	  }, {
	    key: 'render',
	    value: function render$$1(props, state) {
	      return h(
	        MenuSwitch,
	        {
	          id: 'custom_mentions',
	          section: 'General',
	          menuTitle: 'Custom Mentions',
	          desc: 'Toggle using custom mentions to trigger sounds in chat',
	          turnOn: this.turnOn,
	          turnOff: this.turnOff },
	        h(MenuPencil, {
	          title: 'Custom AFK Message',
	          section: 'General',
	          content: 'Add your custom mention triggers here (separate by comma)',
	          value: userSettings.stored.custom.custom_mentions || '',
	          placeholder: 'separate, custom triggers, by, comma, :heart:',
	          maxlength: '255',
	          onConfirm: this.saveCustomMentions })
	      );
	    }
	  }]);
	  return CustomMentions;
	}(Component);

	/**
	  // General 
	  require('./chatCleaner.js'),
	  require('./chatNotifications.js'),
	  require('./pmNotifications.js'),
	  require('./djNotification.js'),
	  require('./showDubsOnHover.js'),
	  require('./downDubInChat.js'), // (mod only)
	  require('./upDubInChat.js'),
	  require('./grabsInChat.js'),
	  require('./snow.js'),
	  require('./rain.js'),
	 */

	var GeneralSection = function (_Component) {
	  inherits(GeneralSection, _Component);

	  function GeneralSection() {
	    var _ref;

	    var _temp, _this, _ret;

	    classCallCheck(this, GeneralSection);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = GeneralSection.__proto__ || Object.getPrototypeOf(GeneralSection)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
	      css: userSettings.stored.general || "open"
	    }, _this.toggleSection = function () {
	      _this.setState(function (prevState) {
	        var newState = prevState.css === "open" ? "closed" : "open";
	        userSettings.save('menu', 'general', newState);
	        return { css: newState };
	      });
	    }, _temp), possibleConstructorReturn(_this, _ret);
	  }

	  createClass(GeneralSection, [{
	    key: 'render',
	    value: function render$$1(props, state) {
	      var _cn = ['dubplus-menu-section'];
	      if (state.css === "closed") {
	        _cn.push('dubplus-menu-section-closed');
	      }
	      return (
	        // until Preact incorporates something like React.Fragment (which is in the works) 
	        // we have to wrap adjacent elements in one parent element
	        h(
	          'span',
	          null,
	          h(SectionHeader, {
	            onClick: this.toggleSection,
	            id: 'dubplus-general',
	            category: 'General' }),
	          h(
	            'ul',
	            { className: _cn.join(' ') },
	            h(Autovote, null),
	            h(AFK, null),
	            h(AutocompleteEmoji, null),
	            h(CustomMentions, null)
	          )
	        )
	      );
	    }
	  }]);
	  return GeneralSection;
	}(Component);

	/**
	 * DubPlus Menu Container
	 */

	var DubPlusMenu = function (_Component) {
	  inherits(DubPlusMenu, _Component);

	  function DubPlusMenu() {
	    classCallCheck(this, DubPlusMenu);
	    return possibleConstructorReturn(this, (DubPlusMenu.__proto__ || Object.getPrototypeOf(DubPlusMenu)).apply(this, arguments));
	  }

	  createClass(DubPlusMenu, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      // load this async so it doesn't block the rest of the menu render
	      // since these buttons are completely independent from the menu
	      setTimeout(function () {
	        snooze$1();
	        eta();
	      }, 1);
	    }
	  }, {
	    key: 'render',
	    value: function render$$1(props, state) {
	      return h(
	        'section',
	        { className: 'dubplus-menu' },
	        h(
	          'p',
	          { className: 'dubplus-menu-header' },
	          'Dub+ Options'
	        ),
	        h(GeneralSection, null)
	      );
	    }
	  }]);
	  return DubPlusMenu;
	}(Component);

	/**
	 * Takes a string  representation of a variable or object and checks if it's
	 * definied starting at provided scope or default to global window scope.
	 * @param  {string} dottedString  the item you are looking for
	 * @param  {var}    startingScope where to start lookined
	 * @return {boolean}              if it is defined or not
	 */
	function deepCheck(dottedString, startingScope) {
	  var _vars = dottedString.split('.');
	  var len = _vars.length;

	  var depth = startingScope || window;
	  for (var i = 0; i < len; i++) {
	    if (typeof depth[_vars[i]] === 'undefined') {
	      return false;
	    }
	    depth = depth[_vars[i]];
	  }
	  return true;
	}

	function arrayDeepCheck(arr, startingScope) {
	  var len = arr.length;
	  var scope = startingScope || window;

	  for (var i = 0; i < len; i++) {
	    if (!deepCheck(arr[i], scope)) {
	      console.log(arr[i], 'is not found yet');
	      return false;
	    }
	  }
	  return true;
	}

	/**
	 * pings for the existence of var/function for # seconds until it's defined
	 * runs callback once found and stops pinging
	 * @param {string|array} waitingFor          what you are waiting for
	 * @param {object}       options             optional options to pass
	 *                       options.interval    how often to ping
	 *                       options.seconds     how long to ping for
	 *                       
	 * @return {object}                    2 functions:
	 *                  .then(fn)          will run fn only when item successfully found.  This also starts the ping process
	 *                  .fail(fn)          will run fn only when is never found in the time given
	 */
	function WaitFor(waitingFor, options) {
	  if (typeof waitingFor !== "string" && !Array.isArray(waitingFor)) {
	    console.warn('WaitFor: invalid first argument');
	    return;
	  }
	  var defaults = {
	    interval: 500, // every XX ms we check to see if waitingFor is defined
	    seconds: 15 // how many total seconds we wish to continue pinging
	  };

	  var _cb = function _cb() {};
	  var _failCB = function _failCB() {};
	  var checkFunc = Array.isArray(waitingFor) ? arrayDeepCheck : deepCheck;

	  var opts = Object.assign({}, defaults, options);

	  var tryCount = 0;
	  var tryLimit = opts.seconds * 1000 / opts.interval; // how many intervals

	  var check = function check() {
	    tryCount++;
	    var _test = checkFunc(waitingFor);

	    if (_test) {
	      return _cb();
	    }if (tryCount < tryLimit) {
	      window.setTimeout(check, opts.interval);
	    } else {
	      return _failCB();
	    }
	  };

	  var then = function then(cb) {
	    if (typeof cb === 'function') {
	      _cb = cb;
	    }
	    // start the first one
	    window.setTimeout(check, opts.interval);
	    return this;
	  };

	  var fail = function fail(cb) {
	    if (typeof cb === 'function') {
	      _failCB = cb;
	    }
	    return this;
	  };

	  return {
	    then: then,
	    fail: fail
	  };
	}

	var waitingStyles = {
	  fontFamily: "'Trebuchet MS', Helvetica, sans-serif",
	  zIndex: '2147483647',
	  color: 'white',
	  position: 'fixed',
	  top: '69px',
	  right: '-250px',
	  background: '#222',
	  padding: '10px',
	  lineHeight: 1,
	  boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)',
	  borderRadius: '5px',
	  overflow: 'hidden',
	  width: '230px',
	  transition: 'right 200ms'
	};

	var dpIcon = {
	  float: 'left',
	  width: '26px',
	  marginRight: '5px'
	};

	var dpText = {
	  display: 'table-cell',
	  width: '10000px',
	  paddingTop: '5px'
	};

	var LoadingNotice = function (_Component) {
	  inherits(LoadingNotice, _Component);

	  function LoadingNotice() {
	    var _ref;

	    var _temp, _this, _ret;

	    classCallCheck(this, LoadingNotice);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = LoadingNotice.__proto__ || Object.getPrototypeOf(LoadingNotice)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
	      mainStyles: waitingStyles
	    }, _temp), possibleConstructorReturn(_this, _ret);
	  }

	  createClass(LoadingNotice, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this2 = this;

	      setTimeout(function () {
	        _this2.setState(function (prevState, props) {
	          return {
	            mainStyles: Object.assign({}, prevState.mainStyles, { right: '13px' })
	          };
	        });
	      }, 200);
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      this.setState(function (prevState, props) {
	        return {
	          mainStyles: Object.assign({}, prevState.mainStyles, { right: '-250px' })
	        };
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render$$1(props, state) {
	      return h(
	        'div',
	        { style: state.mainStyles },
	        h(
	          'div',
	          { style: dpIcon },
	          h('img', { src: userSettings.srcRoot + '/images/dubplus.svg', alt: 'DubPlus icon' })
	        ),
	        h(
	          'span',
	          { style: dpText },
	          props.text || 'Waiting for Dubtrack...'
	        )
	      );
	    }
	  }]);
	  return LoadingNotice;
	}(Component);

	var makeLink = function makeLink(className, FileName) {
	  var link = document.createElement('link');
	  link.rel = "stylesheet";link.type = "text/css";
	  link.className = className || '';
	  link.href = FileName;
	  return link;
	};

	/**
	 * Loads a CSS file into <head>.  It concats settings.srcRoot with the first 
	 * argument (cssFile)
	 * @param {string} cssFile    the css file location
	 * @param {string} className  class name to give the <link> element
	 *
	 * example:  css.load("/options/show_timestamps.css", "show_timestamps_link");
	 */
	function load(cssFile, className) {
	  if (!cssFile) {
	    return;
	  }
	  var link = makeLink(className, userSettings.srcRoot + cssFile + "?" + 1540471937089);
	  document.head.appendChild(link);
	}

	/**
	 * Loads a css file from a full URL in the <head>
	 * @param  {String} cssFile   the full url location of a CSS file
	 * @param  {String} className a class name to give to the <link> element
	 */
	function loadExternal(cssFile, className) {
	  if (!cssFile) {
	    return;
	  }
	  var link = makeLink(className, cssFile);
	  document.head.appendChild(link);
	}

	var cssHelper = {
	  load: load,
	  loadExternal: loadExternal
	};

	var MenuIcon = function (_Component) {
	  inherits(MenuIcon, _Component);

	  function MenuIcon() {
	    var _ref;

	    var _temp, _this, _ret;

	    classCallCheck(this, MenuIcon);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = MenuIcon.__proto__ || Object.getPrototypeOf(MenuIcon)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
	      open: false
	    }, _this.toggle = function () {
	      var menu = document.querySelector('.dubplus-menu');
	      if (_this.state.open) {
	        menu.classList.add('dubplus-menu-open');
	        _this.setState({ open: false });
	      } else {
	        menu.classList.remove('dubplus-menu-open');
	        _this.setState({ open: true });
	      }
	    }, _temp), possibleConstructorReturn(_this, _ret);
	  }

	  createClass(MenuIcon, [{
	    key: 'render',
	    value: function render$$1(props, state) {
	      return h(
	        'div',
	        { className: 'dubplus-icon', onClick: this.toggle },
	        h('img', { src: userSettings.srcRoot + '/images/dubplus.svg', alt: 'DubPlus Icon' })
	      );
	    }
	  }]);
	  return MenuIcon;
	}(Component);

	/**
	 * Pure JS version of jQuery's $.getScript
	 * 
	 * @param {string} source url or path to JS file
	 * @param {function} callback function to run after script is loaded
	 */
	function getScript(source, callback) {
	    var script = document.createElement('script');
	    var prior = document.getElementsByTagName('script')[0];
	    script.async = 1;

	    script.onload = script.onreadystatechange = function (_, isAbort) {
	        if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
	            script.onload = script.onreadystatechange = null;
	            script = undefined;

	            if (!isAbort) {
	                if (callback) callback();
	            }
	        }
	    };

	    script.src = source;
	    prior.parentNode.insertBefore(script, prior);
	}

	setTimeout(function () {
	  // start the loading of the CSS asynchronously
	  cssHelper.load('/css/dubplus.css');
	  cssHelper.loadExternal('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');

	  if (typeof Promise === "undefined") {
	    // load Promise polyfill for IE because we are still supporting it
	    getScript('https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js');
	  }
	}, 1);

	var DubPlusContainer = function (_Component) {
	  inherits(DubPlusContainer, _Component);

	  function DubPlusContainer() {
	    var _ref;

	    var _temp, _this, _ret;

	    classCallCheck(this, DubPlusContainer);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = DubPlusContainer.__proto__ || Object.getPrototypeOf(DubPlusContainer)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
	      loading: true,
	      error: false,
	      errorMsg: '',
	      failed: false
	    }, _temp), possibleConstructorReturn(_this, _ret);
	  }

	  createClass(DubPlusContainer, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this2 = this;

	      /* globals Dubtrack */
	      if (!window.DubPlus) {

	        // checking to see if these items exist before initializing the script
	        // instead of just picking an arbitrary setTimeout and hoping for the best
	        var checkList = ['Dubtrack.session.id', 'Dubtrack.room.chat', 'Dubtrack.Events', 'Dubtrack.room.player', 'Dubtrack.helpers.cookie', 'Dubtrack.room.model', 'Dubtrack.room.users'];

	        var _dubplusWaiting = new WaitFor(checkList, { seconds: 120 });

	        _dubplusWaiting.then(function () {
	          _this2.setState({
	            loading: false,
	            error: false
	          });
	        }).fail(function () {
	          if (!Dubtrack.session.id) {
	            _this2.showError('You\'re not logged in. Please login to use Dub+.');
	          } else {
	            _this2.showError('Something happed, refresh and try again');
	            track.event('Dub+ lib', 'load', 'failed');
	          }
	        });
	      } else {
	        if (!Dubtrack.session.id) {
	          this.showError('You\'re not logged in. Please login to use Dub+.');
	        } else {
	          this.showError('Dub+ is already loaded');
	        }
	      }
	    }
	  }, {
	    key: 'showError',
	    value: function showError(msg) {
	      this.setState({
	        loading: false,
	        error: true,
	        errorMsg: msg
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render$$1(props, state) {
	      var _this3 = this;

	      if (state.loading) {
	        return h(LoadingNotice, null);
	      }

	      if (state.error) {
	        return h(Modal, { title: 'Dub+ Error',
	          onClose: function onClose() {
	            _this3.setState({ failed: true, error: false });
	          },
	          content: state.errorMsg });
	      }

	      if (state.failed) {
	        return null;
	      }

	      return h(DubPlusMenu, null);
	    }
	  }]);
	  return DubPlusContainer;
	}(Component);

	render(h(DubPlusContainer, null), document.body);
	render(h(MenuIcon, null), document.querySelector('.header-right-navigation'));

	// {"version":"0.1.8","description":"Dub+ - A simple script/extension for Dubtrack.fm","license":"MIT","bugs":"https://github.com/DubPlus/DubPlus/issues"} is inserted by the rollup build process
	var index = { "version": "0.1.8", "description": "Dub+ - A simple script/extension for Dubtrack.fm", "license": "MIT", "bugs": "https://github.com/DubPlus/DubPlus/issues" };

	return index;

}());
