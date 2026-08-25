import Modal from '@/Components/ui/Modal';

export default function FormModal({
    isOpen,
    onClose,
    onSubmit,
    title,
    description,
    processing = false,
    submitLabel = 'Guardar',
    cancelLabel = 'Cancelar',
    className = 'max-w-lg',
    children,
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className={className}>
            <form onSubmit={onSubmit} className="flex max-h-[85vh] flex-col">
                <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        {title}
                    </h3>
                    {description && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {description}
                        </p>
                    )}
                </div>

                <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">{children}</div>

                <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-800">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/20 disabled:opacity-60"
                    >
                        {processing ? 'Guardando...' : submitLabel}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
