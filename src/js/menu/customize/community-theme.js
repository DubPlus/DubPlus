import { h } from "preact";
import { MenuSwitch } from "@/components/menuItems.js";
import css from "@/utils/css";
import dtproxy from "@/utils/DTProxy.js";

function turnOn() {
  var location = dtproxy.getRoomUrl();
  let roomAjax = fetch("https://api.dubtrack.fm/room/" + location);
  roomAjax
    .then(resp => resp.json())
    .then(json => {
      var content = json.data.description;

      // for backwards compatibility with dubx we're checking for both @dubx and @dubplus and @dub+
      var themeCheck = new RegExp(
        /(@dub(x|plus|\+)=)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/,
        "i"
      );
      var communityCSSUrl = null;
      content.replace(themeCheck, function(match, p1, p2, p3) {
        console.log("loading community css theme:", p3);
        communityCSSUrl = p3;
      });

      if (!communityCSSUrl) {
        return;
      }
      css.loadExternal(communityCSSUrl, "dubplus-comm-theme");
    });
}

function turnOff() {
  let css = document.querySelector(".dubplus-comm-theme");
  if (css) {
    css.remove();
  }
}

const CommunityTheme = function() {
  return (
    <MenuSwitch
      id="dubplus-comm-theme"
      section="Customize"
      menuTitle="Community Theme"
      desc="Toggle Community CSS theme."
      turnOn={turnOn}
      turnOff={turnOff}
    />
  );
};
export default CommunityTheme;
