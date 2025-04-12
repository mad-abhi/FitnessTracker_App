from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, DateField, FloatField, SelectField, SubmitField
from wtforms.validators import DataRequired, Optional, Length, NumberRange

class GoalForm(FlaskForm):
    name = StringField('Goal Name', validators=[DataRequired(), Length(min=3, max=100)])
    description = TextAreaField('Description', validators=[Optional(), Length(max=500)])
    type = SelectField('Goal Type', choices=[
        ('strength', 'Strength'),
        ('cardio', 'Cardio'),
        ('weight', 'Weight'),
        ('habit', 'Habit'),
        ('other', 'Other')
    ])
    target_value = FloatField('Target Value', validators=[DataRequired(), NumberRange(min=0)])
    current_value = FloatField('Current Value', validators=[Optional(), NumberRange(min=0)])
    unit = StringField('Unit', validators=[DataRequired(), Length(max=20)])
    start_date = DateField('Start Date', validators=[DataRequired()])
    end_date = DateField('End Date', validators=[Optional()])
    submit = SubmitField('Save Goal')