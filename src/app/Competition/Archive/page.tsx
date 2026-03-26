"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CompetitionService from "@/services/CompetitionService";
import { Competition } from "@/types/Competition";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    CircularProgress,
    Chip,
} from "@mui/material";
import Button from "@/components/_ui/Button";
import { Archive, Calendar, Trophy, Users } from "lucide-react";

/**
 * Archive Page Component
 *
 * Displays all finished competitions in a card-based grid layout.
 * Each card shows competition details and allows navigation to the full details page.
 * Only accessible by Admin/Teacher roles.
 */
const ArchivePage: React.FC = () => {
    const [competitions, setCompetitions] = useState<Competition[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        loadFinishedCompetitions();
    }, []);

    const loadFinishedCompetitions = async () => {
        try {
            setLoading(true);
            const response = await CompetitionService.getFinishedCompetitions();
            if (response.data) {
                setCompetitions(response.data);
            }
        } catch (err) {
            console.error("Erro ao carregar competições finalizadas:", err);
            setError("Não foi possível carregar as competições finalizadas.");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (competitionId: number) => {
        router.push(`/Competition/Archive/${competitionId}`);
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

    if (error) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography variant="h5" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 4,
                }}
            >
                <Archive size={32} />
                <Typography variant="h4" component="h1">
                    Competições Finalizadas
                </Typography>
            </Box>

            {competitions.length === 0 ? (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        py: 8,
                        textAlign: "center",
                    }}
                >
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            backgroundColor: "#e9edee",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 3,
                        }}
                    >
                        <Archive size={40} color="#4F85A6" />
                    </Box>
                    <Typography variant="h6" sx={{ color: "#3f3c40", mb: 1 }}>
                        Nenhuma competição finalizada
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#4F85A6", maxWidth: 400 }}>
                        As competições finalizadas aparecerão aqui para consulta de resultados e histórico.
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {competitions.map((competition) => (
                        // @ts-expect-error : CheckLater
                        <Grid item xs={12} sm={6} md={4} key={competition.id}>
                            <Card
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    transition:
                                        "transform 0.2s, box-shadow 0.2s",
                                    "&:hover": {
                                        transform: "translateY(-4px)",
                                        boxShadow: 6,
                                    },
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography
                                        variant="h6"
                                        component="h2"
                                        gutterBottom
                                        sx={{
                                            fontWeight: 600,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                        }}
                                    >
                                        {competition.name}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{
                                            mb: 2,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: "vertical",
                                        }}
                                    >
                                        {competition.description ||
                                            "Sem descrição"}
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 1,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >
                                            <Calendar size={16} />
                                            <Typography variant="caption">
                                                
                                                Início:{" "}
                                                {formatDate(
                                                    /* @ts-expect-error : CheckLater */
                                                    competition.startTime
                                                )}
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >
                                            <Calendar size={16} />
                                            <Typography variant="caption">
                                                Fim:{" "}
                                                {formatDate(
                                                    /* @ts-expect-error : CheckLater */
                                                    competition.endTime
                                                )}
                                            </Typography>
                                        </Box>

                                        {competition.groups && (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                }}
                                            >
                                                <Users size={16} />
                                                <Typography variant="caption">
                                                    {competition.groups.length}{" "}
                                                    equipe(s)
                                                </Typography>
                                            </Box>
                                        )}

                                        {competition.exercises && (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                }}
                                            >
                                                <Trophy size={16} />
                                                <Typography variant="caption">
                                                    {
                                                        competition.exercises
                                                            .length
                                                    }{" "}
                                                    exercício(s)
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>

                                    <Box sx={{ mt: 2 }}>
                                        <Chip
                                            label="Finalizada"
                                            color="success"
                                            size="small"
                                            variant="outlined"
                                        />
                                    </Box>
                                </CardContent>

                                <Box sx={{ p: 2, pt: 0 }}>
                                    <Button
                                        fullWidth
                                        onClick={() =>
                                            handleViewDetails(competition.id)
                                        }
                                    >
                                        Ver Detalhes
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default ArchivePage;
