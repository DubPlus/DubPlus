import {h, Component} from 'preact';
import {MenuSwitch} from '../../components/menuItems.js';
import Portal from '../../components/Portal.js';

/**********************************************************************
 * Autocomplete Emoji / Emotes
 * Brings up a small window above the chat input to help the user
 * pick emoji/emotes
 */

/*
TODO: 
 - Create the hidden preview component
 - listen to the chat input for the beginning of possible emotes
 - if found:
   - open preview/picker window
   - hijack arrow keys to make it move around the preview window
   - moving around auto completes the text
   - typing continues to filter
*/

export default class AutocompleteEmoji extends Component {

  state = {
    open : false
  }

  componentWillMount() {
    this.renderTo =  document.querySelector('.pusher-chat-widget-input');
  }

  turnOn = (e) => {
    
  }

  
  turnOff = (e) => {
  
  }


  render(props,{open}){
    return (
      <MenuSwitch
        id="dubplus-emotes"
        section="General"
        menuTitle="Autocomplete Emoji"
        desc="Quick find and insert emojis and emotes while typing in the chat input"
        turnOn={this.turnOn}
        turnOff={this.turnOff}>

        { open ? (
          <Portal into={this.renderTo}>
            
          </Portal>
        ) : null }

      </MenuSwitch>
    )
  }
}