# Next-API

This is example project for Rockpack.

## MySQL

MySQL + phpmyadmin is available on docker-compose.

```shell
docker-compose up
```

before run tests we need to up MySQL for tests:

```shell
docker-compose -f docker-compose.test.yaml --env-file .env.test up
```
