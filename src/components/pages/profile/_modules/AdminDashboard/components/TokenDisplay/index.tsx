import React from "react";
import { Copy, Check } from "lucide-react";
import Button from "@/components/_ui/Button";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

interface TokenDisplayProps {
    token: string | null;
    className?: string;
}

const TokenDisplay: React.FC<TokenDisplayProps> = ({ token, className = "" }) => {
    const { copied, copyToClipboard } = useCopyToClipboard();

    const handleCopy = () => {
        if (token) {
            copyToClipboard(token);
        }
    };

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-[#4F85A6] mb-1">
                    Código de Acesso Atual
                </p>
                <div className="flex items-center gap-2">
                    <p
                        className="text-lg font-mono font-bold text-[#3f3c40] truncate"
                        title={token ?? "Nenhum"}
                    >
                        {token ?? "Nenhum"}
                    </p>
                    {token && (
                        <div title={copied ? "Copiado!" : "Copiar código"}>
                            <Button
                                onClick={handleCopy}
                                variant="ghost"
                                size="sm"
                                className="p-1.5 h-auto min-w-0 hover:bg-[#e9edee]"
                            >
                                {copied ? (
                                    <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                    <Copy className="w-4 h-4 text-[#4F85A6]" />
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TokenDisplay;
