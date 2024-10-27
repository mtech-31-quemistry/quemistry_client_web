import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { GenaiService } from '../../service/GenaiService'; // Adjust the import according to your project structure
import { Questions, Genai } from '@/types'; // Adjust the import according to your project structure

// Mock the global fetch function
global.fetch = vi.fn();

const mockTopic: Questions.Topic = {
    name: 'Math',
    status: 'active',
    edited: false,
    skills: [{ 
        name: 'Algebra', 
        topicId: 1,
        status: 'active',
        edited: false }
    ]
};

describe('GenaiService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('generateMCQByTopicStream', () => {
        it('should call fetch with correct parameters and handle stream response', async () => {
            const mockCallback = vi.fn();
            const mockResponse = new Response(
                new ReadableStream({
                    start(controller) {
                        controller.enqueue(new TextEncoder().encode('event: data\n\ndata: {"question": "What is 2 + 2?"}\n'));
                        controller.enqueue(new TextEncoder().encode('event: end\n'));
                        controller.close();
                    }
                })
            );

            (fetch as unknown as Mock).mockResolvedValueOnce(mockResponse);
            
            await GenaiService.generateMCQByTopicStream(5, mockTopic, mockCallback);
            
            expect(fetch).toHaveBeenCalledWith(expect.any(String), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    input: {
                        number: 5,
                        topic: 'Math',
                        skill: 'Algebra',
                    }
                })
            });
            expect(mockCallback).toHaveBeenCalledWith(expect.objectContaining({
                question: 'What is 2 + 2?'
            }));
        });
    });

    describe('generateMCQByTopic', () => {
        it('should call fetch and return MCQ data', async () => {
            const mockResponseData: Genai.InvokeResult = {
                output: { question: 'What is 2 + 2?' }
            };

            (fetch as unknown as Mock).mockResolvedValueOnce({
                status: 200,
                json: vi.fn().mockResolvedValueOnce(mockResponseData)
            });

            const result = await GenaiService.generateMCQByTopic(5, mockTopic);

            expect(fetch).toHaveBeenCalledWith(expect.any(String), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    input: {
                        number: 5,
                        topic: 'Math',
                        skill: 'Algebra',
                    }
                })
            });
            expect(result).toEqual(mockResponseData.output);
        });

        it('should throw an error when the response status is not 200', async () => {
            (fetch as unknown as Mock).mockResolvedValueOnce({
                status: 400,
                json: vi.fn().mockResolvedValueOnce({}),
            });

            await expect(GenaiService.generateMCQByTopic(5, mockTopic)).rejects.toThrow('400 while saving MCQ');
        });
    });
});
