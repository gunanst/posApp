import { getCurrentUser } from '@/lib/actions/authActions';
import { redirect } from 'next/navigation';
import UserManagement from '@/components/users/UserManagement';

export default async function UsersPage() {
    const user = await getCurrentUser();

    if (!user || user.role !== 'ADMIN') {
        redirect('/dashboard');
    }

    return <UserManagement />;
}