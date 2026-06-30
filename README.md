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

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
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
