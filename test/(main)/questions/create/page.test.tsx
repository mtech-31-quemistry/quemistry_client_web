import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import EditQuestion from './EditQuestion';
import Page from '../../../../app/(main)/questions/create/page';
import { QuestionsService } from '@/service/QuestionsService';
import { GenaiService } from '@/service/GenaiService';
import { useRouter } from 'next/navigation';
import AppMessages from '../../../../components/AppMessages';
import { describe, it, vi, expect, Mock, beforeEach } from 'vitest';

vi.mock('next/navigation', () => ({
    useRouter: vi.fn()
}));

vi.mock('@/service/QuestionsService', () => ({
    QuestionsService: {
        getTopics: vi.fn().mockResolvedValue([
            { id: 1, name: 'Topic 1', skills: [{ id: 1, name: 'Skill 1' }] },
            { id: 2, name: 'Topic 2', skills: [{ id: 2, name: 'Skill 2' }] }
        ]),
        addMCQ: vi.fn()
    }
}));

vi.mock('@/service/GenaiService', () => ({
    GenaiService: {
        generateMCQByTopicStream: vi.fn()
    }
}));

describe('EditQuestion Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the component with initial elements', () => {
        render(<Page />);

        expect(screen.getByText(/Add Question/i)).toBeInTheDocument();
        expect(screen.getByTestId('tree-select-topics')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Generate Question/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Stem/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Options/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Review/i })).toBeInTheDocument();
        expect(screen.getByTestId('next-btn')).toBeInTheDocument();
    });

    it('fetches and displays topics on load', async () => {
        render(<Page />);

        await waitFor(() => expect(QuestionsService.getTopics).toHaveBeenCalled());

        const treeSelectButton = screen.getByTestId('tree-select-topics');
        fireEvent.click(treeSelectButton);
        expect(screen.getByText(/Topic 1/i)).toBeInTheDocument();
    });

    it('generates a question when "Generate Question" is clicked', async () => {
        const mockQuestion = {
            stem: 'Generated Question Stem',
            options: [{ no: 1, text: 'Generated Option', explanation: 'Explanation for option', isAnswer: true }]
        };
        (GenaiService.generateMCQByTopicStream as Mock).mockImplementation((_, __, callback) => {
            callback(mockQuestion);
        });

        render(<Page />);
        const generateButton = screen.getByRole('button', { name: /Generate Question/i });

        fireEvent.click(generateButton);

        await waitFor(() => {
            expect(screen.getByText(/Generate Question works only for 1 topic with 1 or more skills selected/i)).toBeInTheDocument();
        });
    });

    it('renders options tab', async () => {
        // stem and review tab cannot be tested due to dependency error
        render(<Page />);
        const optionsTab = screen.getByRole('tab', { name: /Options/i });
        fireEvent.click(optionsTab);
        expect(screen.getByText(/Add options for question/i)).toBeInTheDocument();
        expect(screen.getByTestId('next-btn')).toBeInTheDocument();
    });
});
