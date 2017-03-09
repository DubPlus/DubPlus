var request = require('request');

/***************************************************************************
 * IMPORTANT
 *
 * you must first get the CODE following the steps here:
 * https://developer.chrome.com/webstore/using_webstore_api
 * 
 * CODE is a ONE TIME USE item so you must always pass it via env variable
 *
 * CLIENT_ID and CLIENT_SECRET can both be passed via env vars or inside
 * private.json file in the root of the repo
 */


var CLIENT_ID,
    CLIENT_SECRET,
    CODE = process.env.CODE;

try {
  var private = require('../private.json');
  CLIENT_ID = process.env.CLIENT_ID || private.CLIENT_ID;
  CLIENT_SECRET = process.env.CLIENT_SECRET || private.CLIENT_SECRET;
} catch(ex) {
  console.log("missing environment variables or private.json file");
  console.error(ex);
  process.exit(1);
}

/**
 * get google auth token using code provided by info above
 * @param  {string}   _code optional way to pass code directly as argument
 * @param  {Function} cb    success callback function
 * @return {undefined}
 */
function getAccessTokenFromCode() {
  var options = {
    url: 'https://accounts.google.com/o/oauth2/token',
    formData: {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: CODE,
      grant_type: 'authorization_code',
      redirect_uri: 'urn:ietf:wg:oauth:2.0:oob'
    }
  };

  return new Promise(function (resolve, reject){
    request.post(options, 
      function(err,httpResponse){
        if (err) {reject(err);}
        else {resolve(httpResponse);}
      }
    );
  });
}

// for this function I'm going to make all required secrets passed via arguments
function getTokenFromRefresh(clientID, clientSecret, refreshToken) {
  var options = {
    url: 'https://accounts.google.com/o/oauth2/token',
    formData: {
      client_id: clientID,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    }
  };

  // promisifying request module
  return new Promise(function (resolve, reject){
    request.post(options, 
      function(err,resp){
        if (err) {reject(err);}
        else {resolve(resp);}
      }
    );
  });
}

// if we call this module from the command line then we're trying to get a new refresh token
// make sure you get a new CODE and pass it through env var
if (require.main === module) {
  console.log('called from command line');
  getAccessTokenFromCode()
    .then(function(body){
      console.log(body);
    })
    .catch(function(err){
      console.error(err);
    });
}

// if we're requiring this module then we're trying to get a new access token using 
// the refresh token
module.exports = getTokenFromRefresh;
