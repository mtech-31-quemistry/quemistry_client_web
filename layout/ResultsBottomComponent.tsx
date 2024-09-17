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

    if (!quiz || !quiz.quizzes || quiz.quizzes.length === 0 || currentQuestionIndex < 0 || currentQuestionIndex >= quiz.quizzes[0].mcqs.length) {
        return <div>This quiz does not have a question {currentQuestionIndex+1}.</div>;
    }

    const currentQuestion = quiz.quizzes[0].mcqs[currentQuestionIndex];

    if (!currentQuestion || !currentQuestion.stem || !currentQuestion.options) {
        return <div>Invalid question data</div>;
    }

    return (
        <div className="card">
            <h5>Question {currentQuestionIndex + 1}</h5>
            <p dangerouslySetInnerHTML={{ __html: currentQuestion.stem }}></p>
            <ul>
                {currentQuestion.options && currentQuestion.options.map((option: Quiz.Option, index: number) => (
                    <li key={index} className={option.isAnswer ? "correct" : "incorrect"} dangerouslySetInnerHTML={{ __html: option.text }}></li>
                ))}
            </ul>
        </div>
    );
}