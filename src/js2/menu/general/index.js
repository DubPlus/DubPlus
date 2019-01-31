import { h } from 'preact';
import { MenuSection } from "../../components/menuItems";

import AFK from './afk.js'
import Autovote from './autovote.js'
import AutocompleteEmoji from './autocomplete-emoji.js';
import Emotes from './emotes.js';
import CustomMentions from './custom-mentions.js';
import ChatCleaner from './chat-cleaner.js';
import ChatNotification from './chat-notifications.js';
import PMNotifications from './pm-notifications.js';
import DJNotification from './dj-notification.js';
import SnowSwitch from './snow-switch.js';
import RainSwitch from './rain-switch.js';
import ShowDubsOnHover from './show-dubs-on-hover.js';
import DowndubInChat from './downdub-in-chat.js';
import UpdubsInChat from './updubs-in-chat.js';
import GrabsInChat from './grabs-in-chat.js';

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
      <SnowSwitch />
      <RainSwitch />
    </MenuSection>
  );
};

export default GeneralSection;
