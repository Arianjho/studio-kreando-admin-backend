import { Link } from '@inertiajs/react';
import { Building2, FolderKanban, Image as ImageIcon, Mail } from 'lucide-react';

import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import StatCard from '@/Components/ui/StatCard';
import BarChart from '@/Components/ui/BarChart';
import Logo from '@/Components/Logo';
import { statusOf } from '@/lib/consulta';

function formatDate(value) {
    return new Date(value).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function Dashboard({ stats, consultasByMonth, recentConsultas }) {
    const totalInRange = consultasByMonth.reduce((sum, m) => sum + m.value, 0);

    return (
        <AdminLayout title="Panel" header="Panel" description="Resumen general del contenido y la actividad del sitio.">
            <div className="space-y-5">
                <Card className="overflow-hidden shadow-soft">
                    <div className="flex items-center gap-4 bg-gradient-brand px-6 py-5">
                        <Logo variant="mark" tone="light" height={32} />
                        <div className="min-w-0">
                            <p className="font-display text-lg font-bold text-white">Studio Kreando</p>
                            <p className="text-sm text-white/80">Panel de administración</p>
                        </div>
                    </div>
                </Card>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Consultas nuevas"
                        value={stats.nuevasConsultas}
                        hint={`${stats.totalConsultas} en total`}
                        icon={Mail}
                        href={route('admin.consultas.index')}
                        accent={stats.nuevasConsultas > 0 ? 'brand' : 'muted'}
                    />
                    <StatCard
                        label="Proyectos"
                        value={stats.projects}
                        hint={`${stats.featuredProjects} destacados`}
                        icon={Building2}
                        href={route('admin.projects.index')}
                    />
                    <StatCard
                        label="Categorías"
                        value={stats.categories}
                        icon={FolderKanban}
                        href={route('admin.categories.index')}
                    />
                    <StatCard
                        label="Multimedia"
                        value={stats.media}
                        hint="archivos en la biblioteca"
                        icon={ImageIcon}
                        href={route('admin.media.index')}
                    />
                </div>

                <div className="grid items-start gap-5 lg:grid-cols-3">
                    <Card className="shadow-soft lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Consultas por mes</CardTitle>
                            <CardDescription>
                                {totalInRange} consulta{totalInRange === 1 ? '' : 's'} en los últimos 6 meses
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BarChart data={consultasByMonth} valueSuffix="consultas" />
                        </CardContent>
                    </Card>

                    <Card className="shadow-soft">
                        <CardHeader>
                            <CardTitle>Consultas recientes</CardTitle>
                            <CardDescription>Últimas recibidas por el formulario de contacto</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentConsultas.length === 0 && (
                                <p className="text-sm text-muted-foreground">Aún no hay consultas.</p>
                            )}

                            {recentConsultas.map((consulta) => (
                                <Link
                                    key={consulta.id}
                                    href={route('admin.consultas.index')}
                                    className="flex items-start justify-between gap-3 rounded-lg border border-border px-3 py-2 transition-colors hover:border-ring"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium">{consulta.name}</p>
                                        <p className="truncate text-xs text-muted-foreground">
                                            {consulta.project_type} · {formatDate(consulta.created_at)}
                                        </p>
                                    </div>
                                    <Badge variant={statusOf(consulta).variant} className="shrink-0">
                                        {statusOf(consulta).label}
                                    </Badge>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
