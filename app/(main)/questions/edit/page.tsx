"use client";
import { useEffect, useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import { FloatLabel } from "primereact/floatlabel";
import { Questions } from '@/types';
import { QuestionsService } from '../../../../service/QuestionsService';
import { TabView, TabPanel } from 'primereact/tabview';
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const EditQuestion = () => {
    const [selectedTopics, setSelectedTopics] = useState(null);
    const [selectedSkills, setSelectedSkills] = useState(null);
    const [addedOptions, setAddedOptions] = useState<Questions.Option[]>([]);
    const [stem, setStem] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [isAnswer, setIsAnswer] = useState<boolean>(false);
    const [listOfTopics, setListOfTopics] = useState<Questions.Topic[]>([]);
    const [listOfSkills, setListOfSkills] = useState<Questions.Skill[]>([]);

    useEffect(()=>{
        QuestionsService.getTopics().then((data) => {
            setListOfTopics(data);
        });
        QuestionsService.getSkills().then((data) => {
            setListOfSkills(data);
        });
    }, [])

    const optionsItemTemplate = (option: Questions.Option) => {
        return(
            <Editor readOnly value={option.text + option.isAnswer} showHeader={false}>
            </Editor>
        )
    }
    const optionItemActionTemplate = (option: Questions.Option) => {
        return(
            <Button className="pi pi-times-circle" style={{ color: 'red' }} rounded text onClick={(e) => {handleOnDeleteOption(option.no)}}></Button>
        )
    }
    const optionItemisAnswer = (option: Questions.Option) => {
        return {'bg-primary' : option.isAnswer};
    }

    const handleOnDeleteOption = (input_no: number) => {
        addedOptions.splice(input_no-1, 1);
        const reOrderedOptions =addedOptions.map((option, index) => {
            return {
                no: index + 1,
                text: option.text,
                isAnswer: option.isAnswer
            }
        })
       setAddedOptions(reOrderedOptions);
   }
    const handleOnClickAdd = () => {
        //add options 
        console.log(answer);
        if(!answer)
            return;

        const options: Questions.Option[] =addedOptions.map((option, index)=> {
            return {
                no: index + 1,
                text: option.text,
                isAnswer: option.isAnswer
            }
        })
        options.push({
            no: options.length +1,
                text: answer,
                isAnswer: isAnswer
        })

        setAddedOptions(options);
        setAnswer("");
        setIsAnswer(false);

    };

    return (
        <>
        <h5>Add Question</h5>
        <br/>
        <TabView>
            <TabPanel header="General Information">
                <div className="grid"> 
                    <div className="col-12 md:col-6 mb-5">
                        <FloatLabel>
                        <MultiSelect id="ms-topics"
                                        value={selectedTopics}
                                        onChange={(e) => setSelectedTopics(e.value)}
                                        options={listOfTopics}
                                        optionLabel="name"
                                        placeholder="Select Topics"
                                        filter
                                        display="chip"
                                        className="w-full md:w-50rem"
                                        maxSelectedLabels={3}
                                    />
                            <label htmlFor="ms-topics">Topics</label>
                        </FloatLabel>
                    </div>
                    <div className="col-12 md:col-6 mb-5">
                        <FloatLabel>
                            <MultiSelect
                                        id="ms-skills"
                                        value={selectedSkills}
                                        onChange={(e) => setSelectedSkills(e.value)}
                                        options={listOfSkills}
                                        optionLabel="name"
                                        placeholder="Select Skills"
                                        filter
                                        display="chip"
                                        className="w-full md:w-50rem"
                            />
                            <label htmlFor="ms-skills">Skills</label>
                        </FloatLabel>
                    </div> 
                    <div>
                        Other information like publised date
                    </div>
                </div>
            </TabPanel>
            <TabPanel header="Stem">
                <div className="grid"> 
                    <div className="col-12">Fill in the stem of the question.</div>
                    <div className="col-12">
                        <Editor value={stem} onTextChange={(e: EditorTextChangeEvent) => setStem(e.htmlValue || '')} style={{ height: '320px' }} />
                        </div>
                    </div>

            </TabPanel>
            <TabPanel header="Options">
                    <div className="grid"> 
                        <div className="col-12">Fill in the options of the question and indicate answer.</div>
                        <div className="col-12">
                            <Editor value={answer} onTextChange={(e: EditorTextChangeEvent) => setAnswer(e.htmlValue || '')} style={{ height: '50px' }} />
                        </div>
                        <div className="card justify-content-center col-3">
                            <InputSwitch checked={isAnswer} onChange={(e: InputSwitchChangeEvent) => setIsAnswer(e.value)} />Is Answer
                        </div>
                        <div className="col-3">
                            <Button label="Add" onClick={handleOnClickAdd} />
                        </div>
                        <div className="col-12">
                            <DataTable rowClassName={optionItemisAnswer} value={addedOptions} showHeaders={false} >
                                <Column field="no" style={{ width: '5%' }}></Column>
                                <Column style={{ width: '90%' }} body={optionsItemTemplate}></Column>
                                <Column style={{ width: '5%' }} body={optionItemActionTemplate}></Column>
                            </DataTable>
                        </div>
                   </div>
            </TabPanel>
            <TabPanel header="Review">
                <div className="grid">
                <div className="col-12">
                    <Editor readOnly value={stem} showHeader={false} style={{ height: '400px' }}>
                    </Editor>
                </div>

                </div>
            </TabPanel>
        </TabView>

        </>
        )
}


export default EditQuestion;