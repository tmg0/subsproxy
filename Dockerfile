FROM node
WORKDIR ~
COPY .output .
EXPOSE 5173
CMD ["node", ".output/server/index.mjs"]
