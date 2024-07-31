/**
 * UpDub or DownDub event
 */
export interface DubEvent {
  dubtype: string;
  user: {
    _id: string;
    username: string;
    // userInfo: {
    //   userid: string;
    // };
  };
}

/**
 * Grab Event
 */
export interface GrabEvent {
  user: {
    _id: string;
    username: string;
    // userInfo: {
    //   userid: string;
    // };
  };
}


export interface PlaylistUpdateEvent {
  // we only use this property
  startTime: number;

  // type: string;
  // song: {
  //   _id: string;
  //   created: number;
  //   isActive: boolean;
  //   isPlayed: boolean;
  //   skipped: boolean;
  //   order: number;
  //   roomid: string;
  //   songLength: number;
  //   updubs: number;
  //   downdubs: number;
  //   userid: string;
  //   songid: string;
  //   _user: string;
  //   _song: string;
  //   played: number;
  // };
  // songInfo: {
  //   _id: string;
  //   name: string;
  //   images: {
  //     thumbnail: string;
  //   };
  //   type: string;
  //   songLength: number;
  //   fkid: string;
  //   created: string;
  //   categoryId: string;
  //   genre: string;
  //   lastUpdated: string;
  //   regionRestriction: string;
  // };
}



export interface ChatMessageEvent {
  message: string;
  chatid: string;
  user: {
    _id: string;
    username: string;
    userInfo: {
      userid: string;
    };
  };
}


export interface UserLeaveEvent {
  user: {
    _id: string;
    username: string;
  };
  type: string;
}

export interface NewMessageEvent {
  type: string;
  userid: string;
  messageid: string;
}