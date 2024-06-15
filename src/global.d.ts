
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
    };
    model: any;
    users: any;
  }
  Events: {
    bind: (event: string, callback: (e: any) => void) => void;
    once: (event: string, callback: (e: any) => void) => void;
  };
  helpers: {
    cookie: string;
  },
  playerController: {
    volume: number;
  }

}

declare global {
  interface Window { QueUp: QueUp; }
}