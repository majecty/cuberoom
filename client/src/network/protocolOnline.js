import { io } from "socket.io-client";
import { loadFromBrowserStorage, loadIdAndPassword } from "../pages/storage";
import ENV from "../../ENV";

function createSocket() {
  const socket =
    ENV.ENVIRONMENT === "production"
      ? io.connect(ENV.GET_SOCKETIO_URL(), { transports: ["websocket"] })
      : io.connect(ENV.GET_SOCKETIO_URL());
  return socket;
}

function socketConnect(socket) {
  socket.connect();
}

function getPlayerId() {
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

function onDisconnect(socket, callback) {
  socket.on("disconnect", (reason) => {
    callback(reason);
  });
}

function onConnectError(socket, callback) {
  socket.on("connect_error", callback);
}

function onNeedLogin(socket, callback) {
  socket.on("needLogin", callback);
}

function onDebugMessage(socket, callback) {
  socket.on("debugMessage", callback);
}

function onConnect(socket, callback) {
  socket.on("connect", callback);
}

function onRemovePlayer(socket, callback) {
  socket.on("removePlayer", callback);
}

function onPlayerList(socket, callback) {
  socket.on("playerList", callback);
}

function onDebugPlayerList(socket, callback) {
  socket.on("debugPlayerList", callback);
}

function onAddChat(socket, callback) {
  socket.on("addChat", callback);
}

function onRemoveChat(socket, callback) {
  socket.on("removeChat", callback);
}

/* eslint-disable import/prefer-default-export */
export const protocol = {
  createSocket,
  socketConnect,

  getPlayers,
  moveFloor,
  addPlayer,
  addChat,
  removeChat,
  movePlayer,

  onDisconnect,
  onConnectError,
  onNeedLogin,
  onDebugMessage,
  onConnect,
  onRemovePlayer,
  onPlayerList,
  onDebugPlayerList,
  onAddChat,
  onRemoveChat,
};
