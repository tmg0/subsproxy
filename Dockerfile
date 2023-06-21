FROM node
COPY .output /.output
COPY prisma /.output/prisma
EXPOSE 3000
CMD ["node", "/.output/server/index.mjs"]
