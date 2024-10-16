import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '../../../app/(main)/quiz/practice/page';
import { useRouter } from 'next/navigation';
import { QuizService } from '../../../service/QuizService';
import { describe, beforeEach, afterEach, it, vi, expect, Mock } from 'vitest';

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
}));

vi.mock('@/service/QuizService', () => ({
    QuizService: {
        getQuizInProgress: vi.fn().mockResolvedValue({ message: 'Quiz not found' }),
        startNewQuiz: vi.fn().mockResolvedValue({ success: true }),
        abandonQuiz: vi.fn().mockResolvedValue({ success: true }),
        submitAttempt: vi.fn().mockResolvedValue({ success: true }),
    },
}));

vi.mock('@/service/QuestionsService', () => ({
    QuestionsService: {
        getTopics: vi.fn().mockResolvedValue([{ id: 1, name: 'Topic 1' }]),
    },
}));

describe('Page', () => {
    beforeEach(() => {
        (useRouter as Mock).mockReturnValue({ push: vi.fn() });
        (QuizService.getQuizInProgress as Mock).mockResolvedValue({ message: 'Quiz not found' });
    });
    afterEach(() => {
        vi.clearAllMocks();
    });
    it('should load the page from URL and pass if anything is rendered', async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ data: 'mocked response' }),
            })
        ) as Mock;
        await act(async () => {
            render(<Page />);
        });
        const response = await fetch('http://localhost:3000/test');
        await waitFor(() => expect(response.ok).toBe(true));
        expect(screen.getByText('Quizzes')).toBeInTheDocument();
    });
});
