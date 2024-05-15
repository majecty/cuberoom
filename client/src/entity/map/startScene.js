import { log } from "../../log";
import { FLOOR_NAMES, FLOOR_TO_SCENE } from "../../scenes/common";
// seems layer collision. entity is using scenes
import { playersReset } from "../../scenes/common/players";

export function getFloorName(sceneName) {

  if (FLOOR_NAMES[sceneName]) {
    return FLOOR_NAMES[sceneName];
  }

  throw new Error(`invalid sceneName: ${sceneName}`);
}

/* eslint no-param-reassign: ["error", { "props": false }] */
export default function startScene(currentScene, targetSceneName, spawnPos) {
  log("call startScene");
  currentScene.cameras.main.fadeOut(500);
  currentScene.players = playersReset(currentScene.players);
  currentScene.player = null;
  currentScene.stop = true;
  currentScene.cameras.main.on("camerafadeoutcomplete", () => {
    log("start next scene");
    currentScene.scene.pause(currentScene.scene.key);
    currentScene.scene.start(targetSceneName, spawnPos);
  });
}
