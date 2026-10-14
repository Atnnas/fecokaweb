'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Header from './Header';
import Footer from './Footer';

const LoginModal = dynamic(() => import('./LoginModal'), { ssr: false });

const LayoutClient = ({ children }: { children: React.ReactNode }) => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    return (
        <>
            {!isAdmin && <Header onLoginClick={() => setIsLoginOpen(true)} />}
            <main className={isAdmin ? "" : "min-h-screen relative flex flex-col w-full flex-1"}>
                {children}
            </main>
            {!isAdmin && <Footer />}
            {isLoginOpen && <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />}
        </>
    );
};

export default LayoutClient;
