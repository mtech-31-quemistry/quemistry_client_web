'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { UserService } from '@/service/UserService';
import CreateInvitationPage from '@/app/(main)/students/invitation/create/page';
import { Toast } from 'primereact/toast';

const Students = () => {
  const [inviteStudentStatus, setInviteStudentStatus] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState<InputClass>({} as InputClass);
  const [email, setEmail] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const toast = useRef<Toast>(null);

  useEffect(() => {
    fetchStudents();
  }, [inviteStudentStatus]);

  const clearInviteStudent = () => {
    setInviteStudentStatus(false);
    setSelectedClass({} as InputClass);
    setEmail('');
    setFullName('');
  };

  const fetchStudents = async () => setStudents(await UserService.getStudents());

  const inviteStudent = async () => {
    console.log('email', email, 'class code', selectedClass.code, 'full name', fullName);

    const isSucceeded = await UserService.sendInvitation({
      studentEmail: email,
      studentFullName: fullName,
      classCode: selectedClass.code
    });

    invitationResponse(isSucceeded, fullName, selectedClass.name);

    clearInviteStudent();
    await fetchStudents();
  };

  const invitationResponse = (isSucceeded: boolean, fullName: string, className: string) => {

    let summary = 'Success';
    let detail = `We have successfully invited ${fullName} to the class ${className}`;

    if (!isSucceeded) {
      summary = `Error invitation the student ${fullName} to the class ${className}`;
      detail = 'Please contact customer support for more info.';
    }

    toast.current?.show({
      severity: isSucceeded ? 'success' : 'error',
      summary: summary,
      detail: detail,
      life: 5000 //3 secs
    });
  };

  const addStudentFooter = (
    <div>
      <Button label="Cancel" icon="pi pi-times" onClick={clearInviteStudent} className="p-button-text" />
      <Button label="Save" icon="pi pi-save" onClick={inviteStudent} autoFocus />
    </div>
  );

  return (
    <div className="grid" style={{ width: '150vw' }}>
      <Toast ref={toast} position="top-center" className={'col-12'} />
      <div className="col-12 xl:col-6">
        <div className="card">
          <Fragment>
            <Button label="Invite Student" icon="pi pi-plus" onClick={() => setInviteStudentStatus(true)} />
          </Fragment>
          <Dialog header="Invite Student" style={{ width: '50vw' }} visible={inviteStudentStatus}
                  onHide={() => inviteStudentStatus && clearInviteStudent()} footer={addStudentFooter}>
            <CreateInvitationPage setEmail={setEmail} email={email} setFullName={setFullName} fullName={fullName}
                                  selectedClass={selectedClass} setSelectedClass={setSelectedClass} />
          </Dialog>
          <h5>Manage Students</h5>
          <DataTable value={students} tableStyle={{ minWidth: '20rem' }}>
            <Column field="firstName" header="First Name"></Column>
            <Column field="lastName" header="Last Name"></Column>
            <Column field="educationLevel" header="Education Level"></Column>
            <Column field="email" header="Email"></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default Students;
