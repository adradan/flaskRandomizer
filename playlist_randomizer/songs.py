import numpy as np
from .artist_ids import ArtistId


class Songs:
    """
    Searches for a 'This is ...' playlist for each given artist that is created by Spotify.
    Adds Playlist ID to the DataFrame.
    If no playlist is found, finds the artists top ten songs instead.
    """
    def __init__(self, artist_list=None, token=None):
        self.artist_id = ArtistId(artist_list=artist_list, token=token)
        self.df = self.artist_id.start()
        self.sp = self.artist_id.sp

    def top_ten(self, artist_index):
        """ Grabs the top ten tracks from the given artist
        """
        top = self.sp.artist_top_tracks(self.df.loc[artist_index, 'ID'])
        top = top['tracks']
        for pos, track in enumerate(top):
            column = f'Song_{pos}'
            self.add_id(artist_index, track['id'], column)

    def add_id(self, index, spotify_id, column_name):
        """ Adds a column to the corresponding row """
        self.df.loc[index, column_name] = spotify_id


    def grab_index(self, artist_name):
        """ Grabs row index of the artist """
        for index in self.df.index:
            if self.df.loc[index, 'Name'] == artist_name:
                return index
        # If there is no index with the matching artist, big problem.
        return False

    def check_playlist(self, artist_name, playlist_name, creator_name):
        """ Checks if the found playlist is an official 'This is ...' playlist.
            Compares playlist author names and playlist name. """
        artist_name = artist_name.lower().strip()
        playlist_name = playlist_name.lower().strip()
        creator_name = creator_name.lower().strip()
        playlist_check = f'this is {artist_name}'
        # If the query is both the playlist and made by Spotify,
        # continues with finding the correct index of the artist in the DF
        index = self.grab_index(artist_name.title())
        if index or int(index) == 0:
            pass
        else:
            return False
        if (playlist_name == playlist_check) and (creator_name == 'spotify'):
            return index
        else:
            # Playlist not found, returning artist's index.
            index = [index, 1]
            return index

    def song_choices(self, items):
        """ Randomly chooses 10 numbers within the size of the playlist w/o replacement """
        num_list = []
        for num, song in enumerate(items):
            num_list.append(num)
        choices = np.random.choice(num_list, size=10, replace=False)
        return choices

    def add_songs(self, choices, playlist, artist_index):
        """ Adds randomly chosen songs' IDs from playlist to DF """
        items = playlist['items']
        for pos, num in enumerate(choices):
            song_id = items[num]['track']['id']
            column = f'Song_{pos}'
            self.add_id(artist_index, song_id, column)

    def spotify_search(self, artist_name):
        """ Queries Spotify for a playlist and returns the index of the corresponding artist in the DF
            Also returns the search results"""
        artist_query = artist_name.strip().replace(' ', '+')
        playlist = f'This+is+{artist_query}'
        search = self.sp.search(q=playlist, type='playlist', limit=1)
        search = search['playlists']['items'][0]
        playlist_name = search['name']
        creator_name = search['owner']['display_name']
        check = self.check_playlist(artist_name, playlist_name, creator_name)
        return check, search

    def check_index(self, artist_name):
        """ Starts the playlist search and searches for artist within the DataFrame """
        this_is_index, search = self.spotify_search(artist_name)
        # If a playlist is found, it will add the playlist ID to the Dataframe.'
        if type(this_is_index) is int:
            self.add_id(this_is_index, search['id'], 'Playlist')
            pl = self.sp.playlist_tracks(search['id'])
            choices = self.song_choices(pl['items'])
            self.add_songs(choices, pl, this_is_index)
        elif type(this_is_index) is list:
            this_is_index = this_is_index[0]
            self.top_ten(this_is_index)

    def start_init_search(self):
        # Starts search for every artist.
        for name in self.df['Name']:
            self.check_index(name)
        return self.df
