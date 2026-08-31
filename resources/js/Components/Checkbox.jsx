import { cn } from '@/lib/utils';

export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={cn(
                'rounded border-input text-primary shadow-sm focus:ring-ring focus:ring-offset-background',
                className,
            )}
        />
    );
}
