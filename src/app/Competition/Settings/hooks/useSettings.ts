"use client";

import { useState, useCallback, useEffect } from "react";
import { useSnackbar } from "notistack";
import { useCompetitionHub } from "@/contexts/CompetitionHubContext";
import { convertTimeSpanToNumber, formatDateOnlyWithoutTimezone } from "@/libs/utils";

const useSettings = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { ongoingCompetition, updateCompetitionSettings, stopCompetition } = useCompetitionHub();

    const [marathonName, setMarathonName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [duration, setDuration] = useState("");
    const [stopAnswering, setStopAnswering] = useState("");
    const [stopScoreboard, setStopScoreboard] = useState("");
    const [penalty, setPenalty] = useState("");
    const [maxFileSize, setMaxFileSize] = useState("");
    const [isMarathonActive, setIsMarathonActive] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    // Load competition data when available
    useEffect(() => {
        if (ongoingCompetition) {
            setMarathonName(ongoingCompetition.name);
            
            // Format start date and time (sem conversão de timezone)
            if (ongoingCompetition.startTime) {
                const isoString = ongoingCompetition.startTime.toString();
                const datePart = isoString.split('T')[0]; // "2025-11-30"
                const timePart = isoString.split('T')[1]?.split('.')[0] || isoString.split('T')[1]?.split('Z')[0];
                
                if (datePart) {
                    const [year, month, day] = datePart.split('-');
                    setStartDate(`${day}/${month}/${year}`);
                }
                if (timePart) {
                    const [hour, minute] = timePart.split(':');
                    setStartTime(`${hour}:${minute}`);
                }
            }
            
            // Convert TimeSpan strings (HH:mm:ss) to minutes for display
            if (ongoingCompetition.duration) {
                if (typeof ongoingCompetition.duration === 'string') {
                    const durationSeconds = convertTimeSpanToNumber(ongoingCompetition.duration);
                    setDuration(String(Math.floor(durationSeconds / 60))); // Convert to minutes
                } else {
                    setDuration(String(Math.floor(ongoingCompetition.duration / 60)));
                }
            }
            
            if (ongoingCompetition.submissionPenalty) {
                if (typeof ongoingCompetition.submissionPenalty === 'string') {
                    const penaltySeconds = convertTimeSpanToNumber(ongoingCompetition.submissionPenalty);
                    setPenalty(String(Math.floor(penaltySeconds / 60))); // Convert to minutes
                } else {
                    setPenalty(String(Math.floor(ongoingCompetition.submissionPenalty / 60)));
                }
            }
            
            // Calculate stopAnswering and stopScoreboard based on EndTime difference
            if (ongoingCompetition.endTime && ongoingCompetition.blockSubmissions) {
                const endTime = new Date(ongoingCompetition.endTime).getTime();
                const blockTime = new Date(ongoingCompetition.blockSubmissions).getTime();
                const diffSeconds = Math.floor((endTime - blockTime) / 1000);
                setStopAnswering(String(Math.floor(diffSeconds / 60))); // Convert to minutes
            }
            
            if (ongoingCompetition.endTime && ongoingCompetition.stopRanking) {
                const endTime = new Date(ongoingCompetition.endTime).getTime();
                const stopRankTime = new Date(ongoingCompetition.stopRanking).getTime();
                const diffSeconds = Math.floor((endTime - stopRankTime) / 1000);
                setStopScoreboard(String(Math.floor(diffSeconds / 60))); // Convert to minutes
            }
            
            if (ongoingCompetition.maxSubmissionSize) {
                setMaxFileSize(String(ongoingCompetition.maxSubmissionSize));
            }
            
            // Check if competition is ongoing (status 3 = Ongoing)
            setIsMarathonActive(ongoingCompetition.status === 3);
        }
    }, [ongoingCompetition]);

    const handleUpdateMarathon = useCallback(async () => {
        if (!isMarathonActive) {
            enqueueSnackbar(
                "A maratona já foi finalizada e não pode ser atualizada.",
                {
                    variant: "error",
                    autoHideDuration: 2500,
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                }
            );
            return;
        }

        if (!ongoingCompetition) {
            enqueueSnackbar("Nenhuma competição encontrada.", {
                variant: "error",
                autoHideDuration: 2500,
                anchorOrigin: { vertical: "bottom", horizontal: "right" },
            });
            return;
        }

        try {
            // Convert minutes to seconds before sending to backend
            await updateCompetitionSettings({
                competitionId: ongoingCompetition.id,
                duration: Number.parseInt(duration) * 60, // Convert to seconds
                stopSubmissionsBeforeEnd: Number.parseInt(stopAnswering) * 60, // Convert to seconds
                stopRankingBeforeEnd: Number.parseInt(stopScoreboard) * 60, // Convert to seconds
                submissionPenalty: Number.parseInt(penalty) * 60, // Convert to seconds
                maxSubmissionSize: Number.parseInt(maxFileSize),
            });
        } catch (error) {
            console.error("Error updating marathon settings:", error);
        }
    }, [
        isMarathonActive,
        ongoingCompetition,
        duration,
        stopAnswering,
        stopScoreboard,
        penalty,
        maxFileSize,
        updateCompetitionSettings,
        enqueueSnackbar,
    ]);

    const handleStopMarathon = useCallback(() => {
        if (!isMarathonActive) {
            enqueueSnackbar("A maratona já foi finalizada.", {
                variant: "error",
                autoHideDuration: 2500,
                anchorOrigin: { vertical: "bottom", horizontal: "right" },
            });
            return;
        }

        setShowConfirmDialog(true);
    }, [isMarathonActive, enqueueSnackbar]);

    const confirmStopMarathon = useCallback(async () => {
        if (!ongoingCompetition) {
            enqueueSnackbar("Nenhuma competição encontrada.", {
                variant: "error",
                autoHideDuration: 2500,
                anchorOrigin: { vertical: "bottom", horizontal: "right" },
            });
            return;
        }

        try {
            await stopCompetition(ongoingCompetition.id);
            setIsMarathonActive(false);
            setShowConfirmDialog(false);
        } catch (error) {
            console.error("Error stopping marathon:", error);
        }
    }, [ongoingCompetition, stopCompetition, enqueueSnackbar]);

    return {
        marathonName,
        setMarathonName,
        startDate,
        setStartDate,
        startTime,
        setStartTime,
        duration,
        setDuration,
        stopAnswering,
        setStopAnswering,
        stopScoreboard,
        setStopScoreboard,
        penalty,
        setPenalty,
        maxFileSize,
        setMaxFileSize,
        isMarathonActive,
        setIsMarathonActive,
        handleUpdateMarathon,
        handleStopMarathon,
        showConfirmDialog,
        setShowConfirmDialog,
        confirmStopMarathon,
    };
};

export default useSettings;
