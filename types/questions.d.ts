declare namespace Questions {

    interface MCQ {
        id?: number;
        stem: string;
        option: Option[];
        isAnswer: number;
        topics: Topic[];
        skills: Skills[];
        status: string ;
        published_on?: Date ;
        published_by?: string ;
        closed_on?: Date,
        closed_by?: string,
        created_on?: Date,
        created_by?: string,
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

