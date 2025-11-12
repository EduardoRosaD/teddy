# Imagem base
FROM node:20

# Diretório de trabalho
WORKDIR /usr/src/app

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm install

# Copiar o restante do código
COPY . .

# Expor a porta usada pelo NestJS
EXPOSE 3000

# Comando padrão
CMD ["npm", "run", "start:dev"]
