// jQuery's getJSON kept returning errors so making my own with promise-like
// structure and added optional Event to fire when done so can hook in elsewhere
var GetJSON = (function (url, optionalEvent, headers) {
  var doneEvent = optionalEvent ? new Event(optionalEvent) : null;

  function GetJ(_url, _cb){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', _url);
    if(headers) {
      for (var property in headers) {
        if (headers.hasOwnProperty(property)) {
          xhr.setRequestHeader(property, headers[property]);
        }
      }
    }
    xhr.send();
    xhr.onload = function() {
      var resp = xhr.responseText;
      if (typeof _cb === 'function') { _cb(resp); }
      if (doneEvent) { window.dispatchEvent(doneEvent); }
    };
  }
  
  var done = function(cb){
    new GetJ(url, cb);
  };
  return { done: done };
});

export default GetJSON;