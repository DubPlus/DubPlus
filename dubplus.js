
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

  /**
   * Writing my own simplified polyfill for fetch in order to keep the library size
   * small. Only including the things that I need. The current polyfill is a little 
   * too big: https://github.com/github/fetch/blob/master/fetch.js
   * because Rollup tree shaking only works on import/export
   */

  /**
   * @class ResponsePolyfill
   * a polyfill for the Response object returned from Fetch
   * https://developer.mozilla.org/en-US/docs/Web/API/Response
   */
  var ResponsePolyfill =
  /*#__PURE__*/
  function () {
    function ResponsePolyfill(data) {
      _classCallCheck(this, ResponsePolyfill);

      this.data = data;
    }

    _createClass(ResponsePolyfill, [{
      key: "json",
      value: function json() {
        var _this = this;

        return new Promise(function (resolve, reject) {
          try {
            var resp = JSON.parse(_this.data);
            resolve(resp);
          } catch (e) {
            reject(e);
          }
        });
      }
    }]);

    return ResponsePolyfill;
  }();
  /**
   * @param {String} url
   * @returns {Promise}
   */


  function fetchPolyfill(url) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();

      xhr.onload = function () {
        resolve(new ResponsePolyfill(xhr.responseText));
      };

      xhr.onerror = function () {
        reject();
      };

      xhr.open("GET", url);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();
    });
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
    /**
     * Dubtrack loads lodash into the global namespace right now so we are able
     * to use it, but if they ever remove it then we can load it here so things
     * don't break. If they do remove it we'll eventually move to an npm
     * installed lodash and only importing the functions we need
     */


    if (typeof window._ === "undefined") {
      console.log("DubPlus: loading lodash from CDN");
      getScript("https://cdn.jsdelivr.net/npm/lodash@4.17.11/lodash.min.js");
    }

    if (window.NodeList && !NodeList.prototype.forEach) {
      NodeList.prototype.forEach = Array.prototype.forEach;
    }

    if (!window.fetch) {
      window.fetch = fetchPolyfill;
    }
  }

  var n,u,t,i,r,o,f={},e$1=[],c=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i;function s(n,l){for(var u in l)n[u]=l[u];return n}function a(n){var l=n.parentNode;l&&l.removeChild(n);}function h(n,l,u){var t,i,r,o,f=arguments;if(l=s({},l),arguments.length>3)for(u=[u],t=3;t<arguments.length;t++)u.push(f[t]);if(null!=u&&(l.children=u),null!=n&&null!=n.defaultProps)for(i in n.defaultProps)void 0===l[i]&&(l[i]=n.defaultProps[i]);return o=l.key,null!=(r=l.ref)&&delete l.ref,null!=o&&delete l.key,v(n,l,o,r)}function v(l,u,t,i){var r={type:l,props:u,key:t,ref:i,__k:null,__p:null,__b:0,__e:null,l:null,__c:null,constructor:void 0};return n.vnode&&n.vnode(r),r}function d(n){return n.children}function y(n){if(null==n||"boolean"==typeof n)return null;if("string"==typeof n||"number"==typeof n)return v(null,n,null,null);if(null!=n.__e||null!=n.__c){var l=v(n.type,n.props,n.key,null);return l.__e=n.__e,l}return n}function m(n,l){this.props=n,this.context=l;}function w(n,l){if(null==l)return n.__p?w(n.__p,n.__p.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return "function"==typeof n.type?w(n):null}function g(n){var l,u;if(null!=(n=n.__p)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return g(n)}}function k(l){(!l.__d&&(l.__d=!0)&&1===u.push(l)||i!==n.debounceRendering)&&(i=n.debounceRendering,(n.debounceRendering||t)(_));}function _(){var n,l,t,i,r,o,f;for(u.sort(function(n,l){return l.__v.__b-n.__v.__b});n=u.pop();)n.__d&&(t=void 0,i=void 0,o=(r=(l=n).__v).__e,(f=l.__P)&&(t=[],i=$(f,r,s({},r),l.__n,void 0!==f.ownerSVGElement,null,t,null==o?w(r):o),j(t,r),i!=o&&g(r)));}function b(n,l,u,t,i,r,o,c,s){var h,v,p,d,y,m,g,k=u&&u.__k||e$1,_=k.length;if(c==f&&(c=null!=r?r[0]:_?w(u,0):null),h=0,l.__k=x(l.__k,function(u){if(null!=u){if(u.__p=l,u.__b=l.__b+1,null===(p=k[h])||p&&u.key==p.key&&u.type===p.type)k[h]=void 0;else for(v=0;v<_;v++){if((p=k[v])&&u.key==p.key&&u.type===p.type){k[v]=void 0;break}p=null;}if(d=$(n,u,p=p||f,t,i,r,o,c,s),(v=u.ref)&&p.ref!=v&&(g||(g=[])).push(v,u.__c||d,u),null!=d){if(null==m&&(m=d),null!=u.l)d=u.l,u.l=null;else if(r==p||d!=c||null==d.parentNode){n:if(null==c||c.parentNode!==n)n.appendChild(d);else{for(y=c,v=0;(y=y.nextSibling)&&v<_;v+=2)if(y==d)break n;n.insertBefore(d,c);}"option"==l.type&&(n.value="");}c=d.nextSibling,"function"==typeof l.type&&(l.l=d);}}return h++,u}),l.__e=m,null!=r&&"function"!=typeof l.type)for(h=r.length;h--;)null!=r[h]&&a(r[h]);for(h=_;h--;)null!=k[h]&&D(k[h],k[h]);if(g)for(h=0;h<g.length;h++)A(g[h],g[++h],g[++h]);}function x(n,l,u){if(null==u&&(u=[]),null==n||"boolean"==typeof n)l&&u.push(l(null));else if(Array.isArray(n))for(var t=0;t<n.length;t++)x(n[t],l,u);else u.push(l?l(y(n)):n);return u}function C(n,l,u,t,i){var r;for(r in u)r in l||N(n,r,null,u[r],t);for(r in l)i&&"function"!=typeof l[r]||"value"===r||"checked"===r||u[r]===l[r]||N(n,r,l[r],u[r],t);}function P(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]="number"==typeof u&&!1===c.test(l)?u+"px":null==u?"":u;}function N(n,l,u,t,i){var r,o,f,e,c;if("key"===(l=i?"className"===l?"class":l:"class"===l?"className":l)||"children"===l);else if("style"===l)if(r=n.style,"string"==typeof u)r.cssText=u;else{if("string"==typeof t&&(r.cssText="",t=null),t)for(o in t)u&&o in u||P(r,o,"");if(u)for(f in u)t&&u[f]===t[f]||P(r,f,u[f]);}else"o"===l[0]&&"n"===l[1]?(e=l!==(l=l.replace(/Capture$/,"")),c=l.toLowerCase(),l=(c in n?c:l).slice(2),u?(t||n.addEventListener(l,T,e),(n.u||(n.u={}))[l]=u):n.removeEventListener(l,T,e)):"list"!==l&&"tagName"!==l&&"form"!==l&&!i&&l in n?n[l]=null==u?"":u:"function"!=typeof u&&"dangerouslySetInnerHTML"!==l&&(l!==(l=l.replace(/^xlink:?/,""))?null==u||!1===u?n.removeAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase()):n.setAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase(),u):null==u||!1===u?n.removeAttribute(l):n.setAttribute(l,u));}function T(l){return this.u[l.type](n.event?n.event(l):l)}function $(l,u,t,i,r,o,f,e,c){var a,h,v,p,y,w,g,k,_,C,P=u.type;if(void 0!==u.constructor)return null;(a=n.__b)&&a(u);try{n:if("function"==typeof P){if(k=u.props,_=(a=P.contextType)&&i[a.__c],C=a?_?_.props.value:a.__p:i,t.__c?g=(h=u.__c=t.__c).__p=h.__E:("prototype"in P&&P.prototype.render?u.__c=h=new P(k,C):(u.__c=h=new m(k,C),h.constructor=P,h.render=H),_&&_.sub(h),h.props=k,h.state||(h.state={}),h.context=C,h.__n=i,v=h.__d=!0,h.__h=[]),null==h.__s&&(h.__s=h.state),null!=P.getDerivedStateFromProps&&s(h.__s==h.state?h.__s=s({},h.__s):h.__s,P.getDerivedStateFromProps(k,h.__s)),v)null==P.getDerivedStateFromProps&&null!=h.componentWillMount&&h.componentWillMount(),null!=h.componentDidMount&&f.push(h);else{if(null==P.getDerivedStateFromProps&&null==h.t&&null!=h.componentWillReceiveProps&&h.componentWillReceiveProps(k,C),!h.t&&null!=h.shouldComponentUpdate&&!1===h.shouldComponentUpdate(k,h.__s,C)){for(h.props=k,h.state=h.__s,h.__d=!1,h.__v=u,u.__e=t.__e,u.__k=t.__k,a=0;a<u.__k.length;a++)u.__k[a]&&(u.__k[a].__p=u);break n}null!=h.componentWillUpdate&&h.componentWillUpdate(k,h.__s,C);}p=h.props,y=h.state,h.context=C,h.props=k,h.state=h.__s,(a=n.__r)&&a(u),h.__d=!1,h.__v=u,h.__P=l,a=h.render(h.props,h.state,h.context),u.__k=x(null!=a&&a.type==d&&null==a.key?a.props.children:a),null!=h.getChildContext&&(i=s(s({},i),h.getChildContext())),v||null==h.getSnapshotBeforeUpdate||(w=h.getSnapshotBeforeUpdate(p,y)),b(l,u,t,i,r,o,f,e,c),h.base=u.__e,a=h.__h,h.__h=[],a.some(function(n){n.call(h);}),v||null==p||null==h.componentDidUpdate||h.componentDidUpdate(p,y,w),g&&(h.__E=h.__p=null),h.t=null;}else u.__e=z(t.__e,u,t,i,r,o,f,c);(a=n.diffed)&&a(u);}catch(l){n.__e(l,u,t);}return u.__e}function j(l,u){for(var t;t=l.pop();)try{t.componentDidMount();}catch(l){n.__e(l,t.__v);}n.__c&&n.__c(u);}function z(n,l,u,t,i,r,o,c){var s,a,h,v,p,d=u.props,y=l.props;if(i="svg"===l.type||i,null==n&&null!=r)for(s=0;s<r.length;s++)if(null!=(a=r[s])&&(null===l.type?3===a.nodeType:a.localName===l.type)){n=a,r[s]=null;break}if(null==n){if(null===l.type)return document.createTextNode(y);n=i?document.createElementNS("http://www.w3.org/2000/svg",l.type):document.createElement(l.type),r=null;}if(null===l.type)null!=r&&(r[r.indexOf(n)]=null),d!==y&&(n.data=y);else if(l!==u){if(null!=r&&(r=e$1.slice.call(n.childNodes)),h=(d=u.props||f).dangerouslySetInnerHTML,v=y.dangerouslySetInnerHTML,!c){if(d===f)for(d={},p=0;p<n.attributes.length;p++)d[n.attributes[p].name]=n.attributes[p].value;(v||h)&&(v&&h&&v.__html==h.__html||(n.innerHTML=v&&v.__html||""));}C(n,y,d,i,c),l.__k=l.props.children,v||b(n,l,u,t,"foreignObject"!==l.type&&i,r,o,f,c),c||("value"in y&&void 0!==y.value&&y.value!==n.value&&(n.value=null==y.value?"":y.value),"checked"in y&&void 0!==y.checked&&y.checked!==n.checked&&(n.checked=y.checked));}return n}function A(l,u,t){try{"function"==typeof l?l(u):l.current=u;}catch(l){n.__e(l,t);}}function D(l,u,t){var i,r,o;if(n.unmount&&n.unmount(l),(i=l.ref)&&A(i,null,u),t||"function"==typeof l.type||(t=null!=(r=l.__e)),l.__e=l.l=null,null!=(i=l.__c)){if(i.componentWillUnmount)try{i.componentWillUnmount();}catch(l){n.__e(l,u);}i.base=i.__P=null;}if(i=l.__k)for(o=0;o<i.length;o++)i[o]&&D(i[o],u,t);null!=r&&a(r);}function H(n,l,u){return this.constructor(n,u)}function I(l,u,t){var i,o,c;n.__p&&n.__p(l,u),o=(i=t===r)?null:t&&t.__k||u.__k,l=h(d,null,[l]),c=[],$(u,i?u.__k=l:(t||u).__k=l,o||f,f,void 0!==u.ownerSVGElement,t&&!i?[t]:o?null:e$1.slice.call(u.childNodes),c,t||f,i),j(c,l);}function L(n,l){I(n,l,r);}n={},m.prototype.setState=function(n,l){var u=this.__s!==this.state&&this.__s||(this.__s=s({},this.state));("function"!=typeof n||(n=n(u,this.props)))&&s(u,n),null!=n&&this.__v&&(this.t=!1,l&&this.__h.push(l),k(this));},m.prototype.forceUpdate=function(n){this.__v&&(this.t=!0,n&&this.__h.push(n),k(this));},m.prototype.render=d,u=[],t="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,i=n.debounceRendering,n.__e=function(n,l,u){for(var t;l=l.__p;)if((t=l.__c)&&!t.__p)try{if(t.constructor&&null!=t.constructor.getDerivedStateFromError)t.setState(t.constructor.getDerivedStateFromError(n));else{if(null==t.componentDidCatch)continue;t.componentDidCatch(n);}return k(t.__E=t)}catch(l){n=l;}throw n},r=f,o=0;

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
   *
   * @param {String} selector
   * @returns Boolean
   */


  function checkNode(selector) {
    return document.querySelector(selector) !== null;
  }
  /**
   * Loop through array and check if the selectors matches an existing node
   * if any selector in the list is false, then we fail because ALL have to exist
   *
   * @param {Array} selectors
   * @returns Boolean
   */


  function arrayCheckNode(selectors) {
    for (var i = 0; i < selectors.length; i++) {
      if (!checkNode(selectors[i])) {
        console.log(selectors[i], 'is not found yet');
        return false;
      }
    }

    return true;
  }
  /**
   * @typedef OptionsObject
   * @type {Object}
   * @property {number} interval how often to ping
   * @property {number} seconds  how long to ping for
   * @property {boolean} isNode switches to checking if node exists
   */

  /**
   * pings for the existence of var/function for # seconds until it's defined
   * runs callback once found and stops pinging
   * @param {string|array} waitingFor what you are waiting for
   * @param {OptionsObject} options optional options to pass
   * @returns {Promise}
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
    var opts = Object.assign({}, defaults, options);

    var checkFunc = function checkFunc() {};

    if (opts.isNode) {
      checkFunc = Array.isArray(waitingFor) ? arrayCheckNode : checkNode;
    } else {
      checkFunc = Array.isArray(waitingFor) ? arrayDeepCheck : deepCheck;
    }

    var tryCount = 0;
    var tryLimit = opts.seconds * 1000 / opts.interval; // how many intervals

    return new Promise(function (resolve, reject) {
      var check = function check() {
        tryCount++;

        var _test = checkFunc(waitingFor);

        if (_test) {
          resolve();
          return;
        }

        if (tryCount < tryLimit) {
          window.setTimeout(check, opts.interval);
          return;
        } // passed our limit, stop checking


        reject();
      };

      window.setTimeout(check, opts.interval);
    });
  }

  /**
   * Proxy for anything that uses `window.Dubtrack` global object
   */

  var DTGlobal = {
    /**
     * Begins polling of window object for the existence of a set of global
     * variables.
     *
     * @returns {Promise}
     */
    loadCheck: function loadCheck() {
      var checkList = ["Dubtrack.session.id", "Dubtrack.room.chat", "Dubtrack.Events", "Dubtrack.room.player", "Dubtrack.helpers.cookie", "Dubtrack.room.model", "Dubtrack.room.users", "Dubtrack.config"];
      return new WaitFor(checkList, {
        seconds: 120
      });
    },

    /**
     * Session Id is the same as User ID apparently
     *
     * @returns {string}
     */
    sessionId: function sessionId() {
      return Dubtrack.session.id;
    },

    /**
     * pass through of session id which is the same as user id
     *
     * @returns {string}
     */
    userId: function userId() {
      return this.sessionId();
    },

    /**
     * get the current logged in user name
     *
     * @returns {string}
     */
    userName: function userName() {
      return Dubtrack.session.get("username");
    },

    /**
     * get current room's name from the URL. Just the name and not other part
     * of the URL and no slashes
     *
     * @returns {string}
     */
    roomUrlName: function roomUrlName() {
      return Dubtrack.room.model.get("roomUrl");
    },

    /**
     * returns the current room's id
     *
     * @returns {string}
     */
    roomId: function roomId() {
      return Dubtrack.room.model.id;
    },

    /**
     * set volume of room's player
     *
     * @param {number} vol - number between 0 - 100
     */
    setVolume: function setVolume(vol) {
      Dubtrack.room.player.setVolume(vol);
      Dubtrack.room.player.updateVolumeBar();
    },

    /**
     * get the current volume of the room's player
     *
     * @returns {number}
     */
    getVolume: function getVolume() {
      return Dubtrack.playerController.volume;
    },

    /**
     * get the current mute state of the room's player
     *
     * @returns {boolean}
     */
    isMuted: function isMuted() {
      return Dubtrack.room.player.muted_player;
    },

    /**
     * mute the room's player
     *
     */
    mutePlayer: function mutePlayer() {
      Dubtrack.room.player.mutePlayer();
    },

    /**
     * Get the path of the mp3 file that is used for notifications
     *
     * @returns {string}
     */
    getChatSoundUrl: function getChatSoundUrl() {
      return Dubtrack.room.chat.mentionChatSound.url;
    },

    /**
     * set the mp3 file that is used for notifications
     *
     * @param {string} url - the url of the mp3 file
     */
    setChatSoundUrl: function setChatSoundUrl(url) {
      Dubtrack.room.chat.mentionChatSound.url = url;
    },

    /**
     * play the notification sound
     *
     */
    playChatSound: function playChatSound() {
      Dubtrack.room.chat.mentionChatSound.play();
    },

    /**
     * This will take whatever text inside the input and send it to the chat
     *
     */
    sendChatMessage: function sendChatMessage() {
      Dubtrack.room.chat.sendMessage();
    },

    /**
     * check if a user has mod (or higher) priviledges.
     *
     * @param {string} userid - any user's id, defaults to current logged in user
     */
    modCheck: function modCheck() {
      var userid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Dubtrack.session.id;
      return Dubtrack.helpers.isDubtrackAdmin(userid) || Dubtrack.room.users.getIfOwner(userid) || Dubtrack.room.users.getIfManager(userid) || Dubtrack.room.users.getIfMod(userid);
    },

    /**
     * Get room's "display grabs in chat" setting
     *
     * @returns {boolean}
     */
    displayUserGrab: function displayUserGrab() {
      return Dubtrack.room.model.get("displayUserGrab");
    },

    /**
     * get song info for the currently playing song
     *
     * @returns {object}
     */
    getActiveSong: function getActiveSong() {
      return Dubtrack.room.player.activeSong.get("songInfo");
    },

    /**
     * get the name of the song that's currently playing in the room
     *
     * @returns {string}
     */
    getSongName: function getSongName() {
      return this.getActiveSong().name;
    },

    /**
     * Get current playing song's platform ID (aka fkid)
     *
     * @returns {string} should only ever return "youtube" or "soundcloud"
     */
    getSongFKID: function getSongFKID() {
      return this.getActiveSong().fkid;
    },

    /**
     * Get the Dubtrack ID for current song.
     *
     * @returns {string}
     */
    getDubSong: function getDubSong() {
      return Dubtrack.helpers.cookie.get("dub-song");
    },

    /**
     * returns whether user has "updub"-ed or "downdub"-ed current song
     *
     * @returns {string|null} "updub", "downdub", or null if no vote was cast
     */
    getVoteType: function getVoteType() {
      return Dubtrack.helpers.cookie.get("dub-" + Dubtrack.room.model.id);
    },

    /**
     * get the name of the current DJ
     *
     * @returns {string}
     */
    getCurrentDJ: function getCurrentDJ() {
      var user = Dubtrack.room.users.collection.findWhere({
        userid: Dubtrack.room.player.activeSong.attributes.song.userid
      });

      if (user) {
        return user.attributes._user.username;
      }
    },

    /**
     * get a user in the room's info
     *
     * @param {string} userid
     * @returns {object}
     */
    getUserInfo: function getUserInfo(userid) {
      return Dubtrack.room.users.collection.findWhere({
        userid: userid
      });
    }
  };

  /******************************************************************
   * API urls and calls
   */

  var DTProxyAPIs = {
    /**
     * makes fetch call and handles the first response
     *
     * @private
     */
    _fetch: function _fetch(url) {
      return fetch(url).then(function (resp) {
        return resp.json();
      });
    },

    /**
     * Make api call to get data for all the songs in the room's active queue
     *
     * @returns {Promise} returns a fetch promise which already resolves response.json()
     */
    getRoomQueue: function getRoomQueue() {
      var api = Dubtrack.config.apiUrl + Dubtrack.config.urls.roomQueueDetails.replace(":id", DTGlobal.roomId());
      return this._fetch(api);
    },

    /**
     * make api call to get data for a specific song
     *
     * @param {string} songID
     * @returns {Promise} returns a fetch promise which already resolves response.json()
     */
    getSongData: function getSongData(songID) {
      var api = Dubtrack.config.apiUrl + Dubtrack.config.urls.song;
      return this._fetch("".concat(api, "/").concat(songID));
    },

    /**
     * Makes API call to get the dubs for the currently playing song in a room
     *
     * @returns {Promise} returns a fetch promise which already resolves response.json()
     */
    getActiveDubs: function getActiveDubs() {
      // `https://api.dubtrack.fm/room/${this.getRoomId()}/playlist/active/dubs`;
      var apiBase = Dubtrack.config.apiUrl;
      var path = Dubtrack.config.urls.dubsPlaylistActive.replace(":id", DTGlobal.roomId()).replace(":playlistid", "active");
      return this._fetch(apiBase + path);
    },

    /**
     * returns the API url to get a users info
     *
     * @param {string} userid - current logged in user id
     * @returns {Promise} returns a fetch promise which already resolves response.json()
     */
    getUserData: function getUserData(userid) {
      var api = Dubtrack.config.apiUrl + Dubtrack.config.urls.user + "/" + userid;
      return this._fetch(api);
    },

    /**
     * fetch data from api about the current room user is in
     *
     * @returns {Promise} returns a fetch promise which already resolves response.json()
     */
    roomInfo: function roomInfo() {
      var api = Dubtrack.config.apiUrl + "/room/" + DTGlobal.roomUrlName();
      return this._fetch(api);
    },

    /**
     * Form the url string for the avatar of a user
     *
     * @param {string} userid
     * @returns {string}
     */
    userImage: function userImage(userid) {
      return "".concat(Dubtrack.config.apiUrl, "/user/").concat(userid, "/image");
    },

    /**
     * Get the track info of a SoundCloud track
     *
     * @param {string} scID - the soundcloud Id (known as fkid in Dubtrack)
     * @returns {Promise} returns a fetch promise which already resolves response.json()
     */
    getSCtrackInfo: function getSCtrackInfo(scID) {
      var url = "https://api.soundcloud.com/tracks/".concat(scID, "?client_id=").concat(Dubtrack.config.keys.soundcloud);
      return fetch(url).then(function (resp) {
        return resp.json();
      });
    }
  };

  /******************************************************************
   * DOM Elements
   */
  var DTProxyDOM = {
    /**
     * Returns the chat input element
     *
     * @returns {HTMLElement}
     */
    chatInput: function chatInput() {
      return document.getElementById("chat-txt-message");
    },

    /**
     * get the <ul> containing all the chat messages
     *
     * @returns {HTMLUListElement}
     */
    chatList: function chatList() {
      return document.querySelector("ul.chat-main");
    },

    /**
     * Returns all of the elements that hold the chat text
     * this will remain a function because it changes often
     *
     * @returns {NodeList}
     */
    allChatTexts: function allChatTexts() {
      return document.querySelectorAll(".chat-main .text");
    },

    /**
     * returns the little input that's in the grabs popup
     * this gets created/destroyed often so should remain a function
     *
     * @returns {HTMLInputElement}
     */
    playlistInput: function playlistInput() {
      return document.getElementById("playlist-input");
    },

    /**
     * returns the <li> in the grab popup
     * this gets created/destroyed often so should remain a function
     *
     * @returns {NodeList}
     */
    grabPlaylists: function grabPlaylists() {
      return document.querySelectorAll(".playlist-list-action li");
    },

    /**
     * get the element that holds the text of the currently playing track in
     * the bottom player bar
     *
     * @returns {HTMLElement} think it's a span but that doesn't matter
     */
    getCurrentSongElem: function getCurrentSongElem() {
      return document.querySelector(".currentSong");
    },

    /**
     * Get the current minutes remaining of the song playing
     *
     * @returns {number}
     */
    getRemainingTime: function getRemainingTime() {
      return parseInt(document.querySelector("#player-controller .currentTime span.min").textContent);
    },

    /**
     * get the queue position
     *
     * @returns {string}
     */
    getQueuePosition: function getQueuePosition() {
      return parseInt(document.querySelector(".queue-position").textContent);
    },

    /**
     * Get the html element of a specific private message
     *
     * @param {string} messageid
     * @returns {HTMLElement}
     */
    getPMmsg: function getPMmsg(messageid) {
      return document.querySelector(".message-item[data-messageid=\"".concat(messageid, "\"]"));
    },

    /**
     * the anchor element for the up dub button
     * 
     * @returns {HTMLAnchorElement}
     */
    upVote: function upVote() {
      return document.querySelector(".dubup");
    },

    /**
     * get the anchor element for the down dub button
     * 
     * @returns {HTMLAnchorElement}
     */
    downVote: function downVote() {
      return document.querySelector(".dubdown");
    },

    /**
     * get the add to playlist "grab" button, the one with the heart icon
     * 
     * @returns {HTMLElement}
     */
    grabBtn: function grabBtn() {
      return document.querySelector(".add-to-playlist-button");
    },

    /**
     * Returns the element that triggers the opening the private messages sidebar
     *
     * @returns {HTMLElement}
     */
    userPMs: function userPMs() {
      return document.querySelector(".user-messages");
    },

    /**
     * returns the full size background img element
     * 
     * @returns {HTMLImageElement}
     */
    bgImg: function bgImg() {
      return document.querySelector(".backstretch-item img");
    },

    /*START.NOT_EXT*/

    /**
     * returns the element used to hide/show the video
     *
     * @returns {HTMLElement}
     */
    hideVideoBtn: function hideVideoBtn() {
      return document.querySelector(".hideVideo-el");
    },

    /*END.NOT_EXT*/

    /**
     * Returns the chat input's containing element
     *
     * @returns {HTMLElement}
     */
    chatInputContainer: function chatInputContainer() {
      return document.querySelector(".pusher-chat-widget-input");
    }
  };

  var DTProxyEvents = {
    /**
     * Subscribe to the room's current song changes including when a new song comes on
     *
     * @param {function} cb callback function to bind to playlist-update
     */
    onPlaylistUpdate: function onPlaylistUpdate(cb) {
      Dubtrack.Events.on("realtime:room_playlist-update", cb);
    },

    /**
     * unsubscribe to playlist updates
     *
     * @param {function} cb
     */
    offPlaylistUpdate: function offPlaylistUpdate(cb) {
      Dubtrack.Events.off("realtime:room_playlist-update", cb);
    },

    /**
     * Subscribe to changes in the current room's queue
     *
     * @param {function} cb
     */
    onQueueUpdate: function onQueueUpdate(cb) {
      Dubtrack.Events.on("realtime:room_playlist-queue-update", cb);
    },

    /**
     * Unsubscribe to changes in the current room's queue
     *
     * @param {function} cb
     */
    offQueueUpdate: function offQueueUpdate(cb) {
      Dubtrack.Events.off("realtime:room_playlist-queue-update", cb);
    },

    /**
     * Subscribe to when a user up/down votes (aka dub) a song
     *
     * @param {function} cb
     */
    onSongVote: function onSongVote(cb) {
      Dubtrack.Events.on("realtime:room_playlist-dub", cb);
    },

    /**
     * Unbsubscribe to song vote event
     *
     * @param {function} cb
     */
    offSongVote: function offSongVote(cb) {
      Dubtrack.Events.off("realtime:room_playlist-dub", cb);
    },

    /**
     * Subscribe when a new chat message comes in
     *
     * @param {function} cb
     */
    onChatMessage: function onChatMessage(cb) {
      Dubtrack.Events.on("realtime:chat-message", cb);
    },

    /**
     * Unsubscribe to new chat messages event
     *
     * @param {function} cb
     */
    offChatMessage: function offChatMessage(cb) {
      Dubtrack.Events.off("realtime:chat-message", cb);
    },

    /**
     * subscribe to when any user in the room grabs a song
     *
     * @param {function} cb
     */
    onSongGrab: function onSongGrab(cb) {
      Dubtrack.Events.on("realtime:room_playlist-queue-update-grabs", cb);
    },

    /**
     * Unsubscribe to when any user in the room grabs a song
     *
     * @param {function} cb
     */
    offSongGrab: function offSongGrab(cb) {
      Dubtrack.Events.off("realtime:room_playlist-queue-update-grabs", cb);
    },

    /**
     * Subscribe to user leave event
     *
     * @param {function} cb
     */
    onUserLeave: function onUserLeave(cb) {
      Dubtrack.Events.on("realtime:user-leave", cb);
    },

    /**
     * Unsubscribe to user leave event
     *
     * @param {function} cb
     */
    offUserLeave: function offUserLeave(cb) {
      Dubtrack.Events.off("realtime:user-leave", cb);
    },

    /**
     * Subscribe to new private message
     *
     * @param {function} cb
     */
    onNewPM: function onNewPM(cb) {
      Dubtrack.Events.on("realtime:new-message", cb);
    },

    /**
     * Unsubscribe to new private message
     *
     * @param {function} cb
     */
    offNewPM: function offNewPM(cb) {
      Dubtrack.Events.off("realtime:new-message", cb);
    }
  };

  /**
   * In order to prepare for the future alpha changes and the possibility that
   * Dubtrack might alter this object of data we rely on, I am planning to funnel
   * all interaction with Dubtrack through this "proxy" (for lack of better word)
   */

  var proxy = DTGlobal;
  proxy.api = DTProxyAPIs;
  proxy.dom = DTProxyDOM;
  proxy.events = DTProxyEvents;

  /*global Dubtrack*/

  var eventUtils = {
    currentVol: 50,
    snoozed: false
  };

  var eventSongAdvance = function eventSongAdvance(e) {
    if (e.startTime < 2) {
      if (eventUtils.snoozed) {
        proxy.setVolume(eventUtils.currentVol);
        eventUtils.snoozed = false;
      }

      return true;
    }
  };

  var snooze = function snooze() {
    var vol = proxy.getVolume();

    if (!eventUtils.snoozed && !proxy.isMuted() && vol > 2) {
      eventUtils.currentVol = vol;
      proxy.mutePlayer();
      eventUtils.snoozed = true;
      proxy.events.onPlaylistUpdate(eventSongAdvance);
    } else if (eventUtils.snoozed) {
      proxy.setVolume(eventUtils.currentVol);
      eventUtils.snoozed = false;
    }
  };

  var css = {
    position: "absolute",
    font: "1rem/1.5 proxima-nova,sans-serif",
    display: "block",
    cursor: "pointer",
    borderRadius: "1.5rem",
    padding: "8px 16px",
    background: "#fff",
    fontWeight: "700",
    fontSize: "13.6px",
    textTransform: "uppercase",
    color: "#000",
    opacity: "0.8",
    textAlign: "center",
    zIndex: "9"
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

      _defineProperty(_assertThisInitialized(_this), "state", {
        show: false
      });

      _defineProperty(_assertThisInitialized(_this), "showTooltip", function () {
        _this.setState({
          show: true
        });
      });

      _defineProperty(_assertThisInitialized(_this), "hideTooltip", function () {
        _this.setState({
          show: false
        });
      });

      return _this;
    }

    _createClass(Snooze, [{
      key: "updateLeft",
      value: function updateLeft() {
        if (css.left) {
          return css;
        }

        var left = this.snoozeRef.getBoundingClientRect().left;
        css.left = left + "px";
        return css;
      }
    }, {
      key: "render",
      value: function render(props, state) {
        var _this2 = this;

        return h("span", {
          ref: function ref(s) {
            return _this2.snoozeRef = s;
          },
          className: "icon-mute snooze_btn",
          onClick: snooze,
          onMouseOver: this.showTooltip,
          onMouseOut: this.hideTooltip
        }, state.show && h("div", {
          className: "snooze_tooltip",
          style: this.updateLeft()
        }, "Mute current song"));
      }
    }]);

    return Snooze;
  }(m);

  var css$1 = {
    position: 'absolute',
    font: '1rem/1.5 proxima-nova,sans-serif',
    display: 'block',
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

      _defineProperty(_assertThisInitialized(_this), "state", {
        show: false,
        booth_time: ''
      });

      _defineProperty(_assertThisInitialized(_this), "showTooltip", function () {
        var tooltipText = _this.getEta();

        _this.setState({
          show: true,
          booth_time: tooltipText
        });
      });

      _defineProperty(_assertThisInitialized(_this), "hideTooltip", function () {
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
      key: "updateLeft",
      value: function updateLeft() {
        if (css$1.left) {
          return css$1;
        }

        var left = this.etaRef.getBoundingClientRect().left;
        css$1.left = left + "px";
        return css$1;
      }
    }, {
      key: "render",
      value: function render(props, state) {
        var _this2 = this;

        return h("span", {
          className: "icon-history eta_tooltip_t",
          ref: function ref(s) {
            return _this2.etaRef = s;
          },
          onMouseOver: this.showTooltip,
          onMouseOut: this.hideTooltip
        }, this.state.show && h("span", {
          className: "eta_tooltip",
          style: this.updateLeft()
        }, this.state.booth_time));
      }
    }]);

    return ETA;
  }(m);

  var twitchSpriteSheet = {
    "\\:-?\\)": {
      "x": 387,
      "y": 764,
      "width": 24,
      "height": 18,
      "id": "1"
    },
    "\\:-?[\\\\/]": {
      "x": 171,
      "y": 764,
      "width": 24,
      "height": 18,
      "id": "10"
    },
    "qtp1": {
      "x": 649,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "100186"
    },
    "qtp2": {
      "x": 140,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "100187"
    },
    "qtp3": {
      "x": 448,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "100188"
    },
    "qtp4": {
      "x": 644,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "100189"
    },
    "mercywing1": {
      "x": 677,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "1003187"
    },
    "mercywing2": {
      "x": 196,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "1003189"
    },
    "pinkmercy": {
      "x": 140,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "1003190"
    },
    "opieop": {
      "x": 532,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "100590"
    },
    "doritoschip": {
      "x": 84,
      "y": 92,
      "width": 28,
      "height": 28,
      "id": "102242"
    },
    "pjsugar": {
      "x": 112,
      "y": 92,
      "width": 28,
      "height": 28,
      "id": "102556"
    },
    "reckkers": {
      "x": 145,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "103416"
    },
    "lirikangry": {
      "x": 145,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "1037101"
    },
    "reckq": {
      "x": 0,
      "y": 120,
      "width": 28,
      "height": 28,
      "id": "103837"
    },
    "tathypers": {
      "x": 112,
      "y": 120,
      "width": 28,
      "height": 28,
      "id": "1058125"
    },
    "angryyappotatos": {
      "x": 140,
      "y": 120,
      "width": 28,
      "height": 28,
      "id": "1059983"
    },
    "poongjing": {
      "x": 173,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "1060927"
    },
    "poongr3": {
      "x": 173,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "1060942"
    },
    "poongr2": {
      "x": 173,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "1060947"
    },
    "poongr1": {
      "x": 173,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "1060950"
    },
    "poongves2": {
      "x": 173,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "1060951"
    },
    "poongves1": {
      "x": 0,
      "y": 148,
      "width": 28,
      "height": 28,
      "id": "1060953"
    },
    "tyler1hey": {
      "x": 28,
      "y": 148,
      "width": 28,
      "height": 28,
      "id": "106169"
    },
    "tyler1ssj": {
      "x": 56,
      "y": 148,
      "width": 28,
      "height": 28,
      "id": "106170"
    },
    "tyler1lift": {
      "x": 84,
      "y": 148,
      "width": 28,
      "height": 28,
      "id": "106173"
    },
    "tyler1bb": {
      "x": 112,
      "y": 148,
      "width": 28,
      "height": 28,
      "id": "106175"
    },
    "tyler1ayy": {
      "x": 140,
      "y": 148,
      "width": 28,
      "height": 28,
      "id": "106204"
    },
    "tyler1xd": {
      "x": 168,
      "y": 148,
      "width": 28,
      "height": 28,
      "id": "106205"
    },
    "tyler1skip": {
      "x": 201,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "106209"
    },
    "tyler1geo": {
      "x": 201,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "106233"
    },
    "reckhey": {
      "x": 201,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "106252"
    },
    "tyler1int": {
      "x": 201,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "106287"
    },
    "voteyea": {
      "x": 201,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "106293"
    },
    "votenay": {
      "x": 201,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "106294"
    },
    "bisexualpride": {
      "x": 0,
      "y": 176,
      "width": 28,
      "height": 28,
      "id": "1064987"
    },
    "lesbianpride": {
      "x": 28,
      "y": 176,
      "width": 28,
      "height": 28,
      "id": "1064988"
    },
    "gaypride": {
      "x": 56,
      "y": 176,
      "width": 28,
      "height": 28,
      "id": "1064991"
    },
    "transgenderpride": {
      "x": 84,
      "y": 176,
      "width": 28,
      "height": 28,
      "id": "1064995"
    },
    "tath": {
      "x": 112,
      "y": 176,
      "width": 28,
      "height": 28,
      "id": "106925"
    },
    "rulefive": {
      "x": 140,
      "y": 176,
      "width": 28,
      "height": 28,
      "id": "107030"
    },
    "tyler1ban": {
      "x": 196,
      "y": 176,
      "width": 28,
      "height": 28,
      "id": "107708"
    },
    "tyler1chair": {
      "x": 229,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "107716"
    },
    "tyler1feels": {
      "x": 229,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "107719"
    },
    "tyler1toxic": {
      "x": 229,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "107722"
    },
    "tyler1iq": {
      "x": 229,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "107731"
    },
    "tyler1sleeper": {
      "x": 229,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "108650"
    },
    "tyler1free": {
      "x": 229,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "108704"
    },
    "moon2mlady": {
      "x": 229,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "109723"
    },
    "\\;-?\\)": {
      "x": 363,
      "y": 764,
      "width": 24,
      "height": 18,
      "id": "11"
    },
    "moon2o": {
      "x": 28,
      "y": 204,
      "width": 28,
      "height": 28,
      "id": "1100135"
    },
    "angryyapdeong": {
      "x": 56,
      "y": 204,
      "width": 28,
      "height": 28,
      "id": "1102516"
    },
    "angryyapsil": {
      "x": 84,
      "y": 204,
      "width": 28,
      "height": 28,
      "id": "1102517"
    },
    "moon2winky": {
      "x": 112,
      "y": 204,
      "width": 28,
      "height": 28,
      "id": "110301"
    },
    "tyler1bruh": {
      "x": 140,
      "y": 204,
      "width": 28,
      "height": 28,
      "id": "110520"
    },
    "dxcat": {
      "x": 168,
      "y": 204,
      "width": 28,
      "height": 28,
      "id": "110734"
    },
    "drinkpurple": {
      "x": 196,
      "y": 204,
      "width": 28,
      "height": 28,
      "id": "110785"
    },
    "tinyface": {
      "x": 224,
      "y": 204,
      "width": 28,
      "height": 28,
      "id": "111119"
    },
    "picomause": {
      "x": 257,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "111300"
    },
    "thetarfu": {
      "x": 257,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "111351"
    },
    "tyler1nlt": {
      "x": 257,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "111552"
    },
    "tyler1good": {
      "x": 257,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "111553"
    },
    "datsheffy": {
      "x": 257,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "111700"
    },
    "unsane": {
      "x": 257,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "111792"
    },
    "copythis": {
      "x": 257,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "112288"
    },
    "pastathat": {
      "x": 257,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "112289"
    },
    "imglitch": {
      "x": 0,
      "y": 232,
      "width": 28,
      "height": 28,
      "id": "112290"
    },
    "giveplz": {
      "x": 28,
      "y": 232,
      "width": 28,
      "height": 28,
      "id": "112291"
    },
    "takenrg": {
      "x": 56,
      "y": 232,
      "width": 28,
      "height": 28,
      "id": "112292"
    },
    "tyler1o": {
      "x": 84,
      "y": 232,
      "width": 28,
      "height": 28,
      "id": "112379"
    },
    "asexualpride": {
      "x": 112,
      "y": 232,
      "width": 28,
      "height": 28,
      "id": "1130348"
    },
    "pansexualpride": {
      "x": 140,
      "y": 232,
      "width": 28,
      "height": 28,
      "id": "1130349"
    },
    "moon2good": {
      "x": 168,
      "y": 232,
      "width": 28,
      "height": 28,
      "id": "114075"
    },
    "qtpw": {
      "x": 196,
      "y": 232,
      "width": 28,
      "height": 28,
      "id": "114091"
    },
    "qtpnlt": {
      "x": 224,
      "y": 232,
      "width": 28,
      "height": 28,
      "id": "114093"
    },
    "blargnaut": {
      "x": 252,
      "y": 232,
      "width": 28,
      "height": 28,
      "id": "114738"
    },
    "dogface": {
      "x": 285,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "114835"
    },
    "jebaited": {
      "x": 285,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "114836"
    },
    "toospicy": {
      "x": 285,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "114846"
    },
    "wtruck": {
      "x": 285,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "114847"
    },
    "unclenox": {
      "x": 285,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "114856"
    },
    "raccattack": {
      "x": 285,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "114870"
    },
    "strawbeary": {
      "x": 285,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "114876"
    },
    "primeme": {
      "x": 285,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "115075"
    },
    "brainslug": {
      "x": 285,
      "y": 224,
      "width": 28,
      "height": 28,
      "id": "115233"
    },
    "batchest": {
      "x": 0,
      "y": 260,
      "width": 28,
      "height": 28,
      "id": "115234"
    },
    "forsenh": {
      "x": 56,
      "y": 260,
      "width": 28,
      "height": 28,
      "id": "115996"
    },
    "forsen1": {
      "x": 84,
      "y": 260,
      "width": 28,
      "height": 28,
      "id": "116051"
    },
    "forsen2": {
      "x": 112,
      "y": 260,
      "width": 28,
      "height": 28,
      "id": "116052"
    },
    "forsen3": {
      "x": 140,
      "y": 260,
      "width": 28,
      "height": 28,
      "id": "116053"
    },
    "forsen4": {
      "x": 168,
      "y": 260,
      "width": 28,
      "height": 28,
      "id": "116055"
    },
    "forsenlul": {
      "x": 196,
      "y": 260,
      "width": 28,
      "height": 28,
      "id": "116245"
    },
    "forsended": {
      "x": 224,
      "y": 260,
      "width": 28,
      "height": 28,
      "id": "116256"
    },
    "forsenfeels": {
      "x": 252,
      "y": 260,
      "width": 28,
      "height": 28,
      "id": "116273"
    },
    "moon2gums": {
      "x": 280,
      "y": 260,
      "width": 28,
      "height": 28,
      "id": "116435"
    },
    "curselit": {
      "x": 313,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "116625"
    },
    "qtplul": {
      "x": 313,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "116948"
    },
    "qtpcool": {
      "x": 313,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "116984"
    },
    "qtpthinking": {
      "x": 313,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "117009"
    },
    "forsenk": {
      "x": 313,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "1171397"
    },
    "qtpkawaii": {
      "x": 313,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "117329"
    },
    "qtpedge": {
      "x": 313,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "117343"
    },
    "qtpswag": {
      "x": 313,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "117351"
    },
    "qtpboosted": {
      "x": 313,
      "y": 224,
      "width": 28,
      "height": 28,
      "id": "117471"
    },
    "poooound": {
      "x": 313,
      "y": 252,
      "width": 28,
      "height": 28,
      "id": "117484"
    },
    "qtphahaa": {
      "x": 0,
      "y": 288,
      "width": 28,
      "height": 28,
      "id": "117608"
    },
    "freakinstinkin": {
      "x": 28,
      "y": 288,
      "width": 28,
      "height": 28,
      "id": "117701"
    },
    "forseno": {
      "x": 56,
      "y": 288,
      "width": 28,
      "height": 28,
      "id": "118074"
    },
    "qtpno": {
      "x": 84,
      "y": 288,
      "width": 28,
      "height": 28,
      "id": "118250"
    },
    "qtpsmorc": {
      "x": 112,
      "y": 288,
      "width": 28,
      "height": 28,
      "id": "118456"
    },
    "qtpbot": {
      "x": 140,
      "y": 288,
      "width": 28,
      "height": 28,
      "id": "118492"
    },
    "supervinlin": {
      "x": 168,
      "y": 288,
      "width": 28,
      "height": 28,
      "id": "118772"
    },
    "moon2mlem": {
      "x": 196,
      "y": 288,
      "width": 28,
      "height": 28,
      "id": "119382"
    },
    "\\:-?(p|p)": {
      "x": 339,
      "y": 764,
      "width": 24,
      "height": 18,
      "id": "12"
    },
    "trihard": {
      "x": 252,
      "y": 288,
      "width": 28,
      "height": 28,
      "id": "120232"
    },
    "angryyaph": {
      "x": 280,
      "y": 288,
      "width": 28,
      "height": 28,
      "id": "121569"
    },
    "moon2kisses": {
      "x": 308,
      "y": 288,
      "width": 28,
      "height": 28,
      "id": "121734"
    },
    "tyler1ha": {
      "x": 341,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "121815"
    },
    "tyler1kkona": {
      "x": 341,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "121816"
    },
    "tyler1lul": {
      "x": 341,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "121817"
    },
    "moon2banned": {
      "x": 341,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "121936"
    },
    "twitchrpg": {
      "x": 341,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "1220086"
    },
    "intersexpride": {
      "x": 341,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "1221184"
    },
    "forsendiglett": {
      "x": 341,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "122255"
    },
    "forsenpuke3": {
      "x": 341,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "122261"
    },
    "coolstorybob": {
      "x": 341,
      "y": 224,
      "width": 28,
      "height": 28,
      "id": "123171"
    },
    "moon2shrug": {
      "x": 341,
      "y": 252,
      "width": 28,
      "height": 28,
      "id": "123403"
    },
    "reckhands": {
      "x": 341,
      "y": 280,
      "width": 28,
      "height": 28,
      "id": "1236381"
    },
    "reckgasp": {
      "x": 0,
      "y": 316,
      "width": 28,
      "height": 28,
      "id": "1239179"
    },
    "reckrob": {
      "x": 28,
      "y": 316,
      "width": 28,
      "height": 28,
      "id": "1239201"
    },
    "tyler1p": {
      "x": 56,
      "y": 316,
      "width": 28,
      "height": 28,
      "id": "124643"
    },
    "tatblanket": {
      "x": 84,
      "y": 316,
      "width": 28,
      "height": 28,
      "id": "1248055"
    },
    "poongyep": {
      "x": 112,
      "y": 316,
      "width": 28,
      "height": 28,
      "id": "125017"
    },
    "tyler1champ": {
      "x": 140,
      "y": 316,
      "width": 28,
      "height": 28,
      "id": "125258"
    },
    "poongmak": {
      "x": 168,
      "y": 316,
      "width": 28,
      "height": 28,
      "id": "125653"
    },
    "poongcap": {
      "x": 196,
      "y": 316,
      "width": 28,
      "height": 28,
      "id": "125654"
    },
    "qtpblessed": {
      "x": 224,
      "y": 316,
      "width": 28,
      "height": 28,
      "id": "12576"
    },
    "tyler1q": {
      "x": 252,
      "y": 316,
      "width": 28,
      "height": 28,
      "id": "125850"
    },
    "recko": {
      "x": 280,
      "y": 316,
      "width": 28,
      "height": 28,
      "id": "1260943"
    },
    "poongdeath": {
      "x": 308,
      "y": 316,
      "width": 28,
      "height": 28,
      "id": "126514"
    },
    "poongspicy": {
      "x": 336,
      "y": 316,
      "width": 28,
      "height": 28,
      "id": "126515"
    },
    "poongbbuing": {
      "x": 369,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "126518"
    },
    "moon2sp": {
      "x": 369,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "1267155"
    },
    "moon2smag": {
      "x": 369,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "1267163"
    },
    "tyler1c": {
      "x": 369,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "126817"
    },
    "tyler1bad": {
      "x": 369,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "126818"
    },
    "qtphehe": {
      "x": 369,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "126889"
    },
    "forsendab": {
      "x": 369,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "1271995"
    },
    "tyler1g": {
      "x": 369,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "127464"
    },
    "moon2ye": {
      "x": 369,
      "y": 224,
      "width": 28,
      "height": 28,
      "id": "128246"
    },
    "moon2gasm": {
      "x": 369,
      "y": 252,
      "width": 28,
      "height": 28,
      "id": "128391"
    },
    "tyler1pride": {
      "x": 369,
      "y": 280,
      "width": 28,
      "height": 28,
      "id": "128660"
    },
    "maxlol": {
      "x": 369,
      "y": 308,
      "width": 28,
      "height": 28,
      "id": "1290325"
    },
    "tatwc": {
      "x": 0,
      "y": 344,
      "width": 28,
      "height": 28,
      "id": "1294993"
    },
    "nonbinarypride": {
      "x": 28,
      "y": 344,
      "width": 28,
      "height": 28,
      "id": "1297279"
    },
    "genderfluidpride": {
      "x": 56,
      "y": 344,
      "width": 28,
      "height": 28,
      "id": "1297281"
    },
    "\\;-?(p|p)": {
      "x": 315,
      "y": 764,
      "width": 24,
      "height": 18,
      "id": "13"
    },
    "tatthirst": {
      "x": 112,
      "y": 344,
      "width": 28,
      "height": 28,
      "id": "1308379"
    },
    "tatthirsty": {
      "x": 140,
      "y": 344,
      "width": 28,
      "height": 28,
      "id": "1312218"
    },
    "moon2ph": {
      "x": 168,
      "y": 344,
      "width": 28,
      "height": 28,
      "id": "1317272"
    },
    "tattomato": {
      "x": 196,
      "y": 344,
      "width": 28,
      "height": 28,
      "id": "1317421"
    },
    "tyler1na": {
      "x": 224,
      "y": 344,
      "width": 28,
      "height": 28,
      "id": "132669"
    },
    "angryyaplight": {
      "x": 252,
      "y": 344,
      "width": 28,
      "height": 28,
      "id": "1326860"
    },
    "tyler1beta": {
      "x": 280,
      "y": 344,
      "width": 28,
      "height": 28,
      "id": "132992"
    },
    "tatroad": {
      "x": 308,
      "y": 344,
      "width": 28,
      "height": 28,
      "id": "1330097"
    },
    "itsboshytime": {
      "x": 336,
      "y": 344,
      "width": 28,
      "height": 28,
      "id": "133468"
    },
    "tyler1bandit": {
      "x": 364,
      "y": 344,
      "width": 28,
      "height": 28,
      "id": "133509"
    },
    "kapow": {
      "x": 397,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "133537"
    },
    "youdontsay": {
      "x": 397,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "134254"
    },
    "uwot": {
      "x": 397,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "134255"
    },
    "rlytho": {
      "x": 397,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "134256"
    },
    "tatdmg": {
      "x": 397,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "1343473"
    },
    "tyler1eu": {
      "x": 397,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "134421"
    },
    "soonerlater": {
      "x": 397,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "134472"
    },
    "partytime": {
      "x": 397,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "135393"
    },
    "tattuff": {
      "x": 397,
      "y": 252,
      "width": 28,
      "height": 28,
      "id": "1360600"
    },
    "forsenpuke5": {
      "x": 397,
      "y": 280,
      "width": 28,
      "height": 28,
      "id": "1361610"
    },
    "summolly": {
      "x": 397,
      "y": 308,
      "width": 28,
      "height": 28,
      "id": "136983"
    },
    "tyler1cs": {
      "x": 397,
      "y": 336,
      "width": 28,
      "height": 28,
      "id": "137629"
    },
    "recks": {
      "x": 0,
      "y": 372,
      "width": 28,
      "height": 28,
      "id": "1383"
    },
    "ninjagrumpy": {
      "x": 28,
      "y": 372,
      "width": 28,
      "height": 28,
      "id": "138325"
    },
    "tyler1stutter": {
      "x": 56,
      "y": 372,
      "width": 28,
      "height": 28,
      "id": "139047"
    },
    "moon2g": {
      "x": 84,
      "y": 372,
      "width": 28,
      "height": 28,
      "id": "1394894"
    },
    "r-?\\)": {
      "x": 291,
      "y": 764,
      "width": 24,
      "height": 18,
      "id": "14"
    },
    "moon2ay": {
      "x": 168,
      "y": 372,
      "width": 28,
      "height": 28,
      "id": "1405347"
    },
    "tyler1r1": {
      "x": 196,
      "y": 372,
      "width": 28,
      "height": 28,
      "id": "140809"
    },
    "tyler1r2": {
      "x": 224,
      "y": 372,
      "width": 28,
      "height": 28,
      "id": "140810"
    },
    "sumw": {
      "x": 252,
      "y": 372,
      "width": 28,
      "height": 28,
      "id": "141193"
    },
    "mvgame": {
      "x": 280,
      "y": 372,
      "width": 28,
      "height": 28,
      "id": "142140"
    },
    "qtpusa": {
      "x": 308,
      "y": 372,
      "width": 28,
      "height": 28,
      "id": "14303"
    },
    "moon2hey": {
      "x": 336,
      "y": 372,
      "width": 28,
      "height": 28,
      "id": "143034"
    },
    "tbangel": {
      "x": 364,
      "y": 372,
      "width": 28,
      "height": 28,
      "id": "143490"
    },
    "tyler1t1": {
      "x": 392,
      "y": 372,
      "width": 28,
      "height": 28,
      "id": "143635"
    },
    "tyler1t2": {
      "x": 425,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "143636"
    },
    "fbrun": {
      "x": 425,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "1441261"
    },
    "fbpass": {
      "x": 425,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "1441271"
    },
    "fbspiral": {
      "x": 425,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "1441273"
    },
    "fbblock": {
      "x": 425,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "1441276"
    },
    "fbcatch": {
      "x": 425,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "1441281"
    },
    "fbchallenge": {
      "x": 425,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "1441285"
    },
    "fbpenalty": {
      "x": 425,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "1441289"
    },
    "qtpgive": {
      "x": 425,
      "y": 224,
      "width": 28,
      "height": 28,
      "id": "144214"
    },
    "tyler1m": {
      "x": 425,
      "y": 252,
      "width": 28,
      "height": 28,
      "id": "144428"
    },
    "sumhassan": {
      "x": 425,
      "y": 280,
      "width": 28,
      "height": 28,
      "id": "14462"
    },
    "theilluminati": {
      "x": 425,
      "y": 308,
      "width": 28,
      "height": 28,
      "id": "145315"
    },
    "tatglam": {
      "x": 425,
      "y": 336,
      "width": 28,
      "height": 28,
      "id": "145662"
    },
    "moon2xd": {
      "x": 425,
      "y": 364,
      "width": 28,
      "height": 28,
      "id": "146225"
    },
    "tatbling": {
      "x": 0,
      "y": 400,
      "width": 28,
      "height": 28,
      "id": "1465723"
    },
    "angryyapa": {
      "x": 28,
      "y": 400,
      "width": 28,
      "height": 28,
      "id": "146700"
    },
    "moon2t": {
      "x": 56,
      "y": 400,
      "width": 28,
      "height": 28,
      "id": "146843"
    },
    "petezaroll": {
      "x": 84,
      "y": 400,
      "width": 28,
      "height": 28,
      "id": "1470035"
    },
    "petezarollodyssey": {
      "x": 112,
      "y": 400,
      "width": 28,
      "height": 28,
      "id": "1470037"
    },
    "moon2l": {
      "x": 140,
      "y": 400,
      "width": 28,
      "height": 28,
      "id": "147833"
    },
    "forsenweird": {
      "x": 168,
      "y": 400,
      "width": 28,
      "height": 28,
      "id": "1479466"
    },
    "moon2me": {
      "x": 280,
      "y": 400,
      "width": 28,
      "height": 28,
      "id": "1485944"
    },
    "moon2p": {
      "x": 308,
      "y": 400,
      "width": 28,
      "height": 28,
      "id": "1486187"
    },
    "lirikblind": {
      "x": 364,
      "y": 400,
      "width": 28,
      "height": 28,
      "id": "1498549"
    },
    "lirikten": {
      "x": 392,
      "y": 400,
      "width": 28,
      "height": 28,
      "id": "1498552"
    },
    "lirikthump": {
      "x": 420,
      "y": 400,
      "width": 28,
      "height": 28,
      "id": "1498553"
    },
    "lirikhappy": {
      "x": 453,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "1498555"
    },
    "lirikclench": {
      "x": 453,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "1498556"
    },
    "lirikclap": {
      "x": 453,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "1498557"
    },
    "lirikk": {
      "x": 453,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "1498558"
    },
    "lirikh": {
      "x": 453,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "1498561"
    },
    "lirikhmm": {
      "x": 453,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "1498566"
    },
    "lirikayaya": {
      "x": 453,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "1498569"
    },
    "liriktos": {
      "x": 453,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "1498577"
    },
    "lirikweeb": {
      "x": 453,
      "y": 224,
      "width": 28,
      "height": 28,
      "id": "1498578"
    },
    "lirikhug": {
      "x": 453,
      "y": 252,
      "width": 28,
      "height": 28,
      "id": "1498657"
    },
    "lirikpog": {
      "x": 453,
      "y": 280,
      "width": 28,
      "height": 28,
      "id": "1498659"
    },
    "liriksmug": {
      "x": 453,
      "y": 308,
      "width": 28,
      "height": 28,
      "id": "1498661"
    },
    "lirikshucks": {
      "x": 453,
      "y": 336,
      "width": 28,
      "height": 28,
      "id": "1499983"
    },
    "jkanstyle": {
      "x": 42,
      "y": 791,
      "width": 21,
      "height": 27,
      "id": "15"
    },
    "lirikgachi": {
      "x": 453,
      "y": 392,
      "width": 28,
      "height": 28,
      "id": "1500011"
    },
    "angryyapd": {
      "x": 0,
      "y": 428,
      "width": 28,
      "height": 28,
      "id": "152029"
    },
    "angryyapgamza": {
      "x": 28,
      "y": 428,
      "width": 28,
      "height": 28,
      "id": "152030"
    },
    "angryyapb": {
      "x": 56,
      "y": 428,
      "width": 28,
      "height": 28,
      "id": "152618"
    },
    "blessrng": {
      "x": 112,
      "y": 428,
      "width": 28,
      "height": 28,
      "id": "153556"
    },
    "reckk": {
      "x": 140,
      "y": 428,
      "width": 28,
      "height": 28,
      "id": "1539309"
    },
    "moon2sh": {
      "x": 168,
      "y": 428,
      "width": 28,
      "height": 28,
      "id": "1544083"
    },
    "tppurn": {
      "x": 224,
      "y": 428,
      "width": 28,
      "height": 28,
      "id": "1546081"
    },
    "tppshiny": {
      "x": 252,
      "y": 428,
      "width": 28,
      "height": 28,
      "id": "1546135"
    },
    "pixelbob": {
      "x": 280,
      "y": 428,
      "width": 28,
      "height": 28,
      "id": "1547903"
    },
    "forsentake": {
      "x": 308,
      "y": 428,
      "width": 28,
      "height": 28,
      "id": "1558719"
    },
    "forsena": {
      "x": 336,
      "y": 428,
      "width": 28,
      "height": 28,
      "id": "1558721"
    },
    "forsenbreak": {
      "x": 364,
      "y": 428,
      "width": 28,
      "height": 28,
      "id": "1558723"
    },
    "lirikme": {
      "x": 392,
      "y": 428,
      "width": 28,
      "height": 28,
      "id": "1559270"
    },
    "lirikosvn": {
      "x": 420,
      "y": 428,
      "width": 28,
      "height": 28,
      "id": "1559272"
    },
    "lirikfeast": {
      "x": 448,
      "y": 428,
      "width": 28,
      "height": 28,
      "id": "1559273"
    },
    "lirikhuh": {
      "x": 481,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "1559276"
    },
    "poongpoongak": {
      "x": 481,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "156225"
    },
    "poongend2": {
      "x": 481,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "156229"
    },
    "poongnawa": {
      "x": 481,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "156230"
    },
    "poongpain": {
      "x": 481,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "156368"
    },
    "poongcop": {
      "x": 481,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "156372"
    },
    "poongpig": {
      "x": 481,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "156373"
    },
    "poongqm": {
      "x": 481,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "156375"
    },
    "moon2wut": {
      "x": 481,
      "y": 224,
      "width": 28,
      "height": 28,
      "id": "1564343"
    },
    "moon2a": {
      "x": 481,
      "y": 252,
      "width": 28,
      "height": 28,
      "id": "1564353"
    },
    "moon2n": {
      "x": 481,
      "y": 280,
      "width": 28,
      "height": 28,
      "id": "1564354"
    },
    "moon2cute": {
      "x": 481,
      "y": 308,
      "width": 28,
      "height": 28,
      "id": "1564358"
    },
    "moon2doit": {
      "x": 481,
      "y": 336,
      "width": 28,
      "height": 28,
      "id": "1564365"
    },
    "forsenlicence": {
      "x": 481,
      "y": 364,
      "width": 28,
      "height": 28,
      "id": "1565929"
    },
    "forsendeer": {
      "x": 481,
      "y": 392,
      "width": 28,
      "height": 28,
      "id": "1565934"
    },
    "forsensanta": {
      "x": 481,
      "y": 420,
      "width": 28,
      "height": 28,
      "id": "1565935"
    },
    "forsenposture": {
      "x": 0,
      "y": 456,
      "width": 28,
      "height": 28,
      "id": "1565952"
    },
    "forsenposture1": {
      "x": 28,
      "y": 456,
      "width": 28,
      "height": 28,
      "id": "1565958"
    },
    "forsenposture2": {
      "x": 56,
      "y": 456,
      "width": 28,
      "height": 28,
      "id": "1565960"
    },
    "morphintime": {
      "x": 84,
      "y": 456,
      "width": 28,
      "height": 28,
      "id": "156787"
    },
    "moon2mmm": {
      "x": 112,
      "y": 456,
      "width": 28,
      "height": 28,
      "id": "1572248"
    },
    "forsenc": {
      "x": 140,
      "y": 456,
      "width": 28,
      "height": 28,
      "id": "1572478"
    },
    "forsengrill": {
      "x": 168,
      "y": 456,
      "width": 28,
      "height": 28,
      "id": "1572481"
    },
    "forsenreins": {
      "x": 196,
      "y": 456,
      "width": 28,
      "height": 28,
      "id": "1572498"
    },
    "forsenchraken": {
      "x": 224,
      "y": 456,
      "width": 28,
      "height": 28,
      "id": "1572508"
    },
    "forsenhobo": {
      "x": 252,
      "y": 456,
      "width": 28,
      "height": 28,
      "id": "1572725"
    },
    "moon2secretemote": {
      "x": 280,
      "y": 456,
      "width": 28,
      "height": 28,
      "id": "1574694"
    },
    "moon2po": {
      "x": 308,
      "y": 456,
      "width": 28,
      "height": 28,
      "id": "1575108"
    },
    "moon2op": {
      "x": 336,
      "y": 456,
      "width": 28,
      "height": 28,
      "id": "1575110"
    },
    "gunrun": {
      "x": 420,
      "y": 456,
      "width": 28,
      "height": 28,
      "id": "1584743"
    },
    "liriktenk": {
      "x": 509,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "1592774"
    },
    "lirikgasm": {
      "x": 509,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "1592787"
    },
    "liriklate": {
      "x": 509,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "1597520"
    },
    "moon2dev": {
      "x": 509,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "1597801"
    },
    "tatlit": {
      "x": 509,
      "y": 280,
      "width": 28,
      "height": 28,
      "id": "1599586"
    },
    "optimizeprime": {
      "x": 29,
      "y": 764,
      "width": 22,
      "height": 27,
      "id": "16"
    },
    "tatgift": {
      "x": 509,
      "y": 392,
      "width": 28,
      "height": 28,
      "id": "1603328"
    },
    "thankegg": {
      "x": 509,
      "y": 420,
      "width": 28,
      "height": 28,
      "id": "160392"
    },
    "arigatonas": {
      "x": 509,
      "y": 448,
      "width": 28,
      "height": 28,
      "id": "160393"
    },
    "begwan": {
      "x": 0,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "160394"
    },
    "bigphish": {
      "x": 28,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "160395"
    },
    "inuyoface": {
      "x": 56,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "160396"
    },
    "kappu": {
      "x": 84,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "160397"
    },
    "koncha": {
      "x": 112,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "160400"
    },
    "punoko": {
      "x": 140,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "160401"
    },
    "sabaping": {
      "x": 168,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "160402"
    },
    "tearglove": {
      "x": 196,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "160403"
    },
    "tehepelo": {
      "x": 224,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "160404"
    },
    "moon2d": {
      "x": 252,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "1611444"
    },
    "sume": {
      "x": 280,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "162456"
    },
    "tatpreach": {
      "x": 308,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "16247"
    },
    "angryyaphaetae": {
      "x": 336,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "1628001"
    },
    "tpprage": {
      "x": 364,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "1631716"
    },
    "moon2c": {
      "x": 392,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "1651240"
    },
    "twitchlit": {
      "x": 420,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "166263"
    },
    "carlsmile": {
      "x": 448,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "166266"
    },
    "moon2closet": {
      "x": 476,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "1663328"
    },
    "moon2smeg": {
      "x": 504,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "166713"
    },
    "tyler1monk": {
      "x": 537,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "168930"
    },
    "stonelightning": {
      "x": 817,
      "y": 141,
      "width": 20,
      "height": 27,
      "id": "17"
    },
    "sumrip": {
      "x": 537,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "17068"
    },
    "reck25": {
      "x": 537,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "171274"
    },
    "holidaycookie": {
      "x": 537,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "1713813"
    },
    "holidaylog": {
      "x": 537,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "1713816"
    },
    "holidayornament": {
      "x": 537,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "1713818"
    },
    "holidaypresent": {
      "x": 537,
      "y": 224,
      "width": 28,
      "height": 28,
      "id": "1713819"
    },
    "holidaysanta": {
      "x": 537,
      "y": 252,
      "width": 28,
      "height": 28,
      "id": "1713822"
    },
    "holidaytree": {
      "x": 537,
      "y": 280,
      "width": 28,
      "height": 28,
      "id": "1713825"
    },
    "qtpdong": {
      "x": 537,
      "y": 308,
      "width": 28,
      "height": 28,
      "id": "17218"
    },
    "aquamangg": {
      "x": 537,
      "y": 336,
      "width": 28,
      "height": 28,
      "id": "1733216"
    },
    "forseny": {
      "x": 537,
      "y": 364,
      "width": 28,
      "height": 28,
      "id": "173372"
    },
    "forsengasm": {
      "x": 537,
      "y": 392,
      "width": 28,
      "height": 28,
      "id": "173378"
    },
    "forsenwut": {
      "x": 537,
      "y": 420,
      "width": 28,
      "height": 28,
      "id": "175766"
    },
    "sumathena": {
      "x": 537,
      "y": 448,
      "width": 28,
      "height": 28,
      "id": "1768681"
    },
    "lirikloot": {
      "x": 537,
      "y": 476,
      "width": 28,
      "height": 28,
      "id": "1771663"
    },
    "lirikobese": {
      "x": 0,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771965"
    },
    "liriksmart": {
      "x": 28,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771968"
    },
    "liriksalt": {
      "x": 56,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771970"
    },
    "liriknice": {
      "x": 84,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771971"
    },
    "lirikn": {
      "x": 112,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771973"
    },
    "liriklul": {
      "x": 140,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771975"
    },
    "lirikhype": {
      "x": 168,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771976"
    },
    "lirikfr": {
      "x": 196,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771979"
    },
    "lirikpool": {
      "x": 224,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771980"
    },
    "lirikre": {
      "x": 252,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771981"
    },
    "lirikns": {
      "x": 280,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771982"
    },
    "liriklewd": {
      "x": 308,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771988"
    },
    "lirikd": {
      "x": 336,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771989"
    },
    "lirikdj": {
      "x": 364,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771992"
    },
    "lirikgreat": {
      "x": 392,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771994"
    },
    "lirikscared": {
      "x": 420,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771996"
    },
    "lirikez": {
      "x": 448,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1772001"
    },
    "liriks": {
      "x": 476,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1772005"
    },
    "sumpirate": {
      "x": 504,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1774063"
    },
    "moon2peepeega": {
      "x": 532,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1776306"
    },
    "sumtucked": {
      "x": 565,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "1778224"
    },
    "forsenomega": {
      "x": 565,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "177861"
    },
    "forsens": {
      "x": 565,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "177866"
    },
    "tyler1bbc": {
      "x": 565,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "177968"
    },
    "sumohface": {
      "x": 565,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "1785"
    },
    "tpppika": {
      "x": 565,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "1785881"
    },
    "moon21": {
      "x": 565,
      "y": 252,
      "width": 28,
      "height": 28,
      "id": "1794069"
    },
    "moon22": {
      "x": 565,
      "y": 280,
      "width": 28,
      "height": 28,
      "id": "1794071"
    },
    "moon23": {
      "x": 565,
      "y": 308,
      "width": 28,
      "height": 28,
      "id": "1794073"
    },
    "moon24": {
      "x": 565,
      "y": 336,
      "width": 28,
      "height": 28,
      "id": "1794075"
    },
    "moon2coffee": {
      "x": 565,
      "y": 364,
      "width": 28,
      "height": 28,
      "id": "1794235"
    },
    "lirika": {
      "x": 565,
      "y": 392,
      "width": 28,
      "height": 28,
      "id": "1795151"
    },
    "lirikchamp": {
      "x": 565,
      "y": 420,
      "width": 28,
      "height": 28,
      "id": "1795152"
    },
    "lirikfeels": {
      "x": 565,
      "y": 448,
      "width": 28,
      "height": 28,
      "id": "1795153"
    },
    "lirikhey": {
      "x": 565,
      "y": 476,
      "width": 28,
      "height": 28,
      "id": "1795154"
    },
    "lirikpoop": {
      "x": 565,
      "y": 504,
      "width": 28,
      "height": 28,
      "id": "1795156"
    },
    "lirikpray": {
      "x": 0,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1795158"
    },
    "lirikpuke": {
      "x": 28,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1795160"
    },
    "lirikwink": {
      "x": 56,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1795161"
    },
    "lirikkappa": {
      "x": 84,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1795162"
    },
    "theringer": {
      "x": 817,
      "y": 114,
      "width": 20,
      "height": 27,
      "id": "18"
    },
    "sumdust": {
      "x": 140,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1804794"
    },
    "sumswim": {
      "x": 168,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1816465"
    },
    "moon2veryscared": {
      "x": 196,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1817217"
    },
    "moon2dumb": {
      "x": 224,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1817220"
    },
    "moon2smug": {
      "x": 252,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1825113"
    },
    "sumwiener": {
      "x": 280,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1834172"
    },
    "moon2tudd": {
      "x": 308,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1838742"
    },
    "lirikdrool": {
      "x": 0,
      "y": 92,
      "width": 28,
      "height": 28,
      "id": "1840583"
    },
    "forsent": {
      "x": 364,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "184115"
    },
    "qtpfu": {
      "x": 392,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1847364"
    },
    "qtppoo": {
      "x": 420,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1847365"
    },
    "qtpyummy": {
      "x": 448,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1847366"
    },
    "qtphonk": {
      "x": 476,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1850242"
    },
    "qtpbox": {
      "x": 504,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1850256"
    },
    "qtphands": {
      "x": 532,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1850258"
    },
    "qtpwow": {
      "x": 560,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1850262"
    },
    "qtpstare": {
      "x": 593,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "1850266"
    },
    "qtpsip": {
      "x": 593,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "1850298"
    },
    "qtp25": {
      "x": 593,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "185253"
    },
    "tat1": {
      "x": 593,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "185304"
    },
    "tat100": {
      "x": 593,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "185305"
    },
    "tatafk": {
      "x": 593,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "185306"
    },
    "tatkevinh": {
      "x": 593,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "185311"
    },
    "tatlove": {
      "x": 593,
      "y": 224,
      "width": 28,
      "height": 28,
      "id": "185312"
    },
    "tatkevinm": {
      "x": 593,
      "y": 252,
      "width": 28,
      "height": 28,
      "id": "185313"
    },
    "tatthink": {
      "x": 593,
      "y": 280,
      "width": 28,
      "height": 28,
      "id": "185314"
    },
    "tatnolinks": {
      "x": 593,
      "y": 308,
      "width": 28,
      "height": 28,
      "id": "185315"
    },
    "tattopd": {
      "x": 593,
      "y": 336,
      "width": 28,
      "height": 28,
      "id": "185316"
    },
    "tathype": {
      "x": 593,
      "y": 364,
      "width": 28,
      "height": 28,
      "id": "185347"
    },
    "moon2spy": {
      "x": 593,
      "y": 392,
      "width": 28,
      "height": 28,
      "id": "185483"
    },
    "tatpirate": {
      "x": 593,
      "y": 420,
      "width": 28,
      "height": 28,
      "id": "1859035"
    },
    "tatmad": {
      "x": 593,
      "y": 448,
      "width": 28,
      "height": 28,
      "id": "1859043"
    },
    "qtpayaya": {
      "x": 593,
      "y": 476,
      "width": 28,
      "height": 28,
      "id": "1862657"
    },
    "qtpweird": {
      "x": 593,
      "y": 504,
      "width": 28,
      "height": 28,
      "id": "1863554"
    },
    "qtpa": {
      "x": 593,
      "y": 532,
      "width": 28,
      "height": 28,
      "id": "1866844"
    },
    "qtpwut": {
      "x": 0,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "1867315"
    },
    "qtpblush": {
      "x": 28,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "1867515"
    },
    "tatmonster": {
      "x": 56,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "187146"
    },
    "tatprime": {
      "x": 84,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "187149"
    },
    "tatriot": {
      "x": 112,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "187150"
    },
    "tatpotato": {
      "x": 140,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "187153"
    },
    "tattoxic": {
      "x": 168,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "187155"
    },
    "tatkevins": {
      "x": 196,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "187159"
    },
    "moon2s": {
      "x": 224,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "1893080"
    },
    "wholewheat": {
      "x": 817,
      "y": 30,
      "width": 20,
      "height": 30,
      "id": "1896"
    },
    "thunbeast": {
      "x": 789,
      "y": 449,
      "width": 26,
      "height": 28,
      "id": "1898"
    },
    "tf2john": {
      "x": 120,
      "y": 62,
      "width": 22,
      "height": 30,
      "id": "1899"
    },
    "ralpherz": {
      "x": 32,
      "y": 60,
      "width": 33,
      "height": 30,
      "id": "1900"
    },
    "kippa": {
      "x": 789,
      "y": 715,
      "width": 24,
      "height": 28,
      "id": "1901"
    },
    "moon2knucklesrick": {
      "x": 392,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "1901015"
    },
    "keepo": {
      "x": 789,
      "y": 392,
      "width": 27,
      "height": 29,
      "id": "1902"
    },
    "bigbrother": {
      "x": 789,
      "y": 507,
      "width": 24,
      "height": 30,
      "id": "1904"
    },
    "sobayed": {
      "x": 789,
      "y": 537,
      "width": 24,
      "height": 30,
      "id": "1906"
    },
    "liriklit": {
      "x": 504,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "1910543"
    },
    "lirikti": {
      "x": 532,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "1910547"
    },
    "crreamawk": {
      "x": 588,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "191313"
    },
    "angryyapwatching": {
      "x": 621,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "191721"
    },
    "squid1": {
      "x": 621,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "191762"
    },
    "squid2": {
      "x": 621,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "191763"
    },
    "squid3": {
      "x": 621,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "191764"
    },
    "squid4": {
      "x": 621,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "191767"
    },
    "sumchair": {
      "x": 621,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "194200"
    },
    "sumpride": {
      "x": 621,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "194201"
    },
    "sumgg": {
      "x": 621,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "194498"
    },
    "sumgold": {
      "x": 621,
      "y": 224,
      "width": 28,
      "height": 28,
      "id": "194602"
    },
    "moon2w": {
      "x": 621,
      "y": 252,
      "width": 28,
      "height": 28,
      "id": "195855"
    },
    "qtpculled": {
      "x": 621,
      "y": 280,
      "width": 28,
      "height": 28,
      "id": "19671"
    },
    "twitchunity": {
      "x": 621,
      "y": 308,
      "width": 28,
      "height": 28,
      "id": "196892"
    },
    "poonginseung": {
      "x": 621,
      "y": 336,
      "width": 28,
      "height": 28,
      "id": "199081"
    },
    "poongbus": {
      "x": 621,
      "y": 364,
      "width": 28,
      "height": 28,
      "id": "199082"
    },
    "poongnemo": {
      "x": 621,
      "y": 392,
      "width": 28,
      "height": 28,
      "id": "199522"
    },
    "\\:-?\\(": {
      "x": 789,
      "y": 743,
      "width": 24,
      "height": 18,
      "id": "2"
    },
    "lirikderp": {
      "x": 621,
      "y": 448,
      "width": 28,
      "height": 28,
      "id": "201144"
    },
    "lirikdapper": {
      "x": 621,
      "y": 476,
      "width": 28,
      "height": 28,
      "id": "201145"
    },
    "hassaanchop": {
      "x": 621,
      "y": 504,
      "width": 28,
      "height": 28,
      "id": "20225"
    },
    "qtpbeta": {
      "x": 621,
      "y": 560,
      "width": 28,
      "height": 28,
      "id": "206963"
    },
    "sumlul": {
      "x": 28,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "208772"
    },
    "recksoup": {
      "x": 56,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "209730"
    },
    "moon2wow": {
      "x": 84,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "211890"
    },
    "angryyapheup": {
      "x": 112,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "212107"
    },
    "angryyapchex": {
      "x": 140,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "212110"
    },
    "tyler1h1": {
      "x": 168,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "212205"
    },
    "tyler1h2": {
      "x": 196,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "212206"
    },
    "tyler1h3": {
      "x": 224,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "212207"
    },
    "tyler1h4": {
      "x": 252,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "212208"
    },
    "angryyapk": {
      "x": 280,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "212467"
    },
    "tatbest": {
      "x": 308,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "212548"
    },
    "poongyuri": {
      "x": 336,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "213594"
    },
    "angryyapl": {
      "x": 364,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "214473"
    },
    "redcoat": {
      "x": 817,
      "y": 223,
      "width": 19,
      "height": 27,
      "id": "22"
    },
    "lirikl": {
      "x": 420,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "2200"
    },
    "qtpstfu": {
      "x": 448,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "22127"
    },
    "babyrage": {
      "x": 476,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "22639"
    },
    "panicbasket": {
      "x": 504,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "22998"
    },
    "forsenthink": {
      "x": 532,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "239535"
    },
    "reckfarmer": {
      "x": 560,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "24129"
    },
    "fungineer": {
      "x": 789,
      "y": 567,
      "width": 24,
      "height": 30,
      "id": "244"
    },
    "residentsleeper": {
      "x": 616,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "245"
    },
    "kappa": {
      "x": 789,
      "y": 627,
      "width": 25,
      "height": 28,
      "id": "25"
    },
    "joncarnage": {
      "x": 817,
      "y": 87,
      "width": 20,
      "height": 27,
      "id": "26"
    },
    "permasmug": {
      "x": 649,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "27509"
    },
    "buddhabar": {
      "x": 649,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "27602"
    },
    "mrdestructoid": {
      "x": 81,
      "y": 0,
      "width": 39,
      "height": 27,
      "id": "28"
    },
    "tppbait": {
      "x": 649,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "280496"
    },
    "wutface": {
      "x": 649,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "28087"
    },
    "prchase": {
      "x": 649,
      "y": 224,
      "width": 28,
      "height": 28,
      "id": "28328"
    },
    "tpps": {
      "x": 649,
      "y": 252,
      "width": 28,
      "height": 28,
      "id": "284047"
    },
    "sumpuzzle": {
      "x": 649,
      "y": 364,
      "width": 28,
      "height": 28,
      "id": "29115"
    },
    "sumblind": {
      "x": 649,
      "y": 392,
      "width": 28,
      "height": 28,
      "id": "29159"
    },
    "tpplul": {
      "x": 649,
      "y": 420,
      "width": 28,
      "height": 28,
      "id": "295931"
    },
    "\\:-?d": {
      "x": 147,
      "y": 764,
      "width": 24,
      "height": 18,
      "id": "3"
    },
    "bcwarrior": {
      "x": 0,
      "y": 764,
      "width": 29,
      "height": 27,
      "id": "30"
    },
    "mau5": {
      "x": 649,
      "y": 504,
      "width": 28,
      "height": 28,
      "id": "30134"
    },
    "heyguys": {
      "x": 649,
      "y": 532,
      "width": 28,
      "height": 28,
      "id": "30259"
    },
    "tatburp": {
      "x": 649,
      "y": 560,
      "width": 28,
      "height": 28,
      "id": "309686"
    },
    "forsenw": {
      "x": 649,
      "y": 588,
      "width": 28,
      "height": 28,
      "id": "31021"
    },
    "forsenboys": {
      "x": 0,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "31097"
    },
    "forsenrp": {
      "x": 28,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "31100"
    },
    "qtppaid": {
      "x": 56,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "31292"
    },
    "moon2wah": {
      "x": 84,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "317534"
    },
    "qtpspooky": {
      "x": 112,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "3176"
    },
    "reckw": {
      "x": 81,
      "y": 27,
      "width": 32,
      "height": 32,
      "id": "31837"
    },
    "sumstepdad": {
      "x": 196,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "319871"
    },
    "sumsmokey": {
      "x": 224,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "319886"
    },
    "gingerpower": {
      "x": 21,
      "y": 791,
      "width": 21,
      "height": 27,
      "id": "32"
    },
    "sumvac": {
      "x": 280,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "32062"
    },
    "sumvac2": {
      "x": 308,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "32063"
    },
    "sumgodflash": {
      "x": 336,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "32086"
    },
    "sumrage": {
      "x": 364,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "32285"
    },
    "tpcrunchyroll": {
      "x": 392,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "323914"
    },
    "qtpwave": {
      "x": 420,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "32438"
    },
    "dansgame": {
      "x": 120,
      "y": 0,
      "width": 25,
      "height": 32,
      "id": "33"
    },
    "swiftrage": {
      "x": 0,
      "y": 791,
      "width": 21,
      "height": 28,
      "id": "34"
    },
    "peopleschamp": {
      "x": 504,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "3412"
    },
    "notatk": {
      "x": 532,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "34875"
    },
    "mcat": {
      "x": 560,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "35063"
    },
    "qtptilt": {
      "x": 588,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "35064"
    },
    "4head": {
      "x": 817,
      "y": 0,
      "width": 20,
      "height": 30,
      "id": "354"
    },
    "hotpokket": {
      "x": 65,
      "y": 60,
      "width": 28,
      "height": 30,
      "id": "357"
    },
    "pjsalt": {
      "x": 36,
      "y": 30,
      "width": 36,
      "height": 30,
      "id": "36"
    },
    "failfish": {
      "x": 120,
      "y": 32,
      "width": 22,
      "height": 30,
      "id": "360"
    },
    "grammarking": {
      "x": 677,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "3632"
    },
    "forsenddk": {
      "x": 677,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "36391"
    },
    "forsenss": {
      "x": 677,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "36535"
    },
    "panicvis": {
      "x": 677,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "3668"
    },
    "tppcrit": {
      "x": 677,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "36873"
    },
    "tpppokeyen": {
      "x": 677,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "36874"
    },
    "angryyapz": {
      "x": 677,
      "y": 224,
      "width": 28,
      "height": 28,
      "id": "368818"
    },
    "angryyapdog": {
      "x": 677,
      "y": 252,
      "width": 28,
      "height": 28,
      "id": "368836"
    },
    "sumcreeper": {
      "x": 677,
      "y": 280,
      "width": 28,
      "height": 28,
      "id": "3689"
    },
    "tpphax": {
      "x": 677,
      "y": 308,
      "width": 28,
      "height": 28,
      "id": "37025"
    },
    "tppmiss": {
      "x": 677,
      "y": 336,
      "width": 28,
      "height": 28,
      "id": "37026"
    },
    "entropywins": {
      "x": 677,
      "y": 364,
      "width": 28,
      "height": 28,
      "id": "376765"
    },
    "anele": {
      "x": 677,
      "y": 392,
      "width": 28,
      "height": 28,
      "id": "3792"
    },
    "angryyapddoddo": {
      "x": 677,
      "y": 420,
      "width": 28,
      "height": 28,
      "id": "379345"
    },
    "tpprng": {
      "x": 677,
      "y": 448,
      "width": 28,
      "height": 28,
      "id": "38008"
    },
    "tpphelix": {
      "x": 677,
      "y": 476,
      "width": 28,
      "height": 28,
      "id": "38009"
    },
    "reckchamp": {
      "x": 677,
      "y": 504,
      "width": 28,
      "height": 28,
      "id": "383522"
    },
    "ttours": {
      "x": 677,
      "y": 532,
      "width": 28,
      "height": 28,
      "id": "38436"
    },
    "praiseit": {
      "x": 677,
      "y": 560,
      "width": 28,
      "height": 28,
      "id": "38586"
    },
    "reckkgb": {
      "x": 677,
      "y": 588,
      "width": 28,
      "height": 28,
      "id": "388380"
    },
    "tppriot": {
      "x": 677,
      "y": 616,
      "width": 28,
      "height": 28,
      "id": "38947"
    },
    "tpppc": {
      "x": 0,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "39704"
    },
    "\\&gt\\;\\(": {
      "x": 99,
      "y": 764,
      "width": 24,
      "height": 18,
      "id": "4"
    },
    "kevinturtle": {
      "x": 63,
      "y": 791,
      "width": 21,
      "height": 27,
      "id": "40"
    },
    "brokeback": {
      "x": 84,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "4057"
    },
    "sumabby": {
      "x": 112,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "4075"
    },
    "sumoreo": {
      "x": 140,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "4076"
    },
    "kreygasm": {
      "x": 817,
      "y": 196,
      "width": 19,
      "height": 27,
      "id": "41"
    },
    "sumdesi": {
      "x": 196,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "4102"
    },
    "sumhorse": {
      "x": 224,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "4110"
    },
    "tppdome": {
      "x": 252,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "41225"
    },
    "qtpheart": {
      "x": 280,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "41374"
    },
    "tyler1b2": {
      "x": 308,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "420049"
    },
    "tyler1b1": {
      "x": 336,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "420051"
    },
    "pipehype": {
      "x": 364,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "4240"
    },
    "lul": {
      "x": 392,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "425618"
    },
    "powerupr": {
      "x": 420,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "425671"
    },
    "powerupl": {
      "x": 448,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "425688"
    },
    "youwhy": {
      "x": 476,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "4337"
    },
    "ritzmitz": {
      "x": 504,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "4338"
    },
    "elegiggle": {
      "x": 532,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "4339"
    },
    "qtpmoist": {
      "x": 672,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "44081"
    },
    "qtpwhat": {
      "x": 705,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "44083"
    },
    "angryyapchexx": {
      "x": 705,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "443109"
    },
    "hscheers": {
      "x": 705,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "444572"
    },
    "angryyapnoru": {
      "x": 705,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "444791"
    },
    "hswp": {
      "x": 705,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "446979"
    },
    "moon2e": {
      "x": 705,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "448024"
    },
    "poongbase": {
      "x": 705,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "449933"
    },
    "poongkiki": {
      "x": 705,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "449935"
    },
    "ssssss": {
      "x": 51,
      "y": 764,
      "width": 24,
      "height": 24,
      "id": "46"
    },
    "darkmode": {
      "x": 705,
      "y": 280,
      "width": 28,
      "height": 28,
      "id": "461298"
    },
    "angryyapyapyap": {
      "x": 705,
      "y": 308,
      "width": 28,
      "height": 28,
      "id": "465572"
    },
    "humblelife": {
      "x": 705,
      "y": 336,
      "width": 28,
      "height": 28,
      "id": "46881"
    },
    "punchtrees": {
      "x": 75,
      "y": 764,
      "width": 24,
      "height": 24,
      "id": "47"
    },
    "moon2ez": {
      "x": 705,
      "y": 392,
      "width": 28,
      "height": 28,
      "id": "476110"
    },
    "twitchvotes": {
      "x": 705,
      "y": 420,
      "width": 28,
      "height": 28,
      "id": "479745"
    },
    "troflecopter": {
      "x": 705,
      "y": 448,
      "width": 28,
      "height": 28,
      "id": "48083"
    },
    "trofleinc": {
      "x": 705,
      "y": 476,
      "width": 28,
      "height": 28,
      "id": "48120"
    },
    "troflerip": {
      "x": 705,
      "y": 504,
      "width": 28,
      "height": 28,
      "id": "48280"
    },
    "troflerampddos": {
      "x": 705,
      "y": 532,
      "width": 28,
      "height": 28,
      "id": "48281"
    },
    "poonggoldman": {
      "x": 705,
      "y": 560,
      "width": 28,
      "height": 28,
      "id": "482974"
    },
    "trofleb1": {
      "x": 705,
      "y": 588,
      "width": 28,
      "height": 28,
      "id": "48301"
    },
    "poongnof": {
      "x": 705,
      "y": 616,
      "width": 28,
      "height": 28,
      "id": "486392"
    },
    "poong5": {
      "x": 705,
      "y": 644,
      "width": 28,
      "height": 28,
      "id": "486401"
    },
    "corgiderp": {
      "x": 789,
      "y": 421,
      "width": 27,
      "height": 28,
      "id": "49106"
    },
    "forsend": {
      "x": 28,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "494927"
    },
    "\\:-?[z|z|\\|]": {
      "x": 195,
      "y": 764,
      "width": 24,
      "height": 18,
      "id": "5"
    },
    "arsonnosexy": {
      "x": 817,
      "y": 250,
      "width": 18,
      "height": 27,
      "id": "50"
    },
    "tpfufun": {
      "x": 140,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "508650"
    },
    "argieb8": {
      "x": 168,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "51838"
    },
    "smorc": {
      "x": 0,
      "y": 60,
      "width": 32,
      "height": 32,
      "id": "52"
    },
    "reckb": {
      "x": 224,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "520383"
    },
    "forsene": {
      "x": 280,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "521050"
    },
    "shadylulu": {
      "x": 308,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "52492"
    },
    "redteam": {
      "x": 336,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "530888"
    },
    "greenteam": {
      "x": 364,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "530890"
    },
    "tatw": {
      "x": 392,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "54495"
    },
    "happyjack": {
      "x": 420,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "551865"
    },
    "angryjack": {
      "x": 448,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "551866"
    },
    "kappapride": {
      "x": 476,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "55338"
    },
    "angryyaphappy": {
      "x": 504,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "555284"
    },
    "forsenbee": {
      "x": 532,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "555437"
    },
    "moon2m": {
      "x": 588,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "560023"
    },
    "tyler1yikes": {
      "x": 616,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "571061"
    },
    "tppslowpoke": {
      "x": 644,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "57116"
    },
    "tpptrumpet": {
      "x": 672,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "57117"
    },
    "recka": {
      "x": 700,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "574983"
    },
    "coolcat": {
      "x": 733,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "58127"
    },
    "dendiface": {
      "x": 733,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "58135"
    },
    "lirikno": {
      "x": 733,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "586490"
    },
    "notlikethis": {
      "x": 733,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "58765"
    },
    "[oo](_|\\.)[oo]": {
      "x": 243,
      "y": 764,
      "width": 24,
      "height": 18,
      "id": "6"
    },
    "forsenx": {
      "x": 733,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "60257"
    },
    "forsensheffy": {
      "x": 733,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "60390"
    },
    "forsenpuke": {
      "x": 733,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "60391"
    },
    "tppteihard": {
      "x": 733,
      "y": 224,
      "width": 28,
      "height": 28,
      "id": "605235"
    },
    "sumpotato": {
      "x": 733,
      "y": 252,
      "width": 28,
      "height": 28,
      "id": "60613"
    },
    "tatpretty": {
      "x": 733,
      "y": 280,
      "width": 28,
      "height": 28,
      "id": "60643"
    },
    "moon2mm": {
      "x": 733,
      "y": 308,
      "width": 28,
      "height": 28,
      "id": "610213"
    },
    "sumphone": {
      "x": 733,
      "y": 336,
      "width": 28,
      "height": 28,
      "id": "615043"
    },
    "sumez": {
      "x": 733,
      "y": 364,
      "width": 28,
      "height": 28,
      "id": "615044"
    },
    "sumg": {
      "x": 733,
      "y": 392,
      "width": 28,
      "height": 28,
      "id": "615045"
    },
    "sumcrash": {
      "x": 733,
      "y": 420,
      "width": 28,
      "height": 28,
      "id": "61531"
    },
    "tpppayout": {
      "x": 733,
      "y": 448,
      "width": 28,
      "height": 28,
      "id": "618758"
    },
    "reckf": {
      "x": 733,
      "y": 476,
      "width": 28,
      "height": 28,
      "id": "61954"
    },
    "lirikthink": {
      "x": 733,
      "y": 504,
      "width": 28,
      "height": 28,
      "id": "623352"
    },
    "purplestar": {
      "x": 733,
      "y": 532,
      "width": 28,
      "height": 28,
      "id": "624501"
    },
    "tatsellout": {
      "x": 733,
      "y": 560,
      "width": 28,
      "height": 28,
      "id": "62485"
    },
    "fbtouchdown": {
      "x": 733,
      "y": 588,
      "width": 28,
      "height": 28,
      "id": "626795"
    },
    "ripepperonis": {
      "x": 733,
      "y": 616,
      "width": 28,
      "height": 28,
      "id": "62833"
    },
    "dududu": {
      "x": 733,
      "y": 644,
      "width": 28,
      "height": 28,
      "id": "62834"
    },
    "bleedpurple": {
      "x": 733,
      "y": 672,
      "width": 28,
      "height": 28,
      "id": "62835"
    },
    "twitchraid": {
      "x": 0,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "62836"
    },
    "seemsgood": {
      "x": 56,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "64138"
    },
    "qtplurk": {
      "x": 84,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "647939"
    },
    "qtpdead": {
      "x": 112,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "647951"
    },
    "frankerz": {
      "x": 0,
      "y": 0,
      "width": 40,
      "height": 30,
      "id": "65"
    },
    "poongtt": {
      "x": 168,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "656466"
    },
    "poongl": {
      "x": 196,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "658395"
    },
    "onehand": {
      "x": 817,
      "y": 60,
      "width": 20,
      "height": 27,
      "id": "66"
    },
    "poongb": {
      "x": 252,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "665687"
    },
    "poongp": {
      "x": 280,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "665688"
    },
    "poonggy": {
      "x": 308,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "669169"
    },
    "poongch": {
      "x": 336,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "669170"
    },
    "forseniq": {
      "x": 392,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "67683"
    },
    "hassanchop": {
      "x": 817,
      "y": 168,
      "width": 19,
      "height": 28,
      "id": "68"
    },
    "forsenkek": {
      "x": 448,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "684688"
    },
    "forsenl": {
      "x": 476,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "684692"
    },
    "minglee": {
      "x": 504,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "68856"
    },
    "bloodtrail": {
      "x": 40,
      "y": 0,
      "width": 41,
      "height": 28,
      "id": "69"
    },
    "qtpmew": {
      "x": 560,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "69103"
    },
    "sumpluto": {
      "x": 588,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "69298"
    },
    "moon2dab": {
      "x": 616,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "695739"
    },
    "forsenredsonic": {
      "x": 644,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "696755"
    },
    "qtpbaked": {
      "x": 672,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "69729"
    },
    "qtpfeels": {
      "x": 700,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "69731"
    },
    "b-?\\)": {
      "x": 219,
      "y": 764,
      "width": 24,
      "height": 18,
      "id": "7"
    },
    "tatfat": {
      "x": 761,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "70086"
    },
    "tatpleb": {
      "x": 761,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "70087"
    },
    "tatmlg": {
      "x": 761,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "70089"
    },
    "kappaross": {
      "x": 761,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "70433"
    },
    "tattank": {
      "x": 761,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "708603"
    },
    "tatwink": {
      "x": 761,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "720524"
    },
    "popcorn": {
      "x": 761,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "724216"
    },
    "qtpsmug": {
      "x": 761,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "729285"
    },
    "qtpcat": {
      "x": 761,
      "y": 224,
      "width": 28,
      "height": 28,
      "id": "729414"
    },
    "dbstyle": {
      "x": 93,
      "y": 60,
      "width": 21,
      "height": 30,
      "id": "73"
    },
    "tpppokeball": {
      "x": 761,
      "y": 280,
      "width": 28,
      "height": 28,
      "id": "73516"
    },
    "troflesnail": {
      "x": 761,
      "y": 308,
      "width": 28,
      "height": 28,
      "id": "73873"
    },
    "asianglow": {
      "x": 789,
      "y": 477,
      "width": 24,
      "height": 30,
      "id": "74"
    },
    "thething": {
      "x": 761,
      "y": 364,
      "width": 28,
      "height": 28,
      "id": "7427"
    },
    "qtpd": {
      "x": 761,
      "y": 392,
      "width": 28,
      "height": 28,
      "id": "743103"
    },
    "kappaclaus": {
      "x": 761,
      "y": 420,
      "width": 28,
      "height": 28,
      "id": "74510"
    },
    "angryyapoznojam": {
      "x": 761,
      "y": 448,
      "width": 28,
      "height": 28,
      "id": "748215"
    },
    "reckc": {
      "x": 761,
      "y": 476,
      "width": 28,
      "height": 28,
      "id": "74931"
    },
    "reckp1": {
      "x": 761,
      "y": 504,
      "width": 28,
      "height": 28,
      "id": "756332"
    },
    "reckp2": {
      "x": 761,
      "y": 532,
      "width": 28,
      "height": 28,
      "id": "756334"
    },
    "reckp3": {
      "x": 761,
      "y": 560,
      "width": 28,
      "height": 28,
      "id": "756335"
    },
    "reckp4": {
      "x": 761,
      "y": 588,
      "width": 28,
      "height": 28,
      "id": "756336"
    },
    "reckbald": {
      "x": 761,
      "y": 616,
      "width": 28,
      "height": 28,
      "id": "76093"
    },
    "angryyapzzz": {
      "x": 761,
      "y": 644,
      "width": 28,
      "height": 28,
      "id": "761175"
    },
    "reckddos": {
      "x": 761,
      "y": 672,
      "width": 28,
      "height": 28,
      "id": "77110"
    },
    "forsenwtf": {
      "x": 761,
      "y": 700,
      "width": 28,
      "height": 28,
      "id": "780629"
    },
    "reckrage": {
      "x": 0,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "78421"
    },
    "\\:-?(o|o)": {
      "x": 123,
      "y": 764,
      "width": 24,
      "height": 18,
      "id": "8"
    },
    "qtplucian": {
      "x": 56,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "80386"
    },
    "sumlove": {
      "x": 84,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "80958"
    },
    "sumfail": {
      "x": 112,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "80993"
    },
    "sumfood": {
      "x": 140,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "80994"
    },
    "sumthump": {
      "x": 168,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "80995"
    },
    "sumup": {
      "x": 196,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "80996"
    },
    "sumwtf": {
      "x": 224,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "80998"
    },
    "ohmydog": {
      "x": 252,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "81103"
    },
    "osfrog": {
      "x": 280,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "81248"
    },
    "serioussloth": {
      "x": 308,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "81249"
    },
    "komodohype": {
      "x": 336,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "81273"
    },
    "vohiyo": {
      "x": 364,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "81274"
    },
    "mikehogu": {
      "x": 392,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "81636"
    },
    "kappawealth": {
      "x": 420,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "81997"
    },
    "tyler1n": {
      "x": 448,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "821920"
    },
    "reckh": {
      "x": 476,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "83335"
    },
    "reckgl": {
      "x": 532,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "84049"
    },
    "reckgr": {
      "x": 560,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "84050"
    },
    "tatchair": {
      "x": 588,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "8408"
    },
    "cmonbruh": {
      "x": 616,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "84608"
    },
    "biblethump": {
      "x": 0,
      "y": 30,
      "width": 36,
      "height": 30,
      "id": "86"
    },
    "tombraid": {
      "x": 728,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "864205"
    },
    "tatmesa": {
      "x": 756,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "86639"
    },
    "reckp": {
      "x": 789,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "86847"
    },
    "shazbotstix": {
      "x": 789,
      "y": 597,
      "width": 24,
      "height": 30,
      "id": "87"
    },
    "angryyape": {
      "x": 789,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "87236"
    },
    "angryyapf": {
      "x": 789,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "87239"
    },
    "lirikhs": {
      "x": 789,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "875499"
    },
    "qtph": {
      "x": 789,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "876449"
    },
    "tatsuh": {
      "x": 789,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "87756"
    },
    "pogchamp": {
      "x": 789,
      "y": 685,
      "width": 23,
      "height": 30,
      "id": "88"
    },
    "qtpminion": {
      "x": 789,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "887530"
    },
    "tatoshi": {
      "x": 28,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "89232"
    },
    "angryyapg": {
      "x": 761,
      "y": 252,
      "width": 28,
      "height": 28,
      "id": "89520"
    },
    "forsenwhip": {
      "x": 728,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "89640"
    },
    "forsensleeper": {
      "x": 420,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "89641"
    },
    "forsengun": {
      "x": 224,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "89650"
    },
    "forsenpuke2": {
      "x": 733,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "89678"
    },
    "smoocherz": {
      "x": 112,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "89945"
    },
    "\\&lt\\;3": {
      "x": 267,
      "y": 764,
      "width": 24,
      "height": 18,
      "id": "9"
    },
    "nomnom": {
      "x": 84,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "90075"
    },
    "stinkycheese": {
      "x": 0,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "90076"
    },
    "cheffrank": {
      "x": 705,
      "y": 364,
      "width": 28,
      "height": 28,
      "id": "90129"
    },
    "forsenknife": {
      "x": 168,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "90377"
    },
    "troflemoon": {
      "x": 56,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "90792"
    },
    "sumbuhblam": {
      "x": 28,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "90969"
    },
    "sums": {
      "x": 677,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "910286"
    },
    "pmstwin": {
      "x": 789,
      "y": 655,
      "width": 23,
      "height": 30,
      "id": "92"
    },
    "forsenprime": {
      "x": 616,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "922505"
    },
    "tatpik": {
      "x": 476,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "92258"
    },
    "tatkkevin": {
      "x": 252,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "927952"
    },
    "moon2md": {
      "x": 649,
      "y": 476,
      "width": 28,
      "height": 28,
      "id": "938129"
    },
    "reckdong": {
      "x": 649,
      "y": 448,
      "width": 28,
      "height": 28,
      "id": "938946"
    },
    "reckd": {
      "x": 649,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "938950"
    },
    "sumsuh": {
      "x": 649,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "94254"
    },
    "moon2h": {
      "x": 588,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "952500"
    },
    "moon2cd": {
      "x": 392,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "955757"
    },
    "tatdab": {
      "x": 621,
      "y": 420,
      "width": 28,
      "height": 28,
      "id": "95854"
    },
    "tatjk": {
      "x": 476,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "95855"
    },
    "earthday": {
      "x": 448,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "959018"
    },
    "forsenlewd": {
      "x": 420,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "96553"
    },
    "partyhat": {
      "x": 364,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "965738"
    },
    "taty": {
      "x": 280,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "97067"
    },
    "tatlate": {
      "x": 252,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "972382"
    },
    "daesuppy": {
      "x": 336,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "973"
    },
    "sumorc": {
      "x": 112,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "9793"
    },
    "futureman": {
      "x": 537,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "98562"
    },
    "sumrekt": {
      "x": 453,
      "y": 364,
      "width": 28,
      "height": 28,
      "id": "9873"
    },
    "sum1g": {
      "x": 140,
      "y": 372,
      "width": 28,
      "height": 28,
      "id": "9874"
    },
    "sumbag": {
      "x": 84,
      "y": 344,
      "width": 28,
      "height": 28,
      "id": "9875"
    },
    "qtpthump": {
      "x": 224,
      "y": 288,
      "width": 28,
      "height": 28,
      "id": "99038"
    },
    "qtpowo": {
      "x": 0,
      "y": 204,
      "width": 28,
      "height": 28,
      "id": "99039"
    }
  };

  var bttvSpriteSheet = {
    "(chompy)": {
      "x": 214,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "550b225fff8ecee922d2a3b2"
    },
    "(poolparty)": {
      "x": 87,
      "y": 34,
      "width": 20,
      "height": 20,
      "id": "5502883d135896936880fdd3"
    },
    "(puke)": {
      "x": 0,
      "y": 296,
      "width": 20,
      "height": 20,
      "id": "550288fe135896936880fdd4"
    },
    ":'(": {
      "x": 107,
      "y": 34,
      "width": 20,
      "height": 20,
      "id": "55028923135896936880fdd5"
    },
    ":tf:": {
      "x": 79,
      "y": 128,
      "width": 28,
      "height": 28,
      "id": "54fa8f1401e468494b85b537"
    },
    "angelthump": {
      "x": 0,
      "y": 30,
      "width": 84,
      "height": 28,
      "id": "566ca1a365dbbdab32ec055b"
    },
    "aplis": {
      "x": 214,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "54fa8f4201e468494b85b538"
    },
    "ariw": {
      "x": 0,
      "y": 212,
      "width": 28,
      "height": 28,
      "id": "56fa09f18eff3b595e93ac26"
    },
    "baconeffect": {
      "x": 28,
      "y": 212,
      "width": 28,
      "height": 28,
      "id": "54fbf05a01abde735115de5e"
    },
    "badass": {
      "x": 56,
      "y": 212,
      "width": 28,
      "height": 28,
      "id": "54faa4f101e468494b85b577"
    },
    "basedgod": {
      "x": 0,
      "y": 240,
      "width": 28,
      "height": 28,
      "id": "566c9eeb65dbbdab32ec052b"
    },
    "batkappa": {
      "x": 56,
      "y": 240,
      "width": 28,
      "height": 28,
      "id": "550b6b07ff8ecee922d2a3e7"
    },
    "blackappa": {
      "x": 168,
      "y": 240,
      "width": 28,
      "height": 28,
      "id": "54faa50d01e468494b85b578"
    },
    "brobalt": {
      "x": 74,
      "y": 88,
      "width": 46,
      "height": 30,
      "id": "54fbf00a01abde735115de5c"
    },
    "bttvangry": {
      "x": 112,
      "y": 268,
      "width": 28,
      "height": 28,
      "id": "550291a3135896936880fde3"
    },
    "bttvconfused": {
      "x": 252,
      "y": 268,
      "width": 28,
      "height": 28,
      "id": "550291be135896936880fde4"
    },
    "bttvcool": {
      "x": 298,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "550291d4135896936880fde5"
    },
    "bttvgrin": {
      "x": 143,
      "y": 65,
      "width": 28,
      "height": 28,
      "id": "550291ea135896936880fde6"
    },
    "bttvhappy": {
      "x": 143,
      "y": 93,
      "width": 28,
      "height": 28,
      "id": "55029200135896936880fde7"
    },
    "bttvheart": {
      "x": 113,
      "y": 58,
      "width": 28,
      "height": 28,
      "id": "55029215135896936880fde8"
    },
    "bttvnice": {
      "x": 0,
      "y": 128,
      "width": 42,
      "height": 28,
      "id": "54fab7d2633595ca4c713abf"
    },
    "bttvsad": {
      "x": 107,
      "y": 128,
      "width": 28,
      "height": 28,
      "id": "5502925d135896936880fdea"
    },
    "bttvsleep": {
      "x": 135,
      "y": 128,
      "width": 28,
      "height": 28,
      "id": "55029272135896936880fdeb"
    },
    "bttvsurprised": {
      "x": 0,
      "y": 156,
      "width": 28,
      "height": 28,
      "id": "55029288135896936880fdec"
    },
    "bttvtongue": {
      "x": 28,
      "y": 156,
      "width": 28,
      "height": 28,
      "id": "5502929b135896936880fded"
    },
    "bttvtwink": {
      "x": 56,
      "y": 156,
      "width": 28,
      "height": 28,
      "id": "55029247135896936880fde9"
    },
    "bttvunsure": {
      "x": 84,
      "y": 156,
      "width": 28,
      "height": 28,
      "id": "550292ad135896936880fdee"
    },
    "bttvwink": {
      "x": 112,
      "y": 156,
      "width": 28,
      "height": 28,
      "id": "550292c0135896936880fdef"
    },
    "burself": {
      "x": 140,
      "y": 156,
      "width": 28,
      "height": 28,
      "id": "566c9f3b65dbbdab32ec052e"
    },
    "buttersauce": {
      "x": 168,
      "y": 156,
      "width": 28,
      "height": 28,
      "id": "54fbf02f01abde735115de5d"
    },
    "candianrage": {
      "x": 0,
      "y": 184,
      "width": 28,
      "height": 28,
      "id": "54fbf09c01abde735115de61"
    },
    "chaccepted": {
      "x": 28,
      "y": 184,
      "width": 28,
      "height": 28,
      "id": "54fa8fb201e468494b85b53b"
    },
    "cigrip": {
      "x": 56,
      "y": 184,
      "width": 28,
      "height": 28,
      "id": "54fa8fce01e468494b85b53c"
    },
    "concerndoge": {
      "x": 298,
      "y": 140,
      "width": 25,
      "height": 28,
      "id": "566c9f6365dbbdab32ec0532"
    },
    "cruw": {
      "x": 112,
      "y": 184,
      "width": 28,
      "height": 28,
      "id": "55471c2789d53f2d12781713"
    },
    "d:": {
      "x": 140,
      "y": 184,
      "width": 28,
      "height": 28,
      "id": "55028cd2135896936880fdd7"
    },
    "datsauce": {
      "x": 168,
      "y": 184,
      "width": 28,
      "height": 28,
      "id": "54fa903b01e468494b85b53f"
    },
    "dogewitit": {
      "x": 214,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "54faa52f01e468494b85b579"
    },
    "duckerz": {
      "x": 42,
      "y": 128,
      "width": 37,
      "height": 28,
      "id": "573d38b50ffbf6cc5cc38dc9"
    },
    "fapfapfap": {
      "x": 214,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "566c9f9265dbbdab32ec0538"
    },
    "fcreep": {
      "x": 214,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "56d937f7216793c63ec140cb"
    },
    "feelsamazingman": {
      "x": 214,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "5733ff12e72c3c0814233e20"
    },
    "feelsbadman": {
      "x": 178,
      "y": 92,
      "width": 30,
      "height": 30,
      "id": "566c9fc265dbbdab32ec053b"
    },
    "feelsbirthdayman": {
      "x": 120,
      "y": 88,
      "width": 19,
      "height": 28,
      "id": "55b6524154eefd53777b2580"
    },
    "feelsgoodman": {
      "x": 178,
      "y": 62,
      "width": 30,
      "height": 30,
      "id": "566c9fde65dbbdab32ec053e"
    },
    "firespeed": {
      "x": 60,
      "y": 58,
      "width": 53,
      "height": 28,
      "id": "566c9ff365dbbdab32ec0541"
    },
    "fishmoley": {
      "x": 87,
      "y": 0,
      "width": 56,
      "height": 34,
      "id": "566ca00f65dbbdab32ec0544"
    },
    "foreveralone": {
      "x": 84,
      "y": 212,
      "width": 28,
      "height": 28,
      "id": "54fa909b01e468494b85b542"
    },
    "fuckyea": {
      "x": 112,
      "y": 212,
      "width": 28,
      "height": 28,
      "id": "54fa90d601e468494b85b544"
    },
    "gaben": {
      "x": 140,
      "y": 212,
      "width": 28,
      "height": 28,
      "id": "54fa90ba01e468494b85b543"
    },
    "hahaa": {
      "x": 168,
      "y": 212,
      "width": 28,
      "height": 28,
      "id": "555981336ba1901877765555"
    },
    "hailhelix": {
      "x": 298,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "54fa90f201e468494b85b545"
    },
    "herbperve": {
      "x": 242,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "54fa913701e468494b85b546"
    },
    "hhhehehe": {
      "x": 242,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "566ca02865dbbdab32ec0547"
    },
    "hhydro": {
      "x": 242,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "54fbef6601abde735115de57"
    },
    "iamsocal": {
      "x": 242,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "54fbef8701abde735115de58"
    },
    "idog": {
      "x": 242,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "54fa919901e468494b85b548"
    },
    "kaged": {
      "x": 242,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "54fbf11001abde735115de66"
    },
    "kappacool": {
      "x": 298,
      "y": 196,
      "width": 22,
      "height": 28,
      "id": "560577560874de34757d2dc0"
    },
    "karappa": {
      "x": 242,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "550b344bff8ecee922d2a3c1"
    },
    "kkona": {
      "x": 178,
      "y": 122,
      "width": 25,
      "height": 34,
      "id": "566ca04265dbbdab32ec054a"
    },
    "lul": {
      "x": 28,
      "y": 240,
      "width": 28,
      "height": 28,
      "id": "567b00c61ddbe1786688a633"
    },
    "m&mjc": {
      "x": 178,
      "y": 0,
      "width": 36,
      "height": 30,
      "id": "54fab45f633595ca4c713abc"
    },
    "minijulia": {
      "x": 84,
      "y": 240,
      "width": 28,
      "height": 28,
      "id": "552d2fc2236a1aa17a996c5b"
    },
    "monkas": {
      "x": 112,
      "y": 240,
      "width": 28,
      "height": 28,
      "id": "56e9f494fff3cc5c35e5287e"
    },
    "motnahp": {
      "x": 140,
      "y": 240,
      "width": 28,
      "height": 28,
      "id": "55288e390fa35376704a4c7a"
    },
    "nam": {
      "x": 0,
      "y": 88,
      "width": 38,
      "height": 40,
      "id": "566ca06065dbbdab32ec054e"
    },
    "notsquishy": {
      "x": 298,
      "y": 168,
      "width": 24,
      "height": 28,
      "id": "5709ab688eff3b595e93c595"
    },
    "ohgod": {
      "x": 224,
      "y": 240,
      "width": 28,
      "height": 28,
      "id": "566ca07965dbbdab32ec0552"
    },
    "ohhhkee": {
      "x": 270,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "54fbefa901abde735115de59"
    },
    "ohmygoodness": {
      "x": 270,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "54fa925e01e468494b85b54d"
    },
    "pancakemix": {
      "x": 270,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "54fa927801e468494b85b54e"
    },
    "pedobear": {
      "x": 270,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "54fa928f01e468494b85b54f"
    },
    "pokerface": {
      "x": 270,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "54fa92a701e468494b85b550"
    },
    "poledoge": {
      "x": 270,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "566ca09365dbbdab32ec0555"
    },
    "rageface": {
      "x": 270,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "54fa92d701e468494b85b552"
    },
    "rarepepe": {
      "x": 270,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "555015b77676617e17dd2e8e"
    },
    "rebeccablack": {
      "x": 270,
      "y": 224,
      "width": 28,
      "height": 28,
      "id": "54fa92ee01e468494b85b553"
    },
    "ronsmug": {
      "x": 298,
      "y": 252,
      "width": 21,
      "height": 28,
      "id": "55f324c47f08be9f0a63cce0"
    },
    "rstrike": {
      "x": 28,
      "y": 268,
      "width": 28,
      "height": 28,
      "id": "54fa930801e468494b85b554"
    },
    "saltycorn": {
      "x": 143,
      "y": 35,
      "width": 28,
      "height": 30,
      "id": "56901914991f200c34ffa656"
    },
    "savagejerky": {
      "x": 84,
      "y": 268,
      "width": 28,
      "height": 28,
      "id": "54fb603201abde735115ddb5"
    },
    "sexpanda": {
      "x": 38,
      "y": 88,
      "width": 36,
      "height": 40,
      "id": "5502874d135896936880fdd2"
    },
    "she'llberight": {
      "x": 140,
      "y": 268,
      "width": 28,
      "height": 28,
      "id": "54fbefc901abde735115de5a"
    },
    "shoopdawhoop": {
      "x": 168,
      "y": 268,
      "width": 28,
      "height": 28,
      "id": "54fa932201e468494b85b555"
    },
    "soserious": {
      "x": 196,
      "y": 268,
      "width": 28,
      "height": 28,
      "id": "5514afe362e6bd0027aede8a"
    },
    "sosgame": {
      "x": 224,
      "y": 268,
      "width": 28,
      "height": 28,
      "id": "553b48a21f145f087fc15ca6"
    },
    "sourpls": {
      "x": 143,
      "y": 0,
      "width": 35,
      "height": 35,
      "id": "566ca38765dbbdab32ec0560"
    },
    "sqshy": {
      "x": 298,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "59cf182fcbe2693d59d7bf46"
    },
    "suchfraud": {
      "x": 298,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "54fbf07e01abde735115de5f"
    },
    "swedswag": {
      "x": 298,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "54fa9cc901e468494b85b565"
    },
    "taxibro": {
      "x": 0,
      "y": 0,
      "width": 87,
      "height": 30,
      "id": "54fbefeb01abde735115de5b"
    },
    "tehpolecat": {
      "x": 298,
      "y": 224,
      "width": 21,
      "height": 28,
      "id": "566ca11a65dbbdab32ec0558"
    },
    "topham": {
      "x": 0,
      "y": 268,
      "width": 28,
      "height": 28,
      "id": "54fa934001e468494b85b556"
    },
    "twat": {
      "x": 196,
      "y": 240,
      "width": 28,
      "height": 28,
      "id": "54fa935601e468494b85b557"
    },
    "vapenation": {
      "x": 242,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "56f5be00d48006ba34f530a4"
    },
    "vislaud": {
      "x": 196,
      "y": 212,
      "width": 28,
      "height": 28,
      "id": "550352766f86a5b26c281ba2"
    },
    "watchusay": {
      "x": 214,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "54fa99b601e468494b85b55d"
    },
    "whatayolk": {
      "x": 84,
      "y": 184,
      "width": 28,
      "height": 28,
      "id": "54fa93d001e468494b85b559"
    },
    "wowee": {
      "x": 56,
      "y": 268,
      "width": 28,
      "height": 28,
      "id": "58d2e73058d8950a875ad027"
    },
    "yetiz": {
      "x": 0,
      "y": 58,
      "width": 60,
      "height": 30,
      "id": "55189a5062e6bd0027aee082"
    },
    "zappa": {
      "x": 178,
      "y": 30,
      "width": 32,
      "height": 32,
      "id": "5622aaef3286c42e57d8e4ab"
    }
  };

  var emoji = {
    template: function template(id) {
      id = id.replace(/^:|:$/g, "");
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

  var emojiNames = {
    bowtie: {
      x: 1099,
      y: 896
    },
    smile: {
      x: 960,
      y: 1291
    },
    laughing: {
      x: 0,
      y: 75
    },
    blush: {
      x: 64,
      y: 75
    },
    smiley: {
      x: 139,
      y: 0
    },
    relaxed: {
      x: 139,
      y: 64
    },
    smirk: {
      x: 0,
      y: 139
    },
    heart_eyes: {
      x: 64,
      y: 139
    },
    kissing_heart: {
      x: 128,
      y: 139
    },
    kissing_closed_eyes: {
      x: 203,
      y: 0
    },
    flushed: {
      x: 203,
      y: 64
    },
    relieved: {
      x: 203,
      y: 128
    },
    satisfied: {
      x: 0,
      y: 203
    },
    grin: {
      x: 64,
      y: 203
    },
    wink: {
      x: 128,
      y: 203
    },
    stuck_out_tongue_winking_eye: {
      x: 192,
      y: 203
    },
    stuck_out_tongue_closed_eyes: {
      x: 267,
      y: 0
    },
    grinning: {
      x: 267,
      y: 64
    },
    kissing: {
      x: 267,
      y: 128
    },
    kissing_smiling_eyes: {
      x: 267,
      y: 192
    },
    stuck_out_tongue: {
      x: 0,
      y: 267
    },
    sleeping: {
      x: 64,
      y: 267
    },
    worried: {
      x: 128,
      y: 267
    },
    frowning: {
      x: 192,
      y: 267
    },
    anguished: {
      x: 256,
      y: 267
    },
    open_mouth: {
      x: 331,
      y: 0
    },
    grimacing: {
      x: 331,
      y: 64
    },
    confused: {
      x: 331,
      y: 128
    },
    hushed: {
      x: 331,
      y: 192
    },
    expressionless: {
      x: 331,
      y: 256
    },
    unamused: {
      x: 0,
      y: 331
    },
    sweat_smile: {
      x: 64,
      y: 331
    },
    sweat: {
      x: 128,
      y: 331
    },
    disappointed_relieved: {
      x: 192,
      y: 331
    },
    weary: {
      x: 256,
      y: 331
    },
    pensive: {
      x: 320,
      y: 331
    },
    disappointed: {
      x: 395,
      y: 0
    },
    confounded: {
      x: 395,
      y: 64
    },
    fearful: {
      x: 395,
      y: 128
    },
    cold_sweat: {
      x: 395,
      y: 192
    },
    persevere: {
      x: 395,
      y: 256
    },
    cry: {
      x: 395,
      y: 320
    },
    sob: {
      x: 0,
      y: 395
    },
    joy: {
      x: 64,
      y: 395
    },
    astonished: {
      x: 128,
      y: 395
    },
    scream: {
      x: 192,
      y: 395
    },
    neckbeard: {
      x: 256,
      y: 395
    },
    tired_face: {
      x: 320,
      y: 395
    },
    angry: {
      x: 384,
      y: 395
    },
    rage: {
      x: 459,
      y: 0
    },
    triumph: {
      x: 459,
      y: 64
    },
    sleepy: {
      x: 459,
      y: 128
    },
    yum: {
      x: 459,
      y: 192
    },
    mask: {
      x: 459,
      y: 256
    },
    sunglasses: {
      x: 459,
      y: 320
    },
    dizzy_face: {
      x: 459,
      y: 384
    },
    imp: {
      x: 0,
      y: 459
    },
    smiling_imp: {
      x: 64,
      y: 459
    },
    neutral_face: {
      x: 128,
      y: 459
    },
    no_mouth: {
      x: 192,
      y: 459
    },
    innocent: {
      x: 256,
      y: 459
    },
    alien: {
      x: 320,
      y: 459
    },
    yellow_heart: {
      x: 384,
      y: 459
    },
    blue_heart: {
      x: 448,
      y: 459
    },
    purple_heart: {
      x: 523,
      y: 0
    },
    heart: {
      x: 523,
      y: 64
    },
    green_heart: {
      x: 523,
      y: 128
    },
    broken_heart: {
      x: 523,
      y: 192
    },
    heartbeat: {
      x: 523,
      y: 256
    },
    heartpulse: {
      x: 523,
      y: 320
    },
    two_hearts: {
      x: 523,
      y: 384
    },
    revolving_hearts: {
      x: 523,
      y: 448
    },
    cupid: {
      x: 0,
      y: 523
    },
    sparkling_heart: {
      x: 64,
      y: 523
    },
    sparkles: {
      x: 128,
      y: 523
    },
    star: {
      x: 192,
      y: 523
    },
    star2: {
      x: 256,
      y: 523
    },
    dizzy: {
      x: 320,
      y: 523
    },
    boom: {
      x: 384,
      y: 523
    },
    collision: {
      x: 448,
      y: 523
    },
    anger: {
      x: 512,
      y: 523
    },
    exclamation: {
      x: 587,
      y: 0
    },
    question: {
      x: 587,
      y: 64
    },
    grey_exclamation: {
      x: 587,
      y: 128
    },
    grey_question: {
      x: 587,
      y: 192
    },
    zzz: {
      x: 587,
      y: 256
    },
    dash: {
      x: 587,
      y: 320
    },
    sweat_drops: {
      x: 587,
      y: 384
    },
    notes: {
      x: 587,
      y: 448
    },
    musical_note: {
      x: 587,
      y: 512
    },
    fire: {
      x: 0,
      y: 587
    },
    poop: {
      x: 64,
      y: 587
    },
    thumbsup: {
      x: 128,
      y: 587
    },
    thumbsdown: {
      x: 192,
      y: 587
    },
    ok_hand: {
      x: 256,
      y: 587
    },
    punch: {
      x: 320,
      y: 587
    },
    facepunch: {
      x: 384,
      y: 587
    },
    fist: {
      x: 448,
      y: 587
    },
    v: {
      x: 512,
      y: 587
    },
    wave: {
      x: 576,
      y: 587
    },
    hand: {
      x: 651,
      y: 0
    },
    raised_hand: {
      x: 651,
      y: 64
    },
    open_hands: {
      x: 651,
      y: 128
    },
    point_up: {
      x: 651,
      y: 192
    },
    point_down: {
      x: 651,
      y: 256
    },
    point_left: {
      x: 651,
      y: 320
    },
    point_right: {
      x: 651,
      y: 384
    },
    raised_hands: {
      x: 651,
      y: 448
    },
    pray: {
      x: 651,
      y: 512
    },
    point_up_2: {
      x: 651,
      y: 576
    },
    clap: {
      x: 0,
      y: 651
    },
    muscle: {
      x: 64,
      y: 651
    },
    metal: {
      x: 128,
      y: 651
    },
    fu: {
      x: 192,
      y: 651
    },
    runner: {
      x: 256,
      y: 651
    },
    running: {
      x: 320,
      y: 651
    },
    couple: {
      x: 384,
      y: 651
    },
    family: {
      x: 448,
      y: 651
    },
    two_men_holding_hands: {
      x: 512,
      y: 651
    },
    two_women_holding_hands: {
      x: 576,
      y: 651
    },
    dancer: {
      x: 640,
      y: 651
    },
    dancers: {
      x: 715,
      y: 0
    },
    ok_woman: {
      x: 715,
      y: 64
    },
    no_good: {
      x: 715,
      y: 128
    },
    information_desk_person: {
      x: 715,
      y: 192
    },
    raising_hand: {
      x: 715,
      y: 256
    },
    bride_with_veil: {
      x: 715,
      y: 320
    },
    person_with_pouting_face: {
      x: 715,
      y: 384
    },
    person_frowning: {
      x: 715,
      y: 448
    },
    bow: {
      x: 715,
      y: 512
    },
    couplekiss: {
      x: 715,
      y: 576
    },
    couple_with_heart: {
      x: 715,
      y: 640
    },
    massage: {
      x: 0,
      y: 715
    },
    haircut: {
      x: 64,
      y: 715
    },
    nail_care: {
      x: 128,
      y: 715
    },
    boy: {
      x: 192,
      y: 715
    },
    girl: {
      x: 256,
      y: 715
    },
    woman: {
      x: 320,
      y: 715
    },
    man: {
      x: 384,
      y: 715
    },
    baby: {
      x: 448,
      y: 715
    },
    older_woman: {
      x: 512,
      y: 715
    },
    older_man: {
      x: 576,
      y: 715
    },
    person_with_blond_hair: {
      x: 640,
      y: 715
    },
    man_with_gua_pi_mao: {
      x: 704,
      y: 715
    },
    man_with_turban: {
      x: 779,
      y: 0
    },
    construction_worker: {
      x: 779,
      y: 64
    },
    cop: {
      x: 779,
      y: 128
    },
    angel: {
      x: 779,
      y: 192
    },
    princess: {
      x: 779,
      y: 256
    },
    smiley_cat: {
      x: 779,
      y: 320
    },
    smile_cat: {
      x: 779,
      y: 384
    },
    heart_eyes_cat: {
      x: 779,
      y: 448
    },
    kissing_cat: {
      x: 779,
      y: 512
    },
    smirk_cat: {
      x: 779,
      y: 576
    },
    scream_cat: {
      x: 779,
      y: 640
    },
    crying_cat_face: {
      x: 779,
      y: 704
    },
    joy_cat: {
      x: 0,
      y: 779
    },
    pouting_cat: {
      x: 64,
      y: 779
    },
    japanese_ogre: {
      x: 128,
      y: 779
    },
    japanese_goblin: {
      x: 192,
      y: 779
    },
    see_no_evil: {
      x: 256,
      y: 779
    },
    hear_no_evil: {
      x: 320,
      y: 779
    },
    speak_no_evil: {
      x: 384,
      y: 779
    },
    guardsman: {
      x: 448,
      y: 779
    },
    skull: {
      x: 512,
      y: 779
    },
    feet: {
      x: 576,
      y: 779
    },
    lips: {
      x: 640,
      y: 779
    },
    kiss: {
      x: 704,
      y: 779
    },
    droplet: {
      x: 768,
      y: 779
    },
    ear: {
      x: 843,
      y: 0
    },
    eyes: {
      x: 843,
      y: 64
    },
    nose: {
      x: 843,
      y: 128
    },
    tongue: {
      x: 843,
      y: 192
    },
    love_letter: {
      x: 843,
      y: 256
    },
    bust_in_silhouette: {
      x: 843,
      y: 320
    },
    busts_in_silhouette: {
      x: 843,
      y: 384
    },
    speech_balloon: {
      x: 843,
      y: 448
    },
    thought_balloon: {
      x: 843,
      y: 512
    },
    feelsgood: {
      x: 843,
      y: 576
    },
    finnadie: {
      x: 843,
      y: 640
    },
    goberserk: {
      x: 843,
      y: 704
    },
    godmode: {
      x: 843,
      y: 768
    },
    hurtrealbad: {
      x: 0,
      y: 843
    },
    rage1: {
      x: 64,
      y: 843
    },
    rage2: {
      x: 128,
      y: 843
    },
    rage3: {
      x: 192,
      y: 843
    },
    rage4: {
      x: 256,
      y: 843
    },
    suspect: {
      x: 320,
      y: 843
    },
    trollface: {
      x: 384,
      y: 843
    },
    sunny: {
      x: 448,
      y: 843
    },
    umbrella: {
      x: 512,
      y: 843
    },
    cloud: {
      x: 576,
      y: 843
    },
    snowflake: {
      x: 640,
      y: 843
    },
    snowman: {
      x: 704,
      y: 843
    },
    zap: {
      x: 768,
      y: 843
    },
    cyclone: {
      x: 832,
      y: 843
    },
    foggy: {
      x: 907,
      y: 0
    },
    ocean: {
      x: 907,
      y: 64
    },
    cat: {
      x: 907,
      y: 128
    },
    dog: {
      x: 907,
      y: 192
    },
    mouse: {
      x: 907,
      y: 256
    },
    hamster: {
      x: 907,
      y: 320
    },
    rabbit: {
      x: 907,
      y: 384
    },
    wolf: {
      x: 907,
      y: 448
    },
    frog: {
      x: 907,
      y: 512
    },
    tiger: {
      x: 907,
      y: 576
    },
    koala: {
      x: 907,
      y: 640
    },
    bear: {
      x: 907,
      y: 704
    },
    pig: {
      x: 907,
      y: 768
    },
    pig_nose: {
      x: 907,
      y: 832
    },
    cow: {
      x: 0,
      y: 907
    },
    boar: {
      x: 64,
      y: 907
    },
    monkey_face: {
      x: 128,
      y: 907
    },
    monkey: {
      x: 192,
      y: 907
    },
    horse: {
      x: 256,
      y: 907
    },
    racehorse: {
      x: 320,
      y: 907
    },
    camel: {
      x: 384,
      y: 907
    },
    sheep: {
      x: 448,
      y: 907
    },
    elephant: {
      x: 512,
      y: 907
    },
    panda_face: {
      x: 576,
      y: 907
    },
    snake: {
      x: 640,
      y: 907
    },
    bird: {
      x: 704,
      y: 907
    },
    baby_chick: {
      x: 768,
      y: 907
    },
    hatched_chick: {
      x: 832,
      y: 907
    },
    hatching_chick: {
      x: 896,
      y: 907
    },
    chicken: {
      x: 971,
      y: 0
    },
    penguin: {
      x: 971,
      y: 64
    },
    turtle: {
      x: 971,
      y: 128
    },
    bug: {
      x: 971,
      y: 192
    },
    honeybee: {
      x: 971,
      y: 256
    },
    ant: {
      x: 971,
      y: 320
    },
    beetle: {
      x: 971,
      y: 384
    },
    snail: {
      x: 971,
      y: 448
    },
    octopus: {
      x: 971,
      y: 512
    },
    tropical_fish: {
      x: 971,
      y: 576
    },
    fish: {
      x: 971,
      y: 640
    },
    whale: {
      x: 971,
      y: 704
    },
    whale2: {
      x: 971,
      y: 768
    },
    dolphin: {
      x: 971,
      y: 832
    },
    cow2: {
      x: 971,
      y: 896
    },
    ram: {
      x: 0,
      y: 971
    },
    rat: {
      x: 64,
      y: 971
    },
    water_buffalo: {
      x: 128,
      y: 971
    },
    tiger2: {
      x: 192,
      y: 971
    },
    rabbit2: {
      x: 256,
      y: 971
    },
    dragon: {
      x: 320,
      y: 971
    },
    goat: {
      x: 384,
      y: 971
    },
    rooster: {
      x: 448,
      y: 971
    },
    dog2: {
      x: 512,
      y: 971
    },
    pig2: {
      x: 576,
      y: 971
    },
    mouse2: {
      x: 640,
      y: 971
    },
    ox: {
      x: 704,
      y: 971
    },
    dragon_face: {
      x: 768,
      y: 971
    },
    blowfish: {
      x: 832,
      y: 971
    },
    crocodile: {
      x: 896,
      y: 971
    },
    dromedary_camel: {
      x: 960,
      y: 971
    },
    leopard: {
      x: 1035,
      y: 0
    },
    cat2: {
      x: 1035,
      y: 64
    },
    poodle: {
      x: 1035,
      y: 128
    },
    paw_prints: {
      x: 1035,
      y: 192
    },
    bouquet: {
      x: 1035,
      y: 256
    },
    cherry_blossom: {
      x: 1035,
      y: 320
    },
    tulip: {
      x: 1035,
      y: 384
    },
    four_leaf_clover: {
      x: 1035,
      y: 448
    },
    rose: {
      x: 1035,
      y: 512
    },
    sunflower: {
      x: 1035,
      y: 576
    },
    hibiscus: {
      x: 1035,
      y: 640
    },
    maple_leaf: {
      x: 1035,
      y: 704
    },
    leaves: {
      x: 1035,
      y: 768
    },
    fallen_leaf: {
      x: 1035,
      y: 832
    },
    herb: {
      x: 1035,
      y: 896
    },
    mushroom: {
      x: 1035,
      y: 960
    },
    cactus: {
      x: 0,
      y: 1035
    },
    palm_tree: {
      x: 64,
      y: 1035
    },
    evergreen_tree: {
      x: 128,
      y: 1035
    },
    deciduous_tree: {
      x: 192,
      y: 1035
    },
    chestnut: {
      x: 256,
      y: 1035
    },
    seedling: {
      x: 320,
      y: 1035
    },
    blossom: {
      x: 384,
      y: 1035
    },
    ear_of_rice: {
      x: 448,
      y: 1035
    },
    shell: {
      x: 512,
      y: 1035
    },
    globe_with_meridians: {
      x: 576,
      y: 1035
    },
    sun_with_face: {
      x: 640,
      y: 1035
    },
    full_moon_with_face: {
      x: 704,
      y: 1035
    },
    new_moon_with_face: {
      x: 768,
      y: 1035
    },
    new_moon: {
      x: 832,
      y: 1035
    },
    waxing_crescent_moon: {
      x: 896,
      y: 1035
    },
    first_quarter_moon: {
      x: 960,
      y: 1035
    },
    waxing_gibbous_moon: {
      x: 1024,
      y: 1035
    },
    full_moon: {
      x: 1099,
      y: 0
    },
    waning_gibbous_moon: {
      x: 1099,
      y: 64
    },
    last_quarter_moon: {
      x: 1099,
      y: 128
    },
    waning_crescent_moon: {
      x: 1099,
      y: 192
    },
    last_quarter_moon_with_face: {
      x: 1099,
      y: 256
    },
    first_quarter_moon_with_face: {
      x: 1099,
      y: 320
    },
    crescent_moon: {
      x: 1099,
      y: 384
    },
    earth_africa: {
      x: 1099,
      y: 448
    },
    earth_americas: {
      x: 1099,
      y: 512
    },
    earth_asia: {
      x: 1099,
      y: 576
    },
    volcano: {
      x: 1099,
      y: 640
    },
    milky_way: {
      x: 1099,
      y: 704
    },
    partly_sunny: {
      x: 1099,
      y: 768
    },
    octocat: {
      x: 1099,
      y: 832
    },
    squirrel: {
      x: 0,
      y: 0,
      width: 75,
      height: 75
    },
    bamboo: {
      x: 1099,
      y: 960
    },
    gift_heart: {
      x: 1099,
      y: 1024
    },
    dolls: {
      x: 0,
      y: 1099
    },
    school_satchel: {
      x: 64,
      y: 1099
    },
    mortar_board: {
      x: 128,
      y: 1099
    },
    flags: {
      x: 192,
      y: 1099
    },
    fireworks: {
      x: 256,
      y: 1099
    },
    sparkler: {
      x: 320,
      y: 1099
    },
    wind_chime: {
      x: 384,
      y: 1099
    },
    rice_scene: {
      x: 448,
      y: 1099
    },
    jack_o_lantern: {
      x: 512,
      y: 1099
    },
    ghost: {
      x: 576,
      y: 1099
    },
    santa: {
      x: 640,
      y: 1099
    },
    christmas_tree: {
      x: 704,
      y: 1099
    },
    gift: {
      x: 768,
      y: 1099
    },
    bell: {
      x: 832,
      y: 1099
    },
    no_bell: {
      x: 896,
      y: 1099
    },
    tanabata_tree: {
      x: 960,
      y: 1099
    },
    tada: {
      x: 1024,
      y: 1099
    },
    confetti_ball: {
      x: 1088,
      y: 1099
    },
    balloon: {
      x: 1163,
      y: 0
    },
    crystal_ball: {
      x: 1163,
      y: 64
    },
    cd: {
      x: 1163,
      y: 128
    },
    dvd: {
      x: 1163,
      y: 192
    },
    floppy_disk: {
      x: 1163,
      y: 256
    },
    camera: {
      x: 1163,
      y: 320
    },
    video_camera: {
      x: 1163,
      y: 384
    },
    movie_camera: {
      x: 1163,
      y: 448
    },
    computer: {
      x: 1163,
      y: 512
    },
    tv: {
      x: 1163,
      y: 576
    },
    iphone: {
      x: 1163,
      y: 640
    },
    phone: {
      x: 1163,
      y: 704
    },
    telephone: {
      x: 1163,
      y: 768
    },
    telephone_receiver: {
      x: 1163,
      y: 832
    },
    pager: {
      x: 1163,
      y: 896
    },
    fax: {
      x: 1163,
      y: 960
    },
    minidisc: {
      x: 1163,
      y: 1024
    },
    vhs: {
      x: 1163,
      y: 1088
    },
    sound: {
      x: 0,
      y: 1163
    },
    speaker: {
      x: 64,
      y: 1163
    },
    mute: {
      x: 128,
      y: 1163
    },
    loudspeaker: {
      x: 192,
      y: 1163
    },
    mega: {
      x: 256,
      y: 1163
    },
    hourglass: {
      x: 320,
      y: 1163
    },
    hourglass_flowing_sand: {
      x: 384,
      y: 1163
    },
    alarm_clock: {
      x: 448,
      y: 1163
    },
    watch: {
      x: 512,
      y: 1163
    },
    radio: {
      x: 576,
      y: 1163
    },
    satellite: {
      x: 640,
      y: 1163
    },
    loop: {
      x: 704,
      y: 1163
    },
    mag: {
      x: 768,
      y: 1163
    },
    mag_right: {
      x: 832,
      y: 1163
    },
    unlock: {
      x: 896,
      y: 1163
    },
    lock: {
      x: 960,
      y: 1163
    },
    lock_with_ink_pen: {
      x: 1024,
      y: 1163
    },
    closed_lock_with_key: {
      x: 1088,
      y: 1163
    },
    key: {
      x: 1152,
      y: 1163
    },
    bulb: {
      x: 1227,
      y: 0
    },
    flashlight: {
      x: 1227,
      y: 64
    },
    high_brightness: {
      x: 1227,
      y: 128
    },
    low_brightness: {
      x: 1227,
      y: 192
    },
    electric_plug: {
      x: 1227,
      y: 256
    },
    battery: {
      x: 1227,
      y: 320
    },
    calling: {
      x: 1227,
      y: 384
    },
    email: {
      x: 1227,
      y: 448
    },
    mailbox: {
      x: 1227,
      y: 512
    },
    postbox: {
      x: 1227,
      y: 576
    },
    bath: {
      x: 1227,
      y: 640
    },
    bathtub: {
      x: 1227,
      y: 704
    },
    shower: {
      x: 1227,
      y: 768
    },
    toilet: {
      x: 1227,
      y: 832
    },
    wrench: {
      x: 1227,
      y: 896
    },
    nut_and_bolt: {
      x: 1227,
      y: 960
    },
    hammer: {
      x: 1227,
      y: 1024
    },
    seat: {
      x: 1227,
      y: 1088
    },
    moneybag: {
      x: 1227,
      y: 1152
    },
    yen: {
      x: 0,
      y: 1227
    },
    dollar: {
      x: 64,
      y: 1227
    },
    pound: {
      x: 128,
      y: 1227
    },
    euro: {
      x: 192,
      y: 1227
    },
    credit_card: {
      x: 256,
      y: 1227
    },
    money_with_wings: {
      x: 320,
      y: 1227
    },
    "e-mail": {
      x: 384,
      y: 1227
    },
    inbox_tray: {
      x: 448,
      y: 1227
    },
    outbox_tray: {
      x: 512,
      y: 1227
    },
    envelope: {
      x: 576,
      y: 1227
    },
    incoming_envelope: {
      x: 640,
      y: 1227
    },
    postal_horn: {
      x: 704,
      y: 1227
    },
    mailbox_closed: {
      x: 768,
      y: 1227
    },
    mailbox_with_mail: {
      x: 832,
      y: 1227
    },
    mailbox_with_no_mail: {
      x: 896,
      y: 1227
    },
    package: {
      x: 960,
      y: 1227
    },
    door: {
      x: 1024,
      y: 1227
    },
    smoking: {
      x: 1088,
      y: 1227
    },
    bomb: {
      x: 1152,
      y: 1227
    },
    gun: {
      x: 1216,
      y: 1227
    },
    hocho: {
      x: 1291,
      y: 0
    },
    pill: {
      x: 1291,
      y: 64
    },
    syringe: {
      x: 1291,
      y: 128
    },
    page_facing_up: {
      x: 1291,
      y: 192
    },
    page_with_curl: {
      x: 1291,
      y: 256
    },
    bookmark_tabs: {
      x: 1291,
      y: 320
    },
    bar_chart: {
      x: 1291,
      y: 384
    },
    chart_with_upwards_trend: {
      x: 1291,
      y: 448
    },
    chart_with_downwards_trend: {
      x: 1291,
      y: 512
    },
    scroll: {
      x: 1291,
      y: 576
    },
    clipboard: {
      x: 1291,
      y: 640
    },
    calendar: {
      x: 1291,
      y: 704
    },
    date: {
      x: 1291,
      y: 768
    },
    card_index: {
      x: 1291,
      y: 832
    },
    file_folder: {
      x: 1291,
      y: 896
    },
    open_file_folder: {
      x: 1291,
      y: 960
    },
    scissors: {
      x: 1291,
      y: 1024
    },
    pushpin: {
      x: 1291,
      y: 1088
    },
    paperclip: {
      x: 1291,
      y: 1152
    },
    black_nib: {
      x: 1291,
      y: 1216
    },
    pencil2: {
      x: 0,
      y: 1291
    },
    straight_ruler: {
      x: 64,
      y: 1291
    },
    triangular_ruler: {
      x: 128,
      y: 1291
    },
    closed_book: {
      x: 192,
      y: 1291
    },
    green_book: {
      x: 256,
      y: 1291
    },
    blue_book: {
      x: 320,
      y: 1291
    },
    orange_book: {
      x: 384,
      y: 1291
    },
    notebook: {
      x: 448,
      y: 1291
    },
    notebook_with_decorative_cover: {
      x: 512,
      y: 1291
    },
    ledger: {
      x: 576,
      y: 1291
    },
    books: {
      x: 640,
      y: 1291
    },
    bookmark: {
      x: 704,
      y: 1291
    },
    name_badge: {
      x: 768,
      y: 1291
    },
    microscope: {
      x: 832,
      y: 1291
    },
    telescope: {
      x: 896,
      y: 1291
    },
    newspaper: {
      x: 75,
      y: 0
    },
    football: {
      x: 1024,
      y: 1291
    },
    basketball: {
      x: 1088,
      y: 1291
    },
    soccer: {
      x: 1152,
      y: 1291
    },
    baseball: {
      x: 1216,
      y: 1291
    },
    tennis: {
      x: 1280,
      y: 1291
    },
    "8ball": {
      x: 1355,
      y: 0
    },
    rugby_football: {
      x: 1355,
      y: 64
    },
    bowling: {
      x: 1355,
      y: 128
    },
    golf: {
      x: 1355,
      y: 192
    },
    mountain_bicyclist: {
      x: 1355,
      y: 256
    },
    bicyclist: {
      x: 1355,
      y: 320
    },
    horse_racing: {
      x: 1355,
      y: 384
    },
    snowboarder: {
      x: 1355,
      y: 448
    },
    swimmer: {
      x: 1355,
      y: 512
    },
    surfer: {
      x: 1355,
      y: 576
    },
    ski: {
      x: 1355,
      y: 640
    },
    spades: {
      x: 1355,
      y: 704
    },
    hearts: {
      x: 1355,
      y: 768
    },
    clubs: {
      x: 1355,
      y: 832
    },
    diamonds: {
      x: 1355,
      y: 896
    },
    gem: {
      x: 1355,
      y: 960
    },
    ring: {
      x: 1355,
      y: 1024
    },
    trophy: {
      x: 1355,
      y: 1088
    },
    musical_score: {
      x: 1355,
      y: 1152
    },
    musical_keyboard: {
      x: 1355,
      y: 1216
    },
    violin: {
      x: 1355,
      y: 1280
    },
    space_invader: {
      x: 0,
      y: 1355
    },
    video_game: {
      x: 64,
      y: 1355
    },
    black_joker: {
      x: 128,
      y: 1355
    },
    flower_playing_cards: {
      x: 192,
      y: 1355
    },
    game_die: {
      x: 256,
      y: 1355
    },
    dart: {
      x: 320,
      y: 1355
    },
    mahjong: {
      x: 384,
      y: 1355
    },
    clapper: {
      x: 448,
      y: 1355
    },
    memo: {
      x: 512,
      y: 1355
    },
    pencil: {
      x: 576,
      y: 1355
    },
    book: {
      x: 640,
      y: 1355
    },
    art: {
      x: 704,
      y: 1355
    },
    microphone: {
      x: 768,
      y: 1355
    },
    headphones: {
      x: 832,
      y: 1355
    },
    trumpet: {
      x: 896,
      y: 1355
    },
    saxophone: {
      x: 960,
      y: 1355
    },
    guitar: {
      x: 1024,
      y: 1355
    },
    shoe: {
      x: 1088,
      y: 1355
    },
    sandal: {
      x: 1152,
      y: 1355
    },
    high_heel: {
      x: 1216,
      y: 1355
    },
    lipstick: {
      x: 1280,
      y: 1355
    },
    boot: {
      x: 1344,
      y: 1355
    },
    shirt: {
      x: 1419,
      y: 0
    },
    tshirt: {
      x: 1419,
      y: 64
    },
    necktie: {
      x: 1419,
      y: 128
    },
    womans_clothes: {
      x: 1419,
      y: 192
    },
    dress: {
      x: 1419,
      y: 256
    },
    running_shirt_with_sash: {
      x: 1419,
      y: 320
    },
    jeans: {
      x: 1419,
      y: 384
    },
    kimono: {
      x: 1419,
      y: 448
    },
    bikini: {
      x: 1419,
      y: 512
    },
    ribbon: {
      x: 1419,
      y: 576
    },
    tophat: {
      x: 1419,
      y: 640
    },
    crown: {
      x: 1419,
      y: 704
    },
    womans_hat: {
      x: 1419,
      y: 768
    },
    mans_shoe: {
      x: 1419,
      y: 832
    },
    closed_umbrella: {
      x: 1419,
      y: 896
    },
    briefcase: {
      x: 1419,
      y: 960
    },
    handbag: {
      x: 1419,
      y: 1024
    },
    pouch: {
      x: 1419,
      y: 1088
    },
    purse: {
      x: 1419,
      y: 1152
    },
    eyeglasses: {
      x: 1419,
      y: 1216
    },
    fishing_pole_and_fish: {
      x: 1419,
      y: 1280
    },
    coffee: {
      x: 1419,
      y: 1344
    },
    tea: {
      x: 0,
      y: 1419
    },
    sake: {
      x: 64,
      y: 1419
    },
    baby_bottle: {
      x: 128,
      y: 1419
    },
    beer: {
      x: 192,
      y: 1419
    },
    beers: {
      x: 256,
      y: 1419
    },
    cocktail: {
      x: 320,
      y: 1419
    },
    tropical_drink: {
      x: 384,
      y: 1419
    },
    wine_glass: {
      x: 448,
      y: 1419
    },
    fork_and_knife: {
      x: 512,
      y: 1419
    },
    pizza: {
      x: 576,
      y: 1419
    },
    hamburger: {
      x: 640,
      y: 1419
    },
    fries: {
      x: 704,
      y: 1419
    },
    poultry_leg: {
      x: 768,
      y: 1419
    },
    meat_on_bone: {
      x: 832,
      y: 1419
    },
    spaghetti: {
      x: 896,
      y: 1419
    },
    curry: {
      x: 960,
      y: 1419
    },
    fried_shrimp: {
      x: 1024,
      y: 1419
    },
    bento: {
      x: 1088,
      y: 1419
    },
    sushi: {
      x: 1152,
      y: 1419
    },
    fish_cake: {
      x: 1216,
      y: 1419
    },
    rice_ball: {
      x: 1280,
      y: 1419
    },
    rice_cracker: {
      x: 1344,
      y: 1419
    },
    rice: {
      x: 1408,
      y: 1419
    },
    ramen: {
      x: 1483,
      y: 0
    },
    stew: {
      x: 1483,
      y: 64
    },
    oden: {
      x: 1483,
      y: 128
    },
    dango: {
      x: 1483,
      y: 192
    },
    egg: {
      x: 1483,
      y: 256
    },
    bread: {
      x: 1483,
      y: 320
    },
    doughnut: {
      x: 1483,
      y: 384
    },
    custard: {
      x: 1483,
      y: 448
    },
    icecream: {
      x: 1483,
      y: 512
    },
    ice_cream: {
      x: 1483,
      y: 576
    },
    shaved_ice: {
      x: 1483,
      y: 640
    },
    birthday: {
      x: 1483,
      y: 704
    },
    cake: {
      x: 1483,
      y: 768
    },
    cookie: {
      x: 1483,
      y: 832
    },
    chocolate_bar: {
      x: 1483,
      y: 896
    },
    candy: {
      x: 1483,
      y: 960
    },
    lollipop: {
      x: 1483,
      y: 1024
    },
    honey_pot: {
      x: 1483,
      y: 1088
    },
    apple: {
      x: 1483,
      y: 1152
    },
    green_apple: {
      x: 1483,
      y: 1216
    },
    tangerine: {
      x: 1483,
      y: 1280
    },
    lemon: {
      x: 1483,
      y: 1344
    },
    cherries: {
      x: 1483,
      y: 1408
    },
    grapes: {
      x: 0,
      y: 1483
    },
    watermelon: {
      x: 64,
      y: 1483
    },
    strawberry: {
      x: 128,
      y: 1483
    },
    peach: {
      x: 192,
      y: 1483
    },
    melon: {
      x: 256,
      y: 1483
    },
    banana: {
      x: 320,
      y: 1483
    },
    pear: {
      x: 384,
      y: 1483
    },
    pineapple: {
      x: 448,
      y: 1483
    },
    sweet_potato: {
      x: 512,
      y: 1483
    },
    eggplant: {
      x: 576,
      y: 1483
    },
    tomato: {
      x: 640,
      y: 1483
    },
    corn: {
      x: 704,
      y: 1483
    },
    house: {
      x: 768,
      y: 1483
    },
    house_with_garden: {
      x: 832,
      y: 1483
    },
    school: {
      x: 896,
      y: 1483
    },
    office: {
      x: 960,
      y: 1483
    },
    post_office: {
      x: 1024,
      y: 1483
    },
    hospital: {
      x: 1088,
      y: 1483
    },
    bank: {
      x: 1152,
      y: 1483
    },
    convenience_store: {
      x: 1216,
      y: 1483
    },
    love_hotel: {
      x: 1280,
      y: 1483
    },
    hotel: {
      x: 1344,
      y: 1483
    },
    wedding: {
      x: 1408,
      y: 1483
    },
    church: {
      x: 1472,
      y: 1483
    },
    department_store: {
      x: 1547,
      y: 0
    },
    european_post_office: {
      x: 1547,
      y: 64
    },
    city_sunrise: {
      x: 1547,
      y: 128
    },
    city_sunset: {
      x: 1547,
      y: 192
    },
    japanese_castle: {
      x: 1547,
      y: 256
    },
    european_castle: {
      x: 1547,
      y: 320
    },
    tent: {
      x: 1547,
      y: 384
    },
    factory: {
      x: 1547,
      y: 448
    },
    tokyo_tower: {
      x: 1547,
      y: 512
    },
    japan: {
      x: 1547,
      y: 576
    },
    mount_fuji: {
      x: 1547,
      y: 640
    },
    sunrise_over_mountains: {
      x: 1547,
      y: 704
    },
    sunrise: {
      x: 1547,
      y: 768
    },
    stars: {
      x: 1547,
      y: 832
    },
    statue_of_liberty: {
      x: 1547,
      y: 896
    },
    bridge_at_night: {
      x: 1547,
      y: 960
    },
    carousel_horse: {
      x: 1547,
      y: 1024
    },
    rainbow: {
      x: 1547,
      y: 1088
    },
    ferris_wheel: {
      x: 1547,
      y: 1152
    },
    fountain: {
      x: 1547,
      y: 1216
    },
    roller_coaster: {
      x: 1547,
      y: 1280
    },
    ship: {
      x: 1547,
      y: 1344
    },
    speedboat: {
      x: 1547,
      y: 1408
    },
    boat: {
      x: 1547,
      y: 1472
    },
    sailboat: {
      x: 0,
      y: 1547
    },
    rowboat: {
      x: 64,
      y: 1547
    },
    anchor: {
      x: 128,
      y: 1547
    },
    rocket: {
      x: 192,
      y: 1547
    },
    airplane: {
      x: 256,
      y: 1547
    },
    helicopter: {
      x: 320,
      y: 1547
    },
    steam_locomotive: {
      x: 384,
      y: 1547
    },
    tram: {
      x: 448,
      y: 1547
    },
    mountain_railway: {
      x: 512,
      y: 1547
    },
    bike: {
      x: 576,
      y: 1547
    },
    aerial_tramway: {
      x: 640,
      y: 1547
    },
    suspension_railway: {
      x: 704,
      y: 1547
    },
    mountain_cableway: {
      x: 768,
      y: 1547
    },
    tractor: {
      x: 832,
      y: 1547
    },
    blue_car: {
      x: 896,
      y: 1547
    },
    oncoming_automobile: {
      x: 960,
      y: 1547
    },
    car: {
      x: 1024,
      y: 1547
    },
    red_car: {
      x: 1088,
      y: 1547
    },
    taxi: {
      x: 1152,
      y: 1547
    },
    oncoming_taxi: {
      x: 1216,
      y: 1547
    },
    articulated_lorry: {
      x: 1280,
      y: 1547
    },
    bus: {
      x: 1344,
      y: 1547
    },
    oncoming_bus: {
      x: 1408,
      y: 1547
    },
    rotating_light: {
      x: 1472,
      y: 1547
    },
    police_car: {
      x: 1536,
      y: 1547
    },
    oncoming_police_car: {
      x: 1611,
      y: 0
    },
    fire_engine: {
      x: 1611,
      y: 64
    },
    ambulance: {
      x: 1611,
      y: 128
    },
    minibus: {
      x: 1611,
      y: 192
    },
    truck: {
      x: 1611,
      y: 256
    },
    train: {
      x: 1611,
      y: 320
    },
    station: {
      x: 1611,
      y: 384
    },
    train2: {
      x: 1611,
      y: 448
    },
    bullettrain_front: {
      x: 1611,
      y: 512
    },
    bullettrain_side: {
      x: 1611,
      y: 576
    },
    light_rail: {
      x: 1611,
      y: 640
    },
    monorail: {
      x: 1611,
      y: 704
    },
    railway_car: {
      x: 1611,
      y: 768
    },
    trolleybus: {
      x: 1611,
      y: 832
    },
    ticket: {
      x: 1611,
      y: 896
    },
    fuelpump: {
      x: 1611,
      y: 960
    },
    vertical_traffic_light: {
      x: 1611,
      y: 1024
    },
    traffic_light: {
      x: 1611,
      y: 1088
    },
    warning: {
      x: 1611,
      y: 1152
    },
    construction: {
      x: 1611,
      y: 1216
    },
    beginner: {
      x: 1611,
      y: 1280
    },
    atm: {
      x: 1611,
      y: 1344
    },
    slot_machine: {
      x: 1611,
      y: 1408
    },
    busstop: {
      x: 1611,
      y: 1472
    },
    barber: {
      x: 1611,
      y: 1536
    },
    hotsprings: {
      x: 0,
      y: 1611
    },
    checkered_flag: {
      x: 64,
      y: 1611
    },
    crossed_flags: {
      x: 128,
      y: 1611
    },
    izakaya_lantern: {
      x: 192,
      y: 1611
    },
    moyai: {
      x: 256,
      y: 1611
    },
    circus_tent: {
      x: 320,
      y: 1611
    },
    performing_arts: {
      x: 384,
      y: 1611
    },
    round_pushpin: {
      x: 448,
      y: 1611
    },
    triangular_flag_on_post: {
      x: 512,
      y: 1611
    },
    jp: {
      x: 576,
      y: 1611
    },
    kr: {
      x: 640,
      y: 1611
    },
    cn: {
      x: 704,
      y: 1611
    },
    us: {
      x: 768,
      y: 1611
    },
    fr: {
      x: 832,
      y: 1611
    },
    es: {
      x: 896,
      y: 1611
    },
    it: {
      x: 960,
      y: 1611
    },
    ru: {
      x: 1024,
      y: 1611
    },
    gb: {
      x: 1088,
      y: 1611
    },
    uk: {
      x: 1152,
      y: 1611
    },
    de: {
      x: 1216,
      y: 1611
    },
    one: {
      x: 1280,
      y: 1611
    },
    two: {
      x: 1344,
      y: 1611
    },
    three: {
      x: 1408,
      y: 1611
    },
    four: {
      x: 1472,
      y: 1611
    },
    five: {
      x: 1536,
      y: 1611
    },
    six: {
      x: 1600,
      y: 1611
    },
    seven: {
      x: 1675,
      y: 0
    },
    eight: {
      x: 1675,
      y: 64
    },
    nine: {
      x: 1675,
      y: 128
    },
    keycap_ten: {
      x: 1675,
      y: 192
    },
    "1234": {
      x: 1675,
      y: 256
    },
    zero: {
      x: 1675,
      y: 320
    },
    hash: {
      x: 1675,
      y: 384
    },
    symbols: {
      x: 1675,
      y: 448
    },
    arrow_backward: {
      x: 1675,
      y: 512
    },
    arrow_down: {
      x: 1675,
      y: 576
    },
    arrow_forward: {
      x: 1675,
      y: 640
    },
    arrow_left: {
      x: 1675,
      y: 704
    },
    capital_abcd: {
      x: 1675,
      y: 768
    },
    abcd: {
      x: 1675,
      y: 832
    },
    abc: {
      x: 1675,
      y: 896
    },
    arrow_lower_left: {
      x: 1675,
      y: 960
    },
    arrow_lower_right: {
      x: 1675,
      y: 1024
    },
    arrow_right: {
      x: 1675,
      y: 1088
    },
    arrow_up: {
      x: 1675,
      y: 1152
    },
    arrow_upper_left: {
      x: 1675,
      y: 1216
    },
    arrow_upper_right: {
      x: 1675,
      y: 1280
    },
    arrow_double_down: {
      x: 1675,
      y: 1344
    },
    arrow_double_up: {
      x: 1675,
      y: 1408
    },
    arrow_down_small: {
      x: 1675,
      y: 1472
    },
    arrow_heading_down: {
      x: 1675,
      y: 1536
    },
    arrow_heading_up: {
      x: 1675,
      y: 1600
    },
    leftwards_arrow_with_hook: {
      x: 0,
      y: 1675
    },
    arrow_right_hook: {
      x: 64,
      y: 1675
    },
    left_right_arrow: {
      x: 128,
      y: 1675
    },
    arrow_up_down: {
      x: 192,
      y: 1675
    },
    arrow_up_small: {
      x: 256,
      y: 1675
    },
    arrows_clockwise: {
      x: 320,
      y: 1675
    },
    arrows_counterclockwise: {
      x: 384,
      y: 1675
    },
    rewind: {
      x: 448,
      y: 1675
    },
    fast_forward: {
      x: 512,
      y: 1675
    },
    information_source: {
      x: 576,
      y: 1675
    },
    ok: {
      x: 640,
      y: 1675
    },
    twisted_rightwards_arrows: {
      x: 704,
      y: 1675
    },
    repeat: {
      x: 768,
      y: 1675
    },
    repeat_one: {
      x: 832,
      y: 1675
    },
    new: {
      x: 896,
      y: 1675
    },
    top: {
      x: 960,
      y: 1675
    },
    up: {
      x: 1024,
      y: 1675
    },
    cool: {
      x: 1088,
      y: 1675
    },
    free: {
      x: 1152,
      y: 1675
    },
    ng: {
      x: 1216,
      y: 1675
    },
    cinema: {
      x: 1280,
      y: 1675
    },
    koko: {
      x: 1344,
      y: 1675
    },
    signal_strength: {
      x: 1408,
      y: 1675
    },
    u5272: {
      x: 1472,
      y: 1675
    },
    u5408: {
      x: 1536,
      y: 1675
    },
    u55b6: {
      x: 1600,
      y: 1675
    },
    u6307: {
      x: 1664,
      y: 1675
    },
    u6708: {
      x: 1739,
      y: 0
    },
    u6709: {
      x: 1739,
      y: 64
    },
    u6e80: {
      x: 1739,
      y: 128
    },
    u7121: {
      x: 1739,
      y: 192
    },
    u7533: {
      x: 1739,
      y: 256
    },
    u7a7a: {
      x: 1739,
      y: 320
    },
    u7981: {
      x: 1739,
      y: 384
    },
    sa: {
      x: 1739,
      y: 448
    },
    restroom: {
      x: 1739,
      y: 512
    },
    mens: {
      x: 1739,
      y: 576
    },
    womens: {
      x: 1739,
      y: 640
    },
    baby_symbol: {
      x: 1739,
      y: 704
    },
    no_smoking: {
      x: 1739,
      y: 768
    },
    parking: {
      x: 1739,
      y: 832
    },
    wheelchair: {
      x: 1739,
      y: 896
    },
    metro: {
      x: 1739,
      y: 960
    },
    baggage_claim: {
      x: 1739,
      y: 1024
    },
    accept: {
      x: 1739,
      y: 1088
    },
    wc: {
      x: 1739,
      y: 1152
    },
    potable_water: {
      x: 1739,
      y: 1216
    },
    put_litter_in_its_place: {
      x: 1739,
      y: 1280
    },
    secret: {
      x: 1739,
      y: 1344
    },
    congratulations: {
      x: 1739,
      y: 1408
    },
    m: {
      x: 1739,
      y: 1472
    },
    passport_control: {
      x: 1739,
      y: 1536
    },
    left_luggage: {
      x: 1739,
      y: 1600
    },
    customs: {
      x: 1739,
      y: 1664
    },
    ideograph_advantage: {
      x: 0,
      y: 1739
    },
    cl: {
      x: 64,
      y: 1739
    },
    sos: {
      x: 128,
      y: 1739
    },
    id: {
      x: 192,
      y: 1739
    },
    no_entry_sign: {
      x: 256,
      y: 1739
    },
    underage: {
      x: 320,
      y: 1739
    },
    no_mobile_phones: {
      x: 384,
      y: 1739
    },
    do_not_litter: {
      x: 448,
      y: 1739
    },
    "non-potable_water": {
      x: 512,
      y: 1739
    },
    no_bicycles: {
      x: 576,
      y: 1739
    },
    no_pedestrians: {
      x: 640,
      y: 1739
    },
    children_crossing: {
      x: 704,
      y: 1739
    },
    no_entry: {
      x: 768,
      y: 1739
    },
    eight_spoked_asterisk: {
      x: 832,
      y: 1739
    },
    sparkle: {
      x: 896,
      y: 1739
    },
    eight_pointed_black_star: {
      x: 960,
      y: 1739
    },
    heart_decoration: {
      x: 1024,
      y: 1739
    },
    vs: {
      x: 1088,
      y: 1739
    },
    vibration_mode: {
      x: 1152,
      y: 1739
    },
    mobile_phone_off: {
      x: 1216,
      y: 1739
    },
    chart: {
      x: 1280,
      y: 1739
    },
    currency_exchange: {
      x: 1344,
      y: 1739
    },
    aries: {
      x: 1408,
      y: 1739
    },
    taurus: {
      x: 1472,
      y: 1739
    },
    gemini: {
      x: 1536,
      y: 1739
    },
    cancer: {
      x: 1600,
      y: 1739
    },
    leo: {
      x: 1664,
      y: 1739
    },
    virgo: {
      x: 1728,
      y: 1739
    },
    libra: {
      x: 1803,
      y: 0
    },
    scorpius: {
      x: 1803,
      y: 64
    },
    sagittarius: {
      x: 1803,
      y: 128
    },
    capricorn: {
      x: 1803,
      y: 192
    },
    aquarius: {
      x: 1803,
      y: 256
    },
    pisces: {
      x: 1803,
      y: 320
    },
    ophiuchus: {
      x: 1803,
      y: 384
    },
    six_pointed_star: {
      x: 1803,
      y: 448
    },
    negative_squared_cross_mark: {
      x: 1803,
      y: 512
    },
    a: {
      x: 1803,
      y: 576
    },
    b: {
      x: 1803,
      y: 640
    },
    ab: {
      x: 1803,
      y: 704
    },
    o2: {
      x: 1803,
      y: 768
    },
    diamond_shape_with_a_dot_inside: {
      x: 1803,
      y: 832
    },
    recycle: {
      x: 1803,
      y: 896
    },
    end: {
      x: 1803,
      y: 960
    },
    back: {
      x: 1803,
      y: 1024
    },
    on: {
      x: 1803,
      y: 1088
    },
    soon: {
      x: 1803,
      y: 1152
    },
    clock1: {
      x: 1803,
      y: 1216
    },
    clock130: {
      x: 1803,
      y: 1280
    },
    clock10: {
      x: 1803,
      y: 1344
    },
    clock1030: {
      x: 1803,
      y: 1408
    },
    clock11: {
      x: 1803,
      y: 1472
    },
    clock1130: {
      x: 1803,
      y: 1536
    },
    clock12: {
      x: 1803,
      y: 1600
    },
    clock1230: {
      x: 1803,
      y: 1664
    },
    clock2: {
      x: 1803,
      y: 1728
    },
    clock230: {
      x: 0,
      y: 1803
    },
    clock3: {
      x: 64,
      y: 1803
    },
    clock330: {
      x: 128,
      y: 1803
    },
    clock4: {
      x: 192,
      y: 1803
    },
    clock430: {
      x: 256,
      y: 1803
    },
    clock5: {
      x: 320,
      y: 1803
    },
    clock530: {
      x: 384,
      y: 1803
    },
    clock6: {
      x: 448,
      y: 1803
    },
    clock630: {
      x: 512,
      y: 1803
    },
    clock7: {
      x: 576,
      y: 1803
    },
    clock730: {
      x: 640,
      y: 1803
    },
    clock8: {
      x: 704,
      y: 1803
    },
    clock830: {
      x: 768,
      y: 1803
    },
    clock9: {
      x: 832,
      y: 1803
    },
    clock930: {
      x: 896,
      y: 1803
    },
    heavy_dollar_sign: {
      x: 960,
      y: 1803
    },
    copyright: {
      x: 1024,
      y: 1803
    },
    registered: {
      x: 1088,
      y: 1803
    },
    tm: {
      x: 1152,
      y: 1803
    },
    x: {
      x: 1216,
      y: 1803
    },
    heavy_exclamation_mark: {
      x: 1280,
      y: 1803
    },
    bangbang: {
      x: 1344,
      y: 1803
    },
    interrobang: {
      x: 1408,
      y: 1803
    },
    o: {
      x: 1472,
      y: 1803
    },
    heavy_multiplication_x: {
      x: 1536,
      y: 1803
    },
    heavy_plus_sign: {
      x: 1600,
      y: 1803
    },
    heavy_minus_sign: {
      x: 1664,
      y: 1803
    },
    heavy_division_sign: {
      x: 1728,
      y: 1803
    },
    white_flower: {
      x: 1792,
      y: 1803
    },
    "100": {
      x: 1867,
      y: 0
    },
    heavy_check_mark: {
      x: 1867,
      y: 64
    },
    ballot_box_with_check: {
      x: 1867,
      y: 128
    },
    radio_button: {
      x: 1867,
      y: 192
    },
    link: {
      x: 1867,
      y: 256
    },
    curly_loop: {
      x: 1867,
      y: 320
    },
    wavy_dash: {
      x: 1867,
      y: 384
    },
    part_alternation_mark: {
      x: 1867,
      y: 448
    },
    trident: {
      x: 1867,
      y: 512
    },
    black_small_square: {
      x: 1867,
      y: 576
    },
    white_small_square: {
      x: 1867,
      y: 640
    },
    black_medium_small_square: {
      x: 1867,
      y: 704
    },
    white_medium_small_square: {
      x: 1867,
      y: 768
    },
    black_medium_square: {
      x: 1867,
      y: 832
    },
    white_medium_square: {
      x: 1867,
      y: 896
    },
    white_large_square: {
      x: 1867,
      y: 960
    },
    white_check_mark: {
      x: 1867,
      y: 1024
    },
    black_square_button: {
      x: 1867,
      y: 1088
    },
    white_square_button: {
      x: 1867,
      y: 1152
    },
    black_circle: {
      x: 1867,
      y: 1216
    },
    white_circle: {
      x: 1867,
      y: 1280
    },
    red_circle: {
      x: 1867,
      y: 1344
    },
    large_blue_circle: {
      x: 1867,
      y: 1408
    },
    large_blue_diamond: {
      x: 1867,
      y: 1472
    },
    large_orange_diamond: {
      x: 1867,
      y: 1536
    },
    small_blue_diamond: {
      x: 1867,
      y: 1600
    },
    small_orange_diamond: {
      x: 1867,
      y: 1664
    },
    small_red_triangle: {
      x: 1867,
      y: 1728
    },
    small_red_triangle_down: {
      x: 1867,
      y: 1792
    }
  };

  var r$1,i$1=n.__r;n.__r=function(n){i$1&&i$1(n),(r$1=n.__c).__H&&(r$1.__H.t=A$1(r$1.__H.t));};var f$1=n.diffed;n.diffed=function(n){f$1&&f$1(n);var t=n.__c;if(t){var r=t.__H;r&&(r.u=(r.u.some(function(n){n.ref&&(n.ref.current=n.createHandle());}),[]),r.i=A$1(r.i));}};var o$1=n.unmount;n.unmount=function(n){o$1&&o$1(n);var t=n.__c;if(t){var r=t.__H;r&&r.o.forEach(function(n){return n.l&&n.l()});}};if("undefined"!=typeof window){var w$1=n.requestAnimationFrame;}function A$1(n){return n.forEach(E),n.forEach(F),[]}function E(n){n.l&&n.l();}function F(n){var t=n.v();"function"==typeof t&&(n.l=t);}

  function E$1(n){var e=n.parentNode;e&&e.removeChild(n);}var _$1=n.__e;function k$1(){this.t=[];}n.__e=function(n,e,t){if(n.then&&t)for(var r,o=e;o=o.__p;)if((r=o.__c)&&r.u)return t&&(e.__e=t.__e,e.__k=t.__k),void r.u(n);_$1(n,e,t);},(k$1.prototype=new m).u=function(n){var e=this;e.t.push(n);var t=function(){e.t[e.t.indexOf(n)]=e.t[e.t.length-1],e.t.pop(),0==e.t.length&&(D(e.props.fallback),e.__v.__e=null,e.__v.__k=e.state.i,e.setState({i:null}));};null==e.state.i&&(e.setState({i:e.__v.__k}),function n(e){for(var t=0;t<e.length;t++){var r=e[t];null!=r&&("function"!=typeof r.type&&r.__e?E$1(r.__e):r.__k&&n(r.__k));}}(e.__v.__k),e.__v.__k=[]),n.then(t,t);},k$1.prototype.render=function(n,e){return e.i?n.fallback:n.children};var S="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103,N$1=n.event;n.event=function(n){return N$1&&(n=N$1(n)),n.persist=function(){},n.nativeEvent=n};var M=function(){};function O(n){var e=this,t=n.container,r=h(M,{context:e.context},n.vnode);return e.l&&e.l!==t&&(e.s.parentNode&&e.l.removeChild(e.s),D(e.v),e.p=!1),n.vnode?e.p?(t.__k=e.__k,I(r,t),e.__k=t.__k):(e.s=document.createTextNode(""),L("",t),t.appendChild(e.s),e.p=!0,e.l=t,I(r,t,e.s),e.__k=this.s.__k):e.p&&(e.s.parentNode&&e.l.removeChild(e.s),D(e.v)),e.v=r,e.componentWillUnmount=function(){e.s.parentNode&&e.l.removeChild(e.s),D(e.v);},null}function j$1(n,e){return h(O,{vnode:n,container:e})}M.prototype.getChildContext=function(){return this.props.context},M.prototype.render=function(n){return n.children};function I$1(n,e){for(var t in n)if("__source"!==t&&!(t in e))return !0;for(var r in e)if("__source"!==r&&n[r]!==e[r])return !0;return !1}var $$1=function(n){function e(e){n.call(this,e),this.isPureReactComponent=!0;}return n&&(e.__proto__=n),(e.prototype=Object.create(n&&n.prototype)).constructor=e,e.prototype.shouldComponentUpdate=function(n,e){return I$1(this.props,n)||I$1(this.state,e)},e}(m);function G(n,e){n["UNSAFE_"+e]&&!n[e]&&Object.defineProperty(n,e,{configurable:!1,get:function(){return this["UNSAFE_"+e]},set:function(n){this["UNSAFE_"+e]=n;}});}m.prototype.isReactComponent={};var J=n.vnode;n.vnode=function(n){n.$$typeof=S,function(e){var t=n.type,r=n.props;if(r&&"string"==typeof t){var o={};for(var u in r)/^on(Ani|Tra)/.test(u)&&(r[u.toLowerCase()]=r[u],delete r[u]),o[u.toLowerCase()]=u;if(o.ondoubleclick&&(r.ondblclick=r[o.ondoubleclick],delete r[o.ondoubleclick]),o.onbeforeinput&&(r.onbeforeinput=r[o.onbeforeinput],delete r[o.onbeforeinput]),o.onchange&&("textarea"===t||"input"===t.toLowerCase()&&!/^fil|che|ra/i.test(r.type))){var i=o.oninput||"oninput";r[i]||(r[i]=r[o.onchange],delete r[o.onchange]);}}}();var e=n.type;e&&e.o&&n.ref&&(n.props.ref=n.ref,n.ref=null),"function"==typeof e&&!e.m&&e.prototype&&(G(e.prototype,"componentWillMount"),G(e.prototype,"componentWillReceiveProps"),G(e.prototype,"componentWillUpdate"),e.m=!0),J&&J(n);};

  var Portal = function Portal(_ref) {
    var children = _ref.children,
        into = _ref.into;
    return j$1(children, into);
  };

  function isIE() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE "); // IE 10 and below

    var trident = ua.indexOf("Trident/"); // IE 11

    return msie > 0 || trident > 0;
  }

  var ie = isIE();
  var KEYS = {
    get up() {
      return ie ? "Up" : "ArrowUp";
    },

    get down() {
      return ie ? "Down" : "ArrowDown";
    },

    get left() {
      return ie ? "Left" : "ArrowLeft";
    },

    get right() {
      return ie ? "Right" : "ArrowRight";
    },

    get esc() {
      return ie ? "Esc" : "Escape";
    },

    get space() {
      return ie ? "Spacebar" : "Space";
    },

    enter: "Enter",
    tab: "Tab"
  };

  var EMOJI_SS_W = 1931;
  var EMOJI_SS_H = 1867; // the W and H of the twitch spritesheet

  var TWITCH_SS_W = 837;
  var TWITCH_SS_H = 819; // the W and H of the bttv spritesheet

  var BTTV_SS_W = 326;
  var BTTV_SS_H = 316;

  var Picker =
  /*#__PURE__*/
  function (_Component) {
    _inherits(Picker, _Component);

    function Picker() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, Picker);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Picker)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_this), "state", {
        emojiShow: false,
        twitchShow: false
      });

      _defineProperty(_assertThisInitialized(_this), "toggleEmoji", function () {
        _this.setState(function (prevState) {
          return {
            emojiShow: !prevState.emojiShow,
            twitchShow: false
          };
        });
      });

      _defineProperty(_assertThisInitialized(_this), "toggleTwitch", function () {
        _this.setState(function (prevState) {
          return {
            emojiShow: false,
            twitchShow: !prevState.twitchShow
          };
        });
      });

      _defineProperty(_assertThisInitialized(_this), "handleKeyup", function (e) {
        var key = e.code;

        if ((_this.state.emojiShow || _this.state.twitchShow) && key === KEYS.esc) {
          _this.setState({
            emojiShow: false,
            twitchShow: false
          });
        }
      });

      return _this;
    }

    _createClass(Picker, [{
      key: "componentWillMount",
      value: function componentWillMount() {
        this.chatWidget = proxy.dom.chatInputContainer();
      }
    }, {
      key: "fillChat",
      value: function fillChat(val) {
        var input = proxy.dom.chatInput();
        input.value += " :".concat(val, ":");
        input.focus();
        this.setState({
          emojiShow: false,
          twitchShow: false
        });
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        document.addEventListener("keyup", this.handleKeyup);
      }
    }, {
      key: "emojiList",
      value: function emojiList() {
        var _this2 = this;

        var size = 35; // 64px is the original size of each icon in the spritesheet but we want to
        // reduce them to SIZE without altering the spritesheet

        var perc = size / 64;
        var list = Object.keys(emojiNames).map(function (id) {
          var data = emojiNames[id];
          var x = EMOJI_SS_W * perc * 100 / size;
          var y = EMOJI_SS_H * perc * 100 / size;
          var css = {
            backgroundPosition: "-".concat(data.x * perc, "px -").concat(data.y * perc, "px"),
            width: "".concat(size, "px"),
            height: "".concat(size, "px"),
            backgroundSize: "".concat(x, "% ").concat(y, "%")
          };
          return h("span", {
            key: "emoji-".concat(id),
            style: css,
            title: id,
            className: "emoji-picker-image",
            onClick: function onClick() {
              return _this2.fillChat(id);
            }
          });
        });
        return list;
      }
    }, {
      key: "twitchList",
      value: function twitchList() {
        var _this3 = this;

        return Object.keys(twitchSpriteSheet).map(function (name) {
          var data = twitchSpriteSheet[name];
          var x = TWITCH_SS_W * 100 / data.width;
          var y = TWITCH_SS_H * 100 / data.height;
          var css = {
            backgroundPosition: "-".concat(data.x, "px -").concat(data.y, "px"),
            width: "".concat(data.width, "px"),
            height: "".concat(data.height, "px"),
            backgroundSize: "".concat(x, "% ").concat(y, "%")
          };
          return h("span", {
            key: "twitch-".concat(name),
            style: css,
            title: name,
            className: "twitch-picker-image",
            onClick: function onClick() {
              return _this3.fillChat(name);
            }
          });
        });
      }
    }, {
      key: "bttvList",
      value: function bttvList() {
        var _this4 = this;

        return Object.keys(bttvSpriteSheet).map(function (name) {
          var data = bttvSpriteSheet[name];
          var x = BTTV_SS_W * 100 / data.width;
          var y = BTTV_SS_H * 100 / data.height;
          var css = {
            backgroundPosition: "-".concat(data.x, "px -").concat(data.y, "px"),
            width: "".concat(data.width, "px"),
            height: "".concat(data.height, "px"),
            backgroundSize: "".concat(x, "% ").concat(y, "%")
          };
          return h("span", {
            key: "bttv-".concat(name),
            style: css,
            className: "bttv-picker-image",
            title: name,
            onClick: function onClick() {
              return _this4.fillChat(name);
            }
          });
        });
      }
    }, {
      key: "render",
      value: function render(props, _ref) {
        var emojiShow = _ref.emojiShow,
            twitchShow = _ref.twitchShow;
        return h("div", {
          style: "display: inline;"
        }, h("span", {
          className: "dp-emoji-picker-icon fa fa-smile-o",
          onClick: this.toggleEmoji
        }, h(Portal, {
          into: this.chatWidget
        }, h("div", {
          className: "dp-emoji-picker ".concat(emojiShow ? "show" : "")
        }, this.emojiList()))), h("span", {
          className: "dp-twitch-picker-icon",
          onClick: this.toggleTwitch
        }, h(Portal, {
          into: this.chatWidget
        }, h("div", {
          className: "dp-emoji-picker twitch-bttv-picker ".concat(twitchShow ? "show" : "")
        }, this.twitchList().concat(this.bttvList())))));
      }
    }]);

    return Picker;
  }(m);

  function SetupPicker () {
    I(h(Picker, null), document.querySelector(".chat-text-box-icons"));
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
      "dubplus-custom-css": false,
      "dubplus-hide-selfie": false,
      "dubplus-disable-video": false,
      "dubplus-playlist-filter": false,
      "dubplus-auto-afk": false,
      "custom_mentions": false
    },
    "custom": {
      "customAfkMessage": "[AFK] I'm not here right now.",
      "dj_notification": 1,
      "css": "",
      "bg": "",
      "notificationSound": "",
      "auto_afk_wait": 30,
      "custom_mentions": ""
    }
  };

  var UserSettings =
  /*#__PURE__*/
  function () {
    function UserSettings() {
      _classCallCheck(this, UserSettings);

      _defineProperty(this, "srcRoot", "https://cdn.jsdelivr.net/gh/DubPlus/DubPlus@beta");

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
     * @returns {Boolean} whether it succeeded or not
     */


    _createClass(UserSettings, [{
      key: "save",
      value: function save(type, optionName, value) {
        this.stored[type][optionName] = value;

        try {
          localStorage.setItem('dubplusUserSettings', JSON.stringify(this.stored));
          return true;
        } catch (err) {
          console.error("an error occured saving dubplus to localStorage", err);
          return false;
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

      _defineProperty(_assertThisInitialized(_this), "state", {
        error: false
      });

      _defineProperty(_assertThisInitialized(_this), "keyUpHandler", function (e) {
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

      _defineProperty(_assertThisInitialized(_this), "confirmClick", function () {
        var result = _this.props.onConfirm(_this.textarea.value);

        if (result) {
          _this.props.onClose();

          _this.setState({
            error: false
          });
        } else {
          _this.setState({
            error: true
          });
        }
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
      value: function render(props, state) {
        var _this2 = this;

        var closeButtonText = !props.onConfirm ? "close" : "cancel";
        return props.open ? h(Portal, {
          into: document.body
        }, h("div", {
          className: "dp-modal"
        }, h("aside", {
          className: "container"
        }, h("div", {
          className: "title"
        }, h("h1", null, " ", props.title || "Dub+")), h("div", {
          className: "content"
        }, h("p", null, props.content || ""), state.error && h("p", {
          style: "color:#ff7070"
        }, props.errorMsg), props.placeholder && h("textarea", {
          ref: function ref(c) {
            return _this2.textarea = c;
          },
          placeholder: props.placeholder,
          maxlength: props.maxlength || 500
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
  }(m);

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

      _defineProperty(_assertThisInitialized(_this), "state", {
        section: userSettings.stored.menu[_this.props.settingsKey] || "open"
      });

      _defineProperty(_assertThisInitialized(_this), "toggleSection", function (e) {
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
      value: function render(props, state) {
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
  }(m);
  /**
   * Component to render a simple row like the fullscreen menu option
   * @param {object} props
   * @param {string} props.id the dom ID name, usually dubplus-*
   * @param {string} props.desc description of the menu item used in the title attr
   * @param {string} props.icon icon to be used
   * @param {string} props.menuTitle text to display in the menu
   * @param {Function} props.onClick function to run on click
   * @param {string} props.href if provided will render an anchor instead
   */

  function MenuSimple(props) {
    var _cn = ["dubplus-menu-icon"]; // combine with ones that were passed through

    if (props.className) {
      _cn.push(props.className);
    }

    if (props.href) {
      return h("li", {
        class: "dubplus-menu-icon"
      }, h("span", {
        class: "fa fa-".concat(props.icon)
      }), h("a", {
        href: props.href,
        class: "dubplus-menu-label",
        target: "_blank"
      }, props.menuTitle));
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
   * @param {string} props.section which section of the menu this is in
   * @param {string} props.title the modal title
   * @param {string} props.content  the description below the title
   * @param {string} props.value prepopulate the value of the text area
   * @param {number|string} props.maxLength  the max length of characters allowed in the text field
   * @param {string} props.placeholder the text area placeholder if there is no value
   * @param {boolean} props.showModal turns modal on/off directlt
   * @param {function} props.onConfirm 
   * @param {function} props.onCancel
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

      _defineProperty(_assertThisInitialized(_this2), "state", {
        open: false
      });

      _defineProperty(_assertThisInitialized(_this2), "loadModal", function () {
        _this2.setState({
          open: true
        });

        track.menuClick(_this2.props.section + " section", _this2.props.title + " edit");
      });

      _defineProperty(_assertThisInitialized(_this2), "closeModal", function () {
        _this2.setState({
          open: false
        });

        if (typeof _this2.props.onCancel === "function") {
          _this2.props.onCancel();
        }
      });

      _defineProperty(_assertThisInitialized(_this2), "checkVal", function (val) {
        var limit = parseInt(_this2.props.maxlength, 10);

        if (isNaN(limit)) {
          limit = 500;
        }

        if (val.length > limit) {
          val = val.substring(0, limit);
        } // now we don't have to check val length inside every option


        return _this2.props.onConfirm(val);
      });

      return _this2;
    }

    _createClass(MenuPencil, [{
      key: "render",
      value: function render(props, state) {
        return h("span", {
          onClick: this.loadModal,
          className: "fa fa-pencil extra-icon"
        }, h(Modal, {
          open: state.open || props.showModal || false,
          title: props.title || "Dub+ option",
          content: props.content || "Please enter a value",
          placeholder: props.placeholder || "in here",
          value: props.value,
          maxlength: props.maxlength,
          onConfirm: this.checkVal,
          onClose: this.closeModal,
          errorMsg: props.errorMsg
        }));
      }
    }]);

    return MenuPencil;
  }(m);
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

      _defineProperty(_assertThisInitialized(_this3), "state", {
        on: userSettings.stored.options[_this3.props.id] || false
      });

      _defineProperty(_assertThisInitialized(_this3), "switchOn", function () {
        _this3.props.turnOn(false);

        userSettings.save("options", _this3.props.id, true);

        _this3.setState({
          on: true
        });

        track.menuClick(_this3.props.section + " section", _this3.props.id + " on");
      });

      _defineProperty(_assertThisInitialized(_this3), "switchOff", function () {
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

      _defineProperty(_assertThisInitialized(_this3), "toggleSwitch", function () {
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
          // The "true" argument is so you can tell if component 
          // was activated on first load or not
          this.props.turnOn(true);
        }
      }
    }, {
      key: "render",
      value: function render(props, state) {
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
  }(m);

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

      _defineProperty(_assertThisInitialized(_this), "state", {
        canSend: true,
        afkMessage: userSettings.stored.custom.customAfkMessage
      });

      _defineProperty(_assertThisInitialized(_this), "afkRespond", function (e) {
        if (!_this.state.canSend) {
          return; // do nothing until it's back to true
        }

        var content = e.message;
        var user = proxy.userName();

        if (content.indexOf("@" + user) >= 0 && proxy.sessionId() !== e.user.userInfo.userid) {
          var chatInput = proxy.dom.chatInput();

          if (_this.state.afkMessage) {
            chatInput.value = "[AFK] " + _this.state.afkMessage;
          } else {
            chatInput.value = "[AFK] I'm not here right now.";
          }

          proxy.sendChatMessage(); // so we don't spam chat, we pause the auto respond for 30sec

          _this.setState({
            canSend: false
          });

          setTimeout(function () {
            _this.setState({
              canSend: true
            });
          }, 30000);
        }
      });

      _defineProperty(_assertThisInitialized(_this), "turnOn", function () {
        proxy.events.onChatMessage(_this.afkRespond);
      });

      _defineProperty(_assertThisInitialized(_this), "turnOff", function () {
        proxy.events.offChatMessage(_this.afkRespond);
      });

      _defineProperty(_assertThisInitialized(_this), "saveAFKmessage", function (val) {
        var success = userSettings.save("custom", "customAfkMessage", val);

        if (success) {
          _this.setState({
            afkMessage: val
          });
        }

        return success;
      });

      return _this;
    }

    _createClass(AFK, [{
      key: "render",
      value: function render() {
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
          value: this.state.afkMessage,
          placeholder: "Be right back!",
          maxlength: "255",
          onConfirm: this.saveAFKmessage,
          errorMsg: "An error occured saving your AFK message"
        }));
      }
    }]);

    return AFK;
  }(m);

  /**
   * Menu item for Autovote
   */

  var Autovote =
  /*#__PURE__*/
  function (_Component) {
    _inherits(Autovote, _Component);

    function Autovote() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, Autovote);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Autovote)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_this), "dubup", proxy.dom.upVote());

      _defineProperty(_assertThisInitialized(_this), "dubdown", proxy.dom.downVote());

      _defineProperty(_assertThisInitialized(_this), "advance_vote", function () {
        var event = document.createEvent("HTMLEvents");
        event.initEvent("click", true, false);

        _this.dubup.dispatchEvent(event);
      });

      _defineProperty(_assertThisInitialized(_this), "voteCheck", function (obj) {
        if (obj.startTime < 2) {
          _this.advance_vote();
        }
      });

      _defineProperty(_assertThisInitialized(_this), "turnOn", function (e) {
        var song = proxy.getActiveSong();
        var dubCookie = proxy.getVoteType();
        var dubsong = proxy.getDubSong();

        if (!song || song.songid !== dubsong) {
          dubCookie = false;
        } // Only cast the vote if user hasn't already voted


        if (!_this.dubup.classList.contains("voted") && !_this.dubdown.classList.contains("voted") && !dubCookie) {
          _this.advance_vote();
        }

        proxy.events.onPlaylistUpdate(_this.voteCheck);
      });

      _defineProperty(_assertThisInitialized(_this), "turnOff", function (e) {
        proxy.events.offPlaylistUpdate(_this.voteCheck);
      });

      return _this;
    }

    _createClass(Autovote, [{
      key: "render",
      value: function render() {
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
  }(m);

  var TWITCH_SS_W$1 = 837;
  var TWITCH_SS_H$1 = 819;
  var BTTV_SS_W$1 = 326;
  var BTTV_SS_H$1 = 316;

  var PreviewListItem = function PreviewListItem(_ref) {
    var data = _ref.data,
        onSelect = _ref.onSelect;

    if (data.header) {
      return h("li", {
        className: "preview-item-header ".concat(data.header.toLowerCase(), "-preview-header")
      }, h("span", null, data.header));
    }

    if (data.type === "twitch") {
      var x = TWITCH_SS_W$1 * 100 / data.width;
      var y = TWITCH_SS_H$1 * 100 / data.height;
      var css = {
        backgroundPosition: "-".concat(data.x, "px -").concat(data.y, "px"),
        width: "".concat(data.width, "px"),
        height: "".concat(data.height, "px"),
        backgroundSize: "".concat(x, "% ").concat(y, "%")
      };
      return h("li", {
        className: "preview-item twitch-previews",
        onClick: function onClick() {
          onSelect(data.name);
        },
        "data-name": data.name
      }, h("span", {
        className: "ac-image",
        style: css,
        title: data.name
      }), h("span", {
        className: "ac-text"
      }, data.name));
    }

    if (data.type === "bttv") {
      var _x = BTTV_SS_W$1 * 100 / data.width;

      var _y = BTTV_SS_H$1 * 100 / data.height;

      var _css = {
        backgroundPosition: "-".concat(data.x, "px -").concat(data.y, "px"),
        width: "".concat(data.width, "px"),
        height: "".concat(data.height, "px"),
        backgroundSize: "".concat(_x, "% ").concat(_y, "%")
      };
      return h("li", {
        className: "preview-item bttv-previews",
        onClick: function onClick() {
          onSelect(data.name);
        },
        "data-name": data.name
      }, h("span", {
        className: "ac-image",
        style: _css,
        title: data.name
      }), h("span", {
        className: "ac-text"
      }, data.name));
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

  var twitchSpriteSheet$1 = {
    "\\:-?\\)": {
      "x": 387,
      "y": 764,
      "width": 24,
      "height": 18,
      "id": "1"
    },
    "\\:-?[\\\\/]": {
      "x": 171,
      "y": 764,
      "width": 24,
      "height": 18,
      "id": "10"
    },
    "qtp1": {
      "x": 649,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "100186"
    },
    "qtp2": {
      "x": 140,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "100187"
    },
    "qtp3": {
      "x": 448,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "100188"
    },
    "qtp4": {
      "x": 644,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "100189"
    },
    "mercywing1": {
      "x": 677,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "1003187"
    },
    "mercywing2": {
      "x": 196,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "1003189"
    },
    "pinkmercy": {
      "x": 140,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "1003190"
    },
    "opieop": {
      "x": 532,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "100590"
    },
    "doritoschip": {
      "x": 84,
      "y": 92,
      "width": 28,
      "height": 28,
      "id": "102242"
    },
    "pjsugar": {
      "x": 112,
      "y": 92,
      "width": 28,
      "height": 28,
      "id": "102556"
    },
    "reckkers": {
      "x": 145,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "103416"
    },
    "lirikangry": {
      "x": 145,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "1037101"
    },
    "reckq": {
      "x": 0,
      "y": 120,
      "width": 28,
      "height": 28,
      "id": "103837"
    },
    "tathypers": {
      "x": 112,
      "y": 120,
      "width": 28,
      "height": 28,
      "id": "1058125"
    },
    "angryyappotatos": {
      "x": 140,
      "y": 120,
      "width": 28,
      "height": 28,
      "id": "1059983"
    },
    "poongjing": {
      "x": 173,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "1060927"
    },
    "poongr3": {
      "x": 173,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "1060942"
    },
    "poongr2": {
      "x": 173,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "1060947"
    },
    "poongr1": {
      "x": 173,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "1060950"
    },
    "poongves2": {
      "x": 173,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "1060951"
    },
    "poongves1": {
      "x": 0,
      "y": 148,
      "width": 28,
      "height": 28,
      "id": "1060953"
    },
    "tyler1hey": {
      "x": 28,
      "y": 148,
      "width": 28,
      "height": 28,
      "id": "106169"
    },
    "tyler1ssj": {
      "x": 56,
      "y": 148,
      "width": 28,
      "height": 28,
      "id": "106170"
    },
    "tyler1lift": {
      "x": 84,
      "y": 148,
      "width": 28,
      "height": 28,
      "id": "106173"
    },
    "tyler1bb": {
      "x": 112,
      "y": 148,
      "width": 28,
      "height": 28,
      "id": "106175"
    },
    "tyler1ayy": {
      "x": 140,
      "y": 148,
      "width": 28,
      "height": 28,
      "id": "106204"
    },
    "tyler1xd": {
      "x": 168,
      "y": 148,
      "width": 28,
      "height": 28,
      "id": "106205"
    },
    "tyler1skip": {
      "x": 201,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "106209"
    },
    "tyler1geo": {
      "x": 201,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "106233"
    },
    "reckhey": {
      "x": 201,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "106252"
    },
    "tyler1int": {
      "x": 201,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "106287"
    },
    "voteyea": {
      "x": 201,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "106293"
    },
    "votenay": {
      "x": 201,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "106294"
    },
    "bisexualpride": {
      "x": 0,
      "y": 176,
      "width": 28,
      "height": 28,
      "id": "1064987"
    },
    "lesbianpride": {
      "x": 28,
      "y": 176,
      "width": 28,
      "height": 28,
      "id": "1064988"
    },
    "gaypride": {
      "x": 56,
      "y": 176,
      "width": 28,
      "height": 28,
      "id": "1064991"
    },
    "transgenderpride": {
      "x": 84,
      "y": 176,
      "width": 28,
      "height": 28,
      "id": "1064995"
    },
    "tath": {
      "x": 112,
      "y": 176,
      "width": 28,
      "height": 28,
      "id": "106925"
    },
    "rulefive": {
      "x": 140,
      "y": 176,
      "width": 28,
      "height": 28,
      "id": "107030"
    },
    "tyler1ban": {
      "x": 196,
      "y": 176,
      "width": 28,
      "height": 28,
      "id": "107708"
    },
    "tyler1chair": {
      "x": 229,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "107716"
    },
    "tyler1feels": {
      "x": 229,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "107719"
    },
    "tyler1toxic": {
      "x": 229,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "107722"
    },
    "tyler1iq": {
      "x": 229,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "107731"
    },
    "tyler1sleeper": {
      "x": 229,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "108650"
    },
    "tyler1free": {
      "x": 229,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "108704"
    },
    "moon2mlady": {
      "x": 229,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "109723"
    },
    "\\;-?\\)": {
      "x": 363,
      "y": 764,
      "width": 24,
      "height": 18,
      "id": "11"
    },
    "moon2o": {
      "x": 28,
      "y": 204,
      "width": 28,
      "height": 28,
      "id": "1100135"
    },
    "angryyapdeong": {
      "x": 56,
      "y": 204,
      "width": 28,
      "height": 28,
      "id": "1102516"
    },
    "angryyapsil": {
      "x": 84,
      "y": 204,
      "width": 28,
      "height": 28,
      "id": "1102517"
    },
    "moon2winky": {
      "x": 112,
      "y": 204,
      "width": 28,
      "height": 28,
      "id": "110301"
    },
    "tyler1bruh": {
      "x": 140,
      "y": 204,
      "width": 28,
      "height": 28,
      "id": "110520"
    },
    "dxcat": {
      "x": 168,
      "y": 204,
      "width": 28,
      "height": 28,
      "id": "110734"
    },
    "drinkpurple": {
      "x": 196,
      "y": 204,
      "width": 28,
      "height": 28,
      "id": "110785"
    },
    "tinyface": {
      "x": 224,
      "y": 204,
      "width": 28,
      "height": 28,
      "id": "111119"
    },
    "picomause": {
      "x": 257,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "111300"
    },
    "thetarfu": {
      "x": 257,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "111351"
    },
    "tyler1nlt": {
      "x": 257,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "111552"
    },
    "tyler1good": {
      "x": 257,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "111553"
    },
    "datsheffy": {
      "x": 257,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "111700"
    },
    "unsane": {
      "x": 257,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "111792"
    },
    "copythis": {
      "x": 257,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "112288"
    },
    "pastathat": {
      "x": 257,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "112289"
    },
    "imglitch": {
      "x": 0,
      "y": 232,
      "width": 28,
      "height": 28,
      "id": "112290"
    },
    "giveplz": {
      "x": 28,
      "y": 232,
      "width": 28,
      "height": 28,
      "id": "112291"
    },
    "takenrg": {
      "x": 56,
      "y": 232,
      "width": 28,
      "height": 28,
      "id": "112292"
    },
    "tyler1o": {
      "x": 84,
      "y": 232,
      "width": 28,
      "height": 28,
      "id": "112379"
    },
    "asexualpride": {
      "x": 112,
      "y": 232,
      "width": 28,
      "height": 28,
      "id": "1130348"
    },
    "pansexualpride": {
      "x": 140,
      "y": 232,
      "width": 28,
      "height": 28,
      "id": "1130349"
    },
    "moon2good": {
      "x": 168,
      "y": 232,
      "width": 28,
      "height": 28,
      "id": "114075"
    },
    "qtpw": {
      "x": 196,
      "y": 232,
      "width": 28,
      "height": 28,
      "id": "114091"
    },
    "qtpnlt": {
      "x": 224,
      "y": 232,
      "width": 28,
      "height": 28,
      "id": "114093"
    },
    "blargnaut": {
      "x": 252,
      "y": 232,
      "width": 28,
      "height": 28,
      "id": "114738"
    },
    "dogface": {
      "x": 285,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "114835"
    },
    "jebaited": {
      "x": 285,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "114836"
    },
    "toospicy": {
      "x": 285,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "114846"
    },
    "wtruck": {
      "x": 285,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "114847"
    },
    "unclenox": {
      "x": 285,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "114856"
    },
    "raccattack": {
      "x": 285,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "114870"
    },
    "strawbeary": {
      "x": 285,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "114876"
    },
    "primeme": {
      "x": 285,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "115075"
    },
    "brainslug": {
      "x": 285,
      "y": 224,
      "width": 28,
      "height": 28,
      "id": "115233"
    },
    "batchest": {
      "x": 0,
      "y": 260,
      "width": 28,
      "height": 28,
      "id": "115234"
    },
    "forsenh": {
      "x": 56,
      "y": 260,
      "width": 28,
      "height": 28,
      "id": "115996"
    },
    "forsen1": {
      "x": 84,
      "y": 260,
      "width": 28,
      "height": 28,
      "id": "116051"
    },
    "forsen2": {
      "x": 112,
      "y": 260,
      "width": 28,
      "height": 28,
      "id": "116052"
    },
    "forsen3": {
      "x": 140,
      "y": 260,
      "width": 28,
      "height": 28,
      "id": "116053"
    },
    "forsen4": {
      "x": 168,
      "y": 260,
      "width": 28,
      "height": 28,
      "id": "116055"
    },
    "forsenlul": {
      "x": 196,
      "y": 260,
      "width": 28,
      "height": 28,
      "id": "116245"
    },
    "forsended": {
      "x": 224,
      "y": 260,
      "width": 28,
      "height": 28,
      "id": "116256"
    },
    "forsenfeels": {
      "x": 252,
      "y": 260,
      "width": 28,
      "height": 28,
      "id": "116273"
    },
    "moon2gums": {
      "x": 280,
      "y": 260,
      "width": 28,
      "height": 28,
      "id": "116435"
    },
    "curselit": {
      "x": 313,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "116625"
    },
    "qtplul": {
      "x": 313,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "116948"
    },
    "qtpcool": {
      "x": 313,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "116984"
    },
    "qtpthinking": {
      "x": 313,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "117009"
    },
    "forsenk": {
      "x": 313,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "1171397"
    },
    "qtpkawaii": {
      "x": 313,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "117329"
    },
    "qtpedge": {
      "x": 313,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "117343"
    },
    "qtpswag": {
      "x": 313,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "117351"
    },
    "qtpboosted": {
      "x": 313,
      "y": 224,
      "width": 28,
      "height": 28,
      "id": "117471"
    },
    "poooound": {
      "x": 313,
      "y": 252,
      "width": 28,
      "height": 28,
      "id": "117484"
    },
    "qtphahaa": {
      "x": 0,
      "y": 288,
      "width": 28,
      "height": 28,
      "id": "117608"
    },
    "freakinstinkin": {
      "x": 28,
      "y": 288,
      "width": 28,
      "height": 28,
      "id": "117701"
    },
    "forseno": {
      "x": 56,
      "y": 288,
      "width": 28,
      "height": 28,
      "id": "118074"
    },
    "qtpno": {
      "x": 84,
      "y": 288,
      "width": 28,
      "height": 28,
      "id": "118250"
    },
    "qtpsmorc": {
      "x": 112,
      "y": 288,
      "width": 28,
      "height": 28,
      "id": "118456"
    },
    "qtpbot": {
      "x": 140,
      "y": 288,
      "width": 28,
      "height": 28,
      "id": "118492"
    },
    "supervinlin": {
      "x": 168,
      "y": 288,
      "width": 28,
      "height": 28,
      "id": "118772"
    },
    "moon2mlem": {
      "x": 196,
      "y": 288,
      "width": 28,
      "height": 28,
      "id": "119382"
    },
    "\\:-?(p|p)": {
      "x": 339,
      "y": 764,
      "width": 24,
      "height": 18,
      "id": "12"
    },
    "trihard": {
      "x": 252,
      "y": 288,
      "width": 28,
      "height": 28,
      "id": "120232"
    },
    "angryyaph": {
      "x": 280,
      "y": 288,
      "width": 28,
      "height": 28,
      "id": "121569"
    },
    "moon2kisses": {
      "x": 308,
      "y": 288,
      "width": 28,
      "height": 28,
      "id": "121734"
    },
    "tyler1ha": {
      "x": 341,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "121815"
    },
    "tyler1kkona": {
      "x": 341,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "121816"
    },
    "tyler1lul": {
      "x": 341,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "121817"
    },
    "moon2banned": {
      "x": 341,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "121936"
    },
    "twitchrpg": {
      "x": 341,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "1220086"
    },
    "intersexpride": {
      "x": 341,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "1221184"
    },
    "forsendiglett": {
      "x": 341,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "122255"
    },
    "forsenpuke3": {
      "x": 341,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "122261"
    },
    "coolstorybob": {
      "x": 341,
      "y": 224,
      "width": 28,
      "height": 28,
      "id": "123171"
    },
    "moon2shrug": {
      "x": 341,
      "y": 252,
      "width": 28,
      "height": 28,
      "id": "123403"
    },
    "reckhands": {
      "x": 341,
      "y": 280,
      "width": 28,
      "height": 28,
      "id": "1236381"
    },
    "reckgasp": {
      "x": 0,
      "y": 316,
      "width": 28,
      "height": 28,
      "id": "1239179"
    },
    "reckrob": {
      "x": 28,
      "y": 316,
      "width": 28,
      "height": 28,
      "id": "1239201"
    },
    "tyler1p": {
      "x": 56,
      "y": 316,
      "width": 28,
      "height": 28,
      "id": "124643"
    },
    "tatblanket": {
      "x": 84,
      "y": 316,
      "width": 28,
      "height": 28,
      "id": "1248055"
    },
    "poongyep": {
      "x": 112,
      "y": 316,
      "width": 28,
      "height": 28,
      "id": "125017"
    },
    "tyler1champ": {
      "x": 140,
      "y": 316,
      "width": 28,
      "height": 28,
      "id": "125258"
    },
    "poongmak": {
      "x": 168,
      "y": 316,
      "width": 28,
      "height": 28,
      "id": "125653"
    },
    "poongcap": {
      "x": 196,
      "y": 316,
      "width": 28,
      "height": 28,
      "id": "125654"
    },
    "qtpblessed": {
      "x": 224,
      "y": 316,
      "width": 28,
      "height": 28,
      "id": "12576"
    },
    "tyler1q": {
      "x": 252,
      "y": 316,
      "width": 28,
      "height": 28,
      "id": "125850"
    },
    "recko": {
      "x": 280,
      "y": 316,
      "width": 28,
      "height": 28,
      "id": "1260943"
    },
    "poongdeath": {
      "x": 308,
      "y": 316,
      "width": 28,
      "height": 28,
      "id": "126514"
    },
    "poongspicy": {
      "x": 336,
      "y": 316,
      "width": 28,
      "height": 28,
      "id": "126515"
    },
    "poongbbuing": {
      "x": 369,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "126518"
    },
    "moon2sp": {
      "x": 369,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "1267155"
    },
    "moon2smag": {
      "x": 369,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "1267163"
    },
    "tyler1c": {
      "x": 369,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "126817"
    },
    "tyler1bad": {
      "x": 369,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "126818"
    },
    "qtphehe": {
      "x": 369,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "126889"
    },
    "forsendab": {
      "x": 369,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "1271995"
    },
    "tyler1g": {
      "x": 369,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "127464"
    },
    "moon2ye": {
      "x": 369,
      "y": 224,
      "width": 28,
      "height": 28,
      "id": "128246"
    },
    "moon2gasm": {
      "x": 369,
      "y": 252,
      "width": 28,
      "height": 28,
      "id": "128391"
    },
    "tyler1pride": {
      "x": 369,
      "y": 280,
      "width": 28,
      "height": 28,
      "id": "128660"
    },
    "maxlol": {
      "x": 369,
      "y": 308,
      "width": 28,
      "height": 28,
      "id": "1290325"
    },
    "tatwc": {
      "x": 0,
      "y": 344,
      "width": 28,
      "height": 28,
      "id": "1294993"
    },
    "nonbinarypride": {
      "x": 28,
      "y": 344,
      "width": 28,
      "height": 28,
      "id": "1297279"
    },
    "genderfluidpride": {
      "x": 56,
      "y": 344,
      "width": 28,
      "height": 28,
      "id": "1297281"
    },
    "\\;-?(p|p)": {
      "x": 315,
      "y": 764,
      "width": 24,
      "height": 18,
      "id": "13"
    },
    "tatthirst": {
      "x": 112,
      "y": 344,
      "width": 28,
      "height": 28,
      "id": "1308379"
    },
    "tatthirsty": {
      "x": 140,
      "y": 344,
      "width": 28,
      "height": 28,
      "id": "1312218"
    },
    "moon2ph": {
      "x": 168,
      "y": 344,
      "width": 28,
      "height": 28,
      "id": "1317272"
    },
    "tattomato": {
      "x": 196,
      "y": 344,
      "width": 28,
      "height": 28,
      "id": "1317421"
    },
    "tyler1na": {
      "x": 224,
      "y": 344,
      "width": 28,
      "height": 28,
      "id": "132669"
    },
    "angryyaplight": {
      "x": 252,
      "y": 344,
      "width": 28,
      "height": 28,
      "id": "1326860"
    },
    "tyler1beta": {
      "x": 280,
      "y": 344,
      "width": 28,
      "height": 28,
      "id": "132992"
    },
    "tatroad": {
      "x": 308,
      "y": 344,
      "width": 28,
      "height": 28,
      "id": "1330097"
    },
    "itsboshytime": {
      "x": 336,
      "y": 344,
      "width": 28,
      "height": 28,
      "id": "133468"
    },
    "tyler1bandit": {
      "x": 364,
      "y": 344,
      "width": 28,
      "height": 28,
      "id": "133509"
    },
    "kapow": {
      "x": 397,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "133537"
    },
    "youdontsay": {
      "x": 397,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "134254"
    },
    "uwot": {
      "x": 397,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "134255"
    },
    "rlytho": {
      "x": 397,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "134256"
    },
    "tatdmg": {
      "x": 397,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "1343473"
    },
    "tyler1eu": {
      "x": 397,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "134421"
    },
    "soonerlater": {
      "x": 397,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "134472"
    },
    "partytime": {
      "x": 397,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "135393"
    },
    "tattuff": {
      "x": 397,
      "y": 252,
      "width": 28,
      "height": 28,
      "id": "1360600"
    },
    "forsenpuke5": {
      "x": 397,
      "y": 280,
      "width": 28,
      "height": 28,
      "id": "1361610"
    },
    "summolly": {
      "x": 397,
      "y": 308,
      "width": 28,
      "height": 28,
      "id": "136983"
    },
    "tyler1cs": {
      "x": 397,
      "y": 336,
      "width": 28,
      "height": 28,
      "id": "137629"
    },
    "recks": {
      "x": 0,
      "y": 372,
      "width": 28,
      "height": 28,
      "id": "1383"
    },
    "ninjagrumpy": {
      "x": 28,
      "y": 372,
      "width": 28,
      "height": 28,
      "id": "138325"
    },
    "tyler1stutter": {
      "x": 56,
      "y": 372,
      "width": 28,
      "height": 28,
      "id": "139047"
    },
    "moon2g": {
      "x": 84,
      "y": 372,
      "width": 28,
      "height": 28,
      "id": "1394894"
    },
    "r-?\\)": {
      "x": 291,
      "y": 764,
      "width": 24,
      "height": 18,
      "id": "14"
    },
    "moon2ay": {
      "x": 168,
      "y": 372,
      "width": 28,
      "height": 28,
      "id": "1405347"
    },
    "tyler1r1": {
      "x": 196,
      "y": 372,
      "width": 28,
      "height": 28,
      "id": "140809"
    },
    "tyler1r2": {
      "x": 224,
      "y": 372,
      "width": 28,
      "height": 28,
      "id": "140810"
    },
    "sumw": {
      "x": 252,
      "y": 372,
      "width": 28,
      "height": 28,
      "id": "141193"
    },
    "mvgame": {
      "x": 280,
      "y": 372,
      "width": 28,
      "height": 28,
      "id": "142140"
    },
    "qtpusa": {
      "x": 308,
      "y": 372,
      "width": 28,
      "height": 28,
      "id": "14303"
    },
    "moon2hey": {
      "x": 336,
      "y": 372,
      "width": 28,
      "height": 28,
      "id": "143034"
    },
    "tbangel": {
      "x": 364,
      "y": 372,
      "width": 28,
      "height": 28,
      "id": "143490"
    },
    "tyler1t1": {
      "x": 392,
      "y": 372,
      "width": 28,
      "height": 28,
      "id": "143635"
    },
    "tyler1t2": {
      "x": 425,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "143636"
    },
    "fbrun": {
      "x": 425,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "1441261"
    },
    "fbpass": {
      "x": 425,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "1441271"
    },
    "fbspiral": {
      "x": 425,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "1441273"
    },
    "fbblock": {
      "x": 425,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "1441276"
    },
    "fbcatch": {
      "x": 425,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "1441281"
    },
    "fbchallenge": {
      "x": 425,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "1441285"
    },
    "fbpenalty": {
      "x": 425,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "1441289"
    },
    "qtpgive": {
      "x": 425,
      "y": 224,
      "width": 28,
      "height": 28,
      "id": "144214"
    },
    "tyler1m": {
      "x": 425,
      "y": 252,
      "width": 28,
      "height": 28,
      "id": "144428"
    },
    "sumhassan": {
      "x": 425,
      "y": 280,
      "width": 28,
      "height": 28,
      "id": "14462"
    },
    "theilluminati": {
      "x": 425,
      "y": 308,
      "width": 28,
      "height": 28,
      "id": "145315"
    },
    "tatglam": {
      "x": 425,
      "y": 336,
      "width": 28,
      "height": 28,
      "id": "145662"
    },
    "moon2xd": {
      "x": 425,
      "y": 364,
      "width": 28,
      "height": 28,
      "id": "146225"
    },
    "tatbling": {
      "x": 0,
      "y": 400,
      "width": 28,
      "height": 28,
      "id": "1465723"
    },
    "angryyapa": {
      "x": 28,
      "y": 400,
      "width": 28,
      "height": 28,
      "id": "146700"
    },
    "moon2t": {
      "x": 56,
      "y": 400,
      "width": 28,
      "height": 28,
      "id": "146843"
    },
    "petezaroll": {
      "x": 84,
      "y": 400,
      "width": 28,
      "height": 28,
      "id": "1470035"
    },
    "petezarollodyssey": {
      "x": 112,
      "y": 400,
      "width": 28,
      "height": 28,
      "id": "1470037"
    },
    "moon2l": {
      "x": 140,
      "y": 400,
      "width": 28,
      "height": 28,
      "id": "147833"
    },
    "forsenweird": {
      "x": 168,
      "y": 400,
      "width": 28,
      "height": 28,
      "id": "1479466"
    },
    "moon2me": {
      "x": 280,
      "y": 400,
      "width": 28,
      "height": 28,
      "id": "1485944"
    },
    "moon2p": {
      "x": 308,
      "y": 400,
      "width": 28,
      "height": 28,
      "id": "1486187"
    },
    "lirikblind": {
      "x": 364,
      "y": 400,
      "width": 28,
      "height": 28,
      "id": "1498549"
    },
    "lirikten": {
      "x": 392,
      "y": 400,
      "width": 28,
      "height": 28,
      "id": "1498552"
    },
    "lirikthump": {
      "x": 420,
      "y": 400,
      "width": 28,
      "height": 28,
      "id": "1498553"
    },
    "lirikhappy": {
      "x": 453,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "1498555"
    },
    "lirikclench": {
      "x": 453,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "1498556"
    },
    "lirikclap": {
      "x": 453,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "1498557"
    },
    "lirikk": {
      "x": 453,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "1498558"
    },
    "lirikh": {
      "x": 453,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "1498561"
    },
    "lirikhmm": {
      "x": 453,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "1498566"
    },
    "lirikayaya": {
      "x": 453,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "1498569"
    },
    "liriktos": {
      "x": 453,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "1498577"
    },
    "lirikweeb": {
      "x": 453,
      "y": 224,
      "width": 28,
      "height": 28,
      "id": "1498578"
    },
    "lirikhug": {
      "x": 453,
      "y": 252,
      "width": 28,
      "height": 28,
      "id": "1498657"
    },
    "lirikpog": {
      "x": 453,
      "y": 280,
      "width": 28,
      "height": 28,
      "id": "1498659"
    },
    "liriksmug": {
      "x": 453,
      "y": 308,
      "width": 28,
      "height": 28,
      "id": "1498661"
    },
    "lirikshucks": {
      "x": 453,
      "y": 336,
      "width": 28,
      "height": 28,
      "id": "1499983"
    },
    "jkanstyle": {
      "x": 42,
      "y": 791,
      "width": 21,
      "height": 27,
      "id": "15"
    },
    "lirikgachi": {
      "x": 453,
      "y": 392,
      "width": 28,
      "height": 28,
      "id": "1500011"
    },
    "angryyapd": {
      "x": 0,
      "y": 428,
      "width": 28,
      "height": 28,
      "id": "152029"
    },
    "angryyapgamza": {
      "x": 28,
      "y": 428,
      "width": 28,
      "height": 28,
      "id": "152030"
    },
    "angryyapb": {
      "x": 56,
      "y": 428,
      "width": 28,
      "height": 28,
      "id": "152618"
    },
    "blessrng": {
      "x": 112,
      "y": 428,
      "width": 28,
      "height": 28,
      "id": "153556"
    },
    "reckk": {
      "x": 140,
      "y": 428,
      "width": 28,
      "height": 28,
      "id": "1539309"
    },
    "moon2sh": {
      "x": 168,
      "y": 428,
      "width": 28,
      "height": 28,
      "id": "1544083"
    },
    "tppurn": {
      "x": 224,
      "y": 428,
      "width": 28,
      "height": 28,
      "id": "1546081"
    },
    "tppshiny": {
      "x": 252,
      "y": 428,
      "width": 28,
      "height": 28,
      "id": "1546135"
    },
    "pixelbob": {
      "x": 280,
      "y": 428,
      "width": 28,
      "height": 28,
      "id": "1547903"
    },
    "forsentake": {
      "x": 308,
      "y": 428,
      "width": 28,
      "height": 28,
      "id": "1558719"
    },
    "forsena": {
      "x": 336,
      "y": 428,
      "width": 28,
      "height": 28,
      "id": "1558721"
    },
    "forsenbreak": {
      "x": 364,
      "y": 428,
      "width": 28,
      "height": 28,
      "id": "1558723"
    },
    "lirikme": {
      "x": 392,
      "y": 428,
      "width": 28,
      "height": 28,
      "id": "1559270"
    },
    "lirikosvn": {
      "x": 420,
      "y": 428,
      "width": 28,
      "height": 28,
      "id": "1559272"
    },
    "lirikfeast": {
      "x": 448,
      "y": 428,
      "width": 28,
      "height": 28,
      "id": "1559273"
    },
    "lirikhuh": {
      "x": 481,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "1559276"
    },
    "poongpoongak": {
      "x": 481,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "156225"
    },
    "poongend2": {
      "x": 481,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "156229"
    },
    "poongnawa": {
      "x": 481,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "156230"
    },
    "poongpain": {
      "x": 481,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "156368"
    },
    "poongcop": {
      "x": 481,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "156372"
    },
    "poongpig": {
      "x": 481,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "156373"
    },
    "poongqm": {
      "x": 481,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "156375"
    },
    "moon2wut": {
      "x": 481,
      "y": 224,
      "width": 28,
      "height": 28,
      "id": "1564343"
    },
    "moon2a": {
      "x": 481,
      "y": 252,
      "width": 28,
      "height": 28,
      "id": "1564353"
    },
    "moon2n": {
      "x": 481,
      "y": 280,
      "width": 28,
      "height": 28,
      "id": "1564354"
    },
    "moon2cute": {
      "x": 481,
      "y": 308,
      "width": 28,
      "height": 28,
      "id": "1564358"
    },
    "moon2doit": {
      "x": 481,
      "y": 336,
      "width": 28,
      "height": 28,
      "id": "1564365"
    },
    "forsenlicence": {
      "x": 481,
      "y": 364,
      "width": 28,
      "height": 28,
      "id": "1565929"
    },
    "forsendeer": {
      "x": 481,
      "y": 392,
      "width": 28,
      "height": 28,
      "id": "1565934"
    },
    "forsensanta": {
      "x": 481,
      "y": 420,
      "width": 28,
      "height": 28,
      "id": "1565935"
    },
    "forsenposture": {
      "x": 0,
      "y": 456,
      "width": 28,
      "height": 28,
      "id": "1565952"
    },
    "forsenposture1": {
      "x": 28,
      "y": 456,
      "width": 28,
      "height": 28,
      "id": "1565958"
    },
    "forsenposture2": {
      "x": 56,
      "y": 456,
      "width": 28,
      "height": 28,
      "id": "1565960"
    },
    "morphintime": {
      "x": 84,
      "y": 456,
      "width": 28,
      "height": 28,
      "id": "156787"
    },
    "moon2mmm": {
      "x": 112,
      "y": 456,
      "width": 28,
      "height": 28,
      "id": "1572248"
    },
    "forsenc": {
      "x": 140,
      "y": 456,
      "width": 28,
      "height": 28,
      "id": "1572478"
    },
    "forsengrill": {
      "x": 168,
      "y": 456,
      "width": 28,
      "height": 28,
      "id": "1572481"
    },
    "forsenreins": {
      "x": 196,
      "y": 456,
      "width": 28,
      "height": 28,
      "id": "1572498"
    },
    "forsenchraken": {
      "x": 224,
      "y": 456,
      "width": 28,
      "height": 28,
      "id": "1572508"
    },
    "forsenhobo": {
      "x": 252,
      "y": 456,
      "width": 28,
      "height": 28,
      "id": "1572725"
    },
    "moon2secretemote": {
      "x": 280,
      "y": 456,
      "width": 28,
      "height": 28,
      "id": "1574694"
    },
    "moon2po": {
      "x": 308,
      "y": 456,
      "width": 28,
      "height": 28,
      "id": "1575108"
    },
    "moon2op": {
      "x": 336,
      "y": 456,
      "width": 28,
      "height": 28,
      "id": "1575110"
    },
    "gunrun": {
      "x": 420,
      "y": 456,
      "width": 28,
      "height": 28,
      "id": "1584743"
    },
    "liriktenk": {
      "x": 509,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "1592774"
    },
    "lirikgasm": {
      "x": 509,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "1592787"
    },
    "liriklate": {
      "x": 509,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "1597520"
    },
    "moon2dev": {
      "x": 509,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "1597801"
    },
    "tatlit": {
      "x": 509,
      "y": 280,
      "width": 28,
      "height": 28,
      "id": "1599586"
    },
    "optimizeprime": {
      "x": 29,
      "y": 764,
      "width": 22,
      "height": 27,
      "id": "16"
    },
    "tatgift": {
      "x": 509,
      "y": 392,
      "width": 28,
      "height": 28,
      "id": "1603328"
    },
    "thankegg": {
      "x": 509,
      "y": 420,
      "width": 28,
      "height": 28,
      "id": "160392"
    },
    "arigatonas": {
      "x": 509,
      "y": 448,
      "width": 28,
      "height": 28,
      "id": "160393"
    },
    "begwan": {
      "x": 0,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "160394"
    },
    "bigphish": {
      "x": 28,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "160395"
    },
    "inuyoface": {
      "x": 56,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "160396"
    },
    "kappu": {
      "x": 84,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "160397"
    },
    "koncha": {
      "x": 112,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "160400"
    },
    "punoko": {
      "x": 140,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "160401"
    },
    "sabaping": {
      "x": 168,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "160402"
    },
    "tearglove": {
      "x": 196,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "160403"
    },
    "tehepelo": {
      "x": 224,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "160404"
    },
    "moon2d": {
      "x": 252,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "1611444"
    },
    "sume": {
      "x": 280,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "162456"
    },
    "tatpreach": {
      "x": 308,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "16247"
    },
    "angryyaphaetae": {
      "x": 336,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "1628001"
    },
    "tpprage": {
      "x": 364,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "1631716"
    },
    "moon2c": {
      "x": 392,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "1651240"
    },
    "twitchlit": {
      "x": 420,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "166263"
    },
    "carlsmile": {
      "x": 448,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "166266"
    },
    "moon2closet": {
      "x": 476,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "1663328"
    },
    "moon2smeg": {
      "x": 504,
      "y": 484,
      "width": 28,
      "height": 28,
      "id": "166713"
    },
    "tyler1monk": {
      "x": 537,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "168930"
    },
    "stonelightning": {
      "x": 817,
      "y": 141,
      "width": 20,
      "height": 27,
      "id": "17"
    },
    "sumrip": {
      "x": 537,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "17068"
    },
    "reck25": {
      "x": 537,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "171274"
    },
    "holidaycookie": {
      "x": 537,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "1713813"
    },
    "holidaylog": {
      "x": 537,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "1713816"
    },
    "holidayornament": {
      "x": 537,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "1713818"
    },
    "holidaypresent": {
      "x": 537,
      "y": 224,
      "width": 28,
      "height": 28,
      "id": "1713819"
    },
    "holidaysanta": {
      "x": 537,
      "y": 252,
      "width": 28,
      "height": 28,
      "id": "1713822"
    },
    "holidaytree": {
      "x": 537,
      "y": 280,
      "width": 28,
      "height": 28,
      "id": "1713825"
    },
    "qtpdong": {
      "x": 537,
      "y": 308,
      "width": 28,
      "height": 28,
      "id": "17218"
    },
    "aquamangg": {
      "x": 537,
      "y": 336,
      "width": 28,
      "height": 28,
      "id": "1733216"
    },
    "forseny": {
      "x": 537,
      "y": 364,
      "width": 28,
      "height": 28,
      "id": "173372"
    },
    "forsengasm": {
      "x": 537,
      "y": 392,
      "width": 28,
      "height": 28,
      "id": "173378"
    },
    "forsenwut": {
      "x": 537,
      "y": 420,
      "width": 28,
      "height": 28,
      "id": "175766"
    },
    "sumathena": {
      "x": 537,
      "y": 448,
      "width": 28,
      "height": 28,
      "id": "1768681"
    },
    "lirikloot": {
      "x": 537,
      "y": 476,
      "width": 28,
      "height": 28,
      "id": "1771663"
    },
    "lirikobese": {
      "x": 0,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771965"
    },
    "liriksmart": {
      "x": 28,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771968"
    },
    "liriksalt": {
      "x": 56,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771970"
    },
    "liriknice": {
      "x": 84,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771971"
    },
    "lirikn": {
      "x": 112,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771973"
    },
    "liriklul": {
      "x": 140,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771975"
    },
    "lirikhype": {
      "x": 168,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771976"
    },
    "lirikfr": {
      "x": 196,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771979"
    },
    "lirikpool": {
      "x": 224,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771980"
    },
    "lirikre": {
      "x": 252,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771981"
    },
    "lirikns": {
      "x": 280,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771982"
    },
    "liriklewd": {
      "x": 308,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771988"
    },
    "lirikd": {
      "x": 336,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771989"
    },
    "lirikdj": {
      "x": 364,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771992"
    },
    "lirikgreat": {
      "x": 392,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771994"
    },
    "lirikscared": {
      "x": 420,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1771996"
    },
    "lirikez": {
      "x": 448,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1772001"
    },
    "liriks": {
      "x": 476,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1772005"
    },
    "sumpirate": {
      "x": 504,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1774063"
    },
    "moon2peepeega": {
      "x": 532,
      "y": 512,
      "width": 28,
      "height": 28,
      "id": "1776306"
    },
    "sumtucked": {
      "x": 565,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "1778224"
    },
    "forsenomega": {
      "x": 565,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "177861"
    },
    "forsens": {
      "x": 565,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "177866"
    },
    "tyler1bbc": {
      "x": 565,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "177968"
    },
    "sumohface": {
      "x": 565,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "1785"
    },
    "tpppika": {
      "x": 565,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "1785881"
    },
    "moon21": {
      "x": 565,
      "y": 252,
      "width": 28,
      "height": 28,
      "id": "1794069"
    },
    "moon22": {
      "x": 565,
      "y": 280,
      "width": 28,
      "height": 28,
      "id": "1794071"
    },
    "moon23": {
      "x": 565,
      "y": 308,
      "width": 28,
      "height": 28,
      "id": "1794073"
    },
    "moon24": {
      "x": 565,
      "y": 336,
      "width": 28,
      "height": 28,
      "id": "1794075"
    },
    "moon2coffee": {
      "x": 565,
      "y": 364,
      "width": 28,
      "height": 28,
      "id": "1794235"
    },
    "lirika": {
      "x": 565,
      "y": 392,
      "width": 28,
      "height": 28,
      "id": "1795151"
    },
    "lirikchamp": {
      "x": 565,
      "y": 420,
      "width": 28,
      "height": 28,
      "id": "1795152"
    },
    "lirikfeels": {
      "x": 565,
      "y": 448,
      "width": 28,
      "height": 28,
      "id": "1795153"
    },
    "lirikhey": {
      "x": 565,
      "y": 476,
      "width": 28,
      "height": 28,
      "id": "1795154"
    },
    "lirikpoop": {
      "x": 565,
      "y": 504,
      "width": 28,
      "height": 28,
      "id": "1795156"
    },
    "lirikpray": {
      "x": 0,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1795158"
    },
    "lirikpuke": {
      "x": 28,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1795160"
    },
    "lirikwink": {
      "x": 56,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1795161"
    },
    "lirikkappa": {
      "x": 84,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1795162"
    },
    "theringer": {
      "x": 817,
      "y": 114,
      "width": 20,
      "height": 27,
      "id": "18"
    },
    "sumdust": {
      "x": 140,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1804794"
    },
    "sumswim": {
      "x": 168,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1816465"
    },
    "moon2veryscared": {
      "x": 196,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1817217"
    },
    "moon2dumb": {
      "x": 224,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1817220"
    },
    "moon2smug": {
      "x": 252,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1825113"
    },
    "sumwiener": {
      "x": 280,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1834172"
    },
    "moon2tudd": {
      "x": 308,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1838742"
    },
    "lirikdrool": {
      "x": 0,
      "y": 92,
      "width": 28,
      "height": 28,
      "id": "1840583"
    },
    "forsent": {
      "x": 364,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "184115"
    },
    "qtpfu": {
      "x": 392,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1847364"
    },
    "qtppoo": {
      "x": 420,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1847365"
    },
    "qtpyummy": {
      "x": 448,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1847366"
    },
    "qtphonk": {
      "x": 476,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1850242"
    },
    "qtpbox": {
      "x": 504,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1850256"
    },
    "qtphands": {
      "x": 532,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1850258"
    },
    "qtpwow": {
      "x": 560,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "1850262"
    },
    "qtpstare": {
      "x": 593,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "1850266"
    },
    "qtpsip": {
      "x": 593,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "1850298"
    },
    "qtp25": {
      "x": 593,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "185253"
    },
    "tat1": {
      "x": 593,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "185304"
    },
    "tat100": {
      "x": 593,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "185305"
    },
    "tatafk": {
      "x": 593,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "185306"
    },
    "tatkevinh": {
      "x": 593,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "185311"
    },
    "tatlove": {
      "x": 593,
      "y": 224,
      "width": 28,
      "height": 28,
      "id": "185312"
    },
    "tatkevinm": {
      "x": 593,
      "y": 252,
      "width": 28,
      "height": 28,
      "id": "185313"
    },
    "tatthink": {
      "x": 593,
      "y": 280,
      "width": 28,
      "height": 28,
      "id": "185314"
    },
    "tatnolinks": {
      "x": 593,
      "y": 308,
      "width": 28,
      "height": 28,
      "id": "185315"
    },
    "tattopd": {
      "x": 593,
      "y": 336,
      "width": 28,
      "height": 28,
      "id": "185316"
    },
    "tathype": {
      "x": 593,
      "y": 364,
      "width": 28,
      "height": 28,
      "id": "185347"
    },
    "moon2spy": {
      "x": 593,
      "y": 392,
      "width": 28,
      "height": 28,
      "id": "185483"
    },
    "tatpirate": {
      "x": 593,
      "y": 420,
      "width": 28,
      "height": 28,
      "id": "1859035"
    },
    "tatmad": {
      "x": 593,
      "y": 448,
      "width": 28,
      "height": 28,
      "id": "1859043"
    },
    "qtpayaya": {
      "x": 593,
      "y": 476,
      "width": 28,
      "height": 28,
      "id": "1862657"
    },
    "qtpweird": {
      "x": 593,
      "y": 504,
      "width": 28,
      "height": 28,
      "id": "1863554"
    },
    "qtpa": {
      "x": 593,
      "y": 532,
      "width": 28,
      "height": 28,
      "id": "1866844"
    },
    "qtpwut": {
      "x": 0,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "1867315"
    },
    "qtpblush": {
      "x": 28,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "1867515"
    },
    "tatmonster": {
      "x": 56,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "187146"
    },
    "tatprime": {
      "x": 84,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "187149"
    },
    "tatriot": {
      "x": 112,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "187150"
    },
    "tatpotato": {
      "x": 140,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "187153"
    },
    "tattoxic": {
      "x": 168,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "187155"
    },
    "tatkevins": {
      "x": 196,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "187159"
    },
    "moon2s": {
      "x": 224,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "1893080"
    },
    "wholewheat": {
      "x": 817,
      "y": 30,
      "width": 20,
      "height": 30,
      "id": "1896"
    },
    "thunbeast": {
      "x": 789,
      "y": 449,
      "width": 26,
      "height": 28,
      "id": "1898"
    },
    "tf2john": {
      "x": 120,
      "y": 62,
      "width": 22,
      "height": 30,
      "id": "1899"
    },
    "ralpherz": {
      "x": 32,
      "y": 60,
      "width": 33,
      "height": 30,
      "id": "1900"
    },
    "kippa": {
      "x": 789,
      "y": 715,
      "width": 24,
      "height": 28,
      "id": "1901"
    },
    "moon2knucklesrick": {
      "x": 392,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "1901015"
    },
    "keepo": {
      "x": 789,
      "y": 392,
      "width": 27,
      "height": 29,
      "id": "1902"
    },
    "bigbrother": {
      "x": 789,
      "y": 507,
      "width": 24,
      "height": 30,
      "id": "1904"
    },
    "sobayed": {
      "x": 789,
      "y": 537,
      "width": 24,
      "height": 30,
      "id": "1906"
    },
    "liriklit": {
      "x": 504,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "1910543"
    },
    "lirikti": {
      "x": 532,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "1910547"
    },
    "crreamawk": {
      "x": 588,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "191313"
    },
    "angryyapwatching": {
      "x": 621,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "191721"
    },
    "squid1": {
      "x": 621,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "191762"
    },
    "squid2": {
      "x": 621,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "191763"
    },
    "squid3": {
      "x": 621,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "191764"
    },
    "squid4": {
      "x": 621,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "191767"
    },
    "sumchair": {
      "x": 621,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "194200"
    },
    "sumpride": {
      "x": 621,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "194201"
    },
    "sumgg": {
      "x": 621,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "194498"
    },
    "sumgold": {
      "x": 621,
      "y": 224,
      "width": 28,
      "height": 28,
      "id": "194602"
    },
    "moon2w": {
      "x": 621,
      "y": 252,
      "width": 28,
      "height": 28,
      "id": "195855"
    },
    "qtpculled": {
      "x": 621,
      "y": 280,
      "width": 28,
      "height": 28,
      "id": "19671"
    },
    "twitchunity": {
      "x": 621,
      "y": 308,
      "width": 28,
      "height": 28,
      "id": "196892"
    },
    "poonginseung": {
      "x": 621,
      "y": 336,
      "width": 28,
      "height": 28,
      "id": "199081"
    },
    "poongbus": {
      "x": 621,
      "y": 364,
      "width": 28,
      "height": 28,
      "id": "199082"
    },
    "poongnemo": {
      "x": 621,
      "y": 392,
      "width": 28,
      "height": 28,
      "id": "199522"
    },
    "\\:-?\\(": {
      "x": 789,
      "y": 743,
      "width": 24,
      "height": 18,
      "id": "2"
    },
    "lirikderp": {
      "x": 621,
      "y": 448,
      "width": 28,
      "height": 28,
      "id": "201144"
    },
    "lirikdapper": {
      "x": 621,
      "y": 476,
      "width": 28,
      "height": 28,
      "id": "201145"
    },
    "hassaanchop": {
      "x": 621,
      "y": 504,
      "width": 28,
      "height": 28,
      "id": "20225"
    },
    "qtpbeta": {
      "x": 621,
      "y": 560,
      "width": 28,
      "height": 28,
      "id": "206963"
    },
    "sumlul": {
      "x": 28,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "208772"
    },
    "recksoup": {
      "x": 56,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "209730"
    },
    "moon2wow": {
      "x": 84,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "211890"
    },
    "angryyapheup": {
      "x": 112,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "212107"
    },
    "angryyapchex": {
      "x": 140,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "212110"
    },
    "tyler1h1": {
      "x": 168,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "212205"
    },
    "tyler1h2": {
      "x": 196,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "212206"
    },
    "tyler1h3": {
      "x": 224,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "212207"
    },
    "tyler1h4": {
      "x": 252,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "212208"
    },
    "angryyapk": {
      "x": 280,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "212467"
    },
    "tatbest": {
      "x": 308,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "212548"
    },
    "poongyuri": {
      "x": 336,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "213594"
    },
    "angryyapl": {
      "x": 364,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "214473"
    },
    "redcoat": {
      "x": 817,
      "y": 223,
      "width": 19,
      "height": 27,
      "id": "22"
    },
    "lirikl": {
      "x": 420,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "2200"
    },
    "qtpstfu": {
      "x": 448,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "22127"
    },
    "babyrage": {
      "x": 476,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "22639"
    },
    "panicbasket": {
      "x": 504,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "22998"
    },
    "forsenthink": {
      "x": 532,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "239535"
    },
    "reckfarmer": {
      "x": 560,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "24129"
    },
    "fungineer": {
      "x": 789,
      "y": 567,
      "width": 24,
      "height": 30,
      "id": "244"
    },
    "residentsleeper": {
      "x": 616,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "245"
    },
    "kappa": {
      "x": 789,
      "y": 627,
      "width": 25,
      "height": 28,
      "id": "25"
    },
    "joncarnage": {
      "x": 817,
      "y": 87,
      "width": 20,
      "height": 27,
      "id": "26"
    },
    "permasmug": {
      "x": 649,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "27509"
    },
    "buddhabar": {
      "x": 649,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "27602"
    },
    "mrdestructoid": {
      "x": 81,
      "y": 0,
      "width": 39,
      "height": 27,
      "id": "28"
    },
    "tppbait": {
      "x": 649,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "280496"
    },
    "wutface": {
      "x": 649,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "28087"
    },
    "prchase": {
      "x": 649,
      "y": 224,
      "width": 28,
      "height": 28,
      "id": "28328"
    },
    "tpps": {
      "x": 649,
      "y": 252,
      "width": 28,
      "height": 28,
      "id": "284047"
    },
    "sumpuzzle": {
      "x": 649,
      "y": 364,
      "width": 28,
      "height": 28,
      "id": "29115"
    },
    "sumblind": {
      "x": 649,
      "y": 392,
      "width": 28,
      "height": 28,
      "id": "29159"
    },
    "tpplul": {
      "x": 649,
      "y": 420,
      "width": 28,
      "height": 28,
      "id": "295931"
    },
    "\\:-?d": {
      "x": 147,
      "y": 764,
      "width": 24,
      "height": 18,
      "id": "3"
    },
    "bcwarrior": {
      "x": 0,
      "y": 764,
      "width": 29,
      "height": 27,
      "id": "30"
    },
    "mau5": {
      "x": 649,
      "y": 504,
      "width": 28,
      "height": 28,
      "id": "30134"
    },
    "heyguys": {
      "x": 649,
      "y": 532,
      "width": 28,
      "height": 28,
      "id": "30259"
    },
    "tatburp": {
      "x": 649,
      "y": 560,
      "width": 28,
      "height": 28,
      "id": "309686"
    },
    "forsenw": {
      "x": 649,
      "y": 588,
      "width": 28,
      "height": 28,
      "id": "31021"
    },
    "forsenboys": {
      "x": 0,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "31097"
    },
    "forsenrp": {
      "x": 28,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "31100"
    },
    "qtppaid": {
      "x": 56,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "31292"
    },
    "moon2wah": {
      "x": 84,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "317534"
    },
    "qtpspooky": {
      "x": 112,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "3176"
    },
    "reckw": {
      "x": 81,
      "y": 27,
      "width": 32,
      "height": 32,
      "id": "31837"
    },
    "sumstepdad": {
      "x": 196,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "319871"
    },
    "sumsmokey": {
      "x": 224,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "319886"
    },
    "gingerpower": {
      "x": 21,
      "y": 791,
      "width": 21,
      "height": 27,
      "id": "32"
    },
    "sumvac": {
      "x": 280,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "32062"
    },
    "sumvac2": {
      "x": 308,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "32063"
    },
    "sumgodflash": {
      "x": 336,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "32086"
    },
    "sumrage": {
      "x": 364,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "32285"
    },
    "tpcrunchyroll": {
      "x": 392,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "323914"
    },
    "qtpwave": {
      "x": 420,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "32438"
    },
    "dansgame": {
      "x": 120,
      "y": 0,
      "width": 25,
      "height": 32,
      "id": "33"
    },
    "swiftrage": {
      "x": 0,
      "y": 791,
      "width": 21,
      "height": 28,
      "id": "34"
    },
    "peopleschamp": {
      "x": 504,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "3412"
    },
    "notatk": {
      "x": 532,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "34875"
    },
    "mcat": {
      "x": 560,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "35063"
    },
    "qtptilt": {
      "x": 588,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "35064"
    },
    "4head": {
      "x": 817,
      "y": 0,
      "width": 20,
      "height": 30,
      "id": "354"
    },
    "hotpokket": {
      "x": 65,
      "y": 60,
      "width": 28,
      "height": 30,
      "id": "357"
    },
    "pjsalt": {
      "x": 36,
      "y": 30,
      "width": 36,
      "height": 30,
      "id": "36"
    },
    "failfish": {
      "x": 120,
      "y": 32,
      "width": 22,
      "height": 30,
      "id": "360"
    },
    "grammarking": {
      "x": 677,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "3632"
    },
    "forsenddk": {
      "x": 677,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "36391"
    },
    "forsenss": {
      "x": 677,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "36535"
    },
    "panicvis": {
      "x": 677,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "3668"
    },
    "tppcrit": {
      "x": 677,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "36873"
    },
    "tpppokeyen": {
      "x": 677,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "36874"
    },
    "angryyapz": {
      "x": 677,
      "y": 224,
      "width": 28,
      "height": 28,
      "id": "368818"
    },
    "angryyapdog": {
      "x": 677,
      "y": 252,
      "width": 28,
      "height": 28,
      "id": "368836"
    },
    "sumcreeper": {
      "x": 677,
      "y": 280,
      "width": 28,
      "height": 28,
      "id": "3689"
    },
    "tpphax": {
      "x": 677,
      "y": 308,
      "width": 28,
      "height": 28,
      "id": "37025"
    },
    "tppmiss": {
      "x": 677,
      "y": 336,
      "width": 28,
      "height": 28,
      "id": "37026"
    },
    "entropywins": {
      "x": 677,
      "y": 364,
      "width": 28,
      "height": 28,
      "id": "376765"
    },
    "anele": {
      "x": 677,
      "y": 392,
      "width": 28,
      "height": 28,
      "id": "3792"
    },
    "angryyapddoddo": {
      "x": 677,
      "y": 420,
      "width": 28,
      "height": 28,
      "id": "379345"
    },
    "tpprng": {
      "x": 677,
      "y": 448,
      "width": 28,
      "height": 28,
      "id": "38008"
    },
    "tpphelix": {
      "x": 677,
      "y": 476,
      "width": 28,
      "height": 28,
      "id": "38009"
    },
    "reckchamp": {
      "x": 677,
      "y": 504,
      "width": 28,
      "height": 28,
      "id": "383522"
    },
    "ttours": {
      "x": 677,
      "y": 532,
      "width": 28,
      "height": 28,
      "id": "38436"
    },
    "praiseit": {
      "x": 677,
      "y": 560,
      "width": 28,
      "height": 28,
      "id": "38586"
    },
    "reckkgb": {
      "x": 677,
      "y": 588,
      "width": 28,
      "height": 28,
      "id": "388380"
    },
    "tppriot": {
      "x": 677,
      "y": 616,
      "width": 28,
      "height": 28,
      "id": "38947"
    },
    "tpppc": {
      "x": 0,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "39704"
    },
    "\\&gt\\;\\(": {
      "x": 99,
      "y": 764,
      "width": 24,
      "height": 18,
      "id": "4"
    },
    "kevinturtle": {
      "x": 63,
      "y": 791,
      "width": 21,
      "height": 27,
      "id": "40"
    },
    "brokeback": {
      "x": 84,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "4057"
    },
    "sumabby": {
      "x": 112,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "4075"
    },
    "sumoreo": {
      "x": 140,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "4076"
    },
    "kreygasm": {
      "x": 817,
      "y": 196,
      "width": 19,
      "height": 27,
      "id": "41"
    },
    "sumdesi": {
      "x": 196,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "4102"
    },
    "sumhorse": {
      "x": 224,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "4110"
    },
    "tppdome": {
      "x": 252,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "41225"
    },
    "qtpheart": {
      "x": 280,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "41374"
    },
    "tyler1b2": {
      "x": 308,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "420049"
    },
    "tyler1b1": {
      "x": 336,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "420051"
    },
    "pipehype": {
      "x": 364,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "4240"
    },
    "lul": {
      "x": 392,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "425618"
    },
    "powerupr": {
      "x": 420,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "425671"
    },
    "powerupl": {
      "x": 448,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "425688"
    },
    "youwhy": {
      "x": 476,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "4337"
    },
    "ritzmitz": {
      "x": 504,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "4338"
    },
    "elegiggle": {
      "x": 532,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "4339"
    },
    "qtpmoist": {
      "x": 672,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "44081"
    },
    "qtpwhat": {
      "x": 705,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "44083"
    },
    "angryyapchexx": {
      "x": 705,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "443109"
    },
    "hscheers": {
      "x": 705,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "444572"
    },
    "angryyapnoru": {
      "x": 705,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "444791"
    },
    "hswp": {
      "x": 705,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "446979"
    },
    "moon2e": {
      "x": 705,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "448024"
    },
    "poongbase": {
      "x": 705,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "449933"
    },
    "poongkiki": {
      "x": 705,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "449935"
    },
    "ssssss": {
      "x": 51,
      "y": 764,
      "width": 24,
      "height": 24,
      "id": "46"
    },
    "darkmode": {
      "x": 705,
      "y": 280,
      "width": 28,
      "height": 28,
      "id": "461298"
    },
    "angryyapyapyap": {
      "x": 705,
      "y": 308,
      "width": 28,
      "height": 28,
      "id": "465572"
    },
    "humblelife": {
      "x": 705,
      "y": 336,
      "width": 28,
      "height": 28,
      "id": "46881"
    },
    "punchtrees": {
      "x": 75,
      "y": 764,
      "width": 24,
      "height": 24,
      "id": "47"
    },
    "moon2ez": {
      "x": 705,
      "y": 392,
      "width": 28,
      "height": 28,
      "id": "476110"
    },
    "twitchvotes": {
      "x": 705,
      "y": 420,
      "width": 28,
      "height": 28,
      "id": "479745"
    },
    "troflecopter": {
      "x": 705,
      "y": 448,
      "width": 28,
      "height": 28,
      "id": "48083"
    },
    "trofleinc": {
      "x": 705,
      "y": 476,
      "width": 28,
      "height": 28,
      "id": "48120"
    },
    "troflerip": {
      "x": 705,
      "y": 504,
      "width": 28,
      "height": 28,
      "id": "48280"
    },
    "troflerampddos": {
      "x": 705,
      "y": 532,
      "width": 28,
      "height": 28,
      "id": "48281"
    },
    "poonggoldman": {
      "x": 705,
      "y": 560,
      "width": 28,
      "height": 28,
      "id": "482974"
    },
    "trofleb1": {
      "x": 705,
      "y": 588,
      "width": 28,
      "height": 28,
      "id": "48301"
    },
    "poongnof": {
      "x": 705,
      "y": 616,
      "width": 28,
      "height": 28,
      "id": "486392"
    },
    "poong5": {
      "x": 705,
      "y": 644,
      "width": 28,
      "height": 28,
      "id": "486401"
    },
    "corgiderp": {
      "x": 789,
      "y": 421,
      "width": 27,
      "height": 28,
      "id": "49106"
    },
    "forsend": {
      "x": 28,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "494927"
    },
    "\\:-?[z|z|\\|]": {
      "x": 195,
      "y": 764,
      "width": 24,
      "height": 18,
      "id": "5"
    },
    "arsonnosexy": {
      "x": 817,
      "y": 250,
      "width": 18,
      "height": 27,
      "id": "50"
    },
    "tpfufun": {
      "x": 140,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "508650"
    },
    "argieb8": {
      "x": 168,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "51838"
    },
    "smorc": {
      "x": 0,
      "y": 60,
      "width": 32,
      "height": 32,
      "id": "52"
    },
    "reckb": {
      "x": 224,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "520383"
    },
    "forsene": {
      "x": 280,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "521050"
    },
    "shadylulu": {
      "x": 308,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "52492"
    },
    "redteam": {
      "x": 336,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "530888"
    },
    "greenteam": {
      "x": 364,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "530890"
    },
    "tatw": {
      "x": 392,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "54495"
    },
    "happyjack": {
      "x": 420,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "551865"
    },
    "angryjack": {
      "x": 448,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "551866"
    },
    "kappapride": {
      "x": 476,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "55338"
    },
    "angryyaphappy": {
      "x": 504,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "555284"
    },
    "forsenbee": {
      "x": 532,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "555437"
    },
    "moon2m": {
      "x": 588,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "560023"
    },
    "tyler1yikes": {
      "x": 616,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "571061"
    },
    "tppslowpoke": {
      "x": 644,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "57116"
    },
    "tpptrumpet": {
      "x": 672,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "57117"
    },
    "recka": {
      "x": 700,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "574983"
    },
    "coolcat": {
      "x": 733,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "58127"
    },
    "dendiface": {
      "x": 733,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "58135"
    },
    "lirikno": {
      "x": 733,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "586490"
    },
    "notlikethis": {
      "x": 733,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "58765"
    },
    "[oo](_|\\.)[oo]": {
      "x": 243,
      "y": 764,
      "width": 24,
      "height": 18,
      "id": "6"
    },
    "forsenx": {
      "x": 733,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "60257"
    },
    "forsensheffy": {
      "x": 733,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "60390"
    },
    "forsenpuke": {
      "x": 733,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "60391"
    },
    "tppteihard": {
      "x": 733,
      "y": 224,
      "width": 28,
      "height": 28,
      "id": "605235"
    },
    "sumpotato": {
      "x": 733,
      "y": 252,
      "width": 28,
      "height": 28,
      "id": "60613"
    },
    "tatpretty": {
      "x": 733,
      "y": 280,
      "width": 28,
      "height": 28,
      "id": "60643"
    },
    "moon2mm": {
      "x": 733,
      "y": 308,
      "width": 28,
      "height": 28,
      "id": "610213"
    },
    "sumphone": {
      "x": 733,
      "y": 336,
      "width": 28,
      "height": 28,
      "id": "615043"
    },
    "sumez": {
      "x": 733,
      "y": 364,
      "width": 28,
      "height": 28,
      "id": "615044"
    },
    "sumg": {
      "x": 733,
      "y": 392,
      "width": 28,
      "height": 28,
      "id": "615045"
    },
    "sumcrash": {
      "x": 733,
      "y": 420,
      "width": 28,
      "height": 28,
      "id": "61531"
    },
    "tpppayout": {
      "x": 733,
      "y": 448,
      "width": 28,
      "height": 28,
      "id": "618758"
    },
    "reckf": {
      "x": 733,
      "y": 476,
      "width": 28,
      "height": 28,
      "id": "61954"
    },
    "lirikthink": {
      "x": 733,
      "y": 504,
      "width": 28,
      "height": 28,
      "id": "623352"
    },
    "purplestar": {
      "x": 733,
      "y": 532,
      "width": 28,
      "height": 28,
      "id": "624501"
    },
    "tatsellout": {
      "x": 733,
      "y": 560,
      "width": 28,
      "height": 28,
      "id": "62485"
    },
    "fbtouchdown": {
      "x": 733,
      "y": 588,
      "width": 28,
      "height": 28,
      "id": "626795"
    },
    "ripepperonis": {
      "x": 733,
      "y": 616,
      "width": 28,
      "height": 28,
      "id": "62833"
    },
    "dududu": {
      "x": 733,
      "y": 644,
      "width": 28,
      "height": 28,
      "id": "62834"
    },
    "bleedpurple": {
      "x": 733,
      "y": 672,
      "width": 28,
      "height": 28,
      "id": "62835"
    },
    "twitchraid": {
      "x": 0,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "62836"
    },
    "seemsgood": {
      "x": 56,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "64138"
    },
    "qtplurk": {
      "x": 84,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "647939"
    },
    "qtpdead": {
      "x": 112,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "647951"
    },
    "frankerz": {
      "x": 0,
      "y": 0,
      "width": 40,
      "height": 30,
      "id": "65"
    },
    "poongtt": {
      "x": 168,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "656466"
    },
    "poongl": {
      "x": 196,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "658395"
    },
    "onehand": {
      "x": 817,
      "y": 60,
      "width": 20,
      "height": 27,
      "id": "66"
    },
    "poongb": {
      "x": 252,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "665687"
    },
    "poongp": {
      "x": 280,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "665688"
    },
    "poonggy": {
      "x": 308,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "669169"
    },
    "poongch": {
      "x": 336,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "669170"
    },
    "forseniq": {
      "x": 392,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "67683"
    },
    "hassanchop": {
      "x": 817,
      "y": 168,
      "width": 19,
      "height": 28,
      "id": "68"
    },
    "forsenkek": {
      "x": 448,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "684688"
    },
    "forsenl": {
      "x": 476,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "684692"
    },
    "minglee": {
      "x": 504,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "68856"
    },
    "bloodtrail": {
      "x": 40,
      "y": 0,
      "width": 41,
      "height": 28,
      "id": "69"
    },
    "qtpmew": {
      "x": 560,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "69103"
    },
    "sumpluto": {
      "x": 588,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "69298"
    },
    "moon2dab": {
      "x": 616,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "695739"
    },
    "forsenredsonic": {
      "x": 644,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "696755"
    },
    "qtpbaked": {
      "x": 672,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "69729"
    },
    "qtpfeels": {
      "x": 700,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "69731"
    },
    "b-?\\)": {
      "x": 219,
      "y": 764,
      "width": 24,
      "height": 18,
      "id": "7"
    },
    "tatfat": {
      "x": 761,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "70086"
    },
    "tatpleb": {
      "x": 761,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "70087"
    },
    "tatmlg": {
      "x": 761,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "70089"
    },
    "kappaross": {
      "x": 761,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "70433"
    },
    "tattank": {
      "x": 761,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "708603"
    },
    "tatwink": {
      "x": 761,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "720524"
    },
    "popcorn": {
      "x": 761,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "724216"
    },
    "qtpsmug": {
      "x": 761,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "729285"
    },
    "qtpcat": {
      "x": 761,
      "y": 224,
      "width": 28,
      "height": 28,
      "id": "729414"
    },
    "dbstyle": {
      "x": 93,
      "y": 60,
      "width": 21,
      "height": 30,
      "id": "73"
    },
    "tpppokeball": {
      "x": 761,
      "y": 280,
      "width": 28,
      "height": 28,
      "id": "73516"
    },
    "troflesnail": {
      "x": 761,
      "y": 308,
      "width": 28,
      "height": 28,
      "id": "73873"
    },
    "asianglow": {
      "x": 789,
      "y": 477,
      "width": 24,
      "height": 30,
      "id": "74"
    },
    "thething": {
      "x": 761,
      "y": 364,
      "width": 28,
      "height": 28,
      "id": "7427"
    },
    "qtpd": {
      "x": 761,
      "y": 392,
      "width": 28,
      "height": 28,
      "id": "743103"
    },
    "kappaclaus": {
      "x": 761,
      "y": 420,
      "width": 28,
      "height": 28,
      "id": "74510"
    },
    "angryyapoznojam": {
      "x": 761,
      "y": 448,
      "width": 28,
      "height": 28,
      "id": "748215"
    },
    "reckc": {
      "x": 761,
      "y": 476,
      "width": 28,
      "height": 28,
      "id": "74931"
    },
    "reckp1": {
      "x": 761,
      "y": 504,
      "width": 28,
      "height": 28,
      "id": "756332"
    },
    "reckp2": {
      "x": 761,
      "y": 532,
      "width": 28,
      "height": 28,
      "id": "756334"
    },
    "reckp3": {
      "x": 761,
      "y": 560,
      "width": 28,
      "height": 28,
      "id": "756335"
    },
    "reckp4": {
      "x": 761,
      "y": 588,
      "width": 28,
      "height": 28,
      "id": "756336"
    },
    "reckbald": {
      "x": 761,
      "y": 616,
      "width": 28,
      "height": 28,
      "id": "76093"
    },
    "angryyapzzz": {
      "x": 761,
      "y": 644,
      "width": 28,
      "height": 28,
      "id": "761175"
    },
    "reckddos": {
      "x": 761,
      "y": 672,
      "width": 28,
      "height": 28,
      "id": "77110"
    },
    "forsenwtf": {
      "x": 761,
      "y": 700,
      "width": 28,
      "height": 28,
      "id": "780629"
    },
    "reckrage": {
      "x": 0,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "78421"
    },
    "\\:-?(o|o)": {
      "x": 123,
      "y": 764,
      "width": 24,
      "height": 18,
      "id": "8"
    },
    "qtplucian": {
      "x": 56,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "80386"
    },
    "sumlove": {
      "x": 84,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "80958"
    },
    "sumfail": {
      "x": 112,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "80993"
    },
    "sumfood": {
      "x": 140,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "80994"
    },
    "sumthump": {
      "x": 168,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "80995"
    },
    "sumup": {
      "x": 196,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "80996"
    },
    "sumwtf": {
      "x": 224,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "80998"
    },
    "ohmydog": {
      "x": 252,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "81103"
    },
    "osfrog": {
      "x": 280,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "81248"
    },
    "serioussloth": {
      "x": 308,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "81249"
    },
    "komodohype": {
      "x": 336,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "81273"
    },
    "vohiyo": {
      "x": 364,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "81274"
    },
    "mikehogu": {
      "x": 392,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "81636"
    },
    "kappawealth": {
      "x": 420,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "81997"
    },
    "tyler1n": {
      "x": 448,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "821920"
    },
    "reckh": {
      "x": 476,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "83335"
    },
    "reckgl": {
      "x": 532,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "84049"
    },
    "reckgr": {
      "x": 560,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "84050"
    },
    "tatchair": {
      "x": 588,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "8408"
    },
    "cmonbruh": {
      "x": 616,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "84608"
    },
    "biblethump": {
      "x": 0,
      "y": 30,
      "width": 36,
      "height": 30,
      "id": "86"
    },
    "tombraid": {
      "x": 728,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "864205"
    },
    "tatmesa": {
      "x": 756,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "86639"
    },
    "reckp": {
      "x": 789,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "86847"
    },
    "shazbotstix": {
      "x": 789,
      "y": 597,
      "width": 24,
      "height": 30,
      "id": "87"
    },
    "angryyape": {
      "x": 789,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "87236"
    },
    "angryyapf": {
      "x": 789,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "87239"
    },
    "lirikhs": {
      "x": 789,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "875499"
    },
    "qtph": {
      "x": 789,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "876449"
    },
    "tatsuh": {
      "x": 789,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "87756"
    },
    "pogchamp": {
      "x": 789,
      "y": 685,
      "width": 23,
      "height": 30,
      "id": "88"
    },
    "qtpminion": {
      "x": 789,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "887530"
    },
    "tatoshi": {
      "x": 28,
      "y": 736,
      "width": 28,
      "height": 28,
      "id": "89232"
    },
    "angryyapg": {
      "x": 761,
      "y": 252,
      "width": 28,
      "height": 28,
      "id": "89520"
    },
    "forsenwhip": {
      "x": 728,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "89640"
    },
    "forsensleeper": {
      "x": 420,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "89641"
    },
    "forsengun": {
      "x": 224,
      "y": 708,
      "width": 28,
      "height": 28,
      "id": "89650"
    },
    "forsenpuke2": {
      "x": 733,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "89678"
    },
    "smoocherz": {
      "x": 112,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "89945"
    },
    "\\&lt\\;3": {
      "x": 267,
      "y": 764,
      "width": 24,
      "height": 18,
      "id": "9"
    },
    "nomnom": {
      "x": 84,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "90075"
    },
    "stinkycheese": {
      "x": 0,
      "y": 680,
      "width": 28,
      "height": 28,
      "id": "90076"
    },
    "cheffrank": {
      "x": 705,
      "y": 364,
      "width": 28,
      "height": 28,
      "id": "90129"
    },
    "forsenknife": {
      "x": 168,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "90377"
    },
    "troflemoon": {
      "x": 56,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "90792"
    },
    "sumbuhblam": {
      "x": 28,
      "y": 652,
      "width": 28,
      "height": 28,
      "id": "90969"
    },
    "sums": {
      "x": 677,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "910286"
    },
    "pmstwin": {
      "x": 789,
      "y": 655,
      "width": 23,
      "height": 30,
      "id": "92"
    },
    "forsenprime": {
      "x": 616,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "922505"
    },
    "tatpik": {
      "x": 476,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "92258"
    },
    "tatkkevin": {
      "x": 252,
      "y": 624,
      "width": 28,
      "height": 28,
      "id": "927952"
    },
    "moon2md": {
      "x": 649,
      "y": 476,
      "width": 28,
      "height": 28,
      "id": "938129"
    },
    "reckdong": {
      "x": 649,
      "y": 448,
      "width": 28,
      "height": 28,
      "id": "938946"
    },
    "reckd": {
      "x": 649,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "938950"
    },
    "sumsuh": {
      "x": 649,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "94254"
    },
    "moon2h": {
      "x": 588,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "952500"
    },
    "moon2cd": {
      "x": 392,
      "y": 596,
      "width": 28,
      "height": 28,
      "id": "955757"
    },
    "tatdab": {
      "x": 621,
      "y": 420,
      "width": 28,
      "height": 28,
      "id": "95854"
    },
    "tatjk": {
      "x": 476,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "95855"
    },
    "earthday": {
      "x": 448,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "959018"
    },
    "forsenlewd": {
      "x": 420,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "96553"
    },
    "partyhat": {
      "x": 364,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "965738"
    },
    "taty": {
      "x": 280,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "97067"
    },
    "tatlate": {
      "x": 252,
      "y": 568,
      "width": 28,
      "height": 28,
      "id": "972382"
    },
    "daesuppy": {
      "x": 336,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "973"
    },
    "sumorc": {
      "x": 112,
      "y": 540,
      "width": 28,
      "height": 28,
      "id": "9793"
    },
    "futureman": {
      "x": 537,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "98562"
    },
    "sumrekt": {
      "x": 453,
      "y": 364,
      "width": 28,
      "height": 28,
      "id": "9873"
    },
    "sum1g": {
      "x": 140,
      "y": 372,
      "width": 28,
      "height": 28,
      "id": "9874"
    },
    "sumbag": {
      "x": 84,
      "y": 344,
      "width": 28,
      "height": 28,
      "id": "9875"
    },
    "qtpthump": {
      "x": 224,
      "y": 288,
      "width": 28,
      "height": 28,
      "id": "99038"
    },
    "qtpowo": {
      "x": 0,
      "y": 204,
      "width": 28,
      "height": 28,
      "id": "99039"
    }
  };

  /**
   * Twitch emotes
   *
   * No longer loading twitch emotes from API and using indexedDB
   * Instead of loading the 80,000 (or whatever) possible twitch emotes I've reduced
   * the emotes to just 15 channels[1] plus global, which is about ~800 emotes
   * (similar in size to the regular emoji)
   *
   * [1] https://github.com/FranciscoG/emoji-spritesheet/blob/master/lib/downloadTwitch.js
   */
  var twitch = {
    get: function get(name) {
      var emoteData = twitchSpriteSheet$1[name] || twitchSpriteSheet$1[name.toLowerCase()];

      if (emoteData) {
        return this.template(emoteData.id);
      }

      return null;
    },
    template: function template(id) {
      return "//static-cdn.jtvnw.net/emoticons/v1/".concat(id, "/1.0");
    },

    /**
     * @param {string} symbol the emote name without the enclosing colons
     * @returns {array} an array of matches
     */
    find: function find(symbol) {
      return Object.keys(twitchSpriteSheet$1).filter(function (key) {
        return key.toLowerCase().indexOf(symbol.toLowerCase()) === 0;
      }).map(function (name) {
        var obj = twitchSpriteSheet$1[name];
        obj.name = name;
        obj.type = "twitch";
        return obj;
      });
    }
  };

  var bttvSpriteSheet$1 = {
    "(chompy)": {
      "x": 214,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "550b225fff8ecee922d2a3b2"
    },
    "(poolparty)": {
      "x": 87,
      "y": 34,
      "width": 20,
      "height": 20,
      "id": "5502883d135896936880fdd3"
    },
    "(puke)": {
      "x": 0,
      "y": 296,
      "width": 20,
      "height": 20,
      "id": "550288fe135896936880fdd4"
    },
    ":'(": {
      "x": 107,
      "y": 34,
      "width": 20,
      "height": 20,
      "id": "55028923135896936880fdd5"
    },
    ":tf:": {
      "x": 79,
      "y": 128,
      "width": 28,
      "height": 28,
      "id": "54fa8f1401e468494b85b537"
    },
    "angelthump": {
      "x": 0,
      "y": 30,
      "width": 84,
      "height": 28,
      "id": "566ca1a365dbbdab32ec055b"
    },
    "aplis": {
      "x": 214,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "54fa8f4201e468494b85b538"
    },
    "ariw": {
      "x": 0,
      "y": 212,
      "width": 28,
      "height": 28,
      "id": "56fa09f18eff3b595e93ac26"
    },
    "baconeffect": {
      "x": 28,
      "y": 212,
      "width": 28,
      "height": 28,
      "id": "54fbf05a01abde735115de5e"
    },
    "badass": {
      "x": 56,
      "y": 212,
      "width": 28,
      "height": 28,
      "id": "54faa4f101e468494b85b577"
    },
    "basedgod": {
      "x": 0,
      "y": 240,
      "width": 28,
      "height": 28,
      "id": "566c9eeb65dbbdab32ec052b"
    },
    "batkappa": {
      "x": 56,
      "y": 240,
      "width": 28,
      "height": 28,
      "id": "550b6b07ff8ecee922d2a3e7"
    },
    "blackappa": {
      "x": 168,
      "y": 240,
      "width": 28,
      "height": 28,
      "id": "54faa50d01e468494b85b578"
    },
    "brobalt": {
      "x": 74,
      "y": 88,
      "width": 46,
      "height": 30,
      "id": "54fbf00a01abde735115de5c"
    },
    "bttvangry": {
      "x": 112,
      "y": 268,
      "width": 28,
      "height": 28,
      "id": "550291a3135896936880fde3"
    },
    "bttvconfused": {
      "x": 252,
      "y": 268,
      "width": 28,
      "height": 28,
      "id": "550291be135896936880fde4"
    },
    "bttvcool": {
      "x": 298,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "550291d4135896936880fde5"
    },
    "bttvgrin": {
      "x": 143,
      "y": 65,
      "width": 28,
      "height": 28,
      "id": "550291ea135896936880fde6"
    },
    "bttvhappy": {
      "x": 143,
      "y": 93,
      "width": 28,
      "height": 28,
      "id": "55029200135896936880fde7"
    },
    "bttvheart": {
      "x": 113,
      "y": 58,
      "width": 28,
      "height": 28,
      "id": "55029215135896936880fde8"
    },
    "bttvnice": {
      "x": 0,
      "y": 128,
      "width": 42,
      "height": 28,
      "id": "54fab7d2633595ca4c713abf"
    },
    "bttvsad": {
      "x": 107,
      "y": 128,
      "width": 28,
      "height": 28,
      "id": "5502925d135896936880fdea"
    },
    "bttvsleep": {
      "x": 135,
      "y": 128,
      "width": 28,
      "height": 28,
      "id": "55029272135896936880fdeb"
    },
    "bttvsurprised": {
      "x": 0,
      "y": 156,
      "width": 28,
      "height": 28,
      "id": "55029288135896936880fdec"
    },
    "bttvtongue": {
      "x": 28,
      "y": 156,
      "width": 28,
      "height": 28,
      "id": "5502929b135896936880fded"
    },
    "bttvtwink": {
      "x": 56,
      "y": 156,
      "width": 28,
      "height": 28,
      "id": "55029247135896936880fde9"
    },
    "bttvunsure": {
      "x": 84,
      "y": 156,
      "width": 28,
      "height": 28,
      "id": "550292ad135896936880fdee"
    },
    "bttvwink": {
      "x": 112,
      "y": 156,
      "width": 28,
      "height": 28,
      "id": "550292c0135896936880fdef"
    },
    "burself": {
      "x": 140,
      "y": 156,
      "width": 28,
      "height": 28,
      "id": "566c9f3b65dbbdab32ec052e"
    },
    "buttersauce": {
      "x": 168,
      "y": 156,
      "width": 28,
      "height": 28,
      "id": "54fbf02f01abde735115de5d"
    },
    "candianrage": {
      "x": 0,
      "y": 184,
      "width": 28,
      "height": 28,
      "id": "54fbf09c01abde735115de61"
    },
    "chaccepted": {
      "x": 28,
      "y": 184,
      "width": 28,
      "height": 28,
      "id": "54fa8fb201e468494b85b53b"
    },
    "cigrip": {
      "x": 56,
      "y": 184,
      "width": 28,
      "height": 28,
      "id": "54fa8fce01e468494b85b53c"
    },
    "concerndoge": {
      "x": 298,
      "y": 140,
      "width": 25,
      "height": 28,
      "id": "566c9f6365dbbdab32ec0532"
    },
    "cruw": {
      "x": 112,
      "y": 184,
      "width": 28,
      "height": 28,
      "id": "55471c2789d53f2d12781713"
    },
    "d:": {
      "x": 140,
      "y": 184,
      "width": 28,
      "height": 28,
      "id": "55028cd2135896936880fdd7"
    },
    "datsauce": {
      "x": 168,
      "y": 184,
      "width": 28,
      "height": 28,
      "id": "54fa903b01e468494b85b53f"
    },
    "dogewitit": {
      "x": 214,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "54faa52f01e468494b85b579"
    },
    "duckerz": {
      "x": 42,
      "y": 128,
      "width": 37,
      "height": 28,
      "id": "573d38b50ffbf6cc5cc38dc9"
    },
    "fapfapfap": {
      "x": 214,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "566c9f9265dbbdab32ec0538"
    },
    "fcreep": {
      "x": 214,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "56d937f7216793c63ec140cb"
    },
    "feelsamazingman": {
      "x": 214,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "5733ff12e72c3c0814233e20"
    },
    "feelsbadman": {
      "x": 178,
      "y": 92,
      "width": 30,
      "height": 30,
      "id": "566c9fc265dbbdab32ec053b"
    },
    "feelsbirthdayman": {
      "x": 120,
      "y": 88,
      "width": 19,
      "height": 28,
      "id": "55b6524154eefd53777b2580"
    },
    "feelsgoodman": {
      "x": 178,
      "y": 62,
      "width": 30,
      "height": 30,
      "id": "566c9fde65dbbdab32ec053e"
    },
    "firespeed": {
      "x": 60,
      "y": 58,
      "width": 53,
      "height": 28,
      "id": "566c9ff365dbbdab32ec0541"
    },
    "fishmoley": {
      "x": 87,
      "y": 0,
      "width": 56,
      "height": 34,
      "id": "566ca00f65dbbdab32ec0544"
    },
    "foreveralone": {
      "x": 84,
      "y": 212,
      "width": 28,
      "height": 28,
      "id": "54fa909b01e468494b85b542"
    },
    "fuckyea": {
      "x": 112,
      "y": 212,
      "width": 28,
      "height": 28,
      "id": "54fa90d601e468494b85b544"
    },
    "gaben": {
      "x": 140,
      "y": 212,
      "width": 28,
      "height": 28,
      "id": "54fa90ba01e468494b85b543"
    },
    "hahaa": {
      "x": 168,
      "y": 212,
      "width": 28,
      "height": 28,
      "id": "555981336ba1901877765555"
    },
    "hailhelix": {
      "x": 298,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "54fa90f201e468494b85b545"
    },
    "herbperve": {
      "x": 242,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "54fa913701e468494b85b546"
    },
    "hhhehehe": {
      "x": 242,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "566ca02865dbbdab32ec0547"
    },
    "hhydro": {
      "x": 242,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "54fbef6601abde735115de57"
    },
    "iamsocal": {
      "x": 242,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "54fbef8701abde735115de58"
    },
    "idog": {
      "x": 242,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "54fa919901e468494b85b548"
    },
    "kaged": {
      "x": 242,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "54fbf11001abde735115de66"
    },
    "kappacool": {
      "x": 298,
      "y": 196,
      "width": 22,
      "height": 28,
      "id": "560577560874de34757d2dc0"
    },
    "karappa": {
      "x": 242,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "550b344bff8ecee922d2a3c1"
    },
    "kkona": {
      "x": 178,
      "y": 122,
      "width": 25,
      "height": 34,
      "id": "566ca04265dbbdab32ec054a"
    },
    "lul": {
      "x": 28,
      "y": 240,
      "width": 28,
      "height": 28,
      "id": "567b00c61ddbe1786688a633"
    },
    "m&mjc": {
      "x": 178,
      "y": 0,
      "width": 36,
      "height": 30,
      "id": "54fab45f633595ca4c713abc"
    },
    "minijulia": {
      "x": 84,
      "y": 240,
      "width": 28,
      "height": 28,
      "id": "552d2fc2236a1aa17a996c5b"
    },
    "monkas": {
      "x": 112,
      "y": 240,
      "width": 28,
      "height": 28,
      "id": "56e9f494fff3cc5c35e5287e"
    },
    "motnahp": {
      "x": 140,
      "y": 240,
      "width": 28,
      "height": 28,
      "id": "55288e390fa35376704a4c7a"
    },
    "nam": {
      "x": 0,
      "y": 88,
      "width": 38,
      "height": 40,
      "id": "566ca06065dbbdab32ec054e"
    },
    "notsquishy": {
      "x": 298,
      "y": 168,
      "width": 24,
      "height": 28,
      "id": "5709ab688eff3b595e93c595"
    },
    "ohgod": {
      "x": 224,
      "y": 240,
      "width": 28,
      "height": 28,
      "id": "566ca07965dbbdab32ec0552"
    },
    "ohhhkee": {
      "x": 270,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "54fbefa901abde735115de59"
    },
    "ohmygoodness": {
      "x": 270,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "54fa925e01e468494b85b54d"
    },
    "pancakemix": {
      "x": 270,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "54fa927801e468494b85b54e"
    },
    "pedobear": {
      "x": 270,
      "y": 84,
      "width": 28,
      "height": 28,
      "id": "54fa928f01e468494b85b54f"
    },
    "pokerface": {
      "x": 270,
      "y": 112,
      "width": 28,
      "height": 28,
      "id": "54fa92a701e468494b85b550"
    },
    "poledoge": {
      "x": 270,
      "y": 140,
      "width": 28,
      "height": 28,
      "id": "566ca09365dbbdab32ec0555"
    },
    "rageface": {
      "x": 270,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "54fa92d701e468494b85b552"
    },
    "rarepepe": {
      "x": 270,
      "y": 196,
      "width": 28,
      "height": 28,
      "id": "555015b77676617e17dd2e8e"
    },
    "rebeccablack": {
      "x": 270,
      "y": 224,
      "width": 28,
      "height": 28,
      "id": "54fa92ee01e468494b85b553"
    },
    "ronsmug": {
      "x": 298,
      "y": 252,
      "width": 21,
      "height": 28,
      "id": "55f324c47f08be9f0a63cce0"
    },
    "rstrike": {
      "x": 28,
      "y": 268,
      "width": 28,
      "height": 28,
      "id": "54fa930801e468494b85b554"
    },
    "saltycorn": {
      "x": 143,
      "y": 35,
      "width": 28,
      "height": 30,
      "id": "56901914991f200c34ffa656"
    },
    "savagejerky": {
      "x": 84,
      "y": 268,
      "width": 28,
      "height": 28,
      "id": "54fb603201abde735115ddb5"
    },
    "sexpanda": {
      "x": 38,
      "y": 88,
      "width": 36,
      "height": 40,
      "id": "5502874d135896936880fdd2"
    },
    "she'llberight": {
      "x": 140,
      "y": 268,
      "width": 28,
      "height": 28,
      "id": "54fbefc901abde735115de5a"
    },
    "shoopdawhoop": {
      "x": 168,
      "y": 268,
      "width": 28,
      "height": 28,
      "id": "54fa932201e468494b85b555"
    },
    "soserious": {
      "x": 196,
      "y": 268,
      "width": 28,
      "height": 28,
      "id": "5514afe362e6bd0027aede8a"
    },
    "sosgame": {
      "x": 224,
      "y": 268,
      "width": 28,
      "height": 28,
      "id": "553b48a21f145f087fc15ca6"
    },
    "sourpls": {
      "x": 143,
      "y": 0,
      "width": 35,
      "height": 35,
      "id": "566ca38765dbbdab32ec0560"
    },
    "sqshy": {
      "x": 298,
      "y": 0,
      "width": 28,
      "height": 28,
      "id": "59cf182fcbe2693d59d7bf46"
    },
    "suchfraud": {
      "x": 298,
      "y": 28,
      "width": 28,
      "height": 28,
      "id": "54fbf07e01abde735115de5f"
    },
    "swedswag": {
      "x": 298,
      "y": 56,
      "width": 28,
      "height": 28,
      "id": "54fa9cc901e468494b85b565"
    },
    "taxibro": {
      "x": 0,
      "y": 0,
      "width": 87,
      "height": 30,
      "id": "54fbefeb01abde735115de5b"
    },
    "tehpolecat": {
      "x": 298,
      "y": 224,
      "width": 21,
      "height": 28,
      "id": "566ca11a65dbbdab32ec0558"
    },
    "topham": {
      "x": 0,
      "y": 268,
      "width": 28,
      "height": 28,
      "id": "54fa934001e468494b85b556"
    },
    "twat": {
      "x": 196,
      "y": 240,
      "width": 28,
      "height": 28,
      "id": "54fa935601e468494b85b557"
    },
    "vapenation": {
      "x": 242,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "56f5be00d48006ba34f530a4"
    },
    "vislaud": {
      "x": 196,
      "y": 212,
      "width": 28,
      "height": 28,
      "id": "550352766f86a5b26c281ba2"
    },
    "watchusay": {
      "x": 214,
      "y": 168,
      "width": 28,
      "height": 28,
      "id": "54fa99b601e468494b85b55d"
    },
    "whatayolk": {
      "x": 84,
      "y": 184,
      "width": 28,
      "height": 28,
      "id": "54fa93d001e468494b85b559"
    },
    "wowee": {
      "x": 56,
      "y": 268,
      "width": 28,
      "height": 28,
      "id": "58d2e73058d8950a875ad027"
    },
    "yetiz": {
      "x": 0,
      "y": 58,
      "width": 60,
      "height": 30,
      "id": "55189a5062e6bd0027aee082"
    },
    "zappa": {
      "x": 178,
      "y": 30,
      "width": 32,
      "height": 32,
      "id": "5622aaef3286c42e57d8e4ab"
    }
  };

  var bttv = {
    get: function get(name) {
      var emoteData = bttvSpriteSheet$1[name] || bttvSpriteSheet$1[name.toLowerCase()];

      if (emoteData) {
        return this.template(emoteData.id);
      }

      return null;
    },
    template: function template(id) {
      return "//cdn.betterttv.net/emote/".concat(id, "/3x");
    },

    /**
     * @param {string} symbol the emote name without the enclosing colons
     * @returns {array} an array of matches
     */
    find: function find(symbol) {
      return Object.keys(bttvSpriteSheet$1).filter(function (key) {
        return key.toLowerCase().indexOf(symbol.toLowerCase()) === 0;
      }).map(function (name) {
        var obj = bttvSpriteSheet$1[name];
        obj.name = name;
        obj.type = "bttv";
        return obj;
      });
    }
  };

  /**********************************************************************
   * Autocomplete Emoji / Emotes
   * Brings up a small window above the chat input to help the user
   * pick emoji/emotes
   */

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

      _defineProperty(_assertThisInitialized(_this), "state", {
        isOn: false,
        matches: []
      });

      _defineProperty(_assertThisInitialized(_this), "renderTo", document.querySelector(".pusher-chat-widget-input"));

      _defineProperty(_assertThisInitialized(_this), "chatInput", proxy.dom.chatInput());

      _defineProperty(_assertThisInitialized(_this), "selectedItem", null);

      _defineProperty(_assertThisInitialized(_this), "checkInput", function (e) {
        // we want to ignore keyups that don't output anything
        var key = e.code;

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

          _this.setState({
            matches: new_matches
          });

          return;
        }

        if (_this.state.matches.length !== 0) {
          _this.closePreview();
        }
      });

      _defineProperty(_assertThisInitialized(_this), "updateChatInput", function (emote) {
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

      _defineProperty(_assertThisInitialized(_this), "keyboardNav", function (e) {
        if (_this.state.matches.length === 0) {
          return true;
        }

        switch (e.code) {
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

      _defineProperty(_assertThisInitialized(_this), "turnOn", function (e) {
        _this.setState({
          isOn: true
        }); // relying on Dubtrack.fm's lodash being globally available


        _this.debouncedCheckInput = window._.debounce(_this.checkInput, 100);
        _this.debouncedNav = window._.debounce(_this.keyboardNav, 100);

        _this.chatInput.addEventListener("keydown", _this.debouncedNav);

        _this.chatInput.addEventListener("keyup", _this.debouncedCheckInput);
      });

      _defineProperty(_assertThisInitialized(_this), "turnOff", function (e) {
        _this.setState({
          isOn: false
        });

        _this.chatInput.removeEventListener("keydown", _this.debouncedNav);

        _this.chatInput.removeEventListener("keyup", _this.debouncedCheckInput);
      });

      return _this;
    }

    _createClass(AutocompleteEmoji, [{
      key: "getMatches",
      value: function getMatches(symbol) {
        symbol = symbol.replace(/^:/, "");
        var classic = emoji.find(symbol);

        if (classic.length > 0) {
          classic.unshift({
            header: "Emoji"
          });
        } // if emotes is not on then we return just classic emoji


        if (!userSettings.stored.options["dubplus-emotes"]) {
          return classic;
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
      value: function render(props, _ref) {
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
  }(m);

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
    var list = proxy.dom.allChatTexts();

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
    var twitchImg = twitch.get(key);

    if (twitchImg) {
      return {
        type: "twitch",
        src: twitchImg,
        name: key
      };
    }

    var bttvImg = bttv.get(key);

    if (bttvImg) {
      return {
        type: "bttv",
        src: bttvImg,
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
    // if starting node is missing or not a real node we look for the latest message
    if (!nodeStart || !nodeStart.nodeType) {
      nodeStart = getLatestChatNode();
    } // if we still have nothing then quit


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

      _defineProperty(_assertThisInitialized(_this), "turnOn", function () {
        document.body.classList.add("dubplus-emotes-on");

        _this.begin();
      });

      _defineProperty(_assertThisInitialized(_this), "turnOff", function (e) {
        document.body.classList.remove("dubplus-emotes-on");
        proxy.events.offChatMessage(beginReplace);
      });

      return _this;
    }

    _createClass(Emotes, [{
      key: "begin",
      value: function begin() {
        // when first turning it on, it replaces ALL of the emotes in chat history
        beginReplace(proxy.dom.chatList()); // then it sets up replacing emotes on new chat messages

        proxy.events.onChatMessage(beginReplace);
      }
    }, {
      key: "render",
      value: function render(props, state) {
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
  }(m);

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

      _defineProperty(_assertThisInitialized(_this), "state", {
        custom: userSettings.stored.custom.custom_mentions
      });

      _defineProperty(_assertThisInitialized(_this), "customMentionCheck", function (e) {
        var content = e.message;

        if (_this.state.custom) {
          var customMentions = _this.state.custom.split(",");

          var inUsers = customMentions.some(function (v) {
            var reg = new RegExp("\\b" + v.trim() + "\\b", "i");
            return reg.test(content);
          });

          if (proxy.sessionId() !== e.user.userInfo.userid && inUsers) {
            proxy.playChatSound();
          }
        }
      });

      _defineProperty(_assertThisInitialized(_this), "saveCustomMentions", function (val) {
        var success = userSettings.save("custom", "custom_mentions", val);

        if (success) {
          _this.setState({
            custom: val
          });
        }

        return success;
      });

      _defineProperty(_assertThisInitialized(_this), "turnOn", function () {
        proxy.events.onChatMessage(_this.customMentionCheck);
      });

      _defineProperty(_assertThisInitialized(_this), "turnOff", function () {
        proxy.events.offChatMessage(_this.customMentionCheck);
      });

      return _this;
    }

    _createClass(CustomMentions, [{
      key: "render",
      value: function render(props, _ref) {
        var custom = _ref.custom;
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
          value: custom,
          placeholder: "separate, custom triggers, by, comma, :heart:",
          maxlength: "255",
          onConfirm: this.saveCustomMentions
        }));
      }
    }]);

    return CustomMentions;
  }(m);

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

      _defineProperty(_assertThisInitialized(_this), "state", {
        maxChats: userSettings.stored.custom.chat_cleaner || 500,
        showModal: false
      });

      _defineProperty(_assertThisInitialized(_this), "chatCleanerCheck", function (e) {
        var totalChats = Array.from(proxy.dom.chatList().children);
        var max = parseInt(_this.state.maxChats, 10);

        if (isNaN(totalChats.length) || isNaN(max) || !totalChats.length || totalChats.length < max) {
          return;
        }

        var parentUL = totalChats[0].parentElement;
        var min = totalChats.length - max;

        if (min > 0) {
          totalChats.splice(0, min).forEach(function (li) {
            parentUL.removeChild(li);
          });
          totalChats[totalChats.length - 1].scrollIntoView(false);
        }
      });

      _defineProperty(_assertThisInitialized(_this), "saveAmount", function (value) {
        var chatItems = parseInt(value, 10);
        var amount = !isNaN(chatItems) ? chatItems : 500;
        var success = userSettings.save("custom", "chat_cleaner", amount); // default to 500

        if (success) {
          _this.setState({
            maxChats: value,
            showModal: false
          });
        }

        return success;
      });

      _defineProperty(_assertThisInitialized(_this), "turnOn", function (initialLoad) {
        proxy.events.onChatMessage(_this.chatCleanerCheck);

        if (!initialLoad && !userSettings.stored.custom.chat_cleaner) {
          _this.setState({
            showModal: true
          });
        }
      });

      _defineProperty(_assertThisInitialized(_this), "turnOff", function () {
        proxy.events.offChatMessage(_this.chatCleanerCheck);
      });

      return _this;
    }

    _createClass(ChatCleaner, [{
      key: "render",
      value: function render() {
        return h(MenuSwitch, {
          id: "chat-cleaner",
          section: "General",
          menuTitle: "Chat Cleaner",
          desc: "Automatically only keep a designated chatItems of chat items while clearing older ones, keeping CPU stress down",
          turnOn: this.turnOn,
          turnOff: this.turnOff
        }, h(MenuPencil, {
          showModal: this.state.showModal,
          title: "Chat Cleaner",
          section: "General",
          content: "Please specify the number of most recent chat items that will remain in your chat history",
          value: this.state.maxChats,
          placeholder: "defaults to 500",
          maxlength: "5",
          onConfirm: this.saveAmount
        }));
      }
    }]);

    return ChatCleaner;
  }(m);

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

      _defineProperty(_assertThisInitialized(_this), "state", {
        showWarning: false,
        warnTitle: "",
        warnContent: ""
      });

      _defineProperty(_assertThisInitialized(_this), "turnOn", function () {
        notifyCheckPermission(function (status, reason) {
          if (status === true) {
            proxy.events.onChatMessage(_this.notifyOnMention);
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

      _defineProperty(_assertThisInitialized(_this), "closeModal", function () {
        _this.setState({
          showWarning: false
        });
      });

      _defineProperty(_assertThisInitialized(_this), "turnOff", function () {
        proxy.events.offChatMessage(_this.notifyOnMention);
      });

      return _this;
    }

    _createClass(ChatNotification, [{
      key: "notifyOnMention",
      value: function notifyOnMention(e) {
        var content = e.message;
        var user = proxy.userName().toLowerCase();
        var mentionTriggers = ["@" + user];

        if (userSettings.stored.options.custom_mentions && userSettings.stored.custom.custom_mentions) {
          //add custom mention triggers to array
          mentionTriggers = mentionTriggers.concat(userSettings.stored.custom.custom_mentions.split(","));
        }

        var mentionTriggersTest = mentionTriggers.some(function (v) {
          return content.toLowerCase().indexOf(v.toLowerCase().trim()) >= 0;
        });

        if (mentionTriggersTest && !this.isActiveTab && proxy.sessionId() !== e.user.userInfo.userid) {
          showNotification({
            title: "Message from ".concat(e.user.username),
            content: content
          });
        }
      }
    }, {
      key: "render",
      value: function render(props, state) {
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
  }(m);

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

      _defineProperty(_assertThisInitialized(_this), "state", {
        showWarning: false,
        warnTitle: "",
        warnContent: ""
      });

      _defineProperty(_assertThisInitialized(_this), "turnOn", function () {
        notifyCheckPermission(function (status, reason) {
          if (status === true) {
            proxy.events.onNewPM(_this.notify);
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

      _defineProperty(_assertThisInitialized(_this), "closeModal", function () {
        _this.setState({
          showWarning: false
        });
      });

      _defineProperty(_assertThisInitialized(_this), "turnOff", function () {
        proxy.events.offNewPM(_this.notify);
      });

      return _this;
    }

    _createClass(PMNotifications, [{
      key: "notify",
      value: function notify(e) {
        var userid = proxy.userId();

        if (userid === e.userid) {
          return;
        }

        showNotification({
          title: "You have a new PM",
          ignoreActiveTab: true,
          callback: function callback() {
            proxy.dom.userPMs().click();
            setTimeout(function () {
              proxy.dom.getPMmsg(e.messageid).click();
            }, 500);
          },
          wait: 10000
        });
      }
    }, {
      key: "render",
      value: function render(props, state) {
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
  }(m);

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

      _defineProperty(_assertThisInitialized(_this), "state", {
        canNotify: false,
        notifyOn: userSettings.stored.custom["dj-notification"]
      });

      _defineProperty(_assertThisInitialized(_this), "savePosition", function (value) {
        var int = parseInt(value, 10);
        var amount = !isNaN(int) ? int : 2; // set default to position 2 in the queue

        var success = userSettings.save("custom", "dj-notification", amount);

        if (success) {
          _this.setState({
            notifyOn: value
          });
        }

        return success;
      });

      _defineProperty(_assertThisInitialized(_this), "djNotificationCheck", function (e) {
        if (!_this.canNotify || e.startTime > 2) return;
        var queuePos = proxy.dom.getQueuePosition();
        var positionParse = parseInt(queuePos, 10);
        var position = e.startTime < 0 && !isNaN(positionParse) ? positionParse - 1 : positionParse;

        if (isNaN(positionParse) || position !== _this.state.notifyOn) {
          return;
        }

        showNotification({
          title: "DJ Alert!",
          content: "You will be DJing shortly! Make sure your song is set!",
          ignoreActiveTab: true,
          wait: 10000
        });
        proxy.playChatSound();
      });

      _defineProperty(_assertThisInitialized(_this), "turnOn", function () {
        notifyCheckPermission(function (status, reason) {
          if (status === true) {
            _this.setState({
              canNotify: true
            });
          }
        });
        proxy.events.onPlaylistUpdate(_this.djNotificationCheck);
      });

      _defineProperty(_assertThisInitialized(_this), "turnOff", function () {
        proxy.events.offPlaylistUpdate(_this.djNotificationCheck);
      });

      return _this;
    }

    _createClass(DJNotification, [{
      key: "render",
      value: function render() {
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
          value: this.state.notifyOn,
          placeholder: "2",
          maxlength: "2",
          onConfirm: this.savePosition
        }));
      }
    }]);

    return DJNotification;
  }(m);

  /*  Snowfall pure js
      https://github.com/loktar00/JQuery-Snowfall/blob/master/src/snowfall.js
      ====================================================================
      LICENSE
      ====================================================================
      Licensed under the Apache License, Version 2.0 (the "License");
      you may not use this file except in compliance with the License.
      You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

         Unless required by applicable law or agreed to in writing, software
         distributed under the License is distributed on an "AS IS" BASIS,
         WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
         See the License for the specific language governing permissions and
         limitations under the License.
      ====================================================================
      
      1.0
      Wanted to rewrite my snow plugin to use pure JS so you werent necessarily tied to using a framework.
      Does not include a selector engine or anything, just pass elements to it using standard JS selectors.
      
      Does not clear snow currently. Collection portion removed just for ease of testing will add back in next version
      
      Theres a few ways to call the snow you could do it the following way by directly passing the selector,
      
          snowFall.snow(document.getElementsByTagName("body"), {options});
      
      or you could save the selector results to a variable, and then call it
          
          var elements = document.getElementsByClassName('yourclass');
          snowFall.snow(elements, {options});
          
      Options are all the same as the plugin except clear, and collection
      
      values for snow options are
      
      flakeCount,
      flakeColor,
      flakeIndex,
      flakePosition,
      minSize,
      maxSize,
      minSpeed,
      maxSpeed,
      round,      true or false, makes the snowflakes rounded if the browser supports it.
      shadow      true or false, gives the snowflakes a shadow if the browser supports it.
          
  */
  // requestAnimationFrame polyfill from https://github.com/darius/requestAnimationFrame
  if (!Date.now) Date.now = function () {
    return new Date().getTime();
  };

  (function () {

    var vendors = ["webkit", "moz"];

    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
      var vp = vendors[i];
      window.requestAnimationFrame = window[vp + "RequestAnimationFrame"];
      window.cancelAnimationFrame = window[vp + "CancelAnimationFrame"] || window[vp + "CancelRequestAnimationFrame"];
    }

    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || // iOS6 is buggy
    !window.requestAnimationFrame || !window.cancelAnimationFrame) {
      var lastTime = 0;

      window.requestAnimationFrame = function (callback) {
        var now = Date.now();
        var nextTime = Math.max(lastTime + 16, now);
        return setTimeout(function () {
          callback(lastTime = nextTime);
        }, nextTime - now);
      };

      window.cancelAnimationFrame = clearTimeout;
    }
  })();

  var snowFall = function () {
    function jSnow() {
      // local methods
      var defaults = {
        flakeCount: 35,
        flakeColor: "#ffffff",
        flakeIndex: 999999,
        flakePosition: "absolute",
        minSize: 1,
        maxSize: 2,
        minSpeed: 1,
        maxSpeed: 5,
        round: false,
        shadow: false,
        collection: false,
        image: false,
        collectionHeight: 40
      },
          flakes = [],
          element = {},
          elHeight = 0,
          elWidth = 0,
          widthOffset = 0,
          snowTimeout = 0,
          // For extending the default object with properties
      extend = function extend(obj, extObj) {
        for (var i in extObj) {
          if (obj.hasOwnProperty(i)) {
            obj[i] = extObj[i];
          }
        }
      },
          // For setting CSS3 transform styles
      transform = function transform(el, styles) {
        el.style.webkitTransform = styles;
        el.style.MozTransform = styles;
        el.style.msTransform = styles;
        el.style.OTransform = styles;
        el.style.transform = styles;
      },
          // random between range
      random = function random(min, max) {
        return Math.round(min + Math.random() * (max - min));
      },
          // Set multiple styles at once.
      setStyle = function setStyle(element, props) {
        for (var property in props) {
          element.style[property] = props[property] + (property == "width" || property == "height" ? "px" : "");
        }
      },
          // snowflake
      flake = function flake(_el, _size, _speed) {
        // Flake properties
        this.x = random(widthOffset, elWidth - widthOffset);
        this.y = random(0, elHeight);
        this.size = _size;
        this.speed = _speed;
        this.step = 0;
        this.stepSize = random(1, 10) / 100;

        if (defaults.collection) {
          this.target = canvasCollection[random(0, canvasCollection.length - 1)];
        }

        var flakeObj = null;

        if (defaults.image) {
          flakeObj = new Image();
          flakeObj.src = defaults.image;
        } else {
          flakeObj = document.createElement("div");
          setStyle(flakeObj, {
            background: defaults.flakeColor
          });
        }

        flakeObj.className = "snowfall-flakes";
        setStyle(flakeObj, {
          width: this.size,
          height: this.size,
          position: defaults.flakePosition,
          top: 0,
          left: 0,
          "will-change": "transform",
          fontSize: 0,
          zIndex: defaults.flakeIndex
        }); // This adds the style to make the snowflakes round via border radius property

        if (defaults.round) {
          setStyle(flakeObj, {
            "-moz-border-radius": ~~defaults.maxSize + "px",
            "-webkit-border-radius": ~~defaults.maxSize + "px",
            borderRadius: ~~defaults.maxSize + "px"
          });
        } // This adds shadows just below the snowflake so they pop a bit on lighter colored web pages


        if (defaults.shadow) {
          setStyle(flakeObj, {
            "-moz-box-shadow": "1px 1px 1px #555",
            "-webkit-box-shadow": "1px 1px 1px #555",
            boxShadow: "1px 1px 1px #555"
          });
        }

        if (_el.tagName === document.body.tagName) {
          document.body.appendChild(flakeObj);
        } else {
          _el.appendChild(flakeObj);
        }

        this.element = flakeObj; // Update function, used to update the snow flakes, and checks current snowflake against bounds

        this.update = function () {
          this.y += this.speed;

          if (this.y > elHeight - (this.size + 6)) {
            this.reset();
          }

          transform(this.element, "translateY(" + this.y + "px) translateX(" + this.x + "px)");
          this.step += this.stepSize;
          this.x += Math.cos(this.step);

          if (this.x + this.size > elWidth - widthOffset || this.x < widthOffset) {
            this.reset();
          }
        }; // Resets the snowflake once it reaches one of the bounds set


        this.reset = function () {
          this.y = 0;
          this.x = random(widthOffset, elWidth - widthOffset);
          this.stepSize = random(1, 10) / 100;
          this.size = random(defaults.minSize * 100, defaults.maxSize * 100) / 100;
          this.element.style.width = this.size + "px";
          this.element.style.height = this.size + "px";
          this.speed = random(defaults.minSpeed, defaults.maxSpeed);
        };
      },
          // this controls flow of the updating snow
      animateSnow = function animateSnow() {
        for (var i = 0; i < flakes.length; i += 1) {
          flakes[i].update();
        }

        snowTimeout = requestAnimationFrame(function () {
          animateSnow();
        });
      };

      return {
        snow: function snow(_element, _options) {
          extend(defaults, _options); //init the element vars

          element = _element;
          elHeight = element.offsetHeight;
          elWidth = element.offsetWidth;
          element.snow = this; // if this is the body the offset is a little different

          if (element.tagName.toLowerCase() === "body") {
            widthOffset = 25;
          } // Bind the window resize event so we can get the innerHeight again


          window.addEventListener("resize", function () {
            elHeight = element.clientHeight;
            elWidth = element.offsetWidth;
          }, true); // initialize the flakes

          for (var i = 0; i < defaults.flakeCount; i += 1) {
            flakes.push(new flake(element, random(defaults.minSize * 100, defaults.maxSize * 100) / 100, random(defaults.minSpeed, defaults.maxSpeed)));
          } // start the snow


          animateSnow();
        },
        clear: function clear() {
          var flakeChildren = null;

          if (!element.getElementsByClassName) {
            flakeChildren = element.querySelectorAll(".snowfall-flakes");
          } else {
            flakeChildren = element.getElementsByClassName("snowfall-flakes");
          }

          var flakeChilLen = flakeChildren.length;

          while (flakeChilLen--) {
            if (flakeChildren[flakeChilLen].parentNode === element) {
              element.removeChild(flakeChildren[flakeChilLen]);
            }
          }

          cancelAnimationFrame(snowTimeout);
        }
      };
    }

    return {
      snow: function snow(elements, options) {
        if (typeof options == "string") {
          if (elements.length > 0) {
            for (var i = 0; i < elements.length; i++) {
              if (elements[i].snow) {
                elements[i].snow.clear();
              }
            }
          } else {
            elements.snow.clear();
          }
        } else {
          if (elements.length > 0) {
            for (var i = 0; i < elements.length; i++) {
              new jSnow().snow(elements[i], options);
            }
          } else {
            new jSnow().snow(elements, options);
          }
        }
      }
    };
  }();

  var options = {
    round: true,
    shadow: true,
    flakeCount: 50,
    minSize: 1,
    maxSize: 5,
    minSpeed: 5,
    maxSpeed: 5
  };

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

      _defineProperty(_assertThisInitialized(_this), "turnOn", function () {
        var target = document.getElementById('snow-container');

        if (!target) {
          _this.makeContainer();
        }

        snowFall.snow(document.getElementById('snow-container'), options);
      });

      _defineProperty(_assertThisInitialized(_this), "turnOff", function () {
        var target = document.getElementById('snow-container');

        if (target) {
          target.remove();
        }
      });

      return _this;
    }

    _createClass(SnowSwitch, [{
      key: "makeContainer",
      value: function makeContainer() {
        var snowdiv = document.createElement('div');
        snowdiv.id = 'snow-container';
        snowdiv.style.cssText = "\n      position:absolute;\n      top:0;\n      left:0;\n      width: 100%;\n      height: 100%;\n    ";
        document.body.appendChild(snowdiv);
      }
    }, {
      key: "render",
      value: function render() {
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
  }(m);

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
      value: function render(props, state) {
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
  }(m);

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
      src: proxy.api.userImage(data.userid)
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
          elem = proxy.dom.upVote();
        } else if (whichVote === "down") {
          elem = proxy.dom.downVote();
        } else {
          return;
        }

        var bgColor = elem.classList.contains("voted") ? window.getComputedStyle(elem).backgroundColor : window.getComputedStyle(elem.querySelector(".icon-".concat(whichVote, "vote"))).color;
        return bgColor;
      }
    }, {
      key: "updateChat",
      value: function updateChat(str) {
        var chat = proxy.dom.chatInput();
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
      value: function render(_ref2) {
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

        if (type === "downdubs" && !isMod) {
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
  }(m);

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

      _defineProperty(_assertThisInitialized(_this), "state", {
        isOn: false,
        showWarning: false,
        upDubs: [],
        downDubs: [],
        grabs: []
      });

      _defineProperty(_assertThisInitialized(_this), "userIsMod", proxy.modCheck());

      _defineProperty(_assertThisInitialized(_this), "turnOn", function () {
        _this.setState({
          isOn: true
        }, _this.resetDubs);

        proxy.events.onSongVote(_this.dubWatcher);
        proxy.events.onSongGrab(_this.grabWatcher);
        proxy.events.onUserLeave(_this.dubUserLeaveWatcher);
        proxy.events.onPlaylistUpdate(_this.resetDubs);
        proxy.events.onPlaylistUpdate(_this.resetGrabs);
      });

      _defineProperty(_assertThisInitialized(_this), "turnOff", function () {
        _this.setState({
          isOn: false
        });

        proxy.events.offSongVote(_this.dubWatcher);
        proxy.events.offSongGrab(_this.grabWatcher);
        proxy.events.offUserLeave(_this.dubUserLeaveWatcher);
        proxy.events.offPlaylistUpdate(_this.resetDubs);
        proxy.events.offPlaylistUpdate(_this.resetGrabs);
      });

      _defineProperty(_assertThisInitialized(_this), "closeModal", function () {
        _this.setState({
          showWarning: false
        });
      });

      _defineProperty(_assertThisInitialized(_this), "dubWatcher", function (e) {
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
          } // then remove them from downdubs


          var userDowndubbed = downDubs.filter(function (el) {
            return el.userid === e.user._id;
          }).length > 0;

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
          }).length > 0;

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

      _defineProperty(_assertThisInitialized(_this), "grabWatcher", function (e) {
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

      _defineProperty(_assertThisInitialized(_this), "dubUserLeaveWatcher", function (e) {
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

      _defineProperty(_assertThisInitialized(_this), "resetDubs", function () {
        _this.setState({
          upDubs: [],
          downDubs: []
        }, _this.handleReset);
      });

      _defineProperty(_assertThisInitialized(_this), "resetGrabs", function () {
        _this.setState({
          grabs: []
        });
      });

      return _this;
    }

    _createClass(ShowDubsOnHover, [{
      key: "getUserData",
      value: function getUserData(userid, whichVote) {
        var _this2 = this;

        // if they don't exist, we can check the user api directly
        var userInfo = proxy.api.getUserData(userid);
        userInfo.then(function (json) {
          var data = json.data;

          if (data && data.userinfo && data.userinfo.username) {
            var user = {
              userid: e.userid,
              username: data.userinfo.username
            };

            _this2.setState(function (prevState) {
              if (whichVote === "down") {
                return {
                  downDubs: [].concat(_toConsumableArray(prevState.downDubs), [user])
                };
              }

              if (whichVote === "up") {
                return {
                  upDubs: [].concat(_toConsumableArray(prevState.upDubs), [user])
                };
              }
            });
          }
        });
      }
      /**
       * Callback for resetDubs()'s setState
       * Wipes out local state and repopulates with data from the api
       */

    }, {
      key: "handleReset",
      value: function handleReset() {
        var _this3 = this;

        // get the current active dubs in the room via api
        var roomDubs = proxy.api.getActiveDubs();
        roomDubs.then(function (json) {
          // loop through all the upDubs in the room and add them to our local state
          if (json.data && json.data.upDubs) {
            json.data.upDubs.forEach(function (e) {
              // Dub already casted (usually from autodub)
              if (_this3.state.upDubs.filter(function (el) {
                return el.userid === e.userid;
              }).length > 0) {
                return;
              } // to get username we check for user info in the DT room's user collection


              var checkUser = proxy.getUserInfo(e.userid);

              if (!checkUser || !checkUser.attributes) {
                // if they don't exist, we can check the user api directly
                _this3.getUserData(e.userid, "up");

                return;
              }

              if (checkUser.attributes._user.username) {
                var user = {
                  userid: e.userid,
                  username: checkUser.attributes._user.username
                };

                _this3.setState(function (prevState) {
                  return {
                    upDubs: [].concat(_toConsumableArray(prevState.upDubs), [user])
                  };
                });
              }
            });
          } //Only let mods or higher access down dubs


          if (json.data && json.data.downDubs && _this3.userIsMod) {
            json.data.downDubs.forEach(function (e) {
              //Dub already casted
              if (_this3.state.downDubs.filter(function (el) {
                return el.userid === e.userid;
              }).length > 0) {
                return;
              }

              var checkUsers = proxy.getUserInfo(e.userid);

              if (!checkUsers || !checkUsers.attributes) {
                _this3.getUserData(e.userid, "down");

                return;
              }

              if (checkUsers.attributes._user.username) {
                var user = {
                  userid: e.userid,
                  username: checkUsers.attributes._user.username
                };

                _this3.setState(function (prevState) {
                  return {
                    downDubs: [].concat(_toConsumableArray(prevState.downDubs), [user])
                  };
                });
              }
            });
          }
        }).catch(function (err) {
          // console.error(err);
          console.log('error getting active dubs, maybe no songs playing');
        });
      }
    }, {
      key: "componentWillMount",
      value: function componentWillMount() {
        this.upElem = proxy.dom.upVote().parentElement;
        this.upElem.classList.add("dubplus-updub-btn");
        this.downElem = proxy.dom.downVote().parentElement;
        this.downElem.classList.add("dubplus-downdub-btn");
        this.grabElem = proxy.dom.grabBtn().parentElement;
        this.grabElem.classList.add("dubplus-grab-btn");
      }
    }, {
      key: "render",
      value: function render(props, state) {
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
  }(m);

  function chatMessage(username, song) {
    var li = document.createElement("li");
    li.className = "dubplus-chat-system dubplus-chat-system-downdub";
    var div = document.createElement("div");
    div.className = "chatDelete";

    div.onclick = function (e) {
      return e.currentTarget.parentElement.remove();
    };

    var span = document.createElement("span");
    span.className = "icon-close";
    var text = document.createElement("div");
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
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, DowndubInChat);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(DowndubInChat)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_this), "turnOn", function () {
        if (!proxy.modCheck()) {
          return;
        }

        proxy.events.onSongVote(_this.downdubWatcher);
      });

      _defineProperty(_assertThisInitialized(_this), "turnOff", function () {
        proxy.events.offSongVote(_this.downdubWatcher);
      });

      return _this;
    }

    _createClass(DowndubInChat, [{
      key: "downdubWatcher",
      value: function downdubWatcher(e) {
        var user = proxy.userName();
        var currentDj = proxy.getCurrentDJ();

        if (!currentDj) {
          return;
        }

        if (user === currentDj && e.dubtype === "downdub") {
          var newChat = chatMessage(e.user.username, proxy.getSongName());
          proxy.dom.chatList().appendChild(newChat);
        }
      }
    }, {
      key: "render",
      value: function render() {
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
  }(m);

  function chatMessage$1(username, song) {
    var li = document.createElement("li");
    li.className = "dubplus-chat-system dubplus-chat-system-updub";
    var div = document.createElement("div");
    div.className = "chatDelete";

    div.onclick = function (e) {
      return e.currentTarget.parentElement.remove();
    };

    var span = document.createElement("span");
    span.className = "icon-close";
    var text = document.createElement("div");
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
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, UpdubsInChat);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UpdubsInChat)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_this), "turnOn", function () {
        proxy.events.onSongVote(_this.updubWatcher);
      });

      _defineProperty(_assertThisInitialized(_this), "turnOff", function () {
        proxy.events.offSongVote(_this.updubWatcher);
      });

      return _this;
    }

    _createClass(UpdubsInChat, [{
      key: "updubWatcher",
      value: function updubWatcher(e) {
        var user = proxy.userName();
        var currentDj = proxy.getCurrentDJ();

        if (!currentDj) {
          return;
        }

        if (user === currentDj && e.dubtype === "updub") {
          var newChat = chatMessage$1(e.user.username, proxy.getSongName());
          proxy.dom.chatList().appendChild(newChat);
        }
      }
    }, {
      key: "render",
      value: function render() {
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
  }(m);

  function chatMessage$2(username, song) {
    var li = document.createElement("li");
    li.className = "dubplus-chat-system dubplus-chat-system-grab";
    var div = document.createElement("div");
    div.className = "chatDelete";

    div.onclick = function (e) {
      return e.currentTarget.parentElement.remove();
    };

    var span = document.createElement("span");
    span.className = "icon-close";
    var text = document.createElement("div");
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
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, GrabsInChat);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(GrabsInChat)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_this), "turnOn", function () {
        proxy.events.onSongGrab(_this.grabChatWatcher);
      });

      _defineProperty(_assertThisInitialized(_this), "turnOff", function () {
        proxy.events.offSongGrab(_this.grabChatWatcher);
      });

      _defineProperty(_assertThisInitialized(_this), "grabChatWatcher", function (e) {
        if (proxy.displayUserGrab()) {
          // if the room has turned on its own "show grab in chat" setting
          // then we no longer need to listen to grabs
          proxy.events.offSongGrab(_this.grabChatWatcher); // a nd we turn switch off

          _this.switchRef.switchOff(true);

          return;
        }

        var user = proxy.userName();
        var currentDj = proxy.getCurrentDJ();

        if (!currentDj) {
          return;
        }

        if (user === currentDj) {
          var newChat = chatMessage$2(e.user.username, proxy.getSongName());
          proxy.dom.chatList().appendChild(newChat);
        }
      });

      return _this;
    }

    _createClass(GrabsInChat, [{
      key: "render",
      value: function render() {
        var _this2 = this;

        return h(MenuSwitch, {
          ref: function ref(s) {
            return _this2.switchRef = s;
          },
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
  }(m);

  /**
   * Takes time in milliseconds and converts it to a H:MM:SS format
   *  The hours is not left padded
   * 
   * @export
   * @param {String|Number} duration
   * @returns {String}
   */
  function convertMStoTime(duration) {
    if (!duration) {
      return ""; // just in case songLength is missing for some reason
    }

    var seconds = parseInt(duration / 1000 % 60, 10);
    var minutes = parseInt(duration / (1000 * 60) % 60, 10);
    var hours = parseInt(duration / (1000 * 60 * 60) % 24, 10);

    if (isNaN(seconds) || isNaN(minutes) || isNaN(hours)) {
      return "";
    }

    seconds = seconds < 10 ? "0" + seconds : seconds;

    if (hours) {
      minutes = minutes < 10 ? "0" + minutes : minutes;
      return hours + ":" + minutes + ":" + seconds;
    }

    return minutes + ":" + seconds;
  }

  var SongPreview = function SongPreview(_ref) {
    var song = _ref.song;

    if (!song) {
      return null;
    }

    return h("p", {
      class: "dubplus-song-preview"
    }, song.images && song.images.thumbnail ? h("span", {
      class: "dubplus-song-preview__image"
    }, h("img", {
      src: song.images.thumbnail
    })) : null, h("span", {
      class: "dubplus-song-preview__title"
    }, h("small", null, "Your next track:"), song.name), h("span", {
      class: "dubplus-song-preview__length"
    }, convertMStoTime(song.songLength)));
  };

  var PreviewNextSong =
  /*#__PURE__*/
  function (_Component) {
    _inherits(PreviewNextSong, _Component);

    function PreviewNextSong() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, PreviewNextSong);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(PreviewNextSong)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_this), "state", {
        isOn: false,
        nextSong: null
      });

      _defineProperty(_assertThisInitialized(_this), "findNextSong", function () {
        proxy.api.getRoomQueue().then(function (json) {
          var data = window._.get(json, "data", []);

          var next = data.filter(function (track) {
            return track.userid === _this.userid;
          });

          if (next.length > 0) {
            _this.getSongInfo(next[0].songid);

            return;
          }

          _this.setState({
            nextSong: null
          });
        }).catch(function (err) {
          _this.setState({
            nextSong: null
          });
        });
      });

      _defineProperty(_assertThisInitialized(_this), "getSongInfo", function (songId) {
        proxy.api.getSongData(songId).then(function (json) {
          var name = window._.get(json, "data.name");

          if (name) {
            _this.setState({
              nextSong: json.data
            });

            return;
          }

          _this.setState({
            nextSong: null
          });
        }).catch(function (err) {
          _this.setState({
            nextSong: null
          });
        });
      });

      _defineProperty(_assertThisInitialized(_this), "turnOn", function () {
        _this.setState({
          isOn: true
        });

        _this.findNextSong();

        proxy.events.onPlaylistUpdate(_this.findNextSong);
        proxy.events.onQueueUpdate(_this.findNextSong);
        document.body.classList.add("dplus-song-preview");
      });

      _defineProperty(_assertThisInitialized(_this), "turnOff", function () {
        _this.setState({
          isOn: false
        });

        proxy.events.offPlaylistUpdate(_this.findNextSong);
        proxy.events.offQueueUpdate(_this.findNextSong);
        document.body.classList.remove("dplus-song-preview");
      });

      return _this;
    }

    _createClass(PreviewNextSong, [{
      key: "componentWillMount",
      value: function componentWillMount() {
        // add an empty span on mount to give Portal something to render to
        var widget = proxy.dom.chatInputContainer();
        var span = document.createElement("span");
        span.id = "dp-song-prev-target";
        widget.parentNode.insertBefore(span, widget);
        this.renderTo = document.getElementById("dp-song-prev-target");
        this.userid = proxy.userId();
      }
      /**
       * Go through the room's playlist queue and look for the ID of the current
       * logged in User
       */

    }, {
      key: "render",
      value: function render(props, _ref2) {
        var isOn = _ref2.isOn,
            nextSong = _ref2.nextSong;
        return h(MenuSwitch, {
          id: "dubplus-preview-next-song",
          section: "General",
          menuTitle: "Preview Next Song",
          desc: "Show the next song you have queued up without having to look in your queue",
          turnOn: this.turnOn,
          turnOff: this.turnOff
        }, isOn ? h(Portal, {
          into: this.renderTo
        }, h(SongPreview, {
          song: nextSong
        })) : null);
      }
    }]);

    return PreviewNextSong;
  }(m);

  var GeneralSection = function GeneralSection() {
    return h(MenuSection, {
      id: "dubplus-general",
      title: "General",
      settingsKey: "general"
    }, h(Autovote, null), h(AFK, null), h(AutocompleteEmoji, null), h(Emotes, null), h(CustomMentions, null), h(ChatCleaner, null), h(ChatNotification, null), h(PMNotifications, null), h(DJNotification, null), h(ShowDubsOnHover, null), h(DowndubInChat, null), h(UpdubsInChat, null), h(GrabsInChat, null), h(PreviewNextSong, null), h(SnowSwitch, null), h(RainSwitch, null));
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
    document.body.classList.add('dubplus-hide-avatars');
  }

  function turnOff$2() {
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
      turnOn: turnOn$2,
      turnOff: turnOff$2
    });
  };

  function turnOn$3() {
    document.body.classList.add('dubplus-hide-bg');
  }

  function turnOff$3() {
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
      turnOn: turnOn$3,
      turnOff: turnOff$3
    });
  };

  function turnOn$4() {
    document.body.classList.add('dubplus-show-timestamp');
  }

  function turnOff$4() {
    document.body.classList.remove('dubplus-show-timestamp');
  }

  var ShowTS = function ShowTS() {
    return h(MenuSwitch, {
      id: "dubplus-show-timestamp",
      section: "User Interface",
      menuTitle: "Show Timestamps",
      desc: "Toggle always showing chat message timestamps.",
      turnOn: turnOn$4,
      turnOff: turnOff$4
    });
  };

  function turnOn$5() {
    document.body.classList.add('dubplus-hide-selfie');
  }

  function turnOff$5() {
    document.body.classList.remove('dubplus-hide-selfie');
  }
  /**
   * Hide Chat
   */


  var HideGifSelfie = function HideGifSelfie() {
    return h(MenuSwitch, {
      id: "dubplus-hide-selfie",
      section: "User Interface",
      menuTitle: "Hide Gif-Selfie",
      desc: "Toggles hiding the gif selfie icon",
      turnOn: turnOn$5,
      turnOff: turnOff$5
    });
  };

  function turnOn$6() {
    document.body.classList.add('dubplus-chat-only');
  }

  function turnOff$6() {
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
      turnOn: turnOn$6,
      turnOff: turnOff$6
    });
  };

  /*END.NOT_EXT*/

  var UISection = function UISection() {
    return h(MenuSection, {
      id: "dubplus-ui",
      title: "UI",
      settingsKey: "user-interface"
    }, h(FullscreenVideo, null), h(SplitChat, null), h(HideChat, null), h(HideVideo, null), h(HideAvatars, null), h(HideBackground, null), h(HideGifSelfie, null), h(ShowTS, null));
  };

  function handleKeyup(e) {
    if (e.code !== KEYS.space) {
      return;
    }

    var tag = e.target.tagName.toLowerCase();

    if (tag !== "input" && tag !== "textarea") {
      proxy.mutePlayer();
    }
  }

  function turnOn$7() {
    document.addEventListener("keyup", handleKeyup);
  }

  function turnOff$7() {
    document.removeEventListener("keyup", handleKeyup);
  }

  var SpacebarMute = function SpacebarMute() {
    return h(MenuSwitch, {
      id: "dubplus-spacebar-mute",
      section: "Settings",
      menuTitle: "Spacebar Mute",
      desc: "Turn on/off the ability to mute current song with the spacebar.",
      turnOn: turnOn$7,
      turnOff: turnOff$7
    });
  };

  function unloader(e) {
    var confirmationMessage = "";
    e.returnValue = confirmationMessage;
    return confirmationMessage;
  }

  function turnOn$8() {
    window.addEventListener("beforeunload", unloader);
  }

  function turnOff$8() {
    window.removeEventListener("beforeunload", unloader);
  }

  var WarnNav = function WarnNav() {
    return h(MenuSwitch, {
      id: "warn_redirect",
      section: "Settings",
      menuTitle: "Warn On Navigation",
      desc: "Warns you when accidentally clicking on a link that takes you out of dubtrack.",
      turnOn: turnOn$8,
      turnOff: turnOff$8
    });
  };

  function handleKeyup$1(e) {
    if (e.target.id === "playlist-input") {
      var list = proxy.dom.grabPlaylists();

      if (!list.length) {
        return;
      }

      var ul = list[0].parentElement;

      if (!ul.style.height) {
        ul.style.height = ul.offsetHeight + "px";
      }

      ul.scrollTop = 0;
      var lcVal = e.target.value.toLowerCase();
      list.forEach(function (li) {
        var liText = li.textContent.toLowerCase();
        var check = liText.indexOf(lcVal) >= 0;
        li.style.display = check ? "block" : "none";
      });
    }
  }

  function turnOn$9() {
    // the playlist is part of a DOM element that gets added and removed so we
    // can't bind directly to it, we need to use delegation.
    document.body.addEventListener("keyup", handleKeyup$1);
  }

  function turnOff$9() {
    document.body.removeEventListener("keyup", handleKeyup$1);
  }

  var filterAddToPlaylists = function filterAddToPlaylists() {
    return h(MenuSwitch, {
      id: "dubplus-playlist-filter",
      section: "Settings",
      menuTitle: "Filter playlists in grabs",
      desc: "Adds 'filter as you type' functionality to the 'create a new playlist' input inside the grab to playlist popup",
      turnOn: turnOn$9,
      turnOff: turnOff$9
    });
  };

  var SettingsSection = function SettingsSection() {
    return h(MenuSection, {
      id: "dubplus-settings",
      title: "Settings",
      settingsKey: "settings"
    }, h(SpacebarMute, null), h(WarnNav, null), h(filterAddToPlaylists, null));
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

    var link = makeLink(className, userSettings.srcRoot + cssFile + "?" + 1571875469089);
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

  function turnOn$a() {
    var roomAjax = proxy.api.roomInfo();
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

      cssHelper.loadExternal(communityCSSUrl, "dubplus-comm-theme");
    });
  }

  function turnOff$a() {
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
      turnOn: turnOn$a,
      turnOff: turnOff$a
    });
  };

  /**
   * Custom CSS
   */

  var CustomCSS =
  /*#__PURE__*/
  function (_Component) {
    _inherits(CustomCSS, _Component);

    function CustomCSS() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, CustomCSS);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(CustomCSS)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_this), "isOn", false);

      _defineProperty(_assertThisInitialized(_this), "state", {
        showModal: false
      });

      _defineProperty(_assertThisInitialized(_this), "turnOn", function (initialLoad) {
        // if a valid custom css file exists then we can load it
        if (userSettings.stored.custom.css) {
          _this.isOn = true;
          cssHelper.loadExternal(userSettings.stored.custom.css, "dubplus-custom-css");
          return;
        } // if you turn this option on but the stored value is empty then we should
        // bring up a modal ... BUT not initial load of the extension


        if (!initialLoad) {
          _this.setState({
            showModal: true
          });
        }
      });

      _defineProperty(_assertThisInitialized(_this), "turnOff", function () {
        _this.isOn = false;
        var link = document.querySelector(".dubplus-custom-css");

        if (link) {
          link.remove();
        }

        _this.closeModal();
      });

      _defineProperty(_assertThisInitialized(_this), "save", function () {
        var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
        userSettings.save("custom", "css", val); // disable the switch if the value is empty/null/undefined

        if (!val) {
          _this.turnOff();

          return;
        }

        if (_this.isOn) {
          cssHelper.loadExternal(userSettings.stored.custom.css, "dubplus-custom-css");
        }

        _this.closeModal();
      });

      _defineProperty(_assertThisInitialized(_this), "closeModal", function () {
        _this.setState({
          showModal: false
        });
      });

      return _this;
    }

    _createClass(CustomCSS, [{
      key: "render",
      value: function render() {
        return h(MenuSwitch, {
          id: "dubplus-custom-css",
          section: "Customize",
          menuTitle: "Custom CSS",
          desc: "Add your own custom CSS.",
          turnOn: this.turnOn,
          turnOff: this.turnOff
        }, h(MenuPencil, {
          showModal: this.state.showModal,
          title: "Custom CSS",
          section: "Customize",
          content: "Enter a url location for your custom css",
          value: userSettings.stored.custom.css || "",
          placeholder: "https://example.com/example.css",
          maxlength: "500",
          onConfirm: this.save,
          onCancel: this.closeModal
        }));
      }
    }]);

    return CustomCSS;
  }(m);

  /*
    Interaction model
    
    # Extension start up (first load)
    - check if user has turned this option on
    - if so, try loading custom bg
    - if for some reason the switch is on but saved data is empty, turn it off

    # On error
    - if image doesn't load
      - show alert with error message
      - turn off switch

    # Turn on from user click
    - if there's a saved setting
      - load BG image
    - if not
      - show modal to enter an image

    # Modal Save
    - if switch is on and val is not empty, try loading the bg image
    - if switch is on and val is empty, revert to the original bg image
    - close modal

    # Modal Cancel
    - close modal

  */

  /**
   * Custom Background
   */

  var CustomBG =
  /*#__PURE__*/
  function (_Component) {
    _inherits(CustomBG, _Component);

    function CustomBG() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, CustomBG);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(CustomBG)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_this), "state", {
        showModal: false
      });

      _defineProperty(_assertThisInitialized(_this), "bgImg", proxy.dom.bgImg());

      _defineProperty(_assertThisInitialized(_this), "handleError", function () {
        _this.switchRef.switchOff();

        _this.revertBG();

        alert("error loading image \"".concat(userSettings.stored.custom.bg, "\", edit the url and try again"));
      });

      _defineProperty(_assertThisInitialized(_this), "addCustomBG", function (val) {
        _this.bgImg.src = val;
      });

      _defineProperty(_assertThisInitialized(_this), "revertBG", function () {
        _this.bgImg.src = _this.dubBgImg;
      });

      _defineProperty(_assertThisInitialized(_this), "turnOn", function (initialLoad) {
        if (userSettings.stored.custom.bg) {
          _this.addCustomBG(userSettings.stored.custom.bg);

          return;
        } else {
          _this.switchRef.switchOff();
        } // if there is no saved setting
        // and User clicked to turn it on


        if (!initialLoad) {
          _this.setState({
            showModal: true
          });
        }
      });

      _defineProperty(_assertThisInitialized(_this), "turnOff", function () {
        _this.revertBG();

        _this.setState({
          showModal: false
        });
      });

      _defineProperty(_assertThisInitialized(_this), "save", function (val) {
        var newVal = val.trim();
        var success = userSettings.save("custom", "bg", newVal);

        if (!success) {
          return false;
        }

        if (_this.switchRef.state.on) {
          if (userSettings.stored.custom.bg) {
            _this.addCustomBG(newVal);
          } else {
            _this.turnOff();

            return true;
          }
        }

        _this.setState({
          showModal: false
        });

        return true;
      });

      _defineProperty(_assertThisInitialized(_this), "onCancel", function () {
        _this.setState({
          showModal: false
        });
      });

      return _this;
    }

    _createClass(CustomBG, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this.dubBgImg = this.bgImg.src;
        this.bgImg.onerror = this.handleError;
      }
    }, {
      key: "render",
      value: function render(props, state) {
        var _this2 = this;

        return h(MenuSwitch, {
          ref: function ref(e) {
            return _this2.switchRef = e;
          },
          id: "dubplus-custom-bg",
          section: "Customize",
          menuTitle: "Custom Background Image",
          desc: "Add your own custom Background.",
          turnOn: this.turnOn,
          turnOff: this.turnOff
        }, h(MenuPencil, {
          showModal: state.showModal,
          title: "Custom Background Image",
          section: "Customize",
          content: "Enter the full URL of an image. We recommend using a .jpg file. Leave blank to remove the current background image",
          value: userSettings.stored.custom.bg || "",
          placeholder: "https://example.com/big-image.jpg",
          maxlength: "500",
          errorMsg: "An error occured trying to save your image url, please check it and try again",
          onCancel: this.onCancel,
          onConfirm: this.save
        }));
      }
    }]);

    return CustomBG;
  }(m);

  /*
    Interaction model
    
    # Extension start up (first load)
    - check if there is an audio url in saved options
    - if so -> check if a playable url -> set as chat sound
    - if can't play, turn off option

    # Turn on from user click
    - if no saved setting, show modal
    - else turn on (see above for turn on process)

    # Modal Save
    - if switch is on
      - check if new url is playable, set it as chat sound
    - else
      - show error message in modal. User will either have to fix
        it or his cancel to get out of the modal

    # Modal Cancel
    - close modal
    - if setting is empty, or cant play sound, turn off switch

  */

  var modalMessage = "Enter the full URL of a sound file. We recommend using an .mp3 file. Leave blank to go back to Dubtrack's default sound";
  var processError = "Error saving new url, check url and try again";
  /**
   * Custom Notification Sound
   */

  var CustomSound =
  /*#__PURE__*/
  function (_Component) {
    _inherits(CustomSound, _Component);

    function CustomSound() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, CustomSound);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(CustomSound)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_this), "state", {
        showModal: false,
        errorMsg: processError
      });

      _defineProperty(_assertThisInitialized(_this), "badUrlError", "You've entered an invalid sound url! Please make sure you are entering the full, direct url to the file. IE: https://example.com/sweet-sound.mp3");

      _defineProperty(_assertThisInitialized(_this), "DubtrackDefaultSound", proxy.getChatSoundUrl());

      _defineProperty(_assertThisInitialized(_this), "turnOn", function (initialLoad) {
        var notificationSound = userSettings.stored.custom.notificationSound;

        if (notificationSound && soundManager.canPlayURL(notificationSound)) {
          proxy.setChatSoundUrl(notificationSound);
          return;
        } else if (initialLoad) {
          _this.switchRef.switchOff();
        }

        if (!initialLoad) {
          _this.setState({
            showModal: true,
            errorMsg: _this.badUrlError
          });
        }
      });

      _defineProperty(_assertThisInitialized(_this), "turnOff", function () {
        proxy.setChatSoundUrl(_this.DubtrackDefaultSound);

        _this.setState({
          showModal: false
        });
      });

      _defineProperty(_assertThisInitialized(_this), "save", function (val) {
        var newVal = val.trim();
        var success = userSettings.save("custom", "notificationSound", newVal);

        if (!success) {
          _this.setState({
            errorMsg: processError
          });

          return false;
        }

        if (_this.switchRef.state.on) {
          // Check if valid sound url
          if (soundManager.canPlayURL(newVal)) {
            proxy.setChatSoundUrl(newVal);

            _this.setState({
              showModal: false
            });

            return true;
          } else {
            _this.setState({
              errorMsg: _this.badUrlError
            });

            return false;
          }
        }

        _this.setState({
          showModal: false
        });

        return true;
      });

      _defineProperty(_assertThisInitialized(_this), "onCancel", function () {
        _this.setState({
          showModal: false
        });

        var notificationSound = userSettings.stored.custom.notificationSound;

        if (!notificationSound || !soundManager.canPlayURL(notificationSound)) {
          _this.switchRef.switchOff();
        }
      });

      return _this;
    }

    _createClass(CustomSound, [{
      key: "render",
      value: function render(props, state) {
        var _this2 = this;

        return h(MenuSwitch, {
          ref: function ref(e) {
            return _this2.switchRef = e;
          },
          id: "dubplus-custom-notification-sound",
          section: "Customize",
          menuTitle: "Custom Notification Sound",
          desc: "Change the notification sound to a custom one.",
          turnOn: this.turnOn,
          turnOff: this.turnOff
        }, h(MenuPencil, {
          showModal: state.showModal,
          title: "Custom Notification Sound",
          section: "Customize",
          content: modalMessage,
          value: userSettings.stored.custom.notificationSound || "",
          placeholder: "https://example.com/sweet-sound.mp3",
          maxlength: "500",
          onConfirm: this.save,
          onCancel: this.onCancel,
          errorMsg: this.state.errorMsg
        }));
      }
    }]);

    return CustomSound;
  }(m);

  var CustomizeSection = function CustomizeSection() {
    return h(MenuSection, {
      id: "dubplus-customize",
      title: "Customize",
      settingsKey: "customize"
    }, h(CommunityTheme, null), h(CustomCSS, null), h(CustomBG, null), h(CustomSound, null));
  };

  /**
   * DubPlus Menu Container
   */

  function ExtraButtons() {
    return h("span", null, h(ETA, null), h(Snooze, null));
  }

  function addButtons() {
    // icon-twitter  icon-facebook
    var shareWait = new WaitFor([".player_sharing", ".icon-twitter", ".icon-facebook"], {
      seconds: 120,
      isNode: true
    });
    shareWait.then(function () {
      var holder = document.createElement('span');
      holder.id = "dubplus-button-holder";
      document.querySelector(".player_sharing").appendChild(holder);
      I(h(ExtraButtons, null), holder);
    });
  }

  var DubPlusMenu = function DubPlusMenu() {
    setTimeout(function () {
      // load this async so it doesn't block the rest of the menu render
      // since these buttons are completely independent from the menu
      addButtons();
      SetupPicker();
    }, 10);
    return h("section", {
      className: "dubplus-menu"
    }, h("p", {
      className: "dubplus-menu-header"
    }, "Dub+ Options"), h(GeneralSection, null), h(UISection, null), h(SettingsSection, null), h(CustomizeSection, null), h(MenuSection, {
      id: "dubplus-contacts",
      title: "Contacts",
      settingsKey: "contact"
    }, h(MenuSimple, {
      icon: "bug",
      menuTitle: "Report bugs on Discord",
      href: "https://discord.gg/XUkG3Qy"
    }), h(MenuSimple, {
      icon: "reddit-alien",
      menuTitle: "Reddit",
      href: "https://www.reddit.com/r/DubPlus/"
    }), h(MenuSimple, {
      icon: "facebook",
      menuTitle: "Facebook",
      href: "https://facebook.com/DubPlusScript"
    }), h(MenuSimple, {
      icon: "twitter",
      menuTitle: "Twitter",
      href: "https://twitter.com/DubPlusScript"
    })));
  };

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

      _defineProperty(_assertThisInitialized(_this), "state", {
        mainStyles: waitingStyles
      });

      _defineProperty(_assertThisInitialized(_this), "dismiss", function () {
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
      value: function render(props, state) {
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
  }(m);

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

      _defineProperty(_assertThisInitialized(_this), "state", {
        open: false
      });

      _defineProperty(_assertThisInitialized(_this), "toggle", function () {
        var menu = document.querySelector('.dubplus-menu');

        if (!menu) {
          console.warn("menu not built yet, try again");
          return;
        }

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
      value: function render(props, state) {
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
  }(m);

  polyfills();
  // do it here. This is for people who load the script via bookmarklet or userscript

  var isExtension = document.getElementById("dubplus-script-ext");

  if (!isExtension) {
    setTimeout(function () {
      // start the loading of the CSS asynchronously
      cssHelper.loadExternal("https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");
      cssHelper.load("/css/dubplus.css");
    }, 10);
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

      _defineProperty(_assertThisInitialized(_this), "state", {
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
          proxy.loadCheck().then(function () {
            _this2.setState({
              loading: false,
              error: false
            });
          }).catch(function () {
            if (!proxy.sessionId()) {
              _this2.showError("You're not logged in. Please login to use Dub+.");
            } else {
              _this2.showError("Something happed, refresh and try again");

              track.event("Dub+ lib", "load", "failed");
            }
          });
          return;
        }

        if (!proxy.sessionId()) {
          this.showError("You're not logged in. Please login to use Dub+.");
        } else {
          this.showError("Dub+ is already loaded");
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
      value: function render(props, state) {
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

        document.querySelector("html").classList.add("dubplus");
        return h(DubPlusMenu, null);
      }
    }]);

    return DubPlusContainer;
  }(m);

  I(h(DubPlusContainer, null), document.body);
  var navWait = new WaitFor([".header-right-navigation .user-messages", ".header-right-navigation .user-info"], {
    seconds: 120,
    isNode: true
  });
  navWait.then(function () {
    var holder = document.createElement('span');
    holder.id = "dubplus-icon-holder";
    document.querySelector(".header-right-navigation").appendChild(holder);
    I(h(MenuIcon, null), holder);
  }); // PKGINFO is inserted by the rollup build process

  var index = {
    "version": "2.0.0",
    "description": "Dub+ - A simple script/extension for Dubtrack.fm",
    "license": "MIT",
    "bugs": "https://github.com/DubPlus/DubPlus/issues"
  };

  return index;

}());
