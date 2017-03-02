/**
 * Autocomplete User @ Mentions in Chat
 */

/* global Dubtrack */
var settings = require("../lib/settings.js");
var modal = require('../utils/modal.js');
var options = require('../utils/options.js');
import {notifyCheckPermission, showNotification} from '../utils/notify.js';

var myModule = {};

myModule.id = "queue-notification";
myModule.moduleName = "Queue Notification";
myModule.description = "Notification when you are coming up to be the DJ";
myModule.category = "General";
myModule.extraIcon = 'pencil';

var saveCustomMentions = function () {
  var position = parseInt($('.dp-modal textarea').val());
  if (!isNaN(position)) {
    options.saveOption('custom', 'queue_notification', position);
  } else {
    options.saveOption('custom', 'queue_notification', 2); // default to 2
  }
};

myModule.queueNotificationCheck = function (e) {
  if (e.startTime > 2) return;

  var position = parseInt($('.queue-position').text());
  if (isNaN(position) || position !== settings.custom.queue_notification) return;

  showNotification({
    title : 'DJ Alert!', 
    content : 'You will be DJing shortly! Make sure your song is set!', 
    ignoreActiveTab: true,
    wait : 10000
  });
  Dubtrack.room.chat.mentionChatSound.play();
};

myModule.turnOn = function () {
  Dubtrack.Events.bind("realtime:room_playlist-update", this.queueNotificationCheck);
};

myModule.extra = function () {
  modal.create({
    title: 'Queue Notification',
    content: 'Position in queue to notify at',
    value: settings.custom.queue_notification || '',
    placeholder: '2',
    maxlength: '2',
    confirmCallback: saveCustomMentions
  });
};

myModule.turnOff = function () {
  Dubtrack.Events.unbind("realtime:room_playlist-update", this.queueNotificationCheck);
};

module.exports = myModule;