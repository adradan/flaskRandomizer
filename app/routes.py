from app import app
from flask import render_template, request
from app.forms import ArtistForm
from wtforms import StringField


@app.route('/', methods=['GET', 'POST'])
def index():
    print(request.method)
    if request.method == 'POST':
        for field, value in request.form.items():
            print(field, value)
    return render_template('home.html')
