import Phaser from "phaser";
import { zoom } from "../constant";
import startScene from "../entity/map/startScene";
import { playerUpdateInitialPos } from "../entity/player";
import { protocol } from "../network/protocolOnline";
import { FLOOR_NAMES, FLOOR_TO_SCENE } from "./common";
import { baseSceneConstructor, baseSceneCreate, baseSceneInit, baseScenePreload, baseSceneUpdate } from "./common/baseScene";

function backgroundStatic(scene) {
  const sprite = scene.add.sprite(
    320 / zoom,
    480 / zoom,
    "busanTop-background"
  );
  sprite.scale = 2 / zoom;
}

function tileInteraction(scene, curTileName) {
  switch (curTileName) {
    case "moveTo1F":
      protocol.moveFloor(scene.socket, FLOOR_NAMES.Busan1FScene);
      startScene(scene, FLOOR_TO_SCENE.Busan1F, {
        spawnPointName: "spawnTop",
      });
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
    this.load.image('busanTop-background', '/static/img/tilesetimages/busanTop.png');
    this.load.image("collision-tileset", "/static/tilemap/simple_tile.png");
    this.load.image("interactive-tile", "/static/tilemap/busan-interactive.png");
    this.load.tilemapTiledJSON({
      key: "busanTop-map",
      url: "/static/tilemap/busanTop.json",
    });
    baseScenePreload(this);
  }

  create() {
    backgroundStatic(this);
    baseSceneCreate({
      selfScene: this,
      mapName: "busanTop-map",
      mapBackgroundLayerName: "busanTop-background",
      onMoveToTile: (tileName) => {
        tileInteraction(this, tileName);
      },
    });

    console.log("this.map.objects");
    console.log(this.map.objects);

    this.x = (this.map.objects.spawnPoint.x * 2) / zoom;
    this.y = (this.map.objects.spawnPoint.y * 2) / zoom;
    playerUpdateInitialPos(this.player, this.x, this.y);
  }

  update(_time, delta) {
    baseSceneUpdate(this, delta);
  }
}

export default BusanTopScene;
