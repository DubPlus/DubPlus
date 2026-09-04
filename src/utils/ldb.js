/**
 * A wrapper around IndexedDB.
 * IndexedDB has a higher storage limit (50mb) compared to localstorage (5mb).
 */

import { logError } from './logger';

const OBJECT_STORE_NAME = 's';

// ~5s worth of 100ms retries before giving up waiting for the DB to open.
const MAX_GET_ATTEMPTS = 50;

export class LDB {
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

    const dbReq = window.indexedDB.open('d2', 1);

    const outerThis = this;

    dbReq.onsuccess = function () {
      outerThis.db = this.result;
    };

    dbReq.onerror = function (e) {
      outerThis.failed = true;
      logError('indexedDB request error:', e);
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
   * @param {number} [attempt] internal retry counter
   * @returns {Promise<string|null>}
   */
  get(key, attempt = 0) {
    return new Promise((resolve) => {
      if (this.db) {
        this.db
          .transaction(OBJECT_STORE_NAME)
          .objectStore(OBJECT_STORE_NAME)
          .get(key).onsuccess = function () {
          resolve(this.result?.v || null);
        };
      } else if (this.failed || attempt >= MAX_GET_ATTEMPTS) {
        // DB errored out, or never became ready within the time budget.
        logError('indexedDB not ready. Could not get:', key);
        resolve(null);
      } else {
        setTimeout(() => {
          this.get(key, attempt + 1).then(resolve);
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
    if (!this.db) {
      logError('indexedDB not ready yet. Could not set:', key);
      return;
    }
    this.db
      .transaction(OBJECT_STORE_NAME, 'readwrite')
      .objectStore(OBJECT_STORE_NAME)
      .put({ k: key, v: value });
  }
}
