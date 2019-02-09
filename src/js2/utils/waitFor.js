/**
 * Takes a string  representation of a variable or object and checks if it's
 * definied starting at provided scope or default to global window scope.
 * @param  {string} dottedString  the item you are looking for
 * @param  {var}    startingScope where to start looking
 * @return {boolean}              if it is defined or not
 */
function deepCheck(dottedString, startingScope) {
  var _vars = dottedString.split('.');
  var len = _vars.length;
  
  var depth = startingScope || window;
  for (let i = 0; i < len; i++) {
    if (typeof depth[_vars[i]] === 'undefined') {
      return false;
    }
    depth = depth[_vars[i]];
  }
  return true;
}

function arrayDeepCheck(arr, startingScope){
  var len = arr.length;
  var scope = startingScope || window;
  
  for (let i = 0; i < len; i++) {
    if ( !deepCheck(arr[i], scope) ) {
      console.log(arr[i], 'is not found yet');
      return false;
    }
  }
  return true;
}

/**
 * pings for the existence of var/function for # seconds until it's defined
 * runs callback once found and stops pinging
 * @param {string|array} waitingFor          what you are waiting for
 * @param {object}       options             optional options to pass
 *                       options.interval    how often to ping
 *                       options.seconds     how long to ping for
 *                       options.isNode      switches to checking if node exists
 *                       
 * @return {object}                    2 functions:
 *                  .then(fn)          will run fn only when item successfully found.  This also starts the ping process
 *                  .fail(fn)          will run fn only when is never found in the time given
 */
function WaitFor(waitingFor, options) {
  if ( typeof waitingFor !== "string" && !Array.isArray(waitingFor) ) {
    console.warn('WaitFor: invalid first argument');
    return;
  }

  var defaults = {
    interval : 500, // every XX ms we check to see if waitingFor is defined
    seconds : 15,  // how many total seconds we wish to continue pinging
    isNode: false
  };

  var opts = Object.assign({}, defaults, options);
  var checkFunc = Array.isArray(waitingFor) ? arrayDeepCheck : deepCheck;
  
  if (opts.isNode) {
    checkFunc = function(selector){
      return typeof document.querySelector(selector) !== null
    }
  }

  var tryCount = 0;
  var tryLimit = (opts.seconds * 1000) / opts.interval; // how many intervals

  return new Promise(function(resolve, reject){
    var check = () => {
      tryCount++;
      var _test = checkFunc(waitingFor);
  
      if (_test) {
        resolve();
        return;
      } 
      
      if (tryCount < tryLimit) {
        window.setTimeout(check, opts.interval);
        return;
      } 

      // passed our limit, stop checking
      reject();
    };

    window.setTimeout(check, opts.interval);
  });
}

export default WaitFor;
