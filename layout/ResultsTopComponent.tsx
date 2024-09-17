'use client';
import React, { useState, useEffect } from 'react';
import { Quiz } from '@/types';
import ResultsBottomComponent from './ResultsBottomComponent';
import { QuizService } from '@/service/QuizService';

interface ResultsTopComponentProps {
    onQuestionClick: (index: number) => void;
    currentQuestionIndex: number;
}

export default function ResultsTopComponent({ onQuestionClick, currentQuestionIndex }: ResultsTopComponentProps) {
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

    if (!quiz || !quiz.quizzes || quiz.quizzes.length === 0) {
        return <div>No quiz data available</div>;
    }

    const progress = quiz.quizzes[0].mcqs.map((mcq: Quiz.Mcq) => {
        const attemptOption = mcq.attemptOption ?? 0;
        const selectedOption = mcq.options[attemptOption - 1];
        return selectedOption && selectedOption.isAnswer;
    });

    return (
        <div className="card">
            <h5>Quiz Results</h5>
            <div className="progress-bar-container mb-6">
                {progress.map((correct: boolean, index: number) => (
                    <div key={index} className="progress-bar-segment">
                        <a onClick={() => onQuestionClick(index)}>
                            <div className={`progress-label ${index === currentQuestionIndex ? 'current' : ''}`}>
                                {index + 1}
                            </div>
                            <div className={`progress-bar ${index === currentQuestionIndex ? 'current' : correct ? 'correct' : 'incorrect'}`} />
                        </a>
                    </div>
                ))}
            </div>
            <ResultsBottomComponent currentQuestionIndex={currentQuestionIndex} />
        </div>
    );
}