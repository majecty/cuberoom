export const networkTickMillis = 300;
export const zoom = 1;
export const playerSpeed = 200 / zoom; // pixel per sec

// depth가 높으면 앞에 나옴.
export const depth = {
  background: 0,
  // depth = 1 + y / 10000
  player: 1,
  overPlayer: 2,
  nameLabel: 3,
};
