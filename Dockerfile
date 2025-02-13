# Use a imagem base do Node.js
FROM node:18-alpine

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Copie os arquivos package.json e package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install --omit=dev

# Copie todo o código do projeto para o contêiner
COPY . .

# Gere o cliente Prisma com o caminho absoluto
RUN npx prisma generate --schema=/app/src/modules/global/db/prisma/schema.prisma

# Compile o projeto
RUN npm run build

# Exponha a porta que a aplicação irá rodar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "dist/src/main.js"]