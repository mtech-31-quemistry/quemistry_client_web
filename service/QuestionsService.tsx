import { Questions } from '@/types';

const QuesionsSvcUrl = process.env.NEXT_PUBLIC_QUEMISTRY_QUESTIONS_URL || ''
const retrieveQuestionUrl = `${process.env.NEXT_PUBLIC_QUEMISTRY_QUESTIONS_URL}/retrieve`
const QuestionsTopicsUrl = `${process.env.NEXT_PUBLIC_QUEMISTRY_QUESTIONS_URL}/topics`

export const QuestionsService = {
    addMCQ(data : any) {
        console.log("calling saveQuestion ", QuesionsSvcUrl, data);
        return fetch(QuesionsSvcUrl, { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json' 
                },
                credentials: "include",
                body: JSON.stringify(data)
            })
            .then((res) => {
                return res.json();
            })            .then((data) => {
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
            .then((res) => {
                if(res.status === 200)
                    return res.json();
                else{
                    console.log("res", res);
                    throw new Error(res.status + " at retrieving topics.");
               }
            })
            .then((d) => d.topics as Questions.Topic[]);
    },
    getSkills() {
        return fetch('/demo/data/topics.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.skills as Questions.Skill[]);
    },
    saveTopics(data: Questions.Topic[]){
        return fetch(QuestionsTopicsUrl, { 
            method: 'POST', 
            headers: { 
                'Content-Type': 'application/json' 
            },
            credentials: 'include',
            body: JSON.stringify({topics : data})
        })
        .then((res) =>{
            if(res.status === 200)
                return res.json();
            else{
                console.log("res", res);
                throw new Error(res.status + " at saving topics.");
           }            
        })
        .then((d) => d.topics as Questions.Topic[]);
    }

};
