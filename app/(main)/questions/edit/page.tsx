"use client";
import { useEffect, useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import { FloatLabel } from "primereact/floatlabel";
import { Questions } from '@/types';
import { QuestionsService } from '../../../../service/QuestionsService';
import { TabView, TabPanel } from 'primereact/tabview';
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';


const EditQuestion = () => {
    const [selectedTopics, setSelectedTopics] = useState(null);
    const [selectedSkills, setSelectedSkills] = useState(null);
    const [addedOptions, setAddedOptions] = useState<Questions.Option[]>([]);
    const [stem, setStem] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [isAnswer, setIsAnswer] = useState<boolean>(false);
    const [listOfTopics, setListOfTopics] = useState<Questions.Topic[]>([]);
    const [listOfSkills, setListOfSkills] = useState<Questions.Skill[]>([]);
    const [showOptionDialog, setShowOptionDialog] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<number>(0);

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
            <Editor readOnly value={option.text} showHeader={false}>
            </Editor>
        )
    }
    const optionItemActionTemplate = (option: Questions.Option) => {
        return(
            <Button className="pi pi-trash" style={{ color: 'red' }} rounded text onClick={(e) => {handleOnDeleteOption(option.no)}}></Button>
        )
    }
    const optionItemisAnswer = (option: Questions.Option) => {
        return {'bg-primary' : option.isAnswer};
    }


    const optionItemAnswerSwitch = (option: Questions.Option) => {
        return(
            <InputSwitch checked={option.isAnswer} onChange={(e: InputSwitchChangeEvent) => handleOnSelectAnswer(option.no, e.value)} />
        )
    }

    const OptionsHeader = (
        <div className="grid">
            <div className="col-10">
            </div>
            <div className="col-2">
                <Button icon="pi pi-plus" rounded label="Add" size="small" onClick={() => setShowOptionDialog(true)} />
            </div>
        </div>
    );

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
   const handleOnSelectAnswer = (selectedNo: number, checked: boolean) => {
        var refreshAnswer = addedOptions;
        refreshAnswer[selectedNo-1].isAnswer = checked;
        if(checked){
            refreshAnswer =addedOptions.map((option) => {
                    return {
                        no: option.no,
                        text: option.text,
                        isAnswer: option.no === selectedNo
                    }
                }) 
        }
        setAddedOptions(refreshAnswer);
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
        setShowOptionDialog(false);
    };
    const handleOnClickDone =() => {
        //validate
        const answer = addedOptions.filter((option: Questions.Option)=>{
            return option.isAnswer
        })
        if(!answer || answer.length <= 0 )
            throw "No answer selected"
        console.log(answer)

        //instantiate MCQ object before adding 
        let mcq = {
            stem: stem,
            option: addedOptions,
            isAnswer: answer[0].no,
            status: "Draft",
            topics: selectedTopics,
            skills: selectedSkills
        }
        console.log(mcq)
    }
    return (
        <>
        <h5>Add Question</h5>
        <br/>
        <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
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
                    <div className="col-12">
                        Other information like publised date
                    </div>
                    <div className="col-12">
                        <Button label="Next" onClick={()=> {setActiveTab(1)}}></Button>
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
                    <div className="col-12">
                        <Button label="Next" onClick={()=> {setActiveTab(2)}}></Button>
                    </div>
            </TabPanel>
            <TabPanel header="Options">
                    <Dialog visible={showOptionDialog} style={{ width: '80vw' }} modal={false} position="bottom" onHide={() => {if (!showOptionDialog) return; setShowOptionDialog(false); }}>
                        <div className="grid">
                            <div className="col-10">Fill in the options of the question and indicate answer.</div>
                            <div className="col-2">
                                <Button label="Add" onClick={handleOnClickAdd} size="small"/>
                            </div>
                            <div className="col-12">
                                <Editor value={answer} onTextChange={(e: EditorTextChangeEvent) => setAnswer(e.htmlValue || '')} style={{ height: '100px' }} />
                            </div>
                            <div className="col-10">
                            </div>
                        </div>
                    </Dialog>
                    <div className="grid"> 
                        <div className="col-12">
                            <DataTable rowClassName={optionItemisAnswer} value={addedOptions} 
                                header={OptionsHeader}
                                emptyMessage="Add options for question">
                                <Column field="no" style={{ width: '5%' }}></Column>
                                <Column style={{ width: '90%' }} body={optionsItemTemplate}></Column>
                                <Column header="Answer" style={{ width: '10%' }} body={optionItemAnswerSwitch}></Column>
                                <Column style={{ width: '5%' }} body={optionItemActionTemplate}></Column>
                            </DataTable>
                        </div>
                        <div className="col-12">
                            <Button label="Next" onClick={()=> {setActiveTab(3)}}></Button>
                         </div>
                   </div>
            </TabPanel>
            <TabPanel header="Review">
                <div className="grid">
                    <div className="col-12">
                        <Editor readOnly value={stem} showHeader={false} style={{ height: '400px' }}>
                        </Editor>
                    </div>
                    <div className="col-12">
                        <DataTable value={addedOptions} emptyMessage="No options added">
                            <Column field="no" style={{ width: '5%' }}></Column>
                            <Column style={{ width: '90%' }} body={optionsItemTemplate}></Column>
                        </DataTable>
                    </div>
                    <div className="col-11">&nbsp;</div>
                    <div className="col-1">
                        <Button label="Done" onClick={handleOnClickDone}></Button>
                    </div>
 
                </div>
            </TabPanel>
        </TabView>
        
        </>
        )
}


export default EditQuestion;