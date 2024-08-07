FROM node:20-alpine
RUN apk add --no-cache python3 make g++

WORKDIR /app
COPY . .

RUN npm ci

ARG REGISTRY_API_DOMAIN
ENV REGISTRY_API_DOMAIN $REGISTRY_API_DOMAIN

RUN npm run build

EXPOSE 1234

CMD npm start
