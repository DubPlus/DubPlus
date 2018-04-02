import {h, Component} from 'preact';
import {MenuSwitch, MenuPencil} from '../../components/menuItems.js';
import settings from '../../utils/UserSettings.js';

/**
 * 
 * Away From Keyboard autoresponder
 * 
 * TODO: setup global state manager
 */
export default class AFK extends Component {
  state = {
    canSend : true
  }
  
  afk_chat_respond = (e) => {
    if (!this.state.canSend) {
      return; // do nothing until it's back to true
    }
    var content = e.message;
    var user = Dubtrack.session.get('username');
    
    if (content.indexOf('@'+user) > -1 && Dubtrack.session.id !== e.user.userInfo.userid) {
      var chatInput = document.getElementById('chat-txt-message');
      if (settings.stored.custom.customAfkMessage) {
        chatInput.value = '[AFK] '+ settings.stored.custom.customAfkMessage;
      } else {
        chatInput.value = "[AFK] I'm not here right now.";
      }
      
      Dubtrack.room.chat.sendMessage();

      // so we don't spam chat, we pause the auto respond for 30sec
      this.setState({canSend:false});

      // allow AFK responses after 30sec
      setTimeout(()=> {
        this.setState({canSend:true});
      }, 30000);

    }
  }
  
  turnOn(){
    Dubtrack.Events.bind("realtime:chat-message", this.afk_chat_respond);
  }
  
  turnOff() {
    Dubtrack.Events.unbind("realtime:chat-message", this.afk_chat_respond);
  }

  saveAFKmessage (val) {
    if (val !== '') {
      // TODO: save to global state
      settings.save('custom', 'customAfkMessage', val);
    }
  };

  render(props,state){
    return (
      <MenuSwitch
        id="dubplus-afk"
        section="General"
        menuTitle="AFK Auto-respond"
        desc="Toggle Away from Keyboard and customize AFK message."
        turnOn={this.turnOn}
        turnOff={this.turnOff}>
        <MenuPencil 
          title='Custom AFK Message'
          section="General"
          content='Enter a custom Away From Keyboard [AFK] message here'
          value={settings.stored.custom.customAfkMessage || ''}
          placeholder="Be right back!"
          maxlength='255'
          onConfirm={this.saveAFKmessage} />
      </MenuSwitch>
    )
  }
}