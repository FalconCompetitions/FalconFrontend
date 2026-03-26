# Sistema de Loading do Falcon Platform

Sistema completo de animações de loading para melhorar a experiência do usuário durante navegação e carregamento de páginas.

## 📦 Instalação Necessária

Primeiro, instale a dependência do NProgress:

```bash
npm install nprogress
npm install --save-dev @types/nprogress
```

## 🎯 Componentes Implementados

### 1. **NavigationProgress** (Barra de Progresso Superior)
- **Localização**: `src/components/NavigationProgress/index.tsx`
- **Função**: Mostra uma barra de progresso no topo durante transições de rota
- **Características**:
  - Gradiente customizado (#4F85A6 → #3f3c40)
  - Animação suave e responsiva
  - Sem spinner (apenas barra)
  - Alto z-index (9999) para ficar sempre visível

### 2. **Loading Pages** (Telas de Carregamento Hierárquicas)

#### Root Loading (`src/app/loading.tsx`)
- Aplicado a todas as rotas por padrão
- Design limpo com fundo branco
- Usado como fallback

#### Auth Loading (`src/app/(auth)/loading.tsx`)
- Específico para rotas de autenticação (/login, /register, /logout, /recover)
- Gradiente matching com design das páginas de auth
- Cores: #4F85A6 → #3f3c40

#### Profile Loading (`src/app/Profile/loading.tsx`)
- Para área de perfil do usuário
- Design minimalista que não interfere com o layout
- Altura mínima de 60vh

#### Competition Loading (`src/app/Competition/loading.tsx`)
- Para páginas de competição
- Card centralizado com backdrop blur
- Mensagens contextualizadas

#### Exercise Loading (`src/app/Exercise/loading.tsx`)
- Para páginas de exercícios
- Similar ao Competition com mensagens específicas

## 🎨 Customização de Estilos

### NProgress Custom CSS (`src/styles/nprogress-custom.css`)

```css
/* Customizações aplicadas: */
- Altura da barra: 3px
- Gradiente: linear-gradient(90deg, #4F85A6 0%, #3f3c40 100%)
- Shadow: 0 0 10px rgba(79, 133, 166, 0.5)
- Efeito blur no "peg"
- Spinner desabilitado
```

## 🔧 Como Funciona

### Hierarquia de Loading

O Next.js usa um sistema hierárquico para loading states:

```
app/
├── loading.tsx              ← Fallback global
├── (auth)/
│   ├── loading.tsx          ← Sobrescreve para rotas auth
│   ├── login/page.tsx
│   └── register/page.tsx
├── Profile/
│   ├── loading.tsx          ← Sobrescreve para Profile
│   └── page.tsx
└── Competition/
    ├── loading.tsx          ← Sobrescreve para Competition
    └── page.tsx
```

### Fluxo de Execução

1. **Transição de Rota Inicia**
   - NavigationProgress detecta mudança no `pathname`
   - Barra de progresso aparece no topo
   - Next.js automaticamente mostra o `loading.tsx` mais próximo

2. **Durante o Carregamento**
   - Barra de progresso anima
   - Loading component é exibido
   - Dados sendo fetchados

3. **Carregamento Completo**
   - Barra de progresso desaparece
   - Loading component é substituído pela página real
   - Transição suave

## 📱 Responsividade

Todos os componentes de loading são totalmente responsivos:
- `fixed inset-0`: Ocupa toda a viewport
- `overflow-hidden`: Previne scroll indesejado
- `flex items-center justify-center`: Centralização perfeita
- Tamanhos adaptativos: xl, lg, md

## ⚡ Performance

### Otimizações Implementadas

1. **NProgress Configuration**
   ```tsx
   NProgress.configure({
       showSpinner: false,  // Reduz re-renders
       trickleSpeed: 50,    // Animação suave
       minimum: 0.08,       // Start rápido
       easing: "ease",      // Transição natural
       speed: 200,          // Rápido mas perceptível
   });
   ```

2. **Suspense Boundaries**
   - Loading.tsx cria suspense boundaries automáticos
   - Streaming SSR habilitado
   - Hidratação progressiva

3. **CSS Optimizations**
   - `pointer-events: none` no nprogress
   - `transform` e `opacity` para animações (GPU)
   - `backdrop-blur-sm` para efeitos modernos

## 🎯 Melhores Práticas Seguidas

✅ **Hierarquia Clara**: Loading específico por seção
✅ **Consistência Visual**: Cores do tema aplicadas
✅ **Acessibilidade**: `role="status"`, `aria-label`, `sr-only`
✅ **TypeScript**: Tipagem completa
✅ **Documentação**: JSDoc em todos os componentes
✅ **Clean Code**: Sem lógica complexa
✅ **Next.js 15**: Compatível com App Router
✅ **Performance**: Otimizações de rendering

## 🚀 Uso em Novas Páginas

Para adicionar loading a uma nova seção:

1. Crie `loading.tsx` na pasta da rota:
   ```tsx
   // app/NovaSecao/loading.tsx
   import Loading from "@/components/_ui/Loading";
   
   export default function NovaSecaoLoading() {
       return (
           <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
               <Loading variant="spinner" size="xl" colorClass="text-[#4F85A6]" notAbsolute />
               <p className="mt-4 text-lg text-[#3f3c40]">Carregando nova seção...</p>
           </div>
       );
   }
   ```

2. Pronto! Next.js cuida do resto automaticamente.

## 🎨 Variações Disponíveis

O componente `<Loading />` suporta:

- **Variants**: `spinner`, `overlay`, `dots`, `bar`
- **Sizes**: `xs`, `sm`, `md`, `lg`, `xl`
- **Custom Colors**: Via `colorClass` prop

## 📊 Métricas

- **TTI (Time to Interactive)**: Melhorado com feedback visual
- **FCP (First Contentful Paint)**: Mantido otimizado
- **CLS (Cumulative Layout Shift)**: Zero (fixed positions)
- **LCP (Largest Contentful Paint)**: Não impactado

## 🔍 Debug

Para testar os loading states, adicione delay artificial:

```tsx
// Em qualquer page.tsx
export default async function Page() {
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2s delay
    return <div>Conteúdo</div>;
}
```

## 📝 Notas Importantes

1. **NavigationProgress** é client-side only (`"use client"`)
2. **Loading.tsx** files são Server Components por padrão
3. **Suspense boundaries** são criados automaticamente
4. **CSS global** do nprogress é importado no layout root

## 🎓 Referências

- [Next.js Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [NProgress Documentation](https://ricostacruz.com/nprogress/)
- [React Suspense](https://react.dev/reference/react/Suspense)

---

**Implementado em**: Falcon Platform v1.0  
**Compatibilidade**: Next.js 15+, React 19+
