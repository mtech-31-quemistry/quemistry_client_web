'use client';
import { useEffect, useState } from 'react';
import { Quiz } from '@/types';
import { QuizService } from '../../../service/QuizService';
import { Button } from 'primereact/button';
import { QuestionsService } from '@/service/QuestionsService';
import { Questions } from '@/types';
import { TabView, TabPanel } from 'primereact/tabview';
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { TreeSelect, TreeSelectSelectionKeysType } from "primereact/treeselect";
import { useRouter } from 'next/navigation';
import React, { Fragment } from 'react';


const QuizPage: React.FC = () => {
  const router = useRouter();
  const [selectedTopicNodes, setSelectedTopicNodes] = useState<string | TreeSelectSelectionKeysType | TreeSelectSelectionKeysType[] | null>();
  const [topicNodes, setTopicNodes] = useState<any>(null);

  const [quiz, setQuiz] = useState<Quiz.ApiResponse | null>(null);
  const [isQuizOngoing, setIsQuizOngoing] = useState<boolean>(true);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: number | null }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isDisabled, setIsDisabled] = useState(false);


  const [addedOptions, setAddedOptions] = useState<Questions.Option[]>([]);
  const [stem, setStem] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [isAnswer, setIsAnswer] = useState<boolean>(false);
  const [listOfTopics, setListOfTopics] = useState<Questions.Topic[]>([]);
  const [showOptionDialog, setShowOptionDialog] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await QuizService.getQuizInProgress();
        if (responseData.message === "Quiz not found") {
          setIsQuizOngoing(false);return;
        }
        setQuiz(responseData);
          // Initialize selectedOptions with keys for each mcq.id set to null
        const initialSelectedOptions: { [key: number]: number | null } = {};
        responseData.mcqs.forEach((mcq) => {
          initialSelectedOptions[mcq.id] = null;
        });
        setSelectedOptions(initialSelectedOptions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

 
  const submitAttempt = async (mcqId: number) => {
    try {
      await QuizService.submitAttempt(mcqId);
    } catch (error) {
      console.error(`Error submitting attempt for MCQ ID: ${mcqId}`, error);
    }
  };
  
  const currentQuestion = quiz?.mcqs?.[currentQuestionIndex];
  const currentQuestionLength = quiz?.mcqs?.length ?? 0;
 
  const handleNextQuestion = () => {
    if (currentQuestionLength > 0) {
     if (currentQuestionIndex < currentQuestionLength - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }
};

const abandonQuiz = async () => {
  if (!quiz) {
    console.error('No quiz to abandon');
    return;
  }
  try {
    await QuizService.abandonQuiz(quiz.id);
    console.log(`Attempt abandoned for Quiz ID: ${quiz.id}`);
    // Optionally, you can update the state to reflect the abandoned status
    setQuiz((prevQuiz: any) => ({
      ...prevQuiz,
      status: 'abandoned', // Assuming 'status' is a field in your quiz object
    }));
    // Reset selected options
    const initialSelectedOptions: { [key: number]: number | null } = {};
    quiz.mcqs.forEach((mcq: any) => {
      initialSelectedOptions[mcq.id] = null;
    });
    setSelectedOptions(initialSelectedOptions);
  } catch (error) {
    console.error('Error abandoning quiz:', error);
  }
};
 
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

const confirmExit = () => {
  // Logic to handle exiting the quiz and saving progress
  console.log("Quiz exited. Progress saved.");
  setVisible(false);
  abandonQuiz();
  setIsQuizOngoing(false);
  window.location.reload();
};

const cancelExit = () => {
  setVisible(false);
};

const cancelFooter = (
  <div>
      <Button label='Cancel' icon='pi pi-times' onClick={cancelExit} className='p-button-text' />
      <Button label='Quit' icon='pi pi-save' onClick={confirmExit} autoFocus />
  </div>
);

const renderField = (labelTextName: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void) => (
  <div className='field grid'>
      <label htmlFor={labelTextName} className='col-12 mb-2 md:col-2 md:mb-0'>
          {labelTextName}
      </label>
      <div className='col-12 md:col-10'>
          <InputText placeholder={labelTextName} style={{ width: '30vw' }} value={value} onChange={onChange} />
      </div>
  </div>
);

const [visible, setVisible] = useState(false);

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h5>Quizzes</h5>
          <Fragment>
          <Button icon='pi pi-times'text  style={{ marginLeft: 'auto' }} onClick={() => setVisible(true)} visible={isQuizOngoing}/>
          </Fragment>
          <Dialog header='Exit Quiz' style={{ width: '20vw' }} visible={visible} onHide={() => { visible && cancelExit(); }} footer={cancelFooter}>
            Are you sure you want to exit the quiz?
          </Dialog>
        </div>
          {!quiz && (
            <div>
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
                            <TabPanel header="Options">
                                <div className="grid"> 
                                    <div className="col-12 md:col-6 mb-5">
                                      <p>Default question count will be two.<br/></p>
                                    </div>
                                    <div className="col-12 md:col-6 mb-5">
                                    </div> 
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }} className="col-12">
                                        <Button label="Next" onClick={()=> {setActiveTab(2)}}></Button>
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel header="Review">
                                <div className="grid"> 
                                    <div className="col-12 md:col-6 mb-5">
                                      <p>Default question count will be two.</p>
                                    </div>
                                    <div className="col-12 md:col-6 mb-5">
                                    </div> 
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }} className="col-12">
                                        <Button onClick={() => { 
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
                                      };
                                        setIsDisabled(true);QuizService.startNewQuiz(selectedTopics,selectedSkills);setTimeout(()=>{window.location.reload();},1500) } } 
                                disabled={isDisabled}>
                                {isDisabled ? 'Loading Quiz...' : 'Submit'}
                                </Button>
                                    </div>
                                </div>
                            </TabPanel>
                          </TabView>

            </div>
          )}
          {currentQuestion && (
            <div key={currentQuestion.id}>
              <div className="card">
                <span className="question-id">Question {currentQuestionIndex+1}: </span>
                <span dangerouslySetInnerHTML={{ __html: currentQuestion.stem }}></span>
              </div>
              <div className="card">
                {currentQuestion.options.map((option) => (
                  <div key={option.no} className="card">
                    <label className="option-label">
                      <input
                        type="radio"
                        name={`mcq-${currentQuestion.id}`}
                        checked={selectedOptions[currentQuestion.id] === option.no}
                        onChange={() =>
                          setSelectedOptions({
                            ...selectedOptions,
                            [currentQuestion.id]: option.no,
                          })
                        }
                      />
                      <span className="option-no">Option {option.no}: </span>
                      <span dangerouslySetInnerHTML={{ __html: option.text }}></span>
                    </label>
                    <div className={`explanation-container ${selectedOptions[currentQuestion.id] === option.no ? 'visible' : 'hidden'}`}>
                      {option.isAnswer && <strong>Correct Answer</strong>}
                      <p>{option.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
              {selectedOptions[currentQuestion.id] !== null && (
                <div className="flex flex-wrap gap-2">
                  {currentQuestionIndex < quiz.mcqs.length - 1 ? (
                    <Button label="Next Question" onClick={handleNextQuestion}></Button>
                  ) : (
                    <>
                      <div>
                        <p>No more questions in this quiz. Do you want to submit?</p>
                        <Button label="Submit Quiz" onClick={() => submitAttempt(currentQuestion.id)}></Button>
                      </div>
                    </>
                  )}
                </div>
              )}
              <h5>Topics</h5>
              <ul>
                {currentQuestion.topics.map((topic) => (
                  <li key={topic.id}>{topic.name}</li>
                ))}
              </ul>
              <h5>Skills</h5>
              <ul>
                {currentQuestion.skills.map((skill) => (
                  <li key={skill.id}>{skill.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;