import { Head } from '@inertiajs/react';
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar';
import { Toaster } from '@/Components/ui/sonner';
import AppSidebar from '@/Layouts/AppSidebar';
import TopNav from '@/Layouts/TopNav';
import FlashToaster from '@/Components/ui/FlashToaster';

export default function AdminLayout({ title, header, description, actions, children }) {
    return (
        <SidebarProvider>
            <Head title={title} />
            <Toaster richColors position="top-right" />
            <FlashToaster />

            <div className="flex min-h-screen w-full bg-background">
                <AppSidebar />
                <SidebarInset className="min-w-0 bg-background">
                    <TopNav />
                    <main className="min-w-0 flex-1 px-3 py-5 sm:px-6 sm:py-7">
                        <div className="w-full">
                            {(header || description || actions) && (
                                <header className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
                                    <div className="min-w-0">
                                        {header && (
                                            <h1 className="truncate font-display text-2xl font-bold sm:text-3xl">{header}</h1>
                                        )}
                                        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
                                    </div>
                                    {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
                                </header>
                            )}
                            {children}
                        </div>
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
