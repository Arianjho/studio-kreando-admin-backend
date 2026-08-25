export default function Footer() {
    return (
        <footer className="mx-auto max-w-(--breakpoint-2xl) px-4 py-6 text-center text-theme-xs text-gray-400 md:px-6 dark:text-gray-500">
            © {new Date().getFullYear()} Studio Kreando. Panel de administración.
        </footer>
    );
}
