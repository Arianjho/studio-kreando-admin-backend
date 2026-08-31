import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Upload } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Textarea from '@/Components/Textarea';
import InputError from '@/Components/InputError';
import RepeaterList from '@/Components/ui/RepeaterList';
import ServiceRepeater from '@/Components/ui/ServiceRepeater';

export default function HomeContentEdit({ content, errors: serverErrors }) {
    const [fields, setFields] = useState({
        hero_headline: content.hero_headline,
        hero_subtext: content.hero_subtext,
        hero_cta_primary_label: content.hero_cta_primary_label,
        hero_cta_secondary_label: content.hero_cta_secondary_label,
        about_heading: content.about_heading,
        about_text: content.about_text,
        about_cta_label: content.about_cta_label,
        portfolio_heading: content.portfolio_heading,
        portfolio_text: content.portfolio_text,
        cta_heading: content.cta_heading,
        cta_text: content.cta_text,
        cta_button_label: content.cta_button_label,
    });
    const [heroFile, setHeroFile] = useState(null);
    const [heroPreview, setHeroPreview] = useState(content.hero_image?.url ?? null);
    const [heroAlt, setHeroAlt] = useState(content.hero_image?.alt ?? '');
    const [stats, setStats] = useState(content.stats ?? []);
    const [services, setServices] = useState(content.services ?? []);
    const [credits, setCredits] = useState(content.credits ?? []);
    const [processing, setProcessing] = useState(false);

    const set = (key) => (event) => setFields((prev) => ({ ...prev, [key]: event.target.value }));

    const handleHeroFile = (event) => {
        const file = event.target.files?.[0] ?? null;
        setHeroFile(file);
        if (file) {
            setHeroPreview(URL.createObjectURL(file));
        }
    };

    const submit = (event) => {
        event.preventDefault();
        setProcessing(true);

        const payload = {
            ...fields,
            stats: JSON.stringify(stats),
            services: JSON.stringify(services.map(({ file, ...rest }) => rest)),
            credits: JSON.stringify(credits),
            _method: 'put',
        };

        if (heroFile) {
            payload.hero_image = heroFile;
            payload.hero_alt = heroAlt;
        }

        services.forEach((service, index) => {
            if (service.file) {
                payload[`service_file_${index}`] = service.file;
            }
        });

        router.post(route('admin.content.home.update'), payload, {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    const errors = serverErrors ?? {};

    return (
        <AdminLayout title="Inicio" header="Contenido: Inicio" description="Secciones de la página de inicio del sitio público.">
            <form onSubmit={submit} className="space-y-6">
                <Card className="p-6 shadow-soft">
                    <h3 className="mb-4 font-display text-base font-semibold">Portada (hero)</h3>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                            <InputLabel value="Titular" />
                            <TextInput className="mt-1.5 w-full" value={fields.hero_headline} onChange={set('hero_headline')} required />
                            <InputError className="mt-1.5" message={errors.hero_headline} />
                        </div>
                        <div>
                            <InputLabel value="Etiqueta botón principal" />
                            <TextInput className="mt-1.5 w-full" value={fields.hero_cta_primary_label} onChange={set('hero_cta_primary_label')} required />
                        </div>
                        <div className="sm:col-span-2">
                            <InputLabel value="Subtexto" />
                            <Textarea rows={2} className="mt-1.5" value={fields.hero_subtext} onChange={set('hero_subtext')} required />
                            <InputError className="mt-1.5" message={errors.hero_subtext} />
                        </div>
                        <div>
                            <InputLabel value="Etiqueta botón secundario" />
                            <TextInput className="mt-1.5 w-full" value={fields.hero_cta_secondary_label} onChange={set('hero_cta_secondary_label')} required />
                        </div>
                        <div>
                            <InputLabel value="Imagen de portada" />
                            {heroPreview && <img src={heroPreview} alt="" className="mt-1.5 h-32 w-full rounded-lg object-cover" />}
                            <label className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:border-primary hover:text-primary">
                                <Upload className="size-4" />
                                {heroFile ? heroFile.name : 'Reemplazar imagen'}
                                <input type="file" accept="image/*" className="hidden" onChange={handleHeroFile} />
                            </label>
                            <TextInput
                                className="mt-2 w-full"
                                placeholder="Texto alternativo"
                                value={heroAlt}
                                onChange={(event) => setHeroAlt(event.target.value)}
                            />
                            <InputError className="mt-1.5" message={errors.hero_image} />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 shadow-soft">
                    <h3 className="mb-4 font-display text-base font-semibold">Sobre el estudio</h3>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                            <InputLabel value="Encabezado" />
                            <TextInput className="mt-1.5 w-full" value={fields.about_heading} onChange={set('about_heading')} required />
                        </div>
                        <div>
                            <InputLabel value="Etiqueta del botón" />
                            <TextInput className="mt-1.5 w-full" value={fields.about_cta_label} onChange={set('about_cta_label')} required />
                        </div>
                        <div className="sm:col-span-2">
                            <InputLabel value="Texto" />
                            <Textarea rows={3} className="mt-1.5" value={fields.about_text} onChange={set('about_text')} required />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 shadow-soft">
                    <h3 className="mb-4 font-display text-base font-semibold">Estadísticas</h3>
                    <RepeaterList
                        items={stats}
                        onChange={setStats}
                        addLabel="Agregar estadística"
                        fields={[
                            { key: 'value', label: 'Valor' },
                            { key: 'label', label: 'Descripción' },
                        ]}
                    />
                </Card>

                <Card className="p-6 shadow-soft">
                    <h3 className="mb-4 font-display text-base font-semibold">Servicios</h3>
                    <ServiceRepeater items={services} onChange={setServices} />
                </Card>

                <Card className="p-6 shadow-soft">
                    <h3 className="mb-4 font-display text-base font-semibold">Reconocimientos</h3>
                    <RepeaterList items={credits} onChange={setCredits} addLabel="Agregar reconocimiento" fields={[{ key: 'name', label: 'Nombre' }]} />
                </Card>

                <Card className="p-6 shadow-soft">
                    <h3 className="mb-4 font-display text-base font-semibold">Portafolio y cierre</h3>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                            <InputLabel value="Encabezado de portafolio" />
                            <TextInput className="mt-1.5 w-full" value={fields.portfolio_heading} onChange={set('portfolio_heading')} required />
                        </div>
                        <div>
                            <InputLabel value="Encabezado de cierre" />
                            <TextInput className="mt-1.5 w-full" value={fields.cta_heading} onChange={set('cta_heading')} required />
                        </div>
                        <div>
                            <InputLabel value="Texto de portafolio" />
                            <Textarea rows={2} className="mt-1.5" value={fields.portfolio_text} onChange={set('portfolio_text')} required />
                        </div>
                        <div>
                            <InputLabel value="Texto de cierre" />
                            <Textarea rows={2} className="mt-1.5" value={fields.cta_text} onChange={set('cta_text')} required />
                        </div>
                        <div>
                            <InputLabel value="Etiqueta del botón de cierre" />
                            <TextInput className="mt-1.5 w-full" value={fields.cta_button_label} onChange={set('cta_button_label')} required />
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
