"use strict";
import polyfills from "@/utils/polyfills";
polyfills();

import { h, render, Component } from "preact";
import DubPlusMenu from "@/menu/index.js";
import Modal from "@/components/modal.js";
import WaitFor from "@/utils/waitFor.js";
import Loading from "@/components/loading.js";
import cssHelper from "@/utils/css.js";
import MenuIcon from "@/components/MenuIcon.js";
import track from "@/utils/analytics.js";
import dtproxy from "@/utils/DTProxy.js";

// the extension loads the CSS from the load script so we don't need to
// do it here. This is for people who load the script via bookmarklet or userscript
let isExtension = document.getElementById("dubplus-script-ext");
if (!isExtension) {
  setTimeout(function() {
    // start the loading of the CSS asynchronously
    cssHelper.loadExternal(
      "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
    );
    cssHelper.load("/css/dubplus.css");
  }, 10);
}

class DubPlusContainer extends Component {
  state = {
    loading: true,
    error: false,
    errorMsg: "",
    failed: false
  };

  componentDidMount() {
    /* globals Dubtrack */
    if (!window.DubPlus) {
      dtproxy
        .loadCheck()
        .then(() => {
          this.setState({
            loading: false,
            error: false
          });
        })
        .catch(() => {
          if (!dtproxy.sessionId) {
            this.showError("You're not logged in. Please login to use Dub+.");
          } else {
            this.showError("Something happed, refresh and try again");
            track.event("Dub+ lib", "load", "failed");
          }
        });
      return;
    }

    if (!dtproxy.sessionId) {
      this.showError("You're not logged in. Please login to use Dub+.");
    } else {
      this.showError("Dub+ is already loaded");
    }
  }

  showError(msg) {
    this.setState({
      loading: false,
      error: true,
      errorMsg: msg
    });
  }

  render(props, state) {
    if (state.loading) {
      return <Loading />;
    }

    if (state.error) {
      return (
        <Modal
          title="Dub+ Error"
          onClose={() => {
            this.setState({ failed: true, error: false });
          }}
          content={state.errorMsg}
        />
      );
    }

    if (state.failed) {
      return null;
    }

    document.querySelector("html").classList.add("dubplus");
    return <DubPlusMenu />;
  }
}

render(<DubPlusContainer />, document.body);

let navWait = new WaitFor(".header-right-navigation .user-messages", {
  seconds: 60,
  isNode: true
});
navWait.then(() => {
  render(<MenuIcon />, document.querySelector(".header-right-navigation"));
});

// PKGINFO is inserted by the rollup build process
export default _PKGINFO_;
