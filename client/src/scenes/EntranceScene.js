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
  scene.add.sprite(1200 / 2, 800 / 2, "entrance-background");
}

class EntranceScene extends Phaser.Scene {
  constructor() {
    super("EntranceScene");
    window.scenes.entrance = this;
    this.x = 16 * 5;
    this.y = 16 * 30;

    baseSceneConstructor(this, FLOOR_NAMES.EntranceScene);
  }

  init(data) {
    baseSceneInit(this, data);
  }

  preload() {
    this.load.image("entrance-background", "/img/entrance_background.png");
    this.load.image("collision-tileset", "/tilemap/simple_tile.png");
    this.load.image("interactive-tile", "/tilemap/interactive-tile.png");
    this.load.image("popup", "/img/ui-map/popup.png");

    this.load.tilemapTiledJSON({
      key: "entrance-map",
      url: "/tilemap/entrance.json",
    });
    baseScenePreload(this);
  }

  create() {
    backgroundStatic(this);
    baseSceneCreate(this, "entrance-map", "entrance-background");
  }

  update(_time, _delta) {
    baseSceneUpdate(this);
  }
}

export default EntranceScene;
