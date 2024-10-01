'use client';
import ResultsTopComponent from '@/components/ResultsTop';
import ResultsBottomComponent from '@/components/ResultsBottom';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { QuizService } from '@/service/QuizService';

const ResultsPage: React.FC = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [reload, setReload] = useState(false);
    const [quiz, setQuiz] = useState<Quiz.QuizTaken | null>(null); // Add state for the quiz data

    const searchParams = useSearchParams();
    const quizIdParam = searchParams.get('quizId');

    // Retrieve the last visited quizId from local storage
    const [quizId, setQuizId] = useState<string | null>(quizIdParam || (typeof window !== 'undefined' ? localStorage.getItem('lastVisitedQuizId') : null) || null);

    useEffect(() => {
        // Store the current quizId in local storage
        if (quizId) {
            localStorage.setItem('lastVisitedQuizId', quizId);
        }

        // Fetch quiz data based on quizId
        const fetchQuiz = async () => {
            try {
                if (!quizId) {
                    throw new Error('Quiz ID is undefined');
                }
                const data = await QuizService.fetchQuizById(Number(quizId));;
                setQuiz(data);
            } catch (error) {
                console.error('Error fetching quiz:', error);
            }
        };

        if (quizId) {
            fetchQuiz();
        }
    }, [quizId, reload]);

    const handleQuestionClick = (index: number) => {
        setCurrentQuestionIndex(index);
    };

    const handleReload = () => {
        setReload((prevReload) => !prevReload);
    };

    return (
        <div>
            <ResultsTopComponent onQuestionClick={handleQuestionClick} currentQuestionIndex={currentQuestionIndex} quizId={quizId} onReload={handleReload} />
        </div>
    );
};

export default ResultsPage;
