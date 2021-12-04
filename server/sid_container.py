class SidContainer():
    def __init__(self):
        self.sid_to_id = {}

    def add(self, sid, id):
        self.sid_to_id[sid] = id

    def get(self, sid):
        return self.sid_to_id.get(sid)

    def remove(self, sid):
        self.sid_to_id.pop(sid, None)
