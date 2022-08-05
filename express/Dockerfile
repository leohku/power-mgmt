FROM node:16
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY . .
RUN yarn build
EXPOSE 8080/tcp
ENV NODE_ENV=production
CMD [ "node", "dist/index.js" ]
