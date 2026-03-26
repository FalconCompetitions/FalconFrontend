import { ExerciseType } from ".";

export interface CreateExerciseInputRequest {
    /**
     * The ID of the exercise associated with this input.
     */
    exerciseId: number | null;

    /**
     * The orderId of the input within the exercise.
     */
    orderId: number;

    /**
     * The input string provided to the exercise.
     */
    input: string;
}

export interface CreateExerciseOutputRequest {
    /**
     * The ID of the exercise associated with this output.
     */
    exerciseId: number | null;

    /**
     * The orderId of the output within the exercise.
     */
    orderId: number;

    /**
     * The output string produced by the judge system.
     */
    output: string;
}

export interface CreateExerciseRequest {
    /**
     * Title of the exercise.
     */
    title: string;

    /**
     * Type of the exercise.
     */
    exerciseTypeId: ExerciseType;

    /**
     * Description of the exercise.
     */
    description: string;

    /**
     * Estimated time to complete the exercise, in seconds.
     */
    estimatedTime: number;

    /**
     * UUID of the judge associated with the exercise.
     */
    judgeUuid: string | null;

    /**
     * List of inputs for the exercise.
     */
    inputs: CreateExerciseInputRequest[];

    /**
     * List of outputs for the exercise.
     */
    outputs: CreateExerciseOutputRequest[];

    /**
     * The PDF file associated with the exercise.
     */
    pdfFile: File;
}

/**
 * Represents the output generated for a specific exercise input by the judge system.
 */
export interface EditExerciseOutputRequest {
    /**
     * Unique identifier for the exercise output.
     */
    id: number | null;

    /**
     * Identifier of the exercise associated with this output.
     */
    exerciseId: number;

    /**
     * UUID of the judge associated with the exercise.
     */
    judgeUuid?: string | null;

    /**
     * Identifier of the input used for this exercise output.
     */
    exerciseInputId: number | null;

    /**
     * The orderId of the output within the exercise.
     */
    orderId: number;

    /**
     * The output string produced by the judge system.
     */
    output: string;
}

/**
 * Represents the input data for an exercise, used by the judge system.
 */
export interface EditExerciseInputRequest {
    /**
     * Unique identifier for the exercise input.
     */
    id: number | null;

    /**
     * Identifier of the exercise associated with this input.
     */
    exerciseId: number;

    /**
     * UUID of the judge associated with the exercise.
     */
    judgeUuid?: string | null;

    /**
     * The orderId of the input within the exercise.
     */
    orderId: number;

    /**
     * The input string provided to the exercise.
     */
    input: string;
}

/**
 * Represents an exercise with its details and metadata.
 */
export interface EditExerciseRequest {
    /**
     * Unique identifier for the exercise.
     */
    id: number;

    /**
     * Title of the exercise.
     */
    title: string;

    /**
     * Type of the exercise.
     */
    exerciseTypeId: ExerciseType;

    /**
     * Description of the exercise.
     */
    description: string;

    /**
     * Estimated time to complete the exercise, in seconds.
     */
    estimatedTime: number;

    /**
     * UUID of the judge associated with the exercise.
     */
    judgeUuid: string;

    /**
     * ISO string representing when the exercise was created.
     */
    createdAt: string;

    /**
     * Represents the file associated with the exercise
     */
    pdfFile: File;

    /**
     * List of inputs for the exercise.
     */
    inputs: EditExerciseInputRequest[];

    /**
     * List of outputs for the exercise.
     */
    outputs: EditExerciseOutputRequest[];
}
