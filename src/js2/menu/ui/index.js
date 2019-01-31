import { h } from 'preact';
import { MenuSection } from "../../components/menuItems";

import FullscreenVideo from './fullscreen-video';
import SplitChat from './split-chat';
import HideChat from './hide-chat';
import HideVideo from './hide-video';
import HideAvatars from './hide-avatars';
import HideBackground from './hide-background';
import ShowTimestamps from './show-timestamps';

const UISection = () => {
  return (
    <MenuSection id="dubplus-ui" title="UI" settingsKey="user-interface">
      <FullscreenVideo />
      <SplitChat />
      <HideChat />
      <HideVideo />
      <HideAvatars />
      <HideBackground />
      <ShowTimestamps />
    </MenuSection>
  );
};

export default UISection;
