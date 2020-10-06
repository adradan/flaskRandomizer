import spotipy


def validate_query(artists_dict, token):
    sp = spotipy.Spotify(auth=token)
    for key, value in artists_dict.items():
        try:
            result = sp.search(q=value, type='artist', limit=2)
            result = result['artists']['items'][0]
            name = result['name']
            artist_id = result['id']
            if value.lower().replace(' ', '+') != name.lower():
                no_match = ['no match', name, artist_id]
                artists_dict[key] = no_match
                continue
        except IndexError:
            artists_dict[key] = [f'{value.replace("+", " ")}']
            continue
        artists_dict[key] = [name, artist_id]
    return artists_dict

