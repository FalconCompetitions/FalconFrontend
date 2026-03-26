import { useCallback, useMemo } from "react";
import useLoadCompetitions from "./useLoadCompetitions";
import { Competition } from "@/types/Competition";
import { CreateCompetitionRequest } from "@/types/Competition/Requests";
import CompetitionService from "@/services/CompetitionService";
import { convertTimeSpanToNumber } from "@/libs/utils";
import { enqueueSnackbar } from "notistack";

const useCompetitionContext = () => {
    const {
        templateCompetitions,
        isTemplateLoading,
        loadTemplateCompetitions,
        addNewTemplateCompetition,
        toggleTemplateLoading,
        updateTemplateCompetition,
        openSubCompetitions,
        loadOpenSubCompetitions,
        isSubCompetitionsLoading,
    } = useLoadCompetitions();


    const competitionModels = useMemo(() => {
        return templateCompetitions.filter((x) => x.status == 5);
    }, [templateCompetitions]);

    const addCompetitionModel = useCallback(
        (newCompetitionModel: Competition) => {
            addNewTemplateCompetition(newCompetitionModel);
        },
        [addNewTemplateCompetition]
    );

    const createCompetition = useCallback(
        async (payload: CreateCompetitionRequest) => {
            try {
                toggleTemplateLoading();
                const res = await CompetitionService.createCompetition(payload);

                if (res.status == 201) {
                    console.log(res.data);
                    addCompetitionModel({
                        id: res.data!.id,
                        blockSubmissions: res.data?.blockSubmissions
                            ? new Date(res.data!.blockSubmissions)
                            : null,
                        duration: res.data?.duration
                            ? Math.floor(convertTimeSpanToNumber(res.data!.duration) / 60)
                            : null,
                        endInscriptions: res.data?.endInscriptions
                            ? new Date(res.data!.endInscriptions)
                            : null,
                        endTime: res.data?.endTime
                            ? new Date(res.data!.endTime)
                            : null,
                        maxExercises: res.data!.maxExercises,
                        maxSubmissionSize: res.data!.maxSubmissionSize,
                        name: res.data!.name,
                        description: res.data?.description || "",
                        startInscriptions: res.data?.startInscriptions
                            ? new Date(res.data!.startInscriptions)
                            : null,
                        startTime: new Date(res.data!.startTime),
                        status: res.data!.status,
                        stopRanking: res.data?.stopRanking
                            ? new Date(res.data!.stopRanking)
                            : null,
                        submissionPenalty: res.data?.submissionPenalty
                            ? Math.floor(convertTimeSpanToNumber(
                                  res.data!.submissionPenalty
                              ) / 60)
                            : 0,
                        maxMembers: res.data!.maxMembers,
                        exercises: [],
                        groups: [],
                        competitionRankings: [],
                        logs: [],
                        questions: [],
                    });

                    enqueueSnackbar(
                        "Modelo de Competição criado com sucesso!",
                        {
                            variant: "success",
                            autoHideDuration: 2500,
                            anchorOrigin: {
                                vertical: "bottom",
                                horizontal: "right",
                            },
                        }
                    );
                    toggleTemplateLoading();
                    return;
                }
            } catch (error) {
                console.error("Error creating competition model:", error);
                enqueueSnackbar("Erro ao criar modelo de competição.", {
                    variant: "error",
                    autoHideDuration: 2500,
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                });
            } finally {
                toggleTemplateLoading();
            }
        },
        [addCompetitionModel, toggleTemplateLoading]
    );

    return {
        templateCompetitions,
        competitionModels,
        isTemplateLoading,
        openSubCompetitions,
        isSubCompetitionsLoading,
        loadOpenSubCompetitions,
        addCompetitionModel,
        createCompetition,
        loadTemplateCompetitions,
        addNewTemplateCompetition,
        toggleTemplateLoading,
        updateTemplateCompetition,
    };
};

export default useCompetitionContext;
