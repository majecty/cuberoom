import { loadFromBrowserStorage } from "../pages/storage";

function loadIdAndPassword() {
  const id = loadFromBrowserStorage("id");
  const password = loadFromBrowserStorage("password");
  return {
    id,
    password,
  };
}

function getPlayers(socket) {
  socket.emit("getPlayers");
}

/**
 * @param {string} floor
 */
function moveFloor(socket, floor) {
  socket.emit("moveFloor", {
    ...loadIdAndPassword(),
    floor,
  });
}

function addPlayer(socket, { name, imgUrl, floor, x, y }) {
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
  socket.emit("addChat", {
    ...loadIdAndPassword(),
    chat,
  });
}

function removeChat(socket) {
  socket.emit("removeChat", {
    ...loadIdAndPassword(),
  });
}

export const protocol = {
  getPlayers,
  moveFloor,
  addPlayer,
  addChat,
  removeChat,
};
