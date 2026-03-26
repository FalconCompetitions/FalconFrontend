import { FC } from "react";

interface SkeletonProps {
    className?: string;
}

export const Skeleton: FC<SkeletonProps> = ({ className = "" }) => {
    return (
        <div
            className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded animate-shimmer ${className}`}
            aria-hidden="true"
        />
    );
};

export const StatsCardSkeleton: FC = () => {
    return (
        <div className="bg-white border border-[#e9edee] shadow-sm rounded-lg p-4 space-y-3" aria-label="Carregando...">
            <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-5 w-5 rounded" />
            </div>
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-4 w-full" />
        </div>
    );
};

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
    showHeader?: boolean;
}

/**
 * Skeleton para tabelas genéricas
 */
export const TableSkeleton: FC<TableSkeletonProps> = ({ 
    rows = 5, 
    columns = 4,
    showHeader = true 
}) => {
    return (
        <div className="w-full bg-white rounded-lg border border-[#e9edee] overflow-hidden" aria-label="Carregando tabela...">
            {showHeader && (
                <div className="bg-[#4F85A6]/10 p-4 flex gap-4">
                    {Array.from({ length: columns }).map((_, i) => (
                        <Skeleton key={`header-${i}`} className="h-5 flex-1" />
                    ))}
                </div>
            )}
            <div className="divide-y divide-[#e9edee]">
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="p-4 flex gap-4 items-center">
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <Skeleton 
                                key={`cell-${rowIndex}-${colIndex}`} 
                                className={`h-4 ${colIndex === 0 ? 'w-12' : 'flex-1'}`} 
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

interface CardSkeletonProps {
    showImage?: boolean;
    lines?: number;
}

/**
 * Skeleton para cards genéricos
 */
export const CardSkeleton: FC<CardSkeletonProps> = ({ 
    showImage = false, 
    lines = 3 
}) => {
    return (
        <div className="bg-white border border-[#e9edee] shadow-sm rounded-lg overflow-hidden" aria-label="Carregando...">
            {showImage && (
                <Skeleton className="h-40 w-full rounded-none" />
            )}
            <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                {Array.from({ length: lines }).map((_, i) => (
                    <Skeleton 
                        key={`line-${i}`} 
                        className={`h-4 ${i === lines - 1 ? 'w-1/2' : 'w-full'}`} 
                    />
                ))}
            </div>
        </div>
    );
};

/**
 * Skeleton para avatar/profile
 */
export const AvatarSkeleton: FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };
    
    return <Skeleton className={`${sizeClasses[size]} rounded-full`} />;
};

export default Skeleton;
