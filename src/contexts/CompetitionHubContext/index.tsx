"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useWebSocketContext } from "@/contexts/WebSocketContext";
import { useSnackbar } from "notistack";
import { HubConnectionState } from "@microsoft/signalr";
import {
    OnConnectionResponse,
    ExerciseSubmissionResponse,
    QuestionResponse,
    AnswerResponse,
    CompetitionRankingResponse,
    GroupInCompetitionResponse,
    LogResponse,
    CompetitionSubmissionData,
    UpdateCompetitionSettingsResponse,
    StopCompetitionResponse,
} from "@/types/SignalR";
import {
    GroupExerciseAttemptRequest,
    CreateGroupQuestionRequest,
    AnswerGroupQuestionRequest,
    RevokeGroupSubmissionRequest,
    BlockGroupSubmissionRequest,
    UnblockGroupSubmissionRequest,
    UpdateCompetitionSettingsRequest,
} from "@/types/SignalR/Requests";
import { JudgeResponseEnum, getJudgeResponseMessage } from "@/types/Exercise";

/**
 * Context type for Competition Hub functionality.
 */
interface CompetitionHubContextType {
    /**
     * Current ongoing competition data.
     */
    ongoingCompetition: OnConnectionResponse;

    /**
     * List of all submissions in real-time.
     */
    submissions: ExerciseSubmissionResponse[];

    /**
     * List of all questions in real-time.
     */
    questions: QuestionResponse[];

    /**
     * Current competition ranking.
     */
    ranking: CompetitionRankingResponse[];

    /**
     * Whether the hub is connected and ready.
     */
    isConnected: boolean;

    /**
     * Send an exercise submission.
     */
    sendExerciseAttempt: (request: GroupExerciseAttemptRequest) => Promise<void>;

    /**
     * Send a question during competition.
     */
    sendQuestion: (request: CreateGroupQuestionRequest) => Promise<void>;

    /**
     * Answer a question (Admin/Teacher only).
     */
    answerQuestion: (request: AnswerGroupQuestionRequest) => Promise<void>;

    /**
     * Manually change a submission's judge response (Admin/Teacher only).
     */
    changeJudgeResponse: (request: RevokeGroupSubmissionRequest) => Promise<void>;

    /**
     * Block a group from submitting (Admin/Teacher only).
     */
    blockGroupSubmission: (request: BlockGroupSubmissionRequest) => Promise<void>;

    /**
     * Unblock a group's submission capability (Admin/Teacher only).
     */
    unblockGroupSubmission: (request: UnblockGroupSubmissionRequest) => Promise<void>;

    /**
     * Ping the hub for health check.
     */
    ping: () => Promise<void>;

    /**
     * Request all questions for the current competition.
     */
    requestQuestions: () => Promise<void>;

    /**
     * Request full ranking for the current competition.
     */
    requestRanking: () => Promise<void>;

    /**
     * Request logs for the current competition (Admin/Teacher only).
     */
    requestLogs: () => Promise<LogResponse[]>;

    /**
     * Request groups for the current competition (Admin/Teacher only).
     */
    requestGroups: () => Promise<GroupInCompetitionResponse[]>;

    /**
     * Request submissions for manual correction (Admin/Teacher only).
     */
    requestSubmissions: () => Promise<CompetitionSubmissionData[]>;

    /**
     * Update competition settings (Admin/Teacher only).
     * Time values should be in seconds.
     */
    updateCompetitionSettings: (request: UpdateCompetitionSettingsRequest) => Promise<UpdateCompetitionSettingsResponse>;

    /**
     * Stop a competition immediately (Admin/Teacher only).
     */
    stopCompetition: (competitionId: number) => Promise<StopCompetitionResponse>;
}

const CompetitionHubContext = createContext<CompetitionHubContextType | null>(null);

/**
 * Provider component for Competition Hub context.
 */
export const CompetitionHubProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { webSocketConnection } = useWebSocketContext();
    const { enqueueSnackbar } = useSnackbar();

    const [ongoingCompetition, setOngoingCompetition] = useState<OnConnectionResponse>(null);
    const [submissions, setSubmissions] = useState<ExerciseSubmissionResponse[]>([]);
    const [questions, setQuestions] = useState<QuestionResponse[]>([]);
    const [ranking, setRanking] = useState<CompetitionRankingResponse[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    // Helper function to check if WebSocket is ready
    const isWebSocketConnected = useCallback(() => {
        return webSocketConnection !== null && webSocketConnection.state === HubConnectionState.Connected;
    }, [webSocketConnection]);

    // ==================== Event Listeners ====================

    useEffect(() => {
        if (!webSocketConnection) return;

        // Connection established - receive competition data
        webSocketConnection.on("OnConnectionResponse", (data: OnConnectionResponse) => {
            console.log("📡 OnConnectionResponse:", data);
            setRanking(data?.competitionRankings || []);
            console.log(data?.competitionRankings);
            setOngoingCompetition(data);
            setIsConnected(true);
        });

        // Listen for competition updates (when competition starts, ends, or settings change)
        webSocketConnection.on("ReceiveCompetitionUpdate", (data: OnConnectionResponse) => {
            console.log("🔄 ReceiveCompetitionUpdate:", data);
            setOngoingCompetition(data);
            if (data) {
                setRanking(data.competitionRankings || []);
            }
        });

        // Listen for competition ended event
        webSocketConnection.on("ReceiveCompetitionEnded", () => {
            console.log("🏁 ReceiveCompetitionEnded");
            setOngoingCompetition(null);
            setRanking([]);
            setQuestions([]);
            setSubmissions([]);
            setIsConnected(false);
            
            enqueueSnackbar("A competição foi encerrada", {
                variant: "info",
                autoHideDuration: 5000,
                anchorOrigin: { vertical: "bottom", horizontal: "right" },
            });
        });

        // Pong response for health check
        webSocketConnection.on("Pong", (response: { message: string }) => {
            console.log("🏓 Pong:", response.message);
        });

        // Exercise submission error - validation failed before processing
        webSocketConnection.on("ReceiveExerciseAttemptError", (error: { message: string }) => {
            console.error("❌ ReceiveExerciseAttemptError:", error);
            enqueueSnackbar(error.message, {
                variant: "error",
                autoHideDuration: 5000,
                anchorOrigin: { vertical: "bottom", horizontal: "right" },
            });
        });

        // Exercise submission responses - for the student who submitted
        webSocketConnection.on("ReceiveExerciseAttemptResponse", (submission: ExerciseSubmissionResponse | null) => {
            console.log("📝 ReceiveExerciseAttemptResponse:", submission);
            if (submission) {
                setSubmissions((prev) => {
                    const exists = prev.find(s => s.id === submission.id);
                    if (exists) {
                        return prev.map(s => s.id === submission.id ? submission : s);
                    }
                    return [...prev, submission];
                });

                const isAccepted = submission.judgeResponse === JudgeResponseEnum.Accepted;
                const judgeMessage = getJudgeResponseMessage(submission.judgeResponse);
                enqueueSnackbar(`Submissão: ${judgeMessage}`, {
                    variant: isAccepted ? "success" : "error",
                    autoHideDuration: 4000,
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                });
            }
        });

        // Exercise submission notifications - for admins/teachers
        webSocketConnection.on("ReceiveExerciseAttempt", (submission: ExerciseSubmissionResponse) => {
            console.log("📝 ReceiveExerciseAttempt (Admin/Teacher):", submission);
            setSubmissions((prev) => {
                const exists = prev.find(s => s.id === submission.id);
                if (exists) {
                    return prev.map(s => s.id === submission.id ? submission : s);
                }
                return [...prev, submission];
            });
        });

        // Ranking update - broadcast to all participants
        webSocketConnection.on("ReceiveRankingUpdate", (rankingUpdate: CompetitionRankingResponse) => {
            console.log("🏆 ReceiveRankingUpdate:", rankingUpdate);
            setRanking((prev) => {
                const exists = prev.find(r => r.group.id === rankingUpdate.group.id);
                if (exists) {
                    return prev.map(r => r.group.id === rankingUpdate.group.id ? rankingUpdate : r)
                        .sort((a, b) => a.rankOrder - b.rankOrder);
                }
                return [...prev, rankingUpdate].sort((a, b) => a.rankOrder - b.rankOrder);
            });
        });

        // Question creation response - for the student who asked
        webSocketConnection.on("ReceiveQuestionCreationResponse", (question: QuestionResponse | null) => {
            console.log("❓ ReceiveQuestionCreationResponse:", question);
            if (question) {
                setQuestions((prev) => {
                    const exists = prev.find(q => q.id === question.id);
                    if (exists) return prev;
                    return [...prev, question];
                });

                enqueueSnackbar("Pergunta enviada com sucesso!", {
                    variant: "success",
                    autoHideDuration: 2500,
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                });
            }
        });

        // Question creation notification - for admins/teachers
        webSocketConnection.on("ReceiveQuestionCreation", (question: QuestionResponse) => {
            console.log("❓ ReceiveQuestionCreation (Admin/Teacher):", question);
            setQuestions((prev) => {
                const exists = prev.find(q => q.id === question.id);
                if (exists) return prev;
                return [...prev, question];
            });

            enqueueSnackbar("Nova pergunta recebida!", {
                variant: "info",
                autoHideDuration: 2500,
                anchorOrigin: { vertical: "bottom", horizontal: "right" },
            });
        });

        // Answer response - for the person who answered
        webSocketConnection.on("ReceiveQuestionAnswerResponse", (answer: AnswerResponse | null) => {
            console.log("💬 ReceiveQuestionAnswerResponse:", answer);
            if (answer) {
                setQuestions((prev) =>
                    prev.map((q) =>
                        q.id === answer.questionId ? { ...q, answer } : q
                    )
                );

                enqueueSnackbar("Resposta enviada com sucesso!", {
                    variant: "success",
                    autoHideDuration: 2500,
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                });
            }
        });

        // Answer notification - for admins/teachers
        webSocketConnection.on("ReceiveQuestionAnswer", (answer: AnswerResponse) => {
            console.log("💬 ReceiveQuestionAnswer (Admin/Teacher):", answer);
            setQuestions((prev) =>
                prev.map((q) =>
                    q.id === answer.questionId ? { ...q, answer } : q
                )
            );
        });

        // Judge response change result
        webSocketConnection.on("ReceiveChangeJudgeSubmissionResponse", (success: boolean) => {
            console.log("⚖️ ReceiveChangeJudgeSubmissionResponse:", success);
            if (success) {
                enqueueSnackbar("Resposta do juiz alterada com sucesso!", {
                    variant: "success",
                    autoHideDuration: 2500,
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                });
            } else {
                enqueueSnackbar("Falha ao alterar resposta do juiz.", {
                    variant: "error",
                    autoHideDuration: 2500,
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                });
            }
        });

        // Block group submission result
        webSocketConnection.on("ReceiveBlockGroupSubmissionResponse", (success: boolean) => {
            console.log("🚫 ReceiveBlockGroupSubmissionResponse:", success);
            if (success) {
                enqueueSnackbar("Grupo bloqueado com sucesso!", {
                    variant: "success",
                    autoHideDuration: 2500,
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                });
            } else {
                enqueueSnackbar("Falha ao bloquear grupo.", {
                    variant: "error",
                    autoHideDuration: 2500,
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                });
            }
        });

        // Unblock group submission result
        webSocketConnection.on("ReceiveUnblockGroupSubmissionResponse", (success: boolean) => {
            console.log("✅ ReceiveUnblockGroupSubmissionResponse:", success);
            if (success) {
                enqueueSnackbar("Grupo desbloqueado com sucesso!", {
                    variant: "success",
                    autoHideDuration: 2500,
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                });
            } else {
                enqueueSnackbar("Falha ao desbloquear grupo.", {
                    variant: "error",
                    autoHideDuration: 2500,
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                });
            }
        });

        // All questions for the current competition
        webSocketConnection.on("ReceiveAllQuestions", (allQuestions: QuestionResponse[]) => {
            console.log("📚 ReceiveAllQuestions:", allQuestions);
            setQuestions(allQuestions);
        });

        // Full ranking with exercise attempts
        webSocketConnection.on("ReceiveFullRanking", (fullRanking: CompetitionRankingResponse[]) => {
            console.log("🏆 ReceiveFullRanking:", fullRanking);
            setRanking(fullRanking.sort((a, b) => a.rankOrder - b.rankOrder));
        });

        // Competition logs (Admin/Teacher only)
        webSocketConnection.on("ReceiveCompetitionLogs", (logs: LogResponse[]) => {
            console.log("📋 ReceiveCompetitionLogs:", logs);
            // Logs will be consumed by specific hooks/pages
        });

        // Competition submissions (Admin/Teacher only)
        webSocketConnection.on("ReceiveCompetitionSubmissions", (submissions: CompetitionSubmissionData[]) => {
            console.log("📤 ReceiveCompetitionSubmissions:", submissions);
            // This data will be consumed directly by the Submissions page hook
            // Not stored in context to avoid type conflicts with ExerciseSubmissionResponse
        });

        return () => {
            // Cleanup listeners
            webSocketConnection.off("OnConnectionResponse");
            webSocketConnection.off("ReceiveCompetitionUpdate");
            webSocketConnection.off("ReceiveCompetitionEnded");
            webSocketConnection.off("Pong");
            webSocketConnection.off("ReceiveExerciseAttemptError");
            webSocketConnection.off("ReceiveExerciseAttemptResponse");
            webSocketConnection.off("ReceiveExerciseAttempt");
            webSocketConnection.off("ReceiveRankingUpdate");
            webSocketConnection.off("ReceiveQuestionCreationResponse");
            webSocketConnection.off("ReceiveQuestionCreation");
            webSocketConnection.off("ReceiveQuestionAnswerResponse");
            webSocketConnection.off("ReceiveQuestionAnswer");
            webSocketConnection.off("ReceiveChangeJudgeSubmissionResponse");
            webSocketConnection.off("ReceiveBlockGroupSubmissionResponse");
            webSocketConnection.off("ReceiveUnblockGroupSubmissionResponse");
            webSocketConnection.off("ReceiveAllQuestions");
            webSocketConnection.off("ReceiveFullRanking");
            webSocketConnection.off("ReceiveCompetitionLogs");
            webSocketConnection.off("ReceiveCompetitionSubmissions");
        };
    }, [webSocketConnection, enqueueSnackbar]);

    // ==================== Hub Methods ====================

    const sendExerciseAttempt = useCallback(
        async (request: GroupExerciseAttemptRequest) => {
            if (!webSocketConnection) {
                enqueueSnackbar("Conexão WebSocket não estabelecida.", {
                    variant: "error",
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                });
                return;
            }

            try {
                await webSocketConnection.invoke("SendExerciseAttempt", request);
                enqueueSnackbar("Submissão enviada para processamento...", {
                    variant: "info",
                    autoHideDuration: 2500,
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                });
            } catch (error) {
                console.error("Error sending exercise attempt:", error);
                enqueueSnackbar("Erro ao enviar submissão.", {
                    variant: "error",
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                });
            }
        },
        [webSocketConnection, enqueueSnackbar]
    );

    const sendQuestion = useCallback(
        async (request: CreateGroupQuestionRequest) => {
            if (!webSocketConnection) {
                enqueueSnackbar("Conexão WebSocket não estabelecida.", {
                    variant: "error",
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                });
                return;
            }

            try {
                await webSocketConnection.invoke("SendCompetitionQuestion", request);
            } catch (error) {
                console.error("Error sending question:", error);
                enqueueSnackbar("Erro ao enviar pergunta.", {
                    variant: "error",
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                });
            }
        },
        [webSocketConnection, enqueueSnackbar]
    );

    const answerQuestion = useCallback(
        async (request: AnswerGroupQuestionRequest) => {
            if (!webSocketConnection) {
                enqueueSnackbar("Conexão WebSocket não estabelecida.", {
                    variant: "error",
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                });
                return;
            }

            try {
                await webSocketConnection.invoke("AnswerQuestion", request);
            } catch (error) {
                console.error("Error answering question:", error);
                enqueueSnackbar("Erro ao responder pergunta.", {
                    variant: "error",
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                });
            }
        },
        [webSocketConnection, enqueueSnackbar]
    );

    const changeJudgeResponse = useCallback(
        async (request: RevokeGroupSubmissionRequest) => {
            if (!webSocketConnection) {
                enqueueSnackbar("Conexão WebSocket não estabelecida.", {
                    variant: "error",
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                });
                return;
            }

            try {
                await webSocketConnection.invoke("ChangeJudgeSubmissionResponse", request);
            } catch (error) {
                console.error("Error changing judge response:", error);
                enqueueSnackbar("Erro ao alterar resposta do juiz.", {
                    variant: "error",
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                });
            }
        },
        [webSocketConnection, enqueueSnackbar]
    );

    const blockGroupSubmission = useCallback(
        async (request: BlockGroupSubmissionRequest) => {
            if (!webSocketConnection) {
                enqueueSnackbar("Conexão WebSocket não estabelecida.", {
                    variant: "error",
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                });
                return;
            }

            try {
                await webSocketConnection.invoke("BlockGroupSubmission", request);
            } catch (error) {
                console.error("Error blocking group submission:", error);
                enqueueSnackbar("Erro ao bloquear grupo.", {
                    variant: "error",
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                });
            }
        },
        [webSocketConnection, enqueueSnackbar]
    );

    const unblockGroupSubmission = useCallback(
        async (request: UnblockGroupSubmissionRequest) => {
            if (!webSocketConnection) {
                enqueueSnackbar("Conexão WebSocket não estabelecida.", {
                    variant: "error",
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                });
                return;
            }

            try {
                await webSocketConnection.invoke("UnblockGroupSubmission", request);
            } catch (error) {
                console.error("Error unblocking group submission:", error);
                enqueueSnackbar("Erro ao desbloquear grupo.", {
                    variant: "error",
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                });
            }
        },
        [webSocketConnection, enqueueSnackbar]
    );

    const ping = useCallback(async () => {
        if (!isWebSocketConnected()) return;

        try {
            await webSocketConnection!.invoke("Ping");
        } catch (error) {
            console.error("Error pinging hub:", error);
        }
    }, [isWebSocketConnected, webSocketConnection]);

    const requestQuestions = useCallback(async () => {
        if (!isWebSocketConnected()) {
            console.warn("Cannot request questions: WebSocket not connected");
            return;
        }

        try {
            await webSocketConnection!.invoke("GetAllCompetitionQuestions");
            console.log("📚 Requested all competition questions");
        } catch (error) {
            console.error("Error requesting questions:", error);
            enqueueSnackbar("Erro ao carregar perguntas.", {
                variant: "error",
                anchorOrigin: { vertical: "bottom", horizontal: "right" },
            });
        }
    }, [isWebSocketConnected, webSocketConnection, enqueueSnackbar]);

    const requestRanking = useCallback(async () => {
        if (!isWebSocketConnected()) {
            console.warn("Cannot request ranking: WebSocket not connected");
            return;
        }

        try {
            await webSocketConnection!.invoke("GetCompetitionRanking");
            console.log("🏆 Requested competition ranking");
        } catch (error) {
            console.error("Error requesting ranking:", error);
            enqueueSnackbar("Erro ao carregar ranking.", {
                variant: "error",
                anchorOrigin: { vertical: "bottom", horizontal: "right" },
            });
        }
    }, [isWebSocketConnected, webSocketConnection, enqueueSnackbar]);

    const requestLogs = useCallback(async () => {
        if (!isWebSocketConnected()) {
            console.warn("Cannot request logs: WebSocket not connected");
            return Promise.resolve([]);
        }

        try {
            console.log("📋 Requesting competition logs");
            return new Promise<LogResponse[]>((resolve) => {
                // Set up one-time listener for the response
                const handleLogs = (logs: LogResponse[]) => {
                    webSocketConnection!.off("ReceiveCompetitionLogs", handleLogs);
                    resolve(logs);
                };
                webSocketConnection!.on("ReceiveCompetitionLogs", handleLogs);
                
                // Invoke the request
                webSocketConnection!.invoke("GetCompetitionLogs");
            });
        } catch (error) {
            console.error("Error requesting logs:", error);
            enqueueSnackbar("Erro ao carregar logs.", {
                variant: "error",
                anchorOrigin: { vertical: "bottom", horizontal: "right" },
            });
            return [];
        }
    }, [isWebSocketConnected, webSocketConnection, enqueueSnackbar]);

    const requestGroups = useCallback(async () => {
        if (!isWebSocketConnected()) {
            console.warn("Cannot request groups: WebSocket not connected");
            return Promise.resolve([]);
        }

        try {
            console.log("👥 Requesting competition groups");
            return new Promise<GroupInCompetitionResponse[]>((resolve) => {
                // Set up one-time listener for the response
                const handleGroups = (groups: GroupInCompetitionResponse[]) => {
                    webSocketConnection!.off("ReceiveCompetitionGroups", handleGroups);
                    resolve(groups);
                };
                webSocketConnection!.on("ReceiveCompetitionGroups", handleGroups);
                
                // Invoke the request
                webSocketConnection!.invoke("GetCompetitionGroups");
            });
        } catch (error) {
            console.error("Error requesting groups:", error);
            enqueueSnackbar("Erro ao carregar grupos.", {
                variant: "error",
                anchorOrigin: { vertical: "bottom", horizontal: "right" },
            });
            return [];
        }
    }, [isWebSocketConnected, webSocketConnection, enqueueSnackbar]);

    const requestSubmissions = useCallback(async () => {
        if (!isWebSocketConnected()) {
            console.warn("Cannot request submissions: WebSocket not connected");
            return Promise.resolve([]);
        }

        try {
            console.log("📝 Requesting competition submissions");
            return new Promise<CompetitionSubmissionData[]>((resolve) => {
                // Set up one-time listener for the response
                const handleSubmissions = (submissions: CompetitionSubmissionData[]) => {
                    webSocketConnection!.off("ReceiveCompetitionSubmissions", handleSubmissions);
                    resolve(submissions);
                };
                webSocketConnection!.on("ReceiveCompetitionSubmissions", handleSubmissions);
                
                // Invoke the request
                webSocketConnection!.invoke("GetCompetitionSubmissions");
            });
        } catch (error) {
            console.error("Error requesting submissions:", error);
            enqueueSnackbar("Erro ao carregar submissões.", {
                variant: "error",
                anchorOrigin: { vertical: "bottom", horizontal: "right" },
            });
            return [];
        }
    }, [isWebSocketConnected, webSocketConnection, enqueueSnackbar]);

    const updateCompetitionSettings = useCallback(async (request: UpdateCompetitionSettingsRequest) => {
        if (!isWebSocketConnected()) {
            console.warn("Cannot update competition settings: WebSocket not connected");
            return Promise.resolve({ success: false, message: "WebSocket not connected" });
        }

        try {
            console.log("⚙️ Updating competition settings:", request);
            return new Promise<UpdateCompetitionSettingsResponse>((resolve) => {
                // Set up one-time listener for the response
                const handleResponse = (response: UpdateCompetitionSettingsResponse) => {
                    webSocketConnection!.off("ReceiveUpdateCompetitionSettingsResponse", handleResponse);
                    
                    if (response.success) {
                        enqueueSnackbar(response.message || "Configurações atualizadas com sucesso", {
                            variant: "success",
                            anchorOrigin: { vertical: "bottom", horizontal: "right" },
                        });
                    } else {
                        enqueueSnackbar(response.message || "Erro ao atualizar configurações", {
                            variant: "error",
                            anchorOrigin: { vertical: "bottom", horizontal: "right" },
                        });
                    }
                    
                    resolve(response);
                };
                webSocketConnection!.on("ReceiveUpdateCompetitionSettingsResponse", handleResponse);
                
                // Invoke the request
                webSocketConnection!.invoke("UpdateCompetitionSettings", request);
            });
        } catch (error) {
            console.error("Error updating competition settings:", error);
            enqueueSnackbar("Erro ao atualizar configurações.", {
                variant: "error",
                anchorOrigin: { vertical: "bottom", horizontal: "right" },
            });
            return { success: false, message: "Error updating settings" };
        }
    }, [isWebSocketConnected, webSocketConnection, enqueueSnackbar]);

    const stopCompetition = useCallback(async (competitionId: number) => {
        if (!isWebSocketConnected()) {
            console.warn("Cannot stop competition: WebSocket not connected");
            return Promise.resolve({ success: false, message: "WebSocket not connected" });
        }

        try {
            console.log("🛑 Stopping competition:", competitionId);
            return new Promise<StopCompetitionResponse>((resolve) => {
                // Set up one-time listener for the response
                const handleResponse = (response: StopCompetitionResponse) => {
                    webSocketConnection!.off("ReceiveStopCompetitionResponse", handleResponse);
                    
                    if (response.success) {
                        enqueueSnackbar(response.message || "Competição finalizada com sucesso", {
                            variant: "success",
                            anchorOrigin: { vertical: "bottom", horizontal: "right" },
                        });
                        // Clear competition state when stopped
                        setOngoingCompetition(null);
                        setRanking([]);
                        setQuestions([]);
                        setSubmissions([]);
                    } else {
                        enqueueSnackbar(response.message || "Erro ao finalizar competição", {
                            variant: "error",
                            anchorOrigin: { vertical: "bottom", horizontal: "right" },
                        });
                    }
                    
                    resolve(response);
                };
                webSocketConnection!.on("ReceiveStopCompetitionResponse", handleResponse);
                
                // Invoke the request
                webSocketConnection!.invoke("StopCompetition", competitionId);
            });
        } catch (error) {
            console.error("Error stopping competition:", error);
            enqueueSnackbar("Erro ao finalizar competição.", {
                variant: "error",
                anchorOrigin: { vertical: "bottom", horizontal: "right" },
            });
            return { success: false, message: "Error stopping competition" };
        }
    }, [isWebSocketConnected, webSocketConnection, enqueueSnackbar]);

    const value: CompetitionHubContextType = {
        ongoingCompetition,
        submissions,
        questions,
        ranking,
        isConnected,
        sendExerciseAttempt,
        sendQuestion,
        answerQuestion,
        changeJudgeResponse,
        blockGroupSubmission,
        unblockGroupSubmission,
        ping,
        requestQuestions,
        requestRanking,
        requestLogs,
        requestGroups,
        requestSubmissions,
        updateCompetitionSettings,
        stopCompetition,
    };

    return (
        <CompetitionHubContext.Provider value={value}>
            {children}
        </CompetitionHubContext.Provider>
    );
};

/**
 * Hook to access Competition Hub context.
 * Must be used within CompetitionHubProvider.
 */
export const useCompetitionHub = () => {
    const context = useContext(CompetitionHubContext);

    if (!context) {
        throw new Error("useCompetitionHub must be used within CompetitionHubProvider");
    }

    return context;
};
