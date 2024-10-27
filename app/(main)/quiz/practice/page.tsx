'use client';
import './quiz.css';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, Fragment, useRef } from 'react';
import { Quiz } from '@/types';
import { QuizService } from '../../../../service/QuizService';
import { Button } from 'primereact/button';
import { QuestionsService } from '@/service/QuestionsService';
import { Questions } from '@/types';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { TreeSelect, TreeSelectSelectionKeysType } from 'primereact/treeselect';
import { ProgressBar } from 'primereact/progressbar';
import { Dropdown } from 'primereact/dropdown';
import AppMessages, { AppMessage } from '@/components/AppMessages';

const QuizPage: React.FC = () => {
    const [selectedTopicNodes, setSelectedTopicNodes] = useState<string | TreeSelectSelectionKeysType | TreeSelectSelectionKeysType[] | null>();
    const [topicNodes, setTopicNodes] = useState<any>(null);
    const [selectedTopics, setSelectedTopics] = useState<number[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
    const [quiz, setQuiz] = useState<Quiz.ApiResponse | null>(null);
    const [isQuizOngoing, setIsQuizOngoing] = useState<boolean>(true);
    const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: number | 0 }>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [isDisabled, setIsDisabled] = useState(false);
    const [listOfTopics, setListOfTopics] = useState<Questions.Topic[]>([]);
    const [explanationsVisible, setExplanationsVisible] = useState<{ [key: number]: boolean }>({});
    const [showScore, setShowScore] = useState(false);
    const [showScoreMessage, setShowScoreMessage] = useState('');
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [isRadioDisabled, setIsRadioDisabled] = useState(false);
    const [quizIdAvailable, setQuizIdAvailable] = useState(false);
    const [isAbandoning, setIsAbandoning] = useState(false);
    const [questionCount, setQuestionCount] = useState<string>();
    const [selectedQuestionCount, setSelectedQuestionCount] = useState<number>(60);
    const [generatedQuestionCount, setGeneratedQuestionCount] = useState<number>(0);
    const router = useRouter();
    const appMsg = useRef<AppMessage>(null);

    useEffect(() => {
        const storedQuestionCount = localStorage.getItem('selectedQuestionCount');
        if (storedQuestionCount) {
            setSelectedQuestionCount(Number(storedQuestionCount));
        }
    }, []);

    const handleViewResults = () => {
        router.push('/quiz/history');
    };

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
        if (!currentQuestion) {
            console.error('Current question is undefined.');
            return;
        }
        if (currentQuestion.options) {
            setExplanationsVisible(
                currentQuestion.options.reduce((acc, option) => {
                    acc[option.no] = true;
                    return acc;
                }, {} as { [key: number]: boolean })
            );
        }
        setIsAnswerSubmitted(true);
        setIsRadioDisabled(true);
        submitAttempt(quiz.id, currentQuestion.id, selectedOptions[currentQuestion.id] ?? 0);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedQuestionCount = Number(localStorage.getItem('selectedQuestionCount'));
                const responseData = await QuizService.getQuizInProgress(storedQuestionCount);
                if (responseData.message === 'Quiz not found') {
                    setIsQuizOngoing(false);
                    return;
                }
                setQuiz(responseData);
                const initialSelectedOptions: { [key: number]: number | 0 } = {};
                responseData.mcqs.content.forEach((mcq) => {
                    initialSelectedOptions[mcq.id] = 0;
                });
                setSelectedOptions(initialSelectedOptions);
                setQuizIdAvailable(true);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        setTimeout(() => {
            if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('invitation_result') !== null) {
                const invitationResult = sessionStorage.getItem('invitation_result') === 'true' || false;
                sessionStorage.removeItem('invitation_result');
                invitationResponse(invitationResult);
            }
        }, 500);
    }, []);

    const invitationResponse = (isSucceeded: boolean) => {
        if (!isSucceeded) {
            appMsg.current?.showError('Error enrolling to the class. Please contact customer support for more info.');
        } else {
            appMsg.current?.showSuccess('We have successfully enrolled you into the class', true, 5);
        }
    };

    const currentQuestion = quiz?.mcqs?.content?.[currentQuestionIndex];
    const currentQuestionLength = quiz?.mcqs?.content?.length ?? 0;

    const submitAttempt = async (quizId: number, mcqId: number, attempt: number | null | undefined) => {
        const attemptValue = attempt ?? 0;
        try {
            await QuizService.submitAttempt(quizId, mcqId, attemptValue);
        } catch (error) {
            console.error(`Error submitting attempt for MCQ`, error);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionLength > 0) {
            if (currentQuestionIndex < (currentQuestionLength || 0) - 1) {
                setExplanationsVisible({});
                setIsAnswerSubmitted(false);
                setIsRadioDisabled(false);
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            }
        }
    };

    const abandonQuiz = async () => {
        if (!quiz) {
            console.error('No quiz to abandon');
            return;
        }
        setIsAbandoning(true);
        try {
            await QuizService.abandonQuiz(quiz.id);
            setQuiz((prevQuiz: any) => ({
                ...prevQuiz,
                status: 'abandoned'
            }));
            const initialSelectedOptions: { [key: number]: number | 0 } = {};
            quiz.mcqs.content.forEach((mcq: any) => {
                initialSelectedOptions[mcq.id] = 0;
            });
            setSelectedOptions(initialSelectedOptions);
            setShowScore(false);
            localStorage.setItem('showScore', 'false');
            localStorage.setItem('currentQuestionIndex', '0');
        } catch (error) {
            console.error('Error abandoning quiz:', error);
        } finally {
            setIsAbandoning(false);
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
            <Button label="Quit" icon="pi pi-save" onClick={confirmExit} autoFocus disabled={isAbandoning} />
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

    const calculateScore = () => {
        if (!quiz) return;

        let score = 0;
        quiz.mcqs.content.forEach((mcq) => {
            const selectedOption = selectedOptions[mcq.id];
            if (mcq.options) {
                const correctOption = mcq.options.find((option) => option.isAnswer)?.no;

                if (selectedOption === correctOption) {
                    score++;
                }
            }
        });

        return score;
    };

    const displayScore = () => {
        const score = calculateScore();
        const totalQuestions = quiz?.mcqs?.content?.length || 0;
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setShowScore(true);
        localStorage.setItem('currentQuestionIndex', '0');
        setShowScoreMessage(`You answered ${score} of ${totalQuestions} questions correctly.`);
        localStorage.setItem('showScoreMessage', showScoreMessage);
    };

    useEffect(() => {
        localStorage.setItem('currentQuestionIndex', currentQuestionIndex.toString());
    }, [currentQuestionIndex]);

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
        setIsStartingNewQuiz(true);
        try {
            await QuizService.startNewQuiz(selectedTopics, selectedSkills, selectedQuestionCount);
        } catch (error) {
            console.error('Error starting new quiz:', error);
        } finally {
            setIsStartingNewQuiz(false);
            window.location.reload();
        }
    };

    const handleOptionClickQuiz = (questionId: number, optionNo: number) => {
        setSelectedOptions((prevSelectedOptions) => ({
            ...prevSelectedOptions,
            [questionId]: optionNo
        }));
    };

    useEffect(() => {
        localStorage.setItem('selectedQuestionCount', selectedQuestionCount.toString());
    }, [selectedQuestionCount]);

    const questionOptions = Array.from({ length: 60 }, (_, i) => ({
        label: `${i + 1} question${i + 1 > 1 ? 's' : ''}`,
        value: i + 1
    })).reverse();

    return (
        <div className="grid">
            <AppMessages ref={appMsg}></AppMessages>
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
                    {quiz && quiz.mcqs && Array.isArray(quiz.mcqs.content) && quiz.mcqs.content.length === 0 && <div>No questions generated.</div>}
                    {!isQuizOngoing && (
                        <div>
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
                                <div className="col-12 md:col-6 mb-5">
                                    <Dropdown
                                        value={selectedQuestionCount}
                                        options={questionOptions}
                                        onChange={(e) => {
                                            setSelectedQuestionCount(e.value);
                                        }}
                                        placeholder="Select number of questions"
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }} className="col-12">
                                <Button onClick={startNewQuiz} disabled={isDisabled || isStartingNewQuiz}>
                                    {isStartingNewQuiz ? 'Loading Quiz...' : 'Submit'}
                                </Button>
                            </div>
                        </div>
                    )}
                    {currentQuestion && (
                        <div key={currentQuestion.id}>
                            <div className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ minWidth: '200px' }}>
                                        <h6>
                                            Question {currentQuestionIndex + 1} of {quiz?.mcqs?.content?.length || 0}
                                        </h6>
                                    </div>
                                    <b>
                                        <div className="card">{currentQuestion.skills ? currentQuestion.skills.map((skill) => skill.name).join(', ') : ''}</div>
                                    </b>
                                </div>
                                <div className="cardOption">
                                    <span dangerouslySetInnerHTML={{ __html: currentQuestion.stem }} />
                                </div>
                                {currentQuestion.options &&
                                    currentQuestion.options.map((option) => (
                                        <label key={option.no} className="option-label" htmlFor={`option-${option.no}`} style={{ display: 'block', cursor: 'pointer' }}>
                                            <div className="card">
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <input
                                                        type="radio"
                                                        id={`option-${option.no}`}
                                                        name={`mcq-${currentQuestion.id}`}
                                                        checked={selectedOptions[currentQuestion.id] === option.no}
                                                        onChange={() => handleOptionClickQuiz(currentQuestion.id, option.no)}
                                                        disabled={isRadioDisabled}
                                                    />
                                                    <span dangerouslySetInnerHTML={{ __html: option.text }}></span>
                                                </div>
                                                {explanationsVisible[option.no] && (
                                                    <div>
                                                        {option.isAnswer ? (
                                                            <div className="explanation-container" style={{ color: 'green' }}>
                                                                <strong>Correct Answer</strong>
                                                            </div>
                                                        ) : (
                                                            <div className="explanation-container" style={{ color: 'red' }}>
                                                                <strong>Incorrect Answer</strong>
                                                            </div>
                                                        )}
                                                        <div className="explanation-container" dangerouslySetInnerHTML={{ __html: option.explanation }}></div>
                                                    </div>
                                                )}
                                            </div>
                                        </label>
                                    ))}
                                {isAnswerSubmitted ? (
                                    currentQuestionIndex < (quiz?.mcqs?.content?.length || 0) - 1 ? (
                                        <Button
                                            label="Next Question"
                                            onClick={() => {
                                                if (quiz.id !== undefined && selectedOptions[currentQuestion.id] !== null) {
                                                    handleNextQuestion();
                                                } else {
                                                    console.error('Quiz ID is undefined or selected option is null');
                                                }
                                            }}
                                            disabled={!isAnswerSubmitted || !quizIdAvailable}
                                        ></Button>
                                    ) : (
                                        <Button label="End Quiz" onClick={displayScore}></Button>
                                    )
                                ) : (
                                    <Button
                                        label="Submit"
                                        onClick={() => {
                                            handleSubmitAnswer();
                                        }}
                                        disabled={isAnswerSubmitted}
                                    ></Button>
                                )}
                            </div>
                            <div style={{ marginBottom: '30px' }}>
                                <h6>
                                    <b>{currentQuestion.topics ? currentQuestion.topics.map((topic) => topic.name).join(', ') : ''}</b>
                                </h6>
                            </div>
                            <ProgressBar value={Math.round(((currentQuestionIndex + 1) / (quiz?.mcqs?.content?.length || 1)) * 100)} />
                        </div>
                    )}
                    {showScore && showScoreMessage && (
                        <div>
                            <p>{showScoreMessage}</p>
                            <div>
                                <Button onClick={handleViewResults}>View History</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizPage;
