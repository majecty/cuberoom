import startScene from '../map/startScene';

let panelContainer;

function elButton(x, y, floor) {
  const button = document.createElement('button');
  button.style.width = '48px';
  button.style.height = '48px';
  button.style.position = 'absolute';
  button.style.top = `${y}px`;
  button.style.left = `${x}px`;
  button.style.border = 'none';
  button.style.backgroundImage = `url("/img/ui-map/el_${floor}.png")`;
  button.style.opacity = 0;
  button.style.cursor = 'pointer';

  return button;
}

export function hideElevatorPanel() {
  if (panelContainer) document.body.removeChild(panelContainer);
}

export function showElevatorPanel(scene, floor) {
  panelContainer = document.createElement('div');
  panelContainer.style.position = 'absolute';
  panelContainer.style.top = '0px';
  panelContainer.style.left = '0px';
  panelContainer.style.width = '100%';
  panelContainer.style.height = '100%';
  panelContainer.style.display = 'flex';
  panelContainer.style.justifyContent = 'center';
  panelContainer.style.alignItems = 'center';

  const panel = document.createElement('div');
  panel.style.width = '224px';
  panel.style.height = '472px';
  panel.style.position = 'relative';
  panel.onmousedown = () => window.game.input.enabled = false;
  panel.onmouseup = () => window.game.input.enabled = true;

  panel.ontouchstart = () => window.game.input.mouse.enabled = false;
  panel.ontouchend = () => window.game.input.mouse.enabled = true;

  panelContainer.appendChild(panel);

  const buttonTo1F = elButton(56, 276, '1F');
  buttonTo1F.onclick = () => {
    hideElevatorPanel();
    scene.socket.emit('moveFloor', { id: scene.socket.id, floor: '1F' });
    startScene(scene, 'FirstFloorScene', { x: 16 * 9, y: 16 * 21 });
  }
  buttonTo1F.ontouchstart = () => {
    if(floor!='1F'){
      hideElevatorPanel();
      scene.socket.emit('moveFloor', { id: scene.socket.id, floor: '1F' });
      startScene(scene, 'FirstFloorScene', { x: 16 * 9, y: 16 * 21 });
    }
  }
  panel.appendChild(buttonTo1F);

  const buttonTo2F = elButton(120, 276, '2F');
  buttonTo2F.onclick = () => {
    hideElevatorPanel();
    scene.socket.emit('moveFloor', { id: scene.socket.id, floor: '2F' });
    startScene(scene, 'SecondFloorScene', { x: 16 * 9, y: 16 * 21 });
  }
  buttonTo2F.ontouchstart = () => {
    if(floor!='2F'){
    hideElevatorPanel();
    scene.socket.emit('moveFloor', { id: scene.socket.id, floor: '2F' });
    startScene(scene, 'SecondFloorScene', { x: 16 * 9, y: 16 * 21 });
    }
  }
  panel.appendChild(buttonTo2F);

  const buttonTo5F = elButton(56, 212, '5F');
  buttonTo5F.onclick = () => {
    hideElevatorPanel();
    scene.socket.emit('moveFloor', { id: scene.socket.id, floor: '5F' });
    startScene(scene, 'FifthFloorScene', { x: 16 * 9, y: 16 * 22 });
  }
  buttonTo5F.ontouchstart = () => {
    if(floor!='5F'){
    hideElevatorPanel();
    scene.socket.emit('moveFloor', { id: scene.socket.id, floor: '5F' });
    startScene(scene, 'FifthFloorScene', { x: 16 * 9, y: 16 * 22 });
    }
  }
  panel.appendChild(buttonTo5F);

  const buttonTo6F = elButton(120, 212, '6F');
  buttonTo6F.onclick = () => {
    hideElevatorPanel();
    scene.socket.emit('moveFloor', { id: scene.socket.id, floor: '6F' });
    startScene(scene, 'SixthFloorScene', { x: 16 * 9, y: 16 * 30 });
  }
  buttonTo6F.ontouchstart = () => {
    if(floor!='6F'){
    hideElevatorPanel();
    scene.socket.emit('moveFloor', { id: scene.socket.id, floor: '6F' });
    startScene(scene, 'SixthFloorScene', { x: 16 * 9, y: 16 * 30 });
    }
  } 
  panel.appendChild(buttonTo6F);

  const buttonTo7F = elButton(56, 148, '7F');
  buttonTo7F.onclick = () => {
    hideElevatorPanel();
    scene.socket.emit('moveFloor', { id: scene.socket.id, floor: '7F' });
    startScene(scene, 'SeventhFloorScene', { x: 16 * 9, y: 16 * 22 });
  }
  buttonTo7F.ontouchstart = () => {
    if(floor!='7F'){
    hideElevatorPanel();
    scene.socket.emit('moveFloor', { id: scene.socket.id, floor: '7F' });
    startScene(scene, 'SeventhFloorScene', { x: 16 * 9, y: 16 * 22 });
    }
  } 
  panel.appendChild(buttonTo7F);

  const buttonToB1 = elButton(120, 340, 'B1');
  buttonToB1.onclick = () => {
    hideElevatorPanel();
    scene.socket.emit('moveFloor', { id: scene.socket.id, floor: 'B1' });
    startScene(scene, 'FirstBasementScene', { x: 16 * 9, y: 16 * 42 });
  }
  buttonToB1.ontouchstart = () => {
    if(floor!='B1'){
    hideElevatorPanel();
    scene.socket.emit('moveFloor', { id: scene.socket.id, floor: 'B1' });
    startScene(scene, 'FirstBasementScene', { x: 16 * 9, y: 16 * 42 });
    }
  }
  panel.appendChild(buttonToB1);

  const buttonToB2 = elButton(56, 340, 'B2');
  buttonToB2.onclick = () => {
    hideElevatorPanel();
    scene.socket.emit('moveFloor', { id: scene.socket.id, floor: 'B2' });
    startScene(scene, 'SecondBasementScene', { x: 16 * 9, y: 16 * 23 });
  }
  buttonToB2.ontouchstart = () => {
    if(floor!='B2'){
    hideElevatorPanel();
    scene.socket.emit('moveFloor', { id: scene.socket.id, floor: 'B2' });
    startScene(scene, 'SecondBasementScene', { x: 16 * 9, y: 16 * 23 });
   }
  }
  panel.appendChild(buttonToB2);




  // 아래 두 개는 왜 눌러도 버튼 색이 안 변하지..? ㅜㅜ

  const buttonOpen = elButton(56, 404, 'open');
  buttonOpen.onkeydown = () => {
    buttonOpen.style.opacity = 1;
  }
  buttonOpen.onkeyup = () => {
    buttonOpen.style.opacity = 0;
  }
  panel.appendChild(buttonOpen);

  const buttonClose = elButton(56, 404, 'close');
  buttonClose.onkeydown = () => {
    buttonClose.style.opacity = 1;
  }
  buttonClose.onkeyup = () => {
    buttonClose.style.opacity = 0;
  }
  panel.appendChild(buttonClose);

  panel.style.backgroundImage = `url("/img/ui-map/el_panel_${floor}.png")`;
  document.body.appendChild(panelContainer);
}
