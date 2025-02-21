/**
 * a wrapper around IndexedDB or increased quota compared to localstorage (5mb to 50mb).
 * This will add "ldb" to the window object (window.ldb).
 */

!(function () {
  function e(t, o) {
    return n
      ? void (n.transaction("s").objectStore("s").get(t).onsuccess = function (
          e
        ) {
          var t = (e.target.result && e.target.result.v) || null;
          o(t);
        })
      : void setTimeout(function () {
          e(t, o);
        }, 100);
  }
  var t =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB;
  if (!t) return void console.error("indexDB not supported");
  var n,
    o = { k: "", v: "" },
    r = t.open("d2", 1);
  (r.onsuccess = function (e) {
    n = this.result;
  }),
    (r.onerror = function (e) {
      console.error("indexedDB request error"), console.log(e);
    }),
    (r.onupgradeneeded = function (e) {
      n = null;
      var t = e.target.result.createObjectStore("s", { keyPath: "k" });
      t.transaction.oncomplete = function (e) {
        n = e.target.db;
      };
    }),
    (window.ldb = {
      get: e,
      set: function (e, t) {
        (o.k = e),
          (o.v = t),
          n.transaction("s", "readwrite").objectStore("s").put(o);
      },
    });
})();
