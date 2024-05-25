import { Metadata } from 'next';
import Layout from '../../layout/layout';
import { Viewport } from 'next';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'Quemistry',
    description: 'Personal trainer in chemistry.',
    robots: { index: false, follow: false },
    icons: {
        icon: '/favicon.ico'
    }
};

export const viewport: Viewport = {
    initialScale: 1, 
    width: 'device-width' 
}

export default function AppLayout({ children }: AppLayoutProps) {
    return <Layout>{children}</Layout>;
}
