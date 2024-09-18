import { Option } from './questions';

declare namespace Genai {
    interface MCQ {
        stem?: string;
        options?: Option[];
        isAnswer?: number;
    }
    interface InvokeResult {
        output: MCQ;
        metadata: Metadata;
    }

    interface Metadata {
        run_id: string;
        feedback_tokens: [];
    }

    interface StreamEvent {
        event: string;
        data: MCQ | Metadata;
    }
}
