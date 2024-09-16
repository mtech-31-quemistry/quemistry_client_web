import { Quiz } from '@/types';
import ApiHelper from '@/lib/ApiHelper';

export const QuizService = {
  startNewQuiz: (topics: number[], skills: number[]): Promise<Quiz.ApiResponse | false> => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('Fetching data from API...');
        const headers = ApiHelper.getRequestHeaders();
        const response = await fetch(`${process.env.NEXT_PUBLIC_QUEMISTRY_QUIZZES_URL}`, {
          method: 'POST',
          headers: headers,
          credentials: 'include',
          body: JSON.stringify({
            topics: topics,
            skills: skills,
            totalSize: 60,
            pageSize: 60,
          }),
        });

        if (response.status === 409) {
          console.log('Conflict: Quiz could not be started due to a conflict.');
          resolve(false);
          return;
        }

        const responseData: Quiz.ApiResponse = await response.json();
        console.log('Data fetched successfully:', responseData);
        resolve(responseData);
      } catch (error) {
        console.error('Error fetching data:', error);
        reject(error);
      }
    });
  },

  getQuizInProgress: async (): Promise<Quiz.ApiResponse> => {
    try {
      console.log('Fetching data from API...');
      const headers = ApiHelper.getRequestHeaders();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_QUEMISTRY_QUIZZES_URL}/me/in-progress?pageNumber=0&pageSize=60`,
        {
          headers: headers,
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

  getQuizCompleted: async (): Promise<Quiz.CompletedResponse> => {
    try {
      console.log('Fetching data from API...');
      const headers = ApiHelper.getRequestHeaders();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_QUEMISTRY_QUIZZES_URL}/me/completed?pageNumber=0&pageSize=60`,
        {
          headers: headers,
          credentials: "include"
        }
      );
      const responseData: Quiz.CompletedResponse = await response.json();
      console.log('Data fetched successfully:', responseData);
      return responseData;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },

  submitAttempt: async (quizId: number, mcqId: number, attempt: number): Promise<void> => {
    const headers = ApiHelper.getRequestHeaders();
    try {
     await fetch(
        `${process.env.NEXT_PUBLIC_QUEMISTRY_QUIZZES_URL}/${quizId}/mcqs/${mcqId}/attempt`,
        {
          method: 'PUT',
          headers: headers,
          credentials: "include",
          body: JSON.stringify({
            "attemptOption": attempt,
          }),
        }
      );
      console.log(`Attempt submitted for MCQ ID: ${mcqId} option: ${attempt}`);
    } catch (error) {
      console.error(`Error submitting attempt for MCQ ID: ${mcqId}`, error);
      throw error;
    }
  },

  abandonQuiz: async (quizId: number): Promise<void> => {
    const headers = ApiHelper.getRequestHeaders();
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_QUEMISTRY_QUIZZES_URL}/${quizId}/abandon`,
        {
          method: 'PATCH',
          headers: headers,
          credentials: "include",
        }
      );
      console.log(`Attempt abandoned for Quiz ID: ${quizId}`);
    } catch (error) {
      console.error(`Error abandoning quiz for Quiz ID: ${quizId}`, error);
      throw error;
    }
  }
};