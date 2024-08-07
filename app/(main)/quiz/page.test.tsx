import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import QuizPage from './page';
import { QuizService } from '../../../service/QuizService';

// Mock the QuizService
jest.mock('../../../service/QuizService', () => ({
  QuizService: {
    fetchData: jest.fn(),
    submitAttempt: jest.fn(),
  },
}));

const mockQuizData = {
  mcqs: [
    {
      id: 1,
      stem: 'Question 1',
      options: [
        { no: 1, text: 'Option 1', isAnswer: true, explanation: 'Explanation 1' },
        { no: 2, text: 'Option 2', isAnswer: false, explanation: 'Explanation 2' },
      ],
      topics: [{ id: 1, name: 'Topic 1' }],
      skills: [{ id: 1, name: 'Skill 1' }],
    },
    {
      id: 2,
      stem: 'Question 2',
      options: [
        { no: 1, text: 'Option 1', isAnswer: false, explanation: 'Explanation 1' },
        { no: 2, text: 'Option 2', isAnswer: true, explanation: 'Explanation 2' },
      ],
      topics: [{ id: 2, name: 'Topic 2' }],
      skills: [{ id: 2, name: 'Skill 2' }],
    },
  ],
};

describe('QuizPage', () => {
  beforeEach(() => {
    (QuizService.fetchData as jest.Mock).mockResolvedValue(mockQuizData);
    (QuizService.submitAttempt as jest.Mock).mockResolvedValue(undefined);
  });

  it('renders the loading state initially', () => {
    render(<QuizPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders the quiz questions after data is fetched', async () => {
    render(<QuizPage />);
    await waitFor(() => expect(QuizService.fetchData).toHaveBeenCalled());
    expect(screen.getByText('Question 1')).toBeInTheDocument();
  });

  it('allows selecting an option and showing the explanation', async () => {
    render(<QuizPage />);
    await waitFor(() => expect(QuizService.fetchData).toHaveBeenCalled());
    fireEvent.click(screen.getByLabelText('Option 1:'));
    expect(screen.getByText('Correct Answer')).toBeInTheDocument();
    expect(screen.getByText('Explanation 1')).toBeInTheDocument();
  });

  it('allows navigating to the next question', async () => {
    render(<QuizPage />);
    await waitFor(() => expect(QuizService.fetchData).toHaveBeenCalled());
    fireEvent.click(screen.getByLabelText('Option 1:'));
    fireEvent.click(screen.getByText('Next Question'));
    expect(screen.getByText('Question 2')).toBeInTheDocument();
  });

  it('allows submitting the quiz when on the last question', async () => {
    render(<QuizPage />);
    await waitFor(() => expect(QuizService.fetchData).toHaveBeenCalled());
    fireEvent.click(screen.getByLabelText('Option 1:'));
    fireEvent.click(screen.getByText('Next Question'));
    fireEvent.click(screen.getByLabelText('Option 2:'));
    fireEvent.click(screen.getByText('Submit Quiz'));
    await waitFor(() => expect(QuizService.submitAttempt).toHaveBeenCalledWith(2));
  });
});