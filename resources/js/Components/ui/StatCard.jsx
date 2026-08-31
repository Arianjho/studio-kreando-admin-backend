import { Link } from '@inertiajs/react';

import { Card } from '@/Components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Tarjeta de métrica del dashboard.
 *
 * props:
 *   - label: título corto
 *   - value: número o texto principal
 *   - hint: texto secundario bajo el valor
 *   - icon: componente de lucide-react
 *   - href: si se pasa, toda la tarjeta enlaza ahí
 *   - accent: "brand" (por defecto) | "muted" — color del recuadro del icono
 */
export default function StatCard({ label, value, hint, icon: Icon, href, accent = 'brand', className }) {
    const body = (
        <Card
            className={cn(
                'flex items-start gap-4 p-5 shadow-soft transition-colors',
                href && 'hover:border-ring',
                className,
            )}
        >
            {Icon && (
                <span
                    className={cn(
                        'grid size-10 shrink-0 place-items-center rounded-xl',
                        accent === 'brand'
                            ? 'bg-gradient-brand text-white'
                            : 'bg-muted text-muted-foreground',
                    )}
                >
                    <Icon className="size-5" />
                </span>
            )}

            <div className="min-w-0">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-0.5 font-display text-2xl font-bold leading-tight">{value}</p>
                {hint && <p className="mt-0.5 truncate text-xs text-muted-foreground">{hint}</p>}
            </div>
        </Card>
    );

    if (href) {
        return (
            <Link href={href} className="block">
                {body}
            </Link>
        );
    }

    return body;
}
