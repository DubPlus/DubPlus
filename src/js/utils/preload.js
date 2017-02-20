const settings = require('../lib/settings.js');

export default function preload() {

  var waitingStyles = [
    'font-family: \'Trebuchet MS\', Helvetica, sans-serif',
    'z-index: 2147483647',
    'color: white', 
    'position: fixed',
    'top: 69px',
    'right: 13px',
    'background: #222',
    'padding: 10px',
    'line-height: 1',
    '-webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75)', 
    '-moz-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75)',
    'box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75)',
    'border-radius: 5px',
    'overflow: hidden',
    'width: 230px'
  ].join(';');

  var dpIcon = [
    'float:left',
    'width: 26px',
    'margin-right:5px'
  ].join(";"); 

  var dpText = [
    'display: table-cell',
    'width: 10000px',
    'padding-top:5px'
  ].join(";"); 

  var preloadHTML = `
    <div class="dubplus-waiting" style="${waitingStyles}">
      <div style="${dpIcon}">
        <img src="${settings.srcRoot}/images/dubplus.svg" alt="DubPlus icon">
      </div>
      <span style="${dpText}">
        Waiting for Dubtrack...
      </span>
    </div>
  `;

  $('body').prepend(preloadHTML);
}