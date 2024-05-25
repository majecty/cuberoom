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
import { popupCreate } from "../entity/popup";
import { popupPos } from "../entity/works";
import { spawnPoints } from "./common/constants";
import { protocol } from "../network/protocol";
import { zoom } from "../constant";

function backgroundStatic(scene) {
  const sprite = scene.add.sprite(
    800 / zoom,
    1220 / zoom,
    "firstBasement-background"
  );
  sprite.scale = 2 / zoom;
}

function tileInteraction(scene, curTileName) {
  switch (curTileName) {
    case "up":
      protocol.moveFloor(scene.socket, "1F");
      startScene(scene, "FirstFloorScene", spawnPoints.floor1F.fromB1);
      break;
    case "down":
      protocol.moveFloor(scene.socket, "B2");
      startScene(scene, "SecondBasementScene", spawnPoints.floorB2.fromB1);
      break;
    case "elevator":
      showElevatorPanel(scene, "B1");
      break;
    case "down2":
      protocol.moveFloor(scene.socket, "B2");
      startScene(scene, "SecondBasementScene", spawnPoints.floorB2.fromB1_2);
      break;
    case "down3":
      protocol.moveFloor(scene.socket, "B2");
      startScene(scene, "SecondBasementScene", spawnPoints.floorB2.fromB1_3);
      break;
    case "work-1":
      if (document.getElementById("work-1") == null) {
        popupCreate(scene, popupPos[1], 1);
      }
      break;

    case "work-2":
      if (document.getElementById("work-2") == null) {
        popupCreate(scene, popupPos[2], 2);
      }
      break;
    case "work-3":
      if (document.getElementById("work-3") == null) {
        popupCreate(scene, popupPos[3], 3);
      }
      break;
    case "work-4":
      if (document.getElementById("work-4") == null) {
        popupCreate(scene, popupPos[4], 4);
      }
      break;
    default:
      break;
  }
}

class FirstBasementScene extends Phaser.Scene {
  constructor() {
    super(FLOOR_TO_SCENE.B1);
    this.x = spawnPoints.floorB1.from1F.x;
    this.y = spawnPoints.floorB1.from1F.y;
    baseSceneConstructor(this, FLOOR_TO_SCENE.B1);
  }

  init(data) {
    baseSceneInit(this, data);
  }

  preload() {
    this.load.image(
      "firstBasement-background",
      "/static/img/b1_background.png"
    );
    this.load.image("collision-tileset", "/static/tilemap/simple_tile.png");
    this.load.image("interactive-tile", "/static/tilemap/interactive-tile.png");
    this.load.image("popup", "/static/img/ui-map/popup.png");
    this.load.tilemapTiledJSON({
      key: "firstBasement-map",
      url: "/static/tilemap/first-basement.json",
    });
    baseScenePreload(this);
  }

  create() {
    backgroundStatic(this);
    baseSceneCreate({
      selfScene: this,
      mapName: "firstBasement-map",
      mapBackgroundLayerName: "firstBasement-background",
      onMoveToTile: (tileName) => {
        tileInteraction(this, tileName);
      },
    });
  }

  update(_time, delta) {
    baseSceneUpdate(this, delta);
  }
}

export default FirstBasementScene;
