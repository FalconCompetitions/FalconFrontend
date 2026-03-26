'use client';

import React from 'react';
import { Copy, Check } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks';

interface TokenDisplayProps {
    token: string;
    label?: string;
    className?: string;
}

/**
 * Componente para exibir tokens/códigos de acesso com funcionalidade de copiar
 * Previne overflow e mostra o token de forma truncada quando necessário
 */
export const TokenDisplay: React.FC<TokenDisplayProps> = ({
    token,
    label,
    className = '',
}) => {
    const { copied, copyToClipboard } = useCopyToClipboard();

    const handleCopy = () => {
        copyToClipboard(token);
    };

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <code 
                    className="flex-1 font-mono text-sm text-gray-800 truncate select-all"
                    title={token}
                >
                    {token}
                </code>
                <button
                    type="button"
                    onClick={handleCopy}
                    className="flex-shrink-0 p-2 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#4F85A6]"
                    aria-label={copied ? 'Copiado!' : 'Copiar código'}
                    title={copied ? 'Copiado!' : 'Copiar para área de transferência'}
                >
                    {copied ? (
                        <Check className="w-4 h-4 text-green-600" />
                    ) : (
                        <Copy className="w-4 h-4 text-gray-500" />
                    )}
                </button>
            </div>
            {copied && (
                <span className="text-xs text-green-600 mt-1 block">
                    Código copiado!
                </span>
            )}
        </div>
    );
};

export default TokenDisplay;
