import { h, Component } from 'preact';
import SectionHeader from '../../components/section-header.js';
import settings from '../../utils/UserSettings.js';
import FullscreenVideo from './fullscreen-video';
import SplitChat from './split-chat';
import HideChat from './hide-chat';
import HideVideo from './hide-video';
import HideAvatars from './hide-avatars';
import HideBackground from './hide-background';
import ShowTimestamps from './show-timestamps';

export default class UISection extends Component {
  state = {
    section : settings.stored.menu['user-interface'] || "open"
  }

  toggleSection = (e) => {
    this.setState((prevState)=>{
      let newState = prevState.section === "open" ? "closed" : "open";
      settings.save('menu', 'user-interface', newState);
      return {section : newState}
    });
  }

  render(props,state) {
    let _cn = ['dubplus-menu-section'];
    if (state.section === "closed") {
      _cn.push('dubplus-menu-section-closed');
    }
    return (
      <>
        <SectionHeader 
          onClick={this.toggleSection}
          id="dubplus-general" 
          category="UI"
          open={state.section} />
        <ul className={_cn.join(' ')}>
          <FullscreenVideo />
          <SplitChat />
          <HideChat />
          <HideVideo />
          <HideAvatars />
          <HideBackground />
          <ShowTimestamps />
        </ul>
      </>
    );
  }
}