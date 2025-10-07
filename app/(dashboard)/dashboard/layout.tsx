// app/dashboard/layout.tsx
import DashboardLayout from '@/components/Dashboard/DashboardLayout';

export default function DashboardLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardLayout>{children}</DashboardLayout>;
}