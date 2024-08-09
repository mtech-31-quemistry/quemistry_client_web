'use client';

import React, { useState, useEffect, useRef } from 'react';
import { QuestionsService } from '../../../../service/QuestionsService';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { SelectButton } from 'primereact/selectbutton';
import { Toast } from 'primereact/toast';

const ManageTopics = () => {
    const [topicNodes, setTopicNodes] = useState<any[]>([]); //for display
    const [topics, setTopics] = useState<Questions.Topic[]>([]); //list of topics with edited value and edit status
    const [edited, setEdited] = useState(false); //whether there is edits
    const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>(); //for expanding and collapsing nodes in tree table
    const [addTopic, setAddTopic] = useState(false); //for adding new topics dialog
    const [newTopicName, setNewTopicName] = useState(""); //for adding new topics dialog
    const toast = useRef<Toast>(null);

    const saveSuccess = () => {
        toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Changes have been saved',
            life: 3000 //3 secs
        });
    };
    const reloadSuccess = () => {
        toast.current?.show({
            severity: 'info',
            summary: 'Reloaded',
            detail: 'Changes undone',
            life: 3000 //3 secs
        });
    };
    const reload = () => {
        QuestionsService.getTopics().then((t) => {
            reloadSuccess();
            setEdited(false);
            setTopics(t);
        });
    }

    useEffect(()=>{
        QuestionsService.getTopics().then((t) => {
            setTopics(t);
        });
    },[]);
 
    useEffect(()=>{
        var nodes = topics.map( item => {
                let  childnode: any[] = [];
                if(item.skills){
                    childnode = item.skills.map( skill => {
                        return { "key": item.id+"-"+skill.id,
                                "data": { "id": skill.id,"name": skill.name , "status": skill.status, "type": "skill", "edited": skill.edited, "topicId": item.id}
                                };
                        });
                }
                return { "key" : item.id, "data" : { "id":item.id, "name": item.name, "status": item.status, "type": "topic", "edited": item.edited}, children : childnode }
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
    const statusTemplate = (node: any) => {
        return(<>
            {!node.data.id ||
            <SelectButton value={node.data.status} onChange={(e) => onStatusChange(node, e.target.value)} options={['ACTIVE','INACTIVE']}/>
            }
            {node.data.id != undefined ||
            <Button label='Undo' icon="pi pi-undo" onClick={(e)=> undoAddSkill(node)}/>
            }
            </>
        );
    }
    //edit active status
    const onStatusChange = (node: any, value: string) => {
        var found = false;
        let updatedTopics = topics.map( (t)=> {
            if(node.data.type === 'topic' && t.id === node.key){
                t.status = value;
                t.edited = true;
                found = true;
            }
            else if(node.data.type === 'skill' && t.skills){
                t.skills.map((s) => {
                    if(s.id === node.data.id){
                        s.status = value;
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
    //edit topic or skill name
    const onNameChange = (options: any, value: string) => {
        var found = false;
        let updatedTopics = topics.map( (t)=> {
            if(options.node.data.type === 'topic' && t.id === options.node.key){
                t.name = value;
                t.edited = true;
                found = true;
            }
            else if(options.node.data.type === 'skill' && t.skills){
                if(options.node.data.id == undefined ){
                    if(t.skills[0].id == undefined){
                        t.skills[0].name = value;
                        t.skills[0].edited = true;
                        found = true;
                    }
                }else{   
                    t.skills.map((s) => {
                        if(s.id === options.node.data.id){
                            s.name = value;
                            s.edited = true;
                            found = true;
                        }
                    });
                }
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
        let updatedTopics = topics.map( (t)=> {
            if(t.id === node.key){
                found = true;
                let newSkill: Questions.Skill = {
                    name: "",
                    status: "ACTIVE",
                    edited: true,
                    topicId: node.key
                }
                //insert skill to first element of array
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
    //undo add skill
    const undoAddSkill = (node: any)=> {
        var found = false;
        console.log("for topic:", node.data.topicId)
        let updatedTopics = topics.map( (t)=> {
            if(t.id === node.data.topicId){
                found = true;
                //delete first skill to undo add
                if(t.skills && t.skills[0].id == undefined){
                    t.skills.shift();
                }                  
            }
            return t;
        });
        if(found){
            setTopics(updatedTopics);
        }
    }
    //Add Topic 
    const saveTopic = () => {
        //hide add topic dialog
        setAddTopic(false);
        let newTopic: Questions.Topic = {
            name: newTopicName,
            status: "ACTIVE",
            skills: [],
            edited: true
        }
        console.log("Add topic", newTopic)    
    }
    //Add Topic
    const saveChanges = () => {
        //populate edited topics and skills
        //topic is edited or topic has skills edited
        let topicsChanges: Questions.Topic[] = topics.filter( t => {
            return t.edited || t.skills.filter(s => { return s.edited}).length > 0
        });
        //console.log("Add topic", topicsChanges);    
        QuestionsService.saveTopics(topicsChanges).then((t) => {
            saveSuccess();
            setTopics(t);
            setEdited(false);
        });
    }

    //toolbar
    const startContent = (
        <React.Fragment>
            <Button icon="pi pi-plus" className="mr-2" onClick={(e) =>{setAddTopic(true)}}  />
            <Button icon="pi pi-upload" />
        </React.Fragment>
    );
    //add topic footer
    const addTopicFooter = (
        <div>
            <Button label="Cancel" icon="pi pi-times" onClick={() => setAddTopic(false)} className="p-button-text" />
            <Button label="Save" icon="pi pi-save" onClick={() => saveTopic()} autoFocus />
        </div>
    )
    //footer
    const treeTablefooter = (
        <div className='grid'>
                <div className="flex justify-content-start col-8">
                    <Button icon="pi pi-refresh" label="Reload" severity="warning" onClick={()=> {reload()}} />
                </div>
                {!edited || <div className="flex justify-content-end col-4">
                    <Button icon="pi pi-save" label="Save" severity="success" onClick={()=> saveChanges()} />
                </div>}
        </div>
    );
    
    //conditional formating
    const rowClassName = (node: any) => {
        return { 'p-highlight': node.data.edited };
    }

    return (
        <div className="grid">
            <Toast ref={toast} position="bottom-left" />
            <div className="col-12">
                <div className="card">
                    <Toolbar start={startContent} />
                    <Dialog header="Add Topic" visible={addTopic} onHide={()=>{if(!addTopic) return; setAddTopic(false)}} 
                        style={{ width: '50vw' }} footer={addTopicFooter} >
                        <InputText placeholder='topic name' style={{ width: '30vw' }} value={newTopicName} onChange={(e) => setNewTopicName(e.target.value)} />
                    </Dialog>
                    <h5>Manage Topics</h5>
                    <TreeTable value={topicNodes} columnResizeMode="fit" footer={treeTablefooter} rowClassName={rowClassName}
                        expandedKeys={expandedKeys} onToggle={(e) => setExpandedKeys(e.value)} >
                        <Column field="name" header="Name" expander 
                            editor={nameEditor} style={{ height: '3.5rem' }} className="w-20rem"/>
                        <Column body={statusTemplate} field="status" header="Status" className="w-16rem"/>
                        <Column body={actionTemplate} className="w-8rem" />
                    </TreeTable>
                </div>
            </div>
        </div>
    );
};

export default ManageTopics;
