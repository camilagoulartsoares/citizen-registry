# Guia de hospedagem — passo a passo

Você **não precisa criar outro projeto**. O mesmo repositório GitHub é usado em **dois lugares diferentes**:

| Parte | Onde hospedar | Por quê |
|-------|---------------|---------|
| **Frontend** (`frontend/`) | Vercel ou Netlify | Site estático (`dist/`) |
| **Backend** (`backend/`) | Render ou Railway | Servidor Node.js contínuo + SQLite em disco |

> **Não use Vercel para o backend** — funções serverless não mantêm o arquivo SQLite entre requisições.

---

## Visão geral

```
Usuário
   ↓
Vercel (frontend Vue)     →  https://seu-app.vercel.app
   ↓  chamadas API
Render/Railway (backend)  →  https://seu-api.onrender.com
   ↓
SQLite (arquivo em disco persistente)
```

---

## Parte 1 — Backend no Render (recomendado)

### 1. Pré-requisitos

- Repositório no GitHub (já tem: `citizen-registry-system`)
- Conta em https://render.com

### 2. Criar o Web Service

1. Acesse **Render** → **Dashboard** → **New +** → **Web Service**
2. Conecte o GitHub e selecione o repositório `citizen-registry-system`
3. Preencha:

| Campo | Valor |
|-------|-------|
| **Name** | `cadastro-cpf-api` (ou o nome que quiser) |
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance type** | Free (para teste) ou Starter (para disco persistente) |

### 3. Variáveis de ambiente

Em **Environment**:

| Variável | Valor |
|----------|-------|
| `NODE_ENV` | `production` |
| `DB_PATH` | `/data/citizens.sqlite` |

### 4. Disco persistente (importante para SQLite)

Sem disco, os dados somem a cada redeploy.

1. No serviço → **Disks** → **Add disk**
2. **Mount path:** `/data`
3. **Size:** 1 GB

Ou use o arquivo `render.yaml` na raiz (Blueprint) que já configura isso.

### 5. Deploy

1. Clique **Create Web Service**
2. Aguarde o build (2–5 min)
3. Copie a URL gerada, ex.: `https://cadastro-cpf-api.onrender.com`

### 6. Testar o backend

```bash
curl https://cadastro-cpf-api.onrender.com/health
# → {"status":"ok"}

# Swagger
# https://cadastro-cpf-api.onrender.com/api-docs
```

---

## Parte 2 — Frontend na Vercel

### 1. Pré-requisitos

- Backend já no ar (URL do passo anterior)
- Conta em https://vercel.com

### 2. Importar o projeto

1. **Vercel** → **Add New** → **Project**
2. Importe o repositório `citizen-registry-system` do GitHub
3. Configure:

| Campo | Valor |
|-------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` (clique Edit e selecione a pasta) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### 3. Variável de ambiente (obrigatória)

Em **Environment Variables**:

| Nome | Valor |
|------|-------|
| `VITE_API_URL` | `https://cadastro-cpf-api.onrender.com` |

Use a **URL real** do seu backend, **sem** `/api` no final.

> Em desenvolvimento local o frontend usa `/api` (proxy do Vite). Em produção aponta direto para o backend.

### 4. Deploy

1. Clique **Deploy**
2. Aguarde o build
3. Acesse a URL, ex.: `https://citizen-registry-system.vercel.app`

### 5. Testar

1. Abra o site na Vercel
2. Cadastre um cidadão
3. Se der erro de rede, confira se `VITE_API_URL` está correta e se o backend responde em `/health`

---

## Alternativa — Frontend no Netlify

1. https://app.netlify.com → **Add new site** → **Import from Git**
2. Repositório → pasta **`frontend`**
3. **Build command:** `npm run build`
4. **Publish directory:** `dist`
5. **Environment variable:** `VITE_API_URL` = URL do backend
6. Deploy

Arquivo `frontend/public/_redirects` (opcional, SPA):

```
/*    /index.html   200
```

---

## Alternativa — Backend no Railway

1. https://railway.app → **New Project** → **Deploy from GitHub**
2. Selecione o repositório
3. **Settings** → **Root Directory** → `backend`
4. **Start command:** `npm start`
5. Adicione **Volume** montado em `/data`
6. Variável `DB_PATH=/data/citizens.sqlite`
7. Copie a URL pública gerada
8. Use essa URL em `VITE_API_URL` na Vercel

---

## Checklist final

- [ ] Backend responde `GET /health`
- [ ] Swagger abre em `https://SEU-BACKEND/api-docs`
- [ ] `VITE_API_URL` na Vercel aponta para o backend
- [ ] Disco persistente configurado no Render/Railway (SQLite)
- [ ] Cadastro de cidadão funciona no site publicado

---

## Problemas comuns

| Problema | Solução |
|----------|---------|
| "Não foi possível conectar ao servidor" | `VITE_API_URL` errada ou backend dormindo (plano free do Render) |
| Dados sumiram após redeploy | Falta disco persistente; configure `/data` + `DB_PATH` |
| Página 404 ao atualizar rota no frontend | `vercel.json` já inclui rewrite para SPA |
| CORS | Backend já aceita `origin: '*'` |

---

## Ordem recomendada

1. **Primeiro** o backend (Render/Railway) → anote a URL
2. **Depois** o frontend (Vercel/Netlify) → configure `VITE_API_URL`
3. Teste cadastro e lista no site publicado

Não é necessário fork, novo repositório nem monorepo separado — só dois deploys do mesmo código.
