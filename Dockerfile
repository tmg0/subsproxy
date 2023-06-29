FROM alpine:3.16

RUN apk update && \
    apk add nodejs npm

RUN apk add sqlite sqlite-libs sqlite-dev

WORKDIR /src

COPY . .
RUN npm install && npm run build
RUN mv ./.output /.output
RUN mv ./prisma/schema.prisma /.output/prisma/schema.prisma
RUN rm -rf /src

WORKDIR /.output

EXPOSE 3000

CMD ["node", "/.output/server/index.mjs"]
