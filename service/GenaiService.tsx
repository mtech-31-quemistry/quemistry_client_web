import { Questions, Genai } from '@/types';

const openaiMCQByTopicStreamSvcUrl = `${process.env.NEXT_PUBLIC_QUEMISTRY_GENAI_URL}/openaimcqbytopic/stream`
const geminiMCQByTopicStreamSvcUrl = `${process.env.NEXT_PUBLIC_QUEMISTRY_GENAI_URL}/geminimcqbytopic/stream`
const geminiMCQByTopicSvcUrl = `${process.env.NEXT_PUBLIC_QUEMISTRY_GENAI_URL}/geminimcqbytopic/invoke`
const decoder = new TextDecoder('utf-8');

export const GenaiService = {
    
    async generateMCQByTopicStream(numMCQ: number, topic: Questions.Topic, callback: (data: Genai.MCQ) => void) {
        const response = await fetch(geminiMCQByTopicStreamSvcUrl, { 
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
        const it = handleStreamResponse(response)
        for await(let valueStr of it){
            console.log("value", valueStr);
            var searchedIndex = valueStr.lastIndexOf("event: data");
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
                    console.log("result");
                    console.log(result);
                    callback(result as Genai.MCQ);
                }
            }
        }
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


async function* handleStreamResponse(response: Response) {
        const reader  = response.body?.getReader();
        for( ;; ) {
            const { done, value } = await reader!.read()
            if( done ) break;
    
            try {
                yield decoder.decode(value)
            }
            catch( e:any ) {
                console.warn( e.message )
            }
    
        }
    }
