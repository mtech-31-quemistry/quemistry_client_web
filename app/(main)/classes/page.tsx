'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { UserService } from '@/service/UserService';
import AppMessages, { AppMessage } from '../../../components/AppMessages';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ClassMap {
    descriptionName: string;
    apiName: string;
    defaultValue: string;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
}

const Classes = () => {
    const [addClass, setAddClass] = useState(false);
    const [classId, setClassId] = useState<number>(0);
    const [classes, setClasses] = useState<ClassResponse[]>([]);
    const router = useRouter();

    const appMsg = useRef<AppMessage>(null);

    useEffect(() => {
        fetchClasses();
    }, []);

    const useGenerateClassMap = (descriptionName: string, apiName: string, defaultValue = ''): ClassMap => {
        const [value, setValue] = useState(defaultValue);
        return { descriptionName, apiName, defaultValue, value, setValue };
    };

    const classMapList = [useGenerateClassMap('Class Code', 'code'), useGenerateClassMap('Class Name', 'description'), useGenerateClassMap('Class Education Level', 'educationLevel'), useGenerateClassMap('Class Subject', 'subject', 'Chemistry')];

    const clearNewClass = () => {
        setAddClass(false);
        classMapList.forEach(({ setValue, defaultValue }) => setValue(defaultValue));
    };

    const fetchClasses = async () => setClasses(await UserService.getClasses());

    const saveClass = async () => {
        const selectedClass = classMapList.reduce((classFields, { apiName, value }) => ({ ...classFields, [apiName]: value }), {}) as Class;

        if (classId > 0) await UserService.updateClass(selectedClass, classId);
        else await UserService.addClass(selectedClass);

        clearNewClass();
        await fetchClasses();
    };
    const onClickAddClass = () => {
        //Check tutor already created profile
        UserService.getTutorProfile().then((data) => {
            if (data !== null) {
                setAddClass(true);
                return;
            } else {
                appMsg.current?.showCustomWarning(
                    <div>
                        Please update your profile before adding a class. Click <Link href="/profile/edit">here</Link> to update profile.
                    </div>,
                    true,
                    10
                );
            }
        });
        //setAddClass(true)
    };

    const addClassFooter = (
        <div>
            <Button label="Cancel" icon="pi pi-times" onClick={clearNewClass} className="p-button-text" />
            <Button label="Save" icon="pi pi-save" onClick={saveClass} autoFocus />
        </div>
    );

    const renderField = (labelTextName: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void) => (
        <div className="field grid" key={labelTextName}>
            <label htmlFor={labelTextName} className="col-12 mb-2 md:col-2 md:mb-0">
                {labelTextName}
            </label>
            <div className="col-12 md:col-10">
                <InputText placeholder={labelTextName} style={{ width: '30vw' }} value={value} onChange={onChange} />
            </div>
        </div>
    );

    const EditClass = (selectedClass: ClassResponse) => {
        setClassId(selectedClass.id);
        setAddClass(true);
        classMapList.forEach((classMap, index) => classMapList[index].setValue((selectedClass as any)[classMap.apiName]));
    };

    const ViewDetails = (selectedClass: ClassResponse) => {
        router.push(`/classes/details?id=${selectedClass.id}`);
    };

    const ActionColumnTemplate = (selectedClass: ClassResponse) => {
        return (
            <div className="flex align-items-center gap-2">
                <Button label="Edit" icon="pi pi-pencil" onClick={() => EditClass(selectedClass)} />
                <Button label="Details" icon="pi pi-book" onClick={() => ViewDetails(selectedClass)} />
            </div>
        );
    };

    return (
        <div className="grid">
            <AppMessages ref={appMsg} isAutoDismiss={true} />
            <div className="col-12">
                <div className="card">
                    <Fragment>
                        <Button label="New" icon="pi pi-plus" onClick={() => onClickAddClass()} />
                    </Fragment>
                    <Dialog header="Add/Edit Class" style={{ width: '50vw' }} visible={addClass} onHide={() => addClass && clearNewClass()} footer={addClassFooter}>
                        {classMapList.map(({ descriptionName, value, setValue }) => renderField(descriptionName, value, ({ target }) => setValue(target.value)))}
                    </Dialog>
                    <h5>Manage Classes</h5>
                    <DataTable value={classes} tableStyle={{ minWidth: '20rem' }}>
                        {classMapList.map(({ descriptionName, apiName }, index) => (
                            <Column
                                key={index}
                                field={apiName}
                                header={descriptionName
                                    .split(' ')
                                    .filter((_, index) => index !== 0)
                                    .join(' ')}
                            />
                        ))}

                        <Column header="Action" body={ActionColumnTemplate}></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default Classes;
