/**
 * Show downvotes in chat
 * only mods can use this
 */

/*global Dubtrack */
var myModule = {};
myModule.id = "dubplus-grabschat";
myModule.moduleName = "Grabs in Chat";
myModule.description = "Toggle showing grabs in the chat box";
myModule.category = "General";

myModule.grabChatWatcher = function(e) {
  var user = Dubtrack.session.get('username');
  var currentDj = Dubtrack.room.users.collection.findWhere({
    userid: Dubtrack.room.player.activeSong.attributes.song.userid
  }).attributes._user.username;

  if(user === currentDj && !Dubtrack.room.model.get('displayUserGrab')){
    let newChat = `
      <li class="dubplus-chat-system dubplus-chat-system-grab">
        <div class="chatDelete" onclick="dubplus.deleteChatMessageClientSide(this)">
          <span class="icon-close"></span>
        </div>
        <div class="text">
          @${e.user.username} has grabbed your song ${Dubtrack.room.player.activeSong.attributes.songInfo.name}
        </div>
      </li>`;

    $('ul.chat-main').append(newChat);
  }
};

myModule.turnOn = function() {
  Dubtrack.Events.bind("realtime:room_playlist-queue-update-grabs", this.grabChatWatcher);

  // add this function to our global dubplus object so that chat
  // items can be deleted
  if (typeof window.dubplus.deleteChatMessageClientSide !== 'function') {
    window.dubplus.deleteChatMessageClientSide = function(el){
      $(el).parent('li')[0].remove();
    };
  }
  
};

myModule.turnOff = function() {
  Dubtrack.Events.unbind("realtime:room_playlist-queue-update-grabs", this.grabChatWatcher);
};

module.exports = myModule;