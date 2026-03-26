"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import CompetitionService from "@/services/CompetitionService";
import { Competition } from "@/types/Competition";
import { getLogActionDescription } from "@/types/Log";
import {
    Box,
    Typography,
    CircularProgress,
    Tab,
    Tabs,
    Card,
    CardContent,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
} from "@mui/material";
import Button from "@/components/_ui/Button";
import { ArrowLeft, Trophy, Users, Calendar, FileText, Clock, Globe } from "lucide-react";
import Balao from "@/components/_ui/Balao";
import { StyledRankingCellContainer } from "@/components/pages/ranking/styles";
import { convertTimeSpanToNumber } from "@/libs/utils";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const colors = [
    "#979797",
    "#33353a",
    "#d46314",
    "#db7271",
    "#5c3b22",
    "#d35de9",
    "#4500d4",
    "#478898",
    "#08b2cb",
    "#c42321",
    "#934383",
    "#EFAF10",
    "#F0C5C9",
    "#856EBC",
    "#80A582",
];

/**
 * Archive Details Page Component
 *
 * Displays comprehensive details of a finished competition including:
 * - Ranking with team scores and penalties
 * - Competition exercises
 * - Participating teams
 * - Questions and answers
 * - Competition logs
 *
 * All data is displayed in read-only mode.
 */
const ArchiveDetailsPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const competitionId = Number(params.id);

    const [competition, setCompetition] = useState<Competition | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (competitionId) {
            loadCompetitionDetails();
        }
    }, [competitionId]);

    const loadCompetitionDetails = async () => {
        try {
            setLoading(true);
            const response = await CompetitionService.getCompetitionById(
                competitionId
            );
            if (response.data) {
                setCompetition(response.data);
            }
        } catch (err) {
            console.error("Erro ao carregar detalhes da competição:", err);
            setError("Não foi possível carregar os detalhes da competição.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const rankingData = useMemo(() => {
        if (!competition?.competitionRankings || !competition?.exercises)
            return [];

        return competition.competitionRankings
            .sort((a, b) => {
                if (b.points !== a.points) return b.points - a.points;
                return a.penalty - b.penalty;
            })
            .map((rank) => {
                const exercisesAccepteds: string[] = [];
                const times: Record<string, string> = {};

                rank.exerciseAttempts?.forEach((attempt) => {
                    const exerciseIndex = competition.exercises!.findIndex(
                        (ex) => ex.id === attempt.exerciseId
                    );
                    if (exerciseIndex === -1) return;

                    const exerciseLetter = String.fromCharCode(
                        65 + exerciseIndex
                    );

                    // @ts-expect-error : CheckLater
                    if (attempt.isAccepted) {
                        exercisesAccepteds.push(exerciseLetter);
                        times[exerciseLetter] = `${
                            attempt.attempts
                        }/${Math.round(
                            // @ts-expect-error : CheckLater
                            convertTimeSpanToNumber(attempt.penalty)
                        )}`;
                    } else {
                        times[exerciseLetter] = `${attempt.attempts}/-`;
                    }
                });

                return {
                    groupName: rank.group?.name || "Equipe",
                    exercisesAccepteds,
                    times,
                    total: `${rank.points} (${Math.round(rank.penalty)})`,
                    points: rank.points,
                    penalty: Math.round(rank.penalty),
                };
            });
    }, [competition]);

    const exerciseLetters = useMemo(() => {
        if (!competition?.exercises) return {};
        const letters: Record<string, number> = {};
        competition.exercises.forEach((ex, index) => {
            const char = String.fromCharCode(65 + index);
            letters[char] = ex.id;
        });
        return letters;
    }, [competition?.exercises]);

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "60vh",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error || !competition) {
        return (
            <Box sx={{ p: 4 }}>
                {/* @ts-expect-error : Irrelevant */}
                <Button rounded onClick={() => router.back()} sx={{ mb: 2 }}>
                    <ArrowLeft size={20} style={{ marginRight: "8px" }} />
                    Voltar
                </Button>
                <Typography variant="h5" color="error">
                    {error || "Competição não encontrada."}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            
            <Button
                rounded
                onClick={() => router.push("/Competition/Archive")}
                /* @ts-expect-error : Irrelevant */
                sx={{ mb: 2 }}
                className="mb-2"
            >
                <ArrowLeft size={20} style={{ marginRight: "8px" }} />
                Voltar
            </Button>

            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                    }}
                >
                    <Typography variant="h4" component="h1">
                        {competition.name}
                    </Typography>
                    <Chip label="Finalizada" color="success" />
                </Box>

                <Typography
                    variant="body1"
                    color="textSecondary"
                    sx={{ mb: 2 }}
                >
                    {competition.description || "Sem descrição"}
                </Typography>

                <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Calendar size={18} />
                        <Typography variant="body2">
                            {/* @ts-expect-error : Irrelevant */}
                            Início: {formatDate(competition.startTime)}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Calendar size={18} />
                        <Typography variant="body2">
                            {/* @ts-expect-error : Irrelevant */}
                            Fim: {formatDate(competition.endTime)}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Users size={18} />
                        <Typography variant="body2">
                            {competition.groups?.length || 0} equipe(s)
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Trophy size={18} />
                        <Typography variant="body2">
                            {competition.exercises?.length || 0} exercício(s)
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={activeTab}
                    onChange={(_, newValue) => setActiveTab(newValue)}
                >
                    <Tab label="Ranking" />
                    <Tab label="Exercícios" />
                    <Tab label="Equipes" />
                    <Tab label="Questões" />
                    <Tab label="Logs" />
                </Tabs>
            </Box>

            {/* Tab Panels */}
            <TabPanel value={activeTab} index={0}>
                {/* Ranking Tab */}
                <div className="w-full">
                    <div className="flex bg-[#4F85A6] text-white text-lg font-bold text-center rounded-t-2xl p-4">
                        <div className="w-[8%]">#</div>
                        <div className="w-[15%] text-left pl-2">Equipe</div>
                        <div className="flex flex-1 justify-around">
                            {Object.keys(exerciseLetters).map((letter) => (
                                <div key={letter} className="flex-1">
                                    {letter}
                                </div>
                            ))}
                        </div>
                        <div className="w-[12%]">Total</div>
                    </div>

                    <div className="mt-4">
                        {rankingData.map((row, idx) => (
                            <div
                                key={`${row.groupName}-${idx}`}
                                className="bg-white rounded-xl shadow-md mb-4 flex items-center p-4"
                            >
                                <div className="w-[8%] text-center">
                                    <span className="font-bold text-2xl text-gray-700">
                                        {idx + 1}º
                                    </span>
                                </div>
                                <div className="w-[15%] text-left pl-2">
                                    <span className="font-bold text-lg text-gray-800">
                                        {row.groupName}
                                    </span>
                                </div>
                                <div className="flex flex-1 justify-around">
                                    {Object.keys(exerciseLetters).map(
                                        (letter, index) => (
                                            <div
                                                key={`${letter}-${index}`}
                                                className="flex-1 text-center flex flex-col items-center"
                                            >
                                                {row.times[letter] ? (
                                                    <StyledRankingCellContainer
                                                        $fillColor={
                                                            colors[index]
                                                        }
                                                        $size={60}
                                                    >
                                                        {row.exercisesAccepteds.includes(
                                                            letter
                                                        ) && <Balao />}
                                                        <span className="text-sm mt-1">
                                                            {row.times[letter]}
                                                        </span>
                                                    </StyledRankingCellContainer>
                                                ) : (
                                                    <span className="text-gray-300">
                                                        -
                                                    </span>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                                <div className="w-[12%] text-center">
                                    <span className="font-bold text-lg text-gray-700">
                                        {row.total}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
                {/* Exercises Tab */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {competition.exercises &&
                    competition.exercises.length > 0 ? (
                        competition.exercises.map((exercise, index) => (
                            <Card key={exercise.id}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {String.fromCharCode(65 + index)} -{" "}
                                        {exercise.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                    >
                                        {exercise.description ||
                                            "Sem descrição"}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography>Nenhum exercício encontrado.</Typography>
                    )}
                </Box>
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
                {/* Teams Tab */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {competition.groups && competition.groups.length > 0 ? (
                        competition.groups.map((group) => (
                            <Card key={group.id}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {group.name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                    >
                                        {group.users?.length || 0} membro(s)
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography>Nenhuma equipe encontrada.</Typography>
                    )}
                </Box>
            </TabPanel>

            <TabPanel value={activeTab} index={3}>
                {/* Questions Tab */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {competition.questions &&
                    competition.questions.length > 0 ? (
                        competition.questions.map((question) => (
                            <Card key={question.id}>
                                <CardContent>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            mb: 1,
                                        }}
                                    >
                                        <FileText size={18} />
                                        <Typography
                                            variant="subtitle2"
                                            color="textSecondary"
                                        >
                                            Questão #{question.id}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                        {question.content}
                                    </Typography>
                                    {question.answer && (
                                        <Box
                                            sx={{
                                                mt: 2,
                                                p: 2,
                                                bgcolor: "background.default",
                                                borderRadius: 1,
                                            }}
                                        >
                                            <Typography
                                                variant="subtitle2"
                                                gutterBottom
                                            >
                                                Resposta:
                                            </Typography>
                                            <Typography variant="body2">
                                                {question.answer.content}
                                            </Typography>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography>Nenhuma questão encontrada.</Typography>
                    )}
                </Box>
            </TabPanel>

            <TabPanel value={activeTab} index={4}>
                {/* Logs Tab */}
                <LogsTab logs={competition.logs || []} formatDate={formatDate} />
            </TabPanel>
        </Box>
    );
};

/**
 * Logs Tab Component with table display and pagination.
 */
interface LogsTabProps {
    logs: Array<{
        id: number;
        actionType: number | string;
        actionDescription?: string;
        actionTime: string;
        ipAddress: string;
        userId?: string | null;
        userName?: string | null;
        groupId?: number | null;
        groupName?: string | null;
    }>;
    formatDate: (date?: string | null) => string;
}

const LogsTab: React.FC<LogsTabProps> = ({ logs, formatDate }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Transform logs to display format
    const displayLogs = useMemo(() => {
        return logs.map((log) => {
            const actionTypeNum = typeof log.actionType === 'number' ? log.actionType : 0;
            return {
                id: log.id,
                actionTime: formatDate(log.actionTime),
                groupName: log.groupName || "N/A",
                userName: log.userName || "N/A",
                action: log.actionDescription || getLogActionDescription(actionTypeNum, log.userName, log.groupName),
                ipAddress: log.ipAddress || "N/A",
            };
        });
    }, [logs, formatDate]);

    if (logs.length === 0) {
        return (
            <Paper
                sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                }}
            >
                <Typography variant="body1" color="textSecondary">
                    Nenhum log encontrado para esta competição.
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper
            sx={{
                width: "100%",
                overflow: "hidden",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            }}
        >
            <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader aria-label="logs table">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                align="center"
                                sx={{
                                    backgroundColor: "#4F85A6",
                                    color: "#fff",
                                    fontWeight: 600,
                                    minWidth: 170,
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                                    <Clock size={16} />
                                    Data/Hora
                                </Box>
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    backgroundColor: "#4F85A6",
                                    color: "#fff",
                                    fontWeight: 600,
                                    minWidth: 130,
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                                    <Users size={16} />
                                    Equipe
                                </Box>
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    backgroundColor: "#4F85A6",
                                    color: "#fff",
                                    fontWeight: 600,
                                    minWidth: 130,
                                }}
                            >
                                Usuário
                            </TableCell>
                            <TableCell
                                align="left"
                                sx={{
                                    backgroundColor: "#4F85A6",
                                    color: "#fff",
                                    fontWeight: 600,
                                    minWidth: 300,
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <FileText size={16} />
                                    Ação
                                </Box>
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    backgroundColor: "#4F85A6",
                                    color: "#fff",
                                    fontWeight: 600,
                                    minWidth: 130,
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                                    <Globe size={16} />
                                    IP
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayLogs
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((log) => (
                                <TableRow
                                    key={log.id}
                                    hover
                                    sx={{
                                        "&:hover": {
                                            backgroundColor: "rgba(79, 133, 166, 0.08)",
                                        },
                                    }}
                                >
                                    <TableCell align="center">{log.actionTime}</TableCell>
                                    <TableCell align="center">{log.groupName}</TableCell>
                                    <TableCell align="center">{log.userName}</TableCell>
                                    <TableCell align="left">{log.action}</TableCell>
                                    <TableCell align="center">{log.ipAddress}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={displayLogs.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Logs por página:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                sx={{
                    borderTop: "1px solid rgba(0, 0, 0, 0.06)",
                }}
            />
        </Paper>
    );
};

export default ArchiveDetailsPage;
