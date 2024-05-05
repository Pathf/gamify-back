<h1 align="center">GAMIFY BACK<h1>

## Description

It is a backend used to execute actions or manage data. This is for my friends and me.

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

## License

<p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="https://github.com/Pathf/gamify-back">Gamify-back</a> by <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://www.linkedin.com/in/valentin-henique-2236a6178/">Valentin Hénique</a> is licensed under <a href="https://creativecommons.org/licenses/by-nc/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">Creative Commons Attribution-NonCommercial 4.0 International<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1" alt=""><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1" alt=""><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1" alt=""></a></p>

