import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

import AdminLayout from '@/Layouts/AdminLayout';
import FormModal from '@/Components/ui/FormModal';
import ConfirmModal from '@/Components/ui/ConfirmModal';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

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
            put(route('admin.categories.update', editingCategory.id), { onSuccess: closeForm });
        } else {
            post(route('admin.categories.store'), { onSuccess: closeForm });
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
        <AdminLayout
            title="Categorías"
            header="Categorías"
            description="Organiza el portafolio de proyectos por categoría."
            actions={
                <Button onClick={openCreate}>
                    <Plus className="size-4" /> Nueva categoría
                </Button>
            }
        >
            <Card className="overflow-hidden shadow-soft">
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <h2 className="text-sm font-medium text-muted-foreground">
                        {categories.length} categoría{categories.length === 1 ? '' : 's'}
                    </h2>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="px-6">Nombre</TableHead>
                            <TableHead className="px-6">Proyectos</TableHead>
                            <TableHead className="px-6 text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="px-6 py-10 text-center text-sm text-muted-foreground">
                                    No hay categorías registradas todavía.
                                </TableCell>
                            </TableRow>
                        )}
                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell className="px-6 py-3 font-medium">{category.name}</TableCell>
                                <TableCell className="px-6 py-3 text-muted-foreground">{category.projects_count}</TableCell>
                                <TableCell className="px-6 py-3">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button variant="ghost" size="icon" aria-label="Editar" onClick={() => openEdit(category)}>
                                            <Pencil className="size-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            aria-label="Eliminar"
                                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => setDeletingCategory(category)}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

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
                        required
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
