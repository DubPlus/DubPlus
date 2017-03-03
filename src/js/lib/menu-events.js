const options = require('../utils/options.js');

/**
 * Handles the toggling of the menu sections
 * @param  {Element} currentSection The pure DOM element of menu header
 * @return {undefined}
 */
var toggleMenuSection = function(currentSection) {
  var $menuSec = currentSection.nextElementSibling;
  var $icon = currentSection.children[0];
  var menuName = currentSection.textContent.trim().replace(" ", "-").toLowerCase();
  var isClosed = $menuSec.classList.toggle('dubplus-menu-section-closed');
  
  if (isClosed) {
    // menu is closed
    $icon.classList.remove('fa-angle-down');
    $icon.classList.add('fa-angle-right');
    options.saveOption( 'menu', menuName , 'closed');
  } else {
    // menu is open
    $icon.classList.remove('fa-angle-right');
    $icon.classList.add('fa-angle-down');
    options.saveOption( 'menu', menuName , 'open');
  }
};

/**
 * Traverses up the dubplus menu DOM tree until it finds a match to a corresponding function
 * @param  {Element} target DOM Element
 * @return {Object}         our module or null
 */
var traverseMenuDOM = function(target) {
  // if we've reached the dubplus-menu container then we've gone too far
  if (!target || target.classList.contains('dubplus-menu')) {
    return null;
  }

  // to handle the opening/closings of our sections
  if (target.classList.contains('dubplus-menu-section-header')) {
    toggleMenuSection(target);
    return null;
  }

  // check if a module exists matching current ID
  var module = window.dubplus[target.id];

  if (!module) { 
    // recursively try until we get a hit or reach our menu container
    return traverseMenuDOM(target.parentElement);
  } else {
    return module;
  }
};

/**
 * Click event handler for the whole menu, delegating events to their proper function
 * @param  {object} ev the click event object
 * @return {undefined}
 */
var menuDelegator = function(ev) {

  var mod = traverseMenuDOM(ev.target);
  if (!mod) { return; }

  // if clicking on the "extra-icon", run module's "extra" function
  if (ev.target.classList.contains('extra-icon') && mod.extra) {
    mod.extra.call(mod);
    return;
  }

  if (mod.turnOn && mod.turnOff) {
    var newOptionState;
    if (!mod.optionState) {
      newOptionState = true;
      mod.turnOn.call(mod);
    } else {
      newOptionState = false;
      mod.turnOff.call(mod);
    }

    mod.optionState = newOptionState;
    options.toggleAndSave(mod.id, newOptionState);
    return;
  }

  if (mod.go) {
    // .go is used for modules that never save state, like fullscreen
    mod.go.call(mod);
  }
};


export default ()=> {
  var dpMenu = document.querySelector('.dubplus-menu'); 

  // add event listener to the main menu and delegate
  dpMenu.addEventListener('click', menuDelegator);

  // hide/show the  menu when you click on the icon in the top right
  document.querySelector('.dubplus-icon').addEventListener('click', function(){
    dpMenu.classList.toggle('dubplus-menu-open');
  });
};