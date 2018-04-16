/* global  emojify */
import ldb from './indexedDB.js';

export var emoji = {
  template: function(id) {
    return emojify.defaultConfig.img_dir + "/" + encodeURI(id) + ".png";
  }
}

export function shouldUpdateAPIs(apiName) {
  var day = 86400000; // milliseconds in a day

  return new Promise(function(resolve, reject){
    // if api return an object with an error then we should try again
    ldb.get(apiName + "_api", function(savedItem) {
      if (savedItem) {
        var parsed = JSON.parse(savedItem);
        if (typeof parsed.error !== "undefined") {
          resolve(true);
        } else {
          reject('error parsing savedItem')
        }
      }

      var today = Date.now();
      var lastSaved = parseInt(localStorage.getItem(apiName + "_api_timestamp"));
      // Is the lastsaved not a number for some strange reason, then we should update
      // are we past 5 days from last update? then we should update
      // does the data not exist in localStorage, then we should update
      resolve(isNaN(lastSaved) || today - lastSaved > day * 5 || !savedItem);
    });
  })
}



