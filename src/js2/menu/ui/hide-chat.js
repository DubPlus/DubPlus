import {h} from 'preact';
import {MenuSwitch} from '../../components/menuItems.js';

function turnOn() {
  document.body.classList.add('dubplus-video-only');
}
function turnOff() {
  document.body.classList.remove('dubplus-video-only');
}

/**
 * Hide Chat
 */
const HideChat = function() {
  return (
    <MenuSwitch
      id="dubplus-video-only"
      section="User Interface"
      menuTitle="Hide Chat"
      desc="Toggles hiding the chat box"
      turnOn={turnOn}
      turnOff={turnOff} 
    />
  )
};
export default HideChat;