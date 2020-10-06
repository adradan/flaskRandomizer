import os


class Config():
    SECRET_KEY = os.environ.get('SECRET')
    CLIENT_ID = os.environ.get('SPOTIPY_CLIENT_ID')
    CLIENT_SECRET = os.environ.get('SPOTIPY_CLIENT_SECRET')
    SESSION_COOKIE_SECURE = True
