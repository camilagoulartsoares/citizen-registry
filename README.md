# Cadastro CPF

Sistema de cadastro e consulta de cidadãos brasileiros por CPF.

## Tecnologias

- **Backend**: Node.js + Express + SQLite
- **Frontend**: Vue 3 + Vuetify 3 + Vite
- **Testes**: Jest (backend)
- **Infraestrutura**: Docker

## Como rodar com Docker

```bash
docker-compose up
```

Acesse: http://localhost:5173

## Como rodar sem Docker

### Opção rápida (backend + frontend juntos)

Na raiz do projeto:

```bash
npm install
npm run install:all
npm run dev
```

- Backend: http://localhost:3000
- Frontend: http://localhost:5173 (ou próxima porta livre)

### Separado

#### Backend

```bash
cd backend
npm install
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Integração Frontend ↔ Backend

O frontend se comunica com o backend via proxy do Vite em desenvolvimento:

- Requisições vão para `/api/*` (ex: `/api/citizens`)
- O Vite redireciona para `http://localhost:3000/*`
- Configuração em `frontend/.env.development`

Para testar manualmente:

1. Cadastre um cidadão na home com CPF válido (ex: `529.982.247-25`)
2. Use a busca com o nome ou CPF cadastrado
3. Acesse **Lista de Cidadãos** para ver a tabela paginada

Verifique se o backend está ativo:

```bash
curl http://localhost:3000/health
# {"status":"ok"}
```

## Como rodar os testes

```bash
cd backend
npm test
npm run test:coverage
```

## Arquitetura

### Backend

Arquitetura em camadas seguindo Clean Architecture:

- **Domain**: entidades e interfaces (`Citizen`, `CpfValidator`)
- **Application**: casos de uso (`RegisterCitizen`, `FindCitizen`)
- **Infrastructure**: implementações concretas (`SQLiteRepository`)
- **Http**: controllers, middlewares e rotas

### Frontend

- Composition API com composables para lógica reutilizável
- Serviço centralizado de API (axios)
- Componentes com responsabilidade única

## Decisões técnicas

- SQLite escolhido para simplicidade de setup (zero configuração)
- Repository Pattern permite trocar o banco sem afetar use cases
- CpfValidator isolado e testado independentemente
- Composables no Vue evitam lógica nos templates

## O que eu adicionaria com mais tempo

- Autenticação JWT
- Paginação no backend com cursor
- Testes E2E com Playwright
- CI/CD com GitHub Actions
