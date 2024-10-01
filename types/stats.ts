declare namespace Statistics {
    interface StatisticsResponse<Type> {
        data: Type;
        pageNo: number;
        pageSize: number;
        totalRecords: number;
    }

    interface TopicSkillStatistics {
        topicId: number;
        topicName: string;
        skillId: number;
        skillName: string;
        cntAttempt: number;
        cntCorrectAnswer: number;
    }
}
