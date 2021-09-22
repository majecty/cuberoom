import Phaser from "phaser";
import { playerCreate, playerFollowClickUpdate, playerinitmove } from "../entity/player";
import { allCharacterImageNames } from "../entity/player/image";
import { playerCreateAnimations } from "../entity/player/animation";
import { mapCreate, mapCreateOverCharacterLayer } from "../entity/map";
import {
  mapOnPointerDown,
  mapUpdateMousePoint,
} from "../entity/map/interaction";
import { playerOnMapCreate, playerOnMapUpdate } from "../relation/playerOnMap";
import ENV from '../../ENV';
import { listenRemovePlayer } from "./common"

function backgroundStatic(scene) {
  scene.add.sprite(800 / 2, 608 / 2, "firstFloor-background");
}

class FirstFloorScene extends Phaser.Scene {
  constructor() {
    super('FirstFloorScene');
    console.log("firstFloor constructor");
    window.scenes.firstFloor = this;
    this.map = null;
    this.player = null;
    this.cursors = null;
    this.playerOnMap = null;
    this.x = 16 * 5;
    this.y = 16 * 31;


    this.socket = window.socket;
    this.players = {};

    listenRemovePlayer(this.socket, "entrance", this.players);

    this.socket.on('playerList', (data) => {
      for (const [id, player] of Object.entries(data)) {

        if (player.floor !== '1F') return;

        const directions = ['left', 'right', 'up', 'down'];
        for (const direction of directions) {
          for (let i = 1; i < 5; i += 1) {
            if (!this.textures.exists(`${player.id}-${direction}-${i}`)) this.load.image(`${player.id}-${direction}-${i}`, `${ENV.URL_STATIC}${player.imgUrl}${direction}-${i}.png`);
          }
        }
        this.load.once('complete', () => {

        if (!this.players[id] || !this.players[id].phaser.scene) {
          this.players[id] = playerCreate(this, player.x, player.y, player.name, player.chat, player.id);
        } else {
          if (this.socket.id !== id) {
            if (this.players[id].phaser.depth === 0) {
              this.players[id].phaser.setDepth(1);
              this.players[id].nameLabel.setDepth(1);
              this.players[id].chatBubble.setDepth(1);
            }
            this.players[id].phaser.x = player.x;
            this.players[id].phaser.y = player.y;
            this.players[id].nameLabel.x = player.x;
            this.players[id].nameLabel.y = player.y - 30;
            this.players[id].chatBubble.x = player.x;
            this.players[id].chatBubble.y = player.y - 50;
            this.players[id].phaser.setTexture(`${player.id}-${player.direction}-${2}`);
          }
        }
        }, this);
        this.load.start();
      }
    });

    this.socket.on('addChat', (data) => {
      if (data.floor === '1F' && this.players[data.id]) {
        const formattedChat = data.chat.match(/.{1,12}/g).join('\n');
        this.players[data.id].chatBubble.setText(formattedChat);
        this.players[data.id].chatBubble.setPadding(4);
      }
    });

    this.socket.on('removeChat', (data) => {
      if (data.floor === '1F' && this.players[data.id]) {
        this.players[data.id].chatBubble.setText('');
        this.players[data.id].chatBubble.setPadding(0);
      }
    });
  }

  init(data) {
    console.log("firstFloor init");
    if (data.x) this.x = data.x, this.destinationX = data.x;
    if (data.y) this.y = data.y, this.destinationY = data.y;
  }

  preload() {
    console.log("firstFloor preload");
    this.load.image("firstFloor-background", "/img/1f_background.png");
    this.load.image("collision-tileset", "/tilemap/simple_tile.png");
    this.load.image("interactive-tile", "/tilemap/interactive-tile.png");
    this.load.image("popup", "/img/ui-map/popup.png");
    this.load.image("welcome1", "/img/ui-map/welcome1.png");
    this.load.image("welcome2", "/img/ui-map/welcome2.png");
    this.load.image("welcome3", "/img/ui-map/welcome3.png");
    this.load.tilemapTiledJSON({
      key: "firstFloor-map",
      url: "/tilemap/first-floor.json",
    });
    for (const [key, file] of allCharacterImageNames(window.playerImgUrl)) {
      this.load.image(key, file);
    }
  }

  create() {
    console.log("firstFloor create");
    playerCreateAnimations(this);
    backgroundStatic(this);

    this.map = mapCreate(this, 'firstFloor-map');

    // 잔상 관련 주석 처리
    // for (const [id, player] of Object.entries(this.players)) {
    //   this.players[id] = playerCreate(this, player.phaser.x, player.phaser.y, player.nameLabel._text, player.chatBubble._text, player.id);
    // }

    this.player = playerCreate(this, this.x, this.y, window.playerName, '', this.socket.id, window.playerImgUrl); // 소켓 연결 되면 이 부분을 지워야 함
    this.players[this.socket.id] = this.player;
    this.player = playerinitmove(this.player);

    this.socket.emit('addPlayer', {
      id: this.socket.id,
      name: window.playerName,
      imgUrl: window.playerImgUrl,
      floor: '1F',
      x: this.x,
      y: this.y,
    });

    this.playerOnMap = playerOnMapCreate();
    this.physics.add.collider(this.player.phaser, this.map.collisionLayer);
    // this.physics.add.collider(this.player.nameLabel, this.map.collisionLayer);
    // this.physics.add.collider(this.player.chatBubble, this.map.collisionLayer);

    this.map = mapCreateOverCharacterLayer(this.map, 'firstFloor-background');

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
    // const pointer = this.input.activePointer;
    // if(pointer.isDown){
    //   this.player = playerMouseUpdate(this.player,this.input.activePointer, this);
    //   mapUpdateMousePoint(this.map, this);
    //   this.playerOnMap = playerOnMapUpdate(
    //     this.playerOnMap,
    //     this.player,
    //     this.map,
    //     this
    //   );
    // }else{
    //   this.player = playerUpdate(this.player,this.cursors, this);
    //   mapUpdateMousePoint(this.map, this);
    //   this.playerOnMap = playerOnMapUpdate(
    //     this.playerOnMap,
    //     this.player,
    //     this.map,
    //     this
    //   );
    // }

    const pointer = this.input.activePointer;
    this.player = playerFollowClickUpdate(this.player, this.destinationX, this.destinationY, this);
    mapUpdateMousePoint(this.map, this);
    this.playerOnMap = playerOnMapUpdate(
      this.playerOnMap,
      this.player,
      this.map,
      this
    );

    if(pointer.isDown){
      this.destinationX = this.input.activePointer.worldX;
      this.destinationY = this.input.activePointer.worldY;

    }

    this.player.nameLabel.x = this.player.phaser.x;
    this.player.chatBubble.x = this.player.phaser.x;
    this.player.nameLabel.y = this.player.phaser.y - 30;
    this.player.chatBubble.y = this.player.phaser.y - 50;

    if (
      this.destinationX && this.destinationY && (
        Math.abs(this.destinationX - this.player.phaser.x) > 20
        || Math.abs(this.destinationY - this.player.phaser.y) > 20
      )
    ) {
      this.socket.emit('movePlayer', {
        id: this.socket.id,
        floor: '1F',
        direction: this.player.prevMove,
        x: this.player.phaser.x,
        y: this.player.phaser.y,
      });
    }
  }
}

export default FirstFloorScene;
