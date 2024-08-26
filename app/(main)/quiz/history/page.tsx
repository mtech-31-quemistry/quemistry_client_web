'use client';
import { Quiz } from '@/types';
import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { QuizService } from '../../../../service/QuizService';

const QuizHistory: React.FC = () => {
    const [quiz, setQuiz] = useState<Quiz.CompletedResponse | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseData = await QuizService.getQuizCompleted();
                if (responseData.message === 'History not found') {
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
                    <p>You currently have completed {quiz?.quizzes ? quiz.quizzes.length : 0} quizzes.</p>
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
