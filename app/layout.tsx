'use client';
import { LayoutProvider } from '@/layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import { Suspense } from 'react';
import RedirectionHandler from '@/app/RedirectionHandler';

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link id="theme-css" href={`/themes/lara-light-indigo/theme.css`} rel="stylesheet"></link>
            </head>
            <body>
                <PrimeReactProvider>
                    <Suspense fallback={<div>Loading...</div>}>
                        <RedirectionHandler />
                        <LayoutProvider>{children}</LayoutProvider>
                    </Suspense>
                </PrimeReactProvider>
            </body>
        </html>
    );
}
