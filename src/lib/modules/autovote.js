import { QUEUP_EVENT } from '../../events-constants';
import { clickVoteUp, onQueup, offQueup } from '../queup.v2';

/**
 * @type {import("./module").DubPlusModule}
 */
export const autovote = {
  id: 'autovote',
  label: 'autovote.label',
  description: 'autovote.description',
  category: 'general',
  turnOn() {
    clickVoteUp();
    onQueup(QUEUP_EVENT.SONG_CHANGED, clickVoteUp);
  },
  turnOff() {
    offQueup(QUEUP_EVENT.SONG_CHANGED, clickVoteUp);
  },
};
