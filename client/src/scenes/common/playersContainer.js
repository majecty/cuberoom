import { playersOnRemovePlayer } from "./players";
import {
  playerCreate,
  playerAddChat,
  playerRemoveChat,
  playerUpdateFromServer,
  loadPlayerImages,
} from "../../entity/player";
import { log } from "../../log";

/* eslint no-param-reassign: ["error", { "props": false }] */
export function playersContainerListenRemovePlayer(container, socket) {
  socket.on("removePlayer", (dataFromServer) => {
    container.players = playersOnRemovePlayer(
      container.players,
      dataFromServer
    );
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
    for (const [id, player] of Object.entries(data)) {
      if (player.floor !== sceneName) {
        if (debug) {
          log(
            "listenPlayerList skip",
            id.substring(0, 5),
            player.floor,
            sceneName
          );
        }
        continue;
      }

      loadPlayerImages(phaserScene, player, id, debug);

      // FIXME: complete event가 load랑 atomic하게 어울리는지 불안함.
      // load가 로딩 시작한 이미지를 return하고 해당 이미지들이 전부 load되었을 때 호출하자.
      phaserScene.load.once("complete", () => {
        const { players } = container;
        if (debug) {
          log("listenPlayerList complete", id.substring(0, 5));
        }
        // FIXME: players[id].phaser.scene == null인 경우를 여기서 체크하는 게 이상함
        if (
          players.entries[id] == null ||
          players.entries[id].phaser.scene == null
        ) {
          if (debug) {
            log("listenPlayerList playerCreate", id.substring(0, 5));
          }
          players.entries[id] = playerCreate(
            phaserScene,
            player.x,
            player.y,
            player.name,
            player.chat,
            player.id
          );
        } else if (socket.id !== id) {
          if (debug) {
            log("listenPlayerList socket.id!==id", id.substring(0, 5));
          }

          players.entries[id] = playerUpdateFromServer(
            players.entries[id],
            player
          );
        } else if (debug) {
          log("listenPlayerList socket.id===id", id.substring(0, 5));
        }
      });
      phaserScene.load.start();
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
