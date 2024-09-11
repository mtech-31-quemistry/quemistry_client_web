'use client';
import { useEffect, useState, useRef } from 'react';
import { Questions, Genai } from '@/types';
import { QuestionsService } from '../../../../service/QuestionsService';
import { GenaiService } from '../../../../service/GenaiService';
import { TabView, TabPanel } from 'primereact/tabview';
import { Editor, EditorTextChangeEvent } from 'primereact/editor';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { TreeSelect, TreeSelectSelectionKeysType } from 'primereact/treeselect';
import { TreeNode } from 'primereact/treenode';
import { useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';

const EditQuestion = () => {
    const router = useRouter();
    const [selectedTopicNodes, setSelectedTopicNodes] = useState<string | TreeSelectSelectionKeysType | TreeSelectSelectionKeysType[] | null>();
    const [topicNodes, setTopicNodes] = useState<TreeNode[]>([]);

    const [addedOptions, setAddedOptions] = useState<Questions.Option[]>([]);
    const [stem, setStem] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [explanation, setExplanation] = useState<string>('');
    const [isAnswer, setIsAnswer] = useState<boolean>(false);
    const [listOfTopics, setListOfTopics] = useState<Questions.Topic[]>([]);
    const [showOptionDialog, setShowOptionDialog] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<number>(0);
    const toast = useRef<Toast>(null);

    const showWarning = (summary: string, message: string) => {
        toast.current?.show({
            severity: 'warn',
            summary: summary,
            detail: message,
            life: 3000 //3 secs
        });
    };

    useEffect(() => {
        QuestionsService.getTopics().then((data) => {
            //console.log('topics initialized: ', data);
            setListOfTopics(data);
        });
    }, []);

    useEffect(() => {
        var nodes = listOfTopics.map((topic) => {
            let childnode: any[] = [];
            if (topic.skills) {
                childnode = topic.skills.map((skill) => {
                    return { key: topic.id + '-' + skill.id, label: skill.name, data: { id: skill.id, name: skill.name, type: 'skill', topicId: topic.id } };
                });
            }
            return { key: topic.id, label: topic.name, data: { id: topic.id, name: topic.name, type: 'topic' }, children: childnode };
        });
        setTopicNodes(nodes);
    }, [listOfTopics]);

    const optionsItemTemplate = (option: Questions.Option) => {
        return (
            <>
                <div style={{ margin: '1em 0em 0.3em 0.1em', fontSize: '.9em' }}>option {!option.isAnswer || <span>(Answer)</span>}</div>
                <Editor style={{ marginBottom: '0.5em' }} readOnly value={option.text} showHeader={false}></Editor>
                <div></div>
                <div style={{ margin: '1em 0em 0.3em 0.1em', fontSize: '.9em' }}>explanation</div>
                <Editor readOnly value={option.explanation} showHeader={false}></Editor>
            </>
        );
    };
    const optionItemActionTemplate = (option: Questions.Option) => {
        return (
            <Button
                className="pi pi-trash"
                style={{ color: 'red' }}
                rounded
                text
                onClick={(e) => {
                    handleOnDeleteOption(option.no);
                }}
            ></Button>
        );
    };
    const optionItemisAnswer = (option: Questions.Option) => {
        return { 'bg-primary': option.isAnswer };
    };

    const optionItemAnswerSwitch = (option: Questions.Option) => {
        return <InputSwitch checked={option.isAnswer} onChange={(e: InputSwitchChangeEvent) => handleOnSelectAnswer(option.no, e.value)} />;
    };

    const OptionsHeader = (
        <div className="grid">
            <div className="col-10"></div>
            <div className="col-2">
                <Button icon="pi pi-plus" rounded label="Add" size="small" onClick={() => setShowOptionDialog(true)} />
            </div>
        </div>
    );

    const handleOnDeleteOption = (input_no: number) => {
        addedOptions.splice(input_no - 1, 1);
        const reOrderedOptions = addedOptions.map((option, index) => {
            return {
                no: index + 1,
                text: option.text,
                isAnswer: option.isAnswer,
                explanation: option.explanation
            };
        });
        setAddedOptions(reOrderedOptions);
    };
    const handleOnSelectAnswer = (selectedNo: number, checked: boolean) => {
        var refreshAnswer = addedOptions;
        refreshAnswer[selectedNo - 1].isAnswer = checked;
        if (checked) {
            refreshAnswer = addedOptions.map((option) => {
                return {
                    no: option.no,
                    text: option.text,
                    isAnswer: option.no === selectedNo,
                    explanation: option.explanation
                };
            });
        }
        setAddedOptions(refreshAnswer);
    };
    const handleOnClickAdd = () => {
        //add options
        console.log(answer);
        if (!answer) return;

        const options: Questions.Option[] = addedOptions.map((option, index) => {
            return {
                no: index + 1,
                text: option.text,
                isAnswer: option.isAnswer,
                explanation: option.explanation
            };
        });
        options.push({
            no: options.length + 1,
            text: answer,
            isAnswer: isAnswer,
            explanation: explanation
        });

        setAddedOptions(options);
        setAnswer('');
        setExplanation('');
        setIsAnswer(false);
        setShowOptionDialog(false);
    };
    const retrieveSelectedTopicSkillsIds = () => {
        let selectedTopics: number[] = [];
        let selectedSkills: number[] = [];
        if (selectedTopicNodes) {
            Object.entries(selectedTopicNodes).forEach(([key, data]) => {
                console.log('key', key, 'data', data);
                let topic_skill = key.split('-');
                if (topic_skill.length > 1) {
                    selectedSkills.push(parseInt(topic_skill[1]));
                } else {
                    selectedTopics.push(parseInt(topic_skill[0]));
                }
            });
        }
        return { selectedTopics: selectedTopics, selectedSkills: selectedSkills };
    }
    const handleOnClickDone = () => {
        console.log('handleOnClickDone');
        console.log(selectedTopicNodes);
        //validate
        const answer = addedOptions.filter((option: Questions.Option) => {
            return option.isAnswer;
        });
        if (!answer || answer.length <= 0) throw 'No answer selected';
        console.log(answer);
        //populate skills for mcq
        const { selectedTopics, selectedSkills } = retrieveSelectedTopicSkillsIds();
        
        //instantiate MCQ object before adding
        let mcq = {
            stem: stem,
            options: addedOptions,
            topics: selectedTopics,
            skills: selectedSkills
            // isAnswer: answer[0].no,
            // status: "Draft",
        };
        console.log('mcq to be created ', mcq);
        QuestionsService.addMCQ(mcq).then((data) => {
            console.log('saveQuestion response: ', data);
            router.push('/questions/searchlist');
        });
        // .catch((e)=>{
        //     console.log("saveQuestion error: ", e);
        //     e.
        // })
    };
    const handleOnGenerateQuestion = () => {
        //TODO: call generate question API
        console.log("Invoking handleOnGenerateQuestion");
        var updateQuestion = (data: Genai.MCQ) => {
            setStem(data.stem);
            setAddedOptions(data.options);
        }
        setStem('');
        setAddedOptions([]);
        setAnswer('');
        setExplanation('');
        setIsAnswer(false);
        
        //console.debug("selectedTopicNodes", selectedTopicNodes);
        if(!selectedTopicNodes){
            console.log("selectedTopicNodes undefined");
            showWarning("Invalid Input", "Generate Question works only for 1 topic with 1 or more skills selected");
            return;
        }
        const { selectedTopics, selectedSkills } = retrieveSelectedTopicSkillsIds();
        if(selectedTopics.length !=1){
            showWarning("Invalid Input", "Generate Question works only for 1 topic with 1 or more skills selected");
            return;
        }
        //search in listOfTopics
        const searchedTopic: Questions.Topic| undefined = listOfTopics.find((t: Questions.Topic) => {
            return t.id == selectedTopics[0];
        })
        console.debug("searchedTopic", searchedTopic)
        if(searchedTopic){
            let selectedTopic: Questions.Topic={
                id: searchedTopic.id,
                name: searchedTopic.name,
                status: '',
                skills: searchedTopic.skills.filter((s: Questions.Skill) => {
                    return selectedSkills.includes(s.id || -1);
                }),
                edited: false
            }
            console.debug("selectedTopic", selectedTopic)
            setActiveTab(3)
            GenaiService.generateMCQByTopicStream(1, selectedTopic, updateQuestion);
        }
    }
    return (
        <>
            <Toast ref={toast} position="top-center" />
            <h5>Add Question</h5>
            <br />
            <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
                <TabPanel header="General Information">
                    <div className="grid">
                        <div className="col-12 md:col-6 mb-5">
                            <TreeSelect
                                value={selectedTopicNodes}
                                onChange={(e) => setSelectedTopicNodes(e.value)}
                                options={topicNodes}
                                className="md:w-50rem w-full"
                                metaKeySelection={false}
                                selectionMode="checkbox"
                                display="chip"
                                placeholder="Select Topics / Skills"
                                showClear
                            ></TreeSelect>
                        </div>
                        <div className="col-12 md:col-6 mb-5">
                            <Button onClick={() => handleOnGenerateQuestion()}>Generate Question [Gemini]</Button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }} className="col-12">
                            <Button
                                label="Next"
                                onClick={() => {
                                    setActiveTab(1);
                                }}
                            ></Button>
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
                    {/* <div className="col-12">
                        <Button label="Next" onClick={()=> {setActiveTab(2)}}></Button>
                    </div> */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }} className="col-12">
                        <Button
                            label="Next"
                            onClick={() => {
                                setActiveTab(2);
                            }}
                        ></Button>
                    </div>
                </TabPanel>
                <TabPanel header="Options">
                    <Dialog
                        visible={showOptionDialog}
                        style={{ width: '80vw' }}
                        modal={false}
                        position="bottom"
                        onHide={() => {
                            if (!showOptionDialog) return;
                            setShowOptionDialog(false);
                        }}
                    >
                        <div className="grid">
                            <div className="col-10">Add an option for the question</div>

                            <div className="col-12">
                                <Editor value={answer} onTextChange={(e: EditorTextChangeEvent) => setAnswer(e.htmlValue || '')} style={{ height: '100px' }} />
                            </div>
                            <div className="col-10">Explain why this option is correct or wrong</div>
                            <div className="col-12">
                                <Editor value={explanation} onTextChange={(e: EditorTextChangeEvent) => setExplanation(e.htmlValue || '')} style={{ height: '100px' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }} className="col-12">
                                <Button label="Add" onClick={handleOnClickAdd} size="small" />
                            </div>
                            <div className="col-10"></div>
                        </div>
                    </Dialog>
                    <div className="grid">
                        <div className="col-12">
                            <DataTable rowClassName={optionItemisAnswer} value={addedOptions} header={OptionsHeader} emptyMessage="Add options for question">
                                <Column field="no" style={{ width: '5%' }}></Column>
                                <Column style={{ width: '90%' }} body={optionsItemTemplate}></Column>
                                <Column header="Answer" style={{ width: '10%' }} body={optionItemAnswerSwitch}></Column>
                                <Column style={{ width: '5%' }} body={optionItemActionTemplate}></Column>
                            </DataTable>
                        </div>
                        {/* <div className="col-12">
                            <Button label="Next" onClick={()=> {setActiveTab(3)}}></Button>
                         </div> */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }} className="col-12">
                            <Button
                                label="Next"
                                onClick={() => {
                                    setActiveTab(3);
                                }}
                            ></Button>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header="Review">
                    <div className="grid">
                        <div className="col-12">
                            <Editor readOnly value={stem} showHeader={false} style={{ height: '100px' }}></Editor>
                        </div>
                        <div className="col-12">
                            <DataTable rowClassName={optionItemisAnswer} value={addedOptions} emptyMessage="No options added">
                                <Column field="no" style={{ width: '5%' }}></Column>
                                <Column style={{ width: '90%' }} body={optionsItemTemplate}></Column>
                            </DataTable>
                        </div>
                        <div className="col-9 md:col-11">&nbsp;</div>
                        {/* <div className="col-1">
                        <Button label="Done" onClick={handleOnClickDone}></Button>
                    </div> */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }} className="col-12">
                            <Button label="Done" onClick={handleOnClickDone}></Button>
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </>
    );
};

export default EditQuestion;

