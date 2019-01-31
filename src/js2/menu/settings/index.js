import { h } from "preact";
import { MenuSection } from "../../components/menuItems";
import SpacebarMute from './spacebar-mute';
import WarnOnNavigation from './warn-on-navigation';

const SettingsSection = () => {
  return (
    <MenuSection id="dubplus-settings" title="Settings" settingsKey="settings">
      <SpacebarMute />
      <WarnOnNavigation />
    </MenuSection>
  );
};

export default SettingsSection;