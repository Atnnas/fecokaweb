import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const user = session?.user as any;
    const userEmail = user?.email?.toLowerCase();
    const isSuperAdmin = userEmail === 'david.artavia.rodriguez@gmail.com';

    if (!session || (!isSuperAdmin && (user?.role !== 'admin' || user?.status !== 'active'))) {
        redirect('/');
    }

    return (
        <div className="flex h-[100dvh] bg-mist-white overflow-hidden text-deep-black font-sans">
            <AdminSidebar />
            <main className="flex-1 relative overflow-y-auto custom-scrollbar pt-20 md:pt-0">
                <div className="py-8 md:py-12 px-6 md:px-12 lg:px-20 w-full min-h-full flex flex-col">
                    {children}
                </div>
            </main>
        </div>
    );
}
