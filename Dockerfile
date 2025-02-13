# Use uma imagem base com Node.js
FROM node:18-alpine AS builder

# Defina o diretório de trabalho no container
WORKDIR /app

# Copie apenas os arquivos necessários para instalar as dependências
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install --omit=dev

# Copie o restante dos arquivos para o container
COPY . .

# Compile o projeto NestJS para JavaScript
RUN npm run build

# Use uma imagem leve para a produção
FROM node:18-alpine AS production

# Defina o diretório de trabalho no container
WORKDIR /app

# Copie as dependências instaladas e os arquivos compilados
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Variável de ambiente para produção
ENV NODE_ENV=production

# Exponha a porta que o NestJS utiliza (geralmente 3000)
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "dist/src/main.js"]