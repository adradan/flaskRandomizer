from .songs import Songs


class Playlist:
    """
    Creates a Playlist named after the username and adds selected songs to it
    """
    def __init__(self, artist_list, token):
        self.playlist = None
        self.song = Songs(artist_list=artist_list, token=token)
        self.df = self.song.start_init_search()
        self.sp = self.song.sp
        self.user = self.sp.current_user()
        self.songs = []
        self.create_playlist()
        self.resp = {'user_name': self.user['display_name']}

    def create_playlist(self):
        """ Creates the Playlist """
        user_name = self.user['display_name']
        user_id = self.user['id']
        playlist_name = f'This is {user_name}'
        description = f'Compilation of {user_name}\'s favorite artists.'
        context = {'user': user_id,
                   'name': playlist_name,
                   'public': True,
                   'description': description}
        self.grab_ids()
        self.playlist = self.sp.user_playlist_create(**context)
        self.add_songs(user_id)
        print(f'\'This is {user_name}\' has been successfully created.')

    def grab_ids(self):
        """ Grabs the song IDs from DF """
        for i in range(0, 10):
            song_num = f'Song_{i}'
            song_ids = self.df[song_num].values
            for s_id in song_ids:
                self.songs.append(s_id)

    def add_songs(self, user_id):
        """ Adds songs to created playlist """
        pl_id = self.playlist['id']
        self.sp.user_playlist_add_tracks(user_id, pl_id, self.songs)
