import { ifDebug } from "./common/debug";

/* eslint-disable import/prefer-default-export */

export function log(...args) {
  /* eslint-disable no-console */
  console.log(...args);
}

export function logErr(...args) {
  console.error(...args);
}

export function logDebug(...args) {
  ifDebug(() => {
    console.log(...args);
  });
}
