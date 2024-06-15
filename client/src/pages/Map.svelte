<script>
  import { Link } from 'svelte-routing';
  import { resetMap } from './storage';
  import { protocol } from '../network/protocol';
  import { onDestroy, onMount } from 'svelte';
  resetMap();

  export let busanNum = 0;
  export let seoulNum = 0;

  let socket = null;;
  let updateTotal = null;
  onMount(() => {
    if (socket) {
      console.error('socket is already created in onMount', socket);
      protocol.socketClose(socket);
      socket = null;
    }
    console.log('onMount', 'createSocket');
    socket = protocol.createSocket();
    protocol.onDisconnect(socket, () => {
      console.log('disconnected');
    });
    protocol.onConnectError(socket, () => {
      console.log('connect error');
    });
    protocol.onConnect(socket, () => {
      console.log('connected');
    });

    if (updateTotal != null) {
      console.error('updateTotal is already created in onMount', updateTotal);
      clearInterval(updateTotal);
    }
    updateTotal = setInterval(() => {
      if (socket == null) {
        console.error('socket is null in setInterval', socket);
        return;
      }
      // console.log('getPlayersTotal');
      protocol.getPlayersTotal(socket);
    }, 1_000);
    protocol.onPlayersTotal(socket, (total) => {
      // console.log('onPlayersTotal', total);
      if (total == null) {
        console.error('total is null');
        return;
      }
      if (typeof total !== 'object') {
        console.error('total is not object', total);
        return;
      }

      busanNum = 0;
      seoulNum = 0;
      for (let key in total) {
        if (total[key] == null) {
          console.error('total[key] is null', key);
          continue;
        }
        if (typeof total[key] !== 'number') {
          console.error('total[key] is not number', key, total[key]);
          continue;
        }
        if (key.toLowerCase().includes('busan')) {
          // console.log('busan', key, total[key]);
          busanNum += total[key];
        } else {
          // console.log('seoul', key, total[key]);
          seoulNum += total[key];
        }
      }
    });
  });

  onDestroy(() => {
    if (socket == null) {
      console.error('socket is already closed in onDestroy', socket);
      return;
    }
    protocol.socketClose(socket);
    clearInterval(updateTotal);
    socket = null;
  });

  let innerWidth = window.innerWidth;
  let innerHeight = window.innerHeight;

  // 위치를 계산할 때 가로 세로 비율이 필요해서 자바스크립트로 계산
  let seoulTop = `--seoul-top:31%`;
  let seoulLeft = `--seoul-left:41%`;
  let busanBottom = `--busan-bottom:33%`;
  let busanRight = `--busan-right:37%`;
  $: {
    // 가로가 길 때
    if (innerWidth / innerHeight > 1024 / 769) {
      // top = 31%  when width / height = 1.33
      // top = 0 when width / height = 3.77
      let seoulTopPercentage = `${(3.77 - (innerWidth / innerHeight)) / (3.77 - 1.33) * 31}`;
      seoulTop = `--seoul-top:${seoulTopPercentage}%`;

      // buttom = 0% when width / height = 1758 / 442 = 3.98
      // bottom = 33% when width / height = 1024 / 769 = 1.33
      let busanBottomPercentage = (3.98 - (innerWidth / innerHeight)) / (3.98 - 1.33) * 33;
      busanBottom = `--busan-bottom:${busanBottomPercentage}%`;
    } else {
      // left = 0 when height / width = 4.17
      // left = 41 when height / width = 0.75
      let seoulLeftPercentage = (4.17 - (innerHeight / innerWidth)) / (4.17 - 0.75) * 41;
      seoulLeft = `--seoul-left:${seoulLeftPercentage}%`;

      // right = 0 when height / width = 580 / 202 = 2.87
      // right = 37 when height / width = 580 / 762 = 0.76
      let busanRightPercentage = (2.87 - (innerHeight / innerWidth)) / (2.87 - 0.76) * 37;
      busanRight = `--busan-right:${busanRightPercentage}%`;
    }
  }
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<main>
  <!-- <div class="seoul">
    <img src="/static/img/ui/map_seoulbusan.png" alt="" />
  </div> -->
  <div class="guide">
    <img
      src="/static/img/ui/map_tutorial.png"
      alt="
        안녕하세요? 저는 이 작품을 만든 선우 훈 입니다.
        이 '큐브 스테이지'는 가상 미술관 관람을 위해 제작된 웹사이트입니다.
        서울 강남구에 있는 코라아나 미술관의 '스페이스 씨'에서 열리는 전시를 위해 만들었습니다.
        코리아나 미술관으로 가 볼까요? 강남구를 클릭해 주세요.
      "
    />
  </div>
  <!-- <img class="flag" src="/static/img/ui/map_click.png" alt="" /> -->
  <Link to="/game?map=seoul" class="start-game-seoul seoul" style="{seoulTop};{seoulLeft}">
    <!-- <img src="/static/img/ui/map_gangnam.png" alt="클릭" /> -->
  </Link>
  <p id="seoul-current-player-num" class='seoulxxx'>현재 접속자 수 {seoulNum}명</p>
  <Link to="/game?map=busan" class="start-game-busan busan" style="{busanBottom};{busanRight}">
    <!-- <img src="/static/img/ui/map_gangnam.png" alt="클릭" /> -->
  </Link>
  <p id="busan-current-player-num" class='busan'>현재 접속자 수 {busanNum}명</p>
</main>

<style>
  main {
    background-image: url('/static/img/ui/map_seoulbusan.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: absolute;
    left: 0%;
    right: 0%;
    top: 0%;
    bottom: 0%;
  }

  .guide {
    width: 100%;
    height: 30%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    position: absolute;
    z-index: 1;
  }

  .guide img {
    width: 450px;
  }

  :global(.seoul) {
    z-index : 2;
    position: absolute;
    bottom: 51%;
    right: 50%;
    aspect-ratio: 1;
    /* 서울 클릭 범위의 34%가 가로로 중앙을 넘김 */
    transform: translateX(34%);
  }

  #seoul-current-player-num {
    z-index: 1;
    position: absolute;
    font-size: 1.5rem;
    left: 51%;
    /* right: unset; */
    bottom: 50%;
    transform: translateY(-50%);
    margin: 0;
    padding: 0;
    /* bottom: unset; */
  }

  :global(a.seoul) {
    opacity: 0;
  }

  /* 가로가 길 때 */
  @media (min-aspect-ratio: 4/3) {
    :global(a.seoul) {
      width : 13%;
      /* top: var(--seoul-top, 40%); */
      /* left: 48%; */
      background-color: purple;
      /* transform:translate(-50%); */
    }
  }

  /* 세로가 길 때 */
  @media (max-aspect-ratio: 4/3) {
    :global(a.seoul) {
      height: 17%;
      /* top: 40%; */
      /* left: var(--seoul-left, 41%); */
      background-color: blue;
      /* aspect-ratio: 1; */
      /* transform: translate(0, -50%) */
    }
  }

  :global(.busan) {
      z-index : 2;
      /* transform:translate(-50%, -50%); */
      position: absolute;

      top: 51%;
      left: 51%;
  }

  :global(a.busan) {
    opacity: 0;
    background-color: black;
  }

  /* 가로가 길 때 */
  @media (min-aspect-ratio: 4/3) {
    :global(a.busan) {
      width : 13%;
      /* bottom: var(--busan-bottom, 33%); */
      /* top: calc(50% + 1vh); */
      /* left: 57%; */
      background-color: yellowgreen;
      aspect-ratio: 1;
      /* transform:translate(-50%); */
    }
  }

  /* 세로가 길 때 */
  @media (max-aspect-ratio: 4/3) {
    :global(a.busan) {
      height: 17%;
      /* bottom: 24%; */
      /* right: var(--busan-right, 37%); */
      /* left: calc(50% + 1vw); */
      background-color: yellow;
      aspect-ratio: 1;
      /* transform: translate(0, -50%); */
    }
  }


  @media (orientation: portrait) {
    main {
      overflow: hidden;
    }

    .guide img {
      width: 90%;
      top: 10%;
      position: absolute;
    }

    :global(a.start-game) {
      opacity: 1;
      overflow: hidden;
      position: relative;
    }
  }
</style>
