<script>
  import startScene from "./startScene";
  import ElevatorPanelButton from "./ElevatorPanelButton.svelte";

  export let top;
  export let left;
  export let floor;
</script>

<ElevatorPanelButton
  top="{top}"
  left="{left}"
  floor="{floor}"
/>

<style></style>
