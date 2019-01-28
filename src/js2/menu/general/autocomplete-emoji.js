import {h, Component} from 'preact';
import {MenuSwitch} from '../../components/menuItems.js';
import Portal from "preact-portal/src/preact-portal";
import AutocompletePreview from './autocomplete-preview';

/**********************************************************************
 * Autocomplete Emoji / Emotes
 * Brings up a small window above the chat input to help the user
 * pick emoji/emotes
 */

/*
TODO: 
 - if found:
   - hijack arrow keys to make it move around the preview window
   - moving around auto completes the text
   - typing continues to filter
*/

export default class AutocompleteEmoji extends Component {

  state = {
    isOn : false,
    symbol : ''
  }
  
  renderTo =  document.querySelector('.pusher-chat-widget-input')

  chatInput = document.getElementById("chat-txt-message")

  /**
   * check chat input for the beginning of an emoji at the very end
   * of the input string. Similar to how Dubtrack handles user autocomplete
   */
  checkInput = (e) => {
    const parts = e.target.value.split(' ');
    if (parts.length  === 0) { return; }
    
    const last = parts[parts.length - 1];
    const lastChar = last.charAt(last.length - 1);
    
    if (last.charAt(0) === ':' && last.length > 3 && lastChar !== ':') {
      this.setState({symbol: last});
      return;
    }
    
    if (this.state.symbol !== '') {
      this.setState({symbol: ''});
    }
  }

  closePreview = () => {
    this.setState({symbol: ''});
  }

  turnOn = (e) => {
    this.setState({isOn: true});
    Dubtrack.room.chat.delegateEvents(_.omit(Dubtrack.room.chat.events, ['keydown #chat-txt-message']));
    this.chatInput.addEventListener('keyup', this.checkInput);
  }

  turnOff = (e) => {
    this.setState({isOn: false});
    Dubtrack.room.chat.delegateEvents(Dubtrack.room.chat.events);
    this.chatInput.removeEventListener('keyup', this.checkInput);
  }

  render(props,{isOn, symbol}){
    return (
      <MenuSwitch
        id="dubplus-emotes"
        section="General"
        menuTitle="Autocomplete Emoji"
        desc="Quick find and insert emojis and emotes while typing in the chat input"
        turnOn={this.turnOn}
        turnOff={this.turnOff}>

        { isOn ? (
          <Portal into={this.renderTo}>
            <AutocompletePreview close={this.closePreview} symbol={symbol} />
          </Portal>
        ) : null }

      </MenuSwitch>
    )
  }
}