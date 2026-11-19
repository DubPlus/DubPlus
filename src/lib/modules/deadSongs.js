import Icon from '../svg/SearchSkull.svelte';
import { openDeadSongs } from '../dead-songs/deadSongsState.svelte.js';

/**
 * Find dead songs
 * Opens a dialog that scans your playlists for dead songs and deletes the ones you pick
 */

/**
 * @type {import("./module").DubPlusModule}
 */
export const deadSongs = {
  id: 'deadsongs',
  label: 'deadsongs.label',
  description: 'deadsongs.description',
  category: 'general',
  altIcon: Icon,
  onClick: openDeadSongs,
};
