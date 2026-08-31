import { Button } from '@/Components/ui/button';

export default function DangerButton({ className = '', disabled, children, ...props }) {
    return (
        <Button type="button" variant="destructive" disabled={disabled} className={className} {...props}>
            {children}
        </Button>
    );
}
