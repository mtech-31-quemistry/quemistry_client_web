import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Page from '../../../../app/(main)/profile/edit/page';
import { useRouter } from 'next/navigation';
import { describe, beforeEach, afterEach, it, vi, expect, Mock } from 'vitest';
import { UserService } from '@/service/UserService';

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
}));

vi.mock('@/service/UserService', () => ({
    UserService: {
        getTutorProfile: vi.fn().mockResolvedValue({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            tuitionCentre: 'ABC Center',
            educationLevel: 'Masters',
        }),
        updateTutorProfile: vi.fn().mockResolvedValue({ success: true }),
    },
}));

describe('Edit Profile Page', () => {
    beforeEach(() => {
        (useRouter as Mock).mockReturnValue({ push: vi.fn() });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should load the edit profile page and render profile information', async () => {
        await act(async () => {
            render(<Page />);
        });

        await waitFor(() => {
            expect(screen.getByText('Profile')).toBeInTheDocument();
        });
    });

    it('should load initial profile data', async () => {
        await act(async () => {
            render(<Page />);
        });

        await waitFor(() => {
            expect(screen.getByDisplayValue('John')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
            expect(screen.getByDisplayValue('ABC Center')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Masters')).toBeInTheDocument();
        });

        expect(UserService.getTutorProfile).toHaveBeenCalledTimes(1);
    });

    it('should submit form with valid data', async () => {
        const user = userEvent.setup();
        await act(async () => {
            render(<Page />);
        });

        await waitFor(() => {
            expect(screen.getByDisplayValue('John')).toBeInTheDocument();
        });

        const firstNameInput = screen.getByPlaceholderText('First Name');
        await user.clear(firstNameInput);
        await user.type(firstNameInput, 'Jane');

        const saveButton = screen.getByRole('button', { name: /save/i });
        await user.click(saveButton);

        await waitFor(() => {
            expect(UserService.updateTutorProfile).toHaveBeenCalledWith(expect.objectContaining({
                firstName: 'Jane',
                lastName: 'Doe',
                tuitionCentre: 'ABC Center',
                educationLevel: 'Masters',
            }));
        });
    });

    it('should show validation errors for empty required fields', async () => {
        const user = userEvent.setup();
        await act(async () => {
            render(<Page />);
        });

        await waitFor(() => {
            expect(screen.getByDisplayValue('John')).toBeInTheDocument();
        });

        const firstNameInput = screen.getByPlaceholderText('First Name');
        await user.clear(firstNameInput);

        const saveButton = screen.getByRole('button', { name: /save/i });
        await user.click(saveButton);

        await waitFor(() => {
            expect(screen.getByText('First name is required')).toBeInTheDocument();
        });
    });

    it('should disable submit button when form is pristine', async () => {
        await act(async () => {
            render(<Page />);
        });

        await waitFor(() => {
            expect(screen.getByDisplayValue('John')).toBeInTheDocument();
        });

        const saveButton = screen.getByRole('button', { name: /save/i });
        expect(saveButton).toBeInTheDocument();
    });

    it('should show success message after successful submission', async () => {
        const user = userEvent.setup();
        await act(async () => {
            render(<Page />);
        });

        await waitFor(() => {
            expect(screen.getByDisplayValue('John')).toBeInTheDocument();
        });

        const firstNameInput = screen.getByPlaceholderText('First Name');
        await user.clear(firstNameInput);
        await user.type(firstNameInput, 'Jane');

        const saveButton = screen.getByRole('button', { name: /save/i });
        await user.click(saveButton);

        await waitFor(() => {
            expect(screen.getByText('Profile updated successfully')).toBeInTheDocument();
        });
    });
});
