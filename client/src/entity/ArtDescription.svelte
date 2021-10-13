<script>
  import { onDestroy } from "svelte";

  let nodeRef;

  export let id;
  export let popupLeftUrl;
  export let title;
  export let medium;
  export let title2;
  export let medium2;
  export let alt;
  export let game;
  export let description;
  export let url;
  export let url2;

  const globalOnMouseDown = () => {
    game.input.enabled = false;
  };
  const globalOnMouseUp = () => {
    game.input.enabled = true;
  };

  onDestroy(() => {
    game.input.enabled = true;
  });

  // folded or unfolded
  let moreStatus = "folded";
  const handleMoreClick = (event) => {
    if (moreStatus === "folded") {
      moreStatus = "unfolded";
    } else {
      moreStatus = "folded";
    }
  };

  const onCloseButtonClick = () => {
    nodeRef.parentNode.removeChild(nodeRef);
  };
</script>

<div class="description-container" bind:this="{nodeRef}">
  <div
    class="work"
    id="{id}"
    on:mousedown="{globalOnMouseDown}"
    on:mouseup="{globalOnMouseUp}"
    on:touchstart="{globalOnMouseDown}"
    on:touchend="{globalOnMouseUp}"
  >
    <img class="popup-left" src="{popupLeftUrl}" />
    <div class="popup-right">
      <div class="title">{title}</div>
      <div class="medium">{medium}</div>
      {#if title2 != null}
      <div class="title2">{title2}</div>
      <div class="medium2"></div>
      {/if}
      <div class="alt">{alt}</div>
      <div clas="more" on:click="{handleMoreClick}">
        {#if moreStatus === "folded"} 더보기 {/if} {#if moreStatus ===
        "unfolded"} 접기 {/if}
      </div>
      <div class="description" class:folded="{moreStatus === 'folded'}">
        {description}
      </div>
      <button class="closebutton" on:click="{onCloseButtonClick}"></button>
      {#if url2 == null}
      <a class="link1" href="{url}" target="_blank">새 창으로 링크 열기</a>
      {:else}
      <a class="link1" href="{url}" target="_blank"
        >작품1 새 창으로 링크 열기</a
      >
      <a class="link2" href="{url2}" target="_blank"
        >작품2 새 창으로 링크 열기</a
      >
      {/if}
    </div>
  </div>
</div>

<style>
  .description-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
  }

  .work {
    min-width: 200px;
    max-width: 600px;
    background-color: white;
    border-right-color: black;
    border-width: 4px;
    border-style: solid;
    padding: 34px;
    padding-bottom: 50px;
    display: flex;
    justify-content: space-between;
    position: relative;
    bottom: 100px;
  }

  .popup-left {
    width: 160px;
    height: 160px;
    margin-right: 24px;
  }

  .popup-right {
    flex: 1;
    position: relative;
  }

  .medium {
    margin-bottom: 16px;
  }

  .medium2 {
    margin-bottom: 16px;
  }

  .alt {
    word-break: keep-all;
    margin-bottom: 32px;
  }

  .more {
    word-break: keep-all;
    margin-bottom: 32px;
    text-decoration: underline;
  }

  .description {
    word-break: keep-all;
    margin-bottom: 16px;
    display: inline-block;
  }

  .description.folded {
    display: none;
  }

  .closebutton {
    border: none;
    background-image: url("/static/img/ui/close.png");
    width: 30px;
    height: 30px;
    top: 20px;
    right: -10px;
    position: absolute;
  }

  .link1 {
    position: absolute;
    right: 0;
    bottom: -20px;
  }

  .link2 {
    position: absolute;
    right: 0;
    bottom: -50px;
  }

  @media (orientation: portrait) {
    .work {
      font-size: 11px;
      margin: 0;
      padding: 10px;
      bottom: 60px;
    }

    .popup-left {
      width: 80px;
      height: 80px;
    }

    .title {
      width: calc(100% - 25px);
    }

    .medium {
      width: calc(100% - 25px);
    }

    .link1 {
      margin-bottom: 20px;
    }

    .link2 {
      margin-bottom: 35px;
    }

    .closebutton {
      margin-right: -5px;
      margin-top: -30px;
      top: 23px;
      right: -3px;
    }

    .right > div:first-child {
      padding: 20%;
    }
  }
</style>
