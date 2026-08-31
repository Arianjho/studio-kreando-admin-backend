import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Eye, Mail, Trash2 } from 'lucide-react';

import AdminLayout from '@/Layouts/AdminLayout';
import ConfirmModal from '@/Components/ui/ConfirmModal';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/Components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { cn } from '@/lib/utils';

export default function MessagesIndex({ messages }) {
    const [viewingMessage, setViewingMessage] = useState(null);
    const [deletingMessage, setDeletingMessage] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const items = messages.data ?? [];

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
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <h2 className="text-sm font-medium text-muted-foreground">
                        {messages.total} mensaje{messages.total === 1 ? '' : 's'}
                    </h2>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="px-6">Remitente</TableHead>
                            <TableHead className="px-6">Asunto</TableHead>
                            <TableHead className="px-6">Fecha</TableHead>
                            <TableHead className="px-6">Estado</TableHead>
                            <TableHead className="px-6 text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="px-6 py-10 text-center text-sm text-muted-foreground">
                                    No hay mensajes registrados todavía.
                                </TableCell>
                            </TableRow>
                        )}
                        {items.map((message) => (
                            <TableRow key={message.id}>
                                <TableCell className="px-6 py-3">
                                    <p className="font-medium">{message.name}</p>
                                    <p className="text-xs text-muted-foreground">{message.email}</p>
                                </TableCell>
                                <TableCell className="px-6 py-3">{message.subject}</TableCell>
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
                                        <DialogTitle>{viewingMessage.subject}</DialogTitle>
                                        <DialogDescription>
                                            {viewingMessage.name} · {viewingMessage.email}
                                        </DialogDescription>
                                    </div>
                                </div>
                            </DialogHeader>
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
