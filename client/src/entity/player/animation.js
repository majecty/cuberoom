/* eslint-disable import/prefer-default-export */

import { animationFrames } from "./image";
import { logErr } from "../../log";

const directions = ["down", "up", "left", "right"];

export function playerCreateAnimations(id, scene) {
  for (const direction of directions) {
    const animConfig = {
      key: `player-${id}-${direction}`,
      frames: [...animationFrames(scene, id, direction)],
      frameRate: 10,
      repeat: -1,
    };
    scene.anims.create(animConfig);
  }

  for (const direction of directions) {
    let frameName = "";
    if (scene.textures.exists(`player-${id}-${direction}-2`)) {
      frameName = `player-${id}-${direction}-2`;
    } else {
      frameName = `player-fallback-${direction}-2`;
    }
    scene.anims.create({
      key: `player-${id}-${direction}-stop`,
      frames: [
        {
          key: frameName,
        },
      ],
      frameRate: 10,
      repeat: -1,
    });
  }
}

function isCollTile(scene, x, y) {
  return scene.map.collisionLayer.getTileAtWorldXY(x, y) != null;
}

function stopAnimation(player) {
  if (player.prevAnim === `player-${player.id}-down`) {
    player.phaser.anims.play(`player-${player.id}-down-stop`, true);
  } else if (player.prevAnim === `player-${player.id}-left`) {
    player.phaser.anims.play(`player-${player.id}-left-stop`, true);
  } else if (player.prevAnim === `player-${player.id}-right`) {
    player.phaser.anims.play(`player-${player.id}-right-stop`, true);
  } else if (player.prevAnim === `player-${player.id}-up`) {
    player.phaser.anims.play(`player-${player.id}-up-stop`, true);
  } else {
    player.phaser.anims.stop();
  }

  return {
    ...player,
    prevAnim: "player-idle",
  };
}

function isCollTileAllDirection(scene, player) {
  const playerRight = player.phaser.x + 10;
  const playerLeft = player.phaser.x - 10;
  const playerUp = player.phaser.y - 10;
  const playerDown = player.phaser.y + 10;

  if (
    player.prevAnim === `player-${player.id}-down` &&
    isCollTile(scene, player.phaser.x, playerDown)
  ) {
    return true;
  }
  if (
    player.prevAnim === `player-${player.id}-left` &&
    isCollTile(scene, playerLeft, player.phaser.y)
  ) {
    return true;
  }
  if (
    player.prevAnim === `player-${player.id}-right` &&
    isCollTile(scene, playerRight, player.phaser.y)
  ) {
    return true;
  }
  if (
    player.prevAnim === `player-${player.id}-up` &&
    isCollTile(scene, player.phaser.x, playerUp)
  ) {
    return true;
  }
  return false;
}

function animFromPrevMove(player, move) {
  if (move === "stop") {
    return null;
  }
  return `player-${player.id}-${move}`;
}

function updateFollowClickAnimationInner(scene, player) {
  if (player.prevMove === "stop") {
    return stopAnimation(player);
  }

  if (isCollTileAllDirection(scene, player)) {
    player.phaser.anims.stop();
    return {
      ...player,
      prevAnim: "player-idle",
    };
  }

  const newAnim = animFromPrevMove(player, player.prevMove);
  if (newAnim === player.prevAnim) {
    return player;
  }
  if (newAnim == null) {
    return player;
  }
  player.phaser.anims.play(newAnim, true);
  return {
    ...player,
    prevAnim: newAnim,
  };
}

export function updateFollowClickAnimation(
  scene,
  player,
  destinationX,
  destinationY
) {
  try {
    const prev = player.prevAnim;
    const newPlayer = updateFollowClickAnimationInner(
      scene,
      player,
      destinationX,
      destinationY
    );
    const newAnim = newPlayer.prevAnim;
    if (prev !== newAnim) {
      // logDebug("anim changed", { prev, newAnim });
    }
    return newPlayer;
  } catch (err) {
    // we can ignore animation error.
    // if the user image is null, animation throws
    logErr(err);
    return player;
  }
}

export function updateInitAnimation(player) {
  const newPrevAnim = player.prevAnim;
  player.phaser.anims.play(`player-${player.id}-down-stop`, true);
  return {
    ...player,
    prevAnim: newPrevAnim,
  };
}

function playStopAnimation(player, direction) {
  const { prevAnim } = player;
  const moveInDirAnim = `player-${player.id}-${direction}`;
  const stopAnim = `player-${player.id}-${direction}-stop`;

  if (moveInDirAnim === prevAnim) {
    player.phaser.anims.play(stopAnim, true);
    return {
      ...player,
      prevAnim: stopAnim,
    };
  }
  player.phaser.anims.stop();
  return {
    ...player,
    prevAnim: "playet-idle",
  };
}

function calculateDirectionFromDiffs(xDiff, yDiff) {
  const xAbs = Math.abs(xDiff);
  const yAbs = Math.abs(yDiff);

  let axis;
  if (xAbs > yAbs) {
    axis = "x";
  } else {
    axis = "y";
  }

  if (axis === "x" && xDiff > 0) {
    return "right";
  }
  if (axis === "x" && xDiff < 0) {
    return "left";
  }
  if (axis === "y" && yDiff > 0) {
    return "down";
  }
  return "up";
}

export function updatePeerPlayerAnimation(player, xDiff, yDiff, stop) {
  const direction = calculateDirectionFromDiffs(xDiff, yDiff);

  if (stop) {
    return playStopAnimation(player, direction);
  }

  const { prevAnim } = player;
  const newAnim = `player-${player.id}-${direction}`;

  if (prevAnim === newAnim) {
    return player;
  }

  player.phaser.anims.play(newAnim, true);
  return {
    ...player,
    prevAnim: newAnim,
  };
}
