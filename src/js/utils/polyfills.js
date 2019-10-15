import getScript from "@/utils/getScript.js";
import fetchPolyfill from "@/utils/fetch-polyfill";

export default function() {
  // Element.remove() polyfill
  // from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
  (function(arr) {
    arr.forEach(function(item) {
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
    getScript(
      "https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js"
    );
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
