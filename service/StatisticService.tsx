const topicSkillStatsUrl = `${process.env.NEXT_PUBLIC_QUEMISTRY_STATS_URL}/topic-skill`


export const StatisticService = {
    getTopicSkillStatistics(pageNo: number, pageSize: number) {
        const params = new URLSearchParams({ pageno: pageNo.toString(), pagesize: pageSize.toString() }); 
        //console.log("API URL: " + topicSkillStatsUrl + params.toString());

        return fetch(`${topicSkillStatsUrl}?${params.toString()}`,{
                    credentials: 'include'
                    })
                    .then(res => res.json())
                    .then(data => data as Statistics.StatisticsResponse<Statistics.TopicSkillStatistics[]>);
    }
}