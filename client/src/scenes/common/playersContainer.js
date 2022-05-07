import { playersOnRemovePlayer } from "./players";
import {
  playerCreate,
  playerUpdateFromServer,
  loadPlayerImages,
} from "../../entity/player";
import { chatUpdateText } from "../../entity/player/chat";
import { playerCreateAnimations } from "../../entity/player/animation";
import { log } from "../../log";
import { loadIdAndPassword } from "../../pages/storage";
import { protocol } from "../../network/protocol";

/* eslint no-param-reassign: ["error", { "props": false }] */
export function playersContainerListenRemovePlayer(scene, container, socket) {
  protocol.onRemovePlayer(socket, (dataFromServer) => {
    if (scene.stop) {
      return;
    }
    container.players = playersOnRemovePlayer(
      container.players,
      dataFromServer
    );
  });
}

function createOtherPlayer(
  container,
  phaserScene,
  playerFromServer,
  id,
  debug
) {
  loadPlayerImages(phaserScene, playerFromServer, id, debug);
  phaserScene.load.start();
  phaserScene.load.once("complete", () => {
    const { players } = container;
    if (debug) {
      log("listenPlayerList complete", id.substring(0, 5));
    }
    if (players.entries[id] == null) {
      if (debug) {
        log("listenPlayerList playerCreate", id.substring(0, 5));
      }
      playerCreateAnimations(id, phaserScene);
      players.entries[id] = playerCreate(
        phaserScene,
        playerFromServer.x,
        playerFromServer.y,
        playerFromServer.name,
        playerFromServer.chat,
        playerFromServer.id
      );
    }
  });
}

export function playersContainerListenPlayerList({
  scene,
  socket,
  sceneName,
  phaserScene,
  container,
}) {
  function listener(data, debug) {
    if (scene.stop) {
      return;
    }
    if (debug) {
      log("listenPlayerList", sceneName);
    }
    for (const [id, playerFromServer] of Object.entries(data)) {
      if (id === loadIdAndPassword().id) {
        // do nothing
      } else if (playerFromServer.floor !== sceneName) {
        if (debug) {
          log(
            "listenPlayerList skip",
            id.substring(0, 5),
            playerFromServer.floor,
            sceneName
          );
        }
      } else if (container.players.entries[id] == null) {
        createOtherPlayer(container, phaserScene, playerFromServer, id, debug);
      } else {
        container.players.entries[id] = playerUpdateFromServer(
          container.players.entries[id],
          playerFromServer
        );
      }
    }
  }

  protocol.onPlayerList(socket, listener);
  protocol.onDebugPlayerList(socket, (data) => {
    listener(data, true);
  });
}

/**
 * @param {Scene} scene is a phaser scene
 * @param {{ players: Object }} container is an object that contains players
 */
export function playersContainerListenAddChat(
  scene,
  container,
  socket,
  sceneName
) {
  /**
   * @param dataFromServer field id, chat, floor
   */
  protocol.onAddChat(socket, (dataFromServer) => {
    if (scene.stop) {
      return;
    }
    const { players } = container;
    if (
      dataFromServer.floor === sceneName &&
      players.entries[dataFromServer.id]
    ) {
      const player = players.entries[dataFromServer.id];
      player.chat = chatUpdateText(scene, player.chat, dataFromServer.chat);
    }
  });
}

/**
 * @param {Scene} scene is a phaser scene
 * @param {{ players: Object }} container is an object that contains players
 */
export function playersContainerListenRemoveChat(
  scene,
  container,
  socket,
  sceneName
) {
  protocol.onRemoveChat(socket, (data) => {
    if (scene.stop) {
      return;
    }
    const { players } = container;
    if (data.floor === sceneName && players.entries[data.id]) {
      const player = players.entries[data.id];
      player.chat = chatUpdateText(scene, player.chat, "");
    }
  });
}
