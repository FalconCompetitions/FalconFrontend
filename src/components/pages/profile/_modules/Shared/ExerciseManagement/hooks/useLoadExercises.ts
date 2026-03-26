"use client";

import { fromBase64 } from "@/libs/utils";
import ExerciseService from "@/services/ExerciseService";
import { Exercise, ExerciseType } from "@/types/Exercise";
import {
    CreateExerciseRequest,
    EditExerciseRequest,
} from "@/types/Exercise/Requests";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";

const useLoadExercises = () => {
    const [loadingExercises, setLoadingExercises] = useState<boolean>(true);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [exerciseTypeFilter, setExerciseTypeFilter] =
        useState<ExerciseType | null>(null);
    const [controllerSignal, setControllerSignal] =
        useState<AbortController | null>(null);

    const { enqueueSnackbar } = useSnackbar();

    const nextPage = useCallback(() => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    }, [currentPage, totalPages]);

    const prevPage = useCallback(() => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    }, [currentPage]);

    const resetPagination = useCallback(() => {
        setCurrentPage(1);
    }, []);

    const toggleExerciseTypeFilter = useCallback(
        (type: ExerciseType | null) => {
            setExerciseTypeFilter(type);
        },
        []
    );

    const toggleLoadingExercises = useCallback(() => {
        setLoadingExercises((prev) => !prev);
    }, []);

    const addExercise = useCallback(
        async (exercise: CreateExerciseRequest) => {
            try {
                setLoadingExercises(true);
                const payload = new FormData();
                payload.append("title", exercise.title);
                payload.append(
                    "exerciseTypeId",
                    exercise.exerciseTypeId.toString()
                );
                payload.append("description", exercise.description);
                payload.append("pdfFile", exercise.pdfFile);
                payload.append("inputs", JSON.stringify(exercise.inputs));
                payload.append("outputs", JSON.stringify(exercise.outputs));
                payload.append(
                    "estimatedTime",
                    exercise.estimatedTime.toString()
                );

                const response = await ExerciseService.createExercise(payload);

                if (response.status !== 201) {
                    enqueueSnackbar("Erro ao tentar criar exercício.", {
                        variant: "error",
                        autoHideDuration: 3000,
                        anchorOrigin: {
                            horizontal: "right",
                            vertical: "bottom",
                        },
                    });
                    return;
                }
                const data = response.data!;
                
                // Decode Base64 inputs and outputs like we do in loadExercises
                const decodedExercise = {
                    ...data,
                    inputs: data.inputs.map((input) => ({
                        ...input,
                        input: fromBase64(input.input),
                    })),
                    outputs: data.outputs.map((output) => ({
                        ...output,
                        output: fromBase64(output.output),
                    })),
                };
                
                setExercises((prev) => [...prev, decodedExercise]);

                enqueueSnackbar("Exercício criado com sucesso!", {
                    variant: "success",
                    autoHideDuration: 3000,
                    anchorOrigin: { horizontal: "right", vertical: "bottom" },
                });
            } catch (error) {
                console.error("Error adding exercise:", error);
            } finally {
                setLoadingExercises(false);
            }
        },
        [enqueueSnackbar]
    );

    const loadExercises = useCallback(
        async (searchTerm: string, exerciseType: ExerciseType | null) => {
            try {
                setLoadingExercises(true);
                if (controllerSignal) {
                    controllerSignal.abort();
                    setControllerSignal(null);
                }

                const controller = new AbortController();
                setControllerSignal(controller);

                const response = await ExerciseService.getExercisesWithSignal(
                    currentPage,
                    10,
                    searchTerm,
                    exerciseType,
                    controller.signal
                );
                const data = response.data!;

                setExercises(
                    data.items.map((item) => ({
                        ...item,
                        inputs: item.inputs.map((input) => ({
                            ...input,
                            input: fromBase64(input.input),
                        })),
                        outputs: item.outputs.map((output) => ({
                            ...output,
                            output: fromBase64(output.output),
                        })),
                    }))
                );
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Error loading exercises:", error);
                enqueueSnackbar("Erro ao carregar exercícios.", {
                    variant: "error",
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        horizontal: "right",
                        vertical: "bottom",
                    },
                });
            } finally {
                setLoadingExercises(false);
            }
        },
        [controllerSignal, currentPage, enqueueSnackbar]
    );

    const deleteExercise = useCallback(
        async (id: number) => {
            const response = await ExerciseService.deleteExercise(id);
            
            if (response.status !== 200) {
                throw new Error("Falha ao excluir o exercício.");
            }
            
            // Remove da lista local apenas se a exclusão no backend foi bem-sucedida
            setExercises((prev) => prev.filter((ex) => ex.id !== id));
        },
        [setExercises]
    );

    const updateExercise = useCallback(
        async (id: number, exerciseData: EditExerciseRequest) => {
            try {
                const payload = new FormData();
                payload.append("id", `${exerciseData.id}`);
                payload.append("title", exerciseData.title);
                payload.append(
                    "exerciseTypeId",
                    exerciseData.exerciseTypeId.toString()
                );
                payload.append("description", exerciseData.description);
                payload.append(
                    "estimatedTime",
                    exerciseData.estimatedTime.toString()
                );
                payload.append("judgeUuid", exerciseData.judgeUuid);
                payload.append("inputs", JSON.stringify(exerciseData.inputs));
                payload.append("outputs", JSON.stringify(exerciseData.outputs));

                if (exerciseData.pdfFile) {
                    payload.append("pdfFile", exerciseData.pdfFile);
                }

                const response = await ExerciseService.updateExercise(payload);

                if (response.status !== 200) {
                    throw new Error("Falha ao atualizar o exercício");
                }

                const updatedExercise = response.data!;

                // Decode Base64 inputs and outputs like we do in loadExercises
                const decodedExercise = {
                    ...updatedExercise,
                    inputs: updatedExercise.inputs.map((input) => ({
                        ...input,
                        input: fromBase64(input.input),
                    })),
                    outputs: updatedExercise.outputs.map((output) => ({
                        ...output,
                        output: fromBase64(output.output),
                    })),
                };

                setExercises((prevExercises) =>
                    prevExercises.map((ex) =>
                        ex.id === decodedExercise.id ? decodedExercise : ex
                    )
                );

                enqueueSnackbar("Exercício atualizado com sucesso!", {
                    variant: "success",
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                    autoHideDuration: 2500,
                });
            } catch (error) {
                console.error("Error updating exercise:", error);
                enqueueSnackbar("Erro ao tentar atualizar exercício!", {
                    variant: "error",
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                    autoHideDuration: 2500,
                });
            }
        },
        [enqueueSnackbar]
    );
    useEffect(() => {
        return () => {
            if (controllerSignal) {
                controllerSignal.abort();
            }
        };
    }, []);

    return {
        exercises,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        loadExercises,
        addExercise,
        deleteExercise,
        updateExercise,
        controllerSignal,
        setControllerSignal,
        toggleExerciseTypeFilter,
        exerciseTypeFilter,
        loadingExercises,
        toggleLoadingExercises,
        resetPagination,
    };
};

export default useLoadExercises;
