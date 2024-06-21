import { logError } from "../../utils/logger.js";
import { isMod } from "../../utils/modcheck.js";
import { dubsState } from "../stores/dubsState.svelte.js";

/**
 * @param {string} userid
 * @returns {Promise<string>}
 */
function getUserName(userid) {
  return new Promise((resolve, reject) => {
    // check if we already have the username
    const username = window.QueUp.room.users.collection.findWhere({
      userid,
    })?.attributes?._user?.username;

    if (username) {
      resolve(username);
      return;
    }

    // or try getting it via the API
    fetch(`https://api.queup.dev/user/${userid}`)
      .then((response) => response.json())
      .then((response) => {
        if (response?.userinfo?.username) {
          const { username } = response.userinfo;
          resolve(username);
        } else {
          reject("Failed to get username from API");
        }
      })
      .catch(reject);
  });
}

/**
 * @param {Array<{ userid: string}>} updubs
 */
function updateUpdubs(updubs) {
  updubs.forEach((dub) => {
    // even though we reset before calling this, because this is async we could have
    // had an upDub in the time it took to fetch the data
    if (dubsState.upDubs.find((el) => el.userid === dub.userid)) {
      return;
    }

    getUserName(dub.userid)
      .then((username) => {
        dubsState.upDubs.push({
          userid: dub.userid,
          username,
        });
      })
      .catch((error) => logError("Failed to get username for upDubs", error));
  });
}

/**
 * @param {Array<{ userid: string}>} downdubs
 */
function updateDowndubs(downdubs) {
  downdubs.forEach((dub) => {
    // even though we reset before calling this, because this is async we could have
    // had an upDub in the time it took to fetch the data
    if (dubsState.downDubs.find((el) => el.userid === dub.userid)) {
      return;
    }

    getUserName(dub.userid)
      .then((username) => {
        dubsState.downDubs.push({
          userid: dub.userid,
          username,
        });
      })
      .catch((error) => logError("Failed to get username for downDubs", error));
  });
}

/**
 * @param {Array<{ userid: string}>} grabs
 */
function updateGrabs(grabs) {
  grabs.forEach((grab) => {
    if (dubsState.grabs.find((el) => el.userid === grab.userid)) {
      return;
    }

    getUserName(grab.userid)
      .then((username) => {
        dubsState.grabs.push({
          userid: grab.userid,
          username,
        });
      })
      .catch((error) => logError("Failed to get username for grab", error));
  });
}

function resetDubs() {
  dubsState.downDubs = [];
  dubsState.upDubs = [];
  dubsState.grabs = [];

  const dubsURL = `https://api.queup.dev/room/${window.QueUp.room.model.id}/playlist/active/dubs`;
  fetch(dubsURL)
    .then((response) => response.json())
    .then((response) => {
      updateUpdubs(response.data.upDubs);
      updateGrabs(response.data.grabs);

      //Only let mods or higher access down dubs
      if (isMod(window.QueUp.session.id)) {
        updateDowndubs(response.data.downDubs);
      }
    })
    .catch((error) => logError("Failed to fetch dubs data from API.", error));
}

/**
 * @param {{dubtype: string; user: { _id: string; username: string}}} e
 * @returns
 */
function dubWatcher(e) {
  if (e.dubtype === "updub") {
    if (!dubsState.upDubs.find((el) => el.userid === e.user._id)) {
      dubsState.upDubs.push({
        userid: e.user._id,
        username: e.user.username,
      });
    }

    //Remove user from other dubtype if exists
    dubsState.downDubs = dubsState.downDubs.filter(
      (el) => el.userid !== e.user._id
    );
  } else if (e.dubtype === "downdub") {
    if (
      !dubsState.downDubs.find((el) => el.userid === e.user._id) &&
      isMod(window.QueUp.session.id)
    ) {
      dubsState.downDubs.push({
        userid: e.user._id,
        username: e.user.username,
      });
    }

    //Remove user from other dubtype if exists
    dubsState.upDubs = dubsState.downDubs.filter(
      (el) => el.userid !== e.user._id
    );
  }

  const msSinceSongStart =
    Date.now() - window.QueUp.room.player.activeSong.attributes.song.played;

  // not sure why we are checking this, maybe to give the API time to update?
  if (msSinceSongStart < 1000) {
    return;
  }

  if (
    dubsState.upDubs.length !==
    window.QueUp.room.player.activeSong.attributes.song.updubs
  ) {
    resetDubs();
  } else if (
    isMod(window.QueUp.session.id) &&
    dubsState.downDubs.length !==
      window.QueUp.room.player.activeSong.attributes.song.downdubs
  ) {
    resetDubs();
  }
}

/**
 * @param {{dubtype: string; user: { _id: string; username: string}}} e
 * @returns
 */
function grabWatcher(e) {
  if (!dubsState.grabs.find((el) => el.userid === e.user._id)) {
    dubsState.grabs.push({
      userid: e.user._id,
      username: e.user.username,
    });
  }
}

function dubUserLeaveWatcher(e) {
  // remove from up dubs
  dubsState.upDubs = dubsState.upDubs.filter((el) => el.userid !== e.user._id);
  // remove from down dubs
  dubsState.downDubs = dubsState.downDubs.filter(
    (el) => el.userid !== e.user._id
  );
  // remove from grabs
  dubsState.grabs = dubsState.grabs.filter((el) => el.userid !== e.user._id);
}

/**
 * @type {import("./module.js").DubPlusModule}
 */
export const showDubsOnHover = {
  id: "dubplus-dubs-hover",
  label: "dubplus-dubs-hover.label",
  description: "dubplus-dubs-hover.description",
  category: "General",
  turnOn() {
    resetDubs();
    window.QueUp.Events.bind("realtime:room_playlist-dub", dubWatcher);
    window.QueUp.Events.bind(
      "realtime:room_playlist-queue-update-grabs",
      grabWatcher
    );
    window.QueUp.Events.bind("realtime:user-leave", dubUserLeaveWatcher);
    window.QueUp.Events.bind("realtime:room_playlist-update", resetDubs);
  },

  turnOff() {
    window.QueUp.Events.unbind("realtime:room_playlist-dub", dubWatcher);
    window.QueUp.Events.unbind(
      "realtime:room_playlist-queue-update-grabs",
      grabWatcher
    );
    window.QueUp.Events.unbind("realtime:user-leave", dubUserLeaveWatcher);
    window.QueUp.Events.unbind("realtime:room_playlist-update", resetDubs);
  },
};

/*******************************/

dubshover.showDubsOnHover = function () {
  var that = this;

  var dubupEl = $(".dubup").first().parent("li");
  var dubdownEl = $(".dubdown").first().parent("li");
  var grabEl = $(".add-to-playlist-button").first().parent("li");

  $(dubupEl).addClass("dubplus-updubs-hover");
  $(dubdownEl).addClass("dubplus-downdubs-hover");
  $(grabEl).addClass("dubplus-grabs-hover");

  //Show compiled info containers when casting/changing vote
  $(dubupEl).click(function (event) {
    $("#dubplus-updubs-container").remove();
    var x = event.clientX,
      y = event.clientY;

    if (!x || !y || isNaN(x) || isNaN(y)) {
      return $("#dubplus-downdubs-container").remove();
    }

    var elementMouseIsOver = document.elementFromPoint(x, y);

    if (
      $(elementMouseIsOver).hasClass("dubplus-updubs-hover") ||
      $(elementMouseIsOver).parents(".dubplus-updubs-hover").length > 0
    ) {
      setTimeout(function () {
        $(dubupEl).mouseenter();
      }, 250);
    }
  });

  $(dubdownEl).click(function (event) {
    $("#dubplus-downdubs-container").remove();
    var x = event.clientX,
      y = event.clientY;

    if (!x || !y || isNaN(x) || isNaN(y)) {
      return $("#dubplus-downdubs-container").remove();
    }

    var elementMouseIsOver = document.elementFromPoint(x, y);

    if (
      $(elementMouseIsOver).hasClass("dubplus-downdubs-hover") ||
      $(elementMouseIsOver).parents(".dubplus-downdubs-hover").length > 0
    ) {
      setTimeout(function () {
        $(dubdownEl).mouseenter();
      }, 250);
    }
  });

  $(grabEl).click(function (event) {
    $("#dubplus-grabs-container").remove();
    var x = event.clientX,
      y = event.clientY;

    if (!x || !y || isNaN(x) || isNaN(y)) {
      return $("#dubplus-grabs-container").remove();
    }

    var elementMouseIsOver = document.elementFromPoint(x, y);

    if (
      $(elementMouseIsOver).hasClass("dubplus-grabs-hover") ||
      $(elementMouseIsOver).parents(".dubplus-grabs-hover").length > 0
    ) {
      setTimeout(function () {
        $(grabEl).mouseenter();
      }, 250);
    }
  });

  $(dubupEl).mouseenter((e) => {
    var self = e.currentTarget;
    if ($("#dubplus-updubs-container").length > 0) {
      return;
    } //already exists

    var infoPaneWidth = $(dubupEl).innerWidth() + $(dubdownEl).innerWidth();
    var dubupBackground = $(".dubup").hasClass("voted")
      ? $(".dubup").css("background-color")
      : $(".dubup").find(".icon-arrow-up").css("color");
    var html;

    if (window.dubplus.dubs.upDubs.length > 0) {
      html =
        '<ul id="dubinfo-preview" class="dubinfo-show dubplus-updubs-hover" style="border-color: ' +
        dubupBackground +
        '">';

      window.dubplus.dubs.upDubs.forEach(function (val) {
        html +=
          '<li class="preview-dubinfo-item users-previews dubplus-updubs-hover">' +
          '<div class="dubinfo-image">' +
          '<img src="https://api.queup.net/user/' +
          val.userid +
          '/image">' +
          "</div>" +
          '<span class="dubinfo-text">@' +
          val.username +
          "</span>" +
          "</li>";
      });
      html += "</ul>";
    } else {
      html =
        '<div id="dubinfo-preview" class="dubinfo-show dubplus-updubs-hover dubplus-no-dubs" style="border-color: ' +
        dubupBackground +
        '">' +
        "No updubs have been casted yet!" +
        "</div>";
    }

    var newEl = document.createElement("div");
    newEl.id = "dubplus-updubs-container";
    newEl.className = "dubinfo-show dubplus-updubs-hover";
    newEl.innerHTML = html;
    newEl.style.visibility = "hidden";
    document.body.appendChild(newEl);

    var elemRect = self.getBoundingClientRect();
    var bodyRect = document.body.getBoundingClientRect();

    newEl.style.visibility = "";
    newEl.style.width = infoPaneWidth + "px";
    newEl.style.top = elemRect.top - 150 + "px";

    //If info pane would run off screen set the position on right edge
    if (bodyRect.right - elemRect.left >= infoPaneWidth) {
      newEl.style.left = elemRect.left + "px";
    } else {
      newEl.style.right = 0;
    }

    document.body.appendChild(newEl);

    $(self).addClass("dubplus-updubs-hover");

    $(document.body).on("click", ".preview-dubinfo-item", (e) => {
      var new_text =
        $(e.currentTarget).find(".dubinfo-text")[0].innerHTML + " ";
      that.updateChatInputWithString(new_text);
    });

    $(".dubplus-updubs-hover").mouseleave(function (event) {
      var x = event.clientX,
        y = event.clientY;

      if (!x || !y || isNaN(x) || isNaN(y)) {
        return $("#dubplus-downdubs-container").remove();
      }

      var elementMouseIsOver = document.elementFromPoint(x, y);

      if (
        !$(elementMouseIsOver).hasClass("dubplus-updubs-hover") &&
        !$(elementMouseIsOver).hasClass("ps-scrollbar-y") &&
        $(elementMouseIsOver).parent(".dubplus-updubs-hover").length <= 0
      ) {
        $("#dubplus-updubs-container").remove();
      }
    });
  });

  $(dubdownEl).mouseenter((e) => {
    var self = e.currentTarget;
    if ($("#dubplus-downdubs-container").length > 0) {
      return;
    } //already exists

    var infoPaneWidth = $(dubupEl).innerWidth() + $(dubdownEl).innerWidth();
    var dubdownBackground = $(".dubdown").hasClass("voted")
      ? $(".dubdown").css("background-color")
      : $(".dubdown").find(".icon-arrow-down").css("color");
    var html;

    if (userIsAtLeastMod(QueUp.session.id)) {
      if (window.dubplus.dubs.downDubs.length > 0) {
        html =
          '<ul id="dubinfo-preview" class="dubinfo-show dubplus-downdubs-hover" style="border-color: ' +
          dubdownBackground +
          '">';
        window.dubplus.dubs.downDubs.forEach(function (val) {
          html +=
            '<li class="preview-dubinfo-item users-previews dubplus-downdubs-hover">' +
            '<div class="dubinfo-image">' +
            '<img src="https://api.queup.net/user/' +
            val.userid +
            '/image">' +
            "</div>" +
            '<span class="dubinfo-text">@' +
            val.username +
            "</span>" +
            "</li>";
        });
        html += "</ul>";
      } else {
        html =
          '<div id="dubinfo-preview" class="dubinfo-show dubplus-downdubs-hover dubplus-no-dubs" style="border-color: ' +
          dubdownBackground +
          '">' +
          "No downdubs have been casted yet!" +
          "</div>";
      }
    } else {
      html =
        '<div id="dubinfo-preview" class="dubinfo-show dubplus-downdubs-hover dubplus-downdubs-unauthorized" style="border-color: ' +
        dubdownBackground +
        '">' +
        "You must be at least a mod to view downdubs!" +
        "</div>";
    }

    var newEl = document.createElement("div");
    newEl.id = "dubplus-downdubs-container";
    newEl.className = "dubinfo-show dubplus-downdubs-hover";
    newEl.innerHTML = html;
    newEl.style.visibility = "hidden";
    document.body.appendChild(newEl);

    var elemRect = self.getBoundingClientRect();
    var bodyRect = document.body.getBoundingClientRect();

    newEl.style.visibility = "";
    newEl.style.width = infoPaneWidth + "px";
    newEl.style.top = elemRect.top - 150 + "px";

    //If info pane would run off screen set the position on right edge
    if (bodyRect.right - elemRect.left >= infoPaneWidth) {
      newEl.style.left = elemRect.left + "px";
    } else {
      newEl.style.right = 0;
    }

    document.body.appendChild(newEl);

    $(self).addClass("dubplus-downdubs-hover");

    $(document.body).on("click", ".preview-dubinfo-item", function (e) {
      var new_text =
        $(e.currentTarget).find(".dubinfo-text")[0].innerHTML + " ";
      that.updateChatInputWithString(new_text);
    });

    $(".dubplus-downdubs-hover").mouseleave(function (event) {
      var x = event.clientX,
        y = event.clientY;

      if (!x || !y || isNaN(x) || isNaN(y)) {
        return $("#dubplus-downdubs-container").remove();
      }

      var elementMouseIsOver = document.elementFromPoint(x, y);

      if (
        !$(elementMouseIsOver).hasClass("dubplus-downdubs-hover") &&
        !$(elementMouseIsOver).hasClass("ps-scrollbar-y") &&
        $(elementMouseIsOver).parent(".dubplus-downdubs-hover").length <= 0
      ) {
        $("#dubplus-downdubs-container").remove();
      }
    });
  });

  $(grabEl).mouseenter((e) => {
    var self = e.currentTarget;
    if ($("#dubplus-grabs-container").length > 0) {
      return;
    } //already exists

    var infoPaneWidth = $(dubupEl).innerWidth() + $(grabEl).innerWidth();

    var grabsBackground = $(".add-to-playlist-button").hasClass("grabbed")
      ? $(".add-to-playlist-button").css("background-color")
      : $(".add-to-playlist-button").find(".icon-heart").css("color");

    var html;

    if (window.dubplus.dubs.grabs.length > 0) {
      html =
        '<ul id="dubinfo-preview" class="dubinfo-show dubplus-grabs-hover" style="border-color: ' +
        grabsBackground +
        '">';

      window.dubplus.dubs.grabs.forEach(function (val) {
        html +=
          '<li class="preview-dubinfo-item users-previews dubplus-grabs-hover">' +
          '<div class="dubinfo-image">' +
          '<img src="https://api.queup.net/user/' +
          val.userid +
          '/image">' +
          "</div>" +
          '<span class="dubinfo-text">@' +
          val.username +
          "</span>" +
          "</li>";
      });
      html += "</ul>";
    } else {
      html =
        '<div id="dubinfo-preview" class="dubinfo-show dubplus-grabs-hover dubplus-no-grabs" style="border-color: ' +
        grabsBackground +
        '">' +
        "This song hasn't been grabbed yet!" +
        "</div>";
    }

    var newEl = document.createElement("div");
    newEl.id = "dubplus-grabs-container";
    newEl.className = "dubinfo-show dubplus-grabs-hover";
    newEl.innerHTML = html;
    newEl.style.visibility = "hidden";
    document.body.appendChild(newEl);

    var elemRect = self.getBoundingClientRect();
    var bodyRect = document.body.getBoundingClientRect();

    newEl.style.visibility = "";
    newEl.style.width = infoPaneWidth + "px";
    newEl.style.top = elemRect.top - 150 + "px";

    //If info pane would run off screen set the position on right edge
    if (bodyRect.right - elemRect.left >= infoPaneWidth) {
      newEl.style.left = elemRect.left + "px";
    } else {
      newEl.style.right = 0;
    }

    document.body.appendChild(newEl);

    $(self).addClass("dubplus-grabs-hover");

    $(document.body).on("click", ".preview-dubinfo-item", function (e) {
      var new_text =
        $(e.currentTarget).find(".dubinfo-text")[0].innerHTML + " ";
      that.updateChatInputWithString(new_text);
    });

    $(".dubplus-grabs-hover").mouseleave(function (event) {
      var x = event.clientX,
        y = event.clientY;

      if (!x || !y || isNaN(x) || isNaN(y)) {
        return $("#dubplus-grabs-container").remove();
      }

      var elementMouseIsOver = document.elementFromPoint(x, y);

      if (
        !$(elementMouseIsOver).hasClass("dubplus-grabs-hover") &&
        !$(elementMouseIsOver).hasClass("ps-scrollbar-y") &&
        $(elementMouseIsOver).parent(".dubplus-grabs-hover").length <= 0
      ) {
        $("#dubplus-grabs-container").remove();
      }
    });
  });
};
