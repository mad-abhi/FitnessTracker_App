from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, DateField, IntegerField, SelectField, FloatField, SubmitField, FieldList, FormField
from wtforms.validators import DataRequired, Optional, Length, NumberRange

class WorkoutExerciseForm(FlaskForm):
    exercise_id = IntegerField('Exercise ID', validators=[DataRequired()])
    sets = IntegerField('Sets', validators=[Optional(), NumberRange(min=1)])
    reps = IntegerField('Reps', validators=[Optional(), NumberRange(min=1)])
    weight = FloatField('Weight (kg)', validators=[Optional(), NumberRange(min=0)])
    duration = IntegerField('Duration (seconds)', validators=[Optional(), NumberRange(min=0)])
    distance = FloatField('Distance (km)', validators=[Optional(), NumberRange(min=0)])
    notes = TextAreaField('Notes', validators=[Optional(), Length(max=500)])

class WorkoutForm(FlaskForm):
    name = StringField('Workout Name', validators=[DataRequired(), Length(min=3, max=100)])
    date = DateField('Date', validators=[DataRequired()])
    duration = IntegerField('Duration (minutes)', validators=[Optional(), NumberRange(min=1)])
    type = SelectField('Workout Type', choices=[
        ('strength', 'Strength Training'),
        ('cardio', 'Cardio'),
        ('hiit', 'HIIT'),
        ('flexibility', 'Flexibility'),
        ('other', 'Other')
    ])
    notes = TextAreaField('Notes', validators=[Optional(), Length(max=1000)])
    calories_burned = IntegerField('Calories Burned', validators=[Optional(), NumberRange(min=0)])
    exercises = FieldList(FormField(WorkoutExerciseForm), min_entries=0)
    submit = SubmitField('Save Workout')