export type SettingsSections = "option" | "menu" | "custom";

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
      }
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
          songInfo: {
            name: string;
          }
        }
      }
    };
    model: {
      get: (name: string) => any;
      id: string;
    };
    // TODO: actually type this
    users: any;
  }
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
  },
  playerController: {
    volume: number;
    voteUp: HTMLAnchorElement;
  }

}

interface Emojify {
  defaultConfig: {
    img_dir: string
  };
  emojiNames: string[]
}

interface LDB {
  get: (key: string, cb: (value: string) => void) => void;
  set: (key: string, value: string) => void;
}

declare global {
  interface Window {
    QueUp: QueUp;
    emojify: Emojify;
    ldb: LDB;
    soundManager: {
      canPlayURL: (url: string) => boolean;
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
    userid: string
  }
}