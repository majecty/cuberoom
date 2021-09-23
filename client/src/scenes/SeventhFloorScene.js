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
  scene.add.sprite(800 / 2, 608 / 2, "seventhFloor-background");
}

class SeventhFloorScene extends Phaser.Scene {
  constructor() {
    super("SeventhFloorScene");
    this.x = 16 * 5;
    this.y = 16 * 32;
    baseSceneConstructor(this, FLOOR_NAMES.EighthFloorScene);
  }

  init(data) {
    baseSceneInit(this, data);
  }

  preload() {
    this.load.image("seventhFloor-background", "/img/7f_background.png");
    this.load.image("collision-tileset", "/tilemap/simple_tile.png");
    this.load.image("interactive-tile", "/tilemap/interactive-tile.png");
    this.load.image("popup", "/img/ui-map/popup.png");
    this.load.tilemapTiledJSON({
      key: "seventhFloor-map",
      url: "/tilemap/seventh-floor.json",
    });
    baseScenePreload(this);
  }

  create() {
    backgroundStatic(this);
    baseSceneCreate(this, "seventhFloor-map", "seventhFloor-background");
  }

  update(_time, _delta) {
    baseSceneUpdate(this);
  }
}

export default SeventhFloorScene;
