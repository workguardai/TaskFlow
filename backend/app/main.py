import logging
import sys
import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
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

def init_db():
    """Simple helper to ensure tables exist. In production, use migrations."""
    schema_path = os.path.join(os.path.dirname(__file__), "schema.sql")
    if os.path.exists(schema_path):
        with open(schema_path, "r") as f:
            schema_sql = f.read()
            with db.get_cursor() as cur:
                cur.execute(schema_sql)
        logger.info("Database schema initialized.")

def create_app():
    setup_logging()
    
    app = Flask(__name__)
    CORS(app)
    
    # Run DB init (optional, normally done outside app startup)
    # init_db() 
    
    # We still need seed_data to work
    try:
        seed_data()
    except Exception as e:
        logger.error(f"Seeding failed: {e}")

    app.register_blueprint(api_bp)

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)

