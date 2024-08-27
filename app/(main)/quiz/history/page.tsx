'use client';
import { Quiz } from '@/types';
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { QuizService } from '../../../../service/QuizService';

const QuizHistory: React.FC = () => {
    const [quiz, setQuiz] = useState<Quiz.CompletedResponse | null>(null);
    const [processedQuizzes, setProcessedQuizzes] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseData = await QuizService.getQuizCompleted();
                if (responseData.message === 'History not found') {
                    return;
                }
                setQuiz(responseData);

                // Process the data to calculate counts and extract unique topics and skills
                const processedData = responseData.quizzes.map(quiz => {
                    const topicsMap = new Map<number, string>();
                    const skillsMap = new Map<number, string>();

                    quiz.mcqs.forEach((mcq: Quiz.Mcq) => {
                        mcq.topics.forEach(topic => topicsMap.set(topic.id, topic.name));
                        mcq.skills.forEach(skill => skillsMap.set(skill.id, skill.name));
                    });

                    return {
                        id: quiz.id,
                        topicsCount: topicsMap.size,
                        skillsCount: skillsMap.size,
                        topics: Array.from(topicsMap.values()),
                        skills: Array.from(skillsMap.values()),
                        points: quiz.points,
                        mcqsCount: quiz.mcqs.length,
                    };
                });
                setProcessedQuizzes(processedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Custom body template for topicsCount
    const topicsBodyTemplate = (rowData: any) => {
        return `Topics: ${rowData.topicsCount} (${rowData.topics.join(', ')})`;
    };

    // Custom body template for skillsCount
    const skillsBodyTemplate = (rowData: any) => {
        return `Skills: ${rowData.skillsCount} (${rowData.skills.join(', ')})`;
    };

    // Custom body template for achievement
    const achievementBodyTemplate = (rowData: any) => {
        return `Scoring: ${rowData.points} / ${rowData.mcqsCount}`;
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Quizzes</h5>
                    <p>You currently have completed {quiz?.quizzes ? quiz.quizzes.length : 0} quizzes.</p>
                    <DataTable value={processedQuizzes} tableStyle={{ minWidth: '50rem' }} sortField="id" sortOrder={1} defaultSortOrder={1}>
                        <Column field="id" header="Quiz Number" sortable></Column>
                        <Column body={topicsBodyTemplate} header="Topic Count"></Column>
                        <Column body={skillsBodyTemplate} header="Skill Count"></Column>
                        <Column body={achievementBodyTemplate} header="Achievement"></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default QuizHistory;