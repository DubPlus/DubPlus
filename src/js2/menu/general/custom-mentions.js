import {h, Component} from 'preact';
import {MenuSwitch, MenuPencil} from '../../components/menuItems.js';
import settings from '../../utils/UserSettings.js';

/**
 * Custom mentions
 */
export default class CustomMentions extends Component {
  
  customMentionCheck = (e) => {
    var content = e.message;
    if (settings.custom.custom_mentions) {
      var customMentions = settings.custom.custom_mentions.split(',');
      var inUsers = customMentions.some(function(v) {
        var reg = new RegExp('\\b' + v.trim() + '\\b', 'i');
        return reg.test(content); 
      });
      if (Dubtrack.session.id !== e.user.userInfo.userid && inUsers) {
        Dubtrack.room.chat.mentionChatSound.play();
      }
    }
  }


  saveCustomMentions = (val) => {
    settings.save('custom', 'custom_mentions', val);
  };
  
  turnOn(){
    Dubtrack.Events.bind("realtime:chat-message", this.customMentionCheck);
  }
  
  turnOff() {
    Dubtrack.Events.unbind("realtime:chat-message", this.customMentionCheck);
  }

  render(props,state){
    return (
      <MenuSwitch
        id="custom_mentions"
        section="General"
        menuTitle="Custom Mentions"
        desc="Toggle using custom mentions to trigger sounds in chat"
        turnOn={this.turnOn}
        turnOff={this.turnOff}>
        <MenuPencil 
          title='Custom AFK Message'
          section="General"
          content='Add your custom mention triggers here (separate by comma)'
          value={settings.stored.custom.custom_mentions || ''}
          placeholder='separate, custom triggers, by, comma, :heart:'
          maxlength='255'
          onConfirm={this.saveCustomMentions} />
      </MenuSwitch>
    )
  }
}