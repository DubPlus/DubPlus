/**
 * pings for the existence of var/function for 5 seconds until found
 * runs callback once found and stop pinging
 * @param  {variable}   waitingFor Your global function, variable, etc
 * @param  {Function} cb         Callback function
 */
module.exports = function(waitingFor, cb) {
    var interval = 100; // ms
    var currInterval = 0;
    var limit = 50; // how many intervals

    var check = function () {
        if (waitingFor && typeof cb === "function") {
            console.log("available", waitingFor);
            cb();
        } else if (currInterval < limit) {
            currInterval++;
            console.log('waiting for', waitingFor);
            window.setTimeout(check, interval);
        }
    };

    window.setTimeout(check, interval);
};
