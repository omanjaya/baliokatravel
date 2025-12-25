import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Toaster } from '../ui/toaster';

interface MainLayoutProps {
    children?: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 pt-16 md:pt-20">
                {children || <Outlet />}
            </main>
            <Footer />
            <Toaster />
        </div>
    );
}

export default MainLayout;
