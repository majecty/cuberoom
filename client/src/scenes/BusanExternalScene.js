import Phaser from "phaser";
import { FLOOR_NAMES } from "./common";
import {
  baseSceneConstructor,
  baseSceneInit,
  baseScenePreload,
  baseSceneCreate,
  baseSceneUpdate,
} from "./common/baseScene";
import { zoom } from "../constant";
import { playerUpdateInitialPos } from "../entity/player";

function backgroundStatic(scene) {
  const sprite = scene.add.sprite(
    640 / zoom,
    320 / zoom,
    "busanexternal-background"
  );
  sprite.scale = 2 / zoom;
}

function tileInteraction(scene, curTileName) {
  console.log("curTileName", curTileName);
  switch (curTileName) {
    case "up":
      break;
    case "down":
      break;
    case "elevator":
      break;
    case "popup":
      break;
    default:
      break;
  }
}

class BusanExternalScene extends Phaser.Scene {
  constructor() {
    super("BusanExternalScene");
    this.x = 0;
    this.y = 0;
    baseSceneConstructor(this, FLOOR_NAMES.BusanExternalScene);
  }

  init(data) {
    baseSceneInit(this, data);
  }

  preload() {
    this.load.image("busanexternal-background", "/static/img/tilesetimages/busan_external.png");
    this.load.image("collision-tileset", "/static/tilemap/simple_tile.png");
    this.load.image("interactive-tile", "/static/tilemap/busan-interactive.png");
    this.load.tilemapTiledJSON({
      key: "busantest-map",
      url: "/static/tilemap/busan-external.json",
    });
    baseScenePreload(this);
  }

  create() {
    backgroundStatic(this);
    baseSceneCreate({
      selfScene: this,
      mapName: "busantest-map",
      mapBackgroundLayerName: "busantest-background",
      onMoveToTile: (tileName) => {
        tileInteraction(this, tileName);
      },
    });

    this.x = (this.map.objects.spawnPoint.x * 2) / zoom;
    this.y = (this.map.objects.spawnPoint.y * 2) / zoom; 
    playerUpdateInitialPos(this.player, this.x, this.y);
    // object
  }

  update(_time, delta) {
    baseSceneUpdate(this, delta);
  }
}

export default BusanExternalScene;
