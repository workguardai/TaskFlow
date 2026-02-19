export type UserStatus = 'active' | 'inactive';

export type User = {
    id: number;
    name: string;
    status: UserStatus;
};

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export type Task = {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
    status: TaskStatus;
    user_id: number | null;
};

export type ApiError = {
    error: string;
    message: string | any[];
};

export type UserCreateInput = {
    name: string;
    status?: UserStatus;
};

export type TaskCreateInput = {
    title: string;
    start_date: string;
    end_date: string;
};

export type TaskAssignmentInput = {
    user_id: number;
};

export type TaskStatusUpdateInput = {
    status: TaskStatus;
};
