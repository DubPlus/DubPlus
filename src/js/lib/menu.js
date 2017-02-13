'use strict';

var options = require('../utils/options.js');
var settings = require('./settings.js');
var css = require('../utils/css.js');
/* global Dubtrack */


var openSection = function($sectionEl){
  var sectionName = $sectionEl.data('dubplus-subnav');
  // open the section
  $sectionEl.slideDown('fast');
  // replace the icon
  $sectionEl.find('.dubplus-menu-section-title i').removeClass('fi-plus').addClass('fi-minus');
  // save the option
  options.saveMenuOption(sectionName,'true');
};

var closeSection = function($sectionEl){
  var sectionName = $sectionEl.data('dubplus-subnav');
  // open the section
  $sectionEl.slideUp('fast');
  // replace the icon
  $sectionEl.find('.dubplus-menu-section-title i').removeClass('fi-minus').addClass('fi-plus');
  // save the option
  options.saveMenuOption(sectionName,'false');
};

var toggledubplusSection = function(e) {
    var $targetSection = $(this).find('.dubplus-menu-subsection');
    var clicked = $(this).find('.dubplus-menu-section-title i');
    if( clicked.hasClass('fi-minus') ){
      closeSection($targetSection);
    } else{
      openSection($targetSection);
    }
};


var openAllMenus = function(){
  var $targetSection, sectionName;
  $('.dubplus-menu-section').each(function(i,section){
    $targetSection = $(this).find('.dubplus-menu-subsection');
    openSection($targetSection);
  });
};

var closeAllMenus = function(){
  var $targetSection, sectionName;
  $('.dubplus-menu-section').each(function(i,section){
    $targetSection = $(this).find('.dubplus-menu-subsection');
    closeSection($targetSection);
  });
};

var toggleAllSections = function() {
    var allClosed = true;
    var $targetSection;

    $('.dubplus-menu-section').each(function(i, section){
      $targetSection = $(this).find('.dubplus-menu-subsection');
      if( $targetSection.css('display') === 'block'){
        allClosed = false;
      }
    });

    if ( allClosed ) {
      openAllMenus();
    } else {
      closeAllMenus();
    }
};

var menu = {
  general: function(){
    return [
      '<li class="for_content_li dubplus-menu-section">',
          '<p class="for_content_c dubplus-menu-section-title">',
              'General',
              '<i class="fi-minus"></i>',
          '</p>',
          '<ul id="dubplusmenu-general" data-dubplus-subnav="general" class="draw_general dubplus-menu-subsection">',
          '</ul>',
      '</li>',
    ].join('');
  },
  ui : function(){
    return [
      '<li class="for_content_li dubplus-menu-section">',
          '<p class="for_content_c dubplus-menu-section-title">',
              'User Interface',
              '<i class="fi-minus"></i>',
          '</p>',
          '<ul id="dubplusmenu-ui" data-dubplus-subnav="userinterface" class="draw_userinterface dubplus-menu-subsection">',
          '</ul>',
      '</li>',
    ].join('');
  }, 
  settings: function(){
    return [
      '<li class="for_content_li dubplus-menu-section">',
          '<p class="for_content_c dubplus-menu-section-title">',
              'Settings',
              '<i class="fi-minus"></i>',
          '</p>',
      '</li>',
      '<ul id="dubplusmenu-settings" data-dubplus-subnav="settings" class="draw_settings dubplus-menu-subsection">',
      '</ul>'
    ].join('');
  },
  customize: function(){
    return [
      '<li class="for_content_li dubplus-menu-section">',
          '<p class="for_content_c dubplus-menu-section-title">',
              'Customize',
              '<i class="fi-minus"></i>',
          '</p>',
          '<ul id="dubplusmenu-customize" data-dubplus-subnav="customize" class="draw_customize dubplus-menu-subsection">',
          '</ul>',
      '</li>'
    ].join('');
  },
  contact: function(){
    return [
      '<li class="for_content_li dubplus-menu-section">',
          '<p class="for_content_c dubplus-menu-section-title">',
              'Contact',
              '<i class="fi-minus"></i>',
          '</p>',
          '<ul id="dubplusmenu-contact" data-dubplus-subnav="contact" class="draw_contact dubplus-menu-subsection">',
          '</ul>',
      '</li>'
    ].join('');
  },
  social: function(){
      return [
        '<li class="for_content_li dubplus-menu-section">',
            '<p class="for_content_c dubplus-menu-section-title">',
                'Social',
                '<i class="fi-minus"></i>',
            '</p>',
            '<ul id="dubplusmenu-social" data-dubplus-subnav="social" class="draw_social dubplus-menu-subsection">',
                // '<li class="for_content_li for_content_feature">',
                //     '<a href="https://twitter.com/dubplus" target="_blank" style="color: #878c8e;">',
                //         '<p class="for_content_off"><i class="fi-social-twitter"></i></p>',
                //         '<p class="for_content_p">Follow Us on Twitter</p>',
                //     '</a>',
                // '</li>',
                '<li class="for_content_li for_content_feature">',
                    '<a href="https://github.com/DubPlus/DubPlus" target="_blank" style="color: #878c8e;">',
                        '<p class="for_content_off"><i class="fi-social-github"></i></p>',
                        '<p class="for_content_p">Fork Us on Github</p>',
                    '</a>',
                '</li>',
                '<li class="for_content_li for_content_feature">',
                    '<a href="https://dub.plus" target="_blank" style="color: #878c8e;">',
                        '<p class="for_content_off"><i class="fi-link"></i></p>',
                        '<p class="for_content_p">Our Website</p>',
                    '</a>',
                '</li>',
                // '<li class="for_content_li for_content_feature">',
                //     '<a href="https://dubplus.net/donate.html" target="_blank" style="color: #878c8e;">',
                //         '<p class="for_content_off"><i class="fi-pricetag-multiple"></i></p>',
                //         '<p class="for_content_p">Donate</p>',
                //     '</a>',
                // '</li>',
            '</ul>',
        '</li>'
      ].join('');
  }
  // extension: function(){
  //   return [
  //     '<li class="for_content_li dubplus-menu-section">',
  //         '<p class="for_content_c dubplus-menu-section-title">',
  //             'Chrome Extension',
  //             '<i class="fi-minus"></i>',
  //         '</p>',
  //         '<ul id="dubplusmenu-extension" data-dubplus-subnav="chrome" class="draw_chrome dubplus-menu-subsection">',
  //             '<li class="for_content_li for_content_feature">',
  //                 '<a href="https://chrome.google.com/webstore/detail/dubplus/-----/reviews" target="_blank" style="color: #878c8e;">',
  //                     '<p class="for_content_off"><i class="fi-like"></i></p>',
  //                     '<p class="for_content_p">Give Us a Rating</p>',
  //                 '</a>',
  //             '</li>',
  //         '</ul>',
  //     '</li>'
  //   ].join('');
  // }

};

var makeMenu = function(){
    css.loadExternal('https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/foundation-icons.css');
    css.load('/css/asset.css');

    // add icon to the upper right corner
    var menuIcon = '<div class="for dubplus-menu"><img src="'+settings.srcRoot+'/params/params.svg" alt=""></div>';
    $('.header-right-navigation').append(menuIcon);

    // hide/show the who menu when you click on the icon in the top right
    $('body').on('click', '.dubplus-menu', function(e){
      $('.dubplus-menu-content').slideToggle('fast');
    });

    // make the menu
    var html = [
        '<div class="for_content dubplus-menu-content" style="display:none;">',
          '<span class="for_content_ver dubplus-menu-title">dubplus Settings</span>',
          '<span class="for_content_version dubplus-version" title="Collapse/Expand Menus">'+settings.our_version+'</span>',
          '<ul class="for_content_ul">',
            menu.general(),
            menu.ui(),
            menu.settings(),
            menu.customize(),
            menu.contact(),
            menu.social(),
            menu.extension(),
          '</ul>',
        '</div>'
    ].join('');

    // add it to the DOM
    $('body').prepend(html);
    // use the perfectScrollBar plugin to make it look nice
    $('.dubplus-menu-content').perfectScrollbar();

    // add event listeners that open/close all/each the menu section
    $('body').on('click', '.dubplus-menu-section', toggledubplusSection);
    $('body').on('click', '.dubplus-version', toggleAllSections);

    // load menu saved open/close sections settings and apply
    var $targetSection, sectionName;
    $('.dubplus-menu-section').each(function(i,section){
      $targetSection = $(this).find('.dubplus-menu-subsection');
      var sectionName = $targetSection.data('dubplus-subnav');

      if (settings.menu[sectionName] === 'false') {
        closeSection($targetSection);
      } else {
        options.saveMenuOption(sectionName,'true');
      }

    });
};



var makeStandardMenuHTML = function(id, desc, cssClass, menuTitle){
  return [
    '<li id="'+id+'" title="'+desc+'" class="for_content_li for_content_feature '+cssClass+'">',
        '<p class="for_content_off"><i class="fi-x"></i></p>',
        '<p class="for_content_p">'+menuTitle+'</p>',
    '</li>',
  ].join('');
};

var makeOtherMenuHTML = function(icon, id, desc, cssClass, menuTitle){
  return [
    '<li id="'+id+'" title="'+desc+'" class="for_content_li for_content_feature '+cssClass+'">',
        '<p class="for_content_off"><i class="fi-'+icon+'"></i></p>',
        '<p class="for_content_p">'+menuTitle+'</p>',
    '</li>',
  ].join('');
};

var appendToSection = function(section, menuItemHtml){
  $('#dubplusmenu-'+section).append(menuItemHtml);
};

module.exports = {
  makeMenu: makeMenu,
  appendToSection: appendToSection,
  makeStandardMenuHTML: makeStandardMenuHTML,
  makeOtherMenuHTML: makeOtherMenuHTML
};
