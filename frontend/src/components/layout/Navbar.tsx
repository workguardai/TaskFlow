import { motion } from 'framer-motion';
import { Layout, Users, CheckSquare } from 'lucide-react';

interface NavbarProps {
    currentPage: string;
    onPageChange: (page: string) => void;
}

export function Navbar({ currentPage, onPageChange }: NavbarProps) {
    const navItems = [
        { id: 'landing', label: 'Home', icon: Layout },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center px-4">
                <div className="mr-8 flex items-center space-x-2 cursor-pointer" onClick={() => onPageChange('landing')}>
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <CheckSquare className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">TaskFlow</span>
                </div>
                <div className="flex space-x-6">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => onPageChange(item.id)}
                                className={`relative flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{item.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="navbar-active"
                                        className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary"
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
