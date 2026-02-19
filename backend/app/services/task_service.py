import logging
from app.db import db
from app.models.models import User, Task, TaskStatus
from app.domain.rules import (
    validate_task_completion, 
    validate_user_assignment, 
    validate_no_overlap,
    DomainException
)

logger = logging.getLogger(__name__)

class TaskService:
    @staticmethod
    def create_user(name: str, status: str = "active") -> User:
        user = User(name=name, status=status)
        db.session.add(user)
        db.session.commit()
        logger.info(f"USER_CREATED: {user.name} (ID: {user.id})")
        return user

    @staticmethod
    def get_users() -> list[User]:
        return User.query.all()

    @staticmethod
    def create_task(title: str, start_date, end_date) -> Task:
        if start_date > end_date:
            raise DomainException("Start date cannot be after end date")
            
        task = Task(title=title, start_date=start_date, end_date=end_date)
        db.session.add(task)
        db.session.commit()
        logger.info(f"TASK_CREATED: {task.title} (ID: {task.id})")
        return task

    @staticmethod
    def get_tasks() -> list[Task]:
        return Task.query.all()

    @staticmethod
    def assign_task(task_id: int, user_id: int) -> Task:
        task = Task.query.get_or_404(task_id)
        user = User.query.get_or_404(user_id)

        # Rule 2: Assignment constraint
        validate_user_assignment(user)

        # Rule 3: Overlap constraint
        validate_no_overlap(user, task.start_date, task.end_date, exclude_task_id=task.id)

        task.user_id = user_id
        db.session.commit()
        logger.info(f"TASK_ASSIGNED: Task {task.id} -> User {user.id}")
        return task

    @staticmethod
    def update_task_status(task_id: int, new_status: TaskStatus) -> Task:
        task = Task.query.get_or_404(task_id)

        # Rule 1: Completion constraint
        validate_task_completion(task, new_status)

        old_status = task.status
        task.status = new_status
        db.session.commit()
        
        event = "TASK_UPDATED"
        if new_status == TaskStatus.COMPLETED:
            event = "TASK_COMPLETED"
        
        logger.info(f"{event}: Task {task.id} status {old_status.value} -> {new_status.value}")
        return task
