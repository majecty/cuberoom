import Phaser from "phaser";
import { FLOOR_NAMES } from "./common";
import {
  baseSceneConstructor,
  baseSceneInit,
  baseScenePreload,
  baseSceneCreate,
  baseSceneUpdate,
} from "./common/baseScene";
import startScene from "../entity/map/startScene";

function backgroundStatic(scene) {
  scene.add.sprite(800 / 2, 770 / 2, "eighthFloor-background");
}

function tileInteraction(scene, curTileName) {
  switch (curTileName) {
    case "up":
      break;
    case "down":
      scene.socket.emit("moveFloor", {
        id: scene.socket.id,
        floor: "7F",
      });
      startScene(scene, "SeventhFloorScene", { x: 16 * 6, y: 16 * 13 });
      break;
    case "elevator":
      break;
    case "popup":
      break;
    default:
      break;
  }
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
    this.load.image("eighthFloor-background", "/static/img/8f_background.png");
    this.load.image("collision-tileset", "/static/tilemap/simple_tile.png");
    this.load.image("interactive-tile", "/static/tilemap/interactive-tile.png");
    this.load.image("popup", "/static/img/ui-map/popup.png");
    this.load.tilemapTiledJSON({
      key: "eighthFloor-map",
      url: "/static/tilemap/eighth-floor.json",
    });
    baseScenePreload(this);
  }

  create() {
    backgroundStatic(this);
    baseSceneCreate({
      selfScene: this,
      mapName: "eighthFloor-map",
      mapBackgroundLayerName: "eighthFloor-background",
      onMoveToTile: (tileName) => {
        tileInteraction(this, tileName);
      },
    });
  }

  update(_time, delta) {
    baseSceneUpdate(this, delta);
  }
}

export default EighthFloorScene;
