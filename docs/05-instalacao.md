# 5. Guia de Instalação

## 5.1 Pré-requisitos

Antes de iniciar a instalação, certifique-se de ter:

### 5.1.1 Software Necessário

- **Node.js**: versão 18.x ou superior
- **npm** ou **yarn**: gerenciador de pacotes
- **Git**: para clonar o repositório
- **Conta Supabase**: para banco de dados (gratuita)
- **Conta Vercel**: para deploy (opcional, gratuita)

### 5.1.2 Verificar Instalações

```bash
# Verificar Node.js
node --version  # Deve retornar v18.x ou superior

# Verificar npm
npm --version

# Verificar Git
git --version
```

## 5.2 Instalação Local

### 5.2.1 Clonar o Repositório

```bash
# Clone o repositório
git clone [URL_DO_SEU_REPOSITORIO]

# Entre no diretório
cd miniaturas-3d-store
```

### 5.2.2 Instalar Dependências

```bash
# Usando npm
npm install

# OU usando yarn
yarn install
```

### 5.2.3 Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas credenciais:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico

# Redirect URL para desenvolvimento
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

### 5.2.4 Configurar Banco de Dados

#### Passo 1: Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta (se não tiver)
3. Clique em "New Project"
4. Preencha os dados:
   - Nome: Miniaturas 3D Store
   - Database Password: [escolha uma senha forte]
   - Region: [escolha a mais próxima]
5. Aguarde a criação do projeto (~2 minutos)

#### Passo 2: Obter Credenciais

1. No dashboard do Supabase, vá em **Settings** → **API**
2. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

#### Passo 3: Executar Scripts SQL

1. No Supabase, vá em **SQL Editor**
2. Execute os scripts na ordem:

**Script 1: Criar Tabelas**

```sql
-- Criar tabela de produtos
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  category TEXT,
  stock INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  discount_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de perfis
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de carrinho
CREATE TABLE cart (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Criar tabela de endereços
CREATE TABLE addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  street TEXT NOT NULL,
  number TEXT NOT NULL,
  complement TEXT,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de pedidos
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  address_id UUID REFERENCES addresses(id),
  total NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de itens do pedido
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price NUMERIC(10, 2) NOT NULL
);
```

**Script 2: Habilitar RLS**

Execute o script que está em `scripts/001_enable_rls.sql` do projeto.

**Script 3: Inserir Dados de Exemplo**

```sql
-- Inserir produtos de exemplo
INSERT INTO products (name, description, price, image_url, category, stock, featured) VALUES
('Guerreiro Anão', 'Miniatura de guerreiro anão com machado', 45.00, '/placeholder.svg?height=400&width=400', 'Fantasia', 10, true),
('Mago Élfico', 'Miniatura de mago élfico com cajado', 50.00, '/placeholder.svg?height=400&width=400', 'Fantasia', 8, true),
('Dragão Vermelho', 'Miniatura de dragão vermelho grande', 120.00, '/placeholder.svg?height=400&width=400', 'Criaturas', 5, true),
('Paladino Humano', 'Miniatura de paladino com espada e escudo', 48.00, '/placeholder.svg?height=400&width=400', 'Fantasia', 12, false);
```

### 5.2.5 Executar o Projeto

```bash
# Modo desenvolvimento
npm run dev

# OU
yarn dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 5.3 Criar Usuário Administrador

### 5.3.1 Cadastrar Usuário

1. Acesse `http://localhost:3000/auth/cadastro`
2. Crie uma conta com seu email
3. Confirme o email (verifique sua caixa de entrada)

### 5.3.2 Tornar Administrador

No Supabase SQL Editor, execute:

```sql
-- Substitua 'seu@email.com' pelo email que você cadastrou
UPDATE profiles
SET is_admin = true
WHERE id = (
  SELECT id FROM auth.users
  WHERE email = 'seu@email.com'
);
```

Agora você pode acessar `/admin` com privilégios administrativos.

## 5.4 Deploy na Vercel

### 5.4.1 Preparar para Deploy

1. Faça commit de todas as alterações:

```bash
git add .
git commit -m "Preparar para deploy"
git push origin main
```

### 5.4.2 Conectar com Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Clique em "Add New Project"
4. Selecione seu repositório
5. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` (use a URL da Vercel)
6. Clique em "Deploy"

### 5.4.3 Configurar Redirect URL no Supabase

1. No Supabase, vá em **Authentication** → **URL Configuration**
2. Adicione sua URL da Vercel em **Redirect URLs**:
   - `https://seu-projeto.vercel.app/**`

## 5.5 Solução de Problemas

### 5.5.1 Erro: "Module not found"

```bash
# Limpar cache e reinstalar
rm -rf node_modules
rm package-lock.json
npm install
```

### 5.5.2 Erro: "Supabase connection failed"

- Verifique se as variáveis de ambiente estão corretas
- Confirme que o projeto Supabase está ativo
- Verifique se as tabelas foram criadas

### 5.5.3 Erro: "Authentication failed"

- Confirme que o email foi verificado
- Verifique se o RLS está habilitado
- Confirme que as políticas foram criadas

### 5.5.4 Erro de Build na Vercel

- Verifique se todas as variáveis de ambiente foram adicionadas
- Confirme que o Node.js está na versão 18+
- Verifique os logs de build para erros específicos

## 5.6 Comandos Úteis

```bash
# Desenvolvimento
npm run dev          # Iniciar servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Iniciar servidor de produção
npm run lint         # Verificar erros de código

# Git
git status           # Ver status das alterações
git add .            # Adicionar todas as alterações
git commit -m "msg"  # Fazer commit
git push             # Enviar para GitHub

# Limpeza
rm -rf .next         # Limpar cache do Next.js
rm -rf node_modules  # Remover dependências
```

## 5.7 Próximos Passos

Após a instalação bem-sucedida:

1. ✅ Explore a aplicação
2. ✅ Crie produtos de teste no painel admin
3. ✅ Teste o fluxo de compra completo
4. ✅ Personalize cores e estilos em `app/globals.css`
5. ✅ Adicione suas próprias imagens de produtos
6. ✅ Configure domínio personalizado na Vercel (opcional)
