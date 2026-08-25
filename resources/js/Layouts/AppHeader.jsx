import { useSidebar } from '@/Context/SidebarContext';
import ThemeToggleButton from '@/Components/ThemeToggleButton';
import UserDropdown from '@/Components/UserDropdown';
import { CloseIcon, MenuIcon } from '@/Icons';

export default function AppHeader() {
    const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

    const handleToggle = () => {
        if (window.innerWidth >= 1024) {
            toggleSidebar();
        } else {
            toggleMobileSidebar();
        }
    };

    return (
        <header className="sticky top-0 z-99999 flex w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="flex w-full items-center justify-between gap-3 px-4 py-3 lg:px-6">
                <button
                    type="button"
                    onClick={handleToggle}
                    aria-label="Alternar menú lateral"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400"
                >
                    {isMobileOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
                </button>

                <div className="flex items-center gap-3">
                    <ThemeToggleButton />
                    <UserDropdown />
                </div>
            </div>
        </header>
    );
}
