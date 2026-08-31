import { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
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
        <AdminLayout title="Contacto" header="Contenido: Contacto" description="Datos que se muestran en la página de contacto del sitio público.">
            <form onSubmit={submit} className="space-y-6">
                <Card className="p-6 shadow-soft">
                    <h3 className="mb-4 font-display text-base font-semibold">Datos de contacto</h3>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <InputLabel value="Dirección" />
                            <Textarea rows={2} className="mt-1.5" value={fields.address} onChange={set('address')} required />
                            <InputError className="mt-1.5" message={errors.address} />
                        </div>
                        <div>
                            <InputLabel value="Correo electrónico" />
                            <TextInput type="email" className="mt-1.5 w-full" value={fields.email} onChange={set('email')} required />
                            <InputError className="mt-1.5" message={errors.email} />
                        </div>
                        <div>
                            <InputLabel value="Teléfono" />
                            <TextInput className="mt-1.5 w-full" value={fields.phone} onChange={set('phone')} required />
                            <InputError className="mt-1.5" message={errors.phone} />
                        </div>
                        <div className="sm:col-span-2">
                            <InputLabel value="Horario de atención" />
                            <Textarea rows={2} className="mt-1.5" value={fields.hours} onChange={set('hours')} required />
                            <InputError className="mt-1.5" message={errors.hours} />
                        </div>
                    </div>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Guardando...' : 'Guardar cambios'}
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
