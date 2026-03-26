import { apiRequest } from "@/libs/apiClient";
import type { ServerSideResponse } from "@/types/Global";
import type {
    CreateQuestionRequest,
    AnswerQuestionRequest,
} from "@/types/Question/Requests";
import type {
    GetQuestionsResponse,
    CreateQuestionResponse,
    AnswerQuestionResponse,
} from "@/types/Question/Responses";

class QuestionService {
    /**
     * Retrieves a paginated list of questions.
     *
     * @param page - The page number to retrieve.
     * @param pageSize - The number of questions per page.
     * @returns A promise that resolves to the server response containing the paginated questions.
     */
    public async GetQuestions(page: number, pageSize: number) {
        const response = await apiRequest<
            ServerSideResponse<GetQuestionsResponse>
        >("/api/question", {
            method: "GET",
            params: {
                page,
                pageSize,
            },
        });

        return response.data;
    }

    /**
     * Creates a new question in the system.
     *
     * @param data - The question creation request containing the question details.
     * @returns A promise that resolves to the server response containing the created question data.
     */
    public async CreateQuestion(data: CreateQuestionRequest) {
        const response = await apiRequest<
            ServerSideResponse<CreateQuestionResponse>
        >("/api/question", {
            method: "POST",
            data,
        });

        return response.data;
    }

    /**
     * Submits an answer to a specific question.
     *
     * @param questionId - The unique identifier of the question to answer.
     * @param data - The answer request containing the answer details.
     * @returns A promise that resolves to the server response containing the answer result.
     */
    public async AnswerQuestion(
        questionId: number,
        data: AnswerQuestionRequest
    ) {
        const response = await apiRequest<
            ServerSideResponse<AnswerQuestionResponse>
        >(`/api/question/${questionId}/answer`, {
            method: "POST",
            data,
        });

        return response.data;
    }
}

export default QuestionService;
