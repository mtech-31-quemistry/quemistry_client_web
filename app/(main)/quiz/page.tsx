'use client';
import { useEffect, useState } from 'react';
import { Quiz } from '@/types';
import { QuizService } from '../../../service/QuizService';
import { Button } from 'primereact/button';

const QuizPage: React.FC = () => {
  const [data, setData] = useState<Quiz.ApiResponse | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: number | null }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await QuizService.fetchData();
        setData(responseData);

        // Initialize selectedOptions with keys for each mcq.id set to null
        const initialSelectedOptions: { [key: number]: number | null } = {};
        responseData.mcqs.forEach((mcq) => {
          initialSelectedOptions[mcq.id] = null;
        });
        setSelectedOptions(initialSelectedOptions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const submitAttempt = async (mcqId: number) => {
    try {
      await QuizService.submitAttempt(mcqId);
    } catch (error) {
      console.error(`Error submitting attempt for MCQ ID: ${mcqId}`, error);
    }
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  const currentQuestion = data.mcqs[currentQuestionIndex];

  const handleNextQuestion = () => {
    if (currentQuestionIndex < data.mcqs.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <h5>Quizzes</h5>
          <p>You currently have an ongoing quiz.</p>
          {!data && (
            <div className="flex flex-wrap gap-2">
              <Button label="Resume Quiz" onClick={() => window.location.reload()}></Button>
            </div>
          )}
          {currentQuestion && (
            <div key={currentQuestion.id}>
              <div className="card">
                <span className="question-id">Question {currentQuestion.id}: </span>
                <span dangerouslySetInnerHTML={{ __html: currentQuestion.stem }}></span>
              </div>
              <div className="card">
                {currentQuestion.options.map((option) => (
                  <div key={option.no} className="card">
                    <label className="option-label">
                      <input
                        type="radio"
                        name={`mcq-${currentQuestion.id}`}
                        checked={selectedOptions[currentQuestion.id] === option.no}
                        onChange={() =>
                          setSelectedOptions({
                            ...selectedOptions,
                            [currentQuestion.id]: option.no,
                          })
                        }
                      />
                      <span className="option-no">Option {option.no}: </span>
                      <span dangerouslySetInnerHTML={{ __html: option.text }}></span>
                    </label>
                    <div className={`explanation-container ${selectedOptions[currentQuestion.id] === option.no ? 'visible' : 'hidden'}`}>
                      {option.isAnswer && <strong>Correct Answer</strong>}
                      <p>{option.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
              {selectedOptions[currentQuestion.id] !== null && (
                <div className="flex flex-wrap gap-2">
                  {currentQuestionIndex < data.mcqs.length - 1 ? (
                    <Button label="Next Question" onClick={handleNextQuestion}></Button>
                  ) : (
                    <>
                      <div>
                        <p>No more questions in this quiz. Do you want to submit?</p>
                        <Button label="Submit Quiz" onClick={() => submitAttempt(currentQuestion.id)}></Button>
                      </div>
                    </>
                  )}
                </div>
              )}
              <h5>Topics</h5>
              <ul>
                {currentQuestion.topics.map((topic) => (
                  <li key={topic.id}>{topic.name}</li>
                ))}
              </ul>
              <h5>Skills</h5>
              <ul>
                {currentQuestion.skills.map((skill) => (
                  <li key={skill.id}>{skill.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;