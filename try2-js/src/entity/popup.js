/* eslint-disable import/prefer-default-export */

import { log } from "../log";
import { openURL } from "../common/urlOpen";

export function popupCreate(scene, { x, y, name }) {
  log(`create pop at x: ${x}, y: ${y}`);
  const phaser = scene.add.sprite(x + 5, y - 10, "popup");
  phaser.setInteractive();

  // FIXME: event 등록 해제해야해
  phaser.on("pointerover", () => {
    scene.input.setDefaultCursor("pointer");
  });

  // FIXME: event 등록 해제해야해
  phaser.on("pointerout", () => {
    scene.input.setDefaultCursor("auto");
  });

  // FIXME: event 등록 해제해야해
  // 중복 제거해야해
  phaser.on("pointerdown", () => {
    openURL(name);
  });

  return {
    phaser,
    name,
  };
}
