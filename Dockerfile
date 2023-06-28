FROM alpine:latest

RUN apk update && \
    apk add nodejs npm

RUN apk add sqlite sqlite-libs sqlite-dev

COPY .output /.output
COPY prisma/schema.prisma /.output/prisma/schema.prisma

EXPOSE 3000

CMD ["node", "/.output/server/index.mjs"]
