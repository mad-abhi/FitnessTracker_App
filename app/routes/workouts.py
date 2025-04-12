from flask import Blueprint, render_template, redirect, url_for, request, jsonify
from flask_login import login_required, current_user
from app import db
from app.models.workout import Workout, WorkoutExercise
from app.models.exercise import Exercise
from app.forms.workout import WorkoutForm
from datetime import datetime

workouts = Blueprint('workouts', __name__)

@workouts.route('/workouts')
@login_required
def workout_list():
    workouts = Workout.query.filter_by(user_id=current_user.id).order_by(Workout.date.desc()).all()
    return render_template('workouts/list.html', workouts=workouts)

@workouts.route('/workouts/create', methods=['GET', 'POST'])
@login_required
def create_workout():
    form = WorkoutForm()
    exercises = Exercise.query.all()
    
    if form.validate_on_submit():
        workout = Workout(
            user_id=current_user.id,
            name=form.name.data,
            date=form.date.data,
            duration=form.duration.data,
            type=form.type.data,
            notes=form.notes.data,
            calories_burned=form.calories_burned.data
        )
        
        db.session.add(workout)
        db.session.commit()
        
        # Process workout exercises
        for exercise_form in form.exercises.data:
            if exercise_form.get('exercise_id'):
                workout_exercise = WorkoutExercise(
                    workout_id=workout.id,
                    exercise_id=exercise_form.get('exercise_id'),
                    sets=exercise_form.get('sets'),
                    reps=exercise_form.get('reps'),
                    weight=exercise_form.get('weight'),
                    duration=exercise_form.get('duration'),
                    distance=exercise_form.get('distance'),
                    notes=exercise_form.get('notes'),
                    order=exercise_form.get('order', 0)
                )
                db.session.add(workout_exercise)
        
        db.session.commit()
        return redirect(url_for('workouts.workout_detail', workout_id=workout.id))
    
    return render_template('workouts/create.html', form=form, exercises=exercises)

@workouts.route('/workouts/<int:workout_id>')
@login_required
def workout_detail(workout_id):
    workout = Workout.query.get_or_404(workout_id)
    
    # Ensure the workout belongs to the current user
    if workout.user_id != current_user.id:
        return redirect(url_for('workouts.workout_list'))
    
    # Get workout exercises with exercise details
    workout_exercises = WorkoutExercise.query.filter_by(workout_id=workout.id).order_by(WorkoutExercise.order).all()
    
    return render_template('workouts/detail.html', workout=workout, workout_exercises=workout_exercises)

@workouts.route('/workouts/<int:workout_id>/edit', methods=['GET', 'POST'])
@login_required
def edit_workout(workout_id):
    workout = Workout.query.get_or_404(workout_id)
    
    # Ensure the workout belongs to the current user
    if workout.user_id != current_user.id:
        return redirect(url_for('workouts.workout_list'))
    
    form = WorkoutForm(obj=workout)
    exercises = Exercise.query.all()
    
    if form.validate_on_submit():
        workout.name = form.name.data
        workout.date = form.date.data
        workout.duration = form.duration.data
        workout.type = form.type.data
        workout.notes = form.notes.data
        workout.calories_burned = form.calories_burned.data
        
        db.session.commit()
        
        return redirect(url_for('workouts.workout_detail', workout_id=workout.id))
    
    return render_template('workouts/edit.html', form=form, workout=workout, exercises=exercises)

# API routes

@workouts.route('/api/workouts')
@login_required
def api_workouts_list():
    workouts = Workout.query.filter_by(user_id=current_user.id).order_by(Workout.date.desc()).all()
    return jsonify([workout.to_dict() for workout in workouts]), 200

@workouts.route('/api/users/<int:user_id>/workouts')
@login_required
def api_user_workouts(user_id):
    # Only allow access to the current user's workouts
    if user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    workouts = Workout.query.filter_by(user_id=user_id).order_by(Workout.date.desc()).all()
    return jsonify([workout.to_dict() for workout in workouts]), 200

@workouts.route('/api/workouts/<int:workout_id>')
@login_required
def api_workout_detail(workout_id):
    workout = Workout.query.get_or_404(workout_id)
    
    # Only allow access to the current user's workouts
    if workout.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify(workout.to_dict()), 200

@workouts.route('/api/workouts', methods=['POST'])
@login_required
def api_create_workout():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid data'}), 400
    
    workout = Workout(
        user_id=current_user.id,
        name=data.get('name'),
        date=datetime.fromisoformat(data.get('date')).date() if data.get('date') else datetime.utcnow().date(),
        duration=data.get('duration'),
        type=data.get('type'),
        notes=data.get('notes'),
        calories_burned=data.get('caloriesBurned')
    )
    
    db.session.add(workout)
    db.session.commit()
    
    # Process workout exercises if included
    if 'exercises' in data and isinstance(data['exercises'], list):
        for exercise_data in data['exercises']:
            workout_exercise = WorkoutExercise(
                workout_id=workout.id,
                exercise_id=exercise_data.get('exerciseId'),
                sets=exercise_data.get('sets'),
                reps=exercise_data.get('reps'),
                weight=exercise_data.get('weight'),
                duration=exercise_data.get('duration'),
                distance=exercise_data.get('distance'),
                notes=exercise_data.get('notes'),
                order=exercise_data.get('order', 0)
            )
            db.session.add(workout_exercise)
        
        db.session.commit()
    
    return jsonify(workout.to_dict()), 201

@workouts.route('/api/workouts/<int:workout_id>', methods=['PUT', 'PATCH'])
@login_required
def api_update_workout(workout_id):
    workout = Workout.query.get_or_404(workout_id)
    
    # Only allow updating the current user's workouts
    if workout.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid data'}), 400
    
    if 'name' in data:
        workout.name = data['name']
    if 'date' in data:
        workout.date = datetime.fromisoformat(data['date']).date()
    if 'duration' in data:
        workout.duration = data['duration']
    if 'type' in data:
        workout.type = data['type']
    if 'notes' in data:
        workout.notes = data['notes']
    if 'caloriesBurned' in data:
        workout.calories_burned = data['caloriesBurned']
    
    db.session.commit()
    
    return jsonify(workout.to_dict()), 200

@workouts.route('/api/workouts/<int:workout_id>', methods=['DELETE'])
@login_required
def api_delete_workout(workout_id):
    workout = Workout.query.get_or_404(workout_id)
    
    # Only allow deleting the current user's workouts
    if workout.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(workout)
    db.session.commit()
    
    return jsonify({'message': 'Workout deleted successfully'}), 200

# Workout Exercises API

@workouts.route('/api/workouts/<int:workout_id>/exercises')
@login_required
def api_workout_exercises(workout_id):
    workout = Workout.query.get_or_404(workout_id)
    
    # Only allow access to the current user's workout exercises
    if workout.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    workout_exercises = WorkoutExercise.query.filter_by(workout_id=workout_id).order_by(WorkoutExercise.order).all()
    
    result = []
    for we in workout_exercises:
        we_dict = we.to_dict()
        exercise = Exercise.query.get(we.exercise_id)
        if exercise:
            we_dict['exercise'] = exercise.to_dict()
        result.append(we_dict)
    
    return jsonify(result), 200

@workouts.route('/api/workout-exercises', methods=['POST'])
@login_required
def api_create_workout_exercise():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid data'}), 400
    
    workout_id = data.get('workoutId')
    workout = Workout.query.get_or_404(workout_id)
    
    # Only allow adding exercises to the current user's workouts
    if workout.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    workout_exercise = WorkoutExercise(
        workout_id=workout_id,
        exercise_id=data.get('exerciseId'),
        sets=data.get('sets'),
        reps=data.get('reps'),
        weight=data.get('weight'),
        duration=data.get('duration'),
        distance=data.get('distance'),
        notes=data.get('notes'),
        order=data.get('order', 0)
    )
    
    db.session.add(workout_exercise)
    db.session.commit()
    
    return jsonify(workout_exercise.to_dict()), 201

@workouts.route('/api/workout-exercises/<int:workout_exercise_id>', methods=['PUT', 'PATCH'])
@login_required
def api_update_workout_exercise(workout_exercise_id):
    workout_exercise = WorkoutExercise.query.get_or_404(workout_exercise_id)
    workout = Workout.query.get(workout_exercise.workout_id)
    
    # Only allow updating exercises in the current user's workouts
    if workout.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid data'}), 400
    
    if 'sets' in data:
        workout_exercise.sets = data['sets']
    if 'reps' in data:
        workout_exercise.reps = data['reps']
    if 'weight' in data:
        workout_exercise.weight = data['weight']
    if 'duration' in data:
        workout_exercise.duration = data['duration']
    if 'distance' in data:
        workout_exercise.distance = data['distance']
    if 'notes' in data:
        workout_exercise.notes = data['notes']
    if 'order' in data:
        workout_exercise.order = data['order']
    
    db.session.commit()
    
    return jsonify(workout_exercise.to_dict()), 200

@workouts.route('/api/workout-exercises/<int:workout_exercise_id>', methods=['DELETE'])
@login_required
def api_delete_workout_exercise(workout_exercise_id):
    workout_exercise = WorkoutExercise.query.get_or_404(workout_exercise_id)
    workout = Workout.query.get(workout_exercise.workout_id)
    
    # Only allow deleting exercises from the current user's workouts
    if workout.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(workout_exercise)
    db.session.commit()
    
    return jsonify({'message': 'Workout exercise deleted successfully'}), 200