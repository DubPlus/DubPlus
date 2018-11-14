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
const idLogin = "#login-link";
const formSelector = 'form[action="/auth/dubtrack"]';

let browser;
let page;

const handleLogin = async () => {
  await page.click(idLogin);
  // wait for the login modal to be visible
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

  startDubPlus();
};

const startDubPlus = async () => {
  await page.addStyleTag({
    path: dubplus_css
  });

  await page.addScriptTag({
    path: dubplus_script
  });
};

const onLoad = async () => {
  page
    .waitForSelector(idLogin, { visible: true })
    .then(() => {
      handleLogin(page);
    })
    .catch(err => {
      console.log(idLogin, "did not show up");
    });

  // OR if already logged, start DubPlus
  page.waitForSelector(".user-info", { visible: true })
    .then(() => {
      startDubPlus(page);
    })
    .catch((err)=>{
      console.error('.user-info timeout', err);
    });
};

const dubDev = async () => {
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
    page = await browser.newPage();
    await page.goto(room);

    onLoad();
  } catch (err) {
    console.log(err);
  }
};

export default () => {
  let count = 0;

  return {
    name: "reloadPuppeteer",

    generateBundle(outputOptions, bundle, isWrite) {
      if (!isWrite) {
        this.error(
          `this plugin currently only works with bundles that are written to disk`
        );
      }

      // *****************************
      // because for some reason this plugin gets run twice in a row
      if (count > 1) {
        count = 0;
        return;
      }
      count++;
      // *****************************

      if (page) {
        page.reload().then(() => {
          onLoad(page);
        });
      } else {
        dubDev();
      }
    }
  };
};
