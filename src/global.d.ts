import { QueupEvents } from './utils/events.js';

export type SettingsSections = 'option' | 'menu' | 'custom';

export interface Settings {
  options: { [key: string]: boolean };
  menu: { [key: string]: string };
  custom: { [key: string]: string };
}

export interface Song {
  _id: string;
  created: number;
  isActive: boolean;
  isPlayed: boolean;
  skipped: boolean;
  order: number;
  roomid: string;
  songLength: number;
  updubs: number;
  downdubs: number;
  userid: string;
  songid: string;
  _user: string;
  _song: string;
  __v: number;
  played: number;
}

export interface SongInfo {
  fkid: string;
  name: string;
  type: string;
}

export interface QueUp {
  session: {
    /**
     * This is the current logged in user's userid
     */
    id: string;
    get: (name: string) => any;
  };
  room: {
    chat: {
      sendMessage: () => void;
      delegateEvents: (events: { [key: string]: string }) => void;
      events: { [key: string]: string };
      ncKeyDown: (e: Partial<KeyboardEvent>) => void;
      mentionChatSound: {
        play: () => void;
        url: string;
      };
      resizeTextarea: () => void;
    };
    player: {
      muted_player: boolean;
      mutePlayer: () => void;
      setVolume: (volume: number) => void;
      updateVolumeBar: () => void;
      activeSong: {
        get: (name: string) => Song;
        attributes: {
          song: {
            played: number;
            updubs: number;
            downdubs: number;
            userid: string;
          };
          songInfo: SongInfo;
        };
      };
    };
    model: {
      get: (name: string) => any;
      id: string;
    };
    // TODO: actually type this
    users: any;
  };
  Events: {
    bind: (event: string, callback: (e: any) => void) => void;
    once: (event: string, callback: (e: any) => void) => void;
    unbind: (event: string, callback: (e: any) => void) => void;
  };
  helpers: {
    cookie: {
      get: (name: string) => string;
      set: (name: string, value: string, days: number) => void;
    };
    isSiteAdmin: (userid: string) => boolean;
  };
  playerController: {
    volume: number;
    voteUp: HTMLAnchorElement;
  };
}

interface Emojify {
  defaultConfig: {
    img_dir: string;
  };
  emojiNames: string[];
}

/**
 * QueUp's RealtimeManager singleton. Event names are `realtime:` + the
 * payload's `type` (chat-message, room_playlist-update, user-join,
 * new-message, ...), plus connection lifecycle events (connected,
 * disconnected, reconnecting, suspended, rateLimited, spectatorLimitReached,
 * error). `'*'` receives every event as (type, data).
 */
export interface QueupRealtime {
  on: {
    (event: '*', handler: (type: string, data: any) => void): void;
    (event: string, handler: (data: any) => void): void;
  };
  off: {
    (event: '*', handler: (type: string, data: any) => void): void;
    (event: string, handler: (data: any) => void): void;
  };
  bind: (event: string, handler: (data: any) => void) => void;
  unbind: (event: string, handler: (data: any) => void) => void;
  isConnected: () => boolean;
  hasRoomId: () => boolean;
  getDebugSnapshot: () => {
    roomId: string | null;
    hasSocket: boolean;
    connectionState: string;
    currentRetries: number;
    shouldReconnect: boolean;
    currentUserId: string | null;
    channels: {
      name: string;
      state: string;
      isUser: boolean;
      isPresence: boolean;
    }[];
  };
}

interface LDB {
  get: (key: string, cb: (value: string) => void) => void;
  set: (key: string, value: string) => void;
}

declare global {
  interface Window {
    QueUp: QueUp; // this doesn't work or exist anymore
    dubplus: {
      name?: string;
      version?: string;
      description?: string;
      license?: string;
      homepage?: string;
      roomId?: string;
      userId?: string;
      queupEvents?: InstanceType<typeof QueupEvents>;
      /**
       * QueUp's RealtimeManager singleton, dug out of their Turbopack module
       * registry by extension/register-dubplus.js at document_start. Returns
       * null when it isn't reachable, so always keep a fallback.
       * It's a mitt emitter: `on('*', (type, data) => ...)` or
       * `on('realtime:chat-message', (data) => ...)`.
       */
      getQueupRealtime?: () => QueupRealtime | null;
      /**
       * Runs the callback once QueUp's RealtimeManager singleton is reachable.
       * Never runs if it isn't.
       */
      onQueupRealtime?: (callback: (realtime: QueupRealtime) => void) => void;
      /**
       * Console helper that logs every realtime event QueUp receives.
       * Returns a function that stops the logging.
       */
      debugQueupRealtime?: () => (() => void) | null;
      /**
       * The native console.log, captured once so dev rebuilds (which
       * re-run modules while the page persists) don't nest console.log
       * wrappers on top of each other.
       */
      __originalConsoleLog?: typeof console.log;
      /**
       * Removes the '*' listener src/utils/events.js put on QueUp's
       * RealtimeManager, so a dev rebuild doesn't stack a second one on a
       * RealtimeManager that outlives the module.
       */
      __detachRealtimeBridge?: (() => void) | undefined;
    };
  }
}

// I had to move these here because it's used in multiple
// files and I couldn't do that with jsdoc
export interface ModalProps {
  title?: string;
  content?: string;
  value?: string;
  placeholder?: string;
  defaultValue?: string;
  maxlength?: number;
  /**
   *
   * @param value The value of the input
   * @returns true = validation passed, string = error message
   */
  validation?: (value: string) => string | true;
  /**
   * Callback for when the modal is confirmed
   */
  onConfirm?: (value: string) => void;
  /**
   * Callback for when the modal is closed
   * either via "cancel" or "ok" button for informational modals
   */
  onCancel?: () => void;
  open?: boolean;
}

export interface QueUpUser {
  username: string;
  userInfo: {
    userid: string;
  };
}
