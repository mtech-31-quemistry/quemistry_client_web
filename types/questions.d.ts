declare namespace Questions {

    interface MCQ {
        id?: number;
        stem?: string;
        key: Answer;
        distractors: Answer[];
        topics: Topic[];
        skills: Skills[];
        publish_on: Date ;
        deletedOn?: Date;
    }

    interface Answer{
        answer: string;
        explanation: string;
    }

    interface Topic{
        id?: number;
        name: string;
    }

    interface Skills{
        id?: number;
        name: string;
        topic_id: number;
    }
}

