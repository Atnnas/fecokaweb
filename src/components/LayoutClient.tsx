'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import NavMenu from './ui/menu-hover-effects';
import LoginModal from './LoginModal';
import Footer from './Footer';

const LayoutClient = ({ children }: { children: React.ReactNode }) => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    return (
        <>
            {!isAdmin && <NavMenu onLoginClick={() => setIsLoginOpen(true)} />}
            <main className={isAdmin ? "" : "min-h-screen pt-24"}>
                {children}
            </main>
            {!isAdmin && <Footer />}
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </>
    );
};

export default LayoutClient;
