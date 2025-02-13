# Use a imagem base do Node.js
FROM node:18-alpine

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Instale o NestJS CLI globalmente
RUN npm install -g @nestjs/cli

# Copie os arquivos package.json e package-lock.json
COPY package*.json ./

# Crie o diretório necessário para o schema.prisma
RUN mkdir -p ./src/modules/global/db/prisma/

# Copie o schema.prisma para o caminho correto
COPY src/modules/global/db/prisma/schema.prisma ./src/modules/global/db/prisma/

# Instale as dependências
RUN npm install

# Copie todo o código do projeto para o contêiner
COPY . .

# Gere o cliente Prisma
RUN npx prisma generate

# Compile o projeto
RUN npm run build

# Exponha a porta que a aplicação irá rodar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "dist/src/main.js"]
