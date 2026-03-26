"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Badge } from "@/components/_ui/Badge";
import { useCompetitionHub } from "@/contexts/CompetitionHubContext";

interface ExerciseSubmission {
    id: string;
    groupName: string;
    submissionTime: string;
    status: "pending" | "approved" | "rejected";
    errorType: string | null;
    fileName: string;
    fileUrl: string;
}

const useManualCorrection = () => {
    const { requestSubmissions, isConnected, changeJudgeResponse } =
        useCompetitionHub();
    const [submissions, setSubmissions] = useState<ExerciseSubmission[]>([]);
    const [selectedSubmission, setSelectedSubmission] =
        useState<ExerciseSubmission | null>(null);
    const [feedback, setFeedback] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true);

    // Load submissions from SignalR when connected
    useEffect(() => {
        if (!isConnected) {
            setIsLoading(false);
            return;
        }

        const loadSubmissions = async () => {
            setIsLoading(true);
            try {
                const submissionsData = await requestSubmissions();

                // Transform SubmissionForReviewResponse[] to ExerciseSubmission[]
                const transformedSubmissions: ExerciseSubmission[] =
                    submissionsData.map((s) => {
                        // Map judge response to status
                        let status: "pending" | "approved" | "rejected" =
                            "pending";
                        let errorType: string | null = null;

                        if (s.judgeResponse === 0) {
                            // Accepted
                            status = "approved";
                        } else if (s.judgeResponse === 9) {
                            // Pending
                            status = "pending";
                        } else {
                            status = "rejected";
                            // Map judge response to error type
                            const errorTypes = [
                                "Accepted",
                                "Resposta Incorreta",
                                "Tempo Limite Excedido",
                                "Memória Excedida",
                                "Erro de Execução",
                                "Erro de Compilação",
                                "Erro de Apresentação",
                                "Limite de Saída Excedido",
                                "Erro Interno",
                                "Pendente",
                            ];
                            errorType =
                                errorTypes[s.judgeResponse] ||
                                "Erro Desconhecido";
                        }

                        return {
                            id: s.id.toString(),
                            groupName: s.group?.name || "Grupo Desconhecido",
                            submissionTime: new Date(
                                s.submissionTime
                            ).toLocaleString("pt-BR"),
                            status,
                            errorType,
                            fileName: `${
                                s.exerciseName || "exercicio"
                            }.${getExtension(s.language)}`,
                            fileUrl: "#", // URL would come from backend if available
                        };
                    });

                setSubmissions(transformedSubmissions);
            } catch (error) {
                console.error("Error loading submissions:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadSubmissions();
    }, [isConnected, requestSubmissions]);

    // Helper function to get file extension from language type
    const getExtension = (language: number): string => {
        const extensions = ["c", "cpp", "java", "py", "js", "go", "php", "cs"];
        return extensions[language] || "txt";
    };

    const handleApprove = useCallback(
        async (id: string) => {
            try {
                // Call SignalR to change judge response to Accepted (0)
                await changeJudgeResponse({
                    submissionId: parseInt(id),
                    newJudgeResponse: 0, // Accepted
                });

                // Update local state optimistically
                setSubmissions((prev) =>
                    prev.map((sub) =>
                        sub.id === id
                            ? { ...sub, status: "approved", errorType: null }
                            : sub
                    )
                );
            } catch (error) {
                console.error("Error approving submission:", error);
            }
        },
        [changeJudgeResponse]
    );

    const handleReject = useCallback(
        async (id: string, errorType: string) => {
            try {
                // Map error type back to judge response
                const errorTypes = [
                    "Accepted",
                    "Resposta Incorreta",
                    "Tempo Limite Excedido",
                    "Memória Excedida",
                    "Erro de Execução",
                    "Erro de Compilação",
                    "Erro de Apresentação",
                    "Limite de Saída Excedido",
                    "Erro Interno",
                    "Pendente",
                ];
                const judgeResponse = errorTypes.indexOf(errorType);

                // Call SignalR to change judge response
                await changeJudgeResponse({
                    submissionId: parseInt(id),
                    newJudgeResponse: judgeResponse >= 0 ? judgeResponse : 1, // Default to WrongAnswer
                });

                // Update local state optimistically
                setSubmissions((prev) =>
                    prev.map((sub) =>
                        sub.id === id
                            ? { ...sub, status: "rejected", errorType }
                            : sub
                    )
                );
                setSelectedSubmission(null);
                setFeedback("");
            } catch (error) {
                console.error("Error rejecting submission:", error);
            }
        },
        [changeJudgeResponse]
    );

    const handleDownload = useCallback((fileUrl: string, fileName: string) => {
        console.log(`Baixando arquivo: ${fileName} de ${fileUrl}`);
        alert(`Download iniciado: ${fileName}`);
    }, []);

    const getStatusBadge = useCallback(
        (status: ExerciseSubmission["status"]) => {
            if (status === "approved") {
                return Badge({
                    className: "bg-green-100 text-green-800 hover:bg-green-100",
                    children: "Aprovado",
                });
            }
            if (status === "rejected") {
                return Badge({
                    className: "bg-red-100 text-red-800 hover:bg-red-100",
                    children: "Reprovado",
                });
            }
            if (status === "pending") {
                return Badge({
                    className:
                        "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
                    children: "Pendente",
                });
            }
            return Badge({ variant: "secondary", children: "Desconhecido" });
        },
        []
    );

    const totalPages = useMemo(
        () => Math.ceil(submissions.length / itemsPerPage),
        [submissions.length, itemsPerPage]
    );
    const startIndex = useMemo(
        () => (currentPage - 1) * itemsPerPage,
        [currentPage, itemsPerPage]
    );
    const endIndex = useMemo(
        () => startIndex + itemsPerPage,
        [startIndex, itemsPerPage]
    );
    const currentSubmissions = useMemo(
        () => submissions.slice(startIndex, endIndex),
        [submissions, startIndex, endIndex]
    );

    const handleOpenRejectDialog = useCallback(
        (submission: ExerciseSubmission) => {
            setSelectedSubmission(submission);
            setFeedback("");
        },
        []
    );

    const handleCloseRejectDialog = useCallback(() => {
        setSelectedSubmission(null);
        setFeedback("");
    }, []);

    const handleConfirmReject = useCallback(() => {
        if (selectedSubmission && feedback.trim()) {
            handleReject(selectedSubmission.id, feedback.trim());
        }
    }, [selectedSubmission, feedback, handleReject]);

    return {
        submissions,
        selectedSubmission,
        feedback,
        setFeedback,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        handleApprove,
        handleDownload,
        getStatusBadge,
        totalPages,
        currentSubmissions,
        handleOpenRejectDialog,
        handleCloseRejectDialog,
        handleConfirmReject,
        isLoading,
    };
};

export default useManualCorrection;
