"use client";

import { FC, useMemo } from "react";
import { 
    Package,
    ClipboardPlus,
    Trophy,
    UserX,
} from "lucide-react";
import StatsCard from "../../pages/profile/components/StatsCard";
import { useProfileMenuContext } from "@/components/pages/profile/contexts/ProfileMenuContext";
import { StatsCardSkeleton } from "../Skeleton";

interface StatsGridProps {
    /**
     * Número total de exercícios disponíveis
     */
    totalExercises?: number;
    
    /**
     * Número de usuários inativos (não acessam há 30 dias)
     */
    inactiveUsers?: number;
    
    /**
     * Indica se os dados estão sendo carregados
     */
    isLoading?: boolean;
}

const StatsGrid: FC<StatsGridProps> = ({
    totalExercises = 0,
    inactiveUsers = 0,
    isLoading = false,
}) => {

    const { toggleMenu } = useProfileMenuContext();
    
    const stats = useMemo(() => ([
        {
            id: "exercises",
            title: "Exercícios",
            value: totalExercises,
            description: "Exercícios disponíveis",
            icon: Package,
            action: () => toggleMenu("Exercise"),
            isClickable: true,
        },
        {
            id: "create_marathon_registration",
            title: "Criar Inscrição",
            value: "",
            description: "Abrir inscrições para maratona",
            icon: ClipboardPlus,
            action: () => toggleMenu("CreateSubscription"),
            isClickable: true,
        },
        {
            id: "create_marathon",
            title: "Criar Maratona",
            value: "",
            description: "Configurar uma nova maratona",
            icon: Trophy,
            action: () => toggleMenu("CreateCompetition"),
            isClickable: true,
        },
        {
            id: "statistics",
            title: "Estatísticas",
            value: inactiveUsers, 
            description: "Não acessam há 30 dias",
            icon: UserX,
            action: () => {},
            isClickable: false,
        },
    ]), [toggleMenu, totalExercises, inactiveUsers]);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <StatsCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat) => {
                const isClickable = stat.isClickable !== false && stat.action;
                return (
                    <div
                        key={stat.id}
                        onClick={isClickable ? stat.action : undefined}
                        className={`
                            transition-all duration-200 
                            ${isClickable 
                                ? 'cursor-pointer hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]' 
                                : 'cursor-default'
                            }
                        `}
                        role={isClickable ? 'button' : undefined}
                        tabIndex={isClickable ? 0 : undefined}
                        onKeyDown={(e) => {
                            if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                                e.preventDefault();
                                stat.action?.();
                            }
                        }}
                        aria-label={isClickable ? `${stat.title}: ${stat.description}` : undefined}
                    >
                        <StatsCard
                            title={stat.title}
                            value={stat.value}
                            description={stat.description}
                            icon={stat.icon}
                            className={`h-full ${isClickable ? 'ring-transparent hover:ring-2 hover:ring-[#4F85A6]/30' : ''}`} 
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default StatsGrid;