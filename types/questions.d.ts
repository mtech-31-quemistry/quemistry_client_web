declare namespace Questions {

    interface MCQ {
        id?: number;
        stem: string;
        option: Option[];
        isAnswer: number;
        topics: Topic[];
        skills: Skills[];
        status: string ;
        publishedOn?: Date ;
        publishedBy?: string ;
        closedOn?: Date,
        closedBy?: string,
        createdOn?: Date,
        createdBy?: string,
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
        topicId: number;
    }

    interface RetrieveQuestionRequest {
        pageNumber?: number;
        pageSize?: number
    }
}

