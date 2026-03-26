/**
 * Represents the type of a question in the system:
 * - 0 - General Question
 * - 1 - Exercise Question
 * - 2 - Question related for problems or issues
 */
export type QuestionType = 0 | 1 | 2;

/**
 * Represents a question in the system.
 * It can be a general question, an exercise question, or a question related to problems or issues.
 * @remarks A question may have a target question ID if it is a follow-up or related to another question.
 * @remarks It can also be associated with an exercise ID if applicable.
 */
export interface Question {
    /**
     * Unique identifier for the question.
     */
    id: number;

    /**
     * Identifier for the competition this question belongs to.
     */
    competitionId: number;

    /**
     * Identifier for the target question if this question is a follow-up or related to another question.
     */
    targetQuestionId: number | null;

    /**
     * Identifier for the exercise this question is associated with, if applicable.
     * @remarks This is optional and may not be present for all questions.
     */
    exerciseId?: number;

    /**
     * Identifier for the user who created the question.
     */
    userId: string;

    /**
     * The content of the question.
     */
    content: string;

    /**
     * The type of the question.
     * @remarks This can be a general question, an exercise question, or a question related to problems or issues.
     */
    questionType: QuestionType;

    /**
     * The answer to the question, if it has been answered.
     */
    answer?: Answer | null;
}

export interface Answer {
    id: number;
    content: string;
    userId: string;
}

export interface QuestionDisplay {
    id: number;
    title: string;
    question: string;
    askedBy: string;
    askedAt: string;
    status: "pending" | "answered";
    answer?: string;
    answeredAt?: string;
    language?: string;
}

export interface QuestionUser {
    id: number;
    ra: string;
    email: string;
    createdAt: string;
    joinYear: number;
    lastLoggedAt: string;
    name: string;
    group: QuestionGroup;
}

export interface QuestionGroup {
    id: number;
    leaderId: number;
    name: string;
    users: Omit<QuestionUser, "group">[]; // ou users: QuestionUser[]; pq não esta aceitando any
}
