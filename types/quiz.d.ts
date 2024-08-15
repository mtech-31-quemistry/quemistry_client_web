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
  }
  
  interface ApiResponse {
    id: number;
    mcqs: Mcq[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
    message?: string;
  }
}

