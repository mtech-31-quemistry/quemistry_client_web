'use client';
import React, { useState } from "react";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { ListBox } from 'primereact/listbox';

interface Question {
  text: string;
  options: string[];
  explanation: string;
}

interface Skill {
  id: number;
  name: string;
}

interface Topic {
  id: number;
  name: string;
  skills: Skill[];
}

const QuestionGenerator: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);

  const topics: Topic[] = [
    {
      id: 1,
      name: "Mathematics",
      skills: [
        { id: 1, name: "Algebra" },
        { id: 2, name: "Geometry" },
        { id: 3, name: "Calculus" },
      ],
    },
    {
      id: 2,
      name: "Science",
      skills: [
        { id: 4, name: "Physics" },
        { id: 5, name: "Chemistry" },
        { id: 6, name: "Biology" },
      ],
    },
    {
      id: 3,
      name: "History",
      skills: [
        { id: 7, name: "Ancient History" },
        { id: 8, name: "Modern History" },
        { id: 9, name: "World Wars" },
      ],
    },
  ];

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setSelectedSkill(null);
    setGeneratedQuestions([]);
    setSelectedQuestions([]);
    setPreviewQuestion(null);
  };

  const handleSkillSelect = (skill: Skill) => {
    setSelectedSkill(skill);
    const questions: Question[] = [
      {
        text: `What is the main concept of ${skill.name} in ${selectedTopic?.name}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        explanation: `This is the explanation for the main concept of ${skill.name} in ${selectedTopic?.name}.`,
      },
      {
        text: `Who made significant contributions to ${skill.name} in ${selectedTopic?.name}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        explanation: `This is the explanation for who made significant contributions to ${skill.name} in ${selectedTopic?.name}.`,
      },
      {
        text: `When was ${skill.name} first introduced in ${selectedTopic?.name}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        explanation: `This is the explanation for when ${skill.name} was first introduced in ${selectedTopic?.name}.`,
      },
      {
        text: `What are the main principles of ${skill.name} in ${selectedTopic?.name}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        explanation: `This is the explanation for the main principles of ${skill.name} in ${selectedTopic?.name}.`,
      },
    ];
    setGeneratedQuestions(questions);
  };

  const handleQuestionSelect = (question: Question) => {
    if (selectedQuestions.includes(question)) {
      setSelectedQuestions(selectedQuestions.filter((q) => q !== question));
    } else {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  const handleSaveQuestions = () => {
    console.log("Saved questions:", selectedQuestions);
    alert("Questions saved successfully!");
  };

  const handlePreviewQuestion = (question: Question) => {
    setPreviewQuestion(question);
  };

  return (
    <div className="p-4">
      <Card title="Question Generator" className="mb-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">1. Select a Topic:</h2>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <Button
                key={topic.id}
                label={topic.name}
                className={`p-button-primary ${selectedTopic?.id === topic.id ? "p-button-outlined" : ""}`}
                onClick={() => handleTopicSelect(topic)}
              />
            ))}
          </div>
        </div>

        {selectedTopic && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">2. Select a Skill:</h2>
            <div className="flex flex-wrap gap-2">
              {selectedTopic.skills.map((skill) => (
                <Button
                  key={skill.id}
                  label={skill.name}
                  className={`p-button-primary ${selectedSkill?.id === skill.id ? "p-button-outlined" : ""}`}
                  onClick={() => handleSkillSelect(skill)}
                />
              ))}
            </div>
          </div>
        )}

        {generatedQuestions.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">3. Select Question(s):</h2>
            <ListBox
              options={generatedQuestions}
              optionLabel="text"
              multiple
              onChange={(e) => setSelectedQuestions(e.value)}
              value={selectedQuestions}
              itemTemplate={(option) => (
                <div className="flex items-center justify-between p-2">
                  <span>{option.text}</span>
                  <div className="flex items-center">
                    <Button
                      icon="pi pi-eye"
                      className="p-button-rounded p-button-text"
                      onClick={() => handlePreviewQuestion(option)}
                    />
                    {selectedQuestions.includes(option) ? (
                      <Button
                        icon="pi pi-check-circle"
                        className="p-button-rounded p-button-text p-button-success"
                      />
                    ) : (
                      <Button
                        icon="pi pi-plus-circle"
                        className="p-button-rounded p-button-text"
                      />
                    )}
                  </div>
                </div>
              )}
            />
          </div>
        )}

        {previewQuestion && (
          <Panel header="Question Preview" className="mb-4">
            <p className="mb-2">{previewQuestion.text}</p>
            <ul className="list-disc pl-6 mb-2">
              {previewQuestion.options.map((option, index) => (
                <li key={index}>{option}</li>
              ))}
            </ul>
            <p className="italic">Explanation: {previewQuestion.explanation}</p>
          </Panel>
        )}

        {selectedQuestions.length > 0 && (
          <div className="mt-6">
            <Button
              label="Save Selected Questions"
              onClick={handleSaveQuestions}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default QuestionGenerator;