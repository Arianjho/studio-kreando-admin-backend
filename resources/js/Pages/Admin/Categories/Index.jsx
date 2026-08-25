import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import FormModal from '@/Components/ui/FormModal';
import ConfirmModal from '@/Components/ui/ConfirmModal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { PencilIcon, PlusIcon, TrashIcon } from '@/Icons';

export default function CategoriesIndex({ categories }) {
    const [editingCategory, setEditingCategory] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [deletingCategory, setDeletingCategory] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
    });

    const openCreate = () => {
        setEditingCategory(null);
        reset();
        clearErrors();
        setIsFormOpen(true);
    };

    const openEdit = (category) => {
        setEditingCategory(category);
        setData('name', category.name);
        clearErrors();
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingCategory(null);
        reset();
        clearErrors();
    };

    const submit = (event) => {
        event.preventDefault();

        if (editingCategory) {
            put(route('admin.categories.update', editingCategory.id), {
                onSuccess: closeForm,
            });
        } else {
            post(route('admin.categories.store'), {
                onSuccess: closeForm,
            });
        }
    };

    const confirmDelete = () => {
        setDeleting(true);
        router.delete(route('admin.categories.destroy', deletingCategory.id), {
            onFinish: () => {
                setDeleting(false);
                setDeletingCategory(null);
            },
        });
    };

    return (
        <AdminLayout title="Categorías" header="Categorías">
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
                    <h2 className="text-base font-medium text-gray-800 dark:text-white/90">
                        {categories.length} categoría{categories.length === 1 ? '' : 's'}
                    </h2>
                    <button
                        type="button"
                        onClick={openCreate}
                        className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600"
                    >
                        <PlusIcon className="h-4 w-4" />
                        Nueva categoría
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-800">
                                <th className="px-6 py-3 text-theme-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                    Nombre
                                </th>
                                <th className="px-6 py-3 text-theme-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                    Proyectos
                                </th>
                                <th className="px-6 py-3 text-right text-theme-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                        No hay categorías registradas todavía.
                                    </td>
                                </tr>
                            )}
                            {categories.map((category) => (
                                <tr key={category.id} className="border-b border-gray-100 last:border-0 dark:border-gray-800">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                                        {category.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {category.projects_count}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openEdit(category)}
                                                aria-label="Editar"
                                                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeletingCategory(category)}
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
            </div>

            <FormModal
                isOpen={isFormOpen}
                onClose={closeForm}
                onSubmit={submit}
                title={editingCategory ? 'Editar categoría' : 'Nueva categoría'}
                processing={processing}
            >
                <div>
                    <InputLabel htmlFor="name" value="Nombre" />
                    <TextInput
                        id="name"
                        className="mt-1.5 block w-full"
                        value={data.name}
                        onChange={(event) => setData('name', event.target.value)}
                        autoFocus
                    />
                    <InputError className="mt-1.5" message={errors.name} />
                </div>
            </FormModal>

            <ConfirmModal
                isOpen={Boolean(deletingCategory)}
                onClose={() => setDeletingCategory(null)}
                onConfirm={confirmDelete}
                title="Eliminar categoría"
                message={`¿Está seguro de que desea eliminar "${deletingCategory?.name}"? Podrá restaurarla más adelante desde el sistema si es necesario.`}
                confirmLabel="Eliminar"
                isLoading={deleting}
            />
        </AdminLayout>
    );
}
