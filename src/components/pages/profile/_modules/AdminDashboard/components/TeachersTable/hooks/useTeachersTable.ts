import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import userLoadUsers from "@/components/pages/profile/hooks/useLoadUsers";
import { GenericUserInfo } from "@/types/User";
import { useSnackbar } from "notistack";
import { UserEditRequest } from "@/types/User/Requests";

interface DialogProps<T> {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>> | null;
    item: T | null;
    action: ((item: T) => Promise<void>) | null;
}

const useTeachersTable = () => {
    const {
        users,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        loadUsers,
        deleteUser,
        updateUser,
        toggleUserTypeFilter,
        userTypeFilter,
        loadingUsers,
        toggleLoadingUsers,
        togglePage,
    } = userLoadUsers("Teacher");

    const { enqueueSnackbar } = useSnackbar();

    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
        null
    );
    const [statusFilter, setStatusFilter] = useState("all");
    const [deleteDialog, setDeleteDialog] = useState<{
        isOpen: boolean;
        toggleDialog: (() => void) | null;
        user: GenericUserInfo | null;
        action: ((userId: string) => Promise<void>) | null;
    }>({
        isOpen: false,
        toggleDialog: null,
        user: null,
        action: null,
    });
    const [editDialog, setEditDialog] = useState<{
        isOpen: boolean;
        toggleDialog: (() => void) | null;
        user: GenericUserInfo | null;
        action: ((user: UserEditRequest) => Promise<void>) | null;
    }>({
        isOpen: false,
        toggleDialog: null,
        user: null,
        action: null,
    });

    const allUsersSelected = useMemo(() => {
        return users.length == selectedUsers.length;
    }, [users, selectedUsers]);

    const handleSelectAll = useCallback(
        (checked: boolean) => {
            setSelectedUsers([...(checked ? users.map((s) => s.id) : [])]);
        },
        [users]
    );

    const handleSelectUser = useCallback((userId: string, checked: boolean) => {
        setSelectedUsers((prev) =>
            checked ? [...prev, userId] : prev.filter((id) => id !== userId)
        );
    }, []);

    const handleDeleteUsers = useCallback(async () => {
        if (selectedUsers.length === 0) return;

        try {
            await Promise.all(selectedUsers.map((id) => deleteUser(id)));
            setSelectedUsers([]);
            const message = selectedUsers.length === 1
                ? "Professor excluído com sucesso!"
                : `${selectedUsers.length} professores excluídos com sucesso!`;
            enqueueSnackbar(message, {
                variant: "success",
                autoHideDuration: 2500,
                anchorOrigin: { vertical: "bottom", horizontal: "right" },
            });
        } catch (error) {
            console.error("Error deleting users:", error);
            enqueueSnackbar("Erro ao deletar professores.", {
                variant: "error",
                autoHideDuration: 2500,
                anchorOrigin: { vertical: "bottom", horizontal: "right" },
            });
        }
    }, [deleteUser, enqueueSnackbar, selectedUsers]);

    const handleDeleteUserClick = useCallback(
        (user: GenericUserInfo) => {
            const action = async (userId: string) => {
                try {
                    await deleteUser(userId);
                    enqueueSnackbar("Professor excluído com sucesso!", {
                        variant: "success",
                        autoHideDuration: 2500,
                        anchorOrigin: { vertical: "bottom", horizontal: "right" },
                    });
                } catch (error) {
                    console.error("Error deleting user:", error);
                    enqueueSnackbar("Erro ao excluir professor.", {
                        variant: "error",
                        autoHideDuration: 2500,
                        anchorOrigin: { vertical: "bottom", horizontal: "right" },
                    });
                }
            };
            
            setDeleteDialog({
                isOpen: true,
                toggleDialog: () =>
                    setDeleteDialog((prev) => ({
                        ...prev,
                        isOpen: !prev.isOpen,
                    })),
                user: user,
                action: action,
            });
        },
        [deleteUser, enqueueSnackbar]
    );

    const handleSelectUserToEdit = useCallback(
        (user: GenericUserInfo) => {
            setEditDialog({
                isOpen: true,
                toggleDialog: () =>
                    setEditDialog((prev) => ({
                        ...prev,
                        isOpen: !prev.isOpen,
                    })),
                user: user,
                action: updateUser,
            });
        },
        [updateUser]
    );

    useEffect(() => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const timeoutEvent = setTimeout(() => {
            loadUsers(searchTerm, userTypeFilter);
        }, 500);

        setSearchTimeout(timeoutEvent);

        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, userTypeFilter]);

    return {
        selectedUsers,
        allUsersSelected,
        searchTerm,
        statusFilter,
        deleteDialog,
        editDialog,
        users,
        loadingUsers,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        setSearchTerm,
        handleDeleteUsers,
        handleSelectUserToEdit,
        setStatusFilter,
        setDeleteDialog,
        handleSelectAll,
        handleSelectUser,
        handleDeleteUserClick,
        togglePage,
    };
};

export default useTeachersTable;
