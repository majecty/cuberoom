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
  scene.add.sprite(800 / 2, 608 / 2, "firstFloor-background");
}

class FirstFloorScene extends Phaser.Scene {
  constructor() {
    super("FirstFloorScene");
    window.scenes.firstFloor = this;

    this.x = 16 * 5;
    this.y = 16 * 31;
    baseSceneConstructor(this, FLOOR_NAMES.FirstFloorScene);
  }

  init(data) {
    baseSceneInit(this, data);
  }

  preload() {
    this.load.image("firstFloor-background", "/img/1f_background.png");
    this.load.image("collision-tileset", "/tilemap/simple_tile.png");
    this.load.image("interactive-tile", "/tilemap/interactive-tile.png");
    this.load.image("popup", "/img/ui-map/popup.png");
    this.load.image("welcome1", "/img/ui-map/welcome1.png");
    this.load.image("welcome2", "/img/ui-map/welcome2.png");
    this.load.image("welcome3", "/img/ui-map/welcome3.png");
    this.load.tilemapTiledJSON({
      key: "firstFloor-map",
      url: "/tilemap/first-floor.json",
    });
    baseScenePreload(this);
  }

  create() {
    backgroundStatic(this);
    baseSceneCreate(this, "firstFloor-map", "firstFloor-background");
  }

  update(_time, delta) {
    baseSceneUpdate(this, delta);
  }
}

export default FirstFloorScene;
