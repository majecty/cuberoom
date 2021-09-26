/* eslint no-param-reassign: ["error", { "props": false }] */
import { log } from "../../log";
import {
  playerCreate,
  playerinitmove,
  playerFollowClickUpdate,
  playerMoveNameLabelAndChatBubble,
  playerFollowNetworkPos,
} from "../../entity/player";
import {
  mapUpdateMousePoint,
  mapOnPointerDown,
} from "../../entity/map/interaction";
import { allCharacterImageNames } from "../../entity/player/image";
import { playerCreateAnimations } from "../../entity/player/animation";
import { mapCreate, mapCreateOverCharacterLayer } from "../../entity/map";
import {
  playerOnMapCreate,
  playerOnMapUpdate,
} from "../../relation/playerOnMap";
import { listenRemovePlayerOnPlayer, cameraInit } from "../common";
import { playersCreate, playersAddPlayer, playersEntries } from "./players";
import {
  playersContainerListenRemovePlayer,
  playersContainerListenPlayerList,
  playersContainerListenAddChat,
  playersContainerListenRemoveChat,
} from "./playersContainer";
import {
  rateLimiterCreate,
  rateLimiterTrigger,
} from "../../network/rateLimiter";
import {
  saveToBrowserStorage,
  loadFromBrowserStorage,
} from "../../pages/storage";

/**
 * @typedef {import("../../relation/playerOnMap").OnMoveToTile} OnMoveToTile
 */

/**
 * initialize map, player, cursors, playerOnMap, socket, sceneName, players
 */
export function baseSceneConstructor(selfScene, sceneName) {
  log(sceneName, "constructor");
  selfScene.map = null;
  selfScene.player = null;
  selfScene.cursors = null;
  selfScene.playerOnMap = null;
  selfScene.socket = window.socket;
  selfScene.sceneName = sceneName;
  selfScene.players = playersCreate(sceneName);
  selfScene.rateLimiter = rateLimiterCreate();

  playersContainerListenRemovePlayer(selfScene, selfScene.socket);
  listenRemovePlayerOnPlayer(
    selfScene.socket,
    selfScene.sceneName,
    () => selfScene.socket.id,
    () => {
      selfScene.player = null;
    }
  );
  playersContainerListenPlayerList({
    socket: selfScene.socket,
    sceneName: selfScene.sceneName,
    phaserScene: selfScene,
    container: selfScene,
  });
  playersContainerListenAddChat(
    selfScene,
    selfScene.socket,
    selfScene.sceneName
  );
  playersContainerListenRemoveChat(
    selfScene,
    selfScene.socket,
    selfScene.sceneName
  );
}

// data는 어디서 온 데이터지?
export function baseSceneInit(selfScene, data) {
  log(selfScene.sceneName, "init");

  if (data.x) {
    selfScene.x = data.x;
    selfScene.destinationX = data.x;
  }
  if (data.y) {
    selfScene.y = data.y;
    selfScene.destinationY = data.y;
  }
}

export function baseScenePreload(selfScene) {
  log(selfScene.sceneName, "preload");
  // FIXME: move this to player code
  for (const [key, file] of allCharacterImageNames(
    selfScene.socket.id,
    loadFromBrowserStorage("playerImgUrl")
  )) {
    selfScene.load.image(key, file);
  }
}

/**
 * @param {Object} arg
 * @param {OnMoveToTile} arg.onMoveToTile
 */
export function baseSceneCreate({
  selfScene,
  mapName,
  mapBackgroundLayerName,
  onMoveToTile,
}) {
  log(selfScene.sceneName, "create");
  playerCreateAnimations(selfScene.socket.id, selfScene);

  selfScene.map = mapCreate(selfScene, mapName);
  selfScene.player = playerCreate(
    selfScene,
    selfScene.x,
    selfScene.y,
    loadFromBrowserStorage("playerName"),
    "",
    selfScene.socket.id,
    loadFromBrowserStorage("playerImgUrl")
  ); // 소켓 연결 되면 이 부분을 지워야 함
  selfScene.players = playersAddPlayer(
    selfScene.players,
    selfScene.socket.id,
    selfScene.player
  );
  selfScene.player = playerinitmove(selfScene.player);

  selfScene.socket.emit("addPlayer", {
    id: selfScene.socket.id,
    name: loadFromBrowserStorage("playerName"),
    imgUrl: loadFromBrowserStorage("playerImgUrl"),
    floor: selfScene.sceneName,
    x: selfScene.x,
    y: selfScene.y,
  });

  selfScene.playerOnMap = playerOnMapCreate(onMoveToTile);
  selfScene.physics.add.collider(
    selfScene.player.phaser,
    selfScene.map.collisionLayer
  );

  selfScene.map = mapCreateOverCharacterLayer(
    selfScene.map,
    mapBackgroundLayerName
  );

  cameraInit({
    phaserScene: selfScene,
    mapWidth: selfScene.map.phaser.widthInPixels,
    mapHeight: selfScene.map.phaser.heightInPixels,
    player: selfScene.player,
  });

  selfScene.cursors = selfScene.input.keyboard.createCursorKeys();

  selfScene.input.on("pointerdown", (pointer) =>
    mapOnPointerDown(selfScene.map, pointer)
  );
}

export function baseSceneUpdate(selfScene, dtMillis) {
  const pointer = selfScene.input.activePointer;

  // player can be removed since removePlayer is called
  if (selfScene.player == null) {
    return;
  }

  selfScene.player = playerFollowClickUpdate(
    selfScene.player,
    selfScene.destinationX,
    selfScene.destinationY,
    selfScene
  );
  for (const [id, otherPlayer] of playersEntries(selfScene.players)) {
    if (id !== selfScene.player.id) {
      selfScene.players.entries[id] = playerFollowNetworkPos(
        otherPlayer,
        dtMillis
      );
    }
  }
  mapUpdateMousePoint(selfScene.map, selfScene);
  selfScene.playerOnMap = playerOnMapUpdate(
    selfScene.playerOnMap,
    selfScene.player,
    selfScene.map
  );

  if (pointer.isDown) {
    selfScene.destinationX = selfScene.input.activePointer.worldX;
    selfScene.destinationY = selfScene.input.activePointer.worldY;
  }

  selfScene.player = playerMoveNameLabelAndChatBubble(selfScene.player);

  if (
    selfScene.destinationX &&
    selfScene.destinationY &&
    (Math.abs(selfScene.destinationX - selfScene.player.phaser.x) > 20 ||
      Math.abs(selfScene.destinationY - selfScene.player.phaser.y) > 20)
  ) {
    rateLimiterTrigger(selfScene.rateLimiter, () => {
      // 씬을 이동할 경우 씬이 끝난 뒤에 이 코드가 호출될 수 있음.
      // rateLimiter의 경우 마지막 요청이 timeout 뒤에 호출함.
      // rateLimiter가 호출할 때 callback을 부를 수 없는 경우를 처리함.
      // 이보다 잘 처리할 방법이 필요.
      if (selfScene.player == null) {
        return;
      }

      saveToBrowserStorage("floor", selfScene.sceneName);
      saveToBrowserStorage("playerX", selfScene.player.phaser.x);
      saveToBrowserStorage("playerY", selfScene.player.phaser.y);

      selfScene.socket.emit("movePlayer", {
        id: selfScene.socket.id,
        floor: selfScene.sceneName,
        direction: selfScene.player.prevMove,
        x: selfScene.player.phaser.x,
        y: selfScene.player.phaser.y,
      });
    });
  }
}
