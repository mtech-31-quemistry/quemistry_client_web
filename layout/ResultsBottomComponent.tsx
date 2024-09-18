'use client';
import React from 'react';
import { Quiz } from '@/types';
import './results.css';

interface ResultsBottomComponentProps {
    currentQuestionIndex: number;
    quiz: Quiz.QuizTaken | null;
}

export default function ResultsBottomComponent({ currentQuestionIndex, quiz }: ResultsBottomComponentProps) {
    if (!quiz || !quiz.mcqs || quiz.mcqs.length === 0) {
        return <div>No questions available</div>;
    }

    const currentQuestion = quiz.mcqs[currentQuestionIndex];

    if (!currentQuestion || !currentQuestion.stem || !currentQuestion.options) {
        return <div>Invalid question data</div>;
    }

    return (
        <div className="card">
            <h5>Question {currentQuestionIndex + 1}</h5>
            <p dangerouslySetInnerHTML={{ __html: currentQuestion.stem }}></p>
            <ul>
                {currentQuestion.options &&
                    currentQuestion.options.map((option: Quiz.Option, index: number) => {
                        const isAttempted = option.no === currentQuestion.attemptOption;
                        const isAttemptedAndIsAnswer = isAttempted && option.isAnswer; // Black
                        const isAttemptedAndIsNotAnswer = isAttempted && !option.isAnswer; // Red
                        const isNotAttemptedAndIsAnswer = !isAttempted && option.isAnswer; // Green
                        const isAllUnattempted = currentQuestion.attemptOption === null; // All options

                        return (
                            <div key={option.no} className="cardOption">
                                <div className="card">
                                    <span dangerouslySetInnerHTML={{ __html: option.text }}></span>
                                    {isAttemptedAndIsAnswer && (
                                        <div className="explanation-container-review" style={{ color: 'Green' }}>
                                            <div className="explanation-container-review"><strong>You chose this. </strong></div>
                                            <div className="explanation-container-review">{option.explanation}</div>
                                        </div>
                                    )}
                                    {isAttemptedAndIsNotAnswer && (
                                        <div className="explanation" style={{ color: 'Red' }}>
                                            <div className="explanation-container-review"><strong>You chose this.</strong></div>
                                            <div className="explanation-container-review">{option.explanation}</div>
                                        </div>
                                    )}
                                    {isAllUnattempted && (
                                        <div className="explanation" style={{ color: 'Red' }}>
                                            <div className="explanation-container-review"><strong>You chose the incorrect answer.</strong></div>
                                        </div>
                                    )}
                                    {isNotAttemptedAndIsAnswer && (
                                        <div className="explanation" style={{ color: 'Green' }}>
                                            <div className="explanation-container-review"><strong>You skipped this.</strong></div>
                                            <div className="explanation-container-review">{option.explanation}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
            </ul>
        </div>
    );
}