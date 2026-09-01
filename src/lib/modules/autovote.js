import { clickVoteUp } from '../queup';
import { PLAYER_ADVANCE, queupEvents } from '../../utils/events';

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
    queupEvents.on(PLAYER_ADVANCE, clickVoteUp);
  },
  turnOff() {
    queupEvents.off(PLAYER_ADVANCE, clickVoteUp);
  },
};
