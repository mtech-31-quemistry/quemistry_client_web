'use client';
import './quiz.css';
import React, { useEffect, useState, Fragment } from 'react';
import { Quiz } from '@/types';
import { QuizService } from '../../../service/QuizService';
import { Button } from 'primereact/button';
import { QuestionsService } from '@/service/QuestionsService';
import { Questions } from '@/types';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { TreeSelect, TreeSelectSelectionKeysType } from 'primereact/treeselect';
import { ProgressBar } from 'primereact/progressbar';

const QuizPage: React.FC = () => {
    const [selectedTopicNodes, setSelectedTopicNodes] = useState<string | TreeSelectSelectionKeysType | TreeSelectSelectionKeysType[] | null>();
    const [topicNodes, setTopicNodes] = useState<any>(null);
    const [selectedTopics, setSelectedTopics] = useState<number[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
    const [quiz, setQuiz] = useState<Quiz.ApiResponse | null>(null);
    const [isQuizOngoing, setIsQuizOngoing] = useState<boolean>(true);
    const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: number | 0 }>({});
    const [currentTestQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [isDisabled, setIsDisabled] = useState(false);
    const [listOfTopics, setListOfTopics] = useState<Questions.Topic[]>([]);
    const [explanationsVisible, setExplanationsVisible] = useState<{ [key: number]: boolean }>({});
    const [showScore, setShowScore] = useState(false);
    const [showScoreMessage, setShowScoreMessage] = useState('');
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [isRadioDisabled, setIsRadioDisabled] = useState(false);
    const [quizIdAvailable, setQuizIdAvailable] = useState(false);
    const [isAbandoning, setIsAbandoning] = useState(false);

    // Retrieve currentQuestionIndex from local storage when the component mounts
    useEffect(() => {
        const savedIndex = localStorage.getItem('currentQuestionIndex');
        if (savedIndex) {
            setCurrentQuestionIndex(parseInt(savedIndex, 10));
        }
    }, []);

    useEffect(() => {
        const savedShowScore = localStorage.getItem('showScore');
        if (savedShowScore) {
            setShowScore(savedShowScore === 'true');
        }
    }, []);

    useEffect(() => {
        const savedShowScoreMessage = localStorage.getItem('showScoreMessage');
        if (savedShowScoreMessage) {
            setShowScoreMessage(savedShowScoreMessage);
        }
    }, []);

    const handleOptionClick = (mcqId: number, optionNo: number) => {
        if (isRadioDisabled) return;

        setSelectedOptions({
            ...selectedOptions,
            [mcqId]: optionNo
        });
    };

    const handleSubmitAnswer = () => {
        if (!currentTestQuestion) {
            console.error('Current question is undefined.');
            return;
        }
        setExplanationsVisible(currentTestQuestion.options.reduce((acc, option) => {
            acc[option.no] = true;
            return acc;
        }, {} as { [key: number]: boolean }));

        setIsAnswerSubmitted(true);
        setIsRadioDisabled(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseData = await QuizService.getQuizInProgress();
                if (responseData.message === 'Quiz not found') {
                    setIsQuizOngoing(false);
                    return;
                }
                setQuiz(responseData);
                const initialSelectedOptions: { [key: number]: number | 0 } = {};
                responseData.mcqs.forEach((mcq) => {
                    initialSelectedOptions[mcq.id] = 0;
                });
                setSelectedOptions(initialSelectedOptions);
                setQuizIdAvailable(true); // Set quizIdAvailable to true once quiz data is fetched
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const currentTestQuestion = quiz?.mcqs?.[currentTestQuestionIndex];
    const currentTestQuestionLength = quiz?.mcqs?.length ?? 0;

    const submitAttempt = async (quizId: number, mcqId: number, attempt: number) => {
        try {
            await QuizService.submitAttempt(quizId, mcqId, attempt);
        } catch (error) {
            console.error(`Error submitting attempt for MCQ`, error);
        }
    };

    const handleNextQuestion = () => {
        if (currentTestQuestionLength > 0) {
            if (currentTestQuestionIndex < currentTestQuestionLength - 1) {
                setExplanationsVisible({});
                setIsAnswerSubmitted(false);
                setIsRadioDisabled(false);
                setCurrentQuestionIndex(currentTestQuestionIndex + 1);
            }
        }
    };

    const abandonQuiz = async () => {
        if (!quiz) {
            console.error('No quiz to abandon');
            return;
        }
        setIsAbandoning(true); // Set isAbandoning to true to disable further actions
        try {
            await QuizService.abandonQuiz(quiz.id);
            setQuiz((prevQuiz: any) => ({
                ...prevQuiz,
                status: 'abandoned'
            }));
            const initialSelectedOptions: { [key: number]: number | 0 } = {};
            quiz.mcqs.forEach((mcq: any) => {
                initialSelectedOptions[mcq.id] = 0;
            });
            setSelectedOptions(initialSelectedOptions);
            setShowScore(false);
            localStorage.setItem('showScore', 'false');
            localStorage.setItem('currentQuestionIndex', '0');
        } catch (error) {
            console.error('Error abandoning quiz:', error);
        } finally {
            setIsAbandoning(false); // Set isAbandoning to false once the call is complete
            setIsQuizOngoing(false);
            window.location.reload();
        }
    };

    useEffect(() => {
        QuestionsService.getTopics().then((data) => {
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

    const confirmExit = () => {
        abandonQuiz();
    };

    const cancelExit = () => {
        setVisible(false);
    };

    const cancelFooter = (
        <div>
            <Button label="Cancel" icon="pi pi-times" onClick={cancelExit} className="p-button-text" />
            <Button
                label="Quit"
                icon="pi pi-save"
                onClick={confirmExit}
                autoFocus
                disabled={isAbandoning} // Disable the button while the quiz is being abandoned
            />
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

    const [visible, setVisible] = useState(false);

    const [selectedQuestionCount, setSelectedQuestionCount] = useState<number>(0);
    const [generatedQuestionCount, setGeneratedQuestionCount] = useState<number>(0);

    const getNodeName = (key: string) => {
        const findNode = (nodes: any[], key: string): string | null => {
            for (const node of nodes) {
                if (node.key == key) {
                    return node.data.name;
                }
                if (node.children) {
                    const result = findNode(node.children, key);
                    if (result) return result;
                }
            }
            return null;
        };

        return findNode(topicNodes, key);
    };

    const renderSelectedNodes = () => {
        if (!selectedTopicNodes) return '';

        return Object.entries(selectedTopicNodes)
            .map(([key, data]) => {
                const name = getNodeName(key);
                return `${name}\n`;
            })
            .join('');
    };

    useEffect(() => {
        let newSelectedTopics: number[] = [];
        let newSelectedSkills: number[] = [];

        if (selectedTopicNodes) {
            Object.entries(selectedTopicNodes).forEach(([key, data]) => {
                let topic_skill = key.split('-');
                if (topic_skill.length > 1) {
                    newSelectedSkills.push(parseInt(topic_skill[1]));
                } else {
                    newSelectedTopics.push(parseInt(topic_skill[0]));
                }
            });
        }

        setSelectedTopics(newSelectedTopics);
        setSelectedSkills(newSelectedSkills);
    }, [selectedTopicNodes]);

    useEffect(() => {
        const fetchData = async () => {
            const retrieveQuestionRequest = {
                topics: selectedTopics,
                skills: selectedSkills,
                pageNumber: 0,
                pageSize: 60
            };

            try {
                const mcqResponse = await QuestionsService.retrieveMCQ(retrieveQuestionRequest);
                if (mcqResponse && mcqResponse) {
console.log("a"+mcqResponse.map((mcq) => mcq.id))
                    const uniqueIds = new Set(mcqResponse.map((mcq) => mcq.id));
console.log("b"+uniqueIds.size)
                    const count = uniqueIds.size;
                    setGeneratedQuestionCount(count);
console.log("c"+uniqueIds.size)
                } else {
                    console.log("1"+generatedQuestionCount)
                    setGeneratedQuestionCount(0);
                }
            } catch (error) {
                console.error('Error retrieving MCQs:', error);
                console.log("2"+generatedQuestionCount)
                setGeneratedQuestionCount(0);
            }
        };

        fetchData();
    }, [selectedTopics, selectedSkills]);

    const calculateScore = () => {
        if (!quiz) return;

        let score = 0;
        quiz.mcqs.forEach((mcq) => {
            const selectedOption = selectedOptions[mcq.id];
            const correctOption = mcq.options.find((option) => option.isAnswer)?.no;

            if (selectedOption === correctOption) {
                score++;
            }
        });

        return score;
    };

    const displayScore = () => {
        const score = calculateScore();
        const totalQuestions = quiz?.mcqs.length || 0;
        setCurrentQuestionIndex(currentTestQuestionIndex + 1)
        setShowScore(true);
        localStorage.setItem('currentQuestionIndex', '0');
        setShowScoreMessage(`You answered ${score} of ${totalQuestions} questions correctly.`);
        localStorage.setItem('showScoreMessage', showScoreMessage);
    };

    // Save currentQuestionIndex to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('currentQuestionIndex', currentTestQuestionIndex.toString());
    }, [currentTestQuestionIndex]);

    useEffect(() => {
        localStorage.setItem('showScore', showScore.toString());
    }, [showScore]);

    useEffect(() => {
        localStorage.setItem('showScoreMessage', showScoreMessage.toString());
    }, [showScoreMessage]);

    useEffect(() => {
        if (!isQuizOngoing) {
            setShowScore(false);
            localStorage.setItem('showScore', 'false');
            localStorage.setItem('currentQuestionIndex', '0');
        }
    }, [isQuizOngoing]);

    const [isStartingNewQuiz, setIsStartingNewQuiz] = useState(false);

    const startNewQuiz = async () => {
        let selectedTopics: number[] = [];
        let selectedSkills: number[] = [];
        if (selectedTopicNodes) {
            Object.entries(selectedTopicNodes).forEach(([key, data]) => {
                let topic_skill = key.split('-');
                if (topic_skill.length > 1) {
                    selectedSkills.push(parseInt(topic_skill[1]));
                } else {
                    selectedTopics.push(parseInt(topic_skill[0]));
                }
            });
        }
        setIsStartingNewQuiz(true); // Set isStartingNewQuiz to true to disable the button
        try {
            await QuizService.startNewQuiz(selectedTopics, selectedSkills);
        } catch (error) {
            console.error('Error starting new quiz:', error);
        } finally {
            setIsStartingNewQuiz(false); // Set isStartingNewQuiz to false once the call is complete
            window.location.reload();
        }
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <h5>Quizzes</h5>
                        <Fragment>
                            <Button icon="pi pi-times" style={{ marginLeft: 'auto' }} onClick={() => setVisible(true)} visible={isQuizOngoing} />
                        </Fragment>
                        <Dialog
                            header="Exit Quiz"
                            style={{ width: '50vw' }}
                            visible={visible}
                            onHide={() => {
                                visible && cancelExit();
                            }}
                            footer={cancelFooter}
                        >
                            Are you sure you want to exit the quiz?
                        </Dialog>
                    </div>
                    {quiz && Array.isArray(quiz.mcqs) && quiz.mcqs.length === 0 && <div>No questions generated.</div>}
                    {!isQuizOngoing && (
                        <div>
                            <b>{selectedQuestionCount ? selectedQuestionCount : generatedQuestionCount} question(s) will be generated.</b>
                            <div>
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
                                <div className="col-12 md:col-6 mb-5"></div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }} className="col-12">
                                <Button
                                    onClick={startNewQuiz}
                                    disabled={isDisabled || isStartingNewQuiz}
                                >
                                    {isStartingNewQuiz ? 'Loading Quiz...' : 'Submit'}
                                </Button>
                            </div>
                        </div>
                    )}
                    {currentTestQuestion && (
                        <div key={currentTestQuestion.id}>
                            <div className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h6>Question {currentTestQuestionIndex + 1} of {quiz?.mcqs.length || 0}</h6>
                                    <b>{currentTestQuestion.skills.map((skill) => skill.name).join(', ')}</b>
                                </div>
                                <div className="cardOption">
                                    <span dangerouslySetInnerHTML={{ __html: currentTestQuestion.stem }} />
                                </div>
                                {currentTestQuestion.options.map((option) => (
                                    <div key={option.no} className="cardOption">
                                        <label className="option-label">
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <input
                                                    type="radio"
                                                    name={`mcq-${currentTestQuestion.id}`}
                                                    checked={selectedOptions[currentTestQuestion.id] === option.no}
                                                    onChange={() => handleOptionClick(currentTestQuestion.id, option.no)}
                                                    disabled={isRadioDisabled}
                                                />
                                                <span dangerouslySetInnerHTML={{ __html: option.text }}></span>
                                            </div>
                                        </label>
                                        {explanationsVisible[option.no] && (
                                            <div>
                                                {option.isAnswer ? (
                                                    <div className="explanation-container" style={{ color: 'green' }}>Correct Answer</div>
                                                ) : (
                                                    <div className="explanation-container" style={{ color: 'red' }}>Incorrect Answer</div>
                                                )}
                                                <div className="explanation-container">{option.explanation}</div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {isAnswerSubmitted ? (
                                    currentTestQuestionIndex < quiz.mcqs.length - 1 ? (
                                        <Button
                                            label="Next Question"
                                            onClick={() => {
                                                if (quiz.id !== undefined && selectedOptions[currentTestQuestion.id] !== null) {
                                                    handleNextQuestion();
                                                } else {
                                                    console.error('Quiz ID is undefined or selected option is null');
                                                }
                                            }}
                                            disabled={!isAnswerSubmitted || !quizIdAvailable}
                                        ></Button>
                                    ) : (
                                        <Button
                                            label="Submit Quiz"
                                            onClick={displayScore}
                                        ></Button>
                                    )
                                ) : (
                                    <Button
                                        label="Submit"
                                        onClick={() => {submitAttempt(quiz.id, currentTestQuestion.id, selectedOptions[currentTestQuestion.id]);
                                            handleSubmitAnswer()}}
                                        disabled={isAnswerSubmitted}
                                    ></Button>
                                )}
                            </div>
                            <h6><b>{currentTestQuestion.topics.map((topic) => topic.name).join(', ')}</b></h6>
                            <ProgressBar value={Math.round(((currentTestQuestionIndex + 1) / quiz.mcqs.length) * 100)} />
                        </div>
                    )}
                    {showScore && showScoreMessage && (
                        <div className="score-message">
                            {showScoreMessage}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );    
};

export default QuizPage;