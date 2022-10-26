FROM node:latest

WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig*.json ./

RUN npm cache clear --force && npm install

ENTRYPOINT ["npm", "start"]
