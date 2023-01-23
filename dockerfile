FROM node:16-alpine as dependencies

WORKDIR /app

COPY ./package.json ./yarn.lock ./
RUN yarn install

FROM node:16-alpine as builder

WORKDIR /app

COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN yarn build

FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

CMD [ "yarn", "start" ]