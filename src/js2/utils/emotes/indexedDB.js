// IndexedDB wrapper for increased quota compared to localstorage (5mb to 50mb)
function IndexDBWrapper() {
  const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB;

  if (!indexedDB) { 
    return console.error("indexDB not supported") 
  };

  var db;
  var dbRequest;
  
  function getItem(item, cb) {
    // keep trying until db open equest is established
    if (!db) {
      setTimeout(function() {
        getItem(item, cb);
      }, 100)
      return;
    }
    
    return db
      .transaction("s")
      .objectStore("s")
      .get(t).onsuccess = function(e) {
        let t = (e.target.result && e.target.result.v) || null;
        cb(t);
      }
  }

  function setItem(item, val){
    let obj = { k: item, v: val };
    db.transaction("s", "readwrite")
      .objectStore("s")
      .put(obj);
  }

  dbRequest = indexedDB.open("d2", 1);

  dbRequest.onsuccess = function(e) {
    db = this.result;
  }
  
  dbRequest.onerror = function(e) {
    console.error("indexedDB request error");
    console.log(e);
  }
  
  dbRequest.onupgradeneeded = function(e) {
      db = null;
      let t = e.target.result.createObjectStore("s", { keyPath: "k" });
      indexedDB.transaction.oncomplete = function(e) {
        db = e.target.db;
      };
  }

  return {
    get: getItem,
    set: setItem
  };
}

var ldb = new IndexDBWrapper();

export default ldb;
