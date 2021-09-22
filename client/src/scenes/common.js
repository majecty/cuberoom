import ENV from "../../ENV";
import { playerCreate } from "../entity/player";

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

export function listenRemovePlayerOnPlayers(socket, sceneName, players) {
  socket.on("removePlayer", (data) => {
    console.log("removePlayer", sceneName, data);
    if (players[data.id]) {
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
      console.log("removePlayer", sceneName, data.id, data);
      removePlayer();
    }
  });
}

// FIXME: too many arguments.
export function listenPlayerList({ socket, sceneName, phaserScene, players }) {
  socket.on("playerList", (data) => {
    for (const [id, player] of Object.entries(data)) {
      if (player.floor !== sceneName) return;

      const directions = ["left", "right", "up", "down"];
      for (const direction of directions) {
        for (let i = 1; i < 5; i += 1) {
          if (!phaserScene.textures.exists(`${player.id}-${direction}-${i}`)) {
            phaserScene.load.image(
              `${player.id}-${direction}-${i}`,
              `${ENV.URL_STATIC}${player.imgUrl}${direction}-${i}.png`
            );
          }
        }
      }
      phaserScene.load.once("complete", () => {
        // fixme do not use implicit boolean casting
        if (!players[id] || !players[id].phaser.scene) {
          players[id] = playerCreate(
            phaserScene,
            player.x,
            player.y,
            player.name,
            player.chat,
            player.id
          );
        } else {
          if (socket.id !== id) {
            if (players[id].phaser.depth === 0) {
              players[id].phaser.setDepth(1);
              players[id].nameLabel.setDepth(1);
              players[id].chatBubble.setDepth(1);
            }
            players[id].phaser.x = player.x;
            players[id].phaser.y = player.y;
            players[id].nameLabel.x = player.x;
            players[id].nameLabel.y = player.y - 30;
            players[id].chatBubble.x = player.x;
            players[id].chatBubble.y = player.y - 50;
            players[id].phaser.setTexture(
              `${player.id}-${player.direction}-${2}`
            );
          }
        }
      });
      phaserScene.load.start();
    }
  });
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
