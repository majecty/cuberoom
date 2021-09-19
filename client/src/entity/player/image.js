/* eslint-disable import/prefer-default-export */
import ENV from '../../../ENV';

const directions = ["down", "up", "left", "right"];

export function* animationFrames(direction) {
  for (let i = 1; i < 5; i += 1) {
    yield { key: `player-${direction}-${i}` };
  }
}

export function* allCharacterImageNames(playerImgUrl) {
  for (const direction of directions) {
    for (let i = 1; i < 5; i += 1) {
      yield [
        `player-${direction}-${i}`,
        `${ENV.URL_STATIC}${playerImgUrl}${direction}-${i}.png`,
      ];
    }
  }
}
