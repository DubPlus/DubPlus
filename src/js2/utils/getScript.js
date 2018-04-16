/**
 * Pure JS version of jQuery's $.getScript
 * 
 * @param {string} source url or path to JS file
 * @param {function} callback function to run after script is loaded
 */
export default function getScript(source, callback) {
  var script = document.createElement('script');
  var prior = document.getElementsByTagName('script')[0];
  script.async = 1;

  script.onload = script.onreadystatechange = function( _, isAbort ) {
      if(isAbort || !script.readyState || /loaded|complete/.test(script.readyState) ) {
          script.onload = script.onreadystatechange = null;
          script = undefined;

          if(!isAbort) { if(callback) callback(); }
      }
  };

  script.src = source;
  prior.parentNode.insertBefore(script, prior);
}