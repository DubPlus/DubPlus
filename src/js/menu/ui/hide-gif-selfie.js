import {h} from 'preact';
import {MenuSwitch} from '@/components/menuItems.js';

function turnOn() {
  document.body.classList.add('dubplus-hide-selfie');
}
function turnOff() {
  document.body.classList.remove('dubplus-hide-selfie');
}

/**
 * Hide Chat
 */
const HideGifSelfie = function() {
  return (
    <MenuSwitch
      id="dubplus-hide-selfie"
      section="User Interface"
      menuTitle="Hide Gif-Selfie"
      desc="Toggles hiding the gif selfie icon"
      turnOn={turnOn}
      turnOff={turnOff} 
    />
  )
};
export default HideGifSelfie;