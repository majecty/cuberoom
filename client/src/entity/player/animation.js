/* eslint-disable import/prefer-default-export */

import { animationFrames } from "./image";
import { logErr } from "../../log";

const directions = ["down", "up", "left", "right"];

export function playerCreateAnimations(id, scene) {
  for (const direction of directions) {
    const animConfig = {
      key: `player-${id}-${direction}`,
      frames: [...animationFrames(id, direction)],
      frameRate: 10,
      repeat: -1,
    };
    scene.anims.create(animConfig);
  }

  for (const direction of directions) {
    scene.anims.create({
      key: `player-${id}-${direction}-stop`,
      frames: [
        {
          key: `player-${id}-${direction}-2`,
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

function updateFollowClickAnimationInner(
  scene,
  player,
  destinationX,
  destinationY
) {
  let newPrevAnim = player.prevAnim;

  const playerRight = player.phaser.x + 10;
  const playerLeft = player.phaser.x - 10;
  const playerUp = player.phaser.y - 10;
  const playerDown = player.phaser.y + 10;

  if (
    Math.abs(player.phaser.x - destinationX) < 5 &&
    Math.abs(player.phaser.y - destinationY) < 5
  ) {
    if (player.prevAnim === `player-${player.id}-down`) {
      player.phaser.anims.play(`player-down-${player.id}-stop`, true);
      // newPrevAnim = `player-${player.id}-down`;
    } else if (player.prevAnim === `player-${player.id}-left`) {
      player.phaser.anims.play(`player-${player.id}-left-stop`, true);
      // newPrevAnim = `player-${player.id}-left`;
    } else if (player.prevAnim === `player-${player.id}-right`) {
      player.phaser.anims.play(`player-${player.id}-right-stop`, true);
      // newPrevAnim = `player-${player.id}-right`;
    } else if (player.prevAnim === `player-${player.id}-up`) {
      player.phaser.anims.play(`player-${player.id}-up-stop`, true);
      // newPrevAnim = `player-${player.id}-down`;
    } else {
      player.phaser.anims.stop();
    }

    newPrevAnim = "player-idle";
  } else if (
    player.prevAnim === `player-${player.id}-down` &&
    isCollTile(scene, player.phaser.x, playerDown)
  ) {
    player.phaser.anims.stop();
    newPrevAnim = "player-idle";
  } else if (
    player.prevAnim === `player-${player.id}-left` &&
    isCollTile(scene, playerLeft, player.phaser.y)
  ) {
    player.phaser.anims.stop();
    newPrevAnim = "player-idle";
  } else if (
    player.prevAnim === `player-${player.id}-right` &&
    isCollTile(scene, playerRight, player.phaser.y)
  ) {
    player.phaser.anims.stop();
    newPrevAnim = "player-idle";
  } else if (
    player.prevAnim === `player-${player.id}-up` &&
    isCollTile(scene, player.phaser.x, playerUp)
  ) {
    player.phaser.anims.stop();
    newPrevAnim = "player-idle";
  } else if (destinationX < player.phaser.x) {
    if (destinationY + 5 < player.phaser.y) {
      player.phaser.anims.play(`player-${player.id}-up`, true);
      newPrevAnim = `player-${player.id}-up`;
    } else if (destinationY > 5 + player.phaser.y) {
      player.phaser.anims.play(`player-${player.id}-down`, true);
      newPrevAnim = `player-${player.id}-down`;
    } else if (player.prevAnim !== `player-${player.id}-left`) {
      player.phaser.anims.play(`player-${player.id}-left`, true);
      newPrevAnim = `player-${player.id}-left`;
    }
  } else if (destinationX > player.phaser.x) {
    if (destinationY + 5 < player.phaser.y) {
      player.phaser.anims.play(`player-${player.id}-up`, true);
      newPrevAnim = `player-${player.id}-up`;
    } else if (destinationY > 5 + player.phaser.y) {
      player.phaser.anims.play(`player-${player.id}-down`, true);
      newPrevAnim = `player-${player.id}-down`;
    } else if (player.prevAnim !== `player-${player.id}-right`) {
      player.phaser.anims.play(`player-${player.id}-right`, true);
      newPrevAnim = `player-${player.id}-right`;
    }
  } else if (destinationY < player.phaser.y) {
    if (player.prevAnim !== `player-${player.id}-up`) {
      player.phaser.anims.play(`player-${player.id}-up`, true);
      newPrevAnim = `player-${player.id}-up`;
    }
  } else if (destinationY > player.phaser.y) {
    if (player.prevAnim !== `player-${player.id}-down`) {
      player.phaser.anims.play(`player-${player.id}-down`, true);
      newPrevAnim = `player-${player.id}-down`;
    }
  } else {
    if (player.prevAnim === `player-${player.id}-up`) {
      player.phaser.anims.play(`player-${player.id}-up-stop`, true);
    } else if (player.prevAnim === `player-${player.id}-down`) {
      player.phaser.anims.play(`player-down-${player.id}-stop`, true);
    } else if (player.prevAnim === `player-${player.id}-left`) {
      player.phaser.anims.play(`player-${player.id}-left-stop`, true);
    } else if (player.prevAnim === `player-${player.id}-right`) {
      player.phaser.anims.play(`player-${player.id}-right-stop`, true);
    } else {
      player.phaser.anims.stop();
    }

    newPrevAnim = "player-idle";
  }

  return {
    ...player,
    prevAnim: newPrevAnim,
  };
}

export function updateFollowClickAnimation(
  scene,
  player,
  destinationX,
  destinationY
) {
  try {
    return updateFollowClickAnimationInner(
      scene,
      player,
      destinationX,
      destinationY
    );
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
