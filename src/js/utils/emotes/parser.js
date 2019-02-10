/**
 * Simple string parser based on Douglas Crockford's JSON.parse
 * https://github.com/douglascrockford/JSON-js/blob/master/json_parse.js
 * which itself is a simplified recursive descent parser
 * 
 * This parser is specifically written to find colon wrapped :emotes:
 * in a string and extract them into an array
 */

/**
 * @param {String} str the string to parse
 * @returns {Array} an array of matches or an empty array
 */
function parser(str){
  let result = [];

  let group = "";
  let openTagFound = false;
  let at = 0;

  function reset() {
    group = "";
    openTagFound = false;
  }

  function capture(ch) {
    group += ch;
  }

  function save() {
    if (group !== "::") {
      result.push(group);
    }
  }

  while (at < str.length) {
    let curr = str.charAt(at); 

    if (!openTagFound && curr === ":") {
      openTagFound = true;
      capture(curr);
      at++;
      continue;
    }

    if (openTagFound) {
      if (curr === ":") {
        capture(curr);
        save();
        reset();
        at++;
        continue;
      }

      if (curr === " ") {
        reset();
        at++;
        continue;
      }

      capture(curr);
    }

    at++;
  }

  return result;
}

export default parser;