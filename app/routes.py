from app import app
from config import Config
from flask import render_template, request, session, url_for, redirect, make_response, jsonify
import requests
import spotipy
from app import artist_validation
import json

API_BASE = 'https://accounts.spotify.com'
REDIRECT_URI = 'http://127.0.0.1:5000/callback'
SCOPE = 'playlist-modify-private%20playlist-read-private%20user-library-read%20playlist-modify-public'
SHOW_DIALOG = True
CLIENT_ID = Config().CLIENT_ID
CLIENT_SECRET = Config().CLIENT_SECRET


@app.route('/', methods=['GET', 'POST'])
def index():
    client_flow_url = f'{API_BASE}/api/token'
    resp = requests.post(client_flow_url, data={
        'grant_type': 'client_credentials',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    })
    token = resp.json().get('access_token')
    session['client_token'] = token
    print(session['client_token'])
    artist_list = {}
    if request.method == 'POST':
        for field, value in request.form.items():
            if field == 'csrf_token':
                continue
            artist_list[field] = value.replace(' ', '+').strip()
            session['artist_list'] = artist_list
        auth_url = f'{API_BASE}/authorize?client_id={CLIENT_ID}&response_type=code' + \
                   f'&redirect_uri={REDIRECT_URI}&scope={SCOPE}&show_dialog={SHOW_DIALOG}'
        return redirect(auth_url)
    return render_template('home.html')


@app.route('/callback')
def callback():
    code = request.args.get('code')
    auth_token_url = f'{API_BASE}/api/token'
    res = requests.post(auth_token_url, data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    })
    res_body = res.json()
    session['token'] = res_body.get('access_token')
    artist_list = json.dumps(session['artist_list'])
    return redirect(url_for('confirmation', artist_list=artist_list, token=session['token']))


@app.route('/ajax/search_artist', methods=['POST', 'GET'])
def access_token():
    artist = request.args.get('artist')
    print(artist)
    sp = spotipy.Spotify(auth=session['client_token'])
    found_artists = sp.search(q=artist.strip(), type='artist', limit=5)
    found_artists = found_artists['artists']['items']
    # name path found_artists['artists']['items'][0]['name'])
    return jsonify(artists=found_artists)


@app.route('/confirmation', methods=['POST', 'GET'])
def confirmation():
    session.clear()
    artist_list = json.loads(request.args['artist_list'])
    token = request.args['token']
    no_match = {}
    correct = {}
    no_result = []
    return render_template('confirmation.html', artist_list=artist_list)
