import { useState } from 'react';
import { router, useForm, usePage } from '@inertiajs/react';
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

export default function UsersIndex({ users }) {
    const { auth } = usePage().props;
    const [editingUser, setEditingUser] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [deletingUser, setDeletingUser] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const openCreate = () => {
        setEditingUser(null);
        reset();
        clearErrors();
        setIsFormOpen(true);
    };

    const openEdit = (user) => {
        setEditingUser(user);
        setData({ name: user.name, email: user.email, password: '', password_confirmation: '' });
        clearErrors();
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingUser(null);
        reset();
        clearErrors();
    };

    const submit = (event) => {
        event.preventDefault();

        if (editingUser) {
            put(route('admin.users.update', editingUser.id), { onSuccess: closeForm });
        } else {
            post(route('admin.users.store'), { onSuccess: closeForm });
        }
    };

    const confirmDelete = () => {
        setDeleting(true);
        router.delete(route('admin.users.destroy', deletingUser.id), {
            onFinish: () => {
                setDeleting(false);
                setDeletingUser(null);
            },
        });
    };

    return (
        <AdminLayout
            title="Usuarios"
            header="Usuarios"
            description="Administra las cuentas con acceso al panel."
            actions={
                <Button onClick={openCreate}>
                    <Plus className="size-4" /> Nuevo usuario
                </Button>
            }
        >
            <Card className="overflow-hidden shadow-soft">
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <h2 className="text-sm font-medium text-muted-foreground">
                        {users.length} usuario{users.length === 1 ? '' : 's'}
                    </h2>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="px-6">Nombre</TableHead>
                            <TableHead className="px-6">Correo electrónico</TableHead>
                            <TableHead className="px-6 text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="px-6 py-3 font-medium">
                                    {user.name}
                                    {user.id === auth.user.id && (
                                        <span className="ml-2 text-xs font-normal text-muted-foreground">(usted)</span>
                                    )}
                                </TableCell>
                                <TableCell className="px-6 py-3 text-muted-foreground">{user.email}</TableCell>
                                <TableCell className="px-6 py-3">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button variant="ghost" size="icon" aria-label="Editar" onClick={() => openEdit(user)}>
                                            <Pencil className="size-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            aria-label="Eliminar"
                                            disabled={user.id === auth.user.id}
                                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => setDeletingUser(user)}
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
                title={editingUser ? 'Editar usuario' : 'Nuevo usuario'}
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
                <div>
                    <InputLabel htmlFor="email" value="Correo electrónico" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1.5 block w-full"
                        value={data.email}
                        onChange={(event) => setData('email', event.target.value)}
                        required
                    />
                    <InputError className="mt-1.5" message={errors.email} />
                </div>
                <div>
                    <InputLabel htmlFor="password" value={editingUser ? 'Nueva contraseña (opcional)' : 'Contraseña'} />
                    <TextInput
                        id="password"
                        type="password"
                        className="mt-1.5 block w-full"
                        value={data.password}
                        onChange={(event) => setData('password', event.target.value)}
                        minLength={8}
                        required={!editingUser}
                    />
                    <InputError className="mt-1.5" message={errors.password} />
                </div>
                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirmar contraseña" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        className="mt-1.5 block w-full"
                        value={data.password_confirmation}
                        onChange={(event) => setData('password_confirmation', event.target.value)}
                        minLength={8}
                        required={!editingUser}
                    />
                </div>
            </FormModal>

            <ConfirmModal
                isOpen={Boolean(deletingUser)}
                onClose={() => setDeletingUser(null)}
                onConfirm={confirmDelete}
                title="Eliminar usuario"
                message={`¿Está seguro de que desea eliminar a "${deletingUser?.name}"? Podrá restaurarlo más adelante desde el sistema si es necesario.`}
                confirmLabel="Eliminar"
                isLoading={deleting}
            />
        </AdminLayout>
    );
}
