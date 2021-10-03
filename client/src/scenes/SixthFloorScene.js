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
import { zoom } from "../constant";

function backgroundStatic(scene) {
  const sprite = scene.add.sprite(
    800 / zoom,
    800 / zoom,
    "sixthFloor-background"
  );
  sprite.scale = 2 / zoom;
}

function tileInteraction(scene, curTileName) {
  switch (curTileName) {
    case "up":
      protocol.moveFloor(scene.scoekt, "7F");
      startScene(scene, "SeventhFloorScene", spawnPoints.floor7F.from6F);
      break;
    case "down":
      protocol.moveFloor(scene.socket, "5F");
      startScene(scene, "FifthFloorScene", spawnPoints.floor5F.from6F);
      break;
    case "elevator":
      showElevatorPanel(scene, "6F");
      break;
    case "down2":
      protocol.moveFloor(scene.socket, "5F");
      startScene(scene, "FifthFloorScene", spawnPoints.floor5F.from6F_2);
      break;
    default:
      break;
  }
}

class SixthFloorScene extends Phaser.Scene {
  constructor() {
    super("SixthFloorScene");
    this.x = 16 * 5;
    this.y = 16 * 31;
    baseSceneConstructor(this, FLOOR_NAMES.SixthFloorScene);
  }

  init(data) {
    baseSceneInit(this, data);
  }

  preload() {
    this.load.image("sixthFloor-background", "/static/img/6f_background.png");
    this.load.image("collision-tileset", "/static/tilemap/simple_tile.png");
    this.load.image("interactive-tile", "/static/tilemap/interactive-tile.png");
    this.load.image("popup", "/static/img/ui-map/popup.png");
    this.load.tilemapTiledJSON({
      key: "sixthFloor-map",
      url: "/static/tilemap/sixth-floor.json",
    });
    baseScenePreload(this);
  }

  create() {
    backgroundStatic(this);
    baseSceneCreate({
      selfScene: this,
      mapName: "sixthFloor-map",
      mapBackgroundLayerName: "sixthFloor-background",
      onMoveToTile: (tileName) => {
        tileInteraction(this, tileName);
      },
    });
  }

  update(_time, delta) {
    baseSceneUpdate(this, delta);
  }
}

export default SixthFloorScene;
