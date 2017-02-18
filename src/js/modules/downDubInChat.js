/**
 * Show downvotes in chat
 * only mods can use this
 */

/*global Dubtrack */
import userIsAtLeastMod from '../utils/modcheck.js';

var myModule = {};
myModule.id = "dubplus-downdubs";
myModule.moduleName = "Show Downdubs in Chat (mods only)";
myModule.description = "Toggle showing downdubs in the chat box (mods only)";
myModule.category = "General";

myModule.downdubWatcher = function(e) {
  var user = Dubtrack.session.get('username');
  var currentDj = Dubtrack.room.users.collection.findWhere({
    userid: Dubtrack.room.player.activeSong.attributes.song.userid
  }).attributes._user.username;

  if(user === currentDj && e.dubtype === 'downdub'){
    let newChat = `
      <li class="dubx-chat-system dubx-chat-system-downdub">
        <div class="chatDelete" onclick="dubplus.deleteChatMessageClientSide(this)"><span class="icon-close"></span></div>
        <div class="text">
          @${e.user.username} has downdubbed your song ${Dubtrack.room.player.activeSong.attributes.songInfo.name}
        </div>
      </li>`;

    $('ul.chat-main').append(newChat);
  }
};

myModule.start = function() {
  if(!userIsAtLeastMod(Dubtrack.session.id)) {
    return;
  }

  Dubtrack.Events.bind("realtime:room_playlist-dub", this.downdubWatcher.bind(this));

  // add this function to our global dubplus object so that downdubbed chat
  // items can be deleted
  if (typeof window.dubplus.deleteChatMessageClientSide !== 'function') {
    window.dubplus.deleteChatMessageClientSide = function(el){
      $(el).parent('li')[0].remove();
    };
  }
  
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
    newOptionState = false;
    Dubtrack.Events.unbind("realtime:room_playlist-dub", this.downdubWatcher);
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = myModule;