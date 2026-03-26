import { Exercise, JudgeResponseEnum } from ".";
import { PagedResult } from "../Global";

/**
 * Represents the response for an exercise submission.
 */
export interface ExerciseSubmissionResponse {
    /**
     * The unique identifier of the submission.
     */
    id: number;

    /**
     * The ID of the exercise that was submitted.
     */
    exerciseId: number;

    /**
     * The ID of the group that made the submission.
     */
    groupId: number;

    /**
     * Indicates whether the submission was accepted (passed all test cases).
     */
    accepted: boolean;

    /**
     * The judge's response indicating the outcome of the submission.
     */
    judgeResponse: JudgeResponseEnum;
}

/**
 * Represents a paginated response containing exercises.
 */
export type GetExercisesResponse = PagedResult<Exercise>;