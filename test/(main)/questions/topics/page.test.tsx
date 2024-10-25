import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '../../../../app/(main)/questions/topics/page';
import { useRouter } from 'next/navigation';
import { describe, it, vi, expect, Mock, beforeEach } from 'vitest';
import { QuestionsService } from '@/service/QuestionsService';

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
}));

vi.mock('@/service/QuestionsService', () => ({
    QuestionsService: {
        getTopics: vi.fn().mockResolvedValue([
            { id: 1, name: 'Topic 1' },
            { id: 2, name: 'Topic 2' }
        ]),
        addTopic: vi.fn().mockResolvedValue({ id: 3, name: 'New Topic' }),
        updateTopic: vi.fn().mockResolvedValue({ id: 1, name: 'Updated Topic' }),
        saveTopics: vi.fn().mockResolvedValue([
            { id: 1, name: 'Topic 1' },
            { id: 2, name: 'Topic 2' }
        ]),
    },
}));

describe('Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useRouter as Mock).mockReturnValue({ push: vi.fn() });
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

        const response = await fetch('http://localhost:3000/questions/topics');
        await waitFor(() => expect(response.ok).toBe(true));
        expect(screen.getByText('Manage Topics')).toBeInTheDocument();
    });

    it('should display the list of topics', async () => {
        await act(async () => {
            render(<Page />);
        });

        await waitFor(() => {
            expect(screen.getByText('Topic 1')).toBeInTheDocument();
            expect(screen.getByText('Topic 2')).toBeInTheDocument();
        });
    });
    
    it('adds a new topic', async () => {
        render(<Page />);

        // Wait for the topics to load
        await waitFor(() => {
            expect(screen.getByText('Manage Topics')).toBeInTheDocument();
        });

        // screen.debug();
        // Open the dialog to add a new topic
        fireEvent.click(screen.getByTestId("add-btn"));

        // Input new topic name
        fireEvent.change(screen.getByPlaceholderText('topic name'), { target: { value: 'New Topic' } });

        // Click save
        fireEvent.click(screen.getByTestId("save-btn"));

        // Check if the new topic was added to the topics list
        await waitFor(() => {
            expect(QuestionsService.saveTopics).toHaveBeenCalled();
            // screen.debug();
            expect(screen.getByText('Changes have been saved')).toBeInTheDocument();
        });
    });

    it('updates the status of a topic', async () => {
        render(<Page />);

        await waitFor(() => {
            expect(screen.getByText('Topic 1')).toBeInTheDocument();
            expect(screen.getByText('Topic 2')).toBeInTheDocument();
        });
        // Wait for the topics to load
        await waitFor(() => {
            expect(screen.getByText('Manage Topics')).toBeInTheDocument();
        });

        const selectButton = screen.getAllByTestId("active-btn")[0];
        fireEvent.click(selectButton);

        // Check if the status update is reflected in the UI
        await waitFor(() => {
            expect(selectButton).toHaveTextContent('ACTIVE');
        });
    });
});
