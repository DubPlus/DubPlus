import { h } from "preact";
import { MenuSection } from "@/components/menuItems";
import SpacebarMute from '@/menu/settings/spacebar-mute';
import WarnOnNavigation from '@/menu/settings/warn-on-navigation';
import filterAddToPlaylists from '@/menu/settings/filter-add-to-playlists';

const SettingsSection = () => {
  return (
    <MenuSection id="dubplus-settings" title="Settings" settingsKey="settings">
      <SpacebarMute />
      <WarnOnNavigation />
      <filterAddToPlaylists />
    </MenuSection>
  );
};

export default SettingsSection;