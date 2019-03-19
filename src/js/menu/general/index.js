import { h } from 'preact';
import { MenuSection } from "@/components/menuItems";

import AFK from '@/menu/general/afk.js'
import Autovote from '@/menu/general/autovote.js'
import AutocompleteEmoji from '@/menu/general/autocomplete-emoji.js';
import Emotes from '@/menu/general/emotes.js';
import CustomMentions from '@/menu/general/custom-mentions.js';
import ChatCleaner from '@/menu/general/chat-cleaner.js';
import ChatNotification from '@/menu/general/chat-notifications.js';
import PMNotifications from '@/menu/general/pm-notifications.js';
import DJNotification from '@/menu/general/dj-notification.js';
import SnowSwitch from '@/menu/general/snow-switch.js';
import RainSwitch from '@/menu/general/rain-switch.js';
import ShowDubsOnHover from '@/menu/general/show-dubs-on-hover.js';
import DowndubInChat from '@/menu/general/downdub-in-chat.js';
import UpdubsInChat from '@/menu/general/updubs-in-chat.js';
import GrabsInChat from '@/menu/general/grabs-in-chat.js';
import PreviewNextSong from '@/menu/general/preview-next-song';

const GeneralSection = () => {
  return (
    <MenuSection id="dubplus-general" title="General" settingsKey="general">
      <Autovote />
      <AFK />
      <AutocompleteEmoji />
      <Emotes />
      <CustomMentions />
      <ChatCleaner />
      <ChatNotification />
      <PMNotifications />
      <DJNotification />
      <ShowDubsOnHover />
      <DowndubInChat />
      <UpdubsInChat />
      <GrabsInChat />
      <PreviewNextSong />
      <SnowSwitch />
      <RainSwitch />
    </MenuSection>
  );
};

export default GeneralSection;
