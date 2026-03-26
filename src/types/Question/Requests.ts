/**
 * Represents the request payload for creating a new question during a competition.
 */
export interface CreateQuestionRequest {
    /**
     * The ID of the competition in which the question is being asked.
     */
    competitionId: number;

    /**
     * The ID of the exercise related to the question.
     */
    exerciseId: number;

    /**
     * The ID of the programming language related to the question.
     * @remarks Optional - only include if the question is language-specific.
     */
    languageId?: number;

    /**
     * The title or subject of the question.
     */
    title: string;

    /**
     * The detailed content of the question.
     */
    content: string;

    /**
     * The type/category of the question.
     */
    questionType: number;
}

/**
 * Represents the request payload for answering a question.
 */
export interface AnswerQuestionRequest {
    /**
     * The content of the answer to the question.
     */
    content: string;
}
