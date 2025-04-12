from datetime import datetime
from app import db

class Goal(db.Model):
    __tablename__ = 'goals'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    type = db.Column(db.String(50))  # e.g., 'strength', 'cardio', 'weight', etc.
    target_value = db.Column(db.Float)
    current_value = db.Column(db.Float, default=0)
    unit = db.Column(db.String(20))  # e.g., 'kg', 'minutes', 'km', etc.
    start_date = db.Column(db.Date, default=datetime.utcnow().date)
    end_date = db.Column(db.Date)
    completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'name': self.name,
            'description': self.description,
            'type': self.type,
            'targetValue': self.target_value,
            'currentValue': self.current_value,
            'unit': self.unit,
            'startDate': self.start_date.isoformat() if self.start_date else None,
            'endDate': self.end_date.isoformat() if self.end_date else None,
            'completed': self.completed,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'progress': (self.current_value / self.target_value * 100) if self.target_value else 0
        }
    
    def __repr__(self):
        return f'<Goal {self.name}>'