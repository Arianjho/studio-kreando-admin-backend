import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useSidebar } from '@/Context/SidebarContext';
import {
    BuildingIcon,
    ChevronDownIcon,
    FolderIcon,
    GridIcon,
    HorizontalDotsIcon,
    ImageIcon,
    MailIcon,
    SettingsIcon,
    UsersIcon,
} from '@/Icons';

const navItems = [
    { icon: <GridIcon />, name: 'Panel', path: 'admin.dashboard' },
    { icon: <FolderIcon />, name: 'Categorías', path: 'admin.categories.index' },
    { icon: <BuildingIcon />, name: 'Proyectos', path: 'admin.projects.index' },
    { icon: <MailIcon />, name: 'Mensajes', path: 'admin.messages.index' },
    { icon: <ImageIcon />, name: 'Multimedia', path: 'admin.media.index' },
    {
        icon: <SettingsIcon />,
        name: 'Contenido del sitio',
        subItems: [
            { name: 'Inicio', path: 'admin.content.home' },
            { name: 'Nosotros', path: 'admin.content.about' },
            { name: 'Contacto', path: 'admin.content.contact' },
            { name: 'Ajustes generales', path: 'admin.content.settings' },
        ],
    },
    { icon: <UsersIcon />, name: 'Usuarios', path: 'admin.users.index' },
];

export default function AppSidebar() {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
    const { url } = usePage();

    const [openSubmenu, setOpenSubmenu] = useState(null);
    const [subMenuHeight, setSubMenuHeight] = useState({});
    const subMenuRefs = useRef({});

    const isActive = useCallback(
        (routeName) => route().has(routeName) && url.startsWith(new URL(route(routeName)).pathname),
        [url],
    );

    useEffect(() => {
        let matched = false;
        navItems.forEach((nav, index) => {
            nav.subItems?.forEach((subItem) => {
                if (isActive(subItem.path)) {
                    setOpenSubmenu(index);
                    matched = true;
                }
            });
        });
        if (!matched) {
            setOpenSubmenu(null);
        }
    }, [url, isActive]);

    useEffect(() => {
        if (openSubmenu !== null && subMenuRefs.current[openSubmenu]) {
            setSubMenuHeight((prev) => ({
                ...prev,
                [openSubmenu]: subMenuRefs.current[openSubmenu]?.scrollHeight || 0,
            }));
        }
    }, [openSubmenu]);

    const showLabels = isExpanded || isHovered || isMobileOpen;

    return (
        <aside
            className={`fixed left-0 top-0 z-50 mt-16 flex h-screen flex-col border-r border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 lg:mt-0
                ${isExpanded || isMobileOpen ? 'w-[290px]' : isHovered ? 'w-[290px]' : 'w-[90px]'}
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0`}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`flex py-8 ${showLabels ? 'justify-start' : 'lg:justify-center'}`}>
                <Link href={route('admin.dashboard')} className="text-lg font-bold text-gray-900 dark:text-white">
                    {showLabels ? 'Studio Kreando' : 'SK'}
                </Link>
            </div>

            <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
                <nav className="mb-6">
                    <h2
                        className={`mb-4 flex text-xs uppercase leading-5 text-gray-400 ${showLabels ? 'justify-start' : 'lg:justify-center'}`}
                    >
                        {showLabels ? 'Menú' : <HorizontalDotsIcon className="size-6" />}
                    </h2>
                    <ul className="flex flex-col gap-2">
                        {navItems.map((nav, index) => (
                            <li key={nav.name}>
                                {nav.subItems ? (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenSubmenu((prev) => (prev === index ? null : index))
                                        }
                                        className={`menu-item group w-full cursor-pointer ${
                                            openSubmenu === index ? 'menu-item-active' : 'menu-item-inactive'
                                        } ${!showLabels ? 'lg:justify-center' : 'lg:justify-start'}`}
                                    >
                                        <span
                                            className={`menu-item-icon-size ${
                                                openSubmenu === index
                                                    ? 'menu-item-icon-active'
                                                    : 'menu-item-icon-inactive'
                                            }`}
                                        >
                                            {nav.icon}
                                        </span>
                                        {showLabels && <span className="menu-item-text">{nav.name}</span>}
                                        {showLabels && (
                                            <ChevronDownIcon
                                                className={`ml-auto h-5 w-5 transition-transform duration-200 ${
                                                    openSubmenu === index ? 'rotate-180 text-brand-500' : ''
                                                }`}
                                            />
                                        )}
                                    </button>
                                ) : (
                                    route().has(nav.path) && (
                                        <Link
                                            href={route(nav.path)}
                                            className={`menu-item group ${
                                                isActive(nav.path) ? 'menu-item-active' : 'menu-item-inactive'
                                            }`}
                                        >
                                            <span
                                                className={`menu-item-icon-size ${
                                                    isActive(nav.path)
                                                        ? 'menu-item-icon-active'
                                                        : 'menu-item-icon-inactive'
                                                }`}
                                            >
                                                {nav.icon}
                                            </span>
                                            {showLabels && <span className="menu-item-text">{nav.name}</span>}
                                        </Link>
                                    )
                                )}

                                {nav.subItems && showLabels && (
                                    <div
                                        ref={(el) => (subMenuRefs.current[index] = el)}
                                        className="overflow-hidden transition-all duration-300"
                                        style={{
                                            height: openSubmenu === index ? `${subMenuHeight[index]}px` : '0px',
                                        }}
                                    >
                                        <ul className="ml-9 mt-2 space-y-1">
                                            {nav.subItems.map(
                                                (subItem) =>
                                                    route().has(subItem.path) && (
                                                        <li key={subItem.name}>
                                                            <Link
                                                                href={route(subItem.path)}
                                                                className={
                                                                    isActive(subItem.path)
                                                                        ? 'menu-dropdown-item menu-dropdown-item-active'
                                                                        : 'menu-dropdown-item menu-dropdown-item-inactive'
                                                                }
                                                            >
                                                                {subItem.name}
                                                            </Link>
                                                        </li>
                                                    ),
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    );
}
