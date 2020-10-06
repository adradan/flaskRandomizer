from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired


class ArtistForm(FlaskForm):
    artist = StringField('Artist', validators=[DataRequired()])
