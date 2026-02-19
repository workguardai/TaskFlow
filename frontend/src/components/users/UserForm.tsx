import { useState } from 'react';
import { api } from '../../api/client';
import type { User, ApiError } from '../../types';
import { Button } from '../ui/Button';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import { useToast } from '../../hooks/use-toast';

interface UserFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export function UserForm({ onSuccess, onCancel }: UserFormProps) {
    const [name, setName] = useState('');
    const [status, setStatus] = useState<'active' | 'inactive'>('active');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            setLoading(true);
            await api.post<User>('/users', { name, status });
            toast({
                title: 'Success',
                description: `User "${name}" created successfully.`,
            });
            onSuccess();
        } catch (err) {
            const apiErr = err as ApiError;
            toast({
                title: 'Rule Violation',
                description: typeof apiErr.message === 'string' ? apiErr.message : 'Check input and try again',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    placeholder="Enter user name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex gap-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="radio"
                            name="status"
                            value="active"
                            checked={status === 'active'}
                            onChange={() => setStatus('active')}
                            className="h-4 w-4 text-primary focus:ring-primary"
                        />
                        <span>Active</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="radio"
                            name="status"
                            value="inactive"
                            checked={status === 'inactive'}
                            onChange={() => setStatus('inactive')}
                            className="h-4 w-4 text-primary focus:ring-primary"
                        />
                        <span>Inactive</span>
                    </label>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                {/* @ts-ignore */}
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create User'}
                </Button>
            </div>
        </form>
    );
}
