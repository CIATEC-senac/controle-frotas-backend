## Descrição

Projeto de gestão e controle de frotas para a empresa AlfaID

## Pré-requisitos

* [Docker](https://www.docker.com/)
* [Node ^v20.6.0](https://nodejs.org): A partir dessa versão, o node suporta nativamente arquivos .env. Para [referência](https://browsee.io/blog/using-environment-variables-in-node-js-20-6-0/)
* [PNPM](https://pnpm.io/pt/installation)

## Instalação

```bash
$ pnpm install
```

## Compilar e rodar o projeto

```bash
$ docker compose up -d

# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Executar Testes

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```