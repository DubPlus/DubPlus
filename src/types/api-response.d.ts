interface BaseApiResponse {
  code: number;
  message?: string;
}

export interface UserApiResponse extends BaseApiResponse {
  data: {
    username: string;
    status: number;
    roleid: number;
    dubs: number;
    created: number;
    profileImage: {
      public_id: string | null;
      key: string;
      version: string;
      format: string;
      resource_type: string;
      type: string;
      url: string;
      secure_url: string;
    };
    paid_plan_type: number;
    userInfo: {
      userid: string;
    };
  };
}

/**
 * Response for "get all users" - list of room users (DJs/queue entries) for a room.
 */
export interface RoomUsersApiResponse extends BaseApiResponse {
  data: RoomUser[];
}

export interface RoomUser {
  _id: string;
  updated: number;
  skippedCount: number;
  playedCount: number;
  songsInQueue: number;
  active: boolean;
  dubs: number;
  order: number;
  roomid: string;
  userid: string;
  _user: RoomUserProfile;
  authorized: boolean;
  ot_token: string | null;
  waitLine: number;
  roleid: RoomUserRole;
  queuePaused: number | null;
  banned?: boolean;
  bannedTime?: number;
  bannedUntil?: number;
}

/**
 * Response for the room's `/playlist` endpoint. Same entries as RoomUsersApiResponse,
 * but `_user` and `roleid` are ids instead of populated objects.
 */
export interface RoomPlaylistApiResponse extends BaseApiResponse {
  data: RoomPlaylistUser[];
}

export interface RoomPlaylistUser extends Omit<
  RoomUser,
  '_user' | 'roleid' | 'queuePaused'
> {
  _user: string;
  roleid: string;
  roleids: string[];
  queuePaused?: number | null;
  __v: number;
}

/**
 * Response for GET /playlist: the logged-in user's playlists
 */
export interface UserPlaylistsApiResponse extends BaseApiResponse {
  data: UserPlaylist[];
}

export interface UserPlaylist {
  _id: string;
  name: string;
  status: number;
  removed: boolean;
  isPublic: boolean;
  /** epoch milliseconds */
  created: number;
  type: string | null;
  fkid: string | null;
  userid: string;
  __v: number;
  /** number of songs in the playlist */
  totalItems: number;
  order: number;
  rev: number;
  /** epoch milliseconds */
  updated: number;
  sortKey: string;
}

/**
 * Response for GET /playlist/:playlistid/songs?name=&page=N
 */
export interface PlaylistSongsApiResponse extends BaseApiResponse {
  data: PlaylistSong[];
}

export interface PlaylistSong {
  _id: string;
  added: number;
  songid: string;
  _song: PlaylistSongDetails;
  playlistid: string;
  source: string | null;
  __v: number;
  addedBy: string;
  rev: number;
  sortKey: string;
}

export interface PlaylistSongDetails {
  _id: string;
  name: string;
  images: { thumbnail: string };
  type: 'youtube' | 'soundcloud';
  /** YouTube video id or SoundCloud track id */
  fkid: string;
  /** milliseconds */
  songLength: number;
  /** ISO date string */
  created: string | null;
  /** ISO date string */
  lastUpdated?: string;
  __v: number;
  categoryId?: string;
  genre?: string | null;
  regionRestriction?: { allowed?: string[]; blocked?: string[] } | null;
  streamUrl?: string | null;
  name_fuzzy?: string[];
}

export interface RoomUserProfile {
  username: string;
  status: number;
  roleid: number;
  dubs: number;
  created: number;
  profileImage: RoomUserProfileImage | null;
  paid_plan_type: number;
}

export interface RoomUserProfileImage {
  public_id: string | null;
  key: string;
  version: string;
  format: string;
  resource_type: string;
  bytes: number;
  type: string;
  etag: string;
  url: string;
  secure_url: string;
}

export interface RoomUserRole {
  type: string;
  label: string;
  order: number;
  rights: string[];
}
