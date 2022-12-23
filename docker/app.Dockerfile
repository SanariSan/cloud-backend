FROM node:16 as modules
WORKDIR /home/node/proj
COPY --chown=root:root package*.json yarn.lock ./
RUN yarn install --pure-lockfile --frozen-lockfile

FROM node:16 as prod_modules
WORKDIR /home/node/proj
COPY --chown=root:root package*.json yarn.lock ./
RUN yarn install --prod --pure-lockfile --frozen-lockfile

FROM node:16 as build
WORKDIR /home/node/proj
COPY --chown=root:root --from=modules /home/node/proj/node_modules ./node_modules
COPY --chown=root:root --from=modules /home/node/proj/package*.json /home/node/proj/yarn.lock ./
COPY --chown=root:root src/ ./src
COPY --chown=root:root tsconfig.json tsconfig-base.json ./
RUN yarn build-linux

FROM node:16 as launch
WORKDIR /home/node/proj
COPY --chown=root:root --from=prod_modules /home/node/proj/node_modules ./node_modules
COPY --chown=root:root --from=prod_modules /home/node/proj/package*.json /home/node/proj/yarn.lock ./
COPY --chown=root:root --from=build /home/node/proj/dist ./dist
COPY --chown=root:root dumb-init_1.2.5_x86_64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

CMD [ \
    "dumb-init", \
    "node", \
    "./node_modules/cross-env/src/bin/cross-env.js", \
    "NODE_ENV=production", \
    "HOST=${HOST}", \
    "PORT=${PORT}", \
    "PORT_FRONT=${PORT_FRONT}", \
    "CORS_URL=${CORS_URL}", \
    "API_VERSION=${API_VERSION}", \
    "LOG_DIRECTORY=${LOG_DIRECTORY}", \
    "STORAGE_DIRECTORY=${STORAGE_DIRECTORY}", \
    "ACCESS_TOKEN_VALID_DAYS=${ACCESS_TOKEN_VALID_DAYS}", \
    "REFRESH_TOKEN_VALID_DAYS=${REFRESH_TOKEN_VALID_DAYS}", \
    "ISSUER=${ISSUER}", \
    "AUDIENCE=${AUDIENCE}", \
    "SECRET=${SECRET}", \
    "DB_HOST=${DB_HOST}", \
    "DB_PORT=${DB_PORT}", \
    "DB_USERNAME=${DB_USERNAME}", \
    "DB_PASSWORD=${DB_PASSWORD}", \
    "DB_DATABASE=${DB_DATABASE}", \
    "DROP_ON_RESTART=${DROP_ON_RESTART}", \
    "CONNECTION_LIFESPAN_SECS=${CONNECTION_LIFESPAN_SECS}", \
    "DEFAULT_STORAGE_SIZE_MB=${DEFAULT_STORAGE_SIZE_MB}", \
    "LIFETIME_DAYS_100_DEFAULT=${LIFETIME_DAYS_100_DEFAULT}", \
    "LIFETIME_DAYS_500_DEFAULT=${LIFETIME_DAYS_500_DEFAULT}", \
    "node", \
    "./dist/app.js" \
    ]