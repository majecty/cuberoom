<script>
  import Phaser from 'phaser';
  import EntranceScene from '../scenes/EntranceScene';
  import FirstFloorScene from '../scenes/FirstFloorScene';
  import FirstBasementScene from '../scenes/FirstBasementScene';
  import SecondFloorScene from '../scenes/SecondFloorScene';
  import FifthFloorScene from '../scenes/FifthFloorScene';
  import SixthFloorScene from '../scenes/SixthFloorScene';
  import SeventhFloorScene from '../scenes/SeventhFloorScene';
  import EighthFloorScene from '../scenes/EighthFloorScene';
  import SecondBasementScene from '../scenes/SecondBasementScene';
  import { io } from 'socket.io-client';
  import ENV from '../../ENV';
  import { playersEntries } from "../scenes/common/players";
  import { saveCharacterSelection, saveIdAndPassword, loadFloorAndMovement, isSavePrepared } from "./storage";
  import { protocol } from "../network/protocol"
  import names from '../entity/names';
  import { getRandomInt, uuidv4, randomPassword } from "../util/random";
  import { readDebug, urlParam } from "../common/urlParam";
  import { ifDebug } from "../common/debug";
  import { onMount } from 'svelte';
  import { zoom } from "../constant";

  const requiredKeys = ["id", "password", "playerImgUrl", "playerName"];
  const savePrepared = isSavePrepared();

  if (!savePrepared) {
    function generateDebugData() {
      const uniqueId = uuidv4();
      const password = randomPassword();
      saveIdAndPassword(uniqueId, password);
      let skin = getRandomInt(1, 4);
      let faceS= getRandomInt(1, 13);
      let hairC = getRandomInt(1, 5);
      let hairS = getRandomInt(1, 13);
      let cloth = getRandomInt(1, 13);
      const imgUrl = `/static/character-resource/skin${skin}_hairC${hairC}_cloth${cloth}_hairS${hairS}_faceS${faceS}/`;
      const name = names[Math.floor(Math.random() * names.length)];
      saveCharacterSelection(imgUrl, name);
    }
    ifDebug(generateDebugData, () => {
      window.location.pathname = "/"
    });
  }

  window.addEventListener("resize", () => {
    if (window.game == null) {
      return;
    }
    setTimeout(() => {
      window.game.scale.resize(window.innerWidth / zoom, window.innerHeight / zoom);
    }, 50);
  }, false);

  if (window.visualViewport != null) {
    window.visualViewport.addEventListener('resize', () => {
      if (window.game == null) {
        return;
      }
      if (window.scene == null) {
        return;
      }
      window.scene.cameras.main.fadeOut(0);
      setTimeout(() => {
        window.scene.cameras.main.fadeIn(500);
        ifDebug(() => {
          if (window.socket.disconnected) {
            return;
          }
          window.socket.emit("debugMessage", {
            width: window.visualViewport.width / zoom,
            height: window.visualViewport.height / zoom
          });
        });
        window.game.scale.resize(window.visualViewport.width / zoom, window.visualViewport.height / zoom);
      }, 100);
    });
  }

  function initializeSocket() {
    const socket = ENV.ENVIRONMENT === 'production'
      ? io.connect(ENV.GET_SOCKETIO_URL(), { transports: ['websocket'] })
      : io.connect(ENV.GET_SOCKETIO_URL());

    window.socket = socket;

    socket.on('disconnect', (reason) => {
      console.log("disconnected", reason);
      if (reason === "io server disconnect") {
        console.log("manual reconnect");
        socket.connect();
      }
    });

    socket.on('connect_error', (err) => {
      console.error(err);
    });

    socket.on("needLogin", () => {
      if (window.scene != null) {
        window.scene.login();
      }
    });

    window.socket.on('debugMessage', (data) => {
      console.log("debugMessage", data);
    });

    window.socket.on("connect", () => {
      console.log("connected");
      if (window.game == null) {
        const config = {
          type: Phaser.AUTO,
          zoom,
          parent: "phaser-parent",
          width: window.innerWidth / zoom,
          height: window.innerHeight / zoom,

          pixelArt: true,
          physics: {
            default: "arcade",
            arcade: {
              gravity: { y: 0 },
            },
          },
          scene: createSceneList(),
        };

        const game = new Phaser.Game(config);
        window.game = game;
      } else {
        if (window.scene != null) {
          console.log("send relogin");
          window.scene.login();
        }
      }
    });
  }

  let chat = '';
  let chatTimer;

  function addChat() {
    clearTimeout(chatTimer);
    protocol.addChat(socket, chat);
    chat = '';
    chatTimer = setTimeout(() => protocol.removeChat(socket), 3000); // 3초 뒤에 말풍선 삭제
  }

  function getSceneConstructor(floor) {
    switch (floor) {
      case "entrance":
        return EntranceScene;
      case "1F":
        return FirstFloorScene;
      case "2F":
        return SecondFloorScene;
      case "5F":
        return FifthFloorScene;
      case "6F":
        return SixthFloorScene;
      case "7F":
        return SeventhFloorScene;
      case "8F":
        return EighthFloorScene;
      case "B1":
        return FirstBasementScene;
      case "B2":
        return SecondBasementScene;
    }
    return null;
  }

  function moveThisFirst(firstScene, allScenes) {
    const others = [];

    for (const otherScene of allScenes) {
      if (firstScene !== otherScene) {
        others.push(otherScene);
      }
    }
    others.unshift(firstScene);
    return others;
  }

  // 저장된 씬부터 시작
  function createSceneList() {
    let { floor } = loadFloorAndMovement();
    const floorFromUrl = urlParam.readFloor();
    if (floorFromUrl != null) {
      floor = floorFromUrl;
    }
    const firstSceneConstructor = getSceneConstructor(floor);
    const allScenes = [
      EntranceScene, FirstFloorScene, FirstBasementScene,
      SecondFloorScene, FifthFloorScene, SixthFloorScene,
      SeventhFloorScene, EighthFloorScene, SecondBasementScene
    ];
    if (firstSceneConstructor == null) {
      console.log("scene list", allScenes);
      return allScenes;
    } else {
      const scenes = moveThisFirst(firstSceneConstructor, allScenes);
      console.log("scene list", scenes);
      return scenes;
    }
   }

  window.scenes = {};
  onMount(() => {
    console.log("mounted");
    initializeSocket();
  });

  let key;
  let keyCode;

  function handleKeydown (event){
    key = event.key;
    keyCode = event.keyCode;
    if(keyCode !=32) return;
    event.preventDefault();
    chat += String.fromCharCode(event.keyCode);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === "z") {
      printAllPlayers();
    }

    if (e.key === "x") {
      getPlayersFromServer();
    }
  });

  function printAllPlayers() {
    for (const [sceneName, scene] of Object.entries(window.scenes)) {
      console.log("Scene", sceneName);
      const player = scene.player;
      if (player != null) {
        console.log("player:", player.nameLabel.text,
          player.id.substring(0, 5),
          player.phaser.x, player.phaser.y);
      } else {
        console.log("player null");
      }

      const players = scene.players;
      if (players != null) {
        for (const [id, otherPlayer] of playersEntries(players)) {
          console.log("other player", otherPlayer.nameLabel.text,
            id.substring(0, 5),
            otherPlayer.phaser.x, otherPlayer.phaser.y
          );
        }
      } else {
        console.log("players null");
      }
    }
  }

  function getPlayersFromServer() {
    protocol.getPlayers(window.socket);
  }
</script>

<form
  id="chat"
  on:mousedown={() => window.game.input.enabled = false}
  on:mouseup={() => window.game.input.enabled = true}
  on:touchstart={() => window.game.input.enabled = false}
  on:touchend={() => window.game.input.enabled = true}
  on:submit|preventDefault={addChat}
>
  <input maxlength="60" placeholder="엔터 키를 누르면 대화할 수 있습니다." on:keydown={handleKeydown} bind:value={chat} />
  <button on:click|preventDefault={addChat}>↵</button>
</form>

<style>
  #chat {
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 10px;
    display: flex;
    background-color: black;
    padding: 10px;
    z-index : 3;
  }

  #chat input {
    flex: 1;
    min-width: 50%;
    margin-right: 10px;
    font-family: NeoDunggeunmo;
    padding: 14px;
    border: none;
    font-size: 20px;
  }

  #chat input:focus {
    outline: none;
  }

  #chat button {
    flex: 0;
    background-color: lightgrey;
    font-family: NeoDunggeunmo;
    border: none;
    font-size: 30px;
    width: 60px;
  }

  @media (orientation: portrait) {
    #chat {
      left: 0px;
      right: 0px;
      bottom: 0px;
      padding: 10px;
    }

    #chat input {
      padding: 10px;
      font-size: 16px;
      margin-right: 10px;
    }

    #chat button {
      width: 50px;
      font-size: 24px;
    }
  }
</style>
