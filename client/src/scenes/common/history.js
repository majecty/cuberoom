const history = [];

export function saveSceneToHistory(floor) {
  history.push(floor);
}

export function isFirstScene() {
  return history.length === 0;
}
