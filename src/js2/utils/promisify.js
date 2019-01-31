/**
 * Apparently native ES6 promises are really slow: https://softwareengineering.stackexchange.com/a/279003
 * so implementing my own super basic version of it that does not need the "new" operator
 * which causes a lot of the slowdown
 *
 * @param {function} asyncFunction the function to promisify. This function must accept a callback as the last argument
 * @returns {function} a wrapped function which will work like a promise. The function will return an object containing
 * a `.then` and a `.catch` function
 */
export default function promisify(asyncFunction) {
  // returns a function that can take any number of arguments
  return function() {
    // convert arguments into an array
    var args = Array.prototype.slice.call(arguments);
    // setup a default success function
    var success = function() {};
    // setup a default fail function
    var fail = function(err) { console.error(err.message); };

    // check if user has supplied a fail/catch call back function
    function catchError(failFunc) {
      if (typeof failFunc === "function") {
        fail = failFunc;
      }
    }

    function then(successFunc) {
      if (typeof successFunc === "function") {
        success = function() {
          try {
            successFunc.apply(successFunc, arguments);
          } catch (e) {
            fail(e);
          }
        };
      } else {
        throw new Error('promisify: no resolve function provided');
      }

      // the success function should be the last argument of the async function
      // where old callback functions typically go
      args.push(success);

      // also need to try/catch here because the initial function might fail as well
      // caveat here is that the ".catch" function needs to be declared before 
      // the .then function for your custom catch function to work
      try {
        asyncFunction.apply(asyncFunction, args);
      } catch (e) {
        fail(e);
      }
    }

    return {
      then: then,
      catch: catchError
    };
  };

}
