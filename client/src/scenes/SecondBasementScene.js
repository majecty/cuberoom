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
import { popupCreate } from "../entity/popup";
import { popupPos } from "../entity/works";

function backgroundStatic(scene) {
  scene.add.sprite(800 / 2, 736 / 2, "secondBasement-background");
}

function tileInteraction(scene, curTileName) {
  switch (curTileName) {
    case "up":
      scene.socket.emit("moveFloor", {
        id: scene.socket.id,
        floor: "B1",
      });
      startScene(scene, "FirstBasementScene", { x: 16 * 6, y: 16 * 32 });
      break;
    case "elevator":
      showElevatorPanel(scene, "B2");
      break;
    case "up3":
      scene.socket.emit("moveFloor", {
        id: scene.socket.id,
        floor: "B1",
      });
      startScene(scene, "FirstBasementScene", { x: 16 * 3, y: 16 * 55 });
      break;
    case "work-5":
      if (document.getElementById("work-5") == null) {
        popupCreate(scene, popupPos[5], 5);
      }
      break;
    case "work-6":
      if (document.getElementById("work-6") == null) {
        popupCreate(scene, popupPos[6], 6);
      }
      break;
    case "work-7":
      if (document.getElementById("work-7") == null) {
        popupCreate(scene, popupPos[7], 7);
      }
      break;
    case "work-8":
      if (document.getElementById("work-8") == null) {
        popupCreate(scene, popupPos[8], 8);
      }
      break;
    default:
      break;
  }
}

class SecondBasementScene extends Phaser.Scene {
  constructor() {
    super("SecondBasementScene");
    this.x = 16 * 3;
    this.y = 16 * 32;
    baseSceneConstructor(this, FLOOR_NAMES.SecondBasementScene);
  }

  init(data) {
    baseSceneInit(this, data);
  }

  preload() {
    this.load.image("secondBasement-background", "/static/img/b2_background.png");
    this.load.image("collision-tileset", "/static/tilemap/simple_tile.png");
    this.load.image("interactive-tile", "/static/tilemap/interactive-tile.png");
    this.load.image("b2-cylinder", "/static/tilemap/b2_cylinder.png");
    this.load.image("b2-cube", "/static/tilemap/b2_cube.png");
    this.load.image("b2-pink", "/static/tilemap/b2_pink.png");
    this.load.image("popup", "/static/img/ui-map/popup.png");
    this.load.tilemapTiledJSON({
      key: "secondBasement-map",
      url: "/static/tilemap/second-basement.json",
    });
    baseScenePreload(this);
  }

  create() {
    backgroundStatic(this);
    baseSceneCreate({
      selfScene: this,
      mapName: "secondBasement-map",
      mapBackgroundLayerName: "secondBasement-background",
      onMoveToTile: (tileName) => {
        tileInteraction(this, tileName);
      },
    });
  }

  update(_time, delta) {
    baseSceneUpdate(this, delta);
  }
}

export default SecondBasementScene;
