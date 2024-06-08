import { popupDestroy } from "../entity/popup";
import { hideElevatorPanel } from "../entity/map/elevator";

/**
 * @typedef {(tileName: string) => void} OnMoveToTile
 */

/**
 * @param {OnMoveToTile} onMoveToTile
 */
export function playerOnMapCreate(onMoveToTile) {
  return {
    prevTile: null,
    prevTileName: null,

    // FIXME: remove default value after finishing refactoring
    onMoveToTile: onMoveToTile == null ? () => {} : onMoveToTile,
  };
}

/**
 * 플레이어가 위치한 타일에 따라 특정 동작을 함
 */
export function playerOnMapUpdate(playerOnMap, player, map) {
  const playerX = player.phaser.x;
  const playerY = player.phaser.y;
  const curTile = map.interactionLayer.getTileAtWorldXY(playerX, playerY);
  const curTileName = curTile?.properties?.name;

  if (playerOnMap.prevTileName !== curTileName) {
    if (playerOnMap.prevTileName === "elevator") hideElevatorPanel();
    if (
      [
        "work-1",
        "work-2",
        "work-3",
        "work-4",
        "work-5",
        "work-6",
        "work-7",
        "work-8",
      ].includes(playerOnMap.prevTileName)
    ) {
      popupDestroy();
    }

    playerOnMap.onMoveToTile(curTileName, playerOnMap.prevTileName);
  }

  return {
    ...playerOnMap,
    prevTile: curTile,
    prevTileName: curTile?.properties?.name,
  };
}
