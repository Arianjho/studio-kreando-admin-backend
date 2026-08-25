import { useEffect, useRef } from 'react';
import { CloseIcon } from '@/Icons';

export default function Modal({
    isOpen,
    onClose,
    children,
    className = '',
    showCloseButton = true,
}) {
    const modalRef = useRef(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-99999 flex items-center justify-center overflow-y-auto p-4">
            <div
                className="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-xs dark:bg-gray-900/60"
                onClick={onClose}
            />
            <div
                ref={modalRef}
                className={`relative w-full rounded-2xl bg-white shadow-theme-lg dark:bg-gray-900 ${className}`}
                onClick={(event) => event.stopPropagation()}
            >
                {showCloseButton && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Cerrar"
                        className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                        <CloseIcon className="h-5 w-5" />
                    </button>
                )}
                {children}
            </div>
        </div>
    );
}
