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

## Enviroment

Copiar o arquivo .example.env para .env. Verificar com o time os valores sensíveis

```bash
$ cp .example.env .env
```

## Compilar e rodar o projeto

```bash
$ docker compose up -d
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