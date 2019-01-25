import { h, Component } from "preact";
import Portal from "preact-portal/src/preact-portal";

/**
 * DubsInfo component
 * used to create the grabs, upDubs, and downdubs lists that popup when
 * hovering each of them.
 */
export default class DubsInfo extends Component {
  getBgColor() {
    let whichVote = this.props.type.replace("dubs", "");
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

    return bgColor;
  }

  updateChat(str) {
    const chat = document.getElementById("chat-txt-message");
    chat.value = str;
    chat.focus();
  }

  makeList() {
    return this.props.dubs.map(d => {
      return (
        <li
          onClick={() => this.updateChat("@" + d.username + " ")}
          className={`preview-dubinfo-item users-previews dubplus-${
            this.props.type
          }-hover`}
        >
          <div className="dubinfo-image">
            <img src={`https://api.dubtrack.fm/user/${d.userID}/image`} />
          </div>
          <span className="dubinfo-text">@{d.username}</span>
        </li>
      );
    });
  }

  render({ type }) {
    let notYetMsg = `No ${type} have been casted yet!`;
    if (type === "grabs") {
      notYetMsg = "This song hasn't been grabbed yet!";
    }

    let list = this.makeList();

    let containerCss = [
      "dubinfo-preview",
      "dubinfo-show", 
      `dubplus-${type}-container`
    ];

    if (list.length === 0) {
      list = <li>{notYetMsg}</li>;
      containerCss.push("dubinfo-no-dubs");
    }

    return (
      <ul
        className="dubinfo-preview"
        syle={{ borderColor: this.getBgColor() }}
        className={containerCss.join(" ")}
      >
        {list}
      </ul>
    );
  }
}
