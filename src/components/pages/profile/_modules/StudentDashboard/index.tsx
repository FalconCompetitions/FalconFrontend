"use client";

import type React from "react";
import { useState } from "react";
import Button from "@/components/_ui/Button";
import { useStudentDashboardData } from "./hooks/useStudentDashboardData";
import StudentInfoSection from "./components/StudentInfoSection";
import GroupInfoSection from "./components/GroupInfoSection";
import CompetitionHistorySection from "./components/CompetitionHistorySection";
import ChampionTeamsSection from "./components/ChampionsTeamsSection";
import { useUser } from "@/contexts/UserContext";
import { formatDateWithoutTimezone } from "@/libs/utils";
import { Trophy, Users, ChevronLeft } from 'lucide-react';
import Modal from "@/components/_ui/Modal";
import CompetitionInscription from "./components/CompetitionInscription";
import { useWebSocketContext } from "@/contexts/WebSocketContext";
import { useCompetitionHub } from "@/contexts/CompetitionHubContext";
import { useRouter } from 'next/navigation';

interface ModalConfig {
    title: string;
    bodyContent: React.ReactNode;
    hasConfirmButton?: boolean;
    confirmButtonContent?: string;
    onConfirm?: () => void;
}

const StudentDashboard: React.FC = () => {
    const { user } = useUser();
    const {
        activeMenu,
        toggleMenu,
        groupInfo,
        competitionHistory,
        championTeams,
    } = useStudentDashboardData();

    const { webSocketConnection } = useWebSocketContext();
    const { ongoingCompetition } = useCompetitionHub();

    const [isRegistrationOpen] = useState(true);
    const [isUserRegistered] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState<ModalConfig>({
        title: "",
        bodyContent: null,
    });

    const router = useRouter();

    const showModal = (config: ModalConfig) => {
        setModalConfig(config);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleRegistrationClick = () => {
        showModal({
            title: "Redirecionamento",
            bodyContent: (
                <p className="text-slate-600">
                    Você será redirecionado para a página de inscrição...
                </p>
            ),
            hasConfirmButton: true,
            confirmButtonContent: "OK",
            onConfirm: closeModal,
        });
    };

    const handleStartMarathonClick = () => {
        try {
            // Use ongoingCompetition from CompetitionHub context for real-time data
            if (!ongoingCompetition) {
                showModal({
                    title: "Aviso",
                    bodyContent: (
                        <p className="text-slate-600">
                            Não há competição disponível no momento.
                        </p>
                    ),
                    hasConfirmButton: true,
                    confirmButtonContent: "OK",
                    onConfirm: closeModal,
                });
                return;
            }

            const now = new Date();
            
            // Safely parse dates with validation
            let startInscriptions: Date | null = null;
            let endInscriptions: Date | null = null;
            let startTime: Date | null = null;
            
            if (ongoingCompetition.startInscriptions) {
                const parsedStart = new Date(ongoingCompetition.startInscriptions);
                startInscriptions = isNaN(parsedStart.getTime()) ? null : parsedStart;
            }
            
            if (ongoingCompetition.endInscriptions) {
                const parsedEnd = new Date(ongoingCompetition.endInscriptions);
                endInscriptions = isNaN(parsedEnd.getTime()) ? null : parsedEnd;
            }

            if (ongoingCompetition.startTime) {
                const parsedStartTime = new Date(ongoingCompetition.startTime);
                startTime = isNaN(parsedStartTime.getTime()) ? null : parsedStartTime;
            }
            
            // Check if competition has started
            const hasCompetitionStarted = startTime && now >= startTime;

            // Check if user's group is inscribed
            const isGroupInscribed = ongoingCompetition.isLoggedGroupInscribed;

            if (!isGroupInscribed) {
                // Check if inscription period is still open
                const isInscriptionPeriodOpen = startInscriptions && 
                                               endInscriptions && 
                                               now >= startInscriptions && 
                                               now <= endInscriptions;

                if (isInscriptionPeriodOpen) {
                    showModal({
                        title: "Inscrição Necessária",
                        bodyContent: (
                            <p className="text-slate-600">
                                Você precisa se inscrever na maratona antes de participar.
                                Clique em &quot;Realizar Inscrição&quot; para se inscrever.
                            </p>
                        ),
                        hasConfirmButton: true,
                        confirmButtonContent: "OK",
                        onConfirm: () => {
                            closeModal();
                            toggleMenu("inscription");
                        },
                    });
                } else {
                    showModal({
                        title: "Aviso",
                        bodyContent: (
                            <p className="text-slate-600">
                                O período de inscrições foi encerrado e você não está inscrito nesta competição.
                            </p>
                        ),
                        hasConfirmButton: true,
                        confirmButtonContent: "OK",
                        onConfirm: closeModal,
                    });
                }
                return;
            }

            // User is inscribed - check if competition has started
            if (!hasCompetitionStarted) {
                const startTimeFormatted = startTime 
                    ? formatDateWithoutTimezone(startTime.toISOString()) 
                    : "em breve";
                    
                showModal({
                    title: "Competição Não Iniciada",
                    bodyContent: (
                        <p className="text-slate-600">
                            A competição ainda não começou. O início está agendado para {startTimeFormatted}.
                        </p>
                    ),
                    hasConfirmButton: true,
                    confirmButtonContent: "OK",
                    onConfirm: closeModal,
                });
                return;
            }

            // All checks passed - redirect to competition
            router.push("/Competition");
            
        } catch (error) {
            console.error("Error processing competition dates:", error);
            showModal({
                title: "Erro",
                bodyContent: (
                    <p className="text-slate-600">
                        Não foi possível verificar o status da competição.
                        Por favor, tente novamente.
                    </p>
                ),
                hasConfirmButton: true,
                confirmButtonContent: "OK",
                onConfirm: closeModal,
            });
        }
    };

    return (
        <> 
            <div className="flex-1">
                <div className="flex-1 flex flex-col bg-gray-200">
                    <div className="flex-1">
                        <div className="bg-white border-b border-slate-200 px-6 py-8 shadow-sm">
                            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div className="flex items-center gap-6">
                                    {activeMenu !== "dashboard" && (
                                        <Button
                                            variant="ghost"
                                            size="default"
                                            onClick={() => toggleMenu("dashboard")}
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </Button>
                                    )}
                                    <div>
                                        <h1 className="text-4xl font-bold text-slate-900 mb-2">
                                            Perfil do Aluno
                                        </h1>
                                        <p className="text-slate-600 text-xl">
                                            Gerencie suas informações e acompanhe seu
                                            progresso acadêmico
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        variant="primary"
                                        rounded
                                        className="text-xl"
                                        onClick={() => toggleMenu("inscription")}
                                        disabled={!isRegistrationOpen}
                                    >
                                        <Users className="h-4 w-4 mr-2" />
                                        Realizar Inscrição
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="success"
                                        rounded
                                        className="text-xl"
                                        onClick={handleStartMarathonClick}
                                    >
                                        <Trophy className="h-4 w-4 mr-2" />
                                        Iniciar Maratona
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <main className="px-40 py-8">
                            <div className="max-w-full space-y-8">
                                {activeMenu == "dashboard" && (
                                    <>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <StudentInfoSection />
                                            <GroupInfoSection />
                                        </div>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <CompetitionHistorySection
                                                history={competitionHistory}
                                            />
                                            <ChampionTeamsSection
                                                teams={championTeams}
                                            />
                                        </div>
                                    </>
                                )}

                                {(activeMenu == "inscription") && (
                                    <CompetitionInscription toggleMenu={toggleMenu} />
                                )}
                            </div>
                        </main>
                    </div>
                </div>

                {isModalOpen && (
                    <Modal
                        open={isModalOpen}
                        onClose={closeModal}
                        title={modalConfig.title}
                        bodyContent={modalConfig.bodyContent}
                        hasConfirmButton={modalConfig.hasConfirmButton}
                        confirmButtonContent={modalConfig.confirmButtonContent}
                        onConfirm={modalConfig.onConfirm}
                        hasCancelButton={false}
                        size="sm"
                    />
                )}
            </div>
        </>
    );
};

export default StudentDashboard;
