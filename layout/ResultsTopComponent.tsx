'use client';
import React, { useState, useEffect } from 'react';
import { Quiz } from '@/types';
import ResultsBottomComponent from './ResultsBottomComponent';
import { QuizService } from '@/service/QuizService';
import { Button } from 'primereact/button';
import './results.css';

interface ResultsTopComponentProps {
    onQuestionClick: (index: number) => void;
    currentQuestionIndex: number;
}

export default function ResultsTopComponent({ onQuestionClick, currentQuestionIndex }: ResultsTopComponentProps) {
    const [quiz, setQuiz] = useState<Quiz.CompletedResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [reload, setReload] = useState<boolean>(false);

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
    }, [reload]); // Add reload as a dependency to re-fetch data when reload state changes

    const handleReload = () => {
        setReload((prevReload) => !prevReload);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!quiz || !quiz.quizzes || quiz.quizzes.length === 0) {
        return <div>No quiz data available</div>;
    }

    // Find the latest quiz by ID
    const latestQuiz = quiz.quizzes.reduce((latest, current) => (current.id > latest.id ? current : latest), quiz.quizzes[0]);

    // Update the progress calculation
    const progress = latestQuiz.mcq.map((mcq: Quiz.Mcq) => {
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
                            <div className={`progress-label ${index === currentQuestionIndex ? 'current' : ''}`}>{index + 1}</div>
                            <div className={`progress-bar ${index === currentQuestionIndex ? 'current' : correct ? 'correct' : 'incorrect'}`} />
                        </a>
                    </div>
                ))}
            </div>
            <Button onClick={handleReload}>Reload Page</Button>
            {/* <ResultsBottomComponent currentQuestionIndex={currentQuestionIndex} /> */}
        </div>
    );
}
