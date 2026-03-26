import { fromBase64, toBase64 } from "@/libs/utils";
import { Exercise, ExerciseInput, ExerciseOutput } from "@/types/Exercise";
import {
    CreateExerciseInputRequest,
    CreateExerciseOutputRequest,
    EditExerciseInputRequest,
    EditExerciseOutputRequest,
    EditExerciseRequest,
} from "@/types/Exercise/Requests";

/**
 * Processes raw input and output values for exercise creation.
 *
 * Splits the provided input and output strings by newlines, trims whitespace,
 * filters out empty lines, and encodes each value to Base64. Returns arrays of
 * input and output objects, each containing the encoded value, a null exerciseId,
 * and the corresponding order index.
 *
 * @param inputValues - Multiline string containing input values for the exercise.
 * @param outputValues - Multiline string containing output values for the exercise.
 * @returns An object containing arrays of processed inputs and outputs.
 */
export const processCreateExerciseValues = (
    inputValues: string,
    outputValues: string
) => {
    const inputStrings = inputValues
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    const outputStrings = outputValues
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

    const inputs: CreateExerciseInputRequest[] = inputStrings.map((s, idx) => ({
        input: toBase64(s),
        exerciseId: null,
        orderId: idx,
    }));
    const outputs: CreateExerciseOutputRequest[] = outputStrings.map(
        (s, idx) => ({ output: toBase64(s), exerciseId: null, orderId: idx })
    );

    return { inputs, outputs };
};


/**
 * Processes arrays of exercise input and output values, converting their data to base64 and formatting them
 * into request objects suitable for editing exercises.
 *
 * @param inputValues - An array of `ExerciseInput` objects representing the exercise inputs to process.
 * @param outputValues - An array of `ExerciseOutput` objects representing the exercise outputs to process.
 * @returns An object containing two arrays: `inputs` (formatted as `EditExerciseInputRequest`) and `outputs` (formatted as `EditExerciseOutputRequest`).
 */
export const getExerciseValues = (
    exercise: Exercise
) => {
    const inputs = exercise.inputs.map((x, idx) => {

        return {
            id: x.id,
            exerciseId: x.exerciseId,
            judgeUuid: x.judgeUuid,
            orderId: idx,
            input: fromBase64(x.input)
        } satisfies EditExerciseInputRequest;
    });

    const outputs = exercise.outputs.map((x, idx) => {

        return {
            id: x.id,
            exerciseId: x.exerciseId,
            judgeUuid: x.judgeUuid,
            exerciseInputId: x.exerciseInputId,
            orderId: idx,
            output: fromBase64(x.output)
        } satisfies EditExerciseOutputRequest;
    });

    return { inputs, outputs };
};

/**
 * Processes arrays of exercise input and output values, converting their data to base64 and formatting them
 * into request objects suitable for editing exercises.
 *
 * @param inputValues - An array of `ExerciseInput` objects representing the exercise inputs to process.
 * @param outputValues - An array of `ExerciseOutput` objects representing the exercise outputs to process.
 * @returns An object containing two arrays: `inputs` (formatted as `EditExerciseInputRequest`) and `outputs` (formatted as `EditExerciseOutputRequest`).
 */
export const processExerciseToEdit = (
    exercise: EditExerciseRequest
) => {
    const inputs = exercise.inputs.map((x, idx) => {

        return {
            id: x.id,
            exerciseId: x.exerciseId,
            judgeUuid: x.judgeUuid,
            orderId: idx,
            input: toBase64(x.input)
        } satisfies EditExerciseInputRequest;
    });

    const outputs = exercise.outputs.map((x, idx) => {

        return {
            id: x.id,
            exerciseId: x.exerciseId,
            judgeUuid: x.judgeUuid,
            exerciseInputId: x.exerciseInputId,
            orderId: idx,
            output: toBase64(x.output)
        } satisfies EditExerciseOutputRequest;
    });

    return { inputs, outputs };
};