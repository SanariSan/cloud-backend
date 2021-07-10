FROM node:latest

COPY ./package.json ./
COPY ./yarn.lock ./
RUN npm install yarn
RUN node ./node_modules/yarn/lib/cli.js install

COPY . .

CMD node ./node_modules/yarn/lib/cli.js start-prod-linux