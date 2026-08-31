import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Sticky action bar for long content-editing forms. Sits at the bottom of the
 * viewport while editing and reports whether there are unsaved changes.
 */
export default function StickySaveBar({ dirty = false, processing = false, className }) {
    return (
        <div
            className={cn(
                'sticky bottom-0 z-20 -mx-3 mt-6 border-t border-border bg-background/95 px-3 py-3 backdrop-blur sm:-mx-6 sm:px-6',
                className,
            )}
        >
            <div className="flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span
                        className={cn(
                            'inline-block size-2 rounded-full',
                            dirty ? 'bg-amber-500' : 'bg-emerald-500',
                        )}
                    />
                    {dirty ? 'Cambios sin guardar' : 'Todo guardado'}
                </p>
                <Button type="submit" disabled={processing || !dirty}>
                    {processing ? 'Guardando...' : 'Guardar cambios'}
                </Button>
            </div>
        </div>
    );
}
