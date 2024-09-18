'use client';

import { useSearchParams } from 'next/navigation';

const ClassDetails = () => {
    const classId = useSearchParams().get('id');

    return <div>{classId}</div>;
};

export default ClassDetails;
