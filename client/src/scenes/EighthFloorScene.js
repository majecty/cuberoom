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
import { spawnPoints } from "./common/constants";
import { protocol } from "../network/protocol";
import { zoom } from "../constant";

function backgroundStatic(scene) {
  const sprite = scene.add.sprite(
    800 / zoom,
    770 / zoom,
    "eighthFloor-background"
  );
  sprite.scale = 2 / zoom;
}

function tileInteraction(scene, curTileName) {
  switch (curTileName) {
    case "up":
      break;
    case "down":
      protocol.moveFloor(scene.socket, "7F");
      startScene(scene, "SeventhFloorScene", spawnPoints.floor7F.from8F);
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
    this.x = spawnPoints.floor8F.from7F.x;
    this.y = spawnPoints.floor8F.from7F.y;
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
