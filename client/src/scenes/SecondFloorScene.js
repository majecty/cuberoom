import Phaser from "phaser";
import {
  baseSceneConstructor,
  baseSceneInit,
  baseScenePreload,
  baseSceneCreate,
  baseSceneUpdate,
} from "./common/baseScene";
import { FLOOR_NAMES, FLOOR_TO_SCENE } from "./common";
import startScene from "../entity/map/startScene";
import { showElevatorPanel } from "../entity/map/elevator";
import { spawnPoints } from "./common/constants";
import { protocol } from "../network/protocol";
import { zoom } from "../constant";

function backgroundStatic(scene) {
  const sprite = scene.add.sprite(
    800 / zoom,
    608 / zoom,
    "secondFloor-background"
  );
  sprite.scale = 2 / zoom;
}

function tileInteraction(scene, curTileName) {
  switch (curTileName) {
    case "up":
      protocol.moveFloor(scene.socket, "5F");
      startScene(scene, "FifthFloorScene", spawnPoints.floor5F.from2F);
      break;
    case "down":
      protocol.moveFloor(scene.socket, "1F");
      startScene(scene, "FirstFloorScene", spawnPoints.floor1F.from2F);
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
    super(FLOOR_TO_SCENE["2F"]);
    this.x = spawnPoints.floor2F.from1F.x;
    this.y = spawnPoints.floor2F.from1F.y;
    baseSceneConstructor(this, FLOOR_TO_SCENE["2F"]);
  }

  init(data) {
    baseSceneInit(this, data);
  }

  preload() {
    this.load.image("secondFloor-background", "/static/img/2f_background.png");
    this.load.image("collision-tileset", "/static/tilemap/simple_tile.png");
    this.load.image("interactive-tile", "/static/tilemap/interactive-tile.png");
    this.load.image("popup", "/static/img/ui-map/popup.png");
    this.load.tilemapTiledJSON({
      key: "secondFloor-map",
      url: "/static/tilemap/second-floor.json",
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
