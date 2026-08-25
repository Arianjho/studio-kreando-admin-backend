import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import FormModal from '@/Components/ui/FormModal';
import ConfirmModal from '@/Components/ui/ConfirmModal';
import GalleryEditor from '@/Components/ui/GalleryEditor';
import Badge from '@/Components/ui/Badge';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Textarea from '@/Components/Textarea';
import Select from '@/Components/Select';
import InputError from '@/Components/InputError';
import { PencilIcon, PlusIcon, TrashIcon, UploadIcon } from '@/Icons';

const STATUS_COLORS = {
    Construido: 'success',
    'En obra': 'warning',
    'En proyecto': 'brand',
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

        const existingGallery = gallery
            .filter((item) => item.media_id)
            .map((item) => ({ media_id: item.media_id, alt: item.alt }));

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
        <AdminLayout title="Proyectos" header="Proyectos">
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
                    <h2 className="text-base font-medium text-gray-800 dark:text-white/90">
                        {projects.length} proyecto{projects.length === 1 ? '' : 's'}
                    </h2>
                    <button
                        type="button"
                        onClick={openCreate}
                        className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600"
                    >
                        <PlusIcon className="h-4 w-4" />
                        Nuevo proyecto
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-800">
                                <th className="px-6 py-3 text-theme-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                    Portada
                                </th>
                                <th className="px-6 py-3 text-theme-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                    Nombre
                                </th>
                                <th className="px-6 py-3 text-theme-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                    Categoría
                                </th>
                                <th className="px-6 py-3 text-theme-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                    Año
                                </th>
                                <th className="px-6 py-3 text-theme-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-right text-theme-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                        No hay proyectos registrados todavía.
                                    </td>
                                </tr>
                            )}
                            {projects.map((project) => (
                                <tr key={project.id} className="border-b border-gray-100 last:border-0 dark:border-gray-800">
                                    <td className="px-6 py-3">
                                        <img
                                            src={project.cover?.url}
                                            alt={project.cover_alt}
                                            className="h-12 w-16 rounded-md object-cover"
                                        />
                                    </td>
                                    <td className="px-6 py-3 text-sm font-medium text-gray-800 dark:text-white/90">
                                        {project.name}
                                        {project.featured && (
                                            <span className="ml-2">
                                                <Badge color="brand">Destacado</Badge>
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-3 text-sm text-gray-500 dark:text-gray-400">
                                        {project.category?.name}
                                    </td>
                                    <td className="px-6 py-3 text-sm text-gray-500 dark:text-gray-400">{project.year}</td>
                                    <td className="px-6 py-3">
                                        <Badge color={STATUS_COLORS[project.status] ?? 'gray'}>{project.status}</Badge>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openEdit(project)}
                                                aria-label="Editar"
                                                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeletingProject(project)}
                                                aria-label="Eliminar"
                                                className="flex h-9 w-9 items-center justify-center rounded-lg text-error-500 transition hover:bg-error-50 dark:hover:bg-error-500/10"
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
                title={editingProject ? 'Editar proyecto' : 'Nuevo proyecto'}
                processing={processing}
                className="max-w-3xl"
            >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="name" value="Nombre" />
                        <TextInput
                            id="name"
                            className="mt-1.5 block w-full"
                            value={data.name}
                            onChange={(event) => handleNameChange(event.target.value)}
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
                            className="mt-1.5 block w-full"
                            value={data.year}
                            onChange={(event) => setData('year', event.target.value)}
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
                        />
                        <InputError className="mt-1.5" message={errors.team} />
                    </div>
                    <div>
                        <InputLabel htmlFor="status" value="Estado" />
                        <Select
                            id="status"
                            className="mt-1.5"
                            value={data.status}
                            onChange={(event) => setData('status', event.target.value)}
                        >
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

                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Checkbox
                        checked={Boolean(data.featured)}
                        onChange={(event) => setData('featured', event.target.checked)}
                    />
                    Marcar como proyecto destacado
                </label>

                <div>
                    <InputLabel htmlFor="intro" value="Introducción" />
                    <Textarea
                        id="intro"
                        rows={2}
                        className="mt-1.5"
                        value={data.intro}
                        onChange={(event) => setData('intro', event.target.value)}
                    />
                    <InputError className="mt-1.5" message={errors.intro} />
                </div>

                <div>
                    <InputLabel htmlFor="body" value="Contenido" />
                    <Textarea
                        id="body"
                        rows={5}
                        className="mt-1.5"
                        value={data.body}
                        onChange={(event) => setData('body', event.target.value)}
                    />
                    <InputError className="mt-1.5" message={errors.body} />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                        <InputLabel value="Portada" />
                        {coverPreview && (
                            <img src={coverPreview} alt="" className="mt-1.5 h-32 w-full rounded-lg object-cover" />
                        )}
                        <label
                            htmlFor="cover"
                            className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 hover:border-brand-300 hover:text-brand-500 dark:border-gray-700 dark:text-gray-400"
                        >
                            <UploadIcon className="h-4 w-4" />
                            {data.cover ? data.cover.name : editingProject ? 'Reemplazar imagen' : 'Seleccionar imagen'}
                        </label>
                        <input id="cover" type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                        <InputError className="mt-1.5" message={errors.cover} />
                    </div>
                    <div>
                        <InputLabel htmlFor="cover_alt" value="Texto alternativo de portada" />
                        <TextInput
                            id="cover_alt"
                            className="mt-1.5 block w-full"
                            value={data.cover_alt}
                            onChange={(event) => setData('cover_alt', event.target.value)}
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
