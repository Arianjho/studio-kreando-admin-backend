import { useState } from 'react';
import { router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import FormModal from '@/Components/ui/FormModal';
import ConfirmModal from '@/Components/ui/ConfirmModal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { PencilIcon, PlusIcon, TrashIcon } from '@/Icons';

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
        <AdminLayout title="Usuarios" header="Usuarios">
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
                    <h2 className="text-base font-medium text-gray-800 dark:text-white/90">
                        {users.length} usuario{users.length === 1 ? '' : 's'}
                    </h2>
                    <button
                        type="button"
                        onClick={openCreate}
                        className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600"
                    >
                        <PlusIcon className="h-4 w-4" />
                        Nuevo usuario
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
                                    Correo electrónico
                                </th>
                                <th className="px-6 py-3 text-right text-theme-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-gray-100 last:border-0 dark:border-gray-800">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                                        {user.name}
                                        {user.id === auth.user.id && (
                                            <span className="ml-2 text-xs font-normal text-gray-400">(usted)</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openEdit(user)}
                                                aria-label="Editar"
                                                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeletingUser(user)}
                                                aria-label="Eliminar"
                                                disabled={user.id === auth.user.id}
                                                className="flex h-9 w-9 items-center justify-center rounded-lg text-error-500 transition hover:bg-error-50 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-error-500/10"
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
