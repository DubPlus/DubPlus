var request = require('request');
var googleToken = require('./google-token.js');
var fs = require('fs');

/*******************************************************************
 * setup vars from env or json file
 */
var CHROME_EXT_ITEM_ID,
    CLIENT_ID,
    CLIENT_SECRET,
    REFRESH_TOKEN;

try {
  var private = require('../private.json');
  CHROME_EXT_ITEM_ID =  process.env.CHROME_EXT_ITEM_ID || private.CHROME_EXT_ITEM_ID;
  CLIENT_ID = process.env.CLIENT_ID || private.CLIENT_ID;
  CLIENT_SECRET = process.env.CLIENT_SECRET || private.CLIENT_SECRET;
  REFRESH_TOKEN = process.env.REFRESH_TOKEN || private.REFRESH_TOKEN;
} catch(ex) {
  console.log("missing environment variable or couldn't load private.json");
  console.error(ex);
  process.exit(1);
}

/*******************************************************************
 * Upload extension package
 * docs:
 * https://developer.chrome.com/webstore/webstore_api/items/update
 */
function uploadExtension(tokenResp) {
  var resp = JSON.parse(tokenResp.body);
  var TOKEN = resp.access_token;
  var options = {
    url: `https://www.googleapis.com/upload/chromewebstore/v1.1/items/${CHROME_EXT_ITEM_ID}`,
    headers: {
      'x-goog-api-version': '2',
      'Authorization': `Bearer ${TOKEN}`
    }
  };
  var filePath = process.cwd() + '/extensions/Chrome.zip';

  return new Promise(function (resolve, reject){
    fs.createReadStream(filePath)
      .pipe(request.put(options, 
        function(err, itemResponse) {
          if (err) { reject(err); }
          itemResponse.TOKEN = TOKEN; // pass through of the token
          resolve(itemResponse);
        }
      ));
  });
}

/*******************************************************************
 * after upload, you need to publish it to testers or public
 * docs:
 * https://developer.chrome.com/webstore/webstore_api/items/publish
 */
function publishExt(itemResponse){
  var resp = JSON.parse(itemResponse.body);
  
  if (resp.uploadState !== 'SUCCESS') {
    console.error("Error uploading extension");
    console.log(resp.itemError); // should exist if there was an error right?
    process.exit(1);
    return;
  }

  var options = {
    url: `https://www.googleapis.com/chromewebstore/v1.1/items/${CHROME_EXT_ITEM_ID}/publish`,
    headers: {
      'x-goog-api-version': '2',
      'Content-Length': 0,
      'Authorization': `Bearer ${itemResponse.TOKEN}`
    }
  };

  return new Promise(function (resolve, reject){
    request.post(options, 
      function(err,response){
        if (err) {reject(err);}
        else {resolve(response);}
      }
    );
  });

}

/*******************************************************************
 * get publish response and see if everything went ok
 */
function checkPublish(pubResponse){
  var resp = JSON.parse(pubResponse.body);
  
  if (resp.error) {
    console.log(resp);
    process.exit(1);
  }

  console.log('success publishing I think');
  console.log(resp);
}

module.exports = function(){

  googleToken(CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN)
    .then(uploadExtension)
    .then(publishExt)
    .then(checkPublish)
    .catch(function(err){
      console.error(err);
      process.exit(1);
    });

};
