import { Link } from '@inertiajs/react';
import Logo from '@/Components/Logo';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10">
            <Link href="/" className="mb-8" aria-label="Studio Kreando">
                <Logo variant="full" tone="auto" height={48} />
            </Link>

            <div className="w-full overflow-hidden rounded-xl border border-border bg-card px-6 py-8 shadow-soft sm:max-w-md sm:px-8">
                {children}
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
                Panel de administración · Studio Kreando
            </p>
        </div>
    );
}
