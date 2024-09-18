'use client';

import { useSearchParams } from 'next/navigation';
import AppMessages, { AppMessage } from '@/components/AppMessages';
import React, { useRef } from 'react';

const ClassDetails = () => {
    const classId = useSearchParams().get('id');
    const appMsg = useRef<AppMessage>(null);

    return (
        <div className="grid">
            <AppMessages ref={appMsg} isAutoDismiss={true} />
            <div className="col-12">
                <div className="card">{classId}</div>
            </div>
        </div>
    );
};

export default ClassDetails;
