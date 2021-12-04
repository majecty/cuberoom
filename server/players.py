from threading import Lock
from sid_container import SidContainer
from password_container import PasswordContainer


class Players():
    "manages all players"

    def __init__(self):
        self.players = {}
        self.sid_container = SidContainer()
        self.password_container = PasswordContainer()
        self.players_changed = False
        self.players_lock = Lock()

    def validate_password(self, sid, data):
        "do not use in the players_lock"
        player_id = data["id"]
        password = data["password"]

        match_password = self.password_container.match_password(
            player_id, password)
        match_sid = self.sid_container.get(sid) == player_id

        if not match_password:
            return "fail"

        if match_sid:
            return "success"

        return "relogin"

    def add_player(self, player, sid, password):
        self.players_lock.acquire()
        try:
            self.players_changed = True
            self.sid_container.add(sid, player.id)
            self.password_container.add(player.id, password)
            self.players[player.id] = player
        finally:
            self.players_lock.release()

    def move_floor(self, player_id, floor):
        self.players_lock.acquire()
        try:
            self.players_changed = True
            prev_room = self.players[player_id].floor
            next_room = floor

            player = self.players[player_id]
            player.floor = next_room
            # move player away until the player move to the right position at the
            # next floor
            player.x = 9999
            player.y = 9999
        finally:
            self.players_lock.release()

        return (prev_room, next_room)

    def add_chat(self, player_id, chat):
        self.players_lock.acquire()
        try:
            self.players_changed = True
            self.players[player_id].chat = chat
        finally:
            self.players_lock.release()
        return self.players[player_id]

    def remove_chat(self, player_id):
        self.players_lock.acquire()
        try:
            self.players_changed = True
            self.players[player_id].chat = ''
        finally:
            self.players_lock.release()
        return self.players[player_id]

    def move_player(self, player_id, x, y, direction):
        self.players_lock.acquire()
        try:
            self.players_changed = True

            if player_id in self.players:
                player = self.players[player_id]
                player.x = x
                player.y = y
                player.direction = direction
        finally:
            self.players_lock.release()

    def remove_player(self, sid):
        player_id = None
        self.players_lock.acquire()
        try:
            self.players_changed = True
            player_id = self.sid_container.get(sid)
            if player_id is not None:
                self.sid_container.remove(sid)
                self.players.pop(player_id, None)
                self.password_container.remove(player_id)
        finally:
            self.players_lock.release()
        return player_id

    def get_players_to_share(self):
        self.players_lock.acquire()
        try:
            self.players_changed = True
            if self.players_changed:
                return self.serialize()
        finally:
            self.players_lock.release()
        return None

    def serialize(self):
        return {player_id: player.serialize()
                for player_id, player in self.players.items()}
