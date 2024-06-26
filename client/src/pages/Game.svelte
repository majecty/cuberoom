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
  import BusanExternalScene from '../scenes/BusanExternalScene';
  import Busan1FScene from '../scenes/Busan1FScene';
  import BusanTopScene from '../scenes/BusanTopScene';
  import { playersEntries } from "../scenes/common/players";
  import { saveCharacterSelection, saveIdAndPassword, loadFloorAndMovement, isSavePrepared } from "./storage";
  import { protocol } from "../network/protocol"
  import names from '../entity/names';
  import { getRandomInt, uuidv4, randomPassword } from "../util/random";
  import { urlParam } from "../common/urlParam";
  import { ifDebug } from "../common/debug";
  import { onMount } from 'svelte';
  import { zoom } from "../constant";
  import { FLOOR_NAMES } from '../scenes/common';

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
      // See https://sentry.io/organizations/cuberoom/issues/2720636667/events/0132dcc92ba24be68f6687f24bc2945e/?project=5979255
      // It seems that main camera is null while initializing the scene
      if (window.scene.cameras.main == null) {
        return;
      }
      window.scene.cameras.main.fadeOut(0);
      setTimeout(() => {
        if (window.game == null) {
          return;
        }
        if (window.scene == null) {
          return;
        }
        // See https://sentry.io/organizations/cuberoom/issues/2720636667/events/0132dcc92ba24be68f6687f24bc2945e/?project=5979255
        // It seems that main camera is null while initializing the scene
        if (window.scene.cameras.main == null) {
          return;
        }
        window.scene.cameras.main.fadeIn(500);
        window.game.scale.resize(window.visualViewport.width / zoom, window.visualViewport.height / zoom);
      }, 100);
    });
  }

  function initializeSocket() {
    const socket = protocol.createSocket();
    window.socket = socket;

    protocol.onDisconnect(socket,(reason) => {
      console.log("disconnected", reason);
      if (reason === "io server disconnect") {
        console.log("manual reconnect");
        protocol.socketConnect(socket);
      }
    });

    protocol.onConnectError(socket, (err) => {
      console.error(err);
    });

    protocol.onNeedLogin(socket, () => {
      if (window.scene != null) {
        window.scene.login();
      }
    });

    protocol.onDebugMessage(socket, (data) => {
      console.log("debugMessage", data);
    });

    protocol.onConnect(socket, () => {
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
      case FLOOR_NAMES.EntranceScene:
        return EntranceScene;
      case FLOOR_NAMES.FirstFloorScene:
        return FirstFloorScene;
      case FLOOR_NAMES.SecondFloorScene:
        return SecondFloorScene;
      case FLOOR_NAMES.FifthFloorScene:
        return FifthFloorScene;
      case FLOOR_NAMES.SixthFloorScene:
        return SixthFloorScene;
      case FLOOR_NAMES.SeventhFloorScene:
        return SeventhFloorScene;
      case FLOOR_NAMES.EighthFloorScene:
        return EighthFloorScene;
      case FLOOR_NAMES.FirstBasementScene:
        return FirstBasementScene;
      case FLOOR_NAMES.SecondBasementScene:
        return SecondBasementScene;
      case FLOOR_NAMES.BusanExternalScene:
        return BusanExternalScene;
      case FLOOR_NAMES.Busan1FScene:
        return Busan1FScene;
      case FLOOR_NAMES.BusanTopScene:
        return BusanTopScene;
    }
    console.log("no scene for floor", floor);
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
    console.log("floor from storage", floor);
    const floorFromUrl = urlParam.readFloor();
    if (floorFromUrl != null) {
      console.log("floor from url", floorFromUrl);
      floor = floorFromUrl;
    }
    let defaultFirstFloor = null;
    const busanOrSeoul = urlParam.readBusanOrSeoul();
    if (busanOrSeoul === "busan") {
      defaultFirstFloor = FLOOR_NAMES.BusanExternalScene;
      console.log("default map to busan");
    } else if (busanOrSeoul === "seoul") {
      defaultFirstFloor = FLOOR_NAMES.EntranceScene;
      console.log("default map to seoul");
    }
    const firstSceneConstructor = getSceneConstructor(floor ?? defaultFirstFloor);
    const allScenes = [
      EntranceScene, FirstFloorScene, FirstBasementScene,
      SecondFloorScene, FifthFloorScene, SixthFloorScene,
      SeventhFloorScene, EighthFloorScene, SecondBasementScene,
      BusanExternalScene, Busan1FScene, BusanTopScene,
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
    width: 30px;
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
      width: 30px;
      font-size: 24px;
    }
  }
</style>
