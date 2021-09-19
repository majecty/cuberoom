<script>
  import { Link } from 'svelte-routing';
</script>

<main>
  <div class="seoul">
    <img src="/img/ui/map_seoul.png" alt="" />
  </div>
  <div class="guide">
    <img
      src="/img/ui/map_tutorial.png"
      alt="
        안녕하세요? 저는 이 작품을 만든 선우 훈 입니다.
        이 '큐브 스테이지'는 가상 미술관 관람을 위해 제작된 웹사이트입니다.
        서울 강남구에 있는 코라아나 미술관의 '스페이스 씨'에서 열리는 전시를 위해 만들었습니다.
        코리아나 미술관으로 가 볼까요? 강남구를 클릭해 주세요.
      "
    />
  </div>
  <img class="flag" src="/img/ui/map_click.png" alt="" />
  <Link to="/game" class="start-game">
    <img src="/img/ui/map_gangnam.png" alt="클릭" />
  </Link>
</main>

<style>
  main {
    height: 100%;
    background-image: url('/img/ui/map_background.jpg');
    background-repeat: no-repeat;
    background-size: cover;
  }

  .seoul {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
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

  .flag {
    position: absolute;
    top: 50%;
    left: calc(50% + 55px);
    z-index: 3;
  }

  :global(a.start-game) {
    width : 120%;
    height: 120%;
    z-index : 2;
    opacity: 0;
    position: absolute;
    top: calc(50% + 56px);
    left: calc(50% + 62px);
  }

  :global(a.start-game:hover) {
    opacity: 1;
  }

  @media (orientation: portrait) {
    main {
      overflow: hidden;
    }

    .guide img {
      width: 90%;
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
