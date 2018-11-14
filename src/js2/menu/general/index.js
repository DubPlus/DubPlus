/**
  // General 
  require('./djNotification.js'),
  require('./showDubsOnHover.js'),
  require('./downDubInChat.js'), // (mod only)
  require('./upDubInChat.js'),
  require('./grabsInChat.js'),
 */

import { h, Component } from 'preact';
import SectionHeader from '../../components/section-header.js';
import AFK from './afk.js'
import Autovote from './autovote.js'
import settings from '../../utils/UserSettings.js';
import AutocompleteEmoji from './autocomplete-emoji.js';
import CustomMentions from './custom-mentions.js';
import ChatCleaner from './chat-cleaner.js';
import ChatNotification from './chat-notifications.js';
import PMNotifications from './pm-notifications.js';

import SnowSwitch from './snow-switch.js';
import RainSwitch from './rain-switch.js';

export default class GeneralSection extends Component {
  state = {
    css : settings.stored.general || "open"
  }

  toggleSection = () => {
    this.setState((prevState)=>{
      let newState = prevState.css === "open" ? "closed" : "open";
      settings.save('menu', 'general', newState);
      return {css : newState}
    });
  }

  render(props,state) {
    let _cn = ['dubplus-menu-section'];
    if (state.css === "closed") {
      _cn.push('dubplus-menu-section-closed');
    }
    return (
      // until Preact incorporates something like React.Fragment (which is in the works) 
      // we have to wrap adjacent elements in one parent element
      <span>
        <SectionHeader 
          onClick={this.toggleSection}
          id="dubplus-general" 
          category="General" />
        <ul className={_cn.join(' ')}>
          <Autovote />
          <AFK />
          <AutocompleteEmoji />
          <CustomMentions />
          <ChatCleaner />
          <ChatNotification />
          <PMNotifications />

          <SnowSwitch />
          <RainSwitch />
        </ul>
      </span>
    );
  }
}