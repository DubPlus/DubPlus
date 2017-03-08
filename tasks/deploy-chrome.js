var request = require('request');
var fs = require('fs');

// you need to pass all 4 of these variables via ENV vars or in a private.json file in the
// root of the repo or this whole.  .gitignore is setup to ignore private.json
try {
  var private = require('../private.json');
  const CHROME_EXT_ITEM_ID =  process.env.CHROME_EXT_ITEM_ID || private.CHROME_EXT_ITEM_ID;
  const CLIENT_ID = process.env.CLIENT_ID || private.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET || private.CLIENT_SECRET;
  const CODE = process.env.CODE || private.CODE;
} catch(ex) {
  console.log("missing environment variables");
  console.error(ex);
  process.exit(1);
}

/*
  Note: 
  Currently, there is no API for setting an item’s metadata, such as description. This has to be done manually in the Chrome Web Store Developer Dashboard.
 */

function getChromeOauthToken(cb){
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

// Uploading a package to update an existing store item
function updateExtension(TOKEN, cb) {
  
  var options = {
    url: `https://www.googleapis.com/upload/chromewebstore/v1.1/items/${CHROME_EXT_ITEM_ID}`,
    headers: {
      'x-goog-api-version': '2',
      'Authorization': 'Bearer ${TOKEN}'
    }
  };

  fs.createReadStream(process.cwd() + '/extensions/Chrome.zip')
    .pipe(request.put(options, 
      function(err, httpResponse, body) {
        if (err) {
          console.error('upload failed:', err);
          process.exit(1);
        }
        cb(body);
      }
    ));
}

/**
 * Zips up the folders inside /slides 
 * Requires the command line "zip" program.  
 * Mac OSX should already come with that
 */
function doZip(filename, dir){
  var exec = require('child_process').exec;
  var zip = exec(`zip -vr ${name} ${name} -x "*.DS_Store"`,
    {cwd: dir},
    function(error, stdout, stderr){
      //console.log('stdout: ' + stdout);
      if (stderr !== "") {
        console.log('stderr: ' + stderr);
      }
      if (error !== null) {
        console.log('exec error: ' + error);
      }
  });
}


module.exports = function(){

  // step 1 zip the folder
  // step 2 get access token
  // step 3 send update to the api
  getChromeOauthToken(function(result){
    console.log(result.access_token, function(result){
      console.log(result);
    });
  });
}; 