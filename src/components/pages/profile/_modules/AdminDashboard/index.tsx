"use client";

import { FC, useState } from "react";
import { Edit, ChevronLeft, Eye, Archive } from "lucide-react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/_ui/Tabs";
import Button from "@/components/_ui/Button";
import AccessCodeDialog from "./components/AccessCodeDialog";
import TokenDisplay from "./components/TokenDisplay";
import StatsGrid from "@/components/_ui/StatsGrid";
import useProfileMenu from "../../hooks/useProfileMenu";
import ExerciseManagement from "../Shared/ExerciseManagement";
import CreateCompetition from "./pages/createCompetition";
import TeachersTable from "./components/TeachersTable";
import StudentsTable from "../../components/StudentsTable";
import GroupsTable from "../../components/GroupsTable";
import CreateCompetitionSubscription from "@/app/Profile/CreateSubscription/page";
import useAdminDashboard from "./hooks/useAdminDashboard";
import { useCompetitionStatus } from "@/contexts/CompetitionHubContext/hooks";
import { CompetitionStatusBar } from "@/components/pages/Competition/CompetitionStatusBar";
import { useRouter } from "next/navigation";
import { useStatistics } from "@/hooks/useStatistics";

const AdminDashboard: FC = () => {
    const [activeTab, setActiveTab] = useState("students");
    const { activeMenu, toggleMenu } = useProfileMenu();
    const router = useRouter();

    const { token, showAccessCodeDialog, toggleShowAccessCodeDialog } =
        useAdminDashboard();

    const { hasActiveCompetition } = useCompetitionStatus();
    
    const { statistics, isLoading: isLoadingStats } = useStatistics();

    const handleMonitorCompetition = () => {
        router.push("/Competition");
    };

    const handleViewArchive = () => {
        router.push("/Competition/Archive");
    };

    return (
        <div className="flex-1">
            {/* Competition Status Bar - aparece quando há competição ativa */}
            {hasActiveCompetition && <CompetitionStatusBar />}
            
            <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Header responsivo */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-8">
                    {activeMenu !== "Main" && (
                        <Button
                            variant="ghost"
                            size="default"
                            onClick={() => toggleMenu("Main")}
                            className="self-start"
                        >
                            <ChevronLeft className="w-6 h-auto mr-2" />
                            <span className="sr-only sm:not-sr-only">Voltar</span>
                        </Button>
                    )}
                    <div className="mr-auto">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#3f3c40] py-2">
                            Dashboard Administrativo
                        </h1>
                        <p className="text-sm sm:text-base lg:text-lg text-[#4F85A6]">
                            Gerencie alunos, professores e grupos
                        </p>
                    </div>
                    
                    {/* Botões de ação - responsivos */}
                    <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-4">
                        {/* Botão Monitorar Competição - aparece apenas se houver competição ativa */}
                        {hasActiveCompetition && (
                            <Button
                                onClick={handleMonitorCompetition}
                                rounded
                                variant="success"
                                className="bg-green-600 hover:bg-green-700 whitespace-nowrap text-sm sm:text-base"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Monitorar Competição</span>
                                <span className="sm:hidden">Monitorar</span>
                            </Button>
                        )}

                        <Button
                            type="button"
                            variant="primary"
                            size="default"
                            onClick={handleViewArchive}
                            rounded
                            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm sm:text-base"
                        >
                            <Archive className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Competições Finalizadas</span>
                            <span className="sm:hidden">Arquivo</span>
                        </Button>

                        <div className="flex items-center gap-2 sm:gap-4">
                            <TokenDisplay token={token} className="min-w-0 max-w-[150px] sm:max-w-xs" />
                            <Button
                                onClick={toggleShowAccessCodeDialog}
                                rounded
                                variant="primary"
                                className="whitespace-nowrap text-sm sm:text-base"
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Alterar Código</span>
                                <span className="sm:hidden">Alterar</span>
                            </Button>
                        </div>
                    </div>
                </div>

                <StatsGrid 
                    totalExercises={statistics.totalExercises}
                    inactiveUsers={statistics.inactiveUsers}
                    isLoading={isLoadingStats}
                />

                {activeMenu === "Main" ? (
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="space-y-4 sm:space-y-6"
                    >
                        <TabsList className="grid w-full grid-cols-3 bg-white border border-[#e9edee]">
                            <TabsTrigger
                                value="students"
                                className="data-[state=active]:bg-[#4F85A6] data-[state=active]:text-white text-sm sm:text-base text-[#3f3c40] px-1 py-1 sm:py-0.5"
                            >
                                Alunos
                            </TabsTrigger>
                            <TabsTrigger
                                value="professors"
                                className="data-[state=active]:bg-[#4F85A6] data-[state=active]:text-white text-sm sm:text-base text-[#3f3c40] px-2 sm:px-20 py-1 sm:py-0.5"
                            >
                                Professores
                            </TabsTrigger>
                            <TabsTrigger
                                value="groups"
                                className="data-[state=active]:bg-[#4F85A6] data-[state=active]:text-white text-sm sm:text-base text-[#3f3c40] px-1 sm:px-3 py-1 sm:py-0.5"
                            >
                                Grupos
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent
                            value="students"
                            className="space-y-0 mt-0"
                        >
                            <StudentsTable />
                        </TabsContent>
                        <TabsContent
                            value="professors"
                            className="space-y-0 mt-0"
                        >
                            <TeachersTable />
                        </TabsContent>
                        <TabsContent value="groups" className="space-y-0 mt-0">
                            <GroupsTable />
                        </TabsContent>
                    </Tabs>
                ) : activeMenu === "Exercise" ? (
                    <ExerciseManagement />
                ) : activeMenu === "CreateCompetition" ? (
                    <CreateCompetition />
                ) : activeMenu === "CreateSubscription" ? (
                    <CreateCompetitionSubscription />
                ) : null}

                <AccessCodeDialog
                    isOpen={showAccessCodeDialog}
                    onClose={toggleShowAccessCodeDialog}
                />
            </div>
        </div>
    );
};

export default AdminDashboard;
