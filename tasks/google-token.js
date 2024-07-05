// const request = require("request");
import { log } from './colored-console.js';
import fs from 'node:fs';

/**
 * get google auth token using CODE
 * @return {Promise}
 */
export function getAccessTokenFromCode() {
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

  var privateInfo = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CODE: process.env.CODE,
  };

  try {
    // if local private.json exists then we can use that instead of env
    let _priv = JSON.parse(
      fs.readFileSync(process.cwd() + '/private.json', 'utf8')
    );
    privateInfo.CLIENT_ID = _priv.CLIENT_ID;
    privateInfo.CLIENT_SECRET = _priv.CLIENT_SECRET;
  } catch (ex) {
    // if json didnt work, we need to check if env vars were set at least
    let failure = false;

    for (let key in privateInfo) {
      let p = privateInfo[key];
      if (typeof p === 'undefined' || p === null || p === '') {
        log.error(`missing: ${key}`);
        failure = true;
      }
    }

    if (failure) {
      process.exit(1);
    }
  }

  var options = {
    url: 'https://accounts.google.com/o/oauth2/token',
    formData: {
      client_id: privateInfo.CLIENT_ID,
      client_secret: privateInfo.CLIENT_SECRET,
      code: privateInfo.CODE,
      grant_type: 'authorization_code',
      redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
    },
  };

  return new Promise(function (resolve, reject) {
    request.post(options, function (err, httpResponse) {
      if (err) {
        reject(err);
      } else {
        resolve(httpResponse);
      }
    });
  });
}

// for this function I'm going to make all required secrets passed via arguments
export function getTokenFromRefresh(clientID, clientSecret, refreshToken) {
  var options = {
    url: 'https://accounts.google.com/o/oauth2/token',
    formData: {
      client_id: clientID,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    },
  };

  // promisifying request module
  return new Promise(function (resolve, reject) {
    request.post(options, function (err, resp) {
      if (err) {
        reject(err);
      } else {
        resolve(resp);
      }
    });
  });
}
