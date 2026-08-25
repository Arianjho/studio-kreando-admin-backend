import { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Textarea from '@/Components/Textarea';
import InputError from '@/Components/InputError';

export default function SiteSettingsEdit({ content, errors: serverErrors }) {
    const [fields, setFields] = useState({
        site_name: content.site_name,
        site_url: content.site_url,
        default_seo_description: content.default_seo_description,
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
        <AdminLayout title="Ajustes generales" header="Contenido: Ajustes generales">
            <form onSubmit={submit} className="space-y-6">
                <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                    <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">Ajustes del sitio</h3>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                            <InputLabel value="Nombre del sitio" />
                            <TextInput className="mt-1.5 w-full" value={fields.site_name} onChange={set('site_name')} />
                            <InputError className="mt-1.5" message={errors.site_name} />
                        </div>
                        <div>
                            <InputLabel value="URL del sitio" />
                            <TextInput className="mt-1.5 w-full" value={fields.site_url} onChange={set('site_url')} />
                            <InputError className="mt-1.5" message={errors.site_url} />
                        </div>
                        <div className="sm:col-span-2">
                            <InputLabel value="Descripción SEO por defecto" />
                            <Textarea rows={3} className="mt-1.5" value={fields.default_seo_description} onChange={set('default_seo_description')} />
                            <InputError className="mt-1.5" message={errors.default_seo_description} />
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
