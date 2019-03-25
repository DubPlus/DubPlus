import { h, Component } from "preact";
import { MenuSwitch } from "@/components/menuItems.js";
import Modal from "@/components/modal";
import DubsInfo from "./show-dubs-info";
import Portal from "preact-portal/src/preact-portal";
import dtproxy from "@/utils/DTProxy.js";

export default class ShowDubsOnHover extends Component {
  state = {
    isOn: false,
    showWarning: false,
    upDubs: [],
    downDubs: [],
    grabs: []
  };

  userIsMod = dtproxy.modCheck();

  turnOn = () => {
    this.setState({ isOn: true }, this.resetDubs);

    dtproxy.events.onSongVote(this.dubWatcher);
    dtproxy.events.onSongGrab(this.grabWatcher);
    dtproxy.events.onUserLeave(this.dubUserLeaveWatcher);
    dtproxy.events.onPlaylistUpdate(this.resetDubs);
    dtproxy.events.onPlaylistUpdate(this.resetGrabs);
  };

  turnOff = () => {
    this.setState({ isOn: false });

    dtproxy.events.offSongVote(this.dubWatcher);
    dtproxy.events.offSongGrab(this.grabWatcher);
    dtproxy.events.offUserLeave(this.dubUserLeaveWatcher);
    dtproxy.events.offPlaylistUpdate(this.resetDubs);
    dtproxy.events.offPlaylistUpdate(this.resetGrabs);
  };

  closeModal = () => {
    this.setState({ showWarning: false });
  };

  /**
   * the callback for the up and down dub events
   * Stores the user info of who has dubbed the current song in local state
   */
  dubWatcher = e => {
    let { upDubs, downDubs } = this.state;

    let user = {
      userid: e.user._id,
      username: e.user.username
    };

    if (e.dubtype === "updub") {
      let userNotUpdubbed =
        upDubs.filter(el => el.userid === e.user._id).length === 0;
      // If user has not updubbed, we add them them to it
      if (userNotUpdubbed) {
        this.setState(prevState => {
          return { upDubs: [...prevState.upDubs, user] };
        });
      }

      // then remove them from downdubs
      let userDowndubbed =
        downDubs.filter(el => el.userid === e.user._id).length > 0;
      if (userDowndubbed) {
        this.setState(prevState => {
          return {
            downDubs: prevState.downDubs.filter(el => el.userid !== e.user._id)
          };
        });
      }
    }

    if (e.dubtype === "downdub") {
      let userNotDowndub =
        downDubs.filter(el => el.userid === e.user._id).length === 0;
      // is user has not downdubbed, then we add them
      if (userNotDowndub && this.userIsMod) {
        this.setState(prevState => {
          return { downDubs: [...prevState.downDubs, user] };
        });
      }

      //Remove user from from updubs
      let userUpdubbed =
        upDubs.filter(el => el.userid === e.user._id).length > 0;
      if (userUpdubbed) {
        this.setState(prevState => {
          return {
            upDubs: prevState.upDubs.filter(el => el.userid !== e.user._id)
          };
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

  getUserData(userid, whichVote) {
    // if they don't exist, we can check the user api directly
    let userInfo = dtproxy.api.getUserData(userid);
    userInfo.then(json => {
      let data = json.data;
      if (data && data.userinfo && data.userinfo.username) {
        let user = {
          userid: e.userid,
          username: data.userinfo.username
        };
        this.setState(prevState => {
          if (whichVote === "down") {
            return {
              downDubs: [...prevState.downDubs, user]
            };
          }
          if (whichVote === "up") {
            return {
              upDubs: [...prevState.upDubs, user]
            };
          }
        });
      }
    });
  }

  /**
   * Callback for resetDubs()'s setState
   * Wipes out local state and repopulates with data from the api
   */
  handleReset() {
    // get the current active dubs in the room via api
    const roomDubs = dtproxy.api.getActiveDubs();

    roomDubs
      .then(json => {
        // loop through all the upDubs in the room and add them to our local state
        if (json.data && json.data.upDubs) {
          json.data.upDubs.forEach(e => {
            // Dub already casted (usually from autodub)
            if (
              this.state.upDubs.filter(el => el.userid === e.userid).length > 0
            ) {
              return;
            }

            // to get username we check for user info in the DT room's user collection
            let checkUser = dtproxy.getUserInfo(e.userid);
            if (!checkUser || !checkUser.attributes) {
              // if they don't exist, we can check the user api directly
              this.getUserData(e.userid, "up");
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
        }

        //Only let mods or higher access down dubs
        if (json.data && json.data.downDubs && this.userIsMod) {
          json.data.downDubs.forEach(e => {
            //Dub already casted
            if (
              this.state.downDubs.filter(el => el.userid === e.userid).length >
              0
            ) {
              return;
            }

            let checkUsers = dtproxy.getUserInfo(e.userid);
            if (!checkUsers || !checkUsers.attributes) {
              this.getUserData(e.userid, "down");
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
      })
      .catch(function(err) {
        console.error(err);
      });
  }

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
    this.setState({ grabs: [] });
  };

  componentWillMount() {
    this.upElem = dtproxy.dom.upVote.parentElement;
    this.upElem.classList.add("dubplus-updub-btn");

    this.downElem = dtproxy.dom.downVote.parentElement;
    this.downElem.classList.add("dubplus-downdub-btn");

    this.grabElem = dtproxy.dom.grabBtn.parentElement;
    this.grabElem.classList.add("dubplus-grab-btn");
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
        {state.isOn ? (
          <>
            <Portal into={this.upElem}>
              <DubsInfo type="updubs" dubs={state.upDubs} />
            </Portal>
            <Portal into={this.downElem}>
              <DubsInfo
                type="downdubs"
                isMod={this.userIsMod}
                dubs={state.downDubs}
              />
            </Portal>
            <Portal into={this.grabElem}>
              <DubsInfo type="grabs" dubs={state.grabs} />
            </Portal>
          </>
        ) : null}
      </MenuSwitch>
    );
  }
}
