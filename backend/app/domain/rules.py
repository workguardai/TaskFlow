from datetime import date
from app.models.models import User, UserStatus, Task, TaskStatus

class DomainException(Exception):
    def __init__(self, message: str, code: str = "RULE_VIOLATION"):
        self.message = message
        self.code = code
        super().__init__(message)

def validate_task_completion(task: Task, new_status: TaskStatus):
    """Rule 1 — : A task cannot be completed before its start_date."""
    if new_status == TaskStatus.COMPLETED and date.today() < task.start_date:
        raise DomainException("Task cannot be completed before its start date")

def validate_user_assignment(user: User):
    """Rule 2 — : A task cannot be assigned to an inactive user."""
    if user.status == UserStatus.INACTIVE:
        raise DomainException("User is inactive")

def validate_no_overlap(user: User, start_date: date, end_date: date, exclude_task_id: int = None):
    """Rule 3 — : A user cannot have two tasks that overlap in time."""
    for task in user.tasks:
        if exclude_task_id and task.id == exclude_task_id:
            continue
        
        # Check for overlap: (StartA <= EndB) and (EndA >= StartB)
        if start_date <= task.end_date and end_date >= task.start_date:
            raise DomainException(f"Task overlaps with an existing task: {task.title}")
