import { useEffect, useRef, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Eye, Mail, MessageCircle, Search, Trash2, X } from 'lucide-react';

import AdminLayout from '@/Layouts/AdminLayout';
import ConfirmModal from '@/Components/ui/ConfirmModal';
import Select from '@/Components/Select';
import TextInput from '@/Components/TextInput';
import Textarea from '@/Components/Textarea';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/Components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { cn } from '@/lib/utils';

const STATUS_OPTIONS = [
    { value: '', label: 'Todos los estados' },
    { value: 'new', label: 'Sin leer' },
    { value: 'read', label: 'Leídas' },
    { value: 'responded', label: 'Respondidas' },
];

const formatPhone = (phone) => {
    const digits = String(phone ?? '').replace(/\D/g, '');
    return digits.length === 9 ? `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}` : phone;
};

const statusOf = (consulta) => {
    if (consulta.responded_at) return { label: 'Respondida', variant: 'success' };
    if (consulta.read) return { label: 'Leída', variant: 'secondary' };
    return { label: 'Nueva', variant: 'default' };
};

const fillTemplate = (template, consulta) =>
    String(template ?? '')
        .replaceAll('{nombre}', consulta.name ?? '')
        .replaceAll('{tipo_proyecto}', consulta.project_type ?? '')
        .replaceAll('{ubicacion}', consulta.location ?? '')
        .replaceAll('{presupuesto}', consulta.budget ?? '')
        .replaceAll('{plazo}', consulta.timeline ?? '');

export default function ConsultasIndex({
    consultas,
    filters = {},
    projectTypes = [],
    whatsappEnabled = false,
    whatsappTemplate = '',
}) {
    const [viewing, setViewing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [deletingBusy, setDeletingBusy] = useState(false);
    const [search, setSearch] = useState(filters.search ?? '');

    const [wa, setWa] = useState(null); // consulta targeted by the WhatsApp modal
    const [waMessage, setWaMessage] = useState('');
    const [waSending, setWaSending] = useState(false);

    const items = consultas.data ?? [];
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

    const openView = (consulta) => {
        setViewing(consulta);
        if (!consulta.read) {
            router.patch(route('admin.consultas.read', consulta.id), {}, { preserveScroll: true });
        }
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

    const confirmDelete = () => {
        setDeletingBusy(true);
        router.delete(route('admin.consultas.destroy', deleting.id), {
            onFinish: () => {
                setDeletingBusy(false);
                setDeleting(null);
                setViewing(null);
            },
        });
    };

    return (
        <AdminLayout title="Consultas" header="Consultas" description="Consultas recibidas desde el formulario de contacto público.">
            <Card className="overflow-hidden shadow-soft">
                <div className="flex flex-col gap-4 border-b border-border px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
                    <h2 className="text-sm font-medium text-muted-foreground">
                        {consultas.total} consulta{consultas.total === 1 ? '' : 's'}
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
                            const canWhatsApp = /^\d{9}$/.test(String(consulta.phone ?? ''));
                            return (
                                <TableRow key={consulta.id}>
                                    <TableCell className="px-6 py-3">
                                        <p className="font-medium">{consulta.name}</p>
                                        <p className="text-xs text-muted-foreground">{formatPhone(consulta.phone)}</p>
                                    </TableCell>
                                    <TableCell className="px-6 py-3">{consulta.project_type}</TableCell>
                                    <TableCell className="hidden px-6 py-3 text-muted-foreground lg:table-cell">
                                        {consulta.budget ?? '—'}
                                    </TableCell>
                                    <TableCell className="hidden px-6 py-3 text-muted-foreground lg:table-cell">
                                        {consulta.timeline ?? '—'}
                                    </TableCell>
                                    <TableCell className="px-6 py-3 text-muted-foreground">
                                        {new Date(consulta.created_at).toLocaleDateString('es-PE', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </TableCell>
                                    <TableCell className="px-6 py-3">
                                        <Badge variant={status.variant}>{status.label}</Badge>
                                    </TableCell>
                                    <TableCell className="px-6 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            {whatsappEnabled && canWhatsApp && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label="Responder por WhatsApp"
                                                    className="text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-600"
                                                    onClick={() => openWhatsApp(consulta)}
                                                >
                                                    <MessageCircle className="size-4" />
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="icon" aria-label="Ver consulta" onClick={() => openView(consulta)}>
                                                <Eye className="size-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                aria-label="Eliminar"
                                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                onClick={() => setDeleting(consulta)}
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>

                {consultas.links && consultas.links.length > 3 && (
                    <div className="flex flex-wrap items-center justify-center gap-1 border-t border-border px-6 py-4">
                        {consultas.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url ?? '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={cn(
                                    'rounded-lg px-3 py-1.5 text-sm',
                                    link.active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent',
                                    !link.url && 'pointer-events-none opacity-40',
                                )}
                            />
                        ))}
                    </div>
                )}
            </Card>

            <Dialog open={Boolean(viewing)} onOpenChange={(open) => !open && setViewing(null)}>
                <DialogContent>
                    {viewing && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Mail className="size-5" />
                                    </div>
                                    <div className="min-w-0 text-left">
                                        <DialogTitle>{viewing.project_type}</DialogTitle>
                                        <DialogDescription>
                                            {viewing.name} · {formatPhone(viewing.phone)}
                                        </DialogDescription>
                                    </div>
                                </div>
                            </DialogHeader>

                            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 rounded-xl bg-secondary/60 p-4 text-sm">
                                {[
                                    ['Intervención', viewing.intervention],
                                    ['Ubicación', viewing.location],
                                    ['Servicios', viewing.services?.length ? viewing.services.join(', ') : null],
                                    ['Presupuesto', viewing.budget],
                                    ['Plazo', viewing.timeline],
                                ]
                                    .filter(([, value]) => value)
                                    .map(([label, value]) => (
                                        <div key={label} className="contents">
                                            <dt className="text-muted-foreground">{label}</dt>
                                            <dd className="text-foreground">{value}</dd>
                                        </div>
                                    ))}
                            </dl>

                            <p className="whitespace-pre-line text-sm text-muted-foreground">{viewing.message}</p>
                            <DialogFooter>
                                {whatsappEnabled && /^\d{9}$/.test(String(viewing.phone ?? '')) && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-600"
                                        onClick={() => {
                                            setViewing(null);
                                            openWhatsApp(viewing);
                                        }}
                                    >
                                        <MessageCircle className="size-4" /> Responder por WhatsApp
                                    </Button>
                                )}
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    onClick={() => setDeleting(viewing)}
                                >
                                    <Trash2 className="size-4" /> Eliminar
                                </Button>
                            </DialogFooter>
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
                                <DialogDescription>
                                    Se enviará al +51 {formatPhone(wa.phone)} ({wa.name}).
                                </DialogDescription>
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

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setWa(null)} disabled={waSending}>
                                    Cancelar
                                </Button>
                                <Button type="button" onClick={sendWhatsApp} disabled={waSending || waMessage.trim().length === 0}>
                                    <MessageCircle className="size-4" /> {waSending ? 'Enviando…' : 'Enviar'}
                                </Button>
                            </DialogFooter>
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
