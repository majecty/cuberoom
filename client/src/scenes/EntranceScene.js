import Phaser from "phaser";
import { FLOOR_TO_SCENE } from "./common";
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
import ENV from "../../ENV";

function backgroundStatic(scene) {
  const sprite = scene.add.sprite(
    1200 / zoom,
    800 / zoom,
    "entrance-background"
  );
  sprite.scale = 2 / zoom;
}

function tileInteraction(scene, curTileName) {
  switch (curTileName) {
    case "up":
      // 이거 다른 경우에도 추가하기?
      protocol.moveFloor(scene.socket, "1F");
      startScene(scene, "FirstFloorScene", spawnPoints.floor1F.fromEntrance);
      break;
    case "BackToMap":
      window.location.href = "/map";
      break;
    default:
      break;
  }
}

class EntranceScene extends Phaser.Scene {
  constructor() {
    super(FLOOR_TO_SCENE.entrance);
    this.x = spawnPoints.entrance.start.x;
    this.y = spawnPoints.entrance.start.y;

    baseSceneConstructor(this, FLOOR_TO_SCENE.entrance);
  }

  init(data) {
    baseSceneInit(this, data);
  }

  preload() {
    this.load.image(
      "entrance-background",
      "/static/img/tilesetimages/entrance_background.png"
    );
    this.load.image("collision-tileset", "/static/tilemap/simple_tile.png");
    this.load.image("interactive-tile", "/static/tilemap/interactive-tile.png");
    this.load.image("popup", "/static/img/ui-map/popup.png");

    this.load.tilemapTiledJSON({
      key: "entrance-map",
      url: `/static/tilemap/entrance.json?v=${ENV.version}`,
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
