FROM node:20-alpine

WORKDIR /app

RUN yarn global add @nestjs/cli

COPY package*.json ./

COPY yarn.lock ./

RUN mkdir -p ./src/modules/global/db/prisma/

COPY src/modules/global/db/prisma/schema.prisma ./src/modules/global/db/prisma/

RUN yarn install --immutable --immutable-cache --check-cache

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["sh", "-c", "node dist/src/main.js"]
