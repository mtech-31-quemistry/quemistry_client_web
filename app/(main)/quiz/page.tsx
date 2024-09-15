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
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isAnswered, setIsAnswered] = useState(false);
    const [listOfTopics, setListOfTopics] = useState<Questions.Topic[]>([]);
    const [explanationsVisible, setExplanationsVisible] = useState<{ [key: number]: boolean }>({});
    const [numberOfIncorrectOptions, setNumberOfIncorrectOptions] = useState(0);

    const handleOptionClick = (mcqId: number, optionNo: number) => {
        if (!currentQuestion) {
            console.error('Current question is undefined.');
            return;
        }

        setSelectedOptions({
            ...selectedOptions,
            [mcqId]: optionNo
        });

        const isCorrectAnswer = currentQuestion.options.find((option) => option.no === optionNo)?.isAnswer;
        const totalOptions = currentQuestion.options.length;

        if (!isCorrectAnswer) {
            const newNumberOfIncorrectOptions = numberOfIncorrectOptions + 1;
            setNumberOfIncorrectOptions(newNumberOfIncorrectOptions);

            if (newNumberOfIncorrectOptions === totalOptions - 1) {
                console.log('totalOptions', totalOptions);
                console.log('newNum of incorrect options', newNumberOfIncorrectOptions);
                setIsAnswered(true);
            }
        } else {
            setIsAnswered(true);
        }

        setExplanationsVisible({
            ...explanationsVisible,
            [optionNo]: true
        });
    };

    useEffect(() => {
        setIsAnswered(false);
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
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const currentQuestion = quiz?.mcqs?.[currentQuestionIndex];
    const currentQuestionLength = quiz?.mcqs?.length ?? 0;

    const submitAttempt = async (quizId: number, mcqId: number, attempt: number) => {
        try {
            await QuizService.submitAttempt(quizId, mcqId, attempt);
        } catch (error) {
            console.error(`Error submitting attempt for MCQ`, error);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionLength > 0) {
            if (currentQuestionIndex < currentQuestionLength - 1) {
                setExplanationsVisible({});
                setIsAnswered(false);
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
            setQuiz((prevQuiz: any) => ({
                ...prevQuiz,
                status: 'abandoned'
            }));
            const initialSelectedOptions: { [key: number]: number | 0 } = {};
            quiz.mcqs.forEach((mcq: any) => {
                initialSelectedOptions[mcq.id] = 0;
            });
            setSelectedOptions(initialSelectedOptions);
        } catch (error) {
            console.error('Error abandoning quiz:', error);
        }
    };

    useEffect(() => {
        QuestionsService.getTopics().then((data) => {
            console.log('topics initialized: ', data);
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
        console.log('Quiz exited. Progress saved.');
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
            <Button label="Cancel" icon="pi pi-times" onClick={cancelExit} className="p-button-text" />
            <Button label="Quit" icon="pi pi-save" onClick={confirmExit} autoFocus />
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
            console.log('selectedTopics', selectedTopics);
            console.log('selectedSkills', selectedSkills);

            const retrieveQuestionRequest = {
                topics: selectedTopics,
                skills: selectedSkills,
                pageNumber: 0,
                pageSize: 60
            };

            console.log('retrieveQuestionRequest', retrieveQuestionRequest);
            try {
                const mcqResponse = await QuestionsService.retrieveMCQ(retrieveQuestionRequest);
                console.log('mcqResponse', mcqResponse);

                console.log('count', mcqResponse);
                if (mcqResponse && mcqResponse) {
                    const uniqueIds = new Set(mcqResponse.map((mcq) => mcq.id));
                    const count = uniqueIds.size;
                    setGeneratedQuestionCount(count);
                } else {
                    setGeneratedQuestionCount(0);
                }
            } catch (error) {
                console.error('Error retrieving MCQs:', error);
                setGeneratedQuestionCount(0);
            }
        };

        fetchData();
    }, [selectedTopics, selectedSkills]);

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
                            <br />
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
                                <div className="col-12 md:col-6 mb-5"></div>
                            </div>
                                {selectedQuestionCount ? selectedQuestionCount : generatedQuestionCount} question(s) will be generated.
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }} className="col-12">
                                    <Button
                                        onClick={() => {
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
                                            setIsDisabled(true);
                                            QuizService.startNewQuiz(selectedTopics, selectedSkills);
                                            setTimeout(() => {
                                                window.location.reload();
                                            }, 1500);
                                        }}
                                        disabled={isDisabled}
                                    >
                                        {isDisabled ? 'Loading Quiz...' : 'Submit'}
                                    </Button>
                                </div>
                            </div>
                    )}
                    {currentQuestion && (
                        <div key={currentQuestion.id}>
                            <div className="card">
                                <p>
                                    <b>{currentQuestion.skills.map((skill) => skill.name).join(', ')}</b>
                                </p>
                                <p>
                                    <span dangerouslySetInnerHTML={{ __html: currentQuestion.stem }}></span>
                                </p>
                                {currentQuestion.options.map((option) => (
                                    <div key={option.no} className="card" onClick={() => handleOptionClick(currentQuestion.id, option.no)}>
                                        <label className="option-label">
                                            <input type="hidden" name={`mcq-${currentQuestion.id}`} checked={selectedOptions[currentQuestion.id] === option.no} onChange={() => handleOptionClick(currentQuestion.id, option.no)} />
                                            <span dangerouslySetInnerHTML={{ __html: option.text }}></span>
                                        </label>
                                        {explanationsVisible[option.no] && (
                                            <div className="explanation-container">
                                                {option.isAnswer && <strong>Correct Answer</strong>}
                                                <p>{option.explanation}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {selectedOptions[currentQuestion.id] !== null && (
                                <div className="flex flex-wrap gap-2">
                                    {currentQuestionIndex < quiz.mcqs.length - 1 ? (
                                        <Button
                                            label="Next Question"
                                            onClick={() => {
                                                if (quiz.id !== undefined && selectedOptions[currentQuestion.id] !== null) {
                                                    submitAttempt(quiz.id, currentQuestion.id, selectedOptions[currentQuestion.id]);
                                                    handleNextQuestion();
                                                } else {
                                                    console.error('Quiz ID is undefined or selected option is null');
                                                }
                                            }}
                                            disabled={!isAnswered}
                                        ></Button>
                                    ) : (
                                        <>
                                            <div>
                                                <p>No more questions in this quiz. Click to submit.</p>
                                                <Button
                                                    label="Submit Quiz"
                                                    onClick={() => {
                                                        if (quiz.id !== undefined && selectedOptions[currentQuestion.id] !== null) {
                                                            submitAttempt(quiz.id, currentQuestion.id, selectedOptions[currentQuestion.id]);
                                                            // setIsDisabled(true)
                                                        } else {
                                                            console.error('Quiz ID is undefined or selected option is null');
                                                        }
                                                    }}
                                                    disabled={!isAnswered}
                                                >
                                                    {/* {!isAnswered ? 'Quiz Submitted' : 'Submit Quiz' } */}
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                            <h5>Topic</h5>
                            <ul>{currentQuestion.topics.map((topic) => topic.name).join(', ')}</ul>
                            <ProgressBar value={Math.round(((currentQuestionIndex + 1) / quiz.mcqs.length) * 100)} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizPage;