import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/ui/Modal';
import ConfirmModal from '@/Components/ui/ConfirmModal';
import Badge from '@/Components/ui/Badge';
import { EnvelopeOpenIcon, EyeIcon, TrashIcon } from '@/Icons';

export default function MessagesIndex({ messages }) {
    const [viewingMessage, setViewingMessage] = useState(null);
    const [deletingMessage, setDeletingMessage] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const items = messages.data ?? [];

    const openView = (message) => {
        setViewingMessage(message);
        if (!message.read) {
            router.patch(route('admin.messages.read', message.id), {}, { preserveScroll: true });
        }
    };

    const confirmDelete = () => {
        setDeleting(true);
        router.delete(route('admin.messages.destroy', deletingMessage.id), {
            onFinish: () => {
                setDeleting(false);
                setDeletingMessage(null);
                setViewingMessage(null);
            },
        });
    };

    return (
        <AdminLayout title="Mensajes" header="Mensajes">
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
                    <h2 className="text-base font-medium text-gray-800 dark:text-white/90">
                        {messages.total} mensaje{messages.total === 1 ? '' : 's'}
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-800">
                                <th className="px-6 py-3 text-theme-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                    Remitente
                                </th>
                                <th className="px-6 py-3 text-theme-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                    Asunto
                                </th>
                                <th className="px-6 py-3 text-theme-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                    Fecha
                                </th>
                                <th className="px-6 py-3 text-theme-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-right text-theme-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                        No hay mensajes registrados todavía.
                                    </td>
                                </tr>
                            )}
                            {items.map((message) => (
                                <tr key={message.id} className="border-b border-gray-100 last:border-0 dark:border-gray-800">
                                    <td className="px-6 py-3">
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">{message.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{message.email}</p>
                                    </td>
                                    <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-300">{message.subject}</td>
                                    <td className="px-6 py-3 text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(message.created_at).toLocaleDateString('es-PE', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </td>
                                    <td className="px-6 py-3">
                                        <Badge color={message.read ? 'gray' : 'brand'}>
                                            {message.read ? 'Leído' : 'Nuevo'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openView(message)}
                                                aria-label="Ver mensaje"
                                                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
                                            >
                                                <EyeIcon className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeletingMessage(message)}
                                                aria-label="Eliminar"
                                                className="flex h-9 w-9 items-center justify-center rounded-lg text-error-500 transition hover:bg-error-50 dark:hover:bg-error-500/10"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {messages.links && messages.links.length > 3 && (
                    <div className="flex flex-wrap items-center justify-center gap-1 border-t border-gray-200 px-6 py-4 dark:border-gray-800">
                        {messages.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url ?? '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-lg px-3 py-1.5 text-sm ${
                                    link.active
                                        ? 'bg-brand-500 text-white'
                                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5'
                                } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <Modal isOpen={Boolean(viewingMessage)} onClose={() => setViewingMessage(null)} className="max-w-lg">
                {viewingMessage && (
                    <div className="p-6">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-500 dark:bg-brand-500/15">
                                <EnvelopeOpenIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                                    {viewingMessage.subject}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {viewingMessage.name} · {viewingMessage.email}
                                </p>
                            </div>
                        </div>
                        <p className="whitespace-pre-line text-sm text-gray-600 dark:text-gray-300">
                            {viewingMessage.message}
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setDeletingMessage(viewingMessage)}
                                className="flex items-center gap-2 rounded-lg border border-error-200 px-4 py-2.5 text-sm font-medium text-error-600 transition hover:bg-error-50 dark:border-error-500/30 dark:text-error-400 dark:hover:bg-error-500/10"
                            >
                                <TrashIcon className="h-4 w-4" />
                                Eliminar
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            <ConfirmModal
                isOpen={Boolean(deletingMessage)}
                onClose={() => setDeletingMessage(null)}
                onConfirm={confirmDelete}
                title="Eliminar mensaje"
                message={`¿Está seguro de que desea eliminar el mensaje de "${deletingMessage?.name}"? Podrá restaurarlo más adelante desde el sistema si es necesario.`}
                confirmLabel="Eliminar"
                isLoading={deleting}
            />
        </AdminLayout>
    );
}
