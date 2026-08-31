import { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { LogOut, Moon, Search, Sun, User } from 'lucide-react';

import { Button } from '@/Components/ui/button';
import { SidebarTrigger } from '@/Components/ui/sidebar';
import { Separator } from '@/Components/ui/separator';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/Components/ui/command';
import ConfirmModal from '@/Components/ui/ConfirmModal';
import Logo from '@/Components/Logo';
import { useTheme } from '@/Context/ThemeContext';

const searchableRoutes = [
    { label: 'Panel', path: 'admin.dashboard' },
    { label: 'Categorías', path: 'admin.categories.index' },
    { label: 'Proyectos', path: 'admin.projects.index' },
    { label: 'Consultas', path: 'admin.consultas.index' },
    { label: 'Multimedia', path: 'admin.media.index' },
    { label: 'Contenido — Inicio', path: 'admin.content.home' },
    { label: 'Contenido — Nosotros', path: 'admin.content.about' },
    { label: 'Contenido — Contacto', path: 'admin.content.contact' },
    { label: 'Ajustes generales', path: 'admin.content.settings' },
    { label: 'Usuarios', path: 'admin.users.index' },
    { label: 'Mi perfil', path: 'profile.edit' },
];

export default function TopNav() {
    const { theme, toggleTheme } = useTheme();
    const { auth } = usePage().props;
    const user = auth.user;
    const [openCommand, setOpenCommand] = useState(false);
    const [confirmingLogout, setConfirmingLogout] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const initials = user.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    useEffect(() => {
        const onKey = (event) => {
            if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                setOpenCommand((open) => !open);
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    const go = (path) => {
        setOpenCommand(false);
        if (route().has(path)) {
            router.visit(route(path));
        }
    };

    const handleLogout = () => {
        setLoggingOut(true);
        router.post(
            route('logout'),
            {},
            {
                onFinish: () => {
                    setLoggingOut(false);
                    setConfirmingLogout(false);
                },
            },
        );
    };

    return (
        <header className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 py-2.5 sm:gap-4 sm:px-5">
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <SidebarTrigger />

                    <Link
                        href={route('admin.dashboard')}
                        className="md:hidden"
                        aria-label="Studio Kreando — ir al panel"
                    >
                        <Logo variant="mark" tone="auto" height={20} />
                    </Link>

                    <Separator orientation="vertical" className="hidden h-6 sm:block" />

                    <button
                        type="button"
                        onClick={() => setOpenCommand(true)}
                        className="hidden h-9 flex-1 items-center gap-2 rounded-xl border border-border bg-background px-3 text-sm text-muted-foreground transition-colors hover:border-ring md:flex"
                    >
                        <Search className="size-4" />
                        <span className="flex-1 text-left">Buscar en el panel…</span>
                        <kbd className="rounded-md border border-border px-1.5 py-0.5 text-[10px]">⌘K</kbd>
                    </button>
                </div>

                <div className="flex items-center gap-1.5">
                    <Button variant="ghost" size="icon" className="md:hidden" aria-label="Buscar" onClick={() => setOpenCommand(true)}>
                        <Search className="size-4" />
                    </Button>

                    <Button variant="ghost" size="icon" aria-label="Cambiar tema" onClick={toggleTheme}>
                        {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="rounded-full ring-offset-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                <Avatar className="size-9">
                                    <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel className="flex flex-col">
                                <span className="text-sm font-semibold">{user.name}</span>
                                <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href={route('profile.edit')}>
                                    <User className="size-4" /> Mi perfil
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => toggleTheme()}>
                                {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
                                Tema {theme === 'dark' ? 'claro' : 'oscuro'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onSelect={() => setConfirmingLogout(true)}>
                                <LogOut className="size-4" /> Cerrar sesión
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <CommandDialog open={openCommand} onOpenChange={setOpenCommand}>
                <CommandInput placeholder="Buscar páginas…" />
                <CommandList>
                    <CommandEmpty>Sin resultados.</CommandEmpty>
                    <CommandGroup heading="Navegación">
                        {searchableRoutes
                            .filter((item) => route().has(item.path))
                            .map((item) => (
                                <CommandItem key={item.path} onSelect={() => go(item.path)}>
                                    {item.label}
                                </CommandItem>
                            ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>

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
        </header>
    );
}
