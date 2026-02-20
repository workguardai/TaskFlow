import logging
from app.db import db
from app.models.models import User, Task, TaskStatus, UserStatus
from app.domain.rules import (
    validate_task_completion, 
    validate_user_assignment, 
    validate_no_overlap,
    DomainException
)

logger = logging.getLogger(__name__)

class TaskService:
    @staticmethod
    def _row_to_user(row):
        if not row: return None
        return User(id=row['id'], name=row['name'], status=UserStatus(row['status']))

    @staticmethod
    def _row_to_task(row):
        if not row: return None
        return Task(
            id=row['id'], 
            title=row['title'], 
            start_date=row['start_date'], 
            end_date=row['end_date'], 
            status=TaskStatus(row['status']),
            user_id=row['user_id']
        )

    @staticmethod
    def create_user(name: str, status: any = UserStatus.ACTIVE) -> User:
        # Extract value if it's an enum
        status_val = status.value if hasattr(status, 'value') else status
        with db.get_cursor() as cur:
            cur.execute(
                "INSERT INTO users (name, status) VALUES (%s, %s) RETURNING *",
                (name, status_val)
            )
            row = cur.fetchone()
            user = TaskService._row_to_user(row)
            logger.info(f"USER_CREATED: {user.name} (ID: {user.id})")
            return user

    @staticmethod
    def get_users() -> list[User]:
        with db.get_cursor() as cur:
            cur.execute("SELECT * FROM users")
            rows = cur.fetchall()
            return [TaskService._row_to_user(r) for r in rows]

    @staticmethod
    def get_user(user_id: int) -> User:
        with db.get_cursor() as cur:
            cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
            row = cur.fetchone()
            if not row:
                raise DomainException(f"User with ID {user_id} not found", code="NOT_FOUND")
            return TaskService._row_to_user(row)

    @staticmethod
    def create_task(title: str, start_date, end_date) -> Task:
        if start_date > end_date:
            raise DomainException("Start date cannot be after end date")
            
        with db.get_cursor() as cur:
            cur.execute(
                "INSERT INTO tasks (title, start_date, end_date) VALUES (%s, %s, %s) RETURNING *",
                (title, start_date, end_date)
            )
            row = cur.fetchone()
            task = TaskService._row_to_task(row)
            logger.info(f"TASK_CREATED: {task.title} (ID: {task.id})")
            return task

    @staticmethod
    def get_tasks() -> list[Task]:
        with db.get_cursor() as cur:
            cur.execute("SELECT * FROM tasks")
            rows = cur.fetchall()
            return [TaskService._row_to_task(r) for r in rows]

    @staticmethod
    def get_task(task_id: int) -> Task:
        with db.get_cursor() as cur:
            cur.execute("SELECT * FROM tasks WHERE id = %s", (task_id,))
            row = cur.fetchone()
            if not row:
                raise DomainException(f"Task with ID {task_id} not found", code="NOT_FOUND")
            return TaskService._row_to_task(row)

    @staticmethod
    def get_user_tasks(user_id: int) -> list[Task]:
        with db.get_cursor() as cur:
            cur.execute("SELECT * FROM tasks WHERE user_id = %s", (user_id,))
            rows = cur.fetchall()
            return [TaskService._row_to_task(r) for r in rows]

    @staticmethod
    def assign_task(task_id: int, user_id: int) -> Task:
        task = TaskService.get_task(task_id)
        user = TaskService.get_user(user_id)

        # Rule 2: Assignment constraint
        validate_user_assignment(user)

        # Rule 3: Overlap constraint
        existing_tasks = TaskService.get_user_tasks(user_id)
        validate_no_overlap(existing_tasks, task.start_date, task.end_date, exclude_task_id=task.id)

        with db.get_cursor() as cur:
            cur.execute(
                "UPDATE tasks SET user_id = %s WHERE id = %s RETURNING *",
                (user_id, task_id)
            )
            row = cur.fetchone()
            updated_task = TaskService._row_to_task(row)
            logger.info(f"TASK_ASSIGNED: Task {task_id} -> User {user_id}")
            return updated_task

    @staticmethod
    def update_task_status(task_id: int, new_status: TaskStatus) -> Task:
        task = TaskService.get_task(task_id)

        # Rule 1: Completion constraint
        validate_task_completion(task, new_status)

        old_status = task.status
        
        with db.get_cursor() as cur:
            cur.execute(
                "UPDATE tasks SET status = %s WHERE id = %s RETURNING *",
                (new_status.value, task_id)
            )
            row = cur.fetchone()
            updated_task = TaskService._row_to_task(row)
        
        event = "TASK_UPDATED"
        if new_status == TaskStatus.COMPLETED:
            event = "TASK_COMPLETED"
        
        logger.info(f"{event}: Task {task_id} status {old_status.value} -> {new_status.value}")
        return updated_task

