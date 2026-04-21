FROM node:20-alpine

WORKDIR /app

# Instalação de dependências
COPY package*.json ./
RUN npm install

# Copia o código
COPY . .

EXPOSE 5173

# O --host é obrigatório para o Docker expor a porta para o Windows
CMD ["npm", "run", "dev", "--", "--host"]