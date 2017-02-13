/* global Dubtrack, emojify */
var options = require('../utils/options.js');
var dubplus_emoji = require('./prepEmoji.js');
var previewList = require('./previewList.js');

var previewSearchStr = "";


/**************************************************************************
 * A bunch of utility helpers for the emoji preview
 */
var emojiUtils = {
    createPreviewObj : function(type, id, name) {
        return {
            src : dubplus_emoji[type].template(id),
            text : ":" + name + ":",
            alt : name,
            cn : type
        };
    },
    addToPreviewList : function(emojiArray) {
        var self = this;
        var listArray = [];
        var _key;

        emojiArray.forEach(function(val,i,arr){
            _key = val.toLowerCase();
            if (typeof dubplus_emoji.twitch.emotes[_key] !== 'undefined') {
                listArray.push(self.createPreviewObj("twitch", dubplus_emoji.twitch.emotes[_key], val));
            }
            if (typeof dubplus_emoji.bttv.emotes[_key] !== 'undefined') {
                listArray.push(self.createPreviewObj("bttv", dubplus_emoji.bttv.emotes[_key], val));
            }
            if (typeof dubplus_emoji.tasty.emotes[_key] !== 'undefined') {
                listArray.push(self.createPreviewObj("tasty", _key, val));
            }
            if (emojify.emojiNames.indexOf(_key) >= 0) {
                listArray.push(self.createPreviewObj("emoji", val, val));
            }
        });

        previewList.previewList(listArray);
    },
    filterEmoji : function(str){
        var finalStr = str.replace(/([+()])/,"\\$1");
        var re = new RegExp('^' + finalStr, "i");
        var arrayToUse = emojify.emojiNames;
        if (dubplus.options.let_twitch_emotes) {
            arrayToUse = dubplus_emoji.emojiEmotes; // merged array
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
    var self = dubplus;
    var currentText = this.value;
    var keyCharMin = 3; // when to start showing previews, default to 3 chars
    var cursorPos = $(this).get(0).selectionStart;
    // console.log("cursorPos", cursorPos);
    var strStart;
    var strEnd;
    var inputRegex = new RegExp('(:|@)([&!()\\+\\-_a-z0-9]+)($|\\s)', 'ig');
    var filterText = currentText.replace(inputRegex, function(matched, p1, p2, p3, pos, str){
        // console.dir( arguments );
        strStart = pos;
        strEnd = pos + matched.length;

        previewSearchStr = p2;
        keyCharMin = (p1 === "@") ? 1 : 3;

        if (cursorPos >= strStart && cursorPos <= strEnd) {
            // twitch and emoji
            if (p2 && p2.length >= keyCharMin && p1 === ":" && dubplus.options.let_emoji_preview) {
                self.emojiUtils.addToPreviewList( self.emojiUtils.filterEmoji(p2) );
            }

            // users
            if (p2 && p2.length >= keyCharMin && p1 === "@" && dubplus.options.let_autocomplete_mentions) {
                self.previewList( self.filterUsers(p2) );
            }
        }
        
    });

    var lastChar = currentText.charAt(currentText.length - 1);
    if (self.previewSearchStr.length < keyCharMin ||
        lastChar === ":" ||
        lastChar === " " ||
        currentText === "")
    {
        self.previewSearchStr = "";
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

    if (e.keyCode === 38) {
        self.doNavigate(-1);
    }
    if (e.keyCode === 40) {
        self.doNavigate(1);
    }
    if (e.keyCode === 13 && currentText.length > 0){
        Dubtrack.room.chat.sendMessage();
    }
};

var emoji_preview =function(){
    var newOptionState;
    var optionName = 'emoji_preview';

    if (!dubplus.options.let_emoji_preview) {
        newOptionState = true;
    } else {
        newOptionState = false;
    }

    dubplus.options.let_emoji_preview = newOptionState;
    dubplus.settings = options.toggleAndSave(optionName, newOptionState, dubplus.settings);
};


/**************************************************************************
 * Turn on/off the twitch emoji in chat
 */
var twitch_emotes =function(){
    document.body.addEventListener('twitch:loaded', this.loadBTTVEmotes);
    document.body.addEventListener('bttv:loaded', this.loadTastyEmotes);
    
    var newOptionState;
    var optionName = 'twitch_emotes';

    if (!dubplus.options.let_twitch_emotes) {
        if (!dubplus.twitchJSONSLoaded) {
            loadTwitchEmotes();
        } else {
            this.replaceTextWithEmote();
        }

        Dubtrack.Events.bind("realtime:chat-message", this.replaceTextWithEmote);
        newOptionState = true;
    } else {
        Dubtrack.Events.unbind("realtime:chat-message", this.replaceTextWithEmote);
        newOptionState = false;
    }

    dubplus.options.let_twitch_emotes = newOptionState;
    dubplus.settings = options.toggleAndSave(optionName, newOptionState, dubplus.settings);
};


module.exports = {
    twitch_emotes: twitch_emotes,
    emoji_preview: emoji_preview
};