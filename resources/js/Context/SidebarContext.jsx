import { createContext, useContext, useEffect, useState } from 'react';

const SidebarContext = createContext(undefined);

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar debe usarse dentro de SidebarProvider');
    }

    return context;
}

export function SidebarProvider({ children }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState(null);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (!mobile) {
                setIsMobileOpen(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setIsExpanded((prev) => !prev);
    const toggleMobileSidebar = () => setIsMobileOpen((prev) => !prev);
    const toggleSubmenu = (item) =>
        setOpenSubmenu((prev) => (prev === item ? null : item));

    return (
        <SidebarContext.Provider
            value={{
                isExpanded: isMobile ? false : isExpanded,
                isMobileOpen,
                isHovered,
                openSubmenu,
                toggleSidebar,
                toggleMobileSidebar,
                setIsHovered,
                toggleSubmenu,
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
}
