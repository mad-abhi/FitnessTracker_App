from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_wtf.csrf import CSRFProtect
from config import Config

db = SQLAlchemy()
login_manager = LoginManager()
csrf = CSRFProtect()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    login_manager.init_app(app)
    csrf.init_app(app)
    
    login_manager.login_view = 'auth.login'
    login_manager.login_message_category = 'info'
    
    # Import and register blueprints
    from app.routes.main import main
    from app.routes.auth import auth
    from app.routes.exercises import exercises
    from app.routes.workouts import workouts
    from app.routes.goals import goals
    
    app.register_blueprint(main)
    app.register_blueprint(auth)
    app.register_blueprint(exercises)
    app.register_blueprint(workouts)
    app.register_blueprint(goals)
    
    # Create database tables
    with app.app_context():
        db.create_all()
        
        # Import and initialize seed data
        from app.utils.seed_db import seed_exercises
        seed_exercises()
    
    return app