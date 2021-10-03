/* eslint-disable import/prefer-default-export */

export function log(...args) {
  /* eslint-disable no-console */
  console.log(...args);
}

export function logErr(...args) {
  console.error(...args);
}
