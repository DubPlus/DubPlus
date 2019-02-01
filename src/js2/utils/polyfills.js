import getScript from "./getScript.js";

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

  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }
}
