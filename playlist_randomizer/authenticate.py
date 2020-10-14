from spotipy import oauth2
import spotipy
from config import Config
import os
from flask import url_for, request, session


def auth(token):
    sp = spotipy.Spotify(auth=token)
    return sp



