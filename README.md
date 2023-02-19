# Cloud-backend

**Deployed project here 👉 https://storeton.nodejs.monster 👈**

**Frontend here 👉 ![here](https://github.com/SanariSan/cloud-front) 👈**

**Old heroku deployment 👉 ![here](https://github.com/SanariSan/cloud-fullstack) 👈**

---

## Table of Contents

- [About](#about)
- [Usage](#usage)

## About <a name = "about"></a>

Backend for cloud storage.
ts, express, typeorm, postgres, docker, gh actions CI/CD

## Getting Started <a name = "getting_started"></a>

Fill in .env for local development

Fill in .env.prod for deploy
+
Fill in following GH_SECRETS for actions:

- DB_USERNAME
- DB_PASSWORD
- CORS_URL
- JWT_SECRET

As for these I have nginx-proxy for ssl on vps
- VIRTUAL_HOST
- LETSENCRYPT_HOST


## Usage <a name = "usage"></a>

```
docker-compose up --build
```