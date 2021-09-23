import { log } from "../log";

export const FLOOR_NAMES = {
  EntranceScene: "entrance",
  FirstFloorScene: "1F",
  SecondFloorScene: "2F",
  FifthFloorScene: "5F",
  SixthFloorScene: "6F",
  SeventhFloorScene: "7F",
  EighthFloorScene: "8F",
  FirstBasementScene: "B1",
  SecondBasementScene: "B2",
};

/**
 * removePlayer: functions that remove player from scene
 */
export function listenRemovePlayerOnPlayer(
  socket,
  sceneName,
  getId,
  removePlayer
) {
  socket.on("removePlayer", (data) => {
    if (data.id === getId()) {
      log("removePlayer", sceneName, data.id, data);
      removePlayer();
    }
  });
}

export function cameraInit({ phaserScene, mapWidth, mapHeight, player }) {
  phaserScene.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
  phaserScene.cameras.main.startFollow(player.phaser, true, 0.1, 0.1);
  phaserScene.cameras.main.fadeIn(500);
}
