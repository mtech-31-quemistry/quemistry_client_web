'use client';

import { Dropdown } from 'primereact/dropdown';
import { useEffect, useState } from 'react';
import { UserService } from '@/service/UserService';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

interface InputClass {
    name: string;
    code: string;
}

const CreateInvitationPage = () => {
    const [selectedClassCode, setSelectedClassCode] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [fullName, setFullName] = useState<string>('');
    const [inputClasses, setInputClasses] = useState<InputClass[]>([]);

    useEffect(() => {
        UserService
            .getClasses()
            .then((s) => s.map((v) => setInputClasses(oldArray => [...oldArray, { name: v.description, code: v.code }])));
    }, []);

    return (
        <div>
            <h2>Student Invitation</h2>
            <div className="col-12 md:col-6 mb-5">
                <div className="flex flex-column gap-2">
                    <label htmlFor="email">Student Email</label>
                    <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
            </div>

            <div className="col-12 md:col-6 mb-5">
                <div className="flex flex-column gap-2">
                    <label htmlFor="fullName">Student Full Name</label>
                    <InputText id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
            </div>

            <div className="col-12 md:col-6 mb-5">
                <div className="flex flex-column gap-2">
                    <label htmlFor="classes">Classes</label>
                    <Dropdown
                        id="classes"
                        value={selectedClassCode}
                        onChange={(e) => {
                            console.log('selected', e.value);
                            setSelectedClassCode(e.value);
                        }}
                        options={inputClasses}
                        optionLabel="name"
                        placeholder="Select a class"
                        filter
                        className="w-full md:w-14rem"
                    />
                </div>
            </div>


            <div className="col-12 md:col-6 mb-5">
                <Button
                    onClick={async (e) => {
                        console.log('selected', selectedClassCode, 'input email', email);
                        const isSucceeded = await UserService.sendInvitation({
                            studentEmail: email,
                            studentFullName: fullName,
                            classCode: selectedClassCode
                        });

                        console.log(isSucceeded);
                    }}
                >
                    Send Invites
                </Button>

            </div>
        </div>
    );
};

export default CreateInvitationPage;
