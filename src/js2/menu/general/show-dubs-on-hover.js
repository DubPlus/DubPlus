import { h, Component } from "preact";
import { MenuSwitch } from "../../components/menuItems.js";
import Modal from "../../components/modal";
import getJSON from "../../utils/getJSON.js";
import userIsAtLeastMod from "../../utils/modcheck.js";
import DubsInfo from "./dubs-hover/dubs-info";

export default class ShowDubsOnHover extends Component {
  state = {
    showWarning: false,
    warned: false,
    upDubs: [],
    downDubs: [],
    grabs: [],
    isOn: false
  };

  turnOn = () => {
    var onState = {
      isOn: true
    };
    if (!this.state.warned) {
      onState.showWarning = true;
      onState.warned = true;
    }
    this.setState(onState, this.begin);
  };

  turnOff = () => {
    this.setState({ isOn: false });
    Dubtrack.Events.unbind("realtime:room_playlist-dub", this.dubWatcher);
    Dubtrack.Events.unbind(
      "realtime:room_playlist-queue-update-grabs",
      this.grabWatcher
    );
    Dubtrack.Events.unbind("realtime:user-leave", this.dubUserLeaveWatcher);
    Dubtrack.Events.unbind("realtime:room_playlist-update", this.resetDubs);
    Dubtrack.Events.unbind("realtime:room_playlist-update", this.resetGrabs); //TODO: Remove when we can hit the api for all grabs of current playing song
  };

  closeModal = () => {
    this.setState({ showWarning: false });
  };

  begin = () => {
    this.resetDubs();

    Dubtrack.Events.bind("realtime:room_playlist-dub", this.dubWatcher);
    Dubtrack.Events.bind(
      "realtime:room_playlist-queue-update-grabs",
      this.grabWatcher
    );
    Dubtrack.Events.bind("realtime:user-leave", this.dubUserLeaveWatcher);
    Dubtrack.Events.bind("realtime:room_playlist-update", this.resetDubs);
    Dubtrack.Events.bind("realtime:room_playlist-update", this.resetGrabs);
  };

  /**
   * the callback for the up and down dub events
   * Stores the user info of who has dubbed the current song in local state
   */
  dubWatcher = e => {
    // split dubs into 2 arrays, one containing current user
    // and one with current user removed. Do the same for both
    // up and down dubs

    const userInUpdubs = [];
    const userRemovedFromUpdubs = this.state.upDubs.filter(function(el) {
      let test = el.userid !== e.user._id;
      if (!test) {
        userInUpdubs.push(el);
      }
      return test;
    });

    const userInDownDubs = [];
    const userRemovedFromDowndubs = this.state.upDubs.filter(function(el) {
      let test = el.userid !== e.user._id;
      if (!test) {
        userInDownDubs.push(el);
      }
      return test;
    });

    if (e.dubtype === "updub") {
      // If user has not updubbed, we add them them to it
      if (userInUpdubs.length <= 0) {
        this.setState(prevState => {
          let newUpDubs = prevState.upDubs.push({
            userid: e.user._id,
            username: e.user.username
          });
          return { upDubs: newUpDubs };
        });
      }

      // and then remove them from downdubs
      this.setState({ downDubs: userRemovedFromDowndubs });
    } else if (e.dubtype === "downdub") {
      // is user has not downdubbed, then we add them
      if (userInDownDubs.length <= 0 && userIsAtLeastMod(Dubtrack.session.id)) {
        this.setState(prevState => {
          let newDownDubs = prevState.downDubs.push({
            userid: e.user._id,
            username: e.user.username
          });
          return { downDubs: newDownDubs };
        });
      }

      //Remove user from other dubtype if exists
      this.setState({ upDubs: userRemovedFromUpdubs });
    }

    var msSinceSongStart =
      new Date() -
      new Date(Dubtrack.room.player.activeSong.attributes.song.played);
    if (msSinceSongStart < 1000) {
      return;
    }

    if (
      this.state.upDubs.length !==
      Dubtrack.room.player.activeSong.attributes.song.updubs
    ) {
      // console.log("Updubs don't match, reset! Song started ", msSinceSongStart, "ms ago!");
      this.resetDubs();
    } else if (
      userIsAtLeastMod(Dubtrack.session.id) &&
      this.state.downDubs.length !==
        Dubtrack.room.player.activeSong.attributes.song.downdubs
    ) {
      // console.log("Downdubs don't match, reset! Song started ", msSinceSongStart, "ms ago!");
      this.resetDubs();
    }
  };

  /**
   * Callback for the grab event
   * Stores user info for each grab in an array in local state
   */
  grabWatcher = e => {
    // only add Grab if it doesn't exist in the array already
    if (
      this.state.grabs.filter(function(el) {
        return el.userid === e.user._id;
      }).length <= 0
    ) {
      this.setState(prevState => {
        let newGrabs = prevState.grabs.push({
          userid: e.user._id,
          username: e.user.username
        });
        return { grabs: newGrabs };
      });
    }
  };

  /**
   * Removes a user from all of the arrays in state when a user logs off
   */
  dubUserLeaveWatcher = e => {
    //Remove user from dub list
    let newUpDubs = this.state.upDubs.filter(el => el.userid !== e.user._id);
    let newDownDubs = this.state.downDubs.filter(
      el => el.userid !== e.user._id
    );
    let newGrabs = this.state.grabs.filter(el => el.userid !== e.user._id);
    this.setState({
      upDubs: newUpDubs,
      downDubs: newDownDubs,
      grabs: newGrabs
    });
  };

  handleReset = () => {
    let updubs = [];
    let downdubs = [];

    // get the current active dubs in the room via api
    const dubsURL = `https://api.dubtrack.fm/room/${
      Dubtrack.room.model.id
    }/playlist/active/dubs`;

    const roomDubs = getJSON(dubsURL);

    roomDubs.then(response => {
      let resp = JSON.parse(response);
      resp.data.upDubs.forEach(e => {
        // Dub already casted (usually from autodub)
        if (
          this.state.upDubs.filter(function(el) {
            return el.userid === e.userid;
          }).length > 0
        ) {
          return;
        }

        // check for user info in the DT room's user collection
        if (
          !Dubtrack.room.users.collection.findWhere({ userid: e.userid }) ||
          !Dubtrack.room.users.collection.findWhere({ userid: e.userid })
            .attributes
        ) {
          // if they don't exist, we can check the user api directly
          let userInfo = getJSON("https://api.dubtrack.fm/user/" + e.userid);
          userInfo.then(response => {
            let resp = JSON.parse(response);
            let data = resp.data;
            if (data && data.userinfo && data.userinfo.username) {
              let username = data.userinfo.username;
              updubs.push({
                userid: e.userid,
                username: username
              });
            }
          });
        } else {
          let username = Dubtrack.room.users.collection.findWhere({
            userid: e.userid
          }).attributes._user.username;

          if (username) {
            updubs.push({
              userid: e.userid,
              username: username
            });
          }
        }
      });

      this.setState(prevState => {
        return {
          upDubs: prevState.upDubs.concat(updubs)
        };
      });

      //Only let mods or higher access down dubs
      if (userIsAtLeastMod(Dubtrack.session.id)) {
        resp.data.downDubs.forEach(e => {
          //Dub already casted
          if (
            this.state.downDubs.filter(function(el) {
              return el.userid === e.userid;
            }).length > 0
          ) {
            return;
          }

          if (
            !Dubtrack.room.users.collection.findWhere({ userid: e.userid }) ||
            !Dubtrack.room.users.collection.findWhere({ userid: e.userid })
              .attributes
          ) {
            let userInfo = getJSON("https://api.dubtrack.fm/user/" + e.userid);
            userInfo.then(response => {
              let resp = JSON.parse(response);
              let data = resp.data;
              if (data && data.userinfo && data.userinfo.username) {
                let username = data.userinfo.username;
                downdubs.push({
                  userid: e.userid,
                  username: username
                });
              }
            });
          } else {
            let username = Dubtrack.room.users.collection.findWhere({
              userid: e.userid
            }).attributes._user.username;
            if (username) {
              downdubs.push({
                userid: e.userid,
                username: username
              });
            }
          }
        });

        this.setState(prevState => {
          return {
            upDubs: prevState.downDubs.concat(downdubs)
          };
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

  render(props, state) {
    let grabElem = document.querySelector(".add-to-playlist-button")
      .parentElement;
    let upElem = document.querySelector(".dubup").parentElement;
    let downElem = document.querySelector(".dubdown").parentElement;

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
        {/* <DubsInfo
          show={state.isOn}
          into={upElem}
          type="updubs"
          dubs={state.upDubs}
        />
        <DubsInfo
          show={state.isOn}
          into={downElem}
          type="downdubs"
          dubs={state.downDubs}
        />
        <DubsInfo
          show={state.isOn}
          into={grabElem}
          type="grabs"
          dubs={state.grabs}
        /> */}
      </MenuSwitch>
    );
  }
}
