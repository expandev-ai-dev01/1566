# TODO List - Backend API

Sistema de gerenciamento de tarefas - API REST

## Tecnologias

- Node.js
- TypeScript
- Express.js
- MS SQL Server
- Zod (validação)

## Estrutura do Projeto

```
src/
├── api/              # Controladores de API
├── routes/           # Definições de rotas
├── middleware/       # Middlewares Express
├── services/         # Lógica de negócio
├── utils/            # Funções utilitárias
├── instances/        # Instâncias de serviços
├── constants/        # Constantes da aplicação
├── config/           # Configurações
└── tests/            # Utilitários de teste globais
```

## Instalação

```bash
npm install
```

## Configuração

1. Copie o arquivo `.env.example` para `.env`
2. Configure as variáveis de ambiente
3. Configure a conexão com o banco de dados

## Desenvolvimento

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Produção

```bash
npm start
```

## Testes

```bash
# Executar testes
npm test

# Executar testes em modo watch
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage
```

## Estrutura de API

### Versionamento

A API utiliza versionamento por URL:

- `/api/v1/external/*` - Endpoints públicos
- `/api/v1/internal/*` - Endpoints autenticados

### Health Check

```
GET /health
```

Retorna o status de saúde da aplicação.

## Padrões de Código

- TypeScript strict mode habilitado
- ESLint para qualidade de código
- Indentação: 2 espaços
- Aspas simples para strings
- Ponto e vírgula obrigatório

## Contribuição

Este é um projeto base. Features específicas devem ser implementadas seguindo os padrões estabelecidos na arquitetura.

## Licença

ISC