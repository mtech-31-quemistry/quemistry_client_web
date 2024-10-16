import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '../../../../app/(main)/questions/searchlist/page';
import { useRouter } from 'next/navigation';
import { describe, it, vi, expect, Mock, beforeEach } from 'vitest';
import { QuestionsService } from '@/service/QuestionsService';
import { DataScroller } from 'primereact/datascroller';
import { TreeSelect } from 'primereact/treeselect';
import { Editor } from 'primereact/editor';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toolbar } from 'primereact/toolbar';
import userEvent from '@testing-library/user-event';

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
}));

vi.mock('@/service/QuestionsService', () => ({
    QuestionsService: {
        getTopics: vi.fn().mockResolvedValue([
            { id: 1, name: 'Topic 1', skills: [{ id: 1, name: 'Skill 1' }] },
            { id: 2, name: 'Topic 2', skills: [{ id: 2, name: 'Skill 2' }] }
        ]),
        retrieveMCQ: vi.fn().mockResolvedValue({
            mcqs: [{
                id: 1,
                stem: 'Test Question',
                topics: [{ id: 1, name: 'Topic 1' }],
                skills: [{ id: 1, name: 'Skill 1' }],
                status: 'Active',
                createdOn: '2023-01-01',
                createdBy: 'Test User'
            }],
            pageNumber: 1,
            pageSize: 5,
            totalPages: 1,
            totalRecords: 1,
            keywords: null
        }),
    },
}));

vi.mock('primereact/datascroller', () => ({
    DataScroller: vi.fn().mockImplementation(({ children }) => children)
}));

vi.mock('primereact/treeselect', () => ({
    TreeSelect: vi.fn().mockImplementation(() => null)
}));

vi.mock('primereact/editor', () => ({
    Editor: vi.fn().mockImplementation(() => null)
}));

describe('Questions Search List Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useRouter as Mock).mockReturnValue({ push: vi.fn() });
    });

    it('should load the page and display questions', async () => {
        await act(async () => {
            render(<Page />);
        });

        await waitFor(() => {
            expect(screen.getByText('Questions (1 records)')).toBeInTheDocument();
        });
    });

    it('should load topics and skills for TreeSelect', async () => {
        await act(async () => {
            render(<Page />);
        });

        await waitFor(() => {
            expect(TreeSelect).toHaveBeenCalled();
        });
    });
});
