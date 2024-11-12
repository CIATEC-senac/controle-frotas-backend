
# Baixa a imagem alpine do node v21
FROM node:21-alpine

# Caminho da pasta da aplicação
WORKDIR /home/node/app/

# Copiando para o container os arquivos de dependências
COPY package.json package-lock.json ./

# Instalar as dependências
RUN npm i

# Copiando os demais arquivos para o container
COPY . .

CMD ["npm", "run", "start:dev"]