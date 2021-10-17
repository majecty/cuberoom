import { log } from "../../log";
// seems layer collision. entity is using scenes
import { playersReset } from "../../scenes/common/players";

export function getFloorName(sceneName) {
  switch (sceneName) {
    case "EntranceScene":
      return "entrance";
    case "FirstFloorScene":
      return "1F";
    case "SecondFloorScene":
      return "2F";
    case "FifthFloorScene":
      return "5F";
    case "SixthFloorScene":
      return "6F";
    case "SeventhFloorScene":
      return "7F";
    case "EighthFloorScene":
      return "8F";
    case "FirstBasementScene":
      return "B1";
    case "SecondBasementScene":
      return "B2";
    default:
      throw new Error(`invalie sceneName: {sceneName}`);
  }
}

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
