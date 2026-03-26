"use client";

import UserService from "@/services/UserService";
import { GenericUserInfo, UserRole } from "@/types/User";
import { UserEditRequest } from "@/types/User/Requests";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";

const useLoadUsers = (role: UserRole) => {
    const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
    const [users, setUsers] = useState<GenericUserInfo[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [userTypeFilter, setUserTypeFilter] = useState<UserRole | null>(null);
    const [controllerSignal, setControllerSignal] =
        useState<AbortController | null>(null);

    const { enqueueSnackbar } = useSnackbar();

    const nextPage = useCallback(() => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    }, [currentPage, totalPages]);

    const prevPage = useCallback(() => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    }, [currentPage]);

    const togglePage = useCallback(
        (page: number) => {
            if (page >= 1 && page <= totalPages) {
                setCurrentPage(page);
            }
        },
        [totalPages]
    );

    const toggleUserTypeFilter = useCallback((type: UserRole | null) => {
        setUserTypeFilter(type);
    }, []);

    const toggleLoadingUsers = useCallback(() => {
        setLoadingUsers((prev) => !prev);
    }, []);

    const loadUsers = useCallback(
        async (searchTerm: string, userType: UserRole | null) => {
            try {
                setLoadingUsers(true);
                if (controllerSignal) {
                    controllerSignal.abort();
                    setControllerSignal(null);
                }

                const controller = new AbortController();
                setControllerSignal(controller);

                const response = await UserService.GetUsersWithSignal(
                    currentPage,
                    10,
                    searchTerm,
                    controller.signal,
                    role
                );

                if (response.status !== 200 || !response.data?.items) {
                    throw new Error("Failed to load users");
                }

                setUsers(response.data.items);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("Error loading users:", error);
                enqueueSnackbar("Erro ao carregar usuários.", {
                    variant: "error",
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        horizontal: "right",
                        vertical: "bottom",
                    },
                });
            } finally {
                setLoadingUsers(false);
            }
        },
        [controllerSignal, currentPage, enqueueSnackbar, role]
    );

    const deleteUser = useCallback(
        async (id: string) => {
            const response = await UserService.deleteUser(id);
            
            if (response.status !== 200) {
                throw new Error("Falha ao excluir o usuário.");
            }
            
            // Remove da lista local apenas se a exclusão no backend foi bem-sucedida
            setUsers((prev) => prev.filter((user) => user.id !== id));
        },
        []
    );

    const updateUser = useCallback(
        async (user: UserEditRequest) => {
            try {
                const response = await UserService.updateUser(user.id, user);

                if (response.status != 200 || response.data == undefined) {
                    enqueueSnackbar("Erro ao atualizar usuário.", {
                        variant: "error",
                        autoHideDuration: 3000,
                        anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "right",
                        },
                    });
                    return;
                }

                const usersCopy = users.filter(
                    (st) => st.id !== response.data!.id
                );
                usersCopy.push(response.data!);
                usersCopy.sort((a, b) => (a.id! < b.id! ? -1 : 1));
                setUsers([...usersCopy]);
            } catch (error) {
                console.error("Error updating user:", error);
                enqueueSnackbar("Erro ao atualizar usuário.", {
                    variant: "error",
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "right",
                    },
                });
            }
        },
        [enqueueSnackbar, users]
    );

    useEffect(() => {
        return () => {
            if (controllerSignal) {
                controllerSignal.abort();
            }
        };
    }, []);

    return {
        users,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        loadUsers,
        //addUser,
        deleteUser,
        updateUser,
        controllerSignal,
        setControllerSignal,
        toggleUserTypeFilter,
        userTypeFilter,
        loadingUsers,
        toggleLoadingUsers,
        togglePage,
    };
};

export default useLoadUsers;
