/**
 * Show downvotes in chat
 * only mods can use this
 */

/*global Dubtrack */
var myModule = {};
myModule.id = "dubplus-updubs";
myModule.moduleName = "Updubs in Chat";
myModule.description = "Toggle showing updubs in the chat box";
myModule.category = "General";

myModule.updubWatcher = function(e) {
  var user = QueUp.session.get('username');
  var currentDj = QueUp.room.users.collection.findWhere({
    userid: QueUp.room.player.activeSong.attributes.song.userid
  }).attributes._user.username;

  if(user === currentDj && e.dubtype === 'updub'){
    let newChat = `
      <li class="dubplus-chat-system dubplus-chat-system-updub">
        <div class="chatDelete" onclick="dubplus.deleteChatMessageClientSide(this)">
          <span class="icon-close"></span>
        </div>
        <div class="text">
          @${e.user.username} has updubbed your song ${QueUp.room.player.activeSong.attributes.songInfo.name}
        </div>
      </li>`;

    $('ul.chat-main').append(newChat);
  }
};

myModule.turnOn = function() {
  QueUp.Events.bind("realtime:room_playlist-dub", this.updubWatcher);

  // add this function to our global dubplus object so that chat
  // items can be deleted
  if (typeof window.dubplus.deleteChatMessageClientSide !== 'function') {
    window.dubplus.deleteChatMessageClientSide = function(el){
      $(el).parent('li')[0].remove();
    };
  }
  
};

myModule.turnOff = function() {
  QueUp.Events.unbind("realtime:room_playlist-dub", this.updubWatcher);
};

module.exports = myModule;