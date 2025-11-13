
# 🔗 URL Shortener API

API RESTful para **encurtamento de URLs** desenvolvida com **NestJS**, **TypeORM** e **PostgreSQL**, oferecendo suporte a **autenticação JWT**, **modo anônimo**, **redirecionamento automático** e **contagem de cliques**.

---

## 🚀 Tecnologias Utilizadas

- **NestJS** — Framework Node.js para aplicações escaláveis
- **TypeORM** — ORM para integração com banco PostgreSQL
- **PostgreSQL** — Banco de dados relacional
- **JWT (JSON Web Token)** — Autenticação segura por token
- **Class Validator / Transformer** — Validação e transformação de dados
- **Docker** — Containerização da aplicação
- **ESLint + Prettier** — Padrões de código e linting

---

## 📂 Estrutura do Projeto

src/
├── auth/                  # Módulo de autenticação (JWT)
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   └── optional-auth.guard.ts
│
├── users/                 # Módulo de usuários
│   ├── user.entity.ts
│   ├── users.service.ts
│   └── users.controller.ts
│
├── urls/                  # Módulo de encurtamento de URLs
│   ├── url.entity.ts
│   ├── urls.service.ts
│   ├── urls.controller.ts
│   └── dto/               # DTOs (Data Transfer Objects)
│
├── main.ts                # Bootstrap da aplicação
└── app.module.ts          # Módulo raiz


---

## ⚙️ Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# BASE URL usada para geração dos links encurtados
BASE_URL=http://localhost:3000

# Configurações do banco de dados PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=encurtador

# Configurações do JWT
JWT_SECRET=supersegredo
JWT_EXPIRES_IN=1d


🐳 Rodando com Docker
Para iniciar a aplicação com Docker Compose:
docker-compose up --build
A API estará disponível em:
👉 http://localhost:3000


⚡ Executando Localmente (sem Docker)

# Instalar dependências
npm install

# Rodar migrações (se houver)
npm run typeorm migration:run

# Iniciar a aplicação
npm run start:dev
🧠 Conceito da Aplicação
O sistema permite que qualquer pessoa — autenticada ou não — crie URLs encurtadas.
Usuários autenticados têm suas URLs associadas às suas contas, enquanto requisições anônimas são salvas sem userId.

Cada URL encurtada possui:

Código curto (shortCode)

URL completa (shortUrl)

URL original (originalUrl)

Contador de cliques (clicks)

Data de criação (createdAt)

Usuário (opcional)

📡 Endpoints Principais
🔸 POST /urls
Cria uma nova URL encurtada.

Requer token JWT: Opcional (aceita modo anônimo)

Body:
{
  "originalUrl": "https://www.google.com"
}
Resposta:

{
  "id": "774fbdc2-96c7-4df8-b09e-811aa0c0858d",
  "shortUrl": "http://localhost:3000/iRhOuQ",
  "shortCode": "iRhOuQ",
  "originalUrl": "https://www.google.com",
  "createdAt": "2025-11-12T20:59:40.740Z"
}
🔸 GET /urls
Lista todas as URLs criadas pelo usuário autenticado.

Requer token JWT:
Authorization: Bearer <seu_token_jwt>

Resposta:
[
  {
    "id": "774fbdc2-96c7-4df8-b09e-811aa0c0858d",
    "originalUrl": "https://www.google.com",
    "shortUrl": "http://localhost:3000/iRhOuQ",
    "clicks": 0,
    "createdAt": "2025-11-12T20:59:40.740Z"
  }
]
🔸 PATCH /urls/:id
Atualiza a URL original de um link encurtado.

Requer token JWT

Body:
{
  "url": "https://www.nestjs.com"
}
🔸 DELETE /urls/:id
Remove (soft delete) uma URL criada pelo usuário autenticado.

Requer token JWT

Resposta:
{ "ok": true }
🔸 GET /:shortCode
Redireciona automaticamente para a URL original e incrementa o contador de cliques.

Exemplo:

GET http://localhost:3000/iRhOuQ
Resultado:
➡️ Redireciona para https://www.google.com

🔐 Autenticação (JWT)
Endpoints de autenticação (exemplo de implementação):

POST /auth/register
Cria um novo usuário.

Body:
{
  "email": "user@example.com",
  "password": "123456"
}

POST /auth/login
Faz login e retorna o token JWT.

Body:
{
  "email": "user@example.com",
  "password": "123456"
}
Resposta:
{
  "access_token": "<seu_token_jwt>"
}
Use o token retornado no header:
Authorization: Bearer <token>

🧩 Comportamento de Autenticação
Situação	Token JWT	Resultado
Usuário autenticado	✅ Presente	URL associada ao userId
Requisição anônima	❌ Ausente	URL salva com userId = null
Token inválido	⚠️ Inválido	Requisição tratada como anônima

🧠 Lógica de Encurtamento
Cada URL encurtada recebe um código aleatório (shortCode) gerado por:
randomBytes(4).toString('base64').replace(/\W/g, '').slice(0, 6);

O link final é montado como:
BASE_URL + '/' + shortCode

Exemplo:
http://localhost:3000/Ak4dXf


🗃️ Banco de Dados (Tabela URL)
Campo	Tipo	Descrição
id	UUID	Identificador único da URL
originalUrl	string	URL original
shortCode	string	Código encurtado
shortUrl	string	URL final (BASE_URL + shortCode)
clicks	number	Total de redirecionamentos
createdAt	timestamp	Data de criação
userId	UUID (nullable)	ID do usuário dono da URL (opcional)

🧪 Testes
Para rodar os testes unitários e de integração:
npm run test
🧰 Ferramentas Úteis
Comando	Função
npm run start:dev	Inicia o servidor em modo desenvolvimento
npm run build	Compila o projeto para produção
npm run lint	Verifica problemas de estilo e sintaxe
npm run test	Executa a suíte de testes

📄 Licença
Este projeto é distribuído sob a licença MIT.
Criado e mantido por Eduardo Rosa Domingues 🧑‍💻

🧭 Contato
📧 eduardorosa.dev@gmail.com
💼 LinkedIn
🐙 GitHub
