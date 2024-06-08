<script>
  import { Link } from 'svelte-routing';
  import { resetMap } from './storage';
  resetMap();

  let innerWidth = window.innerWidth;
  let innerHeight = window.innerHeight;

  let seoulTop = `--seoul-top:31%`;
  let seoulLeft = `--seoul-left:41%`;
  $: {
    if (innerWidth / innerHeight > 1024 / 769) {
      // top = 31%  when width / height = 1.33
      // top = 0 when width / height = 3.77
      let seoulTopPercentage = `${(3.77 - (innerWidth / innerHeight)) / (3.77 - 1.33) * 31}`;
      seoulTop = `--seoul-top:${seoulTopPercentage}%`;
    } else {
      // left = 0 when height / width = 4.17
      // left = 41 when height / width = 0.75
      let seoulLeftPercentage = (4.17 - (innerHeight / innerWidth)) / (4.17 - 0.75) * 41;
      seoulLeft = `--seoul-left:${seoulLeftPercentage}%`;
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
  <Link to="/game?map=seoul" class="start-game-seoul" style="{seoulTop}">
    <!-- <img src="/static/img/ui/map_gangnam.png" alt="클릭" /> -->
  </Link>
  <Link to="/game?map=busan" class="start-game-busan">
    <!-- <img src="/static/img/ui/map_gangnam.png" alt="클릭" /> -->
  </Link>
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

  :global(a.start-game-seoul) {
    opacity: 0;
    transform:translate(-50%, -50%);
    z-index : 2;
    position: absolute;
  }

  /* 가로가 길 때 */
  @media (min-aspect-ratio: 4/3) {
    :global(a.start-game-seoul) {
      width : 13%;
      top: var(--seoul-top, 40%);
      left: 48%;
      background-color: purple;
      aspect-ratio: 1;
      transform:translate(-50%);
    }
  }

  /* 세로가 길 때 */
  @media (max-aspect-ratio: 4/3) {
    :global(a.start-game-seoul) {
      height: 17%;
      top: 40%;
      left: var(--seoul-left, 41%);
      background-color: blue;
      aspect-ratio: 1;
      transform: translate(0, -50%)
    }
  }

  :global(a.start-game-busan) {
      opacity: 0;
      z-index : 2;
      transform:translate(-50%, -50%);
      position: absolute;
      background-color: black;
  }

  /* 가로가 길 때 */
  @media (min-aspect-ratio: 4/3) {
    :global(a.start-game-busan) {
      width : 80%;
      height: 40%;
      top: 75%;
      left: 70%;
      background-color: yellowgreen;
    }
  }

  /* 세로가 길 때 */
  @media (max-aspect-ratio: 4/3) {
    :global(a.start-game-busan) {
      width : 80%;
      height: 30%;
      top: 70%;
      left: 70%;
      background-color: yellow;
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

    .seoul {
      overflow: hidden;
    }
  }
</style>
