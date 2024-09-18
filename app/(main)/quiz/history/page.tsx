'use client';
import { Quiz } from '@/types';
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { QuizService } from '../../../../service/QuizService';
import { Tag } from 'primereact/tag';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';

interface Topic {
    id: number;
    name: string;
}

interface Skill {
    id: number;
    name: string;
}

interface ProcessedQuiz {
    id: number;
    topicsCount: number;
    skillsCount: number;
    topics: Topic[];
    skills: Skill[];
    points: number;
    mcqsCount: number;
}

const topicsBodyTemplate = (rowData: ProcessedQuiz) => {
    return (
        <React.Fragment>
            {rowData.topics.map((topic) => (
                <Tag key={topic.id} style={{ marginRight: '1em' }} severity="info" value={topic.name} />
            ))}
        </React.Fragment>
    );
};

const skillsBodyTemplate = (rowData: ProcessedQuiz) => {
    return (
        <React.Fragment>
            {rowData.skills.map((skill) => (
                <Tag key={skill.id} style={{ marginRight: '1em' }} value={skill.name} />
            ))}
        </React.Fragment>
    );
};

const achievementBodyTemplate = (rowData: ProcessedQuiz) => {
    const totalPoints = rowData.mcqsCount;
    const earnedPoints = rowData.points;
    const percentage = (earnedPoints / totalPoints) * 100;

    let severity: 'success' | 'warning' | 'danger' = 'danger'; // Default to danger
    if (percentage >= 80) {
        severity = 'success';
    } else if (percentage >= 50) {
        severity = 'warning';
    }

    return <Tag severity={severity} value={`Points: ${earnedPoints}/${totalPoints} (${percentage.toFixed(2)}%)`} />;
};

const QuizHistory: React.FC = () => {
    const [quiz, setQuiz] = useState<Quiz.CompletedResponse | null>(null);
    const [processedQuizzes, setProcessedQuizzes] = useState<ProcessedQuiz[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseData = await QuizService.getQuizCompleted();
                if (responseData.message === 'Quiz not found') {
                    setError('Quiz not found');
                    setLoading(false);
                    return;
                }
                setQuiz(responseData);

                // Process the data to calculate counts and extract unique topics and skills
                const processedData = responseData.quizzes.map((quiz: Quiz.QuizTaken) => {
                    const topicsMap = new Map<number, Topic>();
                    const skillsMap = new Map<number, Skill>();

                    quiz.mcqs.forEach((mcq: Quiz.Mcq) => {
                        mcq.topics.forEach((topic) => topicsMap.set(topic.id, topic));
                        mcq.skills.forEach((skill) => skillsMap.set(skill.id, skill));
                    });

                    return {
                        id: quiz.id,
                        topicsCount: topicsMap.size,
                        skillsCount: skillsMap.size,
                        topics: Array.from(topicsMap.values()),
                        skills: Array.from(skillsMap.values()),
                        points: quiz.points,
                        mcqsCount: quiz.mcqs.length
                    };
                });
                setProcessedQuizzes(processedData);
            } catch (error) {
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleQuizClick = (id: number) => {
        router.push(`/quiz/results?quizId=${id}`);
    };

    const idBodyTemplate = (rowData: ProcessedQuiz) => {
        return <Button label={rowData.id.toString()} onClick={() => handleQuizClick(rowData.id)} />;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>History</h5>
                    <p>You currently have completed {quiz?.quizzes ? quiz.quizzes.length : 0} quizzes.</p>
                    <DataTable value={processedQuizzes} tableStyle={{ minWidth: '50rem' }} sortField="id" sortOrder={-1} defaultSortOrder={1}>
                        <Column body={idBodyTemplate} header="Quiz Number" sortable></Column>
                        <Column body={topicsBodyTemplate} header="Topics"></Column>
                        <Column body={skillsBodyTemplate} header="Skills"></Column>
                        <Column body={achievementBodyTemplate} header="Achievement"></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default QuizHistory;
