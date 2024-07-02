const CURRENT_USER_NAME = "demo-user";
const CURRENT_USER_ID = "user-123";
const ROOM_ID = "room-123";

/** @type {import('../src/global').QueUp} */
const QueUp = {
  session: {
    // id: CURRENT_USER_ID,
    get(key) {
      if (key === "username") {
        return CURRENT_USER_NAME;
      }
    },
  },
  room: {
    chat: {
      sendMessage() {
        const input = document.getElementById("chat-txt-message");
        const message = input.value;
        input.value = "";
        /**
         * @type {import('../src/global').ChatMessageEvent}
         */
        const chatMessage = {
          message,
          user: {
            username: CURRENT_USER_NAME,
            userInfo: {
              userid: CURRENT_USER_ID,
            },
          },
        };
        makeChatMessage(message, chatMessage.user.username);
        triggerEvent("realtime:chat-message", chatMessage);
      },
      events: {
        "click .send-chat-button": "sendMessage",
        "click .setOnChatNotifications": "setSoundOn",
        "click .setOffChatNotifications": "setSoundOff",
        "click .setMentionChatNotifications": "setSoundMention",
        "click .disableVideo-el": "disableVideo",
        "click a.chat-commands": "displayChatHelp",
        "click #new-messages-counter": "clickChatCounter",
        "click .display-room-users": "displayRoomUsers",
        "click .display-chat": "displayChat",
        "click .display-chat-settings": "displayChatOptions",
        "click .hideImagesToggle": "hideImageToggleClick",
        "click .roleColorToggle": "disableRoleColorToggleClick",
        "click .clearChatToggle": "clearChat",
        "click #deletedVisibleToggle": "toggleDeletedMessages",
        "click .emojiConvertionToggle": "toggleEmojiConvertion",
        "input #chat-txt-message": "ncInput",
        "keydown #chat-txt-message": "ncKeyDown",
        "click .nc-container li": "ncNameClicked",
        "mouseover .nc-container li": "ncNameHovered",
      },
      delegateEvents(events) {
        console.log("delegateEvents", events);
        this.events = events;
      },
      ncKeyDown: (e) => {},
      mentionChatSound: {
        url: "/assets/music/user_ping.mp3",
        play() {
          console.log("mentionChatSound.play");
        },
      },
    },
    player: {
      muted_player: false,
      mutePlayer() {
        console.log("player muted");
        this.muted_player = true;
      },
      setVolume(volume) {
        console.log("setVolume", volume);
        window.QueUp.playerController.volume = volume;
      },
      updateVolumeBar() {
        console.log("updateVolumeBar");
      },
    },
    model: {
      id: ROOM_ID,
    },
    users: {
      getIfOwner() {
        return false;
      },
      getIfManager() {
        return false;
      },
      getIfMod() {
        return true;
      },
      collection: {
        findWhere() {
          return {
            attributes: {
              _user: {
                username: CURRENT_USER_ID,
              },
            },
          };
        },
      },
    },
  },
  Events: {
    bind(event, callback) {
      console.log("bind", event);
      events[event] = events[event] || [];
      events[event].push(callback);
    },
    once(event, callback) {
      console.log("once", event);
      onceEvents[event] = onceEvents[event] || [];
      onceEvents[event].push(callback);
    },
    unbind(event, callback) {
      console.log("unbind", event);
      if (events[event]) {
        events[event] = events[event].filter((cb) => cb !== callback);
      }
    },
  },
  helpers: {
    cookie: {},
    isSiteAdmin() {
      return false;
    },
  },
  playerController: {
    volume: 5,
    voteUp: {
      click() {
        document.querySelector(".dubup").classList.add("voted");
      },
    },
  },
};

window.QueUp = QueUp;

window.emojify = {
  emojiNames: [],
  defaultConfig: {
    img_dir: "",
  },
};

/** @type {{[eventName: string]: Array<(e: any) => void>}} */
const events = {};

/** @type {{[eventName: string]: Array<(e: any) => void>}} */
const onceEvents = {};

// this will force the loading spinner to show so we can
// make sure that works
function addProperties() {
  window.QueUp.session.id = CURRENT_USER_ID;
}
window.setTimeout(addProperties, 2000);

/**
 *
 * @param {string} eventName
 * @param {any} data
 */
function triggerEvent(eventName, data) {
  if (events[eventName]) {
    events[eventName].forEach((cb) => cb(data));
  }

  if (onceEvents[eventName]) {
    onceEvents[eventName].forEach((cb) => cb(data));
    delete onceEvents[eventName];
  }
}

window.soundManager = {
  canPlayURL: (url) => {
    return url.startsWith("http");
  },
};

/**
 *
 * @param {KeyboardEvent} e
 */
function onChatKeyUp(e) {
  if (
    e.key === "Enter" &&
    !document.querySelector("#autocomplete-preview")?.children?.length
  ) {
    e.preventDefault();
    const message = e.target.value;
    e.target.value = "";

    const notSelf = message.trim().startsWith("user:");
    /**
     * @type {import('../src/global').ChatMessageEvent}
     */
    const chatMessage = {
      message,
      user: {
        username: notSelf ? "different-user" : CURRENT_USER_NAME,
        userInfo: {
          userid: notSelf ? "user-456" : CURRENT_USER_ID,
        },
      },
    };
    makeChatMessage(message, chatMessage.user.username);
    triggerEvent("realtime:chat-message", chatMessage);
  }
}

document
  .getElementById("chat-txt-message")
  .addEventListener("keyup", onChatKeyUp);

function makeChatMessage(message, username) {
  const li = document.createElement("li");
  li.classList.add("current-chat-user", "chat-id-abc-123");

  li.innerHTML = `<div class="stream-item-content">
        <div class="chatDelete">
          <span class="icon-close"></span>
        </div>
        <div class="image_row">
          <img
            src="https://api.queup.net/user/654ee5a3a9d4e50006987572/image"
            alt="${username}"
            title="${username}"
            class="cursor-pointer"
          />
        </div>
        <div class="activity-row">
          <div class="username">
            <span class="user-role-icon"></span>${username}<span class="user-role"></span>
          </div>
          <div class="text">
            <p>${message}</p>
          </div>
          <div class="meta-info">
            <span class="username">${username} </span>
              <i class="icon-dot"></i>
              <span class="timeinfo">
                <time
                  class="timeago"
                  datetime="2024-06-21T15:45:43.312Z"
                  title="6/21/2024, 11:45:43 AM"
                  >28 minutes ago</time>
              </span>
          </div>
        </div>
      </div>
    `;
  document.querySelector(".chat-main").appendChild(li);
}

let open = "player";
document.querySelectorAll("#mobile-room-menu a").forEach((a) => {
  const target = a.getAttribute("data-display");
  a.addEventListener("click", (e) => {
    e.preventDefault();
    document.body.setAttribute("data-display", target);
  });
});
