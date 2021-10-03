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

// 그러니까

// 상황 1 처음부터 따라옴
// 상황 2 중간에 접속했지만 처음 데이터 없음.
// 상황 3 중간에 잡속했지만 처음 데이터 있음 + debug 모드
// 상황 3 중간에 잡속했지만 처음 데이터 있음 + no debug 모드
