export function saveToBrowserStorage(key, value) {
  const urlParams = new URLSearchParams(window.location.search);
  const prefix = urlParams.get("idprefix");
  const prefixedKey = prefix != null ? prefix + key : key;
  localStorage.setItem(prefixedKey, value);
}

export function loadFromBrowserStorage(key) {
  const urlParams = new URLSearchParams(window.location.search);
  const prefix = urlParams.get("idprefix");
  const prefixedKey = prefix != null ? prefix + key : key;
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
