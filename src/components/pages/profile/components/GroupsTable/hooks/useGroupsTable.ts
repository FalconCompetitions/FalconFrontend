"use client";

import { useEffect, useState, useCallback } from "react";
import useLoadGroups, { GroupListItem } from "@/components/pages/profile/hooks/useLoadGroup";
import { useSnackbar } from "notistack";
import { UpdateGroupRequest } from "@/types/Group/Requests";
import GroupService from "@/services/GroupService";

export default function useGroupsTable() {
    const { enqueueSnackbar } = useSnackbar();
    const {
        groups,
        loadingGroups,
        currentPage,
        totalPages,
        loadGroups,
        deleteGroup,
        updateGroup,
        togglePage,
    } = useLoadGroups();

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedGroups, setSelectedGroups] = useState<number[]>([]);

    // Estado do diálogo de exclusão, modelado como um objeto
    const [deleteDialog, setDeleteDialog] = useState<{
        isOpen: boolean;
        group: GroupListItem | null;
        action: ((id: number) => Promise<void>) | null;
    }>({
        isOpen: false,
        group: null,
        action: null,
    });

    // Estado do diálogo de edição, modelado como um objeto
    const [editDialog, setEditDialog] = useState<{
        isOpen: boolean;
        group: GroupListItem & { leaderId: string; users: Array<{ id: string; name: string }> } | null;
        action: ((groupId: number, request: UpdateGroupRequest) => Promise<void>) | null;
    }>({
        isOpen: false,
        group: null,
        action: null,
    });

    useEffect(() => {
        loadGroups(searchTerm);
    }, [currentPage, searchTerm, loadGroups]);

    // Funções para fechar os diálogos e resetar seu estado
    const toggleDeleteDialog = useCallback(() => {
        setDeleteDialog({
            isOpen: !deleteDialog.isOpen,
            group: null,
            action: null,
        });
    }, [deleteDialog.isOpen]);

    const toggleEditDialog = useCallback(() => {
        setEditDialog({
            isOpen: !editDialog.isOpen,
            group: null,
            action: null,
        });
    }, [editDialog.isOpen]);

    const handleSelectGroup = useCallback(
        (groupId: number, checked: boolean) => {
            setSelectedGroups((prev) =>
                checked
                    ? [...prev, groupId]
                    : prev.filter((id) => id !== groupId)
            );
        },
        []
    );

    const handleSelectAll = useCallback(
        (checked: boolean) => {
            if (checked) {
                const allIds = groups.map((g) => g.id);
                setSelectedGroups(allIds);
            } else {
                setSelectedGroups([]);
            }
        },
        [groups]
    );

    const handleDeleteGroups = useCallback(async () => {
        if (selectedGroups.length === 0) return;
        try {
            for (const id of selectedGroups) {
                await deleteGroup(id);
            }
            setSelectedGroups([]);
            await loadGroups(searchTerm);
            const message = selectedGroups.length === 1 
                ? "Grupo excluído com sucesso!" 
                : `${selectedGroups.length} grupos excluídos com sucesso!`;
            enqueueSnackbar(message, {
                variant: "success",
            });
        } catch {
            enqueueSnackbar("Falha ao excluir grupos selecionados.", {
                variant: "error",
            });
        }
    }, [
        selectedGroups,
        deleteGroup,
        enqueueSnackbar,
        loadGroups,
        searchTerm,
    ]);

    // Prepara o diálogo de exclusão sem executar a ação ainda
    const handleDeleteGroupClick = useCallback(
        (group: GroupListItem) => {
            const action = async (id: number) => {
                try {
                    await deleteGroup(id);
                    toggleDeleteDialog();
                    await loadGroups(searchTerm);
                    enqueueSnackbar("Grupo excluído com sucesso!", {
                        variant: "success",
                    });
                } catch {
                    enqueueSnackbar("Falha ao excluir o grupo.", {
                        variant: "error",
                    });
                }
            };
            setDeleteDialog({ isOpen: true, group, action });
        },
        [deleteGroup, enqueueSnackbar, loadGroups, searchTerm, toggleDeleteDialog]
    );

    // Prepara o diálogo de edição sem executar a ação ainda
    const handleSelectGroupToEdit = useCallback(
        async (group: GroupListItem) => {
            try {
                // Buscar detalhes completos do grupo
                const response = await GroupService.getGroupById(group.id);
                
                if (response.status === 200 && response.data) {
                    const fullGroup = {
                        ...group,
                        leaderId: response.data.leaderId,
                        users: response.data.users.map(u => ({
                            id: u.id,
                            name: u.name
                        }))
                    };

                    const action = async (groupId: number, request: UpdateGroupRequest) => {
                        try {
                            await GroupService.UpdateGroup(groupId, request);
                            await updateGroup(groupId, request.name);
                            toggleEditDialog();
                            await loadGroups(searchTerm);
                            enqueueSnackbar("Grupo atualizado com sucesso!", {
                                variant: "success",
                            });
                        } catch {
                            enqueueSnackbar("Falha ao atualizar o grupo.", {
                                variant: "error",
                            });
                        }
                    };
                    
                    setEditDialog({ isOpen: true, group: fullGroup, action });
                }
            } catch {
                enqueueSnackbar("Falha ao carregar detalhes do grupo.", {
                    variant: "error",
                });
            }
        },
        [updateGroup, enqueueSnackbar, loadGroups, searchTerm, toggleEditDialog]
    );

    const allGroupsSelected =
        groups.length > 0 && selectedGroups.length === groups.length;
    const totalGroups = groups.length;

    return {
        groups,
        loadingGroups,
        currentPage,
        totalPages,
        totalGroups,
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        selectedGroups,
        allGroupsSelected,
        deleteDialog: {
            ...deleteDialog,
            toggleDialog: toggleDeleteDialog,
        },
        editDialog: {
            ...editDialog,
            toggleDialog: toggleEditDialog,
        },
        togglePage,
        handleSelectAll,
        handleSelectGroup,
        handleDeleteGroups,
        handleDeleteGroupClick,
        handleSelectGroupToEdit,
    };
}
