import { Questions } from '@/types';

const QuesionsSvcUrl = process.env.NEXT_PUBLIC_QUEMISTRY_QUESTIONS_URL || ''
const retrieveQuestionUrl = `${process.env.NEXT_PUBLIC_QUEMISTRY_GATEWAY_URL}/questions/retrieve`
const saveQuestionUrl = `${process.env.NEXT_PUBLIC_QUEMISTRY_GATEWAY_URL}/questions`
const QuestionsTopicsUrl = `${process.env.NEXT_PUBLIC_QUEMISTRY_QUESTIONS_URL}/topics`

export const QuestionsService = {
    addMCQ(data : any) {
        console.log("calling saveQuestion ", saveQuestionUrl, data);
        return fetch(saveQuestionUrl, { 
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
                return data as Questions.MCQ}
            );
    },
    getMCQ() {
        return fetch(QuesionsSvcUrl, { 
                headers: { 
                    'Content-Type': 'application/json' 
                },
                credentials: 'include'
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
    // for LOCAL dev
    // retrieveMCQ(data : Questions.RetrieveQuestionRequest) {
    //     console.log("retrieving mock data mcq")
    //     return fetch('/demo/data/questions.json', { 
    //             headers: { 
    //                 'Content-Type': 'application/json' 
    //             }})
    //         .then((res) => {
    //             let json = res.json();
    //             console.log("json", json);
    //             return json;
    //         })
    //         .then((data) => {
    //             return data.mcqs as Questions.MCQ[]}
    //         );
    // },
    getTopics() {
        return fetch(QuestionsTopicsUrl, { 
                headers: { 
                    'Content-Type': 'application/json' 
                },
                credentials: 'include'
            })
            .then((res) => res.json())
            .then((d) => d.topics as Questions.Topic[]);
    },
    getSkills() {
        return fetch('/demo/data/topics.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.skills as Questions.Skill[]);
    },

};
