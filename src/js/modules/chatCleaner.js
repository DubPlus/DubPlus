/* global Dubtrack */
var settings = require("../lib/settings.js");
var modal = require('../utils/modal.js');
var options = require('../utils/options.js');

var myModule = {};

myModule.id = "chat-cleaner";
myModule.moduleName = "Chat Cleaner";
myModule.description = "Automatically only keep a designated chatItems of chat items while clearing older ones, keeping CPU stress down";
myModule.category = "General";
myModule.extraIcon = 'pencil';

var saveAmount = function () {
  var chatItems = parseInt($('.dp-modal textarea').val());
  if (!isNaN(chatItems)) {
    options.saveOption('custom', 'chat_cleaner', chatItems);
  } else {
    options.saveOption('custom', 'chat_cleaner', 500); // default to 500
  }
};

myModule.chatCleanerCheck = function (e) {
  var totalChats = $('ul.chat-main > li').length;

  if (isNaN(totalChats) || isNaN(settings.custom.chat_cleaner) || totalChats < settings.custom.chat_cleaner) return;

  $('ul.chat-main > li:lt('+($('ul.chat-main > li').length - settings.custom.chat_cleaner)+')').remove();
};

myModule.turnOn = function () {
  Dubtrack.Events.bind("realtime:chat-message", this.chatCleanerCheck);
};

myModule.extra = function () {
  modal.create({
    title: 'Chat Cleaner',
    content: 'Please specify the number of most recent chat items that will remain in your chat history',
    value: settings.custom.chat_cleaner || '',
    placeholder: '500',
    maxlength: '5',
    confirmCallback: saveAmount
  });
};

myModule.turnOff = function () {
  Dubtrack.Events.unbind("realtime:chat-message", this.chatCleanerCheck);
};

module.exports = myModule;