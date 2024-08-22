declare namespace Questions {
    interface DropDownOption{
        name: String
        code: String
    }
    
    interface MCQ {
        id?: number;
        stem: string;
        options: Option[];
        isAnswer: number;
        topics: Topic[];
        skills: Skills[];
        status: string ;
        publishedOn?: Date ;
        publishedBy?: string ;
        archivedOn?: Date,
        archivedBy?: string,
        updatedBy?: string,
        updatedOn?: Date,
        createdBy?: string,
        createdOn?: Date
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
        ids?: number[];
        pageNumber?: number;
        pageSize?: number;
    }
}

