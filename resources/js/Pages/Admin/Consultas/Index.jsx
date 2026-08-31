import { useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import { CheckCircle2, Eye, MessageCircle, Search, Trash2, X } from 'lucide-react';

import AdminLayout from '@/Layouts/AdminLayout';
import ConfirmModal from '@/Components/ui/ConfirmModal';
import Select from '@/Components/Select';
import TextInput from '@/Components/TextInput';
import Textarea from '@/Components/Textarea';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { fillTemplate, formatPhone, statusOf } from '@/lib/consulta';

const STATUS_OPTIONS = [
    { value: '', label: 'Todos los estados' },
    { value: 'nuevo', label: 'Nuevo' },
    { value: 'contactado', label: 'Contactado' },
    { value: 'cerrado', label: 'Cerrado' },
];

const formatDate = (value) =>
    new Date(value).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });

export default function ConsultasIndex({
    consultas,
    filters = {},
    projectTypes = [],
    whatsappEnabled = false,
    whatsappTemplate = '',
}) {
    const [viewingId, setViewingId] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [deletingBusy, setDeletingBusy] = useState(false);
    const [closingBusy, setClosingBusy] = useState(false);
    const [search, setSearch] = useState(filters.search ?? '');

    const [wa, setWa] = useState(null); // consulta targeted by the WhatsApp compose modal
    const [waMessage, setWaMessage] = useState('');
    const [waSending, setWaSending] = useState(false);

    const items = consultas ?? [];
    const viewing = viewingId ? (items.find((c) => c.id === viewingId) ?? null) : null;
    const hasFilters = Boolean(filters.search || filters.project_type || filters.status);

    const applyFilters = (overrides) => {
        const next = {
            search: filters.search ?? '',
            project_type: filters.project_type ?? '',
            status: filters.status ?? '',
            ...overrides,
        };
        const query = Object.fromEntries(Object.entries(next).filter(([, value]) => value));
        router.get(route('admin.consultas.index'), query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    // Debounce the free-text search; skip the initial render.
    const mounted = useRef(false);
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            return;
        }
        const handle = setTimeout(() => {
            if (search !== (filters.search ?? '')) {
                applyFilters({ search });
            }
        }, 300);
        return () => clearTimeout(handle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const resetFilters = () => {
        setSearch('');
        router.get(route('admin.consultas.index'), {}, { preserveScroll: true, replace: true });
    };

    const openWhatsApp = (consulta) => {
        setWa(consulta);
        setWaMessage(fillTemplate(whatsappTemplate, consulta));
    };

    const sendWhatsApp = () => {
        setWaSending(true);
        router.post(
            route('admin.consultas.whatsapp', wa.id),
            { message: waMessage },
            {
                preserveScroll: true,
                onSuccess: () => setWa(null),
                onFinish: () => setWaSending(false),
            },
        );
    };

    const markClosed = (consulta) => {
        setClosingBusy(true);
        router.patch(
            route('admin.consultas.close', consulta.id),
            {},
            { preserveScroll: true, onFinish: () => setClosingBusy(false) },
        );
    };

    const confirmDelete = () => {
        setDeletingBusy(true);
        router.delete(route('admin.consultas.destroy', deleting.id), {
            preserveScroll: true,
            onFinish: () => {
                setDeletingBusy(false);
                setDeleting(null);
                setViewingId(null);
            },
        });
    };

    const hasValidPhone = (consulta) => /^\d{9}$/.test(String(consulta?.phone ?? ''));

    return (
        <AdminLayout title="Consultas" header="Consultas" description="Consultas recibidas desde el formulario de contacto público.">
            <Card className="overflow-hidden shadow-soft">
                <div className="flex flex-col gap-4 border-b border-border px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
                    <h2 className="text-sm font-medium text-muted-foreground">
                        {items.length} consulta{items.length === 1 ? '' : 's'}
                    </h2>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <TextInput
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Buscar por nombre, teléfono o mensaje"
                                className="w-full pl-9 sm:w-72"
                            />
                        </div>
                        <Select
                            aria-label="Filtrar por tipo de proyecto"
                            value={filters.project_type ?? ''}
                            onChange={(event) => applyFilters({ project_type: event.target.value })}
                            className="sm:w-48"
                        >
                            <option value="">Todos los tipos</option>
                            {projectTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </Select>
                        <Select
                            aria-label="Filtrar por estado"
                            value={filters.status ?? ''}
                            onChange={(event) => applyFilters({ status: event.target.value })}
                            className="sm:w-44"
                        >
                            {STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Select>
                        {hasFilters && (
                            <Button variant="ghost" size="sm" onClick={resetFilters}>
                                <X className="size-4" /> Limpiar
                            </Button>
                        )}
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="px-6">Interesado</TableHead>
                            <TableHead className="px-6">Tipo de proyecto</TableHead>
                            <TableHead className="hidden px-6 lg:table-cell">Presupuesto</TableHead>
                            <TableHead className="hidden px-6 lg:table-cell">Plazo</TableHead>
                            <TableHead className="px-6">Fecha</TableHead>
                            <TableHead className="px-6">Estado</TableHead>
                            <TableHead className="px-6 text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="px-6 py-10 text-center text-sm text-muted-foreground">
                                    {hasFilters
                                        ? 'Ninguna consulta coincide con los filtros.'
                                        : 'No hay consultas registradas todavía.'}
                                </TableCell>
                            </TableRow>
                        )}
                        {items.map((consulta) => {
                            const status = statusOf(consulta);
                            return (
                                <TableRow key={consulta.id}>
                                    <TableCell className="px-6 py-3">
                                        <p className="font-medium">{consulta.name}</p>
                                        <p className="text-xs text-muted-foreground">{formatPhone(consulta.phone) || '—'}</p>
                                    </TableCell>
                                    <TableCell className="px-6 py-3">{consulta.project_type}</TableCell>
                                    <TableCell className="hidden px-6 py-3 text-muted-foreground lg:table-cell">
                                        {consulta.budget ?? '—'}
                                    </TableCell>
                                    <TableCell className="hidden px-6 py-3 text-muted-foreground lg:table-cell">
                                        {consulta.timeline ?? '—'}
                                    </TableCell>
                                    <TableCell className="px-6 py-3 text-muted-foreground">
                                        {formatDate(consulta.created_at)}
                                    </TableCell>
                                    <TableCell className="px-6 py-3">
                                        <Badge variant={status.variant}>{status.label}</Badge>
                                    </TableCell>
                                    <TableCell className="px-6 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                aria-label="Ver detalle"
                                                onClick={() => setViewingId(consulta.id)}
                                            >
                                                <Eye className="size-4" />
                                            </Button>
                                            {whatsappEnabled && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label="Enviar WhatsApp"
                                                    className="text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-600"
                                                    disabled={!hasValidPhone(consulta)}
                                                    title={hasValidPhone(consulta) ? 'Enviar WhatsApp' : 'Sin teléfono válido'}
                                                    onClick={() => openWhatsApp(consulta)}
                                                >
                                                    <MessageCircle className="size-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Card>

            <Dialog open={Boolean(viewing)} onOpenChange={(open) => !open && setViewingId(null)}>
                <DialogContent>
                    {viewing && (
                        <>
                            <DialogHeader>
                                <div className="flex items-start justify-between gap-3 pr-6">
                                    <div className="min-w-0 text-left">
                                        <DialogTitle className="truncate">{viewing.name}</DialogTitle>
                                        <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(viewing.created_at)}</p>
                                    </div>
                                    <Badge variant={statusOf(viewing).variant} className="shrink-0">
                                        {statusOf(viewing).label}
                                    </Badge>
                                </div>
                            </DialogHeader>

                            <dl className="divide-y divide-border rounded-xl border border-border text-sm">
                                {[
                                    ['Teléfono', formatPhone(viewing.phone) || '—'],
                                    ['Tipo de proyecto', viewing.project_type],
                                    ['Intervención', viewing.intervention],
                                    ['Ubicación', viewing.location],
                                    ['Servicios', viewing.services?.length ? viewing.services.join(', ') : null],
                                    ['Presupuesto', viewing.budget],
                                    ['Plazo', viewing.timeline],
                                ]
                                    .filter(([, value]) => value)
                                    .map(([label, value]) => (
                                        <div key={label} className="flex justify-between gap-6 px-4 py-2.5">
                                            <dt className="shrink-0 text-muted-foreground">{label}</dt>
                                            <dd className="text-right text-foreground">{value}</dd>
                                        </div>
                                    ))}
                            </dl>

                            <div>
                                <p className="text-[0.7rem] text-muted-foreground">Mensaje</p>
                                <p className="mt-1 whitespace-pre-line text-sm text-foreground">{viewing.message}</p>
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="mr-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    onClick={() => setDeleting(viewing)}
                                >
                                    <Trash2 className="size-4" /> Eliminar
                                </Button>
                                {viewing.status !== 'cerrado' && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => markClosed(viewing)}
                                        disabled={closingBusy}
                                    >
                                        <CheckCircle2 className="size-4" /> Marcar cerrado
                                    </Button>
                                )}
                                {whatsappEnabled && (
                                    <Button
                                        type="button"
                                        disabled={!hasValidPhone(viewing)}
                                        title={hasValidPhone(viewing) ? undefined : 'Sin teléfono válido'}
                                        onClick={() => {
                                            setViewingId(null);
                                            openWhatsApp(viewing);
                                        }}
                                    >
                                        <MessageCircle className="size-4" /> Enviar WhatsApp
                                    </Button>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={Boolean(wa)} onOpenChange={(open) => !open && !waSending && setWa(null)}>
                <DialogContent>
                    {wa && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Enviar WhatsApp</DialogTitle>
                                <p className="text-sm text-muted-foreground">
                                    Se enviará al +51 {formatPhone(wa.phone)} ({wa.name}).
                                </p>
                            </DialogHeader>

                            <div>
                                <label htmlFor="wa-message" className="text-[0.7rem] text-muted-foreground">
                                    Mensaje
                                </label>
                                <Textarea
                                    id="wa-message"
                                    rows={5}
                                    className="mt-1.5"
                                    value={waMessage}
                                    onChange={(event) => setWaMessage(event.target.value)}
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setWa(null)} disabled={waSending}>
                                    Cancelar
                                </Button>
                                <Button type="button" onClick={sendWhatsApp} disabled={waSending || waMessage.trim().length === 0}>
                                    <MessageCircle className="size-4" /> {waSending ? 'Enviando…' : 'Enviar'}
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            <ConfirmModal
                isOpen={Boolean(deleting)}
                onClose={() => setDeleting(null)}
                onConfirm={confirmDelete}
                title="Eliminar consulta"
                message={`¿Está seguro de que desea eliminar la consulta de "${deleting?.name}"? Podrá restaurarla más adelante desde el sistema si es necesario.`}
                confirmLabel="Eliminar"
                isLoading={deletingBusy}
            />
        </AdminLayout>
    );
}
