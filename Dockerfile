FROM node:16.13.0-alpine
RUN apk add --no-cache python3 make g++

WORKDIR /app
COPY . .

RUN npm ci

ARG REGISTRY_API_DOMAIN

RUN npm run build

EXPOSE 1234

CMD npm start
