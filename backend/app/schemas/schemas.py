from datetime import date
from pydantic import BaseModel, ConfigDict
from app.models.models import UserStatus, TaskStatus

class UserBase(BaseModel):
    name: str

class UserCreate(UserBase):
    status: UserStatus = UserStatus.ACTIVE

class UserSchema(UserBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    status: UserStatus

class TaskBase(BaseModel):
    title: str
    start_date: date
    end_date: date

class TaskCreate(TaskBase):
    pass

class TaskSchema(TaskBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    status: TaskStatus
    user_id: int | None = None

class TaskStatusUpdate(BaseModel):
    status: TaskStatus

class TaskAssignment(BaseModel):
    user_id: int
