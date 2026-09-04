/**
 * These types are re-used in multiple events
 */

interface User {
  roleid: number;
  status: number;
  username: string;
  _id: string; // same as userinfo.userid
  userInfo: {
    userid: string;
  };
}

interface Playlist {
  songLength: number;
  isActive: boolean;
  isPlayed: boolean;
  skipped: boolean;
  updubs: number;
  downdubs: number;
  order: number;
  songid: string;
  roomid: string;
  userid: string;
  played: number;
}

/******************************************* */
/**
 * UpDub or DownDub event.
 * 'realtime:room_playlist-dub'
 */
export interface DubEvent {
  type: 'room_playlist-dub';
  dubtype: 'updub' | 'downdub';
  user: User;
  playlist: Playlist;
}

/**
 * Grab Event
 */
export interface GrabEvent {
  type: 'room_playlist-queue-update-grabs';
  user: User;
  playlist: Playlist;
}

export interface PlaylistUpdateEvent {
  // we only use this property
  startTime: number;
}

export interface ChatMessageEvent {
  type: 'chat-message';
  message: string;
  chatid: string;
  user: User;
  time: string;
}

export interface UserLeaveEvent {
  type: 'user-leave';
  room: string; // the id of the room the user left
  user: User;
}

export interface NewMessageEvent {
  type: string;
  userid: string;
  messageid: string;
}

export interface UserJoinEvent {
  type: 'user-join';
  roomUser: {
    roleid: {
      label: string; // "Co-Owner"
      type: string; // "co-owner"
      rights: string[]; // a list of things user can do
      roomid: string;
      userid: string;
    };
  };
  user: User;
}
