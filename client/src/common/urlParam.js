export function readIdPrefix() {
  const urlParams = new URLSearchParams(window.location.search);
  const prefix = urlParams.get("idprefix");
  if (prefix == null) {
    return "";
  }
  return prefix;
}

export function readDebug() {
  const urlParams = new URLSearchParams(window.location.search);
  const debug = urlParams.get("debug");
  if (debug == null) {
    return false;
  }
  return true;
}

/**
 * @returns {string | null}
 */
export function readFloor() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("floor");
}

export const urlParam = {
  readIdPrefix,
  readDebug,
  readFloor,
};
