import ENV from "../../ENV";
import { playerCreate } from "../entity/player";
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

/* eslint no-param-reassign: ["error", { "props": false }] */
export function listenRemovePlayerOnPlayers(socket, sceneName, players) {
  socket.on("removePlayer", (data) => {
    if (players[data.id]) {
      log("removePlayers", sceneName, data.id, data);
      // this makes a problem
      // scene.player will have an invalid player field.
      players[data.id].phaser.destroy(true);
      players[data.id].nameLabel.destroy(true);
      players[data.id].chatBubble.destroy(true);
      delete players[data.id];
    }
  });
}

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

// FIXME: too many arguments.
export function listenPlayerList({ socket, sceneName, phaserScene, players }) {
  function loadPlayerImages(playerFromServer, debug) {
    const directions = ["left", "right", "up", "down"];
    for (const direction of directions) {
      for (let i = 1; i < 5; i += 1) {
        if (
          !phaserScene.textures.exists(
            `${playerFromServer.id}-${direction}-${i}`
          )
        ) {
          if (debug) {
            log(
              "listenPlayerList load",
              id.substring(0, 5),
              `${playerFromServer.id}-${direction}-${i}`,
              `${ENV.URL_STATIC}${playerFromServer.imgUrl}${direction}-${i}.png`
            );
          }
          phaserScene.load.image(
            `${playerFromServer.id}-${direction}-${i}`,
            `${ENV.URL_STATIC}${playerFromServer.imgUrl}${direction}-${i}.png`
          );
        }
      }
    }
  }

  function updatePlayerFromServer(playerFromServer, player) {
    if (player.phaser.depth === 0) {
      player.phaser.setDepth(1);
      player.nameLabel.setDepth(1);
      player.chatBubble.setDepth(1);
    }
    player.phaser.x = playerFromServer.x;
    player.phaser.y = playerFromServer.y;
    player.nameLabel.x = playerFromServer.x;
    player.nameLabel.y = playerFromServer.y - 30;
    player.chatBubble.x = playerFromServer.x;
    player.chatBubble.y = playerFromServer.y - 50;
    player.phaser.setTexture(
      `${playerFromServer.id}-${playerFromServer.direction}-${2}`
    );
  }

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

      loadPlayerImages(player, debug);

      phaserScene.load.once("complete", () => {
        if (debug) {
          log("listenPlayerList complete", id.substring(0, 5));
        }
        if (players[id] == null || players[id].phaser.scene == null) {
          if (debug) {
            log("listenPlayerList playerCreate", id.substring(0, 5));
          }
          players[id] = playerCreate(
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
          updatePlayerFromServer(players[id], player);
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

export function listenAddChat(socket, sceneName, players) {
  socket.on("addChat", (data) => {
    if (data.floor === sceneName && players[data.id]) {
      const formattedChat = data.chat.match(/.{1,12}/g).join("\n");
      players[data.id].chatBubble.setText(formattedChat);
      players[data.id].chatBubble.setPadding(4);
    }
  });
}

export function listenRemoveChat(socket, sceneName, players) {
  socket.on("removeChat", (data) => {
    if (data.floor === sceneName && players[data.id]) {
      players[data.id].chatBubble.setText("");
      players[data.id].chatBubble.setPadding(0);
    }
  });
}
