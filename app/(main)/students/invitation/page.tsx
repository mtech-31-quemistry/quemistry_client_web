'use client'

import { useSearchParams } from 'next/navigation'
import { UserService } from '@/service/UserService';
import { useEffect, useState } from 'react';


const Page = async () => {
    const [StudentInvitationResponse, setStudentInvitationResponse] = useState<StudentInvitationResponse>();
    const searchParams = useSearchParams();


    useEffect(() => {
        const invitationCode = searchParams.get('code') || '';
        const studentInvitation = { invitationCode: encodeURIComponent(invitationCode) } as StudentInviation;
        UserService.acceptInvitation(studentInvitation).then(s => setStudentInvitationResponse(s.payload[0]));
    }, [searchParams]);

    return (
        <div>
            {StudentInvitationResponse?.success}
        </div>
    );
}


export default Page;
