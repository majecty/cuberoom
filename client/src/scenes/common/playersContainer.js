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

  phaserScene.load.start();
}

export function playersContainerListenPlayerList({
  scene,
  socket,
  floor,
  phaserScene,
  container,
}) {
  function listener(data, debug) {
    if (scene.stop) {
      return;
    }
    if (debug) {
      // log("listenPlayerList", data, sceneName);
      // log("listenPlayerList", sceneName);
    }
    for (const playerFromServer of data) {
      const id = playerFromServer.id;
      if (playerFromServer.floor !== floor) {
        // do nothing
        // if (debug) {
        //   log(
        //     "listenPlayerList skip",
        //     id.substring(0, 5),
        //     playerFromServer.floor,
        //     sceneName
        //   );
        // }
      } else if (id === loadIdAndPassword().id) {
        // log("itsme")
      } else if (container.players.entries[id] == null) {
        if (debug) {
          log("listenPlayerList create", id.substring(0, 5), playerFromServer.name, id);
        }
        createOtherPlayer(container, phaserScene, playerFromServer, id, debug);
      } else {
        if (debug) {
          log("listenPlayerList update", id.substring(0, 5), id);
        }
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
  floor
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
      dataFromServer.floor === floor &&
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
  floor
) {
  protocol.onRemoveChat(socket, (data) => {
    if (scene.stop) {
      return;
    }
    const { players } = container;
    if (data.floor === floor && players.entries[data.id]) {
      const player = players.entries[data.id];
      player.chat = chatUpdateText(scene, player.chat, "");
    }
  });
}
