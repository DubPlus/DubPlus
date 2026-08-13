import { PLAYLIST_UPDATE } from '../../events-constants';
import { bindEvent, clickVoteUp, unbindEvent } from '../queup';

function voteCheck() {
  // we can call this as many times as we want, it will only vote once per song
  clickVoteUp();
}

/**
 * @type {import("./module").DubPlusModule}
 */
export const autovote = {
  id: 'autovote',
  label: 'autovote.label',
  description: 'autovote.description',
  category: 'general',
  turnOff() {
    unbindEvent(PLAYLIST_UPDATE, voteCheck);
  },
  turnOn() {
    voteCheck();
    bindEvent(PLAYLIST_UPDATE, voteCheck);
  },
};
