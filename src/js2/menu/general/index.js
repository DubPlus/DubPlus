/**
  // General 
  require('./autovote.js'),
  require('./emotes.js'),
  require('./autocomplete.js'),
  require('./customMentions.js'),
  require('./chatCleaner.js'),
  require('./chatNotifications.js'),
  require('./pmNotifications.js'),
  require('./djNotification.js'),
  require('./showDubsOnHover.js'),
  require('./downDubInChat.js'), // (mod only)
  require('./upDubInChat.js'),
  require('./grabsInChat.js'),
  require('./snow.js'),
  require('./rain.js'),
 */

import { h, Component } from 'preact';
import SectionHeader from '../../components/section-header.js';
import AFK from './afk.js'

export default class GeneralSection extends Component {
  constructor(){
    super();
    this.state = {
      closed : false
    }
    this.toggleSection = this.toggleSection.bind(this); 
  }

  toggleSection() {
    // TODO: store state to global state manager
    this.setState((prevState)=>({
      closed : !prevState.closed
    }));
  }

  render(props,state) {

    return (
      // until Preact incorporates React.Fragment we have to wrap adjacent elements in one parent element
      <span>
        <SectionHeader 
          onClick={this.toggleSection}
          id="dubplus-general" 
          arrow={this.state.closed ? 'right' : 'down'} 
          category="General" />
        <ul className={`dubplus-menu-section ${this.state.closed ? 'dubplus-menu-section-closed' : ''}`}>
          <AFK />
        </ul>
      </span>
    );
  }
}