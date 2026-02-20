from app.models.models import User, Task, UserStatus
from datetime import datetime, timedelta
from app.db import db
import logging

logger = logging.getLogger(__name__)


def seed_data():


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