import ElevatorPanel from "./ElevatorPanel.svelte";

export function hideElevatorPanel() {
  if (window.elevatorPanel != null) {
    window.elevatorPanel.$destroy();
    window.elevatorPanel = null;
  }
}

export function showElevatorPanel(scene, floor) {
  const elevatorPanel = new ElevatorPanel({
    target: document.body,
    props: {
      floor,
      scene,
    },
  });
  window.elevatorPanel = elevatorPanel;
}
