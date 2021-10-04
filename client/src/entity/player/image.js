/* eslint-disable import/prefer-default-export */
import ENV from "../../../ENV";

const directions = ["down", "up", "left", "right"];

export function* animationFrames(scene, id, direction) {
  for (let i = 1; i < 5; i += 1) {
    if (scene.textures.exists(`player-${id}-${direction}-${i}`)) {
      yield { key: `player-${id}-${direction}-${i}` };
    } else {
      yield { key: `player-fallback-${direction}-${i}` };
    }
  }
}

export function* allCharacterImageNames(id, playerImgUrl) {
  for (const direction of directions) {
    for (let i = 1; i < 5; i += 1) {
      yield [
        `player-${id}-${direction}-${i}`,
        `${playerImgUrl}${direction}-${i}.png`,
      ];
      yield [
        `player-fallback-${direction}-${i}`,
        `${ENV.URL_STATIC}/img/player/${direction}-${i}.png`,
      ];
    }
  }
}
