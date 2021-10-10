<script>
  import ElevatorPanelFloorButton from "./ElevatorPanelFloorButton.svelte";
  import ElevatorPanelUtilButton from "./ElevatorPanelUtilButton.svelte";
  import { onDestroy } from "svelte";

  let nodeRef;

  export let floor;
  export let scene;

  const globalOnMouseDown = () => {
    game.input.enabled = false;
  };
  const globalOnMouseUp = () => {
    game.input.enabled = true;
  };

  onDestroy(() => {
    game.input.enabled = true;
  });

  const styles = {
    "background-image": `url("/static/img/ui-map/el_panel_${floor}.png")`,
  };

  $: cssVarStyles = Object.entries(styles)
    .map(([key, value]) => `--${key}:${value}`)
    .join(";");

  const hideElevatorPanel = () => {
    nodeRef.parentNode.removeChild(nodeRef);
    window.elevatorPanel = null;
  };

  const elevatorButtonData = [
    {
      floor: "1F",
      left: 56,
      top: 276,
    },
    {
      floor: "2F",
      left: 120,
      top: 276,
    },
    {
      floor: "5F",
      left: 56,
      top: 212,
    },
    {
      floor: "6F",
      left: 120,
      top: 212,
    },
    {
      floor: "7F",
      left: 56,
      top: 148,
    },
    {
      floor: "B1",
      left: 120,
      top: 340,
    },
    {
      floor: "B2",
      left: 56,
      top: 340,
    },
  ];
</script>

<div class="panel-container" style="{cssVarStyles}" bind:this="{nodeRef}">
  <div
    class="panel"
    on:mousedown="{globalOnMouseDown}"
    on:mouseup="{globalOnMouseUp}"
    on:touchstart="{globalOnMouseDown}"
    on:touchend="{globalOnMouseUp}"
  >
    {#each elevatorButtonData as buttonData}
    <ElevatorPanelFloorButton
      left="{buttonData.left}"
      top="{buttonData.top}"
      floor="{buttonData.floor}"
      scene="{scene}"
      onClickFromParent="{hideElevatorPanel}"
    />
    {/each}
    <ElevatorPanelUtilButton left="56" top="404" floor="open" />
    <ElevatorPanelUtilButton left="120" top="404" floor="close" />
  </div>
</div>

<style>
  .panel-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .panel {
    width: 224px;
    height: 472px;
    position: relative;
    background-image: var(--background-image);
  }
</style>
