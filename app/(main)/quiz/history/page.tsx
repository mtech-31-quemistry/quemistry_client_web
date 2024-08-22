// app/quiz/history/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { QuizService } from '../../../../service/QuizService';

interface Option {
    no: number;
    text: string;
    explanation: string;
    isAnswer: boolean;
}

interface Topic {
    id: number;
    name: string;
}

interface Skill {
    id: number;
    name: string;
    topicId: number | null;
}

interface Mcq {
    id: number;
    stem: string;
    options: Option[];
    topics: Topic[];
    skills: Skill[];
    status: string;
    publishedOn: number;
    publishedBy: string;
    closedOn: number | null;
    closedBy: string | null;
    createdOn: number;
    createdBy: string;
    attemptOption: number | null;
    attemptOn: number | null;
}

interface Quiz {
    id: number;
    mcqs: Mcq[];
    status: string;
    points: number;
}

interface ApiResponse {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
    quizzes: Quiz[];
}

const QuizHistory: React.FC = () => {
    const [quiz, setQuiz] = useState<ApiResponse | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseData = await QuizService.getQuizCompleted();
                if (responseData.message === "History not found") {
                    return;
                }
                setQuiz(responseData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Quizzes</h5>
                    <p>You currently have an ongoing quiz.</p>
                    <DataTable value={quiz?.quizzes} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="id" header="Quiz Id"></Column>
                        <Column field="points" header="Points"></Column>
                        <Column field="status" header="Status"></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default QuizHistory;