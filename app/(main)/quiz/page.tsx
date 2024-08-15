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
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { TreeSelect, TreeSelectSelectionKeysType } from "primereact/treeselect";
import { useRouter } from 'next/navigation';


const QuizPage: React.FC = () => {
  const router = useRouter();
  const [selectedTopicNodes, setSelectedTopicNodes] = useState<string | TreeSelectSelectionKeysType | TreeSelectSelectionKeysType[] | null>();
  const [topicNodes, setTopicNodes] = useState<any>(null);

  const [quiz, setQuiz] = useState<Quiz.ApiResponse | null>(null);
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
          setQuiz(false);return;
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
}
 
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

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <h5>Quizzes</h5>
          {!quiz && (
            <div>
                     <h5>Take Quiz</h5>
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
                                      <p>Default question count will be two.</p>
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
                                        let selectedTopics: number[] = [2]; 
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
                                        setIsDisabled(true);QuizService.startNewQuiz(selectedTopics);setTimeout(()=>{window.location.reload();},1500) } } 
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