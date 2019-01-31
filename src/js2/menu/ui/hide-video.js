import {h} from 'preact';
import {MenuSwitch} from '../../components/menuItems.js';

function turnOn() {
  document.body.classList.add('dubplus-chat-only');
}
function turnOff() {
  document.body.classList.remove('dubplus-chat-only');
}

/**
 * Hide Video
 */
const HideVideo = function() {
  return (
    <MenuSwitch
      id="dubplus-chat-only"
      section="User Interface"
      menuTitle="Hide Video"
      desc="Toggles hiding the video box"
      turnOn={turnOn}
      turnOff={turnOff} 
    />
  )
};
export default HideVideo;