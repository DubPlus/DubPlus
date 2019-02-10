/**
 * Autocomplete Emojis/Emotes
 */
/*global _, Dubtrack, emojify*/
var settings = require('../lib/settings.js');
var prepEmjoji = require('../emojiUtils/prepEmoji.js');
import {PreviewListManager, makeList} from '../emojiUtils/previewList.js';

// because I have a lot of logging on each keypress I made this
var debugAC = false;
function log(){
  if (debugAC) { console.log.apply(console, arguments); }
}

var myModule = {};
myModule.id = "dubplus-autocomplete";
myModule.moduleName = "Autocomplete Emoji";
myModule.description = "Toggle autocompleting emojis and emotes.  Shows a preview box in the chat";
myModule.category = "General";

const KEYS = {
  up        : 38,
  down      : 40,
  left      : 37,
  right     : 39,
  enter     : 13,
  esc       : 27,
  tab       : 9,
  shiftKey  : 16,
  backspace : 8,
  del       : 46,
  space     : 32,
  ctrl      : 17
};

const keyCharMin = 3; // when to start showing previews
const inputRegex = new RegExp('(:)([&!()\\+\\-_a-z0-9]+)($|\\s)', 'ig');

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
        if (typeof prepEmjoji.frankerFacez.emotes[_key] !== 'undefined') {
            listArray.push(self.createPreviewObj("frankerFacez", prepEmjoji.frankerFacez.emotes[_key], val));
        }
        if (emojify.emojiNames.indexOf(_key) >= 0) {
            listArray.push(self.createPreviewObj("emoji", val, val));
        }
    });

    makeList(listArray);
  },

  filterEmoji : function(str){
    var finalStr = str.replace(/([+()])/,"\\$1");
    var re = new RegExp('^' + finalStr, "i");
    var arrayToUse = emojify.emojiNames || [];
    if (settings.options['dubplus-emotes']) {
        arrayToUse = prepEmjoji.emojiEmotes || []; // merged array
    }

    return arrayToUse.filter(function(val){
        return re.test(val);
    });
  }
};

/**************************************************************************
 * handles filtering emoji, twitch, and users preview autocomplete popup on keyup
 */

var previewList = new PreviewListManager();

var shouldClearPreview = function(ac, pvStr, current, kMin){
  var lastChar = current.charAt(current.length - 1);
  if (pvStr.length < kMin ||
      lastChar === ":" ||
      lastChar === " " ||
      current === "")
  {
    pvStr = "";
    ac.innerHTML = "";
    ac.className = "";
  }
  return pvStr;
};

var handleMatch = function(triggerMatch, currentText, cursorPos, keyCharMin) {
  var pos = triggerMatch.length - 1; // only want to use the last one in the array
  var currentMatch = triggerMatch[pos].trim();
  var emoteChar = currentMatch.charAt(0); // get the ":" trigger and store it separately
  currentMatch = currentMatch.substring(1); // and then remove it from the matched string

  var strStart = currentText.lastIndexOf( currentMatch );
  var strEnd = strStart + currentMatch.length;
  
  log("cursorPos", cursorPos);
  if (cursorPos >= strStart && cursorPos <= strEnd) {
    // twitch and other emoji
    if (currentMatch && currentMatch.length >= keyCharMin && emoteChar === ":") {
      emojiUtils.addToPreviewList( emojiUtils.filterEmoji(currentMatch) );
    }
  }
  log('match',triggerMatch,strStart,strEnd);

  return {
    start : strStart,
    end : strEnd,
    currentMatch : currentMatch
  };
};

var chatInputKeyupFunc = function(e){
  var acPreview = document.querySelector('#autocomplete-preview');
  var hasItems = acPreview.children.length > 0;
  
  if (e.keyCode === KEYS.enter && !hasItems) {
    return; // do nothing
  }

  if (e.keyCode === KEYS.up && hasItems) {
    e.preventDefault();
    previewList.doNavigate(-1);
    return;
  }

  if (e.keyCode === KEYS.down && hasItems) {
    e.preventDefault();
    previewList.doNavigate(1);
    return;
  }

  if ((e.keyCode === KEYS.enter || e.keyCode === KEYS.tab) && hasItems) {
    e.preventDefault();
    previewList.selected = $('.preview-item.selected').find('.ac-text').text();
    previewList.updateChatInput();
    return false;
  }

  var currentText = this.value;
  var cursorPos = $(this).get(0).selectionStart;
  
  var triggerMatch = currentText.match(inputRegex);
  
  var previewSearchStr = "";

  if (triggerMatch && triggerMatch.length > 0) {
    var matchData = handleMatch(triggerMatch, currentText, cursorPos, keyCharMin);
    previewSearchStr = matchData.currentMatch;
    previewList.data = matchData;
  }

  log("inKeyup",previewList.data);

  shouldClearPreview(acPreview, previewSearchStr, currentText, keyCharMin);

};

var chatInputKeydownFunc = function(e){
  var emptyPreview = document.querySelector('#autocomplete-preview').children.length <= 0;
  var isValidKey = _.includes([
    KEYS.tab, 
    KEYS.enter, 
    KEYS.up, 
    KEYS.down,
    KEYS.left,
    KEYS.right
  ], 
    e.keyCode
  );

  // Manually send the keycodes if the preview popup isn't visible
  if ( isValidKey && emptyPreview) {
    return Dubtrack.room.chat.ncKeyDown({'which': e.keyCode});
  }

  // stop default behaviors of special keys so we can use them in preview
  if ( isValidKey && !emptyPreview) {
    e.preventDefault();
  }
};

myModule.turnOn = function() {
  previewList.init();
  //Only remove keydown for Dubtrack native autocomplete to work
  Dubtrack.room.chat.delegateEvents(_.omit(Dubtrack.room.chat.events, ['keydown #chat-txt-message']));

  $(document.body).on('keydown', "#chat-txt-message", chatInputKeydownFunc);
  $(document.body).on('keyup', "#chat-txt-message", chatInputKeyupFunc);
};

myModule.turnOff = function() {
  previewList.stop();
  Dubtrack.room.chat.delegateEvents(Dubtrack.room.chat.events);
  $(document.body).off('keydown', "#chat-txt-message", chatInputKeydownFunc);
  $(document.body).off('keyup', "#chat-txt-message", chatInputKeyupFunc);
};

module.exports = myModule;