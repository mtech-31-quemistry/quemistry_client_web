import { ClassTest } from '@/types';
import ApiHelper from '@/lib/ApiHelper';

export const TestService = {
  startNewTest: (topics: number[], skills: number[]): Promise<Quiz.ApiResponse | false> => {
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
        console.error('No data could be displayed: ', error);
        reject(error);
      }
    });
  },

  getTestById: async (quizId: number): Promise<Response> => {
    const headers = ApiHelper.getRequestHeaders();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_QUEMISTRY_QUIZZES_URL}/${quizId}?pageNumber=0&pageSize=60`,
        {
          method: 'GET',
          headers: headers,
          credentials: "include",
        }
      );
      console.log(`Get Quiz for Quiz ID: ${quizId}`);
      return response;
    } catch (error) {
      console.error(`Error getting quiz for MCQ ID: ${quizId}`, error);
      throw error;
    }
  },

  fetchQuizById: async (quizId: number): Promise<Quiz.ApiResponse> => {
    const headers = ApiHelper.getRequestHeaders();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_QUEMISTRY_QUIZZES_URL}/${quizId}?pageNumber=0&pageSize=60`,
        {
          method: 'GET',
          headers: headers,
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Quiz.ApiResponse = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching quiz for Quiz ID: ${quizId}`, error);
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