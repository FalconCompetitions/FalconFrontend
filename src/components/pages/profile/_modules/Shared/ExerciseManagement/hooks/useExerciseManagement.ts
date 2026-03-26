"use client"

import { Exercise, ExerciseType } from "@/types/Exercise";
import { useState, useCallback, useEffect, ChangeEvent } from "react";
import {
    CreateExerciseRequest,
    EditExerciseRequest,
} from "@/types/Exercise/Requests";
import useLoadExercises from "./useLoadExercises";
import {
    processCreateExerciseValues,
    processExerciseToEdit,
} from "../functions";
import { useSnackbar } from "notistack";

export const useExerciseManagement = () => {
    const {
        exercises,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        loadExercises,
        addExercise,
        deleteExercise,
        updateExercise,
        exerciseTypeFilter,
        toggleExerciseTypeFilter,
        loadingExercises,
        toggleLoadingExercises,
    } = useLoadExercises();

    const [loadingAddExercise, setLoadingAddExercise] = useState(false);

    // Estados do formulário de criação
    const [title, setTitle] = useState<string>("");
    const [type, setType] = useState<ExerciseType>(1);
    const [inputValues, setInputValues] = useState<string>("");
    const [outputValues, setOutputValues] = useState<string>("");
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    const [updatePdfFile, setUpdatePdfFile] = useState<File | null>(null);

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
        null
    );

    // Estados do modal de edição
    const [editingExercise, setEditingExercise] = useState<Exercise | null>(
        null
    );

    const { enqueueSnackbar } = useSnackbar();
    const [showEditExerciseModal, setShowEditExerciseModal] = useState(false);

    const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPdfFile(e.target.files[0]);
        }
    }, []);

    const handleUpdateFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUpdatePdfFile(e.target.files[0]);
        }
    }, []);

    const toggleEditExerciseModal = useCallback(() => {
        setShowEditExerciseModal((prev) => !prev);
    }, []);

    const getTypeColor = useCallback((exerciseType: ExerciseType) => {
        switch (exerciseType) {
            case 1:
                return "bg-blue-100 text-blue-800";
            case 2:
                return "bg-green-100 text-green-800";
            case 3:
                return "bg-purple-100 text-purple-800";
            case 4:
                return "bg-red-100 text-red-800";
            case 5:
                return "bg-indigo-100 text-indigo-800";
            case 6:
                return "bg-pink-100 text-pink-800";
            case 7:
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    }, []);

    const handleCreateExercise = useCallback(async () => {
        if (!title.trim() || !type || !pdfFile) {
            enqueueSnackbar(
                "Por favor, preencha o título, selecione o tipo e anexe um arquivo PDF.",
                {
                    variant: "warning",
                    anchorOrigin: { vertical: "bottom", horizontal: "right" }
                }
            );
            return;
        }

        const { inputs, outputs } = processCreateExerciseValues(
            inputValues,
            outputValues
        );

        const newExercise: CreateExerciseRequest = {
            title,
            exerciseTypeId: type,
            pdfFile: pdfFile,
            description: "",
            estimatedTime: 0,
            judgeUuid: null,
            inputs: inputs,
            outputs: outputs,
        };

        await addExercise(newExercise);
    }, [title, type, pdfFile, inputValues, outputValues, addExercise]);

    const handleRemoveExercise = useCallback(
        async (indexToRemove: number) => {
            try{
            if (exercises && exercises[indexToRemove]) {
                await deleteExercise(exercises[indexToRemove].id);
                enqueueSnackbar("Exercício removido com sucesso!", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "right",
                    },
                    autoHideDuration: 2500,
                });
            }
            } catch (error) {
                console.error("Error removing exercise:", error);
                enqueueSnackbar("Erro ao tentar remover exercício!", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "right",
                    },
                    autoHideDuration: 2500,
                });
            }
        },
        [deleteExercise, enqueueSnackbar, exercises]
    );

    const startEdit = useCallback(
        (exercise: Exercise) => {
            // Exercises are already decoded in the list, no need to decode again
            setEditingExercise(exercise);
            toggleEditExerciseModal();
        },
        [toggleEditExerciseModal]
    );

    const saveEdit = useCallback(
        async (exercise: EditExerciseRequest) => {
            if (!editingExercise || editingExercise.id == -1) return;

            const { inputs, outputs } = processExerciseToEdit(exercise);

            // Use updatePdfFile if provided, otherwise use the existing PDF file from exercise
            const pdfToUse = updatePdfFile || exercise.pdfFile;

            await updateExercise(exercise.id, {
                id: exercise.id,
                description: exercise.description,
                judgeUuid: exercise.judgeUuid!,
                inputs: inputs,
                outputs: outputs,
                exerciseTypeId: exercise.exerciseTypeId,
                title: exercise.title,
                createdAt: exercise.createdAt,
                estimatedTime: exercise.estimatedTime,
                pdfFile: pdfToUse
            });

            // Reset the update file after saving
            setUpdatePdfFile(null);
            toggleEditExerciseModal();
        },
        [editingExercise, updatePdfFile, toggleEditExerciseModal, updateExercise]
    );

    const handleLoadExercises = useCallback(async () => {
        await loadExercises(searchTerm, exerciseTypeFilter);
    }, [loadExercises, searchTerm, exerciseTypeFilter]);

    const cancelEdit = useCallback(() => {
        toggleEditExerciseModal();
        setEditingExercise(null);
    }, [toggleEditExerciseModal]);

    useEffect(() => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        setSearchTimeout(
            setTimeout(() => {
                handleLoadExercises();
            }, 1000)
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, exerciseTypeFilter]);

    return {
        title,
        setTitle,
        type,
        setType,
        exerciseTypeFilter,
        toggleExerciseTypeFilter,
        pdfFile,
        updatePdfFile,
        handleFileChange,
        searchTerm,
        setSearchTerm,
        exercises,
        editingExercise,
        showEditExerciseModal,
        toggleEditExerciseModal,
        handleCreateExercise,
        handleRemoveExercise,
        startEdit,
        saveEdit,
        cancelEdit,
        getTypeColor,
        inputValues,
        setInputValues,
        outputValues,
        setOutputValues,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        handleLoadExercises,
        handleUpdateFileChange,
        loadingExercises,
    };
};
