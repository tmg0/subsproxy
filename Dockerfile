FROM node
COPY .output /.output
EXPOSE 5173
CMD ["node", "/.output/server/index.mjs"]
