from app import db
from app.models.exercise import Exercise

def seed_exercises():
    """
    Seed the database with initial exercise data if none exists
    """
    # Only run if there are no exercises in the database
    if Exercise.query.count() == 0:
        exercises = [
            {
                'name': 'Bench Press',
                'description': 'A compound exercise that primarily targets the chest muscles.',
                'muscle_groups': 'Chest, Triceps, Shoulders',
                'equipment': 'Barbell, Bench',
                'image_url': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80',
                'difficulty': 'Intermediate',
                'instructions': 'Lie on a bench, grip the bar, lower it to your chest, then press up.'
            },
            {
                'name': 'Deadlift',
                'description': 'A compound exercise that works multiple muscle groups including the back, legs, and core.',
                'muscle_groups': 'Back, Legs, Core',
                'equipment': 'Barbell',
                'image_url': 'https://images.unsplash.com/photo-1598575285675-d0d3d0358e55?w=600&auto=format&fit=crop&q=80',
                'difficulty': 'Advanced',
                'instructions': 'Stand with feet shoulder-width apart, bend at hips and knees, grip the bar, then stand up.'
            },
            {
                'name': 'Squat',
                'description': 'A fundamental compound exercise that targets the legs and glutes.',
                'muscle_groups': 'Quadriceps, Hamstrings, Glutes',
                'equipment': 'Barbell, Squat Rack',
                'image_url': 'https://images.unsplash.com/photo-1574680096145-d58b7ac5f611?w=600&auto=format&fit=crop&q=80',
                'difficulty': 'Intermediate',
                'instructions': 'Position bar on shoulders, feet shoulder-width apart, bend knees and hips, lower until thighs are parallel to ground, then stand up.'
            },
            {
                'name': 'Pull-up',
                'description': 'An upper body exercise that targets the back and biceps.',
                'muscle_groups': 'Back, Biceps',
                'equipment': 'Pull-up Bar',
                'image_url': 'https://images.unsplash.com/photo-1598971639058-efc302d5704b?w=600&auto=format&fit=crop&q=80',
                'difficulty': 'Intermediate',
                'instructions': 'Grip the bar with hands shoulder-width apart, pull yourself up until chin is over the bar, then lower.'
            },
            {
                'name': 'Overhead Press',
                'description': 'A shoulder exercise that also engages the triceps and upper chest.',
                'muscle_groups': 'Shoulders, Triceps',
                'equipment': 'Barbell, Dumbbells',
                'image_url': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80',
                'difficulty': 'Intermediate',
                'instructions': 'Stand with feet shoulder-width apart, hold weight at shoulder level, press overhead, then lower.'
            },
            {
                'name': 'Dumbbell Row',
                'description': 'A back exercise that also works the biceps and shoulders.',
                'muscle_groups': 'Back, Biceps',
                'equipment': 'Dumbbells, Bench',
                'image_url': 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=600&auto=format&fit=crop&q=80',
                'difficulty': 'Beginner',
                'instructions': 'Place one knee and hand on bench, other foot on floor, pull dumbbell up to side, then lower.'
            },
            {
                'name': 'Lunges',
                'description': 'A leg exercise that targets the quadriceps, hamstrings, and glutes.',
                'muscle_groups': 'Quadriceps, Hamstrings, Glutes',
                'equipment': 'None, Dumbbells (optional)',
                'image_url': 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=600&auto=format&fit=crop&q=80',
                'difficulty': 'Beginner',
                'instructions': 'Stand with feet together, step forward with one leg, lower until both knees are bent at 90 degrees, then push back up.'
            },
            {
                'name': 'Plank',
                'description': 'A core exercise that also engages the shoulders and back.',
                'muscle_groups': 'Core, Shoulders',
                'equipment': 'None',
                'image_url': 'https://images.unsplash.com/photo-1566241134883-13eb2393a3cc?w=600&auto=format&fit=crop&q=80',
                'difficulty': 'Beginner',
                'instructions': 'Position forearms on ground, elbows under shoulders, feet hip-width apart, hold body in straight line.'
            }
        ]
        
        for exercise_data in exercises:
            exercise = Exercise(**exercise_data)
            db.session.add(exercise)
        
        db.session.commit()
        print("Database seeded with initial exercises.")