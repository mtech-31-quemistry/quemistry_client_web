/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { ChartOptions } from 'chart.js';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { UserService } from '../../../service/UserService';

const Classes = () => {
    const [addClass, setAddClass] = useState(false);
    const [newClassCode, setNewClassCode] = useState('');
    const [newClassDescription, setNewClassDescription] = useState('');
    const [newClassEducationLevel, setNewClassEducationLevel] = useState('');
    const [newClassSubject, setNewClassSubject] = useState('');

    const { layoutConfig } = useContext(LayoutContext);

    const clearNewClass = () => {
        setAddClass(false);
        setNewClassCode('');
        setNewClassDescription('');
        setNewClassEducationLevel('');
        setNewClassSubject('');
    };
    const applyLightTheme = () => {
        const lineOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };
    };

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };
    };

    const saveClass = async () => {
        const newClass: Class = {
            code: newClassCode,
            description: newClassDescription,
            educationLevel: newClassEducationLevel,
            subject: newClassSubject
        };

        await UserService.addClass("user-id", newClass)
        clearNewClass();
    }

    const addClassFooter = (
        <div>
            <Button label="Cancel" icon="pi pi-times" onClick={() => clearNewClass()} className="p-button-text" />
            <Button label="Save" icon="pi pi-save" onClick={() => saveClass()} autoFocus />
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

    useEffect(() => {
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme]);

    return (
        <div className="grid">
            <div className="col-12 xl:col-6">
                <div className="card">
                    <Fragment>
                        <Button label="New" icon="pi pi-plus" onClick={(e) => setAddClass(true)} />
                    </Fragment>
                    <Dialog
                        header="Add Class"
                        style={{ width: '50vw' }}
                        visible={addClass}
                        onHide={() => {
                            addClass && clearNewClass();
                        }}
                        footer={addClassFooter}
                    >
                        {renderField('Class Code', newClassCode, (e) => setNewClassCode(e.target.value))}
                        {renderField('Class Description', newClassDescription, (e) => setNewClassDescription(e.target.value))}
                        {renderField('Class Education Level', newClassEducationLevel, (e) => setNewClassEducationLevel(e.target.value))}
                        {renderField('Class Subject', newClassSubject, (e) => setNewClassSubject(e.target.value))}
                    </Dialog>
                    <h5>Manage Classes</h5>
                </div>
            </div>
        </div>
    );
};

export default Classes;
