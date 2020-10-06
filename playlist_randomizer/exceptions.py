class OutOfRange(Exception):
    def __init__(self, number, message='Number is not in (1, 10) range.'):
        self.number = number
        self.message = message
        super().__init__(self.message)


class ArtistNotFound(Exception):
    def __init__(self, artist, message='Artist not found'):
        self.artist = artist
        self.message = message
        super().__init__(self.message)

    def __str__(self):
        return f'{self.artist} -> {self.message}'


class NoDirectMatch(Exception):
    def __init__(self, artist, message='Did you mean'):
        self.artist = artist
        self.message = message
        super().__init__(self.message)

    def __str__(self):
        return f'{self.message} {self.artist}?'
