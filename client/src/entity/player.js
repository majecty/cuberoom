/* eslint no-param-reassign: ["error", { "props": false }] */
import {
  updateFollowClickAnimation,
  updateInitAnimation,
} from "./player/animation";
import { log } from "../log";
import ENV from "../../ENV";
import { playerSpeed } from "../constant";
import {
  playerNetworkCreate,
  playerNetworkGetThisFramePosition,
  playerNetworkUpdate,
} from "./player/network";

export function playerCreate(scene, x, y, name, chat, id) {
  let idStr = "";
  if (id == null) {
    idStr = "isnull";
  } else {
    idStr = id;
  }
  log("playerCreate", scene.sceneName, name, idStr.substring(0, 5));
  const phaser = scene.physics.add.sprite(x, y, `${id}-down-2`, 1);
  phaser.setSize(20, 20, false).setOffset(0, 20);

  const nameLabel = scene.add.text(x, y - 30, name || "이름없음", {
    fontFamily: "28px NeoDunggeunmo",
    fill: "#ffffff",
    stroke: "#000000",
    strokeThickness: 2,
    align: "center",
  });

  const chatBubble = scene.add.text(x, y - 50, chat, {
    fontFamily: "28px NeoDunggeunmo",
    fill: "#ffffff",
    align: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  });

  nameLabel.setOrigin(0.5, 0.5);
  chatBubble.setOrigin(0.5, 0.5);

  scene.physics.world.enable([nameLabel, chatBubble]);

  return {
    phaser,
    target: {
      x: null,
      y: null,
    },
    network: playerNetworkCreate(),
    prevAnim: null,
    prevMove: null,
    nameLabel,
    chatBubble,
    id,
  };
}

function initmove(player) {
  const velocity = 1;
  let newPrevMove = player.prevMove;

  player.phaser.body.setVelocityX(velocity);
  newPrevMove = "right";

  return {
    ...player,
    prevMove: newPrevMove,
  };
}

function followClick(player, destinationX, destinationY) {
  const tempX = player.phaser.x;
  const tempY = player.phaser.y;

  const velocity = playerSpeed;

  let newPrevMove = player.prevMove;

  if (destinationX + 5 < player.phaser.x) {
    if (player.prevMove !== "left") {
      player.phaser.body.setVelocityX(-velocity);
      newPrevMove = "left";
    }
  } else if (destinationX > 5 + player.phaser.x) {
    if (player.prevMove !== "right") {
      player.phaser.body.setVelocityX(velocity);
      newPrevMove = "right";
    }
  } else {
    player.phaser.body.setVelocityX(0);
  }

  if (destinationY + 5 < player.phaser.y) {
    if (player.prevMove !== "up") {
      player.phaser.body.setVelocityY(-velocity);
      newPrevMove = "up";
    }
  } else if (player.phaser.y + 5 < destinationY) {
    if (player.prevMove !== "down") {
      player.phaser.body.setVelocityY(velocity);
      newPrevMove = "down";
    }
  } else {
    player.phaser.body.setVelocityY(0);
  }

  if (
    Math.abs(tempX - destinationX) < 11 &&
    Math.abs(tempY - destinationY) < 11
  ) {
    player.phaser.body.setVelocityY(0);
  }

  return {
    ...player,
    prevMove: newPrevMove,
  };
}

export function playerFollowClickUpdate(
  player,
  destinationX,
  destinationY,
  scene
) {
  let newPlayer = updateFollowClickAnimation(
    scene,
    player,
    destinationX,
    destinationY
  );
  newPlayer = followClick(newPlayer, destinationX, destinationY, scene);
  return newPlayer;
}

export function playerinitmove(player) {
  let newPlayer = updateInitAnimation(player);
  newPlayer = initmove(newPlayer);
  return newPlayer;
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

  player.phaser.setTexture(
    `${playerFromServer.id}-${playerFromServer.direction}-${2}`
  );
  return {
    ...player,
  };
}

export function playerFollowNetworkPos(player, dtMillis) {
  if (player.phaser == null) {
    log("player.phaser == null", player);
  }
  const { newX, newY } = playerNetworkGetThisFramePosition({
    playerNetwork: player.network,
    currentPosition: {
      x: player.phaser.x,
      y: player.phaser.y,
    },
    dtMillis,
  });
  player.phaser.x = newX;
  player.phaser.y = newY;

  // FIXME: do not update nameLabel, chatBubble this way
  player.nameLabel.x = newX;
  player.nameLabel.y = newY - 30;
  player.chatBubble.x = newX;
  player.chatBubble.y = newY - 50;

  // TODO: update direction
  // player.phaser.setTexture(
  //   `${playerFromServer.id}-${playerFromServer.direction}-${2}`
  // );

  return {
    ...player,
  };
}

export function playerAddChat(player, chat) {
  const formattedChat = chat.match(/.{1,12}/g).join("\n");
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
 */
export function loadPlayerImages(phaserScene, playerFromServer, id, debug) {
  const directions = ["left", "right", "up", "down"];
  for (const direction of directions) {
    for (let i = 1; i < 5; i += 1) {
      if (
        !phaserScene.textures.exists(`${playerFromServer.id}-${direction}-${i}`)
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

export function playerMoveNameLabelAndChatBubble(player) {
  player.nameLabel.x = player.phaser.x;
  player.chatBubble.x = player.phaser.x;
  player.nameLabel.y = player.phaser.y - 30;
  player.chatBubble.y = player.phaser.y - 50;
  return player;
}
