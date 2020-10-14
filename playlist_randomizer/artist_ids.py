from . import exceptions as ex
import pandas as pd
from . import authenticate

class ArtistId:
    """
    Asks for a number of artists and searches for them within Spotify
    Adds each Artist's Spotify ID and Name into a DataFrame and will throw errors if no matches are found.
    """
    def __init__(self, artist_list=None, token=None):
        self.artist_list = artist_list
        self.token = token
        self.df = None
        self.data = {'Name': [],
                     'ID': []}
        self.num_artists = None
        self.sp = None

    def create_table(self):
        """ Creates a DataFrame """
        self.df = pd.DataFrame(self.data)

    def search_id(self, artist):
        """
        Searches for Artist
        Will return no match if not exact artist is found, otherwise, returns artist id and name
        """
        artist_list = []
        result = self.sp.search(q=artist, type='artist', limit=2)
        result = result['artists']['items'][0]
        artist_name = result['name']
        artist_id = result['id']
        artist_list.append(artist_name)
        artist_list.append(artist_id)
        return artist_list

    def number_of_artists(self):
        """ Asks for how many artists they want """
        self.num_artists = len(self.artist_list)
        self.sp = authenticate.auth(self.token)
        for key, value in self.artist_list.items():
            search_result = self.search_id(value)
            self.data['Name'].append(search_result[0])
            self.data['ID'].append(search_result[1])

    def start(self):
        """ Starts process """
        self.number_of_artists()
        # self.artist_data(self.num_artists)
        self.create_table()
        return self.df
