FROM alpine/git as git
WORKDIR /app
RUN git clone https://github.com/midianok/tg-bot-host.git

FROM node:16 as node
WORKDIR /app
COPY --from=git /app/tg-bot-host .
RUN npm install

CMD ["node", "index.js"]