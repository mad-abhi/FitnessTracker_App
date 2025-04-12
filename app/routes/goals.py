from flask import Blueprint, render_template, redirect, url_for, request, jsonify
from flask_login import login_required, current_user
from app import db
from app.models.goal import Goal
from app.forms.goal import GoalForm
from datetime import datetime

goals = Blueprint('goals', __name__)

@goals.route('/goals')
@login_required
def goal_list():
    all_goals = Goal.query.filter_by(user_id=current_user.id).all()
    active_goals = [goal for goal in all_goals if not goal.completed]
    completed_goals = [goal for goal in all_goals if goal.completed]
    
    return render_template('goals/list.html', active_goals=active_goals, completed_goals=completed_goals)

@goals.route('/goals/create', methods=['GET', 'POST'])
@login_required
def create_goal():
    form = GoalForm()
    
    if form.validate_on_submit():
        goal = Goal(
            user_id=current_user.id,
            name=form.name.data,
            description=form.description.data,
            type=form.type.data,
            target_value=form.target_value.data,
            current_value=form.current_value.data or 0,
            unit=form.unit.data,
            start_date=form.start_date.data,
            end_date=form.end_date.data
        )
        
        db.session.add(goal)
        db.session.commit()
        return redirect(url_for('goals.goal_list'))
    
    return render_template('goals/create.html', form=form)

@goals.route('/goals/<int:goal_id>/edit', methods=['GET', 'POST'])
@login_required
def edit_goal(goal_id):
    goal = Goal.query.get_or_404(goal_id)
    
    # Ensure the goal belongs to the current user
    if goal.user_id != current_user.id:
        return redirect(url_for('goals.goal_list'))
    
    form = GoalForm(obj=goal)
    
    if form.validate_on_submit():
        goal.name = form.name.data
        goal.description = form.description.data
        goal.type = form.type.data
        goal.target_value = form.target_value.data
        goal.current_value = form.current_value.data or 0
        goal.unit = form.unit.data
        goal.start_date = form.start_date.data
        goal.end_date = form.end_date.data
        goal.completed = form.current_value.data >= form.target_value.data if form.current_value.data else False
        
        db.session.commit()
        return redirect(url_for('goals.goal_list'))
    
    return render_template('goals/edit.html', form=form, goal=goal)

@goals.route('/goals/<int:goal_id>/toggle', methods=['POST'])
@login_required
def toggle_goal_completion(goal_id):
    goal = Goal.query.get_or_404(goal_id)
    
    # Ensure the goal belongs to the current user
    if goal.user_id != current_user.id:
        return redirect(url_for('goals.goal_list'))
    
    goal.completed = not goal.completed
    db.session.commit()
    
    return redirect(url_for('goals.goal_list'))

# API routes

@goals.route('/api/goals')
@login_required
def api_goals_list():
    goals = Goal.query.filter_by(user_id=current_user.id).all()
    return jsonify([goal.to_dict() for goal in goals]), 200

@goals.route('/api/users/<int:user_id>/goals')
@login_required
def api_user_goals(user_id):
    # Only allow access to the current user's goals
    if user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    goals = Goal.query.filter_by(user_id=user_id).all()
    return jsonify([goal.to_dict() for goal in goals]), 200

@goals.route('/api/goals/<int:goal_id>')
@login_required
def api_goal_detail(goal_id):
    goal = Goal.query.get_or_404(goal_id)
    
    # Only allow access to the current user's goals
    if goal.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify(goal.to_dict()), 200

@goals.route('/api/goals', methods=['POST'])
@login_required
def api_create_goal():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid data'}), 400
    
    goal = Goal(
        user_id=current_user.id,
        name=data.get('name'),
        description=data.get('description'),
        type=data.get('type'),
        target_value=data.get('targetValue'),
        current_value=data.get('currentValue', 0),
        unit=data.get('unit'),
        start_date=datetime.fromisoformat(data.get('startDate')).date() if data.get('startDate') else datetime.utcnow().date(),
        end_date=datetime.fromisoformat(data.get('endDate')).date() if data.get('endDate') else None,
        completed=data.get('completed', False)
    )
    
    db.session.add(goal)
    db.session.commit()
    
    return jsonify(goal.to_dict()), 201

@goals.route('/api/goals/<int:goal_id>', methods=['PUT', 'PATCH'])
@login_required
def api_update_goal(goal_id):
    goal = Goal.query.get_or_404(goal_id)
    
    # Only allow updating the current user's goals
    if goal.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid data'}), 400
    
    if 'name' in data:
        goal.name = data['name']
    if 'description' in data:
        goal.description = data['description']
    if 'type' in data:
        goal.type = data['type']
    if 'targetValue' in data:
        goal.target_value = data['targetValue']
    if 'currentValue' in data:
        goal.current_value = data['currentValue']
        # Auto-update completed status if current value reaches target
        if goal.current_value >= goal.target_value:
            goal.completed = True
    if 'unit' in data:
        goal.unit = data['unit']
    if 'startDate' in data:
        goal.start_date = datetime.fromisoformat(data['startDate']).date()
    if 'endDate' in data and data['endDate']:
        goal.end_date = datetime.fromisoformat(data['endDate']).date()
    if 'completed' in data:
        goal.completed = data['completed']
    
    db.session.commit()
    
    return jsonify(goal.to_dict()), 200

@goals.route('/api/goals/<int:goal_id>', methods=['DELETE'])
@login_required
def api_delete_goal(goal_id):
    goal = Goal.query.get_or_404(goal_id)
    
    # Only allow deleting the current user's goals
    if goal.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(goal)
    db.session.commit()
    
    return jsonify({'message': 'Goal deleted successfully'}), 200