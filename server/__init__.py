from threading import Lock
import threading
import time
import sys
import os
import sentry_sdk
import json
from flask import Flask, request, url_for
from flask.helpers import send_from_directory
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_cors import CORS


def load_version():
    with open('../client/package.json', 'r', encoding='utf-8') as package_json:
        data = package_json.read()
        return json.loads(data)['version']


version = load_version()

cuberoom_env = os.getenv('CUBEROOM_ENV')

config_values = {}
config_values["local"] = {
    "static_url_path": "/static",
    "static_folder": "../client/public/static",
    "cors_origin": "*",
    "public_path": "../client/public",
    "user_image_prefix": "character-resource",  # empty
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
    # please check this in the deployed environment
    "public_path": "../client/public",
    "user_image_prefix": "character-resource",
    "sentry": {
        "debug": False,
        "environment": "staging"
    },
    "port": 5003  # default port in flask
}

config_values["production"] = {
    "static_url_path": "/static",
    "static_folder": "../client/public/static",
    "cors_origin": "http://cuberoom.net",
    # please check this in the deployed environment
    "public_path": "../client/public",
    "user_image_prefix": "character-resource",
    "sentry": {
        "debug": True,
        "environment": "production"
    },
    "port": 5002  # default port in flask
}

config_values["prev"] = {
    "static_url_path": "/static",
    "static_folder": "../client/public/static",
    "cors_origin": "http://prev.cuberoom.net",
    # please check this in the deployed environment
    "public_path": "../client/public",
    "user_image_prefix": "character-resource",
    "sentry": {
        "debug": True,
        "environment": "prev"
    },
    "port": 5001  # default port in flask
}

if cuberoom_env not in ["local", "production", "staging", "prev"]:
    sys.exit("please set CUBEROOM_ENV environment variable to " +
             "`local` or `production`, `staging`, `prev`")

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
def base_all(_text):
    return send_from_directory(config_value['public_path'], 'index.html')


@app.route("/")
def base():
    return send_from_directory(config_value['public_path'], 'index.html')


@app.route("/character-selection", methods=['POST'])
def user_information():
    face_s = request.get_json()["faceS"]
    hair_s = request.get_json()["hairS"]
    hair_c = request.get_json()["hairC"]
    skin = request.get_json()["skin"]
    cloth = request.get_json()["cloth"]
    prefix = config_value["user_image_prefix"]

    file_path = f"{prefix}/skin{skin}_hairC{hair_c}_cloth{cloth}_hairS{hair_s}_faceS{face_s}/"
    return url_for('static', filename=file_path)


# map by id
players = {}
players_sid_to_id = {}
players_id_to_password = {}
players_changed = False
players_lock = Lock()


class Player():
    def __init__(self, player_id, name, img_url, floor, x, y):
        self.id = player_id
        self.name = name
        self.img_url = img_url
        self.floor = floor
        self.x = x
        self.y = y
        self.chat = ''
        self.direction = 'down'

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'imgUrl': self.img_url,
            'floor': self.floor,
            'x': self.x,
            'y': self.y,
            'chat': self.chat,
            'direction': self.direction,
        }


def validate_password(sid, data):
    "do not use in the players_lock"
    player_id = data["id"]
    password = data["password"]

    match_password = players_id_to_password.get(player_id) == password
    match_sid = players_sid_to_id.get(sid) == player_id

    if not match_password:
        return "fail"

    if match_sid:
        return "success"

    return "relogin"


def before_request(sid, data):
    validation_result = validate_password(sid, data)
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
def add_player(data):
    global players_changed

    player = Player(
        data['id'],
        data['name'],
        data['imgUrl'],
        data['floor'],
        data['x'],
        data['y'])
    players_lock.acquire()
    try:
        players_changed = True
        players_sid_to_id[request.sid] = data['id']
        players_id_to_password[data['id']] = data['password']
        players[data['id']] = player.serialize()
    finally:
        players_lock.release()

    join_room(player.floor)

    emit('playerList', players, broadcast=True, to=player.floor)


@socketio.on('moveFloor')
def move_floor(data):
    global players_changed

    validation_result = before_request(request.sid, data)
    if validation_result == "fail":
        return

    players_lock.acquire()
    try:
        players_changed = True
        prev_room = players[data['id']]['floor']
        next_room = data['floor']
        players[data['id']]['floor'] = next_room
        # move player away until the player move to the right position at the
        # next floor
        players[data['id']]['x'] = 999
        players[data['id']]['y'] = 999
    finally:
        players_lock.release()

    leave_room(prev_room)
    join_room(next_room)

    emit('removePlayer', {'id': data['id']}, broadcast=True)
    emit('playerList', players, broadcast=True, to=next_room)


@socketio.on('addChat')
def add_chat(data):
    global players_changed

    validation_result = before_request(request.sid, data)
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
def remove_chat(data):
    global players_changed

    validation_result = before_request(request.sid, data)
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
def move_player(data):
    global players_changed

    validation_result = before_request(request.sid, data)
    if validation_result == "fail":
        return

    players_lock.acquire()
    try:
        players_changed = True

        if data['id'] in players:
            players[data['id']]['x'] = data['x']
            players[data['id']]['y'] = data['y']
            players[data['id']]['direction'] = data['direction']
    finally:
        players_lock.release()


@socketio.on('getPlayers')
def get_players():
    emit('debugPlayerList', players)
    emit('debugMessage', players)


@socketio.on("debugMessage")
def debug_message(data):
    print(data)


@socketio.on('disconnect')
def disconnect():
    global players_changed

    player_id = None
    players_lock.acquire()
    try:
        players_changed = True
        player_id = players_sid_to_id.get(request.sid)
        if player_id is not None:
            players.pop(player_id, None)
            players_sid_to_id.pop(request.sid)
            players_id_to_password.pop(player_id)
    finally:
        players_lock.release()
    if player_id is not None:
        emit('removePlayer', {'id': player_id}, broadcast=True)


def broadcast_player_list_loop():
    while True:
        global players_changed
        socketio.sleep(0.3)

        players_lock.acquire()
        players_changed_local = players_changed
        players_lock.release()
        if not players_changed_local:
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
        thread = socketio.start_background_task(
            target=broadcast_player_list_loop)


if __name__ == "__main__":
    socketio.run(app, debug=True, port=config_value["port"], host="0.0.0.0")
#pylint: disable=missing-function-docstring
