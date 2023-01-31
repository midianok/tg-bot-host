FROM node:16 as node
WORKDIR /app
COPY . /app
RUN npm install

CMD ["node", "index.js"]