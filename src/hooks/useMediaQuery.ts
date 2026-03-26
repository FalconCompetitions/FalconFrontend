import { useState, useEffect } from 'react';

/**
 * Hook para verificar media queries de forma reativa
 * @param query - Media query string (ex: '(min-width: 768px)')
 * @returns boolean indicando se a media query corresponde
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        // Verificar se window está disponível (SSR)
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia(query);
        
        // Definir valor inicial
        setMatches(mediaQuery.matches);

        // Handler para mudanças
        const handleChange = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // Adicionar listener
        mediaQuery.addEventListener('change', handleChange);

        // Cleanup
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [query]);

    return matches;
}

// Breakpoints do Tailwind para conveniência
export const breakpoints = {
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)',
    '2xl': '(min-width: 1536px)',
} as const;

/**
 * Hook para verificar se está em tela mobile
 */
export function useIsMobile(): boolean {
    return !useMediaQuery(breakpoints.md);
}

/**
 * Hook para verificar se está em tela desktop
 */
export function useIsDesktop(): boolean {
    return useMediaQuery(breakpoints.lg);
}
