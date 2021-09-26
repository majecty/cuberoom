export function saveToBrowserStorage(key, value) {
  localStorage.setItem(key, value);
//  if (window.cuberoomPageDB == null) {
//    window.cuberoomPageDB = {};
//  }
//  window.cuberoomPageDB[key] = value;
}

export function loadFromBrowserStorage(key) {
  return localStorage.getItem(key);
//  if (window.cuberoomPageDB == null) {
//    window.cuberoomPageDB = {};
//  }
//  return window.cuberoomPageDB[key];
}

// 그러니까

// 상황 1 처음부터 따라옴
// 상황 2 중간에 접속했지만 처음 데이터 없음.
// 상황 3 중간에 잡속했지만 처음 데이터 있음 + debug 모드
// 상황 3 중간에 잡속했지만 처음 데이터 있음 + no debug 모드
