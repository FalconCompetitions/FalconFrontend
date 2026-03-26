"use client";

import React from "react";
import { useCompetitionHub } from "@/contexts/CompetitionHubContext";

interface Team {
    id: number;
    teamName: string;
    members: string;
    status: "active" | "blocked";
}

interface Column {
    id: "teamName" | "members" | "status" | "actions";
    label: string;
    minWidth?: number;
    align?: "right" | "left" | "center";
}

const columns: readonly Column[] = [
    { id: "teamName", label: "Nome da Equipe", minWidth: 170, align: "center" },
    { id: "members", label: "Integrantes", minWidth: 250, align: "center" },
    { id: "status", label: "Status", minWidth: 100, align: "center" },
    { id: "actions", label: "Ações", minWidth: 170, align: "center" },
];

const useManageTeams = () => {
    const {
        requestGroups,
        isConnected,
        blockGroupSubmission,
        unblockGroupSubmission,
        ongoingCompetition,
    } = useCompetitionHub();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [teams, setTeams] = React.useState<Team[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    // Load teams from SignalR when connected
    React.useEffect(() => {
        if (!isConnected) {
            setIsLoading(false);
            return;
        }

        const loadTeams = async () => {
            setIsLoading(true);
            try {
                const groupsData = await requestGroups();

                // Transform GroupInCompetitionResponse[] to Team[]
                const transformedTeams: Team[] = groupsData
                    .filter((g) => g.group) // Only include groups with valid group data
                    .map((groupInCompetition) => ({
                        id: groupInCompetition.groupId,
                        teamName: groupInCompetition.group?.name || "Sem nome",
                        members:
                            groupInCompetition.group?.users
                                ?.map((u) => u.name)
                                .join(", ") || "Sem membros",
                        status: groupInCompetition.blocked
                            ? "blocked"
                            : "active",
                    }));

                setTeams(transformedTeams);
            } catch (error) {
                console.error("Error loading teams:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadTeams();
    }, [isConnected, requestGroups]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleToggleStatus = async (id: number) => {
        try {
            const team = teams.find((t) => t.id === id);
            if (!team || !ongoingCompetition) return;

            // Call SignalR method based on current status
            if (team.status === "active") {
                await blockGroupSubmission({
                    groupId: id,
                    competitionId: ongoingCompetition.id,
                    reason: "Bloqueado pelo administrador",
                });
            } else {
                await unblockGroupSubmission({
                    groupId: id,
                    competitionId: ongoingCompetition.id,
                });
            }

            // Update local state optimistically
            setTeams((prevTeams) =>
                prevTeams.map((team) =>
                    team.id === id
                        ? {
                              ...team,
                              status:
                                  team.status === "active"
                                      ? "blocked"
                                      : "active",
                          }
                        : team
                )
            );
        } catch (error) {
            console.error("Error toggling team status:", error);
        }
    };

    const handleDeleteTeam = (id: number) => {
        // Note: Delete functionality is not implemented in backend yet
        // This is just for UI consistency
        if (window.confirm("Tem certeza que deseja excluir esta equipe?")) {
            setTeams((prevTeams) => prevTeams.filter((team) => team.id !== id));
        }
    };

    return {
        page,
        rowsPerPage,
        teams,
        columns,
        handleChangePage,
        handleChangeRowsPerPage,
        handleToggleStatus,
        handleDeleteTeam,
        isLoading,
    };
};

export default useManageTeams;
