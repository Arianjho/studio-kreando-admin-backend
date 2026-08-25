import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verificar correo electrónico" />

            <h1 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">Verifica tu correo</h1>

            <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                Gracias por registrarte. Antes de comenzar, ¿podrías verificar tu correo electrónico haciendo clic en
                el enlace que te acabamos de enviar? Si no recibiste el correo, con gusto te enviaremos otro.
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
                    Se ha enviado un nuevo enlace de verificación al correo que registraste.
                </div>
            )}

            <form onSubmit={submit} className="flex items-center justify-between">
                <PrimaryButton disabled={processing}>
                    Reenviar correo de verificación
                </PrimaryButton>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                    Cerrar sesión
                </Link>
            </form>
        </GuestLayout>
    );
}
