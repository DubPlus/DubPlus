const PREFIX = 'Dub+'; // This is the prefix for all log messages

function getTimeStamp() {
  return new Date().toLocaleTimeString();
}

/**
 * @param {unknown[]} args
 */
export function logInfo(...args) {
  console.log(`[${getTimeStamp()}] ${PREFIX}:`, ...args);
}

/**
 * @param {unknown[]} args
 */
export function logDebug(...args) {
  console.debug(`[${getTimeStamp()}] ${PREFIX}:`, ...args);
}

/**
 * @param {unknown[]} args
 */
export function logWarn(...args) {
  console.warn(`[${getTimeStamp()}] ${PREFIX}:`, ...args);
}

/**
 * @param {unknown[]} args
 */
export function logError(...args) {
  console.error(`[${getTimeStamp()}] ${PREFIX}:`, ...args);
}
