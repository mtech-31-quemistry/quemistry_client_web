'use client';
import React, { useState, useEffect } from 'react';
import { Quiz } from '@/types';
import { QuizService } from '@/service/QuizService';
import './results.css';

interface ResultsBottomComponentProps {
    currentQuestionIndex: number;
}

export default function ResultsBottomComponent({ currentQuestionIndex }: ResultsBottomComponentProps) {
    const [quiz, setQuiz] = useState<Quiz.CompletedResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseData = await QuizService.getQuizCompleted();
                if (responseData.message === 'History not found') {
                    setError('History not found');
                    setLoading(false);
                    return;
                }
                setQuiz(responseData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!quiz || !quiz.quizzes || currentQuestionIndex < 0) {
        return <div>This quiz does not have a question {currentQuestionIndex + 1}.</div>;
    }

    const lastQuizIndex = quiz.quizzes.length - 1;
    console.log(lastQuizIndex)
    const progress = quiz.quizzes[lastQuizIndex].mcqs.map((mcq: Quiz.Mcq) => {
        const attemptOption = mcq.attemptOption ?? 0;
        const selectedOption = mcq.options[attemptOption - 1];
        return selectedOption && selectedOption.isAnswer;
        console.log(lastQuizIndex)
    });

    const currentQuestion = quiz.quizzes[lastQuizIndex].mcqs[currentQuestionIndex];

    if (!currentQuestion || !currentQuestion.stem || !currentQuestion.options) {
        return <div>Invalid question data</div>;
    }

    return (
        <div className="card">
            <h5>Question {currentQuestionIndex + 1}</h5>
            <p dangerouslySetInnerHTML={{ __html: currentQuestion.stem }}></p>
            <ul>
                {currentQuestion.options && currentQuestion.options.map((option: Quiz.Option, index: number) => {
                    const isAttempted = (option.no === currentQuestion.attemptOption);
                    const isAttemptedAndIsAnswer = (option.no === currentQuestion.attemptOption && option.isAnswer);       //Black
                    const isAttemptedAndIsNotAnswer = (option.no === currentQuestion.attemptOption) && !option.isAnswer;   //Red
                    const isNotAttemptedAndIsAnswer = (option.no != currentQuestion.attemptOption) && option.isAnswer;    //Green
                    const isAllUnattempted = (null === currentQuestion.attemptOption);                                  //All options
                    // console.log(option.no)
                    // console.log(isAttempted + ' ' + isAttemptedAndIsAnswer + ' ' + isAttemptedAndIsNotAnswer + ' ' + isNotAttemptedAndIsAnswer + ' ' + isAllUnattempted)
                    return (
                        <div key={option.no} className="cardOption">
                            <div className="card">
                                <span dangerouslySetInnerHTML={{ __html: option.text }}></span>
                                {isAttemptedAndIsAnswer && (
                                    <div className="explanation-container" style={{ color: 'Green' }}><strong>You chose this. </strong>
                                    <div className="explanation-container">{option.explanation}</div></div>
                                )}
                                {!isAttemptedAndIsAnswer && isAttemptedAndIsNotAnswer && (
                                    <div className="explanation-container" style={{ color: 'Red' }}><strong>You chose this.</strong>
                                    <div className="explanation-container">{option.explanation}</div>
                                    </div>
                                )}
                                {!isAttemptedAndIsNotAnswer && !isAttemptedAndIsAnswer && isAllUnattempted && (
                                    <div className="explanation-container" style={{ color: 'Red' }}><strong>You chose the incorrect answer.</strong>
                                    </div>
                                )}
                                {!isAttemptedAndIsNotAnswer && !isAttemptedAndIsAnswer && !isAllUnattempted && !isAttemptedAndIsNotAnswer && isNotAttemptedAndIsAnswer && !currentQuestion.attemptOption && (
                                    <div className="explanation-container" style={{ color: 'Black' }}><strong>You skipped this.</strong>
                                    </div>
                                )}
                                {!isAttemptedAndIsNotAnswer && !isAttemptedAndIsAnswer && !isAllUnattempted && !isAttemptedAndIsNotAnswer && isNotAttemptedAndIsAnswer && (
                                    <div className="explanation-container" style={{ color: 'Green' }}>
                                    <div className="explanation-container">{option.explanation}</div></div>
                                )}
                                {isAttemptedAndIsNotAnswer || isAttemptedAndIsAnswer || isAllUnattempted || isAttemptedAndIsNotAnswer || isNotAttemptedAndIsAnswer || !(currentQuestion.attemptOption === 0) || (
                                    <div className="explanation-container" style={{ color: 'Red' }}>
                                    <div className="explanation-container">{option.explanation}</div></div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </ul>
        </div>
    );
}