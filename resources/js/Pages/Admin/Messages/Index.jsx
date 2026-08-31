import { useEffect, useRef, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Eye, Mail, Search, Trash2, X } from 'lucide-react';

import AdminLayout from '@/Layouts/AdminLayout';
import ConfirmModal from '@/Components/ui/ConfirmModal';
import Select from '@/Components/Select';
import TextInput from '@/Components/TextInput';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/Components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { cn } from '@/lib/utils';

const STATUS_OPTIONS = [
    { value: '', label: 'Todos los estados' },
    { value: 'new', label: 'Sin leer' },
    { value: 'read', label: 'Leídos' },
];

export default function MessagesIndex({ messages, filters = {}, projectTypes = [] }) {
    const [viewingMessage, setViewingMessage] = useState(null);
    const [deletingMessage, setDeletingMessage] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [search, setSearch] = useState(filters.search ?? '');

    const items = messages.data ?? [];
    const hasFilters = Boolean(filters.search || filters.project_type || filters.status);

    const applyFilters = (overrides) => {
        const next = {
            search: filters.search ?? '',
            project_type: filters.project_type ?? '',
            status: filters.status ?? '',
            ...overrides,
        };
        const query = Object.fromEntries(Object.entries(next).filter(([, value]) => value));
        router.get(route('admin.messages.index'), query, {
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
        router.get(route('admin.messages.index'), {}, { preserveScroll: true, replace: true });
    };

    const openView = (message) => {
        setViewingMessage(message);
        if (!message.read) {
            router.patch(route('admin.messages.read', message.id), {}, { preserveScroll: true });
        }
    };

    const confirmDelete = () => {
        setDeleting(true);
        router.delete(route('admin.messages.destroy', deletingMessage.id), {
            onFinish: () => {
                setDeleting(false);
                setDeletingMessage(null);
                setViewingMessage(null);
            },
        });
    };

    return (
        <AdminLayout title="Mensajes" header="Mensajes" description="Mensajes recibidos desde el formulario de contacto público.">
            <Card className="overflow-hidden shadow-soft">
                <div className="flex flex-col gap-4 border-b border-border px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
                    <h2 className="text-sm font-medium text-muted-foreground">
                        {messages.total} mensaje{messages.total === 1 ? '' : 's'}
                    </h2>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <TextInput
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Buscar por nombre, correo o mensaje"
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
                            className="sm:w-40"
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
                            <TableHead className="px-6">Remitente</TableHead>
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
                                        ? 'Ningún mensaje coincide con los filtros.'
                                        : 'No hay mensajes registrados todavía.'}
                                </TableCell>
                            </TableRow>
                        )}
                        {items.map((message) => (
                            <TableRow key={message.id}>
                                <TableCell className="px-6 py-3">
                                    <p className="font-medium">{message.name}</p>
                                    <p className="text-xs text-muted-foreground">{message.email}</p>
                                </TableCell>
                                <TableCell className="px-6 py-3">{message.project_type}</TableCell>
                                <TableCell className="hidden px-6 py-3 text-muted-foreground lg:table-cell">
                                    {message.budget ?? '—'}
                                </TableCell>
                                <TableCell className="hidden px-6 py-3 text-muted-foreground lg:table-cell">
                                    {message.timeline ?? '—'}
                                </TableCell>
                                <TableCell className="px-6 py-3 text-muted-foreground">
                                    {new Date(message.created_at).toLocaleDateString('es-PE', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </TableCell>
                                <TableCell className="px-6 py-3">
                                    <Badge variant={message.read ? 'secondary' : 'default'}>{message.read ? 'Leído' : 'Nuevo'}</Badge>
                                </TableCell>
                                <TableCell className="px-6 py-3">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button variant="ghost" size="icon" aria-label="Ver mensaje" onClick={() => openView(message)}>
                                            <Eye className="size-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            aria-label="Eliminar"
                                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => setDeletingMessage(message)}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {messages.links && messages.links.length > 3 && (
                    <div className="flex flex-wrap items-center justify-center gap-1 border-t border-border px-6 py-4">
                        {messages.links.map((link, index) => (
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

            <Dialog open={Boolean(viewingMessage)} onOpenChange={(open) => !open && setViewingMessage(null)}>
                <DialogContent>
                    {viewingMessage && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Mail className="size-5" />
                                    </div>
                                    <div className="min-w-0 text-left">
                                        <DialogTitle>{viewingMessage.project_type}</DialogTitle>
                                        <DialogDescription>
                                            {viewingMessage.name} · {viewingMessage.email}
                                        </DialogDescription>
                                    </div>
                                </div>
                            </DialogHeader>

                            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 rounded-xl bg-secondary/60 p-4 text-sm">
                                {[
                                    ['Intervención', viewingMessage.intervention],
                                    ['Ubicación', viewingMessage.location],
                                    [
                                        'Servicios',
                                        viewingMessage.services?.length ? viewingMessage.services.join(', ') : null,
                                    ],
                                    ['Presupuesto', viewingMessage.budget],
                                    ['Plazo', viewingMessage.timeline],
                                ]
                                    .filter(([, value]) => value)
                                    .map(([label, value]) => (
                                        <div key={label} className="contents">
                                            <dt className="text-muted-foreground">{label}</dt>
                                            <dd className="text-foreground">{value}</dd>
                                        </div>
                                    ))}
                            </dl>

                            <p className="whitespace-pre-line text-sm text-muted-foreground">{viewingMessage.message}</p>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    onClick={() => setDeletingMessage(viewingMessage)}
                                >
                                    <Trash2 className="size-4" /> Eliminar
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            <ConfirmModal
                isOpen={Boolean(deletingMessage)}
                onClose={() => setDeletingMessage(null)}
                onConfirm={confirmDelete}
                title="Eliminar mensaje"
                message={`¿Está seguro de que desea eliminar el mensaje de "${deletingMessage?.name}"? Podrá restaurarlo más adelante desde el sistema si es necesario.`}
                confirmLabel="Eliminar"
                isLoading={deleting}
            />
        </AdminLayout>
    );
}
