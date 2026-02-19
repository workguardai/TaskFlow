import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, User as UserIcon, RefreshCw } from 'lucide-react';
import { api } from '../api/client';
import type { User, ApiError } from '../types';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { UserForm } from '../components/users/UserForm';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../hooks/use-toast';

export function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const { toast } = useToast();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await api.get<User[]>('/users');
            setUsers(data);
        } catch (err) {
            const apiErr = err as ApiError;
            toast({
                title: 'Error',
                description: typeof apiErr.message === 'string' ? apiErr.message : 'Failed to fetch users',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                    <p className="text-muted-foreground">Manage your team and their status.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={fetchUsers} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button onClick={() => setShowForm(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add User
                    </Button>
                </div>
            </div>

            {showForm && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New User</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <UserForm
                                onSuccess={() => {
                                    setShowForm(false);
                                    fetchUsers();
                                }}
                                onCancel={() => setShowForm(false)}
                            />
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <Card className="hover:shadow-md transition-all">
                            <CardContent className="pt-6">
                                <div className="flex items-center space-x-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <UserIcon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg">{user.name}</h3>
                                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                                            {user.status}
                                        </Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground">ID: {user.id}</div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {!loading && users.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed rounded-xl">
                    <p className="text-muted-foreground">No users found. Create one to get started.</p>
                </div>
            )}
        </div>
    );
}
