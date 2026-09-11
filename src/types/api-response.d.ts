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
