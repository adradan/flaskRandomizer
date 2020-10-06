from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired


class ArtistForm(FlaskForm):
    artist_1 = StringField('Artist_1', validators=[DataRequired()])
    artist_2 = StringField('Artist_2', validators=[DataRequired()])
    artist_3 = StringField('Artist_3', validators=[DataRequired()])
    artist_4 = StringField('Artist_4', validators=[DataRequired()])
    artist_5 = StringField('Artist_5', validators=[DataRequired()])
    artist_6 = StringField('Artist_6', validators=[DataRequired()])
    artist_7 = StringField('Artist_7', validators=[DataRequired()])
    artist_8 = StringField('Artist_8', validators=[DataRequired()])
    artist_9 = StringField('Artist_9', validators=[DataRequired()])
    artist_10 = StringField('Artist_10', validators=[DataRequired()])
