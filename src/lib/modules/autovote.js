import { clickVoteUp } from '../queup';
import { offPlayerAdvance, onPlayerAdvance } from '../queup.v2';

/**
 * @type {import("./module").DubPlusModule}
 */
export const autovote = {
  id: 'autovote',
  label: 'autovote.label',
  description: 'autovote.description',
  category: 'general',
  turnOff() {
    offPlayerAdvance(clickVoteUp);
  },
  turnOn() {
    clickVoteUp();
    onPlayerAdvance(clickVoteUp);
  },
};
