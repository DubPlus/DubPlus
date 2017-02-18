module.exports = {
  /**
   * converts a string from camelCase to snake_case
   * @param  {String} str the camelCase string
   * @return {String}     the converted snake_case string
   */
  camelToSnake : function (str){
    return str.replace(/([A-Z])/g, function (x,y){
      return "_" + y.toLowerCase();
    }).replace(/^_/, "");
  },

  /**
   * converts a string from snake_case to camelCase
   * @param  {String} str the snake_case string
   * @return {String}     the converted camelCase string
   */
  snakeToCamel : function (str) {
    return str.replace(/(_[a-z])/ig, function (x,y){
      return y.replace("_","").toUpperCase();
    });
  }
};