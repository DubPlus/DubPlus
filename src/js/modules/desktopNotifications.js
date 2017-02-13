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
myModule.optionState = false;
myModule.category = "general";
myModule.menuHTML = menu.makeStandardMenuHTML(myModule.id, myModule.description, myModule.id, myModule.moduleName);


myModule.mentionNotifications = function(){
    var self = this;

    function startNotifications(permission) {
        if (permission === "granted") {
          Dubtrack.Events.bind("realtime:chat-message", self.notifyOnMention);
          self.toggleAndSave(self.id, true);
        }
    }

    if (!this.optionState) {
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
    } else {
        Dubtrack.Events.unbind("realtime:chat-message", this.notifyOnMention.bind(this) );
        this.toggleAndSave(this.id, false);
    }
};

myModule.notifyOnMention = function(e){
    var content = e.message;
    var user = Dubtrack.session.get('username').toLowerCase();
    var mentionTriggers = ['@'+user];

    if (dubplus.options.let_custom_mentions && localStorage.getItem('custom_mentions')) {
        //add custom mention triggers to array
        mentionTriggers = mentionTriggers.concat(localStorage.getItem('custom_mentions').toLowerCase().split(','));
    }

    if (mentionTriggers.some(function(v) { return content.toLowerCase().indexOf(v.trim(' ')) >= 0; }) && !dubplus.isActiveTab && Dubtrack.session.id !== e.user.userInfo.userid) {
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
myModule.go = function() {
  var newOptionState;

  // just saves the option
  if (!this.optionState) {
    newOptionState = true;
  } else {
    newOptionState = false;
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = myModule;