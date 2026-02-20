from datetime import datetime, timedelta
from app.db import db
import logging

logger = logging.getLogger(__name__)

def seed_data():
    with db.get_cursor() as cur:
        # Check if users exist
        cur.execute("SELECT id FROM users LIMIT 1")
        if cur.fetchone():
            return

        logger.info("SEEDING_DATABASE: Starting...")
        
        # Insert Users and get IDs
        cur.execute("INSERT INTO users (name, status) VALUES (%s, %s) RETURNING id", ("Alice Smith", "active"))
        alice_id = cur.fetchone()['id']
        
        cur.execute("INSERT INTO users (name, status) VALUES (%s, %s) RETURNING id", ("Bob Jones", "active"))
        bob_id = cur.fetchone()['id']
        
        cur.execute("INSERT INTO users (name, status) VALUES (%s, %s) RETURNING id", ("Charlie Davis", "inactive"))
        charlie_id = cur.fetchone()['id']
        
        # Insert Tasks
        now = datetime.now()
        cur.execute(
            "INSERT INTO tasks (title, start_date, end_date, user_id) VALUES (%s, %s, %s, %s)",
            ("Design System Review", now, now + timedelta(days=2), alice_id)
        )
        
        cur.execute(
            "INSERT INTO tasks (title, start_date, end_date, user_id) VALUES (%s, %s, %s, %s)",
            ("API Integration", now + timedelta(days=1), now + timedelta(days=5), bob_id)
        )
        
        cur.execute(
            "INSERT INTO tasks (title, start_date, end_date) VALUES (%s, %s, %s)",
            ("Documentation", now + timedelta(days=3), now + timedelta(days=4))
        )
        
        logger.info("SEEDING_DATABASE: Success")
