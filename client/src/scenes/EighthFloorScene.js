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
  scene.add.sprite(800 / 2, 770 / 2, "eighthFloor-background");
}

class EighthFloorScene extends Phaser.Scene {
  constructor() {
    super("EighthFloorScene");
    this.x = 16 * 5;
    this.y = 16 * 31;
    baseSceneConstructor(this, FLOOR_NAMES.EighthFloorScene);
  }

  init(data) {
    baseSceneInit(this, data);
  }

  preload() {
    this.load.image("eighthFloor-background", "/img/8f_background.png");
    this.load.image("collision-tileset", "/tilemap/simple_tile.png");
    this.load.image("interactive-tile", "/tilemap/interactive-tile.png");
    this.load.image("popup", "/img/ui-map/popup.png");
    this.load.tilemapTiledJSON({
      key: "eighthFloor-map",
      url: "/tilemap/eighth-floor.json",
    });
    baseScenePreload(this);
  }

  create() {
    backgroundStatic(this);
    baseSceneCreate(this, "eighthFloor-map", "eighthFloor-background");
  }

  update(_time, delta) {
    baseSceneUpdate(this, delta);
  }
}

export default EighthFloorScene;
