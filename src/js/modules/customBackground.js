/**
 * Custom Background
 * Add your own custom background
 */

var settings = require("../lib/settings.js");
var modal = require('../utils/modal.js');
var options = require('../utils/options.js');

var myModule = {};

myModule.id = "dubplus-custom-bg";
myModule.moduleName = "Custom Background";
myModule.description = "Add your own custom background.";
myModule.category = "Customize";
myModule.extraIcon = 'pencil';

var makeBGdiv = function(url){
  return `<div class="dubplus-custom-bg" style="background-image: url(${url});"></div>`;
};

var saveCustomBG = function() {
  var content = $('.dp-modal textarea').val();
  if (content === '' || !content) {
    $('.dubplus-custom-bg').remove();
    options.saveOption('custom', 'bg', '');
    return;
  }

  if ( !$('.dubplus-custom-bg').length) {
    $('body').append(makeBGdiv(content));
  } else {
    $('.dubplus-custom-bg').css('background-image',`url(${content})`);
  }
 options.saveOption('custom', 'bg', content);
};


myModule.extra = function(){
  modal.create({
    title: 'Custom Background Image',
    content: 'Enter the full URL of an image. We recommend using a .jpg file. Leave blank to remove the current background image',
    value : settings.custom.bg || '',
    placeholder: 'https://example.com/big-image.jpg',
    maxlength: '500',
    confirmCallback: saveCustomBG
  });
};

myModule.turnOn = function() {
  // show modal if no image is in settings
  if (!settings.custom.bg || settings.custom.bg === '') {
    this.extra();
  } else {
    $('body').append(makeBGdiv(settings.custom.bg));
  }
};

myModule.turnOff = function() {
  $('.dubplus-custom-bg').remove();
};

module.exports = myModule;