/**
 * Autocomplete User @ Mentions in Chat
 */

/* global Dubtrack */
var menu = require('../lib/menu.js');
var settings = require("../lib/settings.js");
var modal = require('../utils/modal.js');

var myModule = {};

myModule.id = "mention_notifications";
myModule.moduleName = "Notification on Mentions";
myModule.description = "Enable desktop notifications when a user mentions you in chat";
myModule.optionState = settings.options[myModule.id] || false; // initial state from stored settings
myModule.category = "General";
myModule.menuHTML = menu.makeOptionMenu(myModule.moduleName, {
  id : myModule.id,
  desc : myModule.description,
  state : myModule.optionState
});

myModule.notifyOnMention = function(e){
  var content = e.message;
  var user = Dubtrack.session.get('username').toLowerCase();
  var mentionTriggers = ['@'+user];

  if (settings.options.custom_mentions && settings.custom.custom_mentions) {
    //add custom mention triggers to array
    mentionTriggers = mentionTriggers.concat(settings.custom.custom_mentions.toLowerCase().split(','));
  }

  var mentionTriggersTest = mentionTriggers.some(function(v) { 
    return content.toLowerCase().indexOf(v.trim(' ')) >= 0; 
  });
  if ( mentionTriggersTest && !this.isActiveTab && Dubtrack.session.id !== e.user.userInfo.userid) {
    var notificationOptions = {
      body: content,
      icon: "https://res.cloudinary.com/hhberclba/image/upload/c_lpad,h_100,w_100/v1400351432/dubtrack_new_logo_fvpxa6.png"
    };
    var n = new Notification("Message from "+e.user.username,notificationOptions);

    n.onclick = function(x) {
      window.focus();
      n.close();
    };
    setTimeout(n.close.bind(n), 5000);
  }
};

myModule.mentionNotifications = function(){
  var self = this;

  function startNotifications(permission) {
    if (permission === "granted") {
      Dubtrack.Events.bind("realtime:chat-message", self.notifyOnMention);
      self.toggleAndSave(self.id, true);
    }
  }

  this.isActiveTab = true;

  window.onfocus = function () {
    self.isActiveTab = true;
  };

  window.onblur = function () {
    self.isActiveTab = false;
  };

  if (!("Notification" in window)) {
    modal.create({
      title: 'Mention Notifications',
      content: "Sorry this browser does not support desktop notifications.  Please use the latest version of Chrome or FireFox"
    });
  } else {
    if (Notification.permission === "granted") {
      startNotifications("granted");
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission(startNotifications);
    } else {
      modal.create({
        title: 'Mention Notifications',
        content: "You have chosen to block notifications. Reset this choice by clearing your cache for the site."
      });
    }
  }
};

myModule.init = function(){
  if (this.optionState === true) {
    myModule.mentionNotifications();
  }
};

myModule.go = function() {
  var newOptionState;

  if (!this.optionState) {
    myModule.mentionNotifications();
    newOptionState = true;
  } else {
    Dubtrack.Events.unbind("realtime:chat-message", this.notifyOnMention );
    newOptionState = false;
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = myModule;