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

function backgroundStatic(scene) {
  scene.add.sprite(1200 / 2, 800 / 2, "entrance-background");
}

function tileInteraction(scene, curTileName) {
  switch (curTileName) {
    case "up":
      // 이거 다른 경우에도 추가하기?
      scene.socket.emit("moveFloor", {
        id: scene.socket.id,
        floor: "1F",
      });
      startScene(scene, "FirstFloorScene", spawnPoints.floor1F.fromEntrance);
      break;
    default:
      break;
  }
}

class EntranceScene extends Phaser.Scene {
  constructor() {
    super("EntranceScene");
    window.scenes.entrance = this;
    this.x = 16 * 5;
    this.y = 16 * 30;

    baseSceneConstructor(this, FLOOR_NAMES.EntranceScene);
  }

  init(data) {
    baseSceneInit(this, data);
  }

  preload() {
    this.load.image("entrance-background", "/static/img/entrance_background.png");
    this.load.image("collision-tileset", "/static/tilemap/simple_tile.png");
    this.load.image("interactive-tile", "/static/tilemap/interactive-tile.png");
    this.load.image("popup", "/static/img/ui-map/popup.png");

    this.load.tilemapTiledJSON({
      key: "entrance-map",
      url: "/static/tilemap/entrance.json",
    });
    baseScenePreload(this);
  }

  create() {
    backgroundStatic(this);
    baseSceneCreate({
      selfScene: this,
      mapName: "entrance-map",
      mapBackgroundLayerName: "entrance-background",
      onMoveToTile: (tileName) => {
        tileInteraction(this, tileName);
      },
    });
  }

  update(_time, delta) {
    baseSceneUpdate(this, delta);
  }
}

export default EntranceScene;
