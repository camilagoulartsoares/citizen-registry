# Cadastro CPF

[![CI](https://github.com/camilagoulartsoares/citizen-registry-system/actions/workflows/ci.yml/badge.svg)](https://github.com/camilagoulartsoares/citizen-registry-system/actions/workflows/ci.yml)

Sistema web para **cadastro e consulta de cidadãos brasileiros por CPF**, desenvolvido como solução completa para o desafio técnico. O projeto entrega uma API REST documentada, interface administrativa moderna e fluxo completo de CRUD com validações de negócio, testes automatizados e deploy em produção.

---

## Funcionalidades

- **Cadastro de cidadão** — formulário com nome completo e CPF
- **Validação automática de CPF** — dígitos verificadores e máscara em tempo real
- **Consulta por nome** — busca textual na base de cidadãos
- **Consulta por CPF** — busca por CPF completo ou parcial
- **Listagem de cidadãos** — tabela paginada com filtro por nome ou CPF
- **Edição de cadastro** — atualização de nome e CPF com validações
- **Remoção de cadastro** — exclusão com fluxo de confirmação
- **Mensagem de sucesso ao cadastrar** — feedback visual após cadastro concluído
- **Mensagem "Cidadão não encontrado"** — retorno padronizado na API e na interface
- **Exportação CSV** — download de cidadãos cadastrados, com filtro opcional
- **Interface responsiva** — layout adaptável para desktop e mobile
- **Sidebar colapsável** — menu lateral com toggle interno
- **Dark mode** — alternância de tema claro/escuro com persistência local
- **Documentação Swagger/OpenAPI** — API documentada e testável em `/api-docs`

---

## Requisitos do desafio atendidos

- [x] Cadastro de cidadão com nome e CPF
- [x] Validação de CPF (dígitos verificadores)
- [x] Consulta por nome
- [x] Consulta por CPF
- [x] Listagem de cidadãos cadastrados
- [x] Edição de cadastro existente
- [x] Remoção de cadastro
- [x] Mensagem de sucesso ao cadastrar
- [x] Mensagem exata **"Cidadão não encontrado"** quando aplicável
- [x] Persistência em banco de dados
- [x] API REST
- [x] Interface web funcional
- [x] README com instruções de instalação e execução
- [x] Testes automatizados
- [x] Documentação da API (Swagger/OpenAPI)
- [x] Deploy em ambiente de produção

---

## Tecnologias utilizadas

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

### Banco de dados
| Tecnologia | Uso |
|------------|-----|
| SQLite | Persistência relacional em arquivo |
| better-sqlite3 | Driver síncrono com prepared statements |

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

---

## Arquitetura

O projeto segue **Programação Orientada a Objetos** e **separação de responsabilidades**, com o backend estruturado em **Clean Architecture**:

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

## Testes realizados

**Total: 79 testes** (60 backend + 16 frontend + 3 E2E)

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

### Comandos para executar os testes

```bash
# Todos os testes unitários (backend + frontend)
npm test

# Testes E2E (requer build do frontend)
npm run test:e2e

# Suite completa
npm run test:all
```

---

## Como instalar e executar localmente

### Pré-requisitos
- Node.js 20+
- npm

### Passo a passo

```bash
git clone https://github.com/camilagoulartsoares/citizen-registry-system.git
cd citizen-registry-system
npm install
npm run install:all
npm run dev
```

### URLs locais

| Recurso | URL |
|---------|-----|
| **Frontend** | http://localhost:5174 |
| **Backend** | http://localhost:3000 |
| **Swagger** | http://localhost:3000/api-docs |
| **Health Check** | http://localhost:3000/health |

> O frontend usa a porta **5174** para evitar conflito com outros projetos Vite na porta 5173.

---

## Deploy

### Deploy local

O projeto pode ser executado localmente com `npm run dev` (backend + frontend simultaneamente) ou com Docker:

```bash
docker compose up --build
```

### Deploy do backend (Render)

O backend está publicado no **Render** como Web Service Node.js, com disco persistente para o SQLite.

| Item | Valor |
|------|-------|
| **URL** | https://citizen-registry-system-backend.onrender.com |
| **Root Directory** | `backend` |
| **Start Command** | `npm start` |

### Deploy do frontend (Vercel)

O frontend está publicado na **Vercel** como aplicação Vue/Vite estática.

| Item | Valor |
|------|-------|
| **URL** | https://citizen-registry-system.vercel.app |
| **Variável de ambiente** | `VITE_API_URL=https://citizen-registry-system-backend.onrender.com` |

---

## Links do projeto

| Ambiente | Link |
|----------|------|
| **Frontend (Vercel)** | https://citizen-registry-system.vercel.app |
| **Backend (Render)** | https://citizen-registry-system-backend.onrender.com |
| **Swagger** | https://citizen-registry-system-backend.onrender.com/api-docs |
| **Health Check** | https://citizen-registry-system-backend.onrender.com/health |
| **Repositório GitHub** | https://github.com/camilagoulartsoares/citizen-registry-system |

---

## Demonstração

![Demonstração do sistema](./docs/demo.gif)

O GIF demonstra o fluxo principal da aplicação:

- Cadastro de cidadão com validação em tempo real
- Validação de CPF (dígitos verificadores e duplicidade)
- Consulta por nome ou CPF
- Listagem de cidadãos e acesso rápido às funcionalidades
- Interface responsiva com sidebar colapsável e dark mode

---

## Estrutura do projeto

```
citizen-registry-system/
├── backend/
│   ├── src/
│   │   ├── domain/           # Entidades e validadores
│   │   ├── application/      # Casos de uso
│   │   ├── infrastructure/   # SQLite e CSV
│   │   └── http/             # Express, Swagger, rotas
│   └── tests/
├── frontend/
│   ├── src/
│   │   ├── views/
│   │   ├── components/
│   │   ├── composables/
│   │   └── services/
│   └── public/
├── e2e/                      # Testes Playwright
├── docs/
│   ├── demo.gif
│   └── images/swagger-ui.png
├── .github/workflows/ci.yml
├── docker-compose.yml
├── render.yaml
└── vercel.json
```

---

## Diferenciais técnicos

- **Clean Architecture** no backend com camadas bem definidas
- **Programação Orientada a Objetos** (entidades, casos de uso, repositório)
- **79 testes automatizados** (Jest, Vitest e Playwright)
- **Swagger/OpenAPI 3.0** com interface interativa
- **Docker** e `docker-compose.yml` para execução containerizada
- **GitHub Actions** com pipeline de CI
- **Deploy separado** entre frontend (Vercel) e backend (Render)
- **Interface responsiva** com identidade visual inspirada em sistemas municipais
- **Validação em tempo real** de CPF e nome no frontend
- **Verificação de CPF duplicado** antes do envio do formulário
- **Rate limiting**, exportação CSV e dark mode
- **Organização de código** em monorepo com responsabilidades claras

---

## Autor

**Camila Goulart Soares**

- GitHub: [@camilagoulartsoares](https://github.com/camilagoulartsoares)
