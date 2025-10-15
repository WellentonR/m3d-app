# 4. Testes e Validação

## Estratégia de Testes

O projeto implementa uma **estratégia de testes em múltiplas camadas** para garantir qualidade, estabilidade e confiabilidade da aplicação **Miniaturas 3D Store**.  
Foram combinados **testes manuais, funcionais, de interface, performance e segurança**, complementados por **validação com usuários reais**.

---

## Tipos de Testes Implementados

### 1. Testes Manuais

#### 1.1. Testes Funcionais

**Objetivo:** verificar se todas as funcionalidades principais operam conforme esperado.

**Checklist de Testes:**

##### Área Pública

* ✅ Página inicial carrega corretamente  
* ✅ Navegação entre páginas funciona  
* ✅ Catálogo exibe todas as miniaturas  
* ✅ Dropdown de categorias exibe opções  
* ✅ Filtro de categorias funciona  
* ✅ Detalhes da miniatura carregam corretamente  
* ✅ Imagens renderizam sem erro  
* ✅ Adicionar ao carrinho funciona  
* ✅ Contador do carrinho atualiza  

##### Autenticação

* ✅ Cadastro de novo usuário funciona  
* ✅ Login com credenciais válidas funciona  
* ✅ Login com credenciais inválidas mostra erro  
* ✅ Logout funciona corretamente  
* ✅ Sessão persiste após refresh  
* ✅ Redirecionamento após login funciona  

##### Carrinho e Checkout

* ✅ Itens aparecem no carrinho  
* ✅ Atualizar quantidade funciona  
* ✅ Remover item funciona  
* ✅ Total é calculado corretamente  
* ✅ Carrinho persiste no `localStorage`  
* ✅ Checkout requer autenticação  
* ✅ Endereço é exibido corretamente  
* ✅ Criação de pedido funciona  
* ✅ Carrinho é limpo após pedido  
* ✅ Redirecionamento após pedido funciona  

##### Painel do Usuário

* ✅ Perfil carrega corretamente  
* ✅ Histórico de pedidos visível  
* ✅ Dados pessoais atualizados com sucesso  
* ✅ Logout redireciona corretamente  

---

#### 1.2. Testes de Interface

**Objetivo:** verificar a responsividade e consistência visual da interface.

**Checklist:**

* ✅ Layout responsivo (mobile, tablet, desktop)  
* ✅ Paleta de cores consistente  
* ✅ Botões e links com *hover states*  
* ✅ Formulários com estados de foco e erro  
* ✅ Feedbacks visuais claros (sucesso/erro)  
* ✅ Ícones e tipografia uniformes  
* ✅ Imagens otimizadas com `next/image`  
* ✅ Navegação via teclado funcional  

---

#### 1.3. Testes de Segurança

**Checklist:**

* ✅ Proteção de dados dos usuários (RLS)  
* ✅ Acesso restrito ao painel administrativo  
* ✅ Tokens e variáveis de ambiente seguras  
* ✅ Conexão HTTPS ativa na Vercel  

---

## Validação com Pares

### Processo

* **Total de testadores:** 5  
* **Período:** 11 a 13/10/2025  
* **Dispositivos:** desktop, notebook e smartphone  

**Critérios de Priorização:**
* **Crítico:** impede o uso → corrigido imediatamente
* **Alto:** afeta experiência → corrigido em 1 dia
* **Médio:** problema de UI → corrigido em 2-3 dias
* **Baixo:** estética → backlog futuro

### Resultados dos Testes

#### Teste 1 
- **Bug identificado:** cor do dropdown incorreta e filtro inoperante **[Alto]** 
- **Correção aplicada:** ajuste de CSS e lógica de filtragem  
- **Status:** corrigido ✅  

#### Teste 2 
- **Bug identificado:** estilo inconsistente do botão “Adicionar ao carrinho” **[Médio]**
- **Correção aplicada:** padronização de CSS para todos os componentes  
- **Status:** corrigido ✅  

#### Teste 3 
- **Bug identificado:** dados do usuário não apareciam no painel  
- **Correção aplicada:** correção da requisição ao banco e renderização do perfil **[Alto]** 
- **Status:** corrigido ✅  

#### Teste 4 
- **Nenhum bug identificado:**

#### Teste 5 
- **Bug identificado:** cor do botão “Sair” incorreta  
- **Correção aplicada:** atualização da cor para vermelho conforme identidade visual **[Baixo]**
- **Status:** corrigido ✅  

---

## Laudo de Qualidade

Após as correções e revalidações, o sistema **atingiu conformidade total com os requisitos funcionais e não funcionais** definidos nas etapas anteriores.  
O **Miniaturas 3D Store** apresentou **estabilidade**, **resposta rápida** e **consistência visual aprimorada**.  

**Testes de Regressão:** executados antes do deploy final  

* Login → OK  
* Carrinho → OK  
* Perfil do Usuário → OK  
* Filtros e Dropdown → OK  
* Nenhum erro no console → OK  

---

## Ambiente e Dados de Teste

**Usuários:**

```
Email Admin: admin@m3d.com | Senha: admin123
```

**Produtos:**

* 20 miniaturas cadastradas via `002_seed_products.sql`  
* Categorias: personagens, veículos, colecionáveis e acessórios  

**Pedidos:**

* Criados manualmente em diferentes estados (pendente, pago, entregue)  
