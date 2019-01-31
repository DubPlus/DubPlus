import {h} from 'preact';
import {MenuSwitch} from '../../components/menuItems.js';

function turnOn() {
  document.body.classList.add('dubplus-split-chat');
}
function turnOff() {
  document.body.classList.remove('dubplus-split-chat');
}

/**
 * Split Chat
 */
const SplitChat = function() {
  return (
    <MenuSwitch
      id="dubplus-split-chat"
      section="User Interface"
      menuTitle="Split Chat"
      desc="Toggle Split Chat UI enhancement"
      turnOn={turnOn}
      turnOff={turnOff} 
    />
  )
};
export default SplitChat;