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
import { protocol } from "../network/protocol";
import startScene from "../entity/map/startScene";

function backgroundStatic(scene) {
  const sprite = scene.add.sprite(
    336 / zoom,
    744 / zoom,
    "busan1F-background"
  );
  sprite.scale = 2 / zoom;
}

function tileInteraction(scene, curTileName) {
  console.log("curTileName", curTileName);
  switch (curTileName) {
    case "toExternal1":
      protocol.moveFloor(scene.socket, FLOOR_NAMES.Busan1FScene);
      startScene(scene, FLOOR_TO_SCENE.BusanExternal, {
        spawnPointName: "spawn1F1",
      });
      break;
    case "toExternal2":
      protocol.moveFloor(scene.socket, FLOOR_NAMES.Busan1FScene);
      startScene(scene, FLOOR_TO_SCENE.BusanExternal, {
        spawnPointName: "spawn1F2",
      });
      break;
    case "toTop":
      protocol.moveFloor(scene.socket, FLOOR_NAMES.BusanTopScene);
      startScene(scene, FLOOR_TO_SCENE.BusanTop, {
        spawnPointName: "spawnPoint",
      });
      break;
    default:
      break;
  }
}

class Busan1FScene extends Phaser.Scene {
  constructor() {
    super(FLOOR_TO_SCENE.Busan1F);
    this.x = 0;
    this.y = 0;
    baseSceneConstructor(this, FLOOR_TO_SCENE.Busan1F);
  }

  init(data) {
    baseSceneInit(this, data);
    const availableSpawnPoints = [
      "spawnExternal1",
      "spawnExternal2",
      "spawnTop",
    ];
    if (!availableSpawnPoints.includes(data.spawnPointName)) {
      console.error("Invalid spawn point name " + data.spawnPointName);
      return;
    }
    this.spawnPointName = data.spawnPointName;
  }

  preload() {
    this.load.image("busan1F-background", "/static/img/tilesetimages/busan1F.png");
    this.load.image("collision-tileset", "/static/tilemap/simple_tile.png");
    this.load.image("interactive-tile", "/static/tilemap/busan-interactive.png");
    this.load.tilemapTiledJSON({
      key: "busan1f-map",
      url: "/static/tilemap/busan1F.json",
    });
    baseScenePreload(this);
  }

  create() {
    backgroundStatic(this);
    baseSceneCreate({
      selfScene: this,
      mapName: "busan1f-map",
      mapBackgroundLayerName: "busan1F-background",
      onMoveToTile: (tileName) => {
        tileInteraction(this, tileName);
      },
      onMapCreated: () => {
        if (this.spawnPointName) {
          console.log("spawn point name", this.spawnPointName);
          const { x, y } = this.map.objects[this.spawnPointName];
          this.x = x * 2 / zoom;
          this.y = y * 2 / zoom;
        } else if (this.x === 0 && this.y === 0) {
          console.log("spawn point name not found and no initial position");
          const { x, y } = this.map.objects.spawnExternal1;
          this.x = x * 2 / zoom;
          this.y = y * 2 / zoom;
        }
      },
    });
  }

  update(_time, delta) {
    baseSceneUpdate(this, delta);
  }
}

export default Busan1FScene;
