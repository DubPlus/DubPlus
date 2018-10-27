/**
 * Browser development helper
 * uses Puppeteer to load Dubtrack in a browser
 * will refresh page and re-inject the Dubtrack
 * script when you hit save during development
 * requires that you have a private.json with your login details (see below)
 */
const puppeteer = require("puppeteer");
const creds = require(process.cwd() + "/private.json");

const dubplus_script = process.cwd() + "/dist/dubplus.js";
const dubplus_css = process.cwd() + "/css/dubplus.min.css";

// which rooom you want to connect to
const room = "https://dubtrack.fm/join/" + creds.room;

const dubDev = async () => {
  let browser;

  try {
    // launch visible browser with devtools open
    browser = await puppeteer.launch({
      headless: false,
      devtools: true,
      defaultViewport: {
        width: 1200,
        height: 600
      }
    });

    // start a new page and go to the room
    const page = await browser.newPage();
    await page.goto(room);

    const idLogin = "#login-link";
    const formSelector = 'form[action="/auth/dubtrack"]';

    // wait for the login element to be visible then click on it
    await page.waitForSelector(idLogin, { visible: true });
    await page.click(idLogin);
    // wait for the login for to be visible
    await page.waitForSelector(formSelector, { visible: true });

    // enter the login details and click on submit.  For some reason this
    // was the only way that I could get the form to submit
    await page.evaluate(
      function(formSelector, login, pw) {
        let form = document.querySelector(formSelector);
        form.querySelector("#login-input-username").value = login;
        form.querySelector("#login-input-password").value = pw;
        form.querySelector('input[type="submit"]').click();
      },
      formSelector,
      creds.dubtrack.login,
      creds.dubtrack.pw
    );

    await page.waitForSelector(".user-info", { visible: true });

    await page.addStyleTag({
      path: dubplus_css
    });

    await page.addScriptTag({
      path: dubplus_script
    });

    return browser;

  } catch (err) {
    console.log(err);
  }

  return browser;

};

export default () => {
  let browser;
  let count = 0;

  return {
    name: "reloadPuppeteer",

    generateBundle(outputOptions, bundle, isWrite) {
      if (!isWrite) {
        this.error(
          `this plugin currently only works with bundles that are written to disk`
        );
      }

      count++;
      if (count === 2) {
        count = 0;

        if (browser) {
          browser
            .then(b => {
              return b.close()
            })
            .then(()=>{
              browser = dubDev();
            })
          return;
        }
  
        browser = dubDev();
      }
    }
  };
};
