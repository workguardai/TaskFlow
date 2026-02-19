import { motion } from 'framer-motion';
import { CheckSquare, Users, ShieldAlert, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface LandingProps {
    onNavigate: (page: string) => void;
}

export function Landing({ onNavigate }: LandingProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const features = [
        {
            title: 'Task Assignment Rules',
            description: 'Automatically enforce assignment constraints. No assigning tasks to inactive users.',
            icon: Users,
        },
        {
            title: 'Conflict Protection',
            description: 'Prevent overlapping tasks for the same user. Keep schedules clean and realistic.',
            icon: ShieldAlert,
        },
        {
            title: 'Status Enforcement',
            description: 'Strict transition rules for tasks. No skipping steps or unauthorized updates.',
            icon: CheckSquare,
        },
    ];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center justify-center space-y-16 py-12"
        >
            <div className="text-center space-y-6 max-w-3xl">
                <motion.h1
                    variants={itemVariants}
                    className="text-5xl font-extrabold tracking-tight sm:text-6xl"
                >
                    Manage Tasks with <span className="text-primary">Precision</span>
                </motion.h1>
                <motion.p
                    variants={itemVariants}
                    className="text-xl text-muted-foreground"
                >
                    A sophisticated rules engine that ensures correctness in task management.
                    No more overlaps, no more invalid assignments.
                </motion.p>
                <motion.div variants={itemVariants} className="flex justify-center gap-4">
                    {/* @ts-ignore */}
                    <Button size="lg" onClick={() => onNavigate('tasks')}>
                        Explore Tasks <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    {/* @ts-ignore */}
                    <Button size="lg" variant="outline" onClick={() => onNavigate('users')}>
                        Manage Users
                    </Button>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        className="p-8 rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all"
                    >
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                            <feature.icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
