import type { QuestionType } from ".";
import type { PagedResult } from "../Global";
import type { GenericUserInfo } from "../User";

/**
 * Represents an answer to a question.
 */
export interface AnswerResponse {
    /**
     * The unique identifier of the answer.
     */
    id: number;

    /**
     * The content of the answer.
     */
    content: string;

    /**
     * The RA (academic registration number) of the user who provided the answer.
     */
    userId: string;
}

/**
 * Represents a question in the system.
 */
export interface QuestionResponse {
    /**
     * The unique identifier of the question.
     */
    id: number;

    /**
     * The ID of the competition in which the question was asked.
     */
    competitionId: number;

    /**
     * The ID of the exercise related to the question.
     * @remarks Optional - only present if question is exercise-specific.
     */
    exerciseId?: number;

    /**
     * The RA (academic registration number) of the user who asked the question.
     */
    userId: string;

    /**
     * Basic information about the user who asked the question.
     */
    user: GenericUserInfo;

    /**
     * The content of the question.
     */
    content: string;

    /**
     * The ID of the answer to this question.
     * @remarks Optional - only present if the question has been answered.
     */
    answerId?: number;

    /**
     * The answer to this question.
     * @remarks Optional - only present if the question has been answered.
     */
    answer?: AnswerResponse;

    /**
     * The type/category of the question.
     */
    questionType: QuestionType;
}

/**
 * Represents a paginated response containing questions.
 */
export type GetQuestionsResponse = PagedResult<QuestionResponse>;

/**
 * Represents the response after creating a new question.
 */
export interface CreateQuestionResponse {
    /**
     * The unique identifier of the created question.
     */
    id: number;

    /**
     * A message describing the result of the creation.
     */
    message: string;
}

/**
 * Represents the response after answering a question.
 */
export interface AnswerQuestionResponse {
    /**
     * The unique identifier of the created answer.
     */
    id: number;

    /**
     * A message describing the result of the answer submission.
     */
    message: string;
}
