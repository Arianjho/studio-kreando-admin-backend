import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-10 dark:bg-gray-950">
            <Link href="/" className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
                Studio Kreando
            </Link>

            <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 py-8 shadow-theme-sm sm:max-w-md sm:px-8 dark:border-gray-800 dark:bg-gray-900">
                {children}
            </div>
        </div>
    );
}
