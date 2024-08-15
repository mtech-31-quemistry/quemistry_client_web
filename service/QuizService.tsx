import { Quiz } from '@/types';

export const QuizService = {
  startNewQuiz: async (topics: number[], skills: number[]): Promise<Quiz.ApiResponse> => {
    try {
      console.log('Fetching data from API...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_QUEMISTRY_QUIZZES_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': '12asd',
        },
        credentials: 'include',
        body: JSON.stringify({
          topics: topics,
          skills: skills,
          totalSize: 60,
          pageSize: 60,
        }),
      });
      const responseData: Quiz.ApiResponse = await response.json();
      console.log('Data fetched successfully:', responseData);
      return responseData;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },

  getQuizInProgress: async (): Promise<Quiz.ApiResponse> => {
    try {
      console.log('Fetching data from API...');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_QUEMISTRY_QUIZZES_URL}/me/in-progress?pageNumber=0&pageSize=60`,
        {
          headers: {
            'x-user-id': '12asd',
          },
          credentials: "include"
        }
      );
      const responseData: Quiz.ApiResponse = await response.json();
      console.log('Data fetched successfully:', responseData);
      return responseData;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },

  submitAttempt: async (mcqId: number): Promise<void> => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_QUEMISTRY_QUIZZES_URL}/2/mcqs/${mcqId}/attempt`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': '12asd',
          },
          body: JSON.stringify({
            attempt: 1,
          }),
        }
      );
      console.log(`Attempt submitted for MCQ ID: ${mcqId}`);
    } catch (error) {
      console.error(`Error submitting attempt for MCQ ID: ${mcqId}`, error);
      throw error;
    }
  },

  abandonQuiz: async (quizId: number): Promise<void> => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_QUEMISTRY_QUIZZES_URL}/${quizId}/abandon`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': '12asd',
          }
        }
      );
      console.log(`Attempt abandoned for Quiz ID: ${quizId}`);
    } catch (error) {
      console.error(`Error abandoning quiz for Quiz ID: ${quizId}`, error);
      throw error;
    }
  }
};