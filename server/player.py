

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
