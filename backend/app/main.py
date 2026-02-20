import logging
import sys
from flask import Flask
from flask_cors import CORS
from app.db import db
from app.api.routes import api_bp
from app.seed import seed_data

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

app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
