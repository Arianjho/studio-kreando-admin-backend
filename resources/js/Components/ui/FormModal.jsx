import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';

export default function FormModal({
    isOpen,
    onClose,
    onSubmit,
    title,
    description,
    processing = false,
    submitLabel = 'Guardar',
    cancelLabel = 'Cancelar',
    className = 'sm:max-w-lg',
    children,
}) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className={className}>
                <form onSubmit={onSubmit} className="flex max-h-[80vh] flex-col">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        {description && <DialogDescription>{description}</DialogDescription>}
                    </DialogHeader>

                    <div className="-mx-6 flex-1 space-y-5 overflow-y-auto px-6 py-5">{children}</div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
                            {cancelLabel}
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Guardando...' : submitLabel}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
