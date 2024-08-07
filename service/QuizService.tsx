import { Quiz } from '@/types';

export const QuizService = {
  fetchData: async (): Promise<Quiz.ApiResponse> => {
    try {
      console.log('Fetching data from API...');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_QUEMISTRY_QUIZZES_URL}/2?pageNumber=0&pageSize=60`,
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
};