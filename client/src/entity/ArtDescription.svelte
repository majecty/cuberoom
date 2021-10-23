<script>
  import { onDestroy } from "svelte";
  import HTMLPopup from "./HTMLPopup.svelte";

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

  // folded or unfolded
  let moreStatus = "folded";
  const handleMoreClick = (event) => {
    if (moreStatus === "folded") {
      moreStatus = "unfolded";
    } else {
      moreStatus = "folded";
    }
  };
</script>

<HTMLPopup id="{id}">
  <img class="popup-left" src="{popupLeftUrl}" />
  <div class="popup-right">
    <div class="title">{title}</div>
    <div class="medium">{medium}</div>
    {#if title2 != null}
    <div class="title2">{title2}</div>
    <div class="medium2"></div>
    {/if}
    <div class="alt">{alt}</div>
    <button class="more" on:click="{handleMoreClick}">
      {#if moreStatus === "folded"} 더보기 {/if} {#if moreStatus === "unfolded"}
      접기 {/if}
    </button>
    <div class="description" class:folded="{moreStatus === 'folded'}">
      {description}
    </div>
    {#if url2 == null}
    <a class="link1" href="{url}" target="_blank">새 창으로 링크 열기</a>
    {:else}
    <a class="link1" href="{url}" target="_blank">작품1 새 창으로 링크 열기</a>
    <a class="link2" href="{url2}" target="_blank">작품2 새 창으로 링크 열기</a>
    {/if}
  </div>
</HTMLPopup>

<style>
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
    cursor: pointer;
    background: none;
    border: none;
    font-size: 1em;
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

    .right > div:first-child {
      padding: 20%;
    }
  }
</style>
