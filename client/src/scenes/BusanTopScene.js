import Phaser from "phaser";
import { zoom } from "../constant";
import startScene from "../entity/map/startScene";
import { playerUpdateInitialPos } from "../entity/player";
import { protocol } from "../network/protocolOnline";
import { FLOOR_NAMES, FLOOR_TO_SCENE } from "./common";
import { baseSceneConstructor, baseSceneCreate, baseSceneInit, baseScenePreload, baseSceneUpdate } from "./common/baseScene";
import { popupCreateFromTilemapPosition, popupDestroy } from "../entity/popup";

function backgroundStatic(scene) {
  const sprite = scene.add.sprite(
    528 / zoom,
    616 / zoom,
    "busanTop-background"
  );
  sprite.scale = 2 / zoom;
}

function tileInteraction(scene, curTileName, prevTileName) {
  if (prevTileName !== curTileName) {
    if (["green", "blue", "freetime"].includes(prevTileName)) {
      console.log("destroy popup");
      popupDestroy();
    }
  }
  switch (curTileName) {
    case "moveTo1F":
      protocol.moveFloor(scene.socket, FLOOR_NAMES.Busan1FScene);
      startScene(scene, FLOOR_TO_SCENE.Busan1F, {
        spawnPointName: "spawnTop",
      });
      break;
    case "green":
      if (document.getElementById("green") == null) {
        const { x, y } = scene.map.objects["green"];
        popupCreateFromTilemapPosition(scene, { x, y }, 12);
      }
      break;
    case "blue":
      if (document.getElementById("blue") == null) {
        const { x, y } = scene.map.objects["blue"];
        popupCreateFromTilemapPosition(scene, { x, y }, 13);
      }
      break;
    case "freetime":
      if (document.getElementById("freetime") == null) {
        const { x, y } = scene.map.objects["freetime"];
        popupCreateFromTilemapPosition(scene, { x, y }, 14);
      }
      break;
    default:
      break;
  }
}

class BusanTopScene extends Phaser.Scene {
  constructor() {
    super(FLOOR_TO_SCENE.BusanTop);
    this.x = 0;
    this.y = 0;
    baseSceneConstructor(this, FLOOR_TO_SCENE.BusanTop);
  }

  init(data) {
    baseSceneInit(this, data);
    const availableSpawnPoints = [
      "spawnPoint"
    ];
    if (!availableSpawnPoints.includes(data.spawnPointName)) {
      console.error("Invalid spawn point name " + data.spawnPointName);
      return;
    }
    this.spawnPointName = data.spawnPointName;
  }

  preload() {
    this.load.image('busanTop-background', '/static/img/tilesetimages/busanTop.png?v=1');
    this.load.image("collision-tileset", "/static/tilemap/simple_tile.png");
    this.load.image("interactive-tile", "/static/tilemap/busan-interactive.png");
    this.load.image("popup", "/static/img/ui-map/popup.png");
    this.load.tilemapTiledJSON({
      key: "busanTop-map",
      url: "/static/tilemap/busanTop.json?v=1",
    });
    baseScenePreload(this);
  }

  create() {
    backgroundStatic(this);
    baseSceneCreate({
      selfScene: this,
      mapName: "busanTop-map",
      mapBackgroundLayerName: "busanTop-background",
      onMoveToTile: (tileName, prevTileName) => {
        tileInteraction(this, tileName, prevTileName);
      },
      onMapCreated: () => {
        if (this.spawnPointName) {
          console.log("spawn point name", this.spawnPointName);
          const { x, y } = this.map.objects[this.spawnPointName];
          this.x = x * 2 / zoom;
          this.y = y * 2 / zoom;
        } else if (this.x === 0 && this.y === 0) {
          console.log("spawn point name not found and no initial position");
          this.x = this.map.objects.spawnPoint.x * 2 / zoom;
          this.y = this.map.objects.spawnPoint.y * 2 / zoom;
        }
      }
    });
  }

  update(_time, delta) {
    baseSceneUpdate(this, delta);
  }
}

export default BusanTopScene;
