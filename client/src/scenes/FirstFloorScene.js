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
import { spawnPoints } from "./common/constants";
import { protocol } from "../network/protocol";

function backgroundStatic(scene) {
  scene.add.sprite(800 / 2, 608 / 2, "firstFloor-background");
}

function tileInteraction(scene, curTileName) {
  switch (curTileName) {
    case "up":
      protocol.moveFloor(scene.socket, "2F");
      startScene(scene, "SecondFloorScene", spawnPoints.floor2F.from1F);
      break;
    case "down":
      protocol.moveFloor(scene.socket, "B1");
      startScene(scene, "FirstBasementScene", spawnPoints.floorB1.from1F);
      break;
    case "elevator":
      showElevatorPanel(scene, "1F");
      break;
    case "out":
      protocol.moveFloor(scene.socket, "entrance");
      startScene(scene, "EntranceScene", spawnPoints.entrance.buildingFront);
      break;
    default:
      break;
  }
}

class FirstFloorScene extends Phaser.Scene {
  constructor() {
    super("FirstFloorScene");

    this.x = 16 * 5;
    this.y = 16 * 29;
    baseSceneConstructor(this, FLOOR_NAMES.FirstFloorScene);
  }

  init(data) {
    baseSceneInit(this, data);
  }

  preload() {
    this.load.image("firstFloor-background", "/static/img/1f_background.png");
    this.load.image("collision-tileset", "/static/tilemap/simple_tile.png");
    this.load.image("interactive-tile", "/static/tilemap/interactive-tile.png");
    this.load.image("popup", "/static/img/ui-map/popup.png");
    this.load.image("welcome1", "/static/img/ui-map/welcome1.png");
    this.load.image("welcome2", "/static/img/ui-map/welcome2.png");
    this.load.image("welcome3", "/static/img/ui-map/welcome3.png");
    this.load.tilemapTiledJSON({
      key: "firstFloor-map",
      url: "/static/tilemap/first-floor.json",
    });
    baseScenePreload(this);
  }

  create() {
    backgroundStatic(this);
    baseSceneCreate({
      selfScene: this,
      mapName: "firstFloor-map",
      mapBackgroundLayerName: "firstFloor-background",
      onMoveToTile: (tileName) => {
        tileInteraction(this, tileName);
      },
    });
  }

  update(_time, delta) {
    baseSceneUpdate(this, delta);
  }
}

export default FirstFloorScene;
