// app/quiz/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import axios from 'axios';

interface Option {
  no: number;
  text: string;
  explanation: string;
  isAnswer: boolean;
}

interface Topic {
  id: number;
  name: string;
}

interface Skill {
  id: number;
  name: string;
  topicId: number | null;
}

interface Mcq {
  id: number;
  stem: string;
  options: Option[];
  topics: Topic[];
  skills: Skill[];
  status: string;
  publishedOn: number;
  publishedBy: string;
  closedOn: number | null;
  closedBy: string | null;
  createdOn: number;
  createdBy: string;
}

interface ApiResponse {
  id: number;
  mcqs: Mcq[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}

const QuizPage: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: number | null }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data from API...');
        const response = await axios.get<ApiResponse>(
          'http://localhost:80/v1/quizzes/2',
          {
            params: {
              pageNumber: 0,
              pageSize: 60,
            },
            headers: {
              'x-user-id': '12asd',
            },
          }
        );
        console.log('Data fetched successfully:', response.data);
        setData(response.data);

        // Initialize selectedOptions with keys for each mcq.id set to null
        const initialSelectedOptions: { [key: number]: number | null } = {};
        response.data.mcqs.forEach((mcq) => {
          initialSelectedOptions[mcq.id] = null;
        });
        setSelectedOptions(initialSelectedOptions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <h5>Quizzes</h5>
          <p>You currently have an ongoing quiz.</p>
          {data.mcqs.map((mcq) => (
            <div key={mcq.id}>
              <div className="card">
                <span className="question-id">Question {mcq.id}: </span>
                <span dangerouslySetInnerHTML={{ __html: mcq.stem }}></span>
              </div>
              <div className="card">
                {mcq.options.map((option) => (
                  <div key={option.no} className="card">
                    <label className="option-label">
                      <input
                        type="radio"
                        name={`mcq-${mcq.id}`}
                        checked={selectedOptions[mcq.id] === option.no}
                        onChange={() =>
                          setSelectedOptions({
                            ...selectedOptions,
                            [mcq.id]: option.no,
                          })
                        }
                      />
                      <span className="option-no">Option {option.no}: </span>
                      <span dangerouslySetInnerHTML={{ __html: option.text }}></span>
                    </label>
                    <div className={`explanation-container ${selectedOptions[mcq.id] === option.no ? 'visible' : 'hidden'}`}>
                      {option.isAnswer && <strong>Correct Answer</strong>}
                      <p>{option.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
              {selectedOptions[mcq.id] !== null && (
                <div className="flex flex-wrap gap-2">
                  <Button label="Next Question"></Button>
                </div>
              )}
              <h5>Topics</h5>
              <ul>
                {mcq.topics.map((topic) => (
                  <li key={topic.id}>{topic.name}</li>
                ))}
              </ul>
              <h5>Skills</h5>
              <ul>
                {mcq.skills.map((skill) => (
                  <li key={skill.id}>{skill.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;