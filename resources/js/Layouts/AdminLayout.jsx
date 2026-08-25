import { Head } from '@inertiajs/react';
import { SidebarProvider, useSidebar } from '@/Context/SidebarContext';
import AppSidebar from '@/Layouts/AppSidebar';
import AppHeader from '@/Layouts/AppHeader';
import Backdrop from '@/Layouts/Backdrop';
import Footer from '@/Layouts/Footer';
import FlashBanner from '@/Components/ui/FlashBanner';

function LayoutContent({ title, header, children }) {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Head title={title} />
            <AppSidebar />
            <Backdrop />
            <div
                className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${
                    isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]'
                }`}
            >
                <AppHeader />
                <main className="mx-auto w-full max-w-(--breakpoint-2xl) flex-1 p-4 md:p-6">
                    {header && (
                        <div className="mb-6">
                            <h1 className="text-title-sm font-display font-semibold text-gray-800 dark:text-white/90">
                                {header}
                            </h1>
                        </div>
                    )}
                    <FlashBanner />
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default function AdminLayout({ title, header, children }) {
    return (
        <SidebarProvider>
            <LayoutContent title={title} header={header}>
                {children}
            </LayoutContent>
        </SidebarProvider>
    );
}
