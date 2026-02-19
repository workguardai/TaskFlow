import { useToast } from '../../hooks/use-toast';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Toaster() {
    const { toasts, dismiss } = useToast();

    return (
        <div className="fixed bottom-0 right-0 z-[100] flex flex-col p-4 space-y-4 max-w-md w-full">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: 50, scale: 0.3 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                        className={`pointer-events-auto flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all ${toast.variant === 'destructive'
                                ? 'bg-destructive text-destructive-foreground'
                                : 'bg-background text-foreground'
                            }`}
                    >
                        <div className="flex items-center space-x-3">
                            {toast.variant === 'destructive' ? (
                                <AlertCircle className="h-5 w-5" />
                            ) : (
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                            )}
                            <div className="grid gap-1">
                                {toast.title && <div className="text-sm font-semibold">{toast.title}</div>}
                                {toast.description && (
                                    <div className="text-sm opacity-90">{toast.description}</div>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => dismiss(toast.id)}
                            className="rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
