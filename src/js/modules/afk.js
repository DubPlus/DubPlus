/**
 * AFK -  Away from Keyboard
 * Toggles the afk auto response on/off
 * including adding a custom message
 */

/* global Dubtrack */
var modal = require('../utils/modal.js');
var options = require('../utils/options.js');
var menu = require('../lib/menu.js');
var settings = require("../lib/settings.js");

var afk_module = {};
afk_module.id = "afk";
afk_module.moduleName = "AFK Autorespond";
afk_module.description = "Toggle Away from Keyboard and customize AFK message.";
afk_module.optionState = false;
afk_module.category = "General";
afk_module.menuHTML = menu.makeOptionMenu(afk_module.moduleName, {
    id : 'dubplus-afk',
    desc : afk_module.description,
    extraIcon : 'pencil',
  });

var afk_chat_respond = function(e) {
  var content = e.message;
  var user = Dubtrack.session.get('username');
  
  if (content.indexOf('@'+user) > -1 && Dubtrack.session.id !== e.user.userInfo.userid) {
  
      if (this.optionState) {
          if (settings.custom.customAfkMessage) {
              $('#chat-txt-message').val('[AFK] '+ settings.custom.customAfkMessage);
          } else {
              $('#chat-txt-message').val("[AFK] I'm not here right now.");
          }
          Dubtrack.room.chat.sendMessage();
          this.optionState = false;

          var self = this;
          setTimeout(function() {
              self.optionState = true;
          }, 180000);
      }

  }
};

var saveAFKmessage =function() {
    var customAfkMessage = $('.input').val();
    options.saveOption('customAfkMessage', customAfkMessage);
};

var editAFKmessage = function() {
    var current = settings.custom.customAfkMessage;
    modal.create({
        title: 'Custom AFK Message',
        content: current,
        placeholder: 'I\'m not here right now.',
        confirmButtonClass: 'confirm-for315',
        maxlength: '255',
        confirmCallback: saveAFKmessage
    });
};

afk_module.init = function(){
  // this opens the dialog modal to add your custom away message
  $('body').on('click', '#dubplus-afk .extra-icon', editAFKmessage);
};

afk_module.go = function(e) {
    if(typeof e === 'object' && (e.target.className === 'for_content_edit' || e.target.className === 'fi-pencil')) {
        return;
    }
    var newOptionState;

    if (!this.optionState) {
        newOptionState = true;
        Dubtrack.Events.bind("realtime:chat-message", afk_chat_respond);
    } else {
        newOptionState = false;
        Dubtrack.Events.unbind("realtime:chat-message", afk_chat_respond);
    }

    this.optionState = newOptionState;
    this.toggleAndSave(this.id, newOptionState);
};

module.exports = afk_module;