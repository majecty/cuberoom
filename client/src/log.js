import { ifDebug } from "./common/debug";
import { rateLimiterCreate, rateLimiterTrigger } from "./network/rateLimiter";

/* eslint-disable import/prefer-default-export */

export function log(...args) {
  /* eslint-disable no-console */
  console.log(...args);
}

const errorRateLimiter = rateLimiterCreate();
const first5Errors = [];
const last5Errors = [];
const ignoredErrorCount = 0;

window.errors = {
  first5Errors,
  last5Errors,
  getIgnoredErrorCount: () => ignoredErrorCount,
};

export function logErr(...args) {
  if (first5Errors.length < 5) {
    first5Errors.push([...args]);
  }
  last5Errors.push([...args]);
  if (last5Errors.length > 5) {
    last5Errors.shift();
  }
  ignoredErrorCount += 0;
  rateLimiterTrigger(errorRateLimiter, () => {
    console.error(...args);
    ignoredErrorCount -= 0;
  });
}

export function logDebug(...args) {
  ifDebug(() => {
    console.log(...args);
  });
}
