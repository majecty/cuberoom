import Phaser from "phaser";
import {
  baseSceneConstructor,
  baseSceneInit,
  baseScenePreload,
  baseSceneCreate,
  baseSceneUpdate,
} from "./common/baseScene";
import { FLOOR_NAMES } from "./common";

function backgroundStatic(scene) {
  scene.add.sprite(800 / 2, 608 / 2, "secondFloor-background");
}

class SecondFloorScene extends Phaser.Scene {
  constructor() {
    super("SecondFloorScene");
    this.x = 16 * 6;
    this.y = 16 * 11;
    baseSceneConstructor(this, FLOOR_NAMES.SecondFloorScene);
  }

  init(data) {
    baseSceneInit(this, data);
  }

  preload() {
    this.load.image("secondFloor-background", "/img/2f_background.png");
    this.load.image("collision-tileset", "/tilemap/simple_tile.png");
    this.load.image("interactive-tile", "/tilemap/interactive-tile.png");
    this.load.image("popup", "/img/ui-map/popup.png");
    this.load.tilemapTiledJSON({
      key: "secondFloor-map",
      url: "/tilemap/second-floor.json",
    });
    baseScenePreload(this);
  }

  create() {
    backgroundStatic(this);
    baseSceneCreate(this, "secondFloor-map", "secondFloor-background");
  }

  update(_time, delta) {
    baseSceneUpdate(this, delta);
  }
}

export default SecondFloorScene;
