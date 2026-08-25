import { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Textarea from '@/Components/Textarea';
import InputError from '@/Components/InputError';

export default function ContactContentEdit({ content, errors: serverErrors }) {
    const [fields, setFields] = useState({
        address: content.address,
        email: content.email,
        phone: content.phone,
        hours: content.hours,
    });
    const [processing, setProcessing] = useState(false);

    const set = (key) => (event) => setFields((prev) => ({ ...prev, [key]: event.target.value }));

    const submit = (event) => {
        event.preventDefault();
        setProcessing(true);
        router.put(route('admin.content.contact.update'), fields, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    const errors = serverErrors ?? {};

    return (
        <AdminLayout title="Contacto" header="Contenido: Contacto">
            <form onSubmit={submit} className="space-y-6">
                <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                    <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">Datos de contacto</h3>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <InputLabel value="Dirección" />
                            <Textarea rows={2} className="mt-1.5" value={fields.address} onChange={set('address')} />
                            <InputError className="mt-1.5" message={errors.address} />
                        </div>
                        <div>
                            <InputLabel value="Correo electrónico" />
                            <TextInput type="email" className="mt-1.5 w-full" value={fields.email} onChange={set('email')} />
                            <InputError className="mt-1.5" message={errors.email} />
                        </div>
                        <div>
                            <InputLabel value="Teléfono" />
                            <TextInput className="mt-1.5 w-full" value={fields.phone} onChange={set('phone')} />
                            <InputError className="mt-1.5" message={errors.phone} />
                        </div>
                        <div className="sm:col-span-2">
                            <InputLabel value="Horario de atención" />
                            <Textarea rows={2} className="mt-1.5" value={fields.hours} onChange={set('hours')} />
                            <InputError className="mt-1.5" message={errors.hours} />
                        </div>
                    </div>
                </section>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-60"
                    >
                        {processing ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
