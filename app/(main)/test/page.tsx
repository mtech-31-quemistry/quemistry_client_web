'use client';
import './test.css';
import React, { useEffect, useState, Fragment } from 'react';
import { ClassTest } from '@/types';
import { TestService } from '@/service/TestService';
import { Button } from 'primereact/button';
import { QuestionsService } from '@/service/QuestionsService';
import { Questions } from '@/types';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { TreeSelect, TreeSelectSelectionKeysType } from 'primereact/treeselect';
import { ProgressBar } from 'primereact/progressbar';

const TestPage: React.FC = () => {
    const [selectedTopicNodes, setSelectedTopicNodes] = useState<string | TreeSelectSelectionKeysType | TreeSelectSelectionKeysType[] | null>();
    const [topicNodes, setTopicNodes] = useState<any>(null);
    const [selectedTopics, setSelectedTopics] = useState<number[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
    const [test, setTest] = useState<ClassTest.ApiResponse | null>(null);
    const [isTestOngoing, setIsTestOngoing] = useState<boolean>(false);
    const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: number | 0 }>({});
    const [currentTestQuestionIndex, setCurrentTestQuestionIndex] = useState<number>(0);
    const [isDisabled, setIsDisabled] = useState(false);
    const [listOfTopics, setListOfTopics] = useState<Questions.Topic[]>([]);
    const [numberOfIncorrectOptions, setNumberOfIncorrectOptions] = useState(0);
    const [showTestScore, setShowTestScore] = useState(false);
    const [showTestScoreMessage, setShowTestScoreMessage] = useState('');
    const [isRadioDisabled, setIsRadioDisabled] = useState(false);
    const [testIdAvailable, setTestIdAvailable] = useState(false);

    // Retrieve currentTestQuestionIndex from local storage when the component mounts
    useEffect(() => {
        const savedTestIndex = localStorage.getItem('currentTestQuestionIndex');
        if (savedTestIndex) {
            setCurrentTestQuestionIndex(parseInt(savedTestIndex, 10));
        }
    }, []);

    useEffect(() => {
        const savedShowTestScore = localStorage.getItem('showTestScore');
        if (savedShowTestScore) {
            setShowTestScore(savedShowTestScore === 'true');
        }
    }, []);

    useEffect(() => {
        const savedShowTestScoreMessage = localStorage.getItem('showTestScoreMessage');
        if (savedShowTestScoreMessage) {
            setShowTestScoreMessage(savedShowTestScoreMessage as string);
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
        setIsRadioDisabled(true);
    };

    useEffect(() => {
        const fetchData = async () => {};

        fetchData();
    }, []);

    const currentTestQuestion = test?.mcqs?.[currentTestQuestionIndex];
    const currentQuestionLength = test?.mcqs?.length ?? 0;

    const submitAttempt = async (testId: number, mcqId: number, attempt: number | null | undefined) => {
        const attemptValue = attempt ?? 0;
        try {
            await TestService.submitAttempt(testId, mcqId, attemptValue);
        } catch (error) {
            console.error(`Error submitting attempt for MCQ`, error);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionLength > 0) {
            if (currentTestQuestionIndex < currentQuestionLength - 1) {
                setIsRadioDisabled(false);
                setCurrentTestQuestionIndex(currentTestQuestionIndex + 1);
            }
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
    const [explanationsVisible, setExplanationsVisible] = useState<{ [key: number]: boolean }>({});

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
                const mcqResponse = (await QuestionsService.retrieveMCQ(retrieveQuestionRequest)).mcqs;
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

    const displayScore = () => {
        setCurrentTestQuestionIndex(currentTestQuestionIndex + 1);
        setShowTestScore(true);
        localStorage.setItem('showTestScore', 'false');
        localStorage.setItem('currentTestQuestionIndex', '0');
        setShowTestScoreMessage(`You have completed the class test.`);
        localStorage.setItem('showTestScoreMessage', showTestScoreMessage);
    };

    // Save currentTestQuestionIndex to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('currentTestQuestionIndex', currentTestQuestionIndex.toString());
    }, [currentTestQuestionIndex]);

    useEffect(() => {
        localStorage.setItem('showTestScore', showTestScore.toString());
    }, [showTestScore]);

    useEffect(() => {
        localStorage.setItem('showTestScoreMessage', showTestScoreMessage.toString());
    }, [showTestScoreMessage]);

    useEffect(() => {
        if (!isTestOngoing) {
            setShowTestScore(false);
            localStorage.setItem('showTestScore', 'false');
            localStorage.setItem('currentTestQuestionIndex', '0');
        }
    }, [isTestOngoing]);

    const [isStartingNewTest, setIsStartingNewTest] = useState(false);

    const startNewTest = async () => {
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
        setIsStartingNewTest(true); // Set isStartingNewQuiz to true to disable the button
        try {
            await TestService.startNewTest(selectedTopics, selectedSkills);
        } catch (error) {
            console.error('Error starting new test:', error);
        } finally {
            setIsStartingNewTest(false); // Set isStartingNewQuiz to false once the call is complete
            window.location.reload();
        }
    };

    const handleOptionClickTest = (questionId: number, optionNo: number) => {
        setSelectedOptions((prevSelectedOptions) => ({
            ...prevSelectedOptions,
            [questionId]: optionNo
        }));
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <h5>Class Tests</h5>
                    </div>
                    {test && Array.isArray(test.mcqs) && test.mcqs.length === 0 && <div>No questions generated.</div>}
                    {!isTestOngoing && (
                        <div>
                            {/* <b>{selectedQuestionCount ? selectedQuestionCount : generatedQuestionCount} question(s) will be generated.</b> */}
                            <div>
                                <div className="col-12 md:col-6 mb-5">Your tutor hasn&apos;t created a test yet.</div>
                                <div className="col-12 md:col-6 mb-5"></div>
                            </div>
                        </div>
                    )}
                    {isTestOngoing && currentTestQuestion && (
                        <div key={currentTestQuestion.id}>
                            <div className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ minWidth: '200px' }}>
                                        <h6>
                                            Question {currentTestQuestionIndex + 1} of {test?.mcqs?.length || 0}
                                        </h6>
                                    </div>
                                    <b>
                                        <div className="card">{currentTestQuestion.skills.map((skill) => skill.name).join(', ')}</div>
                                    </b>
                                </div>
                                <div className="cardOption">
                                    <span dangerouslySetInnerHTML={{ __html: currentTestQuestion.stem }} />
                                </div>
                                {currentTestQuestion.options.map((option) => (
                                    <label key={option.no} className="option-label" htmlFor={`option-${option.no}`} style={{ display: 'block', cursor: 'pointer' }}>
                                        <div className="card">
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <input
                                                    type="radio"
                                                    id={`option-${option.no}`}
                                                    name={`mcq-${currentTestQuestion.id}`}
                                                    checked={selectedOptions[currentTestQuestion.id] === option.no}
                                                    onChange={() => handleOptionClickTest(currentTestQuestion.id, option.no)}
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
                                {currentTestQuestionIndex < test.mcqs.length - 1 ? (
                                    <Button
                                        label="Next Question"
                                        onClick={() => {
                                            if (test.id !== undefined && selectedOptions[currentTestQuestion.id] !== null) {
                                                submitAttempt(test.id, currentTestQuestion.id, selectedOptions[currentTestQuestion.id]);
                                                handleNextQuestion();
                                            } else {
                                                console.error('Test ID is undefined or selected option is null');
                                            }
                                        }}
                                        disabled={!testIdAvailable}
                                    ></Button>
                                ) : (
                                    <Button
                                        label="End Test"
                                        onClick={() => {
                                            if (test.id !== undefined && selectedOptions[currentTestQuestion.id] !== null) {
                                                submitAttempt(test.id, currentTestQuestion.id, selectedOptions[currentTestQuestion.id]);
                                                displayScore();
                                            } else {
                                                console.error('Test ID is undefined or selected option is null');
                                            }
                                        }}
                                    ></Button>
                                )}
                            </div>
                            <div style={{ marginBottom: '30px' }}>
                                <h6>
                                    <b>{currentTestQuestion.topics.map((topic) => topic.name).join(', ')}</b>
                                </h6>
                            </div>
                            <ProgressBar value={Math.round(((currentTestQuestionIndex + 1) / test.mcqs.length) * 100)} />
                        </div>
                    )}
                    {showTestScore && showTestScoreMessage && <div className="score-message">{showTestScoreMessage}</div>}
                </div>
            </div>
        </div>
    );
};

export default TestPage;
