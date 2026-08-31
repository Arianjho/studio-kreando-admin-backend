/**
 * Bar chart mínimo en SVG, sin dependencias.
 * Escala con el ancho del contenedor (viewBox + width 100%).
 *
 * props:
 *   - data: [{ label: string, value: number }]
 *   - height: alto del área de dibujo en px del viewBox (default 200)
 *   - valueSuffix: texto tras el valor en el tooltip (p. ej. "mensajes")
 */
export default function BarChart({ data = [], height = 200, valueSuffix = '' }) {
    const width = 640;
    const padX = 8;
    const padBottom = 28;
    const padTop = 22;

    const max = Math.max(1, ...data.map((d) => d.value));
    const slot = (width - padX * 2) / Math.max(1, data.length);
    const barW = Math.min(64, slot * 0.55);
    const chartH = height - padBottom - padTop;

    if (data.length === 0) {
        return <p className="py-10 text-center text-sm text-muted-foreground">Sin datos para mostrar.</p>;
    }

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            className="h-auto w-full"
            role="img"
            aria-label="Gráfico de barras"
        >
            {/* línea base */}
            <line
                x1={padX}
                y1={height - padBottom}
                x2={width - padX}
                y2={height - padBottom}
                stroke="var(--border)"
                strokeWidth="1"
            />

            {data.map((d, i) => {
                const h = d.value === 0 ? 0 : Math.max(3, (d.value / max) * chartH);
                const x = padX + slot * i + (slot - barW) / 2;
                const y = height - padBottom - h;

                return (
                    <g key={d.label}>
                        <title>{`${d.label}: ${d.value}${valueSuffix ? ' ' + valueSuffix : ''}`}</title>

                        <rect
                            x={x}
                            y={y}
                            width={barW}
                            height={h}
                            rx="5"
                            fill="var(--primary)"
                            className="transition-[height,y] duration-500"
                        />

                        {d.value > 0 && (
                            <text
                                x={x + barW / 2}
                                y={y - 6}
                                textAnchor="middle"
                                className="fill-foreground text-[11px] font-semibold"
                            >
                                {d.value}
                            </text>
                        )}

                        <text
                            x={x + barW / 2}
                            y={height - padBottom + 18}
                            textAnchor="middle"
                            className="fill-muted-foreground text-[11px] capitalize"
                        >
                            {d.label}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}
