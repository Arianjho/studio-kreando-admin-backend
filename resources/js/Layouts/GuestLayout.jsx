import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10">
            <Link href="/" className="mb-8 font-display text-2xl font-bold">
                Studio Kreando
            </Link>

            <div className="w-full overflow-hidden rounded-xl border border-border bg-card px-6 py-8 shadow-soft sm:max-w-md sm:px-8">
                {children}
            </div>
        </div>
    );
}
