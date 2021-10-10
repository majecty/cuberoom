/* eslint no-param-reassign: ["error", { "props": false }] */
import { updatePeerPlayerAnimation } from "./player/animation";
import { log } from "../log";
import { depth, zoom } from "../constant";
import {
  playerNetworkCreate,
  playerNetworkGetThisFramePosition,
  playerNetworkUpdate,
} from "./player/network";
import { getPlayerDepth } from "./player/common";

export function playerCreate(scene, x, y, name, chat, id) {
  let idStr = "";
  if (id == null) {
    idStr = "isnull";
  } else {
    idStr = id;
  }
  log("playerCreate", scene.sceneName, name, idStr.substring(0, 5));
  let frameName = "";
  if (scene.textures.exists(`player-${id}-down-2`)) {
    frameName = `player-${id}-down-2`;
  } else {
    frameName = `player-fallback-down-2`;
  }
  const phaser = scene.physics.add.sprite(x, y, frameName, 1);
  phaser.setSize(20, 20, false).setOffset(0, 20);
  phaser.depth = depth.player;
  phaser.scale = 2 / zoom;

  const nameLabel = scene.add.text(x, y - 45, name || "이름없음", {
    fontFamily: "NeoDunggeunmo",
    fontSize: "16px",
    fill: "#ffffff",
    stroke: "#000000",
    strokeThickness: 2,
    align: "center",
  });

  const chatBubble = scene.add.text(x, y - 70, chat, {
    fontFamily: "NeoDunggeunmo",
    fontSize: "16px",
    fill: "#ffffff",
    align: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  });

  nameLabel.setOrigin(0.5, 0.5);
  chatBubble.setOrigin(0.5, 0.5);
  nameLabel.depth = depth.nameLabel;
  chatBubble.depth = depth.nameLabel;

  scene.physics.world.enable([nameLabel, chatBubble]);

  return {
    phaser,
    // we will use target to share the current goal of peer.
    // It will help estimate peer's next movement
    target: {
      x: null,
      y: null,
    },
    network: playerNetworkCreate(),
    prevAnim: "player-idle",
    prevMove: "stop",
    nameLabel,
    chatBubble,
    id,
  };
}

/**
 * @param playerFromServer x, y, id, direction
 */
export function playerUpdateFromServer(player, playerFromServer) {
  if (player.phaser.depth === 0) {
    // FIXME
    // 언제 depth가 0이 되는 거지
    // 이 위치에서 depth를 수정하는 건 이상함.
    log("playerUpdateFromServer depth 0");
    player.phaser.setDepth(1);
    player.nameLabel.setDepth(1);
    player.chatBubble.setDepth(1);
  }
  player.network = playerNetworkUpdate(
    player.network,
    {
      x: playerFromServer.x,
      y: playerFromServer.y,
    },
    playerFromServer.target
  );
  return {
    ...player,
  };
}

export function playerFollowNetworkPos(player, dtMillis) {
  if (player.phaser == null) {
    log("player.phaser == null", player);
  }
  const { newX, newY, stop } = playerNetworkGetThisFramePosition({
    playerNetwork: player.network,
    currentPosition: {
      x: player.phaser.x,
      y: player.phaser.y,
    },
    dtMillis,
  });

  const prevX = player.phaser.x;
  const prevY = player.phaser.y;

  player.phaser.x = newX;
  player.phaser.y = newY;

  // FIXME: do not update nameLabel, chatBubble this way
  player.nameLabel.x = newX;
  player.nameLabel.y = newY - 45;
  player.chatBubble.x = newX;
  player.chatBubble.y = newY - 70;
  player.phaser.depth = getPlayerDepth(player);
  player.chatBubble.depth = depth.nameLabel;
  player.nameLabel.depth = depth.nameLabel;

  // TODO: update direction
  // player.phaser.setTexture(
  //   `${playerFromServer.id}-${playerFromServer.direction}-${2}`
  // );

  return updatePeerPlayerAnimation(player, newX - prevX, newY - prevY, stop);
}

export function playerAddChat(player, chat) {
  let lines = chat.match(/.{1,12}/g);
  if (lines == null) {
    lines = [];
  }
  const formattedChat = lines.join("\n");
  player.chatBubble.setText(formattedChat);
  player.chatBubble.setPadding(4);
  return player;
}

export function playerRemoveChat(player) {
  player.chatBubble.setText("");
  player.chatBubble.setPadding(0);
  return player;
}

/**
 * @param playerFromServer field id, imgUrl
 * @returns {string[]} loaded image keys
 */
export function loadPlayerImages(phaserScene, playerFromServer, id) {
  const directions = ["left", "right", "up", "down"];
  const loadKeys = [];
  for (const direction of directions) {
    for (let i = 1; i < 5; i += 1) {
      if (!phaserScene.textures.exists(`player-${id}-${direction}-${i}`)) {
        // log(
        //   "listenPlayerList load",
        //   id.substring(0, 5),
        //   `player-${id}-${direction}-${i}`,
        //   `${ENV.URL_STATIC}${playerFromServer.imgUrl}${direction}-${i}.png`
        // );
        const key = `player-${id}-${direction}-${i}`;
        loadKeys.push(key);
        phaserScene.load.image(
          key,
          `${playerFromServer.imgUrl}${direction}-${i}.png`
        );
      }
    }
  }
  return loadKeys;
}

export function playerMoveNameLabelAndChatBubble(player) {
  player.nameLabel.x = player.phaser.x;
  player.chatBubble.x = player.phaser.x;
  player.nameLabel.y = player.phaser.y - 45;
  player.chatBubble.y = player.phaser.y - 70;
  return player;
}
