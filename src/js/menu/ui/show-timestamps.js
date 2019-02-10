import {h} from 'preact';
import {MenuSwitch} from '@/components/menuItems.js';

function turnOn() {
  document.body.classList.add('dubplus-show-timestamp');
}
function turnOff() {
  document.body.classList.remove('dubplus-show-timestamp');
}

const ShowTS = function() {
  return (
    <MenuSwitch
      id="dubplus-show-timestamp"
      section="User Interface"
      menuTitle="Show Timestamps"
      desc="Toggle always showing chat message timestamps."
      turnOn={turnOn}
      turnOff={turnOff} 
    />
  )
};
export default ShowTS;