import { Button } from '@/Components/ui/button';

export default function PrimaryButton({ type = 'submit', className = '', disabled, children, ...props }) {
    return (
        <Button type={type} disabled={disabled} className={className} {...props}>
            {children}
        </Button>
    );
}
