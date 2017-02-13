'use strict';
var options = require('../utils/options.js');
var settings = require('./settings.js');
var css = require('../utils/css.js');

var contactSection = [
    '<div id="dubplus-contact" class="dubplus-menu-section-header">',
      '<span class="fa fa-angle-down"></span>',
      '<p>Contact</p>',
    '</div>',
    '<ul class="dubplus-menu-section">',
      '<li class="dubplus-menu-icon">',
        '<span class="fa fa-bug"></span>',
        '<a href="https://discord.gg/XUkG3Qy" class="dubplus-menu-label" target="_blank">Report bugs on Discord</a>',
      '</li>',
       '<li class="dubplus-menu-icon">',
        '<span class="fa fa-facebook"></span>',
        '<a href="https://facebook.com/DubPlusScript" class="dubplus-menu-label"  target="_blank">Facebook</a>',
      '</li>',
      '<li class="dubplus-menu-icon">',
        '<span class="fa fa-twitter"></span>',
        '<a href="https://twitter.com/DubPlusScript" class="dubplus-menu-label"  target="_blank">Twitter</a>',
      '</li>',
    '</ul>',
  ].join('');

module.exports = {
  beginMenu : function(){
    // load font-awesome icons from CDN to be used in the menu
    css.loadExternal('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
    
    // add icon to the upper right corner
    var menuIcon = '<div class="dubplus-icon"><img src="'+settings.srcRoot+'/images/dubplus.svg" alt=""></div>';
    $('.header-right-navigation').append(menuIcon);

    // hide/show the  menu when you click on the icon in the top right
    $('body').on('click', '.dubplus-icon', function(e){
      $('.dubplus-menu').toggleClass('dubplus-menu-open');
    });

    // make the menu
    var dp_menu_html = [
        '<section class="menu-container dubplus-menu dubplus-open">',
          '<p class="dubplus-menu-header">Dub+ Settings</p>'
    ].join('');

    return dp_menu_html;
  },

  finishMenu  : function(menuObj, menuString) {
    // dynamically create our menu from strings provided by each module
    for (var category in menuObj) {
      var id = 'dubplus-' + category.replace(" ", "-").toLowerCase();
      menuString += [
        '<div id="'+id+'" class="dubplus-menu-section-header">',
          '<span class="fa fa-angle-down"></span>',
          '<p>'+category+'</p>',
        '</div>',
        '<ul class="dubplus-menu-section">'
      ].join('');
      menuString += menuObj[category];
      menuString += '</ul>';
    }

    // contact section last, is already fully formed, not dynamic
    menuString += contactSection;
    // final part of the menu string
    menuString += '</section>';

    // add it to the DOM
    $('body').prepend(menuString);
    // use the perfectScrollBar plugin to make it look nice
    // $('.dubplus-menu').perfectScrollbar();
  },

  makeOptionMenu : function(menuTitle, options){
    var defaults = {
      id : '',
      desc : '',
      state : false, 
      extraIcon : null,
      cssClass : ''
    };
    var opts  = $.extend({}, defaults, options);
    var _extra = '';
    var _state = opts.state ? 'dubplus-switch-on' : '';
    if (opts.extraIcon) {
      _extra = '<span class="fa fa-'+opts.extraIcon+' extra-icon"></span>';
    }
    return [
      '<li id="'+opts.id+'"" class="dubplus-switch '+opts.cssClass+'" title="'+opts.desc+'">',  
        '<div class="dubplus-switch-bg '+_state+'">',
          '<div class="dubplus-switcher"></div>', 
        '</div>',
        '<span class="dubplus-menu-label">'+menuTitle+'</span>',
        _extra,
      '</li>',
    ].join('');
  },

  makeLinkMenu : function(menuTitle, icon, link, options){
    var defaults = {
      id : '',
      desc : '',
      cssClass : ''
    };
    var opts  = $.extend({}, defaults, options);
    return [
      '<li id="'+opts.id+'"" class="dubplus-menu-icon '+opts.cssClass+'" title="'+opts.desc+'">',  
        '<span class="fa fa-'+icon+'"></span>',
        '<a href="'+link+'" class="dubplus-menu-label" target="_blank">'+menuTitle+'</a>',
      '</li>',
    ].join('');
  }

};


