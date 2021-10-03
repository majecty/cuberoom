import { readIdPrefix } from "../common/urlParam";

// storage 접근 코드랑 high level 코드 나누기

export function resetSave() {
  localStorage.clear();
}

export function saveToBrowserStorage(key, value) {
  const prefix = readIdPrefix();
  const prefixedKey = `${prefix}${key}`;
  localStorage.setItem(prefixedKey, value);
}

export function loadFromBrowserStorage(key) {
  const prefix = readIdPrefix();
  const prefixedKey = `${prefix}${key}`;
  return localStorage.getItem(prefixedKey);
}

export function saveIdAndPassword(id, password) {
  saveToBrowserStorage("id", id);
  saveToBrowserStorage("password", password);
}

export function saveCharacterSelection(playerImgUrl, playerName) {
  saveToBrowserStorage("playerImgUrl", playerImgUrl);
  saveToBrowserStorage("playerName", playerName);
}

export function saveMovement(floor, x, y) {
  saveToBrowserStorage("floor", floor);
  saveToBrowserStorage("playerX", x);
  saveToBrowserStorage("playerY", y);
}

export function loadIdAndPassword() {
  const id = loadFromBrowserStorage("id");
  const password = loadFromBrowserStorage("password");
  return {
    id,
    password,
  };
}

export function isSavePrepared() {
  const requiredKeys = ["id", "password", "playerImgUrl", "playerName"];
  for (const key of requiredKeys) {
    if (loadFromBrowserStorage(key) == null) {
      return false;
    }
  }
  return true;
}

export function loadFloorAndMovement() {
  const floor = loadFromBrowserStorage("floor");
  const x = loadFromBrowserStorage("playerX");
  const y = loadFromBrowserStorage("playerY");
  return {
    floor,
    x,
    y,
  };
}

export function loadPlayerNameAndImgUrl() {
  const playerImgUrl = loadFromBrowserStorage("playerImgUrl");
  const playerName = loadFromBrowserStorage("playerName");
  return {
    playerImgUrl,
    playerName,
  };
}
