from flask import Blueprint, render_template, redirect, url_for
from flask_login import login_required, current_user
from app.models.workout import Workout
from app.models.goal import Goal
from app.models.exercise import Exercise
from sqlalchemy import func
from datetime import datetime, timedelta

main = Blueprint('main', __name__)

@main.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('main.dashboard'))
    return render_template('index.html')

@main.route('/dashboard')
@login_required
def dashboard():
    # Get recent workouts
    recent_workouts = Workout.query.filter_by(user_id=current_user.id).order_by(Workout.date.desc()).limit(3).all()
    
    # Get active goals
    active_goals = Goal.query.filter_by(user_id=current_user.id, completed=False).limit(3).all()
    
    # Get weekly stats
    today = datetime.utcnow().date()
    start_of_week = today - timedelta(days=today.weekday())
    end_of_week = start_of_week + timedelta(days=6)
    
    weekly_workouts = Workout.query.filter(
        Workout.user_id == current_user.id,
        Workout.date >= start_of_week,
        Workout.date <= end_of_week
    ).all()
    
    total_workouts = len(weekly_workouts)
    total_duration = sum(w.duration or 0 for w in weekly_workouts)
    total_calories = sum(w.calories_burned or 0 for w in weekly_workouts)
    
    # Format duration for display (e.g., "2h 30m")
    hours = total_duration // 60
    minutes = total_duration % 60
    formatted_duration = f"{hours}h {minutes}m" if hours > 0 else f"{minutes}m"
    
    weekly_summary = {
        'workouts': total_workouts,
        'totalTime': formatted_duration,
        'calories': total_calories
    }
    
    # Get some featured exercises
    featured_exercises = Exercise.query.limit(6).all()
    
    return render_template(
        'dashboard.html',
        recent_workouts=recent_workouts,
        goals=active_goals,
        weekly_summary=weekly_summary,
        featured_exercises=featured_exercises
    )

@main.route('/profile')
@login_required
def profile():
    # Get workout count
    workout_count = Workout.query.filter_by(user_id=current_user.id).count()
    
    # Get goal counts
    active_goals_count = Goal.query.filter_by(user_id=current_user.id, completed=False).count()
    completed_goals_count = Goal.query.filter_by(user_id=current_user.id, completed=True).count()
    
    return render_template(
        'profile.html',
        user=current_user,
        workout_count=workout_count,
        active_goals_count=active_goals_count,
        completed_goals_count=completed_goals_count
    )