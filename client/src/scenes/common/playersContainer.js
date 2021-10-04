import { playersOnRemovePlayer } from "./players";
import {
  playerCreate,
  playerAddChat,
  playerRemoveChat,
  playerUpdateFromServer,
  loadPlayerImages,
} from "../../entity/player";
import { playerCreateAnimations } from "../../entity/player/animation";
import { log } from "../../log";
import { loadIdAndPassword } from "../../pages/storage";

/* eslint no-param-reassign: ["error", { "props": false }] */
export function playersContainerListenRemovePlayer(container, socket) {
  socket.on("removePlayer", (dataFromServer) => {
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
  socket,
  sceneName,
  phaserScene,
  container,
}) {
  function listener(data, debug) {
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

  socket.on("playerList", (data) => listener(data));
  socket.on("debugPlayerList", (data) => listener(data, true));
}

export function playersContainerListenAddChat(container, socket, sceneName) {
  /**
   * @param dataFromServer field id, chat, floor
   */
  socket.on("addChat", (dataFromServer) => {
    const { players } = container;
    if (
      dataFromServer.floor === sceneName &&
      players.entries[dataFromServer.id]
    ) {
      players.entries[dataFromServer.id] = playerAddChat(
        players.entries[dataFromServer.id],
        dataFromServer.chat
      );
    }
  });
}

export function playersContainerListenRemoveChat(container, socket, sceneName) {
  socket.on("removeChat", (data) => {
    const { players } = container;
    if (data.floor === sceneName && players.entries[data.id]) {
      players.entries[data.id] = playerRemoveChat(players.entries[data.id]);
    }
  });
}
