'use client';

import { Dropdown } from 'primereact/dropdown';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { UserService } from '@/service/UserService';
import { InputText } from 'primereact/inputtext';

interface Props {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  fullName: string;
  setFullName: Dispatch<SetStateAction<string>>;
  selectedClass: InputClass;
  setSelectedClass: Dispatch<SetStateAction<InputClass>>;
}

const CreateInvitationPage = (props: Props) => {
  const [inputClasses, setInputClasses] = useState<InputClass[]>([]);

  useEffect(() => {
    UserService
      .getClasses()
      .then((s) => s.map((v) => setInputClasses(oldArray => [...oldArray, { name: v.description, code: v.code }])));
  }, []);

  return (
    <div className="">
      <div className="field grid">
        <label htmlFor="email" className="col-12 mb-6 md:col-2 md:mb-0">
          Email
        </label>
        <div className="col-12 md:col-10">
          <InputText id="email" value={props.email} onChange={(e) => props.setEmail(e.target.value)}
                     className="w-full" />
        </div>
      </div>

      <div className="field grid">
        <label htmlFor="fullName" className="col-12 mb-6 md:col-2 md:mb-0">
          Full Name
        </label>
        <div className="col-12 md:col-10">
          <InputText id="fullName" value={props.fullName} onChange={(e) => props.setFullName(e.target.value)}
                     className="w-full" />
        </div>
      </div>

      <div className="field grid">
        <label htmlFor="classes" className="col-12 mb-6 md:col-2 md:mb-0">
          Classes
        </label>
        <div className="col-12 md:col-10">
          <Dropdown
            id="classes"
            value={props.selectedClass}
            onChange={(e) => {
              props.setSelectedClass(e.value);
            }}
            options={inputClasses}
            optionLabel="name"
            placeholder="Select a class"
            filter
            className="w-full md:w-14rem"
          />
        </div>
      </div>

    </div>
  );
};

export default CreateInvitationPage;
