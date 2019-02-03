import {h, Component} from 'preact';
import {MenuSwitch} from '../../components/menuItems.js';

/**
 * Menu item for Autovote
 */
export default class Autovote extends Component {

  constructor(){
    super();
    this.dubup = document.querySelector('.dubup');
    this.dubdown = document.querySelector('.dubdown');
  }

  advance_vote = () => {
    var event = document.createEvent('HTMLEvents');
    event.initEvent('click', true, false);
    this.dubup.dispatchEvent(event);
  }
  
  voteCheck = (obj) => {
    if (obj.startTime < 2) {
      this.advance_vote();
    }
  }

  turnOn = (e) => {
    var song = Dubtrack.room.player.activeSong.get('song');
    var dubCookie = Dubtrack.helpers.cookie.get('dub-' + Dubtrack.room.model.get("_id"));
    var dubsong = Dubtrack.helpers.cookie.get('dub-song');
  
    if (!Dubtrack.room || !song || song.songid !== dubsong) {
      dubCookie = false;
    }
    
    // Only cast the vote if user hasn't already voted
    if (!this.dubup.classList.contains('voted') &&
        !this.dubdown.classList.contains('voted') &&
        !dubCookie) {
      this.advance_vote();
    }
  
    Dubtrack.Events.bind("realtime:room_playlist-update", this.voteCheck);
  }
  
  turnOff = (e) => {
    Dubtrack.Events.unbind("realtime:room_playlist-update", this.voteCheck);
  }


  render(props,state){
    return (
      <MenuSwitch
        id="dubplus-autovote"
        section="General"
        menuTitle="Autovote"
        desc="Toggles auto upvoting for every song"
        turnOn={this.turnOn}
        turnOff={this.turnOff}>
      </MenuSwitch>
    )
  }
}