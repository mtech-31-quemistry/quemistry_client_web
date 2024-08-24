import { createContext, useContext, useState, ReactNode } from 'react';

const QuestionContext = createContext<any>(undefined);

interface QuestionProviderProps {
    children: ReactNode;
}

export function QuestionProvider({ children }: QuestionProviderProps) {
    const [question, setQuestion] = useState<Questions.MCQ>();

    return <QuestionContext.Provider value={{ question, setQuestion }}>{children}</QuestionContext.Provider>;
}

export function useQuestion() {
    const context = useContext(QuestionContext);
    if (context === undefined) {
        throw new Error('useQuestion must be used within a QuestionProvider');
    }
    return useContext(QuestionContext);
}
