import logging
import sys
from flask import Flask
from flask_cors import CORS
from app.db import db
from app.api.routes import api_bp

logger = logging.getLogger(__name__)

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
        stream=sys.stdout
    )

def create_app():
    setup_logging()
    
    app = Flask(__name__)
    CORS(app)
    
    import os
    base_dir = os.path.abspath(os.path.dirname(__file__))
    db_path = os.path.join(base_dir, "..", "instance", "tasks.db")
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    with app.app_context():
        db.create_all()
        seed_data()

    app.register_blueprint(api_bp)

    return app

def seed_data():
    from app.models.models import User, Task, UserStatus
    from datetime import datetime, timedelta

    if User.query.first():
        return

    logger.info("SEEDING_DATABASE: Starting...")
    
    alice = User(name="Alice Smith", status=UserStatus.ACTIVE)
    bob = User(name="Bob Jones", status=UserStatus.ACTIVE)
    charlie = User(name="Charlie Davis", status=UserStatus.INACTIVE)
    
    db.session.add_all([alice, bob, charlie])
    db.session.commit()

    t1 = Task(title="Design System Review", start_date=datetime.now(), end_date=datetime.now() + timedelta(days=2), user_id=alice.id)
    t2 = Task(title="API Integration", start_date=datetime.now() + timedelta(days=1), end_date=datetime.now() + timedelta(days=5), user_id=bob.id)
    t3 = Task(title="Documentation", start_date=datetime.now() + timedelta(days=3), end_date=datetime.now() + timedelta(days=4))
    
    db.session.add_all([t1, t2, t3])
    db.session.commit()
    logger.info("SEEDING_DATABASE: Success")

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
