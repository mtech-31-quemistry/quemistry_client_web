'use client';
import React, { useState, useEffect } from 'react';
import { Quiz } from '@/types';
import ResultsBottomComponent from './ResultsBottom';
import { QuizService } from '@/service/QuizService';
import { Button } from 'primereact/button';
import '../app/(main)/quiz/results/results.css';
import { useRouter } from 'next/navigation';

interface ResultsTopComponentProps {
    onQuestionClick: (index: number) => void;
    currentQuestionIndex: number;
    quizId: string | null;
    onReload: () => void;
}

export default function ResultsTopComponent({ onQuestionClick, currentQuestionIndex, quizId, onReload }: ResultsTopComponentProps) {
    const [quiz, setQuiz] = useState<Quiz.CompletedResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!quizId) {
                    setError('Please select a Quiz from History');
                    setLoading(false);
                    return;
                }

                const responseData = await QuizService.getQuizCompleted();
                if (responseData.message === 'Quiz not found') {
                    setError('Quiz not found');
                    setLoading(false);
                    return;
                }
                setQuiz(responseData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('An unknown error has occured.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [quizId, onReload]); // Add quizId and onReload as dependencies to re-fetch data when they change

    if (loading) {
        return <div className="card">Loading...</div>;
    }

    if (error || !quizId) {
        return <div className="card">{error}</div>;
    }

    if (!quiz || !quiz.content || quiz.content.length === 0) {
        return <div className="card">No quiz data available</div>;
    }

    // Find the specific quiz by ID
    const specificQuiz = quiz.content.find((quiz: Quiz.QuizTaken) => quiz.id === parseInt(quizId, 10));

    if (!specificQuiz || !specificQuiz.mcqs || specificQuiz.mcqs.length === 0) {
        return <div className="card">No questions available for this quiz</div>;
    }

    // Update the progress calculation
    const progress = specificQuiz.mcqs.map((mcq: Quiz.SimpleQuizResponse) => {
        const attemptOption = mcq.attemptOption ?? 0;
        const selectedOption = mcq.options[attemptOption - 1];
        return selectedOption && selectedOption.isAnswer;
    });

    const handleBackToHistory = () => {
        router.push('/quiz/history');
    };

    return (
        <div className="card">
            <h5>Results for Quiz ID: {specificQuiz.id}</h5>
            <div className="progress-bar-container mb-3">
                {progress.map((correct: boolean, index: number) => (
                    <div key={index} className="progress-bar-segment">
                        <a onClick={() => onQuestionClick(index)}>
                            <div className={`progress-label ${index === currentQuestionIndex ? 'current' : ''}`}>{index + 1}</div>
                            <div className={`progress-bar ${index === currentQuestionIndex ? 'current' : correct ? 'correct' : 'incorrect'}`} />
                        </a>
                    </div>
                ))}
            </div>
            {/* <ResultsBottomComponent currentQuestionIndex={currentQuestionIndex} quiz={specificQuiz} />
            <div className="mb-3">
                <Button onClick={handleBackToHistory}>Quiz History</Button>
            </div> */}
        </div>
    );
}
