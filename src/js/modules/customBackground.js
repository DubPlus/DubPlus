/**
 * Custom Background
 * Add your own custom background
 */

/* global Dubtrack */
var menu = require('../lib/menu.js');
var settings = require("../lib/settings.js");
var modal = require('../utils/modal.js');
var options = require('../utils/options.js');

var myModule = {};

myModule.id = "customBG";
myModule.moduleName = "Custom Background";
myModule.description = "Add your own custom background.";
myModule.optionState = false;
myModule.category = "customize";
myModule.menuHTML = menu.makeOtherMenuHTML('unlink', myModule.id, myModule.description, '', myModule.moduleName);

myModule.makeBGdiv = function(url){
    return '<div class="medium" style="width: 100%; height: 100%; z-index: -999998; position: fixed; background-image: url('+url+'); background-size: cover; top: 0; left: 0;"></div>';
};


myModule.saveCustomBG = function() {
    var content = $('.input').val();
    if (content === '' || content === null || typeof content === 'undefined') {
        $('.medium').remove();
        this.optionState = false;
        options.saveOption('medium',content);
        return;
    }

    if ( !$('.medium').length) {
        $('body').append(this.makeBGdiv(content));
    } else {
        $('.medium').css('background-image',' url('+content+')');
    }
   options.saveOption('medium',content);
};


myModule.go = function(source) {
    if (source === "onLoad") {
        $('body').append(this.makeBGdiv(settings.general.medium));
    } else {
        modal.create({
            title: 'Link an image file:',
            content: 'We recommend using a .jpg file. Leave blank to remove the current background image',
            placeholder: 'https://example.com/example.jpg',
            confirmButtonClass: 'confirm-for314',
            maxlength: '999',
            confirmCallback: this.saveCustomBG
        });
    }
    
};

module.exports = myModule;