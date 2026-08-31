import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent } from '@/Components/ui/card';

export default function Dashboard() {
    return (
        <AdminLayout title="Panel" header="Panel" description="Vista general del panel de administración.">
            <Card className="shadow-soft">
                <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground">
                        Bienvenido al panel de administración de Studio Kreando. Use el menú lateral para gestionar
                        categorías, proyectos, mensajes, multimedia y el contenido del sitio.
                    </p>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
