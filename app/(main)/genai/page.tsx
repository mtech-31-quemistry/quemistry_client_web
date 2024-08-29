'use client';
import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

const GenAi: React.FC = () => {
    // Sample list of questions
    const questions = [
        {
            id: 1,
            topic: 'Chemistry',
            skill: 'Bonding',
            stem: 'Which of the following statements about covalent bonding is correct?',
            options: [
                { text: 'Covalent bonds are formed by the transfer of electrons from one atom to another.', isAnswer: false },
                { text: 'Covalent bonds are formed between metals and nonmetals.', isAnswer: false },
                { text: 'In a covalent bond, electrons are shared between atoms.', isAnswer: true },
                { text: 'Covalent bonds can only occur in molecules with symmetrical shapes.', isAnswer: false }
            ]
        },
        {
            id: 2,
            topic: 'Physics',
            skill: 'Mechanics',
            stem: 'What is the formula for kinetic energy?',
            options: [
                { text: 'E = mc^2', isAnswer: false },
                { text: 'KE = 0.5 * mv^2', isAnswer: true },
                { text: 'F = ma', isAnswer: false },
                { text: 'W = Fd', isAnswer: false }
            ]
        }
        // Add more questions as needed
    ];

    // State to hold the selected question
    const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

    // State to hold the generated question
    const [generatedQuestion, setGeneratedQuestion] = useState<any>(null);

    // Function to handle dropdown change
    const onQuestionChange = (e: { value: any }) => {
        setSelectedQuestion(e.value);
        localStorage.setItem('selectedQuestion', JSON.stringify(e.value));
    };

    // Function to handle "Generate AI" button click
    const generateQuestion = async () => {
        try {
            // Replace with your actual API endpoint
            const response = await fetch('https://api.example.com/generate-question');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const newQuestion = await response.json();
            setGeneratedQuestion(newQuestion);
        } catch (error) {
            console.error('Error generating question:', error);
        }
    };

    // Load the selected question from localStorage on component mount
    useEffect(() => {
        const savedQuestion = localStorage.getItem('selectedQuestion');
        if (savedQuestion) {
            setSelectedQuestion(JSON.parse(savedQuestion));
        }
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>GenAI</h5>
                    <Dropdown value={selectedQuestion} options={questions} onChange={onQuestionChange} optionLabel="stem" placeholder="Select a Question" filter />
                    {selectedQuestion && (
                        <div className="mt-3">
                            <h6>Selected Question:</h6>
                            <p>
                                <strong>ID:</strong> {selectedQuestion.id}
                            </p>
                            <p>
                                <strong>Topic:</strong> {selectedQuestion.topic}
                            </p>
                            <p>
                                <strong>Skill:</strong> {selectedQuestion.skill}
                            </p>
                            <p>
                                <strong>Stem:</strong> {selectedQuestion.stem}
                            </p>
                            <p>
                                <strong>Options:</strong>
                            </p>
                            <ul>
                                {selectedQuestion.options.map((option: any, index: number) => (
                                    <li key={index}>
                                        {option.text} {option.isAnswer && <span>(Answer)</span>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <Button label="Generate AI" onClick={generateQuestion} className="mt-3" />
                    {generatedQuestion && (
                        <div className="mt-3">
                            <h6>Generated Question:</h6>
                            <p>
                                <strong>ID:</strong> {generatedQuestion.id}
                            </p>
                            <p>
                                <strong>Topic:</strong> {generatedQuestion.topic}
                            </p>
                            <p>
                                <strong>Skill:</strong> {generatedQuestion.skill}
                            </p>
                            <p>
                                <strong>Stem:</strong> {generatedQuestion.stem}
                            </p>
                            <p>
                                <strong>Options:</strong>
                            </p>
                            <ul>
                                {generatedQuestion.options.map((option: any, index: number) => (
                                    <li key={index}>
                                        {option.text} {option.isAnswer && <span>(Answer)</span>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GenAi;
