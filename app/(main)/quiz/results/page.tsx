'use client';
import ResultsTopComponent from '@/layout/ResultsTopComponent';
import ResultsBottomComponent from '@/layout/ResultsBottomComponent';
import React, { useState } from 'react';

const ResultsPage: React.FC = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [reload, setReload] = useState(false);

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
                //onReload={handleReload}
            />
            <ResultsBottomComponent currentQuestionIndex={currentQuestionIndex} />
        </div>
    );
};

export default ResultsPage;
