import ENV from "../../../ENV";
import { zoom, depth } from "../../constant";
import {
  enableMouseInput,
  isMouseInputEnabled,
  disableMouseInput,
} from "../../entity/player/move/mouse";
import WelcomeMessage from "./WelcomeMessage.svelte";

export function loadExclamationMarkImage(scene) {
  const url = `${ENV.URL_STATIC}/img/ui/exclamation-mark.png`;
  scene.load.image(`exclamation-mark`, url);
}

/**
 * @param {Phaser.Scene} scene
 */
export function createExclamationMark(scene) {
  const welcomePosition = scene.map.objects.welcome;
  const x = (welcomePosition.x * 2) / zoom;
  const y = (welcomePosition.y * 2) / zoom;
  const phaser = scene.add.image(x, y, "exclamation-mark");
  phaser.setOrigin(0.5, 1);
  phaser.setDepth(depth.overPlayer + 0.1);
  phaser.setInteractive();
  phaser.on("pointerdown", () => {
    disableMouseInput();
    const welcomeMessage = new WelcomeMessage({
      target: document.body,
    });
    scene.welcomeMessage = welcomeMessage;
  });
  phaser.on("pointerover", () => {
    scene.input.setDefaultCursor("pointer");
  });
  phaser.on("pointerout", () => {
    scene.input.setDefaultCursor("auto");
    if (isMouseInputEnabled() !== true) {
      enableMouseInput();
    }
  });
  return {
    phaser,
  };
}
