var request = require('request');
var fs = require('fs');

/*
  Note: 
  Currently, there is no API for setting an item’s metadata, such as description. This has to be done manually in the Chrome Web Store Developer Dashboard.
 */

function getChromeOauthToken(CLIENT_ID, CLIENT_SECRET, CODE, cb){
  var options = {
    url: 'https://accounts.google.com/o/oauth2/token',
    headers: {
      'x-goog-api-version': '2'
    },
    form: {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: CODE,
      grant_type: 'authorization_code',
      redirect_uri: 'urn:ietf:wg:oauth:2.0:oob'
    }
  };

  request.post(options, 
    function(err,httpResponse,body){
      if (err) { 
        console.log(err);
        process.exit(1);
      }
      cb(body);
    }
  );

}

function updateExtension(TOKEN, cb) {
  
  var options = {
    url: 'https://developer.chrome.com/webstore/webstore_api/items/update',
    headers: {
      'x-goog-api-version': '2'
    },
    formData : {
        Authorization: 'Bearer ${TOKEN}',
        my_file: fs.createReadStream(__dirname + '/unicycle.jpg'),
    }
  };

  request.put(options, 
    function optionalCallback(err, httpResponse, body) {
      if (err) {
        console.error('upload failed:', err);
        process.exit(1);
      }
      cb(body);
    }
  );
}

module.exports = function(){

};