import { Quiz } from '@/types';
import ApiHelper from '@/lib/ApiHelper';

export const QuizService = {
  startNewQuiz: (topics: number[], skills: number[], questionCount: number): Promise<Quiz.ApiResponse | false> => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('Fetching new Quiz from API...');
        const headers = ApiHelper.getRequestHeaders();
        const response = await fetch(`${process.env.NEXT_PUBLIC_QUEMISTRY_QUIZZES_URL}`, {
          method: 'POST',
          headers: headers,
          credentials: 'include',
          body: JSON.stringify({
            topics: topics,
            skills: skills,
            pageSize: 60,
            totalSize: questionCount
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

  getQuizInProgress: async (questionCount: number): Promise<Quiz.ApiResponse> => {
    try {
      console.log('Fetching In Progress Quiz from API...');
      const headers = ApiHelper.getRequestHeaders();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_QUEMISTRY_QUIZZES_URL}/me/in-progress?pageNumber=0&pageSize=${questionCount}`,
        {
          headers: headers,
          credentials: "include"
        }
      );
      const responseData: Quiz.ApiResponse = await response.json();
      console.log('Data fetched successfully:', responseData);
      return responseData;
    } catch (error) {
      console.error('No data could be displayed: ', error);
      throw error;
    }
  },

  getQuizCompleted: async (): Promise<Quiz.CompletedResponse> => {
    try {
      console.log('Fetching Completed Quizzes from API...');
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
      console.error('No data could be displayed: ', error);
      throw error;
    }
  },

  getQuizById: async (quizId: number): Promise<Response> => {
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

  fetchQuizById: async (quizId: number): Promise<Quiz.QuizTaken> => {
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

      const data: Quiz.QuizTaken = await response.json();
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