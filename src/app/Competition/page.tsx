"use client";

import type React from "react";
import { useState, useMemo, useEffect } from "react";
import Balao from "@/components/_ui/Balao";
import { Box, Modal } from "@mui/material";
import Button from "@/components/_ui/Button";
import { StyledRankingCellContainer } from "@/components/pages/ranking/styles";
import AnaliseJuiz from "../Competition/analiseJugde";
import { useRanking } from "@/contexts/CompetitionHubContext/hooks/useRanking";
import { useCompetitionHub } from "@/contexts/CompetitionHubContext";
import { convertTimeSpanToNumber } from "@/libs/utils";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { RankingTableSkeleton } from "@/components/_ui/Skeleton/TableSkeleton";
import EmptyState from "@/components/_ui/EmptyState";

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

const RankingPage: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useUser();
    const { liveRanking } = useRanking();
    const { requestRanking, ongoingCompetition, isConnected } =
        useCompetitionHub();
    const router = useRouter();

    // Request ranking when the page loads and connection is ready
    useEffect(() => {
        if (isConnected) {
            console.log("🔄 Competition page mounted, requesting ranking");
            setIsLoading(true);
            requestRanking().finally(() => {
                setIsLoading(false);
            });
        }
    }, [isConnected, requestRanking]);

    // Redirect if no competition is available
    useEffect(() => {
        if (isConnected && !ongoingCompetition) {
            console.log("⚠️ No competition available, redirecting to profile");
            router.push("/Profile");
        }
    }, [isConnected, ongoingCompetition, router]);

    // Transform SignalR ranking data to component format
    const data = useMemo(() => {
        if (!ongoingCompetition) return [];
        return liveRanking.map((rank) => {
            const exercisesAccepteds: string[] = [];
            const times: { [key: string]: string } = {};

            // Process each exercise attempt
            rank.exerciseAttempts?.forEach((attempt) => {
                // Find the index of the exercise in the competition
                const exerciseIndex = ongoingCompetition.exercises.findIndex(
                    (ex) => ex.id === attempt.exerciseId
                );
                if (exerciseIndex === -1) return;

                // Convert index to letter (0 => 'A', 1 => 'B', etc.)
                const exerciseLetter = String.fromCharCode(65 + exerciseIndex);
                if (!exerciseLetter) return;

                // Only add to accepted list if the exercise was accepted (solved correctly)
                if (
                    attempt.accepted &&
                    !exercisesAccepteds.includes(exerciseLetter)
                ) {
                    exercisesAccepteds.push(exerciseLetter);
                }

                // Format: "attempts/time" (e.g., "2/64" means 2 attempts, 64 minutes)
                // Only count attempts for accepted exercises - penalty is applied per accepted problem
                if (attempt.accepted) {
                    const penaltyMinutes =
                        convertTimeSpanToNumber(
                            String(ongoingCompetition.submissionPenalty)
                        ) / 60;
                    times[exerciseLetter] = `${attempt.attempts}/${Math.round(
                        attempt.attempts * penaltyMinutes
                    )}`;
                } else {
                    // For non-accepted exercises, just show attempts without penalty calculation
                    times[exerciseLetter] = `${attempt.attempts}/-`;
                }
            });

            return {
                group: rank.group.name,
                exercisesAccepteds,
                times,
                total: `${rank.points} (${Math.round(rank.penalty)})`,
                totalCount: rank.points,
                totalScore: Math.round(rank.penalty),
            };
        });
    }, [liveRanking, ongoingCompetition]);

    // A => Char Code 65
    const exercisesInCompetition = useMemo(() => {
        const charCodesWithId: Record<string, number> = {};
        const exerciseIds =
            ongoingCompetition?.exercises?.map((ex) => ex.id) || [];
        exerciseIds.forEach((id, index) => {
            const char = String.fromCharCode(65 + index);
            charCodesWithId[char] = id;
        });

        return charCodesWithId;
    }, [ongoingCompetition?.exercises]);

    return (
        <div className="relative flex flex-col items-center p-8 bg-gray-100 min-h-screen">
            {user?.role !== "Admin" && (
                <div className="flex justify-end mb-4 mt-4 w-full max-w-7xl">
                    <Button
                        className="bg-[#4F85A6] text-white px-6 py-2 rounded-md font-bold hover:bg-[#3B6A82] transition"
                        onClick={() => setOpen(true)}
                    >
                        Enviar Exercícios
                    </Button>
                </div>
            )}

            {isLoading ? (
                <RankingTableSkeleton rows={5} />
            ) : data.length === 0 ? (
                <div className="w-full max-w-7xl bg-white rounded-xl shadow-md">
                    <EmptyState
                        title="Nenhum dado de ranking disponível"
                        description="Aguarde os participantes enviarem suas soluções para visualizar o ranking."
                        variant="noData"
                    />
                </div>
            ) : (
            <>
            {/* Cabeçalho da Tabela */}
            <div className="w-full max-w-7xl">
                <div className="flex bg-[#4F85A6] text-white text-lg font-bold text-center rounded-t-2xl p-4">
                    <div className="w-[8%]">#</div>
                    <div className="w-[15%] text-left pl-2">Equipe</div>
                    <div className="flex flex-1 justify-around">
                        {Object.keys(exercisesInCompetition).map((l) => (
                            <div key={l} className="flex-1">
                                {l}
                            </div>
                        ))}
                    </div>
                    <div className="w-[12%]">Total</div>
                </div>

                {/* Corpo da Tabela */}
                <div className="mt-4">
                    {data.map((rowData, idx) => (
                        <div
                            key={`${rowData.group}-${idx}`}
                            className="bg-white rounded-xl shadow-md mb-4 flex items-center p-4 transition-all duration-200 hover:shadow-xl cursor-pointer"
                        >
                            <div className="w-[8%] text-center">
                                <span className="font-bold text-2xl text-gray-700">
                                    {idx + 1}º
                                </span>
                            </div>
                            <div className="w-[15%] text-left pl-2">
                                <span className="font-bold text-lg text-gray-800">
                                    {rowData.group}
                                </span>
                            </div>
                            <div className="flex flex-1 justify-around">
                                {Object.keys(exercisesInCompetition).map(
                                    (l, index) => (
                                        <div
                                            key={`${l}-${index}`}
                                            className="flex-1 text-center flex flex-col items-center"
                                        >
                                            {rowData.times[l] ? (
                                                <StyledRankingCellContainer
                                                    $fillColor={colors[index]}
                                                    $size={60}
                                                >
                                                    {rowData.exercisesAccepteds.includes(
                                                        l
                                                    ) && <Balao />}
                                                    <span className="text-sm mt-1">
                                                        {rowData.times[l]}
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
                                <span className="font-bold text-lg text-gray-800">
                                    {rowData.total}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            </>
            )}

            {/* Modal com o componente separado */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        borderRadius: 2,
                        maxHeight: "90vh",
                        overflowY: "auto",
                    }}
                >
                    <AnaliseJuiz />
                </Box>
            </Modal>
        </div>
    );
};

export default RankingPage;
