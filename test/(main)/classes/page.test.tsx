import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '../../../app/(main)/classes/page';
import { useRouter } from 'next/navigation';
import { UserService } from '../../../service/UserService';
import { describe, beforeEach, afterEach, it, vi, expect, Mock } from 'vitest';

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
}));

vi.mock('@/service/UserService', () => ({
    UserService: {
        getClasses: vi.fn().mockResolvedValue([]),
        getTutorProfile: vi.fn().mockResolvedValue(null),
        addClass: vi.fn().mockResolvedValue({ success: true }),
        updateClass: vi.fn().mockResolvedValue({ success: true }),
    },
}));

describe('Page', () => {
    beforeEach(() => {
        (useRouter as Mock).mockReturnValue({ push: vi.fn() });
        (UserService.getClasses as Mock).mockResolvedValue([]);
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
        const response = await fetch('http://localhost:3000/classes');
        await waitFor(() => expect(response.ok).toBe(true));
        expect(screen.getByText('Manage Classes')).toBeInTheDocument();
    });

    it('should render the "Manage Classes" heading', async () => {
        await act(async () => {
            render(<Page />);
        });
        expect(screen.getByText('Manage Classes')).toBeInTheDocument();
    });

    it('should call UserService.getClasses on mount', async () => {
        await act(async () => {
            render(<Page />);
        });
        expect(UserService.getClasses).toHaveBeenCalled();
    });
});
