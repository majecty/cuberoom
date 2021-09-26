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
  scene.add.sprite(800 / 2, 608 / 2, "secondFloor-background");
}

function tileInteraction(scene, curTileName) {
  switch (curTileName) {
    case "up":
      scene.socket.emit("moveFloor", {
        id: scene.socket.id,
        floor: "5F",
      });
      startScene(scene, "FifthFloorScene", { x: 16 * 3, y: 16 * 14 });
      break;
    case "down":
      scene.socket.emit("moveFloor", {
        id: scene.socket.id,
        floor: "1F",
      });
      startScene(scene, "FirstFloorScene", { x: 16 * 6, y: 16 * 14 });
      break;
    case "elevator":
      showElevatorPanel(scene, "2F");
      break;
    case "popup":
      break;
    default:
      break;
  }
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
    baseSceneCreate({
      selfScene: this,
      mapName: "secondFloor-map",
      mapBackgroundLayerName: "secondFloor-background",
      onMoveToTile: (tileName) => {
        tileInteraction(this, tileName);
      },
    });
  }

  update(_time, delta) {
    baseSceneUpdate(this, delta);
  }
}

export default SecondFloorScene;
