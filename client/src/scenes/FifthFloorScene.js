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
import { showElevatorPanel } from "../entity/map/elevator";

function backgroundStatic(scene) {
  scene.add.sprite(800 / 2, 608 / 2, "fifthFloor-background");
}

function tileInteraction(scene, curTileName) {
  switch (curTileName) {
    case "up":
      scene.socket.emit("moveFloor", {
        id: scene.socket.id,
        floor: "6F",
      });
      startScene(scene, "SixthFloorScene", { x: 16 * 3, y: 16 * 21 });
      break;
    case "down":
      scene.socket.emit("moveFloor", {
        id: scene.socket.id,
        floor: "2F",
      });
      startScene(scene, "SecondFloorScene", { x: 16 * 6, y: 16 * 13 });
      break;
    case "elevator":
      showElevatorPanel(scene, "5F");
      break;
    case "up2":
      scene.socket.emit("moveFloor", {
        id: scene.socket.id,
        floor: "6F",
      });
      startScene(scene, "SixthFloorScene", { x: 16 * 46, y: 16 * 26 });
      break;
    default:
      break;
  }
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
    this.load.image("fifthFloor-background", "/static/img/5f_background.png");
    this.load.image("collision-tileset", "/static/tilemap/simple_tile.png");
    this.load.image("interactive-tile", "/static/tilemap/interactive-tile.png");
    this.load.image("popup", "/static/img/ui-map/popup.png");

    this.load.tilemapTiledJSON({
      key: "fifthFloor-map",
      url: "/static/tilemap/fifth-floor.json",
    });
    baseScenePreload(this);
  }

  create() {
    backgroundStatic(this);
    baseSceneCreate({
      selfScene: this,
      mapName: "fifthFloor-map",
      mapBackgroundLayerName: "fifthFloor-background",
      onMoveToTile: (tileName) => {
        tileInteraction(this, tileName);
      },
    });
  }

  update(_time, delta) {
    baseSceneUpdate(this, delta);
  }
}

export default FifthFloorScene;
