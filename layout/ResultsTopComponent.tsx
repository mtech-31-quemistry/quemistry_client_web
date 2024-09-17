'use client';
import { useState } from 'react';

const quizData = {
    title: "Building Web Applications With React: Proficient Average",
    verifiedDate: "VERIFIED 5.15.2024",
    questions: [
        {
            id: 6,
            text: "In which call would you pass the rendering code to perform assertions on a component?",
            options: ["wrap()", "to()", "act()", "be()", "I don't know yet."],
            correctAnswer: "act()"
        },
    ],
    totalQuestions: 20,
    progress: [false, true, false, true, false, true, true, true, true, true, false, true, false, false, true, true, false, true, true, true]
}

export default function ResultsTopComponent() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState("")
    const currentQuestion = quizData.questions[currentQuestionIndex]
    const [questionDisplay, setQuestionDisplay] = useState(Number)

    return (
        <div className="card">
            <h5>Quiz Results</h5>
            <div className="progress-bar-container mb-6">
                {quizData.progress.map((correct, index) => (
                    <div key={index} className="progress-bar-segment">
                        <a onClick={() => setQuestionDisplay(index + 1)}>
                            <div className={`progress-label ${index === currentQuestionIndex ? 'current' : ''}`}>
                                {index + 1}
                            </div>
                            <div className={`progress-bar ${index === currentQuestionIndex ? 'current' : correct ? 'correct' : 'incorrect'}`} />
                        </a>
                    </div>
                ))}
            </div>
            {(questionDisplay > 0 ) &&
            <div className="card">
                <h5>Question {questionDisplay}</h5>
            </div>
            }
        </div>
    )
}