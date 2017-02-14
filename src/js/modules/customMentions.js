/**
 * Autocomplete User @ Mentions in Chat
 */

/* global Dubtrack */
var menu = require('../lib/menu.js');
var settings = require("../lib/settings.js");
var modal = require('../utils/modal.js');
var options = require('../utils/options.js');

var myModule = {};

myModule.id = "custom_mentions";
myModule.moduleName = "Custom Mentions";
myModule.description = "Toggle using custom mentions to trigger sounds in chat";
myModule.optionState = settings.options[myModule.id] || false; // initial state from stored settings
myModule.category = "General";
myModule.menuHTML = menu.makeOptionMenu(myModule.moduleName, {
  id : myModule.id,
  desc : myModule.description,
  extraIcon : 'pencil',
  state : myModule.optionState
});

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

myModule.start = function() {
  Dubtrack.Events.bind("realtime:chat-message", this.customMentionCheck);
};

myModule.init = function(){
  if (this.optionState === true) {
    this.start();
  }
};


myModule.extra = function() {
  modal.create({
    title: 'Custom AFK Message',
    content: 'Custom Mention Triggers (separate by comma)',
    value : settings.custom.custom_mentions || '',
    placeholder: 'separate, custom triggers, by, comma, :heart:',
    maxlength: '255',
    confirmCallback: saveCustomMentions
  });
};

myModule.go = function() {
  var newOptionState;

  if (!this.optionState) {
    myModule.start();
    newOptionState = true;
  } else {
    Dubtrack.Events.unbind("realtime:chat-message", this.customMentionCheck);
    newOptionState = false;
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = myModule;