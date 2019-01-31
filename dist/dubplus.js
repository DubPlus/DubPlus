
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

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

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

  function applyRef(ref, value) {
    if (ref != null) {
      if (typeof ref == 'function') ref(value);else ref.current = value;
    }
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
  	var p;
  	while (p = items.pop()) {
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
  		applyRef(old, null);
  		applyRef(value, node);
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
  	while (c = mounts.shift()) {
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
  		if (node['__preactattr_'] != null) applyRef(node['__preactattr_'].ref, null);

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

  	applyRef(component.__ref, component);
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
  		mounts.push(component);
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
  		if (base['__preactattr_'] != null) applyRef(base['__preactattr_'].ref, null);

  		component.nextBase = base;

  		removeNode(base);
  		recyclerComponents.push(component);

  		removeChildren(base);
  	}

  	applyRef(component.__ref, null);
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

    script.onerror = function (err) {
      if (callback) callback(err);
    };

    script.src = source;
    prior.parentNode.insertBefore(script, prior);
  }

  function polyfills () {
    // Element.remove() polyfill
    // from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
    (function (arr) {
      arr.forEach(function (item) {
        if (item.hasOwnProperty("remove")) {
          return;
        }

        Object.defineProperty(item, "remove", {
          configurable: true,
          enumerable: true,
          writable: true,
          value: function remove() {
            if (this.parentNode !== null) this.parentNode.removeChild(this);
          }
        });
      });
    })([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

    if (typeof Promise === "undefined") {
      // load Promise polyfill for IE because we are still supporting it
      getScript("https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js");
    }
  }

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

  var Snooze =
  /*#__PURE__*/
  function (_Component) {
    _inherits(Snooze, _Component);

    function Snooze() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, Snooze);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Snooze)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
        show: false
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "showTooltip", function () {
        _this.setState({
          show: true
        });
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "hideTooltip", function () {
        _this.setState({
          show: false
        });
      });

      return _this;
    }

    _createClass(Snooze, [{
      key: "render",
      value: function render$$1(props, state) {
        return h("span", {
          className: "icon-mute snooze_btn",
          onClick: snooze,
          onMouseOver: this.showTooltip,
          onMouseOut: this.hideTooltip
        }, state.show && h("div", {
          className: "snooze_tooltip",
          style: css
        }, "Mute current song"));
      }
    }]);

    return Snooze;
  }(Component);

  function snooze$1 () {
    render(h(Snooze, null), document.querySelector('.player_sharing'));
  }

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

  var ETA =
  /*#__PURE__*/
  function (_Component) {
    _inherits(ETA, _Component);

    function ETA() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, ETA);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ETA)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
        show: false,
        booth_time: ''
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "showTooltip", function () {
        var tooltipText = _this.getEta();

        _this.setState({
          show: true,
          booth_time: tooltipText
        });
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "hideTooltip", function () {
        _this.setState({
          show: false
        });
      });

      return _this;
    }

    _createClass(ETA, [{
      key: "getEta",
      value: function getEta() {
        var time = 4;
        var current_time = parseInt(document.querySelector('#player-controller div.left ul li.infoContainer.display-block div.currentTime span.min').textContent);
        var booth_duration = parseInt(document.querySelector('.queue-position').textContent);
        var booth_time = booth_duration * time - time + current_time;
        return booth_time >= 0 ? booth_time : 'You\'re not in the queue';
      }
    }, {
      key: "render",
      value: function render$$1(props, state) {
        return h("span", {
          className: "icon-history eta_tooltip_t",
          onMouseOver: this.showTooltip,
          onMouseOut: this.hideTooltip
        }, this.state.show && h("span", {
          className: "eta_tooltip",
          style: css$1
        }, this.state.booth_time));
      }
    }]);

    return ETA;
  }(Component);

  function eta () {
    render(h(ETA, null), document.querySelector('.player_sharing'));
  }

  /**
   * global State handler
   */
  var defaults = {
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

  var UserSettings =
  /*#__PURE__*/
  function () {
    function UserSettings() {
      _classCallCheck(this, UserSettings);

      _defineProperty(this, "srcRoot", "https://cdn.jsdelivr.net/gh/FranciscoG/DubPlus@preact-version");

      var _savedSettings = localStorage.getItem('dubplusUserSettings');

      if (_savedSettings) {
        try {
          var storedOpts = JSON.parse(_savedSettings);
          this.stored = Object.assign({}, defaults, storedOpts);
        } catch (err) {
          this.stored = defaults;
        }
      } else {
        this.stored = defaults;
      }
    }
    /**
     * Save your settings value to memory and localStorage
     * @param {String} type The section of the stored values. i.e. "menu", "options", "custom"
     * @param {String} optionName the key name of the option to store
     * @param {String|Boolean} value the new setting value to store
     */


    _createClass(UserSettings, [{
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

  function SectionHeader(props) {
    var arrow = props.open === "open" ? 'down' : 'right';
    return h("div", {
      id: props.id,
      onClick: props.onClick,
      className: "dubplus-menu-section-header"
    }, h("span", {
      className: "fa fa-angle-".concat(arrow)
    }), h("p", null, props.category));
  }

  /** Redirect rendering of descendants into the given CSS selector.
   *  @example
   *    <Portal into="body">
   *      <div>I am rendered into document.body</div>
   *    </Portal>
   */

  var Portal =
  /*#__PURE__*/
  function (_Component) {
    _inherits(Portal, _Component);

    function Portal() {
      _classCallCheck(this, Portal);

      return _possibleConstructorReturn(this, _getPrototypeOf(Portal).apply(this, arguments));
    }

    _createClass(Portal, [{
      key: "componentDidUpdate",
      value: function componentDidUpdate(props) {
        for (var i in props) {
          if (props[i] !== this.props[i]) {
            return setTimeout(this.renderLayer);
          }
        }
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        this.isMounted = true;
        this.renderLayer = this.renderLayer.bind(this);
        this.renderLayer();
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.renderLayer(false);
        this.isMounted = false;
        if (this.remote) this.remote.parentNode.removeChild(this.remote);
      }
    }, {
      key: "findNode",
      value: function findNode(node) {
        return typeof node === 'string' ? document.querySelector(node) : node;
      }
    }, {
      key: "renderLayer",
      value: function renderLayer() {
        var show = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        if (!this.isMounted) return; // clean up old node if moving bases:

        if (this.props.into !== this.intoPointer) {
          this.intoPointer = this.props.into;

          if (this.into && this.remote) {
            this.remote = render(h(PortalProxy, null), this.into, this.remote);
          }

          this.into = this.findNode(this.props.into);
        }

        this.remote = render(h(PortalProxy, {
          context: this.context
        }, show && this.props.children || null), this.into, this.remote);
      }
    }, {
      key: "render",
      value: function render$$1() {
        return null;
      }
    }]);

    return Portal;
  }(Component); // high-order component that renders its first child if it exists.

  var PortalProxy =
  /*#__PURE__*/
  function (_Component2) {
    _inherits(PortalProxy, _Component2);

    function PortalProxy() {
      _classCallCheck(this, PortalProxy);

      return _possibleConstructorReturn(this, _getPrototypeOf(PortalProxy).apply(this, arguments));
    }

    _createClass(PortalProxy, [{
      key: "getChildContext",
      value: function getChildContext() {
        return this.props.context;
      }
    }, {
      key: "render",
      value: function render$$1(_ref) {
        var children = _ref.children;
        return children && children[0] || null;
      }
    }]);

    return PortalProxy;
  }(Component);

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

  var Modal =
  /*#__PURE__*/
  function (_Component) {
    _inherits(Modal, _Component);

    function Modal() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, Modal);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Modal)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "keyUpHandler", function (e) {
        // save and close when user presses enter
        // considering removing this though
        if (e.keyCode === 13) {
          _this.props.onConfirm(_this.textarea.value);

          _this.props.onClose();
        } // close modal when user hits the esc key


        if (e.keyCode === 27) {
          _this.props.onClose();
        }
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "confirmClick", function () {
        _this.props.onConfirm(_this.textarea.value);

        _this.props.onClose();
      });

      return _this;
    }

    _createClass(Modal, [{
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        document.removeEventListener("keyup", this.keyUpHandler);
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate() {
        if (this.props.open) {
          document.addEventListener("keyup", this.keyUpHandler);
        } else {
          document.removeEventListener("keyup", this.keyUpHandler);
        }
      }
    }, {
      key: "render",
      value: function render$$1(props) {
        var _this2 = this;

        var closeButtonText = !props.onConfirm ? "close" : "cancel";
        return props.open ? h(Portal, {
          into: "body"
        }, h("div", {
          className: "dp-modal"
        }, h("aside", {
          className: "container"
        }, h("div", {
          className: "title"
        }, h("h1", null, " ", props.title || "Dub+")), h("div", {
          className: "content"
        }, h("p", null, props.content || ""), props.placeholder && h("textarea", {
          ref: function ref(c) {
            return _this2.textarea = c;
          },
          placeholder: props.placeholder,
          maxlength: props.maxlength || 999
        }, props.value || "")), h("div", {
          className: "dp-modal-buttons"
        }, h("button", {
          id: "dp-modal-cancel",
          onClick: props.onClose
        }, closeButtonText), props.onConfirm && h("button", {
          id: "dp-modal-confirm",
          onClick: this.confirmClick
        }, "okay"))))) : null;
      }
    }]);

    return Modal;
  }(Component);

  /**
   * Class wrapper for Google Analytics
   */
  // shim just in case blocked by an adblocker or something
  var ga = window.ga || function () {};

  var GA =
  /*#__PURE__*/
  function () {
    function GA(uid) {
      _classCallCheck(this, GA);

      ga('create', uid, 'auto', 'dubplusTracker');
    } // https://developers.google.com/analytics/devguides/collection/analyticsjs/events


    _createClass(GA, [{
      key: "event",
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
      key: "menuClick",
      value: function menuClick(menuSection, menuItem, onOff) {
        this.event(menuSection, 'click', menuItem, onOff);
      }
    }]);

    return GA;
  }();

  var track = new GA('UA-116652541-1');

  /**
   * Component to render a menu section.
   * @param {object} props
   * @param {string} props.id
   * @param {string} props.title the name to display
   * @param {string} props.settingsKey the key in the setting.stored.menu object
   */

  var MenuSection =
  /*#__PURE__*/
  function (_Component) {
    _inherits(MenuSection, _Component);

    function MenuSection() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, MenuSection);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(MenuSection)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
        section: userSettings.stored.menu[_this.props.settingsKey] || "open"
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "toggleSection", function (e) {
        _this.setState(function (prevState) {
          var newState = prevState.section === "open" ? "closed" : "open";
          userSettings.save("menu", _this.props.settingsKey, newState);
          return {
            section: newState
          };
        });
      });

      return _this;
    }

    _createClass(MenuSection, [{
      key: "render",
      value: function render$$1(props, state) {
        var _cn = ["dubplus-menu-section"];

        if (state.section === "closed") {
          _cn.push("dubplus-menu-section-closed");
        }

        return h("span", null, h(SectionHeader, {
          onClick: this.toggleSection,
          id: props.id,
          category: props.title,
          open: state.section
        }), h("ul", {
          className: _cn.join(" ")
        }, props.children));
      }
    }]);

    return MenuSection;
  }(Component);
  /**
   * Component to render a simple row like the links in the contact section
   * or the fullscreen menu option
   * @param {object} props
   * @param {string} props.id the dom ID name, usually dubplus-*
   * @param {string} props.desc description of the menu item used in the title attr
   * @param {string} props.icon icon to be used
   * @param {string} props.menuTitle text to display in the menu
   * @param {Function} props.onClick text to display in the menu
   */

  function MenuSimple(props) {
    var _cn = ["dubplus-menu-icon"]; // combine with ones that were passed through

    if (props.className) {
      _cn.push(props.className);
    }

    return h("li", {
      id: props.id,
      title: props.desc,
      className: _cn.join(" "),
      onClick: props.onClick
    }, h("span", {
      className: "fa fa-".concat(props.icon)
    }), h("span", {
      className: "dubplus-menu-label"
    }, props.menuTitle));
  }
  /**
   * Component which brings up a modal box to allow user to
   * input and store a text value which will be used by the
   * parent menu item.
   *
   * MenuPencil must always by a child of MenuSwitch.
   */

  var MenuPencil =
  /*#__PURE__*/
  function (_Component2) {
    _inherits(MenuPencil, _Component2);

    function MenuPencil() {
      var _getPrototypeOf3;

      var _this2;

      _classCallCheck(this, MenuPencil);

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      _this2 = _possibleConstructorReturn(this, (_getPrototypeOf3 = _getPrototypeOf(MenuPencil)).call.apply(_getPrototypeOf3, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "state", {
        open: false
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "loadModal", function () {
        _this2.setState({
          open: true
        });

        track.menuClick(_this2.props.section + " section", _this2.props.id + " edit");
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "closeModal", function () {
        console.log("closing dub+ modal");

        _this2.setState({
          open: false
        });
      });

      return _this2;
    }

    _createClass(MenuPencil, [{
      key: "render",
      value: function render$$1(props, state) {
        return h("span", {
          onClick: this.loadModal,
          className: "fa fa-pencil extra-icon"
        }, h(Modal, {
          open: state.open,
          title: props.title || "Dub+ option",
          content: props.content || "Please enter a value",
          placeholder: props.placeholder || "in here",
          value: props.value,
          onConfirm: props.onConfirm,
          onClose: this.closeModal
        }));
      }
    }]);

    return MenuPencil;
  }(Component);
  var MenuSwitch =
  /*#__PURE__*/
  function (_Component3) {
    _inherits(MenuSwitch, _Component3);

    function MenuSwitch() {
      var _getPrototypeOf4;

      var _this3;

      _classCallCheck(this, MenuSwitch);

      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      _this3 = _possibleConstructorReturn(this, (_getPrototypeOf4 = _getPrototypeOf(MenuSwitch)).call.apply(_getPrototypeOf4, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this3)), "state", {
        on: userSettings.stored.options[_this3.props.id] || false
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this3)), "switchOn", function () {
        _this3.props.turnOn();

        userSettings.save("options", _this3.props.id, true);

        _this3.setState({
          on: true
        });

        track.menuClick(_this3.props.section + " section", _this3.props.id + " on");
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this3)), "switchOff", function () {
        var noTrack = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        _this3.props.turnOff();

        userSettings.save("options", _this3.props.id, false);

        _this3.setState({
          on: false
        });

        if (!noTrack) {
          track.menuClick(_this3.props.section + " section", _this3.props.id + " off");
        }
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this3)), "toggleSwitch", function () {
        if (_this3.state.on) {
          _this3.switchOff();
        } else {
          _this3.switchOn();
        }
      });

      return _this3;
    }

    _createClass(MenuSwitch, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        if (this.state.on) {
          this.props.turnOn();
        }
      }
    }, {
      key: "render",
      value: function render$$1(props, state) {
        var _cn = ["dubplus-switch"];

        if (state.on) {
          _cn.push("dubplus-switch-on");
        } // combine with ones that were passed through


        if (props.className) {
          _cn.push(props.className);
        }

        return h("li", {
          id: props.id,
          title: props.desc,
          className: _cn.join(" ")
        }, props.children || null, h("div", {
          onClick: this.toggleSwitch,
          className: "dubplus-form-control"
        }, h("div", {
          className: "dubplus-switch-bg"
        }, h("div", {
          className: "dubplus-switcher"
        })), h("span", {
          className: "dubplus-menu-label"
        }, props.menuTitle)));
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

  var AFK =
  /*#__PURE__*/
  function (_Component) {
    _inherits(AFK, _Component);

    function AFK() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, AFK);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(AFK)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
        canSend: true
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "afk_chat_respond", function (e) {
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

          Dubtrack.room.chat.sendMessage(); // so we don't spam chat, we pause the auto respond for 30sec

          _this.setState({
            canSend: false
          }); // allow AFK responses after 30sec


          setTimeout(function () {
            _this.setState({
              canSend: true
            });
          }, 30000);
        }
      });

      return _this;
    }

    _createClass(AFK, [{
      key: "turnOn",
      value: function turnOn() {
        Dubtrack.Events.bind("realtime:chat-message", this.afk_chat_respond);
      }
    }, {
      key: "turnOff",
      value: function turnOff() {
        Dubtrack.Events.unbind("realtime:chat-message", this.afk_chat_respond);
      }
    }, {
      key: "saveAFKmessage",
      value: function saveAFKmessage(val) {
        if (val !== '') {
          // TODO: save to global state
          userSettings.save('custom', 'customAfkMessage', val);
        }
      }
    }, {
      key: "render",
      value: function render$$1(props, state) {
        return h(MenuSwitch, {
          id: "dubplus-afk",
          section: "General",
          menuTitle: "AFK Auto-respond",
          desc: "Toggle Away from Keyboard and customize AFK message.",
          turnOn: this.turnOn,
          turnOff: this.turnOff
        }, h(MenuPencil, {
          title: "Custom AFK Message",
          section: "General",
          content: "Enter a custom Away From Keyboard [AFK] message here",
          value: userSettings.stored.custom.customAfkMessage || '',
          placeholder: "Be right back!",
          maxlength: "255",
          onConfirm: this.saveAFKmessage
        }));
      }
    }]);

    return AFK;
  }(Component);

  /**
   * Menu item for Autovote
   */

  var Autovote =
  /*#__PURE__*/
  function (_Component) {
    _inherits(Autovote, _Component);

    function Autovote() {
      var _this;

      _classCallCheck(this, Autovote);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Autovote).call(this));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "advance_vote", function () {
        var event = document.createEvent('HTMLEvents');
        event.initEvent('click', true, false);

        _this.dubup.dispatchEvent(event);
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "voteCheck", function (obj) {
        if (obj.startTime < 2) {
          _this.advance_vote();
        }
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "turnOn", function (e) {
        var song = Dubtrack.room.player.activeSong.get('song');
        var dubCookie = Dubtrack.helpers.cookie.get('dub-' + Dubtrack.room.model.get("_id"));
        var dubsong = Dubtrack.helpers.cookie.get('dub-song');

        if (!Dubtrack.room || !song || song.songid !== dubsong) {
          dubCookie = false;
        } // Only cast the vote if user hasn't already voted


        if (!_this.dubup.classList.contains('voted') && !_this.dubdown.classList.contains('voted') && !dubCookie) {
          _this.advance_vote();
        }

        Dubtrack.Events.bind("realtime:room_playlist-update", _this.voteCheck);
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "turnOff", function (e) {
        Dubtrack.Events.unbind("realtime:room_playlist-update", _this.voteCheck);
      });

      _this.dubup = document.querySelector('.dubup');
      _this.dubdown = document.querySelector('.dubdown');
      return _this;
    }

    _createClass(Autovote, [{
      key: "render",
      value: function render$$1(props, state) {
        return h(MenuSwitch, {
          id: "dubplus-autovote",
          section: "General",
          menuTitle: "Autovote",
          desc: "Toggles auto upvoting for every song",
          turnOn: this.turnOn,
          turnOff: this.turnOff
        });
      }
    }]);

    return Autovote;
  }(Component);

  /*
  TODO: 
   - if found:
     - hijack arrow keys to make it move around the preview window
     - moving around auto completes the text
     - typing continues to filter
  */

  var PreviewListItem = function PreviewListItem(_ref) {
    var data = _ref.data,
        onSelect = _ref.onSelect;

    if (data.header) {
      return h("li", {
        className: "preview-item-header ".concat(data.header.toLowerCase(), "-preview-header")
      }, h("span", null, data.header));
    }

    return h("li", {
      className: "preview-item ".concat(data.type, "-previews"),
      onClick: function onClick() {
        onSelect(data.name);
      },
      "data-name": data.name
    }, h("div", {
      className: "ac-image"
    }, h("img", {
      src: data.src,
      alt: data.name,
      title: data.name
    })), h("span", {
      className: "ac-text"
    }, data.name));
  };

  var AutocompletePreview = function AutocompletePreview(_ref2) {
    var matches = _ref2.matches,
        onSelect = _ref2.onSelect;

    if (matches.length === 0) {
      return h("ul", {
        id: "autocomplete-preview"
      });
    }

    var list = matches.map(function (m, i) {
      return h(PreviewListItem, {
        data: m,
        key: m.header ? "header-row-".concat(m.header) : "".concat(m.type, "-").concat(m.name),
        onSelect: onSelect
      });
    });
    return h("ul", {
      id: "autocomplete-preview",
      className: "ac-show"
    }, list);
  };

  /**
   * Wrapper around XMLHttpRequest with added ability to trigger a custom event 
   * when the ajax request is complete. The event will be attached to the window 
   * object. It returns a promise.
   * 
   * @param {String} url 
   * @param {Object} headers object of xhr headers to add to the request
   * @returns {Promise}
   */
  function getJSON(url) {
    var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();

      for (var property in headers) {
        if (headers.hasOwnProperty(property)) {
          xhr.setRequestHeader(property, headers[property]);
        }
      }

      xhr.onload = function () {
        try {
          var resp = JSON.parse(xhr.responseText);
          resolve(resp);
        } catch (e) {
          reject(e);
        }
      };

      xhr.onerror = function () {
        reject();
      };

      xhr.open('GET', url);
      xhr.send();
    });
  }

  // IndexedDB wrapper for increased quota compared to localstorage (5mb to 50mb)
  function IndexDBWrapper() {
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

    if (!indexedDB) {
      return console.error("indexDB not supported");
    }
    var db;
    var timeout = 50; // 50 * 100 = 5000ms = 5s

    /**
     * Get item from indexedDB
     * @param {string} item the db key name of what you want to retrieve
     * @param {function} [cb] optional callback because it also returns a promise
     * @returns {Promise}
     */

    function getItem(item, cb) {
      // keep trying until db open request is established
      if (!db && timeout >= 0) {
        setTimeout(function () {
          getItem(item, cb);
        }, 100);
        timeout--;
        return;
      }

      timeout = 30; // reset the dbrequest timeout counter

      return db.transaction("s").objectStore("s").get(item).onsuccess = function (e) {
        var t = e.target.result && e.target.result.v || null;
        cb(t);
      };
    }
    /**
     * Store a value in indexedDB
     * @param {string} item key name for the value that will be stored
     * @param {string} val value to be stored
     */


    function setItem(item, val) {
      // keep trying until db open request is established
      if (!db && timeout >= 0) {
        setTimeout(function () {
          setItem(item, val);
        }, 100);
        timeout--;
        return;
      }

      timeout = 30; // reset the dbrequest timeout counter

      var obj = {
        k: item,
        v: val
      };
      db.transaction("s", "readwrite").objectStore("s").put(obj);
    }

    var dbRequest = indexedDB.open("d2", 1);

    dbRequest.onsuccess = function (e) {
      db = this.result;
    };

    dbRequest.onerror = function (e) {
      console.error("indexedDB request error", e);
    };

    dbRequest.onupgradeneeded = function (e) {
      db = this.result;
      var t = db.createObjectStore("s", {
        keyPath: "k"
      });

      db.transaction.oncomplete = function (e) {
        db = e.target.db;
      };
    };

    return {
      get: getItem,
      set: setItem
    };
  }

  var ldb = new IndexDBWrapper();

  /* global  emojify */
  var emoji = {
    template: function template(id) {
      return emojify.defaultConfig.img_dir + "/" + encodeURI(id) + ".png";
    },
    find: function find(symbol) {
      var _this = this;

      var found = emojify.emojiNames.filter(function (e) {
        return e.indexOf(symbol) === 0;
      });
      return found.map(function (key) {
        return {
          type: "emojify",
          src: _this.template(key),
          name: key
        };
      });
    }
  };
  function shouldUpdateAPIs(apiName) {
    var day = 1000 * 60 * 60 * 24; // milliseconds in a day

    return new Promise(function (resolve, reject) {
      // if api returned an object with an error and we stored it 
      // then we should try again
      ldb.get(apiName + "_api", function (savedItem) {
        if (savedItem) {
          try {
            var parsed = JSON.parse(savedItem);

            if (typeof parsed.error !== "undefined") {
              resolve(true); // yes we should refresh data from api
            }
          } catch (e) {
            resolve(true); // data was corrupted, needs to be refreshed
          }
        } else {
          resolve(true); // data doesn't exist, needs to be fetched
        } // at this point we have good data without issues in IndexedDB
        // so now we check how old it is to see if we should update it (7 days is the limit)


        var today = Date.now();
        var lastSaved = parseInt(localStorage.getItem(apiName + "_api_timestamp")); // Is the lastsaved not a number for some strange reason, then we should update 
        // OR
        // are we past 5 days from last update? then we should update

        resolve(isNaN(lastSaved) || today - lastSaved > day * 7);
      });
    });
  }

  /* global  emojify */

  /**
   * Handles loading emotes from api and storing them locally
   *
   * @class TwitchEmotes
   */

  var TwitchEmotes =
  /*#__PURE__*/
  function () {
    function TwitchEmotes() {
      var _this = this;

      _classCallCheck(this, TwitchEmotes);

      _defineProperty(this, "specialEmotes", []);

      _defineProperty(this, "emotes", {});

      _defineProperty(this, "sortedKeys", {
        nonAlpha: []
      });

      _defineProperty(this, "loaded", false);

      _defineProperty(this, "addKeyToSorted", function (key) {
        var first = key.charAt(0); // all numbers and symbols get stored in one 'nonAlpha' array

        if (!/[a-z]/i.test(first)) {
          _this.sortedKeys.nonAlpha.push(key);

          return;
        }

        if (!_this.sortedKeys[first]) {
          _this.sortedKeys[first] = [key];
          return;
        }

        _this.sortedKeys[first].push(key);
      });
    }

    _createClass(TwitchEmotes, [{
      key: "load",
      value: function load() {
        var _this2 = this;

        // if it doesn't exist in indexedDB or it's older than 5 days
        // grab it from the twitch API
        return shouldUpdateAPIs("twitch").then(function (update) {
          if (update) {
            return _this2.updateFromApi();
          }

          return _this2.grabFromDb();
        }).catch(function (e) {
          return console.error(e.message);
        });
      }
    }, {
      key: "done",
      value: function done(cb) {
        this.doneCB = cb;
      }
    }, {
      key: "grabFromDb",
      value: function grabFromDb() {
        var _this3 = this;

        return new Promise(function (resolve, reject) {
          try {
            console.time("twitch load time:");
            ldb.get("twitch_api", function (data) {
              console.timeEnd("twitch load time:");
              console.log("dub+", "twitch", "loading from IndexedDB");
              var savedData = JSON.parse(data); // this.processEmotes(savedData);

              _this3.processViaWebWorker(savedData);

              _this3.loaded = "from db";
              savedData = null; // clear the var from memory

              resolve();
            });
          } catch (e) {
            reject(e);
          }
        });
      }
    }, {
      key: "updateFromApi",
      value: function updateFromApi() {
        var _this4 = this;

        console.time("twitch load time:");
        console.log("dub+", "twitch", "loading from api");
        var corsEsc = "https://cors-escape.herokuapp.com";
        var twApi = getJSON("".concat(corsEsc, "/https://api.twitch.tv/kraken/chat/emoticon_images"));
        return twApi.then(function (json) {
          console.timeEnd("twitch load time:");
          var twitchEmotes = {};
          json.emoticons.forEach(function (e) {
            if (!twitchEmotes[e.code] || e.emoticon_set === null) {
              // if emote doesn't exist OR
              // override if it's a global emote (null set = global emote)
              twitchEmotes[e.code] = e.id;
            }
          });
          localStorage.setItem("twitch_api_timestamp", Date.now().toString());
          ldb.set("twitch_api", JSON.stringify(twitchEmotes)); // this.processEmotes(twitchEmotes);

          _this4.processViaWebWorker(twitchEmotes);

          _this4.loaded = "from api";
        });
      }
    }, {
      key: "template",
      value: function template(id) {
        return "//static-cdn.jtvnw.net/emoticons/v1/".concat(id, "/3.0");
      }
    }, {
      key: "find",
      value: function find(symbol) {
        var _this5 = this;

        var first = symbol.charAt(0);
        var arr;

        if (!/[a-z]/i.test(first)) {
          arr = this.sortedKeys.nonAlpha;
        } else {
          arr = this.sortedKeys[first] || [];
        }

        var matchTwitchKeys = arr.filter(function (key) {
          return key.indexOf(symbol) === 0;
        });
        return matchTwitchKeys.map(function (key) {
          return {
            type: "twitch",
            src: _this5.template(_this5.emotes[key]),
            name: key
          };
        });
      }
    }, {
      key: "processEmotes",
      value: function processEmotes(data) {
        console.time("twitch_process");

        for (var code in data) {
          if (data.hasOwnProperty(code)) {
            var _key = code.toLowerCase(); // move twitch non-named emojis to their own array
            // for now we are doing nothing with them


            if (code.indexOf("\\") >= 0) {
              this.specialEmotes.push([code, data[code]]);
              continue;
            }

            if (emojify.emojiNames.indexOf(_key) >= 0) {
              continue; // don't override regular emojis handled by emojify
            }

            if (!this.emotes[_key]) {
              // if emote doesn't exist, add it
              this.emotes[_key] = data[code];
              this.addKeyToSorted(_key);
            }
          }
        }

        this.loaded = true;
        this.doneCB();
        console.timeEnd("twitch_process");
      }
      /**
       * In order to speed up the initial load of the script I'm using a web worker
       * do some of the more cpu expensive and UI blocking work
       * help from: https://stackoverflow.com/a/10372280/395414
       */

    }, {
      key: "processViaWebWorker",
      value: function processViaWebWorker(data) {
        var _this6 = this;

        // URL.createObjectURL
        window.URL = window.URL || window.webkitURL;
        var response = "\n      var emotes = {};\n      var sortedKeys = {\n        'nonAlpha' : []\n      };\n\n      function addKeyToSorted(key) {\n        let first = key.charAt(0);\n    \n        // all numbers and symbols get stored in one 'nonAlpha' array\n        if (!/[a-z]/i.test(first)) {\n          sortedKeys.nonAlpha.push(key);\n          return;\n        }\n    \n        if (!sortedKeys[first]) {\n          sortedKeys[first] = [key];\n          return\n        }\n    \n        sortedKeys[first].push(key);\n      }\n\n      self.addEventListener('message', function(e) {\n        var emojiNames = e.data.emojiNames;\n        var data = e.data.data;\n\n        for (var code in data) {\n          if (data.hasOwnProperty(code)) {\n            var _key = code.toLowerCase();\n      \n            // not doing anything with non-named emojis\n            if (/\\\\/g.test(code)) {\n              continue;\n            }\n      \n            if (emojiNames.indexOf(_key) >= 0) {\n              continue; // don't override regular emojis handled by emojify\n            }\n      \n            if (!emotes[_key]) {\n              // if emote doesn't exist, add it\n              emotes[_key] = data[code];\n              addKeyToSorted(_key);\n            }\n          }\n        }\n\n        self.postMessage({\n          emotes: emotes,\n          sortedKeys: sortedKeys\n        });\n        close();\n      }, false);\n    ";
        var blob;

        try {
          blob = new Blob([response], {
            type: "application/javascript"
          });
        } catch (e) {
          // Backwards-compatibility
          window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
          blob = new BlobBuilder();
          blob.append(response);
          blob = blob.getBlob();
        }

        var worker = new Worker(URL.createObjectURL(blob));
        console.time("twitch_web_worker_process");
        worker.addEventListener("message", function (e) {
          _this6.emotes = e.data.emotes;
          _this6.sortedKeys = e.data.sortedKeys;
          _this6.loaded = true;
          console.timeEnd("twitch_web_worker_process");

          _this6.doneCB();
        });
        worker.postMessage({
          data: data,
          emojiNames: emojify.emojiNames
        });
      }
    }]);

    return TwitchEmotes;
  }();

  var twitch = new TwitchEmotes();

  /* global  emojify */

  var BTTVemotes =
  /*#__PURE__*/
  function () {
    function BTTVemotes() {
      var _this = this;

      _classCallCheck(this, BTTVemotes);

      _defineProperty(this, "emotes", {});

      _defineProperty(this, "sortedKeys", {
        'nonAlpha': []
      });

      _defineProperty(this, "loaded", false);

      _defineProperty(this, "headers", {});

      _defineProperty(this, "addKeyToSorted", function (key) {
        var first = key.charAt(0); // all numbers and symbols get stored in one 'nonAlpha' array

        if (!/[a-z]/i.test(first)) {
          _this.sortedKeys.nonAlpha.push(key);

          return;
        }

        if (!_this.sortedKeys[first]) {
          _this.sortedKeys[first] = [];
        }

        _this.sortedKeys[first].push(key);
      });
    }

    _createClass(BTTVemotes, [{
      key: "optionalSetHeaders",
      value: function optionalSetHeaders(obj) {
        this.headers = obj;
      }
    }, {
      key: "load",
      value: function load() {
        var _this2 = this;

        // if it doesn't exist in localStorage or it's older than 5 days
        // grab it from the bttv API
        return shouldUpdateAPIs("bttv").then(function (update) {
          if (update) {
            return _this2.updateFromAPI();
          }

          return _this2.loadFromDB();
        });
      }
    }, {
      key: "loadFromDB",
      value: function loadFromDB() {
        var _this3 = this;

        return new Promise(function (resolve, reject) {
          try {
            ldb.get("bttv_api", function (data) {
              console.log("dub+", "bttv", "loading from IndexedDB");
              var savedData = JSON.parse(data);

              _this3.processEmotes(savedData);

              savedData = null; // clear the var from memory

              resolve();
            });
          } catch (e) {
            reject(e);
          }
        });
      }
    }, {
      key: "updateFromAPI",
      value: function updateFromAPI() {
        var _this4 = this;

        console.log("dub+", "bttv", "loading from api");
        var bttvApi = getJSON("https://api.betterttv.net/2/emotes", this.headers);
        return bttvApi.then(function (json) {
          var bttvEmotes = {};
          json.emotes.forEach(function (e) {
            if (!bttvEmotes[e.code]) {
              bttvEmotes[e.code] = e.id;
            }
          });
          localStorage.setItem("bttv_api_timestamp", Date.now().toString());
          ldb.set("bttv_api", JSON.stringify(bttvEmotes));

          _this4.processEmotes(bttvEmotes);
        });
      }
    }, {
      key: "template",
      value: function template(id) {
        return "//cdn.betterttv.net/emote/".concat(id, "/3x");
      }
    }, {
      key: "find",
      value: function find(symbol) {
        var _this5 = this;

        var first = symbol.charAt(0);
        var arr;

        if (!/[a-z]/i.test(first)) {
          arr = this.sortedKeys.nonAlpha;
        } else {
          arr = this.sortedKeys[first] || [];
        }

        var matchBttvKeys = arr.filter(function (key) {
          return key.indexOf(symbol) === 0;
        });
        return matchBttvKeys.map(function (key) {
          return {
            type: "bttv",
            src: _this5.template(_this5.emotes[key]),
            name: key
          };
        });
      }
    }, {
      key: "processEmotes",
      value: function processEmotes(data) {
        for (var code in data) {
          if (data.hasOwnProperty(code)) {
            var _key = code.toLowerCase();

            if (code.indexOf(":") >= 0) {
              continue; // don't want any emotes with smileys and stuff
            }

            if (emojify.emojiNames.indexOf(_key) >= 0) {
              continue; // do nothing so we don't override emoji
            }

            if (code.indexOf("(") >= 0) {
              _key = _key.replace(/([()])/g, "");
            }

            this.emotes[_key] = data[code];
            this.addKeyToSorted(_key);
          }
        }

        this.loaded = true;
      }
    }]);

    return BTTVemotes;
  }();

  var bttv = new BTTVemotes();

  /**********************************************************************
   * Autocomplete Emoji / Emotes
   * Brings up a small window above the chat input to help the user
   * pick emoji/emotes
   */

  /*
  TODO: 
   - if found:
     - hijack arrow keys to make it move around the preview window
     - moving around auto completes the text
     - typing continues to filter
  */

  var KEYS = {
    up: 38,
    down: 40,
    left: 37,
    right: 39,
    enter: 13,
    esc: 27,
    tab: 9
  };
  var ignoreKeys = [KEYS.up, KEYS.down, KEYS.left, KEYS.right, KEYS.esc, KEYS.enter];

  var AutocompleteEmoji =
  /*#__PURE__*/
  function (_Component) {
    _inherits(AutocompleteEmoji, _Component);

    function AutocompleteEmoji() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, AutocompleteEmoji);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(AutocompleteEmoji)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
        isOn: false,
        matches: []
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "renderTo", document.querySelector(".pusher-chat-widget-input"));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "chatInput", document.getElementById("chat-txt-message"));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "selectedItem", null);

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "checkInput", function (e) {
        // we want to ignore keyups that don't output anything
        var key = "which" in e ? e.which : e.keyCode;

        if (ignoreKeys.indexOf(key) >= 0) {
          return;
        } // grab the input value and split into an array so we can easily grab the
        // last element in it


        var parts = e.target.value.split(" ");

        if (parts.length === 0) {
          return;
        }

        var lastPart = parts[parts.length - 1];
        var lastChar = lastPart.charAt(lastPart.length - 1); // now we check if the last word in the input starts with the opening
        // emoji colon but does not have the closing emoji colon

        if (lastPart.charAt(0) === ":" && lastPart.length > 3 && lastChar !== ":") {
          var new_matches = _this.getMatches(lastPart);

          _this.chunkLoadMatches(new_matches);

          return;
        }

        if (_this.state.matches.length !== 0) {
          _this.closePreview();
        }
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "updateChatInput", function (emote) {
        var focusBack = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var inputText = _this.chatInput.value.split(" ");

        inputText.pop();
        inputText.push(":".concat(emote, ":"));
        _this.chatInput.value = inputText.join(" ");

        if (focusBack) {
          _this.chatInput.focus();

          _this.closePreview();
        }
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "keyboardNav", function (e) {
        if (_this.state.matches.length === 0) {
          return true;
        }

        var key = "which" in e ? e.which : e.keyCode;

        switch (key) {
          case KEYS.down:
          case KEYS.tab:
            e.preventDefault();
            e.stopImmediatePropagation();

            _this.navDown();

            break;

          case KEYS.up:
            e.preventDefault();
            e.stopImmediatePropagation();

            _this.navUp();

            break;

          case KEYS.esc:
            _this.closePreview();

            _this.chatInput.focus();

            break;

          case KEYS.enter:
            _this.closePreview();

            break;

          default:
            return true;
        }
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "turnOn", function (e) {
        _this.setState({
          isOn: true
        }); // relying on Dubtrack.fm's lodash being globally available


        _this.debouncedCheckInput = window._.debounce(_this.checkInput, 100);
        _this.debouncedNav = window._.debounce(_this.keyboardNav, 100);

        _this.chatInput.addEventListener("keydown", _this.debouncedNav);

        _this.chatInput.addEventListener("keyup", _this.debouncedCheckInput);
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "turnOff", function (e) {
        _this.setState({
          isOn: false
        });

        _this.chatInput.removeEventListener("keydown", _this.debouncedNav);

        _this.chatInput.removeEventListener("keyup", _this.debouncedCheckInput);
      });

      return _this;
    }

    _createClass(AutocompleteEmoji, [{
      key: "chunkLoadMatches",
      // to speed up some of the DOM loading we only display the first 50 matches
      // right away and then wait a bit to add the rest
      value: function chunkLoadMatches(matches) {
        var _this2 = this;

        var limit = 50;

        if (matches.length < limit + 1) {
          this.setState({
            matches: matches
          });
          return;
        } // render the first 50 matches


        var startingArray = matches.slice(0, limit);
        this.setState({
          matches: startingArray
        }); // then render the full list after given time
        // dom diffing should leave the first in place and just add the
        // remaining matches

        setTimeout(function () {
          _this2.setState({
            matches: matches
          });
        }, 250);
      }
    }, {
      key: "getMatches",
      value: function getMatches(symbol) {
        symbol = symbol.replace(/^:/, "");
        var classic = emoji.find(symbol);

        if (classic.length > 0) {
          classic.unshift({
            header: "Emoji"
          });
        }

        var bttvMatches = bttv.find(symbol);

        if (bttvMatches.length > 0) {
          bttvMatches.unshift({
            header: "BetterTTV"
          });
        }

        var twitchMatches = twitch.find(symbol);

        if (twitchMatches.length > 0) {
          twitchMatches.unshift({
            header: "Twitch"
          });
        }

        return classic.concat(bttvMatches, twitchMatches);
      }
    }, {
      key: "closePreview",
      value: function closePreview() {
        this.setState({
          matches: []
        });
        this.selectedItem = null;
      }
    }, {
      key: "isElementInView",
      value: function isElementInView(el) {
        var container = document.querySelector("#autocomplete-preview");
        var rect = el.getBoundingClientRect();
        var outerRect = container.getBoundingClientRect();
        return rect.top >= outerRect.top && rect.bottom <= outerRect.bottom;
      }
    }, {
      key: "navDown",
      value: function navDown() {
        var item;

        if (this.selectedItem) {
          this.selectedItem.classList.remove("selected");
          item = this.selectedItem.nextSibling;
        } // go back to the first item


        if (!item) {
          item = document.querySelector(".preview-item");
        } // there should always be a nextSibling after a header so
        // we don't need to check item again after this


        if (item.classList.contains("preview-item-header")) {
          item = item.nextSibling;
        }

        item.classList.add("selected");

        if (!this.isElementInView(item)) {
          item.scrollIntoView(false);
        }

        this.selectedItem = item;
        this.updateChatInput(item.dataset.name, false);
      }
    }, {
      key: "navUp",
      value: function navUp() {
        var item;

        if (this.selectedItem) {
          this.selectedItem.classList.remove("selected");
          item = this.selectedItem.previousSibling;
        } // get to the last item


        if (!item) {
          item = [].slice.call(document.querySelectorAll(".preview-item")).pop();
        }

        if (item.classList.contains("preview-item-header")) {
          item = item.previousSibling;
        } // check again because the header


        if (!item) {
          item = [].slice.call(document.querySelectorAll(".preview-item")).pop();
        }

        item.classList.add("selected");

        if (!this.isElementInView(item)) {
          item.scrollIntoView(true);
        }

        this.selectedItem = item;
        this.updateChatInput(item.dataset.name, false);
      }
    }, {
      key: "render",
      value: function render$$1(props, _ref) {
        var isOn = _ref.isOn,
            matches = _ref.matches;
        return h(MenuSwitch, {
          id: "dubplus-emotes",
          section: "General",
          menuTitle: "Autocomplete Emoji",
          desc: "Quick find and insert emojis and emotes while typing in the chat input",
          turnOn: this.turnOn,
          turnOff: this.turnOff
        }, isOn ? h(Portal, {
          into: this.renderTo
        }, h(AutocompletePreview, {
          onSelect: this.updateChatInput,
          matches: matches
        })) : null);
      }
    }]);

    return AutocompleteEmoji;
  }(Component);

  /**
   * Simple string parser based on Douglas Crockford's JSON.parse
   * https://github.com/douglascrockford/JSON-js/blob/master/json_parse.js
   * which itself is a simplified recursive descent parser
   * 
   * This parser is specifically written to find colon wrapped :emotes:
   * in a string and extract them into an array
   */

  /**
   * @param {String} str the string to parse
   * @returns {Array} an array of matches or an empty array
   */
  function parser(str) {
    var result = [];
    var group = "";
    var openTagFound = false;
    var at = 0;

    function reset() {
      group = "";
      openTagFound = false;
    }

    function capture(ch) {
      group += ch;
    }

    function save() {
      if (group !== "::") {
        result.push(group);
      }
    }

    while (at < str.length) {
      var curr = str.charAt(at);

      if (!openTagFound && curr === ":") {
        openTagFound = true;
        capture(curr);
        at++;
        continue;
      }

      if (openTagFound) {
        if (curr === ":") {
          capture(curr);
          save();
          reset();
          at++;
          continue;
        }

        if (curr === " ") {
          reset();
          at++;
          continue;
        }

        capture(curr);
      }

      at++;
    }

    return result;
  }

  /*
   * This is a collection of functions that will handle replacing custom emotes
   * in chat with img tags
   *
   * What it does is grabs the last ".text" chat element and processes it
   * by only looking at TextNodes. This way we can avoid any clashes with
   * existing emoji in image tag titles/alt attributes
   */
  /**
   * return the last chat item in the chat area
   * this item could have a collection of <p> tags or just one
   */

  function getLatestChatNode() {
    var list = document.querySelectorAll(".chat-main .text");

    if (list.length > 0) {
      return list[list.length - 1];
    }

    return null;
  }
  /**
   * Searchs for all text nodes starting at a given Node
   * src: https://stackoverflow.com/a/10730777/395414
   * @param {HTMLElement} el parent node to begin searching for text nodes from
   * @returns {array} of text nodes
   */

  function getTextNodesUnder(el) {
    var n;
    var a = [];
    var walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);

    while (n = walk.nextNode()) {
      a.push(n);
    }

    return a;
  }
  function makeEmoteImg(_ref) {
    var type = _ref.type,
        src = _ref.src,
        name = _ref.name,
        w = _ref.w,
        h = _ref.h;
    var img = document.createElement("img");

    if (w) {
      img.width = w;
    }

    if (h) {
      img.height = h;
    }

    img.className = "emoji ".concat(type, "-emote");
    img.title = name;
    img.alt = name;
    img.src = src;
    return img;
  }
  /**
   * Search our stored emote data for matching emotes. Grab first match and return
   * it. It checks in this specific order:  twitch, bttv, tasty
   * @param {String} emote the emote to look for
   * @returns {Object} the emote data {type: String, src: String, name: String}
   */

  function getImageDataForEmote(emote) {
    // search emotes in order of preference
    var key = emote.replace(/^:|:$/g, "");

    if (twitch.emotes[key]) {
      return {
        type: "twitch",
        src: twitch.template(twitch.emotes[key]),
        name: key
      };
    }

    if (bttv.emotes[key]) {
      return {
        type: "bttv",
        src: bttv.template(bttv.emotes[key]),
        name: key
      };
    }

    return false;
  }
  /**
   * Take a text node and converts it into a complex mix of text and img nodes
   * @param {Node_Text} textNode a DOM text node
   * @param {Array} emoteMatches Array of matching emotes found in the string
   */

  function processTextNode(textNode, emoteMatches) {
    var parent = textNode.parentNode;
    var textNodeVal = textNode.nodeValue.trim();
    var fragment = document.createDocumentFragment(); // wrap emotes within text node value with a random & unique string that will
    // be removed by string.split

    var splitter = "-0wrap__emote0-"; // Search matches emotes from one of the apis
    // and setup the textNodeVal to make it easy to find them

    emoteMatches.forEach(function (m) {
      var imgData = getImageDataForEmote(m);

      if (imgData) {
        var d = JSON.stringify(imgData);
        textNodeVal = textNodeVal.replace(m, "".concat(splitter).concat(d).concat(splitter));
      }
    }); // split the new string, create either text nodes or new img nodes

    var nodeArr = textNodeVal.split(splitter);
    nodeArr.forEach(function (t) {
      try {
        // if it is a json object then we convert to image
        var imgdata = JSON.parse(t);
        var img = makeEmoteImg(imgdata);
        fragment.appendChild(img);
      } catch (e) {
        // otherwise it's just a normal text node
        fragment.appendChild(document.createTextNode(t));
      }
    });
    parent.replaceChild(fragment, textNode);
  }
  function beginReplace(nodeStart) {
    if (!nodeStart.nodeType) {
      nodeStart = getLatestChatNode();
    }

    if (!nodeStart) {
      return;
    }

    var texts = getTextNodesUnder(nodeStart);
    texts.forEach(function (t) {
      var val = t.nodeValue.trim();

      if (val === "") {
        return;
      }

      var found = parser(val);

      if (found.length === 0) {
        return;
      }

      processTextNode(t, found);
    });
  }

  /**********************************************************************
   * handles replacing twitch emotes in the chat box with the images
   */

  var Emotes =
  /*#__PURE__*/
  function (_Component) {
    _inherits(Emotes, _Component);

    function Emotes() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, Emotes);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Emotes)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "turnOn", function () {
        // only needs to load twitch emotes into memory once per page load
        if (!twitch.loaded) {
          // spin logo to indicate emotes are still loading
          document.body.classList.add('dubplus-icon-spinning'); // bttv emotes load in a few ms

          bttv.load(); // there are thousands upon thousands of twitch emotes so they
          // take a lot longer to load.

          twitch.done(_this.begin);
          twitch.load();
          return;
        }

        _this.begin();
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "turnOff", function (e) {
        Dubtrack.Events.unbind("realtime:chat-message", beginReplace);
      });

      return _this;
    }

    _createClass(Emotes, [{
      key: "begin",
      value: function begin() {
        document.body.classList.remove('dubplus-icon-spinning'); // when first turning it on, it replaces ALL of the emotes in chat history

        beginReplace(document.querySelector('.chat-main')); // then it sets up replacing emotes on new chat messages

        Dubtrack.Events.bind("realtime:chat-message", beginReplace);
      }
    }, {
      key: "render",
      value: function render$$1(props, state) {
        return h(MenuSwitch, {
          id: "dubplus-emotes",
          section: "General",
          menuTitle: "Emotes",
          desc: "Adds twitch and bttv emotes in chat.",
          turnOn: this.turnOn,
          turnOff: this.turnOff
        });
      }
    }]);

    return Emotes;
  }(Component);

  /**
   * Custom mentions
   */

  var CustomMentions =
  /*#__PURE__*/
  function (_Component) {
    _inherits(CustomMentions, _Component);

    function CustomMentions() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, CustomMentions);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(CustomMentions)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "customMentionCheck", function (e) {
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
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "saveCustomMentions", function (val) {
        if (val !== '') {
          // TODO: save to global state
          userSettings.save('custom', 'custom_mentions', val);
        }
      });

      return _this;
    }

    _createClass(CustomMentions, [{
      key: "turnOn",
      value: function turnOn() {
        Dubtrack.Events.bind("realtime:chat-message", this.customMentionCheck);
      }
    }, {
      key: "turnOff",
      value: function turnOff() {
        Dubtrack.Events.unbind("realtime:chat-message", this.customMentionCheck);
      }
    }, {
      key: "render",
      value: function render$$1(props, state) {
        return h(MenuSwitch, {
          id: "custom_mentions",
          section: "General",
          menuTitle: "Custom Mentions",
          desc: "Toggle using custom mentions to trigger sounds in chat",
          turnOn: this.turnOn,
          turnOff: this.turnOff
        }, h(MenuPencil, {
          title: "Custom AFK Message",
          section: "General",
          content: "Add your custom mention triggers here (separate by comma)",
          value: userSettings.stored.custom.custom_mentions || '',
          placeholder: "separate, custom triggers, by, comma, :heart:",
          maxlength: "255",
          onConfirm: this.saveCustomMentions
        }));
      }
    }]);

    return CustomMentions;
  }(Component);

  /**
   * Menu item for ChatCleaner
   */

  var ChatCleaner =
  /*#__PURE__*/
  function (_Component) {
    _inherits(ChatCleaner, _Component);

    function ChatCleaner() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, ChatCleaner);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ChatCleaner)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "chatCleanerCheck", function (e) {
        var totalChats = Array.from(document.querySelectorAll("ul.chat-main > li"));
        var max = parseInt(userSettings.stored.custom.chat_cleaner, 10);

        if (isNaN(totalChats.length) || isNaN(max) || !totalChats.length || totalChats.length < max) {
          return;
        }

        var parentUL = totalChats[0].parentElement;
        totalChats.slice(0, max).forEach(function (li, i) {
          parentUL.removeChild(li);
        }); // Fix scroll bar

        $(".chat-messages").perfectScrollbar("update");
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "saveAmount", function (value) {
        var chatItems = parseInt(value, 10);
        var amount = !isNaN(chatItems) ? chatItems : 500;
        userSettings.save("custom", "chat_cleaner", amount); // default to 500
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "turnOn", function () {
        Dubtrack.Events.bind("realtime:chat-message", _this.chatCleanerCheck);
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "turnOff", function () {
        Dubtrack.Events.unbind("realtime:chat-message", _this.chatCleanerCheck);
      });

      return _this;
    }

    _createClass(ChatCleaner, [{
      key: "render",
      value: function render$$1() {
        return h(MenuSwitch, {
          id: "chat-cleaner",
          section: "General",
          menuTitle: "Chat Cleaner",
          desc: "Automatically only keep a designated chatItems of chat items while clearing older ones, keeping CPU stress down",
          turnOn: this.turnOn,
          turnOff: this.turnOff
        }, h(MenuPencil, {
          title: "Chat Cleaner",
          section: "General",
          content: "Please specify the number of most recent chat items that will remain in your chat history",
          value: userSettings.stored.custom.chat_cleaner || "",
          placeholder: "500",
          maxlength: "5",
          onConfirm: this.saveAmount
        }));
      }
    }]);

    return ChatCleaner;
  }(Component);

  /* global Dubtrack */
  var isActiveTab = true;
  var statuses = {
    denyDismiss: {
      title: "Desktop Notifications",
      content: "You have dismissed or chosen to deny the request to allow desktop notifications. Reset this choice by clearing your cache for the site."
    },
    noSupport: {
      title: "Desktop Notifications",
      content: "Sorry this browser does not support desktop notifications.  Please use the latest version of Chrome or FireFox"
    }
  };

  window.onfocus = function () {
    isActiveTab = true;
  };

  window.onblur = function () {
    isActiveTab = false;
  };

  function notifyCheckPermission(cb) {
    var _cb = typeof cb === 'function' ? cb : function () {}; // first check if browser supports it


    if (!("Notification" in window)) {
      return _cb(false, statuses.noSupport);
    } // no request needed, good to go


    if (Notification.permission === "granted") {
      return _cb(true, 'granted');
    }

    if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(function (result) {
        if (result === 'denied' || result === 'default') {
          _cb(false, statuses.denyDismiss);

          return;
        }

        return _cb(true, 'granted');
      });
    } else {
      return _cb(false, statuses.denyDismiss);
    }
  }
  function showNotification(opts) {
    var defaults = {
      title: 'New Message',
      content: '',
      ignoreActiveTab: false,
      callback: null,
      wait: 5000
    };
    var options = Object.assign({}, defaults, opts); // don't show a notification if tab is active

    if (isActiveTab === true && !options.ignoreActiveTab) {
      return;
    }

    var notificationOptions = {
      body: options.content,
      icon: "https://res.cloudinary.com/hhberclba/image/upload/c_lpad,h_100,w_100/v1400351432/dubtrack_new_logo_fvpxa6.png"
    };
    var n = new Notification(options.title, notificationOptions);

    n.onclick = function () {
      window.focus();

      if (typeof options.callback === "function") {
        options.callback();
      }

      n.close();
    };

    setTimeout(n.close.bind(n), options.wait);
  }

  var ChatNotification =
  /*#__PURE__*/
  function (_Component) {
    _inherits(ChatNotification, _Component);

    function ChatNotification() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, ChatNotification);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ChatNotification)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
        showWarning: false,
        warnTitle: '',
        warnContent: ''
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "turnOn", function () {
        notifyCheckPermission(function (status, reason) {
          if (status === true) {
            Dubtrack.Events.bind("realtime:chat-message", _this.notifyOnMention);
          } else {
            // call MenuSwitch's switchOff with noTrack=true argument
            _this.switchRef.switchOff(true);

            _this.setState({
              showWarning: true,
              warnTitle: reason.title,
              warnContent: reason.content
            });
          }
        });
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "closeModal", function () {
        _this.setState({
          showWarning: false
        });
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "turnOff", function () {
        Dubtrack.Events.unbind("realtime:chat-message", _this.notifyOnMention);
      });

      return _this;
    }

    _createClass(ChatNotification, [{
      key: "notifyOnMention",
      value: function notifyOnMention(e) {
        var content = e.message;
        var user = Dubtrack.session.get("username").toLowerCase();
        var mentionTriggers = ["@" + user];

        if (userSettings.stored.options.custom_mentions && userSettings.stored.custom.custom_mentions) {
          //add custom mention triggers to array
          mentionTriggers = mentionTriggers.concat(userSettings.stored.custom.custom_mentions.split(","));
        }

        var mentionTriggersTest = mentionTriggers.some(function (v) {
          var reg = new RegExp("\\b" + v.trim() + "\\b", "i");
          return reg.test(content);
        });

        if (mentionTriggersTest && !this.isActiveTab && Dubtrack.session.id !== e.user.userInfo.userid) {
          showNotification({
            title: "Message from ".concat(e.user.username),
            content: content
          });
        }
      }
    }, {
      key: "render",
      value: function render$$1(props, state) {
        var _this2 = this;

        return h(MenuSwitch, {
          ref: function ref(s) {
            return _this2.switchRef = s;
          },
          id: "mention_notifications",
          section: "General",
          menuTitle: "Notification on Mentions",
          desc: "Enable desktop notifications when a user mentions you in chat",
          turnOn: this.turnOn,
          turnOff: this.turnOff
        }, h(Modal, {
          open: state.showWarning,
          title: state.warnTitle,
          content: state.warnContent,
          onClose: this.closeModal
        }));
      }
    }]);

    return ChatNotification;
  }(Component);

  var PMNotifications =
  /*#__PURE__*/
  function (_Component) {
    _inherits(PMNotifications, _Component);

    function PMNotifications() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, PMNotifications);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(PMNotifications)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
        showWarning: false,
        warnTitle: "",
        warnContent: ""
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "turnOn", function () {
        notifyCheckPermission(function (status, reason) {
          if (status === true) {
            Dubtrack.Events.bind("realtime:new-message", _this.notify);
          } else {
            // call MenuSwitch's switchOff with noTrack=true argument
            _this.switchRef.switchOff(true);

            _this.setState({
              showWarning: true,
              warnTitle: reason.title,
              warnContent: reason.content
            });
          }
        });
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "closeModal", function () {
        _this.setState({
          showWarning: false
        });
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "turnOff", function () {
        Dubtrack.Events.unbind("realtime:new-message", _this.notify);
      });

      return _this;
    }

    _createClass(PMNotifications, [{
      key: "notify",
      value: function notify(e) {
        var userid = Dubtrack.session.get("_id");

        if (userid === e.userid) {
          return;
        }

        showNotification({
          title: "You have a new PM",
          ignoreActiveTab: true,
          callback: function callback() {
            document.querySelector(".user-messages").click();
            setTimeout(function () {
              document.querySelector(".message-item[data-messageid=\"".concat(e.messageid, "\"]")).click();
            }, 500);
          },
          wait: 10000
        });
      }
    }, {
      key: "render",
      value: function render$$1(props, state) {
        var _this2 = this;

        return h(MenuSwitch, {
          ref: function ref(s) {
            return _this2.switchRef = s;
          },
          id: "dubplus_pm_notifications",
          section: "General",
          menuTitle: "Notification on PM",
          desc: "Enable desktop notifications when a user receives a private message",
          turnOn: this.turnOn,
          turnOff: this.turnOff
        }, h(Modal, {
          open: state.showWarning,
          title: state.warnTitle,
          content: state.warnContent,
          onClose: this.closeModal
        }));
      }
    }]);

    return PMNotifications;
  }(Component);

  var DJNotification =
  /*#__PURE__*/
  function (_Component) {
    _inherits(DJNotification, _Component);

    function DJNotification() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, DJNotification);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(DJNotification)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
        canNotify: false
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "savePosition", function (value) {
        var int = parseInt(value, 10);
        var amount = !isNaN(int) ? int : 2;
        userSettings.save("custom", "dj_notification", amount);
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "djNotificationCheck", function (e) {
        if (e.startTime > 2) return;
        var queuePos = document.querySelector(".queue-position").textContent;
        var positionParse = parseInt(queuePos, 10);
        var position = e.startTime < 0 && !isNaN(positionParse) ? positionParse - 1 : positionParse;
        if (isNaN(positionParse) || position !== userSettings.stored.custom.dj_notification) return;

        if (_this.canNotify) {
          showNotification({
            title: "DJ Alert!",
            content: "You will be DJing shortly! Make sure your song is set!",
            ignoreActiveTab: true,
            wait: 10000
          });
        }

        Dubtrack.room.chat.mentionChatSound.play();
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "turnOn", function () {
        notifyCheckPermission(function (status, reason) {
          if (status === true) {
            _this.setState({
              canNotify: true
            });
          }
        });
        Dubtrack.Events.bind("realtime:room_playlist-update", _this.djNotificationCheck);
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "turnOff", function () {
        Dubtrack.Events.unbind("realtime:room_playlist-update", _this.djNotificationCheck);
      });

      return _this;
    }

    _createClass(DJNotification, [{
      key: "render",
      value: function render$$1(props, state) {
        var _this2 = this;

        return h(MenuSwitch, {
          ref: function ref(s) {
            return _this2.switchRef = s;
          },
          id: "dj-notification",
          section: "General",
          menuTitle: "DJ Notification",
          desc: "Notification when you are coming up to be the DJ",
          turnOn: this.turnOn,
          turnOff: this.turnOff
        }, h(MenuPencil, {
          title: "DJ Notification",
          section: "General",
          content: "Please specify the position in queue you want to be notified at",
          value: userSettings.stored.custom.dj_notification || "",
          placeholder: "2",
          maxlength: "2",
          onConfirm: this.savePosition
        }));
      }
    }]);

    return DJNotification;
  }(Component);

  /**
   * Menu item for Rain
   */

  var SnowSwitch =
  /*#__PURE__*/
  function (_Component) {
    _inherits(SnowSwitch, _Component);

    function SnowSwitch() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, SnowSwitch);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(SnowSwitch)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "turnOn", function () {
        if (!$.snowfall) {
          // only pull in the script once if it doesn't exist 
          getScript("https://cdn.jsdelivr.net/gh/loktar00/JQuery-Snowfall/src/snowfall.jquery.js", function (err) {
            if (err) {
              _this.switchRef.switchOff(true);

              console.error("Could not load snowfall jquery plugin", err);
              return;
            }

            _this.doSnow();
          });
        } else {
          _this.doSnow();
        }
      });

      return _this;
    }

    _createClass(SnowSwitch, [{
      key: "doSnow",
      value: function doSnow() {
        $(document).snowfall({
          round: true,
          shadow: true,
          flakeCount: 50,
          minSize: 1,
          maxSize: 5,
          minSpeed: 5,
          maxSpeed: 5
        });
      }
    }, {
      key: "turnOff",
      value: function turnOff() {
        if ($.snowfall) {
          // checking to avoid errors if you quickly switch it on/off before plugin
          // is loaded in the turnOn function
          $(document).snowfall("clear");
        }
      }
    }, {
      key: "render",
      value: function render$$1() {
        var _this2 = this;

        return h(MenuSwitch, {
          ref: function ref(s) {
            return _this2.switchRef = s;
          },
          id: "dubplus-snow",
          section: "General",
          menuTitle: "Snow",
          desc: "Make it snow!",
          turnOn: this.turnOn,
          turnOff: this.turnOff
        });
      }
    }]);

    return SnowSwitch;
  }(Component);

  var rain = {}; // Rain settings

  rain.particles = [];
  rain.drops = [];
  rain.numbase = 5;
  rain.numb = 2;
  rain.height = 0; // We can update these realtime

  rain.controls = {
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

  rain.init = function () {
    var canvas = document.createElement("canvas");
    canvas.id = "dubPlusRainCanvas";
    canvas.style.cssText = "position : fixed; top : 0px; left : 0px; z-index: 100; pointer-events:none;";
    document.body.insertBefore(canvas, document.body.childNodes[0]);
    this.bindCanvas();
  }; // this function will be run on each click of the menu


  rain.destroy = function () {
    document.body.removeChild(document.getElementById("dubPlusRainCanvas"));
    this.unbindCanvas();
  };

  rain.bindCanvas = function () {
    this.requestAnimFrame = function () {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };
    }();

    var canvas = document.getElementById("dubPlusRainCanvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    this.width, this.height = 0;

    window.onresize = function onresize() {
      this.width = canvas.width = window.innerWidth;
      this.height = canvas.height = window.innerHeight;
    };

    window.onresize();
    this.particles, this.drops = [];
    this.numbase = 5;
    this.numb = 2;

    var that = this;

    (function boucle() {
      that.requestAnimFrame(boucle);
      that.update();
      that.rendu(ctx);
    })();
  };

  rain.buildRainParticle = function (X, Y, num) {
    if (!num) {
      num = this.numb;
    }

    while (num--) {
      this.particles.push({
        speedX: Math.random() * 0.25,
        speedY: Math.random() * 9 + 1,
        X: X,
        Y: Y,
        alpha: 1,
        color: "hsla(" + this.controls.color + "," + this.controls.saturation + "%, " + this.controls.lightness + "%," + this.controls.opacity + ")"
      });
    }
  };

  rain.explosion = function (X, Y, color, num) {
    if (!num) {
      num = this.numbase;
    }

    while (num--) {
      this.drops.push({
        speedX: Math.random() * 4 - 2,
        speedY: Math.random() * -4,
        X: X,
        Y: Y,
        radius: 0.65 + Math.floor(Math.random() * 1.6),
        alpha: 1,
        color: color
      });
    }
  };

  rain.rendu = function (ctx) {
    if (this.controls.multi == true) {
      this.controls.color = Math.random() * 360;
    }

    ctx.save();
    ctx.clearRect(0, 0, width, height);
    var particleslocales = this.particles;
    var dropslocales = this.drops;
    var tau = Math.PI * 2;

    for (var i = 0, particlesactives; particlesactives = particleslocales[i]; i++) {
      ctx.globalAlpha = particlesactives.alpha;
      ctx.fillStyle = particlesactives.color;
      ctx.fillRect(particlesactives.X, particlesactives.Y, particlesactives.speedY / 4, particlesactives.speedY);
    }

    for (var i = 0, dropsactives; dropsactives = dropslocales[i]; i++) {
      ctx.globalAlpha = dropsactives.alpha;
      ctx.fillStyle = dropsactives.color;
      ctx.beginPath();
      ctx.arc(dropsactives.X, dropsactives.Y, dropsactives.radius, 0, tau);
      ctx.fill();
    }

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.restore();
  };

  rain.update = function () {
    var particleslocales = this.particles;
    var dropslocales = this.drops;

    for (var i = 0, particlesactives; particlesactives = particleslocales[i]; i++) {
      particlesactives.X += particlesactives.speedX;
      particlesactives.Y += particlesactives.speedY + 5;

      if (particlesactives.Y > height - 15) {
        particleslocales.splice(i--, 1);
        this.explosion(particlesactives.X, particlesactives.Y, particlesactives.color);
      }
    }

    for (var i = 0, dropsactives; dropsactives = dropslocales[i]; i++) {
      dropsactives.X += dropsactives.speedX;
      dropsactives.Y += dropsactives.speedY;
      dropsactives.radius -= 0.075;

      if (dropsactives.alpha > 0) {
        dropsactives.alpha -= 0.005;
      } else {
        dropsactives.alpha = 0;
      }

      if (dropsactives.radius < 0) {
        dropslocales.splice(i--, 1);
      }
    }

    var i = this.controls.rain;

    while (i--) {
      this.buildRainParticle(Math.floor(Math.random() * width), -15);
    }
  };

  rain.unbindCanvas = function () {
    this.requestAnimFrame = function () {};
  };

  /**
   * Menu item for Rain
   */

  var RainSwitch =
  /*#__PURE__*/
  function (_Component) {
    _inherits(RainSwitch, _Component);

    function RainSwitch() {
      _classCallCheck(this, RainSwitch);

      return _possibleConstructorReturn(this, _getPrototypeOf(RainSwitch).apply(this, arguments));
    }

    _createClass(RainSwitch, [{
      key: "turnOn",
      value: function turnOn() {
        rain.init();
      }
    }, {
      key: "turnOff",
      value: function turnOff() {
        rain.destroy();
      }
    }, {
      key: "render",
      value: function render$$1(props, state) {
        return h(MenuSwitch, {
          id: "dubplus-rain",
          section: "General",
          menuTitle: "Rain",
          desc: "Make it rain!",
          turnOn: this.turnOn,
          turnOff: this.turnOff
        });
      }
    }]);

    return RainSwitch;
  }(Component);

  /**
   * Check if a user is at least a mod or above
   */

  /*global Dubtrack */
  function modCheck(userid) {
    return Dubtrack.helpers.isDubtrackAdmin(userid) || Dubtrack.room.users.getIfOwner(userid) || Dubtrack.room.users.getIfManager(userid) || Dubtrack.room.users.getIfMod(userid);
  }

  var DubsInfoListItem = function DubsInfoListItem(_ref) {
    var data = _ref.data,
        click = _ref.click;
    return h("li", {
      onClick: function onClick() {
        return click("@" + data.username + " ");
      },
      className: "dubinfo-preview-item"
    }, h("div", {
      className: "dubinfo-image"
    }, h("img", {
      src: "https://api.dubtrack.fm/user/".concat(data.userid, "/image")
    })), h("span", {
      className: "dubinfo-text"
    }, "@", data.username));
  };
  /**
   * DubsInfo component
   * used to create the grabs, upDubs, and downdubs lists that popup when
   * hovering each of them.
   */


  var DubsInfo =
  /*#__PURE__*/
  function (_Component) {
    _inherits(DubsInfo, _Component);

    function DubsInfo() {
      _classCallCheck(this, DubsInfo);

      return _possibleConstructorReturn(this, _getPrototypeOf(DubsInfo).apply(this, arguments));
    }

    _createClass(DubsInfo, [{
      key: "getBgColor",
      value: function getBgColor() {
        var whichVote = this.props.type.replace("dubs", "");
        var elem;

        if (whichVote === "up") {
          elem = document.querySelector(".dubup");
        } else if (whichVote === "down") {
          elem = document.querySelector(".dubdown");
        } else {
          return;
        }

        var bgColor = elem.classList.contains("voted") ? window.getComputedStyle(elem).backgroundColor : window.getComputedStyle(elem.querySelector(".icon-".concat(whichVote, "vote"))).color;
        return bgColor;
      }
    }, {
      key: "updateChat",
      value: function updateChat(str) {
        var chat = document.getElementById("chat-txt-message");
        chat.value = str;
        chat.focus();
      }
    }, {
      key: "makeList",
      value: function makeList() {
        var _this = this;

        return this.props.dubs.map(function (d, i) {
          return h(DubsInfoListItem, {
            data: d,
            click: _this.updateChat,
            key: "info-".concat(_this.props.type, "-").concat(i)
          });
        });
      }
    }, {
      key: "render",
      value: function render$$1(_ref2) {
        var type = _ref2.type,
            isMod = _ref2.isMod;
        var notYetMsg = "No ".concat(type, " have been casted yet!");

        if (type === "grabs") {
          notYetMsg = "This song hasn't been grabbed yet!";
        }

        var list = this.makeList();
        var containerCss = ["dubinfo-preview", "dubinfo-".concat(type)];

        if (list.length === 0) {
          list = h("li", {
            className: "dubinfo-preview-none"
          }, notYetMsg);
          containerCss.push("dubinfo-no-dubs");
        }

        if (type === 'downdubs' && !isMod) {
          containerCss.push("dubinfo-unauthorized");
        }

        return h("ul", {
          style: {
            borderColor: this.getBgColor()
          },
          className: containerCss.join(" ")
        }, list);
      }
    }]);

    return DubsInfo;
  }(Component);

  var ShowDubsOnHover =
  /*#__PURE__*/
  function (_Component) {
    _inherits(ShowDubsOnHover, _Component);

    function ShowDubsOnHover() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, ShowDubsOnHover);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ShowDubsOnHover)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
        isOn: false,
        showWarning: false,
        upDubs: [],
        downDubs: [],
        grabs: []
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "userIsMod", modCheck(Dubtrack.session.id));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "turnOn", function () {
        _this.setState({
          isOn: true
        }, _this.resetDubs);

        Dubtrack.Events.bind("realtime:room_playlist-dub", _this.dubWatcher);
        Dubtrack.Events.bind("realtime:room_playlist-queue-update-grabs", _this.grabWatcher);
        Dubtrack.Events.bind("realtime:user-leave", _this.dubUserLeaveWatcher);
        Dubtrack.Events.bind("realtime:room_playlist-update", _this.resetDubs);
        Dubtrack.Events.bind("realtime:room_playlist-update", _this.resetGrabs);
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "turnOff", function () {
        _this.setState({
          isOn: false
        });

        Dubtrack.Events.unbind("realtime:room_playlist-dub", _this.dubWatcher);
        Dubtrack.Events.unbind("realtime:room_playlist-queue-update-grabs", _this.grabWatcher);
        Dubtrack.Events.unbind("realtime:user-leave", _this.dubUserLeaveWatcher);
        Dubtrack.Events.unbind("realtime:room_playlist-update", _this.resetDubs); //TODO: Remove when we can hit the api for all grabs of current playing song

        Dubtrack.Events.unbind("realtime:room_playlist-update", _this.resetGrabs);
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "closeModal", function () {
        _this.setState({
          showWarning: false
        });
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "dubWatcher", function (e) {
        var _this$state = _this.state,
            upDubs = _this$state.upDubs,
            downDubs = _this$state.downDubs;
        var user = {
          userid: e.user._id,
          username: e.user.username
        };

        if (e.dubtype === "updub") {
          var userNotUpdubbed = upDubs.filter(function (el) {
            return el.userid === e.user._id;
          }).length === 0; // If user has not updubbed, we add them them to it

          if (userNotUpdubbed) {
            _this.setState(function (prevState) {
              return {
                upDubs: [].concat(_toConsumableArray(prevState.upDubs), [user])
              };
            });
          }

          var userDowndubbed = downDubs.filter(function (el) {
            return el.userid === e.user._id;
          }).length > 0; // if user was previous in downdubs then remove them from downdubs

          if (userDowndubbed) {
            _this.setState(function (prevState) {
              return {
                downDubs: prevState.downDubs.filter(function (el) {
                  return el.userid !== e.user._id;
                })
              };
            });
          }
        }

        if (e.dubtype === "downdub") {
          var userNotDowndub = downDubs.filter(function (el) {
            return el.userid === e.user._id;
          }).length === 0; // is user has not downdubbed, then we add them

          if (userNotDowndub && _this.userIsMod) {
            _this.setState(function (prevState) {
              return {
                downDubs: [].concat(_toConsumableArray(prevState.downDubs), [user])
              };
            });
          } //Remove user from from updubs


          var userUpdubbed = upDubs.filter(function (el) {
            return el.userid === e.user._id;
          }).length > 0; // and then remove them from downdubs

          if (userUpdubbed) {
            _this.setState(function (prevState) {
              return {
                upDubs: prevState.upDubs.filter(function (el) {
                  return el.userid !== e.user._id;
                })
              };
            });
          }
        }
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "grabWatcher", function (e) {
        // only add Grab if it doesn't exist in the array already
        if (_this.state.grabs.filter(function (el) {
          return el.userid === e.user._id;
        }).length <= 0) {
          var user = {
            userid: e.user._id,
            username: e.user.username
          };

          _this.setState(function (prevState) {
            return {
              grabs: [].concat(_toConsumableArray(prevState.grabs), [user])
            };
          });
        }
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "dubUserLeaveWatcher", function (e) {
        var newUpDubs = _this.state.upDubs.filter(function (el) {
          return el.userid !== e.user._id;
        });

        var newDownDubs = _this.state.downDubs.filter(function (el) {
          return el.userid !== e.user._id;
        });

        var newGrabs = _this.state.grabs.filter(function (el) {
          return el.userid !== e.user._id;
        });

        _this.setState({
          upDubs: newUpDubs,
          downDubs: newDownDubs,
          grabs: newGrabs
        });
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "resetDubs", function () {
        _this.setState({
          upDubs: [],
          downDubs: []
        }, _this.handleReset);
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "resetGrabs", function () {
        _this.setState({
          grabs: []
        });
      });

      return _this;
    }

    _createClass(ShowDubsOnHover, [{
      key: "handleReset",

      /**
       * Callback for resetDubs()'s setState
       * Wipes out local state and repopulates with data from the api
       */
      value: function handleReset() {
        var _this2 = this;

        // get the current active dubs in the room via api
        var dubsURL = "https://api.dubtrack.fm/room/".concat(Dubtrack.room.model.id, "/playlist/active/dubs");
        var roomDubs = getJSON(dubsURL);
        roomDubs.then(function (json) {
          // loop through all the upDubs in the room and add them to our local state
          if (json.data && json.data.upDubs) {
            json.data.upDubs.forEach(function (e) {
              // Dub already casted (usually from autodub)
              if (_this2.state.upDubs.filter(function (el) {
                return el.userid === e.userid;
              }).length > 0) {
                return;
              } // to get username we check for user info in the DT room's user collection


              var checkUser = Dubtrack.room.users.collection.findWhere({
                userid: e.userid
              });

              if (!checkUser || !checkUser.attributes) {
                // if they don't exist, we can check the user api directly
                var userInfo = getJSON("https://api.dubtrack.fm/user/" + e.userid);
                userInfo.then(function (json2) {
                  var data = json2.data;

                  if (data && data.userinfo && data.userinfo.username) {
                    var user = {
                      userid: e.userid,
                      username: data.userinfo.username
                    };

                    _this2.setState(function (prevState) {
                      return {
                        upDubs: [].concat(_toConsumableArray(prevState.upDubs), [user])
                      };
                    });
                  }
                });
                return;
              }

              if (checkUser.attributes._user.username) {
                var user = {
                  userid: e.userid,
                  username: checkUser.attributes._user.username
                };

                _this2.setState(function (prevState) {
                  return {
                    upDubs: [].concat(_toConsumableArray(prevState.upDubs), [user])
                  };
                });
              }
            });
          } //Only let mods or higher access down dubs


          if (json.data && json.data.downDubs && _this2.userIsMod) {
            json.data.downDubs.forEach(function (e) {
              //Dub already casted
              if (_this2.state.downDubs.filter(function (el) {
                return el.userid === e.userid;
              }).length > 0) {
                return;
              }

              var checkUsers = Dubtrack.room.users.collection.findWhere({
                userid: e.userid
              });

              if (!checkUsers || !checkUsers.attributes) {
                var userInfo = getJSON("https://api.dubtrack.fm/user/" + e.userid);
                userInfo.then(function (json3) {
                  var data = json3.data;

                  if (data && data.userinfo && data.userinfo.username) {
                    var user = {
                      userid: e.userid,
                      username: data.userinfo.username
                    };

                    _this2.setState(function (prevState) {
                      return {
                        downDubs: [].concat(_toConsumableArray(prevState.downDubs), [user])
                      };
                    });
                  }
                });
                return;
              }

              if (checkUsers.attributes._user.username) {
                var user = {
                  userid: e.userid,
                  username: checkUsers.attributes._user.username
                };

                _this2.setState(function (prevState) {
                  return {
                    downDubs: [].concat(_toConsumableArray(prevState.downDubs), [user])
                  };
                });
              }
            });
          }
        });
      }
    }, {
      key: "componentWillMount",
      value: function componentWillMount() {
        this.upElem = document.querySelector(".dubup").parentElement;
        this.upElem.classList.add('dubplus-updub-btn');
        this.downElem = document.querySelector(".dubdown").parentElement;
        this.downElem.classList.add('dubplus-downdub-btn');
        this.grabElem = document.querySelector(".add-to-playlist-button").parentElement;
        this.grabElem.classList.add('dubplus-grab-btn');
      }
    }, {
      key: "render",
      value: function render$$1(props, state) {
        return h(MenuSwitch, {
          id: "dubplus-dubs-hover",
          section: "General",
          menuTitle: "Show Dub info on Hover",
          desc: "Show Dub info on Hover.",
          turnOn: this.turnOn,
          turnOff: this.turnOff
        }, h(Modal, {
          open: state.showWarning,
          title: "Vote & Grab Info",
          content: "Please note that this feature is currently still in development. We are waiting on the ability to pull grab vote information from Dubtrack on load. Until then the only grabs you will be able to see are those you are present in the room for.",
          onClose: this.closeModal
        }), state.isOn ? h("span", null, h(Portal, {
          into: this.upElem
        }, h(DubsInfo, {
          type: "updubs",
          dubs: state.upDubs
        })), h(Portal, {
          into: this.downElem
        }, h(DubsInfo, {
          type: "downdubs",
          isMod: this.userIsMod,
          dubs: state.downDubs
        })), h(Portal, {
          into: this.grabElem
        }, h(DubsInfo, {
          type: "grabs",
          dubs: state.grabs
        }))) : null);
      }
    }]);

    return ShowDubsOnHover;
  }(Component);

  function chatMessage(username, song) {
    var li = document.createElement('li');
    li.className = "dubplus-chat-system dubplus-chat-system-downdub";
    var div = document.createElement('div');
    div.className = "chatDelete";

    div.onclick = function (e) {
      return e.currentTarget.parentElement.remove();
    };

    var span = document.createElement('span');
    span.className = "icon-close";
    var text = document.createElement('div');
    text.className = "text";
    text.textContent = "@".concat(username, " has downdubbed your song ").concat(song);
    div.appendChild(span);
    li.appendChild(div);
    li.appendChild(text);
    return li;
  }

  var DowndubInChat =
  /*#__PURE__*/
  function (_Component) {
    _inherits(DowndubInChat, _Component);

    function DowndubInChat() {
      _classCallCheck(this, DowndubInChat);

      return _possibleConstructorReturn(this, _getPrototypeOf(DowndubInChat).apply(this, arguments));
    }

    _createClass(DowndubInChat, [{
      key: "turnOn",
      value: function turnOn() {
        if (!modCheck(Dubtrack.session.id)) {
          return;
        }

        Dubtrack.Events.bind("realtime:room_playlist-dub", this.downdubWatcher);
      }
    }, {
      key: "turnOff",
      value: function turnOff() {
        Dubtrack.Events.unbind("realtime:room_playlist-dub", this.downdubWatcher);
      }
    }, {
      key: "downdubWatcher",
      value: function downdubWatcher(e) {
        var user = Dubtrack.session.get("username");

        var currentDj = Dubtrack.room.users.collection.findWhere({
          userid: Dubtrack.room.player.activeSong.attributes.song.userid
        }).attributes._user.username;

        if (user === currentDj && e.dubtype === "downdub") {
          var newChat = chatMessage(e.user.username, Dubtrack.room.player.activeSong.attributes.songInfo.name);
          document.querySelector("ul.chat-main").appendChild(newChat);
        }
      }
    }, {
      key: "render",
      value: function render$$1() {
        return h(MenuSwitch, {
          id: "dubplus-downdubs",
          section: "General",
          menuTitle: "Downdubs in Chat (mods only)",
          desc: "Toggle showing downdubs in the chat box (mods only)",
          turnOn: this.turnOn,
          turnOff: this.turnOff
        });
      }
    }]);

    return DowndubInChat;
  }(Component);

  function chatMessage$1(username, song) {
    var li = document.createElement('li');
    li.className = "dubplus-chat-system dubplus-chat-system-updub";
    var div = document.createElement('div');
    div.className = "chatDelete";

    div.onclick = function (e) {
      return e.currentTarget.parentElement.remove();
    };

    var span = document.createElement('span');
    span.className = "icon-close";
    var text = document.createElement('div');
    text.className = "text";
    text.textContent = "@".concat(username, " has updubbed your song ").concat(song);
    div.appendChild(span);
    li.appendChild(div);
    li.appendChild(text);
    return li;
  }

  var UpdubsInChat =
  /*#__PURE__*/
  function (_Component) {
    _inherits(UpdubsInChat, _Component);

    function UpdubsInChat() {
      _classCallCheck(this, UpdubsInChat);

      return _possibleConstructorReturn(this, _getPrototypeOf(UpdubsInChat).apply(this, arguments));
    }

    _createClass(UpdubsInChat, [{
      key: "turnOn",
      value: function turnOn() {
        Dubtrack.Events.bind("realtime:room_playlist-dub", this.updubWatcher);
      }
    }, {
      key: "turnOff",
      value: function turnOff() {
        Dubtrack.Events.unbind("realtime:room_playlist-dub", this.updubWatcher);
      }
    }, {
      key: "updubWatcher",
      value: function updubWatcher(e) {
        var user = Dubtrack.session.get("username");

        var currentDj = Dubtrack.room.users.collection.findWhere({
          userid: Dubtrack.room.player.activeSong.attributes.song.userid
        }).attributes._user.username;

        if (user === currentDj && e.dubtype === "updub") {
          var newChat = chatMessage$1(e.user.username, Dubtrack.room.player.activeSong.attributes.songInfo.name);
          document.querySelector("ul.chat-main").appendChild(newChat);
        }
      }
    }, {
      key: "render",
      value: function render$$1() {
        return h(MenuSwitch, {
          id: "dubplus-updubs",
          section: "General",
          menuTitle: "Updubs in Chat",
          desc: "Toggle showing updubs in the chat box",
          turnOn: this.turnOn,
          turnOff: this.turnOff
        });
      }
    }]);

    return UpdubsInChat;
  }(Component);

  function chatMessage$2(username, song) {
    var li = document.createElement('li');
    li.className = "dubplus-chat-system dubplus-chat-system-grab";
    var div = document.createElement('div');
    div.className = "chatDelete";

    div.onclick = function (e) {
      return e.currentTarget.parentElement.remove();
    };

    var span = document.createElement('span');
    span.className = "icon-close";
    var text = document.createElement('div');
    text.className = "text";
    text.textContent = "@".concat(username, " has grabbed your song ").concat(song);
    div.appendChild(span);
    li.appendChild(div);
    li.appendChild(text);
    return li;
  }

  var GrabsInChat =
  /*#__PURE__*/
  function (_Component) {
    _inherits(GrabsInChat, _Component);

    function GrabsInChat() {
      _classCallCheck(this, GrabsInChat);

      return _possibleConstructorReturn(this, _getPrototypeOf(GrabsInChat).apply(this, arguments));
    }

    _createClass(GrabsInChat, [{
      key: "turnOn",
      value: function turnOn() {
        Dubtrack.Events.bind("realtime:room_playlist-queue-update-grabs", this.grabChatWatcher);
      }
    }, {
      key: "turnOff",
      value: function turnOff() {
        Dubtrack.Events.unbind("realtime:room_playlist-queue-update-grabs", this.grabChatWatcher);
      }
    }, {
      key: "grabChatWatcher",
      value: function grabChatWatcher(e) {
        var user = Dubtrack.session.get("username");

        var currentDj = Dubtrack.room.users.collection.findWhere({
          userid: Dubtrack.room.player.activeSong.attributes.song.userid
        }).attributes._user.username;

        if (user === currentDj && !Dubtrack.room.model.get('displayUserGrab')) {
          var newChat = chatMessage$2(e.user.username, Dubtrack.room.player.activeSong.attributes.songInfo.name);
          document.querySelector("ul.chat-main").appendChild(newChat);
        }
      }
    }, {
      key: "render",
      value: function render$$1() {
        return h(MenuSwitch, {
          id: "dubplus-grabschat",
          section: "General",
          menuTitle: "Grabs in Chat",
          desc: "Toggle showing grabs in the chat box",
          turnOn: this.turnOn,
          turnOff: this.turnOff
        });
      }
    }]);

    return GrabsInChat;
  }(Component);

  var GeneralSection = function GeneralSection() {
    return h(MenuSection, {
      id: "dubplus-general",
      title: "General",
      settingsKey: "general"
    }, h(Autovote, null), h(AFK, null), h(AutocompleteEmoji, null), h(Emotes, null), h(CustomMentions, null), h(ChatCleaner, null), h(ChatNotification, null), h(PMNotifications, null), h(DJNotification, null), h(ShowDubsOnHover, null), h(DowndubInChat, null), h(UpdubsInChat, null), h(GrabsInChat, null), h(SnowSwitch, null), h(RainSwitch, null));
  };

  /**
   * Fullscreen Video
   */

  function goFS() {
    var elem = document.querySelector("#room-main-player-container");

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

  var FullscreenVideo = function FullscreenVideo() {
    return h(MenuSimple, {
      id: "dubplus-fullscreen",
      section: "User Interface",
      menuTitle: "Fullscreen Video",
      desc: "Toggle fullscreen video mode",
      icon: "arrows-alt",
      onClick: goFS
    });
  };

  function turnOn() {
    document.body.classList.add('dubplus-split-chat');
  }

  function turnOff() {
    document.body.classList.remove('dubplus-split-chat');
  }
  /**
   * Split Chat
   */


  var SplitChat = function SplitChat() {
    return h(MenuSwitch, {
      id: "dubplus-split-chat",
      section: "User Interface",
      menuTitle: "Split Chat",
      desc: "Toggle Split Chat UI enhancement",
      turnOn: turnOn,
      turnOff: turnOff
    });
  };

  function turnOn$1() {
    document.body.classList.add('dubplus-video-only');
  }

  function turnOff$1() {
    document.body.classList.remove('dubplus-video-only');
  }
  /**
   * Hide Chat
   */


  var HideChat = function HideChat() {
    return h(MenuSwitch, {
      id: "dubplus-video-only",
      section: "User Interface",
      menuTitle: "Hide Chat",
      desc: "Toggles hiding the chat box",
      turnOn: turnOn$1,
      turnOff: turnOff$1
    });
  };

  function turnOn$2() {
    document.body.classList.add('dubplus-chat-only');
  }

  function turnOff$2() {
    document.body.classList.remove('dubplus-chat-only');
  }
  /**
   * Hide Video
   */


  var HideVideo = function HideVideo() {
    return h(MenuSwitch, {
      id: "dubplus-chat-only",
      section: "User Interface",
      menuTitle: "Hide Video",
      desc: "Toggles hiding the video box",
      turnOn: turnOn$2,
      turnOff: turnOff$2
    });
  };

  function turnOn$3() {
    document.body.classList.add('dubplus-hide-avatars');
  }

  function turnOff$3() {
    document.body.classList.remove('dubplus-hide-avatars');
  }
  /**
   * Hide Avatars
   */


  var HideAvatars = function HideAvatars() {
    return h(MenuSwitch, {
      id: "dubplus-hide-avatars",
      section: "User Interface",
      menuTitle: "Hide Avatars",
      desc: "Toggle hiding user avatars in the chat box.",
      turnOn: turnOn$3,
      turnOff: turnOff$3
    });
  };

  function turnOn$4() {
    document.body.classList.add('dubplus-hide-bg');
  }

  function turnOff$4() {
    document.body.classList.remove('dubplus-hide-bg');
  }
  /**
   * Hide Background
   */


  var HideBackground = function HideBackground() {
    return h(MenuSwitch, {
      id: "dubplus-hide-bg",
      section: "User Interface",
      menuTitle: "Hide Background",
      desc: "Toggle hiding background image.",
      turnOn: turnOn$4,
      turnOff: turnOff$4
    });
  };

  function turnOn$5() {
    document.body.classList.add('dubplus-show-timestamp');
  }

  function turnOff$5() {
    document.body.classList.remove('dubplus-show-timestamp');
  }

  var ShowTS = function ShowTS() {
    return h(MenuSwitch, {
      id: "dubplus-show-timestamp",
      section: "User Interface",
      menuTitle: "Show Timestamps",
      desc: "Toggle always showing chat message timestamps.",
      turnOn: turnOn$5,
      turnOff: turnOff$5
    });
  };

  var UISection = function UISection() {
    return h(MenuSection, {
      id: "dubplus-ui",
      title: "UI",
      settingsKey: "user-interface"
    }, h(FullscreenVideo, null), h(SplitChat, null), h(HideChat, null), h(HideVideo, null), h(HideAvatars, null), h(HideBackground, null), h(ShowTS, null));
  };

  function handleKeyup(e) {
    if ((e.keyCode || e.which) !== 32) {
      return;
    }

    var tag = event.target.tagName.toLowerCase();

    if (tag !== "input" && tag !== "textarea") {
      Dubtrack.room.player.mutePlayer();
    }
  }

  function turnOn$6() {
    document.addEventListener("keyup", handleKeyup);
  }

  function turnOff$6() {
    document.removeEventListener("keyup", handleKeyup);
  }

  var SpacebarMute = function SpacebarMute() {
    return h(MenuSwitch, {
      id: "dubplus-spacebar-mute",
      section: "Settings",
      menuTitle: "Spacebar Mute",
      desc: "Turn on/off the ability to mute current song with the spacebar.",
      turnOn: turnOn$6,
      turnOff: turnOff$6
    });
  };

  function unloader(e) {
    var confirmationMessage = "";
    e.returnValue = confirmationMessage;
    return confirmationMessage;
  }

  function turnOn$7() {
    window.addEventListener("beforeunload", unloader);
  }

  function turnOff$7() {
    window.removeEventListener("beforeunload", unloader);
  }

  var WarnNav = function WarnNav() {
    return h(MenuSwitch, {
      id: "warn_redirect",
      section: "Settings",
      menuTitle: "Warn On Navigation",
      desc: "Warns you when accidentally clicking on a link that takes you out of dubtrack.",
      turnOn: turnOn$7,
      turnOff: turnOff$7
    });
  };

  var SettingsSection = function SettingsSection() {
    return h(MenuSection, {
      id: "dubplus-settings",
      title: "Settings",
      settingsKey: "settings"
    }, h(SpacebarMute, null), h(WarnNav, null));
  };

  var makeLink = function makeLink(className, FileName) {
    var link = document.createElement('link');
    link.rel = "stylesheet";
    link.type = "text/css";
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

    var link = makeLink(className, userSettings.srcRoot + cssFile + "?" + 1548976215478);
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

  var css$2 = {
    load: load,
    loadExternal: loadExternal
  };

  function turnOn$8() {
    var location = Dubtrack.room.model.get("roomUrl");
    var roomAjax = getJSON("https://api.dubtrack.fm/room/" + location);
    roomAjax.then(function (json) {
      var content = json.data.description; // for backwards compatibility with dubx we're checking for both @dubx and @dubplus and @dub+

      var themeCheck = new RegExp(/(@dub(x|plus|\+)=)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/, "i");
      var communityCSSUrl = null;
      content.replace(themeCheck, function (match, p1, p2, p3) {
        console.log("loading community css theme:", p3);
        communityCSSUrl = p3;
      });

      if (!communityCSSUrl) {
        return;
      }

      css$2.loadExternal(communityCSSUrl, "dubplus-comm-theme");
    });
  }

  function turnOff$8() {
    var css = document.querySelector(".dubplus-comm-theme");

    if (css) {
      css.remove();
    }
  }

  var CommunityTheme = function CommunityTheme() {
    return h(MenuSwitch, {
      id: "dubplus-comm-theme",
      section: "Customize",
      menuTitle: "Community Theme",
      desc: "Toggle Community CSS theme.",
      turnOn: turnOn$8,
      turnOff: turnOff$8
    });
  };

  // import CustomBG from './custom-Background';
  // import CustomNotificaton from './custom-notification-sound';

  var CustomizeSection = function CustomizeSection() {
    return h(MenuSection, {
      id: "dubplus-customize",
      title: "Customize",
      settingsKey: "customize"
    }, h(CommunityTheme, null));
  };

  /**
   * DubPlus Menu Container
   */

  var DubPlusMenu = function DubPlusMenu() {
    setTimeout(function () {
      // load this async so it doesn't block the rest of the menu render
      // since these buttons are completely independent from the menu
      snooze$1();
      eta();
    }, 10);
    return h("section", {
      className: "dubplus-menu"
    }, h("p", {
      className: "dubplus-menu-header"
    }, "Dub+ Options"), h(GeneralSection, null), h(UISection, null), h(SettingsSection, null), h(CustomizeSection, null));
  };

  /**
   * Takes a string  representation of a variable or object and checks if it's
   * definied starting at provided scope or default to global window scope.
   * @param  {string} dottedString  the item you are looking for
   * @param  {var}    startingScope where to start looking
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
      interval: 500,
      // every XX ms we check to see if waitingFor is defined
      seconds: 15,
      // how many total seconds we wish to continue pinging
      isNode: false
    };

    var _cb = function _cb() {};

    var _failCB = function _failCB() {};

    var opts = Object.assign({}, defaults, options);
    var checkFunc = Array.isArray(waitingFor) ? arrayDeepCheck : deepCheck;

    if (opts.isNode) {
      checkFunc = function checkFunc(selector) {
        return typeof document.querySelector(selector) !== null;
      };
    }

    var tryCount = 0;
    var tryLimit = opts.seconds * 1000 / opts.interval; // how many intervals

    var check = function check() {
      tryCount++;

      var _test = checkFunc(waitingFor);

      if (_test) {
        return _cb();
      }

      if (tryCount < tryLimit) {
        window.setTimeout(check, opts.interval);
      } else {
        return _failCB();
      }
    };

    var then = function then(cb) {
      if (typeof cb === 'function') {
        _cb = cb;
      } // start the first one


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
    transition: 'right 200ms',
    cursor: 'pointer'
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

  var LoadingNotice =
  /*#__PURE__*/
  function (_Component) {
    _inherits(LoadingNotice, _Component);

    function LoadingNotice() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, LoadingNotice);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(LoadingNotice)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
        mainStyles: waitingStyles
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "dismiss", function () {
        _this.setState(function (prevState, props) {
          return {
            mainStyles: Object.assign({}, prevState.mainStyles, {
              right: '-250px'
            })
          };
        });
      });

      return _this;
    }

    _createClass(LoadingNotice, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this2 = this;

        setTimeout(function () {
          _this2.setState(function (prevState, props) {
            return {
              mainStyles: Object.assign({}, prevState.mainStyles, {
                right: '13px'
              })
            };
          });
        }, 200);
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.dismiss();
      }
    }, {
      key: "render",
      value: function render$$1(props, state) {
        return h("div", {
          style: state.mainStyles,
          onClick: this.dismiss
        }, h("div", {
          style: dpIcon
        }, h("img", {
          src: userSettings.srcRoot + '/images/dubplus.svg',
          alt: "DubPlus icon"
        })), h("span", {
          style: dpText
        }, props.text || 'Waiting for Dubtrack...'));
      }
    }]);

    return LoadingNotice;
  }(Component);

  var MenuIcon =
  /*#__PURE__*/
  function (_Component) {
    _inherits(MenuIcon, _Component);

    function MenuIcon() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, MenuIcon);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(MenuIcon)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
        open: false
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "toggle", function () {
        var menu = document.querySelector('.dubplus-menu');

        if (_this.state.open) {
          menu.classList.remove('dubplus-menu-open');

          _this.setState({
            open: false
          });
        } else {
          menu.classList.add('dubplus-menu-open');

          _this.setState({
            open: true
          });
        }
      });

      return _this;
    }

    _createClass(MenuIcon, [{
      key: "render",
      value: function render$$1(props, state) {
        return h("div", {
          className: "dubplus-icon",
          onClick: this.toggle
        }, h("img", {
          src: "".concat(userSettings.srcRoot, "/images/dubplus.svg"),
          alt: "DubPlus Icon"
        }));
      }
    }]);

    return MenuIcon;
  }(Component);

  polyfills(); // the extension loads the CSS from the load script so we don't need to 
  // do it here. This is for people who load the script via bookmarklet or userscript

  var isExtension = document.getElementById("dubplus-script-ext");

  if (!isExtension) {
    setTimeout(function () {
      // start the loading of the CSS asynchronously
      css$2.loadExternal("https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");
      css$2.load("/css/dubplus.css");
    }, 1);
  }

  var DubPlusContainer =
  /*#__PURE__*/
  function (_Component) {
    _inherits(DubPlusContainer, _Component);

    function DubPlusContainer() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, DubPlusContainer);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(DubPlusContainer)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
        loading: true,
        error: false,
        errorMsg: "",
        failed: false
      });

      return _this;
    }

    _createClass(DubPlusContainer, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this2 = this;

        /* globals Dubtrack */
        if (!window.DubPlus) {
          // checking to see if these items exist before initializing the script
          // instead of just picking an arbitrary setTimeout and hoping for the best
          var checkList = ["Dubtrack.session.id", "Dubtrack.room.chat", "Dubtrack.Events", "Dubtrack.room.player", "Dubtrack.helpers.cookie", "Dubtrack.room.model", "Dubtrack.room.users"];

          var _dubplusWaiting = new WaitFor(checkList, {
            seconds: 120
          });

          _dubplusWaiting.then(function () {
            _this2.setState({
              loading: false,
              error: false
            });
          }).fail(function () {
            if (!Dubtrack.session.id) {
              _this2.showError("You're not logged in. Please login to use Dub+.");
            } else {
              _this2.showError("Something happed, refresh and try again");

              track.event("Dub+ lib", "load", "failed");
            }
          });
        } else {
          if (!Dubtrack.session.id) {
            this.showError("You're not logged in. Please login to use Dub+.");
          } else {
            this.showError("Dub+ is already loaded");
          }
        }
      }
    }, {
      key: "showError",
      value: function showError(msg) {
        this.setState({
          loading: false,
          error: true,
          errorMsg: msg
        });
      }
    }, {
      key: "render",
      value: function render$$1(props, state) {
        var _this3 = this;

        if (state.loading) {
          return h(LoadingNotice, null);
        }

        if (state.error) {
          return h(Modal, {
            title: "Dub+ Error",
            onClose: function onClose() {
              _this3.setState({
                failed: true,
                error: false
              });
            },
            content: state.errorMsg
          });
        }

        if (state.failed) {
          return null;
        }

        document.querySelector('html').classList.add('dubplus');
        return h(DubPlusMenu, null);
      }
    }]);

    return DubPlusContainer;
  }(Component);

  render(h(DubPlusContainer, null), document.body);
  var navWait = new WaitFor(".header-right-navigation .user-messages", {
    seconds: 60,
    isNode: true
  });
  navWait.then(function () {
    render(h(MenuIcon, null), document.querySelector(".header-right-navigation"));
  }); // PKGINFO is inserted by the rollup build process

  var index = {
    "version": "2.0.0",
    "description": "Dub+ - A simple script/extension for Dubtrack.fm",
    "license": "MIT",
    "bugs": "https://github.com/DubPlus/DubPlus/issues"
  };

  return index;

}());
