FROM alpine:3.16

RUN apk update && \
    apk add nodejs npm

RUN apk add sqlite sqlite-libs sqlite-dev

WORKDIR /root

COPY . .
RUN npm i && npm run build

EXPOSE 3000

CMD ["node", "-r", "dotenv/config", "/root/.output/server/index.mjs"]
