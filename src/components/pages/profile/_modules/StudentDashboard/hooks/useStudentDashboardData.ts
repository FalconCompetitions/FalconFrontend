import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { ChampionTeam, CompetitionHistory, GroupInfo } from "../types";
import { User } from "@/types/User";
import UserService from "@/services/UserService";
import CompetitionService from "@/services/CompetitionService";

export const useStudentDashboardData = () => {
    const { user } = useUser();
    const [activeMenu, setActiveMenu] = useState<"dashboard" | "inscription">(
        "dashboard"
    );

    const toggleMenu = (menu: "dashboard" | "inscription") => {
        setActiveMenu(menu);
    };

    const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
    const [competitionHistory, setCompetitionHistory] = useState<
        CompetitionHistory[]
    >([]);
    const [championTeams, setChampionTeams] = useState<ChampionTeam[]>([]);
    const [loading, setLoading] = useState(false);

    // Carregar histórico de competições do usuário
    useEffect(() => {
        const fetchCompetitionHistory = async () => {
            if (!user?.id) return;

            setLoading(true);
            try {
                const response = await UserService.getUserCompetitionHistory(user.id);
                setCompetitionHistory(response.data || []);
            } catch (error) {
                console.error("Erro ao carregar histórico de competições:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompetitionHistory();
    }, [user?.id]);

    // Carregar times campeões
    useEffect(() => {
        const fetchChampionTeams = async () => {
            setLoading(true);
            try {
                const response = await CompetitionService.getChampionTeams();
                setChampionTeams(response.data || []);
            } catch (error) {
                console.error("Erro ao carregar times campeões:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChampionTeams();
    }, []);

    return {
        groupInfo,
        competitionHistory,
        championTeams,
        activeMenu,
        toggleMenu,
        loading,
    };
};
