import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2, Upload } from 'lucide-react';

import AdminLayout from '@/Layouts/AdminLayout';
import FormModal from '@/Components/ui/FormModal';
import ConfirmModal from '@/Components/ui/ConfirmModal';
import GalleryEditor from '@/Components/ui/GalleryEditor';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Textarea from '@/Components/Textarea';
import Select from '@/Components/Select';
import InputError from '@/Components/InputError';

const STATUS_VARIANTS = {
    Construido: 'success',
    'En obra': 'warning',
    'En proyecto': 'default',
};

const emptyForm = {
    name: '',
    slug: '',
    category_id: '',
    year: new Date().getFullYear(),
    location: '',
    area: '',
    program: '',
    team: '',
    status: 'En proyecto',
    intro: '',
    body: '',
    cover: null,
    cover_alt: '',
    featured: false,
    order: 0,
};

function slugify(value) {
    return value
        .toString()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

export default function ProjectsIndex({ projects, categories }) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [gallery, setGallery] = useState([]);
    const [deletingProject, setDeletingProject] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [slugTouched, setSlugTouched] = useState(false);

    const { data, setData, processing, errors, reset, clearErrors } = useForm(emptyForm);

    const openCreate = () => {
        setEditingProject(null);
        setCoverPreview(null);
        setGallery([]);
        setSlugTouched(false);
        reset();
        setData(emptyForm);
        clearErrors();
        setIsFormOpen(true);
    };

    const openEdit = (project) => {
        setEditingProject(project);
        setCoverPreview(project.cover?.url ?? null);
        setGallery(
            (project.gallery ?? []).map((item, index) => ({
                key: `existing-${project.id}-${index}`,
                media_id: item.media_id,
                url: item.url,
                alt: item.alt,
            })),
        );
        setSlugTouched(true);
        setData({
            name: project.name,
            slug: project.slug,
            category_id: project.category_id,
            year: project.year,
            location: project.location,
            area: project.area,
            program: project.program,
            team: project.team,
            status: project.status,
            intro: project.intro,
            body: project.body,
            cover: null,
            cover_alt: project.cover_alt,
            featured: project.featured,
            order: project.order,
        });
        clearErrors();
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingProject(null);
        setCoverPreview(null);
        setGallery([]);
        reset();
        clearErrors();
    };

    const handleNameChange = (value) => {
        setData('name', value);
        if (!slugTouched) {
            setData('slug', slugify(value));
        }
    };

    const handleCoverChange = (event) => {
        const file = event.target.files?.[0] ?? null;
        setData('cover', file);
        if (file) {
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const submit = (event) => {
        event.preventDefault();

        const existingGallery = gallery.filter((item) => item.media_id).map((item) => ({ media_id: item.media_id, alt: item.alt }));
        const newGalleryItems = gallery.filter((item) => item.file);

        const payload = {
            ...data,
            featured: data.featured ? '1' : '0',
            existing_gallery: JSON.stringify(existingGallery),
            new_gallery: newGalleryItems.map((item) => item.file),
            new_gallery_alt: newGalleryItems.map((item) => item.alt),
        };

        const options = { onSuccess: closeForm, forceFormData: true };

        if (editingProject) {
            router.post(route('admin.projects.update', editingProject.id), { ...payload, _method: 'put' }, options);
        } else {
            router.post(route('admin.projects.store'), payload, options);
        }
    };

    const confirmDelete = () => {
        setDeleting(true);
        router.delete(route('admin.projects.destroy', deletingProject.id), {
            onFinish: () => {
                setDeleting(false);
                setDeletingProject(null);
            },
        });
    };

    return (
        <AdminLayout
            title="Proyectos"
            header="Proyectos"
            description="Portafolio de proyectos publicados en el sitio."
            actions={
                <Button onClick={openCreate}>
                    <Plus className="size-4" /> Nuevo proyecto
                </Button>
            }
        >
            <Card className="overflow-hidden shadow-soft">
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <h2 className="text-sm font-medium text-muted-foreground">
                        {projects.length} proyecto{projects.length === 1 ? '' : 's'}
                    </h2>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="px-6">Portada</TableHead>
                            <TableHead className="px-6">Nombre</TableHead>
                            <TableHead className="px-6">Categoría</TableHead>
                            <TableHead className="px-6">Año</TableHead>
                            <TableHead className="px-6">Estado</TableHead>
                            <TableHead className="px-6 text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projects.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="px-6 py-10 text-center text-sm text-muted-foreground">
                                    No hay proyectos registrados todavía.
                                </TableCell>
                            </TableRow>
                        )}
                        {projects.map((project) => (
                            <TableRow key={project.id}>
                                <TableCell className="px-6 py-3">
                                    <img src={project.cover?.url} alt={project.cover_alt} className="h-12 w-16 rounded-md object-cover" />
                                </TableCell>
                                <TableCell className="px-6 py-3 font-medium">
                                    {project.name}
                                    {project.featured && (
                                        <Badge variant="default" className="ml-2">
                                            Destacado
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="px-6 py-3 text-muted-foreground">{project.category?.name}</TableCell>
                                <TableCell className="px-6 py-3 text-muted-foreground">{project.year}</TableCell>
                                <TableCell className="px-6 py-3">
                                    <Badge variant={STATUS_VARIANTS[project.status] ?? 'outline'}>{project.status}</Badge>
                                </TableCell>
                                <TableCell className="px-6 py-3">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button variant="ghost" size="icon" aria-label="Editar" onClick={() => openEdit(project)}>
                                            <Pencil className="size-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            aria-label="Eliminar"
                                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => setDeletingProject(project)}
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
                title={editingProject ? 'Editar proyecto' : 'Nuevo proyecto'}
                processing={processing}
                className="sm:max-w-3xl"
            >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="name" value="Nombre" />
                        <TextInput
                            id="name"
                            className="mt-1.5 block w-full"
                            value={data.name}
                            onChange={(event) => handleNameChange(event.target.value)}
                            required
                        />
                        <InputError className="mt-1.5" message={errors.name} />
                    </div>
                    <div>
                        <InputLabel htmlFor="slug" value="Slug" />
                        <TextInput
                            id="slug"
                            className="mt-1.5 block w-full"
                            value={data.slug}
                            onChange={(event) => {
                                setSlugTouched(true);
                                setData('slug', event.target.value);
                            }}
                            pattern="[a-z0-9\-]+"
                            required
                        />
                        <InputError className="mt-1.5" message={errors.slug} />
                    </div>
                    <div>
                        <InputLabel htmlFor="category_id" value="Categoría" />
                        <Select
                            id="category_id"
                            className="mt-1.5"
                            value={data.category_id}
                            onChange={(event) => setData('category_id', event.target.value)}
                            required
                        >
                            <option value="">Seleccione una categoría</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </Select>
                        <InputError className="mt-1.5" message={errors.category_id} />
                    </div>
                    <div>
                        <InputLabel htmlFor="year" value="Año" />
                        <TextInput
                            id="year"
                            type="number"
                            min={1900}
                            max={2100}
                            className="mt-1.5 block w-full"
                            value={data.year}
                            onChange={(event) => setData('year', event.target.value)}
                            required
                        />
                        <InputError className="mt-1.5" message={errors.year} />
                    </div>
                    <div>
                        <InputLabel htmlFor="location" value="Ubicación" />
                        <TextInput
                            id="location"
                            className="mt-1.5 block w-full"
                            value={data.location}
                            onChange={(event) => setData('location', event.target.value)}
                            required
                        />
                        <InputError className="mt-1.5" message={errors.location} />
                    </div>
                    <div>
                        <InputLabel htmlFor="area" value="Área" />
                        <TextInput
                            id="area"
                            className="mt-1.5 block w-full"
                            value={data.area}
                            onChange={(event) => setData('area', event.target.value)}
                            required
                        />
                        <InputError className="mt-1.5" message={errors.area} />
                    </div>
                    <div>
                        <InputLabel htmlFor="program" value="Programa" />
                        <TextInput
                            id="program"
                            className="mt-1.5 block w-full"
                            value={data.program}
                            onChange={(event) => setData('program', event.target.value)}
                            required
                        />
                        <InputError className="mt-1.5" message={errors.program} />
                    </div>
                    <div>
                        <InputLabel htmlFor="team" value="Equipo" />
                        <TextInput
                            id="team"
                            className="mt-1.5 block w-full"
                            value={data.team}
                            onChange={(event) => setData('team', event.target.value)}
                            required
                        />
                        <InputError className="mt-1.5" message={errors.team} />
                    </div>
                    <div>
                        <InputLabel htmlFor="status" value="Estado" />
                        <Select id="status" className="mt-1.5" value={data.status} onChange={(event) => setData('status', event.target.value)}>
                            <option value="Construido">Construido</option>
                            <option value="En obra">En obra</option>
                            <option value="En proyecto">En proyecto</option>
                        </Select>
                        <InputError className="mt-1.5" message={errors.status} />
                    </div>
                    <div>
                        <InputLabel htmlFor="order" value="Orden" />
                        <TextInput
                            id="order"
                            type="number"
                            className="mt-1.5 block w-full"
                            value={data.order}
                            onChange={(event) => setData('order', event.target.value)}
                        />
                        <InputError className="mt-1.5" message={errors.order} />
                    </div>
                </div>

                <label className="flex items-center gap-2 text-sm">
                    <Checkbox checked={Boolean(data.featured)} onChange={(event) => setData('featured', event.target.checked)} />
                    Marcar como proyecto destacado
                </label>

                <div>
                    <InputLabel htmlFor="intro" value="Introducción" />
                    <Textarea id="intro" rows={2} className="mt-1.5" value={data.intro} onChange={(event) => setData('intro', event.target.value)} required />
                    <InputError className="mt-1.5" message={errors.intro} />
                </div>

                <div>
                    <InputLabel htmlFor="body" value="Contenido" />
                    <Textarea id="body" rows={5} className="mt-1.5" value={data.body} onChange={(event) => setData('body', event.target.value)} required />
                    <InputError className="mt-1.5" message={errors.body} />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                        <InputLabel value="Portada" />
                        {coverPreview && <img src={coverPreview} alt="" className="mt-1.5 h-32 w-full rounded-lg object-cover" />}
                        <label
                            htmlFor="cover"
                            className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:border-primary hover:text-primary"
                        >
                            <Upload className="size-4" />
                            {data.cover ? data.cover.name : editingProject ? 'Reemplazar imagen' : 'Seleccionar imagen'}
                        </label>
                        <input
                            id="cover"
                            type="file"
                            accept="image/*"
                            required={!editingProject}
                            className="hidden"
                            onChange={handleCoverChange}
                        />
                        <InputError className="mt-1.5" message={errors.cover} />
                    </div>
                    <div>
                        <InputLabel htmlFor="cover_alt" value="Texto alternativo de portada" />
                        <TextInput
                            id="cover_alt"
                            className="mt-1.5 block w-full"
                            value={data.cover_alt}
                            onChange={(event) => setData('cover_alt', event.target.value)}
                            required
                        />
                        <InputError className="mt-1.5" message={errors.cover_alt} />
                    </div>
                </div>

                <div>
                    <InputLabel value="Galería" />
                    <div className="mt-1.5">
                        <GalleryEditor items={gallery} onChange={setGallery} />
                    </div>
                </div>
            </FormModal>

            <ConfirmModal
                isOpen={Boolean(deletingProject)}
                onClose={() => setDeletingProject(null)}
                onConfirm={confirmDelete}
                title="Eliminar proyecto"
                message={`¿Está seguro de que desea eliminar "${deletingProject?.name}"? Podrá restaurarlo más adelante desde el sistema si es necesario.`}
                confirmLabel="Eliminar"
                isLoading={deleting}
            />
        </AdminLayout>
    );
}
