/**
 * Tipos para estatísticas do dashboard
 */

export interface DashboardStatistics {
    /**
     * Número total de exercícios disponíveis no sistema
     */
    totalExercises: number;

    /**
     * Número total de alunos no sistema
     */
    totalStudents: number;

    /**
     * Número total de professores no sistema
     */
    totalTeachers: number;

    /**
     * Número total de grupos ativos
     */
    totalGroups: number;

    /**
     * Número de usuários inativos (não acessam há 30 dias)
     */
    inactiveUsers: number;
}

export interface StatisticsResponse {
    data: DashboardStatistics;
    status: number;
}
