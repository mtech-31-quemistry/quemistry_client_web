'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { UserService } from '@/service/UserService';
import { useCallback, useEffect, useState } from 'react';


const InvitationPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const storeInvitationResponse = useCallback((result: boolean) => {
        sessionStorage.setItem("invitation_result", String(result));
        router.push('/dashboard');
    }, [router]);

    useEffect(() => {
        const invitationCode = searchParams.get('code') || '';
        const studentInvitation = {
            invitationCode: encodeURIComponent(invitationCode)
        } as StudentInvitation;

        UserService
            .acceptInvitation(studentInvitation)
            .then(s => storeInvitationResponse(s.payload))
            .catch(err => {
                console.error(err);
                storeInvitationResponse(false);
            });
    }, [searchParams, storeInvitationResponse]);
}


export default InvitationPage;
