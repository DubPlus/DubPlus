// IndexedDB wrapper for increased quota compared to localstorage (5mb to 50mb)
function IndexDBWrapper() {
  const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB;

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
      setTimeout(function() {
        getItem(item, cb);
      }, 100);
      timeout--;
      return;
    }

    timeout = 30; // reset the dbrequest timeout counter

    try {
      var transaction = db.transaction("s");
      transaction.onerror = function(event) {
        cb(null, event)
      };
      var dbItemStore = transaction.objectStore("s");
      dbItemStore.onerror = function(event) {
        cb(null, event)
      };
      var dbItemStoreGet = dbItemStore.get(item);
      dbItemStoreGet.onsuccess = function(e) {
        let t = (e.target.result && e.target.result.v) || null;
        cb(t);
      };
      dbItemStoreGet.onerror = function(event) {
        cb(null, event)
      };
    } catch (e) {
      cb(null, e.message);
    }
  }

  /**
   * Store a value in indexedDB
   * @param {string} item key name for the value that will be stored
   * @param {string} val value to be stored
   */
  function setItem(item, val) {
    // keep trying until db open request is established
    if (!db && timeout >= 0) {
      setTimeout(function() {
        setItem(item, val);
      }, 100);
      timeout--;
      return;
    }

    timeout = 30; // reset the dbrequest timeout counter
    let obj = { k: item, v: val };
    db.transaction("s", "readwrite")
      .objectStore("s")
      .put(obj);
  }

  var dbRequest = indexedDB.open("d2", 1);

  dbRequest.onsuccess = function(e) {
    db = this.result;
  };

  dbRequest.onerror = function(e) {
    console.error("indexedDB request error", e);
  };

  dbRequest.onupgradeneeded = function(e) {
    db = this.result;
    let t = db.createObjectStore("s", { keyPath: "k" });
    db.transaction.oncomplete = function(e) {
      db = e.target.db;
    };
  };

  return {
    get: getItem,
    set: setItem
  };
}

var ldb = new IndexDBWrapper();

export default ldb;
