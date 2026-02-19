import { motion } from 'framer-motion';
import { CheckSquare, Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t bg-card mt-auto py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <CheckSquare className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <span className="text-xl font-bold tracking-tight">TaskFlow</span>
                            <p className="text-sm text-muted-foreground">Precision Task Management</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center md:items-end space-y-4">
                        <div className="flex space-x-6 text-muted-foreground">
                            <motion.a
                                href="#"
                                whileHover={{ scale: 1.1, color: 'hsl(var(--primary))' }}
                                className="transition-colors"
                            >
                                <Github className="h-5 w-5" />
                            </motion.a>
                            <motion.a
                                href="#"
                                whileHover={{ scale: 1.1, color: 'hsl(var(--primary))' }}
                                className="transition-colors"
                            >
                                <Twitter className="h-5 w-5" />
                            </motion.a>
                            <motion.a
                                href="#"
                                whileHover={{ scale: 1.1, color: 'hsl(var(--primary))' }}
                                className="transition-colors"
                            >
                                <Linkedin className="h-5 w-5" />
                            </motion.a>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            &copy; {currentYear} TaskFlow. Built with precision for the modern era.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
