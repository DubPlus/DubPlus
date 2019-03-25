import { h, Component } from "preact";
import dtproxy from "@/utils/DTProxy";

const DubsInfoListItem = ({ data, click }) => {
  return (
    <li
      onClick={() => click("@" + data.username + " ")}
      className="dubinfo-preview-item"
    >
      <div className="dubinfo-image">
        <img src={dtproxy.userImage(data.userid)} />
      </div>
      <span className="dubinfo-text">@{data.username}</span>
    </li>
  );
};

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
      elem = dtproxy.upVote;
    } else if (whichVote === "down") {
      elem = dtproxy.downVote;
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
    const chat = dtproxy.chatInput;
    chat.value = str;
    chat.focus();
  }

  makeList() {
    return this.props.dubs.map((d, i) => {
      return (
        <DubsInfoListItem
          data={d}
          click={this.updateChat}
          key={`info-${this.props.type}-${i}`}
        />
      );
    });
  }

  render({ type, isMod }) {
    let notYetMsg = `No ${type} have been casted yet!`;
    if (type === "grabs") {
      notYetMsg = "This song hasn't been grabbed yet!";
    }

    let list = this.makeList();

    let containerCss = ["dubinfo-preview", `dubinfo-${type}`];

    if (list.length === 0) {
      list = <li className="dubinfo-preview-none">{notYetMsg}</li>;
      containerCss.push("dubinfo-no-dubs");
    }

    if (type === "downdubs" && !isMod) {
      containerCss.push("dubinfo-unauthorized");
    }

    return (
      <ul
        style={{ borderColor: this.getBgColor() }}
        className={containerCss.join(" ")}
      >
        {list}
      </ul>
    );
  }
}
