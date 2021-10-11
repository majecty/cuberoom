/* eslint-disable import/prefer-default-export */

import { followClick, isMouseInputEnabled } from "./move/mouse";
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
  // FIXME: move detination to player
  if (pointer.isDown && isMouseInputEnabled()) {
    scene.destinationX = scene.input.activePointer.worldX;
    scene.destinationY = scene.input.activePointer.worldY;
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
