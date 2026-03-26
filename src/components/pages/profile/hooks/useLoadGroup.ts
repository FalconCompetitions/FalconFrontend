import { useState, useCallback, useEffect } from "react";
import { useSnackbar } from "notistack";
import GroupService from "@/services/GroupService";
import { GroupResponse } from "@/types/Group/Responses";

export interface GroupListItem {
    id: number;
    name: string;
    members: number;
    status: string;
    lastCompetition: string;
}

const useLoadGroups = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [groups, setGroups] = useState<GroupListItem[]>([]);
    const [loadingGroups, setLoadingGroups] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalGroups, setTotalGroups] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    const [controllerSignal, setControllerSignal] =
        useState<AbortController | null>(null);

    const itemsPerPage = 10;

    const loadGroups = useCallback(
        async (term = "") => {
            setLoadingGroups(true);
            try {
                const controller = new AbortController();
                setControllerSignal(controller);
                const res = await GroupService.GetGroupsWithSignal(
                    currentPage,
                    itemsPerPage,
                    term,
                    controller.signal
                );

                if (res.status != 200) {
                    throw new Error("Failed to fetch groups");
                }

                // Mapeia a resposta do backend para o formato esperado pela UI
                const mappedGroups: GroupListItem[] = res.data!.items.map((group: GroupResponse) => ({
                    id: group.id,
                    name: group.name,
                    members: group.users?.length || 0,
                    status: group.users && group.users.length > 0 ? 'active' : 'inactive',
                    lastCompetition: group.lastCompetitionDate || new Date().toISOString(),
                }));

                setGroups(mappedGroups);
                setTotalPages(res.data!.totalPages);
                setTotalGroups(res.data!.totalCount);
            } catch {
                enqueueSnackbar("Falha ao carregar os grupos.", {
                    variant: "error",
                });
            } finally {
                setLoadingGroups(false);
            }
        },
        [currentPage, enqueueSnackbar]
    );

    useEffect(() => {
        loadGroups(searchTerm);
    }, [loadGroups, searchTerm]);

    const deleteGroup = async (groupId: number) => {
        const response = await GroupService.deleteGroup(groupId);
        
        if (response.status !== 200) {
            // @ts-expect-error : Irrelevant
            throw new Error(response.data?.message || "Falha ao excluir o grupo.");
        }
        
        // Remove da lista local apenas se a exclusão no backend foi bem-sucedida
        setGroups((prev) => prev.filter((g) => g.id !== groupId));
    };

    const updateGroup = async (groupId: number, name: string) => {
        setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, name } : g)));
    };

    const togglePage = (page: number) => setCurrentPage(page);

    useEffect(() => {
        return () => {
            if (controllerSignal) {
                controllerSignal.abort();
            }
        };
    }, [controllerSignal]);

    return {
        groups,
        loadingGroups,
        currentPage,
        totalPages,
        totalGroups,
        searchTerm,
        setSearchTerm,
        loadGroups,
        deleteGroup,
        updateGroup,
        togglePage,
    };
};

export default useLoadGroups;
