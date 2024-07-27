'use client';

import React, { useState, useEffect } from 'react';
import { QuestionsService } from '../../../../service/QuestionsService';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ToggleButton } from 'primereact/togglebutton';
import { warnOptionHasBeenMovedOutOfExperimental } from 'next/dist/server/config';

const ManageTopics = () => {
    const [topicNodes, setTopicNodes] = useState<any[]>([]);
    const [topics, setTopics] = useState<Questions.Topic[]>([]);
    const [edited, setEdited] = useState(false);
    const [expandedKeys, setExpandedKeys] = useState();

    const reload = () => {
        QuestionsService.getTopics().then((t) => {
            setTopics(t);
        });
    }

    useEffect(()=>{
        reload();
    },[]);
 
    useEffect(()=>{
        var nodes = topics.map( item => {
                let  childnode: any[] = [];
                if(item.skills){
                    childnode = item.skills.map( skill => {
                        return { "key": item.id+"-"+skill.id,
                                "data": { "id": skill.id,"name": skill.name , "active": skill.active, "type": "skill", "edited": skill.edited}
                                };
                        });
                }
                return { "key" : item.id, "data" : { "id":item.id, "name": item.name, "active": item.active, "type": "topic", "edited": item.edited}, children : childnode }
            });
            setTopicNodes(nodes);

    }, [topics])

    const actionTemplate = (node: any) => {
        return (
            node.data.type === "skill" ||
            <div className="flex gap-1">
                <Button icon="pi pi-plus" label='Skill' onClick={(e) => {addSkill(node)}}></Button>
            </div>
        );
    };
    const activeTemplate = (node: any) => {
        return(
            <ToggleButton onLabel="Active" offLabel="Inactive"
                checked={node.data.active} onChange={(e) => onActiveStatusChange(node, e.target.value)}/>
        );
    }
    //edit active status
    const onActiveStatusChange = (node: any, value: boolean) => {
        var found = false;
        let updatedTopics = topics.map( (t)=> {
            if(node.data.type === 'topic' && t.id === node.key){
                t.active = value;
                t.edited = true;
                found = true;
            }
            else if(node.data.type === 'skill' && t.skills){
                t.skills.map((s) => {
                    if(s.id === node.data.id){
                        s.active = value;
                        s.edited = true;
                        found = true;
                    }
                })
            }
            return t;
        });
        if(found){
            setEdited(true);
            setTopics(updatedTopics);
        }
    }
    //edit name
    const onNameChange = (options: any, value: string) => {
        var found = false;
        let updatedTopics = topics.map( (t)=> {
            if(options.node.data.type === 'topic' && t.id === options.node.key){
                t.name = value;
                t.edited = true;
                found = true;
            }
            else if(options.node.data.type === 'skill' && t.skills){
                t.skills.map((s) => {
                    if(s.id === options.node.data.id){
                        s.name = value;
                        s.edited = true;
                        found = true;
                    }
                })
            }
            return t;
        });
        if(found){
            setEdited(true);
            setTopics(updatedTopics);
        }
   }
    const nameEditor = (options: any) => {
        return <InputText type="text" value={options.rowData[options.field]} onChange={(e) => onNameChange(options, e.target.value) } onKeyDown={(e) => e.stopPropagation()} />;
    };
    //add skill
    const addSkill = (node: any)=> {
        var found = false;
        console.log("Add skills for ", node.key)
        let updatedTopics = topics.map( (t)=> {
            if(t.id === node.key){
                found = true;
                let newSkill: Questions.Skill = {
                    name: "",
                    active: true,
                    edited: true,
                    topicId: node.key
                }
                //add skill
                if(t.skills){
                    t.skills.unshift(newSkill)
                }
                else{
                    t.skills = [newSkill]
                }                   
            }
            return t;
        });
        if(found){
            setEdited(true);
            setTopics(updatedTopics);
            let _expandkey: any = {};
            _expandkey[node.key] = true;
            setExpandedKeys(_expandkey)

        }
    }
    //footer
    const footer = (
        <div className='grid'>
                <div className="flex justify-content-start col-8">
                    <Button icon="pi pi-refresh" label="Reload" severity="warning" onClick={(e)=> {reload}} />
                </div>
                {!edited || <div className="flex justify-content-end col-4">
                    <Button icon="pi pi-save" label="Save" severity="success" />
                </div>}
        </div>
    );
    
    //conditional formating
    const rowClassName = (node: any) => {
        return { 'p-highlight': node.data.edited };
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Manage Topics</h5>
                    <TreeTable value={topicNodes} columnResizeMode="fit" footer={footer} rowClassName={rowClassName}
                        expandedKeys={expandedKeys} onToggle={(e) => setExpandedKeys(e.value)} >
                        <Column field="name" header="Name" expander 
                            editor={nameEditor} style={{ height: '3.5rem' }} className="w-20rem"/>
                        <Column body={activeTemplate} field="active" header="Active" className="w-4rem"/>
                        <Column body={actionTemplate} className="w-4rem" />
                    </TreeTable>
                </div>
            </div>
        </div>
    );
};

export default ManageTopics;
