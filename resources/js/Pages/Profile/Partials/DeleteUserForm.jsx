import { useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';

import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/Components/ui/dialog';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="font-display text-lg font-medium">Eliminar cuenta</h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Una vez eliminada su cuenta, todos sus datos y recursos se
                    eliminarán permanentemente. Antes de continuar, descargue
                    cualquier información que desee conservar.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>
                Eliminar cuenta
            </DangerButton>

            <Dialog open={confirmingUserDeletion} onOpenChange={(open) => !open && closeModal()}>
                <DialogContent>
                    <form onSubmit={deleteUser}>
                        <DialogHeader>
                            <DialogTitle>¿Está seguro de que desea eliminar su cuenta?</DialogTitle>
                            <DialogDescription>
                                Una vez eliminada su cuenta, todos sus datos y recursos se eliminarán permanentemente.
                                Ingrese su contraseña para confirmar que desea eliminar la cuenta de forma definitiva.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-6">
                            <InputLabel htmlFor="password" value="Contraseña" className="sr-only" />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="block w-full"
                                isFocused
                                placeholder="Contraseña"
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <DialogFooter className="mt-6">
                            <SecondaryButton type="button" onClick={closeModal}>
                                Cancelar
                            </SecondaryButton>

                            <DangerButton disabled={processing}>Eliminar cuenta</DangerButton>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </section>
    );
}
