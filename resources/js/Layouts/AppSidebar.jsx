import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Building2,
    ChevronDown,
    FolderKanban,
    Image as ImageIcon,
    LayoutGrid,
    Mail,
    Settings,
    Sparkles,
    Users,
} from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/Components/ui/sidebar';

const navGroups = [
    {
        label: 'General',
        items: [{ title: 'Panel', path: 'admin.dashboard', icon: LayoutGrid }],
    },
    {
        label: 'Portafolio',
        items: [
            { title: 'Categorías', path: 'admin.categories.index', icon: FolderKanban },
            { title: 'Proyectos', path: 'admin.projects.index', icon: Building2 },
            { title: 'Multimedia', path: 'admin.media.index', icon: ImageIcon },
        ],
    },
    {
        label: 'Comunicación',
        items: [{ title: 'Mensajes', path: 'admin.messages.index', icon: Mail }],
    },
    {
        label: 'Sistema',
        items: [
            {
                title: 'Contenido del sitio',
                icon: Settings,
                subItems: [
                    { title: 'Inicio', path: 'admin.content.home' },
                    { title: 'Nosotros', path: 'admin.content.about' },
                    { title: 'Contacto', path: 'admin.content.contact' },
                    { title: 'Ajustes generales', path: 'admin.content.settings' },
                ],
            },
            { title: 'Usuarios', path: 'admin.users.index', icon: Users },
        ],
    },
];

export default function AppSidebar() {
    const { url } = usePage();
    const { state } = useSidebar();
    const collapsed = state === 'collapsed';
    const [openGroup, setOpenGroup] = useState(null);

    const isActive = useCallback(
        (routeName) => route().has(routeName) && url.startsWith(new URL(route(routeName)).pathname),
        [url],
    );

    const flatSubItems = useMemo(
        () => navGroups.flatMap((group) => group.items).filter((item) => item.subItems),
        [],
    );

    useEffect(() => {
        const match = flatSubItems.find((item) => item.subItems.some((sub) => isActive(sub.path)));
        setOpenGroup(match ? match.title : null);
    }, [url, isActive, flatSubItems]);

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="px-3 py-4">
                <Link href={route('admin.dashboard')} className="flex items-center gap-2.5">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-brand text-sidebar-primary-foreground">
                        <Sparkles className="size-5" />
                    </span>
                    {!collapsed && (
                        <span className="min-w-0 truncate font-display text-lg font-extrabold tracking-tight text-sidebar-foreground">
                            Studio<span className="text-sidebar-primary">Kreando</span>
                        </span>
                    )}
                </Link>
            </SidebarHeader>

            <SidebarContent>
                {navGroups.map((group) => (
                    <SidebarGroup key={group.label}>
                        <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) =>
                                    item.subItems ? (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                onClick={() =>
                                                    setOpenGroup((prev) => (prev === item.title ? null : item.title))
                                                }
                                                isActive={openGroup === item.title}
                                                tooltip={item.title}
                                            >
                                                <item.icon />
                                                <span>{item.title}</span>
                                                <ChevronDown
                                                    className={`ml-auto size-4 shrink-0 transition-transform duration-200 ${
                                                        openGroup === item.title ? 'rotate-180' : ''
                                                    }`}
                                                />
                                            </SidebarMenuButton>
                                            {openGroup === item.title && (
                                                <SidebarMenuSub>
                                                    {item.subItems.map(
                                                        (sub) =>
                                                            route().has(sub.path) && (
                                                                <SidebarMenuSubItem key={sub.title}>
                                                                    <SidebarMenuSubButton asChild isActive={isActive(sub.path)}>
                                                                        <Link href={route(sub.path)}>{sub.title}</Link>
                                                                    </SidebarMenuSubButton>
                                                                </SidebarMenuSubItem>
                                                            ),
                                                    )}
                                                </SidebarMenuSub>
                                            )}
                                        </SidebarMenuItem>
                                    ) : (
                                        route().has(item.path) && (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton asChild isActive={isActive(item.path)} tooltip={item.title}>
                                                    <Link href={route(item.path)}>
                                                        <item.icon />
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        )
                                    ),
                                )}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
        </Sidebar>
    );
}
