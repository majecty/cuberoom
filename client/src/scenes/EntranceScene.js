import Phaser from "phaser";
import {
  playerCreate,
  playerFollowClickUpdate,
  playerinitmove,
} from "../entity/player";
import { allCharacterImageNames } from "../entity/player/image";
import { playerCreateAnimations } from "../entity/player/animation";
import { mapCreate, mapCreateOverCharacterLayer } from "../entity/map";
import {
  mapOnPointerDown,
  mapUpdateMousePoint,
} from "../entity/map/interaction";
import { playerOnMapCreate, playerOnMapUpdate } from "../relation/playerOnMap";
import {
  listenRemovePlayerOnPlayers,
  listenRemovePlayerOnPlayer,
  FLOOR_NAMES,
  listenPlayerList,
  listenAddChat,
  listenRemoveChat,
} from "./common";

function backgroundStatic(scene) {
  scene.add.sprite(1200 / 2, 800 / 2, "entrance-background");
}

class EntranceScene extends Phaser.Scene {
  constructor() {
    super("EntranceScene");
    console.log("entrance constructor");
    window.scenes.entrance = this;
    this.map = null;
    this.player = null;
    this.cursors = null;
    this.playerOnMap = null;
    this.x = 16 * 5;
    this.y = 16 * 30;
    this.socket = window.socket;
    this.players = {};
    this.sceneName = FLOOR_NAMES.EntranceScene;

    listenRemovePlayerOnPlayers(this.socket, this.sceneName, this.players);
    listenRemovePlayerOnPlayer(
      this.socket,
      this.sceneName,
      () => this.socket.id,
      () => (this.player = null)
    );
    listenPlayerList({
      socket: this.socket,
      sceneName: this.sceneName,
      phaserScene: this,
      players: this.players,
    });
    listenAddChat(this.socket, this.sceneName, this.players);
    listenRemoveChat(this.socket, this.sceneName, this.players);
  }

  init(data) {
    if (data.x) (this.x = data.x), (this.destinationX = data.x);
    if (data.y) (this.y = data.y), (this.destinationY = data.y);
    console.log("entrance init");
  }

  preload() {
    console.log("entrance preload");
    this.load.image("entrance-background", "/img/entrance_background.png");
    this.load.image("collision-tileset", "/tilemap/simple_tile.png");
    this.load.image("interactive-tile", "/tilemap/interactive-tile.png");
    this.load.image("popup", "/img/ui-map/popup.png");

    this.load.tilemapTiledJSON({
      key: "entrance-map",
      url: "/tilemap/entrance.json",
    });
    for (const [key, file] of allCharacterImageNames(window.playerImgUrl)) {
      this.load.image(key, file);
    }
  }

  create() {
    console.log("entrance create");
    playerCreateAnimations(this);
    backgroundStatic(this);

    this.map = mapCreate(this, "entrance-map");
    this.player = playerCreate(
      this,
      this.x,
      this.y,
      window.playerName,
      "",
      this.socket.id,
      window.playerImgUrl
    ); // 소켓 연결 되면 이 부분을 지워야 함
    this.players[this.socket.id] = this.player;
    this.player = playerinitmove(this.player);

    this.socket.emit("addPlayer", {
      id: this.socket.id,
      name: window.playerName,
      imgUrl: window.playerImgUrl,
      floor: this.sceneName,
      x: this.x,
      y: this.y,
    });

    this.playerOnMap = playerOnMapCreate();
    this.physics.add.collider(this.player.phaser, this.map.collisionLayer);

    this.map = mapCreateOverCharacterLayer(this.map, "entrance-background");

    this.cameras.main.setBounds(
      0,
      0,
      this.map.phaser.widthInPixels,
      this.map.phaser.heightInPixels
    );
    this.cameras.main.startFollow(this.player.phaser, true, 0.1, 0.1);
    this.cameras.main.fadeIn(500);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on("keydown-SPACE", () => {
      if (this.cheat === true) {
        this.cheat = false;
      } else {
        this.cheat = true;
      }
    });

    this.input.on("pointerdown", (pointer) =>
      mapOnPointerDown(this.map, pointer)
    );
  }

  update(_time, _delta) {
    const pointer = this.input.activePointer;

    // player can be removed since removePlayer is called
    if (this.player == null) {
      return;
    }

    this.player = playerFollowClickUpdate(
      this.player,
      this.destinationX,
      this.destinationY,
      this
    );
    mapUpdateMousePoint(this.map, this);
    this.playerOnMap = playerOnMapUpdate(
      this.playerOnMap,
      this.player,
      this.map,
      this
    );

    if (pointer.isDown) {
      this.destinationX = this.input.activePointer.worldX;
      this.destinationY = this.input.activePointer.worldY;
    }

    this.player.nameLabel.x = this.player.phaser.x;
    this.player.chatBubble.x = this.player.phaser.x;
    this.player.nameLabel.y = this.player.phaser.y - 30;
    this.player.chatBubble.y = this.player.phaser.y - 50;

    if (
      this.destinationX &&
      this.destinationY &&
      (Math.abs(this.destinationX - this.player.phaser.x) > 20 ||
        Math.abs(this.destinationY - this.player.phaser.y) > 20)
    ) {
      this.socket.emit("movePlayer", {
        id: this.socket.id,
        floor: this.sceneName,
        direction: this.player.prevMove,
        x: this.player.phaser.x,
        y: this.player.phaser.y,
      });
    }
  }
}

export default EntranceScene;
