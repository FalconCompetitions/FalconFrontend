'use client';

import React from 'react';
import { FileX, Search, AlertCircle, Inbox } from 'lucide-react';

type EmptyStateVariant = 'default' | 'search' | 'error' | 'noData';

interface EmptyStateProps {
    title: string;
    description?: string;
    variant?: EmptyStateVariant;
    icon?: React.ReactNode;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

const iconMap: Record<EmptyStateVariant, React.ReactNode> = {
    default: <Inbox className="w-12 h-12 text-gray-400" />,
    search: <Search className="w-12 h-12 text-gray-400" />,
    error: <AlertCircle className="w-12 h-12 text-red-400" />,
    noData: <FileX className="w-12 h-12 text-gray-400" />,
};

/**
 * Componente para exibir estados vazios em listas, tabelas ou seções
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    description,
    variant = 'default',
    icon,
    action,
    className = '',
}) => {
    const displayIcon = icon || iconMap[variant];

    return (
        <div 
            className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
            role="status"
            aria-label={title}
        >
            <div className="mb-4">
                {displayIcon}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
                {title}
            </h3>
            {description && (
                <p className="text-sm text-gray-500 max-w-sm mb-4">
                    {description}
                </p>
            )}
            {action && (
                <button
                    type="button"
                    onClick={action.onClick}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#4F85A6] rounded-lg hover:bg-[#3C6B88] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F85A6]"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
