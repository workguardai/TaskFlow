import { useState } from 'react';
import { api } from '../../api/client';
import type { Task, User, ApiError } from '../../types';
import { Button } from '../ui/Button';
import { Label } from '../ui/Label';
import { useToast } from '../../hooks/use-toast';

interface AssignTaskFormProps {
    task: Task;
    users: User[];
    onSuccess: () => void;
    onCancel: () => void;
}

export function AssignTaskForm({ task, users, onSuccess, onCancel }: AssignTaskFormProps) {
    const [userId, setUserId] = useState<number>(users[0]?.id || 0);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        try {
            setLoading(true);
            await api.post<Task>(`/tasks/${task.id}/assign`, { user_id: userId });
            toast({
                title: 'Success',
                description: 'Task assigned successfully.',
            });
            onSuccess();
        } catch (err) {
            const apiErr = err as ApiError;
            toast({
                title: 'Rule Violation',
                description: typeof apiErr.message === 'string' ? apiErr.message : 'Assignment failed',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="user">Select User</Label>
                <select
                    id="user"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={userId}
                    onChange={(e) => setUserId(Number(e.target.value))}
                >
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                    ))}
                </select>
                {users.length === 0 && <p className="text-xs text-destructive">No active users available.</p>}
            </div>
            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit" disabled={loading || users.length === 0}>
                    {loading ? 'Assigning...' : 'Assign Task'}
                </Button>
            </div>
        </form>
    );
}
