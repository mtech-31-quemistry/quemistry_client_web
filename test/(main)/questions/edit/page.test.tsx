import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
// import EditQuestion from './EditQuestion';
import Page from '../../../../app/(main)/questions/edit/page';
import { QuestionsService } from '@/service/QuestionsService';
import { GenaiService } from '@/service/GenaiService';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import AppMessages from '../../../../components/AppMessages';
import { describe, it, vi, expect, Mock, beforeEach } from 'vitest';

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
    usePathname: vi.fn(),
    useSearchParams: vi.fn()
}));

vi.mock('@/service/QuestionsService', () => ({
    QuestionsService: {
        getTopics: vi.fn().mockResolvedValue([
            { id: 1, name: 'Topic 1', skills: [{ id: 1, name: 'Skill 1' }] },
            { id: 2, name: 'Topic 2', skills: [{ id: 2, name: 'Skill 2' }] }
        ]),
        addMCQ: vi.fn(),
        retrieveMCQByIds: vi.fn().mockResolvedValue([{
            id: 1,
            stem: 'Test Question',
            topics: [{ id: 1, 
                name: 'Topic 1',
                skills:  [{ id: 1, name: 'Skill 1' }]
            }],
            skills: [{ id: 1, name: 'Skill 1' }],
            status: 'DRAFT',
            createdOn: '2023-01-01',
            createdBy: 'Test User'
        }])
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

        expect(screen.getByText(/Edit Question/i)).toBeInTheDocument();
        console.log("ernestt")
        screen.debug();
        expect(screen.getByTestId('tree-select-topics')).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Stem/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Options/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Review/i })).toBeInTheDocument();
        expect(screen.getByTestId('next-btn')).toBeInTheDocument();
    });

    it('fetches and displays topics on load', async () => {
        render(<Page />);

        await waitFor(() => expect(QuestionsService.getTopics).toHaveBeenCalled());

        const treeSelectButton = screen.getByTestId('tree-select-topics');
        act(() => {
            fireEvent.click(treeSelectButton);
        });
        expect(screen.getByText(/Topic 1/i)).toBeInTheDocument();
    });

    it('renders options tab', async () => {
        // stem and review tab cannot be tested due to dependency error
        render(<Page />);
        const optionsTab = screen.getByRole('tab', { name: /Options/i });
        act(() => {
            fireEvent.click(optionsTab);
        });

        expect(screen.getByText(/Add options for question/i)).toBeInTheDocument();
        expect(screen.getByTestId('next-btn')).toBeInTheDocument();
    });
});
