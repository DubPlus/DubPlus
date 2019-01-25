/**
 * Wrapper around XMLHttpRequest with added ability to trigger a custom event 
 * when the ajax request is complete. The event will be attached to the window 
 * object. It returns a promise.
 * 
 * @param {String} url 
 * @param {Object} headers object of xhr headers to add to the request
 * @returns {Promise}
 */
function getJSON(url, headers={}) {
  return new Promise(function(resolve, reject){
    let xhr = new XMLHttpRequest();

    for (let property in headers) {
      if (headers.hasOwnProperty(property)) {
        xhr.setRequestHeader(property, headers[property]);
      }
    }
    
    xhr.onload = function() {
      try {
        let resp = JSON.parse(xhr.responseText);
        resolve(resp);
      } catch(e) {
        reject(e);
      }
    };

    xhr.onerror = function() {
      reject();
    }
    
    xhr.open('GET', url);
  
    xhr.send();
  });

}

export default getJSON;