dubplus.grabChat = function(){
    if(!dubplus.options.let_grab_chat_notifications){
        dubplus.options.let_grab_chat_notifications = true;
        dubplus.saveOption('grab_chat', 'true');
        dubplus.on('.grab_chat');

        Dubtrack.Events.bind("realtime:room_playlist-queue-update-grabs", this.grabChatWatcher);
    }
    else{
        dubplus.options.let_grab_chat_notifications = false;
        dubplus.saveOption('grab_chat', 'false');
        dubplus.off('.grab_chat');

        Dubtrack.Events.unbind("realtime:room_playlist-queue-update-grabs", this.grabChatWatcher);
    }
};
dubplus.grabChatWatcher = function(e){
    var user = Dubtrack.session.get('username');
    var currentDj = Dubtrack.room.users.collection.findWhere({
        userid: Dubtrack.room.player.activeSong.attributes.song.userid
    }).attributes._user.username;


    if(user === currentDj && !Dubtrack.room.model.get('displayUserGrab')){
        $('ul.chat-main').append(
            '<li class="dubplus-chat-system dubplus-chat-system-grab">' +
                '<div class="chatDelete" onclick="dubplus.deleteChatMessageClientSide(this)"><span class="icon-close"></span></div>' +
                '<div class="text">' +
                    '@' + e.user.username + ' has grabbed your song \'' + Dubtrack.room.player.activeSong.attributes.songInfo.name + ' \'' +
                '</div>' +
            '</li>');
    }

};

dubplus.resetGrabs = function(){
  dubplus.dubs.grabs = []; //TODO: Remove when we can hit the api for all grabs of current playing song
};

dubplus.grabInfoWarning = function(){
    if(!dubplus.options.let_dubs_hover){
        dubplus.input('Grab Vote Info', 'Please note that this feature is currently still in development. We are waiting on the ability to pull grab vote information from Dubtrack on load. Until then the only grabs you will be able to see are those you are present in the room for.', null, 'confirm-for-grab-info');
        $('.confirm-for-grab-info').click(dubplus.closeErr);
    }
};