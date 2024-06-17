/** @type {import('../src/global').QueUp} */
const QueUp = {};

window.QueUp = QueUp;

/** @type {{[eventName: string]: Array<(e: AnalyserOptions) => void>}} */
const events = {};

/** @type {{[eventName: string]: Array<(e: AnalyserOptions) => void>}} */
const onceEvents = {};

// delay adding properties to the QueUp object
// so we can see the loading spinner
function addProperties() {
  const QueupProps = {
    session: {
      id: "user-123",
    },
    room: {
      chat: {
        sendMessage: () => {
          console.log("sendMessage");
        },
      },
      player: {
        muted_player: false,
        mutePlayer: () => {
          console.log("player muted");
          this.muted_player = true;
        },
        setVolume: (volume) => {
          console.log("setVolume", volume);
          window.QueUp.playerController.volume = volume;
        },
        updateVolumeBar: () => {
          console.log("updateVolumeBar");
        },
      },
      model: {},
      users: {},
    },
    Events: {
      bind(event, callback) {
        console.log("bind", event);
        events[event] = events[event] || [];
        events[event].push(callback);
      },
      once: (event, callback) => {
        console.log("once", event);
        onceEvents[event] = onceEvents[event] || [];
        onceEvents[event].push(callback);
      },
      unbind: (event, callback) => {
        console.log("unbind", event);
        onceEvents[event] = (onceEvents[event] || []).filter(
          (cb) => cb !== callback
        );
      },
    },
    helpers: { cookie: {} },
    playerController: {
      volume: 5,
    },
  };
  Object.assign(QueUp, QueupProps);
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
