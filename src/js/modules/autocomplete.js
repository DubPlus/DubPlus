/**
 * Autocomplete Emojis/Emotes
 */
var previewList = require('../emojiUtils/previewList.js');
var settings = require('../lib/settings.js');
var prepEmjoji = require('../emojiUtils/prepEmoji.js');

var myModule = {};
myModule.id = "dubplus-autocomplete";
myModule.moduleName = "Autocomplete Emoji";
myModule.description = "Toggle autocompleting emojis and emotes.  Shows a preview box in the chat";
myModule.category = "General";


var previewSearchStr = "";

/**************************************************************************
 * A bunch of utility helpers for the emoji preview
 */
var emojiUtils = {
  createPreviewObj : function(type, id, name) {
    return {
      src : prepEmjoji[type].template(id),
      text : ":" + name + ":",
      alt : name,
      cn : type
    };
  },
  addToPreviewList : function(emojiArray) {
    var self = this;
    var listArray = [];
    var _key;

    emojiArray.forEach(function(val){
        _key = val.toLowerCase();
        if (typeof prepEmjoji.twitch.emotes[_key] !== 'undefined') {
            listArray.push(self.createPreviewObj("twitch", prepEmjoji.twitch.emotes[_key], val));
        }
        if (typeof prepEmjoji.bttv.emotes[_key] !== 'undefined') {
            listArray.push(self.createPreviewObj("bttv", prepEmjoji.bttv.emotes[_key], val));
        }
        if (typeof prepEmjoji.tasty.emotes[_key] !== 'undefined') {
            listArray.push(self.createPreviewObj("tasty", _key, val));
        }
        if (emojify.emojiNames.indexOf(_key) >= 0) {
            listArray.push(self.createPreviewObj("emoji", val, val));
        }
    });

      previewList.display(listArray);
  },
    filterEmoji : function(str){
      var finalStr = str.replace(/([+()])/,"\\$1");
      var re = new RegExp('^' + finalStr, "i");
      var arrayToUse = emojify.emojiNames;
      if (settings.options['dubplus-emotes']) {
          arrayToUse = prepEmjoji.emojiEmotes; // merged array
      }
      return arrayToUse.filter(function(val){
          return re.test(val);
      });
    }
};

/**************************************************************************
 * handles filtering emoji, twitch, and users preview autocomplete popup on keyup
 */
var chatInputKeyupFunc = function(e){
  
  if (e.keyCode === 38) {
    previewList.doNavigate(-1);
    return;
  }
  if (e.keyCode === 40) {
    previewList.doNavigate(1);
    return;
  }

  var currentText = this.value;
  var keyCharMin = 3; // when to start showing previews
  var cursorPos = $(this).get(0).selectionStart;
  // console.log("cursorPos", cursorPos);
  var strStart;
  var strEnd;
  var inputRegex = new RegExp('(:|@)([&!()\\+\\-_a-z0-9]+)($|\\s)', 'ig');
  currentText.replace(inputRegex, function(matched, p1, p2, p3, pos, str){
    // console.dir( arguments );
    strStart = pos;
    strEnd = pos + matched.length;

    previewSearchStr = p2;

    if (cursorPos >= strStart && cursorPos <= strEnd) {
      // twitch and emoji
      if (p2 && p2.length >= keyCharMin && p1 === ":") {
        emojiUtils.addToPreviewList( emojiUtils.filterEmoji(p2) );
      }
    }
      
  });

  var lastChar = currentText.charAt(currentText.length - 1);
  if (previewSearchStr.length < keyCharMin ||
      lastChar === ":" ||
      lastChar === " " ||
      currentText === "")
  {
    previewSearchStr = "";
    $('#autocomplete-preview').empty().removeClass('ac-show');
  }

  // automatically make first item selectable if not already
  if (!$('.ac-show li:first-child').find(".ac-list-press-enter").length) {
    var spanToEnter = '<span class="ac-list-press-enter">press enter to select</span>';
    $('.ac-show li:first-child').append(spanToEnter).addClass('selected');
  }

  if (e.keyCode === 13 && $('#autocomplete-preview li').length > 0) {
    var new_text = $('#autocomplete-preview li.selected').find('.ac-text')[0].textContent;
    previewList.updateChatInput(new_text);
    return;
  }

  if (e.keyCode === 13 && currentText.length > 0){
    Dubtrack.room.chat.sendMessage();
  }
};

var chatInputKeydownFunc = function(e){
  // Manually send the keycode to chat if it is 
  // tab (9), enter (13), up arrow (38), or down arrow (40) for their autocomplete
  if (_.includes([9, 13, 38, 40], e.keyCode) && $('.ac-show').length === 0) {
    return Dubtrack.room.chat.ncKeyDown({'which': e.keyCode});
  }
};

/*************************************************/


myModule.start = function() {
  previewList.init();
  //Only remove keydown for Dubtrack native autocomplete to work
  Dubtrack.room.chat.delegateEvents(_(Dubtrack.room.chat.events).omit('keydown #chat-txt-message'));

  $(document.body).on('keydown', "#chat-txt-message", chatInputKeydownFunc);
  $(document.body).on('keyup', "#chat-txt-message", chatInputKeyupFunc);
};

myModule.init = function(){
  if (this.optionState) {
    this.start();
  }
};


myModule.go = function() {
  var newOptionState;

  if (!this.optionState) {
    newOptionState = true;
    this.start();
  } else {
    previewList.stop();
    newOptionState = false;
    $(document.body).off('keydown', "#chat-txt-message", chatInputKeydownFunc);
    $(document.body).off('keyup', "#chat-txt-message", chatInputKeyupFunc);
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = myModule;