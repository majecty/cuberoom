/* eslint-disable import/prefer-default-export */
import { depth } from "../../constant";

export function getPlayerDepth(player) {
  return depth.player + player.phaser.y / 10000;
}
