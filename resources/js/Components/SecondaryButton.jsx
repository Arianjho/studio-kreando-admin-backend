import { Button } from '@/Components/ui/button';

export default function SecondaryButton({ type = 'button', className = '', disabled, children, ...props }) {
    return (
        <Button type={type} variant="outline" disabled={disabled} className={className} {...props}>
            {children}
        </Button>
    );
}
