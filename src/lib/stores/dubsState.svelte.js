/**
 * @typedef {{userid: string, username: string}} DubInfo
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
 * @param {"updub" | "downdub" | "grab"} dubType
 * @returns {DubInfo[]}
 */
export function getDubCount(dubType) {
  if (dubType === 'updub') return dubsState.upDubs;
  if (dubType === 'downdub') return dubsState.downDubs;
  if (dubType === 'grab') return dubsState.grabs;
  return [];
}
