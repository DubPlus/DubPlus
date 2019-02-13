import { h } from 'preact';
import { MenuSection } from "@/components/menuItems";

import FullscreenVideo from '@/menu/ui/fullscreen-video';
import SplitChat from '@/menu/ui/split-chat';
import HideChat from '@/menu/ui/hide-chat';
import HideVideo from '@/menu/ui/hide-video';
import HideAvatars from '@/menu/ui/hide-avatars';
import HideBackground from '@/menu/ui/hide-background';
import ShowTimestamps from '@/menu/ui/show-timestamps';
import HideGifSelfie from '@/menu/ui/hide-gif-selfie';
// import DisableVideo from '@/menu/ui/disable-video';

const UISection = () => {
  return (
    <MenuSection id="dubplus-ui" title="UI" settingsKey="user-interface">
      <FullscreenVideo />
      <SplitChat />
      <HideChat />
      <HideVideo />
      <HideAvatars />
      <HideBackground />
      <HideGifSelfie />
      <ShowTimestamps />
      {/*
      not going to publish this feature until I can figure out a better way know
      when music has started playing:
      <DisableVideo />
      */}
    </MenuSection>
  );
};

export default UISection;
