# 2. Desenvolvimento e Implementação

## 2.1 Metodologia de Desenvolvimento

O projeto foi desenvolvido seguindo princípios ágeis, com entregas incrementais e foco em funcionalidades prioritárias.

### Fases de Desenvolvimento
1. **Planejamento**: Definição de requisitos e arquitetura
2. **Setup Inicial**: Configuração do ambiente e integrações
3. **Desenvolvimento Front-end**: Criação das interfaces
4. **Desenvolvimento Back-end**: Implementação da lógica de negócio
5. **Integração**: Conexão front-end e back-end
6. **Testes**: Validação de funcionalidades
7. **Deploy**: Publicação na Vercel

## 2.2 Controle de Versão com GIT

### 2.2.1 Repositório

O projeto está versionado no GitHub, servindo como:
- Controle de versão do código
- Documentação do histórico de desenvolvimento
- Portfólio profissional
- Colaboração em equipe

## 2.3 Desenvolvimento Front-end

### 2.3.1 Tecnologias Utilizadas

- **Next.js 15**: Framework React com renderização híbrida
- **React 18**: Biblioteca para construção de interfaces
- **TypeScript**: Superset JavaScript com tipagem estática
- **Tailwind CSS**: Framework CSS utility-first
- **shadcn/ui**: Biblioteca de componentes acessíveis

### 2.3.2 Estrutura de Componentes

```
components/
├── header.tsx              # Cabeçalho com navegação
├── footer.tsx              # Rodapé
├── product-card.tsx        # Card de produto
├── add-to-cart-button.tsx  # Botão adicionar ao carrinho
├── cart-item.tsx           # Item do carrinho
├── checkout-form.tsx       # Formulário de checkout
├── product-form.tsx        # Formulário de produto (admin)
├── products-table.tsx      # Tabela de produtos (admin)
├── orders-table.tsx        # Tabela de pedidos (admin)
└── logout-button.tsx       # Botão de logout
```

### 2.3.3 Páginas Implementadas

#### Páginas Públicas
- `/` - Home com produtos em destaque
- `/catalogo` - Catálogo completo com filtros
- `/produto/[id]` - Detalhes do produto
- `/carrinho` - Visualização do carrinho
- `/checkout` - Finalização da compra
- `/pedido/[id]` - Confirmação do pedido

#### Páginas de Autenticação
- `/auth/login` - Login de usuários
- `/auth/cadastro` - Cadastro de novos usuários
- `/auth/sucesso` - Confirmação de cadastro
- `/perfil` - Perfil e histórico do usuário

#### Páginas Administrativas
- `/admin` - Dashboard administrativo
- `/admin/produtos` - Listagem de produtos
- `/admin/produtos/novo` - Criar novo produto
- `/admin/produtos/[id]` - Editar produto
- `/admin/pedidos` - Gerenciar pedidos

### 2.3.4 Responsividade

Todas as páginas foram desenvolvidas com abordagem mobile-first:
- Breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- Grid responsivo para catálogo de produtos
- Menu hambúrguer para dispositivos móveis
- Formulários adaptáveis

## 2.4 Desenvolvimento Back-end

### 2.4.1 Arquitetura

O projeto utiliza a arquitetura **Serverless** do Next.js com:
- **API Routes**: Endpoints REST
- **Server Actions**: Ações do servidor para mutações
- **Server Components**: Componentes renderizados no servidor

### 2.4.2 Design Pattern: MVC Adaptado

Embora Next.js não siga MVC tradicional, a estrutura se assemelha:

- **Model**: Tipos TypeScript + Supabase Schema
- **View**: Componentes React (TSX)
- **Controller**: Server Actions + API Routes

```
lib/
├── types.ts           # Models (tipos de dados)
├── supabase/
│   ├── client.ts      # Cliente Supabase (browser)
│   ├── server.ts      # Cliente Supabase (servidor)
│   └── middleware.ts  # Middleware de autenticação

app/
├── api/               # Controllers (API Routes)
└── [pages]/           # Views (componentes de página)
```

### 2.4.3 Banco de Dados

**Supabase (PostgreSQL)** com as seguintes tabelas:

#### Tabela: products
```sql
- id (uuid, PK)
- name (text)
- description (text)
- price (numeric)
- image_url (text)
- category (text)
- stock (integer)
- featured (boolean)
- discount_percentage (integer)
- created_at (timestamp)
```

#### Tabela: profiles
```sql
- id (uuid, PK, FK -> auth.users)
- full_name (text)
- is_admin (boolean)
- created_at (timestamp)
```

#### Tabela: cart
```sql
- id (uuid, PK)
- user_id (uuid, FK -> profiles)
- product_id (uuid, FK -> products)
- quantity (integer)
- created_at (timestamp)
```

#### Tabela: addresses
```sql
- id (uuid, PK)
- user_id (uuid, FK -> profiles)
- street (text)
- number (text)
- complement (text)
- neighborhood (text)
- city (text)
- state (text)
- zip_code (text)
- is_default (boolean)
```

#### Tabela: orders
```sql
- id (uuid, PK)
- user_id (uuid, FK -> profiles)
- address_id (uuid, FK -> addresses)
- total (numeric)
- status (text)
- payment_status (text)
- payment_method (text)
- created_at (timestamp)
```

#### Tabela: order_items
```sql
- id (uuid, PK)
- order_id (uuid, FK -> orders)
- product_id (uuid, FK -> products)
- quantity (integer)
- price (numeric)
```

### 2.4.4 Segurança: Row Level Security (RLS)

Todas as tabelas possuem políticas RLS implementadas:

```sql
-- Usuários podem ver apenas seus próprios dados
CREATE POLICY "Users can view own cart"
ON cart FOR SELECT
USING (auth.uid() = user_id);

-- Admins podem ver todos os pedidos
CREATE POLICY "Admins can view all orders"
ON orders FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);
```

### 2.4.5 Autenticação

Sistema de autenticação implementado com **Supabase Auth**:
- Registro com email e senha
- Login com email e senha
- Confirmação de email
- Sessões persistentes
- Middleware para proteção de rotas

## 2.5 Integração Front-end e Back-end

### 2.5.1 Fluxo de Dados

```
Cliente (Browser)
    ↓
React Component
    ↓
Server Action / API Route
    ↓
Supabase Client
    ↓
PostgreSQL Database
```

### 2.5.2 Exemplo de Integração

**Adicionar produto ao carrinho:**

```typescript
// components/add-to-cart-button.tsx (Front-end)
async function handleAddToCart() {
  const supabase = createBrowserClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    router.push('/auth/login')
    return
  }

  const { error } = await supabase
    .from('cart')
    .insert({ user_id: user.id, product_id: productId, quantity: 1 })
  
  if (!error) {
    toast.success('Produto adicionado ao carrinho!')
  }
}
```

## 2.6 Testes Implementados

### 2.6.1 Tipos de Testes

1. **Testes Manuais**: Validação de fluxos completos
2. **Testes de Integração**: Verificação de comunicação com banco de dados
3. **Testes de Usabilidade**: Validação com usuários reais

### 2.6.2 Cenários de Teste

| ID | Cenário | Status |
|----|---------|--------|
| TC01 | Cadastro de novo usuário | ✅ Passou |
| TC02 | Login com credenciais válidas | ✅ Passou |
| TC03 | Adicionar produto ao carrinho | ✅ Passou |
| TC04 | Finalizar compra | ✅ Passou |
| TC05 | Admin criar produto | ✅ Passou |
| TC06 | Admin atualizar status do pedido | ✅ Passou |
| TC07 | Filtrar produtos por categoria | ✅ Passou |
| TC08 | Visualizar histórico de pedidos | ✅ Passou |

### 2.6.3 Tratamento de Erros

Todos os erros são tratados adequadamente:
- Validação de formulários
- Mensagens de erro amigáveis
- Fallbacks para falhas de rede
- Proteção contra SQL injection (via Supabase)
- Sanitização de inputs

## 2.7 Deploy e Hospedagem

### 2.7.1 Plataforma: Vercel

O projeto está hospedado na **Vercel**, que oferece:
- Deploy automático via GitHub
- HTTPS por padrão
- CDN global
- Serverless functions
- Preview deployments

### 2.7.2 Variáveis de Ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=
```

### 2.7.3 CI/CD Pipeline

```
Push to GitHub
    ↓
Vercel detecta mudanças
    ↓
Build automático
    ↓
Testes de build
    ↓
Deploy em produção
    ↓
URL atualizada
```

## 2.8 Boas Práticas Implementadas

- ✅ Código TypeScript com tipagem forte
- ✅ Componentes reutilizáveis
- ✅ Separação de responsabilidades
- ✅ Nomenclatura consistente
- ✅ Comentários em código complexo
- ✅ Validação de dados no cliente e servidor
- ✅ Tratamento de erros robusto
- ✅ Responsividade mobile-first
- ✅ Acessibilidade (ARIA labels)
- ✅ Performance otimizada (lazy loading, caching)
