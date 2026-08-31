import { useTheme } from '@/Context/ThemeContext';

/**
 * Logo de KreanDDO Arquitectos.
 *
 * variant:
 *   - "mark"     → monograma DDO (ratio 520x234)
 *   - "wordmark" → "KreanDDO" sin bajada (ratio 1190x250)
 *   - "full"     → "KreanDDO arquitectos" completo (ratio 1190x334)
 *
 * tone:
 *   - "auto"  → tinta navy en tema claro, versión clara en tema oscuro
 *   - "dark"  → siempre tinta navy (para fondos claros)
 *   - "light" → siempre versión clara (para fondos oscuros, p. ej. el sidebar)
 *
 * `height` fija la altura en px; el ancho se deriva del ratio para evitar CLS.
 */
const RATIOS = {
    mark: 520 / 234,
    wordmark: 1190 / 250,
    full: 1190 / 334,
};

const LIGHT_SRC = {
    mark: '/logo-mark-light.png',
    wordmark: '/logo-wordmark-light.png',
    full: '/logo-wordmark-light.png', // no existe "full" claro: usa el wordmark claro
};

const DARK_SRC = {
    mark: '/logo-mark.png',
    wordmark: '/logo-wordmark.png',
    full: '/logo-full.png',
};

export default function Logo({
    variant = 'wordmark',
    tone = 'dark',
    height = 28,
    className = '',
    alt = 'Studio Kreando',
    ...props
}) {
    const { theme } = useTheme();

    const resolvedTone =
        tone === 'auto' ? (theme === 'dark' ? 'light' : 'dark') : tone;

    const src = resolvedTone === 'light' ? LIGHT_SRC[variant] : DARK_SRC[variant];
    const ratio = variant === 'full' && resolvedTone === 'light' ? RATIOS.wordmark : RATIOS[variant];
    const width = Math.round(height * ratio);

    return (
        <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={`block h-auto w-auto select-none ${className}`}
            style={{ height, width }}
            draggable={false}
            {...props}
        />
    );
}
