<h1 align="center">GAMIFY BACK<h1>
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

TODO

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# run local (prepare a container docker with postgres db. See in src/tests/setup/docker-compose.yml)
$ pnpm run start

# Build app on local
$ pnpm run build
```

## Tests and before commit

```bash
# unit tests
$ pnpm run test

# integration tests (run docker desckop before run integrations tests and assert than app does not run)
$ pnpm run test:int

# All tests (run docker desckop before run all tests)
$ pnpm run test:all

# before commit (for linter and format file)
$ pnpm run lf
or
$ pnpm run fl
```

## Stay in touch

- Author - [Valentin Hénique](https://www.linkedin.com/in/valentin-henique-2236a6178/)

## License

TODO
