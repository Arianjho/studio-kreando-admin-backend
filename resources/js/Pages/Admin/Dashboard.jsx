import AdminLayout from '@/Layouts/AdminLayout';

export default function Dashboard() {
    return (
        <AdminLayout title="Panel" header="Panel">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Bienvenido al panel de administración de Studio Kreando.
                    Use el menú lateral para gestionar categorías, proyectos,
                    mensajes, multimedia y el contenido del sitio.
                </p>
            </div>
        </AdminLayout>
    );
}
