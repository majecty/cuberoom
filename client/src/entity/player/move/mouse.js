/* eslint-disable import/prefer-default-export */
/* eslint no-param-reassign: ["error", { "props": false }] */
import { playerSpeed } from "../../../constant";

window.enableMouseInput = true;
export function disableMouseInput() {
  window.enableMouseInput = false;
}

export function enableMouseInput() {
  window.enableMouseInput = true;
}

export function isMouseInputEnabled() {
  return window.enableMouseInput;
}

export function mouseInputUpdateEvent(player, x, y) {
  player.lastMouseInput = {
    x, y
  };
}

export function mouseInputReset(player) {
  player.lastMouseInput = null;
}

export function followClick(player, destinationX, destinationY, dtMillis) {
  const velocity = playerSpeed;
  const moveDiff = ((dtMillis * velocity) / 1000) * 1.5;

  let newPrevMove = "stop";
  if (typeof destinationX === "number") {
    if (destinationX + moveDiff < player.phaser.x) {
      player.phaser.body.setVelocityX(-velocity);
      newPrevMove = "left";
    } else if (destinationX - moveDiff > player.phaser.x) {
      player.phaser.body.setVelocityX(velocity);
      newPrevMove = "right";
    } else {
      player.phaser.x = destinationX;
      player.phaser.body.setVelocityX(0);
    }
  }

  if (typeof destinationY === "number") {
    if (destinationY + moveDiff < player.phaser.y) {
      player.phaser.body.setVelocityY(-velocity);
      newPrevMove = "up";
    } else if (destinationY - moveDiff > player.phaser.y) {
      player.phaser.body.setVelocityY(velocity);
      newPrevMove = "down";
    } else {
      player.phaser.y = destinationY;
      player.phaser.body.setVelocityY(0);
    }
  }

  if (newPrevMove === "stop") {
    player.phaser.body.setVelocityY(0);
    player.phaser.body.setVelocityX(0);
  }

  return {
    ...player,
    prevMove: newPrevMove,
  };
}
