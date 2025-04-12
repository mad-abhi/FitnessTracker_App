from app import db

class Exercise(db.Model):
    __tablename__ = 'exercises'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    muscle_groups = db.Column(db.String(255))
    equipment = db.Column(db.String(255))
    image_url = db.Column(db.String(255))
    difficulty = db.Column(db.String(50))
    instructions = db.Column(db.Text)
    
    # Relationships
    workout_exercises = db.relationship('WorkoutExercise', backref='exercise', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'muscleGroups': self.muscle_groups,
            'equipment': self.equipment,
            'imageUrl': self.image_url,
            'difficulty': self.difficulty,
            'instructions': self.instructions
        }
    
    def __repr__(self):
        return f'<Exercise {self.name}>'