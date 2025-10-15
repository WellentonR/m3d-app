# 3. Arquitetura e Tecnologias

## 3.1 Visão Geral da Arquitetura

O **Miniaturas 3D Store** utiliza uma arquitetura moderna baseada em **JAMstack** (JavaScript, APIs, Markup) com renderização híbrida.

```
┌─────────────────────────────────────────────────────────┐
│                    Cliente (Browser)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   React UI   │  │  TypeScript  │  │ Tailwind CSS │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    Next.js 15 (Vercel)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ App Router   │  │Server Actions│  │  API Routes  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│  ┌──────────────┐  ┌──────────────┐                     │
│  │   SSR/SSG    │  │  Middleware  │                     │ 
│  └──────────────┘  └──────────────┘                     │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Supabase (Backend as a Service)            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  PostgreSQL  │  │     Auth     │  │  Storage API │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│  ┌──────────────┐  ┌──────────────┐                     │ 
│  │     RLS      │  │   Realtime   │                     │
│  └──────────────┘  └──────────────┘                     │
└─────────────────────────────────────────────────────────┘
```

## 3.2 Stack Tecnológico

### 3.2.1 Front-end

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| Next.js | 15.x | Framework React full-stack |
| React | 18.x | Biblioteca UI |
| TypeScript | 5.x | Linguagem com tipagem |
| Tailwind CSS | 4.x | Framework CSS |
| shadcn/ui | Latest | Componentes UI |

### 3.2.2 Back-end

| Tecnologia | Propósito |
|------------|-----------|
| Next.js API Routes | Endpoints REST |
| Next.js Server Actions | Mutações do servidor |
| Supabase | Backend as a Service |
| PostgreSQL | Banco de dados relacional |

### 3.2.3 Infraestrutura

| Serviço | Propósito |
|---------|-----------|
| Vercel | Hospedagem e deploy |
| Supabase | Banco de dados e autenticação |
| GitHub | Controle de versão |

## 3.3 Padrões de Projeto

### 3.3.1 Component Pattern

Componentes organizados por responsabilidade:

```
components/
├── ui/              # Componentes base (shadcn)
├── layout/          # Header, Footer
├── product/         # Relacionados a produtos
├── cart/            # Relacionados ao carrinho
└── admin/           # Componentes administrativos
```

### 3.3.2 Server/Client Pattern

```typescript
// Server Component (padrão)
async function ProductsPage() {
  const products = await getProducts() // Fetch no servidor
  return <ProductList products={products} />
}

// Client Component (interativo)
'use client'
function AddToCartButton() {
  const [loading, setLoading] = useState(false)
  // Lógica interativa
}
```

### 3.3.3 Repository Pattern

Abstração de acesso a dados:

```typescript
// lib/repositories/products.ts
export async function getProducts() {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('products')
    .select('*')
  return data
}
```

## 3.4 Fluxos de Dados

### 3.4.1 Fluxo de Autenticação

```
1. Usuário preenche formulário de login
2. Dados enviados para Supabase Auth
3. Supabase valida credenciais
4. Token JWT retornado
5. Token armazenado em cookie
6. Middleware valida token em cada requisição
7. Usuário autenticado acessa rotas protegidas
```

### 3.4.2 Fluxo de Compra

```
1. Cliente navega pelo catálogo
2. Adiciona produtos ao carrinho (salvo no DB)
3. Acessa página do carrinho
4. Preenche dados de entrega
5. Seleciona método de pagamento
6. Confirma pedido
7. Pedido criado no banco de dados
8. Itens do carrinho movidos para order_items
9. Carrinho limpo
10. Página de confirmação exibida
```

### 3.4.3 Fluxo Administrativo

```
1. Admin faz login
2. Middleware verifica flag is_admin
3. Acesso ao painel administrativo
4. CRUD de produtos via Server Actions
5. Atualização de status de pedidos
6. Dados sincronizados em tempo real
```

## 3.5 Segurança

### 3.5.1 Camadas de Segurança

1. **Autenticação**: Supabase Auth com JWT
2. **Autorização**: Row Level Security (RLS)
3. **Validação**: Zod schemas no cliente e servidor
4. **Sanitização**: Proteção contra XSS e SQL Injection
5. **HTTPS**: Comunicação criptografada
6. **CORS**: Configuração restritiva

### 3.5.2 Políticas RLS

```sql
-- Exemplo: Usuários só veem seu próprio carrinho
CREATE POLICY "Users view own cart"
ON cart FOR SELECT
USING (auth.uid() = user_id);

-- Exemplo: Apenas admins podem deletar produtos
CREATE POLICY "Only admins delete products"
ON products FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);
```