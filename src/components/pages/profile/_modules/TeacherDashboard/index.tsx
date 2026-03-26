"use client";

import type React from "react";
import { FC, useState, useMemo } from "react";
import { Users, UserCheck, Package, ChevronLeft, Eye, Archive } from "lucide-react";
import { ButtonAdm } from "@/components/_ui/ButtonAdm";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/_ui/Tabs";
import StudentsTable from "../../components/StudentsTable";
import GroupsTable from "../../components/GroupsTable";
import StatsCard from "../../components/StatsCard";
import useProfileMenu from "../../hooks/useProfileMenu";
import ExerciseManagement from "../Shared/ExerciseManagement";
import DepartmentModal from "@/components/pages/profile/_modules/TeacherDashboard/components/DepartmentModal";
import { useCompetitionStatus } from "@/contexts/CompetitionHubContext/hooks";
import { CompetitionStatusBar } from "@/components/pages/Competition/CompetitionStatusBar";
import { useRouter } from "next/navigation";
import { useStatistics } from "@/hooks/useStatistics";
import { StatsCardSkeleton } from "@/components/_ui/Skeleton";
import Button from "@/components/_ui/Button";

const TeacherDashboard: FC = () => {
    const { activeMenu, toggleMenu } = useProfileMenu();
    const [activeTab, setActiveTab] = useState("students");
    const router = useRouter();

    const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);

    const { hasActiveCompetition } = useCompetitionStatus();
    const { statistics, isLoading: isLoadingStats } = useStatistics();

    const handleMonitorCompetition = () => {
        router.push("/Competition");
    };

    const handleViewArchive = () => {
        router.push("/Competition/Archive");
    };

    const stats = useMemo(() => [
        {
            id: "exercises",
            title: "Exercícios",
            value: statistics.totalExercises,
            description: "Exercícios disponíveis",
            icon: Package,
            action: () => toggleMenu("Exercise"),
        },
        {
            id: "students",
            title: "Total de Alunos",
            value: statistics.totalStudents,
            description: "Ativos no último mês",
            icon: Users,
            action: () => {
                toggleMenu("Main");
                setActiveTab("students");
            },
        },
        {
            id: "groups",
            title: "Grupos Ativos",
            value: statistics.totalGroups,
            description: "Ativos no último mês",
            icon: UserCheck,
            action: () => {
                toggleMenu("Main");
                setActiveTab("groups");
            },
        },
    ], [statistics, toggleMenu]);

    return (
        <div className="flex-1">
            {/* Competition Status Bar - aparece quando há competição ativa */}
            {hasActiveCompetition && <CompetitionStatusBar />}
            
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center gap-8 justify-between">
                    {activeMenu !== "Main" && (
                        <ButtonAdm
                            type="button"
                            variant="ghost"
                            size="default"
                            onClick={() => toggleMenu("Main")}
                        >
                            <ChevronLeft className="w-6 h-auto mr-2" />
                        </ButtonAdm>
                    )}
                    <div className="mr-auto">
                        <h1 className="text-4xl font-bold text-[#3f3c40] py-2">
                            Dashboard do Professor
                        </h1>
                        <p className="text-lg text-[#4F85A6]">
                            Gerencie alunos, grupos e exercícios
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Botão Monitorar Competição - aparece apenas se houver competição ativa */}
                        {hasActiveCompetition && (
                            <Button
                                type="button"
                                variant="primary"
                                rounded
                                size="default"
                                onClick={handleMonitorCompetition}
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                Monitorar Competição
                            </Button>
                        )}

                        <Button
                            type="button"
                            variant="primary"
                            rounded
                            size="default"
                            onClick={handleViewArchive}
                            
                            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                        >
                            <Archive className="w-4 h-4 mr-2" />
                            Competições Finalizadas
                        </Button>

                        <ButtonAdm
                            type="button"
                            variant="default"
                            size="default"
                            onClick={() => setIsDeptModalOpen(true)}
                            className="bg-[#4F85A6] hover:bg-[#3b6e8a] text-white font-semibold"
                        >
                            Editar Departamento
                        </ButtonAdm>
                    </div>
                </div>

                {isLoadingStats ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <StatsCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((stat) => (
                            <div
                                key={stat.id}
                                onClick={stat.action}
                                className="cursor-pointer transition-transform duration-200 hover:scale-105"
                            >
                                <StatsCard
                                    title={stat.title}
                                    value={stat.value}
                                    description={stat.description}
                                    icon={stat.icon}
                                    className="h-full"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {activeMenu === "Main" ? (
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="space-y-6"
                    >
                        <TabsList className="grid w-full grid-cols-2 bg-white border border-[#e9edee]">
                            <TabsTrigger
                                value="students"
                                className="data-[state=active]:bg-[#4F85A6] data-[state=active]:text-white text-base text-[#3f3c40] px-1 py-0.5"
                            >
                                Alunos
                            </TabsTrigger>
                            <TabsTrigger
                                value="groups"
                                className="data-[state=active]:bg-[#4F85A6] data-[state=active]:text-white text-base text-[#3f3c40] px-3 py-0.5"
                            >
                                Grupos
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="students" className="space-y-0 mt-0">
                            <StudentsTable
                        />
                    </TabsContent>

                    <TabsContent value="groups" className="space-y-0 mt-0">
                        <GroupsTable
                        />
                    </TabsContent>
                </Tabs>
            ) : activeMenu === "Exercise" ? (
                <ExerciseManagement />
            ) : null}

            {isDeptModalOpen && (
                <DepartmentModal
                    open={isDeptModalOpen}
                    onClose={() => setIsDeptModalOpen(false)}
                />
            )}
            </div>
        </div>
    );
};

export default TeacherDashboard;
