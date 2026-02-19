from flask import Flask
from app.db import db
from app.models.models import User, UserStatus
import logging

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///debug.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

with app.app_context():
    db.create_all()
    try:
        user = User(name="Test", status=UserStatus.ACTIVE)
        db.session.add(user)
        db.session.commit()
        print("Success with Enum object")
    except Exception as e:
        print(f"Failed with Enum object: {e}")
        db.session.rollback()

    try:
        user = User(name="Test2", status="active")
        db.session.add(user)
        db.session.commit()
        print("Success with string 'active'")
    except Exception as e:
        print(f"Failed with string 'active': {e}")
        db.session.rollback()

    try:
        user = User(name="Test3", status="ACTIVE")
        db.session.add(user)
        db.session.commit()
        print("Success with string 'ACTIVE'")
    except Exception as e:
        print(f"Failed with string 'ACTIVE': {e}")
        db.session.rollback()
