'use strict';
const options = require('../utils/options.js');
const settings = require('./settings.js');
const css = require('../utils/css.js');

// this is used to set the state of the contact menu section
var arrow = "down";
var isClosedClass = "";
if (settings.menu.contact === "closed") {
  isClosedClass = "dubplus-menu-section-closed";
  arrow =  "right";
}

// the contact section is hardcoded and setup up here
var contactSection = `
  <div id="dubplus-contact" class="dubplus-menu-section-header">
      <span class="fa fa-angle-${arrow}"></span>
      <p>Contact</p>
    </div>
    <ul class="dubplus-menu-section ${isClosedClass}">
      <li class="dubplus-menu-icon">
        <span class="fa fa-bug"></span>
        <a href="https://discord.gg/XUkG3Qy" class="dubplus-menu-label" target="_blank">Report bugs on Discord</a>
      </li>
       <li class="dubplus-menu-icon">
        <span class="fa fa-facebook"></span>
        <a href="https://facebook.com/DubPlusScript" class="dubplus-menu-label"  target="_blank">Facebook</a>
      </li>
      <li class="dubplus-menu-icon">
        <span class="fa fa-twitter"></span>
        <a href="https://twitter.com/DubPlusScript" class="dubplus-menu-label"  target="_blank">Twitter</a>
      </li>
    </ul>`;

module.exports = {
  beginMenu : function(){
    // load font-awesome icons from CDN to be used in the menu
    css.loadExternal('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
    
    // add icon to the upper right corner
    var menuIcon = `<div class="dubplus-icon"><img src="${settings.srcRoot}/images/dubplus.svg" alt=""></div>`;
    $('.header-right-navigation').append(menuIcon);

    // hide/show the  menu when you click on the icon in the top right
    $('body').on('click', '.dubplus-icon', function(e){
      $('.dubplus-menu').toggleClass('dubplus-menu-open');
    });

    // make the menu
    var dp_menu_html = `
      <section class="dubplus-menu dubplus-open">
          <p class="dubplus-menu-header">Dub+ Settings</p>`;

    return dp_menu_html;
  },

  finishMenu  : function(menuObj, menuString) {
    // dynamically create our menu from strings provided by each module
    for (var category in menuObj) {
      var fixed = category.replace(" ", "-").toLowerCase();
      var menuSettings = settings.menu[fixed];
      var id = 'dubplus-'+fixed;

      var arrow = "down";
      var isClosedClass = "";
      if (menuSettings === "closed") {
        isClosedClass = "dubplus-menu-section-closed";
        arrow =  "right";
      }
      
      menuString += `
        <div id="${id}" class="dubplus-menu-section-header">
          <span class="fa fa-angle-${arrow}"></span>
          <p>${category}</p>
        </div>
        <ul class="dubplus-menu-section ${isClosedClass}">`;
      menuString += menuObj[category];
      menuString += '</ul>';
    }

    // contact section last, is already fully formed, not dynamic
    menuString += contactSection;
    // final part of the menu string
    menuString += '</section>';

    // add it to the DOM
    $('body').append(menuString);
    // use the perfectScrollBar plugin to make it look nice
    // $('.dubplus-menu').perfectScrollbar();
    
    // add event handler for menu sections
    $('body').on('click', '.dubplus-menu-section-header', function(e){
      var $menuSec = $(this).next('.dubplus-menu-section');
      var $icon = $(this).find('span');
      var menuName = $(this).text().trim().replace(" ", "-").toLowerCase();
      $menuSec.toggleClass('dubplus-menu-section-closed');
      if ($menuSec.hasClass('dubplus-menu-section-closed')) {
        // menu is closed
        $icon.removeClass('fa-angle-down').addClass('fa-angle-right');
        options.saveOption( 'menu', menuName , 'closed');
      } else {
        // menu is open
        $icon.removeClass('fa-angle-right').addClass('fa-angle-down');
        options.saveOption( 'menu', menuName , 'open');
      }
    });
  },

  makeOptionMenu : function(menuTitle, options){
    var defaults = {
      id : '',  // will be the ID selector for the menu item
      desc : '', // will be used for the "title" attribute
      state : false,  // whether the menu item is on/off
      extraIcon : null, // define the extra icon if an option needs it (like AFK, Custom Mentions)
      cssClass : '', // adds extra CSS class(es) if desired,
      altIcon : null
    };
    var opts  = $.extend({}, defaults, options);
    var _extra = '';
    var _state = opts.state ? 'dubplus-switch-on' : '';
    if (opts.extraIcon) {
      _extra = `<span class="fa fa-${opts.extraIcon} extra-icon"></span>`;
    }

    // default icon on the left of each menu item is the switch
    var mainCssClass = "dubplus-switch";
    var mainIcon = `
        <div class="dubplus-switch-bg">
          <div class="dubplus-switcher"></div>'
        </div>`;
    // however, if an "altIcon" is provided, then we use that instead
    if (opts.altIcon) {
      mainCssClass = "dubplus-menu-icon";
      mainIcon = `<span class="fa fa-${opts.altIcon}"></span>`;
    }
    return `
      <li id="${opts.id}" class="${mainCssClass} ${_state} ${opts.cssClass} title="${opts.desc}">
        ${mainIcon}
        <span class="dubplus-menu-label">${menuTitle}</span>
        ${_extra}
      </li>`;
  },

  makeLinkMenu : function(menuTitle, icon, link, options){
    var defaults = {
      id : '',
      desc : '',
      cssClass : ''
    };
    var opts  = $.extend({}, defaults, options);
    return `
      <li id="${opts.id}" class="dubplus-menu-icon ${opts.cssClass} title="${opts.desc}">
        <span class="fa fa-${icon}"></span>
        <a href="${link}" class="dubplus-menu-label" target="_blank">${menuTitle}</a>
      </li>`;
  }

};


