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
  scene.add.sprite(800 / 2, 608 / 2, "fifthFloor-background");
}

class FifthFloorScene extends Phaser.Scene {
  constructor() {
    super("FifthFloorScene");
    this.x = 16 * 5;
    this.y = 16 * 31;
    baseSceneConstructor(this, FLOOR_NAMES.FifthFloorScene);
  }

  init(data) {
    baseSceneInit(this, data);
  }

  preload() {
    this.load.image("fifthFloor-background", "/img/5f_background.png");
    this.load.image("collision-tileset", "/tilemap/simple_tile.png");
    this.load.image("interactive-tile", "/tilemap/interactive-tile.png");
    this.load.image("popup", "/img/ui-map/popup.png");

    this.load.tilemapTiledJSON({
      key: "fifthFloor-map",
      url: "/tilemap/fifth-floor.json",
    });
    baseScenePreload(this);
  }

  create() {
    backgroundStatic(this);
    baseSceneCreate(this, "fifthFloor-map", "fifthFloor-background");
  }

  update(_time, delta) {
    baseSceneUpdate(this, delta);
  }
}

export default FifthFloorScene;
