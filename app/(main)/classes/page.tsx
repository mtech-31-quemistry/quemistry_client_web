'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { Fragment, useEffect, useState } from 'react';
import { UserService } from '@/service/UserService';

interface ClassMap {
    descriptionName: string;
    apiName: string;
    defaultValue: string;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
}

const Classes = () => {
    const [addClass, setAddClass] = useState(false);
    const [classes, setClasses] = useState<ClassResponse[]>([]);

    useEffect(() => {
        fetchClasses();
    }, [addClass]);

    const useGenerateClassMap = (descriptionName: string, apiName: string, defaultValue = ''): ClassMap => {
        const [value, setValue] = useState(defaultValue);
        return { descriptionName, apiName, defaultValue, value, setValue };
    };

    const classMapList = [
        useGenerateClassMap('Class Code', 'code'),
        useGenerateClassMap('Class Description', 'description'),
        useGenerateClassMap('Class Education Level', 'educationLevel'),
        useGenerateClassMap('Class Subject', 'subject', 'Chemistry')
    ];

    const clearNewClass = () => {
        setAddClass(false);
        classMapList.forEach(({ setValue, defaultValue }) => setValue(defaultValue));
    };

    const fetchClasses = async () => setClasses(await UserService.getClasses());

    const saveClass = async () => {
        await UserService.addClass(classMapList.reduce((classFields, { apiName, value }) => ({ ...classFields, [apiName]: value }), {}) as Class);
        clearNewClass();
        await fetchClasses();
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

    return (
        <div className="grid" style={{ width: '150vw' }}>
            <div className="col-12 xl:col-6">
                <div className="card">
                    <Fragment>
                        <Button label="New" icon="pi pi-plus" onClick={() => setAddClass(true)} />
                    </Fragment>
                    <Dialog header="Add Class" style={{ width: '50vw' }} visible={addClass} onHide={() => addClass && clearNewClass()} footer={addClassFooter}>
                        {classMapList.map(({ descriptionName, value, setValue }) => renderField(descriptionName, value, ({ target }) => setValue(target.value)))}
                    </Dialog>
                    <h5>Manage Classes</h5>
                    <DataTable value={classes} tableStyle={{ minWidth: '20rem' }}>
                        {classMapList.map(({ descriptionName, apiName }) => (
                            <Column
                                field={apiName}
                                header={descriptionName
                                    .split(' ')
                                    .filter((_, index) => index !== 0)
                                    .join(' ')}
                            />
                        ))}
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default Classes;
