import { Questions, Genai } from '@/types';

const openaiMCQByTopicStreamSvcUrl = `${process.env.NEXT_PUBLIC_QUEMISTRY_GENAI_URL}/openaimcqbytopic/stream`
const geminiMCQByTopicStreamSvcUrl = `${process.env.NEXT_PUBLIC_QUEMISTRY_GENAI_URL}/geminimcqbytopic/stream`
const geminiMCQByTopicSvcUrl = `${process.env.NEXT_PUBLIC_QUEMISTRY_GENAI_URL}/geminimcqbytopic/invoke`

export const GenaiService = {
    generateMCQByTopicStream(numMCQ: number, topic: Questions.Topic, callback: (data: Genai.MCQ) => void) {
        console.debug("calling API", geminiMCQByTopicStreamSvcUrl);
        return fetch(geminiMCQByTopicStreamSvcUrl, { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json' 
                },
                credentials: "include",
                body: JSON.stringify({
                    input: {
                        number: numMCQ,
                        topic: topic.name,
                        skill: topic.skills.map((s) => s.name).join(","),
                    }
                })
            })
            .then((res) => {
                console.log("api call status", res);
                 if(res.status === 200){
                     //return res.json();
                    const reader = res.body?.getReader();
                    let count = 0;
                    while(count < 10){
                        count++;
                        reader?.read().then(({ done, value }) => {
                            if (done) {
                                return;
                            }
                            let valueStr = new TextDecoder().decode(value);
                            console.log("valueStr ", count);
                            console.log(valueStr);
                            //search for event: data
                            var searchedIndex = valueStr.indexOf("event: data");
                            if(searchedIndex != -1){
                                valueStr = valueStr.substring(searchedIndex + 11);
                                console.log(valueStr);
                                searchedIndex = valueStr.indexOf("data:");
                                let searchEndIndex = valueStr.indexOf("event: end");
                                if(searchedIndex != -1){
                                    console.log("searchedIndex", searchedIndex, "searchEndIndex", searchEndIndex);
                                    if(searchEndIndex > (searchedIndex + 5)){
                                        valueStr = valueStr.substring(searchedIndex+ 5, searchEndIndex - searchedIndex).trim();
                                    }else{
                                        valueStr = valueStr.substring(searchedIndex+ 5).trim();
                                    }
                                    console.log(valueStr);
                                    var result = JSON.parse(valueStr);
                                    console.log("result", count);
                                    console.log(result);
                                    callback(result as Genai.MCQ);
                                }
                            }
                            if(valueStr.indexOf("event: end") != -1){
                                return;
                            }
                        });
                    }
                }   
                else{
                     console.log("res", res);
                     throw new Error(res.status + " generating MCQ. Please try again later.");
                }
            });
    },
    generateMCQByTopic(numMCQ: number, topic: Questions.Topic) {
        console.debug("calling API", geminiMCQByTopicSvcUrl);
        return fetch(geminiMCQByTopicSvcUrl, { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json' 
                },
                credentials: "include",
                body: JSON.stringify({
                    input: {
                        number: numMCQ,
                        topic: topic.name,
                        skill: topic.skills.map((s) => s.name).join(","),
                    }
                })
            })
            .then((res) => {
                console.log("api call status", res);
                 if(res.status === 200)
                     return res.json();
                 else{
                     console.log("res", res);
                     throw new Error(res.status + " while saving MCQ");
                }
            }).then((data) => {
                console.log("data", data);
                var output = data as Genai.InvokeResult;
                //var result = data as Genai.MCQ;
                //callback(data)
                return output.output as Genai.MCQ}
            );
    },
};
