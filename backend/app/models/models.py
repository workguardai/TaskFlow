from datetime import date
import enum
from dataclasses import dataclass
from typing import Optional

class UserStatus(enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"

class TaskStatus(enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

@dataclass
class User:
    id: Optional[int]
    name: str
    status: UserStatus = UserStatus.ACTIVE

@dataclass
class Task:
    id: Optional[int]
    title: str
    start_date: date
    end_date: date
    status: TaskStatus = TaskStatus.PENDING
    user_id: Optional[int] = None

