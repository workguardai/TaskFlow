from flask import Blueprint, request, jsonify
from pydantic import ValidationError
from app.services.task_service import TaskService
from app.schemas.schemas import (
    UserCreate, UserSchema, 
    TaskCreate, TaskSchema, 
    TaskStatusUpdate, TaskAssignment
)
from app.domain.rules import DomainException
import logging

logger = logging.getLogger(__name__)
api_bp = Blueprint("api", __name__)

@api_bp.errorhandler(DomainException)
def handle_domain_exception(e):
    logger.warning(f"RULE_VIOLATION: {e.message}")
    return jsonify({
        "error": e.code,
        "message": e.message
    }), 400

@api_bp.errorhandler(ValidationError)
def handle_pydantic_validation_error(e):
    return jsonify({
        "error": "VALIDATION_ERROR",
        "message": e.errors()
    }), 400

@api_bp.route("/users", methods=["POST"])
def create_user():
    data = UserCreate(**request.get_json())
    user = TaskService.create_user(data.name, data.status)
    return jsonify(UserSchema.model_validate(user).model_dump(mode='json')), 201

@api_bp.route("/users", methods=["GET"])
def get_users():
    users = TaskService.get_users()
    return jsonify([UserSchema.model_validate(u).model_dump(mode='json') for u in users])

@api_bp.route("/tasks", methods=["POST"])
def create_task():
    data = TaskCreate(**request.get_json())
    task = TaskService.create_task(data.title, data.start_date, data.end_date)
    return jsonify(TaskSchema.model_validate(task).model_dump(mode='json')), 201

@api_bp.route("/tasks", methods=["GET"])
def get_tasks():
    tasks = TaskService.get_tasks()
    return jsonify([TaskSchema.model_validate(t).model_dump(mode='json') for t in tasks])

@api_bp.route("/tasks/<int:id>/assign", methods=["POST"])
def assign_task(id):
    data = TaskAssignment(**request.get_json())
    task = TaskService.assign_task(id, data.user_id)
    return jsonify(TaskSchema.model_validate(task).model_dump(mode='json'))

@api_bp.route("/tasks/<int:id>/status", methods=["POST"])
def update_task_status(id):
    data = TaskStatusUpdate(**request.get_json())
    task = TaskService.update_task_status(id, data.status)
    return jsonify(TaskSchema.model_validate(task).model_dump(mode='json'))
