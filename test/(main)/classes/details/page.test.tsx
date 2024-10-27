// ClassDetails.test.tsx
// setupTests.js
import 'primereact/resources/themes/saga-blue/theme.css'; // or any other theme
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import React from 'react';
import { render, screen, fireEvent, waitFor,act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '../../../../app/(main)/classes/details/page';
import CreateInvitationComponent from '@/app/(main)/classes/details/CreateInvitationComponent';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserService } from '@/service/UserService';
import { vi, beforeEach, describe, test, expect, it, Mock } from 'vitest'; // vitest imports
import ClassDetails from '../../../../app/(main)/classes/details/page';

// Mock the useRouter and useSearchParams from Next.js
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

// // Mock necessary components from PrimeReact
// vi.mock('primereact/panel', () => ({
//   Panel: ({ children }) => <div>{children}</div>,
// }));
// vi.mock('primereact/datatable', () => ({
//   DataTable: ({ children }) => <div>{children}</div>,
// }));
// vi.mock('primereact/column', () => ({
//   Column: () => <div />,
// }));
// vi.mock('primereact/button', () => ({
//   Button: ({ onClick, label }) => <button onClick={onClick}>{label}</button>,
// }));
// vi.mock('primereact/dialog', () => ({
//   Dialog: ({ visible, children }) => (visible ? <div>{children}</div> : null),
// }));
// vi.mock('primereact/confirmdialog', () => ({
//   ConfirmDialog: () => <div />,
//   confirmDialog: vi.fn(),
// }));

// Mocking services and components
const mockRouter = {
  push: vi.fn(),
};

vi.mock('@/service/UserService', () => ({
    UserService: {
        removeStudentsFromClass: vi.fn().mockResolvedValue({}),
        mockSendInvitation: vi.fn().mockResolvedValue({}),
        getClassById: vi.fn().mockResolvedValue({
            id: 1,
            description: 'Physics 101',
            tutors: [{ firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', educationLevel: 'PhD' }],
            classInvitations: [
              { userEmail: 'student1@example.com', status: 'Pending', firstName: 'Student', lastName: 'One' },
            ],
          })
    },
}));

beforeEach(() => {
  (useRouter as Mock).mockReturnValue(mockRouter);
  (useSearchParams as Mock).mockReturnValue({ get: vi.fn(() => '1') });
  mockRouter.push.mockReset();
});

describe('ClassDetails Component', () => {
  it('renders ClassDetails component and loads data', async () => {
    render(<Page />);
    await waitFor(() => expect(UserService.getClassById).toHaveBeenCalledWith('1'));
    expect(screen.getByText('Physics 101')).toBeInTheDocument();
    expect(screen.getByText('Tutors')).toBeInTheDocument();
    expect(screen.getByText('Students')).toBeInTheDocument();
    expect(screen.getByText('student1@example.com')).toBeInTheDocument();
  });

  it('navigates back to classes on "Back" button click', () => {
    render(<Page />);
    fireEvent.click(screen.getByText('Back'));
    expect(mockRouter.push).toHaveBeenCalledWith('/classes');
  });

  it('shows confirmation dialog when removing students', async () => {
    render(<Page />);
    await waitFor(() => expect(UserService.getClassById).toHaveBeenCalledWith('1'));
    const checkboxes = await screen.findAllByRole('checkbox');
    // Click the checkbox to check it
    fireEvent.click(checkboxes[1]);
    fireEvent.click(screen.getByText('Remove'));
    await waitFor(() => {
      expect(screen.getByText(/Are you sure you want to continue?/)).toBeInTheDocument();
    });
  });

  it('calls UserService.removeStudentsFromClass on remove confirmation', async () => {
    render(<Page />);
    await waitFor(() => expect(UserService.getClassById).toHaveBeenCalledWith('1'));
    const checkboxes = await screen.findAllByRole('checkbox');
    // Click the checkbox to check it
    fireEvent.click(checkboxes[1]);
    fireEvent.click(screen.getByText('Remove'));
    await waitFor(() => {
      expect(screen.getByText(/Are you sure you want to continue?/)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Remove'));
    fireEvent.click(screen.getByText('Yes')); // Simulate confirm dialog accept

    await waitFor(() => {
      expect(UserService.removeStudentsFromClass).toHaveBeenCalledWith(1, ['student1@example.com']);
    });
  });

  it('opens modal on click add student', async () => {

    render(<Page />);
    fireEvent.click(screen.getByText('Add'));
    const emailInput = screen.getByLabelText('Email');
    const nameInput = screen.getByLabelText('Full Name');
    const saveButton = screen.getByLabelText('Save');
    expect(emailInput).toBeInTheDocument();
    expect(nameInput).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
    fireEvent.change(emailInput, { target: { value: 'newstudent@example.com' } });
    fireEvent.change(nameInput, { target: { value: 'New Student' } });
    fireEvent.click(saveButton);
    // await waitFor(() => {
    //   expect(UserService.sendInvitation).toHaveBeenCalledWith({
    //     studentEmail: 'newstudent@example.com',
    //     studentFullName: 'New Student',
    //     classId: 1,
    //   });
    // });
  });
});
