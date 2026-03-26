import { useMemo, useEffect } from "react";
import { useCompetitionHub } from "@/contexts/CompetitionHubContext";

/**
 * Hook for monitoring competition status and connection.
 */
export const useCompetitionStatus = () => {
    const { ongoingCompetition, isConnected, ping } = useCompetitionHub();

    /**
     * Check if there's an active competition.
     */
    const hasActiveCompetition = useMemo(() => {
        return ongoingCompetition != null;
    }, [ongoingCompetition]);

    /**
     * Get competition status.
     */
    const competitionStatus = useMemo(() => {
        if (!ongoingCompetition) return null;

        const now = new Date();
        const startTime = new Date(ongoingCompetition.startTime);
        const endTime = ongoingCompetition.endTime
            ? new Date(ongoingCompetition.endTime)
            : null;

        return {
            isStarted: now >= startTime,
            isEnded: endTime ? now >= endTime : false,
            isOngoing: now >= startTime && (!endTime || now < endTime),
        };
    }, [ongoingCompetition]);

    /**
     * Check if submissions are allowed.
     */
    const canSubmit = useMemo(() => {
        if (!ongoingCompetition || !competitionStatus) return false;

        const now = new Date();
        const blockSubmissions = ongoingCompetition.blockSubmissions
            ? new Date(ongoingCompetition.blockSubmissions)
            : null;

        return (
            competitionStatus.isOngoing &&
            (!blockSubmissions || now < blockSubmissions)
        );
    }, [ongoingCompetition, competitionStatus]);

    /**
     * Check if ranking is still being updated.
     */
    const isRankingActive = useMemo(() => {
        if (!ongoingCompetition) return false;

        const now = new Date();
        const stopRanking = ongoingCompetition.stopRanking
            ? new Date(ongoingCompetition.stopRanking)
            : null;

        return !stopRanking || now < stopRanking;
    }, [ongoingCompetition]);

    /**
     * Get time remaining until competition ends.
     */
    const timeRemaining = useMemo(() => {
        if (!ongoingCompetition?.endTime) return null;

        const now = new Date();
        const endTime = new Date(ongoingCompetition.endTime);
        const diff = endTime.getTime() - now.getTime();

        if (diff <= 0) return null;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return { hours, minutes, seconds, totalSeconds: Math.floor(diff / 1000) };
    }, [ongoingCompetition]);

    /**
     * Periodic health check (ping every 30 seconds).
     * Also validates competition data is still valid.
     */
    useEffect(() => {
        if (!isConnected) return;

        const interval = setInterval(() => {
            ping();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [isConnected, ping]);

    return {
        ongoingCompetition,
        isConnected,
        hasActiveCompetition,
        competitionStatus,
        canSubmit,
        isRankingActive,
        timeRemaining,
        ping,
    };
};
