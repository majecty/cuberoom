from threading import Lock
import threading
import time
from flask import Flask, request, url_for
from flask.helpers import send_from_directory
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_cors import CORS

from player import Player
from config import load_config
from players import Players

config_value = load_config()

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

new_players = Players()


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

    new_players.add_player(player)

    join_room(player.floor)

    emit('playerList', players, broadcast=True, to=player.floor)


@socketio.on('moveFloor')
def move_floor(data):
    validation_result = before_request(request.sid, data)
    if validation_result == "fail":
        return

    player_id = data['id']
    (prev_room, next_room) = players.move_floor(player_id, data["floor"])
    leave_room(prev_room)
    join_room(next_room)

    emit('removePlayer', {'id': player_id}, broadcast=True)
    emit('playerList', players, broadcast=True, to=next_room)


@socketio.on('addChat')
def add_chat(data):
    validation_result = before_request(request.sid, data)
    if validation_result == "fail":
        return

    player = players.add_chat(data["id"], data["chat"])
    floor = player.floor

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
    validation_result = before_request(request.sid, data)
    if validation_result == "fail":
        return

    floor = players.remove_chat(data["id"])

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
    validation_result = before_request(request.sid, data)
    if validation_result == "fail":
        return

    players.move_player(data["id"], data["x"], data["y"],
                        data["direction"])


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
