import { h, Component } from "preact";

export default class DubsInfo extends Component {
  
  render() {

    let list = this.props.dubs.map((d)=>{
      return (
        <li class="preview-dubinfo-item users-previews dubplus-updubs-hover">
          <div class="dubinfo-image">
            <img src={`https://api.dubtrack.fm/user/${d.userID}/image`} />
          </div>
          <span class="dubinfo-text">@{d.username}</span>
        </li>
      );
    });

    return (
      <ul id="dubinfo-preview" class="dubinfo-show dubplus-updubs-hover">
        { list.length > 0 ? list : (
          <li>No updubs have been casted yet!</li>
        ) }
      </ul>
    );
  }
}