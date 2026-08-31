import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default forwardRef(function Select({ className = '', children, ...props }, ref) {
    return (
        <div className="relative">
            <select
                ref={ref}
                {...props}
                className={cn(
                    'h-9 w-full appearance-none rounded-md border border-input bg-transparent px-3 py-2 pr-9 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                    className,
                )}
            >
                {children}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
    );
});
