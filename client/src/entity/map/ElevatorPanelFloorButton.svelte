<script>
  import startScene from "./startScene";
  import { spawnPoints } from "../../scenes/common/constants";
  import { protocol } from "../../network/protocol";
  import { FLOOR_TO_SCENE } from "../../scenes/common";
  import ElevatorPanelButton from "./ElevatorPanelButton.svelte";

  export let top;
  export let left;
  export let floor;
  export let onClickFromParent;
  export let scene;

  const spawnPointForFloor = {
    "1F": spawnPoints.floor1F.elevator,
    "2F": spawnPoints.floor2F.elevator,
    "5F": spawnPoints.floor5F.elevator,
    "6F": spawnPoints.floor6F.elevator,
    "7F": spawnPoints.floor7F.elevator,
    "8F": spawnPoints.floor8F.elevator,
    B1: spawnPoints.floorB1.elevator,
    B2: spawnPoints.floorB2.elevator,
  };

  const onClick = () => {
    onClickFromParent();
    protocol.moveFloor(scene.socket, floor);
    startScene(scene, FLOOR_TO_SCENE[floor], spawnPointForFloor[floor]);
  };
</script>

<ElevatorPanelButton
  top="{top}"
  left="{left}"
  floor="{floor}"
  onClickFromParent="{onClick}"
/>

<style></style>
