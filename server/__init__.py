from flask import Flask, request, url_for
from flask.helpers import send_from_directory
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_cors import CORS
from threading import Lock
import threading
import time
import sys
import os

cuberoom_env = os.getenv('CUBEROOM_ENV')

config_values = {}
config_values["local"] = {
  "static_url_path": "",
  "static_folder": "../client/public/static",
  "cors_origin": "*",
  "public_path": "../client/public",
  "user_image_prefix": "character-resource", # empty
  "port": 3000
}

config_values["production"] = {
  "static_url_path": "/static",
  "static_folder": "../client/public/static",
  "cors_origin": "http://test.cuberoom.net",
  "public_path": "../client/public", # please check this in the deployed environment
  "user_image_prefix": "character-results",
  "port": 5000 # default port in flask
}

if cuberoom_env not in ["local", "production"]:
    sys.exit("please set CUBEROOM_ENV environment variable to `local` or `production`")

config_value = config_values[cuberoom_env]

app = Flask(__name__, static_url_path=config_value["static_url_path"],
  static_folder=config_value["static_folder"])
CORS(app, resources={r'*': {'origins': config_value["cors_origin"]}})

app.secret_key = "cuberoom"
socketio = SocketIO(app, cors_allowed_origins="*")
@app.route("/*")
def base():
    return send_from_directory(config_value['public_path'],'index.html')

@app.route("/character-selection",methods=['GET', 'POST'])
def user_information():
    name = request.get_json()["name"]
    faceS = request.get_json()["faceS"]
    hairS = request.get_json()["hairS"]
    hairC = request.get_json()["hairC"]
    skin =  request.get_json()["skin"]
    cloth = request.get_json()["cloth"]
    prefix = config_value["user_image_prefix"]

    filePath = f"{prefix}/skin{skin}_hairC{hairC}_cloth{cloth}_hairS{hairS}_faceS{faceS}/"
    return url_for('static',filename = filePath)

players = {}
players_changed = False
players_lock = Lock()

class Player():
    def __init__ (self, id, name, imgUrl, floor, x, y):
        self.id = id
        self.name = name
        self.imgUrl = imgUrl
        self.floor = floor
        self.x = x
        self.y = y
        self.chat = ''
        self.direction = 'down'

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'imgUrl': self.imgUrl,
            'floor': self.floor,
            'x': self.x,
            'y': self.y,
            'chat': self.chat,
            'direction': self.direction,
        }

@socketio.on('addPlayer')
def addPlayer(data):
    global players, players_changed, players_lock

    player = Player(data['id'], data['name'], data['imgUrl'], data['floor'], data['x'], data['y'])
    players_lock.acquire()
    try:
        players_changed = True
        players[data['id']] = player.serialize()
    finally:
        players_lock.release()

    join_room(player.floor)

    # FIXME: players can be changed after emit
    emit('playerList', players, broadcast=True, to=player.floor)

@socketio.on('moveFloor')
def moveFloor(data):
    global players, players_changed, players_lock

    players_lock.acquire()
    try:
        players_changed = True
        prevRoom = players[data['id']]['floor']
        nextRoom = data['floor']
        players[data['id']]['floor'] = nextRoom
        # move player away until the player move to the right position at the next floor
        players[data['id']]['x'] = 999
        players[data['id']]['y'] = 999
    finally:
        players_lock.release()

    leave_room(prevRoom)
    join_room(nextRoom)

    emit('removePlayer', { 'id': data['id'] }, broadcast=True)
    emit('playerList', players, broadcast=True, to=nextRoom)

@socketio.on('addChat')
def addChat(data):
    global players, players_changed, players_lock

    players_lock.acquire()
    try:
        players_changed = True
        players[data['id']]['chat'] = data['chat']
    finally:
        players_lock.release()
    floor = players[data['id']]['floor']

    emit(
        'addChat',
        {
            'id': data['id'],
            'chat': data['chat'],
            'floor': floor,
        },
        broadcast=True,
        to=floor
    )

@socketio.on('removeChat')
def removeChat(data):
    global players, players_changed, players_lock

    players_lock.acquire()
    try:
        players_changed = True
        players[data['id']]['chat'] = ''
    finally:
        players_lock.release()
    floor = players[data['id']]['floor']

    emit(
        'removeChat',
        {
            'id': data['id'],
            'chat': '',
            'floor': floor,
        },
        broadcast=True,
        to=floor
    )

@socketio.on('movePlayer')
def movePlayer(data):
    global players, players_changed, players_lock

    players_lock.acquire()
    try:
        players_changed = True
        if data['id'] in players.keys():
            players[data['id']]['x'] = data['x']
            players[data['id']]['y'] = data['y']
            players[data['id']]['direction'] = data['direction']
    finally:
        players_lock.release()

@socketio.on('getPlayers')
def getPlayers():
    global players
    emit('debugPlayerList', players)
    emit('debugMessage', players)

@socketio.on('disconnect')
def disconnect():
    global players, players_changed, players_lock

    players_lock.acquire()
    try:
        players_changed = True
        players.pop(request.sid, None)
    finally:
        players_lock.release()
    emit('removePlayer', { 'id': request.sid })

def broadcastPlayserListLoop():
    while True:
        global players_changed
        socketio.sleep(0.3)

        players_lock.acquire()
        players_changed_local = players_changed
        players_lock.release()
        if players_changed_local == False:
            continue

        players_lock.acquire()
        players_changed = False
        players_lock.release()
        # TODO: only send players room by room
        socketio.emit('playerList', players, broadcast=True)

thread = None
@socketio.on('connect')
def connect_for_main():
    global thread
    if thread is None:
        thread = socketio.start_background_task(target=broadcastPlayserListLoop)

if __name__ == "__main__":
    socketio.run(app, debug=True, port=config_value["port"], host="0.0.0.0")
