from app import app
from config import Config
from flask import render_template, request, session, url_for, redirect
from app.forms import ArtistForm
from wtforms import StringField
from playlist_randomizer.playlist import Playlist
import os
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
    artist_list = {}
    if request.method == 'POST':
        for field, value in request.form.items():
            if field == 'csrf_token':
                continue
            artist_list[field] = value.replace(' ', '+').strip()
            session['artist_list'] = artist_list
        auth_url = f'{API_BASE}/authorize?client_id={CLIENT_ID}&response_type=code&redirect_uri={REDIRECT_URI}&scope={SCOPE}&show_dialog={SHOW_DIALOG}'
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


@app.route('/confirmation', methods=['POST', 'GET'])
def confirmation():
    session.clear()
    artist_list = json.loads(request.args['artist_list'])
    token = request.args['token']
    validated_data = artist_validation.validate_query(artist_list, token)
    no_match = {}
    correct = {}
    no_result = []
    for k, v in validated_data.items():
        index_value = validated_data[k]
        if len(index_value) == 3:
            no_match[index_value[1]] = index_value[2]
        elif len(index_value) == 2:
            correct[index_value[0]] = index_value[1]
        else:
            no_result.append(index_value[0])
    context = {
        'no_match': no_match,
        'correct': correct,
        'no_result': no_result
    }
    return render_template('confirmation.html', **context)

