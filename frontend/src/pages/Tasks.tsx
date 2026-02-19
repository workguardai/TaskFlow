import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, RefreshCw, UserCheck, Activity } from 'lucide-react';
import { api } from '../api/client';
import type { Task, User } from '../types';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../hooks/use-toast';
import { TaskForm } from '../components/tasks/TaskForm';
import { AssignTaskForm } from '../components/tasks/AssignTaskForm';
import { StatusUpdateForm } from '../components/tasks/StatusUpdateForm';

export function Tasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedTaskForAssign, setSelectedTaskForAssign] = useState<Task | null>(null);
    const [selectedTaskForStatus, setSelectedTaskForStatus] = useState<Task | null>(null);

    const { toast } = useToast();

    const fetchData = async () => {
        try {
            setLoading(true);
            const [tasksData, usersData] = await Promise.all([
                api.get<Task[]>('/tasks'),
                api.get<User[]>('/users'),
            ]);
            setTasks(tasksData);
            setUsers(usersData);
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Failed to fetch tasks or users',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getUserName = (userId: number | null) => {
        if (!userId) return 'Unassigned';
        return users.find((u) => u.id === userId)?.name || 'Unknown User';
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
                    <p className="text-muted-foreground">Monitor and control systemic task flow.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={fetchData} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button onClick={() => setShowForm(true)}>
                        <Plus className="mr-2 h-4 w-4" /> New Task
                    </Button>
                </div>
            </div>

            {showForm && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New Task</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TaskForm onSuccess={() => { setShowForm(false); fetchData(); }} onCancel={() => setShowForm(false)} />
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {selectedTaskForAssign && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <Card className="border-primary/50 shadow-md">
                        <CardHeader>
                            <CardTitle>Assign Task: {selectedTaskForAssign.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AssignTaskForm
                                task={selectedTaskForAssign}
                                users={users.filter(u => u.status === 'active')}
                                onSuccess={() => { setSelectedTaskForAssign(null); fetchData(); }}
                                onCancel={() => setSelectedTaskForAssign(null)}
                            />
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {selectedTaskForStatus && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <Card className="border-primary/50 shadow-md">
                        <CardHeader>
                            <CardTitle>Update Status: {selectedTaskForStatus.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <StatusUpdateForm
                                task={selectedTaskForStatus}
                                onSuccess={() => { setSelectedTaskForStatus(null); fetchData(); }}
                                onCancel={() => setSelectedTaskForStatus(null)}
                            />
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tasks.map((task) => (
                    <motion.div key={task.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} whileHover={{ scale: 1.01 }}>
                        <Card className="h-full flex flex-col hover:shadow-lg transition-all overflow-hidden border-l-4 border-l-primary">
                            <CardContent className="pt-6 flex-1 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold leading-none">{task.title}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {task.start_date} → {task.end_date}
                                        </p>
                                    </div>
                                    <Badge variant={task.status === 'completed' ? 'default' : task.status === 'in_progress' ? 'secondary' : 'outline'}>
                                        {task.status.replace('_', ' ')}
                                    </Badge>
                                </div>

                                <div className="flex items-center text-sm font-medium">
                                    <UserCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span>Assigned to: <span className="text-primary">{getUserName(task.user_id)}</span></span>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedTaskForAssign(task)}>
                                        <UserCheck className="mr-2 h-4 w-4" /> Assign
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedTaskForStatus(task)}>
                                        <Activity className="mr-2 h-4 w-4" /> Status
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {!loading && tasks.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed rounded-xl">
                    <p className="text-muted-foreground">No tasks found. Create one to begin.</p>
                </div>
            )}
        </div>
    );
}
