import Phaser from "phaser";
import { FLOOR_NAMES, FLOOR_TO_SCENE } from "./common";
import {
  baseSceneConstructor,
  baseSceneInit,
  baseScenePreload,
  baseSceneCreate,
  baseSceneUpdate,
} from "./common/baseScene";
import { zoom } from "../constant";
import { playerUpdateInitialPos } from "../entity/player";
import { protocol } from "../network/protocolOnline";
import startScene from "../entity/map/startScene";

function backgroundStatic(scene) {
  const sprite = scene.add.sprite(
    600 / zoom,
    400 / zoom,
    "busanexternal-background"
  );
  sprite.scale = 2 / zoom;
}

function tileInteraction(scene, curTileName) {
  console.log("curTileName", curTileName);
  switch (curTileName) {
    case "door1":
      console.log("Move on door1");
      protocol.moveFloor(scene.socket, FLOOR_NAMES.Busan1FScene);
      startScene(scene, FLOOR_TO_SCENE.Busan1F, {
        spawnPointName: "spawnExternal1"
      });
      break;
    case "door2":
      console.log("Move on door2");
      protocol.moveFloor(scene.socket, FLOOR_NAMES.Busan1FScene);
      startScene(scene, FLOOR_TO_SCENE.Busan1F, { spawnPointName: "spawnExternal2" });
      break;
    default:
      break;
  }
}

class BusanExternalScene extends Phaser.Scene {
  constructor() {
    super(FLOOR_TO_SCENE.BusanExternal);
    this.x = 0;
    this.y = 0;
    baseSceneConstructor(this, FLOOR_TO_SCENE.BusanExternal);
  }

  init(data) {
    baseSceneInit(this, data);

    if (data.spawnPointName == null) {
      return;
    }

    const availableSpawnPoints = ["spawn1F1", "spawn1F2"];
    if (!availableSpawnPoints.includes(data.spawnPointName)) {
      console.log("Invalid spawn point name " + data.spawnPointName);
      return;
    }
    this.spawnPointName = data.spawnPointName;
  }

  preload() {
    this.load.image("busanexternal-background", "/static/img/tilesetimages/busanExternal.png");
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
      onMapCreated: () => {
        if (this.spawnPointName) {
          console.log("spawn point name", this.spawnPointName);
          this.x = this.map.objects[this.spawnPointName].x * 2 / zoom;
          this.y = this.map.objects[this.spawnPointName].y * 2 / zoom;
        } else if (this.x === 0 && this.y === 0) {
          console.log("spawn point name not found and no initial position");
          this.x = this.map.objects.spawnPoint.x * 2 / zoom;
          this.y = this.map.objects.spawnPoint.y * 2 / zoom;
        }
      },
    });

  }

  update(_time, delta) {
    baseSceneUpdate(this, delta);
  }
}

export default BusanExternalScene;
