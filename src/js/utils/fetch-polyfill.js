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
class ResponsePolyfill {
  constructor(data) {
    this.data = data;
  }

  json() {
    return new Promise((resolve, reject) => {
      try {
        let resp = JSON.parse(this.data);
        resolve(resp);
      } catch (e) {
        reject(e);
      }
    });
  }
}

/**
 * @param {String} url
 * @returns {Promise}
 */
function fetchPolyfill(url) {
  return new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest();

    xhr.onload = function() {
      resolve(new ResponsePolyfill(xhr.responseText));
    };

    xhr.onerror = function() {
      reject();
    };

    xhr.open("GET", url);

    xhr.setRequestHeader('Accept', 'application/json');

    xhr.send();
  });
}

export default fetchPolyfill;
