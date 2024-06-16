
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
    id: string;
  };
  room: {
    chat: {
      sendMessage: () => void;
    };
    player: {
      muted_player: boolean;
      mutePlayer: () => void;
      setVolume: (volume: number) => void;
      updateVolumeBar: () => void;
      activeSong: {
        get: (name: string) => Song;
      }
    };
    model: {
      get: (name: string) => any;
    };
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
  },
  playerController: {
    volume: number;
    voteUp: HTMLAnchorElement;
  }

}

declare global {
  interface Window { QueUp: QueUp; }
}

// I had to move these here because it's used in multiple
// files and I couldn't do that with jsdoc
export interface ModalProps {
  title?: string;
  content?: string;
  value?: string;
  placeholder?: string;
  maxlength?: number;
  onConfirm?: (value: string) => void;
  /**
   * Callback for when the modal is closed
   * either via cancel or confirm without editing
   * (for informational modals)
   */
  onCancel?: () => void;
  show: boolean;
}