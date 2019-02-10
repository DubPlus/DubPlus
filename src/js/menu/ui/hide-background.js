import {h} from 'preact';
import {MenuSwitch} from '@/components/menuItems.js';

function turnOn() {
  document.body.classList.add('dubplus-hide-bg');
}
function turnOff() {
  document.body.classList.remove('dubplus-hide-bg');
}

/**
 * Hide Background
 */
const HideBackground = function() {
  return (
    <MenuSwitch
      id="dubplus-hide-bg"
      section="User Interface"
      menuTitle="Hide Background"
      desc="Toggle hiding background image."
      turnOn={turnOn}
      turnOff={turnOff} 
    />
  )
};
export default HideBackground;