import { forwardRef } from 'react';
import { ChevronDownIcon } from '@/Icons';

export default forwardRef(function Select({ className = '', children, ...props }, ref) {
    return (
        <div className="relative">
            <select
                ref={ref}
                {...props}
                className={
                    'h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-10 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 ' +
                    className
                }
            >
                {children}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
    );
});
