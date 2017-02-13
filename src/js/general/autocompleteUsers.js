/* globals dubplus */
dubplus.filterUsers = function(str){
    var re = new RegExp('^@' + str, "i");
    return dubplus.roomUsers.filter(function(val){
        return re.test(val.text);
    });
};
dubplus.updateUsersArray =  function(){
    var self = dubplus;
    self.roomUsers = []; // clear, start over
    Dubtrack.room.users.collection.models.forEach(function(val,i, arr){
        var u = val.attributes._user;
        self.roomUsers.push({
            src : "https://api.dubtrack.fm/user/"+u._id+"/image",
            text : "@" + u.username,
            cn : "users"
        });
    });
};
dubplus.userAutoComplete =  function(){
    //Remove keydown event chat view to replace with our event
    Dubtrack.room.chat.delegateEvents(_(Dubtrack.room.chat.events).omit('keydown input#chat-txt-message'));

    $(document.body).on('keyup', "#chat-txt-message", this.chatInputKeyupFunc);
    dubplus.whenAvailable("Dubtrack.room.users", dubplus.updateUsersArray);
    Dubtrack.Events.bind("realtime:user-ban", dubplus.updateUsersArray);
    Dubtrack.Events.bind("realtime:user-join", dubplus.updateUsersArray);
    Dubtrack.Events.bind("realtime:user-kick", dubplus.updateUsersArray);
    Dubtrack.Events.bind("realtime:user-leave", dubplus.updateUsersArray);
};