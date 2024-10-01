/* eslint-disable @next/next/no-img-element */
'use client';
import { Chart } from 'primereact/chart';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { ChartData, ChartOptions } from 'chart.js';
import AppMessages, { AppMessage } from '@/components/AppMessages';
import { StatisticService } from '@/service/StatisticService';

const TOTAL_ATTEMPTS_BAR_COLOR = '#673AB7';
const CORRECT_ANSWER_BAR_COLOR = '#157be8';

const Dashboard = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');

    const [chartOptions, setChartOptions] = useState<ChartOptions>({});
    const [topicSkillStats, setTopicSkillStats] = useState<ChartData>();

    const { layoutConfig } = useContext(LayoutContext);
    const appMsg = useRef<AppMessage>(null);

    useEffect(() => {
        const chartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    stacked: false,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    stacked: false,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

        setChartOptions(chartOptions);
    }, []);

    useEffect(() => {
        StatisticService.getTopicSkillStatistics(0, 10).then((statsResponse) => {
            let topicSkillStat = statsResponse.data;
            let chartLabels: string[] = [];
            let totalAttempts: number[] = [];
            let correctAnswers: number[] = [];

            //labels
            //array of data set
            topicSkillStat.map((item) => {
                chartLabels.push(item.topicName + ' - ' + item.skillName);
                totalAttempts.push(item.cntAttempt);
                correctAnswers.push(item.cntCorrectAnswer);
            });
            let chartData: ChartData = {
                labels: chartLabels,
                datasets: [
                    {
                        label: 'Total Attempts',
                        data: totalAttempts,
                        fill: true,
                        backgroundColor: TOTAL_ATTEMPTS_BAR_COLOR,
                        borderColor: TOTAL_ATTEMPTS_BAR_COLOR,
                        tension: 0.4
                    },
                    {
                        label: 'Correct Answers',
                        data: correctAnswers,
                        fill: true,
                        backgroundColor: CORRECT_ANSWER_BAR_COLOR,
                        borderColor: CORRECT_ANSWER_BAR_COLOR,
                        tension: 0.4
                    }
                ]
            };
            setTopicSkillStats(chartData);
        });
    }, []);
    const invitationResponse = (isSucceeded: boolean) => {
        if (!isSucceeded) {
            appMsg.current?.showError('Error enrolling to the class. Please contact customer support for more info.');
        } else {
            appMsg.current?.showSuccess('We have successfully enrolled you into the class');
        }
    };

    useEffect(() => {
        setTimeout(() => {
            if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('invitation_result') !== null) {
                const invitationResult = sessionStorage.getItem('invitation_result') === 'true' || false;
                sessionStorage.removeItem('invitation_result');
                invitationResponse(invitationResult);
            }
        }, 500);
    }, [layoutConfig.colorScheme]);

    return (
        <div className="grid">
            <AppMessages ref={appMsg}></AppMessages>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Worst performed topics-skills</h5>
                    <Chart type="bar" data={topicSkillStats} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
