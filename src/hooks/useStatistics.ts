"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardStatistics } from "@/types/Statistics";
import ExerciseService from "@/services/ExerciseService";
import UserService from "@/services/UserService";
import GroupService from "@/services/GroupService";

/**
 * Hook customizado para carregar estatísticas do dashboard
 * 
 * Carrega dados agregados de exercícios, usuários e grupos do backend
 * e calcula estatísticas úteis para exibição nos dashboards.
 * 
 * @returns {Object} Estatísticas do dashboard e estado de carregamento
 * 
 * @example
 * ```tsx
 * const { statistics, isLoading, error, refetch } = useStatistics();
 * 
 * return (
 *   <div>
 *     {!isLoading && <p>Total de exercícios: {statistics.totalExercises}</p>}
 *   </div>
 * );
 * ```
 */
export const useStatistics = () => {
    const [statistics, setStatistics] = useState<DashboardStatistics>({
        totalExercises: 0,
        totalStudents: 0,
        totalTeachers: 0,
        totalGroups: 0,
        inactiveUsers: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Carrega as estatísticas fazendo requisições paralelas aos endpoints
     */
    const loadStatistics = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Requisições paralelas para melhor performance
            const [exercisesResponse, studentsResponse, teachersResponse, groupsResponse] = await Promise.all([
                ExerciseService.getExercises(1, 1).catch(() => ({ data: { totalCount: 0 }, status: 200 })),
                UserService.getUsers(1, 1, undefined, "Student").catch(() => ({ data: { totalCount: 0 }, status: 200 })),
                UserService.getUsers(1, 1, undefined, "Teacher").catch(() => ({ data: { totalCount: 0 }, status: 200 })),
                GroupService.getGroups(1, 1).catch(() => ({ data: { totalCount: 0 }, status: 200 })),
            ]);

            // Calcular usuários inativos (não implementado no backend ainda)
            // Por enquanto, vamos calcular baseado nos últimos acessos dos usuários
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            // Obter todos os alunos para calcular inativos
            const allStudentsResponse = await UserService.getUsers(1, 100, undefined, "Student").catch(() => ({ 
                data: { items: [], totalCount: 0 }, 
                status: 200 
            }));

            const inactiveCount = allStudentsResponse.data?.items?.filter((user: any) => {
                if (!user.lastLoggedAt) return true; // Nunca logou = inativo
                const lastLogin = new Date(user.lastLoggedAt);
                return lastLogin < thirtyDaysAgo;
            }).length || 0;

            setStatistics({
                totalExercises: exercisesResponse.data?.totalCount || 0,
                totalStudents: studentsResponse.data?.totalCount || 0,
                totalTeachers: teachersResponse.data?.totalCount || 0,
                totalGroups: groupsResponse.data?.totalCount || 0,
                inactiveUsers: inactiveCount,
            });
        } catch (err) {
            console.error("Erro ao carregar estatísticas:", err);
            setError("Falha ao carregar estatísticas do dashboard");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStatistics();
    }, [loadStatistics]);

    return {
        statistics,
        isLoading,
        error,
        refetch: loadStatistics,
    };
};
