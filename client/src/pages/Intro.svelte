<script>
  import { Link } from 'svelte-routing';
</script>

<main>
  <img class="title" src="/img/ui/title.png" alt="큐브 룸" />
  <div style="text-align: center;">
    <Link to="character-selection">
      <img  class="start" src="/img/ui/start.png" alt="시작하기" />
    </Link>
  </div>
</main>

<style>
  main {
    height: 100%;
    background-image: url('/img/ui/intro_background.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  img {
    object-fit: contain;
    flex: 1;
  }

  div {
    flex: 1;
  }

  .title {
    width: 400px;
  }

  .start {
    width: 312px;
  }

  @media (orientation: portrait) {
    main {
      overflow: hidden;
    }

    .title {
      width: 300px;
    }

    .start {
      width: 250px;
    }
  }
</style>
