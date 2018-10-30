import {h, Component} from 'preact';
import {MenuSwitch, MenuPencil} from '../../components/menuItems.js';
import settings from '../../utils/UserSettings.js';

/**
 * Menu item for ChatCleaner
 */
export default class ChatCleaner extends Component {
  
  chatCleanerCheck = (e) => {
    var totalChats = $('ul.chat-main > li').length;
  
    if (isNaN(totalChats) || isNaN(settings.custom.chat_cleaner) || totalChats < settings.custom.chat_cleaner) return;
  
    let items = $('ul.chat-main > li').length - settings.stored.custom.chat_cleaner;
    $(`ul.chat-main > li:lt(${items})`).remove();
    
    //Fix scroll bar
    $('.chat-messages').perfectScrollbar('update');
  };

  saveAmount = () => {
    var chatItems = parseInt($('.dp-modal textarea').val());
    let amount = !isNaN(chatItems) ? chatItems : 500;
    settings.save('custom', 'chat_cleaner', amount); // default to 500
  };
  
  turnOn = (e) => {
    Dubtrack.Events.bind("realtime:chat-message", this.chatCleanerCheck);
  }
  
  turnOff = (e) => {
    Dubtrack.Events.unbind("realtime:chat-message", this.chatCleanerCheck);
  }


  render(props,state){
    return (
      <MenuSwitch
        id="chat-cleaner"
        section="General"
        menuTitle="Chat Cleaner"
        desc="Automatically only keep a designated chatItems of chat items while clearing older ones, keeping CPU stress down"
        turnOn={this.turnOn}
        turnOff={this.turnOff}>
        <MenuPencil 
          title='Chat Cleaner'
          section="General"
          content='Please specify the number of most recent chat items that will remain in your chat history'
          value={settings.stored.custom.chat_cleaner || ''}
          placeholder='500'
          maxlength='5'
          onConfirm={this.saveAmount} />
      </MenuSwitch>
    )
  }
}