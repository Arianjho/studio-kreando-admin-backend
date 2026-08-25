import { useMemo, useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import FormModal from '@/Components/ui/FormModal';
import ConfirmModal from '@/Components/ui/ConfirmModal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { PencilIcon, PlusIcon, TrashIcon, UploadIcon } from '@/Icons';

export default function MediaIndex({ media }) {
    const [mode, setMode] = useState(null); // 'create' | 'edit' | null
    const [editingMedia, setEditingMedia] = useState(null);
    const [deletingMedia, setDeletingMedia] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors, transform } = useForm({
        file: null,
        alt: '',
    });

    const openCreate = () => {
        setMode('create');
        setEditingMedia(null);
        setPreviewUrl(null);
        reset();
        clearErrors();
    };

    const openEdit = (item) => {
        setMode('edit');
        setEditingMedia(item);
        setPreviewUrl(item.url);
        setData('alt', item.alt);
        clearErrors();
    };

    const closeForm = () => {
        setMode(null);
        setEditingMedia(null);
        setPreviewUrl(null);
        reset();
        clearErrors();
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0] ?? null;
        setData('file', file);
        setPreviewUrl(file ? URL.createObjectURL(file) : null);
    };

    const submit = (event) => {
        event.preventDefault();

        if (mode === 'edit' && editingMedia) {
            router.post(
                route('admin.media.update', editingMedia.id),
                { _method: 'put', alt: data.alt },
                { onSuccess: closeForm },
            );
            return;
        }

        post(route('admin.media.store'), {
            forceFormData: true,
            onSuccess: closeForm,
        });
    };

    const confirmDelete = () => {
        setDeleting(true);
        router.delete(route('admin.media.destroy', deletingMedia.id), {
            onFinish: () => {
                setDeleting(false);
                setDeletingMedia(null);
            },
        });
    };

    const items = media.data ?? [];

    return (
        <AdminLayout title="Multimedia" header="Multimedia">
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
                    <h2 className="text-base font-medium text-gray-800 dark:text-white/90">
                        {media.total} archivo{media.total === 1 ? '' : 's'}
                    </h2>
                    <button
                        type="button"
                        onClick={openCreate}
                        className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600"
                    >
                        <PlusIcon className="h-4 w-4" />
                        Subir archivo
                    </button>
                </div>

                <div className="p-6">
                    {items.length === 0 ? (
                        <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                            No hay archivos multimedia todavía.
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
                                >
                                    <img
                                        src={item.url}
                                        alt={item.alt}
                                        className="aspect-square w-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-gray-900/60 opacity-0 transition group-hover:opacity-100">
                                        <button
                                            type="button"
                                            onClick={() => openEdit(item)}
                                            aria-label="Editar"
                                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 text-gray-700 hover:bg-white"
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDeletingMedia(item)}
                                            aria-label="Eliminar"
                                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 text-error-500 hover:bg-white"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <p className="truncate border-t border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                                        {item.alt}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {media.links && media.links.length > 3 && (
                    <div className="flex flex-wrap items-center justify-center gap-1 border-t border-gray-200 px-6 py-4 dark:border-gray-800">
                        {media.links.map((link, index) => (
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

            <FormModal
                isOpen={mode !== null}
                onClose={closeForm}
                onSubmit={submit}
                title={mode === 'edit' ? 'Editar archivo' : 'Subir archivo'}
                processing={processing}
            >
                {previewUrl && (
                    <img
                        src={previewUrl}
                        alt="Vista previa"
                        className="mx-auto h-40 w-40 rounded-lg object-cover"
                    />
                )}

                {mode === 'create' && (
                    <div>
                        <InputLabel htmlFor="file" value="Imagen" />
                        <label
                            htmlFor="file"
                            className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500 hover:border-brand-300 hover:text-brand-500 dark:border-gray-700 dark:text-gray-400"
                        >
                            <UploadIcon className="h-5 w-5" />
                            {data.file ? data.file.name : 'Seleccionar imagen (máx. 5 MB)'}
                        </label>
                        <input
                            id="file"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <InputError className="mt-1.5" message={errors.file} />
                    </div>
                )}

                <div>
                    <InputLabel htmlFor="alt" value="Texto alternativo" />
                    <TextInput
                        id="alt"
                        className="mt-1.5 block w-full"
                        value={data.alt}
                        onChange={(event) => setData('alt', event.target.value)}
                    />
                    <InputError className="mt-1.5" message={errors.alt} />
                </div>
            </FormModal>

            <ConfirmModal
                isOpen={Boolean(deletingMedia)}
                onClose={() => setDeletingMedia(null)}
                onConfirm={confirmDelete}
                title="Eliminar archivo"
                message={`¿Está seguro de que desea eliminar "${deletingMedia?.alt}"? Podrá restaurarlo más adelante desde el sistema si es necesario.`}
                confirmLabel="Eliminar"
                isLoading={deleting}
            />
        </AdminLayout>
    );
}
