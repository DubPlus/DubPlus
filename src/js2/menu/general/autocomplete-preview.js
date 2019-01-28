import { h, Component } from "preact";
import twitch from "../../utils/emotes/twitch.js";
import bttv from "../../utils/emotes/bttv.js";

/*
TODO: 
 - if found:
   - hijack arrow keys to make it move around the preview window
   - moving around auto completes the text
   - typing continues to filter
*/

const PreviewListItem = ({ data, onSelect }) => {
  return (
    <li
      className={`preview-item ${data.type}-previews`}
      onClick={() => onSelect(data.name)}
      tabIndex="0"
    >
      <div className="ac-image">
        <img src={data.src} alt={data.name} title={data.name} />
      </div>
      <span className="ac-text">{data.name}</span>
    </li>
  );
};

export default class AutocompletePreview extends Component {
  getMatches(symbol) {
    symbol = symbol.replace(/^:/, '');
    var twitchMatches = twitch.find(symbol);
    var bttvMatches = bttv.find(symbol);
    return twitchMatches.concat(bttvMatches);
  }

  makeList(matches) {
    return matches.map((m, i) => {
      return (
        <PreviewListItem
          data={m}
          key={`${m.type}-${m.name}`}
          onSelect={this.props.onSelect}
        />
      );
    });
  }

  render(props) {
    if (!props.symbol) {
      return <ul id="autocomplete-preview"></ul>;
    }

    let matches = this.getMatches(props.symbol);

    if (matches.length === 0) {
      return <ul id="autocomplete-preview"></ul>;
    }

    let list = this.makeList(matches);

    return (
      <ul id="autocomplete-preview" className="ac-show">
        {list}
      </ul>
    );
  }
}
