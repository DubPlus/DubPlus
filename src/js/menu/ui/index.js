import { h } from 'preact';
import { MenuSection } from "@/components/menuItems";

import FullscreenVideo from '@/menu/ui/fullscreen-video';
import SplitChat from '@/menu/ui/split-chat';
import HideChat from '@/menu/ui/hide-chat';
import HideVideo from '@/menu/ui/hide-video';
import HideAvatars from '@/menu/ui/hide-avatars';
import HideBackground from '@/menu/ui/hide-background';
import ShowTimestamps from '@/menu/ui/show-timestamps';

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
