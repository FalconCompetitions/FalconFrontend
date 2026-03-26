"use client";

import { useState, useEffect, useMemo } from "react";
import type { CompetitionSubmissionData } from "@/types/SignalR";
import { useCompetitionHub } from "@/contexts/CompetitionHubContext";
import { JudgeResponseEnum, getJudgeResponseMessage } from "@/types/Exercise";

interface Column {
    id: string;
    label: string;
    minWidth?: number;
    align?: "right" | "left" | "center";
    format?: (value: number | string) => string;
}

interface CorrectTeamData {
    time: string;
    points: number;
    exerciseDescription: string;
    teamName: string;
}

interface WrongTeamData {
    time: string;
    exerciseDescription: string;
    teamName: string;
    errorType: string;
}

const correctColumns: readonly Column[] = [
    { id: "time", label: "Tempo", minWidth: 300, align: "center" },
    { id: "points", label: "Pontos (min)", minWidth: 300, align: "center" },
    {
        id: "exerciseDescription",
        label: "Descrição",
        minWidth: 150,
        align: "center",
    },
    { id: "teamName", label: "Nome do Time", minWidth: 200, align: "center" },
];

const wrongColumns: readonly Column[] = [
    { id: "time", label: "Tempo", minWidth: 250, align: "center" },
    { id: "teamName", label: "Nome do Time", minWidth: 350, align: "center" },
    {
        id: "exerciseDescription",
        label: "Descrição do Erro",
        minWidth: 250,
        align: "center",
    },
    { id: "errorType", label: "Tipo de Erro", minWidth: 250, align: "center" },
];

const useSubmissions = (currentTable: "correct" | "wrong") => {
    const [submissions, setSubmissions] = useState<CompetitionSubmissionData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { requestSubmissions, isConnected } = useCompetitionHub();

    // Fetch submissions from the backend via SignalR
    useEffect(() => {
        const fetchSubmissions = async () => {
            if (!isConnected) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const data = await requestSubmissions();
                setSubmissions(data);
            } catch (error) {
                console.error("Error fetching submissions:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubmissions();
    }, [isConnected, requestSubmissions]);

    const rows = useMemo(() => {
        if (currentTable === "correct") {
            return submissions
                .filter((s) => s.judgeResponse === 0 && s.accepted === true)
                .map((s) => ({
                    time: new Date(s.submissionTime).toLocaleString("pt-BR"),
                    points: 100,
                    exerciseDescription: `${
                        s.group?.name || "Grupo"
                    } recebeu o Balão por acertar ${
                        s.exerciseName || "exercício"
                    }`,
                    teamName: s.group?.name || "Grupo desconhecido",
                }));
        } else {
            return submissions
                .filter((s) => s.judgeResponse !== 0 || s.accepted === false)
                .map((s) => ({
                    time: new Date(s.submissionTime).toLocaleString("pt-BR"),
                    exerciseDescription: `${s.group?.name || "Grupo"} tentou ${
                        s.exerciseName || "exercício"
                    }`,
                    teamName: s.group?.name || "Grupo desconhecido",
                    errorType: getJudgeResponseMessage(s.judgeResponse as JudgeResponseEnum),
                }));
        }
    }, [currentTable, submissions]);

    const displayedColumns = useMemo(() => {
        return currentTable === "correct" ? correctColumns : wrongColumns;
    }, [currentTable]);

    const title = useMemo(() => {
        return currentTable === "correct"
            ? "Relatório de Exercícios Corretos"
            : "Relatório de Exercícios Errados";
    }, [currentTable]);

    return {
        rows,
        displayedColumns,
        title,
        isLoading,
    };
};

export default useSubmissions;
