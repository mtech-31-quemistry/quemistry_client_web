"use client";
import { useEffect, useState } from "react";
import { Questions } from '@/types';
import { QuestionsService } from '../../../../../service/QuestionsService';
import { TabView, TabPanel } from 'primereact/tabview';
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { TreeSelect, TreeSelectSelectionKeysType } from "primereact/treeselect";
import { useRouter } from 'next/navigation';
import { GetStaticPaths, GetStaticProps } from 'next';
// import { EditQuestionClient } from "./editClient";
import { usePathname, useSearchParams } from 'next/navigation'
import { useParams } from 'next/navigation'
import { NextPage } from 'next';


interface MyComponentProps {
    id: string;
}
  

const EditQuestion: NextPage<MyComponentProps> = ({ id }) => {
//     function generateStaticParams() {
//     const posts = await fetch('https://.../posts').then((res) => res.json())
   
//     return posts.map((post) => ({
//       slug: post.slug,
//     }))
//   }

    const params = useParams<{ tag: string; id: string }>()
    const router = useRouter();
    const pathname = usePathname()
    const searchParams = useSearchParams()
   
    useEffect(() => {
      const url = `${pathname}?${searchParams}`
      console.log(url)
    }, [pathname, searchParams])

    useEffect(() => {
        console.log("params ", params)
        console.log("id ", params.id)
        const retrieveQuestionRequest: Questions.RetrieveQuestionRequest = {
            "ids":[Number(params.id)]
        }
        QuestionsService.retrieveMCQByIds(retrieveQuestionRequest).then((data) => {
            console.log(data);
            var mcq = data[0];
            setStem(mcq.stem);
        }).catch(()=>{
        });
    }, [params]);

    const [selectedTopicNodes, setSelectedTopicNodes] = useState<string | TreeSelectSelectionKeysType | TreeSelectSelectionKeysType[] | null>();
    const [topicNodes, setTopicNodes] = useState<any>(null);

    const [addedOptions, setAddedOptions] = useState<Questions.Option[]>([]);
    const [stem, setStem] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [explanation, setExplanation] = useState<string>('');
    const [isAnswer, setIsAnswer] = useState<boolean>(false);
    const [listOfTopics, setListOfTopics] = useState<Questions.Topic[]>([]);
    const [showOptionDialog, setShowOptionDialog] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<number>(0);

    useEffect(()=>{
        QuestionsService.getTopics().then((data) => {
            console.log("topics initialized: ", data);
            setListOfTopics(data);
            
        });
    }, [])

    useEffect(()=>{
        var nodes = listOfTopics.map( topic => {
                let  childnode: any[] = [];
                if(topic.skills){
                    childnode = topic.skills.map( skill => {
                        return { "key": topic.id+"-"+skill.id,
                                "label": skill.name,
                                "data": { "id": skill.id,"name": skill.name , "type": "skill", "topicId": topic.id}
                                };
                        });
                }
                return { "key" : topic.id, "label": topic.name, "data" : { "id":topic.id, "name": topic.name, "type": "topic"}, children : childnode }
            });
            setTopicNodes(nodes);
    }, [listOfTopics])



    const optionsItemTemplate = (option: Questions.Option) => {
        return(
            <>
            <div style={{margin:'1em 0em 0.3em 0.1em', fontSize:'.9em'}}>option</div>
            <Editor style={{marginBottom:'0.5em'}} readOnly value={option.text} showHeader={false}>
            </Editor>
            <div></div>
            <div style={{margin:'1em 0em 0.3em 0.1em', fontSize:'.9em'}}>explanation</div>
            <Editor readOnly value={option.explanation} showHeader={false}>
            </Editor>
            </>
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
                isAnswer: option.isAnswer,
                explanation: option.explanation
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
                        isAnswer: option.no === selectedNo,
                        explanation: option.explanation
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
                isAnswer: option.isAnswer,
                explanation: option.explanation
            }
        })
        options.push({
            no: options.length +1,
            text: answer,
            isAnswer: isAnswer,
            explanation: explanation
        })

        setAddedOptions(options);
        setAnswer("");
        setExplanation("");
        setIsAnswer(false);
        setShowOptionDialog(false);
    };

    const handleOnClickDone =() => {
        console.log("handleOnClickDone");
        console.log(selectedTopicNodes);
        //validate
        const answer = addedOptions.filter((option: Questions.Option)=>{
            return option.isAnswer
        })
        if(!answer || answer.length <= 0 )
            throw "No answer selected"
        console.log(answer)
        //populate skills for mcq
        let selectedTopics: number[] = []; 
        let selectedSkills: number[] = [];     
        if(selectedTopicNodes){
            Object.entries(selectedTopicNodes).forEach(([key, data]) => {
                console.log("key", key, "data", data);
                let topic_skill = key.split("-");
                if(topic_skill.length>1){
                    selectedSkills.push(parseInt(topic_skill[1]));     
                } else {
                    selectedTopics.push(parseInt(topic_skill[0]));     
                }
            });
        }
        //instantiate MCQ object before adding 
        let mcq = {
            stem: stem,
            options: addedOptions,
            topics: selectedTopics,
            skills: selectedSkills,
        }
        console.log("mcq to be created ", mcq);
        QuestionsService.addMCQ(mcq).then((data) => {
            console.log("saveQuestion response: ", data);
            router.push('/questions/searchlist');
        })
        // .catch((e)=>{
        //     console.log("saveQuestion error: ", e);
        //     e.
        // })
        ;
    }
    return (
<>
        <h5>Add Question</h5>
        <br/>
        <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
            <TabPanel header="General Information">
                <div className="grid"> 
                    <div className="col-12 md:col-6 mb-5">
                        <TreeSelect value={selectedTopicNodes} onChange={(e)=> setSelectedTopicNodes(e.value)} options={topicNodes}
                            className="md:w-50rem w-full"  metaKeySelection={false} selectionMode="checkbox" display="chip" placeholder="Select Topics / Skills"
                            showClear></TreeSelect>
                    </div>
                    <div className="col-12 md:col-6 mb-5">
                    </div> 
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }} className="col-12">
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
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }} className="col-12">
                        <Button label="Next" onClick={()=> {setActiveTab(2)}}></Button>
                    </div>
            </TabPanel>
            <TabPanel header="Options">
                    <Dialog visible={showOptionDialog} style={{ width: '80vw' }} modal={false} position="bottom" onHide={() => {if (!showOptionDialog) return; setShowOptionDialog(false); }}>
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
                                <Button label="Add" onClick={handleOnClickAdd} size="small"/>
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
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }} className="col-12">
                            <Button label="Next" onClick={()=> {setActiveTab(3)}}></Button>
                        </div>
                   </div>
            </TabPanel>
            <TabPanel header="Review">
                <div className="grid">
                    <div className="col-12">
                        <Editor readOnly value={stem} showHeader={false} style={{ height: '320px' }}>
                        </Editor>
                    </div>
                    <div className="col-12">
                        <DataTable value={addedOptions} emptyMessage="No options added">
                            <Column field="no" style={{ width: '5%'}}></Column>
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
        )
}


export default EditQuestion;
