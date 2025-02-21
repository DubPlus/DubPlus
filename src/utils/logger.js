const PREFIX = 'Dub+'; // This is the prefix for all log messages

function getTimeStamp() {
  return new Date().toLocaleTimeString();
}

export function logInfo(...args) {
  console.log(`[${getTimeStamp()}] ${PREFIX}:`, ...args);
}

export function logWarn(...args) {
  console.warn(`[${getTimeStamp()}] ${PREFIX}:`, ...args);
}

export function logError(...args) {
  console.error(`[${getTimeStamp()}] ${PREFIX}:`, ...args);
}
