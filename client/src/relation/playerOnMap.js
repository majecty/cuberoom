import { popupCreate, popupDestroy } from "../entity/popup";
import { showElevatorPanel, hideElevatorPanel } from "../entity/map/elevator";
import { popupPos } from "../entity/works";
import startScene from "../entity/map/startScene";

export function playerOnMapCreate() {
  return {
    prevTile: null,
    prevTileName: null,
  };
}

/**
 * 플레이어가 위치한 타일에 따라 특정 동작을 함
 */
export function playerOnMapUpdate(playerOnMap, player, map, scene) {
  const playerX = player.phaser.x;
  const playerY = player.phaser.y;
  const curTile = map.interactionLayer.getTileAtWorldXY(playerX, playerY);
  const curTileName = curTile?.properties?.name;

  if (playerOnMap.prevTileName !== curTileName) {
    if (playerOnMap.prevTileName === "elevator") hideElevatorPanel();
    if (
      [
        "work-1",
        "work-2",
        "work-3",
        "work-4",
        "work-5",
        "work-6",
        "work-7",
        "work-8",
      ].includes(playerOnMap.prevTileName)
    )
      popupDestroy();

    // FIXME: it's hard to debug nested switch statement
    switch (scene.scene.key) {
      case "EntranceScene":
        switch (curTileName) {
          case "up":
            // 이거 다른 경우에도 추가하기?
            scene.socket.emit("moveFloor", {
              id: scene.socket.id,
              floor: "1F",
            });
            startScene(scene, "FirstFloorScene", { x: 16 * 5, y: 16 * 29 });
            break;
          default:
            break;
        }
        break;
      case "FirstFloorScene":
        switch (curTileName) {
          case "up":
            scene.socket.emit("moveFloor", {
              id: scene.socket.id,
              floor: "2F",
            });
            startScene(scene, "SecondFloorScene", { x: 16 * 3, y: 16 * 11 });
            break;
          case "down":
            scene.socket.emit("moveFloor", {
              id: scene.socket.id,
              floor: "B1",
            });
            startScene(scene, "FirstBasementScene", { x: 16 * 6, y: 16 * 32 });
            break;
          case "elevator":
            showElevatorPanel(scene, "1F");
            break;
          case "out":
            scene.socket.emit("moveFloor", {
              id: scene.socket.id,
              floor: "entrance",
            });
            // 이거왜안됨..
            startScene(scene, "EntranceScene", { x: 16 * 27, y: 16 * 29 });
            break;
          default:
            break;
        }
        break;
      case "SecondFloorScene":
        switch (curTileName) {
          case "up":
            scene.socket.emit("moveFloor", {
              id: scene.socket.id,
              floor: "5F",
            });
            startScene(scene, "FifthFloorScene", { x: 16 * 3, y: 16 * 14 });
            break;
          case "down":
            scene.socket.emit("moveFloor", {
              id: scene.socket.id,
              floor: "1F",
            });
            startScene(scene, "FirstFloorScene", { x: 16 * 6, y: 16 * 14 });
            break;
          case "elevator":
            showElevatorPanel(scene, "2F");
            break;
          case "popup":
            break;
          default:
            break;
        }
        break;
      case "FifthFloorScene":
        switch (curTileName) {
          case "up":
            scene.socket.emit("moveFloor", {
              id: scene.socket.id,
              floor: "6F",
            });
            startScene(scene, "SixthFloorScene", { x: 16 * 3, y: 16 * 21 });
            break;
          case "down":
            scene.socket.emit("moveFloor", {
              id: scene.socket.id,
              floor: "2F",
            });
            startScene(scene, "SecondFloorScene", { x: 16 * 6, y: 16 * 13 });
            break;
          case "elevator":
            showElevatorPanel(scene, "5F");
            break;
          case "up2":
            scene.socket.emit("moveFloor", {
              id: scene.socket.id,
              floor: "6F",
            });
            startScene(scene, "SixthFloorScene", { x: 16 * 46, y: 16 * 26 });
            break;
          default:
            break;
        }
        break;
      case "SixthFloorScene":
        switch (curTileName) {
          case "up":
            scene.socket.emit("moveFloor", {
              id: scene.socket.id,
              floor: "7F",
            });
            startScene(scene, "SeventhFloorScene", { x: 16 * 3, y: 16 * 13 });
            break;
          case "down":
            scene.socket.emit("moveFloor", {
              id: scene.socket.id,
              floor: "5F",
            });
            startScene(scene, "FifthFloorScene", { x: 16 * 6, y: 16 * 13 });
            break;
          case "elevator":
            showElevatorPanel(scene, "6F");
            break;
          case "down2":
            scene.socket.emit("moveFloor", {
              id: scene.socket.id,
              floor: "5F",
            });
            startScene(scene, "FifthFloorScene", { x: 16 * 46, y: 16 * 22 });
            break;
          default:
            break;
        }
        break;
      case "SeventhFloorScene":
        switch (curTileName) {
          case "up":
            scene.socket.emit("moveFloor", {
              id: scene.socket.id,
              floor: "8F",
            });
            startScene(scene, "EighthFloorScene", { x: 16 * 3, y: 16 * 20 });
            break;
          case "down":
            scene.socket.emit("moveFloor", {
              id: scene.socket.id,
              floor: "6F",
            });
            startScene(scene, "SixthFloorScene", { x: 16 * 6, y: 16 * 21 });
            break;
          case "elevator":
            showElevatorPanel(scene, "7F");
            break;
          case "popup":
            break;
          default:
            break;
        }
        break;
      case "EighthFloorScene":
        switch (curTileName) {
          case "up":
            break;
          case "down":
            scene.socket.emit("moveFloor", {
              id: scene.socket.id,
              floor: "7F",
            });
            startScene(scene, "SeventhFloorScene", { x: 16 * 6, y: 16 * 13 });
            break;
          case "elevator":
            break;
          case "popup":
            break;
          default:
            break;
        }
        break;
      case "FirstBasementScene":
        switch (curTileName) {
          case "up":
            scene.socket.emit("moveFloor", {
              id: scene.socket.id,
              floor: "1F",
            });
            startScene(scene, "FirstFloorScene", { x: 16 * 3, y: 16 * 13 });
            break;
          case "down":
            scene.socket.emit("moveFloor", {
              id: scene.socket.id,
              floor: "B2",
            });
            startScene(scene, "SecondBasementScene", { x: 16 * 6, y: 16 * 13 });
            break;
          case "elevator":
            showElevatorPanel(scene, "B1");
            break;
          case "down2":
            scene.socket.emit("moveFloor", {
              id: scene.socket.id,
              floor: "B2",
            });
            startScene(scene, "SecondBasementScene", {
              x: 16 * 37,
              y: 16 * 16,
            });
            break;
          case "down3":
            scene.socket.emit("moveFloor", {
              id: scene.socket.id,
              floor: "B2",
            });
            startScene(scene, "SecondBasementScene", { x: 16 * 3, y: 16 * 35 });
            break;
          case "work-1":
            if (document.getElementById("work-1") == null) {
              popupCreate(scene, popupPos[1], 1);
              // FIXME: it seems a bug
              break;
            }

          case "work-2":
            if (document.getElementById("work-2") == null) {
              popupCreate(scene, popupPos[2], 2);
              // FIXME: it seems a bug
              break;
            }
          case "work-3":
            if (document.getElementById("work-3") == null) {
              popupCreate(scene, popupPos[3], 3);
              // FIXME: it seems a bug
              break;
            }
          case "work-4":
            if (document.getElementById("work-4") == null) {
              popupCreate(scene, popupPos[4], 4);
              // FIXME: it seems a bug
              break;
            }
          default:
            break;
        }
        break;
      case "SecondBasementScene":
        switch (curTileName) {
          case "up":
            scene.socket.emit("moveFloor", {
              id: scene.socket.id,
              floor: "B1",
            });
            startScene(scene, "FirstBasementScene", { x: 16 * 6, y: 16 * 32 });
            break;
          case "elevator":
            showElevatorPanel(scene, "B2");
            break;
          case "up3":
            scene.socket.emit("moveFloor", {
              id: scene.socket.id,
              floor: "B1",
            });
            startScene(scene, "FirstBasementScene", { x: 16 * 3, y: 16 * 55 });
            break;
          case "work-5":
            if (document.getElementById("work-5") == null) {
              popupCreate(scene, popupPos[5], 5);
              // FIXME: it seems a bug
              break;
            }
          case "work-6":
            if (document.getElementById("work-6") == null) {
              popupCreate(scene, popupPos[6], 6);
              // FIXME: it seems a bug
              break;
            }
          case "work-7":
            if (document.getElementById("work-7") == null) {
              popupCreate(scene, popupPos[7], 7);
              // FIXME: it seems a bug
              break;
            }
          case "work-8":
            if (document.getElementById("work-8") == null) {
              popupCreate(scene, popupPos[8], 8);
              // FIXME: it seems a bug
              break;
            }
          default:
            break;
        }
        break;
      default:
        break;
    }
  }

  return {
    ...playerOnMap,
    prevTile: curTile,
    prevTileName: curTile?.properties?.name,
  };
}
