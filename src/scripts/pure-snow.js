/**
 * Pure Snow
 * https://github.com/hyperstown/pure-snow.js
 *
 * With some modifications to work as a Svelte component
 *
 * The snow is done with CSS animations and keyframes.
 *
 */

const SNOWFLAKES_COUNT = 200;

let snowflakesCount = SNOWFLAKES_COUNT; // Snowflake count, can be overwritten by attrs
let baseCSS = '';

/**
 * We always want the snow to be full screen so this will always be 100vh
 */
const pageHeightVh = 100;

function getSnowConatiner() {
  return document.getElementById('snow-container');
}

// get params set in snow div
function getSnowAttributes() {
  const snowWrapper = getSnowConatiner();
  snowflakesCount = Number(snowWrapper?.dataset?.count || snowflakesCount);
}

// Creating snowflakes
function generateSnow(snowDensity = 200) {
  snowDensity -= 1;
  const snowWrapper = getSnowConatiner();
  snowWrapper.replaceChildren(); // clear previous snowflakes
  for (let i = 0; i < snowDensity; i++) {
    let board = document.createElement('div');
    board.className = 'snowflake';
    snowWrapper.appendChild(board);
  }
}

function getOrCreateCSSElement() {
  let cssElement = document.getElementById('psjs-css');
  if (cssElement) return cssElement;

  cssElement = document.createElement('style');
  cssElement.id = 'psjs-css';
  document.head.appendChild(cssElement);
  return cssElement;
}

// Append style for each snowflake to the head
function addCSS(rule = '') {
  const cssElement = getOrCreateCSSElement();
  cssElement.textContent = rule;
  document.head.appendChild(cssElement);
}

// Math
function randomInt(value = 100) {
  return Math.floor(Math.random() * value) + 1;
}
/**
 *
 * @param {number} min
 * @param {number} max
 * @returns
 */
function randomIntRange(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 *
 * @param {number} min
 * @param {number} max
 * @returns
 */
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

// Create style for snowflake
function generateSnowCSS(snowDensity = 200) {
  let snowflakeName = 'snowflake';
  let rule = baseCSS;

  for (let i = 1; i < snowDensity; i++) {
    let randomX = Math.random() * 100; // vw
    let randomOffset = Math.random() * 10; // vw;
    let randomXEnd = randomX + randomOffset;
    let randomXEndYoyo = randomX + randomOffset / 2;
    let randomYoyoTime = getRandomArbitrary(0.3, 0.8);
    let randomYoyoY = randomYoyoTime * pageHeightVh; // vh
    let randomScale = Math.random();
    let fallDuration = randomIntRange(10, (pageHeightVh / 10) * 3); // s
    let fallDelay = randomInt((pageHeightVh / 10) * 3) * -1; // s
    let opacity = Math.random();

    rule += `
      .${snowflakeName}:nth-child(${i}) {
        opacity: ${opacity};
        transform: translate(${randomX}vw, -10px) scale(${randomScale});
        animation: fall-${i} ${fallDuration}s ${fallDelay}s linear infinite;
      }
      @keyframes fall-${i} {
        ${randomYoyoTime * 100}% {
          transform: translate(${randomXEnd}vw, ${randomYoyoY}vh) scale(${randomScale});
        }
        to {
          transform: translate(${randomXEndYoyo}vw, ${pageHeightVh}vh) scale(${randomScale});
        }
      }
    `;
  }
  addCSS(rule);
}

// Load the rules and execute after the DOM loads
export function createSnow() {
  getSnowAttributes();
  generateSnowCSS(snowflakesCount);
  generateSnow(snowflakesCount);
}
