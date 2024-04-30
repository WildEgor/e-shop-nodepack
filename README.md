# e-shop-nodepack

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Github Test Status](https://github.com/WildEgor/e-shop-nodepack/workflows/testing/badge.svg)](https://github.com/WildEgor/e-shop-nodepack/workflows/testing/badge.svg)
[![codecov](https://codecov.io/gh/WildEgor/e-shop-gopack/branch/main/graph/badge.svg)](https://codecov.io/gh/WildEgor/e-shop-gopack)

Contains shared code for eShop demo

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)

## Installation
```shell
yarn add github.com/WildEgor/e-shop-nodepack --save-exact
```

## Usage
- .docker
  - Dockerfile.proto - proto gen wrapper
- .husky - husky configs
- .github
  - workflows
    - cleanup.yml - run release cleanup
    - release.yml - run semantic release
    - testing.yml - run checks and tests
- prisma
  - schema.prisma - for testing
- proto
  - auth.proto - e-shop-auth proto file
- scripts
  - ci-token.js - script generate .npmrc in ci
- src
  - @types - utility types
  - demo - demo project
  - libs
    - auth - client for e-shop-auth service
    - configurator - module for configs
    - core
      - classes - base classes
      - decorators
      - dtos
      - exceptions
      - filters
      - interceptors
      - pipes
      - utils
    - logger
    - minio
    - mongodb
    - monitoring
      - health - health-checks
      - metrics - prometheus module
    - prisma - prisma orm module
    - rabbit
    - redis

## Contributing

Please, use ```git cz``` (or ```yarn commit```) for commit messages!

```shell
git clone https://github.com/WildEgor/e-shop-nodepack
cd e-shop-nodepack
git checkout -b feature-or-fix-branch
git add .
git cz
git push --set-upstream-to origin/feature-or-fix-branch
```
