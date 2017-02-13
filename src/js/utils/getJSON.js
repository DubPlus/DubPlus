// jQuery's getJSON kept returning errors so making my own with promise-like
// structure and added optional Event to fire when done so can hook in elsewhere
var getJSON = (function (url, optionalEvent) {
    var doneEvent;
    function GetJ(_url, _cb){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', _url);
        xhr.send();
        xhr.onload = function() {
            var resp = xhr.responseText;
            if (typeof _cb === 'function') { _cb(resp); }
            if (optionalEvent) { document.body.dispatchEvent(doneEvent); }
        };
    }
    if (optionalEvent){ doneEvent = new Event(optionalEvent); }
    var done = function(cb){
        new GetJ(url, cb);
    };
    return { done: done };
});

module.exports = getJSON;