/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import React, { Fragment, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { UserService } from '../../../service/UserService';



const Classes = () => {
    const [addClass, setAddClass] = useState(false);

    const DEFAULT_CLASS_CODE = '';
    const DEFAULT_CLASS_DESCRIPTION = '';
    const DEFAULT_CLASS_EDUCATION_LEVEL = '';
    const DEFAULT_CLASS_SUBJECT = 'Chemistry';

    interface ClassMap {
        descriptionName: string;
        apiName: string;
        defaultValue: string;
        value: string;
        setValue: React.Dispatch<React.SetStateAction<string>>;
    }

    const useGenerateClassMap = (descriptionName: string, apiName: string, defaultValue: string): ClassMap => {
        const [value, setValue] = useState(defaultValue);
        return { descriptionName, apiName, defaultValue, value, setValue };
    }

    const classMapList: ClassMap[] = [
        useGenerateClassMap('Class Code', 'code', DEFAULT_CLASS_CODE),
        useGenerateClassMap('Class Description', 'description', DEFAULT_CLASS_DESCRIPTION),
        useGenerateClassMap('Class Education Level', 'educationLevel', DEFAULT_CLASS_EDUCATION_LEVEL),
        useGenerateClassMap('Class Subject', 'subject', DEFAULT_CLASS_SUBJECT)
    ];

    const clearNewClass = () => {
        setAddClass(false);
        classMapList.forEach(({ setValue, defaultValue }) => setValue(defaultValue));
    };

    const saveClass = async () => {
        await UserService.addClass(classMapList.reduce((result, { apiName, value }) => ({ ...result, [apiName]: value }), {}) as Class);
        clearNewClass();
    }

    const addClassFooter = (
        <div>
            <Button label="Cancel" icon="pi pi-times" onClick={clearNewClass} className="p-button-text" />
            <Button label="Save" icon="pi pi-save" onClick={saveClass} autoFocus />
        </div>
    );

    const renderField = (labelTextName: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void) => (
        <div className="field grid">
            <label htmlFor={labelTextName} className="col-12 mb-2 md:col-2 md:mb-0">
                {labelTextName}
            </label>
            <div className="col-12 md:col-10">
                <InputText placeholder={labelTextName} style={{ width: '30vw' }} value={value} onChange={onChange} />
            </div>
        </div>
    );

    return (
        <div className="grid">
            <div className="col-12 xl:col-6">
                <div className="card">
                    <Fragment>
                        <Button label="New" icon="pi pi-plus" onClick={() => setAddClass(true)} />
                    </Fragment>
                    <Dialog header="Add Class" style={{ width: '50vw' }} visible={addClass} onHide={() => { addClass && clearNewClass(); }} footer={addClassFooter}>
                        {classMapList.map(({ descriptionName, value, setValue }) => renderField(descriptionName, value, ({ target }) => setValue(target.value)))}
                    </Dialog>
                    <h5>Manage Classes</h5>
                </div>
            </div>
        </div>
    );
};

export default Classes;
