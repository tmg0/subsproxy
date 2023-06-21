FROM node:16.13.1
WORKDIR ~/.output
COPY .output ~
EXPOSE 5173
CMD ["node", ".output/server/index.mjs"]
