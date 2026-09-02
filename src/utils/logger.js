const PREFIX = 'Dub+'; // This is the prefix for all log messages

function getTimeStamp() {
  return new Date().toLocaleTimeString();
}

/**
 * @param {unknown[]} args
 */
export function logInfo(...args) {
  console.log(`[${getTimeStamp()}] INFO - ${PREFIX}:`, ...args);
}

/**
 * @param {unknown[]} args
 */
export function logDebug(...args) {
  console.debug(`[${getTimeStamp()}] DEBUG - ${PREFIX}:`, ...args);
}

/**
 * @param {unknown[]} args
 */
export function logWarn(...args) {
  console.warn(`[${getTimeStamp()}] WARN - ${PREFIX}:`, ...args);
}

/**
 * @param {unknown[]} args
 */
export function logError(...args) {
  console.error(`[${getTimeStamp()}] ERROR - ${PREFIX}:`, ...args);
}
