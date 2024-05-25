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

export function readBusanOrSeoul() {
  const urlParams = new URLSearchParams(window.location.search);
  const mapParam = urlParams.get("map");
  if (mapParam == null) {
    return "seoul";
  }

  if (mapParam === "busan") {
    return "busan";
  }
  if (mapParam === "seoul") {
    return "seoul";
  }
  console.error(`Invalid map param: ${mapParam}`);
  return "seoul";
}

export const urlParam = {
  readIdPrefix,
  readDebug,
  readFloor,
  readBusanOrSeoul,
};
