FROM node:16-slim
RUN apt-get update
RUN apt-get install -y openssl
WORKDIR /home/node
USER node
COPY --chown=node:node package*.json tsconfig.json ./
RUN npm ci
RUN npm audit
COPY --chown=node:node . .
RUN npm run build
CMD [ "node", "build/index.js" ]
