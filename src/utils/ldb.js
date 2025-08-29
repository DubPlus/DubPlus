/**
 * A wrapper around IndexedDB.
 * IndexedDB has a higher storage limit (50mb) compared to localstorage (5mb).
 */

const OBJECT_STORE_NAME = 's';

export class LDB {
  constructor() {
    /**
     * @type {IDBDatabase|null}
     */
    this.db = null;

    const dbReq = window.indexedDB.open('d2', 1);

    const outerThis = this;

    dbReq.onsuccess = function () {
      outerThis.db = this.result;
    };

    dbReq.onerror = function (e) {
      console.error('Dub+', 'indexedDB request error:', e);
    };

    dbReq.onupgradeneeded = function () {
      outerThis.db = null;
      var t = this.result.createObjectStore(OBJECT_STORE_NAME, {
        keyPath: 'k',
      });
      t.transaction.oncomplete = function () {
        outerThis.db = this.db;
      };
    };
  }

  /**
   *
   * @param {string} key
   * @returns {Promise<string|null>}
   */
  get(key) {
    return new Promise((resolve) => {
      if (this.db) {
        this.db
          .transaction(OBJECT_STORE_NAME)
          .objectStore(OBJECT_STORE_NAME)
          .get(key).onsuccess = function () {
          resolve(this.result?.v || null);
        };
      } else {
        setTimeout(() => {
          this.get(key).then(resolve);
        }, 100);
      }
    });
  }

  /**
   *
   * @param {string} key
   * @param {string} value
   */
  set(key, value) {
    this.db
      .transaction(OBJECT_STORE_NAME, 'readwrite')
      .objectStore(OBJECT_STORE_NAME)
      .put({ k: key, v: value });
  }
}
