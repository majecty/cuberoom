import { log } from "../log";

let welcomeSprite;

export function welcomeCreate(scene, { x, y }, flag) {
  if (flag) {
    let counter = 1;

    welcomeSprite = scene.add.sprite(x, y, "welcome1");
    log("1");
    welcomeSprite.setName("welcome");
    counter = 2;

    const welcomeinterval = setInterval(() => {
      if (counter === 2) {
        if (welcomeSprite != null) {
          welcomeSprite.setTexture("welcome2");
          counter = 3;
          log("2");
        }
      } else if (counter === 3) {
        if (welcomeSprite != null) {
          welcomeSprite.setTexture("welcome3");
          counter = 1;
          log("3");
        }
      }
    }, 3000);

    // FIXME: it looks like a bug
    if ((counter = 1)) {
      clearInterval(welcomeinterval);
    }

    return {
      phaser: welcomeSprite,
    };
  }

  return null;
}

export function welcomeDestroy() {
  welcomeSprite.destroy();
}
