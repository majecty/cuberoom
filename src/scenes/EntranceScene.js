import Phaser from "phaser";
import { playerCreate, playerUpdate, playerMouseUpdate, playerFollowClickUpdate, playerinitmove } from "../entity/player";
import { allCharacterImageNames } from "../entity/player/image";
import { playerCreateAnimations } from "../entity/player/animation";
import { mapCreate, mapCreateOverCharacterLayer } from "../entity/map";
import {
  mapOnPointerDown,
  mapUpdateMousePoint,
} from "../entity/map/interaction";
import { playerOnMapCreate, playerOnMapUpdate } from "../relation/playerOnMap";

function backgroundStatic(scene) {
  scene.add.sprite(1200 / 2, 800 / 2, "entrance-background");
}

class EntranceScene extends Phaser.Scene {
  constructor() {
    super('EntranceScene');
    this.map = null;
    this.player = null;
    this.cursors = null;
    this.playerOnMap = null;
    this.x = 16 * 6;
    this.y = 16 * 34;

    this.socket = window.socket;
    this.players = {};

    this.socket.on('removePlayer', (data) => {
      if (this.players[data.id]) {
        this.players[data.id].phaser.destroy(true);
        this.players[data.id].nameLabel.destroy(true);
        this.players[data.id].chatBubble.destroy(true);
        delete this.players[data.id];
      }
    });

    this.socket.on('playerList', (data) => {
      for (const [id, player] of Object.entries(data)) {
        if (player.floor !== 'entrance') return;
        if (!this.players[id]) {
          const directions = ['left', 'right', 'up', 'down'];
          for (const direction of directions) {
            for (let i = 1; i < 5; i += 1) {
              // this.load.image(`${player.id}-${direction}-${i}`, `http://127.0.0.1:3000/static${player.imgUrl}${direction}-${i}.png`);
              // this.load.image(`${player.id}-${direction}-${i}`, `http://localhost:3000/static${player.imgUrl}${direction}-${i}.png`);
              this.load.image(`${player.id}-${direction}-${i}`, `http://cuberoom.net${player.imgUrl}${direction}-${i}.png`);
            }
          }
          this.load.once('complete', () => {
            if (!this.players[id]) this.players[id] = playerCreate(this, player.x, player.y, player.name, player.chat, player.id);
          }, this);
          this.load.start();
        } else {
          // if (player.floor === 'entrance' && this.socket.id !== id) {
          if (this.socket.id !== id) {
            this.players[id].phaser.x = player.x;
            this.players[id].phaser.y = player.y;
            this.players[id].nameLabel.x = player.x;
            this.players[id].nameLabel.y = player.y - 30;
            this.players[id].chatBubble.x = player.x;
            this.players[id].chatBubble.y = player.y - 45;
            // this.players[id].phaser.anims.play(`player-${player.direction}`, true);
            // this.players[id].phaser.anims.play(`player-${player.direction}-stop`, true);
            // 이 phaser에게는 scene이 없다...!
            if (!this.players[id].phaser.scene) this.players[id].phaser.scene = this;
            this.players[id].phaser.setTexture(`${player.id}-${player.direction}-${2}`); // 이거 playerCreate할 때 참고!!!!
          }
        }
      }
    });

    this.socket.on('addChat', (data) => {
      if (data.floor === 'entrance' && this.players[data.id]) this.players[data.id].chatBubble.setText(data.chat);
    });

    this.socket.on('removeChat', (data) => {
      if (data.floor === 'entrance' && this.players[data.id]) this.players[data.id].chatBubble.setText('');
    });
  }

  init(data) {
    if (data.x) this.x = data.x, this.destinationX = data.x;
    if (data.y) this.y = data.y, this.destinationY = data.y;
  }

  preload() {
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
    playerCreateAnimations(this);
    backgroundStatic(this);

    this.map = mapCreate(this, 'entrance-map');
    this.player = playerCreate(this, this.x, this.y, window.playerName, '', this.socket.id, window.playerImgUrl); // 소켓 연결 되면 이 부분을 지워야 함
    this.players[this.socket.id] = this.player;
    this.player = playerinitmove(this.player);

    this.socket.emit('addPlayer', {
      id: this.socket.id,
      name: window.playerName,
      imgUrl: window.playerImgUrl,
      floor: 'entrance',
      x: this.x,
      y: this.y,
    });

    this.playerOnMap = playerOnMapCreate();
    this.physics.add.collider(this.player.phaser, this.map.collisionLayer);
    // this.physics.add.collider(this.player.nameLabel, this.map.collisionLayer);
    // this.physics.add.collider(this.player.chatBubble, this.map.collisionLayer);

    this.map = mapCreateOverCharacterLayer(this.map, 'entrance-background');

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
    // if (pointer.isDown) {
    //   this.player = playerMouseUpdate(this.player,this.input.activePointer, this);
    //   mapUpdateMousePoint(this.map, this);
    //   this.playerOnMap = playerOnMapUpdate(
    //     this.playerOnMap,
    //     this.player,
    //     this.map,
    //     this
    //   );
    // } else {
    //   this.player = playerUpdate(this.player, this.cursors, this);
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
//       console.log("clicked x: "+this.destinationX+" clicked y: "+this.destinationY);
    }


    this.player.nameLabel.x = this.player.phaser.x;
    this.player.chatBubble.x = this.player.phaser.x;
    this.player.nameLabel.y = this.player.phaser.y - 30;
    this.player.chatBubble.y = this.player.phaser.y - 45;


    this.socket.emit('movePlayer', {
      id: this.socket.id,
      floor: 'entrance',
      direction: this.player.prevMove,
      x: this.player.phaser.x,
      y: this.player.phaser.y,
    });
  }
}

export default EntranceScene;
