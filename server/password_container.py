class PasswordContainer():
    def __init__(self):
        self.id_to_passwords = {}

    def match(self, id, password):
        if password is None:
            return False
        return self.id_to_passwords.get(id, None) == password

    def add(self, id, password):
        self.id_to_passwords[id] = password

    def remove(self, id):
        self.id_to_passwords.pop(id, None)
