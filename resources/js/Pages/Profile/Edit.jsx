import AdminLayout from '@/Layouts/AdminLayout';
import { Card } from '@/Components/ui/card';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AdminLayout title="Mi perfil" header="Mi perfil">
            <div className="space-y-6">
                <Card className="p-6 shadow-soft">
                    <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} className="max-w-xl" />
                </Card>

                <Card className="p-6 shadow-soft">
                    <UpdatePasswordForm className="max-w-xl" />
                </Card>

                <Card className="p-6 shadow-soft">
                    <DeleteUserForm className="max-w-xl" />
                </Card>
            </div>
        </AdminLayout>
    );
}
