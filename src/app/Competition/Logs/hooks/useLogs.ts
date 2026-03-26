"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useCompetitionHub } from "@/contexts/CompetitionHubContext";
import type { LogResponse } from "@/types/SignalR";

/**
 * Represents a single log entry for display in the table.
 */
export interface LogData {
    id: number;
    teamName: string;
    userName: string;
    ip: string;
    actionTime: string;
    action: string;
    actionType: number;
}

interface Column {
    id: keyof LogData;
    label: string;
    minWidth?: number;
    align?: "right" | "left" | "center";
    format?: (value: number | string) => string;
}

const columns: readonly Column[] = [
    { id: "actionTime", label: "Data/Hora", minWidth: 180, align: "center" },
    { id: "teamName", label: "Equipe", minWidth: 150, align: "center" },
    { id: "userName", label: "Usuário", minWidth: 150, align: "center" },
    { id: "action", label: "Ação", minWidth: 300, align: "left" },
    { id: "ip", label: "IP", minWidth: 130, align: "center" },
];

/**
 * Hook for managing competition logs display.
 * Shows all individual log entries with human-readable descriptions.
 */
const useLogs = () => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [logs, setLogs] = useState<LogResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { requestLogs, isConnected, ongoingCompetition } =
        useCompetitionHub();

    // Load logs when connected and competition is available
    useEffect(() => {
        if (isConnected && ongoingCompetition) {
            setIsLoading(true);
            requestLogs()
                .then((fetchedLogs) => {
                    setLogs(fetchedLogs);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else if (!isConnected) {
            setIsLoading(false);
        }
    }, [isConnected, ongoingCompetition, requestLogs]);

    // Transform logs into LogData format for the table
    const rows = useMemo((): LogData[] => {
        return logs.map((log) => {
            const actionTime = new Date(log.actionTime).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });

            return {
                id: log.id,
                teamName: log.groupName || "N/A",
                userName: log.userName || "N/A",
                ip: log.ipAddress || "N/A",
                actionTime: actionTime,
                action: log.actionDescription || getActionDescription(log.actionType, log.userName, log.groupName),
                actionType: log.actionType,
            };
        });
    }, [logs]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return {
        page,
        rowsPerPage,
        handleChangePage,
        handleChangeRowsPerPage,
        rows,
        columns,
        isLoading,
    };
};

/**
 * Helper to get action description from action type (fallback).
 * This should match the backend LogType enum values.
 */
const getActionDescription = (actionType: number, userName?: string | null, groupName?: string | null): string => {
    const user = userName || "Usuário";
    const group = groupName || "Grupo";

    const actions: { [key: number]: string } = {
        0: `${user} realizou uma ação`,           // UserAction
        1: "Ação do sistema",                      // SystemAction
        2: `${user} (${group}) entrou na competição`,  // Login
        3: `${user} (${group}) saiu da competição`,    // Logout
        4: `${group} enviou uma submissão de exercício`, // SubmittedExercise
        5: `${group} foi bloqueado na competição`,     // GroupBlockedInCompetition
        6: `${group} foi desbloqueado na competição`,  // GroupUnblockedInCompetition
        7: `${group} enviou uma pergunta`,             // QuestionSent
        8: `Pergunta de ${group} foi respondida`,      // AnswerGiven
        9: "Configurações da competição foram atualizadas", // CompetitionUpdated
        10: "Competição foi finalizada manualmente",   // CompetitionFinished
    };
    return actions[actionType] || "Ação desconhecida";
};

export default useLogs;
