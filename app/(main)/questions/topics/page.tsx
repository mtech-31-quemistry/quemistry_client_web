'use client';

import React, { useState, useEffect } from 'react';
import { QuestionsService } from '../../../../service/QuestionsService';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';

const ManageTopics = () => {

    const [topics, setTopics] = useState<any[]>([]);
    useEffect(()=>{
        QuestionsService.getTopics().then((t) => {
            var nodes = t.map( item => {
                    let  childnode: any[] = [];
                    if(item.skills){
                        childnode = item.skills.map( skill => {
                            return { "key": item.id+"-"+skill.id,
                                    "data": { "name": skill.name , "active": skill.active, "type": "skill"}
                                    };
                            });
                    }
                    return { "key" : item.id, "data" : { "name": item.name, "active": item.active, "type": "topic"}, children : childnode }
                });
            setTopics(nodes);
        });

    }, [])
    const actionTemplate = (node: any) => {
        return (
            node.data.type === "skill" ||
            <div className="flex gap-1">
                <Button icon="pi pi-plus" label='Skill'></Button>
            </div>
        );
    };
    //edit name
    const onEditorValueChange = (options: any, value: string) => {

    }
    const inputTextEditor = (options: any) => {
        return <InputText type="text" value={options.rowData[options.field]} onChange={(e) => onEditorValueChange(options, e.target.value)} onKeyDown={(e) => e.stopPropagation()} />;
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Manage Topics</h5>
                    <TreeTable value={topics}>
                        <Column field="name" header="Name" expander/>
                        <Column field="active" header="Active"/>
                        <Column body={actionTemplate} headerClassName="w-20rem" />
                    </TreeTable>
                </div>
            </div>
        </div>
    );
};

export default ManageTopics;
