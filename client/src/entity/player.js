import {
  updateAnimation,
  updateFollowClickAnimation,
  updateInitAnimation,
} from "./player/animation";
import { log } from "../log";
import ENV from "../../ENV";

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
  // nameLabel.setResolution(window.devicePixelRatio / 2)
  // chatBubble.setResolution(window.devicePixelRatio / 2)
  // nameLabel.setSize(20 + nameLabel.width, 40 + nameLabel.height)

  scene.physics.world.enable([nameLabel, chatBubble]);
  // scene.physics.world.collide([nameLabel, chatBubble]);

  // const group = scene.physics.add.group({ collideWorldBounds: true, setXY: { x, y }});
  // group.add(phaser);
  // group.add(nameLabel);
  // group.add(chatBubble);

  // phaser.body.setOnCollide(() => {
  //   nameLabel.body.setVelocityY(0);
  //   chatBubble.body.setVelocityY(0);
  // })

  // scene.physics.collide(phaser, undefined, () => {
  //   nameLabel.body.setVelocityY(0);
  //   chatBubble.body.setVelocityY(0);
  // })

  return {
    phaser,
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

  let velocity = 50;

  let newPrevMove = player.prevMove;

  // if (scene.cheat) {
  //   velocity *= 10;
  // }
  if (destinationX + 5 < player.phaser.x) {
    // velocity *= parseInt(player.phaser.x - destinationX) * 0.007;
    if (velocity < 100) {
      velocity = 100;
    }
    if (player.prevMove !== "left") {
      player.phaser.body.setVelocityX(-velocity);
      newPrevMove = "left";
    }
  } else if (destinationX > 5 + player.phaser.x) {
    // velocity *= parseInt( destinationX - player.phaser.x) * 0.007;
    if (velocity < 100) {
      velocity = 100;
    }
    if (player.prevMove !== "right") {
      player.phaser.body.setVelocityX(velocity);
      newPrevMove = "right";
    }
  } else {
    player.phaser.body.setVelocityX(0);
  }

  if (destinationY + 5 < player.phaser.y) {
    // velocity *= parseInt( player.phaser.y - destinationY) * 0.015;
    if (velocity < 100) {
      velocity = 100;
    }
    if (player.prevMove !== "up") {
      player.phaser.body.setVelocityY(-velocity);
      newPrevMove = "up";
    }
  } else if (player.phaser.y + 5 < destinationY) {
    // velocity *= parseInt(  destinationY - player.phaser.y) * 0.015;
    if (velocity < 100) {
      velocity = 100;
    }
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

function move(player, cursors, scene) {
  let moved = false;
  let velocity = 100;

  if (scene.cheat) {
    velocity *= 10;
  }

  let newPrevMove = player.prevMove;

  if (typeof cursors === "string" || typeof cursors === "undefined") {
    if (cursors === "left") {
      if (player.prevMove !== "left") {
        player.phaser.body.setVelocityX(-velocity);
        player.nameLabel.body.setVelocityX(-velocity);
        player.chatBubble.body.setVelocityX(-velocity);
        // player.nameLabel.x = player.phaser.x;
        // player.chatBubble.x = player.phaser.x;
        newPrevMove = "left";
      }
      moved = true;
    } else if (cursors === "right") {
      if (player.prevMove !== "right") {
        player.phaser.body.setVelocityX(velocity);
        player.nameLabel.body.setVelocityX(velocity);
        player.chatBubble.body.setVelocityX(velocity);
        // player.nameLabel.x = player.phaser.x;
        // player.chatBubble.x = player.phaser.x;
        newPrevMove = "right";
      }
      moved = true;
    } else {
      player.phaser.body.setVelocityX(0);
      player.nameLabel.body.setVelocityX(0);
      player.chatBubble.body.setVelocityX(0);
    }

    if (cursors === "up") {
      if (player.prevMove !== "up") {
        player.phaser.body.setVelocityY(-velocity);
        player.nameLabel.body.setVelocityY(-velocity);
        player.chatBubble.body.setVelocityY(-velocity);
        // player.nameLabel.y = player.phaser.y - 30;
        // player.chatBubble.y = player.phaser.y - 45;
        newPrevMove = "up";
      }
      moved = true;
    } else if (cursors === "down") {
      if (player.prevMove !== "down") {
        player.phaser.body.setVelocityY(velocity);
        player.nameLabel.body.setVelocityY(velocity);
        player.chatBubble.body.setVelocityY(velocity);
        // player.nameLabel.y = player.phaser.y - 30;
        // player.chatBubble.y = player.phaser.y - 45;
        newPrevMove = "down";
      }
      moved = true;
    } else {
      player.phaser.body.setVelocityY(0);
      player.nameLabel.body.setVelocityY(0);
      player.chatBubble.body.setVelocityY(0);
    }

    if (moved === false) {
      player.phaser.body.setVelocity(0);
      player.nameLabel.body.setVelocityY(0);
      player.chatBubble.body.setVelocityY(0);
    }

    return {
      ...player,
      prevMove: newPrevMove,
    };
  }

  if (cursors.left.isDown) {
    if (player.prevMove !== "left") {
      player.phaser.body.setVelocityX(-velocity);
      player.nameLabel.body.setVelocityX(-velocity);
      player.chatBubble.body.setVelocityX(-velocity);
      // player.nameLabel.x = player.phaser.x;
      // player.chatBubble.x = player.phaser.x;
      newPrevMove = "left";
    }
    moved = true;
  } else if (cursors.right.isDown) {
    if (player.prevMove !== "right") {
      player.phaser.body.setVelocityX(velocity);
      player.nameLabel.body.setVelocityX(velocity);
      player.chatBubble.body.setVelocityX(velocity);
      // player.nameLabel.x = player.phaser.x;
      // player.chatBubble.x = player.phaser.x;
      newPrevMove = "right";
    }
    moved = true;
  } else {
    player.phaser.body.setVelocityX(0);
    player.nameLabel.body.setVelocityX(0);
    player.chatBubble.body.setVelocityX(0);
  }

  if (cursors.up.isDown) {
    if (player.prevMove !== "up") {
      player.phaser.body.setVelocityY(-velocity);
      player.nameLabel.body.setVelocityY(-velocity);
      player.chatBubble.body.setVelocityY(-velocity);
      // player.nameLabel.y = player.phaser.y - 30;
      // player.chatBubble.y = player.phaser.y - 45;
      newPrevMove = "up";
    }
    moved = true;
  } else if (cursors.down.isDown) {
    if (player.prevMove !== "down") {
      player.phaser.body.setVelocityY(velocity);
      player.nameLabel.body.setVelocityY(velocity);
      player.chatBubble.body.setVelocityY(velocity);
      // player.nameLabel.y = player.phaser.y - 30;
      // player.chatBubble.y = player.phaser.y - 45;
      newPrevMove = "down";
    }
    moved = true;
  } else {
    player.phaser.body.setVelocityY(0);
    player.nameLabel.body.setVelocityY(0);
    player.chatBubble.body.setVelocityY(0);
  }

  if (moved === false) {
    player.phaser.body.setVelocity(0);
    player.nameLabel.body.setVelocityY(0);
    player.chatBubble.body.setVelocityY(0);
  }

  return {
    ...player,
    prevMove: newPrevMove,
  };
}

export function playerUpdate(player, cursors, scene) {
  let newPlayer = updateAnimation(player, cursors);
  newPlayer = move(newPlayer, cursors, scene);
  return newPlayer;
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
  player.phaser.x = playerFromServer.x;
  player.phaser.y = playerFromServer.y;
  player.nameLabel.x = playerFromServer.x;
  player.nameLabel.y = playerFromServer.y - 30;
  player.chatBubble.x = playerFromServer.x;
  player.chatBubble.y = playerFromServer.y - 50;
  player.phaser.setTexture(
    `${playerFromServer.id}-${playerFromServer.direction}-${2}`
  );
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
export function loadPlayerImages(phaserScene, playerFromServer, debug) {
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
