import { loadFromBrowserStorage, loadIdAndPassword } from "../pages/storage";

export function getPlayerId() {
  const id = loadFromBrowserStorage("id");
  return id;
}

function getPlayers(socket) {
  if (socket.disconnected) {
    return;
  }
  socket.emit("getPlayers");
}

/**
 * @param {string} floor
 */
function moveFloor(socket, floor) {
  if (socket.disconnected) {
    return;
  }
  socket.emit("moveFloor", {
    ...loadIdAndPassword(),
    floor,
  });
}

function addPlayer(socket, { name, imgUrl, floor, x, y }) {
  if (socket.disconnected) {
    return;
  }
  socket.emit("addPlayer", {
    ...loadIdAndPassword(),
    name,
    imgUrl,
    floor,
    x,
    y,
  });
}

function addChat(socket, chat) {
  if (socket.disconnected) {
    return;
  }
  socket.emit("addChat", {
    ...loadIdAndPassword(),
    chat,
  });
}

function removeChat(socket) {
  if (socket.disconnected) {
    return;
  }
  socket.emit("removeChat", {
    ...loadIdAndPassword(),
  });
}

function movePlayer(socket, { floor, direction, x, y }) {
  if (socket.disconnected) {
    return;
  }
  socket.emit("movePlayer", {
    ...loadIdAndPassword(),
    floor,
    direction,
    x,
    y,
  });
}

export const protocol = {
  getPlayers,
  moveFloor,
  addPlayer,
  addChat,
  removeChat,
  movePlayer,
};
