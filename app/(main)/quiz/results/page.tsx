'use client';
import ResultsTopComponent from '@/layout/ResultsTopComponent';
import ResultsBottomComponent from '@/layout/ResultsBottomComponent';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const ResultsPage: React.FC = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [reload, setReload] = useState(false);
    const [quiz, setQuiz] = useState(null); // Add state for the quiz data

    const searchParams = useSearchParams();
    const quizId = searchParams.get('quizId');

    useEffect(() => {
        // Fetch quiz data based on quizId
        const fetchQuiz = async () => {
            // Replace this with your data fetching logic
            const response = await fetch(`/api/quizzes/${quizId}`);
            const data = await response.json();
            setQuiz(data);
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
            <ResultsTopComponent
                onQuestionClick={handleQuestionClick}
                currentQuestionIndex={currentQuestionIndex}
                quizId={quizId}
                onReload={handleReload}
            />
            {quiz && (
                <ResultsBottomComponent
                    currentQuestionIndex={currentQuestionIndex}
                    quiz={quiz} // Pass the quiz data here
                />
            )}
        </div>
    );
};

export default ResultsPage;
