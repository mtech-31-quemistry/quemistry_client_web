/* eslint-disable @next/next/no-img-element */
'use client';
import React, { forwardRef } from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '../../../app/(main)/dashboard/page';
import { useRouter } from 'next/navigation';
import { describe, beforeEach, afterEach, it, vi, expect, Mock } from 'vitest';
import { StatisticService } from '@/service/StatisticService';
import { LayoutContext } from '../../../layout/context/layoutcontext';

// Mock the next/navigation module
vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
}));

// Mock the StatisticService
vi.mock('@/service/StatisticService', () => ({
    StatisticService: {
        getTopicSkillStatistics: vi.fn().mockResolvedValue({
            data: [
                { topicName: 'Topic 1', skillName: 'Skill 1', cntAttempt: 10, cntCorrectAnswer: 8 },
                { topicName: 'Topic 2', skillName: 'Skill 2', cntAttempt: 15, cntCorrectAnswer: 12 },
            ]
        }),
    },
}));

// Mock the Chart component
vi.mock('primereact/chart', () => ({
    Chart: vi.fn(() => null),
}));

// Mock the AppMessages component
vi.mock('@/components/AppMessages', () => ({
    __esModule: true,
    default: forwardRef((props, ref) => null),
}));

describe('Dashboard Page', () => {
    beforeEach(() => {
        (useRouter as Mock).mockReturnValue({ push: vi.fn() });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should load the dashboard and display the top 10 topics/skills for improvement', async () => {
        const mockLayoutContext = {
            layoutConfig: {
                colorScheme: 'light',
                ripple: false,
                inputStyle: 'outlined',
                menuMode: 'static',
                theme: 'lara-light-indigo',
                scale: 14
            },
            setLayoutConfig: vi.fn(),
            layoutState: {
                staticMenuDesktopInactive: false,
                overlayMenuActive: false,
                profileSidebarVisible: false,
                configSidebarVisible: false,
                staticMenuMobileActive: false,
                menuHoverActive: false,
            },
            setLayoutState: vi.fn(),
            onMenuToggle: vi.fn(),
            showProfileSidebar: vi.fn(),
        };

        await act(async () => {
            render(
                <LayoutContext.Provider value={mockLayoutContext}>
                    <Page />
                </LayoutContext.Provider>
            );
        });

        await waitFor(() => {
            expect(screen.getByText('Top 10 Topics/Skill for Improvement')).toBeInTheDocument();
        });

        // Add more specific assertions here if needed
        expect(screen.getByText('1. Topic 1 - Skill 1')).toBeInTheDocument();
        expect(screen.getByText('2. Topic 2 - Skill 2')).toBeInTheDocument();
    });
});
