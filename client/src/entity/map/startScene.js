function getFloorName(sceneName) {
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
  }
}

export default function startScene(currentScene, targetSceneName, spawnPos) {
  console.log("call startScene");
  currentScene.cameras.main.fadeOut(500);
  // window.socket.emit('moveFloor', { id: this.socket.id, floor: getFloorName(sceneName) });
  currentScene.cameras.main.on("camerafadeoutcomplete", () => {
    console.log("start next scene");
    currentScene.scene.pause(currentScene.scene.key);
    currentScene.scene.start(targetSceneName, spawnPos);
  });
}
