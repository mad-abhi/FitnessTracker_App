from datetime import datetime
from app import db

class Workout(db.Model):
    __tablename__ = 'workouts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, default=datetime.utcnow().date)
    duration = db.Column(db.Integer)  # In minutes
    type = db.Column(db.String(50))
    notes = db.Column(db.Text)
    calories_burned = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    workout_exercises = db.relationship('WorkoutExercise', backref='workout', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'name': self.name,
            'date': self.date.isoformat() if self.date else None,
            'duration': self.duration,
            'type': self.type,
            'notes': self.notes,
            'caloriesBurned': self.calories_burned,
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<Workout {self.name}>'


class WorkoutExercise(db.Model):
    __tablename__ = 'workout_exercises'
    
    id = db.Column(db.Integer, primary_key=True)
    workout_id = db.Column(db.Integer, db.ForeignKey('workouts.id'), nullable=False)
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercises.id'), nullable=False)
    sets = db.Column(db.Integer)
    reps = db.Column(db.Integer)
    weight = db.Column(db.Float)
    duration = db.Column(db.Integer)  # In seconds
    distance = db.Column(db.Float)
    notes = db.Column(db.Text)
    order = db.Column(db.Integer, default=0)
    
    def to_dict(self):
        return {
            'id': self.id,
            'workoutId': self.workout_id,
            'exerciseId': self.exercise_id,
            'sets': self.sets,
            'reps': self.reps,
            'weight': self.weight,
            'duration': self.duration,
            'distance': self.distance,
            'notes': self.notes,
            'order': self.order
        }
    
    def __repr__(self):
        return f'<WorkoutExercise {self.id}>'