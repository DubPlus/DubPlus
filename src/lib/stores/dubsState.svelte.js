/**
 * @typedef {{userid: string, username: string}} DubInfo
 */

/**
 * @typedef {'updub' | 'downdub' | 'grab'} DubType
 */

/**
 * @typedef {object} DubsState
 * @property {DubInfo[]} upDubs
 * @property {DubInfo[]} downDubs
 * @property {DubInfo[]} grabs
 */

/**
 * @type {DubsState}
 */
export const dubsState = $state({
  upDubs: [],
  downDubs: [],
  grabs: [],
});

/**
 * @param {DubType} dubType
 * @returns {DubInfo[]}
 */
export function getDubCount(dubType) {
  if (dubType === 'updub') return dubsState.upDubs;
  if (dubType === 'downdub') return dubsState.downDubs;
  if (dubType === 'grab') return dubsState.grabs;
  return [];
}
