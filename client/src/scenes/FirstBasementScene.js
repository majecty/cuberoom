import Phaser from "phaser";
import { FLOOR_NAMES } from "./common";
import {
  baseSceneConstructor,
  baseSceneInit,
  baseScenePreload,
  baseSceneCreate,
  baseSceneUpdate,
} from "./common/baseScene";

function backgroundStatic(scene) {
  scene.add.sprite(800 / 2, 1220 / 2, "firstBasement-background");
}

class FirstBasementScene extends Phaser.Scene {
  constructor() {
    super("FirstBasementScene");
    this.x = 16 * 3;
    this.y = 16 * 32;
    baseSceneConstructor(this, FLOOR_NAMES.FirstBasementScene);
  }

  init(data) {
    baseSceneInit(this, data);
  }

  preload() {
    this.load.image("firstBasement-background", "/img/b1_background.png");
    this.load.image("collision-tileset", "/tilemap/simple_tile.png");
    this.load.image("interactive-tile", "/tilemap/interactive-tile.png");
    this.load.image("popup", "/img/ui-map/popup.png");
    this.load.tilemapTiledJSON({
      key: "firstBasement-map",
      url: "/tilemap/first-basement.json",
    });
    baseScenePreload(this);
  }

  create() {
    backgroundStatic(this);
    baseSceneCreate(this, "firstBasement-map", "firstBasement-background");
  }

  update(_time, _delta) {
    baseSceneUpdate(this);
  }
}

export default FirstBasementScene;
