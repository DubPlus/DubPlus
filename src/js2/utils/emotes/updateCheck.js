/* global  emojify */
import ldb from '../indexedDB.js';

export function shouldUpdateAPIs(apiName) {
  var day = 1000 * 60 * 60 * 24; // milliseconds in a day

  return new Promise(function(resolve, reject){
    // if api returned an object with an error and we stored it 
    // then we should try again
    ldb.get(apiName + "_api", function(savedItem) {
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
      }
      // at this point we have good data without issues in IndexedDB
      // so now we check how old it is to see if we should update it (7 days is the limit)
      var today = Date.now();
      var lastSaved = parseInt(localStorage.getItem(apiName + "_api_timestamp"));
      // Is the lastsaved not a number for some strange reason, then we should update 
      // OR
      // are we past 5 days from last update? then we should update
      resolve(isNaN(lastSaved) || today - lastSaved > day * 7);
    });
  })
}
