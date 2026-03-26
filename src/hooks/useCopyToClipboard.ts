import { useState, useCallback } from "react";

interface UseCopyToClipboardReturn {
    copied: boolean;
    copyToClipboard: (text: string) => Promise<void>;
}

export const useCopyToClipboard = (): UseCopyToClipboardReturn => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Erro ao copiar para área de transferência:", error);
        }
    }, []);

    return { copied, copyToClipboard };
};
