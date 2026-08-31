import { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Textarea from '@/Components/Textarea';
import InputError from '@/Components/InputError';

export default function SiteSettingsEdit({ content, errors: serverErrors }) {
    const [fields, setFields] = useState({
        site_name: content.site_name,
        site_url: content.site_url,
        default_seo_description: content.default_seo_description,
        whatsapp_message_template: content.whatsapp_message_template ?? '',
    });
    const [processing, setProcessing] = useState(false);

    const set = (key) => (event) => setFields((prev) => ({ ...prev, [key]: event.target.value }));

    const submit = (event) => {
        event.preventDefault();
        setProcessing(true);
        router.put(route('admin.content.settings.update'), fields, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    const errors = serverErrors ?? {};

    return (
        <AdminLayout title="Ajustes generales" header="Contenido: Ajustes generales" description="Metadatos generales usados en todo el sitio público.">
            <form onSubmit={submit} className="space-y-6">
                <Card className="p-6 shadow-soft">
                    <h3 className="mb-4 font-display text-base font-semibold">Ajustes del sitio</h3>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                            <InputLabel value="Nombre del sitio" />
                            <TextInput className="mt-1.5 w-full" value={fields.site_name} onChange={set('site_name')} required />
                            <InputError className="mt-1.5" message={errors.site_name} />
                        </div>
                        <div>
                            <InputLabel value="URL del sitio" />
                            <TextInput type="url" className="mt-1.5 w-full" value={fields.site_url} onChange={set('site_url')} required />
                            <InputError className="mt-1.5" message={errors.site_url} />
                        </div>
                        <div className="sm:col-span-2">
                            <InputLabel value="Descripción SEO por defecto" />
                            <Textarea rows={3} className="mt-1.5" value={fields.default_seo_description} onChange={set('default_seo_description')} required />
                            <InputError className="mt-1.5" message={errors.default_seo_description} />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 shadow-soft">
                    <h3 className="mb-1 font-display text-base font-semibold">WhatsApp</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Texto prellenado al responder una consulta por WhatsApp desde el panel. Se puede editar antes de
                        enviar cada mensaje.
                    </p>
                    <div>
                        <InputLabel value="Plantilla del mensaje" />
                        <Textarea
                            rows={4}
                            className="mt-1.5"
                            value={fields.whatsapp_message_template}
                            onChange={set('whatsapp_message_template')}
                            required
                        />
                        <p className="mt-1.5 text-xs text-muted-foreground">
                            Variables:{' '}
                            <code className="rounded bg-secondary px-1">{'{nombre}'}</code>{' '}
                            <code className="rounded bg-secondary px-1">{'{tipo_proyecto}'}</code>{' '}
                            <code className="rounded bg-secondary px-1">{'{ubicacion}'}</code>{' '}
                            <code className="rounded bg-secondary px-1">{'{presupuesto}'}</code>{' '}
                            <code className="rounded bg-secondary px-1">{'{plazo}'}</code>
                        </p>
                        <InputError className="mt-1.5" message={errors.whatsapp_message_template} />
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
