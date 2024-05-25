import Phaser from "phaser";
import { FLOOR_NAMES, FLOOR_TO_SCENE } from "./common";
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
    608 / zoom,
    "fifthFloor-background"
  );
  sprite.scale = 2 / zoom;
}

function tileInteraction(scene, curTileName) {
  switch (curTileName) {
    case "up":
      protocol.moveFloor(scene.socket, "6F");
      startScene(scene, "SixthFloorScene", spawnPoints.floor6F.from5F);
      break;
    case "down":
      protocol.moveFloor(scene.socket, "2F");
      startScene(scene, "SecondFloorScene", spawnPoints.floor2F.from5F);
      break;
    case "elevator":
      showElevatorPanel(scene, "5F");
      break;
    case "up2":
      protocol.moveFloor(scene.socket, "6F");
      startScene(scene, "SixthFloorScene", spawnPoints.floor6F.from5F_2);
      break;
    default:
      break;
  }
}

class FifthFloorScene extends Phaser.Scene {
  constructor() {
    super(FLOOR_TO_SCENE["5F"]);
    this.x = spawnPoints.floor5F.from2F.x;
    this.y = spawnPoints.floor5F.from2F.y;
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
