import ElevatorPanel from "./ElevatorPanel.svelte";
import { zoom } from "../../constant";
import { panelWidth } from "./elevatorConstant";

export function hideElevatorPanel() {
  if (window.elevatorPanel != null) {
    window.elevatorPanel.$destroy();
    window.elevatorPanel = null;
  }
}

export function showElevatorPanel(scene, floor) {
  const world = {
    objectX: (scene.map.objects["elevator-right"].x * 2) / zoom,
  };

  const cameraScrollX = scene.cameras.main.scrollX;
  const viewPort = {
    centerX: scene.cameras.main.centerX,
  };
  viewPort.elevatorLeftX = world.objectX - cameraScrollX;
  viewPort.maxX = viewPort.centerX * 2;
  viewPort.elevatorRightX = viewPort.elevatorLeftX + panelWidth;

  const elevatorPanel = new ElevatorPanel({
    target: document.body,
    props: {
      floor,
      scene,
      leftX:
        viewPort.elevatorRightX > viewPort.maxX ? null : viewPort.elevatorLeftX,
    },
  });
  window.elevatorPanel = elevatorPanel;
}
