<script>
  export let top;
  export let left;
  export let floor;

  export let onClickFromParent = () => {};

  let clicked = false;
  let onMouseDown = () => {
    console.log("call onMouseDown");
    clicked = true;
  };
  let onMouseUp = () => {
    console.log("call onMouseUp");
    clicked = false;

    onClickFromParent();
  };

  const styles = {
    top: `${top}px`,
    left: `${left}px`,
    "background-image": `url("/static/img/ui-map/el_${floor}.png")`,
  };

  $: cssVarStyles = Object.entries(styles)
    .map(([key, value]) => `--${key}:${value}`)
    .join(";");
</script>

<button
  class="elevator-button"
  class:clicked="{clicked}"
  style="{cssVarStyles}"
  on:mouseup="{onMouseUp}"
></button>

<style>
  .elevator-button {
    width: 48px;
    height: 48px;
    position: absolute;
    top: var(--top);
    left: var(--left);
    border: none;
    background-image: var(--background-image);
    opacity: 0;
    cursor: pointer;
  }

  .elevator-button.clicked {
    opacity: 1;
  }
</style>
