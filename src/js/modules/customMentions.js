/**
 * Autocomplete User @ Mentions in Chat
 */

/* global Dubtrack */
var settings = require("../lib/settings.js");
var modal = require('../utils/modal.js');
var options = require('../utils/options.js');

var myModule = {};

myModule.id = "custom_mentions";
myModule.moduleName = "Custom Mentions";
myModule.description = "Toggle using custom mentions to trigger sounds in chat";
myModule.category = "General";
myModule.extraIcon = 'pencil';


var saveCustomMentions = function() {
  var mentionsVal = $('.dp-modal textarea').val();
  if (mentionsVal !== '') {
    options.saveOption('custom', 'custom_mentions', mentionsVal);
  }
};

myModule.customMentionCheck = function(e) {
  var content = e.message.toLowerCase();
  if (settings.custom.custom_mentions) {
    var customMentions = settings.custom.custom_mentions.toLowerCase().split(',');
    var inUsers = customMentions.some(function(v) { 
      return content.indexOf(v.trim(' ')) >= 0; 
    });
    if(Dubtrack.session.id !== e.user.userInfo.userid && inUsers){
      Dubtrack.room.chat.mentionChatSound.play();
    }
  }
};

myModule.turnOn = function() {
  Dubtrack.Events.bind("realtime:chat-message", this.customMentionCheck);
};


myModule.extra = function() {
  modal.create({
    title: 'Custom Mentions',
    content: 'Add your custom mention triggers here (separate by comma)',
    value : settings.custom.custom_mentions || '',
    placeholder: 'separate, custom triggers, by, comma, :heart:',
    maxlength: '255',
    confirmCallback: saveCustomMentions
  });
};

myModule.turnOff = function() {
  Dubtrack.Events.unbind("realtime:chat-message", this.customMentionCheck);
};

module.exports = myModule;