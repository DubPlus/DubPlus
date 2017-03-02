/* global Dubtrack */
var settings = require("../lib/settings.js");

import {notifyCheckPermission, showNotification} from '../utils/notify.js';

var myModule = {};
myModule.id = "mention_notifications";
myModule.moduleName = "Notification on Mentions";
myModule.description = "Enable desktop notifications when a user mentions you in chat";
myModule.category = "General";

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
    showNotification({
      title: `Message from ${e.user.username}`, 
      content: content
    });
  }
};

myModule.turnOn = function(){

  notifyCheckPermission((granted)=>{
    if (granted === true) {
      Dubtrack.Events.bind("realtime:chat-message", this.notifyOnMention);
    } else {
      // turn back off until it's granted
      this.toggleAndSave(this.id, false);
    }
  });

};

myModule.turnOff = function() {
  Dubtrack.Events.unbind("realtime:chat-message", this.notifyOnMention );
};

module.exports = myModule;