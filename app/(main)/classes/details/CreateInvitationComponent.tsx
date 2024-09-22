'use client';

import React, { Dispatch, SetStateAction } from 'react';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';

interface Props {
    email: string;
    setEmail: Dispatch<SetStateAction<string>>;
    fullName: string;
    setFullName: Dispatch<SetStateAction<string>>;
    loading: boolean;
}

export default function CreateInvitationComponent(props: Props) {
    return (
        <div className="">
            <div className="field grid">
                <label htmlFor="email" className="col-12 mb-6 md:col-2 md:mb-0">
                    Email
                </label>
                <div className="col-12 md:col-10">
                    <InputText id="email" value={props.email} onChange={(e) => props.setEmail(e.target.value)} className="w-full" />
                </div>
            </div>

            <div className="field grid">
                <label htmlFor="fullName" className="col-12 mb-6 md:col-2 md:mb-0">
                    Full Name
                </label>
                <div className="col-12 md:col-10">
                    <InputText id="fullName" value={props.fullName} onChange={(e) => props.setFullName(e.target.value)} className="w-full" />
                </div>
            </div>

            {props.loading && <ProgressSpinner style={{ position: 'absolute', top: '25%', left: '40%' }} />}
        </div>
    );
}
