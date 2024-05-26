import { log } from "../log";
import { zoom } from "../constant";
import { protocol } from "../network/protocol";

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

  BusanExternalScene: "BusanExternal",
  Busan1FScene: "Busan1F",
  BusanTopScene: "BusanTop",
};

export const FLOOR_TO_SCENE = {
  entrance: "EntranceScene",
  "1F": "FirstFloorScene",
  "2F": "SecondFloorScene",
  "5F": "FifthFloorScene",
  "6F": "SixthFloorScene",
  "7F": "SeventhFloorScene",
  "8F": "EighthFloorScene",
  B1: "FirstBasementScene",
  B2: "SecondBasementScene",

  BusanExternal: "BusanExternalScene",
  Busan1F: "Busan1FScene",
  BusanTop: "BusanTopScene",
};

/**
 * removePlayer: functions that remove player from scene
 */
export function listenRemovePlayerOnPlayer(
  scene,
  socket,
  floor,
  getId,
  removePlayer
) {
  protocol.onRemovePlayer(socket, (data) => {
    if (scene.stop) {
      return;
    }
    if (data === getId()) {
      log("removePlayer", floor, data.id, data);
      removePlayer();
    }
  });
}

export function cameraInit({ phaserScene, mapWidth, mapHeight, player }) {
  phaserScene.cameras.main.setBounds(
    0,
    0,
    (mapWidth * 2) / zoom,
    (mapHeight * 2) / zoom
  );
  phaserScene.cameras.main.startFollow(player.phaser, true, 0.1, 0.1);
  phaserScene.cameras.main.fadeIn(500);
}
