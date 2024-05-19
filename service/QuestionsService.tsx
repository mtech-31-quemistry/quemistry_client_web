import { Questions } from '@/types';

export const QuestionsService = {
    getMCQ() {
        return fetch('/demo/data/questions.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Questions.MCQ[]);
    },

};
