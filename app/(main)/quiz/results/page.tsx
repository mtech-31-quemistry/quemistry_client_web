'use client';
import ResultsTopComponent from '@/layout/ResultsTopComponent';
import ResultsBottomComponent from '@/layout/ResultsBottomComponent';
import React, { useState } from 'react';

const ResultsPage: React.FC = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const handleQuestionClick = (index: number) => {
        setCurrentQuestionIndex(index);
    };

    return (
        <div>
            <ResultsTopComponent onQuestionClick={handleQuestionClick} currentQuestionIndex={currentQuestionIndex} />
            <ResultsBottomComponent currentQuestionIndex={currentQuestionIndex} />
        </div>
    );
};

export default ResultsPage;