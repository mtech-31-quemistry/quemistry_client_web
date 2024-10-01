declare namespace Quiz {
    interface Option {
        no: number;
        text: string;
        explanation: string;
        isAnswer: boolean;
    }

    interface Topic {
        id: number;
        name: string;
    }

    interface Skill {
        id: number;
        name: string;
        topicId: number | null;
    }

    interface Mcq {
        content: Content[];
        pageable: Pageable[];
        last: boolean;
        totalPages: number;
        totalElements: number;
        first: boolean;
        size: number;
        sort: Sort[];
        numberOfElements: number;
        empty: boolean;
    }

    interface Pageable {
        pageNumber: number;
        pageSize: number;
        sort: Sort[];
        offset: boolean;
        paged: boolean;
        unpaged: boolean;
    }

    interface Sort {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    }

    interface Content {
        id: number;
        stem: string;
        options: Option[];
        topics: Topic[];
        skills: Skill[];
        status: string;
        publishedOn: number;
        publishedBy: string;
        closedOn: number | null;
        closedBy: string | null;
        createdOn: number;
        createdBy: string;
        attemptOption: number | null;
        attemptOn: number | null;
    }

    interface SimpleQuizResponse {
        id: number;
        stem: string;
        options: Option[];
        topics: Topic[];
        skills: Skill[];
        status: string;
        publishedOn: number;
        publishedBy: string;
        closedOn: number | null;
        closedBy: string | null;
        createdOn: number;
        createdBy: string;
        attemptOption: number | null;
        attemptOn: number | null;
    }

    interface ApiResponse {
        id: number;
        mcqs: Mcq;
        status: string;
        points: number;
        // pageNumber: number;
        // pageSize: number;
        // totalPages: number;
        // totalRecords: number;
        message?: string;
    }

    interface CompletedResponse {
        // pageNumber: number;
        // pageSize: number;
        // totalPages: number;
        // totalRecords: number;
        message?: string;
        content: QuizTaken[];
        // quizzes: QuizTaken[];
        pageable: Pageable[];
        last: boolean;
        totalPages: number;
        totalElements: number;
        first: boolean;
        size: number;
        sort: Sort[];
        numberOfElements: number;
        empty: boolean;
    }

    interface QuizTaken {
        id: number;
        mcqs: SimpleQuizResponse[];
        status: string;
        points: number;
        // pageNumber: number;
        // pageSize: number;
        // totalPages: number;
        // totalRecords: number;
    }
}
