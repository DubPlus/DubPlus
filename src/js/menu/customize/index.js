import { h } from "preact";
import { MenuSection } from "@/components/menuItems";
import CommunityTheme from '@/menu/customize/community-theme';
import CustomCSS from '@/menu/customize/custom-css';
import CustomBG from '@/menu/customize/custom-background';
import CustomSound from '@/menu/customize/custom-notification-sound';

const CustomizeSection = () => {
  return (
    <MenuSection id="dubplus-customize" title="Customize" settingsKey="customize">
      <CommunityTheme />
      <CustomCSS />
      <CustomBG />
      <CustomSound />
    </MenuSection>
  );
};

export default CustomizeSection;