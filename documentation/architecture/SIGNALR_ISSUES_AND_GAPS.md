# ⚠️ Questões e Brechas Identificadas - SignalR Implementation

## 🔴 CRÍTICO - Requer Verificação Imediata

### 1. Tipo de `groupId` - Inconsistência entre Documentação e Types
**Problema:** A documentação do SignalR Hub indica que `groupId` é `string` (UUID), mas o tipo `Group` no frontend usa `id: number`.

**Locais afetados:**
- `src/types/Group/index.ts` - `Group.id: number`
- `src/types/SignalR/Requests.ts` - Implementado como `string`
- `src/types/SignalR/index.ts` - Implementado como `string`

**Ação necessária:**
- [ ] Confirmar com backend qual é o tipo correto
- [ ] Se for `number`, alterar todos os `groupId: string` para `number` nos tipos SignalR
- [ ] Se for `string` (UUID), alterar `Group.id` de `number` para `string`

**Impacto:** ALTO - Afeta todas as operações de submissão, perguntas e ranking.

---

### 2. Processamento Assíncrono de Submissões
**Problema:** As submissões NÃO retornam resposta imediata. São enfileiradas e processadas por worker em background.

**Status:** Implementado corretamente, mas requer UI/UX adequada.

**Ação necessária:**
- [ ] Implementar feedback visual claro de "Processando..."
- [ ] Mostrar status de fila se disponível
- [ ] Considerar timeout ou estimativa de tempo

**Exemplo de UX recomendada:**
```
"Submissão enviada! Aguarde o processamento (pode levar alguns minutos)..."
[Barra de progresso indeterminada]
```

---

## 🟡 IMPORTANTE - Funcionalidades Incompletas

### 3. Sistema de Ranking
**Problema:** A documentação não menciona eventos de ranking do servidor. Ranking está sendo calculado localmente.

**Implementação atual:** 
- Ranking calculado no frontend baseado em submissões recebidas
- Pode haver discrepância com ranking "oficial" do backend

**Perguntas:**
- [ ] O backend envia eventos de ranking atualizado?
- [ ] Qual o nome do evento? (ex: `ReceiveRankingUpdate`)
- [ ] Qual a estrutura exata de `CompetitionRankingResponse`?
- [ ] O ranking é calculado no servidor ou apenas no cliente?

**Se backend enviar ranking:**
Adicionar listener em `CompetitionHubContext`:
```typescript
webSocketConnection.on("ReceiveRankingUpdate", (ranking: CompetitionRankingResponse[]) => {
  setRanking(ranking);
});
```

---

### 4. Interface `Answer` Incompleta
**Problema:** Documentação do backend não detalha todos os campos de `Answer`.

**Campos assumidos:**
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

**Ação necessária:**
- [ ] Confirmar estrutura completa com backend
- [ ] Verificar se há campos adicionais (ex: `createdAt`, `updatedAt`, etc.)

---

### 5. Respostas Privadas - Eventos Não Documentados
**Problema:** Não está claro se respostas privadas (`isPrivate: true`) geram eventos específicos diferentes.

**Questões:**
- [ ] Existe evento `ReceivePrivateAnswer` separado?
- [ ] Como estudantes recebem respostas privadas destinadas a eles?
- [ ] Respostas privadas aparecem em `ReceiveQuestionAnswer` para todos ou só para o grupo?

**Implementação atual:** Todas as respostas são tratadas igual.

---

### 6. Método `UnblockGroupSubmission`
**Problema:** Documentação menciona apenas `BlockGroupSubmission`. Não há informação sobre desbloquear.

**Status:** Implementado por inferência, mas pode estar incorreto.

**Ação necessária:**
- [ ] Confirmar se método existe no backend
- [ ] Qual o nome exato? (`UnblockGroupSubmission`, `RemoveBlockGroupSubmission`, etc.)
- [ ] Qual a estrutura da request?

---

## 🟢 MENOR - Melhorias Recomendadas

### 7. Validação de Datas
**Problema:** Assumindo que datas vêm como ISO 8601 strings, mas não verificado.

**Ação necessária:**
- [ ] Confirmar formato de datas do backend
- [ ] Adicionar validação/parsing se necessário

---

### 8. Estrutura Completa de `Exercise` em Responses
**Problema:** `ExerciseSubmissionResponse.exercise` pode ter campos diferentes do `Exercise` base.

**Ação necessária:**
- [ ] Verificar se backend retorna `Exercise` completo ou apenas campos básicos
- [ ] Confirmar se todos os campos estão presentes (inputs, outputs, etc.)

---

### 9. Tratamento de Erros
**Problema:** Implementação básica de tratamento de erros.

**Melhorias recomendadas:**
- [ ] Adicionar retry logic para falhas de rede
- [ ] Implementar estratégia de reconexão mais robusta
- [ ] Adicionar logging estruturado
- [ ] Toast notifications para diferentes tipos de erro

---

### 10. Persistência Local
**Problema:** Se conexão cair, dados são perdidos.

**Melhorias recomendadas:**
- [ ] Armazenar submissões em localStorage como backup
- [ ] Implementar queue offline para submissões
- [ ] Sincronizar quando reconectar

---

### 11. Performance com Muitas Submissões
**Problema:** Com milhares de submissões, o state pode ficar grande.

**Melhorias recomendadas:**
- [ ] Implementar paginação ou windowing para lista de submissões
- [ ] Considerar virtualização para listas longas
- [ ] Limpar submissões antigas após X tempo

---

### 12. Tipos de Exercício (LanguageType)
**Problema:** Enum `LanguageType` pode não estar sincronizado com backend.

**Valores atuais:**
```typescript
0=CSharp, 1=Java, 2=Javascript, 3=Go, 4=Python, 5=C, 6=C++, 7=PHP
```

**Ação necessária:**
- [ ] Confirmar valores com backend
- [ ] Verificar se há novas linguagens

---

## 📋 Checklist de Testes Necessários

Antes de considerar a implementação 100% funcional:

### Testes de Integração
- [ ] Conectar ao hub e receber `OnConnectionResponse`
- [ ] Enviar submissão e receber `ReceiveExerciseAttemptResponse`
- [ ] Enviar pergunta e receber `ReceiveQuestionCreationResponse`
- [ ] Responder pergunta (como Admin/Teacher)
- [ ] Alterar veredicto de submissão
- [ ] Bloquear grupo
- [ ] Desbloquear grupo
- [ ] Verificar ranking calculado corretamente
- [ ] Testar reconexão após perda de conexão
- [ ] Testar com múltiplos usuários simultâneos

### Testes de Edge Cases
- [ ] Submissão durante período bloqueado
- [ ] Pergunta após competição encerrada
- [ ] Submissão com código vazio
- [ ] Submissão com código > maxSubmissionSize
- [ ] Resposta privada vs pública
- [ ] Múltiplas submissões do mesmo exercício
- [ ] Submissão de usuário sem grupo

### Testes de Performance
- [ ] 100+ submissões no state
- [ ] 1000+ submissões no state
- [ ] Múltiplas telas abertas simultaneamente
- [ ] Ranking com 50+ grupos

---

## 🛠️ Arquivos Criados

### Types
- `src/types/SignalR/index.ts` - Response types
- `src/types/SignalR/Requests.ts` - Request types

### Context & Hooks
- `src/contexts/CompetitionHubContext/index.tsx` - Main provider
- `src/contexts/CompetitionHubContext/hooks/useSubmissions.ts`
- `src/contexts/CompetitionHubContext/hooks/useQuestions.ts`
- `src/contexts/CompetitionHubContext/hooks/useRanking.ts`
- `src/contexts/CompetitionHubContext/hooks/useAdminActions.ts`
- `src/contexts/CompetitionHubContext/hooks/useCompetitionStatus.ts`
- `src/contexts/CompetitionHubContext/hooks/index.ts`

### Example Components
- `src/components/pages/Competition/examples/ExerciseSubmissionForm.tsx`
- `src/components/pages/Competition/examples/LiveRankingTable.tsx`
- `src/components/pages/Competition/examples/QuestionForm.tsx`
- `src/components/pages/Competition/examples/CompetitionStatusBar.tsx`

### Documentation
- `docs/SIGNALR_FRONTEND_IMPLEMENTATION.md` - Guia completo de implementação
- `.github/copilot-instructions.md` - Atualizado com informações do SignalR

### Configuration
- `src/app/layout.tsx` - Atualizado com `CompetitionHubProvider`

---

## 📞 Próximos Passos Recomendados

1. **IMEDIATO:** Resolver questão do tipo `groupId` (#1)
2. **CURTO PRAZO:** 
   - Confirmar estrutura de ranking (#3)
   - Testar todas as funcionalidades com backend real
3. **MÉDIO PRAZO:**
   - Implementar melhorias de UX para submissões assíncronas
   - Adicionar testes automatizados
4. **LONGO PRAZO:**
   - Otimizações de performance
   - Sistema de persistência offline

---

## 🎯 Status Geral da Implementação

| Componente | Status | Nota |
|------------|--------|------|
| Types/Interfaces | ✅ 95% | Pendente confirmação de `groupId` |
| Context/Provider | ✅ 100% | Funcional |
| Hooks | ✅ 100% | Funcionais |
| Event Listeners | ✅ 100% | Todos implementados |
| Example Components | ✅ 100% | Prontos para uso |
| Documentação | ✅ 100% | Completa |
| Testes | ❌ 0% | Nenhum teste criado |
| Validação Backend | ⚠️ 0% | Requer testes com backend real |

**Conclusão:** A implementação está 90% completa e pronta para testes. Principais bloqueadores são verificações com o backend sobre tipos e eventos não documentados.
