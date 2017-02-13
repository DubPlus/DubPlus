dubplus.customMentions = function(e) {
    if(e && e.target && (e.target.className === 'for_content_edit' || e.target.className === 'fi-pencil')) {return;}

    if (!dubplus.options.let_custom_mentions) {
        dubplus.options.let_custom_mentions = true;
        Dubtrack.Events.bind("realtime:chat-message", this.customMentionCheck);
        dubplus.on('.custom_mentions');
    } else {
        dubplus.options.let_custom_mentions = false;
        Dubtrack.Events.unbind("realtime:chat-message", this.customMentionCheck);
        dubplus.off('.custom_mentions');
    }
};
dubplus.customMentionCheck = function(e) {
    var content = e.message.toLowerCase();
    if (dubplus.options.let_custom_mentions) {
        if (localStorage.getItem('custom_mentions')) {
            var customMentions = localStorage.getItem('custom_mentions').toLowerCase().split(',');
            if(Dubtrack.session.id !== e.user.userInfo.userid && customMentions.some(function(v) { return content.indexOf(v.trim(' ')) >= 0; })){
                Dubtrack.room.chat.mentionChatSound.play();
            }
        }
    }
};
dubplus.createCustomMentions = function() {
    var current = localStorage.getItem('custom_mentions');
    dubplus.input('Custom Mention Triggers (separate by comma)',current,'separate, custom triggers, by, comma, :heart:','confirm-for315','255');
    $('.confirm-for315').click(dubplus.saveCustomMentions);
},
dubplus.saveCustomMentions = function() {
    var customMentions = $('.input').val();
    dubplus.saveOption('custom_mentions', customMentions);
    $('.onErr').remove();
};