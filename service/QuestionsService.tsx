import { Questions } from '@/types';

const QuesionsSvcUrl = process.env.NEXT_PUBLIC_QUEMISTRY_QUESTIONS_URL || ''
const retrieveQuestionUrl = `${process.env.NEXT_PUBLIC_QUEMISTRY_GATEWAY_URL}/questions/retrieve` || ''

export const QuestionsService = {
    getMCQ() {
        return fetch(QuesionsSvcUrl, { 
                headers: { 
                    'Content-Type': 'application/json' 
                },
                credentials: "include" 
            })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                return data.mcqs as Questions.MCQ[]}
            );
    },
    retrieveMCQ(data : Questions.RetrieveQuestionRequest) {
        return fetch(retrieveQuestionUrl, { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json' 
                },
                credentials: "include",
                body: JSON.stringify(data)
            })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                return data.mcqs as Questions.MCQ[]}
            );
    },
    getTopics() {
        return fetch('/demo/data/topics.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.topics as Questions.Topic[]);
    },
    getSkills() {
        return fetch('/demo/data/topics.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.skills as Questions.Skill[]);
    },

};
