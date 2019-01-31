/**
 * DubPlus Menu Container
 */
import { h } from "preact";
import snooze from "../components/snooze";
import eta from "../components/eta";
import GeneralSection from "./general/index";
import UISection from "./ui/index";
import SettingsSection from "./settings/index";
import CustomizeSection from "./customize/index";

const DubPlusMenu = function() {
  setTimeout(() => {
    // load this async so it doesn't block the rest of the menu render
    // since these buttons are completely independent from the menu
    snooze();
    eta();
  }, 10);

  return (
    <section className="dubplus-menu">
      <p className="dubplus-menu-header">Dub+ Options</p>
      <GeneralSection />
      <UISection />
      <SettingsSection />
      <CustomizeSection />
    </section>
  );
};

export default DubPlusMenu;