import { Competition } from "../Competition";
import { Group } from "../Group";
import { JudgeResponseEnum } from "../Exercise";

/**
 * Response received when connecting to the SignalR hub.
 * Contains the current ongoing competition data or null if no competition is active.
 */
export type OnConnectionResponse = Competition | null;

/**
 * Log entry from the backend.
 */
export interface LogResponse {
    /**
     * Unique identifier for the log.
     */
    id: number;

    /**
     * Type of action logged (enum value).
     * 0=UserAction, 1=SystemAction, 2=Login, 3=Logout, 4=SubmittedExercise,
     * 5=GroupBlockedInCompetition, 6=GroupUnblockedInCompetition, 7=QuestionSent,
     * 8=AnswerGiven, 9=CompetitionUpdated, 10=CompetitionFinished
     */
    actionType: number;

    /**
     * Human-readable description of the action.
     */
    actionDescription: string;

    /**
     * Timestamp when the action occurred (ISO 8601).
     */
    actionTime: string;

    /**
     * IP address from which the action was performed.
     */
    ipAddress: string;

    /**
     * User ID (if applicable).
     */
    userId?: string | null;

    /**
     * Name of the user who performed the action.
     */
    userName?: string | null;

    /**
     * Group ID (if applicable).
     */
    groupId?: number | null;

    /**
     * Name of the group associated with the action.
     */
    groupName?: string | null;

    /**
     * Competition ID (if applicable).
     */
    competitionId?: number | null;
}

/**
 * Response for exercise submission after judge processing.
 */
export interface ExerciseSubmissionResponse {
    /**
     * Unique identifier for the submission.
     */
    id: number;

    /**
     * Identifier of the group that submitted.
     */
    groupId: number;

    /**
     * Identifier of the exercise.
     */
    exerciseId: number;

    /**
     * The source code submitted.
     */
    code: string;

    /**
     * The programming language ID used.
     */
    languageId: number;

    /**
     * Timestamp when submitted (ISO 8601).
     */
    submittedAt: string;

    /**
     * The judge's verdict.
     */
    judgeResponse: JudgeResponseEnum;

    /**
     * Execution time in milliseconds.
     */
    executionTime: number;

    /**
     * Memory used in KB.
     */
    memoryUsed: number;

    /**
     * Score obtained.
     */
    score: number;

    /**
     * Points obtained in this submission.
     */
    points: number;

    /**
     * Penalty applied (in minutes).
     */
    penalty: number;
}

/**
 * Generic user information returned in responses.
 */
export interface GenericUserInfoResponse {
    /**
     * User UUID.
     */
    id: string;

    /**
     * User's full name.
     */
    name: string;

    /**
     * User's email address.
     */
    email: string;

    /**
     * Account creation timestamp (ISO 8601).
     */
    createdAt: string;

    /**
     * Last login timestamp (ISO 8601).
     */
    lastLoggedAt: string;

    /**
     * Student registration number.
     */
    ra: string;

    /**
     * Year the student joined.
     */
    joinYear: number;

    /**
     * Department (nullable).
     */
    department: string | null;

    /**
     * Exercises created (nullable).
     */
    exercisesCreated: null;
}

/**
 * Question created during competition.
 */
export interface QuestionResponse {
    /**
     * Unique identifier for the question.
     */
    id: number;

    /**
     * Identifier of the competition.
     */
    competitionId: number;

    /**
     * Exercise ID if question is about a specific exercise (optional).
     */
    exerciseId?: number | null;

    /**
     * UUID of the user who created the question.
     */
    userId: string;

    /**
     * Complete user information of the person who asked.
     */
    user: GenericUserInfoResponse;

    /**
     * Group information of the user who asked the question (optional).
     */
    group?: {
        id: number;
        name: string;
        leaderId: string;
        users: GenericUserInfoResponse[];
    } | null;

    /**
     * The question content/text.
     */
    content: string;

    /**
     * Answer ID if the question has been answered (optional).
     */
    answerId?: number | null;

    /**
     * Associated answer if available (optional).
     */
    answer?: AnswerResponse | null;

    /**
     * Type of the question (enum).
     */
    questionType: number;
}

/**
 * Answer to a question.
 */
export interface AnswerResponse {
    /**
     * Unique identifier for the answer.
     */
    id: number;

    /**
     * The answer content/text.
     */
    content: string;

    /**
     * UUID of the user who answered (teacher/admin).
     */
    userId: string;

    /**
     * Complete user information of the person who answered.
     */
    user: GenericUserInfoResponse;

    /**
     * Identifier of the question being answered (for reference).
     */
    questionId?: number;
}

/**
 * Summary of exercise attempts for a group.
 */
export interface ExerciseAttemptSummary {
    /**
     * Identifier of the group.
     */
    groupId: number;

    /**
     * Identifier of the exercise.
     */
    exerciseId: number;

    /**
     * Number of attempts made for this exercise.
     */
    attempts: number;

    /**
     * Indicates whether the exercise was accepted (solved correctly).
     */
    accepted: boolean;
}

/**
 * Competition ranking entry broadcast after submissions.
 */
export interface CompetitionRankingResponse {
    /**
     * Unique identifier for the ranking entry.
     */
    id: number;

    /**
     * Total points accumulated.
     */
    points: number;

    /**
     * Total penalty in minutes.
     */
    penalty: number;

    /**
     * Position in ranking (1 = first place).
     */
    rankOrder: number;

    /**
     * Group details.
     */
    group: Group;

    /**
     * Summary of exercise attempts.
     */
    exerciseAttempts: ExerciseAttemptSummary[];
}

/**
 * Submission for manual review with full details.
 */
export interface SubmissionForReviewResponse {
    /**
     * Unique identifier for the submission.
     */
    id: number;

    /**
     * Identifier of the exercise.
     */
    exerciseId: number;

    /**
     * Name of the exercise.
     */
    exerciseName?: string | null;

    /**
     * Identifier of the group that made the submission.
     */
    groupId: number;

    /**
     * Group information.
     */
    group?: Group | null;

    /**
     * Date and time when the submission was made.
     */
    submissionTime: string;

    /**
     * Programming language used (0=C, 1=CPP, 2=Java, 3=Python, 4=JavaScript, 5=Go, 6=PHP, 7=CSharp).
     */
    language: number;

    /**
     * Whether the submission was accepted.
     */
    accepted: boolean;

    /**
     * Judge response status (0=Accepted, 1=WrongAnswer, 2=TimeLimitExceeded, 3=MemoryLimitExceeded, 4=RuntimeError, 5=CompilationError, 6=PresentationError, 7=OutputLimitExceeded, 8=InternalError, 9=Pending).
     */
    judgeResponse: number;

    /**
     * The code submitted by the group.
     */
    code?: string | null;
}

/**
 * Group registration in a competition.
 */
export interface GroupInCompetitionResponse {
    /**
     * Identifier of the group.
     */
    groupId: number;

    /**
     * Identifier of the competition.
     */
    competitionId: number;

    /**
     * The date and time when the group was added to the competition.
     */
    createdOn: string;

    /**
     * Indicates whether the group is blocked from participating.
     */
    blocked: boolean;

    /**
     * Reference to the group entity.
     */
    group?: Group | null;

    /**
     * Reference to the competition entity (optional).
     */
    competition?: Competition | null;
}

/**
 * Response after updating competition settings.
 */
export interface UpdateCompetitionSettingsResponse {
    /**
     * Indicates if the operation was successful.
     */
    success: boolean;

    /**
     * Optional message with details about the operation.
     */
    message?: string | null;
}

/**
 * Response after stopping a competition.
 */
export interface StopCompetitionResponse {
    /**
     * Indicates if the operation was successful.
     */
    success: boolean;

    /**
     * Optional message with details about the operation.
     */
    message?: string | null;
}

/**
 * Competition submission data for display in submissions page.
 */
export interface CompetitionSubmissionData {
    /**
     * Unique identifier for the submission.
     */
    id: number;

    /**
     * Identifier of the exercise.
     */
    exerciseId: number;

    /**
     * Name of the exercise.
     */
    exerciseName?: string | null;

    /**
     * Identifier of the group that made the submission.
     */
    groupId: number;

    /**
     * Group information.
     */
    group?: Group | null;

    /**
     * Date and time when the attempt was submitted.
     */
    submissionTime: string;

    /**
     * Programming language used for the submission.
     */
    language: number;

    /**
     * Indicates if the submission was accepted.
     */
    accepted?: boolean | null;

    /**
     * Judge response type.
     */
    judgeResponse: number;

    /**
     * Source code submitted.
     */
    code?: string | null;
}
