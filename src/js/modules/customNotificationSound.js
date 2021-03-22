var settings = require("../lib/settings.js");
var modal = require('../utils/modal.js');
var options = require('../utils/options.js');
var DubtrackDefaultSound = '/assets/music/user_ping.mp3';

var myModule = {};

myModule.id = "dubplus-custom-notification-sound";
myModule.moduleName = "Custom Notification Sound";
myModule.description = "Change the notification sound to a custom one.";
myModule.category = "Customize";
myModule.extraIcon = 'pencil';

var saveCustomNotificationSound = function() {
  var content = $('.dp-modal textarea').val();
  if (content === '' || !content) {
    options.saveOption('custom', 'notificationSound', '');
    QueUp.room.chat.mentionChatSound.url = DubtrackDefaultSound;
    return;
  }

  // Check if valid sound url
  if (soundManager.canPlayURL(content)) {
    QueUp.room.chat.mentionChatSound.url = content;
  } else {
    setTimeout(function() {
      var that = myModule;
      modal.create({
        title: 'Dub+ Error',
        content: "You've entered an invalid sound url! Please make sure you are entering the full, direct url to the file. IE: https://example.com/sweet-sound.mp3"
      });
      QueUp.room.chat.mentionChatSound.url = DubtrackDefaultSound;
      that.optionState = false;
      that.toggleAndSave(that.id, false);
    }, 100);
  }
  
  options.saveOption('custom', 'notificationSound', content);
};


myModule.extra = function(){
  modal.create({
    title: 'Custom Notification Sound',
    content: 'Enter the full URL of a sound file. We recommend using an .mp3 file. Leave blank to go back to Dubtrack\'s default sound',
    value : settings.custom.notificationSound || '',
    placeholder: 'https://example.com/sweet-sound.mp3',
    maxlength: '500',
    confirmCallback: saveCustomNotificationSound
  });
};

myModule.init = function(){
  if (this.optionState && settings.custom.notificationSound) {
   this.turnOn();
  }
};

myModule.turnOn = function() {
  // show modal if no image is in settings
  if (!settings.custom.notificationSound || settings.custom.notificationSound === '') {
    this.extra();
  } else {
    QueUp.room.chat.mentionChatSound.url = settings.custom.notificationSound;
  }
};

myModule.turnOff = function() {
  QueUp.room.chat.mentionChatSound.url = DubtrackDefaultSound;
};

module.exports = myModule;