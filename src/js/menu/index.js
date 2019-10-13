/**
 * DubPlus Menu Container
 */
import { h, render } from "preact";
import Snooze from "@/components/snooze";
import Eta from "@/components/eta";
import SetupPicker from "@/components/Picker";
import GeneralSection from "@/menu/general/index";
import UISection from "@/menu/ui/index";
import SettingsSection from "@/menu/settings/index";
import CustomizeSection from "@/menu/customize/index";
import { MenuSection, MenuSimple } from "@/components/menuItems";
import WaitFor from "@/utils/waitFor.js";

function ExtraButtons() {
  return (
    <>
      <Eta />
      <Snooze />
    </>
  )
}

function addButtons() {
  // icon-twitter  icon-facebook
  let shareWait = new WaitFor(
    [
      ".player_sharing",
      ".icon-twitter",
      ".icon-facebook"
    ],
    {
      seconds: 120,
      isNode: true
    }
  );
  shareWait.then(() => {
    const holder = document.createElement('span');
    holder.id = "dubplus-button-holder";
    document.querySelector(".player_sharing").appendChild(holder)
    render(<ExtraButtons />, holder)
  });
}

const DubPlusMenu = function() {
  setTimeout(() => {
    // load this async so it doesn't block the rest of the menu render
    // since these buttons are completely independent from the menu
    addButtons();
    SetupPicker();
  }, 10);

  return (
    <section className="dubplus-menu">
      <p className="dubplus-menu-header">Dub+ Options</p>
      <GeneralSection />
      <UISection />
      <SettingsSection />
      <CustomizeSection />

      {/* the contact section is just links so I'll just added them directly here for now */}
      <MenuSection id="dubplus-contacts" title="Contacts" settingsKey="contact">
        <MenuSimple
          icon="bug"
          menuTitle="Report bugs on Discord"
          href="https://discord.gg/XUkG3Qy"
        />

        <MenuSimple
          icon="reddit-alien"
          menuTitle="Reddit"
          href="https://www.reddit.com/r/DubPlus/"
        />

        <MenuSimple
          icon="facebook"
          menuTitle="Facebook"
          href="https://facebook.com/DubPlusScript"
        />
        
        <MenuSimple
          icon="twitter"
          menuTitle="Twitter"
          href="https://twitter.com/DubPlusScript"
        />
      </MenuSection>
    </section>
  );
};

export default DubPlusMenu;
