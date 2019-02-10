import { h } from "preact";
import { MenuSwitch } from "@/components/menuItems.js";

function unloader(e) {
  var confirmationMessage = "";
  e.returnValue = confirmationMessage;
  return confirmationMessage;
}

function turnOn() {
  window.addEventListener("beforeunload", unloader);
}

function turnOff() {
  window.removeEventListener("beforeunload", unloader);
}

const WarnNav = function() {
  return (
    <MenuSwitch
      id="warn_redirect"
      section="Settings"
      menuTitle="Warn On Navigation"
      desc="Warns you when accidentally clicking on a link that takes you out of dubtrack."
      turnOn={turnOn}
      turnOff={turnOff}
    />
  );
};
export default WarnNav;
