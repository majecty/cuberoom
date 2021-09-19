/* eslint-disable import/prefer-default-export */

import { isValidURLName, openURL } from "../../common/urlOpen";

export function mapOnPointerDown(map, pointer) {
  const tile = map.interactionLayer.getTileAtWorldXY(
    pointer.worldX,
    pointer.worldY
  );
  if (tile == null) {
    return;
  }

  if (isValidURLName(tile.properties.name)) {
    openURL(tile.properties.name);
  }
}

export function mapUpdateMousePoint(map, scene) {
  const pointer = scene.input.mousePointer;
  // FIXME: use getAnyLayer
  const tile = map.interactionLayer.getTileAtWorldXY(
    pointer.worldX,
    pointer.worldY
  );

  if (tile == null) {
    scene.input.setDefaultCursor("auto");
    return;
  }
  const availableImageNames = [
    "image1",
    "image2",
    "image3",
    "image4",
    "image5",
    "image6",
    "image7",
    "image8",
    "image9",
  ];
  if (availableImageNames.includes(tile.properties.name)) {
    scene.input.setDefaultCursor("pointer");
  }
}
