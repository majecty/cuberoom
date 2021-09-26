import Phaser from "phaser";
import {
  baseSceneConstructor,
  baseSceneInit,
  baseScenePreload,
  baseSceneCreate,
  baseSceneUpdate,
} from "./common/baseScene";
import { FLOOR_NAMES } from "./common";
import startScene from "../entity/map/startScene";
import { showElevatorPanel } from "../entity/map/elevator";

function backgroundStatic(scene) {
  scene.add.sprite(800 / 2, 608 / 2, "seventhFloor-background");
}

function tileInteraction(scene, curTileName) {
  switch (curTileName) {
    case "up":
      scene.socket.emit("moveFloor", {
        id: scene.socket.id,
        floor: "8F",
      });
      startScene(scene, "EighthFloorScene", { x: 16 * 3, y: 16 * 20 });
      break;
    case "down":
      scene.socket.emit("moveFloor", {
        id: scene.socket.id,
        floor: "6F",
      });
      startScene(scene, "SixthFloorScene", { x: 16 * 6, y: 16 * 21 });
      break;
    case "elevator":
      showElevatorPanel(scene, "7F");
      break;
    case "popup":
      break;
    default:
      break;
  }
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
    baseSceneCreate({
      selfScene: this,
      mapName: "seventhFloor-map",
      mapBackgroundLayerName: "seventhFloor-background",
      onMoveToTile: (tileName) => {
        tileInteraction(this, tileName);
      },
    });
  }

  update(_time, delta) {
    baseSceneUpdate(this, delta);
  }
}

export default SeventhFloorScene;
