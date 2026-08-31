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

export default function AboutContentEdit({ content, errors: serverErrors }) {
    const [fields, setFields] = useState({
        hero_headline: content.hero_headline,
        hero_subtext: content.hero_subtext,
        cta_label: content.cta_label,
    });
    const [heroFile, setHeroFile] = useState(null);
    const [heroPreview, setHeroPreview] = useState(content.hero_image?.url ?? null);
    const [heroAlt, setHeroAlt] = useState(content.hero_image?.alt ?? '');
    const [detailFile, setDetailFile] = useState(null);
    const [detailPreview, setDetailPreview] = useState(content.detail_image?.url ?? null);
    const [detailAlt, setDetailAlt] = useState(content.detail_image?.alt ?? '');
    const [introParagraphs, setIntroParagraphs] = useState(content.intro_paragraphs ?? []);
    const [services, setServices] = useState(content.services ?? []);
    const [milestones, setMilestones] = useState(content.milestones ?? []);
    const [processing, setProcessing] = useState(false);

    const set = (key) => (event) => setFields((prev) => ({ ...prev, [key]: event.target.value }));

    const handleFile = (setFile, setPreview) => (event) => {
        const file = event.target.files?.[0] ?? null;
        setFile(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = (event) => {
        event.preventDefault();
        setProcessing(true);

        const payload = {
            ...fields,
            intro_paragraphs: JSON.stringify(introParagraphs),
            services: JSON.stringify(services),
            milestones: JSON.stringify(milestones),
            _method: 'put',
        };

        if (heroFile) {
            payload.hero_image = heroFile;
            payload.hero_alt = heroAlt;
        }
        if (detailFile) {
            payload.detail_image = detailFile;
            payload.detail_alt = detailAlt;
        }

        router.post(route('admin.content.about.update'), payload, {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    const errors = serverErrors ?? {};

    return (
        <AdminLayout title="Nosotros" header="Contenido: Nosotros" description="Secciones de la página “Nosotros” del sitio público.">
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
                            <InputLabel value="Etiqueta del botón de cierre" />
                            <TextInput className="mt-1.5 w-full" value={fields.cta_label} onChange={set('cta_label')} required />
                        </div>
                        <div className="sm:col-span-2">
                            <InputLabel value="Subtexto" />
                            <Textarea rows={2} className="mt-1.5" value={fields.hero_subtext} onChange={set('hero_subtext')} required />
                        </div>
                        <div>
                            <InputLabel value="Imagen de portada" />
                            {heroPreview && <img src={heroPreview} alt="" className="mt-1.5 h-32 w-full rounded-lg object-cover" />}
                            <label className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:border-primary hover:text-primary">
                                <Upload className="size-4" />
                                {heroFile ? heroFile.name : 'Reemplazar imagen'}
                                <input type="file" accept="image/*" className="hidden" onChange={handleFile(setHeroFile, setHeroPreview)} />
                            </label>
                            <TextInput className="mt-2 w-full" placeholder="Texto alternativo" value={heroAlt} onChange={(e) => setHeroAlt(e.target.value)} />
                        </div>
                        <div>
                            <InputLabel value="Imagen de detalle" />
                            {detailPreview && <img src={detailPreview} alt="" className="mt-1.5 h-32 w-full rounded-lg object-cover" />}
                            <label className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:border-primary hover:text-primary">
                                <Upload className="size-4" />
                                {detailFile ? detailFile.name : 'Reemplazar imagen'}
                                <input type="file" accept="image/*" className="hidden" onChange={handleFile(setDetailFile, setDetailPreview)} />
                            </label>
                            <TextInput className="mt-2 w-full" placeholder="Texto alternativo" value={detailAlt} onChange={(e) => setDetailAlt(e.target.value)} />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 shadow-soft">
                    <h3 className="mb-4 font-display text-base font-semibold">Párrafos de introducción</h3>
                    <RepeaterList
                        items={introParagraphs}
                        onChange={setIntroParagraphs}
                        addLabel="Agregar párrafo"
                        fields={[{ key: 'text', label: 'Texto', type: 'textarea', span: 'full' }]}
                    />
                </Card>

                <Card className="p-6 shadow-soft">
                    <h3 className="mb-4 font-display text-base font-semibold">Servicios</h3>
                    <RepeaterList
                        items={services}
                        onChange={setServices}
                        addLabel="Agregar servicio"
                        fields={[
                            { key: 'number', label: 'Número' },
                            { key: 'title', label: 'Título' },
                            { key: 'description', label: 'Descripción', type: 'textarea', span: 'full' },
                        ]}
                    />
                </Card>

                <Card className="p-6 shadow-soft">
                    <h3 className="mb-4 font-display text-base font-semibold">Hitos</h3>
                    <RepeaterList
                        items={milestones}
                        onChange={setMilestones}
                        addLabel="Agregar hito"
                        fields={[
                            { key: 'year', label: 'Año' },
                            { key: 'text', label: 'Descripción' },
                        ]}
                    />
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
