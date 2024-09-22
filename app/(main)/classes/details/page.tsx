'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import AppMessages, { AppMessage } from '@/components/AppMessages';
import React, { useEffect, useRef, useState } from 'react';
import { Panel } from 'primereact/panel';
import { UserService } from '@/service/UserService';
import moment from 'moment';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import CreateInvitationComponent from '@/app/(main)/classes/details/CreateInvitationComponent';
import { Dialog } from 'primereact/dialog';

const ClassDetails = () => {
    const router = useRouter();
    const classId = useSearchParams().get('id') || '';
    const appMsg = useRef<AppMessage>(null);
    const [classDetails, setClassDetails] = useState<ClassResponse>();
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [students, setStudents] = useState<ClassInvitation[]>([]);

    const [email, setEmail] = useState<string>('');
    const [fullName, setFullName] = useState<string>('');
    const [inviteStudentStatus, setInviteStudentStatus] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [showDialog, setShowDialog] = useState<boolean>(false);

    useEffect(() => {
        UserService.getClassById(classId).then((classResponse) => {
            setClassDetails(classResponse);
            setTutors(classResponse.tutors);

            if (classResponse.classInvitations && classResponse.classInvitations.length > 0) {
                setStudents(classResponse.classInvitations.map((v, i) => ({ userEmail: v.userEmail, status: v.status } as ClassInvitation)));
            }
        });
    }, [inviteStudentStatus]);

    const headerTemplate = (options: any) => {
        const className = `${options.className} justify-content-space-between`;

        return (
            <div className={className}>
                <div className="flex align-items-center gap-2">
                    <span className="font-bold">Students</span>
                </div>
                <div>
                    <Button label="Add" icon="pi pi-user-plus" onClick={() => setShowDialog(true)} text />
                    {options.togglerElement}
                </div>
            </div>
        );
    };

    const clearInviteStudent = () => {
        setShowDialog(false);
        setEmail('');
        setFullName('');
    };

    const inviteStudent = async () => {
        setLoading(true);
        try {
            await UserService.sendInvitation({
                studentEmail: email,
                studentFullName: fullName,
                classCode: classDetails!.code
            });
            invitationResponse(true);
        } catch (e) {
            invitationResponse(false);
        } finally {
            clearInviteStudent();
            setLoading(false);
            setInviteStudentStatus(true);
        }
    };

    const invitationResponse = (isSucceeded: boolean) => {
        if (!isSucceeded) appMsg.current?.showError(`Error invitation the student ${fullName} to the class ${classDetails?.description}. Please contact customer support for more info.`);
        else appMsg.current?.showSuccess(`We have successfully invited ${fullName} to the class ${classDetails?.description}`);
    };

    const addStudentFooter = (
        <div>
            <Button label="Cancel" icon="pi pi-times" onClick={clearInviteStudent} className="p-button-text" />
            <Button label="Save" icon="pi pi-save" onClick={inviteStudent} autoFocus disabled={loading} />
        </div>
    );

    return (
        <div className="grid">
            <AppMessages ref={appMsg} />

            <Dialog header="Invite Student" style={{ width: '50vw' }} visible={showDialog} onHide={() => showDialog || clearInviteStudent()} footer={addStudentFooter}>
                <CreateInvitationComponent setEmail={setEmail} email={email} setFullName={setFullName} fullName={fullName} loading={loading} />
            </Dialog>

            <Panel header="Class Details" className="col-12" toggleable>
                <div className="grid">
                    <div className="col-3">
                        <div className="text-left p-3 border-round-sm">
                            <label className="font-bold text-lg">Code</label>
                            <p>{classDetails?.code}</p>
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="text-left p-3 border-round-sm">
                            <label className="font-bold text-lg">Description</label>
                            <p>{classDetails?.description}</p>
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="text-left p-3 border-round-sm">
                            <label className="font-bold text-lg">Subject</label>
                            <p>{classDetails?.subject}</p>
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="text-left p-3 border-round-sm">
                            <label className="font-bold text-lg">Education Level</label>
                            <p>{classDetails?.educationLevel}</p>
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="text-left p-3 border-round-sm">
                            <label className="font-bold text-lg">Start Date</label>
                            <p>{moment(classDetails?.startDate).format('DD MMM YYYY hh:mm a')}</p>
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="text-left p-3 border-round-sm">
                            <label className="font-bold text-lg">End Date </label>
                            <p>{classDetails?.endDate && moment(classDetails?.endDate).format('DD MMM YYYY hh:mm a')}</p>
                        </div>
                    </div>

                    <div className="col-3">
                        <div className="text-left p-3 border-round-sm">
                            <label className="font-bold text-lg">Status</label>
                            <p>{classDetails?.status}</p>
                        </div>
                    </div>
                </div>
            </Panel>

            <Panel header="Tutors" className="col-12" toggleable>
                <DataTable value={tutors} tableStyle={{ minWidth: '20rem' }}>
                    <Column field="firstName" header="First Name" />
                    <Column field="lastName" header="Last Name" />
                    <Column field="email" header="Email" />
                    <Column field="educationLevel" header="Education Level" />
                </DataTable>
            </Panel>

            <Panel header="Students" className="col-12" toggleable headerTemplate={headerTemplate}>
                <DataTable value={students} tableStyle={{ minWidth: '20rem' }}>
                    <Column field="userEmail" header="Email" />
                    <Column field="status" header="Status" />
                </DataTable>
            </Panel>

            <div className="col-12">
                <Button label="Back" onClick={() => router.push('/classes')}></Button>
            </div>
        </div>
    );
};

export default ClassDetails;
