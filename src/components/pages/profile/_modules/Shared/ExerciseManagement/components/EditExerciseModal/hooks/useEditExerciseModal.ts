import { EditExerciseRequestFormValues } from "../../../types";
import z from "zod";
import { Exercise, ExerciseType } from "@/types/Exercise";
import { SubmitErrorHandler, useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditExerciseRequest } from "@/types/Exercise/Requests";

const schema = z.object({
    id: z.number().min(1),
    title: z.string().min(2).max(100),
    exerciseType: z.custom<ExerciseType>(),
    description: z.string().optional(),
    inputs: z
        .string()
        .min(1, "O exercício deve ter pelo menos um input")
        .max(1000, "Input muito longo"),
    outputs: z
        .string()
        .min(1, "O exercício deve ter pelo menos um output")
        .max(1000, "Output muito longo"),
});

const useEditExerciseModal = (
    data: Exercise,
    pdfFile: File | null,
    saveEdit: (exercise: EditExerciseRequest) => Promise<void>,
    cancelEdit: () => void,
    onClose: () => void
) => {
    const [exerciseState, setExerciseState] = useState<EditExerciseRequest>({
        id: data.id,
        title: data.title,
        exerciseTypeId: data.exerciseTypeId,
        createdAt: data.createdAt,
        description: data.description,
        estimatedTime: 0,
        judgeUuid: data.judgeUuid ?? "",
        inputs: data.inputs.map((x, idx) => ({
            id: x.id,
            exerciseId: x.exerciseId,
            input: x.input,
            orderId: idx,
        })),
        outputs: data.outputs.map((x, idx) => ({
            id: x.id,
            exerciseId: x.exerciseId,
            output: x.output,
            exerciseInputId: x.exerciseInputId,
            orderId: idx,
        })),
        pdfFile: new File([], "")
    });

    const {
        control: editExerciseControl,
        handleSubmit: handleEditSubmit,
        setError,
        reset,
        setValue,
        register,
        watch,
        formState: { isValid },
    } = useForm({
        defaultValues: {
            id: data.id,
            title: data.title,
            exerciseType: data.exerciseTypeId,
            description: data.description,
            inputs: data.inputs.map((x) => x.input).join("\n"),
            outputs: data.outputs.map((x) => x.output).join("\n"),
        },
        mode: "onBlur",
        resolver: zodResolver(schema),
    });

    const formValues = watch();

    const handleOnTitleChange = useCallback(
        (title: string) => {
            setExerciseState((prev) => ({
                ...prev,
                title: title,
            }));
            setValue("title", title);
        },
        [setValue]
    );

    const handleOnDescriptionChange = useCallback(
        (description: string) => {
            setExerciseState((prev) => ({
                ...prev,
                description: description,
            }));
            setValue("description", description);
        },
        [setValue]
    );

    const handleOnExerciseTypeChange = useCallback(
        (exerciseType: ExerciseType) => {
            setExerciseState((prev) => ({
                ...prev,
                exerciseTypeId: exerciseType,
            }));
            setValue("exerciseType", exerciseType);
        },
        [setValue]
    );

    const handleOnInputChange = useCallback(
        (input: string, index: number) => {
            const inputs = [...exerciseState.inputs];
            const isNewInput = index >= inputs.length;

            if (isNewInput) {
                inputs.push({
                    id: null,
                    exerciseId: exerciseState.id,
                    input: input,
                    orderId: index,
                });

                setExerciseState((prev) => ({
                    ...prev,
                    inputs: inputs,
                }));
                setValue("inputs", inputs.map((x) => x.input).join("\n"));
                return;
            }

            inputs[index] = {
                ...inputs[index],
                input: input,
            };

            setExerciseState((prev) => ({
                ...prev,
                inputs: inputs,
            }));
            setValue("inputs", inputs.map((x) => x.input).join("\n"));
        },
        [exerciseState.id, exerciseState.inputs, setValue]
    );

    const handleOnOutputChange = useCallback(
        (output: string, index: number) => {
            const outputs = [...exerciseState.outputs];
            const isNewOutput = index >= outputs.length;

            if (isNewOutput) {
                outputs.push({
                    id: null,
                    exerciseInputId: null,
                    exerciseId: exerciseState.id,
                    output: output,
                    orderId: index,
                });

                setExerciseState((prev) => ({
                    ...prev,
                    outputs: outputs,
                }));
                setValue("outputs", outputs.map((x) => x.output).join("\n"));
                return;
            }

            outputs[index] = {
                ...outputs[index],
                output: output,
            };

            setExerciseState((prev) => ({
                ...prev,
                outputs: outputs,
            }));
            setValue("outputs", outputs.map((x) => x.output).join("\n"));
        },
        [exerciseState.id, exerciseState.outputs, setValue]
    );

    const handleValidConfirm = useCallback(
        async (data: EditExerciseRequest) => {
            // Use the current form values, not the potentially stale exerciseState
            await saveEdit({
                id: exerciseState.id,
                title: formValues.title,
                exerciseTypeId: formValues.exerciseType,
                description: formValues.description || "",
                estimatedTime: exerciseState.estimatedTime,
                judgeUuid: exerciseState.judgeUuid,
                createdAt: exerciseState.createdAt,
                inputs: exerciseState.inputs, // These are kept in sync by handleOnInputChange
                outputs: exerciseState.outputs, // These are kept in sync by handleOnOutputChange
                pdfFile: pdfFile || exerciseState.pdfFile, // Use existing file if no new file selected
            });
        },
        [exerciseState, formValues, pdfFile, saveEdit]
    );

    const handleInvalidConfirm: SubmitErrorHandler<EditExerciseRequestFormValues> =
        useCallback(async (errors) => {
            console.log(errors);
        }, []);

    return {
        editExerciseControl,
        formValues,
        handleValidConfirm,
        handleInvalidConfirm,
        handleEditSubmit,
        handleOnInputChange,
        handleOnOutputChange,
        handleOnTitleChange,
        handleOnDescriptionChange,
        handleOnExerciseTypeChange,
    };
};

export default useEditExerciseModal;
