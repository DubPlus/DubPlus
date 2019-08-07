import { h } from "preact";
import { MenuSwitch, MenuPencil } from "@/components/menuItems.js";
import settings from "@/utils/UserSettings.js";
import dtproxy from "@/utils/DTProxy.js";

var canSend = true
var afkMessage = settings.stored.custom.customAfkMessage

function afkRespond(e) {
  if (!canSend) {
    return; // do nothing until it's back to true
  }
  var content = e.message;
  var user = dtproxy.userName();
  if (
    content.indexOf("@" + user) >= 0 &&
    dtproxy.sessionId() !== e.user.userInfo.userid
  ) {
    var chatInput = dtproxy.dom.chatInput();
    if (afkMessage) {
      chatInput.value = "[AFK] " + afkMessage;
    } else {
      chatInput.value = "[AFK] I'm not here right now.";
    }

    dtproxy.sendChatMessage();

    // so we don't spam chat, we pause the auto respond for 30sec
    canSend = false;
    setTimeout(() => {
      canSend = true;
    }, 30000);
  }
}

export function turnOn() {
  dtproxy.events.onChatMessage(afkRespond);
}

export function turnOff() {
  dtproxy.events.offChatMessage(afkRespond);
}

function  saveAFKmessage (val) {
  settings.save("custom", "customAfkMessage", val);
  afkMessage = val
}

export default function AFK() {
  return (
    <MenuSwitch
        id="dubplus-afk"
        section="General"
        menuTitle="AFK Auto-respond"
        desc="Toggle Away from Keyboard and customize AFK message."
        turnOn={turnOn}
        turnOff={turnOff}
      >
        <MenuPencil
          title="Custom AFK Message"
          section="General"
          content="Enter a custom Away From Keyboard [AFK] message here"
          value={afkMessage}
          placeholder="Be right back!"
          maxlength="255"
          onConfirm={saveAFKmessage}
        />
      </MenuSwitch>
  );
}