from threading import Lock


class Players():
    "manages all players"

    def __init__(self):
        self.players = {}
        self.players_sid_to_id = {}
        self.players_id_to_password = {}
        self.players_changed = False
        self.players_lock = Lock()
        pass

    def add_player(self, player, sid, password):
        self.players_lock.acquire()
        try:
            self.players_changed = True
            self.players_sid_to_id[sid] = player.id
            self.players_id_to_password[player.id] = password
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

    def remove_player(self, player_id, sid):
        player_id = None
        self.players_lock.acquire()
        try:
            self.players_changed = True
            player_id = players_sid_to_id.get(sid)
            if player_id is not None:
                players.pop(player_id, None)
                players_sid_to_id.pop(request.sid)
                players_id_to_password.pop(player_id)
        finally:
            players_lock.release()
        if player_id is not None:
            emit('removePlayer', {'id': player_id}, broadcast=True)
