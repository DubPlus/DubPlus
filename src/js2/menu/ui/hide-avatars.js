import {h} from 'preact';
import {MenuSwitch} from '../../components/menuItems.js';

function turnOn() {
  document.body.classList.add('dubplus-hide-avatars');
}
function turnOff() {
  document.body.classList.remove('dubplus-hide-avatars');
}

/**
 * Hide Avatars
 */
const HideAvatars = function() {
  return (
    <MenuSwitch
      id="dubplus-hide-avatars"
      section="User Interface"
      menuTitle="Hide Avatars"
      desc="Toggle hiding user avatars in the chat box."
      turnOn={turnOn}
      turnOff={turnOff} 
    />
  )
};
export default HideAvatars;