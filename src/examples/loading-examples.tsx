/* eslint-disable */

/**
 * Loading System - Usage Examples
 * 
 * Este arquivo contém exemplos práticos de como usar o sistema de loading
 * implementado no Falcon Platform.
 */

// ============================================================================
// EXEMPLO 1: Página com delay artificial (para testar loading)
// ============================================================================

// app/MinhaSecao/page.tsx
/*
export default async function MinhaSecaoPage() {
    // Simula carregamento de dados (remover em produção)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return (
        <div>
            <h1>Minha Seção</h1>
            <p>Conteúdo carregado!</p>
        </div>
    );
}
*/

// ============================================================================
// EXEMPLO 2: Criar loading customizado para nova seção
// ============================================================================

// app/MinhaSecao/loading.tsx
/*
import Loading from "@/components/_ui/Loading";

export default function MinhaSecaoLoading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 z-50">
            <div className="text-center">
                <Loading 
                    variant="spinner" 
                    size="xl" 
                    colorClass="text-white"
                    notAbsolute
                />
                <p className="mt-4 text-xl text-white font-bold">
                    Carregando Minha Seção...
                </p>
                <p className="mt-2 text-white/80">
                    Preparando tudo para você
                </p>
            </div>
        </div>
    );
}
*/

// ============================================================================
// EXEMPLO 3: Loading inline (dentro de um componente)
// ============================================================================

// components/MeuComponente.tsx
/*
"use client";

import { useState, useEffect } from "react";
import Loading from "@/components/_ui/Loading";

export default function MeuComponente() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const response = await fetch('/api/data');
            const result = await response.json();
            setData(result);
            setLoading(false);
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loading 
                    variant="spinner" 
                    size="md" 
                    colorClass="text-[#4F85A6]"
                    notAbsolute
                />
            </div>
        );
    }

    return <div>{data}</div>;
}
*/

// ============================================================================
// EXEMPLO 4: Loading com diferentes variantes
// ============================================================================

/*
import Loading from "@/components/_ui/Loading";

// Spinner (padrão)
<Loading variant="spinner" size="lg" colorClass="text-blue-600" />

// Dots animados
<Loading variant="dots" size="md" colorClass="text-[#4F85A6]" />

// Barra de progresso
<Loading variant="bar" size="sm" colorClass="text-green-500" />

// Overlay com blur
<Loading variant="overlay" size="xl" bgColor="bg-black/50" />
*/

// ============================================================================
// EXEMPLO 5: Suspense manual com loading
// ============================================================================

// app/MinhaSecao/page.tsx
/*
import { Suspense } from "react";
import Loading from "@/components/_ui/Loading";
import MeuComponenteLento from "./MeuComponenteLento";

export default function Page() {
    return (
        <div>
            <h1>Página Principal</h1>
            
            <Suspense fallback={
                <div className="flex items-center justify-center p-12">
                    <Loading variant="spinner" size="lg" colorClass="text-[#4F85A6]" notAbsolute />
                </div>
            }>
                <MeuComponenteLento />
            </Suspense>
        </div>
    );
}
*/

// ============================================================================
// EXEMPLO 6: Loading condicional com estados
// ============================================================================

/*
"use client";

import { useState } from "react";
import Loading from "@/components/_ui/Loading";
import Button from "@/components/_ui/Button";

export default function FormComponent() {
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            await fetch('/api/submit', { method: 'POST' });
            setSuccess(true);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            
            
            <Button type="submit" disabled={submitting}>
                {submitting ? (
                    <>
                        <Loading 
                            variant="spinner" 
                            size="sm" 
                            colorClass="text-white" 
                            notAbsolute 
                        />
                        <span className="ml-2">Enviando...</span>
                    </>
                ) : (
                    "Enviar"
                )}
            </Button>
        </form>
    );
}
*/

// ============================================================================
// EXEMPLO 7: Customizar NProgress programaticamente
// ============================================================================

/*
"use client";

import NProgress from "nprogress";
import { useEffect } from "react";

export default function CustomProgressPage() {
    useEffect(() => {
        // Inicia manualmente
        NProgress.start();
        
        // Simula progresso
        const interval = setInterval(() => {
            NProgress.inc(); // Incrementa
        }, 500);
        
        // Completa depois de 3 segundos
        setTimeout(() => {
            clearInterval(interval);
            NProgress.done();
        }, 3000);
        
        return () => {
            clearInterval(interval);
            NProgress.done();
        };
    }, []);

    return <div>Conteúdo com progresso customizado</div>;
}
*/

// ============================================================================
// EXEMPLO 8: Loading com mensagens dinâmicas
// ============================================================================

/*
"use client";

import { useState, useEffect } from "react";
import Loading from "@/components/_ui/Loading";

const loadingMessages = [
    "Carregando dados...",
    "Preparando interface...",
    "Quase pronto...",
    "Finalizando..."
];

export default function DynamicLoadingPage() {
    const [loading, setLoading] = useState(true);
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const messageInterval = setInterval(() => {
            setMessageIndex(prev => (prev + 1) % loadingMessages.length);
        }, 1000);

        const loadTimer = setTimeout(() => {
            setLoading(false);
        }, 4000);

        return () => {
            clearInterval(messageInterval);
            clearTimeout(loadTimer);
        };
    }, []);

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white">
                <div className="text-center">
                    <Loading variant="spinner" size="xl" colorClass="text-[#4F85A6]" notAbsolute />
                    <p className="mt-4 text-lg text-[#3f3c40] animate-pulse">
                        {loadingMessages[messageIndex]}
                    </p>
                </div>
            </div>
        );
    }

    return <div>Conteúdo carregado!</div>;
}
*/

// ============================================================================
// DICAS E MELHORES PRÁTICAS
// ============================================================================

/**
 * 1. Use loading.tsx para carregamentos de rota completa
 * 2. Use <Loading /> component para carregamentos inline
 * 3. Use NProgress para feedback visual durante navegação
 * 4. Sempre forneça feedback visual para operações > 200ms
 * 5. Prefira notAbsolute={true} quando usar loading inline
 * 6. Use cores do tema para consistência visual
 * 7. Adicione mensagens contextuais quando apropriado
 * 8. Teste com delay artificial durante desenvolvimento
 */
