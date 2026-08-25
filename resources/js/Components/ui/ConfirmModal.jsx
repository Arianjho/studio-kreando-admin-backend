import Modal from '@/Components/ui/Modal';
import { AlertTriangleIcon } from '@/Icons';

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    variant = 'danger',
    isLoading = false,
}) {
    const confirmClasses =
        variant === 'danger'
            ? 'bg-error-500 hover:bg-error-600 focus:ring-error-500/20'
            : 'bg-brand-500 hover:bg-brand-600 focus:ring-brand-500/20';

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-md" showCloseButton={false}>
            <div className="p-6 text-center">
                <div
                    className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
                        variant === 'danger'
                            ? 'bg-error-50 text-error-500 dark:bg-error-500/15'
                            : 'bg-brand-50 text-brand-500 dark:bg-brand-500/15'
                    }`}
                >
                    <AlertTriangleIcon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                    {title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>

                <div className="mt-6 flex items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition focus:outline-none focus:ring-4 disabled:opacity-60 ${confirmClasses}`}
                    >
                        {isLoading ? 'Procesando...' : confirmLabel}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
