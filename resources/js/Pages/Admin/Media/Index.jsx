import { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2, Upload } from 'lucide-react';

import AdminLayout from '@/Layouts/AdminLayout';
import FormModal from '@/Components/ui/FormModal';
import ConfirmModal from '@/Components/ui/ConfirmModal';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import { cn } from '@/lib/utils';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function MediaIndex({ media }) {
    const [mode, setMode] = useState(null); // 'create' | 'edit' | null
    const [editingMedia, setEditingMedia] = useState(null);
    const [deletingMedia, setDeletingMedia] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
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
            router.post(route('admin.media.update', editingMedia.id), { _method: 'put', alt: data.alt }, { onSuccess: closeForm });
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
        <AdminLayout
            title="Multimedia"
            header="Multimedia"
            description="Biblioteca de imágenes usada en proyectos y páginas de contenido."
            actions={
                <Button onClick={openCreate}>
                    <Plus className="size-4" /> Subir archivo
                </Button>
            }
        >
            <Card className="overflow-hidden shadow-soft">
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <h2 className="text-sm font-medium text-muted-foreground">
                        {media.total} archivo{media.total === 1 ? '' : 's'}
                    </h2>
                </div>

                <div className="p-6">
                    {items.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">No hay archivos multimedia todavía.</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                            {items.map((item) => (
                                <div key={item.id} className="group relative overflow-hidden rounded-xl border border-border">
                                    <img src={item.url} alt={item.alt} className="aspect-square w-full object-cover" />
                                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition group-hover:opacity-100">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="icon"
                                            aria-label="Editar"
                                            onClick={() => openEdit(item)}
                                        >
                                            <Pencil className="size-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="icon"
                                            aria-label="Eliminar"
                                            className="text-destructive"
                                            onClick={() => setDeletingMedia(item)}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                    <p className="truncate border-t border-border bg-card px-2 py-1.5 text-xs text-muted-foreground">
                                        {item.alt}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {media.links && media.links.length > 3 && (
                    <div className="flex flex-wrap items-center justify-center gap-1 border-t border-border px-6 py-4">
                        {media.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url ?? '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={cn(
                                    'rounded-lg px-3 py-1.5 text-sm',
                                    link.active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent',
                                    !link.url && 'pointer-events-none opacity-40',
                                )}
                            />
                        ))}
                    </div>
                )}
            </Card>

            <FormModal isOpen={mode !== null} onClose={closeForm} onSubmit={submit} title={mode === 'edit' ? 'Editar archivo' : 'Subir archivo'} processing={processing}>
                {previewUrl && <img src={previewUrl} alt="Vista previa" className="mx-auto h-40 w-40 rounded-lg object-cover" />}

                {mode === 'create' && (
                    <div>
                        <InputLabel htmlFor="file" value="Imagen" />
                        <label
                            htmlFor="file"
                            className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted-foreground hover:border-primary hover:text-primary"
                        >
                            <Upload className="size-5" />
                            {data.file ? data.file.name : 'Seleccionar imagen (máx. 5 MB)'}
                        </label>
                        <input id="file" type="file" accept="image/*" required className="hidden" onChange={handleFileChange} />
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
                        required
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
