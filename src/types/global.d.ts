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

interface LDB {
  get: (key: string, cb: (value: string) => void) => void;
  set: (key: string, value: string) => void;
}

/**
 * A QueUp user as returned by the extension API.
 */
export interface QueUpUser {
  id: string;
  username: string;
}

export interface QueUpSong {
  id: string;
  title: string;
  durationSeconds: number;
  thumbnailUrl: string;
  type: 'youtube' | 'soundcloud';
  updubs: number;
  downdubs: number;
  grabs: number;
  /** Epoch ms this song was marked played, mirrored as-is from the backend. */
  played: number;
}

export interface QueUpMySong {
  id: string;
  title: string;
  durationSeconds: number;
  thumbnailUrl: string;
  type: 'youtube' | 'soundcloud';
}

export interface QueUpQueueEntry {
  userId: string;
  /** null on the rare tick where the room roster hasn't resolved this id yet. */
  username: string | null;
  /** 1-based position in the DJ rotation. */
  position: number;
  songsQueued: number;
}

/**
 * The curated app lifecycle events available through `window.QueUp.on`.
 * Everything else lives on `window.QueUp.realtime`.
 */
export type QueUpEventMap = {
  /** Fires when the signed-in user's id or username changes. */
  'session:changed': { user: QueUpUser | null };
  'room:joined': { roomId: string };
  'room:left': { roomId: string };
  /** `startTime` is seconds into the song when the change was seen, not a live position. */
  'room:song-changed': {
    song: QueUpSong | null;
    dj: QueUpUser | null;
    startTime: number | undefined;
  };
  'room:dj-changed': { dj: QueUpUser | null };
};

export interface ExternalChatCommandContext {
  roomId: string | null;
  /** Raw text typed after "/name " - e.g. "/weather london" gives "london". */
  args: string;
  /**
   * Resolves a typed name (with or without a leading "@") against the room's
   * live user list, or null if nobody matches.
   */
  findUser: (username: string) => QueUpUser | null;
}

export interface ExternalChatCommand {
  /** Lowercase, no leading slash. Can't shadow a built-in command name. */
  name: string;
  usage?: string;
  description?: string;
  /**
   * 'username' gets a live autocomplete popup sourced from the room's current
   * user list; 'text' is free-form. Omit for a no-argument command.
   */
  argSlots?: ('username' | 'text')[];
  /** Return false to hide/disable this command right now. */
  isAvailable?: () => boolean;
  /**
   * Returning a string sends it as a chat message; returning nothing performs
   * a side effect only.
   */
  run: (
    context: ExternalChatCommandContext,
  ) => void | string | Promise<void | string>;
}

/**
 * `window.QueUp`, QueUp's extension API.
 * @see https://gitlab.com/queup/extension-sdk/-/blob/main/README.md
 */
export interface QueUp {
  version: string;
  session: {
    isLoggedIn(): boolean;
    getUser(): QueUpUser | null;
  };
  room: {
    getRoomId(): string | null;
    getCurrentDJ(): QueUpUser | null;
    /**
     * Vote counts tick live, so call this again rather than caching the
     * returned object. The object is frozen and keeps its identity until the
     * underlying data actually changes.
     */
    getCurrentSong(): QueUpSong | null;
    /** The room's player, not a SongPreview dialog (that has its own volume). */
    player: {
      /** 0-100 */
      getVolume(): number;
      setVolume(volume: number): void;
      isMuted(): boolean;
      mute(): void;
      unmute(): void;
    };
    queue: {
      isInQueue(): boolean;
      /** 1-based, 0 if not queued */
      getMyPosition(): number;
      getMySongs(): readonly QueUpMySong[];
      getRoomQueue(): readonly QueUpQueueEntry[];
    };
  };
  /**
   * Subscribe to one of QueUp's curated app events. Returns an unsubscribe
   * function. A handler that throws is caught and logged.
   * @example
   * const off = window.QueUp.on('room:song-changed', ({ song, dj }) => {})
   */
  on<K extends keyof QueUpEventMap>(
    event: K,
    handler: (payload: QueUpEventMap[K]) => void,
  ): () => void;
  /** Omitting `handler` removes every handler your script registered for that event. */
  off<K extends keyof QueUpEventMap>(
    event: K,
    handler?: (payload: QueUpEventMap[K]) => void,
  ): void;
  /**
   * A direct pass-through to QueUp's internal realtime feed (chat, votes,
   * roster changes, mod actions, connection status). Deliberately untyped:
   * these names and payloads are not a versioned public API and a realtime
   * overhaul with breaking changes is planned. Read payloads defensively.
   */
  realtime: {
    on(event: string, handler: (data: any) => void): void;
    off(event: string, handler?: (data: any) => void): void;
  };
  chat: {
    /**
     * Registers a `/` chat command alongside the built-in ones. Throws if
     * `name` collides with a built-in command; returns an unregister function.
     * @example
     * window.QueUp.chat.registerCommand({
     *   name: 'autovote',
     *   usage: '/autovote',
     *   description: "Toggle your extension's AutoVote feature",
     *   run: (context) => {
     *     // context.roomId, context.args, context.findUser(username)
     *     return 'AutoVote toggled'
     *   },
     * })
     */
    registerCommand(command: ExternalChatCommand): () => void;
    unregisterCommand(name: string): void;
  };
}

declare global {
  interface Window {
    QueUp: QueUp;
    dubplus: {
      name?: string;
      version?: string;
      description?: string;
      license?: string;
      homepage?: string;
      roomUsers?: Map<
        string,
        {
          userid: string;
          username: string;
          role: {
            type: string;
            label: string;
            rights: string[];
          };
        }
      >;
      /**
       * Set once src/utils/route.js has installed its route watcher, so a dev
       * rebuild doesn't patch history a second time.
       */
      __routeEmitterInstalled?: boolean;
      /**
       * Stops the route listener, detaches every window.QueUp listener, and
       * unmounts the app of the bundle that is already running on this page. A
       * dev rebuild or a second bookmarklet click evaluates a whole new bundle
       * over a live page; src/main.js calls this before installing its own
       * listeners so the old bundle can't keep mounting apps the new one has no
       * handle on.
       */
      __teardown?: (() => void) | undefined;
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
