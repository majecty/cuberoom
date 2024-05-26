/* eslint no-param-reassign: ["error", { "props": false }] */
import { log, logErr } from "../../log";
import {
  playerCreate,
  playerMoveNameLabelAndChat,
  playerFollowNetworkPos,
} from "../../entity/player";
import { loadChatBackgroundImage } from "../../entity/player/chat/background";
import { playerMove } from "../../entity/player/move";
import { mouseInputUpdateEvent } from "../../entity/player/move/mouse";
import { playerAddKey } from "../../entity/player/move/keyboard";
import { allCharacterImageNames } from "../../entity/player/image";
import { playerCreateAnimations } from "../../entity/player/animation";
import { mapCreate, mapCreateOverCharacterLayer } from "../../entity/map";
import {
  playerOnMapCreate,
  playerOnMapUpdate,
} from "../../relation/playerOnMap";
import { listenRemovePlayerOnPlayer, cameraInit, FLOOR_NAMES } from "../common";
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
  saveMovement,
  loadPlayerNameAndImgUrl,
  loadFloorAndMovement,
} from "../../pages/storage";
import { protocol } from "../../network/protocol";
import { ifDebug } from "../../common/debug";
import { isFirstScene, saveSceneToHistory } from "./history";

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
  selfScene.stop = false;

  playersContainerListenRemovePlayer(selfScene, selfScene, selfScene.socket);
  const floor = FLOOR_NAMES[sceneName];
  if (floor == null) {
    logErr("floor is null in baseSceneConstructor", sceneName);
    return;
  }
  listenRemovePlayerOnPlayer(
    selfScene,
    selfScene.socket,
    floor,
    () => protocol.getPlayerId(),
    () => {
      selfScene.player = null;
    }
  );
  playersContainerListenPlayerList({
    scene: selfScene,
    socket: selfScene.socket,
    floor,
    phaserScene: selfScene,
    container: selfScene,
  });
  playersContainerListenAddChat(
    selfScene,
    selfScene,
    selfScene.socket,
    floor,
  );
  playersContainerListenRemoveChat(
    selfScene,
    selfScene,
    selfScene.socket,
    floor,
  );
  window.scenes[sceneName] = selfScene;
}

// data는 씬 전환하는 함수에서 주입해줌
export function baseSceneInit(selfScene, data) {
  log(selfScene.sceneName, "init");

  const isFirstLoadedScene = isFirstScene();
  const sceneFloor = FLOOR_NAMES[selfScene.sceneName];
  if (sceneFloor == null) {
    logErr("floor is null in baseSceneInit", selfScene.sceneName);
    return;
  }

  saveSceneToHistory(sceneFloor);

  let debugPosUsed = false;
  if (isFirstLoadedScene) {
    const { floor, x, y } = loadFloorAndMovement();
    if (floor !== sceneFloor) {
      log("floor != scenename", floor, selfScene.sceneName);
      return;
    }

    log("use prev pos for debug", {
      x,
      y,
      floor,
    });
    debugPosUsed = true;
    selfScene.x = Number(x);
    selfScene.destinationX = Number(x);
    selfScene.y = Number(y);
    selfScene.destinationY = Number(y);
  };

  if (debugPosUsed) {
    return;
  }

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

  const { playerImgUrl } = loadPlayerNameAndImgUrl();
  // FIXME: move this to player code
  for (const [key, file] of allCharacterImageNames(
    protocol.getPlayerId(),
    playerImgUrl
  )) {
    selfScene.load.image(key, file);
  }

  loadChatBackgroundImage(selfScene);
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
  onMapCreated,
}) {
  window.scene = selfScene;
  selfScene.stop = false;
  const floor = FLOOR_NAMES[selfScene.sceneName];
  if (floor == null) {
    logErr("floor is null in baseSceneCreate", selfScene.sceneName);
    return;
  }
  log(selfScene.sceneName, "create");
  playerCreateAnimations(protocol.getPlayerId(), selfScene);

  selfScene.map = mapCreate(selfScene, mapName);
  if (onMapCreated) {
    onMapCreated();
  }
  const { playerName, playerImgUrl } = loadPlayerNameAndImgUrl();
  selfScene.player = playerCreate(
    selfScene,
    selfScene.x,
    selfScene.y,
    playerName,
    "",
    protocol.getPlayerId(),
    playerImgUrl
  ); // 소켓 연결 되면 이 부분을 지워야 함
  selfScene.player = playerAddKey(selfScene.player, selfScene);

  selfScene.players = playersAddPlayer(
    selfScene.players,
    protocol.getPlayerId(),
    selfScene.player
  );

  protocol.addPlayer(selfScene.socket, {
    name: playerName,
    imgUrl: playerImgUrl,
    floor,
    x: selfScene.x,
    y: selfScene.y,
  });
  selfScene.login = () => {
    if (selfScene.player == null) {
      selfScene.player = playerCreate(
        selfScene,
        selfScene.x,
        selfScene.y,
        playerName,
        "",
        protocol.getPlayerId(),
        playerImgUrl
      ); // 소켓 연결 되면 이 부분을 지워야 함
      selfScene.player = playerAddKey(selfScene.player, selfScene);

      selfScene.players = playersAddPlayer(
        selfScene.players,
        protocol.getPlayerId(),
        selfScene.player
      );
    }
    protocol.addPlayer(selfScene.socket, {
      name: playerName,
      imgUrl: playerImgUrl,
      floor,
      x: selfScene.x,
      y: selfScene.y,
    });
  };

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
  selfScene.input.on("pointerdown", () => {
    // console.log("pointerdown event", selfScene.input.activePointer.worldX, selfScene.input.activePointer.worldY,
    // selfScene.input.activePointer.x, selfScene.input.activePointer.y
    // );
    mouseInputUpdateEvent(
      selfScene.player,
      selfScene.input.activePointer.worldX,
      selfScene.input.activePointer.worldY,
    );
  });

  console.log("send getPlayers")
  // 씬이 로딩 끝난 뒤 호출
  setTimeout(() => {
    if (window.scene !== selfScene) {
      console.log("scene changed between 3 seconds")
      return;
    }
    if (selfScene.player == null) {
      console.log("player is null")
      return;
    }
    protocol.getPlayers(selfScene.socket);

    console.log("send move player", {
      floor,
      direction: selfScene.player.prevMove,
      x: selfScene.player.phaser.x,
      y: selfScene.player.phaser.y,
    })
    // 한 번이라도 move player를 호출해야 남에게 보임
    protocol.movePlayer(selfScene.socket, {
      floor,
      direction: selfScene.player.prevMove,
      x: selfScene.player.phaser.x,
      y: selfScene.player.phaser.y,
    });
  }, 1000);
}

export function baseSceneUpdate(selfScene, dtMillis) {
  // player can be removed since removePlayer is called
  if (selfScene.player == null) {
    return;
  }

  selfScene.player = playerMove(
    selfScene.player,
    selfScene.destinationX,
    selfScene.destinationY,
    selfScene,
    dtMillis
  );
  for (const [id, otherPlayer] of playersEntries(selfScene.players)) {
    if (id !== selfScene.player.id) {
      try {
        selfScene.players.entries[id] = playerFollowNetworkPos(
          otherPlayer,
          dtMillis
        );
      } catch (err) {
        logErr("failed to update network pos", id);
        logErr(err);
      }
    }
  }
  selfScene.playerOnMap = playerOnMapUpdate(
    selfScene.playerOnMap,
    selfScene.player,
    selfScene.map
  );
  if (selfScene.player == null) {
    return;
  }

  selfScene.player = playerMoveNameLabelAndChat(selfScene.player);

  // TODO: stop이더라도 실제 이동하는 위치는 없을 수 있다.
  if (selfScene.player.prevMove !== "stop") {
    rateLimiterTrigger(selfScene.rateLimiter, () => {
      // 씬을 이동할 경우 씬이 끝난 뒤에 이 코드가 호출될 수 있음.
      // rateLimiter의 경우 마지막 요청이 timeout 뒤에 호출함.
      // rateLimiter가 호출할 때 callback을 부를 수 없는 경우를 처리함.
      // 이보다 잘 처리할 방법이 필요.
      if (selfScene.player == null) {
        return;
      }

      const sceneName = selfScene.sceneName;
      const floor = FLOOR_NAMES[sceneName];
      if (floor == null) {
        logErr("floor is null in baseSceneUpdate", sceneName);
        return;
      }

      saveMovement(
        floor,
        selfScene.player.phaser.x,
        selfScene.player.phaser.y
      );

      protocol.movePlayer(selfScene.socket, {
        floor,
        direction: selfScene.player.prevMove,
        x: selfScene.player.phaser.x,
        y: selfScene.player.phaser.y,
      });
    });
  }
}
