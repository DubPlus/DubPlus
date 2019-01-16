import { h, Component } from "preact";
import { MenuSwitch } from "../../components/menuItems.js";
import Modal from "../../components/modal";
// userIsAtLeastMod

export default class ShowDubsOnHover extends Component {
  state = {
    showWarning: false,
    warned: false,
    upDubs: [],
    downDubs: [],
    grabs: []
  };

  turnOn = () => {
    if (!this.state.warned) {
      this.setState({
        showWarning: true,
        warned: true
      });
    }

    this.begin();
  };

  turnOff() {
    Dubtrack.Events.unbind("realtime:room_playlist-dub", this.dubWatcher);
    Dubtrack.Events.unbind(
      "realtime:room_playlist-queue-update-grabs",
      this.grabWatcher
    );
    Dubtrack.Events.unbind("realtime:user-leave", this.dubUserLeaveWatcher);
    Dubtrack.Events.unbind("realtime:room_playlist-update", this.resetDubs);
    Dubtrack.Events.unbind("realtime:room_playlist-update", this.resetGrabs); //TODO: Remove when we can hit the api for all grabs of current playing song
  }

  closeModal = () => {
    this.setState({ showWarning: false });
  };

  begin() {
    this.resetDubs();

    Dubtrack.Events.bind("realtime:room_playlist-dub", this.dubWatcher);
    Dubtrack.Events.bind("realtime:room_playlist-queue-update-grabs",this.grabWatcher);
    Dubtrack.Events.bind("realtime:user-leave", this.dubUserLeaveWatcher);
    Dubtrack.Events.bind("realtime:room_playlist-update", this.resetDubs);
    Dubtrack.Events.bind("realtime:room_playlist-update", this.resetGrabs);
  }
  
  /**
   * the callback for the up and down dub events
   * Stores the user info of who has dubbed the current song in local state
   */
  dubWatcher = (e) => {

    if(e.dubtype === 'updub'){
  
      // If dub not already casted
      if(this.state.upDubs.filter(function(el){ return el.userid === e.user._id; }).length <= 0){
        this.setState((state) => {
          let newUpDubs = [...state.upDubs].push({
            userid: e.user._id,
            username: e.user.username
          })
          return {upDubs: newUpDubs};
        });
      }
      
      // Remove user from downdubs if exists
      let filteredDownDubs = this.state.downDubs.filter(function(el){ return el.userid !== e.user._id; });
      this.setState({downDubs: filteredDownDubs});
      
    } else if (e.dubtype === 'downdub'){
  
      //If dub not already casted
      if(this.state.downDubs.filter(function(el){ return el.userid === e.user._id; }).length <= 0 && userIsAtLeastMod(Dubtrack.session.id)){
          this.setState((state) => {
            let newDownDubs = [...state.downDubs].push({
              userid: e.user._id,
              username: e.user.username
            })
            return {downDubs: newDownDubs};
          });
      }
  
      //Remove user from other dubtype if exists
      let filteredUpDubs = this.state.upDubs.filter(function(el){ return el.userid !== e.user._id; });
      this.setState({upDubs: filteredUpDubs});
  
    }
  
    var msSinceSongStart = new Date() - new Date(Dubtrack.room.player.activeSong.attributes.song.played);
    if(msSinceSongStart < 1000) {return;}
  
    if(this.state.upDubs.length !== Dubtrack.room.player.activeSong.attributes.song.updubs){
      // console.log("Updubs don't match, reset! Song started ", msSinceSongStart, "ms ago!");
      this.resetDubs();
    } else if(userIsAtLeastMod(Dubtrack.session.id) && this.state.downDubs.length !== Dubtrack.room.player.activeSong.attributes.song.downdubs){
      // console.log("Downdubs don't match, reset! Song started ", msSinceSongStart, "ms ago!");
      this.resetDubs();
    }
  }

  /**
   * Callback for the grab event
   * Stores user info for each grab in an array in local state
   */
  grabWatcher = (e) => {
    // only add Grab if it doesn't exist in the array already
    if(this.state.grabs.filter(function(el){ return el.userid === e.user._id; }).length <= 0){
      this.setState((state) => {
        let newGrabs = [...state.grabs].push({
          userid: e.user._id,
          username: e.user.username
        })
        return {grabs: newGrabs};
      });
    }
  }

  /**
   * Removes a user from all of the arrays in state when a user logs off
   */
  dubUserLeaveWatcher = (e) => {
    //Remove user from dub list
    let newUpDubs = this.state.upDubs.filter( el => el.userid !== e.user._id );
    let newDownDubs = this.state.downDubs.filter( el => el.userid !== e.user._id );
    let newGrabs = this.state.grabs.filter( el => el.userid !== e.user._id );
    this.setState({
      upDubs: newUpDubs,
      downDubs : newDownDubs,
      grabs: newGrabs
    });
  }

  /**
   * 
   */
  resetDubs = function(){
    this.setState({
      upDubs: [],
      downDubs: []
    });
  
    var dubsURL = "https://api.dubtrack.fm/room/" + Dubtrack.room.model.id + "/playlist/active/dubs";
    $.getJSON(dubsURL, (response)=>{
      response.data.upDubs.forEach((e)=>{
        //Dub already casted (usually from autodub)
        if($.grep(window.dubplus.dubs.upDubs, function(el){ return el.userid === e.userid; }).length > 0){
          return;
        }
  
        var username;
        if(!Dubtrack.room.users.collection.findWhere({userid: e.userid}) || 
           !Dubtrack.room.users.collection.findWhere({userid: e.userid}).attributes) {
            $.getJSON("https://api.dubtrack.fm/user/" + e.userid, function(response){
                if(response && response.userinfo) {
                  username = response.userinfo.username;
                }
            });
        } else {
          username = Dubtrack.room.users.collection.findWhere({userid: e.userid}).attributes._user.username;
        }
  
        if(!username) { return; }
  
        window.dubplus.dubs.upDubs.push({
            userid: e.userid,
            username: username
        });
      });

      //Only let mods or higher access down dubs
      if(userIsAtLeastMod(Dubtrack.session.id)){
        response.data.downDubs.forEach(function(e){
          //Dub already casted
          if($.grep(window.dubplus.dubs.downDubs, function(el){ return el.userid === e.userid; }).length > 0){
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
  
          window.dubplus.dubs.downDubs.push({
              userid: e.userid,
              username: Dubtrack.room.users.collection.findWhere({userid: e.userid}).attributes._user.username
          });
        });
      }
    });
  }

  render() {
    return (
      <MenuSwitch
        id="dubplus-dubs-hover"
        section="General"
        menuTitle="Show Dub info on Hover"
        desc="Show Dub info on Hover."
        turnOn={this.turnOn}
        turnOff={this.turnOff}
      >
        <Modal
          open={state.showWarning}
          title="Grab Vote Info"
          content="Please note that this feature is currently still in development. We are waiting on the ability to pull grab vote information from Dubtrack on load. Until then the only grabs you will be able to see are those you are present in the room for."
          onClose={this.closeModal}
        />
      </MenuSwitch>
    );
  }
}
