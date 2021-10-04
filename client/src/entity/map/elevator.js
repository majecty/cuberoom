import startScene from "./startScene";
import { spawnPoints } from "../../scenes/common/constants";
import { protocol } from "../../network/protocol";

let panelContainer;

function elButton(x, y, floor) {
  const button = document.createElement("button");
  button.style.width = "48px";
  button.style.height = "48px";
  button.style.position = "absolute";
  button.style.top = `${y}px`;
  button.style.left = `${x}px`;
  button.style.border = "none";
  button.style.backgroundImage = `url("/static/img/ui-map/el_${floor}.png")`;
  button.style.opacity = 0;
  button.style.cursor = "pointer";

  return button;
}

export function hideElevatorPanel() {
  if (panelContainer) document.body.removeChild(panelContainer);
}

export function showElevatorPanel(scene, floor) {
  panelContainer = document.createElement("div");
  panelContainer.style.position = "absolute";
  panelContainer.style.top = "0px";
  panelContainer.style.left = "0px";
  panelContainer.style.width = "100%";
  panelContainer.style.height = "100%";
  panelContainer.style.display = "flex";
  panelContainer.style.justifyContent = "center";
  panelContainer.style.alignItems = "center";

  const panel = document.createElement("div");
  panel.style.width = "224px";
  panel.style.height = "472px";
  panel.style.position = "relative";
  panel.onmousedown = () => {
    window.game.input.enabled = false;
  };
  panel.onmouseup = () => {
    window.game.input.enabled = true;
  };

  panel.ontouchstart = () => {
    window.game.input.mouse.enabled = false;
  };
  panel.ontouchend = () => {
    window.game.input.mouse.enabled = true;
  };

  panelContainer.appendChild(panel);

  const buttonTo1F = elButton(56, 276, "1F");
  buttonTo1F.onclick = () => {
    hideElevatorPanel();
    protocol.moveFloor(scene.socket, "1F");
    startScene(scene, "FirstFloorScene", spawnPoints.floor1F.elevator);
  };
  buttonTo1F.ontouchend = () => {
    if (floor !== "1F") {
      hideElevatorPanel();
      protocol.moveFloor(scene.socket, "1F");
      startScene(scene, "FirstFloorScene", spawnPoints.floor1F.elevator);
    }
  };
  panel.appendChild(buttonTo1F);

  const buttonTo2F = elButton(120, 276, "2F");
  buttonTo2F.onclick = () => {
    hideElevatorPanel();
    protocol.moveFloor(scene.socket, "2F");
    startScene(scene, "SecondFloorScene", spawnPoints.floor2F.elevator);
  };
  buttonTo2F.ontouchend = () => {
    if (floor !== "2F") {
      hideElevatorPanel();
      protocol.moveFloor(scene.socket, "2F");
      startScene(scene, "SecondFloorScene", spawnPoints.floor2F.elevator);
    }
  };
  panel.appendChild(buttonTo2F);

  const buttonTo5F = elButton(56, 212, "5F");
  buttonTo5F.onclick = () => {
    hideElevatorPanel();
    protocol.moveFloor(scene.socket, "5F");
    startScene(scene, "FifthFloorScene", spawnPoints.floor5F.elevator);
  };
  buttonTo5F.ontouchend = () => {
    if (floor !== "5F") {
      hideElevatorPanel();
      protocol.moveFloor(scene.socket, "5F");
      startScene(scene, "FifthFloorScene", spawnPoints.floor5F.elevator);
    }
  };
  panel.appendChild(buttonTo5F);

  const buttonTo6F = elButton(120, 212, "6F");
  buttonTo6F.onclick = () => {
    hideElevatorPanel();
    protocol.moveFloor(scene.socket, "6F");
    startScene(scene, "SixthFloorScene", spawnPoints.floor6F.elevator);
  };
  buttonTo6F.ontouchend = () => {
    if (floor !== "6F") {
      hideElevatorPanel();
      protocol.moveFloor(scene.socket, "6F");
      startScene(scene, "SixthFloorScene", spawnPoints.floor6F.elevator);
    }
  };
  panel.appendChild(buttonTo6F);

  const buttonTo7F = elButton(56, 148, "7F");
  buttonTo7F.onclick = () => {
    hideElevatorPanel();
    protocol.moveFloor(scene.socket, "7F");
    startScene(scene, "SeventhFloorScene", spawnPoints.floor7F.elevator);
  };
  buttonTo7F.ontouchend = () => {
    if (floor !== "7F") {
      hideElevatorPanel();
      protocol.moveFloor(scene.socket, "7F");
      startScene(scene, "SeventhFloorScene", spawnPoints.floor7F.elevator);
    }
  };
  panel.appendChild(buttonTo7F);

  const buttonToB1 = elButton(120, 340, "B1");
  buttonToB1.onclick = () => {
    hideElevatorPanel();
    protocol.moveFloor(scene.socket, "B1");
    startScene(scene, "FirstBasementScene", spawnPoints.floorB1.elevator);
  };
  buttonToB1.ontouchend = () => {
    if (floor !== "B1") {
      hideElevatorPanel();
      protocol.moveFloor(scene.socket, "B1");
      startScene(scene, "FirstBasementScene", spawnPoints.floorB1.elevator);
    }
  };
  panel.appendChild(buttonToB1);

  const buttonToB2 = elButton(56, 340, "B2");
  buttonToB2.onclick = () => {
    hideElevatorPanel();
    protocol.moveFloor(scene.socket, "B2");
    startScene(scene, "SecondBasementScene", spawnPoints.floorB2.elevator);
  };
  buttonToB2.ontouchend = () => {
    if (floor !== "B2") {
      hideElevatorPanel();
      protocol.moveFloor(scene.socket, "B2");
      startScene(scene, "SecondBasementScene", spawnPoints.floorB2.elevator);
    }
  };
  panel.appendChild(buttonToB2);

  // 아래 두 개는 왜 눌러도 버튼 색이 안 변하지..? ㅜㅜ

  const buttonOpen = elButton(56, 404, "open");
  buttonOpen.onkeydown = () => {
    buttonOpen.style.opacity = 1;
  };
  buttonOpen.onkeyup = () => {
    buttonOpen.style.opacity = 0;
  };
  panel.appendChild(buttonOpen);

  const buttonClose = elButton(56, 404, "close");
  buttonClose.onkeydown = () => {
    buttonClose.style.opacity = 1;
  };
  buttonClose.onkeyup = () => {
    buttonClose.style.opacity = 0;
  };
  panel.appendChild(buttonClose);

  panel.style.backgroundImage = `url("/static/img/ui-map/el_panel_${floor}.png")`;
  document.body.appendChild(panelContainer);
}
