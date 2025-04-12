from flask import Blueprint, render_template, jsonify, request
from flask_login import login_required, current_user
from app import db
from app.models.exercise import Exercise

exercises = Blueprint('exercises', __name__)

@exercises.route('/exercises')
@login_required
def exercise_list():
    all_exercises = Exercise.query.all()
    
    # Get unique muscle groups for filtering
    muscle_groups = set()
    for exercise in all_exercises:
        if exercise.muscle_groups:
            for group in exercise.muscle_groups.split(', '):
                muscle_groups.add(group)
    
    return render_template('exercises/list.html', exercises=all_exercises, muscle_groups=sorted(muscle_groups))

@exercises.route('/exercises/<int:exercise_id>')
@login_required
def exercise_detail(exercise_id):
    exercise = Exercise.query.get_or_404(exercise_id)
    
    # Find related exercises with similar muscle groups
    related_exercises = []
    if exercise.muscle_groups:
        primary_muscle = exercise.muscle_groups.split(', ')[0]
        related_exercises = Exercise.query.filter(
            Exercise.id != exercise.id,
            Exercise.muscle_groups.like(f'%{primary_muscle}%')
        ).limit(3).all()
    
    return render_template('exercises/detail.html', exercise=exercise, related_exercises=related_exercises)

# API routes

@exercises.route('/api/exercises')
def api_exercises_list():
    exercises = Exercise.query.all()
    return jsonify([exercise.to_dict() for exercise in exercises]), 200

@exercises.route('/api/exercises/<int:exercise_id>')
def api_exercise_detail(exercise_id):
    exercise = Exercise.query.get_or_404(exercise_id)
    return jsonify(exercise.to_dict()), 200

@exercises.route('/api/exercises', methods=['POST'])
@login_required
def api_create_exercise():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid data'}), 400
    
    new_exercise = Exercise(
        name=data.get('name'),
        description=data.get('description'),
        muscle_groups=data.get('muscleGroups'),
        equipment=data.get('equipment'),
        image_url=data.get('imageUrl'),
        difficulty=data.get('difficulty'),
        instructions=data.get('instructions')
    )
    
    db.session.add(new_exercise)
    db.session.commit()
    
    return jsonify(new_exercise.to_dict()), 201

@exercises.route('/api/exercises/<int:exercise_id>', methods=['PUT', 'PATCH'])
@login_required
def api_update_exercise(exercise_id):
    exercise = Exercise.query.get_or_404(exercise_id)
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'Invalid data'}), 400
    
    if 'name' in data:
        exercise.name = data['name']
    if 'description' in data:
        exercise.description = data['description']
    if 'muscleGroups' in data:
        exercise.muscle_groups = data['muscleGroups']
    if 'equipment' in data:
        exercise.equipment = data['equipment']
    if 'imageUrl' in data:
        exercise.image_url = data['imageUrl']
    if 'difficulty' in data:
        exercise.difficulty = data['difficulty']
    if 'instructions' in data:
        exercise.instructions = data['instructions']
    
    db.session.commit()
    
    return jsonify(exercise.to_dict()), 200

@exercises.route('/api/exercises/<int:exercise_id>', methods=['DELETE'])
@login_required
def api_delete_exercise(exercise_id):
    exercise = Exercise.query.get_or_404(exercise_id)
    
    db.session.delete(exercise)
    db.session.commit()
    
    return jsonify({'message': 'Exercise deleted successfully'}), 200