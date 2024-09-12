'use client';
import { redirect, usePathname, useSearchParams } from 'next/navigation';
import RouteGuard from '@/lib/RouteGuard';

export default function RedirectionHandler() {
    const pathname = usePathname();
    const queryString = useSearchParams().toString();
    console.log(queryString);
    if (!RouteGuard.apply(pathname, queryString)) {
        redirect('/auth/google');
    }

    return '';
}
