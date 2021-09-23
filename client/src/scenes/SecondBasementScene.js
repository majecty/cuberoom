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
  scene.add.sprite(800 / 2, 736 / 2, "secondBasement-background");
}

class SecondBasementScene extends Phaser.Scene {
  constructor() {
    super("SecondBasementScene");
    this.x = 16 * 3;
    this.y = 16 * 32;
    baseSceneConstructor(this, FLOOR_NAMES.SecondBasementScene);
  }

  init(data) {
    baseSceneInit(this, data);
  }

  preload() {
    this.load.image("secondBasement-background", "/img/b2_background.png");
    this.load.image("collision-tileset", "/tilemap/simple_tile.png");
    this.load.image("interactive-tile", "/tilemap/interactive-tile.png");
    this.load.image("b2-cylinder", "/tilemap/b2_cylinder.png");
    this.load.image("b2-cube", "/tilemap/b2_cube.png");
    this.load.image("b2-pink", "/tilemap/b2_pink.png");
    this.load.image("popup", "/img/ui-map/popup.png");
    this.load.tilemapTiledJSON({
      key: "secondBasement-map",
      url: "/tilemap/second-basement.json",
    });
    baseScenePreload(this);
  }

  create() {
    backgroundStatic(this);
    baseSceneCreate(this, "secondBasement-map", "secondBasement-background");
  }

  update(_time, _delta) {
    baseSceneUpdate(this);
  }
}

export default SecondBasementScene;
