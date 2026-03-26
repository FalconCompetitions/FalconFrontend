# CompetitionStatusBar - Guia de Uso

## 📋 Descrição

Componente de barra de status em tempo real para competições, mostrando informações essenciais como timer, status de conexão, disponibilidade de submissões e status do ranking.

## ✨ Recursos

- **Timer em Tempo Real**: Countdown até o fim da competição (atualiza a cada segundo)
- **Status de Conexão**: Indicador visual de conexão WebSocket (conectado/desconectado)
- **Status da Competição**: Badge mostrando se está em andamento, encerrada ou aguardando início
- **Status de Submissões**: Indica se submissões estão abertas ou bloqueadas
- **Status do Ranking**: Mostra se ranking está ativo ou congelado
- **Contador de Exercícios**: Número total de exercícios na competição
- **Design Responsivo**: Adapta-se a diferentes tamanhos de tela

## 🎨 Preview

### Estados do Componente

1. **Sem Competição Ativa**
   - Mostra mensagem "Nenhuma competição ativa no momento"

2. **Desconectado**
   - Alerta vermelho indicando falha de conexão

3. **Competição em Andamento**
   - Timer contando tempo restante
   - Badge verde "Em Andamento"
   - Cards mostrando status de submissões, exercícios e ranking

4. **Competição Encerrada**
   - Badge vermelho "Encerrada"
   - Alerta com data/hora do encerramento

## 📦 Instalação/Uso

### Opção 1: Adicionar ao Layout da Competição (Recomendado)

```tsx
// src/app/Competition/layout.tsx
"use client"; 

import { FC, ReactNode } from "react";
import QuestionsContextProvider from "../../components/pages/Competition/providers/QuestionsContextProvider";
import { CompetitionHubProvider } from "@/contexts/CompetitionHubContext";
import { CompetitionStatusBar } from "@/components/pages/Competition/CompetitionStatusBar";

const CompetitionPageProviders: FC<{ children: ReactNode }> = ({ children }) => {
    return(
        <CompetitionHubProvider>
            <QuestionsContextProvider>
                {/* Status Bar aparece em todas as páginas da competição */}
                <CompetitionStatusBar />
                
                <main className="flex-grow w-full">
                    {children}
                </main>

            </QuestionsContextProvider>
        </CompetitionHubProvider>
    );
}

export default CompetitionPageProviders;
```

### Opção 2: Usar em Página Específica

```tsx
// Em qualquer página dentro de /Competition
import { CompetitionStatusBar } from "@/components/pages/Competition/CompetitionStatusBar";

export default function RankingPage() {
  return (
    <>
      <CompetitionStatusBar />
      {/* Resto do conteúdo da página */}
    </>
  );
}
```

## 🔧 Dependências

O componente requer que os seguintes providers estejam configurados na hierarquia superior:

1. **CompetitionHubProvider** - Para acesso aos dados do SignalR
2. **UserContextProvider** - Para dados do usuário
3. **WebSocketContextProvider** - Para conexão WebSocket

Estrutura de providers no `app/layout.tsx`:

```tsx
<UserContextProvider>
  <WebSocketContextProvider>
    <CompetitionHubProvider>
      {/* CompetitionStatusBar pode ser usado aqui */}
    </CompetitionHubProvider>
  </WebSocketContextProvider>
</UserContextProvider>
```

## 📊 Dados Exibidos

### Cards Informativos

| Card | Descrição | Cores |
|------|-----------|-------|
| **Tempo Restante** | Countdown no formato HH:MM:SS | Azul (#4F85A6) |
| **Submissões** | Abertas/Bloqueadas | Verde (abertas) / Vermelho (bloqueadas) |
| **Exercícios** | Número total de exercícios | Azul claro |
| **Ranking** | Ativo/Congelado | Roxo (ativo) / Cinza (congelado) |

### Badges de Status

- **Em Andamento** - Verde com ícone ✓
- **Encerrada** - Vermelho com ícone ✗
- **Aguardando Início** - Amarelo com ícone ⏳
- **Conectado** - Ponto verde pulsante
- **Desconectado** - Ponto vermelho

## 🎯 Hooks Utilizados

O componente usa o hook `useCompetitionStatus()` que fornece:

```typescript
const {
  ongoingCompetition,    // Dados da competição atual
  isConnected,           // Status da conexão WebSocket
  hasActiveCompetition,  // Se há competição ativa
  competitionStatus,     // { isStarted, isEnded, isOngoing }
  canSubmit,             // Se submissões estão permitidas
  isRankingActive,       // Se ranking está sendo atualizado
  timeRemaining,         // { hours, minutes, seconds, totalSeconds }
} = useCompetitionStatus();
```

## 🔄 Atualização Automática

- **Timer**: Atualiza a cada 1 segundo via `setInterval`
- **Status**: Atualiza em tempo real via eventos SignalR
- **Conexão**: Ping automático a cada 30 segundos (gerenciado pelo hook)

## 🎨 Customização de Estilos

O componente usa Tailwind CSS e pode ser customizado modificando:

- **Cor principal**: `#4F85A6` (azul do projeto) - altere as classes `bg-[#4F85A6]`
- **Espaçamento**: Ajuste `gap-*`, `p-*`, `px-*`, `py-*`
- **Responsividade**: Grid usa `grid-cols-2 md:grid-cols-4`

### Exemplo de Customização

```tsx
// Criar um wrapper com estilos customizados
<div className="sticky top-0 z-50">
  <CompetitionStatusBar />
</div>
```

## 🐛 Tratamento de Erros

O componente lida com:

- ✅ Sem competição ativa
- ✅ Conexão WebSocket perdida
- ✅ Competição sem data de término
- ✅ Dados incompletos do backend

## 📱 Responsividade

- **Desktop (≥1024px)**: Grid 4 colunas, informações completas
- **Tablet (768px-1023px)**: Grid 4 colunas adaptado
- **Mobile (<768px)**: Grid 2 colunas, informações empilhadas

## 🚀 Performance

- Re-renders otimizados via `useMemo` no hook
- Timer usa estado mínimo (apenas para forçar re-render)
- Cleanup de interval no `useEffect` cleanup

## 📝 Notas de Desenvolvimento

- Componente originalmente em `examples/CompetitionStatusBar.tsx`
- Export público via `CompetitionStatusBar/index.tsx`
- Testado com todas as features do CompetitionHubContext
- Compatível com SSR (Next.js App Router) via `"use client"`

## 🔗 Arquivos Relacionados

- **Componente**: `src/components/pages/Competition/examples/CompetitionStatusBar.tsx`
- **Export**: `src/components/pages/Competition/CompetitionStatusBar/index.tsx`
- **Hook**: `src/contexts/CompetitionHubContext/hooks/useCompetitionStatus.ts`
- **Context**: `src/contexts/CompetitionHubContext/index.tsx`
- **Layout**: `src/app/Competition/layout.tsx`
