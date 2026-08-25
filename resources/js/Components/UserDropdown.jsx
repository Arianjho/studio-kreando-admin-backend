import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import ConfirmModal from '@/Components/ui/ConfirmModal';
import { ChevronDownIcon, LogoutIcon, UserCircleIcon } from '@/Icons';

export default function UserDropdown() {
    const { auth } = usePage().props;
    const user = auth.user;
    const [isOpen, setIsOpen] = useState(false);
    const [confirmingLogout, setConfirmingLogout] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const initials = user.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const handleLogout = () => {
        setLoggingOut(true);
        router.post(route('logout'), {}, {
            onFinish: () => {
                setLoggingOut(false);
                setConfirmingLogout(false);
            },
        });
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex items-center text-gray-700 dark:text-gray-400"
            >
                <span className="mr-3 flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-brand-500 text-sm font-semibold text-white">
                    {initials}
                </span>
                <span className="mr-1 hidden text-theme-sm font-medium sm:block">
                    {user.name}
                </span>
                <ChevronDownIcon
                    className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 z-50 mt-3 flex w-64 flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark">
                        <div className="px-1 py-1">
                            <span className="block text-theme-sm font-medium text-gray-700 dark:text-gray-300">
                                {user.name}
                            </span>
                            <span className="mt-0.5 block truncate text-theme-xs text-gray-500 dark:text-gray-400">
                                {user.email}
                            </span>
                        </div>

                        <ul className="flex flex-col gap-1 border-b border-gray-200 py-3 dark:border-gray-800">
                            <li>
                                <Link
                                    href={route('profile.edit')}
                                    onClick={() => setIsOpen(false)}
                                    className="group flex items-center gap-3 rounded-lg px-3 py-2 text-theme-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
                                >
                                    <UserCircleIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    Mi perfil
                                </Link>
                            </li>
                        </ul>

                        <button
                            type="button"
                            onClick={() => {
                                setIsOpen(false);
                                setConfirmingLogout(true);
                            }}
                            className="group mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-left text-theme-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
                        >
                            <LogoutIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            Cerrar sesión
                        </button>
                    </div>
                </>
            )}

            <ConfirmModal
                isOpen={confirmingLogout}
                onClose={() => setConfirmingLogout(false)}
                onConfirm={handleLogout}
                title="Cerrar sesión"
                message="¿Está seguro de que desea cerrar la sesión actual?"
                confirmLabel="Cerrar sesión"
                variant="brand"
                isLoading={loggingOut}
            />
        </div>
    );
}
