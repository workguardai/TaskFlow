import { useState } from 'react';
import { api } from '../../api/client';
import type { Task, TaskStatus, ApiError } from '../../types';
import { Button } from '../ui/Button';
import { Label } from '../ui/Label';
import { useToast } from '../../hooks/use-toast';

interface StatusUpdateFormProps {
    task: Task;
    onSuccess: () => void;
    onCancel: () => void;
}

export function StatusUpdateForm({ task, onSuccess, onCancel }: StatusUpdateFormProps) {
    const [status, setStatus] = useState<TaskStatus>(task.status);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const statuses: TaskStatus[] = ['pending', 'in_progress', 'completed'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await api.post<Task>(`/tasks/${task.id}/status`, { status });
            toast({
                title: 'Success',
                description: 'Status updated successfully.',
            });
            onSuccess();
        } catch (err) {
            const apiErr = err as ApiError;
            toast({
                title: 'Rule Violation',
                description: typeof apiErr.message === 'string' ? apiErr.message : 'Invalid status transition',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label>New Status</Label>
                <div className="flex flex-wrap gap-2">
                    {statuses.map((s) => (
                        <Button
                            key={s}
                            type="button"
                            variant={status === s ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setStatus(s)}
                        >
                            {s.replace('_', ' ')}
                        </Button>
                    ))}
                </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit" disabled={loading || status === task.status}>
                    {loading ? 'Updating...' : 'Update Status'}
                </Button>
            </div>
        </form>
    );
}
