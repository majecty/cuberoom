/* eslint-disable import/prefer-default-export */

import {
  followClick,
  isMouseInputEnabled,
  mouseInputReset,
} from "./move/mouse";
import { updatePlayerMoveAnimation } from "./animation";
import { moveWithKeyboard, keyPressed } from "./move/keyboard";
import { getPlayerDepth } from "./common";

export function playerInitializeMove(player) {
  return {
    ...player,
    // "mouse", "keyboard"
    lastMovInpute: "none",
  };
}

/* eslint no-param-reassign: ["error", { "props": false }] */
export function playerMove(
  player,
  destinationX,
  destinationY,
  scene,
  dtMillis
) {
  const pointer = scene.input.activePointer;
  let newPlayer = { ...player };
  let useMouseInput = false;
  if (newPlayer.lastMouseInput != null || pointer.isDown) {
    useMouseInput = true;
  }
  // FIXME: move detination to player
  if (useMouseInput && isMouseInputEnabled()) {
    if (newPlayer.lastMouseInput != null) {
      scene.destinationX = newPlayer.lastMouseInput.x;
      scene.destinationY = newPlayer.lastMouseInput.y;
    } else if (pointer.isDown) {
      scene.destinationX = scene.input.activePointer.worldX;
      scene.destinationY = scene.input.activePointer.worldY;
    }
    mouseInputReset(newPlayer);
    newPlayer.lastMoveInput = "mouse";
  }
  if (keyPressed(newPlayer, scene)) {
    newPlayer.lastMoveInput = "keyboard";
  }

  newPlayer = updatePlayerMoveAnimation(scene, newPlayer);
  if (newPlayer.lastMoveInput === "mouse") {
    newPlayer = followClick(newPlayer, destinationX, destinationY, dtMillis);
  } else if (newPlayer.lastMoveInput === "keyboard") {
    newPlayer = moveWithKeyboard(newPlayer, scene, dtMillis);
  }

  newPlayer.phaser.depth = getPlayerDepth(newPlayer);
  return newPlayer;
}
