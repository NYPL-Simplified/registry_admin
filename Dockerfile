# Build the environment.
FROM node:16.13.0-alpine
RUN apk add --no-cache python3 make g++

WORKDIR /app
COPY . .

RUN npm ci

ARG NODE_ENV
ENV NODE_ENV=qa

RUN if [ "$NODE_ENV" = "production" ]; \
        then REGISTRY_API_DOMAIN=https://libraryregistry.librarysimplified.org/admin npm run build; \
        else REGISTRY_API_DOMAIN=https://qa-libraryregistry.librarysimplified.org/admin npm run build; fi

# FROM node:16-alpine AS runner

EXPOSE 1234

# CMD is the default command when running the docker container.
CMD npm start
