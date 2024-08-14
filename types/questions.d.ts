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
        archivedOn?: Date,
        archivedBy?: string,
        createdTs?: Date,
        updatedTs?: Date,
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
        status: string;
        skills: Skill[];
        edited: boolean = false; //false by default (only used by UI)
    }

    interface Skill{
        id?: number;
        name: string;
        status: string;
        topicId: number;
        edited: boolean = false; //false by default (only used by UI)
    }

    interface RetrieveQuestionRequest {
        pageNumber?: number;
        pageSize?: number
    }
}

