/* eslint-disable no-bitwise */

// copied from https://stackoverflow.com/a/2117523
export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// copied from https://w3collective.com/random-password-generator-javascript/
export function randomPassword() {
  const alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const characters = alpha;
  const length = 16;
  let password = "";
  for (let i = 0; i < length; i += 1) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return password;
}

/**
 * min <= x < max
 */
export function getRandomInt(min, max) {
  const newMin = Math.ceil(min);
  const newMax = Math.floor(max);
  return Math.floor(Math.random() * (newMax - newMin) + newMin); // The maximum is exclusive and the minimum is inclusive
}
