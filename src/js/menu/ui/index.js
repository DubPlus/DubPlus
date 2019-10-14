import { h } from "preact";
import { MenuSection } from "@/components/menuItems";

import FullscreenVideo from "@/menu/ui/fullscreen-video";
import SplitChat from "@/menu/ui/split-chat";
import HideChat from "@/menu/ui/hide-chat";
import HideAvatars from "@/menu/ui/hide-avatars";
import HideBackground from "@/menu/ui/hide-background";
import ShowTimestamps from "@/menu/ui/show-timestamps";
import HideGifSelfie from "@/menu/ui/hide-gif-selfie";

/*START.NOT_EXT*/
import HideVideo from "@/menu/ui/hide-video";
/*END.NOT_EXT*/

const UISection = () => {
  return (
    <MenuSection id="dubplus-ui" title="UI" settingsKey="user-interface">
      <FullscreenVideo />
      <SplitChat />
      <HideChat />
      {/*START.NOT_EXT*/}
      <HideVideo />
      {/*END.NOT_EXT*/}
      <HideAvatars />
      <HideBackground />
      <HideGifSelfie />
      <ShowTimestamps />
    </MenuSection>
  );
};

export default UISection;
