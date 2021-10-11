import { zoom, depth } from "../constant";
import works from "./works";
import ArtDescription from "./ArtDescription.svelte";
import {
  enableMouseInput,
  disableMouseInput,
  isMouseInputEnabled,
} from "./player/move/mouse";

let popupSprite;

export function popupCreate(scene, { x, y }, workNum) {
  const work = works[workNum];
  popupSprite = scene.add.sprite(x, y, "popup");
  popupSprite.setInteractive();
  popupSprite.scale = 2 / zoom;
  popupSprite.depth = depth.popup;

  // FIXME: event 등록 해제해야 하는지 확인 필요
  popupSprite.on("pointerover", () => {
    scene.input.setDefaultCursor("pointer");
  });

  // FIXME: event 등록 해제해야 하는지 확인 필요
  popupSprite.on("pointerout", () => {
    scene.input.setDefaultCursor("auto");
    if (isMouseInputEnabled() != true) {
      enableMouseInput();
    }
  });

  // FIXME: event 등록 해제해야 하는지 확인 필요
  popupSprite.on("pointerdown", () => {
    const artDescription = new ArtDescription({
      target: document.body,
      props: {
        game: window.game,
        id: work.id,
        popupLeftUrl: work.imgUrl,
        title: work.title,
        medium: work.medium,
        title2: work.title2,
        medium2: work.medium2,
        alt: work.alt,
        description: work.description,
        url: work.url,
        url2: work.url2,
      },
    });
    window.artDescription = artDescription;
    disableMouseInput();
  });

  popupSprite.on("pointerup", () => {
    enableMouseInput();
  });

  return {
    phaser: popupSprite,
  };
}

export function popupDestroy() {
  popupSprite.destroy();
  // if (descriptionContainer) document.body.removeChild(descriptionContainer);
}
