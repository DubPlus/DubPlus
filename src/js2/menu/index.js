/**
 * DubPlus Menu Container
 */
import { h } from "preact";
import snooze from "@/components/snooze";
import eta from "@/components/eta";
import SetupPicker from '@/components/Picker';
import GeneralSection from "@/menu/general/index";
import UISection from "@/menu/ui/index";
import SettingsSection from "@/menu/settings/index";
import CustomizeSection from "@/menu/customize/index";
import { MenuSection } from "@/components/menuItems";

const DubPlusMenu = function() {
  setTimeout(() => {
    // load this async so it doesn't block the rest of the menu render
    // since these buttons are completely independent from the menu
    snooze();
    eta();
    SetupPicker();
  }, 10);

  return (
    <section className="dubplus-menu">
      <p className="dubplus-menu-header">Dub+ Options</p>
      <GeneralSection />
      <UISection />
      <SettingsSection />
      <CustomizeSection />
      
      {/* the contact section is just links so I'll just added them directly here */}
      <MenuSection id="dubplus-contacts" title="Contacts" settingsKey="contact">
        <li class="dubplus-menu-icon">
          <span class="fa fa-bug"></span>
          <a href="https://discord.gg/XUkG3Qy" class="dubplus-menu-label" target="_blank">Report bugs on Discord</a>
        </li>
        <li class="dubplus-menu-icon">
          <span class="fa fa-reddit-alien"></span>
          <a href="https://www.reddit.com/r/DubPlus/" class="dubplus-menu-label"  target="_blank">Reddit</a>
        </li>
        <li class="dubplus-menu-icon">
          <span class="fa fa-facebook"></span>
          <a href="https://facebook.com/DubPlusScript" class="dubplus-menu-label"  target="_blank">Facebook</a>
        </li>
        <li class="dubplus-menu-icon">
          <span class="fa fa-twitter"></span>
          <a href="https://twitter.com/DubPlusScript" class="dubplus-menu-label"  target="_blank">Twitter</a>
        </li>
      </MenuSection>
    </section>
  );
};

export default DubPlusMenu;