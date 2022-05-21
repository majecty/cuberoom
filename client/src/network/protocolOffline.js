import { createNanoEvents } from "nanoevents";
import { loadFromBrowserStorage, loadIdAndPassword } from "../pages/storage";

function callNextTick(callback) {
  setTimeout(callback, 0);
}

function deepCopy(x) {
  return JSON.parse(JSON.stringify(x));
}

function createSocket() {
  const emitter = createNanoEvents();
  const socket = {
    emitter,
    players: [],
  };

  callNextTick(() => socket.emitter.emit("connect"));

  return socket;
}

function socketConnect(socket) {
  callNextTick(() => socket.emitter.emit("connect"));
}

function getPlayerId() {
  const id = loadFromBrowserStorage("id");
  return id;
}

// debugPlayerList
// debugMesage
function getPlayers(socket) {
  if (socket.disconnected) {
    return;
  }
  // do nothing
  //callNextTick(() => socket.emit("playerList"));
}

/**
 * @param {string} floor
 */
function moveFloor(socket, floor) {
  if (socket.disconnected) {
    return;
  }

  socket.players[0].floor = floor;


  // emit removePlayer
  // emit playerList
}

function addPlayer(socket, { name, imgUrl, floor, x, y }) {
  if (socket.disconnected) {
    return;
  }
  socket.players = [{
    ...loadIdAndPassword(),
    name,
    imgUrl,
    floor,
    x,
    y,
  }];

  //callNextTick(() => socket.emitter.emit("playerList",
    //deepCopy(socket.players),
  //));
  // emit playerlist
}

function addChat(socket, chat) {
  if (socket.disconnected) {
    return;
  }
  //socket.emit("addChat", {
    //...loadIdAndPassword(),
    //chat,
  //});

  callNextTick(() => {
    socket.emitter.emit("addChat", {
      id: socket.players[0].id,
      chat,
      floor: socket.players[0].floor,
    });
  });
}

function removeChat(socket) {
  if (socket.disconnected) {
    return;
  }
  //socket.emitter.emit("removeChat", {
    //...loadIdAndPassword(),
  //});

  callNextTick(() => {
    socket.emitter.emit("removeChat", {
      id: socket.players[0].id,
      chat: "",
      floor: socket.players[0].floor,
    });
  });
}

function movePlayer(socket, { floor, direction, x, y }) {
  if (socket.disconnected) {
    return;
  }
  socket.emitter.emit("movePlayer", {
    ...loadIdAndPassword(),
    floor,
    direction,
    x,
    y,
  });
}

function onDisconnect(socket, callback) {
  socket.emitter.on("disconnect", (reason) => {
    callback(reason);
  });
}

function onConnectError(socket, callback) {
  socket.emitter.on("connect_error", callback);
}

function onNeedLogin(socket, callback) {
  socket.emitter.on("needLogin", callback);
}

function onDebugMessage(socket, callback) {
  socket.emitter.on("debugMessage", callback);
}

function onConnect(socket, callback) {
  socket.emitter.on("connect", callback);
}

function onRemovePlayer(socket, callback) {
  socket.emitter.on("removePlayer", callback);
}

function onPlayerList(socket, callback) {
  socket.emitter.on("playerList", callback);
}

function onDebugPlayerList(socket, callback) {
  socket.emitter.on("debugPlayerList", callback);
}

function onAddChat(socket, callback) {
  socket.emitter.on("addChat", callback);
}

function onRemoveChat(socket, callback) {
  socket.emitter.on("removeChat", callback);
}

/* eslint-disable import/prefer-default-export */
export const protocol = {
  createSocket,
  socketConnect,
  getPlayerId,

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
