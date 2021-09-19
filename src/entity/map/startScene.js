function getFloorName(sceneName) {
  switch (sceneName) {
    case 'EntranceScene':
      return 'entrance';
    case 'FirstFloorScene':
      return '1F';
    case 'SecondFloorScene':
      return '2F';
    case 'FifthFloorScene':
      return '5F';
    case 'SixthFloorScene':
      return '6F';
    case 'SeventhFloorScene':
      return '7F';
    case 'EighthFloorScene':
      return '8F';
    case 'FirstBasementScene':
      return 'B1';
    case 'SecondBasementScene':
      return 'B2';
  }
}

export default function startScene(scene, sceneName, spawnPos) {
  scene.cameras.main.fadeOut(500);
  // window.socket.emit('moveFloor', { id: this.socket.id, floor: getFloorName(sceneName) });
  scene.cameras.main.on('camerafadeoutcomplete', () => {
    scene.scene.pause(scene.scene.key);
    scene.scene.start(sceneName, spawnPos);
  });
}
