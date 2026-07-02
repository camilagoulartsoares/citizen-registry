# Cadastro CPF

[![CI](https://github.com/camilagoulartsoares/citizen-registry/actions/workflows/ci.yml/badge.svg)](https://github.com/camilagoulartsoares/citizen-registry/actions/workflows/ci.yml)

Sistema web para **cadastro e consulta de cidadãos brasileiros por CPF**. Desenvolvido como entrega de desafio técnico full stack, com API REST em Node.js, interface em Vue 3, validações de negócio, persistência em SQLite e ambiente publicado em produção.

---

## 📸 Demonstração

![Demonstração do sistema](./docs/demo.gif)



O GIF apresenta o fluxo principal da aplicação:

- Cadastro de cidadão com validação em tempo real
- Validação de CPF (dígitos verificadores e duplicidade)
- Consulta por nome ou CPF
- Listagem de cidadãos e acesso rápido às funcionalidades
- Interface com sidebar colapsável e dark mode

---

## 🌐 Deploy

| Ambiente | Link |
|----------|------|
| **Frontend (Vercel)** | [**citizen-registry-system.vercel.app**](https://citizen-registry-system.vercel.app) |
| **Backend (Render)** | [**citizen-registry-system-backend.onrender.com**](https://citizen-registry-system-backend.onrender.com) |
| **Swagger** | [**/api-docs**](https://citizen-registry-system-backend.onrender.com/api-docs) |
| **Health Check** | [**/health**](https://citizen-registry-system-backend.onrender.com/health) |
| **GitHub** | [**camilagoulartsoares/citizen-registry**](https://github.com/camilagoulartsoares/citizen-registry) |

> A raiz do backend (`/`) redireciona automaticamente para o Swagger.

---

## ✅ Requisitos do desafio atendidos

- [x] Cadastro de cidadão
- [x] Nome obrigatório
- [x] CPF obrigatório
- [x] Validação automática de CPF
- [x] Pesquisa por nome
- [x] Pesquisa por CPF
- [x] Mensagem de sucesso ao cadastrar
- [x] Mensagem **"Cidadão não encontrado"** (texto exato na API e na interface)
- [x] Backend em Node.js
- [x] Programação Orientada a Objetos
- [x] README com instruções de execução

---

## 🚀 Funcionalidades

Além dos requisitos obrigatórios, o sistema entrega um fluxo administrativo completo:

| Funcionalidade | Descrição |
|----------------|-----------|
| **CRUD completo** | Cadastrar, listar, buscar, editar e remover cidadãos |
| **Listagem paginada** | Tabela com filtro por nome ou CPF e paginação |
| **Edição de cadastro** | Atualização de nome e CPF com validações |
| **Remoção de cadastro** | Exclusão com fluxo de confirmação em modais |
| **Exportação CSV** | Download de cidadãos cadastrados, com filtro opcional |
| **Validação em tempo real** | Máscara de CPF, dígitos verificadores e nome com letras |
| **Verificação de CPF duplicado** | Consulta à API antes do envio do formulário |
| **Mensagem de sucesso** | Feedback visual após cadastro concluído |
| **Sidebar colapsável** | Menu lateral com toggle interno |
| **Dark mode** | Alternância claro/escuro com persistência em `localStorage` |
| **Interface responsiva** | Layout adaptável para desktop e mobile |
| **Snackbar global** | Toasts centralizados para sucesso e erro |
| **Skeleton loader** | Placeholder na tabela durante carregamento |
| **Página 404** | Rota catch-all customizada |
| **Documentação Swagger/OpenAPI** | API documentada e testável em `/api-docs` |
| **Rate limiting** | Proteção de 100 requisições por IP a cada 15 minutos |
| **Health Check** | Endpoint `GET /health` para monitoramento |

---

## 🛠 Tecnologias

### Frontend

| Tecnologia | Uso |
|------------|-----|
| Vue 3 | Framework reativo |
| Vuetify 3 | Componentes de UI |
| Vue Router | Navegação SPA |
| Axios | Cliente HTTP |
| Vite | Build e dev server |

### Backend

| Tecnologia | Uso |
|------------|-----|
| Node.js | Runtime |
| Express | Servidor HTTP e rotas REST |
| swagger-jsdoc + swagger-ui-express | Documentação OpenAPI 3.0 |
| express-rate-limit | Rate limiting |

### Banco de Dados

| Tecnologia | Uso |
|------------|-----|
| SQLite | Persistência relacional em arquivo |
| better-sqlite3 | Driver com prepared statements |

### Testes

| Tecnologia | Uso |
|------------|-----|
| Jest | Testes unitários e de integração (backend) |
| Supertest | Testes HTTP da API |
| Vitest + Vue Test Utils | Testes de componentes e composables |
| Playwright | Testes E2E |

### Deploy

| Plataforma | Aplicação |
|------------|-----------|
| Vercel | Frontend (SPA estática) |
| Render | Backend (Node.js + SQLite em disco) |

### Infraestrutura

| Tecnologia | Uso |
|------------|-----|
| Docker + Docker Compose | Ambiente containerizado opcional |
| GitHub Actions | CI com testes backend, frontend e E2E |
| `render.yaml` | Blueprint de deploy do backend |
| `vercel.json` | Configuração de build do frontend |

---

## 📦 Como executar localmente

### Pré-requisitos

- Node.js 20+
- npm

### Instalação e execução

```bash
git clone https://github.com/camilagoulartsoares/citizen-registry.git
cd citizen-registry
npm install
npm run install:all
npm run dev
```

O comando `npm run dev` sobe **backend e frontend** simultaneamente.

### URLs locais

| Recurso | URL |
|---------|-----|
| **Frontend** | http://localhost:5174 |
| **Backend** | http://localhost:3000 |
| **Swagger** | http://localhost:3000/api-docs |
| **Health Check** | http://localhost:3000/health |

> O frontend usa a porta **5174** para evitar conflito com outros projetos Vite na porta 5173.

### Execução com Docker (opcional)

```bash
docker compose up --build
```

---

## 🧪 Testes

Foram implementados **79 testes automatizados**, cobrindo backend, frontend e testes end-to-end.

| Camada | Quantidade |
|--------|------------|
| Backend (Jest) | 60 |
| Frontend (Vitest) | 16 |
| E2E (Playwright) | 3 |
| **Total** | **79** |

### Backend

#### Testes unitários

- [x] `CpfValidator.test.js` — sanitização e validação de CPF
- [x] `NameValidator.test.js` — validação de nome com letras
- [x] `RegisterCitizen.test.js` — caso de uso de cadastro
- [x] `UpdateCitizen.test.js` — caso de uso de atualização
- [x] `DeleteCitizen.test.js` — caso de uso de exclusão
- [x] `SQLiteRepository.test.js` — repositório em memória (`:memory:`)

#### Testes de integração

- [x] `http/citizens.routes.test.js` — CRUD, paginação, busca, exportação CSV
- [x] `http/system.routes.test.js` — health, Swagger JSON, CORS e erros HTTP

#### Cobertura funcional

- [x] Validação de CPF (válido, inválido, sequências repetidas)
- [x] Criação de cidadão com dados válidos
- [x] Busca por nome ou CPF
- [x] CPF duplicado (HTTP 409)
- [x] Cidadão não encontrado (HTTP 404, mensagem exata)

### Frontend

#### Testes de componentes e composables

- [x] `useCpfMask.test.js` — máscara e validação de CPF
- [x] `CitizenForm.test.js` — formulário de cadastro
- [x] `useCitizen.test.js` — integração com API e mensagens de erro

#### Cobertura funcional

- [x] Validação visual de nome (curto ou apenas números)
- [x] Botão de cadastro desabilitado com dados inválidos
- [x] Tratamento de CPF duplicado e cidadão não encontrado
- [x] Mensagem exata **"Cidadão não encontrado"**

#### Testes E2E (Playwright)

- [x] `e2e/home.spec.js` — página inicial e navegação
- [x] `e2e/cadastro.spec.js` — validação de formulário de cadastro

### Comandos

```bash
# Testes unitários (backend + frontend)
npm test

# Testes E2E
npm run test:e2e

# Suite completa
npm run test:all
```

---

## 🏗 Arquitetura

O backend segue **Programação Orientada a Objetos**, **separação de responsabilidades** e **Clean Architecture**:

```
HTTP (rotas, controllers, middlewares)
        ↓
Application (casos de uso — uma classe por operação)
        ↓
Domain (entidades, validadores, contratos)
        ↑
Infrastructure (SQLiteRepository, exportação CSV)
```

### Camadas do backend

| Camada | Responsabilidade |
|--------|------------------|
| **Domain** | `Citizen`, `CpfValidator`, `NameValidator`, contrato do repositório |
| **Application** | `RegisterCitizen`, `FindCitizen`, `ListCitizens`, `UpdateCitizen`, `DeleteCitizen`, `ExportCitizens` |
| **Infrastructure** | `SQLiteRepository`, geração de CSV |
| **HTTP** | Controllers, rotas, Swagger, CORS, rate limit e tratamento de erros |

### Organização do frontend

| Pasta | Responsabilidade |
|-------|------------------|
| `views/` | Páginas (Home, Cadastrar, Consultar, Lista, 404) |
| `components/` | Formulários, tabela, modais, sidebar, snackbar |
| `composables/` | Lógica reutilizável (`useCitizen`, `useCpfMask`, `useCpfAvailability`, etc.) |
| `services/` | Cliente Axios centralizado |
| `router/` | Rotas e metadados de navegação |

---

## 📁 Estrutura do projeto

Visão resumida das pastas principais. Arquivos gerados localmente (`node_modules/`, `dist/`, `*.sqlite`, `test-results/`) **não vão para o Git** — estão no `.gitignore`.

```
citizen-registry/
├── .github/
│   └── workflows/
│       └── ci.yml              # Pipeline GitHub Actions
├── backend/
│   ├── src/
│   │   ├── domain/             # Entidades e validadores (CPF, nome)
│   │   ├── application/        # Casos de uso (Register, Find, Update…)
│   │   ├── infrastructure/   # SQLiteRepository e exportação CSV
│   │   └── http/               # Express, Swagger, rotas e middlewares
│   ├── tests/                  # Jest (unitários + integração supertest)
│   ├── data/                   # SQLite em runtime (.gitkeep apenas no repo)
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── views/              # Páginas (Home, Cadastrar, Consultar, Lista)
│   │   ├── components/         # Formulários, tabela, modais, sidebar
│   │   ├── composables/        # useCitizen, useCpfMask, useCpfAvailability…
│   │   ├── services/           # Cliente Axios
│   │   └── router/
│   ├── public/
│   └── package.json
├── e2e/                        # Testes Playwright
├── docs/
│   ├── demo.gif                # GIF de demonstração
│   ├── DEPLOY.md               # Guia de hospedagem
│   └── images/
├── docker-compose.yml
├── playwright.config.js
├── render.yaml                 # Blueprint Render (backend)
├── vercel.json                 # Build Vercel (frontend)
├── package.json                # Scripts raiz (dev, test, test:e2e)
└── README.md
```

### O que não aparece na árvore (e por quê)

| Item | Motivo |
|------|--------|
| `node_modules/` | Dependências — instaladas com `npm install` |
| `frontend/dist/` | Build de produção — gerado com `npm run build` |
| `backend/data/*.sqlite` | Banco local com dados reais — ignorado pelo Git |
| `test-results/`, `playwright-report/` | Saída dos testes E2E |
| `.env`, `.env.local` | Variáveis sensíveis — só `.env.example` fica no repo |

---

## ⭐ Diferenciais técnicos

Itens que **não faziam parte do escopo mínimo** do desafio, entregues como evolução do projeto:

| Diferencial | Descrição |
|-------------|-----------|
| **Clean Architecture** | Backend em camadas: Domain → Application → Infrastructure → HTTP |
| **Swagger / OpenAPI 3.0** | Documentação interativa com `swagger-jsdoc` e `swagger-ui-express` |
| **79 testes automatizados** | Jest, Vitest, Supertest e Playwright |
| **GitHub Actions (CI)** | Pipeline com testes de backend, frontend e E2E |
| **Deploy Render + Vercel** | Backend e frontend publicados separadamente em produção |
| **Docker** | `Dockerfile` e `docker-compose.yml` para execução containerizada |
| **Monorepo** | Backend e frontend no mesmo repositório com scripts unificados |
| **Exportação CSV** | `GET /citizens/export` e download na interface |
| **CRUD completo** | Edição e remoção além do cadastro e consulta |
| **Listagem paginada** | Tabela com busca e paginação no banco |
| **Sidebar colapsável** | Menu lateral com estado persistido em `sessionStorage` |
| **Dark mode** | Tema claro/escuro com persistência em `localStorage` |
| **Interface responsiva** | Layout adaptável com identidade visual GESUAS |
| **Rate limiting** | 100 req/IP a cada 15 minutos |
| **Health Check** | Endpoint de monitoramento `GET /health` |
| **Validação em tempo real** | CPF, nome e duplicidade verificados no frontend |
| **Snackbar, skeleton e 404** | Melhorias de UX na interface |
| **Badge CI** | Status do pipeline visível no README |

### Detalhes de deploy em produção

| Serviço | Configuração |
|---------|--------------|
| **Render (backend)** | Root Directory: `backend` · Start: `npm start` · Disco persistente para SQLite |
| **Vercel (frontend)** | Build em `frontend/dist` · `VITE_API_URL=https://citizen-registry-system-backend.onrender.com` |

---

## 👩 Autor

**Camila Goulart Soares**

- GitHub: [@camilagoulartsoares](https://github.com/camilagoulartsoares)
