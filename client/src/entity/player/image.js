/* eslint-disable import/prefer-default-export */
import ENV from "../../../ENV";

const directions = ["down", "up", "left", "right"];

export function* animationFrames(id, direction) {
  for (let i = 1; i < 5; i += 1) {
    yield { key: `player-${id}-${direction}-${i}` };
  }
}

export function* allCharacterImageNames(id, playerImgUrl) {
  for (const direction of directions) {
    for (let i = 1; i < 5; i += 1) {
      yield [
        `player-${id}-${direction}-${i}`,
        `${ENV.URL_STATIC}${playerImgUrl}${direction}-${i}.png`,
      ];
    }
  }
}
