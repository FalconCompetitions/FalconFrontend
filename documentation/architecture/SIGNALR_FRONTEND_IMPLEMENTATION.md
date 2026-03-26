# SignalR Competition Hub - Guia de Implementação Frontend

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Tipos e Interfaces](#tipos-e-interfaces)
4. [Context e Provider](#context-e-provider)
5. [Hooks Disponíveis](#hooks-disponíveis)
6. [Exemplos de Uso](#exemplos-de-uso)
7. [Problemas Conhecidos e Soluções](#problemas-conhecidos-e-soluções)

---

## Visão Geral

Esta implementação fornece uma camada completa de integração com o SignalR Competition Hub do backend, incluindo:

- ✅ Context centralizado para gerenciar conexão e estado
- ✅ Hooks especializados para cada funcionalidade
- ✅ Listeners automáticos para todos os eventos do hub
- ✅ Type-safe com TypeScript
- ✅ Notificações via Notistack integradas
- ✅ Componentes de exemplo prontos para uso

---

## Arquitetura

### Estrutura de Arquivos

```
src/
├── types/
│   └── SignalR/
│       ├── index.ts              # Response types
│       └── Requests.ts           # Request types
├── contexts/
│   ├── WebSocketContext/         # Conexão SignalR base
│   └── CompetitionHubContext/    # Hub específico da competição
│       ├── index.tsx             # Provider e context principal
│       └── hooks/                # Hooks especializados
│           ├── useSubmissions.ts
│           ├── useQuestions.ts
│           ├── useRanking.ts
│           ├── useAdminActions.ts
│           └── useCompetitionStatus.ts
└── components/
    └── pages/
        └── Competition/
            └── examples/         # Componentes de exemplo
                ├── ExerciseSubmissionForm.tsx
                ├── LiveRankingTable.tsx
                ├── QuestionForm.tsx
                └── CompetitionStatusBar.tsx
```

### Hierarquia de Providers

O `CompetitionHubProvider` deve estar envolvido pelo `WebSocketContextProvider`:

```tsx
<WebSocketContextProvider>
  <CompetitionHubProvider>
    {/* Sua aplicação */}
  </CompetitionHubProvider>
</WebSocketContextProvider>
```

Já está configurado em `src/app/layout.tsx`.

---

## Tipos e Interfaces

### Request Types (`src/types/SignalR/Requests.ts`)

- `GroupExerciseAttemptRequest` - Enviar submissão de exercício
- `CreateGroupQuestionRequest` - Criar pergunta
- `AnswerGroupQuestionRequest` - Responder pergunta (Admin/Teacher)
- `RevokeGroupSubmissionRequest` - Alterar resposta do juiz
- `BlockGroupSubmissionRequest` - Bloquear grupo
- `UnblockGroupSubmissionRequest` - Desbloquear grupo

### Response Types (`src/types/SignalR/index.ts`)

- `OnConnectionResponse` - Dados da competição ao conectar
- `ExerciseSubmissionResponse` - Resultado de submissão
- `QuestionResponse` - Pergunta criada
- `AnswerResponse` - Resposta a uma pergunta
- `CompetitionRankingResponse` - Entrada no ranking

---

## Context e Provider

### CompetitionHubContext

O contexto principal que gerencia todo o estado do hub.

**Estado exposto:**
- `ongoingCompetition` - Competição atual
- `submissions` - Todas as submissões em tempo real
- `questions` - Todas as perguntas em tempo real
- `ranking` - Ranking calculado
- `isConnected` - Status da conexão

**Métodos expostos:**
- `sendExerciseAttempt()` - Enviar submissão
- `sendQuestion()` - Fazer pergunta
- `answerQuestion()` - Responder pergunta (Admin/Teacher)
- `changeJudgeResponse()` - Alterar veredicto (Admin/Teacher)
- `blockGroupSubmission()` - Bloquear grupo (Admin/Teacher)
- `unblockGroupSubmission()` - Desbloquear grupo (Admin/Teacher)
- `ping()` - Health check

---

## Hooks Disponíveis

### 1. `useCompetitionHub()`

Hook principal que expõe todo o contexto. Use os hooks especializados abaixo para casos específicos.

```tsx
import { useCompetitionHub } from "@/contexts/CompetitionHubContext";

const { ongoingCompetition, submissions, questions, isConnected } = useCompetitionHub();
```

### 2. `useSubmissions()`

Para trabalhar com submissões de exercícios.

```tsx
import { useSubmissions } from "@/contexts/CompetitionHubContext/hooks";

const {
  submissions,
  sendExerciseAttempt,
  getSubmissionsByGroup,
  getSubmissionsByExercise,
  acceptedSubmissions,
  rejectedSubmissions,
  getLatestSubmission,
  getGroupStats,
} = useSubmissions();
```

**Exemplo:**
```tsx
// Obter estatísticas do grupo
const stats = getGroupStats(groupId);
console.log(`Aceitas: ${stats.accepted}, Rejeitadas: ${stats.rejected}`);

// Enviar submissão
await sendExerciseAttempt({
  groupId: "uuid",
  exerciseId: 1,
  languageType: 4, // Python
  code: "print('Hello')",
  competitionId: 1,
});
```

### 3. `useQuestions()`

Para gerenciar perguntas e respostas.

```tsx
import { useQuestions } from "@/contexts/CompetitionHubContext/hooks";

const {
  questions,
  sendQuestion,
  answerQuestion,
  answeredQuestions,
  unansweredQuestions,
  getQuestionsByGroup,
  getQuestionById,
  questionStats,
} = useQuestions();
```

**Exemplo:**
```tsx
// Enviar pergunta
await sendQuestion({
  groupId: "uuid",
  competitionId: 1,
  questionText: "Como funciona a entrada?",
  questionType: 1, // Exercise question
  exerciseId: 1,
});

// Responder pergunta (Admin/Teacher)
await answerQuestion({
  questionId: 42,
  answerText: "A entrada é via stdin...",
  isPrivate: false,
});
```

### 4. `useRanking()`

Para acessar e calcular ranking em tempo real.

```tsx
import { useRanking } from "@/contexts/CompetitionHubContext/hooks";

const {
  liveRanking,
  getGroupRank,
  getTopGroups,
  hasGroupSolvedExercise,
} = useRanking();
```

**Exemplo:**
```tsx
// Obter top 3
const top3 = getTopGroups(3);

// Verificar se grupo resolveu exercício
const solved = hasGroupSolvedExercise(groupId, exerciseId);

// Obter posição do grupo
const rank = getGroupRank(groupId);
console.log(`Posição: ${rank?.rankOrder}`);
```

### 5. `useCompetitionStatus()`

Para monitorar status e tempo da competição.

```tsx
import { useCompetitionStatus } from "@/contexts/CompetitionHubContext/hooks";

const {
  ongoingCompetition,
  isConnected,
  hasActiveCompetition,
  competitionStatus,
  canSubmit,
  timeRemaining,
  isRankingActive,
} = useCompetitionStatus();
```

**Exemplo:**
```tsx
if (!canSubmit) {
  alert("Submissões bloqueadas!");
}

if (timeRemaining) {
  console.log(`Faltam ${timeRemaining.hours}h ${timeRemaining.minutes}m`);
}
```

### 6. `useAdminActions()`

Para ações administrativas (Admin/Teacher apenas).

```tsx
import { useAdminActions } from "@/contexts/CompetitionHubContext/hooks";

const {
  changeJudgeResponse,
  blockGroupSubmission,
  unblockGroupSubmission,
} = useAdminActions();
```

**Exemplo:**
```tsx
// Alterar veredicto manualmente
await changeJudgeResponse({
  submissionId: 123,
  newJudgeResponse: 0, // Accepted
});

// Bloquear grupo
await blockGroupSubmission({
  groupId: "uuid",
  competitionId: 1,
  reason: "Comportamento suspeito",
});
```

---

## Exemplos de Uso

### Página Completa de Competição

```tsx
"use client";

import { CompetitionStatusBar } from "@/components/pages/Competition/examples/CompetitionStatusBar";
import { LiveRankingTable } from "@/components/pages/Competition/examples/LiveRankingTable";
import { ExerciseSubmissionForm } from "@/components/pages/Competition/examples/ExerciseSubmissionForm";
import { QuestionForm } from "@/components/pages/Competition/examples/QuestionForm";

export default function CompetitionPage() {
  return (
    <div className="container mx-auto p-4">
      <CompetitionStatusBar />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Submeter Solução</h2>
          <ExerciseSubmissionForm exerciseId={1} />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Fazer Pergunta</h2>
          <QuestionForm />
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Ranking Ao Vivo</h2>
        <LiveRankingTable />
      </div>
    </div>
  );
}
```

### Dashboard Admin para Monitoramento

```tsx
"use client";

import { useSubmissions, useQuestions } from "@/contexts/CompetitionHubContext/hooks";
import { useAdminActions } from "@/contexts/CompetitionHubContext/hooks";

export default function AdminDashboard() {
  const { submissions } = useSubmissions();
  const { unansweredQuestions } = useQuestions();
  const { changeJudgeResponse } = useAdminActions();

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-100 rounded">
          <p className="text-sm text-gray-600">Total Submissões</p>
          <p className="text-3xl font-bold">{submissions.length}</p>
        </div>
        
        <div className="p-4 bg-yellow-100 rounded">
          <p className="text-sm text-gray-600">Perguntas Pendentes</p>
          <p className="text-3xl font-bold">{unansweredQuestions.length}</p>
        </div>
        
        <div className="p-4 bg-green-100 rounded">
          <p className="text-sm text-gray-600">Aceitas</p>
          <p className="text-3xl font-bold">
            {submissions.filter(s => s.accepted).length}
          </p>
        </div>
      </div>
      
      {/* Lista de submissões recentes */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Submissões Recentes</h2>
        <div className="space-y-2">
          {submissions.slice(-10).reverse().map(sub => (
            <div key={sub.id} className="p-3 border rounded flex justify-between">
              <div>
                <p className="font-bold">{sub.group.name}</p>
                <p className="text-sm text-gray-600">
                  Exercício #{sub.exerciseId} - {sub.accepted ? "✓ Aceita" : "✗ Rejeitada"}
                </p>
              </div>
              <button
                onClick={() => changeJudgeResponse({
                  submissionId: sub.id,
                  newJudgeResponse: sub.accepted ? 1 : 0,
                })}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
              >
                Alterar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## Problemas Conhecidos e Soluções

### 1. ⚠️ Processamento Assíncrono de Submissões

**Problema:** As submissões NÃO retornam resposta imediata. Elas são enfileiradas e processadas por um worker em background.

**Solução:** 
- Mostrar feedback de "Submissão enviada para processamento..."
- Aguardar o evento `ReceiveExerciseAttemptResponse` para o resultado
- Pode levar segundos ou minutos dependendo da fila

```tsx
// ✓ Correto
await sendExerciseAttempt(request);
enqueueSnackbar("Submissão enviada! Aguarde o processamento...");

// ✗ Incorreto - não espere resposta imediata
const result = await sendExerciseAttempt(request);
// result será undefined!
```

### 2. ⚠️ Tipo do Group ID

**Problema:** A documentação do backend diz que `groupId` é UUID (string), mas o tipo `Group` no frontend usa `number`.

**Status:** Implementado como `string` seguindo a documentação do hub. Verifique com o backend qual é o tipo correto.

**Ação necessária:** Se o backend usar `number`, altere em:
- `src/types/SignalR/Requests.ts` - todos os `groupId: string` para `groupId: number`
- `src/types/SignalR/index.ts` - `ExerciseSubmissionResponse.groupId` e outros

### 3. ⚠️ Evento de Ranking Não Documentado

**Problema:** A documentação não menciona um evento específico para atualização de ranking em tempo real.

**Solução Implementada:** O ranking é calculado localmente baseado nas submissões recebidas via `ReceiveExerciseAttempt` e `ReceiveExerciseAttemptResponse`.

**Se o backend enviar eventos de ranking:** Adicione listener no `CompetitionHubContext`:

```tsx
webSocketConnection.on("ReceiveRankingUpdate", (ranking: CompetitionRankingResponse[]) => {
  setRanking(ranking);
});
```

### 4. ⚠️ Falta Interface `Answer` Completa

**Problema:** A documentação do backend não detalha todos os campos da interface `Answer`.

**Implementação Atual:**
```typescript
interface AnswerResponse {
  id: number;
  questionId: number;
  userId: string;
  user: GenericUserInfo;
  answerText: string;
  isPrivate: boolean;
  answeredAt: string;
}
```

**Ação necessária:** Verificar com o backend se há campos adicionais.

### 5. ⚠️ Listener para Eventos Privados de Resposta

**Problema:** Não está claro se respostas privadas (`isPrivate: true`) geram eventos diferentes.

**Solução Atual:** Todos os listeners estão implementados. Se houver eventos específicos para respostas privadas, adicione:

```tsx
webSocketConnection.on("ReceivePrivateAnswer", (answer: AnswerResponse) => {
  // Handle private answer
});
```

### 6. ⚠️ Falta Evento `UnblockGroupSubmission`

**Problema:** A documentação menciona `BlockGroupSubmission` mas não está claro se há `UnblockGroupSubmission`.

**Implementação:** Foi implementado baseado na lógica, mas pode precisar de ajuste se o método real do backend for diferente.

### 7. ⚠️ Erro de Lint no Context

**Aviso:** A variável `setRanking` no `CompetitionHubContext` não é usada porque o ranking é calculado localmente.

**Solução:** 
- Remover o `setRanking` se o ranking sempre for calculado localmente
- OU adicionar listener de evento de ranking se o backend enviar

---

## Checklist de Verificação com Backend

Antes de usar em produção, confirme com o backend:

- [ ] Tipo correto de `groupId` (string UUID ou number)
- [ ] Campos completos da interface `Answer`
- [ ] Se existe evento de ranking (`ReceiveRankingUpdate` ou similar)
- [ ] Se respostas privadas geram eventos diferentes
- [ ] Se existe método `UnblockGroupSubmission` no hub
- [ ] Formato exato de datas (ISO 8601 strings?)
- [ ] Estrutura completa de `Exercise` em `ExerciseSubmissionResponse`
- [ ] Se `CompetitionRankingResponse` está completo ou se faltam campos

---

## Próximos Passos

1. **Integrar com páginas reais** - Substituir componentes de exemplo pelos componentes reais da aplicação
2. **Adicionar testes** - Criar testes unitários para hooks e context
3. **Melhorar UX** - Adicionar loaders, skeletons, animações
4. **Persistência** - Considerar armazenar submissões/perguntas em localStorage como backup
5. **Logs estruturados** - Adicionar sistema de logging mais robusto
6. **Tratamento de erros** - Melhorar handling de erros de rede e reconexão

---

## Suporte

Para dúvidas ou problemas:
1. Verifique este documento primeiro
2. Consulte a documentação do backend em `SIGNALR_COMPETITION_HUB_DOCUMENTATION.md`
3. Verifique os console.logs - todos os eventos são logados com emojis para fácil identificação
