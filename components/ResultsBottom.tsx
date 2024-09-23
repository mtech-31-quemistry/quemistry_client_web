'use client';
import React from 'react';
import { Quiz } from '@/types';
import '../app/(main)/quiz/results/results.css';

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
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ minWidth: '200px' }}>
                    <h6>
                        Question {currentQuestionIndex + 1} of {quiz?.mcqs?.length || 0}
                    </h6>
                </div>
                <b>
                    <div className="card">{currentQuestion.skills.map((skill) => skill.name).join(', ')}</div>
                </b>
            </div>
            <div className="cardOption">
                <span dangerouslySetInnerHTML={{ __html: currentQuestion.stem }} />
            </div>
            <ul>
                {currentQuestion.options &&
                    currentQuestion.options.map((option: Quiz.Option, index: number) => {
                        const isAttempted = option.no === currentQuestion.attemptOption;
                        const isAttemptedAndIsAnswer = isAttempted && option.isAnswer; // Green
                        const isAttemptedAndIsNotAnswer = isAttempted && !option.isAnswer; // Red
                        const isAllUnattempted = currentQuestion.attemptOption === 0; // Gray
                        const isNotAttemptedAndIsAnswer = !isAttempted && option.isAnswer; // Green
                        const isNotAttemptedAndIsNotAnswer = !isAttempted && !option.isAnswer; // Gray

                        return (
                            <label key={option.no} className="option-label" htmlFor={`option-${option.no}`} style={{ display: 'block', cursor: 'pointer' }}>
                                <div className="card">
                                    <span dangerouslySetInnerHTML={{ __html: option.text }}></span>
                                    {isAttemptedAndIsAnswer && (
                                        <div className="explanation-container-review" style={{ color: 'Green' }}>
                                            <div className="explanation-container-review">
                                                <b>You chose the correct answer.</b>
                                            </div>
                                            <div className="explanation-container-review">{option.explanation}</div>
                                        </div>
                                    )}
                                    {isAttemptedAndIsNotAnswer && (
                                        <div className="explanation" style={{ color: 'Red' }}>
                                            <div className="explanation-container-review">
                                                <b>You chose the incorrect answer.</b>
                                            </div>
                                            <div className="explanation-container-review">{option.explanation}</div>
                                        </div>
                                    )}
                                    {/* {isAllUnattempted && (
                                        <div className="explanation" style={{ color: 'Gray' }}>
                                            <div className="explanation-container-review">
                                                <b>You skipped this question.</b>
                                                <div className="explanation-container-review">{option.explanation}</div>
                                            </div>
                                        </div>
                                    )
                                    } */}
                                    {isNotAttemptedAndIsAnswer && (
                                        <div className="explanation" style={{ color: 'Green' }}>
                                            <b>This was the correct answer.</b>
                                            <div className="explanation-container-review">{option.explanation}</div>
                                        </div>
                                    )}
                                    {isNotAttemptedAndIsNotAnswer && (
                                        <div className="explanation" style={{ color: 'Red' }}>
                                            <div className="explanation-container-review">{option.explanation}</div>
                                        </div>
                                    )}
                                </div>
                            </label >
                        );
                    })}
            </ul >
            <div style={{ marginTop: '40px' }}>
                <h6>
                    <b>{currentQuestion.topics.map((topic) => topic.name).join(', ')}</b>
                </h6>
            </div>
        </div >
    );
}
