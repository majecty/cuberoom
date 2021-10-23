<script>
  import { onDestroy } from "svelte";

  export let id;

  let nodeRef;

  const globalOnMouseDown = () => {
    game.input.enabled = false;
  };
  const globalOnMouseUp = () => {
    game.input.enabled = true;
  };

  onDestroy(() => {
    game.input.enabled = true;
  });

  const onCloseButtonClick = () => {
    nodeRef.parentNode.removeChild(nodeRef);
  };
</script>

<div class="full-screen" bind:this="{nodeRef}">
  <div
    id="{id}"
    class="container"
    on:mousedown="{globalOnMouseDown}"
    on:mouseup="{globalOnMouseUp}"
    on:touchstart="{globalOnMouseDown}"
    on:touchend="{globalOnMouseUp}"
  >
    <slot> </slot>
    <button class="closebutton" on:click="{onCloseButtonClick}"></button>
  </div>
</div>

<style>
  .full-screen {
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

  .container {
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

  .closebutton {
    cursor: pointer;
    border: none;
    background-image: url("/static/img/ui/close.png");
    width: 30px;
    height: 30px;
    top: 4px;
    right: 4px;
    position: absolute;
  }

  @media (orientation: portrait) {
    .container {
      font-size: 11px;
      margin: 0;
      padding: 10px;
      bottom: 60px;
    }
  }
</style>
