import { h, Component } from "preact";
import { MenuSwitch } from "../../components/menuItems.js";
import Modal from "../../components/modal";
import getJSON from "../../utils/getJSON.js";
import userIsAtLeastMod from "../../utils/modcheck.js";
import DubsInfo from "./dubs-hover/dubs-info";
import Portal from "preact-portal/src/preact-portal";

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
        showWarning : true,
        warned :true
      });
    }
    this.begin();
  };

  turnOff = () => {
    Dubtrack.Events.unbind("realtime:room_playlist-dub", this.dubWatcher);
    Dubtrack.Events.unbind("realtime:room_playlist-queue-update-grabs",this.grabWatcher);
    Dubtrack.Events.unbind("realtime:user-leave", this.dubUserLeaveWatcher);
    Dubtrack.Events.unbind("realtime:room_playlist-update", this.resetDubs);
    
    //TODO: Remove when we can hit the api for all grabs of current playing song
    Dubtrack.Events.unbind("realtime:room_playlist-update", this.resetGrabs); 
  };

  closeModal = () => {
    this.setState({ showWarning: false });
  };

  begin = () => {
    this.resetDubs();

    Dubtrack.Events.bind("realtime:room_playlist-dub", this.dubWatcher);
    Dubtrack.Events.bind("realtime:room_playlist-queue-update-grabs",this.grabWatcher);
    Dubtrack.Events.bind("realtime:user-leave", this.dubUserLeaveWatcher);
    Dubtrack.Events.bind("realtime:room_playlist-update", this.resetDubs);
    Dubtrack.Events.bind("realtime:room_playlist-update", this.resetGrabs);
  };

  /**
   * the callback for the up and down dub events
   * Stores the user info of who has dubbed the current song in local state
   */
  dubWatcher = e => {
    let {upDubs, downDubs} = this.state;

    let user = {
      userid: e.user._id,
      username: e.user.username
    };

    if (e.dubtype === "updub") {
      let userNotUpdubbed = upDubs.filter(el => el.userid === e.user._id).length === 0;
      // If user has not updubbed, we add them them to it
      if (userNotUpdubbed) {
        this.setState(prevState => {
          return { upDubs: [...prevState.upDubs, user] };
        });
      }

      let userDowndubbed = downDubs.filter(el => el.userid === e.user._id).length > 0;
      // if user was previous in downdubs then remove them from downdubs
      if (userDowndubbed) {
        this.setState(prevState => {
          return { downDubs: prevState.downDubs.filter(el => el.userid !== e.user._id) };
        });
      }
    }
    
    if (e.dubtype === "downdub") {
      let userNotDowndub = downDubs.filter(el => el.userid === e.user._id).length === 0;
      // is user has not downdubbed, then we add them
      if (userNotDowndub && userIsAtLeastMod(Dubtrack.session.id)) {
        this.setState(prevState => {
          return { downDubs: [...prevState.downDubs, user] };
        });
      }

      //Remove user from from updubs
      let userUpdubbed = upDubs.filter(el => el.userid === e.user._id).length > 0;
      // and then remove them from downdubs
      if (userUpdubbed) {
        this.setState(prevState => {
          return { upDubs: prevState.upDubs.filter(el => el.userid !== e.user._id) };
        });
      }
    }
  };

  /**
   * Callback for the grab event
   * Stores user info for each grab in an array in local state
   */
  grabWatcher = e => {
    // only add Grab if it doesn't exist in the array already
    if (this.state.grabs.filter(el => el.userid === e.user._id).length <= 0) {
      let user = {
          userid: e.user._id,
          username: e.user.username
      };
      this.setState(prevState => {
        return { grabs: [...prevState.grabs, user] };
      });
    }
  };

  /**
   * Removes a user from all of the arrays in state when a user logs off
   */
  dubUserLeaveWatcher = e => {
    let newUpDubs = this.state.upDubs.filter(el => el.userid !== e.user._id);
    let newDownDubs = this.state.downDubs.filter(el => el.userid !== e.user._id);
    let newGrabs = this.state.grabs.filter(el => el.userid !== e.user._id);
    this.setState({
      upDubs: newUpDubs,
      downDubs: newDownDubs,
      grabs: newGrabs
    });
  };

  /**
   * Callback for resetDubs()'s setState
   * Wipes out local state and repopulates with data from the api
   */
  handleReset() {
    // get the current active dubs in the room via api
    const dubsURL = `https://api.dubtrack.fm/room/${Dubtrack.room.model.id}/playlist/active/dubs`;

    const roomDubs = getJSON(dubsURL);

    roomDubs.then(json => {
      // loop through all the upDubs in the room and add them to our local state
      json.data.upDubs.forEach(e => {
        // Dub already casted (usually from autodub)
        if (this.state.upDubs.filter(el => el.userid === e.userid).length > 0) {
          return;
        }

        // to get username we check for user info in the DT room's user collection
        let checkUser = Dubtrack.room.users.collection.findWhere({ userid: e.userid });
        if (!checkUser || !checkUser.attributes) {
          // if they don't exist, we can check the user api directly
          let userInfo = getJSON("https://api.dubtrack.fm/user/" + e.userid);
          userInfo.then(json2 => {
            let data = json2.data;
            if (data && data.userinfo && data.userinfo.username) {
              let user = {
                userid: e.userid,
                username: data.userinfo.username
              };
              this.setState(prevState => {
                return {
                  upDubs: [...prevState.upDubs, user]
                };
              });
            }
          });
          return;
        }
        
        if (checkUser.attributes._user.username) {
          let user = {
            userid: e.userid,
            username: checkUser.attributes._user.username
          };
          this.setState(prevState => {
            return {
              upDubs: [...prevState.upDubs, user]
            };
          });
        }
      });

      //Only let mods or higher access down dubs
      if (userIsAtLeastMod(Dubtrack.session.id)) {
        json.data.downDubs.forEach(e => {
          //Dub already casted
          if (this.state.downDubs.filter(el => el.userid === e.userid).length > 0) {
            return;
          }
          
          let checkUsers = Dubtrack.room.users.collection.findWhere({ userid: e.userid });
          if (!checkUsers || !checkUsers.attributes) {
            let userInfo = getJSON("https://api.dubtrack.fm/user/" + e.userid);
            userInfo.then(json3 => {
              let data = json3.data;
              if (data && data.userinfo && data.userinfo.username) {
                let user = {
                  userid: e.userid,
                  username: data.userinfo.username
                };
                this.setState(prevState => {
                  return {
                    downDubs: [...prevState.downDubs, user]
                  };
                });
              }
            });
            return;
          }

          if (checkUsers.attributes._user.username) {
            let user = {
              userid: e.userid,
              username: checkUsers.attributes._user.username
            };
            this.setState(prevState => {
              return {
                downDubs: [...prevState.downDubs, user]
              };
            });
          }
        });
      }
    });
  };

  resetDubs = () => {
    this.setState(
      {
        upDubs: [],
        downDubs: []
      },
      this.handleReset
    );
  };

  resetGrabs = () => {
    this.setState({grabs: []});
  }

  
  componentWillMount() {
    this.upElem = document.querySelector(".dubup").parentElement;
    this.upElem.classList.add('dubtrack-updub');
    
    this.grabElem = document.querySelector(".add-to-playlist-button").parentElement;
    this.grabElem.classList.add('dubtrack-grab');

    this.downElem = document.querySelector(".dubdown").parentElement;
    this.downElem.classList.add('dubtrack-downdub');
  }
  

  render(props, state) {
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
          title="Vote &amp; Grab Info"
          content="Please note that this feature is currently still in development. We are waiting on the ability to pull grab vote information from Dubtrack on load. Until then the only grabs you will be able to see are those you are present in the room for."
          onClose={this.closeModal}
        />
        <Portal into={this.upElem}>
          <DubsInfo
            type="updubs"
            dubs={state.upDubs}
          />
        </Portal>
        <Portal into={this.downElem}>
          <DubsInfo
            type="downdubs"
            dubs={state.downDubs}
          />
        </Portal>
        <Portal into={this.grabElem}>
          <DubsInfo
            type="grabs"
            dubs={state.grabs}
          />
        </Portal>
      </MenuSwitch>
    );
  }
}
