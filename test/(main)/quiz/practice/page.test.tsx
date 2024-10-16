import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom matchers
import Page from '../../../../app/(main)/quiz/practice/page';
import { useRouter } from 'next/navigation';
import { QuizService } from '../../../../service/QuizService';

// Mock the useRouter hook
vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
}));

// Mock the QuizService and QuestionsService
vi.mock('../../../../service/QuizService', () => ({
    QuizService: {
        getQuizInProgress: vi.fn().mockResolvedValue({ message: 'Quiz not found' }),
        startNewQuiz: vi.fn().mockResolvedValue({ success: true }),
        abandonQuiz: vi.fn().mockResolvedValue({ success: true }),
        submitAttempt: vi.fn().mockResolvedValue({ success: true }),
    },
}));

vi.mock('@/service/QuestionsService', () => ({
    QuestionsService: {
        getTopics: vi.fn().mockResolvedValue([{ id: 1, name: 'Topic 1' }]), // Mocked Promise
    },
}));

describe('Page', () => {
    beforeEach(() => {
        (useRouter as vi.Mock).mockReturnValue({ push: vi.fn() });
        (QuizService.getQuizInProgress as vi.Mock).mockResolvedValue({ message: 'Quiz not found' });
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
        ) as jest.Mock;

        // Wrap the rendering and state updates in act()
        await act(async () => {
            render(<Page />);
        });

        // Simulate loading the URL
        const response = await fetch('http://localhost:3000/quiz/practice');

        // Wait for the component to render after fetching the URL
        await waitFor(() => expect(response.ok).toBe(true));

        // Check if the page renders anything (e.g., a text element, heading, etc.)
        expect(screen.getByText('Quizzes')).toBeInTheDocument();
    });
});
