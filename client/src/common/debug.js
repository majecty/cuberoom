import { readDebug } from "./urlParam";

/**
 * @param {() => void} debugFn
 * @param {(() => void) | null} ifNotDebugFn
 */
export function ifDebug(debugFn, ifNotDebugFn) {
  if (readDebug()) {
    debugFn();
  } else if (ifNotDebugFn != null) {
    ifNotDebugFn();
  }
}
