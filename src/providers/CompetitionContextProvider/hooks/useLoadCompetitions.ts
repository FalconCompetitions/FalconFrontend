import { convertTimeSpanToNumber } from "@/libs/utils";
import CompetitionService from "@/services/CompetitionService";
import { Competition } from "@/types/Competition";
import { UpdateCompetitionRequest } from "@/types/Competition/Requests";
import { useSnackbar } from "notistack";
import { useCallback, useState } from "react";

export const useLoadCompetitions = () => {
    const [templateCompetitions, setTemplateCompetitions] = useState<Competition[]>([]);
    const [isTemplateLoading, setIsTemplateLoading] = useState<boolean>(true);

    const [openSubCompetitions, setOpenSubCompetitions] = useState<Competition[]>([]);
    const [isSubCompetitionsLoading, setIsSubCompetitionsLoading] = useState<boolean>(false);

    const { enqueueSnackbar } = useSnackbar();

    const addNewTemplateCompetition = useCallback((newCompetition: Competition) => {
        setTemplateCompetitions((prev) => [...prev, newCompetition]);
    }, []);

    const toggleTemplateLoading = useCallback(() => {
        setIsTemplateLoading((prev) => !prev);
    }, []);

    const loadOpenSubCompetitions = useCallback(async () => {
        setIsSubCompetitionsLoading(true);
        try {
            const response = await CompetitionService.getCompetitionsOpenForInscription();
            if (response.status !== 200) {
                enqueueSnackbar("Erro ao carregar competições abertas.", {
                    variant: "error",
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                    autoHideDuration: 3000,
                });
                setIsSubCompetitionsLoading(false);
                return;
            }
            setOpenSubCompetitions(response.data!);
        } catch (error) {
            console.error("Error loading open sub competitions:", error);
            enqueueSnackbar("Erro ao carregar competições abertas.", {
                variant: "error",
                anchorOrigin: { vertical: "bottom", horizontal: "right" },
                autoHideDuration: 3000,
            });
        } finally {
            setIsSubCompetitionsLoading(false);
        }
    }, [enqueueSnackbar]);

    const loadTemplateCompetitions = useCallback(async () => {
        setIsTemplateLoading(true);

        try {
            const response = await CompetitionService.getCompetitionTemplates();
            if (response.status !== 200) {
                enqueueSnackbar("Erro ao carregar modelos de competições.", {
                    variant: "error",
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                    autoHideDuration: 3000,
                });
                setIsTemplateLoading(false);
                return;
            }

            const data = response.data!;

            data.forEach((comp) => {
                comp.duration = comp.duration 
                    ? Math.floor(convertTimeSpanToNumber(comp.duration as unknown as string) / 60)
                    : 90;
                comp.submissionPenalty = comp.submissionPenalty
                    ? Math.floor(convertTimeSpanToNumber(comp.submissionPenalty as unknown as string) / 60)
                    : 20;
                comp.maxExercises = comp.maxExercises ?? 4;
                comp.maxSubmissionSize = comp.maxSubmissionSize ?? 20;
                comp.stopRanking = null;
                comp.blockSubmissions = null;
                comp.startInscriptions = new Date(comp.startInscriptions!);
                comp.endInscriptions = new Date(comp.endInscriptions!);
                comp.startTime = new Date(comp.startTime!);
                comp.endTime = comp.endTime ? new Date(comp.endTime) : null;
            });

            setTemplateCompetitions(data);

            setIsTemplateLoading(false);
        } catch (error) {
            console.error("Error loading competitions:", error);
            enqueueSnackbar("Erro ao carregar modelos de competições.", {
                variant: "error",
                anchorOrigin: { vertical: "bottom", horizontal: "right" },
                autoHideDuration: 3000,
            });
            setIsTemplateLoading(false);
        }
    }, [enqueueSnackbar, setIsTemplateLoading]);

    const updateTemplateCompetition = useCallback(
        async (data: UpdateCompetitionRequest) => {
            try {
                setIsTemplateLoading(true);
                const response = await CompetitionService.updateCompetition(
                    data
                );
                if (response.status !== 200) {
                    enqueueSnackbar("Erro ao atualizar ou criar competição.", {
                        variant: "error",
                        anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "right",
                        },
                        autoHideDuration: 3000,
                    });
                    setIsTemplateLoading(false);
                    return;
                }
                setTemplateCompetitions((prev) =>
                    prev.map((comp) =>
                        comp.id === response.data!.id
                            ? ({
                                id: response.data!.id,
                                name: response.data!.name,
                                description: response.data!.description || "",
                                blockSubmissions: response.data
                                    ?.blockSubmissions
                                    ? new Date(
                                        response.data!.blockSubmissions
                                    )
                                    : null,
                                duration: response.data?.duration
                                    ? Math.floor(convertTimeSpanToNumber(
                                        response.data!.duration
                                    ) / 60)
                                    : null,
                                startInscriptions: response.data
                                    ?.startInscriptions
                                    ? new Date(
                                        response.data!.startInscriptions
                                    )
                                    : null,
                                endInscriptions: response.data
                                    ?.endInscriptions
                                    ? new Date(response.data!.endInscriptions)
                                    : null,
                                startTime: new Date(response.data!.startTime),
                                endTime: new Date(response.data!.endTime),
                                maxExercises: response.data!.maxExercises,
                                maxSubmissionSize: response.data!.maxSubmissionSize,
                                submissionPenalty: response.data?.submissionPenalty
                                    ? Math.floor(convertTimeSpanToNumber(
                                        response.data!.submissionPenalty
                                    ) / 60)
                                    : 0,
                                stopRanking: response.data?.stopRanking
                                    ? new Date(
                                        response.data!.stopRanking
                                    )
                                    : null,
                                status: response.data!.status,
                                maxMembers: null,
                                exercises: [],
                                groups: [],
                                competitionRankings: [],
                                logs: [],
                                questions: [],
                            } satisfies Competition)
                            : comp
                    )
                );
            } catch (error) {
                console.error("Error updating competition:", error);
                enqueueSnackbar("Erro ao atualizar ou criar competição.", {
                    variant: "error",
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                    autoHideDuration: 3000,
                });
            } finally {
                setIsTemplateLoading(false);
            }
        },
        [enqueueSnackbar, setIsTemplateLoading]
    );

    return {
        loadTemplateCompetitions,
        templateCompetitions,
        isTemplateLoading,
        updateTemplateCompetition,
        toggleTemplateLoading,
        addNewTemplateCompetition,
        openSubCompetitions,
        isSubCompetitionsLoading,
        loadOpenSubCompetitions,
    };
};

export default useLoadCompetitions;
