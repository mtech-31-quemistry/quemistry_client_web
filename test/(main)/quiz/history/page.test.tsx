import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '../../../../app/(main)/quiz/history/page';
import { useRouter } from 'next/navigation';
import { QuizService } from '../../../../service/QuizService';
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
        getQuizHistory: vi.fn().mockResolvedValue([]),
    },
}));

vi.mock('@/service/QuestionsService', () => ({
    QuestionsService: {
        getTopics: vi.fn().mockResolvedValue([{ id: 1, name: 'Topic 1' }]),
    },
}));

describe('Quiz History Page', () => {
    beforeEach(() => {
        (useRouter as Mock).mockReturnValue({ push: vi.fn() });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should display "No history to display" when history is empty', async () => {

        await act(async () => {
            render(<Page />);
        });

        await waitFor(() => {
            expect(screen.getByText('No history to display')).toBeInTheDocument();
        });
    });
});
