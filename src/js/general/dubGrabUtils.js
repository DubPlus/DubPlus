dubplus.userIsAtLeastMod = function(userid){
    return Dubtrack.helpers.isDubtrackAdmin(userid) ||
            Dubtrack.room.users.getIfOwner(userid) ||
            Dubtrack.room.users.getIfManager(userid) ||
            Dubtrack.room.users.getIfMod(userid);
};

dubplus.deleteChatMessageClientSide = function(el){
  $(el).parent('li')[0].remove();
};

dubplus.dubWatcher = function(e){
    if(e.dubtype === 'updub'){
        //If dub already casted
        if($.grep(dubplus.dubs.upDubs, function(el){ return el.userid === e.user._id; }).length <= 0){
            dubplus.dubs.upDubs.push({
                userid: e.user._id,
                username: e.user.username
            });
        }

        //Remove user from other dubtype if exists
        if($.grep(dubplus.dubs.downDubs, function(el){ return el.userid === e.user._id; }).length > 0){
            $.each(dubplus.dubs.downDubs, function(i){
                if(dubplus.dubs.downDubs[i].userid === e.user._id) {
                    dubplus.dubs.downDubs.splice(i,1);
                    return false;
                }
            });
        }
    }
    else if(e.dubtype === 'downdub'){
        //If dub already casted
        if($.grep(dubplus.dubs.downDubs, function(el){ return el.userid === e.user._id; }).length <= 0 && dubplus.userIsAtLeastMod(Dubtrack.session.id)){
            dubplus.dubs.downDubs.push({
                userid: e.user._id,
                username: e.user.username
            });
        }

        //Remove user from other dubtype if exists
        if($.grep(dubplus.dubs.upDubs, function(el){ return el.userid === e.user._id; }).length > 0){
            $.each(dubplus.dubs.upDubs, function(i){
                if(dubplus.dubs.upDubs[i].userid === e.user._id) {
                    dubplus.dubs.upDubs.splice(i,1);
                    return false;
                }
            });
        }
    }

    var msSinceSongStart = new Date() - new Date(Dubtrack.room.player.activeSong.attributes.song.played);
    if(msSinceSongStart < 1000) return;

    if(dubplus.dubs.upDubs.length !== Dubtrack.room.player.activeSong.attributes.song.updubs){
        // console.log("Updubs don't match, reset! Song started ", msSinceSongStart, "ms ago!");
        dubplus.resetDubs();
    }
    else if(dubplus.userIsAtLeastMod(Dubtrack.session.id) && dubplus.dubs.downDubs.length !== Dubtrack.room.player.activeSong.attributes.song.downdubs){
        // console.log("Downdubs don't match, reset! Song started ", msSinceSongStart, "ms ago!");
        dubplus.resetDubs();
    }
    // TODO: Uncomment this else if block when we can hit the api for all grabs of current playing song
    /*
    else if(dubplus.dubs.grabs.length !== parseInt($('.grab-counter')[0].innerHTML)){
        console.log("Grabs don't match, reset! Song started ", msSinceSongStart, "ms ago!");
        dubplus.resetDubs();
    }*/
};

dubplus.resetDubs = function(){
    dubplus.dubs.upDubs = [];
    dubplus.dubs.downDubs = [];
    // dubplus.dubs.grabs: [] //TODO: Uncomment this when we can hit the api for all grabs of current playing song

    $.getJSON("https://api.dubtrack.fm/room/" + Dubtrack.room.model.id + "/playlist/active/dubs", function(response){
        response.data.upDubs.forEach(function(e){
            //Dub already casted (usually from autodub)
            if($.grep(dubplus.dubs.upDubs, function(el){ return el.userid == e.userid; }).length > 0){
                return;
            }

            var username;
            if(!Dubtrack.room.users.collection.findWhere({userid: e.userid}) || !Dubtrack.room.users.collection.findWhere({userid: e.userid}).attributes) {
                $.getJSON("https://api.dubtrack.fm/user/" + e.userid, function(response){
                    if(response && response.userinfo)
                        username = response.userinfo.username;
                });
            }
            else{
                username = Dubtrack.room.users.collection.findWhere({userid: e.userid}).attributes._user.username;
            }

            if(!username) return;

            dubplus.dubs.upDubs.push({
                userid: e.userid,
                username: username
            });
        });
        //TODO: Uncomment this when we can hit the api for all grabs of current playing song
        /*response.data.grabs.forEach(function(e){
            //Dub already casted (usually from autodub)
            if($.grep(dubplus.dubs.grabs, function(el){ return el.userid == e.userid; }).length > 0){
                return;
            }

            var username;
            if(!Dubtrack.room.users.collection.findWhere({userid: e.userid}) || !Dubtrack.room.users.collection.findWhere({userid: e.userid}).attributes) {
                $.getJSON("https://api.dubtrack.fm/user/" + e.userid, function(response){
                    username = response.userinfo.username;
                });
            }
            else{
                username = Dubtrack.room.users.collection.findWhere({userid: e.userid}).attributes._user.username;
            }

            dubplus.dubs.grabs.push({
                userid: e.userid,
                username: username
            })
        });*/

        //Only let mods or higher access down dubs
        if(dubplus.userIsAtLeastMod(Dubtrack.session.id)){
            response.data.downDubs.forEach(function(e){
                //Dub already casted
                if($.grep(dubplus.dubs.downDubs, function(el){ return el.userid == e.userid; }).length > 0){
                    return;
                }

                var username;
                if(!Dubtrack.room.users.collection.findWhere({userid: e.userid}) || !Dubtrack.room.users.collection.findWhere({userid: e.userid}).attributes) {
                    $.getJSON("https://api.dubtrack.fm/user/" + e.userid, function(response){
                        username = response.userinfo.username;
                    });
                }
                else{
                    username = Dubtrack.room.users.collection.findWhere({userid: e.userid}).attributes._user.username;
                }

                dubplus.dubs.downDubs.push({
                    userid: e.userid,
                    username: Dubtrack.room.users.collection.findWhere({userid: e.userid}).attributes._user.username
                });
            });
        }
    });
};