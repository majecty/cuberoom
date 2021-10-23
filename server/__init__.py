from flask import Flask, request, url_for
from flask.helpers import send_from_directory
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_cors import CORS
from threading import Lock
import threading
import time
import sys
import os
import sentry_sdk
import json

with open('../client/package.json', 'r') as package_json:
    data = package_json.read()
    version = json.loads(data)['version'] 

cuberoom_env = os.getenv('CUBEROOM_ENV')

config_values = {}
config_values["local"] = {
  "static_url_path": "/static",
  "static_folder": "../client/public/static",
  "cors_origin": "*",
  "public_path": "../client/public",
  "user_image_prefix": "character-resource", # empty
  "sentry": {
    "debug": True,
    "environment": "development"
  },
  "port": 3000
}

config_values["staging"] = {
  "static_url_path": "/static",
  "static_folder": "../client/public/static",
  "cors_origin": "http://test.cuberoom.net",
  "public_path": "../client/public", # please check this in the deployed environment
  "user_image_prefix": "character-resource",
  "sentry": {
    "debug": False,
    "environment": "staging"
  },
  "port": 5003 # default port in flask
}

config_values["production"] = {
  "static_url_path": "/static",
  "static_folder": "../client/public/static",
  "cors_origin": "http://cuberoom.net",
  "public_path": "../client/public", # please check this in the deployed environment
  "user_image_prefix": "character-resource",
  "sentry": {
    "debug": True,
    "environment": "production"
  },
  "port": 5002 # default port in flask
}

config_values["prev"] = {
  "static_url_path": "/static",
  "static_folder": "../client/public/static",
  "cors_origin": "http://prev.cuberoom.net",
  "public_path": "../client/public", # please check this in the deployed environment
  "user_image_prefix": "character-resource",
  "sentry": {
    "debug": True,
    "environment": "prev"
  },
  "port": 5001 # default port in flask
}

if cuberoom_env not in ["local", "production", "staging", "prev"]:
    sys.exit("please set CUBEROOM_ENV environment variable to `local` or `production`, `staging`, `prev`")

config_value = config_values[cuberoom_env]

sentry_sdk.init(
    "https://21f1b2ad5efb452684d66b18467ae893@o1013913.ingest.sentry.io/5979255",

    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    # We recommend adjusting this value in production.
    traces_sample_rate=0.1,
    debug=config_value['sentry']['debug'],
    environment=config_value['sentry']['environment'],
    release=f'cuberoom@{version}'
)

app = Flask(__name__, static_url_path=config_value["static_url_path"],
  static_folder=config_value["static_folder"])
CORS(app, resources={r'*': {'origins': config_value["cors_origin"]}})

app.secret_key = "cuberoom"
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")

@app.route("/<string:text>")
def base_all(text):
    return send_from_directory(config_value['public_path'],'index.html')

@app.route("/")
def base():
    return send_from_directory(config_value['public_path'],'index.html')

@app.route("/character-selection",methods=['POST'])
def user_information():
    name = request.get_json()["name"]
    faceS = request.get_json()["faceS"]
    hairS = request.get_json()["hairS"]
    hairC = request.get_json()["hairC"]
    skin =  request.get_json()["skin"]
    cloth = request.get_json()["cloth"]
    prefix = config_value["user_image_prefix"]

    filePath = f"{prefix}/skin{skin}_hairC{hairC}_cloth{cloth}_hairS{hairS}_faceS{faceS}/"
    return url_for('static', filename = filePath)

# map by id
players = {}
players_sid_to_id = {}
players_id_to_password = {}
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

def validatePassword(sid, data):
    "do not use in the players_lock"
    global players, players_sid_to_id, players_id_to_password
    id = data["id"]
    password = data["password"]

    match_password = players_id_to_password.get(id) == password
    match_sid = players_sid_to_id.get(sid) == id

    if match_password == False:
        return "fail"

    if match_sid == True:
        return "success"

    return "relogin"

def beforeRequest(sid, data):
    global players_lock, players_sid_to_id
    validation_result = validatePassword(sid, data)
    if validation_result == "fail":
        emit('debugMessage', "invalid password")
        emit('needLogin')
        return "fail"
    if validation_result == "relogin":
        emit('debugMessage', "relogin")
        emit('needLogin')
        return "fail"
    return "success"

@socketio.on('addPlayer')
def addPlayer(data):
    global players, players_changed, players_lock, players_sid_to_id, players_id_to_password

    player = Player(data['id'], data['name'], data['imgUrl'], data['floor'], data['x'], data['y'])
    players_lock.acquire()
    try:
        players_changed = True
        players_sid_to_id[request.sid] = data['id']
        players_id_to_password[data['id']] = data['password']
        players[data['id']] = player.serialize()
    finally:
        players_lock.release()

    join_room(player.floor)

    # FIXME: players can be changed after emit
    emit('playerList', players, broadcast=True, to=player.floor)

@socketio.on('moveFloor')
def moveFloor(data):
    global players, players_changed, players_lock

    validation_result = beforeRequest(request.sid, data)
    if validation_result == "fail":
        return

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

    validation_result = beforeRequest(request.sid, data)
    if validation_result == "fail":
        return

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

    validation_result = beforeRequest(request.sid, data)
    if validation_result == "fail":
        return

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

    validation_result = beforeRequest(request.sid, data)
    if validation_result == "fail":
        return

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

@socketio.on("debugMessage")
def debugMessage(data):
    print(data)

@socketio.on('disconnect')
def disconnect():
    global players, players_changed, players_lock

    id = None
    players_lock.acquire()
    try:
        players_changed = True
        id = players_sid_to_id.get(request.sid)
        if id != None:
            players.pop(id, None)
            players_sid_to_id.pop(request.sid)
            players_id_to_password.pop(id)
    finally:
        players_lock.release()
    if id != None:
        emit('removePlayer', { 'id': id }, broadcast=True)

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
