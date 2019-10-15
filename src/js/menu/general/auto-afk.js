import { h } from "preact";
import { MenuSwitch, MenuPencil } from "@/components/menuItems.js";
import PageActive from '@/utils/pageActive.js'
import { 
  turnOn as afkOn, 
  turnOff as afkOff, 
} from '@/menu/general/afk.js'
import settings from "@/utils/UserSettings.js";

var afkWait = settings.stored.custom.auto_afk_wait

const p = new PageActive(5000);

p.onIdle = function() {
  console.log("page has been idle for 5 sec");
  afkOn()
}
p.onActive = function() {
  console.log("page is active again");
  afkOff()
}

function  saveAFKwait (val) {
  var int = parseInt(val, 10);
  if (isNaN(int)) {
    // do error
    return false;
  }

  settings.save("custom", "auto_afk_wait", val);
  afkWait = val
  p.inactiveTimer = int * 60 * 1000
  return true
}

export default function AutoAFK() {
  return (
    <MenuSwitch
      id="dubplus-auto-afk"
      section="General"
      menuTitle="Auto AFK"
      desc="Automatically turn on AFK when inactive for a set amount of time"
      turnOn={p.start}
      turnOff={p.stop}
    >
      <MenuPencil
          title="Auto AFK Timer"
          section="General"
          content="Enter how many minutes to wait before auto AFK turns on"
          value={afkWait}
          placeholder="30"
          maxlength="3"
          errorMsg={"error, must be a number"}
          onConfirm={saveAFKwait}
        />
    </MenuSwitch>
  )
}
