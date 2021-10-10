import Phaser from "phaser";
import { playerSpeed } from "../../../constant";

export function playerAddKey(player, scene) {
  const keyboard = {
    w: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
    a: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
    s: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
    d: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
  };

  return {
    ...player,
    keyboard,
  };
}

export function keyPressed(player, scene) {
  if (scene.cursors.left.isDown || player.keyboard.a.isDown) {
    return true;
  }
  if (scene.cursors.right.isDown || player.keyboard.d.isDown) {
    return true;
  }
  if (scene.cursors.up.isDown || player.keyboard.w.isDown) {
    return true;
  }
  if (scene.cursors.down.isDown || player.keyboard.s.isDown) {
    return true;
  }
  return false;
}

export function moveWithKeyboard(player, scene) {
  const speed = playerSpeed;
  let newPrevMove = "stop";
  if (scene.cursors.left.isDown || player.keyboard.a.isDown) {
    player.phaser.body.setVelocityX(-speed);
    newPrevMove = "left";
  } else if (scene.cursors.right.isDown || player.keyboard.d.isDown) {
    player.phaser.body.setVelocityX(speed);
    newPrevMove = "right";
  } else {
    player.phaser.body.setVelocityX(0);
  }

  if (scene.cursors.up.isDown || player.keyboard.w.isDown) {
    player.phaser.body.setVelocityY(-speed);
    newPrevMove = "up";
  } else if (scene.cursors.down.isDown || player.keyboard.s.isDown) {
    player.phaser.body.setVelocityY(speed);
    newPrevMove = "down";
  } else {
    player.phaser.body.setVelocityY(0);
  }

  return {
    ...player,
    prevMove: newPrevMove,
  };
}
