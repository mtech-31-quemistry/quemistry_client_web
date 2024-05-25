declare namespace Questions {

    interface MCQ {
        id?: number;
        stem?: string;
        key: Answer;
        distractors: Answer[];
        topics: Topic[];
        skills: Skills[];
        status: string ;
        published_on?: Date ;
        published_by?: string ;
    }

    interface Option{
        no: number;
        text: string;
        explanation?: string;
        isAnswer: boolean;
    }

    interface Topic{
        id?: number;
        name: string;
    }

    interface Skill{
        id?: number;
        name: string;
        topic_id: number;
    }
}

