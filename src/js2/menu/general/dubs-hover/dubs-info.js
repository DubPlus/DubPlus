import { h, Component } from "preact";
import Portal from "preact-portal/src/preact-portal";

/**
 * DubsInfo component
 * used to create the grabs, upDubs, and downdubs lists that popup when
 * hovering each of them.
 */
export default class DubsInfo extends Component {
  state = {
    bgColor: "auto"
  };

  getBgColor(whichVote) {
    let elem;
    if (whichVote === "up") {
      elem = document.querySelector(".dubup");
    } else if (whichVote === "down") {
      elem = document.querySelector(".dubdown");
    } else {
      return;
    }

    let bgColor = elem.classList.contains("voted")
      ? window.getComputedStyle(elem).backgroundColor
      : window.getComputedStyle(elem.querySelector(`.icon-${whichVote}vote`))
          .color;

    this.setState({
      bgColor: bgColor
    });
  }

  updateChat(str) {
    const chat = document.getElementById("chat-txt-message");
    chat.value = str;
    chat.focus();
  }

  render({ type, dubs, into, show }) {
    if (!show) {
      return null;
    }

    let list = dubs.map(d => {
      return (
        <li
          onClick={() => this.updateChat("@" + d.username + " ")}
          class={
            "preview-dubinfo-item users-previews " + `dubplus-${type}-hover`
          }
        >
          <div class="dubinfo-image">
            <img src={`https://api.dubtrack.fm/user/${d.userID}/image`} />
          </div>
          <span class="dubinfo-text">@{d.username}</span>
        </li>
      );
    });

    let containerCss = ["dubinfo-show", `dubplus-${type}-container`];
    if (list.length === 0) {
      containerCss.push("dubinfo-no-dubs");
    }

    let notYetMsg = `No ${type} have been casted yet!`;
    if (type === "grabs") {
      notYetMsg = "This song hasn't been grabbed yet!";
    }

    return (
      <Portal into={into}>
        <ul
          id="dubinfo-preview"
          syle={{ backgroundColor: this.getBgColor(type.replace("dubs", "")) }}
          class={containerCss.join(" ")}
        >
          {list.length > 0 ? list : <li>{notYetMsg}</li>}
        </ul>
      </Portal>
    );
  }
}
