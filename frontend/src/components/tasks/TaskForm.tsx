import { useState } from 'react';
import { api } from '../../api/client';
import type { Task, ApiError } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { useToast } from '../../hooks/use-toast';

interface TaskFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export function TaskForm({ onSuccess, onCancel }: TaskFormProps) {
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !startDate || !endDate) return;

        try {
            setLoading(true);
            await api.post<Task>('/tasks', {
                title,
                start_date: startDate,
                end_date: endDate
            });
            toast({
                title: 'Success',
                description: 'Task created successfully.',
            });
            onSuccess();
        } catch (err) {
            const apiErr = err as ApiError;
            toast({
                title: 'Rule Violation',
                description: typeof apiErr.message === 'string' ? apiErr.message : 'Invalid dates or title',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input id="start_date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input id="end_date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Task'}</Button>
            </div>
        </form>
    );
}
