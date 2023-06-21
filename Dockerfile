FROM node
COPY .output /.output
EXPOSE 3000
CMD ["node", "/.output/server/index.mjs"]
