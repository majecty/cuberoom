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
import { spawnPoints } from "./common/constants";
import { protocol } from "../network/protocol";
import { zoom } from "../constant";

function backgroundStatic(scene) {
  const sprite = scene.add.sprite(
    800 / zoom,
    608 / zoom,
    "seventhFloor-background"
  );
  sprite.scale = 2 / zoom;
}

function tileInteraction(scene, curTileName) {
  switch (curTileName) {
    case "up":
      protocol.moveFloor(scene.socket, "8F");
      startScene(scene, "EighthFloorScene", spawnPoints.floor8F.from7F);
      break;
    case "down":
      protocol.moveFloor(scene.socket, "6F");
      startScene(scene, "SixthFloorScene", spawnPoints.floor6F.from7F);
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
    this.x = spawnPoints.floor7F.from6F.x;
    this.y = spawnPoints.floor7F.from6F.y;
    baseSceneConstructor(this, FLOOR_NAMES.SeventhFloorScene);
  }

  init(data) {
    baseSceneInit(this, data);
  }

  preload() {
    this.load.image("seventhFloor-background", "/static/img/7f_background.png");
    this.load.image("collision-tileset", "/static/tilemap/simple_tile.png");
    this.load.image("interactive-tile", "/static/tilemap/interactive-tile.png");
    this.load.image("popup", "/static/img/ui-map/popup.png");
    this.load.tilemapTiledJSON({
      key: "seventhFloor-map",
      url: "/static/tilemap/seventh-floor.json",
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
