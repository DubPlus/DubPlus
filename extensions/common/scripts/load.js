var makeLink = function(className, FileName) {
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.className = className || "";
  link.href = FileName;
  return link;
};
function loadExternal(cssFile, className) {
  if (!cssFile) {
    return;
  }
  var link = makeLink(className, cssFile);
  document.head.appendChild(link);
}

// load Dub+ css

loadExternal(
  "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
);
loadExternal(chrome.runtime.getURL("css/dubplus.css"));

// load Dub+ javascript
let script = document.createElement("script");
script.src = chrome.runtime.getURL("scripts/dubplus.js");

script.onerror = function(err) {
  console.log(err);
};

script.onload = function() {
  this.remove();
};

document.body.appendChild(script);
